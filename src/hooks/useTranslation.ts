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
  const { lang } = useLanguage();
  const [translation, setTranslation] = useState<{ problem: string; steps: string[]; tags: string[] } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginalNote, setShowOriginalNote] = useState(false);

  useEffect(() => {
    if (!trace || lang === 'en') {
      setTranslation(null);
      setShowOriginalNote(false);
      return;
    }

    setIsTranslating(true);
    setShowOriginalNote(false);

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ traceId: trace.id, lang }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.available === false) {
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
  }, [trace, lang]);

  if (!trace) {
    return { problem: '', steps: [], tags: [], isTranslating: false, showOriginalNote: false };
  }

  return {
    problem: translation?.problem || trace.problem,
    steps: translation?.steps || trace.steps,
    tags: translation?.tags || trace.tags,
    isTranslating,
    showOriginalNote: showOriginalNote && lang !== 'en',
  };
}
