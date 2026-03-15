import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { buildSwaggerConfig } from './swagger-config';

async function generateOpenApi() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, buildSwaggerConfig());
  const docsDir = join(process.cwd(), 'docs');
  mkdirSync(docsDir, { recursive: true });
  writeFileSync(
    join(docsDir, 'openapi.json'),
    JSON.stringify(document, null, 2),
  );
  await app.close();
}

void generateOpenApi();
