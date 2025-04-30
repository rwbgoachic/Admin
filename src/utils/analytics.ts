import { Analytics } from '@vercel/analytics/react';

export function initAnalytics() {
  return <Analytics />;
}

// Custom event tracking
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va.track(eventName, properties);
  }
}

// Page view tracking
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va.track('pageview', { path: url });
  }
}