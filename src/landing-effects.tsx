import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type LandingRefs = {
  root: HTMLElement;
  revealTargets: HTMLElement[];
  heroSection: HTMLElement | null;
  heroBackdrop: HTMLElement | null;
  heroStage: HTMLElement | null;
  heroStageOverlay: HTMLElement | null;
  heroCopy: HTMLElement | null;
  heroProofCards: HTMLElement[];
  heroAmbient: HTMLElement[];
  heroCopyDecor: HTMLElement[];
  heroScrollCue: HTMLElement | null;
  heroPanels: HTMLElement[];
  heroChipCloud: HTMLElement | null;
  heroChips: HTMLElement[];
  heroHudPills: HTMLElement[];
  heroFlowNodes: HTMLElement[];
  heroFeedItems: HTMLElement[];
  heroAgentCards: HTMLElement[];
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
  automationSection: HTMLElement | null;
  automationStage: HTMLElement | null;
  automationCore: HTMLElement | null;
  automationCoreOrbits: HTMLElement[];
  automationAmbientParticles: HTMLElement[];
  automationNodes: HTMLElement[];
  automationPipes: HTMLElement[];
  automationPackets: HTMLElement[];
  automationPhasePills: HTMLElement[];
  automationPhaseLabel: HTMLElement | null;
  automationPhaseNote: HTMLElement | null;
  automationPhaseCounter: HTMLElement | null;
};

type MotionOpts = { prefersReducedMotion: boolean; isDesktop: boolean };

function getLandingDOMRefs(): LandingRefs {
  const heroStage = document.querySelector<HTMLElement>('[data-hero-stage]');
  const heroStageOverlay = heroStage?.querySelector<HTMLElement>('.hero-stage-overlay') ?? null;
  return {
    root: document.documentElement,
    revealTargets: Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')),
    heroSection: document.querySelector<HTMLElement>('.hero'),
    heroBackdrop: document.querySelector<HTMLElement>('.hero-backdrop'),
    heroStage,
    heroStageOverlay,
    heroCopy: document.querySelector<HTMLElement>('.hero-copy'),
    heroProofCards: Array.from(document.querySelectorAll<HTMLElement>('[data-hero-proof-card]')),
    heroAmbient: Array.from(document.querySelectorAll<HTMLElement>('[data-hero-ambient]')),
    heroCopyDecor: Array.from(document.querySelectorAll<HTMLElement>('[data-hero-copy-decor]')),
    heroScrollCue: document.querySelector<HTMLElement>('[data-hero-scroll-cue]'),
    heroPanels: heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('[data-hero-panel]')) : [],
    heroChipCloud: heroStage?.querySelector<HTMLElement>('.hero-chip-cloud') ?? null,
    heroChips: heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('[data-hero-chip]')) : [],
    heroHudPills: heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('[data-hero-hud-pill]')) : [],
    heroFlowNodes: heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('[data-hero-flow-node]')) : [],
    heroFeedItems: heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('[data-hero-feed-item]')) : [],
    heroAgentCards: heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('[data-hero-agent-card]')) : [],
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
    liveCounters: Array.from(document.querySelectorAll<HTMLElement>('[data-live-counter]')),
    automationSection: document.querySelector<HTMLElement>('[data-automation-section]'),
    automationStage: document.querySelector<HTMLElement>('[data-automation-stage]'),
    automationCore: document.querySelector<HTMLElement>('[data-automation-core]'),
    automationCoreOrbits: Array.from(document.querySelectorAll<HTMLElement>('[data-automation-core-orbit]')),
    automationAmbientParticles: Array.from(document.querySelectorAll<HTMLElement>('[data-automation-ambient-particle]')),
    automationNodes: Array.from(document.querySelectorAll<HTMLElement>('[data-automation-node]')),
    automationPipes: Array.from(document.querySelectorAll<HTMLElement>('[data-automation-pipe]')),
    automationPackets: Array.from(document.querySelectorAll<HTMLElement>('[data-automation-packet]')),
    automationPhasePills: Array.from(document.querySelectorAll<HTMLElement>('[data-automation-phase-pill]')),
    automationPhaseLabel: document.querySelector<HTMLElement>('[data-automation-phase-label]'),
    automationPhaseNote: document.querySelector<HTMLElement>('[data-automation-phase-note]'),
    automationPhaseCounter: document.querySelector<HTMLElement>('[data-automation-phase-counter]')
  };
}

