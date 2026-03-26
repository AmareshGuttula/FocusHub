/**
 * Fake Auth Service — localStorage-based, Supabase-ready structure.
 * Replace these functions with real Supabase calls later without changing logic.
 */

export interface FakeUser {
  id: string;
  name: string;
  email: string;
  password: string | null;
  avatar: string;
  plan_type: "free" | "pro";
  is_onboarded: boolean;
  daily_goal: number;
  user_goal: string;
  total_points: number;
  created_at: string;
  last_login: string;
}

const USERS_KEY = "focushub_users";
const SESSION_KEY = "focushub_session";

function generateId(): string {
  return "u_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function getUsers(): FakeUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: FakeUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(user: FakeUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ─── Public API ─── */

export function fakeSignUp(
  name: string,
  email: string,
  password: string | null
): { user: FakeUser | null; error: string | null } {
  const users = getUsers();

  // Check if email already exists
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return { user: null, error: "An account with this email already exists." };
  }

  const newUser: FakeUser = {
    id: generateId(),
    name,
    email: email.toLowerCase().trim(),
    password,
    avatar: "🦊",
    plan_type: "free",
    is_onboarded: true,
    daily_goal: 5,
    user_goal: "",
    total_points: 0,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  saveSession(newUser);

  return { user: newUser, error: null };
}

export function fakeSignIn(
  email: string,
  password?: string
): { user: FakeUser | null; error: string | null } {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user) {
    return { user: null, error: "No account found with this email." };
  }

  // If user has a password, validate it
  if (user.password) {
    if (!password) {
      return { user: null, error: "PASSWORD_REQUIRED" };
    }
    if (user.password !== password) {
      return { user: null, error: "Incorrect password." };
    }
  }

  // Update last login
  user.last_login = new Date().toISOString();
  saveUsers(users);
  saveSession(user);

  return { user, error: null };
}

export function fakeSignOut() {
  clearSession();
}

export function fakeGetSession(): FakeUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function fakeUpdateUser(updates: Partial<FakeUser>): FakeUser | null {
  const session = fakeGetSession();
  if (!session) return null;

  const users = getUsers();
  const idx = users.findIndex((u) => u.id === session.id);
  if (idx === -1) return null;

  const updated = { ...users[idx], ...updates };
  users[idx] = updated;
  saveUsers(users);
  saveSession(updated);

  return updated;
}

/** Check if an email exists and whether it has a password */
export function fakeCheckEmail(email: string): { exists: boolean; hasPassword: boolean } {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) return { exists: false, hasPassword: false };
  return { exists: true, hasPassword: !!user.password };
}

/** Get user-specific data store key */
export function getUserDataKey(userId: string, key: string): string {
  return `focushub_${userId}_${key}`;
}
