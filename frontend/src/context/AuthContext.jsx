import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest, signup as signupRequest } from '../services/authApi.js';

const AuthContext = createContext(null);

function getInitialToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('auth_token');
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getInitialToken);
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const saveSession = (session) => {
    setToken(session.token);
    setUser(session.user);
    window.localStorage.setItem('auth_token', session.token);
    window.localStorage.setItem('auth_user', JSON.stringify(session.user));
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem('auth_token');
    window.localStorage.removeItem('auth_user');
  };

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    saveSession(response);
    return response.user;
  };

  const signup = async (payload) => {
    const response = await signupRequest(payload);
    saveSession(response);
    return response.user;
  };

  const value = useMemo(
    () => ({ token, user, login, signup, logout: clearSession }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
