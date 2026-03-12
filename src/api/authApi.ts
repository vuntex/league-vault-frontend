import { apiClient } from "./axiosClient";
import type { AuthResponse, LoginForm, RegisterForm } from "../types";

export const authApi = {
  login: async (form: LoginForm): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", {
      username: form.username,
      password: form.password,
    });
    return data;
  },

  register: async (form: RegisterForm): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", {
      username: form.username,
      email: form.email,
      password: form.password,
    });
    return data;
  },
};
