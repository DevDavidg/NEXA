import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type LandingRefs = {
  root: HTMLElement;
  revealTargets: HTMLElement[];
  heroSection: HTMLElement | null;
  heroBackdrop: HTMLElement | null;
  heroStage: HTMLElement | null;
  heroCopy: HTMLElement | null;
  heroProofCards: HTMLElement[];
  heroAmbient: HTMLElement[];
  heroCopyDecor: HTMLElement[];
  heroScrollCue: HTMLElement | null;
  heroPanels: HTMLElement[];
  heroShell: HTMLElement | null;
  heroThreeStage: HTMLElement | null;
  heroParticleStage: HTMLElement | null;
  heroRadar: HTMLElement | null;
  heroStreams: HTMLElement[];
  heroBeams: HTMLElement[];
  heroGlows: HTMLElement[];
  parallaxLayers: HTMLElement[];
  magneticTargets: HTMLElement[];
  cards: HTMLElement[];
  connectorPaths: SVGPathElement[];
  liveCounters: HTMLElement[];
};

type MotionOpts = { prefersReducedMotion: boolean; isDesktop: boolean };

function getLandingDOMRefs(): LandingRefs {
  const heroStage = document.querySelector<HTMLElement>('[data-hero-stage]');
  return {
    root: document.documentElement,
    revealTargets: Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')),
    heroSection: document.querySelector<HTMLElement>('.hero'),
    heroBackdrop: document.querySelector<HTMLElement>('.hero-backdrop'),
    heroStage,
    heroCopy: document.querySelector<HTMLElement>('.hero-copy'),
    heroProofCards: Array.from(document.querySelectorAll<HTMLElement>('[data-hero-proof-card]')),
    heroAmbient: Array.from(document.querySelectorAll<HTMLElement>('[data-hero-ambient]')),
    heroCopyDecor: Array.from(document.querySelectorAll<HTMLElement>('[data-hero-copy-decor]')),
    heroScrollCue: document.querySelector<HTMLElement>('[data-hero-scroll-cue]'),
    heroPanels: heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('[data-hero-panel]')) : [],
    heroShell: heroStage?.querySelector<HTMLElement>('.hero-stage-shell') ?? null,
    heroThreeStage: heroStage?.querySelector<HTMLElement>('.hero-three-stage') ?? null,
    heroParticleStage: heroStage?.querySelector<HTMLElement>('.hero-particle-stage') ?? null,
    heroRadar: heroStage?.querySelector<HTMLElement>('.hero-stage-radar') ?? null,
    heroStreams: heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('.hero-stage-data-stream')) : [],
    heroBeams: heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('.hero-stage-beam')) : [],
    heroGlows: heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('.hero-stage-glow')) : [],
    parallaxLayers: Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-layer]')),
    magneticTargets: [
      ...Array.from(document.querySelectorAll<HTMLElement>('.button')),
      ...Array.from(document.querySelectorAll<HTMLElement>('[data-hero-chip]'))
    ],
    cards: Array.from(
      document.querySelectorAll<HTMLElement>(
        '.feature-card, .story-card, .step-card, .bento-card, .pricing-card, .logo-strip, .final-cta'
      )
    ),
    connectorPaths: Array.from(document.querySelectorAll<SVGPathElement>('.section-connector-path')),
    liveCounters: Array.from(document.querySelectorAll<HTMLElement>('[data-live-counter]'))
  };
}

