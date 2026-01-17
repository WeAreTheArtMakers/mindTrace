'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { Footer } from '@/components/Footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import { Modal } from '@/components/Modal';

export default function NewTrace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  
  const [problem, setProblem] = useState('');
  const [steps, setSteps] = useState(['', '']);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTranslationInfo, setShowTranslationInfo] = useState(false);
  const [featuredId, setFeaturedId] = useState<string | null>(null);

  useEffect(() => {
    const prefilled = searchParams.get('problem');
    if (prefilled) setProblem(prefilled);
    fetch('/api/featured').then(r => r.json()).then(d => setFeaturedId(d.id));
  }, [searchParams]);

  const addStep = () => setSteps([...steps, '']);
  const updateStep = (i: number, val: string) => {
    const newSteps = [...steps];
    newSteps[i] = val;
    setSteps(newSteps);
  };
  const removeStep = (i: number) => {
    if (steps.length > 2) setSteps(steps.filter((_, idx) => idx !== i));
  };

  const addTag = () => {
    const tg = tagInput.trim().toLowerCase();
    if (tg && !tags.includes(tg)) {
      setTags([...tags, tg]);
      setTagInput('');
    }
  };
  const removeTag = (tg: string) => setTags(tags.filter(tag => tag !== tg));

  const filledSteps = steps.filter(s => s.trim()).length;
  const isValid = problem.trim().length >= 10 && filledSteps >= 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    setSubmitting(true);
    const res = await fetch('/api/traces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem: problem.trim(),
        steps: steps.filter(s => s.trim()),
        tags,
        localeHint: lang,
      }),
    });
    
    if (res.ok) {
      const trace = await res.json();
      router.push(`/trace/${trace.id}`);
    } else {
      setSubmitting(false);
    }
  };

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

      <header className="flex items-center gap-4 mb-6">
        <Link href="/" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 inline-link" aria-label={t(lang, 'back')}>
          {t(lang, 'back')}
        </Link>
        <h1 className="text-2xl font-semibold dark:text-white">{t(lang, 'newTraceTitle')}</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="problem" className="block text-sm font-medium mb-2 dark:text-neutral-200">
            {t(lang, 'problemLabel')}
          </label>
          <textarea
            id="problem"
            value={problem}
            onChange={e => setProblem(e.target.value)}
            placeholder={t(lang, 'problemPlaceholder')}
            rows={3}
            className="w-full px-4 py-3 text-lg border border-neutral-200 dark:border-neutral-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 bg-white dark:bg-neutral-900 dark:text-white"
            required
          />
          {problem.length > 0 && problem.length < 10 && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">{t(lang, 'problemTooShort')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 dark:text-neutral-200">
            {t(lang, 'stepsLabel')}
          </label>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">{t(lang, 'stepsHint')}</p>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <span className="py-3 text-neutral-400 dark:text-neutral-500 w-6">{i + 1}.</span>
                <input
                  type="text"
                  value={step}
                  onChange={e => updateStep(i, e.target.value)}
                  placeholder={t(lang, 'stepPlaceholder', { n: String(i + 1) })}
                  className="flex-1 px-4 py-3 text-lg border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 bg-white dark:bg-neutral-900 dark:text-white"
                  aria-label={t(lang, 'stepPlaceholder', { n: String(i + 1) })}
                />
                {steps.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="px-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 inline-btn"
                    aria-label={`Remove step ${i + 1}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 inline-btn"
          >
            {t(lang, 'addStep')}
          </button>
          {filledSteps < 2 && steps.some(s => s.trim()) && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">{t(lang, 'needMoreSteps')}</p>
          )}
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2 dark:text-neutral-200">
            {t(lang, 'tagsLabel')}
          </label>
          <div className="flex gap-2">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder={t(lang, 'tagPlaceholder')}
              className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 bg-white dark:bg-neutral-900 dark:text-white"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 bg-white dark:bg-neutral-900 dark:text-white"
            >
              {t(lang, 'addTag')}
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tg => (
                <span key={tg} className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-sm dark:text-neutral-300">
                  {tg}
                  <button type="button" onClick={() => removeTag(tg)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 inline-btn" aria-label={`Remove tag ${tg}`}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="fixed bottom-12 left-0 right-0 p-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
          <div className="max-w-lg mx-auto">
            <button
              type="submit"
              disabled={submitting || !isValid}
              className="w-full py-3 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 text-lg rounded-lg transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t(lang, 'saving') : t(lang, 'saveTrace')}
            </button>
          </div>
        </div>
      </form>

      <Footer 
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
        onOpenTranslationInfo={() => setShowTranslationInfo(true)}
      />
    </div>
  );
}
