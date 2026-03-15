import { ApiProperty } from '@nestjs/swagger';

export class ProgressResponseDto {
  @ApiProperty({ example: 's-1' })
  puzzleId!: string;

  @ApiProperty({ type: [Number], example: [0, 1, -1, 0] })
  grid!: number[];

  @ApiProperty({ example: 0 })
  mistakes!: number;

  @ApiProperty({ example: false })
  completed!: boolean;

  @ApiProperty({ example: '2026-03-15T11:55:00.000Z' })
  updatedAt!: string;
}
