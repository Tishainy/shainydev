// All site copy lives here. Components read from this file only — no hard-coded copy.
// Placeholder copy for now; the real draft lands in ticket 03.

export const site = {
  brand: 'ShainyDev',
  meta: {
    title: 'ShainyDev — Websites, automation & AI',
    description: 'Shainy builds websites, apps, automations and AI tools for businesses that want to work smarter.',
  },
  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    greeting: "Hi, I'm Shainy",
    offer: 'Websites, automation and AI for businesses that want to work smarter.',
  },
  services: {
    heading: 'What I do',
    items: [
      { name: 'Build', summary: 'Websites & apps', list: ['Websites', 'Web apps', 'Landing pages'] },
      { name: 'Automate', summary: 'Workflows, data & email', list: ['Workflow automation', 'Data processing', 'Email design & automation'] },
      { name: 'AI', summary: 'Assistants & AI features', list: ['AI assistants', 'Chatbots', 'AI features in existing tools'] },
    ],
  },
  work: {
    heading: 'Work',
    projects: [
      { name: 'Jarvis', status: 'Case study', summary: 'A voice assistant that listens, answers and knows where you are in the room.' },
      { name: 'Travel agency website', status: 'In progress — launching soon', summary: 'A new website for a travel agency.' },
    ],
  },
  process: {
    heading: 'How I work',
    steps: ['Talk', 'Design', 'Build', 'Launch & support'],
    formats: ['Fixed-price projects', 'Monthly support & maintenance', 'Hourly for small jobs'],
    quoteNote: "Tell me what you need — I'll send a clear quote within 48 hours.",
  },
  about: {
    heading: 'About',
    intro: "Hi, I'm Shainy.",
    bio: 'Freelance developer based in the Netherlands.',
    languages: ['English', 'Dutch', 'Papiamentu', 'Spanish (basic)'],
  },
  contact: {
    heading: "Let's build something",
    lead: 'Tell me what you need.',
  },
  theme: {
    toDark: 'Switch to dark theme',
    toLight: 'Switch to light theme',
  },
} as const;
