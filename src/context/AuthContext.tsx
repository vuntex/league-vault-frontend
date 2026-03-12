import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import type { AuthResponse, LoginForm, RegisterForm } from "../types";
import { authApi } from "../api/authApi";
import { AuthContext } from "./authTypes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitialAuthState() {
  const token = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  if (token && username && userId) {
    return { isAuthenticated: true, username, userId, isLoading: false } as const;
  }
  return { isAuthenticated: false, username: null, userId: null, isLoading: false } as const;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(getInitialAuthState);

  // ── Persistence + Auth methods ──────────────────────────────────────────────

  const persist = (res: AuthResponse) => {
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("username", res.username);
    localStorage.setItem("userId", res.userId);
    setState({
      isAuthenticated: true,
      username: res.username,
      userId: res.userId,
      isLoading: false,
    });
  };

  const login = useCallback(async (form: LoginForm) => {
    const res = await authApi.login(form);
    persist(res);
  }, []);

  const register = useCallback(async (form: RegisterForm) => {
    const res = await authApi.register(form);
    persist(res);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setState({
      isAuthenticated: false,
      username: null,
      userId: null,
      isLoading: false,
    });
  }, []);

  // ── 401 vom Axios Interceptor ──────────────────────────────────────────────
  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
