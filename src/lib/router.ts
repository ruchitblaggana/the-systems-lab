import { useEffect, useState, useCallback } from 'react';

// A tiny hash-based router. Hash routing avoids the need for server-side
// rewrite configuration and works correctly on static hosts like Netlify/Vercel
// without extra configuration. Refreshes preserve the route.

export function parsePath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  // Treat empty hash as root
  return hash || '/';
}

export function navigate(to: string) {
  if (to.startsWith('http') || to.startsWith('mailto:')) {
    window.open(to, '_blank', 'noopener,noreferrer');
    return;
  }
  const target = to.startsWith('#') ? to.slice(1) : to;
  if (target === parsePath()) return;
  window.location.hash = target;
}

export function useRouter() {
  const [path, setPath] = useState(parsePath());

  useEffect(() => {
    const handler = () => {
      setPath(parsePath());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const go = useCallback((to: string) => navigate(to), []);

  return { path, go };
}

// Split a path like "/projects/smart-hat" into segments
export function segments(path: string): string[] {
  return path.split('/').filter(Boolean);
}
