export interface TimelineItem {
  id: string;
  category:
    | 'Academic Record'
    | 'Engineering Exploration'
    | 'Research & Innovation'
    | 'Leadership & Community'
    | 'Recognition';
  period: string;
  title: string;
  description: string;
}

export const timelineItems: TimelineItem[] = [
  {
    id: 'ac-grade12',
    category: 'Academic Record',
    period: '2025 – 2026',
    title: 'Grade 12 — Pursuing',
    description:
      'Currently in Grade 12 at Delhi Public School, Vasant Kunj. Subjects: Physics, Chemistry, Mathematics, Computer Science, English.',
  },
  {
    id: 'ac-grade11',
    category: 'Academic Record',
    period: '2024 – 2025',
    title: 'Grade 11 — 80.4%',
    description: 'Completed Grade 11 with 80.4%. Received the Gold Medal in Academic Excellence.',
  },
  {
    id: 'ac-grade10',
    category: 'Academic Record',
    period: '2023 – 2024',
    title: 'Grade 10 — 94.4%',
    description: 'Completed Grade 10 with 94.4%.',
  },
  {
    id: 'ac-grade9',
    category: 'Academic Record',
    period: '2022 – 2023',
    title: 'Grade 9 — 93.2%',
    description: 'Completed Grade 9 with 93.2%.',
  },
  {
    id: 'ee-smart-hat',
    category: 'Engineering Exploration',
    period: 'Date unrecorded',
    title: 'Smart Hat for the Visually Impaired',
    description:
      'Prototype developed through an AI/ML/Robotics summer program at IIT Delhi via Rancho Labs. Arduino Uno with ultrasonic sensing for overhead obstacle detection.',
  },
  {
    id: 'ee-claimlens',
    category: 'Engineering Exploration',
    period: 'Date unrecorded',
    title: 'ClaimLens — Browser Extension Concept',
    description:
      'Concept for capturing claims encountered online and organizing notes and evidence. Working local demonstration built into this portfolio.',
  },
  {
    id: 'ee-cascade',
    category: 'Engineering Exploration',
    period: 'Date unrecorded',
    title: 'Cascade Protocol — Infrastructure Simulation',
    description:
      'Local simulation exploring how a disruption in one urban system propagates to connected services through dependencies.',
  },
  {
    id: 'ee-blindspot',
    category: 'Engineering Exploration',
    period: 'Date unrecorded',
    title: 'Blindspot — Robot Trials Simulation',
    description:
      'Browser-based grid simulation of a robot navigating with imperfect information using breadth-first search and A* pathfinding.',
  },
  {
    id: 'ri-patent',
    category: 'Research & Innovation',
    period: 'Pending review',
    title: 'Patent Application Pending',
    description:
      'Co-developed an innovative instrument for which a patent application has been filed and is currently under review. Not an awarded or granted patent.',
  },
  {
    id: 'ri-research',
    category: 'Research & Innovation',
    period: 'Under publication',
    title: 'Research Contribution — Dentistry Article',
    description:
      'Contributed data compilation and research support to a dentistry-related article under publication. Not sole authorship; the article is not yet published.',
  },
  {
    id: 'lc-secretary',
    category: 'Leadership & Community',
    period: 'Academic year',
    title: 'Secretary, Interact Club',
    description:
      'Served as Secretary of the Interact Club, participating in outreach, fundraising, and social-impact initiatives.',
  },
  {
    id: 'lc-finline',
    category: 'Leadership & Community',
    period: 'Date unrecorded',
    title: 'Financial-Literacy Workshop',
    description:
      'Led a financial-literacy workshop for government-school students.',
  },
  {
    id: 'lc-fundraising',
    category: 'Leadership & Community',
    period: 'Date unrecorded',
    title: 'Fundraising & Welfare Activities',
    description:
      'Fundraising activities supporting an orphanage and welfare initiatives.',
  },
  {
    id: 'lc-drives',
    category: 'Leadership & Community',
    period: 'Date unrecorded',
    title: 'Sustainability Collection Drives',
    description:
      'Paper-recycling and textile-sustainability collection drives.',
  },
  {
    id: 'lc-earth-saviours',
    category: 'Leadership & Community',
    period: 'Date unrecorded',
    title: 'Volunteering — Earth Saviours Foundation',
    description:
      'Volunteered with Earth Saviours Foundation supporting homeless and elderly residents: assistance with medicines, caregiving, reading, and everyday support.',
  },
  {
    id: 'rec-gold',
    category: 'Recognition',
    period: 'Grade 11',
    title: 'Gold Medal in Academic Excellence',
    description: 'Awarded the Gold Medal in Academic Excellence for Grade 11 performance.',
  },
  {
    id: 'rec-scholar',
    category: 'Recognition',
    period: 'Consistent',
    title: 'Scholar Badge of Excellence',
    description: 'Received consistently across academic years.',
  },
  {
    id: 'rec-vvm',
    category: 'Recognition',
    period: 'Date unrecorded',
    title: 'Vigyan Vidyarthi Manthan (VVM)',
    description: 'Regional Rank 3 and School Rank 1 in the Vigyan Vidyarthi Manthan competition.',
  },
  {
    id: 'rec-photo',
    category: 'Recognition',
    period: 'Date unrecorded',
    title: 'National Photography Competition',
    description: 'Second prize in a national photography competition.',
  },
  {
    id: 'rec-env-quiz',
    category: 'Recognition',
    period: 'Date unrecorded',
    title: 'World Environment Day Global Quiz',
    description: 'Certificate of Recognition in the World Environment Day global quiz.',
  },
  {
    id: 'rec-cms-quiz',
    category: 'Recognition',
    period: 'Date unrecorded',
    title: 'CMS Environmental Quiz',
    description: 'Certificate of Distinction in the CMS Environmental Quiz.',
  },
  {
    id: 'rec-luminaire',
    category: 'Recognition',
    period: 'Date unrecorded',
    title: 'Inter-School Luminaire Competition',
    description:
      'Contribution to the winning team at the Inter-School Luminaire Competition, which received the Rolling Trophy.',
  },
  {
    id: 'rec-swimming',
    category: 'Recognition',
    period: '2024',
    title: 'Inter-School Swimming Competition',
    description: 'Bronze Medal in the Inter-School Swimming Competition, 2024.',
  },
];

export const timelineCategories = [
  'All',
  'Academic Record',
  'Engineering Exploration',
  'Research & Innovation',
  'Leadership & Community',
  'Recognition',
] as const;
