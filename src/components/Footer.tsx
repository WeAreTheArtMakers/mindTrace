'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

interface FooterProps {
  onOpenOnboarding: () => void;
  onOpenPrivacy: () => void;
  onOpenTranslationInfo: () => void;
}

export function Footer({ onOpenOnboarding, onOpenPrivacy, onOpenTranslationInfo }: FooterProps) {
  const { lang } = useLanguage();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto flex items-center justify-between text-sm">
        <span className="text-neutral-500 dark:text-neutral-400">{t(lang, 'appName')}</span>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenOnboarding}
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors inline-btn"
          >
            {t(lang, 'howItWorks')}
          </button>
          <button
            onClick={onOpenPrivacy}
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors inline-btn"
          >
            {t(lang, 'privacy')}
          </button>
          <button
            onClick={onOpenTranslationInfo}
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors inline-btn"
          >
            {t(lang, 'translationInfo')}
          </button>
        </div>
      </div>
    </footer>
  );
}
