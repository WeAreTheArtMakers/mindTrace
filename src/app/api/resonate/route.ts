import { NextRequest, NextResponse } from 'next/server';
import { getResonateCount, addResonate } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const traceId = searchParams.get('traceId');
  
  if (!traceId) {
    return NextResponse.json({ count: 0 });
  }
  
  const count = getResonateCount(traceId);
  return NextResponse.json({ count });
}

export async function POST(request: NextRequest) {
  const { traceId } = await request.json();
  
  if (!traceId) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  
  const count = addResonate(traceId);
  return NextResponse.json({ count });
}
