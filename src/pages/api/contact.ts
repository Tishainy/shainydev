import type { APIRoute } from 'astro';

// This route runs as a Vercel Function; the rest of the site stays static.
export const prerender = false;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Submissions faster than this after the page loaded are almost certainly bots.
const MIN_FILL_MS = 2500;

/**
 * Contact form: validates the message, drops obvious spam quietly, and emails it to Shainy through
 * Resend. Accepts JSON (from the page's script) or a plain form post (no-JS fallback, which is
 * redirected back to the contact section with ?sent=1 or ?sent=0).
 */
export const POST: APIRoute = async ({ request, redirect }) => {
  const isJson = request.headers.get('content-type')?.includes('application/json');
  const data: Record<string, string> = {};
  try {
    if (isJson) {
      Object.assign(data, await request.json());
    } else {
      (await request.formData()).forEach((value, key) => (data[key] = String(value)));
    }
  } catch {
    return reply(isJson, redirect, 400, 'bad-request');
  }

  const name = (data.name ?? '').trim().slice(0, 120);
  const email = (data.email ?? '').trim().slice(0, 200);
  const message = (data.message ?? '').trim().slice(0, 5000);

  // Spam: a filled-in trap field, or a form "filled in" impossibly fast. Pretend it worked.
  const started = Number(data.started);
  if (data.website || (started && Date.now() - started < MIN_FILL_MS)) {
    return reply(isJson, redirect, 200, 'ok');
  }
  if (!name || !email || !message) return reply(isJson, redirect, 400, 'missing');
  if (!EMAIL.test(email)) return reply(isJson, redirect, 400, 'bad-email');

  const apiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO ?? process.env.CONTACT_TO ?? 'shainydev@gmail.com';
  // Until shainydev.com is verified in Resend, mail can only come from Resend's own test address.
  const from = import.meta.env.CONTACT_FROM ?? process.env.CONTACT_FROM ?? 'ShainyDev website <onboarding@resend.dev>';
  if (!apiKey) {
    console.error('Contact form: RESEND_API_KEY is not set');
    return reply(isJson, redirect, 500, 'not-configured');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `New enquiry from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, '', message].join('\n'),
    }),
  });

  if (!res.ok) {
    console.error('Contact form: Resend responded', res.status, await res.text());
    return reply(isJson, redirect, 502, 'send-failed');
  }
  return reply(isJson, redirect, 200, 'ok');
};

function reply(isJson: boolean | undefined, redirect: (path: string, status?: 300 | 301 | 302 | 303 | 304 | 307 | 308) => Response, status: number, code: string) {
  if (!isJson) return redirect(`/?sent=${code === 'ok' ? 1 : 0}#contact`, 303);
  return new Response(JSON.stringify({ ok: code === 'ok', code }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