function addIntroHeadlineSteps(intro: gsap.core.Timeline, refs: LandingRefs): void {
  const { heroAmbient, heroCopyDecor, heroScrollCue } = refs;
  intro
    .fromTo('.topbar', { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.65 })
    .fromTo('[data-hero-eyebrow]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.55 })
    .fromTo('[data-hero-title]', { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.85 }, '-=0.2')
    .fromTo('[data-hero-text]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.45')
    .fromTo('[data-hero-actions]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.45')
    .fromTo('[data-hero-proof]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.35');
  if (heroAmbient.length) intro.fromTo(heroAmbient, { autoAlpha: 0, scale: 0.84 }, { autoAlpha: 1, scale: 1, duration: 1.4, stagger: 0.08 }, '<');
  if (heroCopyDecor.length) intro.fromTo(heroCopyDecor, { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 0.75, scale: 1, duration: 1.1, stagger: 0.06 }, '-=0.9');
  if (heroScrollCue) intro.fromTo(heroScrollCue, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.45');
}

function addIntroStageSteps(intro: gsap.core.Timeline, refs: LandingRefs): void {
  const { heroStage, heroStageOverlay, heroShell, heroThreeStage, heroParticleStage, heroBeams, heroGlows, heroStreams, heroRadar } = refs;
  if (!heroStage) return;
  intro.fromTo(heroStage, { autoAlpha: 0, y: 42, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.15, ease: 'power4.out' }, '-=1.1');
  if (heroShell) {
    intro.fromTo(
      heroShell,
      { rotateX: 12, rotateY: -14, transformPerspective: 1600, clipPath: 'inset(16% 18% 16% 18% round 2.4rem)', filter: 'blur(12px) brightness(1.12)' },
      { rotateX: 0, rotateY: 0, clipPath: 'inset(0% 0% 0% 0% round 2rem)', filter: 'blur(0px) brightness(1)', duration: 1.4, ease: 'power4.out' },
      '<'
    );
  }
  if (heroThreeStage) intro.fromTo(heroThreeStage, { autoAlpha: 0, scale: 1.2 }, { autoAlpha: 0.84, scale: 1, duration: 1.45, ease: 'power2.out' }, '<');
  if (heroParticleStage) intro.fromTo(heroParticleStage, { autoAlpha: 0, scale: 0.86, filter: 'blur(14px)' }, { autoAlpha: 0.96, scale: 1, filter: 'blur(0px)', duration: 1.55, ease: 'power2.out' }, '-=0.95');
  if (heroBeams.length || heroGlows.length || heroStreams.length) {
    intro.fromTo([...heroBeams, ...heroGlows, ...heroStreams], { autoAlpha: 0, scaleX: 0.72, transformOrigin: 'center center' }, { autoAlpha: 1, scaleX: 1, duration: 0.9, stagger: 0.05 }, '-=1.05');
  }
  if (heroRadar) intro.fromTo(heroRadar, { autoAlpha: 0, scale: 0.54 }, { autoAlpha: 1, scale: 1, duration: 1.25 }, '-=1.1');
  if (heroStageOverlay) intro.fromTo(heroStageOverlay, { autoAlpha: 0, scale: 0.98 }, { autoAlpha: 1, scale: 1, duration: 0.4 }, '-=1');
}

function addIntroPanelSteps(intro: gsap.core.Timeline, refs: LandingRefs): void {
  const { heroPanels, heroChipCloud, heroChips } = refs;
  const heroPrimaryHud = heroPanels.find((p) => p.classList.contains('hero-hud-primary')) ?? null;
  const heroSecondaryHud = heroPanels.find((p) => p.classList.contains('hero-hud-secondary')) ?? null;
  const heroFlowMap = heroPanels.find((p) => p.classList.contains('hero-flow-map')) ?? null;
  const heroActivityFeed = heroPanels.find((p) => p.classList.contains('activity-feed')) ?? null;
  const heroAgentStack = heroPanels.find((p) => p.classList.contains('agent-mini-stack')) ?? null;
  if (heroFlowMap) intro.fromTo(heroFlowMap, { autoAlpha: 0, x: -56, y: 24, rotateY: 18, rotateZ: -6 }, { autoAlpha: 1, x: 0, y: 0, rotateY: 0, rotateZ: 0, duration: 0.95, ease: 'power4.out' }, '-=1');
  if (heroPrimaryHud) intro.fromTo(heroPrimaryHud, { autoAlpha: 0, x: 86, y: -26, rotateY: -18, rotateZ: 4 }, { autoAlpha: 1, x: 0, y: 0, rotateY: 0, rotateZ: 0, duration: 1, ease: 'power4.out' }, '-=0.92');
  if (heroSecondaryHud) intro.fromTo(heroSecondaryHud, { autoAlpha: 0, x: -40, y: 44, rotateY: 12, rotateZ: -4 }, { autoAlpha: 1, x: 0, y: 0, rotateY: 0, rotateZ: 0, duration: 0.9, ease: 'power4.out' }, '-=0.88');
  if (heroChipCloud) intro.fromTo(heroChipCloud, { autoAlpha: 0, scale: 0.52, rotate: -18, filter: 'blur(10px)' }, { autoAlpha: 1, scale: 1, rotate: 0, filter: 'blur(0px)', duration: 1.15, ease: 'back.out(1.2)' }, '-=0.9');
  if (heroChips.length) intro.fromTo(heroChips, { autoAlpha: 0, scale: 0.64, y: 12 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.42, stagger: 0.06, ease: 'power3.out' }, '-=0.82');
  if (heroActivityFeed) intro.fromTo(heroActivityFeed, { autoAlpha: 0, x: 82, y: 36, rotateY: -16, rotateZ: 5 }, { autoAlpha: 1, x: 0, y: 0, rotateY: 0, rotateZ: 0, duration: 1, ease: 'power4.out' }, '-=0.96');
  if (heroAgentStack) intro.fromTo(heroAgentStack, { autoAlpha: 0, y: 46, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, ease: 'power4.out' }, '-=0.7');
}

function addIntroDetailSteps(intro: gsap.core.Timeline, refs: LandingRefs): void {
  const { heroHudPills, heroFlowNodes, heroFeedItems, heroAgentCards, heroProofCards } = refs;
  if (heroHudPills.length) intro.fromTo(heroHudPills, { autoAlpha: 0, x: 18, scale: 0.94 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.46, stagger: 0.08 }, '-=0.78');
  if (heroFlowNodes.length) intro.fromTo(heroFlowNodes, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.42, stagger: 0.06 }, '-=0.82');
  if (heroFeedItems.length) intro.fromTo(heroFeedItems, { autoAlpha: 0, x: 18, y: 10 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.42, stagger: 0.07 }, '-=0.78');
  if (heroAgentCards.length) intro.fromTo(heroAgentCards, { autoAlpha: 0, y: 18, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.06 }, '-=0.58');
  if (heroProofCards.length) intro.fromTo(heroProofCards, { autoAlpha: 0, y: 14, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08 }, '-=0.8');
}

function buildIntroTimeline(refs: LandingRefs): gsap.core.Timeline {
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  addIntroHeadlineSteps(intro, refs);
  if (!refs.heroStage) return intro;
  addIntroStageSteps(intro, refs);
  addIntroPanelSteps(intro, refs);
  addIntroDetailSteps(intro, refs);
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
    const tiltY = (x - 0.5) * 10;
    const tiltX = (0.5 - y) * 8;
    setters.shellRotateYTo?.(tiltY);
    setters.shellRotateXTo?.(tiltX);
    setters.panelSetters.forEach((setter) => {
      setter.rotateY(-tiltY * 0.55);
      setter.rotateX(-tiltX * 0.55);
    });
    setters.threeStageXTo?.((x - 0.5) * 2.4);
    setters.threeStageYTo?.((y - 0.5) * -3.2);
    setters.particleStageXTo?.((x - 0.5) * 1.2);
    setters.particleStageYTo?.((y - 0.5) * -1.6);
    setters.radarXTo?.((x - 0.5) * -1.4);
    setters.radarYTo?.((y - 0.5) * 1.8);
    setters.heroCopyXTo?.((x - 0.5) * -8);
    setters.heroCopyYTo?.((y - 0.5) * -7);
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
    const start = Number(counter.dataset.liveCounterStart ?? String(Math.max(1, target - 17)));
    const prefix = counter.dataset.liveCounterPrefix ?? '';
    const suffix = counter.dataset.liveCounterSuffix ?? '%';
    const state = { value: start };
    return gsap.to(state, {
      value: target,
      duration: 2.8,
      ease: 'power2.out',
      repeat: -1,
      repeatDelay: 1,
      yoyo: true,
      onUpdate: () => {
        counter.textContent = `${prefix}${Math.round(state.value)}${suffix}`;
      }
    });
  });
}

