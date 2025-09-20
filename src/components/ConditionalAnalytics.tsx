import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useCookieConsent } from '../contexts/CookieConsentContext';

const ConditionalAnalytics: React.FC = () => {
  const { hasConsent, preferences } = useCookieConsent();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const shouldEnableAnalytics = hasConsent && preferences.analytics;
    const currentOptOut = localStorage.getItem('vercel-analytics-opt-out');
    
    // Only update localStorage if the state has actually changed
    if (shouldEnableAnalytics && currentOptOut === 'true') {
      localStorage.removeItem('vercel-analytics-opt-out');
    } else if (!shouldEnableAnalytics && currentOptOut !== 'true') {
      localStorage.setItem('vercel-analytics-opt-out', 'true');
    }
    
    // Only call gtag if it's available and we need to update consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: shouldEnableAnalytics ? 'granted' : 'denied',
        ad_storage: 'denied',
        functionality_storage: 'granted',
        personalization_storage: 'denied',
        security_storage: 'granted',
      });
    }
  }, [hasConsent, preferences.analytics]);

  // Only render Analytics component if user has consented to analytics
  if (!hasConsent || !preferences.analytics) {
    return null;
  }

  return <Analytics />;
};

export default ConditionalAnalytics;
