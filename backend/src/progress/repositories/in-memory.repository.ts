import type {
  ProgressRecord,
  ProgressRepository,
} from '../progress.repository';

export class InMemoryProgressRepository implements ProgressRepository {
  private readonly storage = new Map<string, ProgressRecord>();

  findOne(userId: string, puzzleId: string): Promise<ProgressRecord | null> {
    return Promise.resolve(
      this.storage.get(this.composeKey(userId, puzzleId)) ?? null,
    );
  }

  save(record: ProgressRecord): Promise<ProgressRecord> {
    this.storage.set(this.composeKey(record.userId, record.puzzleId), record);
    return Promise.resolve(record);
  }

  delete(userId: string, puzzleId: string): Promise<void> {
    this.storage.delete(this.composeKey(userId, puzzleId));
    return Promise.resolve();
  }

  private composeKey(userId: string, puzzleId: string) {
    return `${userId}:${puzzleId}`;
  }
}
