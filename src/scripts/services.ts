import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Services, the film strip: a pinned scene whose frames slide sideways as you scroll down.
 * One master timeline alternates "play this frame's demo" with "slide to the next frame",
 * so scrolling plays the demos forward and back. Snaps to each frame with its demo complete.
 */
export function initServices() {
  const section = document.querySelector<HTMLElement>('[data-services]');
  if (!section) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.add('is-strip');

    const strip = section.querySelector<HTMLElement>('[data-svc-strip]')!;
    const frames = gsap.utils.toArray<HTMLElement>('[data-svc-frame]', section);
    const dots = gsap.utils.toArray<HTMLElement>('[data-svc-dot]', section);
    const count = frames.length;

    const demos = frames.map(demoFor);

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${(count * 2 - 1) * 55}%`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 'labelsDirectional', duration: { min: 0.3, max: 1 }, delay: 0.1, ease: 'power1.inOut' },
        onUpdate: (self) => {
          const active = Math.min(count - 1, Math.floor(self.progress * (count * 2 - 1) / 2 + 0.25));
          dots.forEach((dot, i) => dot.classList.toggle('is-on', i === active));
        },
      },
    });

    tl.addLabel('f0-start', 0);
    frames.forEach((frame, i) => {
      // Play this frame's demo.
      tl.add(demos[i].duration(1), '>');
      tl.addLabel(`f${i}`);
      if (i === count - 1) return;

      // Slide to the next frame. Its word drifts a little slower than the strip for depth,
      // and its details rise in as it arrives.
      const next = frames[i + 1];
      const at = tl.duration();
      tl.to(strip, { x: () => -next.offsetLeft, duration: 1, ease: 'power2.inOut' }, at);
      tl.fromTo(
        next.querySelector('[data-svc-word]'),
        { xPercent: 18 },
        { xPercent: 0, duration: 1, ease: 'power2.out' },
        at,
      );
      tl.fromTo(
        next.querySelectorAll('[data-svc-part], [data-svc-demo]'),
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        at + 0.45,
      );
    });

    dots[0]?.classList.add('is-on');

    return () => {
      section.classList.remove('is-strip');
      gsap.set(strip, { clearProps: 'transform' });
    };
  });

  // Phones: three orbs pick the service. The chosen one's details rise in and its demo plays. It
  // cycles on its own while on screen, until a visitor taps an orb.
  mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.add('is-picker');
    const frames = gsap.utils.toArray<HTMLElement>('[data-svc-frame]', section);
    const picks = gsap.utils.toArray<HTMLButtonElement>('[data-svc-pick]', section);
    const demos = frames.map(demoFor).map((demo) => demo.pause().duration(2.4));
    let current = -1;
    let cycling = true;
    let timer: gsap.core.Tween | undefined;

    const select = (i: number) => {
      if (i === current) return;
      current = i;
      picks.forEach((pick, k) => pick.setAttribute('aria-selected', String(k === i)));
      frames.forEach((frame, k) => frame.classList.toggle('is-current', k === i));
      const parts = frames[i].querySelectorAll('[data-svc-part], [data-svc-demo]');
      gsap.fromTo(parts, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out' });
      demos[i].play(0);
    };
    const next = () => {
      timer?.kill();
      if (!cycling) return;
      timer = gsap.delayedCall(6, () => {
        select((current + 1) % frames.length);
        next();
      });
    };

    picks.forEach((pick, i) =>
      pick.addEventListener('click', () => {
        cycling = false;
        timer?.kill();
        select(i);
      }),
    );
    select(0);
    // Only cycle while the section is on screen.
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      onToggle: (self) => (self.isActive ? next() : timer?.kill()),
    });

    return () => {
      timer?.kill();
      section.classList.remove('is-picker');
      frames.forEach((frame) => frame.classList.remove('is-current'));
    };
  });
}

/** The demo timeline for a frame, by its showcase kind. */
function demoFor(frame: HTMLElement) {
  const kind = frame.querySelector<HTMLElement>('[data-svc-demo]')?.dataset.svcDemo;
  if (kind === 'build') return buildDemo(frame);
  if (kind === 'automate') return automateDemo(frame);
  if (kind === 'ai') return aiDemo(frame);
  return gsap.timeline();
}

/**
 * Build: a grey wireframe turns into the finished, styled page. Each element gets a grey cover bar
 * that fades away; nothing is recoloured, so the page always uses the current theme's colours.
 */
function buildDemo(frame: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  const wires = gsap.utils.toArray<HTMLElement>('[data-wire]', frame);
  const fills = gsap.utils.toArray<HTMLElement>('[data-wire-fill]', frame);
  const bars = wires.map((el) => {
    const existing = el.querySelector<HTMLElement>('.wire-bar');
    if (existing) return existing;
    const bar = document.createElement('span');
    bar.className = 'wire-bar';
    bar.setAttribute('aria-hidden', 'true');
    el.append(bar);
    return bar;
  });

  bars.forEach((bar, i) => {
    tl.fromTo(bar, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.25 }, 0.1 + i * 0.07);
  });
  tl.fromTo(fills, { autoAlpha: 0 }, { autoAlpha: (i) => (i === 0 ? 1 : 0.7), duration: 0.3, stagger: 0.08 }, 0.35);
  return tl;
}

/** Automate: a glowing dot travels down the steps, lighting each one; the email builds itself. */
function automateDemo(frame: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } });
  const track = frame.querySelector<HTMLElement>('[data-flow-track]')!;
  const fill = frame.querySelector<HTMLElement>('[data-flow-fill]')!;
  const orb = frame.querySelector<HTMLElement>('[data-flow-orb]')!;
  const steps = gsap.utils.toArray<HTMLElement>('[data-flow-step]', frame);
  const mail = frame.querySelector<HTMLElement>('[data-flow-mail]')!;

  tl.set(steps, { opacity: 0.35 }, 0)
    .fromTo(fill, { scaleY: 0 }, { scaleY: 1, duration: 0.8 }, 0.1)
    .fromTo(orb, { y: 0 }, { y: () => track.offsetHeight - orb.offsetHeight / 2, duration: 0.8 }, 0.1);
  steps.forEach((step, i) => tl.to(step, { opacity: 1, duration: 0.08 }, 0.1 + (i / (steps.length - 1)) * 0.78));
  // The confirmation email builds itself as the dot passes step two.
  tl.fromTo(
    mail.children,
    { y: 14, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.12, stagger: 0.05, ease: 'power2.out' },
    0.3,
  );
  return tl;
}

/** AI: the customer's question pops in, the assistant types, then answers. */
function aiDemo(frame: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  const question = frame.querySelector<HTMLElement>('[data-chat-q]')!;
  const typing = frame.querySelector<HTMLElement>('[data-chat-typing]')!;
  const answer = frame.querySelector<HTMLElement>('[data-chat-a]')!;
  const letters = SplitText.create(answer, { type: 'words,chars' }).chars;

  tl.fromTo(question, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.12 }, 0.05)
    .fromTo(typing, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.08 }, 0.22)
    .to(typing.children, { y: -4, duration: 0.05, stagger: 0.03, yoyo: true, repeat: 3 }, 0.3)
    .to(typing, { autoAlpha: 0, duration: 0.05 }, 0.55)
    .set(typing, { display: 'none' }, 0.6)
    .fromTo(answer, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.08 }, 0.6)
    .fromTo(letters, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: 0.32 / letters.length }, 0.62);
  return tl;
}
