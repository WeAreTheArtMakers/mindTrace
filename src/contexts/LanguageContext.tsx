'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, SUPPORTED_LANGUAGES, isRTL } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect browser language and map to supported language
function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';
  
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en';
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Map browser language to supported language
  const langMap: Record<string, Language> = {
    'en': 'en',
    'tr': 'tr',
    'fr': 'fr',
    'it': 'it',
    'de': 'de',
    'ar': 'ar',
    'hi': 'hi',
  };
  
  return langMap[langCode] || 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Priority: localStorage > browser language > default (en)
    const stored = localStorage.getItem('mindtrace-lang') as Language;
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      setLangState(stored);
    } else {
      // Auto-detect from browser
      const detected = detectBrowserLanguage();
      setLangState(detected);
      // Don't save auto-detected to localStorage - let user explicitly choose
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = lang;
      document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    }
  }, [lang, mounted]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('mindtrace-lang', newLang);
  };

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRtl: isRTL(lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
