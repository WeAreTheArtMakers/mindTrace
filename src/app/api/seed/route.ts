import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { getAllSeeds } from '@/lib/seed';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function POST() {
  try {
    // Create tables
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

    // Check current count
    const result = await db.execute('SELECT COUNT(*) as count FROM traces');
    const existingCount = Number(result.rows[0]?.count || 0);
    
    if (existingCount > 0) {
      return NextResponse.json({ 
        message: 'Database already has data', 
        count: existingCount 
      });
    }

    // Insert seeds
    const seeds = getAllSeeds();
    const now = new Date();
    let inserted = 0;
    
    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      try {
        await db.execute({
          sql: `INSERT OR IGNORE INTO traces (id, seedId, problem, steps, tags, localeHint, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
        inserted++;
      } catch (e) {
        console.error(`Failed to insert seed ${seed.seedId}:`, e);
      }
    }
    
    return NextResponse.json({ 
      message: 'Seeding complete', 
      inserted,
      total: seeds.length 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await db.execute('SELECT COUNT(*) as count FROM traces');
    const count = Number(result.rows[0]?.count || 0);
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
