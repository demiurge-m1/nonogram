import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PacksService } from './packs.service';
import { PackDetailDto } from './dto/pack-detail.dto';
import { PackSummaryDto } from './dto/pack-summary.dto';

@ApiTags('Packs')
@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Get()
  @ApiOkResponse({ type: PackSummaryDto, isArray: true })
  findAll(): PackSummaryDto[] {
    return this.packsService.findAll().map((pack) => ({
      id: pack.id,
      title: pack.title,
      description: pack.description,
      difficulty: pack.difficulty,
      badge: pack.badge,
      puzzleCount: pack.puzzles.length,
    }));
  }

  @Get(':id')
  @ApiOkResponse({ type: PackDetailDto })
  @ApiNotFoundResponse({ description: 'Pack not found' })
  findOne(@Param('id') id: string): PackDetailDto {
    const pack = this.packsService.findOne(id);
    return {
      id: pack.id,
      title: pack.title,
      description: pack.description,
      difficulty: pack.difficulty,
      badge: pack.badge,
      puzzles: pack.puzzles,
    };
  }
}
