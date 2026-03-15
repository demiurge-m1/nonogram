import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { AuthModule } from '../auth/auth.module';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { PROGRESS_REPOSITORY } from './progress.repository';
import { FileProgressRepository } from './repositories/file.repository';
import { InMemoryProgressRepository } from './repositories/in-memory.repository';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [ProgressController],
  providers: [
    ProgressService,
    {
      provide: PROGRESS_REPOSITORY,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const driver = (
          config.get<string>('PROGRESS_STORE') ?? 'file'
        ).toLowerCase();
        if (driver === 'memory') {
          return new InMemoryProgressRepository();
        }
        const flushMs = Number(config.get<string>('PROGRESS_FLUSH_MS')) || 1000;
        const ttlDays = Number(config.get<string>('PROGRESS_TTL_DAYS')) || 30;
        const filePath =
          config.get<string>('PROGRESS_STORE_PATH') ??
          join(process.cwd(), 'var', 'progress.json');
        return new FileProgressRepository({
          filePath,
          flushIntervalMs: flushMs,
          ttlMs: ttlDays > 0 ? ttlDays * 24 * 60 * 60 * 1000 : null,
        });
      },
    },
  ],
})
export class ProgressModule {}
