import { useEffect, useRef } from "react";

type FocusPoint = {
  x: number;
  y: number;
};

type Burst = {
  x: number;
  y: number;
  createdAt: number;
  strength: number;
};

type Particle = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  mass: number;
  color: readonly [number, number, number];
  drift: number;
  phase: number;
  focusIndex: number;
  highlight: boolean;
};

type Sample = {
  x: number;
  y: number;
  alpha: number;
  color: readonly [number, number, number];
};

const BRAND_TEXT = "NEXA";
const TAGLINE_TEXT = "AUTONOMOUS REVENUE SYSTEM";
const MAX_PARTICLES = 2400;
const MAX_CONNECTIONS = 160;
const BURST_LIFETIME = 720;

type QualityProfile = {
  maxParticles: number;
  maxConnections: number;
  minFrameMs: number;
  pointerScale: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function distance(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.hypot(dx, dy);
}

function createFocusPoints(width: number, height: number) {
  const centerX = width * 0.5;
  const centerY = height * 0.5;
  const orbitWidth = width * 0.32;
  const orbitHeight = height * 0.22;

  return Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI * 0.14;
    return {
      x: centerX + Math.cos(angle) * orbitWidth,
      y: centerY + Math.sin(angle) * orbitHeight,
    };
  });
}

function createBrandMask(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  focusPoints: readonly FocusPoint[],
) {
  const centerX = width * 0.5;
  const centerY = height * 0.52;
  const orbitWidth = width * 0.34;
  const orbitHeight = height * 0.24;
  const lineWidth = Math.max(3, Math.round(width * 0.006));
  const titleSize = Math.round(width * 0.17);
  const taglineSize = Math.max(14, Math.round(width * 0.026));

  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const orbitGradient = ctx.createLinearGradient(
    centerX - orbitWidth,
    centerY - orbitHeight,
    centerX + orbitWidth,
    centerY + orbitHeight,
  );
  orbitGradient.addColorStop(0, "rgba(96, 165, 250, 0.92)");
  orbitGradient.addColorStop(0.45, "rgba(56, 189, 248, 0.9)");
  orbitGradient.addColorStop(1, "rgba(192, 132, 252, 0.92)");

  ctx.strokeStyle = orbitGradient;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.ellipse(
    centerX,
    centerY,
    orbitWidth,
    orbitHeight,
    -0.12,
    Math.PI * 0.08,
    Math.PI * 1.92,
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(
    centerX,
    centerY,
    orbitWidth * 0.72,
    orbitHeight * 0.56,
    0.18,
    Math.PI * 0.14,
    Math.PI * 1.84,
  );
  ctx.stroke();

  ctx.fillStyle = "rgba(226, 232, 240, 0.88)";
  focusPoints.forEach((point, index) => {
    ctx.beginPath();
    ctx.arc(
      point.x,
      point.y,
      width * (index % 2 === 0 ? 0.009 : 0.007),
      0,
      Math.PI * 2,
    );
    ctx.fill();
  });

  const textGradient = ctx.createLinearGradient(
    centerX - width * 0.18,
    centerY,
    centerX + width * 0.18,
    centerY,
  );
  textGradient.addColorStop(0, "rgba(248, 250, 252, 0.98)");
  textGradient.addColorStop(0.34, "rgba(125, 211, 252, 0.98)");
  textGradient.addColorStop(0.68, "rgba(96, 165, 250, 0.98)");
  textGradient.addColorStop(1, "rgba(196, 181, 253, 0.98)");

  ctx.fillStyle = "rgba(226, 232, 240, 0.8)";
  ctx.font = `700 ${taglineSize}px Inter, Arial, sans-serif`;
  ctx.fillText(TAGLINE_TEXT, centerX, centerY - orbitHeight * 1.02);

  ctx.fillStyle = textGradient;
  ctx.font = `900 ${titleSize}px Inter, Arial, sans-serif`;
  ctx.fillText(BRAND_TEXT, centerX, centerY + titleSize * 0.06);

  ctx.strokeStyle = "rgba(125, 211, 252, 0.72)";
  ctx.lineWidth = Math.max(2, lineWidth * 0.5);
  ctx.beginPath();
  ctx.moveTo(centerX - width * 0.15, centerY + orbitHeight * 0.86);
  ctx.lineTo(centerX + width * 0.15, centerY + orbitHeight * 0.86);
  ctx.stroke();
}

function getQualityProfile(
  width: number,
  height: number,
  dpr: number,
): QualityProfile {
  const pixelLoad = width * height * dpr * dpr;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const hardwareThreads = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData ?? false;
  const lowPower = saveData || hardwareThreads <= 4 || memory <= 4;

  if (lowPower) {
    return {
      maxParticles: 900,
      maxConnections: 64,
      minFrameMs: 34,
      pointerScale: 0.72,
    };
  }

  if (pixelLoad > 2_000_000) {
    return {
      maxParticles: 1400,
      maxConnections: 96,
      minFrameMs: 29,
      pointerScale: 0.86,
    };
  }

  if (pixelLoad > 1_350_000) {
    return {
      maxParticles: 1800,
      maxConnections: 128,
      minFrameMs: 25,
      pointerScale: 0.94,
    };
  }

  return {
    maxParticles: MAX_PARTICLES,
    maxConnections: MAX_CONNECTIONS,
    minFrameMs: 22,
    pointerScale: 1,
  };
}

function extractSamples(
  maskCanvas: HTMLCanvasElement,
  focusPoints: readonly FocusPoint[],
  maxParticles: number,
) {
  const { width, height } = maskCanvas;
  const ctx = maskCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return [] as Sample[];
  }

  const { data } = ctx.getImageData(0, 0, width, height);
  const step = clamp(Math.round(Math.min(width, height) / 110), 4, 7);
  const samples: Sample[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];

      if (alpha < 56) {
        continue;
      }

      samples.push({
        x,
        y,
        alpha: alpha / 255,
        color: [data[index], data[index + 1], data[index + 2]],
      });
    }
  }

  if (samples.length <= maxParticles) {
    return samples;
  }

  const stride = Math.ceil(samples.length / maxParticles);
  return samples.filter((_, index) => {
    if (index % stride === 0) {
      return true;
    }

    const point = samples[index];
    return focusPoints.some(
      (focus) => distance(point.x, point.y, focus.x, focus.y) < width * 0.04,
    );
  });
}

class HeroParticleEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private particles: Particle[] = [];
  private focusPoints: FocusPoint[] = [];
  private pointer = { x: 0, y: 0, active: false };
  private bursts: Burst[] = [];
  private isVisible = true;
  private prefersReducedMotion = false;
  private isRunning = false;
  private animationFrame = 0;
  private lastTick = 0;
  private startedAt = 0;
  private maxParticles = MAX_PARTICLES;
  private maxConnections = MAX_CONNECTIONS;
  private minFrameMs = 22;
  private pointerScale = 1;

  constructor(canvas: HTMLCanvasElement, prefersReducedMotion: boolean) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.prefersReducedMotion = prefersReducedMotion;
  }

  public resize() {
    const bounds = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(bounds.width));
    const height = Math.max(1, Math.floor(bounds.height));
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 1.25);

    if (width === this.width && height === this.height && dpr === this.dpr) {
      return;
    }

    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const quality = getQualityProfile(width, height, dpr);
    this.maxParticles = quality.maxParticles;
    this.maxConnections = quality.maxConnections;
    this.minFrameMs = quality.minFrameMs;
    this.pointerScale = quality.pointerScale;
    this.rebuild();

    if (this.prefersReducedMotion) {
      this.renderStatic();
    }
  }

  public setVisibility(isVisible: boolean) {
    this.isVisible = isVisible;

    if (this.prefersReducedMotion) {
      if (isVisible) {
        this.renderStatic();
      }
      return;
    }

    if (isVisible) {
      this.start();
      return;
    }

    this.stop();
  }

  public setReducedMotion(value: boolean) {
    this.prefersReducedMotion = value;
    this.clearPointer();
    this.bursts = [];

    if (value) {
      this.stop();
      this.renderStatic();
      return;
    }

    if (this.isVisible) {
      this.start();
    }
  }

  public setPointer(x: number, y: number) {
    this.pointer = {
      x: x * this.dpr,
      y: y * this.dpr,
      active: true,
    };
  }

  public clearPointer() {
    this.pointer.active = false;
  }

  public addBurst(x: number, y: number) {
    this.bursts.unshift({
      x: x * this.dpr,
      y: y * this.dpr,
      createdAt: performance.now(),
      strength: 1,
    });
    this.bursts = this.bursts.slice(0, 4);
  }

  public start() {
    if (this.isRunning || this.prefersReducedMotion || !this.isVisible) {
      return;
    }

    this.isRunning = true;
    this.lastTick = 0;
    this.startedAt = performance.now();
    this.animationFrame = globalThis.requestAnimationFrame(this.tick);
  }

  public stop() {
    this.isRunning = false;

    if (this.animationFrame) {
      globalThis.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    }
  }

  public destroy() {
    this.stop();
    this.particles = [];
    this.focusPoints = [];
    this.bursts = [];
  }

  private rebuild() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width * 0.5;
    const centerY = height * 0.52;
    const maxRadius = Math.min(width, height) * 0.42;

    this.focusPoints = createFocusPoints(width, height);

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskContext = maskCanvas.getContext("2d");
    if (!maskContext) {
      this.particles = [];
      return;
    }

    createBrandMask(maskContext, width, height, this.focusPoints);
    const samples = extractSamples(
      maskCanvas,
      this.focusPoints,
      this.maxParticles,
    );
    const highlightStride = Math.max(
      1,
      Math.ceil(samples.length / this.maxConnections),
    );

    this.particles = samples.map((sample, index) => {
      const angle = Math.atan2(sample.y - centerY, sample.x - centerX);
      const radius = maxRadius * (0.3 + Math.random() * 0.75);
      const spawnAngle = angle + (Math.random() - 0.5) * 1.6;
      const spawnX = centerX + Math.cos(spawnAngle) * radius;
      const spawnY = centerY + Math.sin(spawnAngle) * radius * 0.72;
      const focusIndex = this.focusPoints.reduce(
        (closest, point, pointIndex) => {
          const currentDistance = distance(
            sample.x,
            sample.y,
            point.x,
            point.y,
          );
          const closestDistance = distance(
            sample.x,
            sample.y,
            this.focusPoints[closest].x,
            this.focusPoints[closest].y,
          );
          return currentDistance < closestDistance ? pointIndex : closest;
        },
        0,
      );

      return {
        x: spawnX,
        y: spawnY,
        ox: sample.x,
        oy: sample.y,
        vx: -Math.sin(spawnAngle) * (1.4 + Math.random() * 1.6),
        vy: Math.cos(spawnAngle) * (1.2 + Math.random() * 1.4),
        size: clamp(Math.round(this.dpr * (0.8 + Math.random() * 1.5)), 1, 3),
        baseAlpha: clamp(sample.alpha * (0.7 + Math.random() * 0.4), 0.28, 1),
        mass: 0.8 + Math.random() * 0.7,
        color: sample.color,
        drift: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        focusIndex,
        highlight: index % highlightStride === 0,
      };
    });
  }

  private readonly tick = (time: number) => {
    if (!this.isRunning) {
      return;
    }

    if (!this.lastTick) {
      this.lastTick = time;
    }

    const elapsed = time - this.lastTick;
    if (elapsed < this.minFrameMs) {
      this.animationFrame = globalThis.requestAnimationFrame(this.tick);
      return;
    }

    const delta = clamp(elapsed / 16.667, 0.75, 2.2);
    this.lastTick = time;
    this.update(time, delta);
    this.render(time);
    this.animationFrame = globalThis.requestAnimationFrame(this.tick);
  };

  private update(time: number, delta: number) {
    const introProgress = clamp((time - this.startedAt) / 1800, 0, 1);
    const swirlWeight = 1 - introProgress;
    const centerX = this.canvas.width * 0.5;
    const centerY = this.canvas.height * 0.52;
    const swirlX =
      centerX + Math.cos(time * 0.0012) * this.canvas.width * 0.024;
    const swirlY =
      centerY + Math.sin(time * 0.0015) * this.canvas.height * 0.022;
    const pointerRadius = Math.max(
      96,
      Math.min(this.canvas.width, this.canvas.height) *
        0.18 *
        this.pointerScale,
    );

    this.bursts = this.bursts.filter(
      (burst) => time - burst.createdAt < BURST_LIFETIME,
    );

    this.particles.forEach((particle) => {
      if (swirlWeight > 0.02) {
        const dx = swirlX - particle.x;
        const dy = swirlY - particle.y;
        const swirlDistance = Math.max(
          distance(particle.x, particle.y, swirlX, swirlY),
          1,
        );
        const swirlFalloff = clamp(
          1 - swirlDistance / Math.max(this.canvas.width, this.canvas.height),
          0,
          1,
        );
        const radialForce =
          swirlFalloff * swirlFalloff * 0.06 * swirlWeight * delta;
        const tangentialForce = swirlFalloff * 0.25 * swirlWeight * delta;

        particle.vx += (dx / swirlDistance) * radialForce;
        particle.vy += (dy / swirlDistance) * radialForce;
        particle.vx += (-dy / swirlDistance) * tangentialForce;
        particle.vy += (dx / swirlDistance) * tangentialForce;
      }

      const backX = particle.ox - particle.x;
      const backY = particle.oy - particle.y;
      particle.vx +=
        (backX / (20 * particle.mass)) * (0.5 + introProgress) * delta;
      particle.vy +=
        (backY / (20 * particle.mass)) * (0.5 + introProgress) * delta;

      const driftX =
        Math.cos(time * 0.0008 + particle.phase) * particle.drift * 0.018;
      const driftY =
        Math.sin(time * 0.0011 + particle.phase * 1.2) * particle.drift * 0.014;
      particle.vx += driftX * delta;
      particle.vy += driftY * delta;

      if (this.pointer.active) {
        const pointerDistance = distance(
          particle.x,
          particle.y,
          this.pointer.x,
          this.pointer.y,
        );
        if (pointerDistance < pointerRadius && pointerDistance > 0.1) {
          const force = (pointerRadius - pointerDistance) / pointerRadius;
          particle.vx -=
            ((this.pointer.x - particle.x) / pointerDistance) *
            force *
            0.62 *
            this.pointerScale *
            delta;
          particle.vy -=
            ((this.pointer.y - particle.y) / pointerDistance) *
            force *
            0.62 *
            this.pointerScale *
            delta;
        }
      }

      this.bursts.forEach((burst) => {
        const burstDistance = distance(
          particle.x,
          particle.y,
          burst.x,
          burst.y,
        );
        const burstRadius = Math.max(
          124,
          Math.min(this.canvas.width, this.canvas.height) *
            0.22 *
            this.pointerScale,
        );
        if (burstDistance >= burstRadius || burstDistance <= 0.1) {
          return;
        }

        const burstProgress = 1 - (time - burst.createdAt) / BURST_LIFETIME;
        const force =
          ((burstRadius - burstDistance) / burstRadius) *
          burstProgress *
          1.65 *
          burst.strength;
        particle.vx += ((particle.x - burst.x) / burstDistance) * force * delta;
        particle.vy += ((particle.y - burst.y) / burstDistance) * force * delta;
      });

      particle.vx *= 0.91;
      particle.vy *= 0.91;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
    });
  }

  private render(time: number) {
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.clearRect(0, 0, width, height);
    this.drawHalo(time);
    this.drawConnections(time);
    this.drawParticles(time);
  }

  private renderStatic() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.clearRect(0, 0, width, height);
    this.drawHalo(performance.now(), 0.85);

    this.particles.forEach((particle) => {
      particle.x = particle.ox;
      particle.y = particle.oy;
    });

    this.drawConnections(performance.now(), 0.6);
    this.drawParticles(performance.now(), 0.92);
  }

  private drawHalo(time: number, opacity = 1) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const haloRadius = Math.min(width, height) * 0.34;
    const pulse = 0.9 + Math.sin(time * 0.0014) * 0.08;

    const halo = this.ctx.createRadialGradient(
      centerX,
      centerY,
      haloRadius * 0.08,
      centerX,
      centerY,
      haloRadius,
    );
    halo.addColorStop(0, `rgba(125, 211, 252, ${0.22 * opacity * pulse})`);
    halo.addColorStop(0.36, `rgba(96, 165, 250, ${0.12 * opacity})`);
    halo.addColorStop(1, "rgba(2, 6, 23, 0)");

    this.ctx.fillStyle = halo;
    this.ctx.fillRect(0, 0, width, height);

    this.focusPoints.forEach((point, index) => {
      const radius = width * (index % 2 === 0 ? 0.028 : 0.02);
      const glow = this.ctx.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        radius,
      );
      glow.addColorStop(0, `rgba(226, 232, 240, ${0.24 * opacity})`);
      glow.addColorStop(0.45, `rgba(56, 189, 248, ${0.12 * opacity})`);
      glow.addColorStop(1, "rgba(2, 6, 23, 0)");
      this.ctx.fillStyle = glow;
      this.ctx.fillRect(
        point.x - radius,
        point.y - radius,
        radius * 2,
        radius * 2,
      );
    });
  }

  private drawConnections(time: number, opacity = 1) {
    this.ctx.save();
    this.ctx.lineWidth = Math.max(1, this.dpr * 0.6);
    this.ctx.globalCompositeOperation = "screen";

    let rendered = 0;

    this.particles.forEach((particle) => {
      if (!particle.highlight || rendered >= this.maxConnections) {
        return;
      }

      const focus = this.focusPoints[particle.focusIndex];
      if (!focus) {
        return;
      }

      const alpha = clamp(
        (0.06 + Math.sin(time * 0.0018 + particle.phase) * 0.025) * opacity,
        0.02,
        0.12,
      );
      this.ctx.strokeStyle = `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.moveTo(particle.x, particle.y);
      this.ctx.lineTo(focus.x, focus.y);
      this.ctx.stroke();
      rendered += 1;
    });

    this.ctx.restore();
  }

  private drawParticles(time: number, opacity = 1) {
    this.ctx.save();
    this.ctx.globalCompositeOperation = "screen";

    this.particles.forEach((particle) => {
      const shimmer = 0.82 + Math.sin(time * 0.003 + particle.phase) * 0.18;
      const alpha = clamp(particle.baseAlpha * shimmer * opacity, 0.16, 1);
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = `rgb(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]})`;
      this.ctx.fillRect(
        particle.x - particle.size * 0.5,
        particle.y - particle.size * 0.5,
        particle.size,
        particle.size,
      );
    });

    this.ctx.restore();
  }
}

export function HeroParticleStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const motionMedia = globalThis.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const engine = new HeroParticleEngine(canvas, motionMedia.matches);
    const surface = canvas.parentElement ?? canvas;

    const resizeObserver = new ResizeObserver(() => {
      engine.resize();
    });
    resizeObserver.observe(surface);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        engine.setVisibility(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );
    visibilityObserver.observe(surface);

    const handleMotionChange = (event: MediaQueryListEvent) => {
      engine.setReducedMotion(event.matches);
    };

    const pointerFromEvent = (event: PointerEvent) => {
      const bounds = surface.getBoundingClientRect();
      engine.setPointer(
        event.clientX - bounds.left,
        event.clientY - bounds.top,
      );
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerFromEvent(event);
    };

    const handlePointerLeave = () => {
      engine.clearPointer();
    };

    const handlePointerDown = (event: PointerEvent) => {
      pointerFromEvent(event);
      const bounds = surface.getBoundingClientRect();
      engine.addBurst(event.clientX - bounds.left, event.clientY - bounds.top);
    };

    motionMedia.addEventListener("change", handleMotionChange);
    surface.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    surface.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });
    surface.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });

    engine.resize();
    engine.setVisibility(true);
    engine.start();

    return () => {
      motionMedia.removeEventListener("change", handleMotionChange);
      surface.removeEventListener("pointermove", handlePointerMove);
      surface.removeEventListener("pointerleave", handlePointerLeave);
      surface.removeEventListener("pointerdown", handlePointerDown);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      engine.destroy();
    };
  }, []);

  return (
    <canvas
      className="hero-particle-stage"
      aria-hidden="true"
      ref={canvasRef}
    />
  );
}
