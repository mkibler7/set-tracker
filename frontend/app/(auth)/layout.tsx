export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-md items-start px-4 pt-20 pb-8 sm:pt-32">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
