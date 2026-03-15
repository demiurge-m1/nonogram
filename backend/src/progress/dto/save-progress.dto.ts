import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, Min } from 'class-validator';

export class SaveProgressDto {
  @ApiProperty({ type: [Number], example: [0, 1, -1, 0] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  grid!: number[];

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  mistakes!: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  completed!: boolean;
}
