import type { ProgressResponseDto } from './dto/progress-response.dto';

export type ProgressRecord = ProgressResponseDto & { userId: string };

export interface ProgressRepository {
  findOne(userId: string, puzzleId: string): Promise<ProgressRecord | null>;
  save(record: ProgressRecord): Promise<ProgressRecord>;
  delete(userId: string, puzzleId: string): Promise<void>;
}

export const PROGRESS_REPOSITORY = Symbol('PROGRESS_REPOSITORY');
