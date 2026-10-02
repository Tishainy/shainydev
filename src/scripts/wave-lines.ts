import gsap from 'gsap';

// Lines are drawn a little larger than their container so they can drift without showing edges.
export const BLEED = 64;
// How far the lines' fade reaches out from each letter, in px.
const HALO = 34;

interface Options {
  /** Elements whose transforms are switched off while measuring, so letters are traced at rest. */
  atRest?: () => HTMLElement[];
  /** Return false to skip a redraw (e.g. when the letters have been animated away). */
  canDraw?: () => boolean;
}

/**
 * Faint flowing wave lines behind a section. They fade out just before every letter (traced from
 * each character in its real font) and around elements marked [data-lines-avoid], and two soft
 * spotlights roam across them. Colours come from --wave-line / --wave-line-glow, so they follow the theme.
 */
export function startWaveLines(container: HTMLElement, base: HTMLCanvasElement, glow: HTMLCanvasElement, options: Options = {}) {
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mask = document.createElement('canvas');
  const mctx = mask.getContext('2d')!;

  function drawMask(w: number, h: number, dpr: number) {
    mask.width = w * dpr;
    mask.height = h * dpr;
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.filter = 'blur(18px)';
    mctx.fillStyle = '#000';
    mctx.strokeStyle = '#000';
    mctx.lineJoin = 'round';
    mctx.lineWidth = HALO * 2;

    const origin = container.getBoundingClientRect();
    const ox = BLEED - origin.left;
    const oy = BLEED - origin.top;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement!;
      const cs = getComputedStyle(parent);
      if (cs.display === 'none') continue;
      const text = node.textContent ?? '';
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
    // Shapes that aren't text, such as buttons and orbs.
    container.querySelectorAll<HTMLElement>('[data-lines-avoid]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      mctx.beginPath();
      mctx.roundRect(r.left + ox - HALO, r.top + oy - HALO, r.width + HALO * 2, r.height + HALO * 2, Math.min(r.width, r.height) / 2 + HALO);
      mctx.fill();
    });
    mctx.filter = 'none';
  }

  function draw() {
    if (options.canDraw && !options.canDraw()) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = container.clientWidth + BLEED * 2;
    const h = container.clientHeight + BLEED * 2;

    // Trace the letters where they rest, not where an animation has moved them.
    const resting = options.atRest?.() ?? [];
    const saved = resting.map((el) => [el.style.transform, el.style.translate] as const);
    resting.forEach((el) => {
      el.style.transform = 'none';
      el.style.translate = 'none';
    });
    drawMask(w, h, dpr);
    resting.forEach((el, i) => {
      el.style.transform = saved[i][0];
      el.style.translate = saved[i][1];
    });

    const cs = getComputedStyle(container);
    const colours = [cs.getPropertyValue('--wave-line').trim(), cs.getPropertyValue('--wave-line-glow').trim()];
    [base, glow].forEach((canvas, i) => {
      const ctx = canvas.getContext('2d')!;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = colours[i];
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
    });
  }

  // Letter positions are only final once the fonts are in.
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
    const w = container.clientWidth;
    const h = container.clientHeight;
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

  return { redraw: () => requestAnimationFrame(draw) };
}
