import { Card } from "@/components/ui/Card";

export default function ChartsPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          Training volume
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This page will visualize your workout history — volume over time, sets
          per week, and more — once we wire it up to real data.
        </p>
      </header>

      <Card className="h-80 flex items-center justify-center text-sm text-muted-foreground">
        Charts coming soon.
      </Card>
    </main>
  );
}
