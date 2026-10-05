// All copy for the homepage lives here; the section components read from this file.
// Voice: warm and plain, short sentences, written to small-business owners.
// Headings marked `html` may contain <em> for the italic serif voice.
import type { Glyph } from '../lib/marks';

export const site = {
  brand: 'ShainyDev',
  meta: {
    title: 'ShainyDev | Websites, apps & automations for small businesses',
    description:
      "Freelance developer for small businesses. I build websites, apps, automations and AI tools that do the work for you, and explain every step in plain language.",
  },
  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ],
  links: {
    email: 'shainydev@gmail.com',
    linkedin: 'https://www.linkedin.com/in/shainy-naar-79618b358/',
  },
  footer: 'Designed & built by Shainy',
  /** The button that leads to the contact form page, used in the menu and the contact section. */
  formCta: 'Start a project',
};

export const hero = {
  // One line per entry; the sparkle mark follows the second line.
  lines: ['Websites, apps', '<em>&amp;</em> automations', 'that do the work', '<em>for you.</em>'],
  note: 'Freelance developer for small businesses. I build the tools you wish you had, and explain every step in plain language.',
  cta: "Let's talk",
};

export const band = ['Websites', 'Apps', 'Automations', 'Email', 'AI assistants'];

export const services: {
  label: string;
  html: string;
  items: { glyph: Glyph; name: string; line: string; list: string[] }[];
} = {
  label: 'What I do',
  html: 'Three ways I make your business <em>shine</em>.',
  items: [
    { glyph: 'arch', name: 'Build', line: 'Websites and apps that look like you and work on every phone.', list: ['Business websites', 'Landing pages', 'Redesigns', 'Web apps'] },
    { glyph: 'ring', name: 'Automate', line: 'The tasks you repeat every week, done by themselves.', list: ['Workflows', 'Data & reports', 'Email design', 'Email flows'] },
    { glyph: 'sparkle', name: 'AI', line: 'Assistants and smart tools that actually help.', list: ['Chatbots', 'AI in your tools', 'Document sorting'] },
  ],
};

export const work = {
  label: 'Selected work',
  html: "Things I've <em>built</em>.",
  hint: 'Scroll',
  next: 'Your project next?',
  nextCta: "Let's talk",
};

export const process: {
  label: string;
  html: string;
  steps: { glyph: Glyph; name: string; line: string }[];
} = {
  label: 'How it works',
  html: 'From first chat to <em>launch</em>.',
  steps: [
    { glyph: 'half', name: 'Talk', line: "A chat about your business and what's in the way. No jargon." },
    { glyph: 'diamond', name: 'Design', line: 'You see how it will look before anything gets built.' },
    { glyph: 'plus', name: 'Build', line: 'I build it and keep you posted, so nothing surprises you.' },
    { glyph: 'triUp', name: 'Launch', line: 'We go live, I show you everything, and I stay around after.' },
  ],
};

// Chores the services take off a client's plate. Hours are example estimates, and the note says so.
export const chores = {
  label: 'What changes',
  html: "Things you'll <em>stop</em> doing.",
  unit: ['hours back,', 'every week'],
  note: "Example estimates for a small business. Yours will differ, and I'll tell you honestly what's worth automating.",
  items: [
    { task: 'Copying orders from your inbox into a spreadsheet', tag: 'Automate', hours: 2 },
    { task: 'Answering the same five customer questions', tag: 'AI', hours: 3 },
    { task: 'Chasing unpaid invoices one email at a time', tag: 'Automate', hours: 1 },
    { task: 'Writing the newsletter from scratch every week', tag: 'Email', hours: 2 },
    { task: 'Explaining your opening hours on the phone', tag: 'Website', hours: 1 },
  ],
};

export const contact: {
  label: string;
  html: string;
  promises: { glyph: Glyph; text: string }[];
  copy: string;
  copied: string;
} = {
  label: 'Contact',
  html: 'Got something in mind? <em>Say hi.</em>',
  promises: [
    { glyph: 'ring', text: 'Reply within 48 hours' },
    { glyph: 'diamond', text: 'Clear plan and price upfront' },
    { glyph: 'half', text: 'Plain language, always' },
  ],
  copy: 'Copy address',
  copied: 'Copied ✓',
};

// The contact form page (/contact/).
export const form: {
  title: string;
  html: string;
  lead: string;
  topicsLabel: string;
  topics: string[];
  send: string;
  sending: string;
  sentHtml: string;
  sentLine: string;
  failed: string;
} = {
  title: 'Start a project | ShainyDev',
  html: 'Tell me about <em>your project.</em>',
  lead: "A few lines is plenty. I'll reply within 48 hours with a clear next step, and a price once I know what you need.",
  topicsLabel: 'What can I help with?',
  topics: ['Website', 'App', 'Automation', 'Email', 'AI assistant', 'Not sure yet'],
  send: 'Send message',
  sending: 'Sending…',
  sentHtml: 'Message <em>sent.</em>',
  sentLine: "Thank you! I'll reply within 48 hours, usually sooner.",
  failed: "That didn't send, sorry. Please email me instead at",
};
