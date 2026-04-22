import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("comparex_token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));

  useEffect(() => {
    if (token) {
      localStorage.setItem("comparex_token", token);
      setAuthToken(token);
      loadProfile();
    } else {
      localStorage.removeItem("comparex_token");
      setAuthToken(null);
      setUser(null);
      setIsLoading(false);
    }
  }, [token]);

  const loadProfile = async () => {
    try {
      const { data } = await api.get("/api/user/profile");
      setUser(data.user);
    } catch (_error) {
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload) => {
    const { data } = await api.post("/api/auth/signup", payload);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (payload) => {
    const { data } = await api.post("/api/auth/login", payload);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (_error) {
      // Intentionally ignored: logout should complete on client regardless.
    }
    setToken(null);
  };

  const value = useMemo(
    () => ({ token, user, isLoading, signup, login, logout, refreshProfile: loadProfile }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
