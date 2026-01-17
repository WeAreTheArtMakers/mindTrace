import { createClient } from '@libsql/client';
import type { MindTrace, CreateTraceInput, TraceTranslation } from '@/types';
import { getAllSeeds } from './seed';

// Turso client - works on Netlify serverless
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let initialized = false;

async function initDB() {
  if (initialized) return;
  
  try {
    // Create tables one by one (batch can be problematic)
    await db.execute(`CREATE TABLE IF NOT EXISTS traces (
      id TEXT PRIMARY KEY,
      seedId TEXT,
      problem TEXT NOT NULL,
      steps TEXT NOT NULL,
      tags TEXT NOT NULL,
      localeHint TEXT,
      createdAt TEXT NOT NULL
    )`);
    
    await db.execute(`CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      traceId TEXT NOT NULL,
      lang TEXT NOT NULL,
      problem TEXT NOT NULL,
      steps TEXT NOT NULL,
      tags TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      UNIQUE(traceId, lang)
    )`);
    
    await db.execute(`CREATE TABLE IF NOT EXISTS resonates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      traceId TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )`);
    
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_traces_seedId ON traces(seedId)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_translations_traceId_lang ON translations(traceId, lang)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_resonates_traceId ON resonates(traceId)`);
    
    // Seed data if empty
    const result = await db.execute('SELECT COUNT(*) as count FROM traces');
    const count = Number(result.rows[0]?.count || 0);
    
    if (count === 0) {
      const seeds = getAllSeeds();
      const now = new Date();
      
      for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        await db.execute({
          sql: `INSERT INTO traces (id, seedId, problem, steps, tags, localeHint, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            `seed-${seed.seedId}`,
            seed.seedId,
            seed.problem,
            JSON.stringify(seed.steps),
            JSON.stringify(seed.tags),
            seed.localeHint || null,
            new Date(now.getTime() - i * 3600000).toISOString(),
          ],
        });
      }
    }
    
    initialized = true;
  } catch (error) {
    console.error('DB init error:', error);
    throw error;
  }
}

