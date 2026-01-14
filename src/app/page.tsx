'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
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
  
  // Modals
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTranslationInfo, setShowTranslationInfo] = useState(false);
  const [featuredId, setFeaturedId] = useState<string | null>(null);
  
  // Translation state
  const [translatedProblems, setTranslatedProblems] = useState<Record<string, string>>({});
  const [isTranslatingList, setIsTranslatingList] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [shownOfflineNote, setShownOfflineNote] = useState(false);

  const fetchTraces = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (tag) params.set('tag', tag);
    params.set('page', String(page));
    params.set('locale', lang); // Pass locale for ordering
    
    const res = await fetch(`/api/traces?${params}`);
    const data = await res.json();
    setTraces(data.traces);
    setTotal(data.total);
    setLoading(false);
    setTranslatedProblems({});
  }, [query, tag, page, lang]);

  useEffect(() => {
    fetch('/api/tags').then(r => r.json()).then(setTags);
    fetch('/api/featured').then(r => r.json()).then(d => setFeaturedId(d.id));
    
    // Check if first visit
    const seen = localStorage.getItem('mindtrace-onboarding-seen');
    if (!seen) {
      setShowOnboarding(true);
      localStorage.setItem('mindtrace-onboarding-seen', 'true');
    }
    
    // Check if offline note shown this session
    const offlineNoteShown = sessionStorage.getItem('mindtrace-offline-note-shown');
    if (offlineNoteShown) {
      setShownOfflineNote(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchTraces, 400);
    return () => clearTimeout(timer);
  }, [fetchTraces]);

  const translateList = async () => {
    if (lang === 'en' || traces.length === 0) return;
    
    setIsTranslatingList(true);
    try {
      const res = await fetch('/api/translate/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traceIds: traces.map(t => t.id), lang }),
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
          className="w-full px-4 py-3 text-lg border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 bg-white dark:bg-neutral-900 dark:text-white"
          aria-label={t(lang, 'searchPlaceholder')}
        />
        {tags.length > 0 && (
          <select
            value={tag}
            onChange={e => { setTag(e.target.value); setPage(1); }}
            className="w-full px-4 py-3 text-lg border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 dark:text-white"
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
        <ul className="space-y-3" role="list">
          {traces.map(trace => (
            <li key={trace.id}>
              <Link
                href={`/trace/${trace.id}`}
                className="block p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg transition-colors hover:bg-white dark:hover:bg-neutral-900 bg-white/50 dark:bg-neutral-900/50"
              >
                <p className="text-lg font-medium line-clamp-2 dark:text-white">
                  {translatedProblems[trace.id] || trace.problem}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {trace.steps.length} {trace.steps.length !== 1 ? t(lang, 'steps') : t(lang, 'step')} · {new Date(trace.createdAt).toLocaleDateString()}
                </p>
                {trace.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {trace.tags.map(tg => (
                      <span key={tg} className="px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded dark:text-neutral-300">{tg}</span>
                    ))}
                  </div>
                )}
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
