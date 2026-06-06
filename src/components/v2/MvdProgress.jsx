import React from 'react';

export default function MvdProgress({ mvdStatus }) {
  const { total, done, tasks } = mvdStatus;
  const met = total === 0 || done === total;

  if (total === 0) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-4">
        <div className="text-zinc-600 text-xs font-mono uppercase tracking-widest">
          MVD — no critical tasks set
        </div>
      </div>
    );
  }

  return (
    <div className={`border p-4 ${met ? 'bg-emerald-950/10 border-emerald-900/30' : 'bg-red-950/10 border-red-900/30'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
          Minimum Viable Day
        </span>
        <span className={`text-sm font-mono font-bold tabular-nums ${met ? 'text-emerald-400' : 'text-red-400'}`}>
          {done}/{total}
        </span>
      </div>
      <div className="space-y-1.5">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            <div className={`w-4 h-4 flex items-center justify-center border ${
              t.completed
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-zinc-300 dark:border-zinc-700'
            }`}>
              {t.completed && (
                <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="square" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm font-mono ${t.completed ? 'text-emerald-400 line-through opacity-60' : 'text-zinc-700 dark:text-zinc-300'}`}>
              {t.title}
            </span>
          </div>
        ))}
      </div>
      {met && (
        <div className="mt-3 text-xs font-mono text-emerald-500 uppercase tracking-wider">
          ✓ MVD Met — Day secured
        </div>
      )}
    </div>
  );
}
