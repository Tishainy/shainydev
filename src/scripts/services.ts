import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Services: the big sticky word changes to match the service panel in view.
 * Letters of the old word slide up and out, the new word's letters rise in,
 * and the glass orb (the full stop) glides to the end of the new word.
 */
export function initServices() {
  const section = document.querySelector<HTMLElement>('[data-services]');
  if (!section) return;

  const words = gsap.utils.toArray<HTMLElement>('[data-svc-word]', section);
  const ghost = section.querySelector<HTMLElement>('[data-svc-ghost]')!;
  const orb = section.querySelector<HTMLElement>('[data-svc-orb]')!;
  const panels = gsap.utils.toArray<HTMLElement>('[data-svc-panel]', section);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Words are plain text in a single colour, so splitting them into letters is safe.
  const letters = words.map((word) => SplitText.create(word, { type: 'chars' }).chars as HTMLElement[]);
  let active = 0;

  function show(next: number) {
    if (next === active) return;
    const prev = active;
    active = next;
    const down = next > prev;

    // Where the orb is now, before the width changes.
    const before = orb.getBoundingClientRect().left;
    ghost.textContent = words[next].textContent;
    const after = orb.getBoundingClientRect().left;

    words.forEach((word, i) => word.classList.toggle('is-active', i === next || i === prev));

    if (reduce) {
      words[prev].classList.remove('is-active');
      return;
    }

    gsap.killTweensOf([...letters[prev], ...letters[next], orb]);
    gsap.to(letters[prev], {
      yPercent: down ? -110 : 110,
      duration: 0.5,
      ease: 'power3.in',
      stagger: 0.025,
      onComplete: () => {
        if (active !== prev) words[prev].classList.remove('is-active');
      },
    });
    gsap.fromTo(
      letters[next],
      { yPercent: down ? 110 : -110 },
      { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.035, delay: 0.25 },
    );
    // The full stop slides from its old spot to the end of the new word.
    gsap.fromTo(orb, { x: before - after }, { x: 0, duration: 1, ease: 'expo.inOut', delay: 0.1 });
  }

  panels.forEach((panel, i) => {
    ScrollTrigger.create({
      trigger: panel,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => show(i),
      onEnterBack: () => show(i),
    });
  });

  // The orb's highlight turns to face the cursor, like the one in the hero.
  if (!reduce) {
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
}
