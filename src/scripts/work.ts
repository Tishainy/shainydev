import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Work: the Jarvis mini demo (the orb listens and speaks while a real exchange types itself out,
 * looping only while on screen) and the travel agency row's progress line.
 */
export function initWork() {
  const section = document.querySelector<HTMLElement>('[data-work]');
  if (!section) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The progress line fills partway as the row passes: the site is still in progress.
  if (!reduce) {
    gsap.utils.toArray<HTMLElement>('[data-work-progress]', section).forEach((progress) => {
      gsap.from(progress, {
        scaleX: 0,
        ease: 'none',
        scrollTrigger: { trigger: progress, start: 'top 90%', end: 'top 45%', scrub: 1 },
      });
    });
  }

  const orb = section.querySelector<HTMLElement>('[data-work-orb]');
  if (!orb || reduce) return; // Reduced motion: the full transcript simply stays visible.

  const rings = gsap.utils.toArray<HTMLElement>('[data-work-ring]', section);
  const lines = gsap.utils.toArray<HTMLElement>('[data-work-line]', section);
  const said = gsap.utils.toArray<HTMLElement>('[data-work-said]', section);
  // Split into words as well as letters, so lines only break between whole words.
  const letters = said.map((el) => SplitText.create(el, { type: 'words,chars' }).chars);

  // Someone is speaking: rings spread from the orb and it swells gently.
  function speaking(tl: gsap.core.Timeline, at: number, length: number, jarvis: boolean) {
    const pulses = Math.max(1, Math.round(length / 0.7));
    tl.to(orb, { scale: jarvis ? 1.12 : 1.05, duration: 0.25, ease: 'power2.out' }, at);
    for (let p = 0; p < pulses; p++) {
      const ring = rings[p % rings.length];
      tl.fromTo(
        ring,
        { scale: 1, autoAlpha: jarvis ? 0.9 : 0.5 },
        { scale: jarvis ? 2.1 : 1.7, autoAlpha: 0, duration: 1.1, ease: 'power2.out' },
        at + p * 0.7,
      );
    }
    tl.to(orb, { scale: 1, duration: 0.4, ease: 'power2.inOut' }, at + length);
  }

  const demo = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true });
  demo.set(lines, { autoAlpha: 0, y: 12 }).set(letters.flat(), { autoAlpha: 0 });

  let at = 0.15;
  lines.forEach((line, i) => {
    const jarvis = line.classList.contains('is-jarvis');
    // Jarvis "thinks" for a moment before answering.
    if (jarvis) at += 0.35;
    const typing = letters[i].length * (jarvis ? 0.018 : 0.022);
    demo.to(line, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, at);
    demo.to(letters[i], { autoAlpha: 1, duration: 0.01, stagger: typing / letters[i].length }, at + 0.15);
    speaking(demo, at, typing + 0.2, jarvis);
    at += typing + 0.6;
  });
  // Hold the finished exchange, then clear it for the next loop.
  demo.to(lines, { autoAlpha: 0, y: -12, duration: 0.5, stagger: 0.05, ease: 'power2.in' }, at + 2.4);

  // Only run while the demo is on screen.
  ScrollTrigger.create({
    trigger: section.querySelector('[data-work-demo]'),
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (self.isActive ? demo.play() : demo.pause()),
  });

  // The orb's highlight turns to face the cursor, like the others.
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
    if (r.bottom < 0 || r.top > innerHeight) return;
    const dx = pointer.x - (r.left + r.width / 2);
    const dy = pointer.y - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy) || 1;
    shine.x += (50 + (dx / dist) * 22 - shine.x) * 0.12;
    shine.y += (50 + (dy / dist) * 22 - shine.y) * 0.12;
    orb.style.setProperty('--sx', `${shine.x}%`);
    orb.style.setProperty('--sy', `${shine.y}%`);
  });
}
