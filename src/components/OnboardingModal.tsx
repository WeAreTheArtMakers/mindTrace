'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  featuredId: string | null;
}

export function OnboardingModal({ open, onClose, featuredId }: OnboardingModalProps) {
  const router = useRouter();
  const { lang } = useLanguage();

  const tryExample = () => {
    onClose();
    if (featuredId) router.push(`/trace/${featuredId}`);
  };

  const createTrace = () => {
    onClose();
    router.push('/new');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 animate-slide-up">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">{t(lang, 'welcomeTitle')}</h2>
        
        <ol className="space-y-3 mb-6">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-sm font-medium dark:text-white">1</span>
            <span className="dark:text-neutral-200">{t(lang, 'onboardingStep1')}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-sm font-medium dark:text-white">2</span>
            <span className="dark:text-neutral-200">{t(lang, 'onboardingStep2')}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-sm font-medium dark:text-white">3</span>
            <span className="dark:text-neutral-200">{t(lang, 'onboardingStep3')}</span>
          </li>
        </ol>

        <div className="flex flex-col gap-2">
          {featuredId && (
            <button
              onClick={tryExample}
              className="w-full py-3 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300"
            >
              {t(lang, 'tryExample')}
            </button>
          )}
          <button
            onClick={createTrace}
            className="w-full py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:text-white"
          >
            {t(lang, 'createTrace')}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            {t(lang, 'close')}
          </button>
        </div>
      </div>
    </div>
  );
}
