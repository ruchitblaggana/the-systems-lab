import { useState, useMemo, useEffect } from 'react';
import { Link } from '@/lib/Link';
import { Section, SectionHeader, StatusBadge, Pill } from '@/components/ui';
import { projects, projectCategoryOrder, type ProjectCategory } from '@/data/projects';

type SortKey = 'featured' | 'az' | 'za' | 'type';
type CatFilter = ProjectCategory | 'All Projects';

const STORAGE_KEY = 'systems-lab:projects-filter';

interface FilterState {
  query: string;
  category: CatFilter;
  sort: SortKey;
}

function loadFilter(): FilterState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FilterState;
  } catch { /* ignore */ }
  return { query: '', category: 'All Projects', sort: 'featured' };
}

// Custom project mini-visuals — each project gets a distinct small SVG diagram
function ProjectVisual({ slug }: { slug: string }) {
  const common = 'w-full h-full';
  if (slug === 'smart-hat') {
    return (
      <svg viewBox="0 0 200 80" className={common} aria-hidden="true">
        <rect x="10" y="30" width="30" height="20" fill="none" stroke="currentColor" className="ink2" strokeWidth="1" />
        <text x="25" y="44" textAnchor="middle" fontSize="6" className="mono ink2">SENSOR</text>
        <path d="M40 40 L80 40" stroke="currentColor" className="ink2" strokeWidth="1" markerEnd="url(#arr1)" />
        <circle cx="100" cy="40" r="16" fill="none" stroke="#C8F169" strokeWidth="1.2" />
        <text x="100" y="44" textAnchor="middle" fontSize="7" className="mono">UNO</text>
        <path d="M116 40 L150 40" stroke="currentColor" className="ink2" strokeWidth="1" markerEnd="url(#arr1)" />
        <rect x="155" y="32" width="30" height="16" fill="none" stroke="#F18B50" strokeWidth="1" />
        <text x="170" y="43" textAnchor="middle" fontSize="6" className="mono">ALERT</text>
        <defs><marker id="arr1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L5 3 L0 6 Z" fill="currentColor" className="ink2" /></marker></defs>
      </svg>
    );
  }
  if (slug === 'claimlens') {
    return (
      <svg viewBox="0 0 200 80" className={common} aria-hidden="true">
        <rect x="10" y="20" width="50" height="40" fill="none" stroke="currentColor" className="ink2" strokeWidth="1" rx="2" />
        <line x1="18" y1="30" x2="52" y2="30" stroke="currentColor" className="ink2" strokeWidth="0.8" />
        <line x1="18" y1="36" x2="48" y2="36" stroke="currentColor" className="ink2" strokeWidth="0.8" />
        <rect x="30" y="44" width="14" height="3" fill="#C8F169" />
        <path d="M60 40 L100 40" stroke="currentColor" className="ink2" strokeWidth="1" />
        <rect x="100" y="25" width="80" height="30" fill="none" stroke="#C8F169" strokeWidth="1" rx="2" />
        <text x="140" y="40" textAnchor="middle" fontSize="6" className="mono">CLAIMS</text>
        <circle cx="115" cy="48" r="2" fill="#F18B50" />
        <circle cx="130" cy="48" r="2" fill="#C8F169" />
        <circle cx="145" cy="48" r="2" fill="#C8F169" />
      </svg>
    );
  }
  if (slug === 'cascade-protocol') {
    return (
      <svg viewBox="0 0 200 80" className={common} aria-hidden="true">
        <circle cx="40" cy="25" r="8" fill="none" stroke="#F18B50" strokeWidth="1.2" />
        <text x="40" y="28" textAnchor="middle" fontSize="6" className="mono">PWR</text>
        <circle cx="40" cy="55" r="8" fill="none" stroke="currentColor" className="ink2" strokeWidth="1" />
        <text x="40" y="58" textAnchor="middle" fontSize="6" className="mono ink2">H2O</text>
        <circle cx="110" cy="40" r="8" fill="none" stroke="currentColor" className="ink2" strokeWidth="1" />
        <text x="110" y="43" textAnchor="middle" fontSize="6" className="mono ink2">COMM</text>
        <circle cx="170" cy="25" r="8" fill="none" stroke="currentColor" className="ink2" strokeWidth="1" />
        <circle cx="170" cy="55" r="8" fill="none" stroke="currentColor" className="ink2" strokeWidth="1" />
        <path d="M48 25 L102 38 M48 55 L102 42 M118 40 L162 27 M118 40 L162 53" stroke="currentColor" className="ink2" strokeWidth="0.8" opacity="0.5" />
      </svg>
    );
  }
  // blindspot
  return (
    <svg viewBox="0 0 200 80" className={common} aria-hidden="true">
      {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4, 5].map((c) => (
        <rect key={`${r}-${c}`} x={10 + c * 30} y={10 + r * 16} width="28" height="14" fill="none" stroke="currentColor" className="ink2" strokeWidth="0.6" opacity="0.4" />
      )))}
      <rect x="10" y="10" width="28" height="14" fill="#C8F169" opacity="0.7" />
      <rect x="100" y="42" width="28" height="14" fill="#F18B50" opacity="0.7" />
      <rect x="70" y="26" width="28" height="14" fill="currentColor" className="ink2" opacity="0.3" />
      <path d="M24 17 L40 33 L86 49 L114 49" stroke="#C8F169" strokeWidth="1.2" fill="none" strokeDasharray="3 3" />
    </svg>
  );
}

