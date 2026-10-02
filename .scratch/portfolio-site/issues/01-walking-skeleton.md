# 01 — Walking skeleton, deployed

**What to build:** A bare-bones ShainyDev site that is live on a `*.vercel.app` URL from day one, so motion and phone behaviour can be tested on a real URL from the start. Astro + TypeScript + Tailwind in a public GitHub repo that auto-deploys to Vercel. All six sections (Hero, Services, Work, Process, About, Contact) exist as plain stubs that read their text from the single content file. Light/dark toggle works, dark by default. Lenis smooth scroll and GSAP (ScrollTrigger, SplitText) are wired up, with one simple reusable reveal helper the calm sections can use later. `prefers-reduced-motion` is respected from the start. The four project-only agent skills are installed.

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

- [ ] Repo is git-initialised and pushed to a public GitHub repo
- [ ] Project-only skills installed: `anthropics/skills@frontend-design`, `greensock/gsap-skills@gsap-scrolltrigger`, `@gsap-timeline`, `@gsap-performance`
- [ ] Every push to the main branch deploys to Vercel; the `*.vercel.app` URL loads
- [ ] All six sections render in order, with text coming from one content file
- [ ] Theme toggle switches dark/light, defaults to dark, and remembers the choice
- [ ] Lenis smooth scroll is active; a stub element reveals via the shared reveal helper
- [ ] With reduced motion enabled, smooth scroll and reveals are disabled or reduced to simple fades
- [ ] The site URL is a single config value (so the domain can be swapped later)
