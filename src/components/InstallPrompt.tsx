'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const { lang } = useLanguage();
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already shown
    const dismissed = localStorage.getItem('mindtrace-install-dismissed');
    if (dismissed) return;

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // For Android/Chrome - listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS - show custom prompt after delay
    if (iOS) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('mindtrace-install-dismissed', 'true');
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe">
      <div className="install-banner max-w-lg mx-auto rounded-2xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <img 
            src="/logo.png" 
            alt="MindTrace" 
            className="w-12 h-12 rounded-xl"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#1e293b] dark:text-[#e2e8f0]">
              {t(lang, 'installAppTitle')}
            </h3>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-0.5">
              {isIOS ? t(lang, 'installAppIOSDesc') : t(lang, 'installAppDesc')}
            </p>
            
            {isIOS ? (
              <div className="mt-3 text-sm text-[#64748b] dark:text-[#94a3b8]">
                <p className="flex items-center gap-2">
                  <span>1.</span>
                  <span>{t(lang, 'iosStep1')}</span>
                  <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-2h2V7h-2z"/>
                  </svg>
                </p>
                <p className="flex items-center gap-2 mt-1">
                  <span>2.</span>
                  <span>{t(lang, 'iosStep2')}</span>
                </p>
              </div>
            ) : (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 bg-[#4fd1c5] text-[#0a1628] font-medium rounded-lg hover:bg-[#81e6d9] transition-colors"
                >
                  {t(lang, 'installApp')}
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 text-[#64748b] hover:text-[#1e293b] dark:hover:text-[#e2e8f0] transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
