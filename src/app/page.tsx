'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { t, type Language } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import { Modal } from '@/components/Modal';
import type { MindTrace } from '@/types';

export default function Home() {
  const { lang } = useLanguage();
  const [traces, setTraces] = useState<MindTrace[]>([]);
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Modals - initialize from localStorage to prevent flash
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTranslationInfo, setShowTranslationInfo] = useState(false);
  const [featuredId, setFeaturedId] = useState<string | null>(null);
  
  // Translation state
  const [translatedProblems, setTranslatedProblems] = useState<Record<string, string>>({});
  const [isTranslatingList, setIsTranslatingList] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [shownOfflineNote, setShownOfflineNote] = useState(false);

  const doTranslateList = useCallback(async (tracesToTranslate: typeof traces, targetLang: Language) => {
    if (targetLang === 'en' || tracesToTranslate.length === 0) return;
    
    setIsTranslatingList(true);
    try {
      const res = await fetch('/api/translate/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traceIds: tracesToTranslate.map(t => t.id), lang: targetLang }),
      });
      const data = await res.json();
      setApiAvailable(data.apiAvailable);
      
      if (!data.apiAvailable && !shownOfflineNote) {
        setShownOfflineNote(true);
        sessionStorage.setItem('mindtrace-offline-note-shown', 'true');
      }
      
      const newTranslations: Record<string, string> = {};
      Object.entries(data.translations || {}).forEach(([id, trans]) => {
        newTranslations[id] = (trans as { problem: string }).problem;
      });
      setTranslatedProblems(newTranslations);
    } catch {
      // Silently fail
    } finally {
      setIsTranslatingList(false);
    }
  }, [shownOfflineNote]);

  const fetchTraces = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (tag) params.set('tag', tag);
    params.set('page', String(page));
    params.set('locale', lang);
    
    const res = await fetch(`/api/traces?${params}&excludeAlternatives=true`);
    const data = await res.json();
    setTraces(data.traces);
    setTotal(data.total);
    setLoading(false);
    setTranslatedProblems({});
  }, [query, tag, page, lang]);

  // Auto-translate when language changes
  useEffect(() => {
    if (traces.length > 0) {
      setTranslatedProblems({});
      doTranslateList(traces, lang);
    }
  }, [lang, traces, doTranslateList]);

  useEffect(() => {
    fetch('/api/tags').then(r => r.json()).then(setTags);
    fetch('/api/featured').then(r => r.json()).then(d => setFeaturedId(d.id));
    
    // Check if first visit - only show onboarding if never seen before
    // Use a flag to prevent showing on navigation back
    if (!onboardingChecked) {
      const seen = localStorage.getItem('mindtrace-onboarding-seen');
      const sessionSeen = sessionStorage.getItem('mindtrace-onboarding-session');
      
      if (!seen && !sessionSeen) {
        // First time ever - show onboarding
        setShowOnboarding(true);
        localStorage.setItem('mindtrace-onboarding-seen', 'true');
        sessionStorage.setItem('mindtrace-onboarding-session', 'true');
      }
      setOnboardingChecked(true);
    }
    
    // Check if offline note shown this session
    const offlineNoteShown = sessionStorage.getItem('mindtrace-offline-note-shown');
    if (offlineNoteShown) {
      setShownOfflineNote(true);
    }
  }, [onboardingChecked]);

  useEffect(() => {
    const timer = setTimeout(fetchTraces, 400);
    return () => clearTimeout(timer);
  }, [fetchTraces]);

  const translateList = async () => {
    doTranslateList(traces, lang);
  };

  const totalPages = Math.ceil(total / 10);
  const hasNoResults = !loading && traces.length === 0 && query;
  const hasNoTraces = !loading && traces.length === 0 && !query;
  const showTranslateButton = lang !== 'en' && traces.length > 0 && Object.keys(translatedProblems).length === 0;

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

      <div className="space-y-3 mb-6">
        <input
          type="search"
          placeholder={t(lang, 'searchPlaceholder')}
          value={query}
          onChange={e => { setQuery(e.target.value); setPage(1); }}
          className="search-input w-full px-4 py-3 text-lg dark:text-white"
          aria-label={t(lang, 'searchPlaceholder')}
        />
        {tags.length > 0 && (
          <select
            value={tag}
            onChange={e => { setTag(e.target.value); setPage(1); }}
            className="tag-select w-full dark:text-white"
            aria-label={t(lang, 'allTags')}
          >
            <option value="">{t(lang, 'allTags')}</option>
            {tags.map(tg => <option key={tg} value={tg}>{tg}</option>)}
          </select>
        )}
      </div>

      {/* Translate list button */}
      {showTranslateButton && (
        <button
          onClick={translateList}
          disabled={isTranslatingList}
          className="mb-4 px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-neutral-300 disabled:opacity-50"
        >
          {isTranslatingList ? t(lang, 'translating') : t(lang, 'translateList')}
        </button>
      )}
      
      {/* Offline note - shown once per session */}
      {apiAvailable === false && !shownOfflineNote && lang !== 'en' && (
        <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
          {t(lang, 'translationRequiresKey')}
        </p>
      )}

      {loading ? (
        <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">{t(lang, 'loading')}</p>
      ) : hasNoResults ? (
        <div className="text-center py-8">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">{t(lang, 'noResults', { query })}</p>
          <Link
            href={`/new?problem=${encodeURIComponent(query)}`}
            className="inline-flex px-4 py-3 bg-gradient-to-r from-[#4fd1c5] to-[#81e6d9] text-neutral-900 font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-[#4fd1c5]/25"
          >
            {t(lang, 'createFirstTrace')}
          </Link>
        </div>
      ) : hasNoTraces ? (
        <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">{t(lang, 'noTraces')}</p>
      ) : (
        <ul className="trace-list" role="list">
          {traces.map(trace => (
            <li key={trace.id}>
              <Link
                href={`/trace/${trace.id}`}
                className="trace-card flex items-start justify-between gap-4 p-4"
              >
                <p className="text-base font-medium leading-relaxed dark:text-white flex-1 line-clamp-2">
                  {translatedProblems[trace.id] || trace.problem}
                </p>
                <span className="step-badge whitespace-nowrap flex-shrink-0">
                  {trace.steps.length} {trace.steps.length !== 1 ? t(lang, 'steps') : t(lang, 'step')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-6" aria-label="Pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-40 bg-white dark:bg-neutral-900 dark:text-white"
          >
            {t(lang, 'prev')}
          </button>
          <span className="px-4 py-2 dark:text-white">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-40 bg-white dark:bg-neutral-900 dark:text-white"
          >
            {t(lang, 'next')}
          </button>
        </nav>
      )}

      <Footer 
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
        onOpenTranslationInfo={() => setShowTranslationInfo(true)}
      />
    </div>
  );
}
