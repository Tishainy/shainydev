import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Where the baseline sits below the top of a word's box, in em (measured on screen for
// Clash Display at line-height 0.84).
const BASELINE = 0.81;
// How small the inactive words are in the mini index, relative to the big word.
const INDEX_SCALE = 0.2;

/**
 * Services, "grow & shrink": a pinned scene. One service word is huge, lit and finished with the
 * glass orb; the other two sit small in a mini index top-right. Scrolling grows the next word out
 * of the index into the big spot while the current one shrinks into the index, and that
 * service's details slide in. Snaps to each service; reverses on the way back up.
 */
export function initServices() {
  const section = document.querySelector<HTMLElement>('[data-services]');
  if (!section) return;
  const scene = section.querySelector<HTMLElement>('[data-svc-scene]')!;
  const orb = section.querySelector<HTMLElement>('[data-svc-orb]')!;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.add('is-staged');

    const words = gsap.utils.toArray<HTMLElement>('[data-svc-w]', section);
    const solids = gsap.utils.toArray<HTMLElement>('[data-svc-solid]', section);
    const fills = gsap.utils.toArray<HTMLElement>('[data-svc-fill]', section);
    const sums = gsap.utils.toArray<HTMLElement>('[data-svc-sum]', section);
    const sumLines = sums.map((s) => gsap.utils.toArray<HTMLElement>('[data-svc-sum-line]', s));
    const descs = gsap.utils.toArray<HTMLElement>('[data-svc-desc]', section);
    const incs = gsap.utils.toArray<HTMLElement>('[data-svc-inc]', section);
    const count = words.length;

    // Where word `i` sits when service `active` is showing: the big spot, or a line in the index.
    function pose(i: number, active: number) {
      if (i === active) return { x: 0, y: 0, scale: 1 };
      const slot = [...Array(count).keys()].filter((k) => k !== active).indexOf(i);
      const word = words[i];
      const w = scene.clientWidth;
      const h = scene.clientHeight;
      const lineHeight = word.offsetHeight * INDEX_SCALE;
      return {
        x: w * 0.95 - word.offsetWidth * INDEX_SCALE - word.offsetLeft,
        y: h * 0.1 + slot * (lineHeight + 6) - word.offsetTop,
        scale: INDEX_SCALE,
      };
    }

    // The orb's spot as the big word's full stop: just after it, resting on its baseline.
    function orbSpot(i: number) {
      const word = words[i];
      const size = parseFloat(getComputedStyle(word).fontSize);
      return {
        x: word.offsetLeft + word.offsetWidth + size * 0.06,
        y: word.offsetTop + size * BASELINE - size * 0.16,
      };
    }

    // Starting state: Build big and lit, the others in the index, only Build's details showing.
    words.forEach((word, i) => {
      gsap.set(word, { x: () => pose(i, 0).x, y: () => pose(i, 0).y, scale: pose(i, 0).scale });
      gsap.set(fills[i], { autoAlpha: i === 0 ? 1 : 0 });
      gsap.set(solids[i], { autoAlpha: i === 0 ? 0 : 0.6 });
      gsap.set([sums[i], descs[i], incs[i]], { autoAlpha: i === 0 ? 1 : 0 });
    });

    // Entering: the big word rises in, the details and index follow.
    const enter = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 10%', scrub: 1 },
    });
    enter
      .from(words, { yPercent: 40, autoAlpha: 0, stagger: 0.1, ease: 'power2.out' }, 0)
      .from(orb, { scale: 0, ease: 'back.out(2)' }, 0.3)
      .from([sums[0], descs[0], incs[0]], { y: 40, autoAlpha: 0, stagger: 0.1, ease: 'power2.out' }, 0.2);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
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

    // Starting poses live in the timeline too, so they're recalculated when the window resizes.
    words.forEach((word, i) => tl.set(word, { x: () => pose(i, 0).x, y: () => pose(i, 0).y, scale: pose(i, 0).scale }, 0));
    tl.set(orb, { x: () => orbSpot(0).x, y: () => orbSpot(0).y }, 0).addLabel('s0', 0);

    for (let next = 1; next < count; next++) {
      const prev = next - 1;
      const at = (next - 1) * 2 + 0.8;

      // Every word moves to its new pose: the next one grows out of the index, the current one shrinks into it.
      words.forEach((word, i) => {
        tl.to(
          word,
          { x: () => pose(i, next).x, y: () => pose(i, next).y, scale: pose(i, next).scale, duration: 1.1 },
          at,
        );
      });
      tl
        // The light leaves the shrinking word and fills the growing one.
        .to(fills[prev], { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, at)
        .to(solids[prev], { autoAlpha: 0.6, duration: 0.5, ease: 'power1.inOut' }, at)
        .to(solids[next], { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, at + 0.5)
        .to(fills[next], { autoAlpha: 1, duration: 0.6, ease: 'power1.inOut' }, at + 0.4)
        // The orb dips out and lands on the new word's end.
        .to(orb, { x: () => orbSpot(next).x, y: () => orbSpot(next).y, duration: 1.1 }, at)
        .to(orb, { scale: 0.4, duration: 0.45, ease: 'power2.in' }, at)
        .to(orb, { scale: 1, duration: 0.55, ease: 'back.out(2)' }, at + 0.6)
        // The details trade places.
        .to(sumLines[prev], { xPercent: (k) => (k === 0 ? -14 : 14), autoAlpha: 0, duration: 0.45, stagger: 0.06 }, at)
        .to([descs[prev], incs[prev]], { y: -24, autoAlpha: 0, duration: 0.45, stagger: 0.05 }, at)
        .set(sums[next], { autoAlpha: 1 }, at + 0.5)
        .fromTo(
          sumLines[next],
          { xPercent: (k) => (k === 0 ? 14 : -14), autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1, duration: 0.55, stagger: 0.07 },
          at + 0.6,
        )
        .fromTo([descs[next], incs[next]], { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.06 }, at + 0.7)
        .addLabel(`s${next}`, at + 1.35);
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
