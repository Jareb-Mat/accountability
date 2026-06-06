import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import {
  getTasksForDate,
  getAllTasks,
  setTaskForDate,
  getSchedule,
  getStreak,
  updateStreak,
  setSchedule,
} from '../utils/firebase';
import { getTodayKey, formatDateKey, shouldContinueStreak } from '../utils/dateHelper';

export const TaskContext = createContext();

const initialState = {
  tasks: {},
  schedule: {},
  streak: { current: 0, longest: 0, lastCompletedDate: null, lastFailDate: null },
  selectedDate: getTodayKey(),
  loading: true,
  error: null,
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'LOAD_SCHEDULE':
      return { ...state, schedule: action.payload };
    case 'LOAD_STREAK':
      return { ...state, streak: action.payload };
    case 'SET_TASK':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.date]: {
            ...state.tasks[action.date],
            [action.taskId]: action.payload,
          },
        },
      };
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload };
    case 'UPDATE_STREAK':
      return { ...state, streak: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, scheduleData, streakData] = await Promise.all([
          getAllTasks(),
          getSchedule(),
          getStreak(),
        ]);

        dispatch({ type: 'LOAD_TASKS', payload: tasksData });
        dispatch({ type: 'LOAD_SCHEDULE', payload: scheduleData });
        dispatch({ type: 'LOAD_STREAK', payload: streakData });

        await checkAndUpdateStreak(streakData);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };

    loadData();
  }, []);

  const checkAndUpdateStreak = async (currentStreak) => {
    const todayKey = getTodayKey();
    const todayTasks = await getTasksForDate(todayKey);

    if (todayTasks.evaluated) return;

    if (currentStreak.lastCompletedDate) {
      if (!shouldContinueStreak(currentStreak.lastCompletedDate)) {
        const updated = { ...currentStreak, current: 0, lastFailDate: todayKey };
        dispatch({ type: 'UPDATE_STREAK', payload: updated });
        await updateStreak(updated);
      }
    }
  };

  const toggleTask = useCallback(
    async (taskId, completed) => {
      const taskData = {
        completed,
        completedAt: completed ? Date.now() : null,
        failed: false,
      };
      await setTaskForDate(state.selectedDate, taskId, taskData);
      dispatch({ type: 'SET_TASK', payload: taskData, date: state.selectedDate, taskId });
    },
    [state.selectedDate]
  );

  const markTaskFailed = useCallback(
    async (taskId) => {
      const taskData = { completed: false, completedAt: null, failed: true };
      await setTaskForDate(state.selectedDate, taskId, taskData);
      dispatch({ type: 'SET_TASK', payload: taskData, date: state.selectedDate, taskId });
    },
    [state.selectedDate]
  );

  const updateSchedule = useCallback(async (newSchedule) => {
    await setSchedule(newSchedule);
    dispatch({ type: 'LOAD_SCHEDULE', payload: newSchedule });
  }, []);

  const completeDay = useCallback(async () => {
    const todayKey = getTodayKey();
    const todayTasks = state.tasks[todayKey] || {};
    const allCompleted = Object.values(todayTasks).every((task) => task.completed);

    const newStreak = allCompleted
      ? {
          ...state.streak,
          current: state.streak.current + 1,
          longest: Math.max(state.streak.current + 1, state.streak.longest),
          lastCompletedDate: todayKey,
        }
      : { ...state.streak, current: 0, lastFailDate: todayKey };

    await updateStreak(newStreak);
    dispatch({ type: 'UPDATE_STREAK', payload: newStreak });
  }, [state.tasks, state.streak]);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        toggleTask,
        markTaskFailed,
        updateSchedule,
        completeDay,
        setSelectedDate: (date) => dispatch({ type: 'SET_DATE', payload: date }),
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
