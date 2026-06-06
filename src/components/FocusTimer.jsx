import React, { useState, useEffect } from 'react';

export default function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [duration, setDuration] = useState(25);

  useEffect(() => {
    let interval = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            setSessions(sessions + 1);
            playSound();
            setMinutes(duration);
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, sessions, duration]);

  const playSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setMinutes(duration);
    setSeconds(0);
  };

  const setDurationAndReset = (newDuration) => {
    setDuration(newDuration);
    setMinutes(newDuration);
    setSeconds(0);
    setIsActive(false);
  };

  // Calculate progress
  const totalSeconds = duration * 60;
  const remainingSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 md:p-10">
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulseGreen' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Focus Session {sessions > 0 && `· ${sessions} completed`}
          </span>
        </div>

        {/* Duration selector */}
        {!isActive && (
          <div className="flex gap-1">
            {[15, 25, 50].map((d) => (
              <button
                key={d}
                onClick={() => setDurationAndReset(d)}
                className={`px-3 py-1 text-xs font-mono ${
                  duration === d 
                    ? 'bg-zinc-900 dark:bg-white text-zinc-100 dark:text-black'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {d}M
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className={`font-display text-8xl md:text-9xl leading-none tabular-nums ${
          isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'
        }`}>
          {String(minutes).padStart(2, '0')}
          <span className="text-zinc-300 dark:text-zinc-700">:</span>
          {String(seconds).padStart(2, '0')}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1 bg-zinc-200 dark:bg-zinc-900 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${isActive ? 'bg-emerald-500' : 'bg-zinc-400 dark:bg-zinc-700'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={toggle}
          className={`btn flex-1 ${isActive ? 'btn-ghost' : 'btn-primary'}`}
        >
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button
          onClick={reset}
          className="btn btn-ghost"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
