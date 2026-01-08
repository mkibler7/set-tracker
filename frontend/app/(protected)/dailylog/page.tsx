import { Suspense } from "react";
import DailyLogClientPage from "@/components/dailylog/DailyLogClientPage";

export default function DailyLogPage() {
  return (
    <Suspense fallback={<div className="page">Loading workout...</div>}>
      <DailyLogClientPage />
    </Suspense>
  );
}
