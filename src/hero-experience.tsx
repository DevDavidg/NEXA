import { Suspense, lazy, startTransition, useEffect, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';
import { HeroParticleStage } from './hero-particle-stage';

const LazyHeroThreeStage = lazy(() => import('./hero-three-stage').then((module) => ({ default: module.HeroThreeStage })));

type HeroExperienceProps = {
  readonly integrations: readonly string[];
};

const FEED_EVENTS = [
  '+ New lead detected',
  'AI scored prospect: 91%',
  'Proposal generated',
  'Workflow completed',
  'Agent responded to ticket'
];

const LIVE_FLOW = ['Lead', 'AI score', 'Automation', 'Result'];
const PIPELINE_STEPS = ['Lead detected', 'Intent scored', 'Handoff ready'] as const;
const KPI_STATES = [
  { label: 'Leads qualified', score: 94, trend: '+18% this week', bars: [36, 48, 44, 74, 68, 92] },
  { label: 'Reply probability', score: 91, trend: 'Outreach optimized', bars: [32, 52, 58, 72, 78, 88] },
  { label: 'Meeting readiness', score: 97, trend: 'Handoff synced', bars: [44, 58, 66, 82, 76, 96] }
] as const;
const AGENT_CARDS = [
  { label: 'Lead Agent', status: 'live' },
  { label: 'Support Agent', status: 'active' },
  { label: 'Ops Agent', status: 'running' }
] as const;

function applyNextEntry(next: string, setEntries: Dispatch<SetStateAction<string[]>>) {
  setEntries((prev) => [next, ...prev.filter((item) => item !== next)].slice(0, 3));
}

function ActivityFeed() {
  const [entries, setEntries] = useState(FEED_EVENTS.slice(0, 3));
  useEffect(() => {
    let cursor = 0;
    const tick = () => {
      cursor += 1;
      applyNextEntry(FEED_EVENTS[cursor % FEED_EVENTS.length], setEntries);
    };
    const id = globalThis.setInterval(tick, 2400);
    return () => globalThis.clearInterval(id);
  }, []);

  return (
    <div className="activity-feed glass-card" data-hero-panel>
      <div className="panel-label">Live activity</div>
      <div className="activity-feed-list">
        {entries.map((entry) => (
          <div className="activity-feed-item" key={entry}>
            <span className="activity-dot"></span>
            <span>{entry}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroExperience({ integrations }: HeroExperienceProps) {
  const heroIntegrations = integrations.slice(0, 4);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showThreeStage, setShowThreeStage] = useState(false);

  useEffect(() => {
    const id = globalThis.setInterval(() => {
      startTransition(() => {
        setSceneIndex((current) => (current + 1) % KPI_STATES.length);
      });
    }, 1800);

    return () => globalThis.clearInterval(id);
  }, []);

  useEffect(() => {
    if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const id = globalThis.setTimeout(() => {
      setShowThreeStage(true);
    }, 520);

    return () => globalThis.clearTimeout(id);
  }, []);

  const activeStep = sceneIndex % PIPELINE_STEPS.length;
  const currentKpi = KPI_STATES[sceneIndex];

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

      <div className="hero-hud hero-hud-primary glass-card" data-hero-panel>
        <div className="panel-label">Lead Engine</div>
        <div className="hero-hud-list">
          {PIPELINE_STEPS.map((step, index) => (
            <div className="hero-hud-sequence" key={step}>
              <div className={`flow-pill ${index === activeStep ? 'active is-current' : index < activeStep ? 'is-complete' : ''}`}>{step}</div>
              {index < PIPELINE_STEPS.length - 1 ? <div className={`flow-line ${index < activeStep ? 'is-live' : ''}`}></div> : null}
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

      <div className="hero-flow-map glass-card" data-hero-panel>
        {LIVE_FLOW.map((node, index) => (
          <div className="hero-flow-node" key={node}>
            <span>{node}</span>
            {index < LIVE_FLOW.length - 1 ? <div className="hero-flow-connector"></div> : null}
          </div>
        ))}
      </div>

      <ActivityFeed />

      <div className="agent-mini-stack" data-hero-panel>
        {AGENT_CARDS.map((card, index) => (
          <div className={`agent-mini-card glass-card ${sceneIndex % AGENT_CARDS.length === index ? 'is-emphasis' : ''}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.status}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
