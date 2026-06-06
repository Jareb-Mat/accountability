import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { formatTime12h } from '../utils/dateHelper';

export default function Settings() {
  const { schedule, updateSchedule } = useContext(TaskContext);
  const [newTime, setNewTime] = useState('');
  const [newTask, setNewTask] = useState('');
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  const sortedSchedule = Object.entries(schedule).sort(([a], [b]) => a.localeCompare(b));

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTime || !newTask) return;

    const updatedSchedule = { ...schedule, [newTime]: newTask };
    await updateSchedule(updatedSchedule);
    setNewTime('');
    setNewTask('');
  };

  const handleRemoveTask = async (time) => {
    const updatedSchedule = { ...schedule };
    delete updatedSchedule[time];
    await updateSchedule(updatedSchedule);
  };

  const handleEdit = (time, value) => {
    setEditing(time);
    setEditValue(value);
  };

  const handleSaveEdit = async (time) => {
    if (!editValue.trim()) return;
    const updatedSchedule = { ...schedule, [time]: editValue.trim() };
    await updateSchedule(updatedSchedule);
    setEditing(null);
    setEditValue('');
  };

  return (
    <div className="min-h-screen animate-fadeIn">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12 divider-line pb-8">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-3">
            Configuration
          </div>
          <h1 className="font-display text-5xl md:text-6xl leading-none mb-4">
            Schedule
          </h1>
          <p className="text-zinc-400 max-w-xl">
            Define your daily commitments. Be specific. Be realistic. This is your contract with yourself.
          </p>
        </div>

        {/* Add New Task */}
        <div className="mb-12">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-4">
            Add New Task
          </div>
          <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-3">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
              className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-500 dark:focus:border-zinc-500 focus:outline-none rounded px-3 py-2 font-mono text-sm transition-colors w-full md:w-32"
            />
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              required
              placeholder="e.g., Calc problem set 2.1-2.15"
              className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-500 dark:focus:border-zinc-500 focus:outline-none rounded px-3 py-2 text-sm transition-colors flex-1"
            />
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>
        </div>

        {/* Schedule List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
              Daily Schedule
            </div>
            <div className="text-xs font-mono text-zinc-600">
              {sortedSchedule.length} TASKS
            </div>
          </div>

          {sortedSchedule.length === 0 ? (
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-12 text-center">
              <div className="text-zinc-500 text-sm font-mono mb-2">EMPTY SCHEDULE</div>
              <div className="text-zinc-600 text-xs">Add your first task above</div>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedSchedule.map(([time, task]) => (
                <div 
                  key={time}
                  className="group flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 p-4 transition-colors"
                >
                  <div className="font-mono text-sm text-zinc-500 w-20 shrink-0">
                    {formatTime12h(time)}
                  </div>
                  
                  {editing === time ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSaveEdit(time)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(time);
                        if (e.key === 'Escape') setEditing(null);
                      }}
                      autoFocus
                      className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-500 dark:focus:border-zinc-500 focus:outline-none rounded px-3 py-2 text-sm transition-colors"
                    />
                  ) : (
                    <div 
                      className="flex-1 cursor-text"
                      onClick={() => handleEdit(time, task)}
                    >
                      {task}
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleRemoveTask(time)}
                    className="opacity-0 group-hover:opacity-100 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-red-500 transition-all"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-900">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-4">
            Guidelines
          </div>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span>Be specific. "Study" is too vague. Use "Calc problem set 2.1-2.10".</span>
            </li>
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span>Times display in 12-hour format. The time picker uses your system's format.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span>Click any task to edit it. Hover to see remove button.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-zinc-600">→</span>
              <span>Start with 6-10 tasks. Don't overwhelm yourself.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
