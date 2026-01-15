import { NextRequest, NextResponse } from 'next/server';
import { getTrace, getSimilarTraces, getResonateCount } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trace = await getTrace(id);
    
    if (!trace) {
      return NextResponse.json({ similar: [] });
    }
    
    const similar = await getSimilarTraces(id, trace.tags, 3);
    
    // Add resonate counts
    const withCounts = await Promise.all(
      similar.map(async (t) => ({
        ...t,
        resonateCount: await getResonateCount(t.id),
      }))
    );
    
    return NextResponse.json({ similar: withCounts });
  } catch (error) {
    console.error('Similar traces error:', error);
    return NextResponse.json({ similar: [] });
  }
}
