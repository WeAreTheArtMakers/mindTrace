'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import { Modal } from '@/components/Modal';
import type { MindTrace } from '@/types';

export default function AlternativesPage() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const problem = searchParams.get('problem') || '';
  
  const [traces, setTraces] = useState<(MindTrace & { resonateCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTranslationInfo, setShowTranslationInfo] = useState(false);
  const [featuredId, setFeaturedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/featured').then(r => r.json()).then(d => setFeaturedId(d.id));
  }, []);

  const fetchAlternatives = useCallback(async () => {
    if (!problem) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/alternatives?problem=${encodeURIComponent(problem)}`);
      const data = await res.json();
      setTraces(data.traces || []);
    } catch (error) {
      console.error('Error fetching alternatives:', error);
    } finally {
      setLoading(false);
    }
  }, [problem]);

  useEffect(() => {
    fetchAlternatives();
  }, [fetchAlternatives]);

  return (
    <div>
      <OnboardingModal 
        open={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
        featuredId={featuredId}
      />
      
      <Modal open={showPrivacy} onClose={() => setShowPrivacy(false)} title={t(lang, 'privacyTitle')}>
        <p>{t(lang, 'privacyText')}</p>
      </Modal>
      
      <Modal open={showTranslationInfo} onClose={() => setShowTranslationInfo(false)} title={t(lang, 'translationTitle')}>
        <p>{t(lang, 'translationText')}</p>
      </Modal>

      <Header />

      <div className="mb-6">
        <Link href="/" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 inline-link">
          {t(lang, 'back')}
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2 dark:text-white">Alternative Solutions</h1>
        <p className="text-base dark:text-neutral-300">{problem}</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          {traces.length} {traces.length === 1 ? 'person' : 'people'} solved this differently
        </p>
      </div>

      {loading ? (
        <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">{t(lang, 'loading')}</p>
      ) : traces.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">No alternative solutions yet</p>
          <Link
            href={`/new?problem=${encodeURIComponent(problem)}`}
            className="inline-flex px-4 py-3 bg-gradient-to-r from-[#4fd1c5] to-[#81e6d9] text-neutral-900 font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-[#4fd1c5]/25"
          >
            {t(lang, 'createFirstTrace')}
          </Link>
        </div>
      ) : (
        <ul className="trace-list" role="list">
          {traces.map((trace) => (
            <li key={trace.id}>
              <Link
                href={`/trace/${trace.id}`}
                className="trace-card flex flex-col gap-3 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium dark:text-white mb-2">
                      {trace.steps.length} {trace.steps.length === 1 ? 'step' : 'steps'}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
                      {trace.steps[0]}
                    </p>
                  </div>
                  {trace.resonateCount > 0 && (
                    <span className="step-badge whitespace-nowrap flex-shrink-0">
                      💭 {trace.resonateCount}
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-400 dark:text-neutral-500">
                  {new Date(trace.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'short', day: 'numeric' 
                  })}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Footer 
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
        onOpenTranslationInfo={() => setShowTranslationInfo(true)}
      />
    </div>
  );
}
