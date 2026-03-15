import { NextResponse } from 'next/server';
import { mockPacks } from '@/data/mockPacks';

type Params = Promise<{ id: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  const { id } = await params;
  const pack = mockPacks.find((item) => item.id === id);

  if (!pack) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(pack);
}
