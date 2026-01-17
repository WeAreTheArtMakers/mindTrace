import { NextRequest, NextResponse } from 'next/server';
import { getTracesByIds, getTranslationsByIds, saveTranslation } from '@/lib/db';
import { translateBatch } from '@/lib/translate';

export async function POST(request: NextRequest) {
  const { traceIds, lang } = await request.json();
  
  if (!Array.isArray(traceIds) || !lang) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  
  // Get all traces first to check localeHint
  const allTraces = await getTracesByIds(traceIds);
  
  // Check cache first
  const cachedTranslations = await getTranslationsByIds(traceIds, lang);
  
  // Filter: only use cache if translation exists
  // Always translate if localeHint doesn't match target language
  const missingIds = traceIds.filter(id => {
    if (cachedTranslations.has(id)) {
      // If we have cached translation for this language, use it
      return false;
    }
    // Otherwise, need to translate
    return true;
  });
  
  const results: Record<string, { problem: string; tags: string[]; available: boolean }> = {};
  
  // Add cached translations
  cachedTranslations.forEach((trans, id) => {
    results[id] = { problem: trans.problem, tags: trans.tags, available: true };
  });
  
  // If all have matching cache, return early
  if (missingIds.length === 0) {
    return NextResponse.json({ translations: results, apiAvailable: true });
  }
  
  // Get traces that need translation
  const tracesToTranslate = allTraces.filter(t => missingIds.includes(t.id));
  
  if (tracesToTranslate.length === 0) {
    return NextResponse.json({ translations: results, apiAvailable: true });
  }
  
  // Translate missing ones - problem, steps, and tags
  const toTranslate = tracesToTranslate.map(t => ({
    id: t.id,
    problem: t.problem,
    steps: t.steps,
    tags: t.tags,
  }));
  
  const { translations: newTranslations, available } = await translateBatch(toTranslate, lang);
  
  // Save and add to results
  for (const [id, trans] of Object.entries(newTranslations)) {
    const original = tracesToTranslate.find(t => t.id === id);
    if (original) {
      // Save translated steps
      await saveTranslation(id, lang, trans.problem, trans.steps, trans.tags);
      results[id] = { problem: trans.problem, tags: trans.tags, available: true };
    }
  }
  
  return NextResponse.json({ translations: results, apiAvailable: available });
}
