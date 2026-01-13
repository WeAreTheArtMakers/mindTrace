import fs from 'fs';
import path from 'path';
import type { MindTrace, CreateTraceInput, TraceTranslation } from '@/types';
import { getAllSeeds } from './seed';

// For Netlify: Use JSON file storage instead of SQLite
// Data persists in /tmp during function execution but resets between deploys
// For production, consider using a cloud database like Turso, PlanetScale, or Supabase

interface DBData {
  traces: (MindTrace & { seedId?: string; localeHint?: string })[];
  translations: TraceTranslation[];
  resonates: { traceId: string; createdAt: string }[];
}

const DATA_FILE = process.env.NODE_ENV === 'production' 
  ? '/tmp/mindtrace-data.json'
  : path.join(process.cwd(), 'mindtrace-data.json');

function loadData(): DBData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    // File doesn't exist or is corrupted
  }
  
  // Initialize with seed data
  const seeds = getAllSeeds();
  const now = new Date();
  const traces = seeds.map((seed, i) => ({
    id: `seed-${seed.seedId}`,
    seedId: seed.seedId,
    problem: seed.problem,
    steps: seed.steps,
    tags: seed.tags,
    localeHint: seed.localeHint,
    createdAt: new Date(now.getTime() - i * 3600000).toISOString(),
  }));
  
  const data: DBData = { traces, translations: [], resonates: [] };
  saveData(data);
  return data;
}

function saveData(data: DBData): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

export function createTrace(input: CreateTraceInput): MindTrace {
  const data = loadData();
  const trace: MindTrace = {
    id: `trace-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    problem: input.problem,
    steps: input.steps,
    tags: input.tags,
    createdAt: new Date().toISOString(),
  };
  
  data.traces.unshift(trace);
  saveData(data);
  return trace;
}

export function getTrace(id: string): MindTrace | null {
  const data = loadData();
  const trace = data.traces.find(t => t.id === id);
  if (!trace) return null;
  return {
    id: trace.id,
    problem: trace.problem,
    steps: trace.steps,
    tags: trace.tags,
    createdAt: trace.createdAt,
  };
}

export function searchTraces(query?: string, tag?: string, page = 1, limit = 10, locale?: string): { traces: MindTrace[]; total: number } {
  const data = loadData();
  let filtered = data.traces;
  
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(t => t.problem.toLowerCase().includes(q));
  }
  
  if (tag) {
    filtered = filtered.filter(t => t.tags.includes(tag));
  }
  
  // Sort by locale match first, then by date
  if (locale && locale !== 'en') {
    filtered.sort((a, b) => {
      const aMatch = a.localeHint === locale ? 0 : 1;
      const bMatch = b.localeHint === locale ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } else {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  const total = filtered.length;
  const start = (page - 1) * limit;
  const traces = filtered.slice(start, start + limit).map(t => ({
    id: t.id,
    problem: t.problem,
    steps: t.steps,
    tags: t.tags,
    createdAt: t.createdAt,
  }));
  
  return { traces, total };
}

export function getAllTags(): string[] {
  const data = loadData();
  const tagSet = new Set<string>();
  data.traces.forEach(t => t.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export function getTranslation(traceId: string, lang: string): TraceTranslation | null {
  const data = loadData();
  return data.translations.find(t => t.traceId === traceId && t.lang === lang) || null;
}

export function saveTranslation(traceId: string, lang: string, problem: string, steps: string[], tags: string[]): TraceTranslation {
  const data = loadData();
  const existing = data.translations.findIndex(t => t.traceId === traceId && t.lang === lang);
  
  const translation: TraceTranslation = {
    traceId,
    lang,
    problem,
    steps,
    tags,
    createdAt: new Date().toISOString(),
  };
  
  if (existing >= 0) {
    data.translations[existing] = translation;
  } else {
    data.translations.push(translation);
  }
  
  saveData(data);
  return translation;
}

export function getFirstTraceId(): string | null {
  const data = loadData();
  return data.traces[0]?.id || null;
}

export function getTracesByIds(ids: string[]): MindTrace[] {
  const data = loadData();
  return data.traces
    .filter(t => ids.includes(t.id))
    .map(t => ({
      id: t.id,
      problem: t.problem,
      steps: t.steps,
      tags: t.tags,
      createdAt: t.createdAt,
    }));
}

export function getTranslationsByIds(traceIds: string[], lang: string): Map<string, TraceTranslation> {
  const data = loadData();
  const map = new Map<string, TraceTranslation>();
  data.translations
    .filter(t => traceIds.includes(t.traceId) && t.lang === lang)
    .forEach(t => map.set(t.traceId, t));
  return map;
}

export function getResonateCount(traceId: string): number {
  const data = loadData();
  return data.resonates.filter(r => r.traceId === traceId).length;
}

export function addResonate(traceId: string): number {
  const data = loadData();
  data.resonates.push({ traceId, createdAt: new Date().toISOString() });
  saveData(data);
  return data.resonates.filter(r => r.traceId === traceId).length;
}