export async function createTrace(input: CreateTraceInput): Promise<MindTrace> {
  await initDB();
  
  const trace: MindTrace = {
    id: `trace-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    problem: input.problem,
    steps: input.steps,
    tags: input.tags,
    createdAt: new Date().toISOString(),
  };
  
  await db.execute({
    sql: `INSERT INTO traces (id, problem, steps, tags, createdAt) VALUES (?, ?, ?, ?, ?)`,
    args: [trace.id, trace.problem, JSON.stringify(trace.steps), JSON.stringify(trace.tags), trace.createdAt],
  });
  
  return trace;
}

export async function getTrace(id: string): Promise<(MindTrace & { localeHint?: string }) | null> {
  await initDB();
  
  const result = await db.execute({
    sql: 'SELECT id, problem, steps, tags, localeHint, createdAt FROM traces WHERE id = ?',
    args: [id],
  });
  
  const row = result.rows[0];
  if (!row) return null;
  
  return {
    id: String(row.id),
    problem: String(row.problem),
    steps: JSON.parse(String(row.steps)),
    tags: JSON.parse(String(row.tags)),
    localeHint: row.localeHint ? String(row.localeHint) : undefined,
    createdAt: String(row.createdAt),
  };
}


export async function searchTraces(
  query?: string,
  tag?: string,
  page = 1,
  limit = 10,
  locale?: string
): Promise<{ traces: MindTrace[]; total: number }> {
  await initDB();
  
  let sql = 'SELECT id, seedId, problem, steps, tags, localeHint, createdAt FROM traces WHERE 1=1';
  const args: (string | number)[] = [];
  
  if (query) {
    sql += ' AND LOWER(problem) LIKE ?';
    args.push(`%${query.toLowerCase()}%`);
  }
  
  if (tag) {
    sql += ' AND tags LIKE ?';
    args.push(`%"${tag}"%`);
  }
  
  // Count total
  const countResult = await db.execute({
    sql: sql.replace('SELECT id, seedId, problem, steps, tags, localeHint, createdAt', 'SELECT COUNT(*) as count'),
    args,
  });
  const total = Number(countResult.rows[0]?.count || 0);
  
  // Sort: user-created first, then locale match for seeds, then by date
  if (locale && locale !== 'en') {
    sql += ` ORDER BY 
      CASE WHEN seedId IS NULL THEN 0 ELSE 1 END,
      CASE WHEN seedId IS NOT NULL AND localeHint = ? THEN 0 ELSE 1 END,
      createdAt DESC`;
    args.push(locale);
  } else {
    sql += ' ORDER BY CASE WHEN seedId IS NULL THEN 0 ELSE 1 END, createdAt DESC';
  }
  
  sql += ' LIMIT ? OFFSET ?';
  args.push(limit, (page - 1) * limit);
  
  const result = await db.execute({ sql, args });
  
  const traces: MindTrace[] = result.rows.map(row => ({
    id: String(row.id),
    problem: String(row.problem),
    steps: JSON.parse(String(row.steps)),
    tags: JSON.parse(String(row.tags)),
    createdAt: String(row.createdAt),
  }));
  
  return { traces, total };
}

export async function getAllTags(): Promise<string[]> {
  await initDB();
  
  const result = await db.execute('SELECT tags FROM traces');
  const tagSet = new Set<string>();
  
  result.rows.forEach(row => {
    const tags = JSON.parse(String(row.tags)) as string[];
    tags.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

export async function getTranslation(traceId: string, lang: string): Promise<TraceTranslation | null> {
  await initDB();
  
  const result = await db.execute({
    sql: 'SELECT traceId, lang, problem, steps, tags, createdAt FROM translations WHERE traceId = ? AND lang = ?',
    args: [traceId, lang],
  });
  
  const row = result.rows[0];
  if (!row) return null;
  
  return {
    traceId: String(row.traceId),
    lang: String(row.lang),
    problem: String(row.problem),
    steps: JSON.parse(String(row.steps)),
    tags: JSON.parse(String(row.tags)),
    createdAt: String(row.createdAt),
  };
}

export async function saveTranslation(
  traceId: string,
  lang: string,
  problem: string,
  steps: string[],
  tags: string[]
): Promise<TraceTranslation> {
  await initDB();
  
  const translation: TraceTranslation = {
    traceId,
    lang,
    problem,
    steps,
    tags,
    createdAt: new Date().toISOString(),
  };
  
  await db.execute({
    sql: `INSERT OR REPLACE INTO translations (traceId, lang, problem, steps, tags, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [traceId, lang, problem, JSON.stringify(steps), JSON.stringify(tags), translation.createdAt],
  });
  
  return translation;
}

export async function getFirstTraceId(): Promise<string | null> {
  await initDB();
  
  const result = await db.execute('SELECT id FROM traces ORDER BY createdAt DESC LIMIT 1');
  return result.rows[0] ? String(result.rows[0].id) : null;
}

export async function getTracesByIds(ids: string[]): Promise<MindTrace[]> {
  await initDB();
  if (ids.length === 0) return [];
  
  const placeholders = ids.map(() => '?').join(',');
  const result = await db.execute({
    sql: `SELECT id, problem, steps, tags, createdAt FROM traces WHERE id IN (${placeholders})`,
    args: ids,
  });
  
  return result.rows.map(row => ({
    id: String(row.id),
    problem: String(row.problem),
    steps: JSON.parse(String(row.steps)),
    tags: JSON.parse(String(row.tags)),
    createdAt: String(row.createdAt),
  }));
}

