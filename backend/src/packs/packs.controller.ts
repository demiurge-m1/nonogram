import { Controller, Get, Param } from '@nestjs/common';
import { PacksService } from './packs.service';

@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Get()
  findAll() {
    return this.packsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packsService.findOne(id);
  }
}
