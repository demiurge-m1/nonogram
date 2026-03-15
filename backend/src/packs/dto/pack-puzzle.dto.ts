import { ApiProperty } from '@nestjs/swagger';

export class PackPuzzleDto {
  @ApiProperty({ example: 's-1' })
  id!: string;

  @ApiProperty({ example: 'Smiley' })
  name!: string;

  @ApiProperty({ example: '5×5' })
  size!: string;

  @ApiProperty({ example: 'Easy', enum: ['Easy', 'Normal', 'Hard', 'Expert'] })
  difficulty!: 'Easy' | 'Normal' | 'Hard' | 'Expert';

  @ApiProperty({
    example: 'available',
    enum: ['locked', 'available', 'completed'],
  })
  status!: 'locked' | 'available' | 'completed';
}
