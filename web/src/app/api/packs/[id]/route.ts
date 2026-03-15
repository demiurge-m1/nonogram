import { NextResponse } from 'next/server';
import { mockPacks } from '@/data/mockPacks';
import { sleep } from '@/utils/sleep';

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const url = new URL(request.url);
  const delay = Number(url.searchParams.get('delay') ?? 320);
  await sleep(Number.isFinite(delay) ? delay : 320);

  if (url.searchParams.get('fail') === '1') {
    return NextResponse.json({ message: 'Pack temporarily unavailable' }, { status: 503, headers: { 'Retry-After': '8' } });
  }

  const pack = mockPacks.find((item) => item.id === id);

  if (!pack) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(pack);
}
