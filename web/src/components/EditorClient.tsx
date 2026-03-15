'use client';

import { useEffect, useMemo, useState, startTransition } from 'react';
import { solveWithWasm } from '@/lib/wasmSolver';
import type { PuzzleGrid } from '@/data/mockBoards';

const SIZE = 15;
const STORAGE_KEY = 'nonogram-ugc-draft';

type Cell = 0 | 1;

type SolverState = 'idle' | 'checking' | 'ok' | 'error';

const createEmptyGrid = () => Array<Cell>(SIZE * SIZE).fill(0) as Cell[];

const chunkGrid = (cells: Cell[]) => {
  return Array.from({ length: SIZE }, (_, row) => cells.slice(row * SIZE, (row + 1) * SIZE));
};

const buildHints = (matrix: number[][]) => {
  return matrix.map((line) => {
    const hints: number[] = [];
    let count = 0;
    line.forEach((cell) => {
      if (cell === 1) {
        count += 1;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    });
    if (count > 0) hints.push(count);
    return hints.length ? hints : [0];
  });
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0400-\u04FF]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'ugc-draft';

export function EditorClient() {
  const [grid, setGrid] = useState<Cell[]>(createEmptyGrid);
  const [tool, setTool] = useState<'fill' | 'erase'>('fill');
  const [isDragging, setIsDragging] = useState(false);
  const [meta, setMeta] = useState({ name: '', author: '' });
  const [status, setStatus] = useState<{ state: SolverState; message?: string }>({ state: 'idle' });
  const [jsonPreview, setJsonPreview] = useState('');
  const [hasHydrated, setHasHydrated] = useState(false);

  const matrix = useMemo(() => chunkGrid(grid), [grid]);
  const rowHints = useMemo(() => buildHints(matrix), [matrix]);
  const colHints = useMemo(() => buildHints(matrix[0].map((_, col) => matrix.map((row) => row[col]))), [matrix]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { grid: Cell[]; meta: { name: string; author: string } };
        startTransition(() => {
          if (Array.isArray(parsed.grid) && parsed.grid.length === SIZE * SIZE) {
            setGrid(parsed.grid as Cell[]);
          }
          if (parsed.meta) {
            setMeta(parsed.meta);
          }
        });
      } catch (err) {
        console.warn('Failed to load editor draft', err);
      }
    }
    startTransition(() => setHasHydrated(true));
  }, []);

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ grid, meta }));
  }, [grid, meta, hasHydrated]);

  const handleCell = (index: number, value: Cell) => {
    setGrid((prev) => {
      if (prev[index] === value) return prev;
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleVerify = async () => {
    if (!grid.some((cell) => cell === 1)) {
      setStatus({ state: 'error', message: 'Нарисуйте хоть что-то перед проверкой' });
      return;
    }
    setStatus({ state: 'checking' });
    const solution = matrix;
    const puzzle: PuzzleGrid = {
      id: 'ugc-preview',
      name: meta.name || 'Untitled',
      size: SIZE,
      rows: rowHints,
      cols: colHints,
      solution,
    };

    const basePayload = {
      id: `ugc-${Date.now()}`,
      slug: slugify(meta.name),
      size: SIZE,
      rows: rowHints,
      cols: colHints,
      cells: solution,
      author: meta.author || 'anonymous',
      createdAt: new Date().toISOString(),
    };

    try {
      const solved = await solveWithWasm(puzzle);
      const matches = JSON.stringify(solved.grid) === JSON.stringify(solution);
      setStatus({ state: matches ? 'ok' : 'error', message: matches ? 'Solver подтвердил пазл' : 'Solver нашёл другое решение' });
      setJsonPreview(JSON.stringify({ ...basePayload, solvable: matches }, null, 2));
    } catch (error) {
      console.error(error);
      setStatus({ state: 'error', message: 'Solver не смог подтвердить пазл (скорее всего несколько решений)' });
      setJsonPreview(JSON.stringify({ ...basePayload, solvable: false }, null, 2));
    }
  };

  const copyJson = async () => {
    if (!jsonPreview) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(jsonPreview);
      setStatus({ state: 'ok', message: 'JSON скопирован в буфер' });
    }
  };

  const clearGrid = () => {
    setGrid(createEmptyGrid());
    setStatus({ state: 'idle' });
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setTool('fill')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${tool === 'fill' ? 'bg-emerald-500 text-emerald-950' : 'bg-slate-800 text-slate-200'}`}
        >
          ✏️ Закрашивать
        </button>
        <button
          type="button"
          onClick={() => setTool('erase')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${tool === 'erase' ? 'bg-emerald-500 text-emerald-950' : 'bg-slate-800 text-slate-200'}`}
        >
          🧼 Стирать
        </button>
        <button type="button" onClick={clearGrid} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500">
          Очистить
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[max-content_1fr]">
        <div className="space-y-2 text-sm text-slate-400">
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-slate-500">Название</span>
            <input
              value={meta.name}
              onChange={(e) => setMeta((prev) => ({ ...prev, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
              placeholder="Pixel Bloom"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wide text-slate-500">Автор</span>
            <input
              value={meta.author}
              onChange={(e) => setMeta((prev) => ({ ...prev, author: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
              placeholder="@maker"
            />
          </label>
          <button
            type="button"
            onClick={handleVerify}
            className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
          >
            Проверить & сформировать JSON
          </button>
          {status.state !== 'idle' && (
            <div
              className={`rounded-lg border px-3 py-2 text-xs ${
                status.state === 'ok'
                  ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-200'
                  : status.state === 'checking'
                    ? 'border-sky-500/40 bg-sky-500/5 text-sky-200'
                    : 'border-amber-500/40 bg-amber-500/5 text-amber-200'
              }`}
            >
              {status.state === 'checking' ? 'Проверяем…' : status.message}
            </div>
          )}
          {jsonPreview && (
            <button
              type="button"
              onClick={copyJson}
              className="w-full rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-slate-400"
            >
              Копировать JSON
            </button>
          )}
        </div>

        <div className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex gap-2 text-xs text-slate-500">
            {colHints.map((col, idx) => (
              <div key={`col-${idx}`} className="w-6 whitespace-pre-line text-center">
                {col.join('\n')}
              </div>
            ))}
          </div>
          <div className="flex">
            <div className="flex flex-col text-right text-xs text-slate-500">
              {rowHints.map((row, idx) => (
                <div key={`row-hint-${idx}`} className="h-6 pr-2">
                  {row.join(' ') || '0'}
                </div>
              ))}
            </div>
            <div
              className="grid gap-[1px] border border-slate-700 bg-slate-900"
              style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(20px, 24px))` }}
            >
              {grid.map((value, index) => (
                <button
                  key={index}
                  className={`h-6 w-6 border border-slate-800 transition ${value === 1 ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-700'}`}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                    handleCell(index, tool === 'fill' ? 1 : 0);
                  }}
                  onPointerEnter={() => {
                    if (!isDragging) return;
                    handleCell(index, tool === 'fill' ? 1 : 0);
                  }}
                  onPointerUp={() => setIsDragging(false)}
                  onPointerLeave={() => setIsDragging(false)}
                >
                  {value === 1 ? '■' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {jsonPreview && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300">
          <p className="mb-2 font-semibold text-slate-100">UGC payload</p>
          <pre className="overflow-auto text-[11px] leading-relaxed">{jsonPreview}</pre>
        </div>
      )}
    </section>
  );
}