export async function getTranslationsByIds(traceIds: string[], lang: string): Promise<Map<string, TraceTranslation>> {
  await initDB();
  if (traceIds.length === 0) return new Map();
  
  const placeholders = traceIds.map(() => '?').join(',');
  const result = await db.execute({
    sql: `SELECT traceId, lang, problem, steps, tags, createdAt FROM translations WHERE traceId IN (${placeholders}) AND lang = ?`,
    args: [...traceIds, lang],
  });
  
  const map = new Map<string, TraceTranslation>();
  result.rows.forEach(row => {
    map.set(String(row.traceId), {
      traceId: String(row.traceId),
      lang: String(row.lang),
      problem: String(row.problem),
      steps: JSON.parse(String(row.steps)),
      tags: JSON.parse(String(row.tags)),
      createdAt: String(row.createdAt),
    });
  });
  
  return map;
}

export async function getResonateCount(traceId: string): Promise<number> {
  await initDB();
  
  const result = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM resonates WHERE traceId = ?',
    args: [traceId],
  });
  
  return Number(result.rows[0]?.count || 0);
}

export async function addResonate(traceId: string): Promise<number> {
  await initDB();
  
  await db.execute({
    sql: 'INSERT INTO resonates (traceId, createdAt) VALUES (?, ?)',
    args: [traceId, new Date().toISOString()],
  });
  
  return getResonateCount(traceId);
}

export async function getAllTraces(): Promise<MindTrace[]> {
  await initDB();
  
  const result = await db.execute('SELECT id, problem, steps, tags, createdAt FROM traces ORDER BY createdAt DESC');
  
  return result.rows.map(row => ({
    id: String(row.id),
    problem: String(row.problem),
    steps: JSON.parse(String(row.steps)),
    tags: JSON.parse(String(row.tags)),
    createdAt: String(row.createdAt),
  }));
}

export async function getSimilarTraces(traceId: string, tags: string[], limit = 3): Promise<MindTrace[]> {
  await initDB();
  
  if (tags.length === 0) return [];
  
  // Find traces with overlapping tags, excluding current trace
  const result = await db.execute({
    sql: `SELECT id, problem, steps, tags, createdAt FROM traces WHERE id != ? ORDER BY createdAt DESC`,
    args: [traceId],
  });
  
  // Score traces by tag overlap
  const scored = result.rows.map(row => {
    const traceTags = JSON.parse(String(row.tags)) as string[];
    const overlap = tags.filter(t => traceTags.some(tt => tt.toLowerCase() === t.toLowerCase())).length;
    return {
      trace: {
        id: String(row.id),
        problem: String(row.problem),
        steps: JSON.parse(String(row.steps)),
        tags: traceTags,
        createdAt: String(row.createdAt),
      },
      score: overlap,
    };
  });
  
  // Return top matches with at least 1 tag overlap
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.trace);
}

export async function getAlternativeSolutions(traceId: string, problem: string, limit = 5): Promise<MindTrace[]> {
  await initDB();
  
  // Find traces with similar problem text, excluding current trace
  const result = await db.execute({
    sql: `SELECT id, problem, steps, tags, createdAt FROM traces WHERE id != ? ORDER BY createdAt DESC`,
    args: [traceId],
  });
  
  // Score traces by problem text similarity (simple word matching)
  const problemWords = problem.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  const scored = result.rows.map(row => {
    const traceProblem = String(row.problem).toLowerCase();
    const traceWords = traceProblem.split(/\s+/).filter(w => w.length > 3);
    
    // Count matching words
    const matches = problemWords.filter(w => traceWords.some(tw => tw.includes(w) || w.includes(tw))).length;
    
    return {
      trace: {
        id: String(row.id),
        problem: String(row.problem),
        steps: JSON.parse(String(row.steps)),
        tags: JSON.parse(String(row.tags)),
        createdAt: String(row.createdAt),
      },
      score: matches,
    };
  });
  
  // Return top matches with at least 1 word match
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.trace.createdAt).getTime() - new Date(a.trace.createdAt).getTime())
    .slice(0, limit)
    .map(s => s.trace);
}
