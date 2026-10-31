import { useState, useCallback, useEffect, useRef } from 'react';

type Cell = 0 | 1; // 0 empty, 1 obstacle
type CellKind = 'empty' | 'obstacle' | 'start' | 'goal' | 'path' | 'visited' | 'robot';

const ROWS = 10;
const COLS = 12;

interface Pos { r: number; c: number; }

function key(p: Pos) { return `${p.r},${p.c}`; }

function bfs(grid: Cell[][], start: Pos, goal: Pos): { path: Pos[] | null; visited: Set<string> } {
  const visited = new Set<string>();
  const queue: Pos[][] = [[start]];
  visited.add(key(start));
  while (queue.length) {
    const path = queue.shift()!;
    const cur = path[path.length - 1];
    if (cur.r === goal.r && cur.c === goal.c) return { path, visited };
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    for (const [dr, dc] of dirs) {
      const nr = cur.r + dr, nc = cur.c + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (grid[nr][nc] === 1) continue;
      const k = `${nr},${nc}`;
      if (visited.has(k)) continue;
      visited.add(k);
      queue.push([...path, { r: nr, c: nc }]);
    }
  }
  return { path: null, visited };
}

function defaultGrid(): Cell[][] {
  const g: Cell[][] = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => 0));
  // a few preset obstacles
  g[2][4] = 1; g[2][5] = 1; g[3][5] = 1; g[5][3] = 1; g[5][4] = 1; g[5][5] = 1; g[6][7] = 1; g[7][7] = 1;
  return g;
}

