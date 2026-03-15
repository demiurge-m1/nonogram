import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ProgressResponseDto } from './dto/progress-response.dto';
import { SaveProgressDto } from './dto/save-progress.dto';
import { ProgressService } from './progress.service';

@ApiTags('Progress')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':puzzleId')
  @ApiOkResponse({ type: ProgressResponseDto })
  @ApiNotFoundResponse({ description: 'Progress not found' })
  async getProgress(@Req() req: Request, @Param('puzzleId') puzzleId: string): Promise<ProgressResponseDto> {
    return this.progressService.getProgress(this.requireUser(req), puzzleId);
  }

  @Post(':puzzleId')
  @ApiOkResponse({ type: ProgressResponseDto })
  async saveProgress(
    @Req() req: Request,
    @Param('puzzleId') puzzleId: string,
    @Body() payload: SaveProgressDto,
  ): Promise<ProgressResponseDto> {
    return this.progressService.saveProgress(this.requireUser(req), puzzleId, payload);
  }

  private requireUser(req: Request): string {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return req.user.userId;
  }
}
