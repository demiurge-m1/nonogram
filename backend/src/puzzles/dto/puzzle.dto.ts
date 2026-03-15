import { ApiProperty } from '@nestjs/swagger';

export class PuzzleDto {
  @ApiProperty({ example: 's-1' })
  id!: string;

  @ApiProperty({ example: 'Smiley' })
  name!: string;

  @ApiProperty({ example: 5 })
  size!: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'array', items: { type: 'number' } },
    example: [[3], [1, 1]],
  })
  rows!: number[][];

  @ApiProperty({
    type: 'array',
    items: { type: 'array', items: { type: 'number' } },
    example: [[1], [4], [1, 1]],
  })
  cols!: number[][];

  @ApiProperty({
    type: 'array',
    items: { type: 'array', items: { type: 'number' } },
    example: [[0, 1, 1, 1, 0]],
  })
  solution!: number[][];
}
