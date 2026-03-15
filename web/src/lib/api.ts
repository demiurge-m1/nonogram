import type { PackDetail, PackSummary } from '@/types/packs';
import type { PuzzlePayload } from '@/types/puzzle';

const DEFAULT_API_BASE = 'http://localhost:3333';
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? DEFAULT_API_BASE).replace(/\/$/, '');

type ApiRequestOptions = RequestInit & {
  revalidate?: number;
};

type NextAwareRequestInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

async function request(path: string, options?: ApiRequestOptions) {
  const { revalidate, headers, ...rest } = options ?? {};
  const url = `${API_BASE}${path}`;
  const init: NextAwareRequestInit = {
    cache: revalidate ? 'force-cache' : 'no-store',
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(headers ?? {}),
    },
  };
  if (revalidate) {
    init.next = { revalidate };
  }
  const res = await fetch(url, init);
  return res;
}

export async function getPacks(): Promise<PackSummary[]> {
  const res = await request('/packs', { revalidate: 300 });
  if (!res.ok) {
    throw new Error('Failed to load packs');
  }
  return res.json();
}

export async function getPack(id: string): Promise<PackDetail | null> {
  const res = await request(`/packs/${id}`, { revalidate: 300 });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error('Failed to load pack');
  }
  return res.json();
}

export async function getPuzzle(id: string): Promise<PuzzlePayload | null> {
  const res = await request(`/puzzles/${id}`, { revalidate: 3600 });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error('Failed to load puzzle');
  }
  return res.json();
}

export async function getHealth() {
  const res = await request('/healthz');
  if (!res.ok) {
    throw new Error('Failed to load health status');
  }
  return res.json() as Promise<{ status: string; timestamp: string; commit: string }>;
}
