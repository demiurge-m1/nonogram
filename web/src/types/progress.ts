export type ProgressPayload = {
  puzzleId: string;
  grid: number[];
  mistakes: number;
  completed: boolean;
  updatedAt: string;
};

export type SaveProgressPayload = {
  grid: number[];
  mistakes: number;
  completed: boolean;
};
