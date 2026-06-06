import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import {
  getProfile, updateProfile, getRescueTokens, consumeRescueToken,
  setGradeForDate,
  getClasses, addClass, updateClass, deleteClass, getClassesForDate,
  getAttendanceForDate, markAttendance,
  getPlanForDate, savePlanMeta, addPlanTask, updatePlanTask, removePlanTask,
} from '../utils/supabaseV2';
import { getTodayKey, formatDateKey } from '../utils/dateHelper';

export const V2Context = createContext();

function getTomorrowKey() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDateKey(d);
}

const initialState = {
  loading: true,
  profile: { mvd_tasks: [], rescue_tokens: 3, wake_time: '', wake_deadline_minutes: 30 },
  todayPlan: { locked: false, plan_mode: 'quick', tasks: [], wake_confirmed: false, is_rescue_day: false },
  tomorrowPlan: { locked: false, plan_mode: 'quick', tasks: [], wake_confirmed: false, is_rescue_day: false },
  todayClasses: [],
  todayAttendance: {},
  allClasses: [],
  wakeStatus: 'none', // 'none' | 'pending' | 'active' | 'confirmed' | 'missed'
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':              return { ...state, ...action.payload, loading: false };
    case 'SET_PROFILE':       return { ...state, profile: action.payload };
    case 'SET_TODAY_PLAN':    return { ...state, todayPlan: action.payload };
    case 'SET_TOMORROW_PLAN': return { ...state, tomorrowPlan: action.payload };
    case 'SET_TODAY_CLASSES': return { ...state, todayClasses: action.payload };
    case 'SET_TODAY_ATTENDANCE': return { ...state, todayAttendance: action.payload };
    case 'SET_ALL_CLASSES':   return { ...state, allClasses: action.payload };
    case 'SET_WAKE_STATUS':   return { ...state, wakeStatus: action.payload };
    default: return state;
  }
}

// ── Grade computation ─────────────────────────────────────────────────────────
export function computeGrade(tasks, mvdTitles = [], attendance = {}, classes = [], isRescueDay = false) {
  if (!tasks || tasks.length === 0) return null;
  const completed = tasks.filter((t) => t.completed).length;
  const pct = Math.round((completed / tasks.length) * 100);

  const mvdTasks = tasks.filter((t) => t.is_mvd);
  let mvdMet = mvdTasks.length === 0 || mvdTasks.every((t) => t.completed);

  const criticalMissed = classes.some((c) => c.is_critical && attendance[c.id]?.skipped);
  if (criticalMissed) mvdMet = false;

  if (!mvdMet && !isRescueDay) return 'F';
  if (pct >= 90) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 50) return 'C';
  return 'D';
}

