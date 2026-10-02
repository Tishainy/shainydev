# 15 — Connect domain

**What to build:** Shainy buys the domain (leaning shainydev.com) and points it at the Vercel project with HTTPS, and the single site-URL config value is updated so metadata and share previews use it.

**Blocked by:** 14 — Phone pass

**Status:** ready-for-human

- [ ] Domain purchased
- [ ] Domain connected in Vercel, with HTTPS working
- [ ] Site-URL config value updated; share preview shows the new domain

## Comments

- 2026-10-02: Also finish ticket 12 here: provision Resend with the domain (`vercel integration add resend/resend-email -m domain=shainydev.com -m region=...`), add its DNS records, set `CONTACT_FROM` (e.g. hello@shainydev.com), and send a test message.
