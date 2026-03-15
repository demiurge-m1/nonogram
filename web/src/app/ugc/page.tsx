const communityPuzzles = [
  { id: 'u-aurora', title: 'Aurora', author: '@pixelart', size: '10×10', solvable: true },
  { id: 'u-boba', title: 'Boba Tea', author: '@mochi', size: '15×15', solvable: false },
];

export default function UGCPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <p className="text-sm uppercase tracking-wide text-slate-500">Community</p>
        <h1 className="text-3xl font-semibold text-white">Редактор и пазлы сообщества</h1>
        <p className="mt-2 text-sm text-slate-400">Создавай свои рисунки, делись ссылкой и решай пазлы других игроков.</p>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm text-slate-500">Редактор</p>
          <h2 className="text-2xl font-semibold text-white">Нарисуй пазл онлайн</h2>
          <p className="mt-2 text-sm text-slate-400">После публикации мы покажем, решаем ли пазл, и выдадим ссылку.</p>
          <button className="mt-4 rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-950">
            Открыть редактор
          </button>
        </div>

        <section className="mt-10 space-y-3">
          <h3 className="text-lg font-semibold text-white">Популярное</h3>
          {communityPuzzles.map((puzzle) => (
            <div key={puzzle.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-sm text-slate-500">Автор: {puzzle.author}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-white">{puzzle.title}</p>
                  <p className="text-sm text-slate-400">{puzzle.size}</p>
                </div>
                <p
                  className={
                    puzzle.solvable
                      ? 'rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300'
                      : 'rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-300'
                  }
                >
                  {puzzle.solvable ? 'Можно решить' : 'Не решается'}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
