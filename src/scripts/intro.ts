import gsap from 'gsap';
import { band } from '../data/site';

/**
 * Plays the site intro chosen in <html data-intro="a|b|c"> (set before first paint).
 * Calls `reveal` the moment the page starts to show through, so the hero animation can begin
 * underneath; resolves once the overlay is gone. Clicking or pressing a key skips to the end.
 */
export function playIntro(reveal: () => void): Promise<void> {
  const root = document.documentElement;
  const variant = root.dataset.intro;
  const el = variant ? document.querySelector<HTMLElement>(`[data-intro-el="${variant}"]`) : null;
  if (!el) {
    reveal();
    return Promise.resolve();
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  let revealed = false;
  const doReveal = () => {
    if (!revealed) (revealed = true), reveal();
  };

  if (variant === 'a') {
    const dirs = [[0, -1], [-1, -0.35], [1, -0.35], [-0.7, 0.85], [0.7, 0.85]];
    tl.from(el.querySelectorAll('.ia-sh'), { x: (i) => dirs[i][0] * 420, y: (i) => dirs[i][1] * 420, opacity: 0, duration: 1, stagger: 0.07 }, 0.15)
      .to(el.querySelector('.ia-plug'), { opacity: 0, duration: 0.3, ease: 'power1.out' }, 1.25)
      .to(el.querySelector('.ia-zoom'), { scale: 45, svgOrigin: '241 230', duration: 1.15, ease: 'power3.in' }, 1.35)
      .call(doReveal, [], 1.95);
  } else if (variant === 'b') {
    const num = el.querySelector<HTMLElement>('[data-ib-num]')!;
    const word = el.querySelector<HTMLElement>('[data-ib-word]')!;
    const count = { n: 0 };
    tl.to(count, { n: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => (num.textContent = String(Math.round(count.n))) }, 0.1)
      .to(el.querySelector('.ib-star'), { rotation: 216, duration: 1.8, ease: 'power2.inOut' }, 0);
    band.forEach((w, i) => tl.call(() => (word.textContent = w), [], 0.1 + i * 0.34));
    tl.call(doReveal, [], 1.95).to(el, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, 1.9);
  } else {
    // Both halves carry a copy of the scene; stagger by position so the copies move as one.
    const n = (sel: string) => el.querySelectorAll(sel).length / 2;
    const marks = n('.ic-g'), chars = n('.ic-ch');
    tl.from(el.querySelectorAll('.ic-g'), { scale: 0, rotation: -120, duration: 0.8, ease: 'back.out(2)', stagger: (i) => (i % marks) * 0.07 }, 0.1)
      .from(el.querySelectorAll('.ic-ch'), { yPercent: 110, duration: 0.8, stagger: (i) => (i % chars) * 0.04 }, 0.25)
      .to(el.querySelector('.ic-top'), { yPercent: -100, duration: 1, ease: 'power4.inOut' }, 1.4)
      .to(el.querySelector('.ic-bot'), { yPercent: 100, duration: 1, ease: 'power4.inOut' }, 1.4)
      .call(doReveal, [], 1.55);
  }

  const skip = () => tl.progress(1);
  addEventListener('pointerdown', skip, { once: true });
  addEventListener('keydown', skip, { once: true });

  return new Promise((resolve) => {
    tl.eventCallback('onComplete', () => {
      doReveal();
      el.remove();
      root.removeAttribute('data-intro');
      removeEventListener('pointerdown', skip);
      removeEventListener('keydown', skip);
      resolve();
    });
  });
}
