import { Link } from '@/lib/Link';
import { contactLinks } from '@/data/links';

export function Footer() {
  const year = new Date().getFullYear();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-divider mt-20">
      <div className="max-w-screen-xl2 mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="7" cy="9" r="2.2" fill="#C8F169" />
                <circle cx="25" cy="7" r="2" fill="#C8F169" />
                <circle cx="16" cy="22" r="2.4" fill="#F18B50" />
                <circle cx="25" cy="24" r="1.8" fill="#C8F169" />
                <path d="M7 9 L16 22 L25 7 M16 22 L25 24" stroke="#C8F169" strokeWidth="1.1" opacity="0.55" />
              </svg>
              <span className="font-bold text-sm tracking-tight">THE SYSTEMS LAB</span>
            </div>
            <p className="text-sm ink2 max-w-xs">Curious by design. Engineered to solve.</p>
            <p className="mono text-[10px] ink2 mt-3 uppercase tracking-wider">A student-built portfolio of projects, experiments, and ideas.</p>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow mb-3">Navigate</div>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/projects" className="hover:text-lime">Projects</Link></li>
              <li><Link to="/playground" className="hover:text-lime">Systems Playground</Link></li>
              <li><Link to="/lab-notes" className="hover:text-lime">Lab Notes</Link></li>
              <li><Link to="/about" className="hover:text-lime">About</Link></li>
              <li><Link to="/contact" className="hover:text-lime">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="eyebrow mb-3">Connect</div>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a href={`mailto:${contactLinks.email}`} className="hover:text-lime">{contactLinks.email}</a>
              </li>
              {(['linkedin', 'github', 'resume', 'other'] as const).map((k) => (
                <li key={k}>
                  {contactLinks[k] === '#' ? (
                    <span className="ink2 italic">{labelFor(k)} — Link to be added</span>
                  ) : (
                    <a href={contactLinks[k]} target="_blank" rel="noopener noreferrer" className="hover:text-lime capitalize">{labelFor(k)}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-divider mt-8 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="mono text-[10px] ink2 uppercase tracking-wider">© {year} The Systems Lab · Ruchit Blaggana</p>
          <button onClick={scrollTop} className="mono text-[10px] uppercase tracking-wider hover:text-lime flex items-center gap-1">
            Back to top
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

function labelFor(k: string): string {
  return k.charAt(0).toUpperCase() + k.slice(1);
}
