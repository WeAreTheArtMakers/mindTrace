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
  
  const results: Record<string, { problem: string; steps: string[]; tags: string[]; available: boolean }> = {};
  
  // Add cached translations
  cachedTranslations.forEach((trans, id) => {
    results[id] = { problem: trans.problem, steps: trans.steps, tags: trans.tags, available: true };
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
  
  // Translate missing ones - include steps
  const toTranslate = tracesToTranslate.map(t => ({
    id: t.id,
    problem: t.problem,
    steps: t.steps,
    tags: t.tags,
  }));
  
  const { translations: newTranslations, available } = await translateBatchFull(toTranslate, lang);
  
  // Save and add to results
  for (const [id, trans] of Object.entries(newTranslations)) {
    if (trans) {
      await saveTranslation(id, lang, trans.problem, trans.steps, trans.tags);
      results[id] = { problem: trans.problem, steps: trans.steps, tags: trans.tags, available: true };
    }
  }
  
  return NextResponse.json({ translations: results, apiAvailable: available });
}

// New function to translate full content including steps
async function translateBatchFull(
  items: { id: string; problem: string; steps: string[]; tags: string[] }[],
  targetLang: string
): Promise<{ translations: Record<string, { problem: string; steps: string[]; tags: string[] } | null>; available: boolean }> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const libreUrl = process.env.LIBRETRANSLATE_URL;
  const useGoogleFree = process.env.USE_GOOGLE_TRANSLATE !== 'false';
  
  const translations: Record<string, { problem: string; steps: string[]; tags: string[] } | null> = {};
  
  // Try OpenAI batch (most efficient)
  if (openaiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Translate the following JSON array to the target language. Keep structure, translate all text values. Return valid JSON array only.`
            },
            { role: 'user', content: JSON.stringify(items) }
          ],
          temperature: 0.3,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const translated = JSON.parse(data.choices[0]?.message?.content || '[]');
        translated.forEach((item: { id: string; problem: string; steps: string[]; tags: string[] }) => {
          translations[item.id] = { problem: item.problem, steps: item.steps, tags: item.tags };
        });
        return { translations, available: true };
      }
    } catch (error) {
      console.error('OpenAI batch translation failed:', error);
    }
  }
  
  // Fallback: translate one by one using translateTrace
  try {
    const { translateTrace } = await import('@/lib/translate');
    for (const item of items) {
      const { result } = await translateTrace(
        { problem: item.problem, steps: item.steps, tags: item.tags },
        targetLang
      );
      translations[item.id] = result;
    }
    return { translations, available: true };
  } catch (error) {
    console.error('Fallback translation failed:', error);
  }
  
  return { translations, available: false };
}
