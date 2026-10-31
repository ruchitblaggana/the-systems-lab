import { useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark';
export type Density = 'comfortable' | 'compact';
export type MotionPref = 'system' | 'off';

export interface Settings {
  theme: Theme;
  density: Density;
  motion: MotionPref;
}

const KEY = 'systems-lab:settings';

function readSettings(): Settings {
  const defaults: Settings = { theme: 'light', density: 'comfortable', motion: 'system' };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      density: parsed.density === 'compact' ? 'compact' : 'comfortable',
      motion: parsed.motion === 'off' ? 'off' : 'system',
    };
  } catch {
    return defaults;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(readSettings);

  // Apply theme + density + motion to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    if (settings.density === 'compact') root.classList.add('compact');
    else root.classList.remove('compact');
    if (settings.motion === 'off') root.classList.add('no-motion');
    else root.classList.remove('no-motion');
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* ignore quota errors */
    }
  }, [settings]);

  const toggleTheme = useCallback(() => {
    setSettings((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setSettings({ theme: 'light', density: 'comfortable', motion: 'system' });
  }, []);

  return { settings, toggleTheme, update, reset };
}

// Check reduced-motion preference: true if user prefers reduced motion OR has motion:off in settings
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}
