import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { GuestAuthResponseDto } from './dto/guest-auth-response.dto';
import type { ProfileResponseDto } from './dto/profile-response.dto';

export type SessionPayload = {
  token: string;
  userId: string;
  createdAt: string;
};

@Injectable()
export class AuthService {
  private readonly sessions = new Map<string, SessionPayload>();

  createGuestSession(): GuestAuthResponseDto {
    const token = randomUUID();
    const userId = `guest_${randomUUID()}`;
    const session: SessionPayload = {
      token,
      userId,
      createdAt: new Date().toISOString(),
    };
    this.sessions.set(token, session);
    return { token, userId };
  }

  validateToken(token: string): SessionPayload {
    const session = this.sessions.get(token);
    if (!session) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return session;
  }

  getProfile(token: string): ProfileResponseDto {
    const session = this.validateToken(token);
    return {
      userId: session.userId,
      kind: 'guest',
      createdAt: session.createdAt,
    };
  }
}
