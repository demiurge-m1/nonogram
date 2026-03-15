import { DocumentBuilder } from '@nestjs/swagger';

export const buildSwaggerConfig = () =>
  new DocumentBuilder()
    .setTitle('Nonogram Gateway API')
    .setDescription(
      'Auth, packs, puzzles and health endpoints for the web client.',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Health')
    .addTag('Packs')
    .addTag('Progress')
    .addTag('Puzzles')
    .build();
