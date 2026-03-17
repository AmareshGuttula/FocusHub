"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { calculateLevel, UserLevel } from "@/lib/streakData";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  university: string;
  totalPoints: number;
  dailyTasksCompleted: number;
  dailyGoal: number;
  streakFreezeAvailable: boolean;
  soundEnabled: boolean;
  notifications: Record<string, boolean>;
  theme: "light" | "dark" | "ultra-dark";
}

interface UserContextType {
  profile: UserProfile;
  levelInfo: UserLevel;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addPoints: (amount: number) => void;
  completeTask: () => void;
  completePomodoro: () => void;
  isProfileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Student",
    email: "student@university.edu",
    avatar: "🦊",
    university: "State University",
    totalPoints: 240, // Start with some points for demo
    dailyTasksCompleted: 2,
    dailyGoal: 5,
    streakFreezeAvailable: true,
    soundEnabled: true,
    notifications: {
      task_reminders: true,
      exam_alerts: true,
      weekly_summary: false,
      pomodoro_sounds: true,
    },
    theme: "light",
  });
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sync theme with HTML document class
  useEffect(() => {
    // First, clean up existing theme classes
    document.documentElement.classList.remove("dark", "ultra-dark");

    // Reapply based on active state
    if (profile.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (profile.theme === "ultra-dark") {
      document.documentElement.classList.add("dark", "ultra-dark");
    }
  }, [profile.theme]);

  const levelInfo = calculateLevel(profile.totalPoints);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addPoints = (amount: number) => {
    setProfile((prev) => ({ ...prev, totalPoints: prev.totalPoints + amount }));
  };

  const completeTask = () => {
    setProfile((prev) => {
      const newTasks = prev.dailyTasksCompleted + 1;
      let newPoints = prev.totalPoints + 10; // 10 points per task
      
      // Daily goal bonus
      if (newTasks === prev.dailyGoal) {
        newPoints += 30;
      }
      
      return {
        ...prev,
        dailyTasksCompleted: newTasks,
        totalPoints: newPoints
      };
    });
  };

  const completePomodoro = () => {
    addPoints(15); // 15 points per Pomodoro
  };

  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);

  return (
    <UserContext.Provider value={{ 
      profile, 
      levelInfo,
      updateProfile, 
      addPoints, 
      completeTask,
      completePomodoro,
      isProfileOpen, 
      openProfile, 
      closeProfile 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