function buildIntroTimeline(refs: LandingRefs): gsap.core.Timeline {
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const {
    heroAmbient,
    heroCopyDecor,
    heroScrollCue,
    heroStage,
    heroShell,
    heroThreeStage,
    heroParticleStage,
    heroBeams,
    heroGlows,
    heroStreams,
    heroRadar,
    heroPanels,
    heroProofCards
  } = refs;

  intro
    .fromTo('.topbar', { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.65 })
    .fromTo('[data-hero-eyebrow]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.55 })
    .fromTo('[data-hero-title]', { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.85 }, '-=0.2')
    .fromTo('[data-hero-text]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.45')
    .fromTo('[data-hero-actions]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.45')
    .fromTo('[data-hero-proof]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.35');

  if (heroAmbient.length) {
    intro.fromTo(heroAmbient, { autoAlpha: 0, scale: 0.84 }, { autoAlpha: 1, scale: 1, duration: 1.4, stagger: 0.08 }, '<');
  }
  if (heroCopyDecor.length) {
    intro.fromTo(heroCopyDecor, { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 0.75, scale: 1, duration: 1.1, stagger: 0.06 }, '-=0.9');
  }
  if (heroScrollCue) {
    intro.fromTo(heroScrollCue, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.45');
  }
  if (!heroStage) return intro;

  intro.fromTo(
    heroStage,
    { autoAlpha: 0, y: 36, scale: 0.96 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 1.05, ease: 'power3.out' },
    '-=1.1'
  );
  if (heroShell) {
    intro.fromTo(
      heroShell,
      { rotateX: 14, rotateY: -16, transformPerspective: 1600 },
      { rotateX: 0, rotateY: 0, duration: 1.35, ease: 'power3.out' },
      '<'
    );
  }
  if (heroThreeStage) {
    intro.fromTo(heroThreeStage, { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 0.8, scale: 1, duration: 1.3, ease: 'power2.out' }, '<');
  }
  if (heroParticleStage) {
    intro.fromTo(
      heroParticleStage,
      { autoAlpha: 0, scale: 0.92, filter: 'blur(10px)' },
      { autoAlpha: 0.96, scale: 1, filter: 'blur(0px)', duration: 1.45, ease: 'power2.out' },
      '-=0.95'
    );
  }
  if (heroBeams.length || heroGlows.length || heroStreams.length) {
    intro.fromTo(
      [...heroBeams, ...heroGlows, ...heroStreams],
      { autoAlpha: 0, scaleX: 0.72, transformOrigin: 'center center' },
      { autoAlpha: 1, scaleX: 1, duration: 0.9, stagger: 0.05 },
      '-=1.05'
    );
  }
  if (heroRadar) {
    intro.fromTo(heroRadar, { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 1.1 }, '-=0.9');
  }
  if (heroPanels.length) {
    intro.fromTo(
      heroPanels,
      { autoAlpha: 0, y: 20, scale: 0.92 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.08, ease: 'power3.out' },
      '-=0.85'
    );
  }
  if (heroProofCards.length) {
    intro.fromTo(
      heroProofCards,
      { autoAlpha: 0, y: 14, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08 },
      '-=0.8'
    );
  }
  return intro;
}

function createRevealObserver(): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || (entry.target as HTMLElement).classList.contains('is-visible')) return;
        (entry.target as HTMLElement).classList.add('is-visible');
        gsap.to(entry.target, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' });
      });
    },
    { threshold: 0.18 }
  );
}

function setupCardScrollAnimations(
  cards: HTMLElement[],
  scrollAnimations: ScrollTrigger[],
  opts: MotionOpts
): void {
  cards.forEach((card, index) => {
    const tween = gsap.fromTo(
      card,
      { y: 32, autoAlpha: 0.75, scale: 0.98 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 1, ease: 'power3.out', paused: true }
    );
    const trigger = ScrollTrigger.create({ trigger: card, start: 'top 88%', once: true, onEnter: () => tween.play() });
    scrollAnimations.push(trigger);
    if (!opts.prefersReducedMotion && opts.isDesktop) {
      gsap.to(card, {
        yPercent: index % 2 === 0 ? -3 : 3,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      });
    }
  });
}

function setupConnectorPaths(paths: SVGPathElement[], prefersReducedMotion: boolean): void {
  paths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    if (prefersReducedMotion) {
      path.style.strokeDashoffset = '0';
    } else {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.8 }
      });
    }
  });
}

type HeroTweenSetters = ReturnType<typeof createHeroTweenSetters>;

function createHeroTweenSetters(refs: LandingRefs) {
  const { heroShell, heroPanels, heroThreeStage, heroParticleStage, heroRadar, heroCopy, heroAmbient, heroCopyDecor } = refs;
  return {
    shellRotateYTo: heroShell ? gsap.quickTo(heroShell, 'rotateY', { duration: 1.05, ease: 'power3.out' }) : null,
    shellRotateXTo: heroShell ? gsap.quickTo(heroShell, 'rotateX', { duration: 1.05, ease: 'power3.out' }) : null,
    panelSetters: heroPanels.map((panel) => ({
      rotateY: gsap.quickTo(panel, 'rotateY', { duration: 1.05, ease: 'power3.out' }),
      rotateX: gsap.quickTo(panel, 'rotateX', { duration: 1.05, ease: 'power3.out' })
    })),
    threeStageXTo: heroThreeStage ? gsap.quickTo(heroThreeStage, 'xPercent', { duration: 1.1, ease: 'power3.out' }) : null,
    threeStageYTo: heroThreeStage ? gsap.quickTo(heroThreeStage, 'yPercent', { duration: 1.1, ease: 'power3.out' }) : null,
    particleStageXTo: heroParticleStage ? gsap.quickTo(heroParticleStage, 'xPercent', { duration: 1.1, ease: 'power3.out' }) : null,
    particleStageYTo: heroParticleStage ? gsap.quickTo(heroParticleStage, 'yPercent', { duration: 1.1, ease: 'power3.out' }) : null,
    radarXTo: heroRadar ? gsap.quickTo(heroRadar, 'xPercent', { duration: 1.05, ease: 'power3.out' }) : null,
    radarYTo: heroRadar ? gsap.quickTo(heroRadar, 'yPercent', { duration: 1.05, ease: 'power3.out' }) : null,
    heroCopyXTo: heroCopy ? gsap.quickTo(heroCopy, 'x', { duration: 1, ease: 'power3.out' }) : null,
    heroCopyYTo: heroCopy ? gsap.quickTo(heroCopy, 'y', { duration: 1, ease: 'power3.out' }) : null,
    ambientSetters: heroAmbient.map((target, index) => ({
      x: gsap.quickTo(target, 'x', { duration: 1.2 + index * 0.04, ease: 'power3.out' }),
      y: gsap.quickTo(target, 'y', { duration: 1.2 + index * 0.04, ease: 'power3.out' })
    })),
    decorSetters: heroCopyDecor.map((target, index) => ({
      x: gsap.quickTo(target, 'x', { duration: 1.05 + index * 0.03, ease: 'power3.out' }),
      y: gsap.quickTo(target, 'y', { duration: 1.05 + index * 0.03, ease: 'power3.out' })
    }))
  };
}

