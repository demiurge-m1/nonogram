import { EditorClient } from '@/components/EditorClient';

export default function EditorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-12">
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-500">UGC Editor</p>
          <h1 className="text-3xl font-semibold text-white">Нарисуй свой пазл</h1>
          <p className="text-sm text-slate-400">Прокрашивай клетки, проверяй solver’ом и копируй JSON для backend.</p>
        </div>
        <EditorClient />
      </div>
    </main>
  );
}