export function BlindspotDemo() {
  const [grid, setGrid] = useState<Cell[][]>(defaultGrid);
  const [start, setStart] = useState<Pos>({ r: 0, c: 0 });
  const [goal, setGoal] = useState<Pos>({ r: ROWS - 1, c: COLS - 1 });
  const [paintMode, setPaintMode] = useState<'obstacle' | 'start' | 'goal'>('obstacle');
  const [path, setPath] = useState<Pos[] | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [robotStep, setRobotStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [noPath, setNoPath] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearPath = useCallback(() => {
    setPath(null);
    setVisited(new Set());
    setRobotStep(0);
    setNoPath(false);
  }, []);

  const onCellClick = useCallback((r: number, c: number) => {
    clearPath();
    setGrid((g) => {
      const ng = g.map((row) => [...row]);
      if (paintMode === 'obstacle') {
        if (start.r === r && start.c === c) return ng;
        if (goal.r === r && goal.c === c) return ng;
        ng[r][c] = (ng[r][c] === 1 ? 0 : 1) as Cell;
      } else if (paintMode === 'start') {
        if (ng[r][c] === 1) return ng;
        setStart({ r, c });
      } else if (paintMode === 'goal') {
        if (ng[r][c] === 1) return ng;
        setGoal({ r, c });
      }
      return ng;
    });
  }, [paintMode, start, goal, clearPath]);

  const runBFS = useCallback(() => {
    clearPath();
    const result = bfs(grid, start, goal);
    if (result.path) {
      setPath(result.path);
      setVisited(result.visited);
      setNoPath(false);
    } else {
      setVisited(result.visited);
      setNoPath(true);
    }
  }, [grid, start, goal, clearPath]);

  const step = useCallback(() => {
    setRobotStep((s) => {
      if (!path) return s;
      if (s < path.length - 1) return s + 1;
      setRunning(false);
      return s;
    });
  }, [path]);

  const play = useCallback(() => {
    if (!path) return;
    setRunning(true);
  }, [path]);

  const pause = useCallback(() => setRunning(false), []);

  useEffect(() => {
    if (running && path && robotStep < path.length - 1) {
      timerRef.current = window.setTimeout(step, 220);
      return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
    }
  }, [running, path, robotStep, step]);

  const reset = useCallback(() => {
    setGrid(defaultGrid());
    setStart({ r: 0, c: 0 });
    setGoal({ r: ROWS - 1, c: COLS - 1 });
    clearPath();
    setRunning(false);
  }, [clearPath]);

  const robotPos = path && robotStep < path.length ? path[robotStep] : null;

  const cellKind = (r: number, c: number): CellKind => {
    if (robotPos && robotPos.r === r && robotPos.c === c) return 'robot';
    if (start.r === r && start.c === c) return 'start';
    if (goal.r === r && goal.c === c) return 'goal';
    if (grid[r][c] === 1) return 'obstacle';
    if (path && path.some((p) => p.r === r && p.c === c)) return 'path';
    if (visited.has(`${r},${c}`)) return 'visited';
    return 'empty';
  };

  const cellStyle: Record<CellKind, string> = {
    empty: 'bg-canvas border-divider',
    obstacle: 'bg-ink2 border-divider',
    start: 'bg-lime border-lime',
    goal: 'bg-orange border-orange',
    path: 'bg-lime/30 border-lime/40',
    visited: 'bg-lime/10 border-lime/20',
    robot: 'bg-lime border-lime',
  };

  return (
    <div className="border border-divider bg-panel p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="eyebrow">Blindspot / Robot Navigation</div>
        <button onClick={reset} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime">Reset</button>
      </div>
      <p className="mono text-[10px] ink2 mb-4">
        Paint obstacles, set the start and goal, then run breadth-first search. The robot steps through the path. Blocked routes are reported gracefully. This is a deterministic simulation — no claim of physical-hardware testing.
      </p>

      {/* Paint mode */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['obstacle', 'start', 'goal'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setPaintMode(m)}
            className={`mono text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-colors ${paintMode === m ? 'border-lime bg-lime/10 text-lime' : 'border-divider hover:border-lime ink2'}`}
          >
            {m === 'obstacle' ? 'Paint: Obstacle' : m === 'start' ? 'Set: Start' : 'Set: Goal'}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button onClick={runBFS} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-lime bg-lime text-ink hover:bg-lime/80">Run BFS</button>
          {!running ? (
            <button onClick={play} disabled={!path} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime disabled:opacity-40 disabled:cursor-not-allowed">Play</button>
          ) : (
            <button onClick={pause} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime">Pause</button>
          )}
          <button onClick={step} disabled={!path || running} className="mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-divider hover:border-lime disabled:opacity-40 disabled:cursor-not-allowed">Step</button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="inline-grid gap-px bg-divider border border-divider" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(28px, 1fr))` }}>
          {grid.map((row, r) => row.map((_, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              className={`w-7 h-7 sm:w-8 sm:h-8 border ${cellStyle[cellKind(r, c)]} transition-colors`}
              aria-label={`Cell ${r},${c}`}
            />
          )))}
        </div>
      </div>

      {/* Status */}
      <div className="mt-4">
        {noPath && (
          <div className="border border-orange p-3 text-sm">
            <span className="text-orange font-medium">No path found. </span>
            <span className="ink2">The goal is unreachable from the start with the current obstacles. Remove or relocate obstacles and run again.</span>
          </div>
        )}
        {!noPath && path && (
          <div className="border border-lime p-3 text-sm">
            <span className="font-medium">Path found. </span>
            <span className="ink2">Length: {path.length} steps. Visited: {visited.size} cells. Robot at step {robotStep + 1} of {path.length}.</span>
            <div className="mono text-[10px] ink2 mt-1">
              BFS explores uniformly in all directions, guaranteeing the shortest path on an unweighted grid. The visited cells show the search frontier.
            </div>
          </div>
        )}
        {!noPath && !path && (
          <div className="mono text-[10px] ink2">
            Configure the grid and press "Run BFS" to compute a path.
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 mono text-[10px] uppercase tracking-wider ink2">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-lime inline-block" /> Start / Robot</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange inline-block" /> Goal</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-ink2 inline-block" /> Obstacle</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-lime/30 inline-block border border-lime/40" /> Path</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-lime/10 inline-block border border-lime/20" /> Visited</span>
      </div>
    </div>
  );
}
