import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { startWaveLines } from './wave-lines';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Services: on desktop with motion, a pinned full-screen scene. Scrolling plays the services
 * like a film: the summary lines slide out sideways, the text fades up, the big word's letters
 * swap, the glass orb glides to the new word's end, and the next service slides in.
 * Elsewhere the markup stays a plain, readable stack.
 */
export function initServices() {
  const section = document.querySelector<HTMLElement>('[data-services]');
  if (!section) return;
  const stage = section.querySelector<HTMLElement>('[data-svc-stage]')!;
  const orb = section.querySelector<HTMLElement>('[data-svc-orb]')!;
  const states = gsap.utils.toArray<HTMLElement>('[data-svc-state]', section);

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.add('is-staged');

    const words = states.map((s) => s.querySelector<HTMLElement>('[data-svc-word]')!);
    const splits = words.map((w) => SplitText.create(w, { type: 'chars', charsClass: 'svc-char' }));
    const chars = splits.map((s) => s.chars as HTMLElement[]);
    const lines = states.map((s) => gsap.utils.toArray<HTMLElement>('[data-svc-line]', s));
    const fades = states.map((s) => gsap.utils.toArray<HTMLElement>('[data-svc-fade]', s));

    // Give each letter the slice of the light that falls on it, so the whole word reads as one fill.
    // Uses layout offsets, which ignore the letters' slide transforms.
    function paintLetters() {
      words.forEach((word, i) => {
        chars[i].forEach((char) => {
          char.style.backgroundSize = `${word.offsetWidth}px ${word.offsetHeight}px`;
          char.style.backgroundPosition = `${-char.offsetLeft}px ${-char.offsetTop}px`;
        });
      });
    }

    // How far along the orb sits as each word's full stop: just after the last letter.
    // (Its height is fixed in CSS, on the words' shared baseline.)
    function orbX(i: number) {
      const stageBox = stage.getBoundingClientRect();
      const wordBox = words[i].getBoundingClientRect();
      const last = chars[i][chars[i].length - 1];
      const fontSize = parseFloat(getComputedStyle(words[i]).fontSize);
      return wordBox.left - stageBox.left + last.offsetLeft + last.offsetWidth + fontSize * 0.05;
    }

    // Starting state: only the first service shows.
    states.forEach((_, i) => {
      if (i === 0) return;
      gsap.set(lines[i], { autoAlpha: 0 });
      gsap.set(fades[i], { autoAlpha: 0 });
      gsap.set(chars[i], { yPercent: 110 });
    });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${(states.length - 1) * 130 + 60}%`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 'labelsDirectional', duration: { min: 0.3, max: 0.9 }, delay: 0.15, ease: 'power1.inOut' },
        onRefresh: paintLetters,
      },
    });

    tl.set(orb, { x: () => orbX(0) }, 0);
    tl.addLabel('s0', 0);

    // Each change: hold the current service for a moment, then play the swap.
    states.forEach((_, i) => {
      if (i === 0) return;
      const from = i - 1;
      const at = (i - 1) * 2 + 1;

      tl.to(lines[from], { xPercent: (k) => (k % 2 === 0 ? -16 : 16), autoAlpha: 0, duration: 0.5, stagger: 0.08 }, at)
        .to(fades[from], { y: -30, autoAlpha: 0, duration: 0.45, stagger: 0.05 }, at)
        .to(chars[from], { yPercent: -110, duration: 0.5, stagger: 0.03, ease: 'power2.in' }, at + 0.05)
        .to(orb, { x: () => orbX(i), duration: 0.9 }, at + 0.1)
        .fromTo(chars[i], { yPercent: 110 }, { yPercent: 0, duration: 0.55, stagger: 0.035, ease: 'power3.out' }, at + 0.4)
        .fromTo(
          lines[i],
          { xPercent: (k) => (k % 2 === 0 ? 16 : -16), autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1, duration: 0.55, stagger: 0.08 },
          at + 0.45,
        )
        .fromTo(fades[i], { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06 }, at + 0.5)
        .addLabel(`s${i}`, at + 1);
    });
    // A last moment on the final service before the scene lets go.
    tl.to({}, { duration: 0.6 });

    // The hero's wave lines continue here, fading around every service's text (traced at rest).
    const base = section.querySelector<HTMLCanvasElement>('[data-svc-lines]')!;
    const glow = section.querySelector<HTMLCanvasElement>('[data-svc-glow]')!;
    startWaveLines(stage, base, glow, {
      canDraw: () => section.classList.contains('is-staged'),
      atRest: () => [...lines.flat(), ...fades.flat(), ...chars.flat()],
    });

    paintLetters();
    document.fonts?.ready.then(() => {
      paintLetters();
      ScrollTrigger.refresh();
    });

    return () => {
      splits.forEach((s) => s.revert());
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
