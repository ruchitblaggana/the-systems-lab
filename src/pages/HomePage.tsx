import { Link } from '@/lib/Link';
import { SystemExplorer } from '@/components/SystemExplorer';
import { Section, StatusBadge } from '@/components/ui';
import { projects } from '@/data/projects';
import { useReveal } from '@/lib/useReveal';

function StatusStrip() {
  const items = [
    { label: 'Discipline', value: 'Computer Science' },
    { label: 'Exploration', value: 'Robotics & Intelligent Systems' },
    { label: 'Approach', value: 'Observe → Model → Test → Refine' },
    { label: 'Environment', value: 'Experimental / Project-Based' },
  ];
  return (
    <div className="border-y border-divider bg-panel overflow-x-auto">
      <div className="max-w-screen-xl2 mx-auto px-4 sm:px-6 flex flex-wrap md:flex-nowrap divide-x divide-divider min-w-max md:min-w-0">
        {items.map((it) => (
          <div key={it.label} className="px-4 md:px-6 py-3 flex-1 min-w-[220px]">
            <div className="mono text-[10px] uppercase tracking-wider ink2 mb-0.5">{it.label}</div>
            <div className="text-sm font-medium">{it.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedPreview() {
  const featured = projects.slice(0, 3);
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <Section className="py-16 sm:py-20">
      <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="eyebrow mb-1">02 / Featured Work</div>
            <h2 className="display text-3xl sm:text-4xl">Selected projects</h2>
          </div>
          <Link to="/projects" className="mono text-xs uppercase tracking-wider hover:text-lime hidden sm:block">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-divider border border-divider">
          {featured.map((p) => (
            <Link key={p.slug} to={`/projects/${p.slug}`} className="bg-canvas p-6 hover:bg-panel transition-colors group block">
              <div className="flex items-start justify-between mb-4">
                <span className="mono text-xs ink2">{p.number}</span>
                <StatusBadge status={p.status} />
              </div>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-lime transition-colors">{p.title}</h3>
              <p className="text-sm ink2 mb-3">{p.tagline}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.categories.map((c) => (
                  <span key={c} className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-divider ink2">{c}</span>
                ))}
              </div>
              <div className="mt-4 mono text-[10px] uppercase tracking-wider text-lime">Explore →</div>
            </Link>
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link to="/projects" className="mono text-xs uppercase tracking-wider hover:text-lime">View all projects →</Link>
        </div>
      </div>
    </Section>
  );
}

function ApproachBand() {
  const steps = ['Observe', 'Question', 'Model', 'Build', 'Test', 'Refine'];
  return (
    <Section className="py-16 sm:py-20 border-t border-divider">
      <div className="eyebrow mb-1">03 / Method</div>
      <h2 className="display text-3xl sm:text-4xl mb-8">How problems get approached</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-divider border border-divider">
        {steps.map((s, i) => (
          <div key={s} className="bg-canvas p-4 sm:p-5">
            <div className="mono text-[10px] ink2 mb-1">{String(i + 1).padStart(2, '0')}</div>
            <div className="font-semibold text-sm">{s}</div>
          </div>
        ))}
      </div>
      <p className="text-sm ink2 mt-4 max-w-2xl">
        This describes the approach encouraged by the portfolio — not a claim that every project followed an identical documented process.
      </p>
    </Section>
  );
}

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <Section className="pt-10 sm:pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left */}
          <div className="lg:col-span-6">
            <div className="eyebrow mb-4">FIELD NOTES / COMPUTER SCIENCE / SYSTEMS THINKING</div>
            <h1 className="display text-4xl sm:text-6xl lg:text-7xl mb-6">
              Curious by design.<br />
              Engineered to solve.
            </h1>
            <p className="text-base ink2 leading-relaxed max-w-md mb-6">
              I'm Ruchit Blaggana, a student exploring Computer Science, robotics, and intelligent systems through hands-on projects, experiments, and problem-solving.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm border border-lime bg-lime text-ink font-medium hover:bg-lime/80 transition-colors mono uppercase tracking-wider">
                Explore Projects
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm border border-divider hover:border-lime transition-colors mono uppercase tracking-wider">
                Meet the Builder
              </Link>
            </div>
            <div className="mono text-[10px] uppercase tracking-wider ink2 border-l-2 border-lime pl-3">
              Current focus: Software · Robotics · Systems
            </div>
          </div>

          {/* Right — System Explorer */}
          <div className="lg:col-span-6">
            <SystemExplorer />
          </div>
        </div>

        {/* Scroll cue */}
        <div className="mt-12 flex items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-wider ink2">Scroll to explore</span>
          <svg width="60" height="10" viewBox="0 0 60 10" fill="none" aria-hidden="true">
            <path d="M0 5h54m0 0-5-4m5 4-5 4" stroke="currentColor" className="ink2" strokeWidth="1" />
          </svg>
        </div>
      </Section>

      <StatusStrip />

      <FeaturedPreview />
      <ApproachBand />
    </div>
  );
}
