// src/context/AdminAuthContext.tsx
// ──────────────────────────────────────────────────────────────
// Provides admin authentication state across the app.
// Credentials are validated client-side against a hardcoded pair.
// Session is stored in sessionStorage (cleared when the tab closes).
// ──────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ── Hardcoded admin credentials ──────────────────────────────
const ADMIN_EMAIL = 'traveltraceadmin222@gmail.com';
const ADMIN_PASSWORD = 'Traveltrace_222@Admin';
const SESSION_KEY = 'tt_admin_authed';

// ── Context shape ────────────────────────────────────────────
interface AdminAuthContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const login = useCallback((email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try { sessionStorage.setItem(SESSION_KEY, 'true'); } catch { /* noop */ }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────
export function useAdminAuth(): AdminAuthContextType {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  return ctx;
}
