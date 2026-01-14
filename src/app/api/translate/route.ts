import { NextRequest, NextResponse } from 'next/server';
import { getTrace, getTranslation, saveTranslation } from '@/lib/db';
import { translateTrace } from '@/lib/translate';

export async function POST(request: NextRequest) {
  const { traceId, lang } = await request.json();
  
  if (!traceId || !lang) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
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
  
  // Get original trace
  const trace = await getTrace(traceId);
  if (!trace) {
    return NextResponse.json({ error: 'Trace not found' }, { status: 404 });
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
