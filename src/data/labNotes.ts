// Illustrative notebook entries — NOT verified quotations or historical records of Ruchit's work.
// These exist to demonstrate the notebook feature. Visitors can restore them if deleted.

export interface LabNote {
  id: string;
  title: string;
  body: string;
  topic: string;
  tags: string[];
  favorite: boolean;
  createdAt: number; // epoch ms
  updatedAt: number;
  illustrative?: boolean; // marks the original sample entries
}

export const sampleLabNotes: LabNote[] = [
  {
    id: 'sample-1',
    title: 'Why ultrasonic sensing is a starting point, not a finish line',
    body: 'Ultrasonic sensors give us a cheap, readable distance signal — but they only tell you about a narrow cone in front of the sensor. For the Smart Hat concept, that means a single sensor cannot cover a full hemisphere. Worth investigating: how many sensors (or what placement angles) give useful coverage without making the hat unwieldy.',
    topic: 'Robotics',
    tags: ['ultrasonic', 'sensors', 'smart-hat'],
    favorite: true,
    createdAt: Date.parse('2025-08-12T09:00:00Z'),
    updatedAt: Date.parse('2025-08-12T09:00:00Z'),
    illustrative: true,
  },
  {
    id: 'sample-2',
    title: 'Dependency graphs are easier to draw than to validate',
    body: 'For Cascade Protocol I drew a clean dependency graph: electricity powers communications, communications coordinate emergency services, and so on. But in reality the edges are not binary — a system degrades gradually before it fails. A binary on/off model is a useful first approximation, but it hides the interesting middle ground.',
    topic: 'Systems Thinking',
    tags: ['cascade-protocol', 'simulation', 'dependencies'],
    favorite: false,
    createdAt: Date.parse('2025-09-03T18:30:00Z'),
    updatedAt: Date.parse('2025-09-03T18:30:00Z'),
    illustrative: true,
  },
  {
    id: 'sample-3',
    title: 'BFS vs A*: when the simpler algorithm is the better teacher',
    body: 'Implemented breadth-first search for Blindspot. BFS guarantees the shortest path on an unweighted grid and is easy to reason about. A* with a Manhattan-distance heuristic is faster on larger grids. For the playground, showing both makes the trade-off visible — BFS is the clearer teacher, A* is the practical choice.',
    topic: 'Computer Science',
    tags: ['pathfinding', 'bfs', 'a-star', 'blindspot'],
    favorite: true,
    createdAt: Date.parse('2025-09-20T11:15:00Z'),
    updatedAt: Date.parse('2025-09-20T11:15:00Z'),
    illustrative: true,
  },
  {
    id: 'sample-4',
    title: 'A claim is not a fact, and a tool should not pretend otherwise',
    body: 'Designing ClaimLens, the temptation is to build a "truth checker." But a browser extension cannot verify truth — it can only help a person keep track of what was claimed and what they thought about it. The honest scope is capture, organize, and revisit — not adjudicate.',
    topic: 'Browser Tools',
    tags: ['claimlens', 'design', 'critical-reading'],
    favorite: false,
    createdAt: Date.parse('2025-10-01T14:00:00Z'),
    updatedAt: Date.parse('2025-10-01T14:00:00Z'),
    illustrative: true,
  },
  {
    id: 'sample-5',
    title: 'Question worth investigating: graceful degradation in robots',
    body: 'When a robot loses a sensor, what should it do? Stop, continue with reduced confidence, or switch to a fallback behavior? This feels like a systems question as much as a robotics one — the answer depends on what the robot is doing and what the cost of a wrong move is.',
    topic: 'Robotics',
    tags: ['question', 'robustness', 'sensors'],
    favorite: false,
    createdAt: Date.parse('2025-10-15T20:45:00Z'),
    updatedAt: Date.parse('2025-10-15T20:45:00Z'),
    illustrative: true,
  },
  {
    id: 'sample-6',
    title: 'Debugging approach: reproduce, isolate, then fix',
    body: 'When a simulation behaves unexpectedly, the first step is always the same: can I reproduce it deterministically? If yes, I can isolate the step where the state goes wrong. Fixing without reproducing is guessing. This has saved me more time than any clever debugging tool.',
    topic: 'Computer Science',
    tags: ['debugging', 'method'],
    favorite: true,
    createdAt: Date.parse('2025-10-10T16:20:00Z'),
    updatedAt: Date.parse('2025-10-10T16:20:00Z'),
    illustrative: true,
  },
];

export const noteTopics = [
  'Robotics',
  'Computer Science',
  'Systems Thinking',
  'Browser Tools',
  'Simulation',
  'Future Ideas',
  'Other',
];
