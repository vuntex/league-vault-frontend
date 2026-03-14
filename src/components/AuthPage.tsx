import React, { useState } from "react";
import type { LoginForm, RegisterForm } from "../types";
import { useAuth } from "../context/useAuth";
import { parseApiError } from "../api/axiosClient";

type AuthTab = "login" | "register";

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<AuthTab>("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) return;
    try {
      setLoading(true);
      setError(null);
      await login(loginForm);
    } catch (e) {
      setError(parseApiError(e).detail);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.email || !registerForm.password)
      return;
    try {
      setLoading(true);
      setError(null);
      await register(registerForm);
    } catch (e) {
      setError(parseApiError(e).detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">✦ LEAGUE VAULT</div>
        <div className="auth-sub">Account Manager</div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => {
              setTab("login");
              setError(null);
            }}
          >
            Anmelden
          </button>
          <button
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => {
              setTab("register");
              setError(null);
            }}
          >
            Registrieren
          </button>
        </div>

        {tab === "login" ? (
          <div className="auth-form">
            <div className="field">
              <label className="field-lbl">Benutzername</label>
              <input
                className="field-inp"
                placeholder="NightOwl"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, username: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div className="field">
              <label className="field-lbl">Passwort</label>
              <input
                className="field-inp"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, password: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button
              className="btn-prim auth-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Lade…" : "Anmelden"}
            </button>
            <div className="auth-public-hint">
              <a href="/dashboard" className="auth-public-link">
                Public Dashboard ansehen →
              </a>
            </div>
          </div>
        ) : (
          <div className="auth-form">
            <div className="field">
              <label className="field-lbl">Benutzername</label>
              <input
                className="field-inp"
                placeholder="NightOwl"
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, username: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label className="field-lbl">E-Mail</label>
              <input
                className="field-inp"
                type="email"
                placeholder="mail@example.com"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label className="field-lbl">Passwort</label>
              <input
                className="field-inp"
                type="password"
                placeholder="Min. 8 Zeichen"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm((f) => ({ ...f, password: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button
              className="btn-prim auth-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Lade…" : "Konto erstellen"}
            </button>
            <div className="auth-public-hint">
              <a href="/dashboard" className="auth-public-link">
                Public Dashboard ansehen →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
