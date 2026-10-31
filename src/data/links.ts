// Central configuration for all external URLs.
// Every placeholder is "#". Replace these with real destinations when available.

export const projectLinks = {
  smartHat: { live: '#', repository: '#' },
  claimLens: { live: 'https://claim-lens-two.vercel.app', repository: '#' },
  cascadeProtocol: { live: 'https://cascade-protocol-mu.vercel.app', repository: '#' },
  blindspot: { live: 'https://blindspot-robot-trials.vercel.app', repository: '#' },
};

export const contactLinks = {
  email: 'ruchitplugna@gmail.com',
  linkedin: '#',
  github: '#',
  resume: '#',
  other: '#',
};

export type LinkPair = { live: string; repository: string };
