import { useState, useCallback, useEffect, useRef } from 'react';
import { Section, SectionHeader } from '@/components/ui';
import { CascadeDemo } from '@/components/demos/CascadeDemo';
import { BlindspotDemo } from '@/components/demos/BlindspotDemo';

// Experiment A — Signal Flow
type FlowStage = 'input' | 'processing' | 'decision' | 'output';

const stageInfo: Record<FlowStage, { label: string; desc: string }> = {
  input: { label: 'Input', desc: 'Raw signal enters the system. Nothing has been done to it yet.' },
  processing: { label: 'Processing', desc: 'Signal is normalized and transformed. Toggle this stage to enable or disable processing.' },
  decision: { label: 'Decision', desc: 'The processed signal is compared against a threshold. The route taken depends on the result.' },
  output: { label: 'Output', desc: 'The system emits a result. The shape of the result depends on every stage that came before it.' },
};

function SignalFlow() {
  const [processingOn, setProcessingOn] = useState(true);
  const [inputValue, setInputValue] = useState(72);
  const [running, setRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<FlowStage | null>(null);
  const timers = useRef<number[]>([]);

  const threshold = 50;
  const processed = processingOn ? Math.round(inputValue * 0.9 + 10) : inputValue;
  const decision = processed >= threshold ? 'HIGH' : 'LOW';
  const output = decision === 'HIGH' ? 'Action triggered' : 'No action';

  const run = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setRunning(true);
    setActiveStage('input');
    const stages: FlowStage[] = ['input', 'processing', 'decision', 'output'];
    stages.forEach((s, i) => {
      const t = window.setTimeout(() => {
        setActiveStage(s);
        if (i === stages.length - 1) {
          const tf = window.setTimeout(() => { setRunning(false); setActiveStage(null); }, 800);
          timers.current.push(tf);
        }
      }, i * 600);
      timers.current.push(t);
    });
  }, []);

  useEffect(() => () => { timers.current.forEach((t) => window.clearTimeout(t)); }, []);

  const reset = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setRunning(false);
    setActiveStage(null);
    setInputValue(72);
    setProcessingOn(true);
  }, []);

  const stages: FlowStage[] = ['input', 'processing', 'decision', 'output'];

  return (
    <div className="border border-divider bg-panel p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="eyebrow">Experiment A / Signal Flow</div>
        <div className="flex gap-2">
          <button onClick={run} disabled={running} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-lime bg-lime text-ink hover:bg-lime/80 disabled:opacity-40">Run Flow</button>
          <button onClick={reset} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime">Reset</button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1">
          <span className="mono text-[10px] uppercase tracking-wider ink2">Input value: {inputValue}</span>
        </label>
        <input type="range" min="0" max="100" value={inputValue} onChange={(e) => setInputValue(Number(e.target.value))} className="w-full accent-lime" aria-label="Input value" disabled={running} />
      </div>

      <button
        onClick={() => setProcessingOn((v) => !v)}
        className={`mono text-[10px] uppercase tracking-wider px-3 py-1.5 border mb-4 ${processingOn ? 'border-lime bg-lime/10 text-lime' : 'border-divider ink2'}`}
      >
        Processing stage: {processingOn ? 'ON' : 'OFF'}
      </button>

      {/* Flow diagram */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-divider border border-divider mb-4">
        {stages.map((s) => {
          const active = activeStage === s;
          return (
            <div key={s} className={`p-4 bg-canvas transition-colors ${active ? 'bg-lime/10' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${active ? 'bg-lime' : 'bg-divider'}`} />
                <span className="mono text-[10px] uppercase tracking-wider">{stageInfo[s].label}</span>
              </div>
              <div className="mono text-sm font-medium">
                {s === 'input' && <span>{inputValue}</span>}
                {s === 'processing' && <span>{processingOn ? processed : 'bypassed'}</span>}
                {s === 'decision' && <span>{decision}</span>}
                {s === 'output' && <span>{output}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mono text-[10px] ink2 leading-relaxed">
        Threshold: {threshold}. With processing {processingOn ? 'on' : 'off'}, the input {inputValue} becomes {processingOn ? processed : inputValue}, which is {decision === 'HIGH' ? 'above' : 'below'} the threshold. Output: {output}.
      </div>
    </div>
  );
}

export function PlaygroundPage() {
  const [activeExp, setActiveExp] = useState<'index' | 'signal' | 'failure' | 'robot'>('index');

  const experiments = [
    { id: 'signal' as const, num: 'A', title: 'Signal Flow', desc: 'A node-and-connection system. Toggle a processing stage and run a flow from input to output.' },
    { id: 'failure' as const, num: 'B', title: 'Failure Propagation', desc: 'Trigger a disruption in an infrastructure system and watch dependencies cascade.' },
    { id: 'robot' as const, num: 'C', title: 'Robot Navigation', desc: 'A grid-based robot challenge with BFS pathfinding. Paint obstacles, set goals, step through.' },
  ];

  return (
    <div>
      <Section className="pt-10 sm:pt-14 pb-6">
        <SectionHeader idx="01 / Playground" title="Systems Playground" sub="A collection of small, functional experiments you can operate directly in the browser. Each runs entirely locally — no external APIs, no network calls." />
      </Section>

      {activeExp === 'index' && (
        <Section className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-divider border border-divider">
            {experiments.map((e) => (
              <button
                key={e.id}
                onClick={() => setActiveExp(e.id)}
                className="bg-canvas hover:bg-panel transition-colors group p-6 text-left"
              >
                <div className="mono text-[10px] ink2 mb-2">Experiment {e.num}</div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-lime transition-colors">{e.title}</h3>
                <p className="text-sm ink2 mb-3">{e.desc}</p>
                <div className="mono text-[10px] uppercase tracking-wider text-lime">Open →</div>
              </button>
            ))}
          </div>
        </Section>
      )}

      {activeExp !== 'index' && (
        <Section className="py-6">
          <button
            onClick={() => setActiveExp('index')}
            className="mono text-[10px] uppercase tracking-wider ink2 hover:text-lime mb-6 inline-block"
          >
            ← Back to Playground
          </button>

          {activeExp === 'signal' && (
            <div>
              <div className="eyebrow mb-1">Experiment A</div>
              <h2 className="display text-2xl sm:text-3xl mb-6">Signal Flow</h2>
              <SignalFlow />
            </div>
          )}
          {activeExp === 'failure' && (
            <div>
              <div className="eyebrow mb-1">Experiment B</div>
              <h2 className="display text-2xl sm:text-3xl mb-6">Failure Propagation</h2>
              <CascadeDemo />
            </div>
          )}
          {activeExp === 'robot' && (
            <div>
              <div className="eyebrow mb-1">Experiment C</div>
              <h2 className="display text-2xl sm:text-3xl mb-6">Robot Navigation</h2>
              <BlindspotDemo />
            </div>
          )}
        </Section>
      )}
    </div>
  );
}
