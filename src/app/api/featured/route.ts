import { NextResponse } from 'next/server';
import { getFirstTraceId } from '@/lib/db';

export async function GET() {
  const id = await getFirstTraceId();
  return NextResponse.json({ id });
}
