import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { PackDetail } from '@/types/packs';
import { getPack } from '@/lib/api';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PackPage({ params }: Props) {
  const { id } = await params;
  const pack: PackDetail | null = await getPack(id);

  if (!pack) {
    notFound();
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Готов к игре';
      case 'completed':
        return 'Сделано';
      default:
        return 'Заблокировано';
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-200">
          ← Все пакеты
        </Link>
        <header className="mt-6 flex items-center gap-4">
          <span className="text-4xl" aria-hidden>
            {pack.badge}
          </span>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">{pack.difficulty}</p>
            <h1 className="text-3xl font-semibold text-white">{pack.title}</h1>
            <p className="text-sm text-slate-400">{pack.description}</p>
          </div>
        </header>

        <section className="mt-8 space-y-3">
          {pack.puzzles.map((puzzle) => {
            const content = (
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 transition hover:border-slate-700">
                <div>
                  <p className="text-sm text-slate-500">{puzzle.size}</p>
                  <p className="text-lg font-medium text-white">{puzzle.name}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-slate-400">{puzzle.difficulty}</p>
                  <p
                    className={
                      puzzle.status === 'available'
                        ? 'text-emerald-300'
                        : puzzle.status === 'completed'
                          ? 'text-sky-300'
                          : 'text-slate-600'
                    }
                  >
                    {getStatusText(puzzle.status)}
                  </p>
                </div>
              </div>
            );

            if (puzzle.status === 'locked') {
              return <div key={puzzle.id}>{content}</div>;
            }

            return (
              <Link key={puzzle.id} href={`/play/${puzzle.id}`} className="block">
                {content}
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
