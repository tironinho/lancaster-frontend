import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY_TOKEN = "ns_auth_token";
const KEY_USER  = "ns_auth_user";

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(KEY_TOKEN) ?? sessionStorage.getItem(KEY_TOKEN);
    const stored = localStorage.getItem(KEY_USER) ?? sessionStorage.getItem(KEY_USER);
    if (token && stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password, remember }) => {
    const ok = /\S+@\S+\.\S+/.test(email) && String(password).length >= 6;
    await new Promise(r => setTimeout(r, 500));
    if (!ok) throw new Error("Credenciais inválidas.");

    const token = "mock-token-" + Date.now();
    const userObj = { email, name: "Cliente New Store" };

    const store = remember ? localStorage : sessionStorage;
    store.setItem(KEY_TOKEN, token);
    store.setItem(KEY_USER, JSON.stringify(userObj));
    setUser(userObj);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
    sessionStorage.removeItem(KEY_TOKEN);
    sessionStorage.removeItem(KEY_USER);
    setUser(null);
  };

  const value = useMemo(
    () => ({ isAuthenticated: !!user, user, login, logout, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
