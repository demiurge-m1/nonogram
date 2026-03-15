'use client';

import { useEffect, useMemo, useState, startTransition } from 'react';
import type { PuzzleGrid } from '@/data/mockBoards';
import { solveWithWasm } from '@/lib/wasmSolver';

type CellState = 0 | 1 | -1; // пусто, заполнено, крестик

type Props = {
  puzzle: PuzzleGrid;
};

const cellClass = (state: CellState) => {
  if (state === 1) return 'bg-emerald-400 border-emerald-300 shadow-inner shadow-emerald-900/30';
  if (state === -1) return 'bg-slate-900 text-slate-500';
  return 'bg-slate-950 text-slate-800';
};

export function PuzzleClient({ puzzle }: Props) {
  const [mode, setMode] = useState<'fill' | 'cross'>('fill');
  const [grid, setGrid] = useState<CellState[]>(() => Array(puzzle.size * puzzle.size).fill(0));
  const [solverGrid, setSolverGrid] = useState<number[][] | null>(null);
  const [solverError, setSolverError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

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

  const toggleCell = (index: number) => {
    setGrid((prev) => {
      const next = [...prev];
      if (mode === 'fill') {
        next[index] = prev[index] === 1 ? 0 : 1;
      } else {
        next[index] = prev[index] === -1 ? 0 : -1;
      }
      return next;
    });
  };

  const resetGrid = () => setGrid(Array(puzzle.size * puzzle.size).fill(0));

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
          onClick={resetGrid}
          className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
        >
          Сбросить
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
        {/* Подсказки по строкам */}
        <div className="flex flex-col justify-end gap-1 text-right text-xs text-slate-400">
          {puzzle.rows.map((row, idx) => (
            <div key={idx} className="h-8 whitespace-nowrap">
              {row.join(' ')}
            </div>
          ))}
        </div>

        <div>
          {/* Подсказки по столбцам */}
          <div className="ml-8 grid" style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(24px, 32px))` }}>
            {puzzle.cols.map((col, idx) => (
              <div key={idx} className="mb-1 min-h-[50px] text-center text-xs text-slate-400">
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
                onClick={() => toggleCell(index)}
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
