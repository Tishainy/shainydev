import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Where the baseline sits below the top of a word's box, in em (measured on screen for
// Clash Display at line-height 0.84).
const BASELINE = 0.81;

/**
 * Services, "the type index": a pinned scene. Scrolling sweeps the cobalt light from one word
 * to the next, the orb travels to the new word's end, and that service's details slide in
 * beside the short words. Snaps to each service; reverses on the way back up.
 */
export function initServices() {
  const section = document.querySelector<HTMLElement>('[data-services]');
  if (!section) return;
  const index = section.querySelector<HTMLElement>('[data-svc-index]')!;
  const orb = section.querySelector<HTMLElement>('[data-svc-orb]')!;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.add('is-staged');

    const rows = gsap.utils.toArray<HTMLElement>('[data-svc-row]', section);
    const words = gsap.utils.toArray<HTMLElement>('[data-svc-w]', section);
    const fills = gsap.utils.toArray<HTMLElement>('[data-svc-fill]', section);
    const sums = gsap.utils.toArray<HTMLElement>('[data-svc-sum]', section);
    const sumLines = sums.map((s) => gsap.utils.toArray<HTMLElement>('[data-svc-sum-line]', s));
    const dets = gsap.utils.toArray<HTMLElement>('[data-svc-det]', section);
    const count = words.length;

    // The orb's spot as a word's full stop: just after the word, resting on its baseline.
    function orbSpot(i: number) {
      const box = index.getBoundingClientRect();
      const word = words[i].getBoundingClientRect();
      const size = parseFloat(getComputedStyle(words[i]).fontSize);
      return {
        x: word.right - box.left + size * 0.06,
        y: word.top - box.top + size * BASELINE - size * 0.16,
      };
    }

    // Starting state: Build lit, only its details showing.
    gsap.set(fills[0], { clipPath: 'inset(-10% 0% -10% 0%)' });
    sums.forEach((s, i) => gsap.set(s, { autoAlpha: i === 0 ? 1 : 0 }));
    dets.forEach((d, i) => gsap.set(d, { autoAlpha: i === 0 ? 1 : 0 }));

    // Entering: the outlined words slide in from alternating sides.
    const enter = gsap.fromTo(
      rows,
      { xPercent: (i) => (i % 2 === 0 ? -12 : 12), autoAlpha: 0 },
      {
        xPercent: 0,
        autoAlpha: 1,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 15%', scrub: 1 },
      },
    );

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${(count - 1) * 110 + 50}%`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 'labelsDirectional', duration: { min: 0.3, max: 0.9 }, delay: 0.15, ease: 'power1.inOut' },
      },
    });

    tl.set(orb, { x: () => orbSpot(0).x, y: () => orbSpot(0).y }, 0).addLabel('s0', 0);

    for (let i = 1; i < count; i++) {
      const from = i - 1;
      const at = (i - 1) * 2 + 0.8;
      tl
        // The light sweeps off the old word and onto the new one, left to right.
        .to(fills[from], { clipPath: 'inset(-10% 0% -10% 100%)', duration: 0.7, ease: 'power2.in' }, at)
        .fromTo(
          fills[i],
          { clipPath: 'inset(-10% 100% -10% 0%)' },
          { clipPath: 'inset(-10% 0% -10% 0%)', duration: 0.8, ease: 'power2.out' },
          at + 0.45,
        )
        // The orb travels to the new word's end.
        .to(orb, { x: () => orbSpot(i).x, y: () => orbSpot(i).y, duration: 1.1, ease: 'power3.inOut' }, at + 0.1)
        // The details trade places.
        .to(sumLines[from], { xPercent: (k) => (k === 0 ? -14 : 14), autoAlpha: 0, duration: 0.45, stagger: 0.06 }, at)
        .to(dets[from], { y: -24, autoAlpha: 0, duration: 0.45 }, at)
        .set(sums[i], { autoAlpha: 1 }, at + 0.5)
        .fromTo(
          sumLines[i],
          { xPercent: (k) => (k === 0 ? 14 : -14), autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1, duration: 0.55, stagger: 0.07 },
          at + 0.55,
        )
        .fromTo(dets[i], { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 }, at + 0.65)
        .addLabel(`s${i}`, at + 1.3);
    }
    // A last moment on the final service before the scene lets go.
    tl.to({}, { duration: 0.7 });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      enter.scrollTrigger?.kill();
      section.classList.remove('is-staged');
    };
  });

  // The orb's highlight turns to face the cursor, like the one in the hero.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const shine = { x: 34, y: 28 };
    const pointer = { x: 0, y: 0, active: false };
    addEventListener('pointermove', (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    });
    gsap.ticker.add(() => {
      if (!pointer.active) return;
      const r = orb.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > innerHeight) return;
      const dx = pointer.x - (r.left + r.width / 2);
      const dy = pointer.y - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      shine.x += (50 + (dx / dist) * 22 - shine.x) * 0.12;
      shine.y += (50 + (dy / dist) * 22 - shine.y) * 0.12;
      orb.style.setProperty('--sx', `${shine.x}%`);
      orb.style.setProperty('--sy', `${shine.y}%`);
    });
  }
}
