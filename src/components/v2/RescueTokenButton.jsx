import React, { useState } from 'react';

export default function RescueTokenButton({ tokens, grade, onUse }) {
  const [confirming, setConfirming] = useState(false);
  const [used, setUsed] = useState(false);

  if (grade !== 'F' && grade !== 'D') return null;
  if (tokens <= 0) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 text-center">
        <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
          No rescue tokens remaining this month
        </div>
      </div>
    );
  }
  if (used) {
    return (
      <div className="bg-purple-950/10 border border-purple-900/30 p-4 text-center">
        <div className="text-purple-400 text-xs font-mono uppercase tracking-widest">
          ✓ Rescue token used — streak preserved
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    const ok = await onUse();
    if (ok) setUsed(true);
    setConfirming(false);
  };

  return (
    <div className="bg-purple-950/10 border border-purple-900/30 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-purple-400 text-xs font-mono uppercase tracking-widest mb-1">
            Rescue Token
          </div>
          <div className="text-zinc-400 text-sm">
            Use to preserve your streak on a failing day.
            <span className="text-zinc-500 ml-2">{tokens} remaining this month.</span>
          </div>
        </div>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500 hover:text-white transition-all"
          >
            Use Token
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">Confirm?</span>
            <button
              onClick={handleConfirm}
              className="px-3 py-1.5 text-xs font-mono uppercase bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="px-3 py-1.5 text-xs font-mono uppercase bg-transparent text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
