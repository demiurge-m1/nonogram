import type { PuzzleGrid } from '@/data/mockBoards';

type SolveResponse = {
  size: number;
  grid: number[][];
};

let wasmModulePromise: Promise<typeof import('../../../puzzle-core/pkg')> | null = null;

async function ensureWasm() {
  if (!wasmModulePromise) {
    wasmModulePromise = import('../../../puzzle-core/pkg');
  }
  const wasmModule = await wasmModulePromise;
  if (typeof wasmModule.default === 'function') {
    await wasmModule.default();
  }
  return wasmModule;
}

export async function solveWithWasm(puzzle: PuzzleGrid): Promise<SolveResponse> {
  const wasmModule = await ensureWasm();
  const result = wasmModule.solve_json(puzzle);
  return result as SolveResponse;
}
