import { Injectable, NotFoundException } from '@nestjs/common';
import { PACKS, type Pack } from '../data/packs';

@Injectable()
export class PacksService {
  findAll(): Pack[] {
    return PACKS;
  }

  findOne(id: string): Pack {
    const pack = PACKS.find((item) => item.id === id);
    if (!pack) {
      throw new NotFoundException(`Pack ${id} not found`);
    }
    return pack;
  }
}
