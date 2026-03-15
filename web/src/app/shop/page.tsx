const premiumTiers = [
  {
    title: 'Месячная подписка',
    price: '$4.99/мес',
    perks: ['Без рекламы', 'x2 награды', 'Еженедельные премиум-паки'],
  },
  {
    title: 'Годовая подписка',
    price: '$29.99/год',
    perks: ['Всё из месячной', 'Эксклюзивные темы', 'Приоритетные ивенты'],
  },
];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <p className="text-sm uppercase tracking-wide text-slate-500">Store</p>
        <h1 className="text-3xl font-semibold text-white">Магазин</h1>
        <p className="mt-2 text-sm text-slate-400">Подписка, paки и подсказки — всё в одном месте.</p>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {premiumTiers.map((tier) => (
            <div key={tier.title} className="rounded-3xl border border-purple-400/30 bg-purple-500/5 p-6">
              <p className="text-sm text-purple-200">{tier.title}</p>
              <p className="text-2xl font-semibold text-white">{tier.price}</p>
              <ul className="mt-4 space-y-1 text-sm text-purple-100">
                {tier.perks.map((perk) => (
                  <li key={perk}>• {perk}</li>
                ))}
              </ul>
              <button className="mt-6 w-full rounded-full bg-purple-500 px-4 py-2 text-sm font-semibold text-purple-950">
                Оформить
              </button>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold text-white">Hint Tokens</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[{ label: '20 токенов', price: '$1.99' }, { label: '60 токенов', price: '$4.99' }, { label: '100 токенов', price: '$7.99' }].map((bundle) => (
              <div key={bundle.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                <p className="text-sm text-slate-400">{bundle.label}</p>
                <p className="text-xl text-white">{bundle.price}</p>
                <button className="mt-3 w-full rounded-full border border-slate-600 px-3 py-1 text-sm text-white">
                  Купить
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
