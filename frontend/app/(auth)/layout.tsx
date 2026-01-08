export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
