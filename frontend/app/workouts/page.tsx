import { Suspense } from "react";
import WorkoutsClientPage from "@/components/workouts/WorkoutsClientPage";

export default function WorkoutsPage() {
  return (
    <Suspense fallback={<div className="page">Loading workouts...</div>}>
      <WorkoutsClientPage />
    </Suspense>
  );
}
