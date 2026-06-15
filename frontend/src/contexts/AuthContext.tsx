import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'cv_users';
const TOKEN_KEY = 'cv_token';
const USER_KEY  = 'cv_user';

const getUsers = (): Record<string, { name: string; password: string }> => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); }
  catch { return {}; }
};

const makeUser = (name: string, email: string): User => ({
  _id: 'u_' + Math.random().toString(36).slice(2),
  name,
  email,
  subscription: 'premium',
  watchlist: [],
  watchHistory: [],
  createdAt: new Date().toISOString(),
});

// Seed demo account
(() => {
  const users = getUsers();
  if (!users['demo@kiroflix.uz']) {
    users['demo@kiroflix.uz'] = { name: 'Demo Foydalanuvchi', password: 'demo123' };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
})();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]     = useState<User | null>(null);
  const [token, setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t && u) {
      try { setToken(t); setUser(JSON.parse(u)); } catch {}
    }
    setLoading(false);
  }, []);

  const save = (tkn: string, usr: User) => {
    setToken(tkn); setUser(usr);
    localStorage.setItem(TOKEN_KEY, tkn);
    localStorage.setItem(USER_KEY, JSON.stringify(usr));
  };

  const login = async (email: string, password: string) => {
    // Small delay to feel real
    await new Promise(r => setTimeout(r, 600));
    const users = getUsers();
    const found = users[email.toLowerCase()];
    if (!found || found.password !== password) {
      throw { response: { data: { message: "Email yoki parol noto'g'ri" } } };
    }
    save('token_' + Date.now(), makeUser(found.name, email));
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise(r => setTimeout(r, 600));
    const users = getUsers();
    if (users[email.toLowerCase()]) {
      throw { response: { data: { message: "Bu email allaqachon ro'yxatdan o'tgan" } } };
    }
    users[email.toLowerCase()] = { name, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    save('token_' + Date.now(), makeUser(name, email));
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('cv_is_demo');
    localStorage.removeItem('cv_plan_active');
    localStorage.removeItem('cv_plan_name');
  };

  const updateUser = (u: User) => {
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

