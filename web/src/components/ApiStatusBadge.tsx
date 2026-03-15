import { getHealth } from '@/lib/api';

export async function ApiStatusBadge() {
  const health = await getHealth().catch(() => null);

  if (!health) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
        <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />
        Gateway offline
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
      <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
      Gateway online · {health.commit.slice(0, 7)}
    </span>
  );
}
