import { supabase } from './supabase.js';

// ── Profile ───────────────────────────────────────────────────────────────────

export const getProfile = async () => {
  const { data, error } = await supabase
    .from('v2_profiles')
    .select('*')
    .eq('id', 1)
    .single();
  if (error || !data) {
    return { mvd_tasks: [], rescue_tokens: 3, wake_time: '', wake_deadline_minutes: 30 };
  }
  return {
    mvd_tasks: data.mvd_tasks || [],
    rescue_tokens: data.rescue_tokens ?? 3,
    wake_time: data.wake_time || '',
    wake_deadline_minutes: data.wake_deadline_minutes ?? 30,
    tokens_reset_at: data.tokens_reset_at,
  };
};

export const updateProfile = async (updates) => {
  const current = await getProfile();
  const next = { ...current, ...updates };
  const { error } = await supabase
    .from('v2_profiles')
    .upsert({ id: 1, ...next });
  if (error) throw error;
  return next;
};

export const getRescueTokens = async () => {
  const profile = await getProfile();
  const today = new Date();
  const firstOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
  if (profile.tokens_reset_at !== firstOfMonth) {
    await updateProfile({ rescue_tokens: 3, tokens_reset_at: firstOfMonth });
    return 3;
  }
  return profile.rescue_tokens ?? 3;
};

export const consumeRescueToken = async (date) => {
  const profile = await getProfile();
  if ((profile.rescue_tokens ?? 0) <= 0) return false;
  await updateProfile({ rescue_tokens: profile.rescue_tokens - 1 });
  const { error } = await supabase
    .from('v2_plans')
    .upsert({ date, is_rescue_day: true }, { onConflict: 'date' });
  if (error) throw error;
  return true;
};

// ── Daily Grades ──────────────────────────────────────────────────────────────

export const getGradeForDate = async (date) => {
  const { data } = await supabase
    .from('v2_grades')
    .select('*')
    .eq('date', date)
    .single();
  return data || null;
};

export const setGradeForDate = async (date, gradeData) => {
  const { error } = await supabase
    .from('v2_grades')
    .upsert({ date, ...gradeData }, { onConflict: 'date' });
  if (error) throw error;
};

export const getGradesForRange = async (start, end) => {
  const { data } = await supabase
    .from('v2_grades')
    .select('*')
    .gte('date', start)
    .lte('date', end);
  return Object.fromEntries((data || []).map((r) => [r.date, r]));
};

// ── Classes ───────────────────────────────────────────────────────────────────

export const getClasses = async () => {
  const { data, error } = await supabase
    .from('v2_classes')
    .select('*')
    .order('created_at');
  if (error) throw error;
  return data || [];
};

export const addClass = async (classData) => {
  const { data, error } = await supabase
    .from('v2_classes')
    .insert(classData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateClass = async (id, updates) => {
  const { error } = await supabase.from('v2_classes').update(updates).eq('id', id);
  if (error) throw error;
};

export const deleteClass = async (id) => {
  const { error } = await supabase.from('v2_classes').delete().eq('id', id);
  if (error) throw error;
};

export const getClassesForDate = async (date) => {
  const [y, m, d] = date.split('-').map(Number);
  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(y, m - 1, d).getDay()];
  const { data, error } = await supabase.from('v2_classes').select('*');
  if (error) throw error;
  return (data || []).filter((c) => Array.isArray(c.days) && c.days.includes(dayName));
};

// ── Attendance ────────────────────────────────────────────────────────────────

export const getAttendanceForDate = async (date) => {
  const { data, error } = await supabase
    .from('v2_attendance')
    .select('class_id, attended')
    .eq('date', date);
  if (error) throw error;
  const result = {};
  for (const row of data || []) {
    result[row.class_id] = { attended: row.attended, skipped: !row.attended };
  }
  return result;
};

export const markAttendance = async (classId, date, attended) => {
  const { error } = await supabase
    .from('v2_attendance')
    .upsert({ date, class_id: classId, attended }, { onConflict: 'date,class_id' });
  if (error) throw error;
};

// ── Plans ─────────────────────────────────────────────────────────────────────

export const getPlanForDate = async (date) => {
  const { data: plan } = await supabase
    .from('v2_plans')
    .select('*')
    .eq('date', date)
    .maybeSingle();

  if (!plan) {
    return {
      date,
      locked: false,
      plan_mode: 'quick',
      wake_confirmed: false,
      is_rescue_day: false,
      tasks: [],
    };
  }

  const { data: tasks } = await supabase
    .from('v2_plan_tasks')
    .select('*')
    .eq('plan_id', plan.id)
    .order('sort_order');

  return {
    id: plan.id,
    date: plan.date,
    locked: plan.locked,
    plan_mode: plan.plan_mode,
    wake_confirmed: plan.wake_confirmed,
    wake_confirmed_at: plan.wake_confirmed_at,
    is_rescue_day: plan.is_rescue_day,
    tasks: tasks || [],
  };
};

export const savePlanMeta = async (date, meta) => {
  const { error } = await supabase
    .from('v2_plans')
    .upsert({ date, ...meta }, { onConflict: 'date' });
  if (error) throw error;
};

export const addPlanTask = async (date, task) => {
  // Get or create the plan row
  const { data: existing } = await supabase
    .from('v2_plans')
    .select('id')
    .eq('date', date)
    .maybeSingle();

  let planId;
  if (existing) {
    planId = existing.id;
  } else {
    const { data: created, error } = await supabase
      .from('v2_plans')
      .insert({ date, locked: false, plan_mode: 'quick', wake_confirmed: false, is_rescue_day: false })
      .select('id')
      .single();
    if (error) throw error;
    planId = created.id;
  }

  const { data, error } = await supabase
    .from('v2_plan_tasks')
    .insert({ plan_id: planId, completed: false, sort_order: 0, ...task })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updatePlanTask = async (_date, taskId, updates) => {
  const { error } = await supabase
    .from('v2_plan_tasks')
    .update(updates)
    .eq('id', taskId);
  if (error) throw error;
};

export const removePlanTask = async (_date, taskId) => {
  const { error } = await supabase
    .from('v2_plan_tasks')
    .delete()
    .eq('id', taskId);
  if (error) throw error;
};
