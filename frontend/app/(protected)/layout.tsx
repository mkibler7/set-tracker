import NavBar from "@/components/layout/NavBar";

// Nested inside app/layout.tsx, which already renders <html>/<body>, global
// styles, the Inter font and <AuthBootstrap />. This layout only adds the
// signed-in app shell.
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* Always-visible header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-14 items-center px-4 md:px-8">
          <NavBar />
        </div>
      </header>

      {/* Scroll container */}
      <main className="flex-1 min-h-0 overflow-y-auto bg-background-dark">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
