import axios, { AxiosError } from "axios";
import type { ApiError } from "../types";

// ─── Axios Instance ───────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// ─── Request Interceptor – JWT anhängen ───────────────────────────────────────

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor – 401 → logout ─────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      // AuthContext übernimmt den Rest
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  },
);

// ─── Helper: Axios Error → ApiError ──────────────────────────────────────────

export function parseApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data;
    return {
      title: data.title ?? "Fehler",
      detail: data.detail ?? "Ein unbekannter Fehler ist aufgetreten",
      status: error.response.status,
      secondsRemaining: data.secondsRemaining,
      availableAt: data.availableAt,
    };
  }
  return {
    title: "Verbindungsfehler",
    detail: "Server nicht erreichbar",
    status: 0,
  };
}
