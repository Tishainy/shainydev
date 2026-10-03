import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

// ---------- Light / dark: the toggle flips it and remembers the choice ----------
const modeLabel = document.querySelector<HTMLElement>('[data-mode-label]')!;
const modeBtn = document.querySelector<HTMLButtonElement>('[data-mode-toggle]')!;
const syncMode = () => {
  const dark = root.dataset.mode === 'dark';
  modeLabel.textContent = dark ? 'Light' : 'Dark';
  modeBtn.setAttribute('aria-pressed', String(dark));
};
syncMode();
modeBtn.addEventListener('click', () => {
  root.dataset.mode = root.dataset.mode === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem('mode', root.dataset.mode);
  } catch {}
  syncMode();
});

// The sticky bar's height, used to offset pinned sections and sticky elements below it.
const bar = document.querySelector<HTMLElement>('.bar')!;
const barH = () => bar.offsetHeight;
const setBar = () => root.style.setProperty('--bar', barH() + 'px');
setBar();
addEventListener('resize', setBar);

// ---------- Contact: copy the email address (shows the address itself if the clipboard is refused) ----------
const copyBtn = document.querySelector<HTMLButtonElement>('[data-copy]');
if (copyBtn) {
  const copyLabel = copyBtn.querySelector<HTMLElement>('[data-copy-label]')!;
  const idle = copyLabel.textContent;
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.copy!);
      copyLabel.textContent = copyBtn.dataset.copied ?? 'Copied';
    } catch {
      copyLabel.textContent = copyBtn.dataset.copy!;
    }
    setTimeout(() => (copyLabel.textContent = idle), 2200);
  });
}

if (!reduce) {
  // Smooth scrolling; in-page links glide to their section and stop just under the bar.
  const lenis = new Lenis({ anchors: { offset: -barH() } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // ---------- Hero: the star assembles shard by shard, then the headline rises line by line ----------
  const dirs = [[0, -1], [-1, -0.35], [1, -0.35], [-0.7, 0.85], [0.7, 0.85]];
  const parts = gsap.utils.toArray<SVGPathElement>('.hero-star .sh');
  gsap.set(parts, { transformOrigin: '50% 50%' });
  gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    .from(parts, { x: (i) => dirs[i][0] * 260, y: (i) => dirs[i][1] * 260, scale: 0.5, opacity: 0, duration: 1.4, stagger: 0.1 }, 0.1)
    .from('.hero-h .in', { yPercent: 110, duration: 1.1, stagger: 0.1 }, 0.5)
    .from('.hero-foot > *', { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.9);
  // The star turns slowly on its own; the scroll is handled on its wrapper, so the two never fight.
  gsap.to('.hero-star', { rotation: 360, duration: 80, ease: 'none', repeat: -1 });
  gsap.to('[data-hero-star]', { rotation: 120, scale: 0.88, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });

  // ---------- Red band: drifts, runs faster while you scroll; its marks spin whole ----------
  const band = gsap.to('[data-band]', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    trigger: '.band', start: 'top bottom', end: 'bottom top',
    onUpdate: (s) =>
      gsap.to(band, { timeScale: 1 + Math.min(Math.abs(s.getVelocity()) / 250, 6), duration: 0.2, overwrite: true, onComplete: () => gsap.to(band, { timeScale: 1, duration: 1.2 }) }),
  });
  gsap.to('.band .spin', { rotation: 360, transformOrigin: '50% 50%', duration: 10, ease: 'none', repeat: -1 });

  // Section headings rise in, and sink away again on the way back up.
  gsap.utils.toArray<HTMLElement>('[data-up]').forEach((el) =>
    gsap.from(el, { y: 50, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } }),
  );

  // ---------- Services: the rule draws, the mark pops in, the text follows ----------
  gsap.utils.toArray<HTMLElement>('[data-col]').forEach((col, i) =>
    gsap
      .timeline({ scrollTrigger: { trigger: col, start: 'top 85%', toggleActions: 'play none none reverse' }, delay: i * 0.1 })
      .from(col.querySelector('[data-rule]'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.9, ease: 'power3.inOut' })
      .from(col.querySelector('.svc-mark'), { scale: 0, duration: 0.7, ease: 'back.out(2)' }, 0.2)
      .from(col.querySelectorAll('h3, .svc-line, li'), { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.05 }, 0.35),
  );

  // ---------- Work: the posters slide sideways while the section holds (desktop only) ----------
  gsap.matchMedia().add('(min-width: 768px)', () => {
    const track = document.querySelector<HTMLElement>('[data-track]')!;
    const count = document.querySelector<HTMLElement>('[data-count]')!;
    const total = track.querySelectorAll('.poster:not(.po-intro):not(.po-next)').length;
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '[data-posters]', start: () => 'top ' + barH(), end: () => '+=' + dist(), scrub: 0.8, pin: true, invalidateOnRefresh: true,
        onUpdate: (st) => (count.textContent = '0' + Math.min(total, Math.max(1, Math.round(st.progress * (total + 1) + 0.3)))),
      },
    });
  });

  // ---------- Process: the steps fill in one after another ----------
  gsap.from('[data-step]', { y: 40, autoAlpha: 0, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: '.steps', start: 'top 80%', end: 'bottom 70%', scrub: 0.6 } });

  // ---------- Chores: struck through in turn, their hours added to the counter ----------
  const hoursEl = document.querySelector<HTMLElement>('[data-hours]')!;
  const hours = { n: 0 };
  hoursEl.textContent = '0';
  const ct = gsap.timeline({ scrollTrigger: { trigger: '.chore-list', start: 'top 70%', end: 'bottom 55%', scrub: 0.6 } });
  let sum = 0;
  gsap.utils.toArray<HTMLElement>('[data-chore]').forEach((c, i) => {
    sum += Number(c.dataset.hours);
    ct.to(c, { '--strike': 1, duration: 1, ease: 'power2.inOut' }, i)
      .to(c.querySelector('.chore-text'), { color: 'var(--mute)', duration: 0.6 }, i + 0.4)
      .fromTo(c.querySelector('.chore-tag'), { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' }, i + 0.5)
      .to(hours, { n: sum, duration: 0.8, ease: 'none', onUpdate: () => (hoursEl.textContent = String(Math.round(hours.n))) }, i + 0.3);
  });

  // ---------- Contact: the address types itself in; the promises follow ----------
  gsap.from('[data-talk-mail] .ch', { yPercent: 100, autoAlpha: 0, duration: 0.7, stagger: 0.035, ease: 'power3.out', scrollTrigger: { trigger: '[data-talk-mail]', start: 'top 85%', toggleActions: 'play none none reverse' } });
  gsap.from('.talk-promises li, .talk-actions > *', { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: '.talk-foot', start: 'top 90%', toggleActions: 'play none none reverse' } });
}
