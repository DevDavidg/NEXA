import { Suspense, lazy, startTransition, useEffect, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';
import { HeroParticleStage } from './hero-particle-stage';

interface NavigatorWithCapabilities extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

const LazyHeroThreeStage = lazy(() => import('./hero-three-stage').then((module) => ({ default: module.HeroThreeStage })));

type HeroExperienceProps = {
  readonly integrations: readonly string[];
  readonly translations: HeroExperienceTranslations;
};

type HeroLocale = 'en' | 'es';
type HeroExperienceCopy = {
  readonly liveActivityLabel: string;
  readonly leadEngineLabel: string;
  readonly feedEvents: readonly string[];
  readonly liveFlow: readonly string[];
  readonly pipelineSteps: readonly string[];
  readonly kpiStates: ReadonlyArray<{
    readonly label: string;
    readonly score: number;
    readonly trend: string;
    readonly bars: readonly number[];
  }>;
  readonly agentCards: ReadonlyArray<{ readonly label: string; readonly status: string }>;
};
type HeroExperienceTranslations = Readonly<Record<HeroLocale, HeroExperienceCopy>>;

function getHeroLocale(): HeroLocale {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang.toLowerCase().startsWith('es') ? 'es' : 'en';
}

function applyNextEntry(next: string, setEntries: Dispatch<SetStateAction<string[]>>) {
  setEntries((prev) => [next, ...prev.filter((item) => item !== next)].slice(0, 3));
}

function createVisibilityInterval(onTick: () => void, delay: number) {
  let id: number | null = null;
  const start = () => {
    if (id !== null) return;
    id = globalThis.setInterval(onTick, delay);
  };
  const stop = () => {
    if (id === null) return;
    globalThis.clearInterval(id);
    id = null;
  };
  const onVisibilityChange = () => {
    if (document.hidden) stop();
    else start();
  };
  start();
  document.addEventListener('visibilitychange', onVisibilityChange);
  return () => {
    stop();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}

function nextSceneIndex(current: number, total: number): number {
  return (current + 1) % total;
}

function advanceScene(setSceneIndex: Dispatch<SetStateAction<number>>, total: number) {
  startTransition(() => setSceneIndex((current) => nextSceneIndex(current, total)));
}

function flowPillClass(index: number, activeStep: number): string {
  if (index === activeStep) return 'active is-current';
  if (index < activeStep) return 'is-complete';
  return '';
}

function flowLineClass(index: number, activeStep: number): string {
  return index < activeStep ? 'is-live' : '';
}

function ActivityFeed({ events, label }: { readonly events: readonly string[]; readonly label: string }) {
  const [entries, setEntries] = useState(events.slice(0, 3));
  useEffect(() => {
    setEntries(events.slice(0, 3));
    let cursor = 0;
    const tick = () => {
      cursor += 1;
      applyNextEntry(events[cursor % events.length], setEntries);
    };
    return createVisibilityInterval(tick, 2400);
  }, [events]);

  return (
    <div className="activity-feed glass-card" data-hero-panel>
      <div className="panel-label">{label}</div>
      <div className="activity-feed-list">
        {entries.map((entry) => (
          <div className="activity-feed-item" data-hero-feed-item key={entry}>
            <span className="activity-dot"></span>
            <span>{entry}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroExperience({ integrations, translations }: HeroExperienceProps) {
  const heroIntegrations = integrations.slice(0, 4);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showThreeStage, setShowThreeStage] = useState(false);
  const [locale, setLocale] = useState<HeroLocale>(getHeroLocale);
  const copy = translations[locale];

  useEffect(() => {
    return createVisibilityInterval(() => advanceScene(setSceneIndex, copy.kpiStates.length), 1800);
  }, [copy.kpiStates.length]);

  useEffect(() => {
    const target = document.documentElement;
    const observer = new MutationObserver(() => {
      setLocale(getHeroLocale());
    });
    observer.observe(target, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const nav = navigator as NavigatorWithCapabilities;
    const saveData = nav.connection?.saveData ?? false;
    const hardwareThreads = navigator.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;

    if (saveData || hardwareThreads <= 4 || memory <= 4) {
      return;
    }

    const id = globalThis.setTimeout(() => {
      setShowThreeStage(true);
    }, 520);

    return () => globalThis.clearTimeout(id);
  }, []);

  const activeStep = sceneIndex % copy.pipelineSteps.length;
  const currentKpi = copy.kpiStates[sceneIndex % copy.kpiStates.length];

  return (
    <div className="hero-visual hero-experience" data-hero-stage>
      <div className="hero-stage-shell">
        {showThreeStage ? (
          <Suspense fallback={null}>
            <LazyHeroThreeStage />
          </Suspense>
        ) : null}
        <div className="hero-stage-glow hero-stage-glow-a"></div>
        <div className="hero-stage-glow hero-stage-glow-b"></div>
        <div className="hero-stage-beam hero-stage-beam-a"></div>
        <div className="hero-stage-beam hero-stage-beam-b"></div>
        <div className="hero-stage-grid"></div>
        <div className="hero-stage-radar" aria-hidden="true">
          <span className="hero-stage-radar-ring hero-stage-radar-ring-a"></span>
          <span className="hero-stage-radar-ring hero-stage-radar-ring-b"></span>
          <span className="hero-stage-radar-ring hero-stage-radar-ring-c"></span>
          <span className="hero-stage-radar-sweep"></span>
        </div>
        <div className="hero-stage-data-stream hero-stage-data-stream-a" aria-hidden="true"></div>
        <div className="hero-stage-data-stream hero-stage-data-stream-b" aria-hidden="true"></div>
        <div className="hero-canvas-fallback" aria-hidden="true"></div>
        <HeroParticleStage />
        <div className="hero-stage-vignette" aria-hidden="true"></div>
        <div className="hero-stage-scanline" aria-hidden="true"></div>
      </div>
      <div className="hero-stage-overlay">
        <div className="hero-flow-map glass-card" data-hero-panel>
          {copy.liveFlow.map((node, index) => (
            <div className="hero-flow-node" data-hero-flow-node key={node}>
              <span>{node}</span>
              {index < copy.liveFlow.length - 1 ? <div className="hero-flow-connector"></div> : null}
            </div>
          ))}
        </div>

        <div className="hero-hud hero-hud-primary glass-card" data-hero-panel>
          <div className="panel-label">{copy.leadEngineLabel}</div>
          <div className="hero-hud-list">
            {copy.pipelineSteps.map((step, index) => (
              <div className="hero-hud-sequence" key={step}>
                <div className={`flow-pill ${flowPillClass(index, activeStep)}`} data-hero-hud-pill>
                  {step}
                </div>
                {index < copy.pipelineSteps.length - 1 ? <div className={`flow-line ${flowLineClass(index, activeStep)}`}></div> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-hud hero-hud-secondary glass-card" data-hero-panel>
          <div className="mini-kpi">
            <span>{currentKpi.label}</span>
            <strong>{currentKpi.score}%</strong>
            <small className="mini-kpi-trend">{currentKpi.trend}</small>
          </div>
          <div className="mini-chart">
            {currentKpi.bars.map((bar, index) => (
              <span key={`${sceneIndex}-${bar}-${index}`} style={{ '--bar-height': `${bar}%`, '--bar-delay': `${index * 0.08}s` } as CSSProperties}></span>
            ))}
          </div>
        </div>

        <div className="hero-chip-cloud" data-hero-panel>
          {heroIntegrations.map((integration, index) => (
            <span key={integration} data-hero-chip style={{ '--chip-angle': `${(360 / heroIntegrations.length) * index}deg` } as CSSProperties}>
              {integration}
            </span>
          ))}
        </div>

        <ActivityFeed events={copy.feedEvents} label={copy.liveActivityLabel} />

        <div className="agent-mini-stack" data-hero-panel>
          {copy.agentCards.map((card, index) => (
            <div
              className={`agent-mini-card glass-card ${sceneIndex % copy.agentCards.length === index ? 'is-emphasis' : ''}`}
              data-hero-agent-card
              key={card.label}
            >
              <span>{card.label}</span>
              <strong>{card.status}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
