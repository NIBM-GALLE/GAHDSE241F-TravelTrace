// src/context/UserAuthContext.tsx
// ──────────────────────────────────────────────────────────────
// Provides user authentication state across the public web app.
// Calls the same Spring Boot backend that the mobile app uses
// (POST /api/auth/login and POST /api/users).
// Session is stored in sessionStorage (cleared when the tab closes).
// ──────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://192.168.43.62:5000/api';
const SESSION_KEY = 'tt_user_session';

// ── User shape ────────────────────────────────────────────────
export interface WebUser {
  id: number;
  username: string;
  email: string;
  profileImageUrl: string | null;
}

// ── Context shape ────────────────────────────────────────────
interface UserAuthContextType {
  user: WebUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────
export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WebUser | null>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  /** Persist user to sessionStorage */
  const persist = (u: WebUser | null) => {
    try {
      if (u) sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
      else sessionStorage.removeItem(SESSION_KEY);
    } catch { /* noop */ }
  };

  // ── Login ──────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const webUser: WebUser = {
          id: data.id,
          username: data.username,
          email: data.email,
          profileImageUrl: data.profileImageUrl ?? null,
        };
        setUser(webUser);
        persist(webUser);
        return { ok: true, message: 'Login successful!' };
      }

      // Handle error responses
      const body = await res.text();
      if (res.status === 403) return { ok: false, message: 'Your account has been suspended.' };
      if (res.status === 404) return { ok: false, message: 'No account found with this email.' };
      if (res.status === 401) return { ok: false, message: 'Incorrect password.' };
      return { ok: false, message: body || 'Login failed.' };
    } catch {
      return { ok: false, message: 'Network error. Please try again.' };
    }
  }, []);

  // ── Register ───────────────────────────────────────────────
  const register = useCallback(async (data: RegisterData) => {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.status === 201) {
        const created = await res.json();
        const webUser: WebUser = {
          id: created.id,
          username: created.username,
          email: created.email,
          profileImageUrl: created.profileImageUrl ?? null,
        };
        setUser(webUser);
        persist(webUser);
        return { ok: true, message: 'Account created successfully!' };
      }

      if (res.status === 409) return { ok: false, message: 'This email is already registered.' };
      const body = await res.text();
      return { ok: false, message: body || 'Registration failed.' };
    } catch {
      return { ok: false, message: 'Network error. Please try again.' };
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    persist(null);
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────
export function useUserAuth(): UserAuthContextType {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error('useUserAuth must be used inside <UserAuthProvider>');
  return ctx;
}
