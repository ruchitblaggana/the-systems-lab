import { type ReactNode } from 'react';
import { type ProjectStatus } from '@/data/projects';

export function Section({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`max-w-screen-xl2 mx-auto px-4 sm:px-6 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeader({ idx, title, sub }: { idx: string; title: string; sub?: string }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="eyebrow mb-1">{idx}</div>
      <h2 className="display text-3xl sm:text-4xl md:text-5xl">{title}</h2>
      {sub && <p className="text-sm ink2 mt-2 max-w-2xl">{sub}</p>}
    </div>
  );
}

const statusStyles: Record<ProjectStatus, string> = {
  'Prototype': 'border-orange text-orange',
  'In Progress': 'border-lime text-lime',
  'Experiment': 'border-orange text-orange',
  'Demonstration': 'border-lime text-lime',
  'Completed': 'border-lime text-lime',
  'Project Archive': 'border-divider ink2',
  'Exploration': 'border-divider ink2',
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`mono text-[10px] uppercase tracking-wider px-2 py-0.5 border bg-panel ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

// A button-style link that respects placeholder "#". Shows "Link to be added" tooltip state.
export function LinkButton({
  href,
  label,
  variant = 'primary',
  icon,
}: {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
}) {
  const isPlaceholder = href === '#';
  const base =
    'inline-flex items-center gap-2 px-4 py-2 text-sm border transition-colors mono uppercase tracking-wider';
  const styles = isPlaceholder
    ? 'border-divider ink2 cursor-not-allowed'
    : variant === 'primary'
    ? 'border-lime bg-lime text-ink hover:bg-lime/80'
    : 'border-divider hover:border-lime';

  if (isPlaceholder) {
    return (
      <span className={`${base} ${styles} relative group`} title="Link to be added">
        {icon}
        {label}
        <span className="ml-1 text-[9px] ink2 opacity-60">[pending]</span>
      </span>
    );
  }

  const external = href.startsWith('http');
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`${base} ${styles}`}
    >
      {icon}
      {label}
    </a>
  );
}

export function Pill({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`mono text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-colors ${
        active ? 'border-lime bg-lime/10 text-lime' : 'border-divider hover:border-lime ink2'
      }`}
    >
      {children}
    </button>
  );
}
