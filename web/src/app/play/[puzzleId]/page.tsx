import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { PuzzlePayload } from '@/types/puzzle';
import { getPuzzle } from '@/lib/api';
import { PuzzleClient } from '@/components/PuzzleClient';

type Props = {
  params: Promise<{ puzzleId: string }>;
};

export default async function PlayPage({ params }: Props) {
  const { puzzleId } = await params;
  const puzzle: PuzzlePayload | null = await getPuzzle(puzzleId);

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
