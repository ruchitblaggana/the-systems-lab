import { projectLinks, type LinkPair } from './links';

export type ProjectStatus =
  | 'Prototype'
  | 'In Progress'
  | 'Experiment'
  | 'Demonstration'
  | 'Completed'
  | 'Project Archive'
  | 'Exploration';

export type ProjectCategory =
  | 'Robotics'
  | 'Browser Tools'
  | 'Simulations'
  | 'Computer Science'
  | 'Research & Exploration';

export interface ProjectMeta {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  categories: ProjectCategory[];
  status: ProjectStatus;
  summary: string;
  problem: string;
  whyItMatters: string;
  approach: string;
  constraints: string;
  futureWork: string;
  tags: string[];
  links: LinkPair;
}

export const projects: ProjectMeta[] = [
  {
    slug: 'smart-hat',
    number: '01',
    title: 'Smart Hat for the Visually Impaired',
    tagline: 'A wearable concept for safer navigation.',
    categories: ['Robotics', 'Research & Exploration'],
    status: 'Prototype',
    summary:
      'A prototype developed through an AI/ML/Robotics summer program at IIT Delhi via Rancho Labs. The project uses an Arduino Uno and ultrasonic sensing to detect overhead obstacles and provide alerts.',
    problem:
      'Visually impaired individuals often rely on a cane, which primarily detects ground-level obstacles. Overhead and upper-body hazards — low branches, hanging objects, projecting ledges — can go unnoticed and cause injury.',
    whyItMatters:
      'A low-cost wearable that detects obstacles above the cane line could add a layer of awareness for hazards the cane cannot reach, making everyday navigation safer.',
    approach:
      'Build a wearable that pairs an ultrasonic sensor with an Arduino Uno. The sensor measures distance to nearby objects; detection logic determines whether something is close enough to trigger an alert, which is delivered through a small output device (buzzer or similar).',
    constraints:
      'Single ultrasonic sensors have a limited field of detection — both in angular range and in the direction the sensor is aimed. Detection can be affected by surface material, angle of incidence, and environmental interference. The prototype explores the concept and does not guarantee comprehensive coverage or user safety.',
    futureWork:
      'Add additional sensors for wider coverage, refine the alert logic to distinguish object types and distances, and investigate wearable form-factor improvements for comfort and daily use.',
    tags: ['Arduino', 'Ultrasonic', 'Assistive Tech', 'Wearable'],
    links: projectLinks.smartHat,
  },
  {
    slug: 'claimlens',
    number: '02',
    title: 'ClaimLens',
    tagline: 'Read beyond the claim.',
    categories: ['Browser Tools', 'Computer Science'],
    status: 'Demonstration',
    summary:
      'A browser-extension concept for capturing claims encountered online and organizing related notes and evidence. The portfolio includes a working local claim-management demo.',
    problem:
      'When reading online, we encounter claims constantly — in articles, posts, and product pages. Without a way to capture and revisit them, it is hard to track what was claimed, where, and what evidence we gathered afterwards.',
    whyItMatters:
      'Building a personal record of claims helps develop the habit of reading critically — pausing to ask what a statement asserts and where the evidence leads.',
    approach:
      'A browser extension would let a reader select a passage, save it as a claim with a source URL, and add personal notes and category tags. Within this portfolio, a local demonstration implements the same claim-management workflow entirely in the browser.',
    constraints:
      'The local demo runs only on this website and stores claims in the browser. The separately installable browser extension is a concept — ClaimLens does not automatically verify whether a claim is factually correct.',
    futureWork:
      'Implement the actual browser extension, add cross-device sync, and explore optional evidence-attachment and source-comparison features.',
    tags: ['Browser Extension', 'Critical Reading', 'Local Storage'],
    links: projectLinks.claimLens,
  },
  {
    slug: 'cascade-protocol',
    number: '03',
    title: 'Cascade Protocol',
    tagline: 'One failure changes everything.',
    categories: ['Simulations', 'Computer Science'],
    status: 'Demonstration',
    summary:
      'A city-infrastructure simulation exploring how a disruption in one system can affect connected services. The model runs locally and visualizes cascading dependency failures.',
    problem:
      'Urban systems — electricity, water, transport, communications, emergency services — do not operate in isolation. When one fails, the disruption can propagate through dependencies to systems that seem unrelated.',
    whyItMatters:
      'Understanding dependency chains helps anticipate which systems fail together, and which are most critical to restore first.',
    approach:
      'Model each infrastructure system as a node with explicit dependencies. When a system is disrupted, the simulator propagates the failure to every system that depends on it — directly and downstream — using deterministic rules.',
    constraints:
      'This is an illustrative model with simplified dependencies. It does not predict real-world infrastructure behavior or account for load redistribution, partial capacity, or human response.',
    futureWork:
      'Add partial-capacity states, recovery sequencing, and weighted dependency strengths to model more realistic restoration paths.',
    tags: ['Simulation', 'Systems Thinking', 'Dependencies'],
    links: projectLinks.cascadeProtocol,
  },
  {
    slug: 'blindspot',
    number: '04',
    title: 'Blindspot: Robot Trials',
    tagline: 'Intelligence begins where vision ends.',
    categories: ['Robotics', 'Simulations'],
    status: 'Experiment',
    summary:
      'A browser-based robotics simulation concept exploring how a robot can navigate an environment using sensor inputs, movement decisions, and imperfect information.',
    problem:
      'A robot that cannot see its full environment must still decide how to move. How does it plan a path, avoid obstacles, and reach a destination with limited and imperfect information?',
    whyItMatters:
      'Navigation under uncertainty is a core problem in robotics. Simulating it lets you test algorithms cheaply and understand their trade-offs before committing to hardware.',
    approach:
      'A grid-based environment with obstacles, a start, and a destination. A pathfinding algorithm (breadth-first search or A*) computes a route. The robot moves step by step, and the simulator explains each decision. Users can edit the grid, run, step, pause, and reset.',
    constraints:
      'The simulation is deterministic and grid-based. It does not model continuous dynamics, sensor noise, or physical friction. No claim is made that this robot has been tested on physical hardware.',
    futureWork:
      'Add continuous-space movement, sensor-noise simulation, and alternative heuristics for comparison.',
    tags: ['Pathfinding', 'BFS', 'Grid Simulation', 'Robotics'],
    links: projectLinks.blindspot,
  },
];

export const projectCategoryOrder: (ProjectCategory | 'All Projects')[] = [
  'All Projects',
  'Robotics',
  'Browser Tools',
  'Simulations',
  'Computer Science',
  'Research & Exploration',
];

export function getProject(slug: string): ProjectMeta | undefined {
  return projects.find((p) => p.slug === slug);
}
