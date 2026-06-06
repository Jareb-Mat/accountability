import React, { useState } from 'react';
import { useV2 } from '../context/V2Context';
import ClassCard from '../components/v2/ClassCard';
import ClockV2 from '../components/v2/ClockV2';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const BLANK_FORM = { name: '', days: [], time: '', location: '', is_critical: false };

export default function Classes() {
  const { loading, allClasses, todayAttendance, todayClasses, addNewClass, removeAClass, editClass, setAttendance } = useV2();
  const [form, setForm]         = useState(BLANK_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [delConfirm, setDelConfirm] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-500 font-mono text-sm tracking-wider">LOADING...</div>
      </div>
    );
  }

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.days.length === 0) return;
    if (editingId) {
      await editClass(editingId, form);
      setEditingId(null);
    } else {
      await addNewClass(form);
    }
    setForm(BLANK_FORM);
    setShowForm(false);
  };

  const startEdit = (cls) => {
    setForm({ name: cls.name, days: cls.days || [], time: cls.time || '', location: cls.location || '', is_critical: cls.is_critical || false });
    setEditingId(cls.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await removeAClass(id);
    setDelConfirm(null);
  };

  const todayIds = new Set(todayClasses.map((c) => c.id));

  return (
    <div className="min-h-screen animate-fadeIn">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10 divider-line pb-8">
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-2">Schedule</div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h1 className="font-display text-5xl md:text-6xl leading-none">Classes</h1>
            <div className="flex items-center gap-3">
              <ClockV2 />
              <button
                onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(BLANK_FORM); }}
                className="btn btn-ghost"
              >
                {showForm ? 'Cancel' : '+ Add Class'}
              </button>
            </div>
          </div>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-10 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 animate-slideUp">
            <div className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-2">
              {editingId ? 'Edit Class' : 'New Class'}
            </div>

            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Class name (e.g. Calculus II)"
              required
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-500 dark:focus:border-zinc-500 focus:outline-none rounded px-3 py-2 text-sm transition-colors"
            />

            <div className="flex gap-2 flex-wrap">
              {ALL_DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase border transition-all ${
                    form.days.includes(day)
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                      : 'text-zinc-500 border-zinc-300 dark:border-zinc-800 hover:border-zinc-500 dark:hover:border-zinc-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-500 dark:focus:border-zinc-500 focus:outline-none rounded px-3 py-2 font-mono text-sm transition-colors"
              />
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Room / building (optional)"
                className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-500 dark:focus:border-zinc-500 focus:outline-none rounded px-3 py-2 text-sm transition-colors"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_critical}
                onChange={(e) => setForm({ ...form, is_critical: e.target.checked })}
                className="w-4 h-4 accent-white"
              />
              <div>
                <div className="text-sm text-zinc-900 dark:text-white">Critical class</div>
                <div className="text-xs text-zinc-500">Skipping this automatically fails MVD for the day</div>
              </div>
            </label>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn btn-primary flex-1">
                {editingId ? 'Save Changes' : 'Add Class'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setShowForm(false); setForm(BLANK_FORM); }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Today's classes (attendance) */}
        {todayClasses.length > 0 && (
          <div className="mb-10">
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-3">Today</div>
            <div className="space-y-2">
              {todayClasses.map((cls) => (
                <ClassCard
                  key={cls.id}
                  cls={cls}
                  attendance={todayAttendance}
                  onAttend={(id) => setAttendance(id, true)}
                  onSkip={(id) => setAttendance(id, false)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All classes */}
        <div>
          <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-3">
            All Classes ({allClasses.length})
          </div>

          {allClasses.length === 0 ? (
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-12 text-center">
              <div className="text-zinc-500 text-sm font-mono mb-2">No classes added</div>
              <div className="text-zinc-600 text-xs">Click "+ Add Class" to get started</div>
            </div>
          ) : (
            <div className="space-y-2">
              {allClasses.map((cls) => (
                <div key={cls.id} className="relative group">
                  <ClassCard
                    cls={cls}
                    attendance={todayIds.has(cls.id) ? todayAttendance : {}}
                    onAttend={(id) => setAttendance(id, true)}
                    onSkip={(id) => setAttendance(id, false)}
                    showAttendance={todayIds.has(cls.id)}
                  />
                  <div className="absolute top-3 right-3 hidden group-hover:flex gap-1">
                    <button
                      onClick={() => startEdit(cls)}
                      className="px-2 py-1 text-xs font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    {delConfirm === cls.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(cls.id)}
                          className="px-2 py-1 text-xs font-mono bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDelConfirm(null)}
                          className="px-2 py-1 text-xs font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-300 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          No
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setDelConfirm(cls.id)}
                        className="px-2 py-1 text-xs font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-300 dark:border-zinc-800 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
