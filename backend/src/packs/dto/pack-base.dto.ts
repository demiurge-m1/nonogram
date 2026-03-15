import { ApiProperty } from '@nestjs/swagger';

export class PackBaseDto {
  @ApiProperty({ example: 'starter' })
  id!: string;

  @ApiProperty({ example: 'Starter Pack' })
  title!: string;

  @ApiProperty({ example: '5×5 и 10×10 пазлы для быстрого старта.' })
  description!: string;

  @ApiProperty({ example: 'Easy', enum: ['Easy', 'Normal', 'Hard'] })
  difficulty!: 'Easy' | 'Normal' | 'Hard';

  @ApiProperty({ example: '🌱' })
  badge!: string;
}
