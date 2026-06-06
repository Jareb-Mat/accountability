import React, { useContext, useMemo } from 'react';
import { TaskContext } from '../context/TaskContext';
import { getLast7Days, getDayOfWeek, getTodayKey } from '../utils/dateHelper';

export default function WeeklyReview() {
  const { tasks } = useContext(TaskContext);
  const last7Days = getLast7Days();
  const todayKey  = getTodayKey();

  const weeklyStats = useMemo(() => {
    const daily = last7Days.map((date) => {
      const dayTasks  = tasks[date] || {};
      const taskArray = Object.values(dayTasks);
      const completed = taskArray.filter((t) => t.completed).length;
      const failed    = taskArray.filter((t) => t.failed).length;
      const total     = taskArray.length;
      return {
        date,
        label: getDayOfWeek(date).toLowerCase().slice(0, 3),
        completed,
        failed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        hasData: total > 0,
      };
    });

    const validDays = daily.filter((d) => d.hasData);
    return {
      daily,
      totalCompleted: daily.reduce((s, d) => s + d.completed, 0),
      totalFailed:    daily.reduce((s, d) => s + d.failed, 0),
      perfectDays:    daily.filter((d) => d.percentage === 100).length,
      avgPercentage:  validDays.length > 0
        ? Math.round(validDays.reduce((s, d) => s + d.percentage, 0) / validDays.length)
        : 0,
    };
  }, [tasks, last7Days]);

  return (
    <div className="min-h-screen animate-fadeIn">
      <div className="mx-auto px-6 py-12" style={{ maxWidth: '880px' }}>

        {/* Header */}
        <div className="mb-12 pb-8" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Last 7 days</div>
              <h1 className="text-2xl font-semibold">Weekly review</h1>
            </div>
            <div className="text-right">
              <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Average</div>
              <div
                className="text-2xl tabular-nums"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
              >
                {weeklyStats.avgPercentage}<span className="text-base" style={{ color: 'var(--text-muted)' }}>%</span>
              </div>
            </div>
          </div>

          {/* Inline stats */}
          <div className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {weeklyStats.totalCompleted}
            </span>{' '}
            tasks done{' · '}
            <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {weeklyStats.totalFailed}
            </span>{' '}
            missed{' · '}
            <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {weeklyStats.perfectDays}
            </span>{' '}
            perfect days
          </div>
        </div>

        {/* Daily rows */}
        <div className="mb-12">
          <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
            Daily breakdown
          </h2>
          <div>
            {weeklyStats.daily.map((day) => {
              const isToday = day.date === todayKey;
              return (
                <div
                  key={day.date}
                  className="flex items-center gap-4 py-3"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <span
                    className="text-xs w-7 shrink-0 tabular-nums"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: isToday ? 'var(--text-secondary)' : 'var(--text-muted)',
                      fontWeight: isToday ? 500 : 400,
                    }}
                  >
                    {day.label}
                  </span>
                  <span
                    className="text-xs shrink-0 w-24"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                  >
                    {day.date}
                  </span>
                  <div
                    className="flex-1 overflow-hidden"
                    style={{ height: '3px', backgroundColor: 'var(--bg-tertiary)' }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: day.hasData ? `${day.percentage}%` : '0%',
                        backgroundColor: 'var(--bar-color)',
                        opacity: day.hasData ? Math.max(0.15, day.percentage / 100) : 0,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs w-10 text-right tabular-nums shrink-0"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                  >
                    {day.hasData ? `${day.percentage}%` : '—'}
                  </span>
                  <span
                    className="text-xs w-12 text-right tabular-nums shrink-0"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                  >
                    {day.hasData ? `${day.completed}/${day.total}` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quiet verdict */}
        {weeklyStats.avgPercentage > 0 && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {weeklyStats.avgPercentage >= 90 && 'Good week. Consistent work.'}
            {weeklyStats.avgPercentage >= 70 && weeklyStats.avgPercentage < 90 && 'Mostly on track. A few things slipped.'}
            {weeklyStats.avgPercentage >= 50 && weeklyStats.avgPercentage < 70 && "Inconsistent week. Identify what's blocking the hard tasks."}
            {weeklyStats.avgPercentage > 0 && weeklyStats.avgPercentage < 50 && 'Difficult week. Less than half completed.'}
          </p>
        )}

      </div>
    </div>
  );
}
