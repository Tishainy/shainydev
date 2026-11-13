# 15 — Connect domain

**What to build:** Shainy buys the domain (leaning shainydev.com) and points it at the Vercel project with HTTPS, and the single site-URL config value is updated so metadata and share previews use it.

**Blocked by:** 14 — Phone pass

**Status:** done (email sending still open, see ticket 12)

- [x] Domain purchased
- [x] Domain connected (Cloudflare Workers instead of Vercel), with HTTPS working
- [x] Site-URL config value updated; share preview shows the new domain

## Comments

- 2026-10-02: Also finish ticket 12 here: provision Resend with the domain (`vercel integration add resend/resend-email -m domain=shainydev.com -m region=...`), add its DNS records, set `CONTACT_FROM` (e.g. hello@shainydev.com), and send a test message.
- 2026-11-13: Live at https://shainydev.com on Cloudflare Workers (Vercel's free plan is non-commercial). www and http:// redirect to https://shainydev.com; Always Use HTTPS on. Resend still to do: add RESEND_API_KEY as a Worker secret, verify shainydev.com in Resend, set CONTACT_FROM; then add a WAF rate-limit rule on /api/contact.
