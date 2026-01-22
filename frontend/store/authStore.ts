"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  email: string;
  displayName?: string;
};

type AuthState = {
  user: AuthUser | null;

  setUser: (user: AuthUser | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),
      clear: () => set({ user: null }),
    }),
    {
      name: "settracker-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
