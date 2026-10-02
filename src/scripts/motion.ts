import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { initHero } from './hero';
import { initServices } from './services';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Phone address bars resize the viewport while scrolling; don't recalculate pins for that.
ScrollTrigger.config({ ignoreMobileResize: true });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Height of the fixed header, so in-page jumps don't hide headings beneath it.
const HEADER_OFFSET = 64;

// Smooth scroll, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
// Skipped entirely for reduced-motion visitors (native scrolling instead).
function startSmoothScroll() {
  if (reducedMotion.matches) return;
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // In-page nav links scroll through Lenis so they stay smooth.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = link.hash && document.querySelector(link.hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -HEADER_OFFSET });
    });
  });
}

// Shared reveal: any element with [data-reveal] fades and rises in as it enters.
// Content is visible without JS; the hidden start state is only set here.
// Reduced-motion visitors get a plain fade without movement.
function startReveals() {
  const mm = gsap.matchMedia();

  mm.add(
    { motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
    (context) => {
      const { reduce } = context.conditions as { motion: boolean; reduce: boolean };
      const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      gsap.set(targets, { autoAlpha: 0, y: reduce ? 0 : 32 });

      ScrollTrigger.batch(targets, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: reduce ? 0.4 : 0.8,
            ease: 'power3.out',
            stagger: reduce ? 0 : 0.08,
            overwrite: true,
          }),
      });
    },
  );
}

startSmoothScroll();
// ScrollTriggers are created top to bottom so pin spacing is measured in page order.
initHero();
initServices();
startReveals();

// Web fonts change text metrics; recalculate trigger positions once they're in.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
