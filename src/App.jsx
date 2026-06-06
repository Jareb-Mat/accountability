import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { V2Provider } from './context/V2Context';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import WeeklyReview from './pages/WeeklyReview';
import TodayV2 from './pages/TodayV2';
import Tomorrow from './pages/Tomorrow';
import Classes from './pages/Classes';
import SettingsV2 from './pages/SettingsV2';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  return (
    <Router>
      <TaskProvider>
        <V2Provider>
          <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <Header />
            <ThemeToggle />
            <Routes>
              {/* Classic routes — unchanged */}
              <Route path="/"         element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/review"   element={<WeeklyReview />} />

              {/* V2 routes */}
              <Route path="/v2"               element={<TodayV2 />} />
              <Route path="/v2/tomorrow"      element={<Tomorrow />} />
              <Route path="/v2/classes"       element={<Classes />} />
              <Route path="/v2/settings"      element={<SettingsV2 />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </V2Provider>
      </TaskProvider>
    </Router>
  );
}
