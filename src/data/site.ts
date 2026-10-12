export const SITE = {
  name: 'Cherie Quek',
  title: 'Learning out loud',
  tagline: 'Writing about how software gets built now that agents do more of the building.',
  linkedin: 'https://www.linkedin.com/in/cheriequek/',
  disclaimer: 'Views are my own and don’t represent Microsoft.',
} as const;

export const SERIES = {
  'copilot-pr-squad': {
    title: 'Building the process, not the feature',
    label: 'copilot-pr-squad',
    description:
      'I stopped driving each Copilot PR by hand and built a team of agents that drives them for me. These six posts are how it got good, and what I’d carry into the next one.',
    // Shown at the top of every post after Part 1. HTML.
    note:
      'a series on copilot-pr-squad, a small team of AI agents, built on <a href="https://github.com/bradygaster/squad">bradygaster/squad</a>, that drives my GitHub Copilot coding-agent pull requests.',
  },
} as const;

export type SeriesId = keyof typeof SERIES;
export const SERIES_IDS = Object.keys(SERIES) as [SeriesId, ...SeriesId[]];
