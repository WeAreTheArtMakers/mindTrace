import { NextRequest, NextResponse } from 'next/server';
import { getTrace, getSimilarTraces, getAlternativeSolutions, getResonateCount } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trace = await getTrace(id);
    
    if (!trace) {
      return NextResponse.json({ similar: [], alternativeCount: 0 });
    }
    
    const similar = await getSimilarTraces(id, trace.tags, 3);
    const alternatives = await getAlternativeSolutions(id, trace.problem, 100); // Get count
    
    // Add resonate counts to similar
    const withCountsSimilar = await Promise.all(
      similar.map(async (t) => ({
        ...t,
        resonateCount: await getResonateCount(t.id),
      }))
    );
    
    return NextResponse.json({ 
      similar: withCountsSimilar,
      alternativeCount: alternatives.length,
      problem: trace.problem
    });
  } catch (error) {
    console.error('Similar traces error:', error);
    return NextResponse.json({ similar: [], alternativeCount: 0 });
  }
}
