export type PuzzlePayload = {
  id: string;
  name: string;
  size: number;
  rows: number[][];
  cols: number[][];
  solution: number[][];
};
