import init, { solve_json } from '../pkg/puzzle_core';

type PuzzleInput = {
  name: string;
  size: number;
  rows: number[][];
  cols: number[][];
  solution?: number[][];
};

type SolveResult = {
  size: number;
  grid: number[][];
};

let initialized = false;

export async function solvePuzzle(puzzle: PuzzleInput): Promise<SolveResult> {
  if (!initialized) {
    await init();
    initialized = true;
  }
  return solve_json(puzzle) as SolveResult;
}
