import { useCallback, useEffect, useState } from 'react';

export interface UseHapticsOptions {
  defaultEnabled?: boolean;
  storageKey?: string;
}

export function useHaptics(options: UseHapticsOptions = {}) {
  const { defaultEnabled, storageKey = 'hapticsEnabled' } = options;
  const [enabled, setEnabled] = useState<boolean>(false);

  // Initialize from storage or UA
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) setEnabled(saved === 'true');
      else if (defaultEnabled != null) setEnabled(defaultEnabled);
      else setEnabled(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
    } catch {
      // ignore
    }
  }, [defaultEnabled, storageKey]);

  const toggle = useCallback((value: boolean) => {
    setEnabled(value);
    try { localStorage.setItem(storageKey, String(value)); } catch {}
  }, [storageKey]);

  const vibrate = useCallback((pattern: number | number[]) => {
    try {
      if (enabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        (navigator as any).vibrate(pattern);
      }
    } catch {}
  }, [enabled]);

  return { enabled, setEnabled: toggle, vibrate } as const;
}

