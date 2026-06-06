import React, { useState } from 'react';
import { useV2 } from '../context/V2Context';
import GradeDisplay from '../components/v2/GradeDisplay';
import MvdProgress from '../components/v2/MvdProgress';
import ClassCard from '../components/v2/ClassCard';
import RescueTokenButton from '../components/v2/RescueTokenButton';
import ClockV2 from '../components/v2/ClockV2';

export default function TodayV2() {
  const {
    loading, profile, liveGrade, livePct, mvdStatus, wakeStatus, isRescueDay,
    todayPlan, todayClasses, todayAttendance,
    toggleTodayTask, addTodayTask, removeTodayTask,
    useRescueToken, confirmWakeUp, setAttendance,
  } = useV2();

  const [newTask, setNewTask] = useState('');
  const [newIsMvd, setNewIsMvd] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-500 font-mono text-sm tracking-wider">LOADING...</div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const tasks = todayPlan.tasks || [];
  const pendingTasks   = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const isMvdByTitle = profile.mvd_tasks?.includes(newTask.trim());
    await addTodayTask({ title: newTask.trim(), is_mvd: newIsMvd || isMvdByTitle });
    setNewTask('');
    setNewIsMvd(false);
  };

  const wakeLabel = {
    none:      null,
    pending:   { text: `Wake target: ${profile.wake_time}`, cls: 'text-zinc-500 border-zinc-300 dark:border-zinc-800' },
    active:    { text: "It's wake time — confirm you're up!", cls: 'text-emerald-400 border-emerald-900/30 bg-emerald-950/10' },
    confirmed: { text: `✓ Awake at ${profile.wake_time}`, cls: 'text-emerald-600 border-emerald-900/20' },
    missed:    { text: `✗ Missed wake window (${profile.wake_time})`, cls: 'text-red-400 border-red-900/30 bg-red-950/10' },
  }[wakeStatus];

  return (
    <div className="min-h-screen animate-fadeIn">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10 divider-line pb-8">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-2">{today}</div>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-5xl md:text-6xl leading-none">Today</h1>
            <ClockV2 />
          </div>
        </div>

        {/* Wake-up banner */}
        {wakeLabel && (
          <div className={`mb-6 border p-4 flex items-center justify-between gap-4 ${wakeLabel.cls}`}>
            <span className="text-sm font-mono">{wakeLabel.text}</span>
            {wakeStatus === 'active' && (
              <button
                onClick={confirmWakeUp}
                className="px-6 py-2 bg-emerald-500 text-black text-xs font-mono uppercase tracking-widest font-bold hover:bg-emerald-400 transition-colors animate-pulseGreen"
              >
                I'M AWAKE
              </button>
            )}
          </div>
        )}

        {/* Grade + MVD row */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-6">
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-4">Today's Grade</div>
            <GradeDisplay grade={liveGrade} pct={livePct} isRescueDay={isRescueDay} />
          </div>
          <div className="flex flex-col justify-center">
            <MvdProgress mvdStatus={mvdStatus} />
          </div>
        </div>

        {/* Rescue token */}
        {(liveGrade === 'F' || liveGrade === 'D') && (
          <div className="mb-8">
            <RescueTokenButton
              tokens={profile.rescue_tokens ?? 3}
              grade={liveGrade}
              onUse={useRescueToken}
            />
          </div>
        )}

        {/* Today's classes */}
        {todayClasses.length > 0 && (
          <div className="mb-8">
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-3">
              Today's Classes
            </div>
            <div className="space-y-2">
              {todayClasses.map((cls) => (
                <ClassCard
                  key={cls.id}
                  cls={cls}
                  attendance={todayAttendance}
                  onAttend={(id) => setAttendance(id, true)}
                  onSkip={(id) => setAttendance(id, false)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Task list */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Tasks</div>
            <div className="text-zinc-600 text-xs font-mono">
              {completedTasks.length}/{tasks.length}
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 text-center">
              <div className="text-zinc-500 text-sm font-mono mb-1">No tasks for today</div>
              <div className="text-zinc-600 text-xs">Add tasks below or plan ahead using Tomorrow</div>
            </div>
          ) : (
            <div className="space-y-2">
              {[...pendingTasks, ...completedTasks].map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTodayTask(task.id)}
                  onRemove={() => removeTodayTask(task.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add task */}
        <form onSubmit={handleAddTask} className="flex flex-col gap-3">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-1">Add Task</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Task title..."
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
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Mark as MVD</span>
          </label>
        </form>

      </div>
    </div>
  );
}

function TaskRow({ task, onToggle, onRemove }) {
  return (
    <div className={`group flex items-center gap-4 p-4 border transition-all ${
      task.completed
        ? 'bg-emerald-950/10 border-emerald-900/30'
        : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700'
    }`}>
      <button onClick={onToggle} className="shrink-0">
        <div className={`w-6 h-6 border flex items-center justify-center transition-all ${
          task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-400'
        }`}>
          {task.completed && (
            <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="square" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className={`text-sm ${task.completed ? 'text-emerald-400 line-through opacity-60' : 'text-zinc-900 dark:text-white'}`}>
          {task.title}
        </span>
        {task.is_mvd && (
          <span className="text-xs font-mono px-1.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30">
            MVD
          </span>
        )}
        {task.source === 'class' && (
          <span className="text-xs font-mono text-zinc-600">class</span>
        )}
      </div>

      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 text-xs font-mono text-zinc-600 hover:text-red-500 transition-all"
      >
        ✕
      </button>
    </div>
  );
}
