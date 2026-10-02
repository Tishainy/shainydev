# Spec: ShainyDev portfolio site

Status: agreed (grilling session, 2026-10-02)

## Goal

A portfolio site for **ShainyDev**, Shainy's freelance software development brand. Audience: potential freelance clients (English-speaking / remote). The single action the site drives: **get in touch about a project**.

Clean restart in this repo. The older attempts in `Documents/priv_projects/portfolio` and `Pract_portfolio` may be harvested for photos and copy only.

## References

- **North star:** https://kstoimenov.com/ — services-led, calm but creative, light/dark toggle.
- https://www.harrygeorge.design/ — sleek; built with GSAP + ScrollTrigger + SplitText + Lenis. Needs more colour and creativity than this.
- https://www.pleurat.com/ — liked aside from its colours and that it doesn't fill the screen. Uses IBM Plex Mono.

## Services (the story is services-led)

1. **Build** — websites & apps
2. **Automate** — workflows, data, email design & email automation
3. **AI** — assistants, chatbots, AI features in existing tools

Lead offer: websites (the site itself is the proof). Draft one-liner: *"Websites, automation and AI for businesses that want to work smarter."*

## Sections, in order

1. **Hero** — *scrubbed set piece.* ShainyDev wordmark, "Hi, I'm Shainy", one-line offer. Words split, move and reposition as you scroll, playing forward and backward.
2. **Services** — *scrubbed set piece.* Build → Automate → AI, pinned, each morphing into the next. Each followed by an interlude:
   - **Build interlude:** a website mockup that assembles itself (wireframe → styled page).
   - **Automate interlude:** a workflow diagram with data flowing through steps (e.g. new booking → confirmation email → invoice → calendar). One step is an email that designs itself.
   - **AI interlude:** a mock chat where a question is answered as you scroll.
   - Interludes are scripted animations, not working tools.
3. **Work** — Jarvis (`ai-assistant`) as a 20–40s demo-video case study, plus the travel agency site as an "In progress — launching soon" card. Built to grow; real screenshots only once live **and** the client has agreed.
4. **Process / How I work** — e.g. Talk → Design → Build → Launch & support. Includes a "How we can work together" block: *Fixed-price projects · Monthly support & maintenance · Hourly for small jobs*, plus "Tell me what you need — I'll send a clear quote within 48 hours." **No prices.**
5. **About** — portrait, short human bio, languages.
6. **Contact** — big closing CTA. Form: name, email, "What do you need?" picker (Build / Automate / AI / Not sure yet), message. Alongside: email, LinkedIn, book-a-call link (Cal.com). **No budget field, no WhatsApp.**

**Not included until real:** stats strip, testimonials, client logo wall, price list.

## Motion

- **Hybrid:** two scrubbed set pieces (Hero, Services) and the scroll-linked interludes; the remaining sections scroll normally with tasteful reveals.
- **Phones:** aim for the full experience. Cut individual motions only where they cause real trouble (jank, address-bar resize, overflow), decided case by case.
- **`prefers-reduced-motion`:** always respected. Calm, fully readable version with simple fades.

## Look

- **Dark by default**, with a light/dark toggle.
- **Accent: Shainy's cobalt**, rgb(112 155 255) / `#709BFF` on dark; `#2F5BE0` on light (deepened to pass WCAG AA). Used sparingly (CTAs, service names, interlude highlights). Neutrals are cool, blue-leaning near-black and off-white. Peach/coral/apricot were tried and rejected.
- **Typography (chosen 2026-10-02):** **Clash Display** for headlines, **Hanken Grotesk** for body text, and **Unbounded** as a playful display face reserved for kinetic-type moments (words moving, stretching, repositioning). **No monospace accent.** All self-hosted via Astro's fonts API.

## Brand & domain

- Wordmark: **ShainyDev**. On the site the person is **Shainy**; the full name isn't required.
- Domain: later, leaning **shainydev.com**. Until then a `*.vercel.app` URL. The domain must be a single config value.

## Tech

- **Astro + TypeScript + Tailwind**
- **GSAP** (ScrollTrigger, SplitText) + **Lenis** smooth scroll
- Hosted on **Vercel**; code in a **public GitHub** repo
- All copy in **one content file**
- Contact form delivery mechanism: decided during the build
- Project-only agent skills: `anthropics/skills@frontend-design`, `greensock/gsap-skills@gsap-scrolltrigger`, `@gsap-timeline`, `@gsap-performance`

## Responsibilities

- **Claude:** drafts all copy in the content file; provides a shot list for the Jarvis clip; builds the site.
- **Shainy:** edits copy (especially About); provides a portrait (a casual, well-lit workspace shot preferred, CV photo as fallback); records the Jarvis clip.

## Build order and checkpoints

1. Setup: git init, Astro + Tailwind scaffold, skills installed, GSAP + Lenis wired up
2. Font comparison page — **Shainy picks**
3. Copy draft — **Shainy edits**
4. Hero set piece — **Shainy approves** (iterate here before moving on)
5. Services set piece
6. The three interludes
7. Calm sections: Work, Process, About, Contact
8. Phone pass on a real device
9. Deploy to Vercel (`*.vercel.app`); domain connected later

> Ticketing note: deploy was moved into step 1 (walking skeleton is live on Vercel from day one), and the calm sections depend only on fonts + copy, not on hero approval. Launch polish (meta, share image, favicon, optional analytics) was added before the phone pass. See `issues/`.

## Open items

- Contact form delivery mechanism
- Domain purchase (leaning shainydev.com)
- Portrait photo and Jarvis clip (Shainy)