function createPointerMoveHandler(
  xTo: (v: number) => void,
  yTo: (v: number) => void,
  opts: MotionOpts,
  setters: HeroTweenSetters,
  refs: LandingRefs
): (event: PointerEvent) => void {
  return (event: PointerEvent) => {
    const x = event.clientX / globalThis.innerWidth;
    const y = event.clientY / globalThis.innerHeight;
    if (!opts.prefersReducedMotion) {
      xTo(x);
      yTo(y);
    }
    if (!refs.heroStage || opts.prefersReducedMotion || !opts.isDesktop) return;
    const tiltY = (x - 0.5) * 14;
    const tiltX = (0.5 - y) * 10;
    setters.shellRotateYTo?.(tiltY);
    setters.shellRotateXTo?.(tiltX);
    setters.panelSetters.forEach((setter) => {
      setter.rotateY(-tiltY * 0.85);
      setter.rotateX(-tiltX * 0.85);
    });
    setters.threeStageXTo?.((x - 0.5) * 3.2);
    setters.threeStageYTo?.((y - 0.5) * -4);
    setters.particleStageXTo?.((x - 0.5) * 1.5);
    setters.particleStageYTo?.((y - 0.5) * -2);
    setters.radarXTo?.((x - 0.5) * -1.8);
    setters.radarYTo?.((y - 0.5) * 2.2);
    setters.heroCopyXTo?.((x - 0.5) * -12);
    setters.heroCopyYTo?.((y - 0.5) * -10);
    setters.ambientSetters.forEach((setter, index) => {
      setter.x((x - 0.5) * (18 + index * 8));
      setter.y((y - 0.5) * (-16 - index * 6));
    });
    setters.decorSetters.forEach((setter, index) => {
      setter.x((x - 0.5) * (-10 - index * 4));
      setter.y((y - 0.5) * (-8 - index * 4));
    });
  };
}

function setupMagneticTargets(targets: HTMLElement[], opts: MotionOpts): (() => void)[] {
  return targets.map((target) => {
    const onMove = (event: PointerEvent) => {
      if (opts.prefersReducedMotion || !opts.isDesktop) return;
      const bounds = target.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      gsap.to(target, { x: x * 0.18, y: y * 0.18, duration: 0.55, ease: 'power3.out' });
    };
    const onLeave = () => gsap.to(target, { x: 0, y: 0, duration: 0.55, ease: 'power3.out' });
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerleave', onLeave);
    return () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerleave', onLeave);
    };
  });
}

function setupTiltCards(cards: HTMLElement[], opts: MotionOpts): (() => void)[] {
  return cards.map((card) => {
    const onMove = (event: PointerEvent) => {
      if (opts.prefersReducedMotion || !opts.isDesktop) return;
      const bounds = card.getBoundingClientRect();
      const relX = ((event.clientX - bounds.left) / bounds.width) * 100;
      const relY = ((event.clientY - bounds.top) / bounds.height) * 100;
      card.style.setProperty('--mouse-x', `${Math.max(0, Math.min(relX, 100))}%`);
      card.style.setProperty('--mouse-y', `${Math.max(0, Math.min(relY, 100))}%`);
    };
    const onLeave = () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
    };
  });
}

