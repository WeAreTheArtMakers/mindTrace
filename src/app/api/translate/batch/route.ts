import { NextRequest, NextResponse } from 'next/server';
import { getTracesByIds, getTranslationsByIds, saveTranslation } from '@/lib/db';
import { translateBatch } from '@/lib/translate';

export async function POST(request: NextRequest) {
  const { traceIds, lang } = await request.json();
  
  if (!Array.isArray(traceIds) || !lang) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  
  // Check cache first
  const cachedTranslations = await getTranslationsByIds(traceIds, lang);
  const missingIds = traceIds.filter(id => !cachedTranslations.has(id));
  
  const results: Record<string, { problem: string; tags: string[]; available: boolean }> = {};
  
  // Add cached translations
  cachedTranslations.forEach((trans, id) => {
    results[id] = { problem: trans.problem, tags: trans.tags, available: true };
  });
  
  // If all cached, return early
  if (missingIds.length === 0) {
    return NextResponse.json({ translations: results, apiAvailable: true });
  }
  
  // Get traces that need translation
  const tracesToTranslate = await getTracesByIds(missingIds);
  
  if (tracesToTranslate.length === 0) {
    return NextResponse.json({ translations: results, apiAvailable: true });
  }
  
  // Translate missing ones
  const toTranslate = tracesToTranslate.map(t => ({
    id: t.id,
    problem: t.problem,
    tags: t.tags,
  }));
  
  const { translations: newTranslations, available } = await translateBatch(toTranslate, lang);
  
  // Save and add to results
  for (const [id, trans] of Object.entries(newTranslations)) {
    const original = tracesToTranslate.find(t => t.id === id);
    if (original) {
      // Save with original steps (we only translated problem/tags for list view)
      await saveTranslation(id, lang, trans.problem, original.steps, trans.tags);
      results[id] = { problem: trans.problem, tags: trans.tags, available: true };
    }
  }
  
  return NextResponse.json({ translations: results, apiAvailable: available });
}
