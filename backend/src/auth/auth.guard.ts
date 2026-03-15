import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService, type SessionPayload } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const headerValue = request.get('authorization') ?? undefined;
    const token = this.extractToken(headerValue);
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const session = this.authService.validateToken(token);
    request.user = session;
    return true;
  }

  private extractToken(header?: string): string | null {
    if (!header) return null;
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }
    return token;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionPayload;
  }
}
