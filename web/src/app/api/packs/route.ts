import { NextResponse } from 'next/server';
import { mockPacks } from '@/data/mockPacks';
import { sleep } from '@/utils/sleep';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const delay = Number(url.searchParams.get('delay') ?? 450);
  await sleep(Number.isFinite(delay) ? delay : 450);

  if (url.searchParams.get('fail') === '1') {
    return NextResponse.json({ message: 'Service temporarily unavailable' }, { status: 503, headers: { 'Retry-After': '5' } });
  }

  return NextResponse.json(
    mockPacks.map((pack) => ({
      id: pack.id,
      title: pack.title,
      description: pack.description,
      difficulty: pack.difficulty,
      badge: pack.badge,
      puzzleCount: pack.puzzles.length,
    })),
  );
}
