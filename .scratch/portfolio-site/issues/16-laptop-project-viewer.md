# 16 — Laptop project viewer (future idea, draft)

**What to build:** A playful way to view projects: a laptop that opens as you scroll (the lid lifts from closed to open), and the project appears on its screen. Each project gets its own "boot-up": e.g. the travel agency site loads in the laptop's browser, Jarvis's terminal and orb appear in its window. Scrolling further could close the lid and open it again on the next project, or swap what's on screen.

**Why:** It makes the Work section feel like a reveal instead of a list, and it shows projects in the context they live in (a real screen) — which suits a developer's portfolio.

**Open questions (to decide before building):**
- Drawn how? Options: CSS 3D (a hinged lid with perspective; lightest), an SVG illustration, or a real 3D model (three.js; heaviest, most realistic).
- Desktop only, or also phones? (On phones, a phone mockup "unlocking" might fit better.)
- Does it replace the current Work layout or sit above it as an intro?
- Needs real project screenshots or recordings (the travel agency site once live, the Jarvis clip from ticket 04).

**Blocked by:** 04 — Gather assets (Jarvis clip); the travel agency site going live

**Status:** needs-triage

- [ ] Direction chosen (CSS 3D / SVG / three.js) and scope agreed
- [ ] Laptop opens with scroll, forward and backward
- [ ] At least two projects can be shown on its screen
- [ ] Reduced-motion and phone versions decided
