import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: '2026-03-15T10:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 'local' })
  commit!: string;
}
