import { Injectable, NotFoundException } from '@nestjs/common';
import { PUZZLES, type PuzzleGrid } from '../data/puzzles';

@Injectable()
export class PuzzlesService {
  findOne(id: string): PuzzleGrid {
    const puzzle = PUZZLES[id];
    if (!puzzle) {
      throw new NotFoundException(`Puzzle ${id} not found`);
    }
    return puzzle;
  }
}
