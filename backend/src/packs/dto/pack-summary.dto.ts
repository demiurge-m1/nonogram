import { ApiProperty } from '@nestjs/swagger';
import { PackBaseDto } from './pack-base.dto';

export class PackSummaryDto extends PackBaseDto {
  @ApiProperty({ example: 3 })
  puzzleCount!: number;
}
