import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function LandingEffects() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = document.documentElement;
    const xTo = gsap.quickTo(root, '--pointer-x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(root, '--pointer-y', { duration: 0.6, ease: 'power3.out' });
    const prefersReducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = globalThis.matchMedia('(min-width: 960px)').matches;

    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const heroSection = document.querySelector<HTMLElement>('.hero');
    const heroStage = document.querySelector<HTMLElement>('[data-hero-stage]');
    const heroCopy = document.querySelector<HTMLElement>('.hero-copy');
    const heroProofCards = Array.from(document.querySelectorAll<HTMLElement>('.hero-proof > *'));
    const heroPanels = heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('[data-hero-panel]')) : [];
    const heroShell = heroStage?.querySelector<HTMLElement>('.hero-stage-shell');
    const heroThreeStage = heroStage?.querySelector<HTMLElement>('.hero-three-stage');
    const heroParticleStage = heroStage?.querySelector<HTMLElement>('.hero-particle-stage');
    const heroRadar = heroStage?.querySelector<HTMLElement>('.hero-stage-radar');
    const heroStreams = heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('.hero-stage-data-stream')) : [];
    const heroBeams = heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('.hero-stage-beam')) : [];
    const heroGlows = heroStage ? Array.from(heroStage.querySelectorAll<HTMLElement>('.hero-stage-glow')) : [];
    const parallaxLayers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-layer]'));
    const buttons = Array.from(document.querySelectorAll<HTMLElement>('.button'));
    const magneticTargets = [...buttons, ...Array.from(document.querySelectorAll<HTMLElement>('[data-hero-chip]'))];
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.feature-card, .story-card, .step-card, .bento-card, .pricing-card, .logo-strip, .final-cta'
      )
    );
    const connectorPaths = Array.from(document.querySelectorAll<SVGPathElement>('.section-connector-path'));
    const liveCounters = Array.from(document.querySelectorAll<HTMLElement>('[data-live-counter]'));

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .fromTo('.topbar', { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.65 })
      .fromTo('[data-hero-eyebrow]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.55 })
      .fromTo('[data-hero-title]', { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.85 }, '-=0.2')
      .fromTo('[data-hero-text]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.45')
      .fromTo('[data-hero-actions]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.45')
      .fromTo('[data-hero-proof]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.35');

    if (heroStage) {
      intro
        .fromTo(
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
        intro.fromTo(
          heroThreeStage,
          { autoAlpha: 0, scale: 1.12 },
          { autoAlpha: 0.8, scale: 1, duration: 1.3, ease: 'power2.out' },
          '<'
        );
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
    }

    const scrollAnimations: ScrollTrigger[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.classList.contains('is-visible')) {
            return;
          }

          entry.target.classList.add('is-visible');
          gsap.to(entry.target, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out'
          });
        });
      },
      { threshold: 0.18 }
    );

    revealTargets.forEach((target) => observer.observe(target));

    cards.forEach((card, index) => {
      const tween = gsap.fromTo(
        card,
        { y: 32, autoAlpha: 0.75, scale: 0.98 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          paused: true
        }
      );

      const trigger = ScrollTrigger.create({
        trigger: card,
        start: 'top 88%',
        once: true,
        onEnter: () => tween.play()
      });

      scrollAnimations.push(trigger);

      if (!prefersReducedMotion && isDesktop) {
        gsap.to(card, {
          yPercent: index % 2 === 0 ? -3 : 3,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        });
      }
    });

    connectorPaths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);

      if (prefersReducedMotion) {
        path.style.strokeDashoffset = '0';
      } else {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8
          }
        });
      }
    });

    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX / globalThis.innerWidth;
      const y = event.clientY / globalThis.innerHeight;

      if (!prefersReducedMotion) {
        xTo(x);
        yTo(y);
      }

      if (heroStage && !prefersReducedMotion && isDesktop) {
        const tiltY = (x - 0.5) * 14;
        const tiltX = (0.5 - y) * 10;
        if (heroShell) {
          gsap.to(heroShell, {
            rotateY: tiltY,
            rotateX: tiltX,
            duration: 1.1,
            ease: 'power3.out',
            transformPerspective: 1600,
            transformOrigin: 'center center'
          });
        }
        if (heroPanels.length) {
          gsap.to(heroPanels, {
            rotateY: -tiltY * 0.85,
            rotateX: -tiltX * 0.85,
            duration: 1.1,
            ease: 'power3.out',
            transformPerspective: 1600,
            transformOrigin: 'center center'
          });
        }
        if (heroThreeStage) {
          gsap.to(heroThreeStage, {
            xPercent: (x - 0.5) * 3.4,
            yPercent: (y - 0.5) * -4.2,
            duration: 1.2,
            ease: 'power3.out'
          });
        }
        if (heroParticleStage) {
          gsap.to(heroParticleStage, {
            xPercent: (x - 0.5) * 1.8,
            yPercent: (y - 0.5) * -2.4,
            duration: 1.2,
            ease: 'power3.out'
          });
        }
        if (heroRadar) {
          gsap.to(heroRadar, {
            xPercent: (x - 0.5) * -2.2,
            yPercent: (y - 0.5) * 2.8,
            duration: 1.2,
            ease: 'power3.out'
          });
        }
      }
    };

    const resetMagneticTarget = (target: HTMLElement) => {
      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: 'power3.out'
      });
    };

    const magneticCleanups = magneticTargets.map((target) => {
      const onMove = (event: PointerEvent) => {
        if (prefersReducedMotion || !isDesktop) {
          return;
        }

        const bounds = target.getBoundingClientRect();
        const x = event.clientX - bounds.left - bounds.width / 2;
        const y = event.clientY - bounds.top - bounds.height / 2;

        gsap.to(target, {
          x: x * 0.18,
          y: y * 0.18,
          duration: 0.55,
          ease: 'power3.out'
        });
      };

      const onLeave = () => resetMagneticTarget(target);

      target.addEventListener('pointermove', onMove);
      target.addEventListener('pointerleave', onLeave);

      return () => {
        target.removeEventListener('pointermove', onMove);
        target.removeEventListener('pointerleave', onLeave);
      };
    });

    const tiltCleanups = cards.map((card) => {
      const onMove = (event: PointerEvent) => {
        if (prefersReducedMotion || !isDesktop) {
          return;
        }

        const bounds = card.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const relX = (x / bounds.width) * 100;
        const relY = (y / bounds.height) * 100;

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

    const handleScroll = () => {
      const offset = globalThis.scrollY;
      const max = Math.max(document.body.scrollHeight - globalThis.innerHeight, 1);
      const progress = offset / max;

      if (prefersReducedMotion) {
        return;
      }

      root.style.setProperty('--scroll-progress', String(progress));

      parallaxLayers.forEach((layer, index) => {
        gsap.set(layer, { y: offset * (0.035 + index * 0.01) });
      });
    };

    const counterTweens = liveCounters.map((counter) => {
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

    if (heroSection && heroStage && !prefersReducedMotion) {
      const heroStageTween = gsap.to(heroStage, {
        yPercent: isDesktop ? 7 : 4,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.7
        }
      });

      scrollAnimations.push(heroStageTween.scrollTrigger!);

      if (heroCopy) {
        const heroCopyTween = gsap.to(heroCopy, {
          yPercent: isDesktop ? -8 : -4,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.7
          }
        });

        scrollAnimations.push(heroCopyTween.scrollTrigger!);
      }

      heroPanels.forEach((panel, index) => {
        const panelTween = gsap.to(panel, {
          yPercent: index % 2 === 0 ? -4 : 4,
          xPercent: index % 3 === 0 ? 2 : -2,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.55
          }
        });

        scrollAnimations.push(panelTween.scrollTrigger!);
      });
    }

    const corePulse = globalThis.setInterval(() => {
      if (!heroStage) {
        return;
      }

      heroStage.animate(
        [
          { filter: 'brightness(1)' },
          { filter: 'brightness(1.16)' },
          { filter: 'brightness(1)' }
        ],
        { duration: 720, easing: 'ease-out' }
      );
    }, 2600);

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
      globalThis.clearInterval(corePulse);
      intro.kill();
    };
  }, []);

  return null;
}
