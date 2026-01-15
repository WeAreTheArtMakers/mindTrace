'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

interface SimilarTrace {
  id: string;
  problem: string;
  steps: string[];
  tags: string[];
  resonateCount: number;
}

export function SimilarTraces({ traceId, problem }: { traceId: string; problem: string }) {
  const { lang } = useLanguage();
  const [similar, setSimilar] = useState<SimilarTrace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/traces/${traceId}/similar`)
      .then(r => r.json())
      .then(data => {
        setSimilar(data.similar || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [traceId]);

  if (loading) return null;
  
  return (
    <div className="mt-10 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      {/* Solve it differently button */}
      <Link
        href={`/new?problem=${encodeURIComponent(problem)}`}
        className="flex items-center justify-center gap-2 w-full py-3 mb-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:border-[#4fd1c5] hover:text-[#4fd1c5] transition-colors"
      >
        <span>✏️</span>
        <span>{t(lang, 'solveItDifferently')}</span>
      </Link>

      {/* Similar traces section */}
      {similar.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2 dark:text-white flex items-center gap-2">
            <span>🔀</span> {t(lang, 'similarThoughts')}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            {t(lang, 'howOthersApproached')}
          </p>
          
          <div className="space-y-3">
            {similar.map((trace) => (
              <Link
                key={trace.id}
                href={`/trace/${trace.id}`}
                className="block p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <p className="text-base font-medium dark:text-white line-clamp-2 mb-2">
                  {trace.problem}
                </p>
                <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                  <span>{trace.steps.length} {trace.steps.length !== 1 ? t(lang, 'steps') : t(lang, 'step')}</span>
                  {trace.resonateCount > 0 && (
                    <span className="flex items-center gap-1">
                      <span>💭</span> {trace.resonateCount}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      
      {similar.length === 0 && (
        <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center">
          {t(lang, 'noSimilarTraces')}
        </p>
      )}
    </div>
  );
}
