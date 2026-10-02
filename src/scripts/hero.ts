import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Wave lines are drawn a little larger than the hero so they can drift without showing edges.
const BLEED = 64;
// How far the lines' fade reaches out from each letter, in px.
const HALO = 34;

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  startWaveLines(hero, base, glow);
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

/**
 * Faint flowing wave lines behind the hero. They fade out just before every letter
 * (traced from each character in its real font), and two soft spotlights roam across them.
 */
function startWaveLines(hero: HTMLElement, base: HTMLCanvasElement, glow: HTMLCanvasElement) {
  const mask = document.createElement('canvas');
  const mctx = mask.getContext('2d')!;
  // Line colours come from the hero's CSS, so they follow the theme.
  const colours = () => {
    const cs = getComputedStyle(hero);
    return [cs.getPropertyValue('--hero-line').trim(), cs.getPropertyValue('--hero-line-glow').trim()];
  };

  function drawMask(w: number, h: number, dpr: number) {
    mask.width = w * dpr;
    mask.height = h * dpr;
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.filter = 'blur(18px)';
    mctx.fillStyle = '#000';
    mctx.strokeStyle = '#000';
    mctx.lineJoin = 'round';
    mctx.lineWidth = HALO * 2;

    const origin = hero.getBoundingClientRect();
    const ox = BLEED - origin.left;
    const oy = BLEED - origin.top;
    const walker = document.createTreeWalker(hero, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement!;
      const text = node.textContent ?? '';
      const cs = getComputedStyle(parent);
      mctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (!ch.trim()) continue;
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const r = range.getBoundingClientRect();
        if (!r.width) continue;
        const ascent = mctx.measureText(ch).fontBoundingBoxAscent;
        mctx.strokeText(ch, r.left + ox, r.top + oy + ascent);
        mctx.fillText(ch, r.left + ox, r.top + oy + ascent);
      }
    }
    // Shapes that aren't text: the button and the orb.
    hero.querySelectorAll<HTMLElement>('[data-hero-pill], [data-hero-orb]').forEach((el) => {
      const r = el.getBoundingClientRect();
      mctx.beginPath();
      mctx.roundRect(
        r.left + ox - HALO,
        r.top + oy - HALO,
        r.width + HALO * 2,
        r.height + HALO * 2,
        Math.min(r.width, r.height) / 2 + HALO,
      );
      mctx.fill();
    });
    mctx.filter = 'none';
  }

  function draw() {
    // Measure at rest: once the visitor has scrolled, the scroll animation has moved the letters.
    if (window.scrollY > hero.offsetHeight * 0.1) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = hero.clientWidth + BLEED * 2;
    const h = hero.clientHeight + BLEED * 2;
    drawMask(w, h, dpr);

    const [line, lineGlow] = colours();
    for (const [canvas, colour] of [[base, line], [glow, lineGlow]] as const) {
      const ctx = canvas.getContext('2d')!;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = colour;
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Gently undulating lines, each a little out of phase with the next.
      for (let y = 0, row = 0; y < h + 40; y += 34, row++) {
        for (let x = 0; x <= w; x += 8) {
          const yy = y + Math.sin(x * 0.0042 + row * 0.38) * 18 + Math.sin(x * 0.0011 - row * 0.21) * 26;
          if (x === 0) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
      }
      ctx.stroke();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(mask, 0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // Letter positions are only final once the fonts are in, and before the intro moves them.
  // The intro starts from the same fonts-ready moment, so measure in the same frame, first.
  const fonts = document.fonts?.ready ?? Promise.resolve();
  fonts.then(draw);
  addEventListener('resize', () => requestAnimationFrame(draw));
  // Redraw in the other theme's colours when the theme is switched.
  new MutationObserver(() => requestAnimationFrame(draw)).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // Two spotlights wander across the lines on their own.
  let t = Math.random() * 100;
  gsap.ticker.add((_, delta) => {
    if (!reduce()) t += delta / 1000;
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    glow.style.setProperty('--sp1x', `${w * (0.5 + 0.44 * Math.sin(t * 0.21) * Math.cos(t * 0.09)) + BLEED}px`);
    glow.style.setProperty('--sp1y', `${h * (0.5 + 0.4 * Math.sin(t * 0.16 + 1.3)) + BLEED}px`);
    glow.style.setProperty('--sp2x', `${w * (0.5 + 0.44 * Math.cos(t * 0.17 + 2.1)) + BLEED}px`);
    glow.style.setProperty('--sp2y', `${h * (0.5 + 0.4 * Math.sin(t * 0.13 + 4.2) * Math.cos(t * 0.07)) + BLEED}px`);
  });

  // A little depth: the lines drift against the cursor.
  if (!reduce()) {
    const gx = gsap.quickTo([base, glow], 'x', { duration: 1.2, ease: 'power3' });
    const gy = gsap.quickTo([base, glow], 'y', { duration: 1.2, ease: 'power3' });
    addEventListener('pointermove', (e) => {
      gx(-(e.clientX / innerWidth - 0.5) * 16);
      gy(-(e.clientY / innerHeight - 0.5) * 16);
    });
  }
}
