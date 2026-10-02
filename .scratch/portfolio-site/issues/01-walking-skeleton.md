# 01 — Walking skeleton, deployed

**What to build:** A bare-bones ShainyDev site that is live on a `*.vercel.app` URL from day one, so motion and phone behaviour can be tested on a real URL from the start. Astro + TypeScript + Tailwind in a public GitHub repo that auto-deploys to Vercel. All six sections (Hero, Services, Work, Process, About, Contact) exist as plain stubs that read their text from the single content file. Light/dark toggle works, dark by default. Lenis smooth scroll and GSAP (ScrollTrigger, SplitText) are wired up, with one simple reusable reveal helper the calm sections can use later. `prefers-reduced-motion` is respected from the start. The four project-only agent skills are installed.

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

- [ ] Repo is git-initialised and pushed to a public GitHub repo
- [x] Project-only skills installed: `anthropics/skills@frontend-design`, `greensock/gsap-skills@gsap-scrolltrigger`, `@gsap-timeline`, `@gsap-performance`
- [ ] Every push to the main branch deploys to Vercel; the `*.vercel.app` URL loads
- [x] All six sections render in order, with text coming from one content file
- [x] Theme toggle switches dark/light, defaults to dark, and remembers the choice
- [x] Lenis smooth scroll is active; a stub element reveals via the shared reveal helper
- [x] With reduced motion enabled, smooth scroll and reveals are disabled or reduced to simple fades
- [x] The site URL is a single config value (so the domain can be swapped later)

## Comments

- 2026-10-02: Live at https://shainydev.vercel.app (Vercel project `shainydev`, deployed via CLI). Remaining: create the public GitHub repo, push, and connect it to the Vercel project so pushes auto-deploy. `gh` CLI isn't installed on this machine.
