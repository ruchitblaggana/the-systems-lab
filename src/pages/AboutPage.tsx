import { useState } from 'react';
import { Link } from '@/lib/Link';
import { Section, SectionHeader, StatusBadge } from '@/components/ui';
import { getProject } from '@/data/projects';
import { timelineItems, timelineCategories, type TimelineItem } from '@/data/timeline';

function AcademicSnapshot() {
  const rows = [
    { label: 'Name', value: 'Ruchit Blaggana' },
    { label: 'School', value: 'Delhi Public School, Vasant Kunj, New Delhi' },
    { label: 'Current level', value: 'Grade 12 — Pursuing' },
    { label: 'Subjects', value: 'Physics, Chemistry, Mathematics, Computer Science, English' },
    { label: 'Areas of interest', value: 'Computer Science, AI/ML, Robotics, Systems Thinking' },
  ];
  return (
    <div className="border border-divider bg-panel">
      <div className="eyebrow p-4 border-b border-divider">Academic Snapshot</div>
      <div className="divide-y divide-divider">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-3 gap-2 px-4 py-3">
            <div className="mono text-[10px] uppercase tracking-wider ink2 self-center">{r.label}</div>
            <div className="col-span-2 text-sm">{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AcademicRecord() {
  const records = [
    { grade: 'Grade 12', result: 'Pursuing' },
    { grade: 'Grade 11', result: '80.4%' },
    { grade: 'Grade 10', result: '94.4%' },
    { grade: 'Grade 9', result: '93.2%' },
  ];
  const max = 100;
  return (
    <div>
      <div className="eyebrow mb-3">Academic Record</div>
      <div className="space-y-2">
        {records.map((r) => {
          const pct = r.result === 'Pursuing' ? null : Number(r.result.replace('%', ''));
          return (
            <div key={r.grade} className="flex items-center gap-4">
              <div className="mono text-xs w-20 ink2">{r.grade}</div>
              <div className="flex-1 h-6 border border-divider bg-panel relative overflow-hidden">
                {pct !== null && (
                  <div className="h-full bg-lime/40" style={{ width: `${(pct / max) * 100}%` }} />
                )}
                <div className="absolute inset-0 flex items-center px-2 mono text-xs font-medium">
                  {r.result}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mono text-[10px] ink2 mt-2">Percentages shown separately. Not combined into a cumulative score.</p>
    </div>
  );
}

function Achievements() {
  const [open, setOpen] = useState(false);
  const awards = [
    'Gold Medal in Academic Excellence, Grade 11',
    'Scholar Badge of Excellence, received consistently',
    'Regional Rank 3 and School Rank 1 in Vigyan Vidyarthi Manthan (VVM)',
    'Second prize in a national photography competition',
    'Certificate of Recognition in the World Environment Day global quiz',
    'Certificate of Distinction in the CMS Environmental Quiz',
    'Contribution to the winning team at the Inter-School Luminaire Competition (Rolling Trophy)',
    'Bronze Medal in the Inter-School Swimming Competition, 2024',
  ];
  return (
    <div>
      <div className="eyebrow mb-3">Recognition</div>
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between border border-divider p-4 bg-panel hover:border-lime transition-colors">
        <span className="text-sm font-medium">{awards.length} awards and certificates</span>
        <span className="mono text-xs ink2">{open ? 'Hide' : 'Expand'}</span>
      </button>
      {open && (
        <ul className="border border-divider border-t-0 divide-y divide-divider bg-canvas">
          {awards.map((a, i) => (
            <li key={i} className="px-4 py-3 flex items-start gap-3">
              <span className="mono text-[10px] ink2 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-sm">{a}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Timeline() {
  const [filter, setFilter] = useState<(typeof timelineCategories)[number]>('All');
  const [selected, setSelected] = useState<TimelineItem | null>(null);

  const filtered = filter === 'All' ? timelineItems : timelineItems.filter((t) => t.category === filter);

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="eyebrow mb-1">Timeline</div>
          <h2 className="display text-2xl sm:text-3xl">Academic & Project Timeline</h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {timelineCategories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`mono text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-colors ${filter === c ? 'border-lime bg-lime/10 text-lime' : 'border-divider hover:border-lime ink2'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="relative pl-6 border-l border-divider space-y-4">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`block w-full text-left -ml-6 pl-6 py-3 border-l-2 transition-colors ${selected?.id === item.id ? 'border-lime' : 'border-transparent hover:border-divider'}`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="mono text-[10px] uppercase tracking-wider ink2 shrink-0 w-28">{item.period}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.title}</span>
                      <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-divider ink2">{item.category}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-20">
            {selected ? (
              <div className="border border-divider bg-panel p-5 fade-in">
                <div className="eyebrow mb-1">{selected.category}</div>
                <h3 className="font-semibold mb-1">{selected.title}</h3>
                <div className="mono text-[10px] ink2 mb-3">{selected.period}</div>
                <p className="text-sm ink2 leading-relaxed">{selected.description}</p>
              </div>
            ) : (
              <div className="border border-divider bg-panel p-5">
                <p className="text-sm ink2">Select a timeline item to see its details. Items are grouped by category; dates are shown only where known.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mono text-[10px] ink2 mt-4">
        Events whose dates are unknown are grouped by category, not placed in a fabricated chronological order.
      </p>
    </div>
  );
}

export function AboutPage() {
  const smartHat = getProject('smart-hat')!;
  const approachSteps = [
    { label: 'Observe', desc: 'Notice a problem or a system behavior that seems worth understanding.' },
    { label: 'Question', desc: 'Ask what is actually happening and what would need to change for it to work better.' },
    { label: 'Model', desc: 'Sketch the system, its inputs, outputs, and dependencies. Make the relationships explicit.' },
    { label: 'Build', desc: 'Build a prototype or simulation — as simple as possible, but no simpler.' },
    { label: 'Test', desc: 'Run it. See where it breaks. Do not hide the failures — they are the most informative part.' },
    { label: 'Refine', desc: 'Change one thing at a time. Test again. Repeat until the model and the world agree.' },
  ];

  return (
    <div>
      <Section className="pt-10 sm:pt-14 pb-10">
        <SectionHeader idx="01 / About" title="About" />
      </Section>

      {/* Intro */}
      <Section className="py-8 border-y border-divider">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <h2 className="display text-3xl sm:text-4xl mb-6">Building is how I understand.</h2>
            <div className="space-y-4 text-base ink2 leading-relaxed max-w-2xl">
              <p>I'm Ruchit Blaggana, a Grade 12 student at Delhi Public School, Vasant Kunj, New Delhi. My academic interests span Physics, Mathematics, and Computer Science, and I'm particularly curious about how intelligent systems interact with the physical world.</p>
              <p>From exploring assistive technology with Arduino and ultrasonic sensors to investigating software tools and system simulations, I enjoy approaching problems by breaking them down, testing ideas, and learning from limitations.</p>
              <p>The Systems Lab is a space to document that process: the questions, the experiments, the technical decisions, and the ideas worth exploring next.</p>
            </div>
          </div>
          <div className="lg:col-span-5">
            {/* Portrait placeholder — no real portrait provided */}
            <div className="border border-divider bg-panel p-8 aspect-square flex flex-col items-center justify-center text-center">
              <svg width="64" height="64" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="mb-3 opacity-60">
                <circle cx="7" cy="9" r="2.2" fill="#C8F169" />
                <circle cx="25" cy="7" r="2" fill="#C8F169" />
                <circle cx="16" cy="22" r="2.4" fill="#F18B50" />
                <circle cx="25" cy="24" r="1.8" fill="#C8F169" />
                <path d="M7 9 L16 22 L25 7 M16 22 L25 24" stroke="#C8F169" strokeWidth="1.1" opacity="0.55" />
              </svg>
              <div className="eyebrow">Portrait to be added</div>
              <p className="mono text-[10px] ink2 mt-2">A real portrait will appear here when provided.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Snapshot + Record */}
      <Section className="py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AcademicSnapshot />
        <div className="space-y-6">
          <AcademicRecord />
        </div>
      </Section>

      {/* Achievements */}
      <Section className="py-10 border-t border-divider">
        <Achievements />
      </Section>

      {/* Research */}
      <Section className="py-10 border-t border-divider grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="eyebrow mb-2">Research & Innovation</div>
          <h2 className="display text-2xl">Research and innovation</h2>
        </div>
        <div className="lg:col-span-8 space-y-4">
          <div className="border border-divider p-5 bg-panel">
            <div className="flex items-center gap-2 mb-2">
              <span className="mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-orange text-orange">Pending</span>
              <span className="font-medium">Patent application pending</span>
            </div>
            <p className="text-sm ink2 leading-relaxed">Co-developed an innovative instrument for which a patent application has been filed and is currently under review. Not an awarded or granted patent.</p>
          </div>
          <div className="border border-divider p-5 bg-panel">
            <div className="flex items-center gap-2 mb-2">
              <span className="mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-divider ink2">Under publication</span>
              <span className="font-medium">Research contribution</span>
            </div>
            <p className="text-sm ink2 leading-relaxed">Contributed data compilation and research support to a dentistry-related article under publication. Not sole authorship; the article is not yet published.</p>
          </div>
        </div>
      </Section>

      {/* Leadership */}
      <Section className="py-10 border-t border-divider grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="eyebrow mb-2">Leadership & Community</div>
          <h2 className="display text-2xl">Leadership and service</h2>
        </div>
        <div className="lg:col-span-8">
          <ul className="space-y-2">
            {[
              'Secretary, Interact Club — participation in outreach, fundraising, and social-impact initiatives.',
              'Financial-literacy workshop for government-school students.',
              'Fundraising activities supporting an orphanage and welfare initiatives.',
              'Paper-recycling and textile-sustainability collection drives.',
              'Volunteering with Earth Saviours Foundation, supporting homeless and elderly residents through assistance with medicines, caregiving, reading, and everyday support.',
            ].map((item, i) => (
              <li key={i} className="border border-divider p-4 bg-panel flex items-start gap-3">
                <span className="mono text-[10px] ink2 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mono text-[10px] ink2 mt-3">No hours volunteered, funds raised, people reached, or quantified impact are claimed.</p>
        </div>
      </Section>

      {/* Featured project */}
      <Section className="py-10 border-t border-divider">
        <div className="eyebrow mb-1">Featured Engineering Project</div>
        <h2 className="display text-2xl mb-6">Smart Hat for the Visually Impaired</h2>
        <Link to={`/projects/${smartHat.slug}`} className="block border border-divider bg-panel p-6 hover:border-lime transition-colors group">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="mono text-xs ink2">{smartHat.number}</span>
                <StatusBadge status={smartHat.status} />
              </div>
              <p className="text-sm ink2 mb-3">{smartHat.summary}</p>
              <div className="mono text-[10px] uppercase tracking-wider text-lime">View full project →</div>
            </div>
            <div className="border border-divider p-3 bg-canvas">
              <svg viewBox="0 0 200 80" className="w-full" aria-hidden="true">
                <rect x="10" y="30" width="30" height="20" fill="none" stroke="currentColor" className="ink2" strokeWidth="1" />
                <text x="25" y="44" textAnchor="middle" fontSize="6" className="mono ink2">SENSOR</text>
                <path d="M40 40 L80 40" stroke="currentColor" className="ink2" strokeWidth="1" />
                <circle cx="100" cy="40" r="16" fill="none" stroke="#C8F169" strokeWidth="1.2" />
                <text x="100" y="44" textAnchor="middle" fontSize="7" className="mono">UNO</text>
                <path d="M116 40 L150 40" stroke="currentColor" className="ink2" strokeWidth="1" />
                <rect x="155" y="32" width="30" height="16" fill="none" stroke="#F18B50" strokeWidth="1" />
                <text x="170" y="43" textAnchor="middle" fontSize="6" className="mono">ALERT</text>
              </svg>
            </div>
          </div>
        </Link>
      </Section>

      {/* Personal approach */}
      <Section className="py-10 border-t border-divider">
        <div className="eyebrow mb-1">Personal Approach</div>
        <h2 className="display text-2xl mb-6">How problems get approached</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-divider border border-divider">
          {approachSteps.map((s, i) => (
            <div key={s.label} className="bg-canvas p-4">
              <div className="mono text-[10px] ink2 mb-1">{String(i + 1).padStart(2, '0')}</div>
              <div className="font-semibold text-sm mb-1">{s.label}</div>
              <div className="text-xs ink2 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
        <p className="mono text-[10px] ink2 mt-3">This describes the approach encouraged by the portfolio — not a claim that every project followed an identical documented process.</p>
      </Section>

      {/* Timeline */}
      <Section className="py-10 border-t border-divider">
        <Timeline />
      </Section>
    </div>
  );
}
