import gsap from 'gsap';

/**
 * Plays the site intro when <html data-intro> is set (decided before first paint).
 * Calls `reveal` the moment the page starts to show through, so the hero animation can begin
 * underneath; resolves once the overlay is gone. Clicking or pressing a key skips to the end.
 */
export function playIntro(reveal: () => void): Promise<void> {
  const root = document.documentElement;
  const el = root.dataset.intro ? document.querySelector<HTMLElement>('[data-intro-el]') : null;
  if (!el) {
    reveal();
    return Promise.resolve();
  }

  let revealed = false;
  const doReveal = () => {
    if (!revealed) (revealed = true), reveal();
  };

  // Both halves carry a copy of the scene; stagger by position so the copies move as one.
  const n = (sel: string) => el.querySelectorAll(sel).length / 2;
  const marks = n('.ic-g'), chars = n('.ic-ch');
  const tl = gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    .from(el.querySelectorAll('.ic-g'), { scale: 0, rotation: -120, duration: 0.8, ease: 'back.out(2)', stagger: (i) => (i % marks) * 0.07 }, 0.1)
    .from(el.querySelectorAll('.ic-ch'), { yPercent: 110, duration: 0.8, stagger: (i) => (i % chars) * 0.04 }, 0.25)
    .to(el.querySelector('.ic-top'), { yPercent: -100, duration: 1, ease: 'power4.inOut' }, 1.4)
    .to(el.querySelector('.ic-bot'), { yPercent: 100, duration: 1, ease: 'power4.inOut' }, 1.4)
    .call(doReveal, [], 1.55);

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
