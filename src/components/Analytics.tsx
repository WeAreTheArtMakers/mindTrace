'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackPageLeave } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
    
    // Track page leave
    const handleBeforeUnload = () => trackPageLeave();
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackPageLeave();
    };
  }, [pathname]);

  return null;
}
