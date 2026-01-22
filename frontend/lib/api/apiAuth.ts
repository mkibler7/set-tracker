import { apiClient } from "./apiClient";
import { useAuthStore, type AuthUser } from "@/store/authStore";

type AuthResponse = {
  user: AuthUser;
};

type RegisterResponse = {
  ok: boolean;
  message?: string;
};

export const AuthAPI = {
  register: async (payload: {
    email: string;
    password: string;
    displayName?: string;
  }) => {
    const data = await apiClient<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    useAuthStore.getState().clear();

    return data;
  },

  verifyEmail: (payload: { token: string }) =>
    apiClient<{ ok: boolean }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resendVerification: (payload: { email: string }) =>
    apiClient<{ message?: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  demoLogin: async () => {
    const data = await apiClient<AuthResponse>("/api/auth/demo", {
      method: "POST",
    });

    useAuthStore.getState().setUser({
      ...data.user,
      displayName: data.user.displayName ?? "",
    });

    return data.user;
  },

  login: async (payload: { email: string; password: string }) => {
    const data = await apiClient<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    useAuthStore.getState().setUser({
      ...data.user,
      displayName: data.user.displayName ?? "",
    });

    return data.user;
  },

  logout: async () => {
    await apiClient<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
    useAuthStore.getState().clear();
  },

  me: async () => {
    const user = await apiClient<AuthUser>("/api/auth/me");
    useAuthStore.getState().setUser({
      ...user,
      displayName: user.displayName ?? "",
    });
    return user;
  },

  forgotPassword: (payload: { email: string }) =>
    apiClient<{ ok: boolean; message?: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload: { token: string; password: string }) =>
    apiClient<{ ok: boolean }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
