import { Controller, Get, Param } from '@nestjs/common';
import { PuzzlesService } from './puzzles.service';

@Controller('puzzles')
export class PuzzlesController {
  constructor(private readonly puzzlesService: PuzzlesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puzzlesService.findOne(id);
  }
}
