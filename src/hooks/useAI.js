import { useCallback, useState } from 'react';

export function useAI(fn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const run = useCallback(async (...args) => {
    setLoading(true); setError(null);
    try {
      const result = await fn(...args);
      setData(result);
      return result;
    } catch (e) {
      setError(e.message || String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { loading, error, data, run, reset: () => { setData(null); setError(null); } };
}
