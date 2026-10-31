import { projects } from '@/data/projects';
import { sampleLabNotes } from '@/data/labNotes';

export interface SearchResult {
  id: string;
  type: 'Project' | 'Lab Note' | 'Page';
  title: string;
  description: string;
  path: string;
}

const pageResults: SearchResult[] = [
  { id: 'page-home', type: 'Page', title: 'Home', description: 'The Systems Lab — overview and system explorer.', path: '/' },
  { id: 'page-projects', type: 'Page', title: 'Projects', description: 'Interactive engineering project archive.', path: '/projects' },
  { id: 'page-playground', type: 'Page', title: 'Systems Playground', description: 'Hands-on browser experiments.', path: '/playground' },
  { id: 'page-lab-notes', type: 'Page', title: 'Lab Notes', description: 'Personal experiment notebook.', path: '/lab-notes' },
  { id: 'page-about', type: 'Page', title: 'About', description: 'About Ruchit Blaggana.', path: '/about' },
  { id: 'page-timeline', type: 'Page', title: 'Timeline', description: 'Academic and project timeline.', path: '/about' },
  { id: 'page-contact', type: 'Page', title: 'Contact', description: 'Get in touch.', path: '/contact' },
];

export function search(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const projectResults: SearchResult[] = projects.map((p) => ({
    id: 'project-' + p.slug,
    type: 'Project',
    title: p.title,
    description: p.summary,
    path: '/projects/' + p.slug,
  }));

  const noteResults: SearchResult[] = sampleLabNotes.map((n) => ({
    id: 'note-' + n.id,
    type: 'Lab Note',
    title: n.title,
    description: n.body.slice(0, 120),
    path: '/lab-notes',
  }));

  const aboutResults: SearchResult[] = [
    { id: 'about-approach', type: 'Page', title: 'Personal Approach', description: 'Observe → Question → Model → Build → Test → Refine.', path: '/about' },
    { id: 'about-record', type: 'Page', title: 'Academic Record', description: 'Grade 9, 10, 11 results and Grade 12 pursuing.', path: '/about' },
    { id: 'about-research', type: 'Page', title: 'Research & Innovation', description: 'Patent pending and research contribution.', path: '/about' },
    { id: 'about-leadership', type: 'Page', title: 'Leadership & Community', description: 'Interact Club, volunteering, sustainability drives.', path: '/about' },
    { id: 'about-awards', type: 'Page', title: 'Recognition', description: 'Awards and certificates of achievement.', path: '/about' },
  ];

  const all = [...projectResults, ...noteResults, ...pageResults, ...aboutResults];
  return all.filter(
    (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
  );
}
