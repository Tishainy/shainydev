import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Where the service chips land at the end of the scroll: a staggered staircase.
// Fractions of the stage width/height; `scale` grows the chips into big words.
const CHIP_TARGETS = {
  desktop: { x: [0.06, 0.13, 0.2], y: [0.24, 0.41, 0.58], scale: 2.1 },
  mobile: { x: [0.05, 0.12, 0.19], y: [0.16, 0.25, 0.34], scale: 1.45 },
};

/** Hero set piece: intro on load, a pinned scroll-scrubbed sequence, and pointer effects. */
export function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const q = <T extends Element = HTMLElement>(selector: string) => hero.querySelector<T>(selector)!;
  const stage = q('[data-hero-stage]');
  const shainy = q('[data-hero-shainy]');
  const dev = q('[data-hero-dev]');
  const greeting = q('[data-hero-greeting]');
  const hint = q('[data-hero-hint]');
  const card = q('[data-hero-card]');
  const cardInner = q('[data-hero-card-inner]');
  const blobs = q('[data-hero-blobs]');
  const glow = q('[data-hero-glow]');
  const parallax = q('[data-hero-parallax]');
  const chips = gsap.utils.toArray<HTMLElement>('[data-hero-chip]', hero);
  const chipInners = gsap.utils.toArray<HTMLElement>('[data-hero-chip-inner]', hero);

  // Only "Shainy" is split into letters; "Dev" keeps its gradient and moves as one word.
  const split = SplitText.create(shainy, { type: 'chars', charsClass: 'hero-char' });
  const shainyChars = split.chars;

  // The chips' resting tilt comes from CSS (so it shows without JS). Hand it to GSAP
  // so the scroll timeline can straighten them out.
  const tilts = chips.map((chip) => parseFloat(getComputedStyle(chip).rotate) || 0);
  chips.forEach((chip) => (chip.style.rotate = '0deg'));
  gsap.set(chips, { rotation: (i) => tilts[i] });

  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
    },
    (context) => {
      const { desktop } = context.conditions as { desktop: boolean; mobile: boolean };
      const targets = desktop ? CHIP_TARGETS.desktop : CHIP_TARGETS.mobile;

      // ---- Intro: one orchestrated moment on load ----
      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
      intro
        .from(shainyChars, { yPercent: 105, duration: 1.1, stagger: 0.035 })
        .from(dev, { yPercent: 40, autoAlpha: 0, duration: 1.1 }, 0.3)
        .from(chipInners, { scale: 0.4, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.8)' }, 0.45)
        .from(cardInner, { y: 28, autoAlpha: 0, duration: 0.9 }, 0.6)
        .from(greeting, { yPercent: 60, duration: 0.8 }, 0.2);

      // ---- Scroll: the name breaks apart, the services lock into a staircase ----
      const scrub = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: desktop ? '+=160%' : '+=110%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const w = () => stage.clientWidth;
      const h = () => stage.clientHeight;

      scrub
        .to(hint, { autoAlpha: 0, duration: 0.1 }, 0)
        .to(greeting, { y: -40, autoAlpha: 0, duration: 0.3 }, 0)
        // Letters of "Shainy" scatter and fade into the background.
        .to(
          shainyChars,
          {
            x: () => gsap.utils.random(-0.35, 0.35) * w(),
            y: () => gsap.utils.random(-0.3, 0.45) * h(),
            rotation: () => gsap.utils.random(-70, 70),
            scale: () => gsap.utils.random(0.6, 1.3),
            autoAlpha: 0.1,
            duration: 0.65,
            stagger: { each: 0.02, from: 'random' },
          },
          0.05,
        )
        .to(dev, { xPercent: 45, autoAlpha: 0, duration: 0.5 }, 0.08)
        .to(dev, { backgroundPosition: '100% 0%', duration: 0.5, ease: 'none' }, 0)
        // Service chips straighten, grow and step into place.
        .to(
          chips,
          {
            x: (i, el: HTMLElement) => targets.x[i] * w() - el.offsetLeft,
            y: (i, el: HTMLElement) => targets.y[i] * h() - el.offsetTop,
            rotation: 0,
            scale: targets.scale,
            duration: 0.6,
            stagger: 0.07,
            ease: 'power3.inOut',
          },
          0.2,
        )
        // The glass card moves to centre stage.
        .to(
          card,
          {
            y: () => (desktop ? (h() - card.offsetHeight) / 2 : h() * 0.5) - card.offsetTop,
            scale: desktop ? 1.08 : 1,
            duration: 0.6,
            ease: 'power3.inOut',
          },
          0.3,
        )
        // The atmosphere turns and shifts with the scroll.
        .to(blobs, { rotation: 35, scale: 1.15, yPercent: -8, duration: 1, ease: 'none' }, 0);
    },
  );

  // ---- Pointer effects: desktop mice only ----
  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const glowX = gsap.quickTo(glow, 'x', { duration: 0.8, ease: 'power3' });
    const glowY = gsap.quickTo(glow, 'y', { duration: 0.8, ease: 'power3' });
    const blobsX = gsap.quickTo(blobs, 'x', { duration: 1.4, ease: 'power3' });
    const blobsY = gsap.quickTo(blobs, 'y', { duration: 1.4, ease: 'power3' });
    const titleX = gsap.quickTo(parallax, 'x', { duration: 1, ease: 'power3' });
    const titleY = gsap.quickTo(parallax, 'y', { duration: 1, ease: 'power3' });
    const magnets = chipInners.map((inner) => ({
      inner,
      x: gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' }),
      y: gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' }),
    }));

    gsap.to(glow, { opacity: 0.55, duration: 1.2, delay: 0.6 });

    const onMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      if (bounds.bottom < 0) return;
      const px = event.clientX - bounds.left;
      const py = event.clientY - bounds.top;
      // -0.5..0.5 from the centre, for parallax depth.
      const nx = px / bounds.width - 0.5;
      const ny = py / bounds.height - 0.5;

      glowX(px);
      glowY(py);
      blobsX(nx * -40);
      blobsY(ny * -40);
      titleX(nx * 18);
      titleY(ny * 12);

      // Chips lean toward the cursor when it comes close.
      for (const magnet of magnets) {
        const rect = magnet.inner.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const reach = Math.max(rect.width, rect.height) * 0.9 + 60;
        const near = Math.hypot(dx, dy) < reach;
        magnet.x(near ? dx * 0.3 : 0);
        magnet.y(near ? dy * 0.3 : 0);
      }
    };

    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.set(glow, { opacity: 0 });
    };
  });
}
