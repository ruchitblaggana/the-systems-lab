import { useState, useCallback } from 'react';
import { useRouter, segments } from '@/lib/router';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { SettingsPanel } from '@/components/SettingsPanel';
import { HomePage } from '@/pages/HomePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { PlaygroundPage } from '@/pages/PlaygroundPage';
import { LabNotesPage } from '@/pages/LabNotesPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  const { path } = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const segs = segments(path);
  const page = renderPage(segs);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Nav path={path} />
      <main className="flex-1">{page}</main>
      <Footer />
      {/* Hidden settings trigger button — exposed via the keyboard or a utility menu */}
      <button
        onClick={openSettings}
        className="fixed bottom-4 right-4 z-30 mono text-[10px] uppercase tracking-wider px-3 py-2 border border-divider bg-canvas/90 backdrop-blur-sm hover:border-lime transition-colors shadow-sm"
        aria-label="Open settings"
      >
        Settings
      </button>
      {settingsOpen && <SettingsPanel onClose={closeSettings} />}
    </div>
  );
}

function renderPage(segs: string[]): React.ReactNode {
  if (segs.length === 0) return <HomePage />;

  const [first, second, ...rest] = segs;

  if (first === 'projects') {
    if (second && !rest.length) return <ProjectDetailPage slug={second} />;
    if (!second) return <ProjectsPage />;
  }
  if (first === 'playground' && !second) return <PlaygroundPage />;
  if (first === 'lab-notes' && !second) return <LabNotesPage />;
  if (first === 'about' && !second) return <AboutPage />;
  if (first === 'contact' && !second) return <ContactPage />;

  return <NotFoundPage />;
}

export default App;
