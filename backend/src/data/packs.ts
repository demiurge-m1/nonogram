export type PuzzleStatus = 'locked' | 'available' | 'completed';

export type PuzzleSummary = {
  id: string;
  name: string;
  size: string;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert';
  status: PuzzleStatus;
};

export type Pack = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Normal' | 'Hard';
  badge: string;
  puzzles: PuzzleSummary[];
};

export const PACKS: Pack[] = [
  {
    id: 'starter',
    title: 'Starter Pack',
    description: '5×5 и 10×10 пазлы для быстрого старта.',
    difficulty: 'Easy',
    badge: '🌱',
    puzzles: [
      {
        id: 's-1',
        name: 'Smiley',
        size: '5×5',
        difficulty: 'Easy',
        status: 'completed',
      },
      {
        id: 's-2',
        name: 'Heart',
        size: '5×5',
        difficulty: 'Easy',
        status: 'available',
      },
      {
        id: 's-3',
        name: 'Sprout',
        size: '10×10',
        difficulty: 'Normal',
        status: 'available',
      },
      {
        id: 's-4',
        name: 'Wave',
        size: '10×10',
        difficulty: 'Normal',
        status: 'locked',
      },
    ],
  },
  {
    id: 'cozy-camp',
    title: 'Cozy Camp',
    description: 'Тёплые пиксельные рисунки для вечерних сессий.',
    difficulty: 'Normal',
    badge: '🔥',
    puzzles: [
      {
        id: 'c-1',
        name: 'Tent',
        size: '10×10',
        difficulty: 'Normal',
        status: 'completed',
      },
      {
        id: 'c-2',
        name: 'Campfire',
        size: '10×10',
        difficulty: 'Normal',
        status: 'available',
      },
      {
        id: 'c-3',
        name: 'Lantern',
        size: '12×12',
        difficulty: 'Hard',
        status: 'locked',
      },
      {
        id: 'c-4',
        name: 'Hammock',
        size: '15×15',
        difficulty: 'Hard',
        status: 'locked',
      },
    ],
  },
  {
    id: 'master-lines',
    title: 'Master Lines',
    description: 'Испытание для настоящих фанатов нонограмм.',
    difficulty: 'Hard',
    badge: '✨',
    puzzles: [
      {
        id: 'm-1',
        name: 'Orchid',
        size: '15×15',
        difficulty: 'Hard',
        status: 'available',
      },
      {
        id: 'm-2',
        name: 'Origami',
        size: '15×15',
        difficulty: 'Expert',
        status: 'locked',
      },
      {
        id: 'm-3',
        name: 'Koi',
        size: '15×15',
        difficulty: 'Expert',
        status: 'locked',
      },
    ],
  },
  {
    id: 'pixel-pets',
    title: 'Pixel Pets',
    description: 'Котики, лисы и другие звери в чёрно-белых пикселях.',
    difficulty: 'Normal',
    badge: '🐾',
    puzzles: [
      {
        id: 'p-1',
        name: 'Cat',
        size: '10×10',
        difficulty: 'Normal',
        status: 'available',
      },
      {
        id: 'p-2',
        name: 'Fox',
        size: '15×15',
        difficulty: 'Hard',
        status: 'locked',
      },
      {
        id: 'p-3',
        name: 'Whale',
        size: '15×15',
        difficulty: 'Hard',
        status: 'locked',
      },
    ],
  },
  {
    id: 'daily-breeze',
    title: 'Daily Breeze',
    description: 'Мини-пазлы для ежедневной разминки и наград.',
    difficulty: 'Easy',
    badge: '🌀',
    puzzles: [
      {
        id: 'd-1',
        name: 'Star Burst',
        size: '7×7',
        difficulty: 'Easy',
        status: 'available',
      },
      {
        id: 'd-2',
        name: 'Sunrise',
        size: '10×10',
        difficulty: 'Normal',
        status: 'locked',
      },
    ],
  },
];
