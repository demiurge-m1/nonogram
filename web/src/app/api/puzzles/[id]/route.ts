import { NextResponse } from 'next/server';
import { mockBoards } from '@/data/mockBoards';
import { sleep } from '@/utils/sleep';

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const url = new URL(request.url);
  const delay = Number(url.searchParams.get('delay') ?? 380);
  await sleep(Number.isFinite(delay) ? delay : 380);

  if (url.searchParams.get('fail') === '1') {
    return NextResponse.json({ message: 'Puzzle check failed' }, { status: 503, headers: { 'Retry-After': '10' } });
  }

  const puzzle = mockBoards[id];

  if (!puzzle) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(puzzle);
}
