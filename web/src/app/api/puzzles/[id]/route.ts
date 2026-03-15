import { NextResponse } from 'next/server';
import { mockBoards } from '@/data/mockBoards';

type Params = Promise<{ id: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  const { id } = await params;
  const puzzle = mockBoards[id];

  if (!puzzle) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(puzzle);
}
