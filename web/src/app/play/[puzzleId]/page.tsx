import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { PuzzleGrid } from '@/data/mockBoards';
import { getBaseUrl } from '@/lib/baseUrl';
import { PuzzleClient } from '@/components/PuzzleClient';

type Props = {
  params: Promise<{ puzzleId: string }>;
};

async function fetchPuzzle(id: string): Promise<PuzzleGrid | null> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/puzzles/${id}`, { cache: 'no-store' });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error('Failed to load puzzle');
  }
  return res.json();
}

export default async function PlayPage({ params }: Props) {
  const { puzzleId } = await params;
  const puzzle = await fetchPuzzle(puzzleId);

  if (!puzzle) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-200">
          ← Назад к пакетам
        </Link>
        <header className="mt-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Пазл #{puzzle.id}</p>
          <h1 className="text-3xl font-semibold text-white">{puzzle.name}</h1>
          <p className="text-sm text-slate-400">Размер: {puzzle.size}×{puzzle.size}</p>
        </header>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <PuzzleClient puzzle={puzzle} />
        </div>
      </div>
    </main>
  );
}
