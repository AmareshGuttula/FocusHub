"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";

/* ─── Types ─── */

export type SessionType = "focus" | "break";

export interface PomodoroState {
  isRunning: boolean;
  timeRemaining: number;
  sessionType: SessionType;
  focusMins: number;
  breakMins: number;
  sessions: number;
  startTime: number | null;  // timestamp when timer started
  duration: number;           // total duration of current segment in seconds
}

interface PomodoroContextType {
  state: PomodoroState;
  start: () => void;
  pause: () => void;
  reset: () => void;
  switchMode: (mode: SessionType) => void;
  applySettings: (focusMins: number, breakMins: number) => void;
  clearTimer: () => void; // for logout
}

const STORAGE_KEY = "pomodoro_timer";

const DEFAULT_STATE: PomodoroState = {
  isRunning: false,
  timeRemaining: 25 * 60,
  sessionType: "focus",
  focusMins: 25,
  breakMins: 5,
  sessions: 0,
  startTime: null,
  duration: 25 * 60,
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

/* ─── Helpers ─── */

function saveState(state: PomodoroState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function loadState(): PomodoroState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* ─── Provider ─── */

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PomodoroState>(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load from localStorage on mount — resume if was running
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (saved.isRunning && saved.startTime) {
        // Calculate elapsed time since timer was started
        const elapsed = Math.floor((Date.now() - saved.startTime) / 1000);
        const remaining = Math.max(0, saved.duration - elapsed);

        if (remaining > 0) {
          setState({ ...saved, timeRemaining: remaining });
        } else {
          // Timer expired while user was away
          setState({
            ...saved,
            isRunning: false,
            timeRemaining: 0,
            startTime: null,
          });
        }
      } else {
        setState(saved);
      }
    }
    setMounted(true);
  }, []);

  // Single interval — tick every second
  useEffect(() => {
    if (!mounted) return;

    if (state.isRunning && state.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const newTime = prev.timeRemaining - 1;

          if (newTime <= 0) {
            // Timer finished
            let nextState: PomodoroState;
            if (prev.sessionType === "focus") {
              const newDuration = prev.breakMins * 60;
              nextState = {
                ...prev,
                isRunning: false,
                timeRemaining: newDuration,
                sessionType: "break",
                sessions: prev.sessions + 1,
                startTime: null,
                duration: newDuration,
              };
            } else {
              const newDuration = prev.focusMins * 60;
              nextState = {
                ...prev,
                isRunning: false,
                timeRemaining: newDuration,
                sessionType: "focus",
                startTime: null,
                duration: newDuration,
              };
            }
            saveState(nextState);
            return nextState;
          }

          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning, mounted]);

  // Save to localStorage whenever state changes (but not on every tick — debounced via key changes)
  useEffect(() => {
    if (mounted) {
      saveState(state);
    }
  }, [state.isRunning, state.sessionType, state.sessions, state.focusMins, state.breakMins, mounted]);

  // Also save periodically while running (every 5 seconds) for crash recovery
  useEffect(() => {
    if (!state.isRunning || !mounted) return;
    const saveInterval = setInterval(() => {
      saveState(stateRef.current);
    }, 5000);
    return () => clearInterval(saveInterval);
  }, [state.isRunning, mounted]);

  /* ─── Actions ─── */

  const start = useCallback(() => {
    setState((prev) => {
      const newState = {
        ...prev,
        isRunning: true,
        startTime: Date.now(),
        duration: prev.timeRemaining, // remaining becomes the new duration to track
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const pause = useCallback(() => {
    setState((prev) => {
      const newState = {
        ...prev,
        isRunning: false,
        startTime: null,
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const reset = useCallback(() => {
    setState((prev) => {
      const duration = prev.sessionType === "focus" ? prev.focusMins * 60 : prev.breakMins * 60;
      const newState = {
        ...prev,
        isRunning: false,
        timeRemaining: duration,
        startTime: null,
        duration,
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const switchMode = useCallback((mode: SessionType) => {
    setState((prev) => {
      const duration = mode === "focus" ? prev.focusMins * 60 : prev.breakMins * 60;
      const newState = {
        ...prev,
        isRunning: false,
        sessionType: mode,
        timeRemaining: duration,
        startTime: null,
        duration,
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const applySettings = useCallback((focusMins: number, breakMins: number) => {
    setState((prev) => {
      const duration = prev.sessionType === "focus" ? focusMins * 60 : breakMins * 60;
      const newState = {
        ...prev,
        focusMins,
        breakMins,
        isRunning: false,
        timeRemaining: duration,
        startTime: null,
        duration,
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
  }, []);

  return (
    <PomodoroContext.Provider
      value={{ state, start, pause, reset, switchMode, applySettings, clearTimer }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within PomodoroProvider");
  }
  return context;
}
