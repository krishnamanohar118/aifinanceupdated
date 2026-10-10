import { createContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
export const AuthContext = createContext(null);

const TOKEN_KEY = "finance_token";
const USER_KEY = "finance_user";

function readStoredUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function saveSession(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
      const token = localStorage.getItem(TOKEN_KEY);
      return token ? readStoredUser() : null;
    }),
    [loading, setLoading] = useState(true);

  const setUser = (nextUser) => {
    setUserState(nextUser);
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      clearSession();
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((r) => setUser(r.data.user))
      .catch((error) => {
        if (error?.status === 401) {
          clearSession();
          setUserState(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(values) {
        const r = await api.post("/auth/login", values);
        saveSession(r.data.token, r.data.user);
        setUserState(r.data.user);
      },
      async register(values) {
        const r = await api.post("/auth/register", values);
        saveSession(r.data.token, r.data.user);
        setUserState(r.data.user);
      },
      async logout() {
        try {
          await api.post("/auth/logout");
        } finally {
          clearSession();
          setUserState(null);
        }
      },
      setUser,
    }),
    [user, loading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
