import React, { useState } from 'react';
import { useV2 } from '../context/V2Context';
import PlanModeSelector from '../components/v2/PlanModeSelector';
import ClockV2 from '../components/v2/ClockV2';

export default function Tomorrow() {
  const {
    loading, tomorrowPlan, tomorrowKey,
    addTomorrowTask, removeTomorrowTask,
    setTomorrowMode, lockTomorrowPlan, autoPopulateTomorrow,
  } = useV2();

  const [newTask, setNewTask] = useState('');
  const [newIsMvd, setNewIsMvd] = useState(false);
  const [locking, setLocking] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-500 font-mono text-sm tracking-wider">LOADING...</div>
      </div>
    );
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowLabel = tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const tasks  = tomorrowPlan.tasks || [];
  const locked = tomorrowPlan.locked;
  const mode   = tomorrowPlan.plan_mode || 'quick';

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await addTomorrowTask({ title: newTask.trim(), is_mvd: newIsMvd });
    setNewTask('');
    setNewIsMvd(false);
  };

  const handleLock = async () => {
    setLocking(true);
    await lockTomorrowPlan();
    setLocking(false);
  };

  const handleAutoPopulate = async () => {
    await autoPopulateTomorrow();
  };

  return (
    <div className="min-h-screen animate-fadeIn">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10 divider-line pb-8">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-2">{tomorrowLabel}</div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="font-display text-5xl md:text-6xl leading-none">Tomorrow</h1>
            <div className="flex items-center gap-3">
              {locked && (
                <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ✓ Locked In
                </span>
              )}
              <ClockV2 />
            </div>
          </div>
        </div>

        {/* Plan Mode */}
        <div className="mb-8">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-3">Plan Mode</div>
          <PlanModeSelector mode={mode} onChange={setTomorrowMode} disabled={locked} />
        </div>

        {/* Auto mode helper */}
        {mode === 'auto' && !locked && (
          <div className="mb-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-4 flex items-center justify-between gap-4">
            <div className="text-sm text-zinc-400">
              Auto-fill from classes scheduled for tomorrow.
            </div>
            <button
              onClick={handleAutoPopulate}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider btn btn-ghost"
            >
              Auto-Fill
            </button>
          </div>
        )}

        {/* Quick mode hint */}
        {mode === 'quick' && tasks.length === 0 && (
          <div className="mb-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-4">
            <div className="text-zinc-500 text-sm">
              Add 1–3 things that MUST happen tomorrow.
            </div>
          </div>
        )}

        {/* Task list */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
              {tasks.length} Task{tasks.length !== 1 ? 's' : ''} planned
            </div>
            {tasks.length > 0 && (
              <div className="text-zinc-600 text-xs font-mono">
                {tasks.filter((t) => t.is_mvd).length} MVD
              </div>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 text-center">
              <div className="text-zinc-500 text-sm font-mono mb-1">No tasks planned yet</div>
              <div className="text-zinc-600 text-xs">Add tasks below</div>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <TomorrowTaskRow
                  key={task.id}
                  task={task}
                  locked={locked}
                  onRemove={() => removeTomorrowTask(task.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add task form */}
        {!locked && (
          <form onSubmit={handleAddTask} className="mb-10 flex flex-col gap-3">
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-1">Add Task</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to happen tomorrow?"
                className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-500 dark:focus:border-zinc-500 focus:outline-none rounded px-3 py-2 text-sm transition-colors"
              />
              <button type="submit" className="btn btn-primary px-6">Add</button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={newIsMvd}
                onChange={(e) => setNewIsMvd(e.target.checked)}
                className="w-4 h-4 accent-white"
              />
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Mark as MVD (critical)</span>
            </label>
          </form>
        )}

        {/* Lock button */}
        {!locked && tasks.length > 0 && (
          <div className="border-t border-zinc-200 dark:border-zinc-900 pt-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-zinc-900 dark:text-white text-sm font-medium mb-1">Lock in tomorrow's plan</div>
                <div className="text-zinc-500 text-xs">
                  Commits this plan. You can still edit until midnight.
                </div>
              </div>
              <button
                onClick={handleLock}
                disabled={locking}
                className="btn btn-primary min-w-[140px]"
              >
                {locking ? 'Locking...' : '✓ Lock Plan'}
              </button>
            </div>
          </div>
        )}

        {locked && (
          <div className="border-t border-zinc-200 dark:border-zinc-900 pt-8 text-center">
            <div className="text-emerald-500 text-sm font-mono uppercase tracking-wider">
              Plan locked — see you tomorrow.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function TomorrowTaskRow({ task, locked, onRemove }) {
  return (
    <div className="group flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
      <div className="w-1.5 h-1.5 bg-zinc-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm text-zinc-900 dark:text-white">{task.title}</span>
        {task.is_mvd && (
          <span className="text-xs font-mono px-1.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30">
            MVD
          </span>
        )}
        {task.source === 'class' && (
          <span className="text-xs font-mono text-zinc-600">
            {task.time && `${task.time} · `}class
          </span>
        )}
      </div>
      {!locked && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 text-xs font-mono text-zinc-600 hover:text-red-500 transition-all"
        >
          ✕
        </button>
      )}
    </div>
  );
}
