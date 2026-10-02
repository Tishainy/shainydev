/**
 * Contact form: checks the fields, sends them to /api/contact without leaving the page, and shows
 * a clear success or error message. Without JS the form still posts normally (see the API route).
 */
export function initContact() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-contact-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-contact-submit]')!;
  const started = form.querySelector<HTMLInputElement>('[data-contact-started]')!;
  started.value = String(Date.now());

  const say = (text: string, kind: 'ok' | 'error' | '') => {
    status.textContent = text;
    status.classList.toggle('is-ok', kind === 'ok');
    status.classList.toggle('is-error', kind === 'error');
  };

  // Coming back from the no-JS fallback.
  const sent = new URLSearchParams(location.search).get('sent');
  if (sent === '1') say(status.dataset.success ?? '', 'ok');
  if (sent === '0') say(status.dataset.error ?? '', 'error');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      say(status.dataset.missing ?? '', 'error');
      form.querySelector<HTMLElement>(
        !data.name?.trim() ? '#contact-name' : !data.email?.trim() ? '#contact-email' : '#contact-message',
      )?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      say(status.dataset.badEmail ?? '', 'error');
      form.querySelector<HTMLElement>('#contact-email')?.focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = submit.dataset.sending ?? '';
    say('', '');
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        form.reset();
        started.value = String(Date.now());
        say(status.dataset.success ?? '', 'ok');
      } else {
        const key =
          body.code === 'bad-email' ? 'badEmail'
          : body.code === 'missing' ? 'missing'
          : body.code === 'not-configured' ? 'notConnected'
          : 'error';
        say(status.dataset[key] ?? '', 'error');
      }
    } catch {
      say(status.dataset.error ?? '', 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = submit.dataset.label ?? '';
    }
  });
}
