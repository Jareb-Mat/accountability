import React, { useMemo } from 'react';
import { getCurrentTime } from '../utils/dateHelper';

export default function TimeBlock({ schedule, currentTask }) {
  const now = getCurrentTime();

  const upcomingTasks = useMemo(() => {
    return Object.entries(schedule)
      .map(([time, title]) => ({ time, title }))
      .filter(({ time }) => time > now)
      .slice(0, 3);
  }, [schedule, now]);

  return (
    <div className="bg-gray-900 border border-gray-700 p-4 rounded">
      <div className="text-gray-400 text-sm font-bold uppercase mb-3">Current Time</div>
      <div className="text-3xl font-black text-white font-mono mb-4">{now}</div>

      {currentTask && (
        <div className="mb-4 p-3 bg-blue-900 bg-opacity-20 border-l-4 border-blue-500 rounded">
          <div className="text-blue-400 text-xs font-bold">ACTIVE NOW</div>
          <div className="text-white font-bold mt-1">{currentTask.title}</div>
        </div>
      )}

      {upcomingTasks.length > 0 && (
        <div>
          <div className="text-gray-400 text-xs font-bold uppercase mb-2">Next Tasks</div>
          <div className="space-y-2">
            {upcomingTasks.map(({ time, title }) => (
              <div key={time} className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-mono">{time}</span>
                <span className="text-gray-300">{title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
