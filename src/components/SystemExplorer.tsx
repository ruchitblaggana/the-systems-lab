import { useState, useRef, useCallback } from 'react';
import { useReducedMotion } from '@/lib/settings';

type NodeId = 'input' | 'processing' | 'logic' | 'feedback' | 'output';

interface SysNode {
  id: NodeId;
  label: string;
  x: number;
  y: number;
  description: string;
  connections: { to: NodeId; label: string }[];
}

const nodes: SysNode[] = [
  { id: 'input', label: 'Input', x: 80, y: 70, description: 'The environment provides a signal — a sensor reading, user action, or data stream. This is what the system observes.', connections: [{ to: 'processing', label: 'raw signal' }] },
  { id: 'processing', label: 'Processing', x: 250, y: 130, description: 'Raw input is filtered, normalized, and transformed into a shape the system can reason about. Noise is reduced; structure is extracted.', connections: [{ to: 'logic', label: 'structured data' }] },
  { id: 'logic', label: 'Logic', x: 420, y: 70, description: 'The decision layer compares the processed signal against rules or models. It decides what the system should do next.', connections: [{ to: 'output', label: 'action' }, { to: 'feedback', label: 'evaluate' }] },
  { id: 'output', x: 590, y: 130, label: 'Output', description: 'The system acts — it moves a motor, shows an alert, returns a result. The action affects the world or the user.', connections: [{ to: 'feedback', label: 'result' }] },
  { id: 'feedback', x: 420, y: 220, label: 'Feedback', description: 'The outcome is measured and fed back into the system. This closes the loop: the next input depends partly on what the last output achieved.', connections: [{ to: 'processing', label: 'adjust' }] },
];

const connectionList: { from: NodeId; to: NodeId; label: string }[] = [];
nodes.forEach((n) => n.connections.forEach((c) => connectionList.push({ from: n.id, to: c.to, label: c.label })));

export function SystemExplorer() {
  const [selected, setSelected] = useState<NodeId | null>(null);
  const [flowing, setFlowing] = useState<NodeId | null>(null);
  const reduced = useReducedMotion();
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const selectNode = useCallback((id: NodeId) => {
    setSelected(id);
    if (reduced) return;
    clearTimers();
    setFlowing(id);
    // Animate flow through connected edges for 1.5s
    const t1 = window.setTimeout(() => setFlowing(null), 1800);
    timersRef.current.push(t1);
  }, [reduced, clearTimers]);

  const reset = useCallback(() => {
    setSelected(null);
    setFlowing(null);
    clearTimers();
  }, [clearTimers]);

  const selectedNode = selected ? nodes.find((n) => n.id === selected)! : null;
  const activeEdges = selectedNode ? connectionList.filter((e) => e.from === selected || e.to === selected) : [];

  return (
    <div className="relative bg-panel border border-divider rounded-none overflow-hidden">
      <div className="grid-bg-fine absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="eyebrow">System Explorer / Interactive</div>
          <button
            onClick={reset}
            className="mono text-[10px] uppercase tracking-wider px-2 py-1 border border-divider hover:border-lime transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="relative w-full" role="group" aria-label="System Explorer interactive diagram">
          <svg viewBox="0 0 680 290" className="w-full h-auto" aria-label="Five interconnected system nodes: Input, Processing, Logic, Output, and Feedback. Select a node to see its role.">
            {/* Edges */}
            {connectionList.map((e, i) => {
              const from = nodes.find((n) => n.id === e.from)!;
              const to = nodes.find((n) => n.id === e.to)!;
              const isActive = activeEdges.some((ae) => ae.from === e.from && ae.to === e.to);
              const isFlowing = flowing === e.from && activeEdges.some((ae) => ae.from === e.from && ae.to === e.to);
              return (
                <g key={i}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke="currentColor"
                    className={isActive ? 'text-lime' : 'text-divider'}
                    strokeWidth={isActive ? 1.6 : 1}
                    strokeDasharray={isFlowing ? undefined : '0'}
                  />
                  {isFlowing && !reduced && (
                    <line
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke="#C8F169"
                      strokeWidth="2"
                      className="dash-flow"
                      strokeDasharray="5 5"
                    />
                  )}
                  {/* arrow head */}
                  <circle cx={to.x} cy={to.y} r="2" fill={isActive ? '#C8F169' : 'currentColor'} className={isActive ? '' : 'ink2'} opacity="0.6" />
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const isSel = selected === n.id;
              return (
                <g
                  key={n.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${n.label} node. ${n.description}`}
                  onClick={() => selectNode(n.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(n.id); } }}
                  className="cursor-pointer focus:outline-none"
                >
                  <circle
                    cx={n.x} cy={n.y} r={isSel ? 24 : 20}
                    fill={isSel ? '#C8F169' : 'var(--panel)'}
                    stroke="currentColor"
                    className={isSel ? 'text-lime' : 'text-divider'}
                    strokeWidth={isSel ? 2 : 1.2}
                    style={{ transition: 'r 0.2s, fill 0.2s' }}
                  />
                  {n.id === 'logic' && (
                    <circle cx={n.x} cy={n.y} r="3" fill="#F18B50" />
                  )}
                  <text
                    x={n.x} y={n.y + 42}
                    textAnchor="middle"
                    className="mono"
                    fontSize="10"
                    fill="currentColor"
                  >
                    {n.label.toUpperCase()}
                  </text>
                  {isSel && (
                    <text x={n.x} y={n.y - 30} textAnchor="middle" fontSize="9" className="mono" fill="#C8F169">
                      ◆ ACTIVE
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Info panel */}
        <div className="mt-3 border-t border-divider pt-3 min-h-[72px]">
          {selectedNode ? (
            <div className="fade-in">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-lime" />
                <span className="mono text-xs font-medium uppercase tracking-wider">{selectedNode.label}</span>
              </div>
              <p className="text-sm ink2 leading-relaxed">{selectedNode.description}</p>
              {selectedNode.connections.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedNode.connections.map((c) => (
                    <span key={c.to} className="mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-divider">
                      → {nodes.find((n) => n.id === c.to)!.label}: {c.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm ink2 leading-relaxed">
              Select a node to inspect its role in the system. The diagram shows how a signal flows from input through processing, logic, and output — with feedback closing the loop.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
