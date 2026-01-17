import { NextRequest, NextResponse } from 'next/server';
import { getAlternativeSolutionsByProblem, getResonateCount } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const problem = searchParams.get('problem');

    if (!problem) {
      return NextResponse.json({ traces: [] });
    }

    const traces = await getAlternativeSolutionsByProblem(problem, 50);

    // Add resonate counts
    const withCounts = await Promise.all(
      traces.map(async (t) => ({
        ...t,
        resonateCount: await getResonateCount(t.id),
      }))
    );

    return NextResponse.json({ traces: withCounts });
  } catch (error) {
    console.error('Alternatives error:', error);
    return NextResponse.json({ traces: [] });
  }
}
