// Server-side analytics tracking for MindTrace
// No data stored on user's device - everything goes to Turso DB

type EventName = 
  | 'page_view'
  | 'trace_view'
  | 'trace_create'
  | 'trace_resonate'
  | 'share_click'
  | 'language_change'
  | 'theme_change'
  | 'search'
  | 'install_prompt_shown'
  | 'install_prompt_dismissed';

// Send event to server - no local storage
async function sendEvent(name: EventName, properties?: Record<string, string | number | boolean>): Promise<void> {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        properties,
        path: typeof window !== 'undefined' ? window.location.pathname : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      }),
    });
  } catch {
    // Silently fail
  }
}

// Track an event
export function trackEvent(name: EventName, properties?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  sendEvent(name, properties);
}

// Track page view
export function trackPageView(path?: string): void {
  trackEvent('page_view', { 
    path: path || (typeof window !== 'undefined' ? window.location.pathname : ''),
  });
}
