import { createContext } from "react";
import type { LoginForm, RegisterForm } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  userId: string | null;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (form: LoginForm) => Promise<void>;
  register: (form: RegisterForm) => Promise<void>;
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);
