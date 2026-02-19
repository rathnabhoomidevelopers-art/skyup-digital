import { useEffect } from 'react';
import { usePageContext } from 'vike-react/usePageContext';

function ScrollToTop() {
  if (typeof window === 'undefined') return null;

  const { urlPathname } = usePageContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [urlPathname]);

  return null;
}

export default ScrollToTop;