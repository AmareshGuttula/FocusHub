"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { calculateLevel, UserLevel } from "@/lib/streakData";
import {
  fakeGetSession,
  fakeSignUp,
  fakeSignIn,
  fakeSignOut,
  fakeUpdateUser,
  FakeUser,
  getUserDataKey,
} from "@/lib/fakeAuth";

/* ─── Interfaces ─── */

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  totalPoints: number;
  dailyTasksCompleted: number;
  dailyGoal: number;
  dailyTasksAdded: number;
  streakFreezeAvailable: boolean;
  soundEnabled: boolean;
  notifications: Record<string, boolean>;
  theme: "light" | "dark" | "ultra-dark";
  isLoggedIn: boolean;
  isPro: boolean;
  isOnboarded: boolean;
  userGoal: string;
}

export interface DailyMissions {
  tasks_completed_today: number;
  focus_minutes_today: number;
  streak_maintained: boolean;
  reward_claimed: boolean;
  date: string;
}

export interface DailyActivity {
  tasks_completed_count: number;
  streak_completed: boolean;
  streak_reward_given: boolean;
  date: string;
}

interface UserContextType {
  profile: UserProfile;
  levelInfo: UserLevel;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addPoints: (amount: number) => void;
  completeTask: () => void;
  completePomodoro: () => void;

