import React, { useContext, useMemo } from 'react';
import { TaskContext } from '../context/TaskContext';
import { getLast7Days, getDayOfWeek, getTodayKey } from '../utils/dateHelper';

export default function ConsistencyChart() {
  const { tasks } = useContext(TaskContext);
  const last7Days = getLast7Days();
  const todayKey  = getTodayKey();

  const dailyScores = useMemo(() => {
    return last7Days.map((date) => {
      const dayTasks  = tasks[date] || {};
      const taskArray = Object.values(dayTasks);
      if (taskArray.length === 0) {
        return { date, score: 0, label: getDayOfWeek(date).toLowerCase().slice(0, 3), hasData: false };
      }
      const completed = taskArray.filter((t) => t.completed).length;
      const score     = Math.round((completed / taskArray.length) * 100);
      return { date, score, label: getDayOfWeek(date).toLowerCase().slice(0, 3), hasData: true };
    });
  }, [tasks, last7Days]);

  const validDays = dailyScores.filter((d) => d.hasData);
  const avgScore  = validDays.length > 0
    ? Math.round(validDays.reduce((sum, d) => sum + d.score, 0) / validDays.length)
    : 0;

  return (
    <div>
      {/* Average */}
      <div className="flex items-baseline gap-2 mb-6">
        <span
          className="text-2xl font-semibold tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
        >
          {avgScore}
          <span className="text-base font-normal" style={{ color: 'var(--text-muted)' }}>%</span>
        </span>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>7-day average</span>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {dailyScores.map((day) => {
          const isToday = day.date === todayKey;
          return (
            <div key={day.date} className="flex items-center gap-3">
              <span
                className="w-7 shrink-0 text-xs tabular-nums"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: isToday ? 'var(--text-secondary)' : 'var(--text-muted)',
                  fontWeight: isToday ? 500 : 400,
                }}
              >
                {day.label}
              </span>

              <div
                className="flex-1 overflow-hidden"
                style={{ height: '3px', backgroundColor: 'var(--bg-tertiary)' }}
              >
                {day.hasData && (
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.max(day.score, 2)}%`,
                      backgroundColor: 'var(--bar-color)',
                      opacity: Math.max(0.15, day.score / 100),
                    }}
                  />
                )}
              </div>

              <span
                className="w-8 shrink-0 text-right text-xs tabular-nums"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: day.hasData ? 'var(--text-muted)' : 'var(--bg-elevated)',
                }}
              >
                {day.hasData ? `${day.score}%` : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
