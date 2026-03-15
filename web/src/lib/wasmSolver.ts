import type { PuzzleGrid } from '@/data/mockBoards';

type SolveResponse = {
  size: number;
  grid: number[][];
};

let wasmModulePromise: Promise<typeof import('../wasm/pkg')> | null = null;

async function ensureWasm() {
  if (!wasmModulePromise) {
    wasmModulePromise = import('../wasm/pkg');
  }
  const wasmModule = await wasmModulePromise;
  const maybeInit = (wasmModule as { default?: (input?: unknown) => Promise<unknown> }).default;
  if (typeof maybeInit === 'function') {
    await maybeInit();
  }
  return wasmModule;
}

export async function solveWithWasm(puzzle: PuzzleGrid): Promise<SolveResponse> {
  const wasmModule = await ensureWasm();
  const result = wasmModule.solve_json(puzzle as unknown as Record<string, unknown>);
  return result as SolveResponse;
}
