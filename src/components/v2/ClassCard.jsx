import React from 'react';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ClassCard({ cls, attendance, onAttend, onSkip, showAttendance = true }) {
  const att = attendance?.[cls.id];
  const attended = att?.attended;
  const skipped  = att?.skipped;
  const unmarked = !attended && !skipped;

  return (
    <div className={`border p-4 transition-colors ${
      attended ? 'bg-emerald-950/10 border-emerald-900/30' :
      skipped  ? 'bg-red-950/10 border-red-900/30' :
                 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-zinc-900 dark:text-white truncate">{cls.name}</span>
            {cls.is_critical && (
              <span className="shrink-0 px-1.5 py-0.5 text-xs font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                CRITICAL
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
            {cls.time && <span>{cls.time}</span>}
            {cls.location && <span>{cls.location}</span>}
          </div>
          <div className="flex gap-1 mt-2">
            {ALL_DAYS.map((day) => (
              <span
                key={day}
                className={`text-xs font-mono px-1.5 py-0.5 ${
                  cls.days?.includes(day)
                    ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
                    : 'text-zinc-700 dark:text-zinc-400'
                }`}
              >
                {day[0]}
              </span>
            ))}
          </div>
        </div>

        {showAttendance && (
          <div className="shrink-0 flex flex-col items-end gap-2">
            {unmarked && (
              <div className="flex gap-2">
                <button
                  onClick={() => onAttend(cls.id)}
                  className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all"
                >
                  Attended
                </button>
                <button
                  onClick={() => onSkip(cls.id)}
                  className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-transparent text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-red-500/50 hover:text-red-500 transition-all"
                >
                  Skipped
                </button>
              </div>
            )}
            {attended && (
              <span className="text-xs font-mono text-emerald-500 uppercase tracking-wider">
                ✓ Attended
              </span>
            )}
            {skipped && (
              <span className="text-xs font-mono text-red-500 uppercase tracking-wider">
                ✗ Skipped{cls.is_critical ? ' — MVD hit' : ''}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
