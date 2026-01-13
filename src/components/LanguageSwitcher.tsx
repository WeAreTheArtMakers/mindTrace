'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, Language } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-neutral-200"
        aria-label="Change language"
        aria-expanded={open}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <span className="hidden sm:inline">{LANGUAGE_NAMES[lang]}</span>
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50 min-w-[140px] py-1">
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l as Language); setOpen(false); }}
              className={`w-full text-start px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-neutral-200 ${lang === l ? 'bg-neutral-100 dark:bg-neutral-800 font-medium' : ''}`}
            >
              {LANGUAGE_NAMES[l as Language]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
