import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({ example: 'guest_4e4f9b2d-1a0c-4e41-8b2d-7a96dd59d9e1' })
  userId!: string;

  @ApiProperty({ example: 'guest', enum: ['guest'] })
  kind!: 'guest';

  @ApiProperty({ example: '2026-03-15T11:30:00.000Z' })
  createdAt!: string;
}
