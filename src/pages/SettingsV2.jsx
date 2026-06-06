import React, { useState, useEffect } from 'react';
import { useV2 } from '../context/V2Context';
import ClockV2 from '../components/v2/ClockV2';

export default function SettingsV2() {
  const { loading, profile, saveProfile } = useV2();

  const [mvdInputs, setMvdInputs] = useState(['', '', '']);
  const [wakeTime, setWakeTime]   = useState('');
  const [deadline, setDeadline]   = useState(30);
  const [saved, setSaved]         = useState(false);

  useEffect(() => {
    if (!loading) {
      const tasks = profile.mvd_tasks || [];
      setMvdInputs([tasks[0] || '', tasks[1] || '', tasks[2] || '']);
      setWakeTime(profile.wake_time || '');
      setDeadline(profile.wake_deadline_minutes ?? 30);
    }
  }, [loading, profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-500 font-mono text-sm tracking-wider">LOADING...</div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    const mvd_tasks = mvdInputs.map((t) => t.trim()).filter(Boolean);
    await saveProfile({ mvd_tasks, wake_time: wakeTime, wake_deadline_minutes: Number(deadline) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tokens = profile.rescue_tokens ?? 3;

  return (
    <div className="min-h-screen animate-fadeIn">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10 divider-line pb-8">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-2">V2 Configuration</div>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-5xl md:text-6xl leading-none">Settings</h1>
            <ClockV2 />
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-10">

          {/* MVD Tasks */}
          <section>
            <div className="mb-4">
              <h2 className="text-zinc-900 dark:text-white text-sm font-semibold uppercase tracking-wider mb-1">
                Minimum Viable Day (MVD)
              </h2>
              <p className="text-zinc-500 text-sm">
                Define 1–3 tasks that MUST be completed for the day to count.
                Failing any one of these earns an F regardless of overall completion.
              </p>
            </div>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-zinc-600 text-xs font-mono w-4">{i + 1}.</span>
                  <input
                    type="text"
                    value={mvdInputs[i]}
                    onChange={(e) => {
                      const next = [...mvdInputs];
                      next[i] = e.target.value;
                      setMvdInputs(next);
                    }}
                    placeholder={
                      i === 0 ? 'e.g. Attend every class'
                      : i === 1 ? 'e.g. Complete study block'
                      : 'Optional third task'
                    }
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-500 dark:focus:border-zinc-500 focus:outline-none rounded px-3 py-2 transition-colors"
                  />
                </div>
              ))}
            </div>
            <p className="text-zinc-600 text-xs mt-2">
              Leave blank to use fewer than 3. Tasks matching these titles in your plan are auto-marked MVD.
            </p>
          </section>

          {/* Wake Time */}
          <section>
            <div className="mb-4">
              <h2 className="text-zinc-900 dark:text-white text-sm font-semibold uppercase tracking-wider mb-1">
                Wake-Up Time
              </h2>
              <p className="text-zinc-500 text-sm">
                Set your target wake time. TodayV2 shows a confirmation button while the window is open.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-500 text-xs font-mono uppercase tracking-widest block mb-2">
                  Wake Target
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-500 dark:focus:border-zinc-500 focus:outline-none rounded px-3 py-2 font-mono text-sm transition-colors"
                />
              </div>
              <div>
                <label className="text-zinc-500 text-xs font-mono uppercase tracking-widest block mb-2">
                  Window (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-500 dark:focus:border-zinc-500 focus:outline-none rounded px-3 py-2 font-mono text-sm transition-colors"
                />
              </div>
            </div>
            <p className="text-zinc-500 text-xs mt-2">
              {wakeTime
                ? `Button is green from ${wakeTime} for ${deadline} minutes. After that it turns red.`
                : 'No wake time set — confirmation banner will not appear.'}
            </p>
          </section>

          {/* Rescue Tokens */}
          <section>
            <div className="mb-4">
              <h2 className="text-zinc-900 dark:text-white text-sm font-semibold uppercase tracking-wider mb-1">
                Rescue Tokens
              </h2>
              <p className="text-zinc-500 text-sm">
                Auto-reset to 3 on the 1st of each month. Use on a failing day to preserve your streak.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-4">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 flex items-center justify-center border text-xs font-mono ${
                      i < tokens
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                        : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-zinc-400 dark:text-zinc-700'
                    }`}
                  >
                    {i < tokens ? '◉' : '○'}
                  </div>
                ))}
              </div>
              <div className="text-sm text-zinc-400">
                <span className="text-zinc-900 dark:text-white font-medium">{tokens}</span> of 3 remaining this month
              </div>
            </div>
          </section>

          {/* Grade Scale Reference */}
          <section>
            <div className="mb-4">
              <h2 className="text-zinc-900 dark:text-white text-sm font-semibold uppercase tracking-wider mb-1">
                Grade Scale
              </h2>
            </div>
            <div className="space-y-1">
              {[
                ['A', '90–100%', 'MVD met', 'text-emerald-400', 'border-emerald-900/30'],
                ['B', '70–89%',  'MVD met', 'text-blue-400',    'border-blue-900/30'],
                ['C', '50–69%',  'MVD met', 'text-amber-400',   'border-amber-900/30'],
                ['D', '<50%',    'MVD met', 'text-orange-400',  'border-orange-900/30'],
                ['F', 'any',     'MVD not met', 'text-red-400', 'border-red-900/30'],
              ].map(([g, pct, cond, textCls, borderCls]) => (
                <div key={g} className={`flex items-center gap-4 px-4 py-2.5 border ${borderCls}`}>
                  <span className={`font-display text-2xl w-6 ${textCls}`}>{g}</span>
                  <span className="text-zinc-400 text-sm font-mono w-20">{pct}</span>
                  <span className="text-zinc-500 text-xs">{cond}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Save */}
          <div className="flex items-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-900">
            <button type="submit" className="btn btn-primary min-w-[140px]">
              {saved ? '✓ Saved' : 'Save Settings'}
            </button>
            {saved && <span className="text-emerald-500 text-xs font-mono">Changes applied</span>}
          </div>

        </form>

        {/* Info footer */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-900">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-4">Storage</div>
          <p className="text-zinc-600 text-sm">
            All V2 data is stored in localStorage under keys prefixed with{' '}
            <code className="text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-1">v2_</code>.
            It is completely separate from the classic system and won't interfere.
          </p>
        </div>

      </div>
    </div>
  );
}
