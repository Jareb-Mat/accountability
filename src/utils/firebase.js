import { supabase } from './supabase.js';

const DEFAULT_SCHEDULE = {
  '06:00': 'Wake up & shower',
  '07:00': 'Breakfast',
  '08:00': 'Attend class',
  '10:00': 'Study block 1',
  '12:00': 'Lunch',
  '13:00': 'Attend class',
  '15:00': 'Study block 2',
  '17:00': 'Coding/Math practice',
  '19:00': 'Review',
  '22:00': 'Sleep routine',
};

// ── Schedule ──────────────────────────────────────────────────────────────────

export const getSchedule = async () => {
  const { data, error } = await supabase
    .from('schedule_items')
    .select('time, title')
    .order('time');
  if (error) throw error;
  if (!data || data.length === 0) {
    await setSchedule(DEFAULT_SCHEDULE);
    return DEFAULT_SCHEDULE;
  }
  return Object.fromEntries(data.map(({ time, title }) => [time, title]));
};

export const setSchedule = async (schedule) => {
  const { data: existing } = await supabase.from('schedule_items').select('time');
  const existingTimes = new Set((existing || []).map((r) => r.time));
  const newTimes = new Set(Object.keys(schedule));

  const toDelete = [...existingTimes].filter((t) => !newTimes.has(t));
  if (toDelete.length) {
    await supabase.from('schedule_items').delete().in('time', toDelete);
  }

  const rows = Object.entries(schedule).map(([time, title]) => ({ time, title }));
  if (rows.length) {
    const { error } = await supabase
      .from('schedule_items')
      .upsert(rows, { onConflict: 'time' });
    if (error) throw error;
  }
};

// ── Task logs ─────────────────────────────────────────────────────────────────

export const getAllTasks = async () => {
  const { data, error } = await supabase
    .from('task_logs')
    .select('date, time, completed, failed');
  if (error) throw error;
  const result = {};
  for (const row of data || []) {
    const d = String(row.date);
    if (!result[d]) result[d] = {};
    result[d][row.time] = { completed: row.completed, failed: row.failed };
  }
  return result;
};

export const getTasksForDate = async (date) => {
  const { data, error } = await supabase
    .from('task_logs')
    .select('time, completed, failed')
    .eq('date', date);
  if (error) throw error;
  return Object.fromEntries(
    (data || []).map((r) => [r.time, { completed: r.completed, failed: r.failed }])
  );
};

export const setTaskForDate = async (date, taskId, taskData) => {
  const { error } = await supabase
    .from('task_logs')
    .upsert(
      {
        date,
        time: taskId,
        completed: taskData.completed || false,
        failed: taskData.failed || false,
      },
      { onConflict: 'date,time' }
    );
  if (error) throw error;
};

// ── Streak (stored locally — no DB table) ────────────────────────────────────

export const getStreak = async () => {
  try {
    return (
      JSON.parse(localStorage.getItem('streak')) || {
        current: 0,
        longest: 0,
        lastCompletedDate: null,
        lastFailDate: null,
      }
    );
  } catch {
    return { current: 0, longest: 0, lastCompletedDate: null, lastFailDate: null };
  }
};

export const updateStreak = async (streakData) => {
  localStorage.setItem('streak', JSON.stringify(streakData));
};
