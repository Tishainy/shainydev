import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { startWaveLines } from './wave-lines';

gsap.registerPlugin(ScrollTrigger);

/** Hero: load intro, pinned scroll sequence, the glass orb, and the wave-line background. */
export function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const q = <T extends Element = HTMLElement>(selector: string) => hero.querySelector<T>(selector)!;
  const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]', hero);
  const lineInners = gsap.utils.toArray<HTMLElement>('[data-hero-line-inner]', hero);
  const pill = q('[data-hero-pill]');
  const giant = q('[data-hero-giant]');
  const orb = q('[data-hero-orb]');
  const ball = q('[data-hero-orb-ball]');
  const base = q<HTMLCanvasElement>('[data-hero-lines]');
  const glow = q<HTMLCanvasElement>('[data-hero-glow]');

  const pointer = { x: innerWidth / 2, y: innerHeight / 2, active: false };
  addEventListener('pointermove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  });

  // Measure at rest: once the visitor has scrolled, the scroll animation has moved the letters.
  startWaveLines(hero, base, glow, { canDraw: () => window.scrollY < hero.offsetHeight * 0.1 });
  startHeaderState(hero);

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
    },
    (context) => {
      const { desktop } = context.conditions as { desktop: boolean; mobile: boolean };

      // ---- Scroll: the headline drifts apart, the name rises, the orb lifts off ----
      const scroll = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: desktop ? '+=110%' : '+=80%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
      const spread = desktop ? 14 : 10;
      scroll
        .to([base, glow], { autoAlpha: 0, duration: 0.3, ease: 'none' }, 0)
        .to(
          lines,
          {
            xPercent: (i) => (i % 2 === 0 ? -spread : spread),
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.06,
          },
          0,
        )
        .to(giant, { yPercent: desktop ? -42 : -30, scale: 1.06, duration: 1 }, 0.05)
        .to(orb, { y: () => -innerHeight * 0.18, duration: 0.8, ease: 'power3.inOut' }, 0.25);

      // ---- Intro: waits for the fonts so nothing jumps, then plays once ----
      let intro: gsap.core.Timeline | undefined;
      ready().then(() => {
        intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
        intro
          .fromTo([base, glow], { autoAlpha: 0 }, { autoAlpha: 1, duration: 2, ease: 'power1.out' }, 0)
          .from(lineInners, { yPercent: 115, duration: 1.2, stagger: 0.11 }, 0.1)
          .from(pill, { scale: 0.6, autoAlpha: 0, duration: 0.9, ease: 'back.out(2)' }, 0.75)
          .fromTo(
            giant,
            { clipPath: 'inset(100% 0% 0% 0%)', yPercent: 12 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              yPercent: 0,
              duration: 1.6,
              ease: 'expo.inOut',
              // Drop the clip once revealed, or it would cut off the orb's glow as it floats up.
              clearProps: 'clipPath',
            },
            0.35,
          )
          // Explicit end value: tweening a filter toward "none" dips through black.
          .fromTo(
            ball,
            { scale: 0.3, autoAlpha: 0, filter: 'brightness(2.4)' },
            { scale: 1, autoAlpha: 1, filter: 'brightness(1)', duration: 1.3, clearProps: 'filter' },
            1.5,
          );
      });

      // ---- The orb floats, leans toward the cursor and turns its shine to face it ----
      const float = gsap.to(ball, { y: -5, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.6 });
      const leanX = gsap.quickTo(orb, 'x', { duration: 0.8, ease: 'power3' });
      const shine = { x: 34, y: 28 };
      const light = { x: 50, y: 50 };
      const tick = () => {
        const rect = ball.getBoundingClientRect();
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dy = pointer.y - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        if (pointer.active) leanX(gsap.utils.clamp(-14, 14, dx * 0.03));
        shine.x += ((pointer.active ? 50 + (dx / dist) * 22 : 34) - shine.x) * 0.12;
        shine.y += ((pointer.active ? 50 + (dy / dist) * 22 : 28) - shine.y) * 0.12;
        ball.style.setProperty('--sx', `${shine.x}%`);
        ball.style.setProperty('--sy', `${shine.y}%`);

        // The light inside the name drifts toward the cursor.
        const h = hero.getBoundingClientRect();
        const tx = pointer.active ? 100 - ((pointer.x - h.left) / h.width) * 100 : 50;
        const ty = pointer.active ? 100 - ((pointer.y - h.top) / h.height) * 100 : 50;
        light.x += (tx - light.x) * 0.04;
        light.y += (ty - light.y) * 0.04;
        giant.style.backgroundPosition = `${light.x}% ${light.y}%`;
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        float.kill();
        intro?.kill();
      };
    },
  );

  // Reduced motion: everything visible and still.
  mm.add('(prefers-reduced-motion: reduce)', () => {
    document.documentElement.classList.remove('hero-pending');
  });
}

/** Resolves once the web fonts are in (or after 1.5s), and reveals the hero for its intro. */
function ready() {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  return Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(() => {
    document.documentElement.classList.remove('hero-pending');
  });
}

/** The header is transparent over the hero and turns solid once the hero has scrolled past. */
function startHeaderState(hero: HTMLElement) {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;
  ScrollTrigger.create({
    trigger: hero,
    start: 'bottom top+=64',
    onEnter: () => header.classList.add('is-scrolled'),
    onLeaveBack: () => header.classList.remove('is-scrolled'),
  });
}
