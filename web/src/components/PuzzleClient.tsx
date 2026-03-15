'use client';

import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react';
import type { PuzzlePayload } from '@/types/puzzle';
import { solveWithWasm } from '@/lib/wasmSolver';

type CellState = 0 | 1 | -1; // пусто, заполнено, крестик

type Props = {
  puzzle: PuzzlePayload;
};

const HISTORY_LIMIT = 200;

const cellClass = (state: CellState) => {
  if (state === 1) return 'bg-emerald-400 border-emerald-300 shadow-inner shadow-emerald-900/30';
  if (state === -1) return 'bg-slate-900 text-slate-500';
  return 'bg-slate-950 text-slate-800';
};

export function PuzzleClient({ puzzle }: Props) {
  const totalCells = puzzle.size * puzzle.size;
  const storageKey = `nonogram-progress-${puzzle.id}`;
  const createEmptyGrid = useCallback(() => Array<CellState>(totalCells).fill(0) as CellState[], [totalCells]);

  const historyRef = useRef<CellState[][]>([createEmptyGrid()]);
  const historyIndexRef = useRef(0);
  const gridRef = useRef<CellState[]>(createEmptyGrid());
  const strokeBaseRef = useRef<CellState[] | null>(null);

  const [mode, setMode] = useState<'fill' | 'cross'>('fill');
  const [autoMode, setAutoMode] = useState<'off' | 'fill' | 'cross'>('off');
  const [grid, setGrid] = useState<CellState[]>(createEmptyGrid);
  const [errorCount, setErrorCount] = useState(0);
  const [solverGrid, setSolverGrid] = useState<number[][] | null>(null);
  const [solverError, setSolverError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isPointerActive, setIsPointerActive] = useState(false);
  const [pointerValue, setPointerValue] = useState<CellState | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const syncHistoryFlags = () => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  const pushHistory = useCallback(
    (snapshot: CellState[]) => {
      const cloned = [...snapshot];
      const truncated = historyRef.current.slice(0, historyIndexRef.current + 1);
      truncated.push(cloned);
      if (truncated.length > HISTORY_LIMIT) {
        truncated.shift();
      }
      historyRef.current = truncated;
      historyIndexRef.current = truncated.length - 1;
      syncHistoryFlags();
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    startTransition(() => {
      setIsChecking(true);
      setSolverError(null);
    });
    solveWithWasm(puzzle)
      .then((result) => {
        if (!cancelled) {
          setSolverGrid(result.grid);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('wasm solver error', error);
          setSolverError('Не удалось запустить solver');
          setSolverGrid(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsChecking(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [puzzle]);

  useEffect(() => {
    historyRef.current = [createEmptyGrid()];
    historyIndexRef.current = 0;
    startTransition(() => {
      setGrid(createEmptyGrid());
      setErrorCount(0);
      setCanUndo(false);
      setCanRedo(false);
      setHasHydrated(false);
    });
  }, [createEmptyGrid, puzzle.id, puzzle.size]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { grid: CellState[]; errors?: number };
        if (Array.isArray(parsed.grid) && parsed.grid.length === totalCells) {
          const snapshot = [...parsed.grid];
          historyRef.current = [snapshot];
          historyIndexRef.current = 0;
          gridRef.current = snapshot;
          startTransition(() => {
            setGrid(snapshot);
            setErrorCount(parsed.errors ?? 0);
            syncHistoryFlags();
          });
        }
      } catch (err) {
        console.warn('Failed to parse saved state', err);
      }
    } else {
      const empty = createEmptyGrid();
      historyRef.current = [empty];
      historyIndexRef.current = 0;
      gridRef.current = empty;
      startTransition(() => {
        setGrid(empty);
        setErrorCount(0);
        syncHistoryFlags();
      });
    }
    startTransition(() => setHasHydrated(true));
  }, [createEmptyGrid, storageKey, totalCells]);

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') return;
    const payload = JSON.stringify({ grid, errors: errorCount });
    window.localStorage.setItem(storageKey, payload);
  }, [grid, errorCount, storageKey, hasHydrated]);

  const finalizeStroke = useCallback(() => {
    if (!strokeBaseRef.current) return;
    pushHistory(gridRef.current);
    strokeBaseRef.current = null;
    setIsPointerActive(false);
    setPointerValue(null);
  }, [pushHistory]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const upHandler = () => finalizeStroke();
    window.addEventListener('pointerup', upHandler);
    window.addEventListener('touchend', upHandler);
    return () => {
      window.removeEventListener('pointerup', upHandler);
      window.removeEventListener('touchend', upHandler);
    };
  }, [finalizeStroke]);

  const solvedFlat = useMemo(() => (solverGrid ? solverGrid.flat() : puzzle.solution.flat()), [solverGrid, puzzle.solution]);

  const isSolved = useMemo(() => {
    return grid.every((value, index) => {
      const expected = solvedFlat[index];
      if (expected === 1) {
        return value === 1;
      }
      return value !== 1;
    });
  }, [grid, solvedFlat]);

  const updateErrorTracking = (index: number, nextValue: CellState) => {
    if (!solvedFlat) return;
    const expected = solvedFlat[index];
    if ((expected === 0 && nextValue === 1) || (expected === 1 && nextValue === -1)) {
      setErrorCount((prev) => prev + 1);
    }
  };

  const setCellValue = (index: number, nextValue: CellState, recordHistory = true) => {
    setGrid((prev) => {
      if (prev[index] === nextValue) {
        return prev;
      }
      const next = [...prev];
      next[index] = nextValue;
      updateErrorTracking(index, nextValue);
      const snapshot = [...next];
      if (recordHistory) {
        pushHistory(snapshot);
      } else {
        historyRef.current[historyIndexRef.current] = snapshot;
      }
      return snapshot;
    });
  };

  const toggleCell = (index: number) => {
    if (autoMode !== 'off') return;
    const current = grid[index];
    const nextValue = mode === 'fill' ? (current === 1 ? 0 : 1) : current === -1 ? 0 : -1;
    setCellValue(index, nextValue, true);
  };

  const handleUndo = () => {
    if (historyIndexRef.current === 0) return;
    historyIndexRef.current -= 1;
    const snapshot = [...historyRef.current[historyIndexRef.current]];
    historyRef.current[historyIndexRef.current] = snapshot;
    setGrid(snapshot);
    gridRef.current = snapshot;
    syncHistoryFlags();
  };

  const handleRedo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const snapshot = [...historyRef.current[historyIndexRef.current]];
    historyRef.current[historyIndexRef.current] = snapshot;
    setGrid(snapshot);
    gridRef.current = snapshot;
    syncHistoryFlags();
  };

  const resetProgress = () => {
    const empty = createEmptyGrid();
    historyRef.current = [empty];
    historyIndexRef.current = 0;
    setGrid(empty);
    gridRef.current = empty;
    setErrorCount(0);
    syncHistoryFlags();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
    }
  };

  const startAutoStroke = (index: number) => {
    if (autoMode === 'off') {
      toggleCell(index);
      return;
    }
    strokeBaseRef.current = [...gridRef.current];
    setIsPointerActive(true);
    const nextValue: CellState = autoMode === 'fill' ? 1 : -1;
    setPointerValue(nextValue);
    setCellValue(index, nextValue, false);
  };

  const continueAutoStroke = (index: number) => {
    if (!isPointerActive || pointerValue === null) return;
    setCellValue(index, pointerValue, false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setMode('fill')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${mode === 'fill' ? 'bg-emerald-500 text-emerald-50' : 'bg-slate-800 text-slate-300'}`}
        >
          Закрашивать
        </button>
        <button
          type="button"
          onClick={() => setMode('cross')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${mode === 'cross' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          Ставить кресты
        </button>
        <button
          type="button"
          onClick={() => setAutoMode('off')}
          className={`rounded-full border px-4 py-2 text-sm ${autoMode === 'off' ? 'border-emerald-500 text-emerald-200' : 'border-slate-700 text-slate-300'}`}
        >
          Авто выкл
        </button>
        <button
          type="button"
          onClick={() => setAutoMode('fill')}
          className={`rounded-full border px-4 py-2 text-sm ${autoMode === 'fill' ? 'border-emerald-500 text-emerald-200' : 'border-slate-700 text-slate-300'}`}
        >
          Авто-заливка
        </button>
        <button
          type="button"
          onClick={() => setAutoMode('cross')}
          className={`rounded-full border px-4 py-2 text-sm ${autoMode === 'cross' ? 'border-emerald-500 text-emerald-200' : 'border-slate-700 text-slate-300'}`}
        >
          Авто-кресты
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo}
          className={`rounded-full border px-3 py-1 ${canUndo ? 'border-slate-600 text-slate-100' : 'border-slate-800 text-slate-500'}`}
        >
          ↺ Отменить
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={!canRedo}
          className={`rounded-full border px-3 py-1 ${canRedo ? 'border-slate-600 text-slate-100' : 'border-slate-800 text-slate-500'}`}
        >
          ↻ Повторить
        </button>
        <span className="text-slate-400">
          Ошибки: <span className="text-white">{errorCount}</span>
        </span>
        <button
          type="button"
          onClick={resetProgress}
          className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-slate-500"
        >
          Сбросить прогресс
        </button>
      </div>

      {isChecking && (
        <div className="rounded-xl border border-sky-500/40 bg-sky-500/5 px-4 py-3 text-sm text-sky-200">
          Загружаю wasm-solver…
        </div>
      )}
      {solverError && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {solverError}. Использую локальную проверку.
        </div>
      )}
      {isSolved && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          🎉 Пазл решён! Попробуй следующий.
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex flex-col justify-end gap-1 text-right text-xs text-slate-400">
          {puzzle.rows.map((row, idx) => (
            <div key={idx} className="h-8 whitespace-nowrap">
              {row.join(' ')}
            </div>
          ))}
        </div>

        <div>
          <div className="ml-8 grid" style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(24px, 32px))` }}>
            {puzzle.cols.map((col, idx) => (
              <div key={idx} className="mb-1 min-h-[50px] whitespace-pre-line text-center text-xs text-slate-400">
                {col.join('\n')}
              </div>
            ))}
          </div>

          <div
            className="grid gap-[2px] rounded-lg border border-slate-700 bg-slate-800/50 p-1"
            style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(24px, 32px))` }}
          >
            {grid.map((state, index) => (
              <button
                type="button"
                key={index}
                className={`flex h-8 w-8 items-center justify-center border border-slate-800 text-lg transition ${cellClass(state)}`}
                onPointerDown={(event) => {
                  event.preventDefault();
                  startAutoStroke(index);
                }}
                onPointerEnter={() => continueAutoStroke(index)}
              >
                {state === -1 ? '×' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
