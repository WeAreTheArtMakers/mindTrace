'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { useTraceTranslation } from '@/hooks/useTranslation';
import { Footer } from '@/components/Footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import { Modal } from '@/components/Modal';
import { ShareButtons } from '@/components/ShareButtons';
import { ResonateButton } from '@/components/ResonateButton';
import { SimilarTraces } from '@/components/SimilarTraces';
import type { MindTrace } from '@/types';

export function TraceView({ trace, featuredId }: { trace: MindTrace; featuredId: string | null }) {
  const { lang } = useLanguage();
  const { problem, steps, tags, isTranslating, showOriginalNote } = useTraceTranslation(trace);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTranslationInfo, setShowTranslationInfo] = useState(false);

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

      <header className="mb-6">
        <Link href="/" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 inline-link" aria-label={t(lang, 'back')}>
          {t(lang, 'back')}
        </Link>
      </header>

      <article className="animate-fade-in">
        {isTranslating && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{t(lang, 'translating')}</p>
        )}
        {showOriginalNote && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mb-2">{t(lang, 'translationUnavailable')}</p>
        )}
        
        <h1 className="text-2xl font-semibold mb-6 dark:text-white">{problem}</h1>
        
        <section aria-label={t(lang, 'howIThought')} className="trace-steps-container">
          <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4">{t(lang, 'howIThought')}</h2>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="trace-step-card flex gap-4 p-4">
                <span className="step-number">{i + 1}</span>
                <span className="text-base dark:text-neutral-200 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-400 dark:text-neutral-500">
              {new Date(trace.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
            <ResonateButton traceId={trace.id} />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 5).map(tg => (
                <span key={tg} className="tag-pill">{tg}</span>
              ))}
            </div>
          )}
        </div>

        <ShareButtons 
          traceId={trace.id} 
          problem={problem} 
          stepsCount={steps.length} 
        />

        <SimilarTraces traceId={trace.id} problem={problem} />
      </article>

      <Footer 
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
        onOpenTranslationInfo={() => setShowTranslationInfo(true)}
      />
    </div>
  );
}
