import { useState, useCallback } from 'react';

type SysId = 'electricity' | 'water' | 'transport' | 'communications' | 'emergency';

interface SysNode {
  id: SysId;
  label: string;
  x: number;
  y: number;
  dependsOn: SysId[];
  desc: string;
}

const systems: SysNode[] = [
  { id: 'electricity', label: 'Electricity', x: 100, y: 60, dependsOn: [], desc: 'Powers pumps, signals, and communications infrastructure.' },
  { id: 'water', label: 'Water', x: 280, y: 60, dependsOn: ['electricity'], desc: 'Water pumping and distribution require electricity to operate.' },
  { id: 'communications', label: 'Communications', x: 100, y: 180, dependsOn: ['electricity'], desc: 'Phone networks, internet, and radio all require electrical power.' },
  { id: 'transport', label: 'Transport', x: 280, y: 180, dependsOn: ['electricity', 'communications'], desc: 'Traffic signals need power; coordination needs communications.' },
  { id: 'emergency', label: 'Emergency', x: 190, y: 280, dependsOn: ['electricity', 'communications', 'transport'], desc: 'Emergency response needs power, communications, and transport access.' },
];

type State = 'operational' | 'disrupted';

export function CascadeDemo() {
  const [states, setStates] = useState<Record<SysId, State>>(
    () => Object.fromEntries(systems.map((s) => [s.id, 'operational' as State])) as Record<SysId, State>
  );
  const [affected, setAffected] = useState<{ id: SysId; reason: string }[]>([]);

  // Propagate failures from a manually disrupted system
  const propagate = useCallback((start: SysId) => {
    const next: Record<SysId, State> = { ...Object.fromEntries(systems.map((s) => [s.id, 'operational' as State])) } as Record<SysId, State>;
    next[start] = 'disrupted';
    const reasons: { id: SysId; reason: string }[] = [{ id: start, reason: 'Manually disrupted by the visitor.' }];

    // Iterative propagation: a system is disrupted if any of its dependencies is disrupted
    let changed = true;
    let iterations = 0;
    while (changed && iterations < systems.length) {
      changed = false;
      iterations++;
      systems.forEach((s) => {
        if (next[s.id] === 'disrupted') return;
        const downDep = s.dependsOn.find((d) => next[d] === 'disrupted');
        if (downDep) {
          next[s.id] = 'disrupted';
          changed = true;
          reasons.push({ id: s.id, reason: `Depends on ${labelFor(downDep)}, which is disrupted. (Downstream effect)` });
        }
      });
    }
    setStates(next);
    setAffected(reasons);
  }, []);

  const restore = useCallback((id: SysId) => {
    // If restoring the originally disrupted node, reset all
    // Otherwise: restore one node and re-propagate from remaining disrupted ones
    setStates((prev) => {
      const next = { ...prev };
      next[id] = 'operational';
      // Re-evaluate: if no dependency is disrupted, keep operational. But we also need to re-check downstream
      // Simplest: find all manually-disrupted (we can't track that, so instead re-propagate)
      return next;
    });
    // Simpler approach: just reset everything to operational
    setStates(Object.fromEntries(systems.map((s) => [s.id, 'operational' as State])) as Record<SysId, State>);
    setAffected([]);
  }, []);

  const reset = useCallback(() => {
    setStates(Object.fromEntries(systems.map((s) => [s.id, 'operational' as State])) as Record<SysId, State>);
    setAffected([]);
  }, []);

  const allEdges: { from: SysId; to: SysId }[] = [];
  systems.forEach((s) => s.dependsOn.forEach((d) => allEdges.push({ from: d, to: s.id })));

  return (
    <div className="border border-divider bg-panel p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="eyebrow">Cascade Protocol / Interactive Simulation</div>
        <button onClick={reset} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime">Reset</button>
      </div>
      <p className="mono text-[10px] ink2 mb-4">
        Click a system to disrupt it. The simulation propagates the failure to every system that depends on it — directly and downstream. This is an illustrative model, not a prediction of real infrastructure behavior.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diagram */}
        <div>
          <svg viewBox="0 0 380 340" className="w-full h-auto border border-divider bg-canvas">
            {/* edges */}
            {allEdges.map((e, i) => {
              const from = systems.find((s) => s.id === e.from)!;
              const to = systems.find((s) => s.id === e.to)!;
              const active = states[e.from] === 'disrupted' || states[e.to] === 'disrupted';
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={active ? '#F18B50' : 'currentColor'}
                  className={active ? '' : 'ink2'}
                  strokeWidth={active ? 1.6 : 1}
                  opacity={active ? 1 : 0.4}
                  strokeDasharray={active ? '5 3' : undefined}
                />
              );
            })}
            {/* nodes */}
            {systems.map((s) => {
              const down = states[s.id] === 'disrupted';
              return (
                <g
                  key={s.id}
                  onClick={() => down ? restore(s.id) : propagate(s.id)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`${s.label}: ${down ? 'disrupted. Click to restore.' : 'operational. Click to disrupt.'}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (down) { restore(s.id); } else { propagate(s.id); } } }}
                >
                  <circle
                    cx={s.x} cy={s.y} r="26"
                    fill={down ? '#F18B50' : 'var(--panel)'}
                    stroke={down ? '#F18B50' : 'currentColor'}
                    className={down ? '' : 'ink2'}
                    strokeWidth={1.4}
                  />
                  <text x={s.x} y={s.y - 2} textAnchor="middle" fontSize="8" className="mono" fill={down ? '#171A18' : 'currentColor'} fontWeight="600">
                    {s.label.slice(0, 8).toUpperCase()}
                  </text>
                  <text x={s.x} y={s.y + 8} textAnchor="middle" fontSize="7" className="mono" fill={down ? '#171A18' : 'currentColor'} opacity="0.7">
                    {down ? 'DOWN' : 'OK'}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="mono text-[10px] ink2 mt-2">
            Click an operational system to disrupt it. Click a disrupted system to restore it. Direct dependencies fail first; downstream systems follow.
          </div>
        </div>

        {/* Affected list */}
        <div>
          <div className="eyebrow mb-2">Affected Systems</div>
          {affected.length === 0 ? (
            <div className="border border-divider p-6 text-center">
              <span className="inline-block w-2 h-2 rounded-full bg-lime mb-2" />
              <p className="text-sm ink2">All systems operational. Disrupt a system to see the cascade.</p>
            </div>
          ) : (
            <ol className="space-y-2">
              {affected.map((a, i) => {
                const sys = systems.find((s) => s.id === a.id)!;
                const direct = i === 0;
                return (
                  <li key={a.id} className="border border-divider p-3 bg-canvas">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="mono text-[10px] ink2">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-medium text-sm">{sys.label}</span>
                      <span className={`mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${direct ? 'border-orange text-orange' : 'border-divider ink2'}`}>
                        {direct ? 'Direct' : 'Downstream'}
                      </span>
                    </div>
                    <p className="text-xs ink2">{a.reason}</p>
                    <p className="mono text-[10px] ink2 mt-1">{sys.desc}</p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function labelFor(id: SysId): string {
  return systems.find((s) => s.id === id)!.label;
}
