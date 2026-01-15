import { NextRequest, NextResponse } from 'next/server';
import { getTrace, getTranslation, saveTranslation } from '@/lib/db';
import { translateTrace } from '@/lib/translate';

export async function POST(request: NextRequest) {
  const { traceId, lang, userChangedLanguage } = await request.json();
  
  if (!traceId || !lang) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  
  // Get original trace
  const trace = await getTrace(traceId);
  if (!trace) {
    return NextResponse.json({ error: 'Trace not found' }, { status: 404 });
  }
  
  // Check if trace's original language matches user's language
  // If trace is in Turkish and user's language is Turkish, no translation needed
  const traceLocale = trace.localeHint || 'en'; // Default to English if not specified
  
  // If trace language matches user language, return original content
  if (traceLocale === lang) {
    return NextResponse.json({
      problem: trace.problem,
      steps: trace.steps,
      tags: trace.tags,
      cached: true,
      available: true,
      skipped: true, // Indicates no translation was needed
      reason: 'same_language',
    });
  }
  
  // If user didn't explicitly change language and trace is not in English,
  // and user's browser language matches trace language, skip translation
  if (!userChangedLanguage && traceLocale !== 'en') {
    // This case is handled by the client - if browser lang matches trace lang, don't call API
  }
  
  // Check cache first
  const cached = await getTranslation(traceId, lang);
  if (cached) {
    return NextResponse.json({
      problem: cached.problem,
      steps: cached.steps,
      tags: cached.tags,
      cached: true,
      available: true,
    });
  }
  
  // Translate using available provider
  const { result, available, provider } = await translateTrace(
    { problem: trace.problem, steps: trace.steps, tags: trace.tags },
    lang
  );
  
  if (!available || !result) {
    return NextResponse.json({ available: false, reason: 'no_provider' });
  }
  
  // Cache the translation
  await saveTranslation(traceId, lang, result.problem, result.steps, result.tags);
  
  return NextResponse.json({
    problem: result.problem,
    steps: result.steps,
    tags: result.tags,
    cached: false,
    available: true,
    provider,
  });
}
