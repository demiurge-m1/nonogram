import { ApiProperty } from '@nestjs/swagger';
import { PackBaseDto } from './pack-base.dto';
import { PackPuzzleDto } from './pack-puzzle.dto';

export class PackDetailDto extends PackBaseDto {
  @ApiProperty({ type: [PackPuzzleDto] })
  puzzles!: PackPuzzleDto[];
}