function computeWakeStatus(wakeTime, deadlineMinutes, wakeConfirmed) {
  if (!wakeTime) return 'none';
  if (wakeConfirmed) return 'confirmed';
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const [wh, wm] = wakeTime.split(':').map(Number);
  const wakeMin = wh * 60 + wm;
  const deadlineMin = wakeMin + (deadlineMinutes || 30);
  if (nowMin < wakeMin) return 'pending';
  if (nowMin <= deadlineMin) return 'active';
  return 'missed';
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function V2Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const todayKey    = getTodayKey();
  const tomorrowKey = getTomorrowKey();

  useEffect(() => {
    (async () => {
      const [profile, todayPlan, tomorrowPlan, todayClasses, todayAttendance, allClasses] =
        await Promise.all([
          getProfile(),
          getPlanForDate(todayKey),
          getPlanForDate(tomorrowKey),
          getClassesForDate(todayKey),
          getAttendanceForDate(todayKey),
          getClasses(),
        ]);
      const wakeStatus = computeWakeStatus(
        profile.wake_time,
        profile.wake_deadline_minutes,
        todayPlan.wake_confirmed
      );
      dispatch({
        type: 'INIT',
        payload: { profile, todayPlan, tomorrowPlan, todayClasses, todayAttendance, allClasses, wakeStatus },
      });
    })();
  }, []);

  // ── Live grade (derived) ──────────────────────────────────────────────────
  const liveGrade = useMemo(() => {
    if (!state.todayPlan.tasks.length && state.todayPlan.wake_confirmed) return 'A';
    return computeGrade(
      state.todayPlan.tasks,
      state.profile.mvd_tasks,
      state.todayAttendance,
      state.todayClasses,
      state.todayPlan.is_rescue_day || false
    );
  }, [state.todayPlan.tasks, state.todayPlan.wake_confirmed, state.profile.mvd_tasks, state.todayAttendance, state.todayClasses, state.todayPlan.is_rescue_day]);

  const livePct = useMemo(() => {
    const t = state.todayPlan.tasks;
    if (!t.length && state.todayPlan.wake_confirmed) return 100;
    if (!t.length) return 0;
    return Math.round((t.filter((x) => x.completed).length / t.length) * 100);
  }, [state.todayPlan.tasks, state.todayPlan.wake_confirmed]);

  const mvdStatus = useMemo(() => {
    const mvd = state.todayPlan.tasks.filter((t) => t.is_mvd);
    return { total: mvd.length, done: mvd.filter((t) => t.completed).length, tasks: mvd };
  }, [state.todayPlan.tasks]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const saveProfile = useCallback(async (updates) => {
    const next = await updateProfile(updates);
    dispatch({ type: 'SET_PROFILE', payload: next });
    const ws = computeWakeStatus(
      next.wake_time,
      next.wake_deadline_minutes,
      state.todayPlan.wake_confirmed
    );
    dispatch({ type: 'SET_WAKE_STATUS', payload: ws });
  }, [state.todayPlan.wake_confirmed]);

  const persistGrade = useCallback(async (tasks, attendance, classes, isRescue) => {
    const grade = computeGrade(tasks, state.profile.mvd_tasks, attendance, classes, isRescue);
    if (!grade) return;
    const completed = tasks.filter((t) => t.completed).length;
    await setGradeForDate(todayKey, {
      grade,
      pct: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
      mvd_met: grade !== 'F',
      is_rescue_day: isRescue || false,
    });
  }, [todayKey, state.profile.mvd_tasks]);

  const toggleTodayTask = useCallback(async (taskId) => {
    const task = state.todayPlan.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updates = { completed: !task.completed };
    await updatePlanTask(todayKey, taskId, updates);
    const newTasks = state.todayPlan.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t);
    const newPlan = { ...state.todayPlan, tasks: newTasks };
    dispatch({ type: 'SET_TODAY_PLAN', payload: newPlan });
    await persistGrade(newTasks, state.todayAttendance, state.todayClasses, state.todayPlan.is_rescue_day);
  }, [state.todayPlan, state.todayAttendance, state.todayClasses, todayKey, persistGrade]);

  const addTodayTask = useCallback(async (task) => {
    const created = await addPlanTask(todayKey, task);
    const plan = await getPlanForDate(todayKey);
    dispatch({ type: 'SET_TODAY_PLAN', payload: plan });
    return created;
  }, [todayKey]);

  const removeTodayTask = useCallback(async (taskId) => {
    await removePlanTask(todayKey, taskId);
    const plan = await getPlanForDate(todayKey);
    dispatch({ type: 'SET_TODAY_PLAN', payload: plan });
  }, [todayKey]);

  const useRescueToken = useCallback(async () => {
    const ok = await consumeRescueToken(todayKey);
    if (!ok) return false;
    const profile = await getProfile();
    dispatch({ type: 'SET_PROFILE', payload: profile });
    const plan = await getPlanForDate(todayKey);
    dispatch({ type: 'SET_TODAY_PLAN', payload: plan });
    await persistGrade(state.todayPlan.tasks, state.todayAttendance, state.todayClasses, true);
    return true;
  }, [todayKey, state.todayPlan.tasks, state.todayAttendance, state.todayClasses, persistGrade]);

  const confirmWakeUp = useCallback(async () => {
    await savePlanMeta(todayKey, {
      wake_confirmed: true,
      wake_confirmed_at: new Date().toISOString(),
    });
    dispatch({
      type: 'SET_TODAY_PLAN',
      payload: { ...state.todayPlan, wake_confirmed: true },
    });
    dispatch({ type: 'SET_WAKE_STATUS', payload: 'confirmed' });
    if (!state.todayPlan.tasks.length) {
      await setGradeForDate(todayKey, { grade: 'A', pct: 100, mvd_met: true, is_rescue_day: false });
    }
  }, [todayKey, state.todayPlan]);

  const setAttendance = useCallback(async (classId, attended) => {
    await markAttendance(classId, todayKey, attended);
    const att = await getAttendanceForDate(todayKey);
    dispatch({ type: 'SET_TODAY_ATTENDANCE', payload: att });
    await persistGrade(state.todayPlan.tasks, att, state.todayClasses, state.todayPlan.is_rescue_day);
  }, [todayKey, state.todayPlan.tasks, state.todayClasses, state.todayPlan.is_rescue_day, persistGrade]);

  const refreshClasses = useCallback(async () => {
    const [all, forToday] = await Promise.all([getClasses(), getClassesForDate(todayKey)]);
    dispatch({ type: 'SET_ALL_CLASSES', payload: all });
    dispatch({ type: 'SET_TODAY_CLASSES', payload: forToday });
  }, [todayKey]);

  const addNewClass    = useCallback(async (data)         => { await addClass(data);          await refreshClasses(); }, [refreshClasses]);
  const removeAClass   = useCallback(async (id)           => { await deleteClass(id);          await refreshClasses(); }, [refreshClasses]);
  const editClass      = useCallback(async (id, updates)  => { await updateClass(id, updates); await refreshClasses(); }, [refreshClasses]);

  // ── Tomorrow plan ─────────────────────────────────────────────────────────

  const addTomorrowTask = useCallback(async (task) => {
    await addPlanTask(tomorrowKey, task);
    dispatch({ type: 'SET_TOMORROW_PLAN', payload: await getPlanForDate(tomorrowKey) });
  }, [tomorrowKey]);

  const removeTomorrowTask = useCallback(async (taskId) => {
    await removePlanTask(tomorrowKey, taskId);
    dispatch({ type: 'SET_TOMORROW_PLAN', payload: await getPlanForDate(tomorrowKey) });
  }, [tomorrowKey]);

  const setTomorrowMode = useCallback(async (mode) => {
    await savePlanMeta(tomorrowKey, { plan_mode: mode });
    dispatch({ type: 'SET_TOMORROW_PLAN', payload: await getPlanForDate(tomorrowKey) });
  }, [tomorrowKey]);

  const lockTomorrowPlan = useCallback(async () => {
    await savePlanMeta(tomorrowKey, { locked: true });
    dispatch({ type: 'SET_TOMORROW_PLAN', payload: await getPlanForDate(tomorrowKey) });
  }, [tomorrowKey]);

  const autoPopulateTomorrow = useCallback(async () => {
    const tomorrowClasses = await getClassesForDate(tomorrowKey);
    for (const cls of tomorrowClasses) {
      await addPlanTask(tomorrowKey, {
        title: cls.name,
        is_mvd: cls.is_critical,
        source: 'class',
        class_id: cls.id,
        time: cls.time,
      });
    }
    dispatch({ type: 'SET_TOMORROW_PLAN', payload: await getPlanForDate(tomorrowKey) });
  }, [tomorrowKey]);

  return (
    <V2Context.Provider value={{
      ...state,
      todayKey,
      tomorrowKey,
      liveGrade,
      livePct,
      mvdStatus,
      isRescueDay: state.todayPlan.is_rescue_day || false,
      // Actions
      saveProfile,
      toggleTodayTask,
      addTodayTask,
      removeTodayTask,
      useRescueToken,
      confirmWakeUp,
      setAttendance,
      addNewClass,
      removeAClass,
      editClass,
      addTomorrowTask,
      removeTomorrowTask,
      setTomorrowMode,
      lockTomorrowPlan,
      autoPopulateTomorrow,
    }}>
      {children}
    </V2Context.Provider>
  );
}

export const useV2 = () => useContext(V2Context);
