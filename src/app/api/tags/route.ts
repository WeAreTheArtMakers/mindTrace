import { NextResponse } from 'next/server';
import { getAllTags } from '@/lib/db';

export async function GET() {
  try {
    const tags = await getAllTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('GET /api/tags error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
