export type PuzzleStatus = 'locked' | 'available' | 'completed';

export type PackSummary = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Normal' | 'Hard';
  badge: string;
  puzzleCount: number;
};

export type PackPuzzleSummary = {
  id: string;
  name: string;
  size: string;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert';
  status: PuzzleStatus;
};

export type PackDetail = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Normal' | 'Hard';
  badge: string;
  puzzles: PackPuzzleSummary[];
};
