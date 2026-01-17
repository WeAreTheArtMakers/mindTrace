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
      return NextResponse.json({ similar: [], alternatives: [] });
    }
    
    const similar = await getSimilarTraces(id, trace.tags, 3);
    const alternatives = await getAlternativeSolutions(id, trace.problem, 5);
    
    // Add resonate counts
    const withCountsSimilar = await Promise.all(
      similar.map(async (t) => ({
        ...t,
        resonateCount: await getResonateCount(t.id),
      }))
    );
    
    const withCountsAlternatives = await Promise.all(
      alternatives.map(async (t) => ({
        ...t,
        resonateCount: await getResonateCount(t.id),
      }))
    );
    
    return NextResponse.json({ 
      similar: withCountsSimilar,
      alternatives: withCountsAlternatives 
    });
  } catch (error) {
    console.error('Similar traces error:', error);
    return NextResponse.json({ similar: [], alternatives: [] });
  }
}
