import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PuzzlesService } from './puzzles.service';
import { PuzzleDto } from './dto/puzzle.dto';

@ApiTags('Puzzles')
@Controller('puzzles')
export class PuzzlesController {
  constructor(private readonly puzzlesService: PuzzlesService) {}

  @Get(':id')
  @ApiOkResponse({ type: PuzzleDto })
  @ApiNotFoundResponse({ description: 'Puzzle not found' })
  findOne(@Param('id') id: string): PuzzleDto {
    return this.puzzlesService.findOne(id);
  }
}