function createScrollHandler(refs: LandingRefs, prefersReducedMotion: boolean): () => void {
  return () => {
    if (prefersReducedMotion) return;
    const offset = globalThis.scrollY;
    const max = Math.max(document.body.scrollHeight - globalThis.innerHeight, 1);
    refs.root.style.setProperty('--scroll-progress', String(offset / max));
    refs.parallaxLayers.forEach((layer, index) => {
      gsap.set(layer, { y: offset * (0.035 + index * 0.01) });
    });
  };
}

function setupLiveCounters(counters: HTMLElement[]): gsap.core.Tween[] {
  return counters.map((counter) => {
    const target = Number(counter.dataset.liveCounter ?? '0');
    const state = { value: Math.max(1, target - 17) };
    return gsap.to(state, {
      value: target,
      duration: 2.8,
      ease: 'power2.out',
      repeat: -1,
      repeatDelay: 1,
      yoyo: true,
      onUpdate: () => {
        counter.textContent = `${Math.round(state.value)}%`;
      }
    });
  });
}

function setupHeroScrollTriggers(
  refs: LandingRefs,
  scrollAnimations: ScrollTrigger[],
  opts: MotionOpts
): void {
  const { heroSection, heroStage, heroCopy, heroBackdrop, heroScrollCue, heroPanels } = refs;
  if (!heroSection || !heroStage || opts.prefersReducedMotion) return;

  const heroStageTween = gsap.to(heroStage, {
    yPercent: opts.isDesktop ? 7 : 4,
    ease: 'none',
    scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: 0.7 }
  });
  scrollAnimations.push(heroStageTween.scrollTrigger!);

  if (heroCopy) {
    const tween = gsap.to(heroCopy, {
      yPercent: opts.isDesktop ? -8 : -4,
      xPercent: opts.isDesktop ? -1.5 : 0,
      ease: 'none',
      scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: 0.7 }
    });
    scrollAnimations.push(tween.scrollTrigger!);
  }
  if (heroBackdrop) {
    const tween = gsap.to(heroBackdrop, {
      yPercent: opts.isDesktop ? 10 : 5,
      xPercent: opts.isDesktop ? 2 : 0,
      ease: 'none',
      scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: 0.8 }
    });
    scrollAnimations.push(tween.scrollTrigger!);
  }
  if (heroScrollCue) {
    const tween = gsap.to(heroScrollCue, {
      autoAlpha: 0,
      y: 18,
      ease: 'none',
      scrollTrigger: { trigger: heroSection, start: 'top top', end: 'top+=180 top', scrub: 0.55 }
    });
    scrollAnimations.push(tween.scrollTrigger!);
  }
  heroPanels.forEach((panel, index) => {
    const tween = gsap.to(panel, {
      yPercent: index % 2 === 0 ? -4 : 4,
      xPercent: index % 3 === 0 ? 2 : -2,
      ease: 'none',
      scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: 0.55 }
    });
    scrollAnimations.push(tween.scrollTrigger!);
  });
}

export function LandingEffects() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const refs = getLandingDOMRefs();
    const opts: MotionOpts = {
      prefersReducedMotion: globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches,
      isDesktop: globalThis.matchMedia('(min-width: 960px)').matches
    };

    const xTo = gsap.quickTo(refs.root, '--pointer-x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(refs.root, '--pointer-y', { duration: 0.6, ease: 'power3.out' });

    const intro = buildIntroTimeline(refs);
    const observer = createRevealObserver();
    refs.revealTargets.forEach((target) => observer.observe(target));

    const scrollAnimations: ScrollTrigger[] = [];
    setupCardScrollAnimations(refs.cards, scrollAnimations, opts);
    setupConnectorPaths(refs.connectorPaths, opts.prefersReducedMotion);

    const heroSetters = createHeroTweenSetters(refs);
    const handlePointerMove = createPointerMoveHandler(xTo, yTo, opts, heroSetters, refs);
    const magneticCleanups = setupMagneticTargets(refs.magneticTargets, opts);
    const tiltCleanups = setupTiltCards(refs.cards, opts);
    const handleScroll = createScrollHandler(refs, opts.prefersReducedMotion);
    const counterTweens = setupLiveCounters(refs.liveCounters);
    setupHeroScrollTriggers(refs, scrollAnimations, opts);

    globalThis.addEventListener('pointermove', handlePointerMove, { passive: true });
    globalThis.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      globalThis.removeEventListener('pointermove', handlePointerMove);
      globalThis.removeEventListener('scroll', handleScroll);
      magneticCleanups.forEach((cleanup) => cleanup());
      tiltCleanups.forEach((cleanup) => cleanup());
      scrollAnimations.forEach((trigger) => trigger.kill());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      counterTweens.forEach((tween) => tween.kill());
      intro.kill();
    };
  }, []);

  return null;
}
