import gsap from 'gsap';
import { site, form as copy } from '../data/site';

// ---------- Contact form: sends in the background, then the card turns into a thank-you with a postmark ----------
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const form = document.querySelector<HTMLFormElement>('[data-cf-form]')!;
const done = document.querySelector<HTMLElement>('[data-cf-done]')!;
const card = document.querySelector<HTMLElement>('[data-cf-card]')!;
const postmark = document.querySelector<SVGElement>('[data-postmark]')!;
const status = document.querySelector<HTMLElement>('[data-cf-status]')!;
const submit = document.querySelector<HTMLButtonElement>('[data-cf-submit]')!;
const submitLabel = submit.querySelector<HTMLElement>('[data-cf-submit-label]')!;
document.querySelector<HTMLInputElement>('[data-cf-started]')!.value = String(Date.now());

const showSent = () => {
  form.hidden = true;
  done.hidden = false;
  card.classList.add('is-sent');
  done.focus({ preventScroll: true });
  if (!reduce) {
    gsap.from(done.children, { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' });
    gsap.from(postmark, { scale: 1.6, autoAlpha: 0, rotation: -12, duration: 0.5, ease: 'back.out(2)', delay: 0.15 });
  }
};
const showFailed = () => {
  status.innerHTML = '';
  const link = Object.assign(document.createElement('a'), { href: `mailto:${site.links.email}`, textContent: site.links.email });
  status.append(copy.failed + ' ', link, '.');
};

// Without JavaScript the form posts normally and the server sends the visitor back here with ?sent=1 or ?sent=0.
const sent = new URLSearchParams(location.search).get('sent');
if (sent === '1') showSent();
else if (sent === '0') showFailed();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const body = { ...Object.fromEntries(data), topics: data.getAll('topics').join(', ') };
  submit.disabled = true;
  submitLabel.textContent = copy.sending;
  status.textContent = '';
  try {
    const res = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(String(res.status));
    showSent();
  } catch {
    showFailed();
  } finally {
    submit.disabled = false;
    submitLabel.textContent = copy.send;
  }
});
