import { useState, useEffect, useCallback } from 'react';
import { loadJSON, saveJSON, uid } from '@/lib/storage';

interface Claim {
  id: string;
  text: string;
  source: string;
  note: string;
  category: string;
  bookmarked: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'systems-lab:claimlens-claims';

const sampleClaims: Claim[] = [
  {
    id: 'sample-c1',
    text: 'This new battery charges ten times faster than the previous generation.',
    source: 'Example product page (illustrative)',
    note: 'Claim about charging speed. What is the baseline? Same battery size?',
    category: 'Technology',
    bookmarked: true,
    createdAt: Date.parse('2025-10-10T10:00:00Z'),
  },
  {
    id: 'sample-c2',
    text: 'Studies show that drinking coffee improves focus by 40%.',
    source: 'Illustrative example article',
    note: 'Which studies? What was the sample size and the comparison group?',
    category: 'Health',
    bookmarked: false,
    createdAt: Date.parse('2025-10-12T14:00:00Z'),
  },
];

function loadClaims(): Claim[] {
  const stored = loadJSON<Claim[] | null>(STORAGE_KEY, null);
  if (stored && Array.isArray(stored)) return stored;
  return sampleClaims;
}

export function ClaimLensDemo() {
  const [claims, setClaims] = useState<Claim[]>(loadClaims);
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [editing, setEditing] = useState<Claim | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { saveJSON(STORAGE_KEY, claims); }, [claims]);

  const cats = ['All', 'Technology', 'Health', 'Science', 'Politics', 'Other'];

  const filtered = claims.filter((c) => {
    if (filterCat !== 'All' && c.category !== filterCat) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return c.text.toLowerCase().includes(q) || c.note.toLowerCase().includes(q) || c.source.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => b.createdAt - a.createdAt);

  const addClaim = useCallback((c: Omit<Claim, 'id' | 'createdAt' | 'bookmarked'>) => {
    const claim: Claim = { ...c, id: uid(), createdAt: Date.now(), bookmarked: false };
    setClaims((prev) => [claim, ...prev]);
    setShowForm(false);
  }, []);

  const updateClaim = useCallback((c: Claim) => {
    setClaims((prev) => prev.map((x) => (x.id === c.id ? c : x)));
    setEditing(null);
  }, []);

  const deleteClaim = useCallback((id: string) => {
    setClaims((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setClaims((prev) => prev.map((x) => (x.id === id ? { ...x, bookmarked: !x.bookmarked } : x)));
  }, []);

  const restoreSamples = useCallback(() => {
    setClaims(sampleClaims);
  }, []);

  return (
    <div className="border border-divider bg-panel p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="eyebrow">ClaimLens / Local Demo</div>
        <div className="flex gap-2">
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-lime bg-lime text-ink hover:bg-lime/80"
          >
            + Capture Claim
          </button>
          <button
            onClick={restoreSamples}
            className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime ink2"
          >
            Restore samples
          </button>
        </div>
      </div>

      <div className="mono text-[10px] ink2 mb-4">
        This is a local in-browser demonstration, separate from the browser-extension concept. Claims are stored in your browser only. ClaimLens does not verify whether a claim is factually correct.
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search claims, notes, sources…"
          aria-label="Search claims"
          className="flex-1 bg-canvas border border-divider px-3 py-2 text-sm outline-none focus:border-lime mono"
        />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={`mono text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-colors ${filterCat === c ? 'border-lime bg-lime/10 text-lime' : 'border-divider hover:border-lime ink2'}`}
          >
            {c}
          </button>
        ))}
        <span className="mono text-[10px] uppercase tracking-wider ink2 ml-auto self-center">
          {filtered.length} {filtered.length === 1 ? 'claim' : 'claims'}
        </span>
      </div>

      {/* Form */}
      {showForm && (
        <ClaimForm
          onCancel={() => setShowForm(false)}
          onSave={addClaim}
        />
      )}
      {editing && (
        <ClaimForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={(c) => updateClaim({ ...editing, ...c, id: editing.id, createdAt: editing.createdAt })}
        />
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="border border-divider py-10 text-center">
          <p className="text-sm ink2">No claims match your search. Capture one to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.id} className="border border-divider p-4 bg-canvas">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-divider ink2">{c.category}</span>
                    {c.bookmarked && <span className="mono text-[9px] uppercase tracking-wider text-lime">★ Bookmarked</span>}
                  </div>
                  <p className="text-sm font-medium mb-1">"{c.text}"</p>
                  {c.note && <p className="text-sm ink2 mb-1">{c.note}</p>}
                  <p className="mono text-[10px] ink2">Source: {c.source}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => toggleBookmark(c.id)} aria-label={c.bookmarked ? 'Remove bookmark' : 'Bookmark'} className="mono text-[10px] uppercase border border-divider hover:border-lime px-2 py-1">
                    {c.bookmarked ? '★' : '☆'}
                  </button>
                  <button onClick={() => setEditing(c)} aria-label="Edit claim" className="mono text-[10px] uppercase border border-divider hover:border-lime px-2 py-1">Edit</button>
                  <button onClick={() => { if (confirm('Delete this claim?')) deleteClaim(c.id); }} aria-label="Delete claim" className="mono text-[10px] uppercase border border-divider hover:border-orange px-2 py-1 text-orange">Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClaimForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Claim;
  onSave: (c: Omit<Claim, 'id' | 'createdAt' | 'bookmarked'>) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initial?.text ?? '');
  const [source, setSource] = useState(initial?.source ?? '');
  const [note, setNote] = useState(initial?.note ?? '');
  const [category, setCategory] = useState(initial?.category ?? 'Technology');

  const submit = () => {
    if (!text.trim()) return;
    onSave({ text: text.trim(), source: source.trim() || 'Unspecified', note: note.trim(), category });
  };

  return (
    <div className="border border-lime bg-canvas p-4 mb-4 fade-in">
      <div className="eyebrow mb-3">{initial ? 'Edit Claim' : 'Capture Claim'}</div>
      <label className="block mb-3">
        <span className="mono text-[10px] uppercase tracking-wider ink2">Claim text *</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} className="w-full mt-1 bg-panel border border-divider px-3 py-2 text-sm outline-none focus:border-lime" aria-label="Claim text" />
      </label>
      <label className="block mb-3">
        <span className="mono text-[10px] uppercase tracking-wider ink2">Source</span>
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Where did you find this claim?" className="w-full mt-1 bg-panel border border-divider px-3 py-2 text-sm outline-none focus:border-lime mono" aria-label="Claim source" />
      </label>
      <label className="block mb-3">
        <span className="mono text-[10px] uppercase tracking-wider ink2">Your note</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Questions, evidence, context…" className="w-full mt-1 bg-panel border border-divider px-3 py-2 text-sm outline-none focus:border-lime" aria-label="Your note" />
      </label>
      <label className="block mb-3">
        <span className="mono text-[10px] uppercase tracking-wider ink2">Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 bg-panel border border-divider px-3 py-2 text-sm outline-none focus:border-lime mono" aria-label="Claim category">
          {['Technology', 'Health', 'Science', 'Politics', 'Other'].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <div className="flex gap-2">
        <button onClick={submit} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-lime bg-lime text-ink">{initial ? 'Save' : 'Capture'}</button>
        <button onClick={onCancel} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime">Cancel</button>
      </div>
    </div>
  );
}
