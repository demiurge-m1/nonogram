import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';
import type { OnModuleDestroy } from '@nestjs/common';
import type {
  ProgressRecord,
  ProgressRepository,
} from '../progress.repository';

export type FileProgressOptions = {
  filePath: string;
  flushIntervalMs: number;
  ttlMs?: number | null;
};

export class FileProgressRepository
  implements ProgressRepository, OnModuleDestroy
{
  private readonly storage = new Map<string, ProgressRecord>();
  private readonly ready: Promise<void>;
  private dirty = false;
  private flushHandle: NodeJS.Timeout | null = null;

  constructor(private readonly options: FileProgressOptions) {
    this.ready = this.loadFromDisk();
  }

  async findOne(
    userId: string,
    puzzleId: string,
  ): Promise<ProgressRecord | null> {
    await this.ready;
    return this.storage.get(this.composeKey(userId, puzzleId)) ?? null;
  }

  async save(record: ProgressRecord): Promise<ProgressRecord> {
    await this.ready;
    this.storage.set(this.composeKey(record.userId, record.puzzleId), record);
    this.dirty = true;
    this.scheduleFlush();
    return record;
  }

  async delete(userId: string, puzzleId: string): Promise<void> {
    await this.ready;
    if (this.storage.delete(this.composeKey(userId, puzzleId))) {
      this.dirty = true;
      this.scheduleFlush();
    }
  }

  async onModuleDestroy() {
    await this.flushToDisk();
    if (this.flushHandle) {
      clearTimeout(this.flushHandle);
      this.flushHandle = null;
    }
  }

  // For tests/manual flush
  async flushNow() {
    await this.ready;
    await this.flushToDisk(true);
  }

  private async loadFromDisk() {
    try {
      const raw = await fs.readFile(this.options.filePath, 'utf-8');
      const parsed = JSON.parse(raw) as ProgressRecord[];
      for (const record of parsed) {
        if (this.isExpired(record)) continue;
        this.storage.set(
          this.composeKey(record.userId, record.puzzleId),
          record,
        );
      }
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err?.code !== 'ENOENT') {
        console.warn('Failed to load progress store', error);
      }
      await this.ensureDir();
      await fs.writeFile(this.options.filePath, '[]', 'utf-8');
    }
    const removed = this.pruneExpired();
    if (removed) {
      await this.flushToDisk(true);
    }
  }

  private async flushToDisk(force = false) {
    if (!this.dirty && !force) {
      return;
    }
    this.pruneExpired();
    await this.ensureDir();
    const snapshot = Array.from(this.storage.values()).sort((a, b) =>
      a.updatedAt.localeCompare(b.updatedAt),
    );
    const payload = JSON.stringify(snapshot, null, 2);
    const tmpPath = `${this.options.filePath}.tmp`;
    await fs.writeFile(tmpPath, payload, 'utf-8');
    await fs.rename(tmpPath, this.options.filePath);
    this.dirty = false;
  }

  private composeKey(userId: string, puzzleId: string) {
    return `${userId}:${puzzleId}`;
  }

  private scheduleFlush() {
    if (this.flushHandle) return;
    this.flushHandle = setTimeout(() => {
      this.flushHandle = null;
      this.flushToDisk().catch((error) =>
        console.warn('Failed to flush progress store', error),
      );
    }, this.options.flushIntervalMs);
  }

  private pruneExpired() {
    if (!this.options.ttlMs || this.options.ttlMs <= 0) return false;
    const cutoff = Date.now() - this.options.ttlMs;
    let removed = false;
    for (const [key, record] of this.storage.entries()) {
      if (new Date(record.updatedAt).getTime() < cutoff) {
        this.storage.delete(key);
        removed = true;
      }
    }
    if (removed) {
      this.dirty = true;
    }
    return removed;
  }

  private isExpired(record: ProgressRecord) {
    if (!this.options.ttlMs || this.options.ttlMs <= 0) return false;
    return (
      new Date(record.updatedAt).getTime() < Date.now() - this.options.ttlMs
    );
  }

  private async ensureDir() {
    const dir = dirname(this.options.filePath);
    await fs.mkdir(dir, { recursive: true });
  }
}