function setupAutomationFlowScrollTriggers(
  refs: LandingRefs,
  scrollAnimations: ScrollTrigger[],
  opts: MotionOpts
): { intro: gsap.core.Timeline; loop: gsap.core.Timeline | null } | null {
  const {
    automationSection,
    automationStage,
    automationCore,
    automationCoreOrbits,
    automationAmbientParticles,
    automationNodes,
    automationPipes,
    automationPackets,
    automationPhasePills,
    automationPhaseLabel,
    automationPhaseNote,
    automationPhaseCounter
  } = refs;
  if (!automationSection || !automationStage) return null;

  const phaseMeta = automationPhasePills.map((pill, index) => ({
    pill,
    index,
    labelEl: pill.querySelector<HTMLElement>('.automation-phase-pill-label'),
    noteEl: pill.querySelector<HTMLElement>('[data-automation-phase-note-source]'),
    ambientParticles: automationAmbientParticles.filter((particle) => particle.dataset.phaseIndex === String(index)),
    nodes: automationNodes.filter((node) => node.dataset.phaseIndex === String(index)),
    pipes: automationPipes.filter((pipe) => pipe.dataset.phaseIndex === String(index))
  }));

  const packetByPipe = automationPipes.map((pipe, index) => ({
    pipe,
    packets: Array.from(pipe.querySelectorAll<HTMLElement>('[data-automation-packet]'))
  }));

  const coreBaseShadow = [
    'inset 0 0 0 1px rgba(255, 255, 255, 0.04)',
    '0 0 0 14px rgba(56, 189, 248, 0.018)',
    '0 18px 40px rgba(2, 6, 23, 0.34)'
  ].join(', ');
  const coreActiveShadow = [
    'inset 0 0 0 1px rgba(125, 211, 252, 0.12)',
    '0 0 0 18px rgba(56, 189, 248, 0.04)',
    '0 22px 44px rgba(14, 165, 233, 0.22)'
  ].join(', ');

  const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

  intro.fromTo(
    automationStage,
    { autoAlpha: 0, y: 22, scale: 0.985, filter: 'blur(8px)' },
    { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' }
  );

  if (automationPhasePills.length) {
    intro.fromTo(automationPhasePills, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.04 }, '-=0.72');
  }

  if (automationAmbientParticles.length) {
    intro.fromTo(
      automationAmbientParticles,
      { autoAlpha: 0, scale: 0.5 },
      { autoAlpha: 0.24, scale: 0.78, duration: 0.8, stagger: 0.025, ease: 'sine.out' },
      '-=0.68'
    );
  }

  if (automationPipes.length) {
    intro.fromTo(
      automationPipes,
      { autoAlpha: 0, scaleX: 0.72, transformOrigin: 'left center' },
      { autoAlpha: 0.24, scaleX: 1, duration: 0.54, stagger: 0.03, ease: 'sine.out' },
      '-=0.64'
    );
  }

  if (automationCore) {
    intro.fromTo(
      automationCore,
      { autoAlpha: 0, y: 12, scale: 0.9, filter: 'blur(8px)' },
      { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
      '-=0.54'
    );
  }

  if (automationCoreOrbits.length) {
    intro.fromTo(
      automationCoreOrbits,
      { autoAlpha: 0, scale: 0.88 },
      { autoAlpha: 0.38, scale: 1, duration: 0.72, stagger: 0.05, ease: 'sine.out' },
      '-=0.58'
    );
  }

  if (automationNodes.length) {
    intro.fromTo(
      automationNodes,
      { autoAlpha: 0, y: 10, scale: 0.97 },
      { autoAlpha: 0.56, y: 0, scale: 0.995, duration: 0.38, stagger: 0.035, ease: 'sine.out' },
      '-=0.4'
    );
  }

  const setReadout = (index: number): void => {
    const meta = phaseMeta[index];
    if (!meta) return;
    if (automationPhaseLabel) automationPhaseLabel.textContent = meta.labelEl?.textContent?.trim() ?? '';
    if (automationPhaseNote) automationPhaseNote.textContent = meta.noteEl?.textContent?.trim() ?? '';
    if (automationPhaseCounter) automationPhaseCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(phaseMeta.length).padStart(2, '0')}`;
  };

  const phaseReadoutTargets = [automationPhaseLabel, automationPhaseNote, automationPhaseCounter].filter(
    (target): target is HTMLElement => Boolean(target)
  );

  const setBaseState = (): void => {
    gsap.set(automationPhasePills, {
      backgroundColor: 'rgba(15, 23, 42, 0.38)',
      borderColor: 'rgba(148, 163, 184, 0.12)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
      opacity: 0.88
    });
    gsap.set(automationNodes, {
      opacity: 0.56,
      scale: 0.995,
      y: 0,
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 28px rgba(2, 6, 23, 0.24)'
    });
    gsap.set(automationPipes, {
      opacity: 0.24,
      filter: 'brightness(0.96)',
      boxShadow: '0 0 0 1px rgba(96, 165, 250, 0.06), 0 0 12px rgba(96, 165, 250, 0.08)'
    });
    gsap.set(automationAmbientParticles, { opacity: 0.24, scale: 0.78, x: 0, y: 0 });
    gsap.set(automationCoreOrbits, { opacity: 0.38, scale: 1, rotate: (index) => index * 24 });
    if (automationCore) {
      gsap.set(automationCore, {
        scale: 1,
        y: 0,
        yPercent: 0,
        rotate: 0,
        boxShadow: coreBaseShadow
      });
    }
    gsap.set(automationPackets, { autoAlpha: 0, x: 0, y: 0, scale: 0.82 });
    gsap.set(phaseReadoutTargets, { autoAlpha: 1, y: 0 });
  };

  const softenToBase = (timeline: gsap.core.Timeline, position: number): void => {
    timeline.to(
      automationPhasePills,
      {
        backgroundColor: 'rgba(15, 23, 42, 0.38)',
        borderColor: 'rgba(148, 163, 184, 0.12)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
        opacity: 0.88,
        duration: 0.24,
        ease: 'sine.inOut'
      },
      position
    );
    timeline.to(
      automationNodes,
      {
        opacity: 0.56,
        scale: 0.995,
        y: 0,
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 12px 28px rgba(2, 6, 23, 0.24)',
        duration: 0.28,
        stagger: 0.02,
        ease: 'sine.inOut'
      },
      position
    );
    timeline.to(
      automationPipes,
      {
        opacity: 0.24,
        filter: 'brightness(0.96)',
        boxShadow: '0 0 0 1px rgba(96, 165, 250, 0.06), 0 0 12px rgba(96, 165, 250, 0.08)',
        duration: 0.28,
        stagger: 0.015,
        ease: 'sine.inOut'
      },
      position
    );
    timeline.to(
      automationAmbientParticles,
      {
        opacity: 0.24,
        scale: 0.78,
        duration: 0.3,
        stagger: 0.015,
        ease: 'sine.inOut'
      },
      position
    );
    timeline.to(
      automationCoreOrbits,
      {
        opacity: 0.38,
        scale: 1,
        duration: 0.32,
        stagger: 0.04,
        ease: 'sine.inOut'
      },
      position
    );
    if (automationCore) {
      timeline.to(
        automationCore,
        {
          scale: 1,
          y: 0,
          boxShadow: coreBaseShadow,
          duration: 0.34,
          ease: 'sine.inOut'
        },
        position
      );
    }
  };

  const animatePackets = (
    timeline: gsap.core.Timeline,
    packets: Array<{ pipe: HTMLElement; packets: HTMLElement[] } | undefined>,
    position: number
  ): void => {
    packets.forEach((entry, index) => {
      if (!entry?.packets.length) return;
      const { pipe } = entry;
      const vertical = pipe.offsetHeight > pipe.offsetWidth;
      const travel = Math.max((vertical ? pipe.offsetHeight : pipe.offsetWidth) - 12, 16);
      entry.packets.forEach((packet, trailIndex) => {
        const at = position + index * 0.08 + trailIndex * 0.12;
        const offsetTravel = Math.max(travel - trailIndex * 8, 12);
        const alpha = Math.max(0.42, 0.92 - trailIndex * 0.18);
        const scale = Math.max(0.72, 1 - trailIndex * 0.12);
        timeline.fromTo(
          packet,
          { autoAlpha: 0, x: 0, y: 0, scale: 0.52 + trailIndex * 0.06 },
          vertical
            ? { autoAlpha: alpha, y: offsetTravel, scale, duration: 0.9, ease: 'power1.inOut' }
            : { autoAlpha: alpha, x: offsetTravel, scale, duration: 0.9, ease: 'power1.inOut' },
          at
        );
        timeline.to(packet, { autoAlpha: 0, scale: 0.72, duration: 0.18, ease: 'sine.in' }, at + 0.7);
      });
    });
  };

  const buildPhaseStep = (
    index: number,
    segments: Array<{ nodeIndexes: number[]; pipeIndexes: number[] }>
  ): gsap.core.Timeline => {
    const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });
    const activePill = phaseMeta[index]?.pill ?? null;
    const phaseAmbientParticles = phaseMeta[index]?.ambientParticles ?? [];
    const phaseNodes = phaseMeta[index]?.nodes ?? [];
    const phasePipes = phaseMeta[index]?.pipes ?? [];

    tl.call(() => {
      if (!phaseReadoutTargets.length) setReadout(index);
    });
    softenToBase(tl, 0);

    if (activePill) {
      tl.to(
        activePill,
        {
          backgroundColor: 'rgba(37, 99, 235, 0.11)',
          borderColor: 'rgba(96, 165, 250, 0.24)',
          boxShadow: '0 0 0 1px rgba(56, 189, 248, 0.1) inset, 0 10px 22px rgba(37, 99, 235, 0.08)',
          opacity: 1,
          duration: 0.36,
          ease: 'sine.out'
        },
        0.04
      );
    }

    if (phaseReadoutTargets.length) {
      tl.to(phaseReadoutTargets, { autoAlpha: 0.55, y: 4, duration: 0.14, ease: 'sine.inOut' }, 0.04);
      tl.call(() => setReadout(index), undefined, 0.16);
      tl.to(phaseReadoutTargets, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'sine.out' }, 0.18);
    }
    tl.to(phaseAmbientParticles, { opacity: 0.58, scale: 1.2, duration: 0.4, stagger: 0.04, ease: 'sine.out' }, 0.08);
    tl.to(automationCoreOrbits, { opacity: 0.54, scale: 1.02, duration: 0.42, stagger: 0.04, ease: 'sine.out' }, 0.08);
    tl.to(phaseNodes, { opacity: 0.72, scale: 1.006, y: -1, duration: 0.34, stagger: 0.04, ease: 'sine.out' }, 0.06);
    tl.to(phasePipes, { opacity: 0.46, filter: 'brightness(1.05)', duration: 0.32, stagger: 0.02, ease: 'sine.out' }, 0.06);

    if (automationCore) {
      tl.to(
        automationCore,
        {
          scale: index === 2 ? 1.028 : 1.02,
          y: -2,
          boxShadow: coreActiveShadow,
          duration: 0.38,
          ease: 'sine.out'
        },
        0.08
      );
    }

    segments.forEach((segment, segmentIndex) => {
      const nodes = segment.nodeIndexes.map((nodeIndex) => automationNodes[nodeIndex]).filter(Boolean);
      const pipes = segment.pipeIndexes.map((pipeIndex) => automationPipes[pipeIndex]).filter(Boolean);
      const packets = segment.pipeIndexes.map((pipeIndex) => packetByPipe[pipeIndex]);
      const at = 0.24 + segmentIndex * (index === 2 ? 0.42 : 0.36);

      tl.to(
        nodes,
        {
          opacity: 0.95,
          scale: 1.016,
          y: -3,
          boxShadow: 'inset 0 0 0 1px rgba(56, 189, 248, 0.1), 0 16px 32px rgba(37, 99, 235, 0.12)',
          duration: 0.5,
          stagger: 0.06,
          ease: 'power1.inOut'
        },
        at
      );
      tl.to(
        pipes,
        {
          opacity: 0.78,
          filter: 'brightness(1.12)',
          boxShadow: '0 0 0 1px rgba(96, 165, 250, 0.08), 0 0 16px rgba(56, 189, 248, 0.16)',
          duration: 0.44,
          stagger: 0.05,
          ease: 'power1.inOut'
        },
        at
      );
      animatePackets(tl, packets, at + 0.06);
      tl.to(
        nodes,
        {
          opacity: 0.84,
          scale: 1.008,
          y: -1,
          duration: 0.28,
          stagger: 0.04,
          ease: 'sine.out'
        },
        at + 0.44
      );
      tl.to(
        pipes,
        {
          opacity: 0.54,
          filter: 'brightness(1.06)',
          boxShadow: '0 0 0 1px rgba(96, 165, 250, 0.07), 0 0 14px rgba(56, 189, 248, 0.12)',
          duration: 0.28,
          stagger: 0.03,
          ease: 'sine.out'
        },
        at + 0.44
      );
    });

    tl.to(phaseAmbientParticles, { opacity: 0.32, scale: 0.92, duration: 0.34, stagger: 0.03, ease: 'sine.inOut' }, '>-0.2');

    if (automationCore) {
      tl.to(
        automationCore,
        {
          scale: 1,
          y: 0,
          boxShadow: coreBaseShadow,
          duration: 0.42,
          ease: 'sine.inOut'
        },
        '>-0.16'
      );
    }

    tl.to({}, { duration: index === 2 ? 0.74 : 0.58 });
    return tl;
  };

  intro.call(() => {
    setBaseState();
    setReadout(0);
  });

  const loop = opts.prefersReducedMotion
    ? null
    : gsap
        .timeline({ paused: true, repeat: -1 })
        .add(buildPhaseStep(0, [{ nodeIndexes: [0, 1], pipeIndexes: [0] }]))
        .add(buildPhaseStep(1, [{ nodeIndexes: [2], pipeIndexes: [1] }]))
        .add(
          buildPhaseStep(2, [
            { nodeIndexes: [3], pipeIndexes: [2] },
            { nodeIndexes: [4, 5], pipeIndexes: [3, 4] },
            { nodeIndexes: [6, 7], pipeIndexes: [5, 6, 7, 8] }
          ])
        )
        .add(buildPhaseStep(3, [{ nodeIndexes: [8], pipeIndexes: [9] }]));

  const ambientFloat = !opts.prefersReducedMotion
    ? gsap.timeline({ paused: true, repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
    : null;

  if (ambientFloat) {
    automationAmbientParticles.forEach((particle, index) => {
      ambientFloat.to(
        particle,
        {
          xPercent: index % 2 === 0 ? 8 : -7,
          yPercent: index % 3 === 0 ? -12 : 9,
          duration: 3.4 + (index % 4) * 0.35
        },
        (index % 4) * 0.08
      );
    });
    if (automationCore) {
      ambientFloat.to(automationCore, { yPercent: -3, rotate: 1.1, duration: 3.1 }, 0);
    }
  }

  const orbitSpin = !opts.prefersReducedMotion && automationCoreOrbits.length
    ? gsap.timeline({ paused: true, repeat: -1 })
    : null;

  automationCoreOrbits.forEach((orbit, index) => {
    orbitSpin?.to(orbit, { rotate: index % 2 === 0 ? 360 : -360, duration: 13 + index * 2.5, ease: 'none' }, 0);
  });

  if (!opts.prefersReducedMotion) {
    const stageTween = gsap.to(automationStage, {
      yPercent: opts.isDesktop ? -1.35 : -0.5,
      ease: 'none',
      scrollTrigger: { trigger: automationSection, start: 'top bottom', end: 'bottom top', scrub: 0.78 }
    });
    scrollAnimations.push(stageTween.scrollTrigger!);
  }

  let introPlayed = false;
  const sectionTrigger = ScrollTrigger.create({
    trigger: automationSection,
    start: 'top 72%',
    end: 'bottom top',
    onEnter: () => {
      if (!introPlayed) {
        introPlayed = true;
        intro.play(0);
        return;
      }
      loop?.play();
      ambientFloat?.play();
      orbitSpin?.play();
    },
    onEnterBack: () => {
      loop?.play();
      ambientFloat?.play();
      orbitSpin?.play();
    },
    onLeave: () => {
      loop?.pause();
      ambientFloat?.pause();
      orbitSpin?.pause();
    },
    onLeaveBack: () => {
      loop?.pause();
      ambientFloat?.pause();
      orbitSpin?.pause();
    }
  });
  scrollAnimations.push(sectionTrigger);

  intro.eventCallback('onComplete', () => {
    if (!opts.prefersReducedMotion && sectionTrigger.isActive) {
      loop?.play(0);
      ambientFloat?.play(0);
      orbitSpin?.play(0);
    }
  });

  if (opts.prefersReducedMotion) {
    setBaseState();
    gsap.set(automationAmbientParticles, { opacity: 0.34, scale: 1 });
    gsap.set(automationCoreOrbits, { opacity: 0.48 });
    gsap.set(automationNodes, { opacity: 1, scale: 1 });
    gsap.set(automationPipes, { opacity: 0.75, filter: 'brightness(1.2)' });
    gsap.set(automationPhasePills, { opacity: 1 });
    if (automationCore) gsap.set(automationCore, { yPercent: 0, rotate: 0, boxShadow: coreBaseShadow });
    setReadout(0);
  }

  return { intro, loop };
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
      yPercent: index % 2 === 0 ? -2.5 : 2.5,
      xPercent: index % 3 === 0 ? 1.2 : -1.2,
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
    const automationMotion = setupAutomationFlowScrollTriggers(refs, scrollAnimations, opts);

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
      automationMotion?.intro.kill();
      automationMotion?.loop?.kill();
      intro.kill();
    };
  }, []);

  return null;
}
