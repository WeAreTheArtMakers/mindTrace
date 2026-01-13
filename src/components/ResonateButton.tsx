'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';

interface ResonateButtonProps {
  traceId: string;
}

export function ResonateButton({ traceId }: ResonateButtonProps) {
  const { lang } = useLanguage();
  const [count, setCount] = useState(0);
  const [hasResonated, setHasResonated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user already resonated (localStorage)
    const resonated = localStorage.getItem(`mindtrace-resonated-${traceId}`);
    if (resonated) {
      setHasResonated(true);
    }
    
    // Fetch count from API
    fetch(`/api/resonate?traceId=${traceId}`)
      .then(r => r.json())
      .then(data => setCount(data.count || 0))
      .catch(() => {});
  }, [traceId]);

  const handleResonate = async () => {
    if (hasResonated) return;
    
    setIsAnimating(true);
    setHasResonated(true);
    setCount(c => c + 1);
    localStorage.setItem(`mindtrace-resonated-${traceId}`, 'true');
    
    // Send to API
    fetch('/api/resonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ traceId }),
    }).catch(() => {});
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={handleResonate}
      disabled={hasResonated}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
        hasResonated 
          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 cursor-default' 
          : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400'
      } ${isAnimating ? 'scale-110' : ''}`}
      aria-label={t(lang, 'resonateWithThis')}
    >
      <svg 
        className={`w-5 h-5 transition-transform ${isAnimating ? 'scale-125' : ''}`} 
        fill={hasResonated ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={hasResonated ? 0 : 2} 
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
        />
      </svg>
      <span>
        {hasResonated ? t(lang, 'resonated') : t(lang, 'resonateWithThis')}
        {count > 0 && <span className="ml-1 opacity-70">· {count}</span>}
      </span>
    </button>
  );
}
