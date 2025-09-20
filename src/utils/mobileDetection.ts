import { useState, useEffect } from 'react';

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if it's a mobile device based on user agent
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

  // Check if it's a mobile device based on screen size
  const isMobileScreen = window.innerWidth < 768; // Tailwind's md breakpoint

  return isMobileUserAgent || isMobileScreen;
};

export const useMobileDetection = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};
