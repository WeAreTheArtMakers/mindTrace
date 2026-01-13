'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { lang } = useLanguage();

  return (
    <header className="flex items-center justify-between mb-6">
      <Link href="/" className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-neutral-800 dark:text-neutral-200">
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
          <path d="M10 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="2" fill="currentColor" />
          <path d="M16 18v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-xl font-semibold dark:text-white">{t(lang, 'appName')}</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
        <Link
          href="/new"
          className="px-3 py-1.5 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300"
          aria-label="Create new mind trace"
        >
          {t(lang, 'newTrace')}
        </Link>
      </div>
    </header>
  );
}
