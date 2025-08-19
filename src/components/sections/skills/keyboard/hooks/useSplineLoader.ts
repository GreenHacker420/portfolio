import { useCallback, useEffect, useRef, useState } from 'react';

export interface SplineLoadState {
  loading: boolean;
  progress: number; // 0-100
  error: string | null;
  sceneUrl: string | null; // blob or direct url
  prefetching: boolean;
}

export interface UseSplineLoaderOptions {
  rootMargin?: string;
}

export function useSplineLoader(options: UseSplineLoaderOptions = {}) {
  const { rootMargin = '200px' } = options;
  const [state, setState] = useState<SplineLoadState>({ loading: true, progress: 0, error: null, sceneUrl: null, prefetching: false });
  const [readyToMount, setReadyToMount] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Prefetch on intersection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !state.prefetching && !state.sceneUrl) {
          console.log('Skills section intersecting, starting Spline prefetch...');
          setState((s) => ({ ...s, prefetching: true }));
          (async () => {
            try {
              // Use local scene file from public folder
              const chosen = '/scene.splinecode';
              console.log('Fetching Spline scene from:', chosen);
              let res = await fetch(chosen);
              const total = Number(res.headers.get('Content-Length') || '0');
              console.log('Spline scene response:', res.status, res.statusText, 'Size:', total);
              if (!res.body) {
                console.log('No response body, using direct URL');
                setState((s) => ({ ...s, sceneUrl: chosen, progress: 100 }));
                setReadyToMount(true);
                return;
              }
              const reader = res.body.getReader();
              const chunks: BlobPart[] = [];
              let received = 0;
              while (true) {
                const { done, value } = await reader.read();
                if (done || cancelled) break;
                if (value) {
                  chunks.push(value as BlobPart);
                  received += (value as Uint8Array).length;
                  if (total) setState((s) => ({ ...s, progress: Math.min(99, Math.round((received / total) * 100)) }));
                }
              }
              if (cancelled) return;
              const blob = new Blob(chunks, { type: 'application/octet-stream' });
              const url = URL.createObjectURL(blob);
              console.log('Spline scene blob created:', url, 'Size:', blob.size);
              setState((s) => ({ ...s, sceneUrl: url, progress: 100 }));
              setReadyToMount(true);
              console.log('Spline loader ready to mount');
            } catch (e) {
              console.warn('Spline prefetch failed, using direct URL', e);
              setState((s) => ({ ...s, sceneUrl: '/scene.splinecode' }));
              setReadyToMount(true);
              console.log('Spline loader ready to mount (fallback)');
            }
          })();
        }
      }
    }, { rootMargin });

    obs.observe(el);
    return () => { cancelled = true; obs.disconnect(); };
  }, [rootMargin, state.prefetching, state.sceneUrl]);

  const markLoaded = useCallback(() => {
    setState((s) => ({ ...s, loading: false }));
  }, []);

  const markError = useCallback((message: string) => {
    setState((s) => ({ ...s, error: message, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({ loading: true, progress: 0, error: null, sceneUrl: null, prefetching: false });
    setReadyToMount(false);
  }, []);

  return { containerRef, state, readyToMount, markLoaded, markError, reset } as const;
}

