import { ApiProperty } from '@nestjs/swagger';

export class GuestAuthResponseDto {
  @ApiProperty({ example: '3f84f0e0-3d2a-4dd7-9c1b-5f8a1a6b4c62' })
  token!: string;

  @ApiProperty({ example: 'guest_4e4f9b2d-1a0c-4e41-8b2d-7a96dd59d9e1' })
  userId!: string;
}
