import { createGuestSession } from '@/lib/api';

const TOKEN_KEY = 'nonogram-guest-token';

export async function ensureGuestToken(): Promise<string> {
  if (typeof window === 'undefined') {
    return '';
  }
  const existing = window.localStorage.getItem(TOKEN_KEY);
  if (existing) {
    return existing;
  }
  const session = await createGuestSession();
  window.localStorage.setItem(TOKEN_KEY, session.token);
  return session.token;
}
