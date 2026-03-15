import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ProgressResponseDto } from './dto/progress-response.dto';
import type { SaveProgressDto } from './dto/save-progress.dto';
import {
  PROGRESS_REPOSITORY,
  type ProgressRecord,
  type ProgressRepository,
} from './progress.repository';

@Injectable()
export class ProgressService {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly repository: ProgressRepository,
  ) {}

  async saveProgress(
    userId: string,
    puzzleId: string,
    payload: SaveProgressDto,
  ): Promise<ProgressResponseDto> {
    const entry: ProgressRecord = {
      userId,
      puzzleId,
      grid: payload.grid,
      mistakes: payload.mistakes,
      completed: payload.completed,
      updatedAt: new Date().toISOString(),
    };
    await this.repository.save(entry);
    return this.stripUser(entry);
  }

  async getProgress(
    userId: string,
    puzzleId: string,
  ): Promise<ProgressResponseDto> {
    const entry = await this.repository.findOne(userId, puzzleId);
    if (!entry) {
      throw new NotFoundException('Progress not found');
    }
    return this.stripUser(entry);
  }

  private stripUser(record: ProgressRecord): ProgressResponseDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...rest } = record;
    return rest;
  }
}
