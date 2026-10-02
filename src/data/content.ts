// All site copy lives here. Components read from this file only — no hard-coded copy.
// Voice: casual and warm. Plain words, short sentences, written to small-business owners.

export const site = {
  brand: 'ShainyDev',
  meta: {
    title: 'ShainyDev | Websites, automation & AI for small businesses',
    description:
      "I'm Shainy, a freelance developer. I build websites, automations and AI tools for small businesses. Tell me what's slowing you down and I'll build the fix.",
  },
  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  links: {
    email: 'shainydev@gmail.com',
    linkedin: 'https://www.linkedin.com/in/shainy-naar-79618b358/',
  },

  hero: {
    // The headline, line by line. Italic lines use the serif voice.
    lines: [
      { text: 'Websites, apps', italic: false },
      { text: '& automations', italic: true },
      { text: 'that do the work', italic: false },
      { text: 'for you.', italic: true },
    ],
    cta: "Let's talk",
    // The giant name under the headline; its i carries the glass orb.
    name: 'Shainy',
  },

  services: {
    heading: 'What I can do for you',
    items: [
      {
        name: 'Build',
        summary: 'Websites & apps',
        description:
          'A website that looks like you and works on every phone. Or a web app that handles the one job your business keeps doing by hand.',
        list: ['Business websites', 'Landing pages', 'Website redesigns', 'Web apps'],
      },
      {
        name: 'Automate',
        summary: 'Workflows, data & email',
        description:
          "If you do the same task every week, a computer can probably do it for you. I set that up, from booking confirmations to monthly reports, so you get your hours back.",
        list: ['Workflow automation', 'Data clean-up & reports', 'Email design', 'Automated email flows'],
      },
      {
        name: 'AI',
        summary: 'Assistants & smart features',
        description:
          'AI that actually helps: an assistant that answers your customers, or a tool that reads and sorts the paperwork for you.',
        list: ['Chatbots & assistants', 'AI features in your existing tools', 'Document & text processing'],
      },
    ],
  },

  // Micro-copy for the three scroll-linked showcases (tickets 07–09).
  // The demo business is fictional and should read as an example.
  interludes: {
    build: {
      caption: 'From rough sketch to finished page.',
      demoBusiness: 'Bloom Hair Studio',
      demoHeadline: 'Hair that feels like you.',
      demoButton: 'Book an appointment',
    },
    automate: {
      caption: 'One booking comes in. Everything else happens by itself.',
      steps: ['New booking', 'Confirmation email', 'Invoice sent', 'Added to calendar'],
      email: {
        from: 'Bloom Hair Studio',
        subject: 'See you Thursday at 14:00',
        greeting: 'Hi Sam,',
        body: "Your appointment is confirmed. We're looking forward to seeing you!",
        button: 'Add to my calendar',
      },
    },
    ai: {
      caption: 'An assistant that answers your customers, day and night.',
      assistantName: 'Bloom assistant',
      question: 'Hi! Do you have anything free this Saturday?',
      answer: "Yes! We've got openings at 10:30 and 14:00 on Saturday. Want me to book one for you?",
    },
  },

  work: {
    heading: 'Work',
    intro: "I've been freelancing since 2025. Here's what I've been building.",
    projects: [
      {
        name: 'Jarvis',
        status: 'Personal project',
        summary:
          'A home assistant I built from scratch. It listens, talks back and notices what is happening in the room. Everything runs on my own server, so nothing leaves the house.',
        highlights: [
          'Wakes up when you say "Hey Jarvis" and understands speech without an internet connection',
          'Uses a camera to notice when you walk in, and holds reminders until you are there to hear them',
          'Checks in on you when you have been sitting still for too long',
          'Watches parts of the room and uses a vision model to tell what changed',
        ],
        tools: ['Python', 'Speech recognition', 'Computer vision', 'Local AI models'],
        videoAlt: 'Screen recording of Shainy talking to Jarvis and Jarvis answering out loud',
      },
      {
        name: 'Travel agency website',
        status: 'In progress',
        summary: "A brand-new website for a travel agency. It's launching soon, and I'll show it here when it does.",
        highlights: [],
        tools: [],
        videoAlt: '',
      },
    ],
  },

  process: {
    heading: 'How I work',
    steps: [
      {
        name: 'Talk',
        description: "We have a chat about your business and what's getting in the way. No jargon, no pressure.",
      },
      {
        name: 'Design',
        description: "I show you what it'll look like before I build anything, and we tweak it together.",
      },
      {
        name: 'Build',
        description: 'I build it and keep you posted along the way, so there are no surprises.',
      },
      {
        name: 'Launch & support',
        description: "We go live, I show you how everything works, and I'm around if you need me afterwards.",
      },
    ],
    formatsHeading: 'How we can work together',
    formats: [
      { name: 'Fixed-price project', description: 'You know the price before I start.' },
      { name: 'Monthly support', description: 'Updates, fixes and small changes, every month.' },
      { name: 'Hourly', description: 'For small jobs and quick fixes.' },
    ],
    quoteNote: "Tell me what you need and I'll send you a clear quote within 48 hours.",
  },

  about: {
    heading: 'About',
    intro: "Hi, I'm Shainy.",
    bio: [
      "I'm a freelance developer from the Netherlands. I build websites, automations and AI tools, mostly for small businesses that don't have a tech team of their own.",
      'Before freelancing I worked in IT support at MediaMarkt, helping people with their tech every day. That taught me the most useful skill I have: explaining technical things in plain language.',
      "When I'm not coding, you'll find me at the gym, reading, or gaming.",
    ],
    languagesLabel: 'I speak',
    languages: ['English', 'Dutch', 'Papiamentu', 'a bit of Spanish'],
    photoAlt: 'Portrait of Shainy',
  },

  contact: {
    heading: "Let's build something",
    lead: "Tell me a bit about your business and what you need. I'll get back to you within 48 hours.",
    form: {
      nameLabel: 'Your name',
      emailLabel: 'Email',
      needLabel: 'What do you need?',
      needOptions: [
        { value: 'build', label: 'A website or app' },
        { value: 'automate', label: 'Automation or email' },
        { value: 'ai', label: 'Something with AI' },
        { value: 'unsure', label: 'Not sure yet' },
      ],
      messageLabel: 'Tell me about it',
      messagePlaceholder: 'What does your business do, and what would you like help with?',
      submit: 'Send message',
      sending: 'Sending…',
      success: "Thanks! Your message is on its way. I'll get back to you within 48 hours.",
      error: "Your message didn't send. Check your connection and try again, or email me directly.",
    },
    altHeading: 'Rather not fill in a form?',
    emailLabel: 'Email me',
    linkedinLabel: 'Find me on LinkedIn',
  },

  footer: {
    note: 'Designed and built by Shainy.',
    copyright: `© ${new Date().getFullYear()} ShainyDev`,
  },

  theme: {
    toDark: 'Switch to dark theme',
    toLight: 'Switch to light theme',
  },
} as const;
