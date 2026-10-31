import { useState, useEffect, useCallback, useRef } from 'react';
import { Section, SectionHeader } from '@/components/ui';
import { loadJSON, saveJSON, uid } from '@/lib/storage';
import { sampleLabNotes, noteTopics, type LabNote } from '@/data/labNotes';

const STORAGE_KEY = 'systems-lab:lab-notes';

function loadNotes(): LabNote[] {
  const stored = loadJSON<LabNote[] | null>(STORAGE_KEY, null);
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  return [...sampleLabNotes];
}

function isLabNote(v: unknown): v is LabNote {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.body === 'string' &&
    typeof o.topic === 'string' &&
    Array.isArray(o.tags) &&
    typeof o.favorite === 'boolean' &&
    typeof o.createdAt === 'number' &&
    typeof o.updatedAt === 'number'
  );
}

type SortKey = 'newest' | 'oldest';

export function LabNotesPage() {
  const [notes, setNotes] = useState<LabNote[]>(loadNotes);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');
  const [sort, setSort] = useState<SortKey>('newest');
  const [editing, setEditing] = useState<LabNote | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { saveJSON(STORAGE_KEY, notes); }, [notes]);

  const showMsg = useCallback((msg: string) => {
    setFeedback(msg);
    window.setTimeout(() => setFeedback(null), 3000);
  }, []);

  const filtered = notes.filter((n) => {
    if (topic !== 'All' && n.topic !== topic) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q));
    }
    return true;
  }).sort((a, b) => sort === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);

  const addNote = useCallback((data: Omit<LabNote, 'id' | 'createdAt' | 'updatedAt' | 'favorite' | 'illustrative'>) => {
    const now = Date.now();
    const note: LabNote = { ...data, id: uid(), createdAt: now, updatedAt: now, favorite: false };
    setNotes((prev) => [note, ...prev]);
    setShowForm(false);
    showMsg('Note created.');
  }, [showMsg]);

  const updateNote = useCallback((data: Omit<LabNote, 'id' | 'createdAt' | 'updatedAt' | 'favorite' | 'illustrative'>) => {
    if (!editing) return;
    setNotes((prev) => prev.map((n) => n.id === editing.id ? { ...n, ...data, updatedAt: Date.now() } : n));
    setEditing(null);
    showMsg('Note updated.');
  }, [editing, showMsg]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showMsg('Note deleted.');
  }, [showMsg]);

  const toggleFav = useCallback((id: string) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, favorite: !n.favorite } : n));
  }, []);

  const restoreSamples = useCallback(() => {
    if (confirm('Restore the original illustrative entries? Your personal notes will be kept; missing samples will be re-added.')) {
      setNotes((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const toAdd = sampleLabNotes.filter((s) => !existingIds.has(s.id));
        return [...toAdd, ...prev];
      });
      showMsg('Illustrative entries restored.');
    }
  }, [showMsg]);

  const exportNotes = useCallback(() => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `systems-lab-notes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('Notes exported.');
  }, [notes, showMsg]);

  const importNotes = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!Array.isArray(parsed)) { showMsg('Import failed: file is not a list of notes.'); return; }
        const valid = parsed.filter(isLabNote);
        if (valid.length === 0) { showMsg('Import failed: no valid notes found in the file.'); return; }
        setNotes((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const conflicts = valid.filter((v) => existingIds.has(v.id));
          if (conflicts.length > 0) {
            // Re-ID conflicting notes to avoid overwriting
            const safe = valid.map((v) => existingIds.has(v.id) ? { ...v, id: uid() } : v);
            showMsg(`Imported ${valid.length} notes. ${conflicts.length} conflict${conflicts.length === 1 ? '' : 's'} re-added as new entries to avoid overwriting.`);
            return [...safe, ...prev];
          }
          showMsg(`Imported ${valid.length} notes.`);
          return [...valid, ...prev];
        });
      } catch {
        showMsg('Import failed: file is not valid JSON.');
      }
    };
    reader.readAsText(file);
  }, [showMsg]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) importNotes(f);
    e.target.value = '';
  };

  const allTopics = ['All', ...noteTopics];

  return (
    <div>
      <Section className="pt-10 sm:pt-14 pb-6">
        <SectionHeader idx="01 / Notebook" title="Lab Notes" sub="A technical notebook. Browse illustrative example entries, or create your own notes — they persist locally in your browser." />
        <div className="mono text-[10px] ink2 uppercase tracking-wider border-l-2 border-orange pl-3 mb-6">
          Example entries are illustrative notebook entries, not verified quotations or historical records.
        </div>
      </Section>

      {/* Controls */}
      <Section className="py-4 border-y border-divider sticky top-14 z-20 bg-canvas/90 backdrop-blur-sm">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes…"
              aria-label="Search notes"
              className="flex-1 bg-panel border border-divider px-3 py-2 text-sm outline-none focus:border-lime mono"
            />
            <div className="flex items-center gap-2">
              <label className="mono text-[10px] uppercase tracking-wider ink2">Topic</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-panel border border-divider px-2 py-2 text-sm outline-none focus:border-lime mono" aria-label="Filter by topic">
                {allTopics.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <label className="mono text-[10px] uppercase tracking-wider ink2">Sort</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="bg-panel border border-divider px-2 py-2 text-sm outline-none focus:border-lime mono" aria-label="Sort notes">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => { setEditing(null); setShowForm(true); }} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-lime bg-lime text-ink hover:bg-lime/80">+ New Note</button>
            <button onClick={exportNotes} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime">Export JSON</button>
            <button onClick={() => fileInputRef.current?.click()} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime">Import JSON</button>
            <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={onFileChange} className="hidden" aria-hidden="true" />
            <button onClick={restoreSamples} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime ink2">Restore samples</button>
            <span className="mono text-[10px] uppercase tracking-wider ink2 ml-auto">
              {filtered.length} {filtered.length === 1 ? 'note' : 'notes'}
            </span>
          </div>

          {feedback && <div className="mono text-[10px] uppercase tracking-wider text-lime fade-in" role="status">{feedback}</div>}
        </div>
      </Section>

      <Section className="py-8">
        {showForm && <NoteForm onCancel={() => setShowForm(false)} onSave={addNote} />}
        {editing && <NoteForm initial={editing} onCancel={() => setEditing(null)} onSave={updateNote} />}

        {filtered.length === 0 ? (
          <div className="border border-divider py-16 text-center">
            <div className="eyebrow mb-2">No notes</div>
            <p className="text-sm ink2 mb-4">No notes match your search. Create one to get started.</p>
            <button onClick={() => { setEditing(null); setShowForm(true); }} className="mono text-xs uppercase tracking-wider border border-divider hover:border-lime px-4 py-2">+ New Note</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-divider border border-divider">
            {filtered.map((n) => (
              <div key={n.id} className="bg-canvas p-5 sm:p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-divider ink2">{n.topic}</span>
                      {n.favorite && <span className="mono text-[9px] uppercase tracking-wider text-lime">★</span>}
                      {n.illustrative && <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-orange text-orange">Sample</span>}
                    </div>
                    <h3 className="text-base font-semibold mb-1">{n.title}</h3>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => toggleFav(n.id)} aria-label={n.favorite ? 'Unfavorite' : 'Favorite'} className="mono text-[10px] uppercase border border-divider hover:border-lime px-2 py-1">{n.favorite ? '★' : '☆'}</button>
                    <button onClick={() => setEditing(n)} aria-label="Edit note" className="mono text-[10px] uppercase border border-divider hover:border-lime px-2 py-1">Edit</button>
                    <button onClick={() => { if (confirm('Delete this note?')) deleteNote(n.id); }} aria-label="Delete note" className="mono text-[10px] uppercase border border-divider hover:border-orange px-2 py-1 text-orange">Del</button>
                  </div>
                </div>
                <p className="text-sm ink2 leading-relaxed whitespace-pre-wrap mb-3">{n.body}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {n.tags.map((t) => (
                    <span key={t} className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-divider ink2">#{t}</span>
                  ))}
                </div>
                <div className="mono text-[10px] ink2">
                  {new Date(n.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  {n.updatedAt !== n.createdAt && ' · edited ' + new Date(n.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function NoteForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: LabNote;
  onSave: (data: Omit<LabNote, 'id' | 'createdAt' | 'updatedAt' | 'favorite' | 'illustrative'>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [topicSel, setTopicSel] = useState(initial?.topic ?? noteTopics[0]);
  const [tagsStr, setTagsStr] = useState(initial?.tags.join(', ') ?? '');

  const submit = () => {
    if (!title.trim() || !body.trim()) return;
    const tags = tagsStr.split(',').map((t) => t.trim()).filter(Boolean);
    onSave({ title: title.trim(), body: body.trim(), topic: topicSel, tags });
  };

  return (
    <div className="border border-lime bg-canvas p-5 mb-6 fade-in">
      <div className="eyebrow mb-3">{initial ? 'Edit Note' : 'New Note'}</div>
      <label className="block mb-3">
        <span className="mono text-[10px] uppercase tracking-wider ink2">Title *</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 bg-panel border border-divider px-3 py-2 text-sm outline-none focus:border-lime" aria-label="Note title" />
      </label>
      <label className="block mb-3">
        <span className="mono text-[10px] uppercase tracking-wider ink2">Body *</span>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="w-full mt-1 bg-panel border border-divider px-3 py-2 text-sm outline-none focus:border-lime" aria-label="Note body" />
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <label className="block">
          <span className="mono text-[10px] uppercase tracking-wider ink2">Topic</span>
          <select value={topicSel} onChange={(e) => setTopicSel(e.target.value)} className="w-full mt-1 bg-panel border border-divider px-3 py-2 text-sm outline-none focus:border-lime mono" aria-label="Note topic">
            {noteTopics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mono text-[10px] uppercase tracking-wider ink2">Tags (comma-separated)</span>
          <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="robotics, sensors" className="w-full mt-1 bg-panel border border-divider px-3 py-2 text-sm outline-none focus:border-lime mono" aria-label="Note tags" />
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={submit} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-lime bg-lime text-ink">{initial ? 'Save' : 'Create'}</button>
        <button onClick={onCancel} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime">Cancel</button>
      </div>
    </div>
  );
}
