// format: 2025-12-10T00:00:00.000Z

export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.substring(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day); // local midnight
}

export function formatWorkoutDate(isoDate: string): string {
  return parseLocalDate(isoDate).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
