import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get(AuthService);
  });

  it('should create guest session', () => {
    const session = service.createGuestSession();
    expect(session.token).toBeDefined();
    expect(session.userId).toContain('guest_');
  });
});
