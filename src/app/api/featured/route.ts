import { NextResponse } from 'next/server';
import { getFirstTraceId } from '@/lib/db';

export async function GET() {
  try {
    const id = await getFirstTraceId();
    return NextResponse.json({ id });
  } catch (error) {
    console.error('GET /api/featured error:', error);
    return NextResponse.json({ error: String(error), id: null }, { status: 500 });
  }
}
