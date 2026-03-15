import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { GuestAuthResponseDto } from './dto/guest-auth-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create guest session' })
  @ApiCreatedResponse({ type: GuestAuthResponseDto })
  createGuest(): GuestAuthResponseDto {
    return this.authService.createGuestSession();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileResponseDto })
  getProfile(@Req() req: Request): ProfileResponseDto {
    if (!req.user) {
      throw new UnauthorizedException('Missing session');
    }
    return {
      userId: req.user.userId,
      kind: 'guest',
      createdAt: req.user.createdAt,
    };
  }
}
