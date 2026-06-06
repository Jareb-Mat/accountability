import React from 'react';

export default function StreakCounter({ streak }) {
  return (
    <div className="flex items-baseline gap-6">
      <div>
        <span
          className="text-2xl font-semibold tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
        >
          {streak.current}
        </span>
        <span className="text-sm ml-2" style={{ color: 'var(--text-muted)' }}>
          day streak
        </span>
      </div>
      {streak.longest > 0 && (
        <span className="text-sm tabular-nums" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Best: {streak.longest}
        </span>
      )}
    </div>
  );
}
