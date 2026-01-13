import { NextRequest, NextResponse } from 'next/server';
import { createTrace, searchTraces } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const locale = searchParams.get('locale') || undefined;
  
  const result = searchTraces(query, tag, page, 10, locale);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (!body.problem?.trim() || !Array.isArray(body.steps) || body.steps.length === 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  
  const trace = createTrace({
    problem: body.problem.trim(),
    steps: body.steps.filter((s: string) => s.trim()),
    tags: Array.isArray(body.tags) ? body.tags : [],
  });
  
  return NextResponse.json(trace, { status: 201 });
}
