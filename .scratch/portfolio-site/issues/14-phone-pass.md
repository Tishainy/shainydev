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
