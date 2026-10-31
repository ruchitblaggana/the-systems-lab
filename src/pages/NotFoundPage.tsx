import { Link } from '@/lib/Link';
import { Section } from '@/components/ui';

export function NotFoundPage() {
  return (
    <div>
      <Section className="pt-20 pb-20 text-center">
        <div className="eyebrow mb-4">404 / Route Not Found</div>
        <h1 className="display text-6xl sm:text-8xl mb-6">404</h1>
        <p className="text-base ink2 mb-2 max-w-md mx-auto">
          This route is not part of the system. The page you are looking for does not exist or has been moved.
        </p>
        <p className="mono text-[10px] ink2 mb-8">ERR: NO_ROUTE_FOUND</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm border border-lime bg-lime text-ink font-medium hover:bg-lime/80 transition-colors mono uppercase tracking-wider">
            Return Home
          </Link>
          <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm border border-divider hover:border-lime transition-colors mono uppercase tracking-wider">
            View Projects
          </Link>
        </div>

        {/* decorative grid */}
        <div className="mt-16 grid grid-cols-5 sm:grid-cols-10 gap-px max-w-lg mx-auto">
          {Array.from({ length: 50 }).map((_, i) => {
            const lit = (i * 7) % 13 === 3 || (i * 3) % 11 === 5;
            return <div key={i} className={`aspect-square ${lit ? 'bg-lime/30' : 'bg-divider/30'}`} />;
          })}
        </div>
      </Section>
    </div>
  );
}
