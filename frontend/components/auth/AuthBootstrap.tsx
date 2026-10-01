"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useWorkoutStore } from "@/app/store/useWorkoutStore";
import { apiClient, isApiError, refreshSession } from "@/lib/api/apiClient";

export default function AuthBootstrap() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      const auth = useAuthStore.getState();
      const workouts = useWorkoutStore.getState();

      // If we already have a user in store (persisted), we can still optionally
      // verify it later; but for now, don’t block UI.
      if (auth.user) return;

      // Try /me first (works if at cookie exists)
      const me = await apiClient<{
        id: string;
        email: string;
        displayName?: string;
      }>("/api/auth/me").catch(() => null);

      if (me) {
        auth.setUser({
          ...me,
          displayName: me.displayName ?? "",
        });
        return;
      }

      // If /me failed, try refresh (uses rt cookie, sets at cookie).
      // Shares apiClient's single-flight refresh so a page load and a 401
      // retry never send two refreshes at once.
      const refreshed = await refreshSession();

      if (!refreshed.ok) {
        // Only a 401 means the session is gone. On server/network trouble keep
        // local state (including unsaved workout drafts) for the next attempt.
        if (refreshed.status === 401) {
          auth.clear();
          workouts.resetAllDrafts();
        }
        return;
      }

      // Try /me again after refresh
      let meError: unknown = null;
      const me2 = await apiClient<{
        id: string;
        email: string;
        displayName?: string;
      }>("/api/auth/me").catch((err) => {
        meError = err;
        return null;
      });

      if (me2) {
        auth.setUser({
          ...me2,
          displayName: me2.displayName ?? "",
        });
        return;
      }

      // Session rejected or account gone: clear. Other errors are temporary.
      if (isApiError(meError) && [401, 404].includes(meError.status)) {
        auth.clear();
        workouts.resetAllDrafts();
      }
    })();
  }, []);

  return null;
}
