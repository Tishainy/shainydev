# 05 — Hero set piece

**What to build:** The signature scrubbed intro. The ShainyDev wordmark, "Hi, I'm Shainy" and the one-line offer split into words/letters and move, separate and reposition as the visitor scrolls — playing forward on scroll down and backward on scroll up — filling the screen. Uses the chosen fonts and accent. A calm, readable reduced-motion version exists.

**Blocked by:** 02 — Font comparison page; 03 — Copy draft + Jarvis shot list

**Status:** done (phone smoothness checked in ticket 14)

- [x] Scrolling down plays the hero animation forward; scrolling up reverses it smoothly
- [x] The hero fills the viewport on desktop and phone without text overflow
- [x] ~~The accent colour highlights key words~~ (superseded: colour lives in the light-filled name and the orb)
- [x] Reduced-motion visitors see a static, fully readable hero
- [ ] Animation stays smooth (no visible jank) on a mid-range phone — moved to ticket 14
- [x] **Checkpoint:** Shainy approves the hero before further animated work continues

## Comments

- 2026-10-02: First version (colour blobs, glass pills, kinetic name) rejected as AI-looking. After many rounds in `/hero-lab` the approved hero is: staggered white headline (Clash Display + Instrument Serif italic) with a Let's talk pill, the giant light-filled "Shainy" whose i-dot is a glass orb (follows the cursor), and faint flowing wave lines that fade around every glyph with two roaming spotlights. Intro on load; pinned scroll spreads the headline, raises the name and lifts the orb. Follows the site theme (dark and light). Approved by Shainy.
- Not verified by me: the motion itself on a real phone (ticket 14 covers that).
