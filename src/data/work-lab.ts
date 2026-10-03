// Data and HTML helpers for the work lab page (kept out of the .astro frontmatter on purpose).
const shards = [
  'M241.495 0L313.808 125.25H169.182L241.495 0Z',
  'M25.887 148.966L168.723 126.283L116.949 261.325L25.887 148.966Z',
  'M455.819 148.966L312.983 126.283L364.757 261.325L455.819 148.966Z',
  'M100.669 412.326L118.069 262.146L238.748 350.753L100.669 412.326Z',
  'M380.321 412.326L362.922 262.146L242.243 350.753L380.321 412.326Z',
];
export const star = (cls: string) =>
  `<svg class="${cls}" viewBox="0 0 482 457" aria-hidden="true">${shards.map((d, i) => `<path class="sh sh${i}" d="${d}"/>`).join('')}</svg>`;

export const projects = [
  { id: 'elsewhere', name: 'Elsewhere', kind: 'Travel website', who: 'Client', status: 'Launching soon', line: 'A travel agency site for trips planned around one person. Full-screen film, destination pages and quiet scroll motion.', did: ['Design', 'Build', 'Motion'] },
  { id: 'luna', name: 'Luna & Sage', kind: 'Skincare webshop', who: 'Design', status: '2026', line: 'A gentle, earthy webshop for a natural skincare brand. Designed phone-first, with soft product photography up front.', did: ['Design', 'Mobile first', 'Webshop'] },
  { id: 'jarvis', name: 'Jarvis', kind: 'AI voice assistant', who: 'Personal', status: 'Running daily', line: 'A voice assistant that runs fully offline on my own server. It hears its name, sets reminders, and knows where you are in the room.', did: ['Python', 'Speech to text', 'Local AI'] },
];
const term = [
  ['acc', '[voice] wake word "hey jarvis" detected'],
  ['', "[stt] 'remind me to call the client at three'"],
  ['', '[orchestrator] reminder scheduled for 15:00'],
  ['ok', '→ tts: "Alarm scheduled for 3 PM."'],
  ['dim', '[presence] desk zone: person entered'],
  ['ok', 'jarvis: "Welcome back. You have one reminder."'],
];
// The visual for each project, reused by all three options.
export const media = (id: string, size: 'sm' | 'lg' = 'lg') => {
  const sizes = size === 'sm' ? '(max-width: 767px) 92vw, 40vw' : '100vw';
  if (id === 'elsewhere')
    return `<img class="m-shot" src="/images/work/elsewhere-home-1440.webp" srcset="/images/work/elsewhere-home-800.webp 800w, /images/work/elsewhere-home-1440.webp 1440w" sizes="${sizes}" width="1440" height="900" alt="Elsewhere travel website, home page" />`;
  if (id === 'luna')
    return `<div class="m-luna"><img class="m-phone" src="/images/work/luna-sage-phone.webp" width="409" height="837" alt="Luna and Sage skincare webshop on a phone" /></div>`;
  return `<div class="m-term"><p class="m-bar"><span></span><span></span><span></span><em>jarvis.py · home server</em></p>${term.map(([c, t]) => `<p class="tl ${c}">${t}</p>`).join('')}<p class="tl">&gt; <span class="caret"></span></p></div>`;
};
