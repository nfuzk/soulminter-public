import { useEffect } from 'react';
import { useCookieConsent } from '../contexts/CookieConsentContext';

const ConditionalGoogleFonts: React.FC = () => {
  const { hasConsent, preferences } = useCookieConsent();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const shouldEnableFonts = hasConsent && preferences.optionalServices;
    const existingLink = document.getElementById('google-fonts-stylesheet');
    
    if (shouldEnableFonts && !existingLink) {
      // Enable Google Fonts by adding the stylesheet
      const link = document.createElement('link');
      link.id = 'google-fonts-stylesheet';
      link.rel = 'preconnect';
      link.href = 'https://fonts.googleapis.com';
      document.head.appendChild(link);

      const link2 = document.createElement('link');
      link2.rel = 'preconnect';
      link2.href = 'https://fonts.gstatic.com';
      link2.crossOrigin = 'anonymous';
      document.head.appendChild(link2);

      const link3 = document.createElement('link');
      link3.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Roboto:wght@300;400;700&display=swap';
      link3.rel = 'stylesheet';
      document.head.appendChild(link3);
    } else if (!shouldEnableFonts && existingLink) {
      // Disable Google Fonts by removing the stylesheet
      existingLink.remove();
      
      // Remove all Google Fonts related links
      const googleFontsLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]');
      googleFontsLinks.forEach(link => link.remove());
    }
  }, [hasConsent, preferences.optionalServices]);

  return null;
};

export default ConditionalGoogleFonts;
