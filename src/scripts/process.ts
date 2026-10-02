import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Process: each step's cobalt line draws itself in order as the staircase scrolls through, then the
 * step's text appears. About: "Hi, I'm Shainy." rises in word by word.
 * With reduced motion, everything is simply shown.
 */
export function initProcessAndAbout() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const steps = document.querySelector<HTMLElement>('[data-proc-steps]');
  if (steps) {
    const stepEls = gsap.utils.toArray<HTMLElement>('[data-proc-step]', steps);
    const lines = gsap.utils.toArray<HTMLElement>('[data-proc-line]', steps);
    const texts = stepEls.map((step) => gsap.utils.toArray<HTMLElement>('[data-proc-text]', step));

    // The staircase is drawn by the scroll, step after step.
    const tl = gsap.timeline({
      scrollTrigger: { trigger: steps, start: 'top 80%', end: 'bottom 60%', scrub: 1 },
    });
    lines.forEach((line, i) => {
      tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, i).fromTo(
        texts[i],
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
        i + 0.55,
      );
    });
  }

  const intro = document.querySelector<HTMLElement>('[data-about-intro]');
  if (intro) {
    const words = SplitText.create(intro, { type: 'words', mask: 'words' }).words;
    gsap.from(words, {
      yPercent: 110,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: { trigger: intro, start: 'top 82%', once: true },
    });
  }
}
