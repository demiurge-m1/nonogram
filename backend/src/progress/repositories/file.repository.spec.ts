import { mkdtempSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FileProgressRepository } from './file.repository';
import type { ProgressRecord } from '../progress.repository';

describe('FileProgressRepository', () => {
  const createRepo = (filePath: string, ttlMs: number | null = null) =>
    new FileProgressRepository({ filePath, flushIntervalMs: 5, ttlMs });

  const createRecord = (
    overrides?: Partial<ProgressRecord>,
  ): ProgressRecord => ({
    userId: 'user',
    puzzleId: 'p-1',
    grid: [0, 1, -1],
    mistakes: 2,
    completed: false,
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  const createTempPath = () => {
    const dir = mkdtempSync(join(tmpdir(), 'progress-'));
    const filePath = join(dir, 'progress.json');
    return { dir, filePath };
  };

  it('persists records to disk and reloads them', async () => {
    const { dir, filePath } = createTempPath();
    const repo = createRepo(filePath);
    const record = createRecord();
    await repo.save(record);
    await repo.flushNow();

    const repo2 = createRepo(filePath);
    const loaded = await repo2.findOne(record.userId, record.puzzleId);
    expect(loaded).toMatchObject(record);

    await fs.rm(dir, { recursive: true, force: true });
  });

  it('drops expired records based on ttl', async () => {
    const { dir, filePath } = createTempPath();
    const oldRecord = createRecord({
      userId: 'u2',
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    });
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify([oldRecord], null, 2));

    const repo = createRepo(filePath, 24 * 60 * 60 * 1000); // 1 day
    const loaded = await repo.findOne(oldRecord.userId, oldRecord.puzzleId);
    expect(loaded).toBeNull();

    await fs.rm(dir, { recursive: true, force: true });
  });
});
