// Server-side analytics tracking for MindTrace
// No data stored on user's device - everything goes to Turso DB

type EventName = 
  | 'page_view'
  | 'page_leave'
  | 'trace_view'
  | 'trace_create'
  | 'trace_resonate'
  | 'share_click'
  | 'language_change'
  | 'theme_change'
  | 'search'
  | 'install_prompt_shown'
  | 'install_prompt_dismissed';

// Get device info
function getDeviceInfo() {
  if (typeof window === 'undefined') return {};
  
  const ua = navigator.userAgent;
  let device = 'desktop';
  if (/Mobile|Android|iPhone|iPad/.test(ua)) {
    device = /iPad/.test(ua) ? 'tablet' : 'mobile';
  }
  
  let browser = 'other';
  if (ua.includes('Chrome')) browser = 'chrome';
  else if (ua.includes('Safari')) browser = 'safari';
  else if (ua.includes('Firefox')) browser = 'firefox';
  else if (ua.includes('Edge')) browser = 'edge';
  
  return {
    device,
    browser,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    language: navigator.language,
  };
}

// Send event to server - no local storage
async function sendEvent(name: EventName, properties?: Record<string, string | number | boolean>): Promise<void> {
  try {
    const deviceInfo = getDeviceInfo();
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        properties: { ...deviceInfo, ...properties },
        path: typeof window !== 'undefined' ? window.location.pathname : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
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

// Track page view with time tracking
let pageLoadTime = 0;

export function trackPageView(path?: string): void {
  pageLoadTime = Date.now();
  trackEvent('page_view', { 
    path: path || (typeof window !== 'undefined' ? window.location.pathname : ''),
  });
}

// Track page leave with duration
export function trackPageLeave(): void {
  if (pageLoadTime === 0) return;
  const duration = Math.round((Date.now() - pageLoadTime) / 1000);
  trackEvent('page_leave', { 
    duration,
    path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}
