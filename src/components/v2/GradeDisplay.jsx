import React from 'react';

const GRADE_CONFIG = {
  A: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Excellent' },
  B: { color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    label: 'Good' },
  C: { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   label: 'Passing' },
  D: { color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  label: 'Failing' },
  F: { color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30',     label: 'Failed' },
};

export default function GradeDisplay({ grade, pct, isRescueDay }) {
  const cfg = grade ? GRADE_CONFIG[grade] : null;

  return (
    <div className="flex items-center gap-6">
      <div className={`flex items-center justify-center w-28 h-28 border-2 ${
        cfg ? `${cfg.bg} ${cfg.border}` : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800'
      }`}>
        <span className={`font-display text-7xl leading-none ${cfg ? cfg.color : 'text-zinc-400 dark:text-zinc-700'}`}>
          {grade || '—'}
        </span>
      </div>

      <div>
        <div className={`text-xs font-mono uppercase tracking-widest mb-1 ${cfg ? cfg.color : 'text-zinc-600'}`}>
          {cfg ? cfg.label : 'No data'}
          {isRescueDay && (
            <span className="ml-2 px-1.5 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs">
              RESCUE
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-display text-5xl leading-none tabular-nums ${cfg ? cfg.color : 'text-zinc-700'}`}>
            {pct}
          </span>
          <span className="text-zinc-600 text-xl font-mono">%</span>
        </div>
        <div className="text-zinc-600 text-xs font-mono mt-1">complete</div>
      </div>
    </div>
  );
}
