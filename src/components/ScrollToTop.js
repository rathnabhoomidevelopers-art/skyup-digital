import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // On server-side, return null immediately
  if (typeof window === 'undefined') return null;

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;