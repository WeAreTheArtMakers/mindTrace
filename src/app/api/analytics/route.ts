import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize analytics table
async function initAnalytics() {
  await db.execute(`CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    properties TEXT,
    path TEXT,
    referrer TEXT,
    userAgent TEXT,
    createdAt TEXT NOT NULL
  )`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_analytics_name ON analytics(name)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_analytics_createdAt ON analytics(createdAt)`);
}

export async function POST(request: NextRequest) {
  try {
    const { name, properties, path, referrer, userAgent } = await request.json();
    
    await initAnalytics();
    
    await db.execute({
      sql: `INSERT INTO analytics (name, properties, path, referrer, userAgent, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        name,
        properties ? JSON.stringify(properties) : null,
        path || null,
        referrer || null,
        userAgent || null,
        new Date().toISOString(),
      ],
    });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// GET endpoint for admin - protected by secret
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // Require ANALYTICS_SECRET env var for access
    if (!process.env.ANALYTICS_SECRET || secret !== process.env.ANALYTICS_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await initAnalytics();
    
    // Get summary stats
    const totalResult = await db.execute('SELECT COUNT(*) as total FROM analytics');
    const total = Number(totalResult.rows[0]?.total || 0);
    
    // Event counts by name
    const eventCountsResult = await db.execute(`
      SELECT name, COUNT(*) as count 
      FROM analytics 
      GROUP BY name 
      ORDER BY count DESC
    `);
    
    // Page view counts
    const pageViewsResult = await db.execute(`
      SELECT path, COUNT(*) as count 
      FROM analytics 
      WHERE name = 'page_view' 
      GROUP BY path 
      ORDER BY count DESC 
      LIMIT 20
    `);
    
    // Today's events
    const today = new Date().toISOString().split('T')[0];
    const todayResult = await db.execute({
      sql: `SELECT COUNT(*) as count FROM analytics WHERE createdAt >= ?`,
      args: [`${today}T00:00:00.000Z`],
    });
    const todayEvents = Number(todayResult.rows[0]?.count || 0);
    
    // Last 7 days trend
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const trendResult = await db.execute({
      sql: `SELECT DATE(createdAt) as date, COUNT(*) as count 
            FROM analytics 
            WHERE createdAt >= ? 
            GROUP BY DATE(createdAt) 
            ORDER BY date`,
      args: [weekAgo],
    });
    
    // Recent events (last 50)
    const recentResult = await db.execute(`
      SELECT name, path, properties, createdAt 
      FROM analytics 
      ORDER BY createdAt DESC 
      LIMIT 50
    `);
    
    // Device stats
    const deviceStats = await db.execute(`
      SELECT 
        json_extract(properties, '$.device') as device,
        COUNT(*) as count
      FROM analytics 
      WHERE properties IS NOT NULL AND json_extract(properties, '$.device') IS NOT NULL
      GROUP BY device
    `);
    
    // Browser stats
    const browserStats = await db.execute(`
      SELECT 
        json_extract(properties, '$.browser') as browser,
        COUNT(*) as count
      FROM analytics 
      WHERE properties IS NOT NULL AND json_extract(properties, '$.browser') IS NOT NULL
      GROUP BY browser
    `);
    
    // Average time on page (from page_leave events)
    const avgTimeResult = await db.execute(`
      SELECT 
        path,
        AVG(CAST(json_extract(properties, '$.duration') AS INTEGER)) as avgDuration,
        COUNT(*) as visits
      FROM analytics 
      WHERE name = 'page_leave' AND json_extract(properties, '$.duration') IS NOT NULL
      GROUP BY path
      ORDER BY visits DESC
      LIMIT 10
    `);
    
    // Language stats
    const langStats = await db.execute(`
      SELECT 
        json_extract(properties, '$.language') as lang,
        COUNT(*) as count
      FROM analytics 
      WHERE properties IS NOT NULL AND json_extract(properties, '$.language') IS NOT NULL
      GROUP BY lang
      ORDER BY count DESC
      LIMIT 10
    `);
    
    return NextResponse.json({
      total,
      todayEvents,
      eventCounts: eventCountsResult.rows.map(r => ({ name: r.name, count: Number(r.count) })),
      topPages: pageViewsResult.rows.map(r => ({ path: r.path, count: Number(r.count) })),
      weeklyTrend: trendResult.rows.map(r => ({ date: r.date, count: Number(r.count) })),
      recentEvents: recentResult.rows.map(r => ({ 
        name: r.name, 
        path: r.path, 
        time: r.createdAt,
        properties: r.properties ? JSON.parse(String(r.properties)) : null
      })),
      devices: deviceStats.rows.map(r => ({ device: r.device, count: Number(r.count) })),
      browsers: browserStats.rows.map(r => ({ browser: r.browser, count: Number(r.count) })),
      avgTimeOnPage: avgTimeResult.rows.map(r => ({ 
        path: r.path, 
        avgDuration: Math.round(Number(r.avgDuration)), 
        visits: Number(r.visits) 
      })),
      languages: langStats.rows.map(r => ({ lang: r.lang, count: Number(r.count) })),
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
