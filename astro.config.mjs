// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { SITE_URL } from './site.config.mjs';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // Fonts are downloaded at build time and served from the site itself.
  fonts: [
    {
      // Headlines.
      provider: fontProviders.fontshare(),
      name: 'Clash Display',
      cssVariable: '--font-clash',
      weights: [500, 600],
      fallbacks: ['sans-serif'],
    },
    {
      // Body text.
      provider: fontProviders.google(),
      name: 'Hanken Grotesk',
      cssVariable: '--font-hanken',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      // Playful moments only: kinetic type where words move and stretch.
      provider: fontProviders.google(),
      name: 'Unbounded',
      cssVariable: '--font-unbounded',
      weights: [500, 600],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
