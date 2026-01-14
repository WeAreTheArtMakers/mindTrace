'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { lang } = useLanguage();

  return (
    <header className="flex items-center justify-between mb-6">
      <Link href="/" className="flex items-center gap-2">
        <Image 
          src="/logo.png" 
          alt="MindTrace" 
          width={36} 
          height={36} 
          className="rounded-lg"
        />
        <span className="text-xl font-semibold bg-gradient-to-r from-[#0d9488] to-[#4fd1c5] bg-clip-text text-transparent">{t(lang, 'appName')}</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
        <Link
          href="/new"
          className="px-3 py-1.5 bg-[#4fd1c5] text-[#0a1628] rounded-lg text-sm font-medium transition-colors hover:bg-[#81e6d9]"
          aria-label="Create new mind trace"
        >
          {t(lang, 'newTrace')}
        </Link>
      </div>
    </header>
  );
}
