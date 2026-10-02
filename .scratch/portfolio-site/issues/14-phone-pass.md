# 14 — Phone pass

**What to build:** Test the complete site on a real phone (plus a desktop sanity check) and fix what fights back. Aim to keep the full experience; cut or simplify individual motions only where they cause real trouble (jank, address-bar resize jumps, text overflow, scenes that drag). Record which motions were changed and why.

**Blocked by:** 05 — Hero; 06 — Services; 07, 08, 09 — Interludes; 10 — Work; 11 — Process + About; 12 — Contact; 13 — Launch polish

**Status:** ready-for-agent

- [ ] Tested on at least one real phone via the live Vercel URL
- [ ] No horizontal scroll, text overflow or layout jumps from the address bar
- [ ] Scrubbed scenes feel smooth; any cut or simplified motion is listed with a reason
- [ ] Reduced-motion mode verified end to end
- [ ] Contact form tested from the phone

## Comments

- 2026-10-02 (pass 1, simulated at 390px): Phones scroll much faster than desktop, so scroll-tied ("scrubbed") motion was swapped for motion that plays at its own pace once reached:
  - Hero: no pinning on phones; the headline drifts apart and the name rises as the hero scrolls away. Headline moved lower to close the gap above the name.
  - Services: frames stay stacked; each frame rises in and its demo plays by itself (about 2.6s) when it reaches the screen. Added the "What I can do for you" heading on phones.
  - Process: each step's line draws and its text appears as that step comes into view.
  - Work: more room above the Jarvis conversation so the orb doesn't overlap it.
  Desktop is unchanged. Still to do: Shainy checks on a real phone (feel, speed, address-bar jumps, light mode, the contact form).
- 2026-10-02 (pass 2): Shainy wants the same scroll-driven feel as desktop on phones, including the sideways services strip. Pass 1's "play on its own" approach reverted. Instead: GSAP `normalizeScroll` on touch devices (flicks can't skip pinned scenes; the address bar stays put), more scroll room per step on phones (hero +=130%, services 80% per step), snapping kept. Services frames get a portrait layout on phones (title, subtitle, description, list as one line, demo). Hero on phones: no wave lines; "Shainy" sized to fit the screen width.
- 2026-10-02 (pass 3): Hero "i" now a plain i with a page-colour patch over its square dot and the orb on top (the dotless "ı" vanished on some phones). Services on phones: stacking cards (sticky full-screen cards; the one underneath shrinks and dims as the next slides over; each demo plays as its card settles). Work on phones: the Jarvis conversation comes first, sticky and full-screen, and the details slide up over it as a panel. Desktop unchanged. Verified by screenshot at 390px: card stacking mid-scroll and the Work panel sliding over the demo. Couldn't verify reveals after script-driven scrolling in the test harness (a control section fails the same way there), so the panel text reveal needs a real-phone check.
