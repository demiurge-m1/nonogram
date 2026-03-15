import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { configValidationSchema } from './config/validation';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PacksModule } from './packs/packs.module';
import { ProgressModule } from './progress/progress.module';
import { PuzzlesModule } from './puzzles/puzzles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    HealthModule,
    PacksModule,
    ProgressModule,
    PuzzlesModule,
  ],
})
export class AppModule {}
