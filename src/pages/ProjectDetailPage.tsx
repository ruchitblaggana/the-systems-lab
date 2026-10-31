import { type ReactNode } from 'react';
import { Link } from '@/lib/Link';
import { Section, StatusBadge, LinkButton } from '@/components/ui';
import { type ProjectMeta, getProject, projects } from '@/data/projects';

export function ProjectDetailLayout({ project, demo }: { project: ProjectMeta; demo?: ReactNode }) {
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <article>
      {/* Header */}
      <Section className="pt-10 sm:pt-14 pb-8">
        <Link to="/projects" className="mono text-[10px] uppercase tracking-wider ink2 hover:text-lime mb-6 inline-block">
          ← Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="eyebrow mb-2">Project {project.number} / {project.categories.join(' · ')}</div>
            <h1 className="display text-4xl sm:text-5xl lg:text-6xl">{project.title}</h1>
            <p className="text-lg ink2 mt-3">{project.tagline}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span key={t} className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-divider ink2">{t}</span>
          ))}
        </div>
      </Section>

      {/* Summary */}
      <Section className="py-6 border-y border-divider">
        <p className="text-lg sm:text-xl leading-relaxed max-w-3xl">{project.summary}</p>
      </Section>

      {/* Problem */}
      <Section className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="eyebrow mb-2">01 / Problem</div>
          <h2 className="display text-2xl">The problem being explored</h2>
        </div>
        <div className="lg:col-span-8">
          <p className="text-base leading-relaxed mb-4">{project.problem}</p>
          <div className="border-l-2 border-lime pl-4">
            <div className="eyebrow mb-1">Why it matters</div>
            <p className="text-base ink2 leading-relaxed">{project.whyItMatters}</p>
          </div>
        </div>
      </Section>

      {/* Approach + Architecture */}
      <Section className="py-10 border-t border-divider grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="eyebrow mb-2">02 / Approach</div>
          <h2 className="display text-2xl">Design approach</h2>
        </div>
        <div className="lg:col-span-8">
          <p className="text-base leading-relaxed">{project.approach}</p>
        </div>
      </Section>

      {/* Demo */}
      {demo && (
        <Section className="py-10 border-t border-divider">
          <div className="eyebrow mb-2">03 / Demonstration</div>
          <h2 className="display text-2xl mb-6">Interactive demonstration</h2>
          {demo}
        </Section>
      )}

      {/* Constraints */}
      <Section className="py-10 border-t border-divider grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="eyebrow mb-2">{demo ? '04' : '03'} / Constraints</div>
          <h2 className="display text-2xl">Constraints & limitations</h2>
        </div>
        <div className="lg:col-span-8">
          <div className="border border-divider p-5 bg-panel">
            <p className="text-base leading-relaxed">{project.constraints}</p>
          </div>
        </div>
      </Section>

      {/* Future */}
      <Section className="py-10 border-t border-divider grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="eyebrow mb-2">{demo ? '05' : '04'} / Next</div>
          <h2 className="display text-2xl">What could be improved</h2>
        </div>
        <div className="lg:col-span-8">
          <p className="text-base leading-relaxed">{project.futureWork}</p>
        </div>
      </Section>

      {/* Links */}
      <Section className="py-10 border-t border-divider">
        <div className="eyebrow mb-2">{demo ? '06' : '05'} / Links</div>
        <h2 className="display text-2xl mb-4">Project links</h2>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={project.links.live} label="Live Demo" />
          <LinkButton href={project.links.repository} label="Source Code" variant="secondary" />
        </div>
      </Section>

      {/* Nav between projects */}
      <Section className="py-10 border-t border-divider">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-divider border border-divider">
          <div>
            {prev && (
              <Link to={`/projects/${prev.slug}`} className="block bg-canvas hover:bg-panel p-5 transition-colors group">
                <div className="mono text-[10px] uppercase tracking-wider ink2 mb-1">← Previous</div>
                <div className="font-medium group-hover:text-lime transition-colors">{prev.title}</div>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link to={`/projects/${next.slug}`} className="block bg-canvas hover:bg-panel p-5 transition-colors group">
                <div className="mono text-[10px] uppercase tracking-wider ink2 mb-1">Next →</div>
                <div className="font-medium group-hover:text-lime transition-colors">{next.title}</div>
              </Link>
            )}
          </div>
        </div>
      </Section>
    </article>
  );
}

export function ProjectDetailPage({ slug }: { slug: string }) {
  const project = getProject(slug);
  if (!project) {
    return (
      <Section className="py-20 text-center">
        <h1 className="display text-3xl mb-4">Project not found</h1>
        <Link to="/projects" className="mono text-xs uppercase tracking-wider hover:text-lime">← Back to Projects</Link>
      </Section>
    );
  }
  const demo = renderDemo(slug);
  return <ProjectDetailLayout project={project} demo={demo} />;
}

function renderDemo(slug: string): ReactNode | undefined {
  switch (slug) {
    case 'smart-hat': return <SmartHatDiagram />;
    case 'claimlens': return <ClaimLensDemo />;
    case 'cascade-protocol': return <CascadeDemo />;
    case 'blindspot': return <BlindspotDemo />;
    default: return undefined;
  }
}

// --- Smart Hat system diagram ---
function SmartHatDiagram() {
  const steps = [
    { label: 'Ultrasonic Sensor', desc: 'Emits a pulse and measures the time until the echo returns to calculate distance.', color: '#C8F169' },
    { label: 'Arduino Uno', desc: 'Microcontroller that reads the sensor and runs the detection logic.', color: '#C8F169' },
    { label: 'Detection Logic', desc: 'Compares the measured distance against a threshold. If an object is closer than the threshold, it triggers an alert.', color: '#F18B50' },
    { label: 'Alert Output', desc: 'A buzzer or similar output device signals the wearer that an obstacle is nearby.', color: '#F18B50' },
  ];
  return (
    <div className="border border-divider bg-panel p-6">
      <div className="eyebrow mb-4">System Architecture / Signal Flow</div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-divider border border-divider mb-6">
        {steps.map((s, i) => (
          <div key={s.label} className="bg-canvas p-4 relative">
            <div className="mono text-[10px] ink2 mb-1">{String(i + 1).padStart(2, '0')}</div>
            <div className="w-3 h-3 mb-2" style={{ backgroundColor: s.color }} />
            <div className="font-semibold text-sm mb-1">{s.label}</div>
            <div className="text-xs ink2 leading-relaxed">{s.desc}</div>
            {i < 3 && (
              <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 ink2">→</div>
            )}
          </div>
        ))}
      </div>
      <div className="mono text-[10px] ink2 uppercase tracking-wider">
        Illustrative architecture. Sensor range, orientation, and environmental conditions affect real-world detection.
      </div>
    </div>
  );
}

// Placeholder imports for demos that live in separate files — built next.
import { ClaimLensDemo } from '@/components/demos/ClaimLensDemo';
import { CascadeDemo } from '@/components/demos/CascadeDemo';
import { BlindspotDemo } from '@/components/demos/BlindspotDemo';
