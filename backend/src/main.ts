import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3333);
  const host = configService.get<string>('host', '0.0.0.0');
  const allowedOrigins = configService.get<string[]>('allowedOrigins') ?? ['*'];
  const corsOrigin: boolean | string[] = allowedOrigins.includes('*')
    ? true
    : allowedOrigins;

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(port, host);
}
void bootstrap();
