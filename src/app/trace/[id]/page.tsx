import { notFound } from 'next/navigation';
import { getTrace, getFirstTraceId } from '@/lib/db';
import { TraceView } from './TraceView';

export default async function TracePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trace = await getTrace(id);
  const featuredId = await getFirstTraceId();
  
  if (!trace) notFound();

  return <TraceView trace={trace} featuredId={featuredId} />;
}
