// Format date as YYYY-MM-DD
export const formatDateKey = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

// Get today's date key
export const getTodayKey = () => formatDateKey(new Date());

// Get date from key
export const dateFromKey = (key) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Get current time as HH:MM (24h, used internally for comparisons)
export const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Convert HH:MM (24h) to 12-hour display string, e.g. "2:30 PM"
export const formatTime12h = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')}${period.toLowerCase()}`;
};

// Check if time has passed
export const hasTimePassed = (scheduleTime) => {
  return getCurrentTime() >= scheduleTime;
};

// Get day of week
export const getDayOfWeek = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const d = typeof date === 'string' ? dateFromKey(date) : date;
  return days[d.getDay()];
};

// Get last 7 days
export const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDateKey(d));
  }
  return days;
};

// Check if streak should continue
export const shouldContinueStreak = (lastCompletedDate) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return formatDateKey(dateFromKey(lastCompletedDate)) === formatDateKey(yesterday);
};