  // Auth
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string; needsPassword?: boolean }>;
  signup: (name: string, email: string, password: string | null) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  currentUser: FakeUser | null;

  isProfileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;

  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;

  isPricingModalOpen: boolean;
  openPricingModal: () => void;
  closePricingModal: () => void;

  missions: DailyMissions;
  addFocusMinutes: (minutes: number) => void;
  claimDailyReward: () => void;

  dailyActivity: DailyActivity;
  streakRewardMsg: string | null;
  setStreakRewardMsg: (msg: string | null) => void;

  checkAction: (action: () => void, requiresPro?: boolean) => void;
  incrementDailyTasksAdded: () => boolean;
  upgradeToPro: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  name: "Student",
  email: "",
  avatar: "🦊",
  totalPoints: 0,
  dailyTasksCompleted: 0,
  dailyGoal: 5,
  dailyTasksAdded: 0,
  streakFreezeAvailable: true,
  soundEnabled: true,
  notifications: {
    task_reminders: true,
    exam_alerts: true,
    weekly_summary: false,
    pomodoro_sounds: true,
  },
  theme: "light",
  isLoggedIn: false,
  isPro: false,
  isOnboarded: false,
  userGoal: "",
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [currentUser, setCurrentUser] = useState<FakeUser | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const [missions, setMissions] = useState<DailyMissions>({
    tasks_completed_today: 0,
    focus_minutes_today: 0,
    streak_maintained: false,
    reward_claimed: false,
    date: todayStr,
  });

  const [dailyActivity, setDailyActivity] = useState<DailyActivity>({
    tasks_completed_count: 0,
    streak_completed: false,
    streak_reward_given: false,
    date: todayStr,
  });

  const [streakRewardMsg, setStreakRewardMsg] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  /* ─── Theme handling ─── */
  useEffect(() => {
    document.documentElement.classList.remove("dark", "ultra-dark");
    if (profile.theme === "dark") document.documentElement.classList.add("dark");
    else if (profile.theme === "ultra-dark") document.documentElement.classList.add("dark", "ultra-dark");
  }, [profile.theme]);

  /* ─── Load session on mount ─── */
  useEffect(() => {
    const session = fakeGetSession();
    if (session) {
      loadUserProfile(session);
    }
  }, []);

  /* ─── Midnight Reset ─── */
  useEffect(() => {
    const checkDate = () => {
      const now = new Date().toISOString().split("T")[0];
      if (now !== missions.date) {
        setMissions({
          tasks_completed_today: 0,
          focus_minutes_today: 0,
          streak_maintained: false,
          reward_claimed: false,
          date: now,
        });
        setDailyActivity({
          tasks_completed_count: 0,
          streak_completed: false,
          streak_reward_given: false,
          date: now,
        });
        setProfile((prev) => ({
          ...prev,
          dailyTasksCompleted: 0,
          dailyTasksAdded: 0,
        }));
        // Save reset data
        if (currentUser) {
          saveUserData(currentUser.id);
        }
      }
    };

    const interval = setInterval(checkDate, 60000);
    return () => clearInterval(interval);
  }, [missions.date, currentUser]);

  /* ─── Persistence helpers ─── */
  const saveUserData = useCallback(
    (userId: string) => {
      try {
        const dataToSave = {
          profile: {
            avatar: profile.avatar,
            totalPoints: profile.totalPoints,
            dailyGoal: profile.dailyGoal,
            theme: profile.theme,
            soundEnabled: profile.soundEnabled,
            notifications: profile.notifications,
          },
          missions,
          dailyActivity,
        };
        localStorage.setItem(getUserDataKey(userId, "data"), JSON.stringify(dataToSave));
      } catch {}
    },
    [profile, missions, dailyActivity]
  );

  // Auto-save whenever profile/missions change
  useEffect(() => {
    if (currentUser) {
      saveUserData(currentUser.id);
    }
  }, [profile.totalPoints, profile.avatar, profile.theme, profile.dailyGoal, missions, dailyActivity, currentUser, saveUserData]);

  const loadUserProfile = (user: FakeUser) => {
    setCurrentUser(user);

    // Load saved data
    let savedData: any = null;
    try {
      const raw = localStorage.getItem(getUserDataKey(user.id, "data"));
      if (raw) savedData = JSON.parse(raw);
    } catch {}

    setProfile({
      name: user.name,
      email: user.email,
      avatar: savedData?.profile?.avatar || user.avatar || "🦊",
      totalPoints: savedData?.profile?.totalPoints ?? user.total_points ?? 0,
      dailyTasksCompleted: 0,
      dailyGoal: user.daily_goal || 5,
      dailyTasksAdded: 0,
      streakFreezeAvailable: true,
      soundEnabled: savedData?.profile?.soundEnabled ?? true,
      notifications: savedData?.profile?.notifications ?? {
        task_reminders: true,
        exam_alerts: true,
        weekly_summary: false,
        pomodoro_sounds: true,
      },
      theme: savedData?.profile?.theme || "light",
      isLoggedIn: true,
      isPro: user.plan_type === "pro",
      isOnboarded: user.is_onboarded,
      userGoal: user.user_goal || "",
    });

    // Load today's missions if same date
    if (savedData?.missions?.date === todayStr) {
      setMissions(savedData.missions);
    }
    if (savedData?.dailyActivity?.date === todayStr) {
      setDailyActivity(savedData.dailyActivity);
    }
  };

  /* ─── Auth methods ─── */
  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string; needsPassword?: boolean }> => {
    const result = fakeSignIn(email, password);
    if (result.error === "PASSWORD_REQUIRED") {
      return { success: false, needsPassword: true };
    }
    if (result.error || !result.user) {
      return { success: false, error: result.error || "Login failed." };
    }
    loadUserProfile(result.user);
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    password: string | null
  ): Promise<{ success: boolean; error?: string }> => {
    const result = fakeSignUp(name, email, password);
    if (result.error || !result.user) {
      return { success: false, error: result.error || "Signup failed." };
    }
    loadUserProfile(result.user);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      saveUserData(currentUser.id);
    }
    fakeSignOut();
    setCurrentUser(null);
    setProfile(DEFAULT_PROFILE);
    setMissions({
      tasks_completed_today: 0,
      focus_minutes_today: 0,
      streak_maintained: false,
      reward_claimed: false,
      date: todayStr,
    });
    setDailyActivity({
      tasks_completed_count: 0,
      streak_completed: false,
      streak_reward_given: false,
      date: todayStr,
    });
  };

  const upgradeToPro = () => {
    fakeUpdateUser({ plan_type: "pro" });
    setProfile((prev) => ({ ...prev, isPro: true }));
    if (currentUser) {
      setCurrentUser({ ...currentUser, plan_type: "pro" });
    }
  };

  /* ─── Profile / Points ─── */
  const levelInfo = calculateLevel(profile.totalPoints);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    // Sync name/avatar changes to fake auth
    if (updates.name || updates.avatar) {
      fakeUpdateUser({
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.avatar ? { avatar: updates.avatar } : {}),
      });
      if (currentUser) {
        setCurrentUser((prev) =>
          prev ? { ...prev, ...(updates.name ? { name: updates.name } : {}), ...(updates.avatar ? { avatar: updates.avatar } : {}) } : prev
        );
      }
    }
  };

  const addPoints = (amount: number) => {
    setProfile((prev) => ({ ...prev, totalPoints: prev.totalPoints + amount }));
    if (currentUser) {
      fakeUpdateUser({ total_points: (currentUser.total_points || 0) + amount });
    }
  };

  const completeTask = () => {
    setProfile((prev) => {
      const newTasks = prev.dailyTasksCompleted + 1;
      let newPoints = prev.totalPoints + 10;
      if (newTasks === prev.dailyGoal) newPoints += 30;
      return { ...prev, dailyTasksCompleted: newTasks, totalPoints: newPoints };
    });

    setMissions((prev) => ({
      ...prev,
      tasks_completed_today: prev.tasks_completed_today + 1,
      streak_maintained: true,
    }));

    setDailyActivity((prev) => {
      const isFirstTask = prev.tasks_completed_count === 0;
      const shouldGiveReward = isFirstTask && !prev.streak_reward_given;

      if (shouldGiveReward) {
        addPoints(15);
        setStreakRewardMsg("🔥 Streak maintained today +15 points earned");
        setTimeout(() => setStreakRewardMsg(null), 5000);
      }

      return {
        ...prev,
        tasks_completed_count: prev.tasks_completed_count + 1,
        streak_completed: true,
        streak_reward_given: prev.streak_reward_given || shouldGiveReward,
      };
    });
  };

  const addFocusMinutes = (minutes: number) => {
    setMissions((prev) => ({
      ...prev,
      focus_minutes_today: prev.focus_minutes_today + minutes,
    }));
  };

  const completePomodoro = () => {
    addPoints(25);
    addFocusMinutes(25);
  };

  const claimDailyReward = () => {
    if (missions.reward_claimed) return;
    const allCompleted =
      missions.tasks_completed_today >= 3 &&
      missions.focus_minutes_today >= 60 &&
      missions.streak_maintained;

    if (allCompleted) {
      addPoints(50);
      setMissions((prev) => ({ ...prev, reward_claimed: true }));
    }
  };

  const checkAction = (action: () => void, requiresPro = false) => {
    if (!profile.isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    if (requiresPro && !profile.isPro) {
      setIsPricingModalOpen(true);
      return;
    }
    action();
  };

  const incrementDailyTasksAdded = () => {
    if (!profile.isPro && profile.dailyTasksAdded >= 5) {
      setIsPricingModalOpen(true);
      return false;
    }
    setProfile((prev) => ({ ...prev, dailyTasksAdded: prev.dailyTasksAdded + 1 }));
    return true;
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        levelInfo,
        updateProfile,
        addPoints,
        completeTask,
        completePomodoro,
        login,
        signup,
        logout,
        currentUser,
        isProfileOpen,
        openProfile: () => setIsProfileOpen(true),
        closeProfile: () => setIsProfileOpen(false),
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        isPricingModalOpen,
        openPricingModal: () => setIsPricingModalOpen(true),
        closePricingModal: () => setIsPricingModalOpen(false),
        checkAction,
        incrementDailyTasksAdded,
        missions,
        addFocusMinutes,
        claimDailyReward,
        dailyActivity,
        streakRewardMsg,
        setStreakRewardMsg,
        upgradeToPro,
      }}
    >
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
