// Mock database layer for streak system
// In production, replace with real API calls

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  tasksCompleted: number;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
}

export interface Achievement {
  id: string;
  type: "streak" | "tasks";
  title: string;
  description: string;
  icon: "flame" | "trophy" | "star" | "target";
  threshold: number;
  achievedAt: string | null;
}

// Simple deterministic random
function seededRandom(seedStr: string): number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) hash = Math.imul(31, hash) + seedStr.charCodeAt(i) | 0;
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

// ---- Generate mock activity data for last 90 days ---- //

function generateMockActivity(): DailyActivity[] {
  const activities: DailyActivity[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Simulate realistic activity: weekdays more active, some rest days
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Deterministic random based on date string so server matches client perfectly
    const rand = seededRandom(dateStr + "-rand");
    
    let tasks = 0;
    if (i <= 7) {
      // Last 7 days — active streak
      tasks = Math.floor(seededRandom(dateStr + "-streak") * 4) + 1;
    } else if (isWeekend) {
      tasks = rand > 0.4 ? 0 : Math.floor(seededRandom(dateStr + "-weekend") * 3) + 1;
    } else {
      tasks = rand > 0.15 ? Math.floor(seededRandom(dateStr + "-weekday") * 5) + 1 : 0;
    }

    activities.push({ date: dateStr, tasksCompleted: tasks });
  }

  return activities;
}

// ---- Calculate streak from activity data ---- //

export function calculateStreak(activities: DailyActivity[]): UserStreak {
  const sorted = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastCompletedDate = "";

  // Current streak — count consecutive days from today backward
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split("T")[0];

    const entry = sorted.find((a) => a.date === expectedStr);
    if (entry && entry.tasksCompleted > 0) {
      currentStreak++;
      if (i === 0) lastCompletedDate = entry.date;
    } else {
      break;
    }
  }

  // Longest streak — scan all activities chronologically
  const chronological = [...activities].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (let i = 0; i < chronological.length; i++) {
    if (chronological[i].tasksCompleted > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  if (currentStreak > longestStreak) longestStreak = currentStreak;

  return { currentStreak, longestStreak, lastCompletedDate };
}

// ---- Level Calculation Logic ---- //

export interface UserLevel {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  progressPercentage: number;
}

export function calculateLevel(points: number): UserLevel {
  if (points < 100) return { level: 1, title: "Beginner", minPoints: 0, maxPoints: 100, progressPercentage: (points / 100) * 100 };
  if (points < 300) return { level: 2, title: "Focused", minPoints: 100, maxPoints: 300, progressPercentage: ((points - 100) / 200) * 100 };
  if (points < 700) return { level: 3, title: "Consistent", minPoints: 300, maxPoints: 700, progressPercentage: ((points - 300) / 400) * 100 };
  return { level: 4, title: "Discipline Master", minPoints: 700, maxPoints: 700, progressPercentage: 100 }; // Max level
}

// ---- Achievement definitions ---- //

export function getAchievements(
  streak: UserStreak,
  totalTasks: number
): Achievement[] {
  const now = new Date().toISOString();

  return [
    {
      id: "starter",
      type: "tasks",
      title: "Starter",
      description: "Completed your first task",
      icon: "flame",
      threshold: 1,
      achievedAt: totalTasks >= 1 ? now : null,
    },
    {
      id: "getting-serious",
      type: "tasks",
      title: "Getting Serious",
      description: "Completed 10 tasks",
      icon: "star",
      threshold: 10,
      achievedAt: totalTasks >= 10 ? now : null,
    },
    {
      id: "deep-worker",
      type: "tasks",
      title: "Deep Worker",
      description: "Completed 50 tasks",
      icon: "target",
      threshold: 50,
      achievedAt: totalTasks >= 50 ? now : null,
    },
    {
      id: "consistent",
      type: "streak",
      title: "Consistent",
      description: "7-day study streak",
      icon: "flame",
      threshold: 7,
      achievedAt: streak.longestStreak >= 7 ? now : null,
    },
    {
      id: "unstoppable",
      type: "streak",
      title: "Unstoppable",
      description: "30-day study streak",
      icon: "trophy",
      threshold: 30,
      achievedAt: streak.longestStreak >= 30 ? now : null,
    },
  ];
}

// ---- Color levels for contribution grid ---- //

export function getActivityLevel(tasks: number): number {
  if (tasks === 0) return 0;
  if (tasks === 1) return 1;
  if (tasks <= 3) return 2;
  return 3;
}

export const levelColors = [
  "var(--grid-lvl-0, #ebedf0)", // 0 tasks
  "var(--grid-lvl-1, #9be9a8)", // 1 task
  "var(--grid-lvl-2, #40c463)", // 2-3 tasks
  "var(--grid-lvl-3, #216e39)", // 4+ tasks
];

// ---- Singleton mock data ---- //

export const mockActivity = generateMockActivity();
export const mockStreak = calculateStreak(mockActivity);
export const mockTotalTasks = mockActivity.reduce((sum, a) => sum + a.tasksCompleted, 0);
export const mockAchievements = getAchievements(mockStreak, mockTotalTasks);
