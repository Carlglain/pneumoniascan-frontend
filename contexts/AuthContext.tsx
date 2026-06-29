'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://carlstorm-pneumoniascan-backend.hf.space';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

interface AuthContextValue {
  token:    string | null;
  username: string | null;
  login:    (username: string, password: string) => Promise<void>;
  logout:   () => void;
}

const AuthContext = createContext<AuthContextValue>({
  token: null, username: null, login: async () => {}, logout: () => {},
});

function setAuthCookie(token: string) {
  document.cookie = `auth-token=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function clearAuthCookie() {
  document.cookie = 'auth-token=; path=/; max-age=0';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken]       = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem('auth-token');
    const u = localStorage.getItem('auth-username');
    if (t) { setToken(t); setUsername(u); }
  }, []);

  const login = async (user: string, password: string) => {
    const body = new URLSearchParams({ username: user, password });
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail ?? 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('auth-token', data.access_token);
    localStorage.setItem('auth-username', user);
    setAuthCookie(data.access_token);
    setToken(data.access_token);
    setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-username');
    clearAuthCookie();
    setToken(null);
    setUsername(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
