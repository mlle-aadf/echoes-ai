
import { useState, useEffect } from 'react';

export function usePuter() {
  const [isPuterReady, setIsPuterReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip if already loaded
    if (window.puter) {
      setIsPuterReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    
    script.onload = () => {
      if (window.puter) {
        setIsPuterReady(true);
      } else {
        setError('Puter failed to initialize');
      }
    };

    script.onerror = () => {
      setError('Failed to load Puter script');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return { isPuterReady, error };
}