export function ProjectsPage() {
  const [filter, setFilter] = useState<FilterState>(loadFilter);

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filter)); } catch { /* ignore */ }
  }, [filter]);

  const filtered = useMemo(() => {
    let list = [...projects];
    if (filter.category !== 'All Projects') {
      list = list.filter((p) => p.categories.includes(filter.category as ProjectCategory));
    }
    if (filter.query.trim()) {
      const q = filter.query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.tagline.toLowerCase().includes(q)
      );
    }
    switch (filter.sort) {
      case 'az': list.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'za': list.sort((a, b) => b.title.localeCompare(a.title)); break;
      case 'type': list.sort((a, b) => a.categories[0].localeCompare(b.categories[0])); break;
      // featured: keep original order (already by number)
    }
    return list;
  }, [filter]);

  const clearAll = () => setFilter({ query: '', category: 'All Projects', sort: 'featured' });

  return (
    <div>
      <Section className="pt-10 sm:pt-14 pb-6">
        <SectionHeader idx="01 / Archive" title="Project Archive" sub="A working catalog of engineering explorations — robotics, browser tools, simulations, and systems thinking. Filter, search, and sort to find what interests you." />
      </Section>

      {/* Filter bar */}
      <Section className="pb-6 sticky top-14 z-20 bg-canvas/90 backdrop-blur-sm py-4 border-y border-divider">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <input
              value={filter.query}
              onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
              placeholder="Search by title, summary, category, or tag…"
              aria-label="Search projects"
              className="flex-1 bg-panel border border-divider px-3 py-2 text-sm outline-none focus:border-lime mono"
            />
            <div className="flex items-center gap-2">
              <label className="mono text-[10px] uppercase tracking-wider ink2">Sort</label>
              <select
                value={filter.sort}
                onChange={(e) => setFilter((f) => ({ ...f, sort: e.target.value as SortKey }))}
                className="bg-panel border border-divider px-2 py-2 text-sm outline-none focus:border-lime mono"
                aria-label="Sort projects"
              >
                <option value="featured">Featured</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
                <option value="type">By type</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {projectCategoryOrder.map((cat) => (
              <Pill key={cat} active={filter.category === cat} onClick={() => setFilter((f) => ({ ...f, category: cat }))}>
                {cat}
              </Pill>
            ))}
            <button onClick={clearAll} className="mono text-[10px] uppercase tracking-wider px-2.5 py-1 ink2 hover:text-orange transition-colors ml-auto">
              Clear filters
            </button>
          </div>

          <div className="mono text-[10px] uppercase tracking-wider ink2">
            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'} found
          </div>
        </div>
      </Section>

      {/* Results */}
      <Section className="py-8">
        {filtered.length === 0 ? (
          <div className="border border-divider py-16 text-center">
            <div className="eyebrow mb-2">No results</div>
            <p className="text-sm ink2 mb-4">No projects match your current search and filters.</p>
            <button onClick={clearAll} className="mono text-xs uppercase tracking-wider border border-divider hover:border-lime px-4 py-2">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-divider border border-divider">
            {filtered.map((p, i) => (
              <Link
                key={p.slug}
                to={`/projects/${p.slug}`}
                className="bg-canvas hover:bg-panel transition-colors group block p-6 sm:p-8"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="mono text-xs ink2">{p.number}</span>
                    <span className="mono text-xs ink2 ml-2">/ {p.categories[0]}</span>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="h-20 mb-5 border border-divider p-2 bg-panel">
                  <ProjectVisual slug={p.slug} />
                </div>

                <h3 className={`text-xl sm:text-2xl font-semibold mb-1 group-hover:text-lime transition-colors ${i % 2 === 0 ? '' : ''}`}>
                  {p.title}
                </h3>
                <p className="text-sm ink2 mb-3">{p.tagline}</p>
                <p className="text-sm ink2 line-clamp-2 mb-4">{p.summary}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((t) => (
                    <span key={t} className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-divider ink2">{t}</span>
                  ))}
                </div>
                <div className="mono text-[10px] uppercase tracking-wider text-lime">Explore Project →</div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
