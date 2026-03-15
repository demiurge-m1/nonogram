import { DocumentBuilder } from '@nestjs/swagger';

export const buildSwaggerConfig = () =>
  new DocumentBuilder()
    .setTitle('Nonogram Gateway API')
    .setDescription('Packs, puzzles and health endpoints for the web client.')
    .setVersion('0.1.0')
    .addTag('Health')
    .addTag('Packs')
    .addTag('Puzzles')
    .build();
