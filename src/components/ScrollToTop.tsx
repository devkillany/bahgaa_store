import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Disable browser's default scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Clear hash from URL to prevent native scroll to anchor
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    // Force scroll to top immediately
    scrollToTop();
    
    // Fallback for delayed rendering
    const timeoutId1 = setTimeout(scrollToTop, 10);
    const timeoutId2 = setTimeout(scrollToTop, 100);
    const timeoutId3 = setTimeout(scrollToTop, 500);
    
    window.addEventListener('load', scrollToTop);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      window.removeEventListener('load', scrollToTop);
    };
  }, [pathname]);

  return null;
}
