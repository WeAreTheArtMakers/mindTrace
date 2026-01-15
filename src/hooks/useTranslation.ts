'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { MindTrace } from '@/types';

interface TranslationResult {
  problem: string;
  steps: string[];
  tags: string[];
  isTranslating: boolean;
  showOriginalNote: boolean;
}

export function useTraceTranslation(trace: MindTrace | null): TranslationResult {
  const { lang, userChangedLanguage } = useLanguage();
  const [translation, setTranslation] = useState<{ problem: string; steps: string[]; tags: string[] } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginalNote, setShowOriginalNote] = useState(false);

  useEffect(() => {
    if (!trace) {
      setTranslation(null);
      setShowOriginalNote(false);
      return;
    }

    // Get trace's original language (default to 'en' if not specified)
    const traceLocale = trace.localeHint || 'en';
    
    // If trace language matches user's current language, no translation needed
    if (traceLocale === lang) {
      setTranslation(null);
      setShowOriginalNote(false);
      setIsTranslating(false);
      return;
    }
    
    // If user hasn't explicitly changed language and trace is in their browser language,
    // don't translate (they're seeing content in their native language)
    if (!userChangedLanguage && traceLocale === lang) {
      setTranslation(null);
      setShowOriginalNote(false);
      setIsTranslating(false);
      return;
    }

    // Need to translate - either user changed language or trace is in different language
    setIsTranslating(true);
    setShowOriginalNote(false);

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ traceId: trace.id, lang, userChangedLanguage }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.skipped) {
          // No translation needed - same language
          setTranslation(null);
          setShowOriginalNote(false);
        } else if (data.available === false) {
          // No API key or error - show original with note
          setShowOriginalNote(true);
          setTranslation(null);
        } else if (data.problem) {
          setTranslation({
            problem: data.problem,
            steps: data.steps,
            tags: data.tags,
          });
          setShowOriginalNote(false);
        }
      })
      .catch(() => {
        setShowOriginalNote(true);
        setTranslation(null);
      })
      .finally(() => setIsTranslating(false));
  }, [trace, lang, userChangedLanguage]);

  if (!trace) {
    return { problem: '', steps: [], tags: [], isTranslating: false, showOriginalNote: false };
  }

  return {
    problem: translation?.problem || trace.problem,
    steps: translation?.steps || trace.steps,
    tags: translation?.tags || trace.tags,
    isTranslating,
    showOriginalNote,
  };
}
