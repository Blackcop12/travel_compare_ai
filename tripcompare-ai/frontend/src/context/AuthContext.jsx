import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("tripcompare_token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("tripcompare_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("tripcompare_token");
      localStorage.removeItem("tripcompare_user");
      return;
    }

    localStorage.setItem("tripcompare_token", token);
    if (user) {
      localStorage.setItem("tripcompare_user", JSON.stringify(user));
    }
  }, [token, user]);

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("tripcompare_token");
    localStorage.removeItem("tripcompare_user");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      signup,
      login,
      logout,
    }),
    [token, user]
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
