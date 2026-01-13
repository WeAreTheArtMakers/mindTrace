'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const { lang } = useLanguage();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 animate-slide-up max-h-[80vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="text-xl font-semibold mb-4 dark:text-white">{title}</h2>
        <div className="text-neutral-600 dark:text-neutral-300 mb-6">
          {children}
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:text-white"
        >
          {t(lang, 'close')}
        </button>
      </div>
    </div>
  );
}
