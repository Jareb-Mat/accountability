import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { formatTime12h } from '../utils/dateHelper';

export default function DailyChecklist({ tasks }) {
  const { toggleTask, markTaskFailed } = useContext(TaskContext);

  if (tasks.length === 0) {
    return (
      <div className="py-8">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          No tasks scheduled. Go to settings to add tasks.
        </p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onComplete={() => toggleTask(task.id, true)}
          onSkip={() => markTaskFailed(task.id)}
          onUndo={() => toggleTask(task.id, false)}
        />
      ))}
    </div>
  );
}

function TaskRow({ task, onComplete, onSkip, onUndo }) {
  return (
    <div
      className="flex items-center gap-4 py-3"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      {/* Time */}
      <span
        className="text-xs tabular-nums shrink-0 w-10"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
      >
        {formatTime12h(task.time)}
      </span>

      {/* Title */}
      <span
        className="flex-1 text-sm"
        style={{
          color: task.completed || task.failed ? 'var(--text-muted)' : 'var(--text-primary)',
          textDecoration: task.completed ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </span>

      {/* Actions */}
      <div
        className="shrink-0 text-xs"
        style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}
      >
        {!task.completed && !task.failed && (
          <span className="flex items-center gap-2">
            <button
              onClick={onComplete}
              className="transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
            >
              done
            </button>
            <span style={{ color: 'var(--bg-elevated)' }}>·</span>
            <button
              onClick={onSkip}
              className="transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
            >
              skip
            </button>
          </span>
        )}
        {task.completed && (
          <button
            onClick={onUndo}
            className="transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--text-secondary)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
          >
            undo
          </button>
        )}
        {task.failed && (
          <span style={{ color: 'var(--text-muted)' }}>missed</span>
        )}
      </div>
    </div>
  );
}
