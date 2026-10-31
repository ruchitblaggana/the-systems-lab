import { useEffect, useState } from 'react';
import { Link } from '@/lib/Link';
import { navigate } from '@/lib/router';
import { useSettings } from '@/lib/settings';

interface NavProps {
  path: string;
}

const navItems = [
  { label: 'Projects', path: '/projects', idx: '01' },
  { label: 'Playground', path: '/playground', idx: '02' },
  { label: 'Lab Notes', path: '/lab-notes', idx: '03' },
  { label: 'About', path: '/about', idx: '04' },
  { label: 'Contact', path: '/contact', idx: '05' },
];

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2 group" ariaLabel="The Systems Lab — home">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0" aria-hidden="true">
        <circle cx="7" cy="9" r="2.2" fill="currentColor" className="text-lime" />
        <circle cx="25" cy="7" r="2" fill="currentColor" className="text-lime" />
        <circle cx="16" cy="22" r="2.4" fill="currentColor" className="text-orange" />
        <circle cx="25" cy="24" r="1.8" fill="currentColor" className="text-lime" />
        <path d="M7 9 L16 22 L25 7 M16 22 L25 24" stroke="currentColor" className="text-lime" strokeWidth="1.1" opacity="0.55" />
      </svg>
      <span className="font-bold text-sm tracking-tight leading-none">
        THE SYSTEMS LAB
      </span>
    </Link>
  );
}

export function Nav({ path }: NavProps) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { settings, toggleTheme } = useSettings();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [path]);

  // Keyboard: "/" opens search, Escape closes things
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (e.key === '/' && !typing && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-sm border-b border-divider">
        <div className="max-w-screen-xl2 mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Wordmark />

            {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = path === item.path || (item.path !== '/' && path.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    isActive={active}
                    className="px-3 py-1.5 text-sm transition-colors hover:text-lime flex items-center gap-1.5"
                    activeClassName="text-lime"
                  >
                    <span className="mono text-[10px] ink2 opacity-60">{item.idx}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Status indicator */}
              <div className="hidden lg:flex items-center gap-1.5 mono text-[10px] ink2 uppercase tracking-wider">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime pulse-dot" />
                Portfolio / Online
              </div>

              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="p-1.5 border border-divider hover:border-lime transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
                </svg>
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-1.5 border border-divider hover:border-lime transition-colors"
              >
                {settings.theme === 'dark' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle navigation menu"
                aria-expanded={open}
                className="md:hidden p-1.5 border border-divider hover:border-lime transition-colors"
              >
                {open ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-over */}
        {open && (
          <div className="md:hidden border-t border-divider bg-canvas fade-in">
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => {
                const active = path === item.path || (item.path !== '/' && path.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    isActive={active}
                    className="py-2 text-sm flex items-center gap-2"
                    activeClassName="text-lime"
                  >
                    <span className="mono text-[10px] ink2 opacity-60">{item.idx}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

// Inline import to avoid circular issues — search overlay is only rendered here.
import { search as searchIndex, type SearchResult } from '@/lib/search';

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setResults(searchIndex(query));
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[activeIdx]) {
        e.preventDefault();
        navigate(results[activeIdx].path);
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [results, activeIdx, onClose]);

  const grouped: Record<string, SearchResult[]> = {};
  results.forEach((r) => {
    grouped[r.type] = grouped[r.type] || [];
    grouped[r.type].push(r);
  });

  return (
    <div className="fixed inset-0 z-50 bg-canvas/95 backdrop-blur-sm fade-in" role="dialog" aria-label="Search">
      <div className="max-w-2xl mx-auto px-4 pt-20">
        <div className="flex items-center justify-between mb-4">
          <span className="eyebrow">Search / The Systems Lab</span>
          <button onClick={onClose} aria-label="Close search" className="p-1.5 border border-divider hover:border-lime">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, notes, pages…"
          className="w-full bg-panel border border-divider px-4 py-3 text-lg outline-none focus:border-lime mono"
          aria-label="Search query"
        />
        <div className="mt-4 text-sm">
          {results.length === 0 && query && (
            <p className="ink2 py-8 text-center">No results for "{query}".</p>
          )}
          {results.length === 0 && !query && (
            <p className="ink2 py-8 text-center">Start typing to search projects, notes, and pages.</p>
          )}
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type} className="mb-3">
              <div className="eyebrow mb-1">{type}</div>
              {items.map((r) => {
                const idx = results.indexOf(r);
                return (
                  <button
                    key={r.id}
                    onClick={() => { navigate(r.path); onClose(); }}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={`w-full text-left px-3 py-2 border-l-2 transition-colors ${
                      activeIdx === idx ? 'border-lime bg-panel' : 'border-transparent hover:bg-panel'
                    }`}
                  >
                    <div className="text-sm font-medium">{r.title}</div>
                    <div className="text-xs ink2 line-clamp-1">{r.description}</div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 mono text-[10px] ink2 flex gap-4">
          <span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
