import { Injectable, NotFoundException } from '@nestjs/common';
import type { SaveProgressDto } from './dto/save-progress.dto';
import type { ProgressResponseDto } from './dto/progress-response.dto';

export type ProgressEntry = ProgressResponseDto & { userId: string };

@Injectable()
export class ProgressService {
  private readonly storage = new Map<string, ProgressEntry>();

  saveProgress(
    userId: string,
    puzzleId: string,
    payload: SaveProgressDto,
  ): ProgressResponseDto {
    const entry: ProgressEntry = {
      userId,
      puzzleId,
      grid: payload.grid,
      mistakes: payload.mistakes,
      completed: payload.completed,
      updatedAt: new Date().toISOString(),
    };
    this.storage.set(this.composeKey(userId, puzzleId), entry);
    return entry;
  }

  getProgress(userId: string, puzzleId: string): ProgressResponseDto {
    const entry = this.storage.get(this.composeKey(userId, puzzleId));
    if (!entry) {
      throw new NotFoundException('Progress not found');
    }
    return entry;
  }

  private composeKey(userId: string, puzzleId: string) {
    return `${userId}:${puzzleId}`;
  }
}
