import { AuthAPI } from "@/lib/api/apiAuth";
import { useAuthStore } from "@/store/authStore";
import { useWorkoutStore } from "@/app/store/useWorkoutStore";

export async function appLogout() {
  try {
    await AuthAPI.logout();
  } catch {
    // ignore
  } finally {
    useAuthStore.getState().clear();
    useWorkoutStore.getState().resetWorkout();
  }
}
