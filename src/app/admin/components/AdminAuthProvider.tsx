'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export type AdminRole = 'viewer' | 'admin' | 'super_admin';

export type AdminProfile = {
  id: string | null;
  name: string;
  email: string | null;
  role: AdminRole;
  isSuper: boolean;
};

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated' | 'invalid';

type AdminAuthContextValue = {
  token: string;
  status: AuthStatus;
  error: string | null;
  isBusy: boolean;
  profile: AdminProfile | null;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);
const STORAGE_KEY = '720d_admin_token';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  const validateToken = async (value: string) => {
    if (!value) {
      setStatus('unauthenticated');
      setError(null);
      setProfile(null);
      return false;
    }

    setIsBusy(true);
    setStatus('checking');
    setError(null);

    try {
      const response = await fetch('/api/admin/me', {
        headers: {
          'x-admin-token': value,
        },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setStatus('invalid');
        setError(data?.error || 'Invalid admin token');
        localStorage.removeItem(STORAGE_KEY);
        setToken('');
        setProfile(null);
        return false;
      }

      const data = await response.json();
      const user = data?.data?.user;
      const role = data?.data?.role ?? 'viewer';
      const isSuper = Boolean(data?.data?.isSuper);

      setProfile({
        id: user?.id ?? null,
        name: user?.name ?? 'Super Admin',
        email: user?.email ?? null,
        role,
        isSuper,
      });
      setStatus('authenticated');
      setError(null);
      return true;
    } catch (err) {
      setStatus('invalid');
      setError(err instanceof Error ? err.message : 'Unable to validate token');
      localStorage.removeItem(STORAGE_KEY);
      setToken('');
      setProfile(null);
      return false;
    } finally {
      setIsBusy(false);
    }
  };

  const login = async (value: string) => {
    setIsBusy(true);
    setError(null);
    setStatus('checking');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'x-admin-token': value,
        },
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setStatus('invalid');
        setError(data?.error || 'Invalid admin token');
        setProfile(null);
        return false;
      }

      const user = data?.data?.user;
      const role = data?.data?.role ?? 'viewer';
      const isSuper = Boolean(data?.data?.isSuper);
      setProfile({
        id: user?.id ?? null,
        name: user?.name ?? 'Super Admin',
        email: user?.email ?? null,
        role,
        isSuper,
      });
      setStatus('authenticated');
      setError(null);
      localStorage.setItem(STORAGE_KEY, value);
      setToken(value);
      return true;
    } catch (err) {
      setStatus('invalid');
      setError(err instanceof Error ? err.message : 'Unable to validate token');
      setProfile(null);
      return false;
    } finally {
      setIsBusy(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken('');
    setStatus('unauthenticated');
    setError(null);
    setProfile(null);
  };

  const refresh = async () => {
    if (!token) return;
    await validateToken(token);
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || '';
    if (!stored) {
      setStatus('unauthenticated');
      return;
    }
    setToken(stored);
    void validateToken(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    token,
    status,
    error,
    isBusy,
    profile,
    login,
    logout,
    refresh,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
