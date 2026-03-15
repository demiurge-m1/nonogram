export default function DailyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <p className="text-sm uppercase tracking-wide text-slate-500">Daily challenge</p>
        <h1 className="text-3xl font-semibold text-white">Ежедневный пазл</h1>
        <p className="mt-2 text-sm text-slate-400">Реши сегодня и получи дополнительные токены подсказок.</p>

        <div className="mt-8 rounded-3xl border border-emerald-400/30 bg-emerald-500/5 p-6">
          <p className="text-sm text-emerald-200">15 марта</p>
          <h2 className="text-2xl font-semibold text-white">“Starfall” · 10×10</h2>
          <p className="mt-2 text-sm text-emerald-100">Награда: 2 Hint Tokens + 150 XP</p>
          <button className="mt-6 rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-emerald-950">
            Играть сейчас
          </button>
        </div>

        <div className="mt-10 space-y-4">
          <h3 className="text-lg font-semibold text-white">История</h3>
          {[1, 2, 3].map((day) => (
            <div key={day} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-sm text-slate-500">{14 - day} марта</p>
              <p className="text-base text-white">“Aurora” · 10×10 — {day === 1 ? 'Сделано ✅' : 'Пропущено'}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
