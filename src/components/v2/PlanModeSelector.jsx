import React from 'react';

const MODES = [
  {
    id: 'full',
    label: 'Full Plan',
    desc: 'Every task scheduled with detail',
  },
  {
    id: 'quick',
    label: 'Quick',
    desc: '1–3 key things that must happen',
  },
  {
    id: 'auto',
    label: 'Auto',
    desc: 'Auto-fill from classes + recurring tasks',
  },
];

export default function PlanModeSelector({ mode, onChange, disabled }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => !disabled && onChange(m.id)}
          disabled={disabled}
          className={`p-3 border text-left transition-all ${
            mode === m.id
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800'
              : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <div className="text-xs font-mono uppercase tracking-wider font-bold mb-1">
            {m.label}
          </div>
          <div className={`text-xs leading-snug ${mode === m.id ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-500 dark:text-zinc-600'}`}>
            {m.desc}
          </div>
        </button>
      ))}
    </div>
  );
}
