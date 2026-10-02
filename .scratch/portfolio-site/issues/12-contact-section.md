# 12 — Contact section with working form

**What to build:** The closing CTA the whole site builds toward. A form with name, email, a "What do you need?" picker (Build / Automate / AI / Not sure yet) and message, which actually delivers submissions to Shainy's inbox. Alongside it: email address (shainydev@gmail.com) and LinkedIn. (Book-a-call link dropped for now.) No budget field, no WhatsApp, no phone number. The delivery mechanism (a free form service or a small server endpoint on Vercel) is chosen in this ticket — confirm the choice with Shainy before wiring it up.

**Blocked by:** 02 — Font comparison page; 03 — Copy draft + Jarvis shot list

**Status:** ready-for-agent

- [x] Delivery mechanism agreed with Shainy (Resend via a Vercel Function)
- [ ] A test submission arrives in Shainy's inbox, including the picker choice — blocked: Resend needs the domain (ticket 15)
- [x] Validation, clear success/error states, and basic spam protection (honeypot + minimum fill time; Astro blocks cross-site posts)
- [x] Email and LinkedIn links work
- [ ] Usable by keyboard and screen reader, and on phone

## Comments

- 2026-10-02: Built. Contact now also carries the personal touch from the removed About section. Form posts to `/api/contact` (Astro Vercel adapter, one Vercel Function) which sends through Resend's REST API. Tested live: missing fields, bad email, honeypot, too-fast bot, no-JS same-origin post (303 back to #contact) all behave; valid input returns `not-configured` because there's no API key yet. Resend's marketplace integration is installed on the team (terms accepted) but provisioning needs a domain, so Shainy chose to connect it after buying shainydev.com (ticket 15). Until then the form tells visitors to email shainydev@gmail.com. To finish: provision Resend with `-m domain=shainydev.com`, verify DNS, set `CONTACT_FROM` to an address on the domain, and send a test.
- Known: `npm audit` reports 3 high-severity advisories in `path-to-regexp` via `@astrojs/vercel` (build-time routing only, not reachable by visitors); the only automated fix downgrades the adapter. Revisit when the adapter updates.
