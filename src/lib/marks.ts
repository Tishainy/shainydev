// Shainy's brand marks as inline SVG strings, rendered with `set:html`.
// Kept in a .ts module (not .astro frontmatter): Astro's compiler mis-parses some HTML-in-JS strings there.

// The star: five separate shards from her logo, so each can be animated on its own.
const shards = [
  'M241.495 0L313.808 125.25H169.182L241.495 0Z',
  'M25.887 148.966L168.723 126.283L116.949 261.325L25.887 148.966Z',
  'M455.819 148.966L312.983 126.283L364.757 261.325L455.819 148.966Z',
  'M100.669 412.326L118.069 262.146L238.748 350.753L100.669 412.326Z',
  'M380.321 412.326L362.922 262.146L242.243 350.753L380.321 412.326Z',
];
export const star = (cls: string) =>
  `<svg class="${cls}" viewBox="0 0 482 457" aria-hidden="true">${shards.map((d, i) => `<path class="sh sh${i}" d="${d}"/>`).join('')}</svg>`;

// A small family of clean, flat marks that sit alongside the star (100×100 each).
// Triangles only ever point straight up or straight down.
const glyphs = {
  sparkle: '<path d="M50 0C54 34 66 46 100 50C66 54 54 66 50 100C46 66 34 54 0 50C34 46 46 34 50 0Z"/>',
  ring: '<path fill-rule="evenodd" d="M50 4a46 46 0 1 0 0 92a46 46 0 1 0 0-92Zm0 22a24 24 0 1 1 0 48a24 24 0 1 1 0-48Z"/>',
  arch: '<path d="M8 96V50a42 42 0 0 1 84 0v46H68V50a18 18 0 0 0-36 0v46Z"/>',
  plus: '<path d="M37 4h26v33h33v26H63v33H37V63H4V37h33Z"/>',
  flower: '<circle cx="50" cy="26" r="23"/><circle cx="74" cy="50" r="23"/><circle cx="50" cy="74" r="23"/><circle cx="26" cy="50" r="23"/>',
  half: '<path d="M4 58a46 46 0 0 1 92 0Z"/><rect x="4" y="68" width="92" height="20"/>',
  diamond: '<path d="M50 2 98 50 50 98 2 50Z"/>',
  triUp: '<path d="M50 8 96 90H4Z"/>',
  triDown: '<path d="M4 10h92L50 92Z"/>',
};
export type Glyph = keyof typeof glyphs;
export const glyph = (name: Glyph, cls: string) =>
  `<svg class="glyph ${cls}" viewBox="0 0 100 100" aria-hidden="true">${glyphs[name]}</svg>`;
