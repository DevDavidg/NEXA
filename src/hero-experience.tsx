import { useEffect, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';

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

const LIVE_FLOW = ['Lead', 'AI analysis', 'Decision', 'Action', 'Result'];

function applyNextEntry(next: string, setEntries: Dispatch<SetStateAction<string[]>>) {
  setEntries((prev) => [next, ...prev.filter((item) => item !== next)].slice(0, 4));
}

function ActivityFeed() {
  const [entries, setEntries] = useState(FEED_EVENTS.slice(0, 4));
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
  return (
    <div className="hero-visual hero-experience" data-hero-stage>
      <div className="hero-stage-shell">
        <div className="hero-stage-glow hero-stage-glow-a"></div>
        <div className="hero-stage-glow hero-stage-glow-b"></div>
        <div className="hero-stage-beam hero-stage-beam-a"></div>
        <div className="hero-stage-beam hero-stage-beam-b"></div>
        <div className="hero-stage-grid"></div>
        <div className="hero-canvas-fallback" aria-hidden="true"></div>
      </div>

      <div className="hero-hud hero-hud-primary glass-card" data-hero-panel>
        <div className="panel-label">Lead Engine</div>
        <div className="hero-hud-list">
          <div className="flow-pill">Lead detected</div>
          <div className="flow-line"></div>
          <div className="flow-pill active">AI scored</div>
          <div className="flow-line"></div>
          <div className="flow-pill">Handoff ready</div>
        </div>
      </div>

      <div className="hero-hud hero-hud-secondary glass-card" data-hero-panel>
        <div className="mini-kpi">
          <span>Leads qualified</span>
          <strong>94%</strong>
        </div>
        <div className="mini-chart">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="hero-chip-cloud" data-hero-panel>
        {integrations.map((integration, index) => (
          <span key={integration} data-hero-chip style={{ '--chip-angle': `${(360 / integrations.length) * index}deg` } as CSSProperties}>
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
        <div className="agent-mini-card glass-card">
          <span>Lead Agent</span>
          <strong>live</strong>
        </div>
        <div className="agent-mini-card glass-card">
          <span>Support Agent</span>
          <strong>active</strong>
        </div>
        <div className="agent-mini-card glass-card">
          <span>Ops Agent</span>
          <strong>running</strong>
        </div>
      </div>
    </div>
  );
}
