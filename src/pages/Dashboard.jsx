import React, { useContext, useMemo, useState, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import DailyChecklist from '../components/DailyChecklist';
import StreakCounter from '../components/StreakCounter';
import ConsistencyChart from '../components/ConsistencyChart';
import FocusTimer from '../components/FocusTimer';
const getTimeWithSeconds = () => {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export default function Dashboard() {
  const { schedule, streak, tasks, loading, completeDay, selectedDate } = useContext(TaskContext);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [currentTime, setCurrentTime] = useState(getTimeWithSeconds());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(getTimeWithSeconds()), 1000);
    return () => clearInterval(interval);
  }, []);

  const todayTasks = useMemo(() => {
    const todayData = tasks[selectedDate] || {};
    return Object.entries(schedule)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, title]) => ({
        id: time,
        time,
        title,
        completed: todayData[time]?.completed || false,
        failed: todayData[time]?.failed || false,
      }));
  }, [schedule, tasks, selectedDate]);

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const failedCount    = todayTasks.filter((t) => t.failed).length;
  const totalTasks     = todayTasks.length;
  const pendingCount   = totalTasks - completedCount - failedCount;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fadeIn">
      <div className="mx-auto px-6 py-12" style={{ maxWidth: '880px' }}>

        {/* Header row */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-12">
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{todayDate}</div>
            <div
              className="text-3xl tabular-nums"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
            >
              {currentTime}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>completion</div>
            <div
              className="text-3xl tabular-nums"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
            >
              {completionRate}
              <span className="text-lg" style={{ color: 'var(--text-muted)' }}>%</span>
            </div>
          </div>
        </div>

        {/* Streak + stats row */}
        <div
          className="flex items-center justify-between flex-wrap gap-4 mb-12 pb-8"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <StreakCounter streak={streak} />
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {completedCount}
            </span>{' '}
            done{' · '}
            <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {pendingCount}
            </span>{' '}
            pending{' · '}
            <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {failedCount}
            </span>{' '}
            missed
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Today's schedule
            </h2>
            <span
              className="text-xs tabular-nums"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
            >
              {totalTasks} tasks
            </span>
          </div>
          <DailyChecklist tasks={todayTasks} />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFocusTimer(!showFocusTimer)}
            className="btn btn-ghost"
          >
            {showFocusTimer ? 'hide timer' : 'focus session'}
          </button>
          <button
            onClick={completeDay}
            disabled={completionRate < 100}
            className="btn btn-ghost"
          >
            {completionRate === 100 ? 'lock in day' : `${100 - completionRate}% remaining`}
          </button>
        </div>

        {showFocusTimer && (
          <div className="mt-8 animate-fadeIn">
            <FocusTimer />
          </div>
        )}

        {/* Weekly chart */}
        <div
          className="mt-16 pt-8"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <h2 className="text-sm font-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
            Weekly performance
          </h2>
          <ConsistencyChart />
        </div>

      </div>
    </div>
  );
}
