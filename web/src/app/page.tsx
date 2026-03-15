import Link from 'next/link';
import { getBaseUrl } from '@/lib/baseUrl';

export type PackSummary = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  badge: string;
  puzzleCount: number;
};

async function fetchPacks(): Promise<PackSummary[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/packs`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to load packs');
  }
  return res.json();
}

export default async function Home() {
  const packs = await fetchPacks();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-400">Nonogram</p>
            <h1 className="text-3xl font-semibold text-white md:text-4xl">Головоломки на каждый день</h1>
            <p className="text-sm text-slate-400">Выбирай пак и решай пазлы офлайн и онлайн.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/daily"
              className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/20"
            >
              ⭐ Daily Puzzle
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500"
            >
              Магазин
            </Link>
            <Link
              href="/ugc"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500"
            >
              Комьюнити
            </Link>
            <Link
              href="/editor"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500"
            >
              Редактор
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {packs.map((pack) => (
            <Link
              key={pack.id}
              href={`/packs/${pack.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-slate-600 hover:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden>
                  {pack.badge}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{pack.difficulty}</p>
                  <h2 className="text-xl font-semibold text-white">{pack.title}</h2>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-400">{pack.description}</p>
              <p className="mt-6 text-sm text-slate-500">{pack.puzzleCount} пазлов · нажми, чтобы продолжить</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
