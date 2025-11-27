export default function SignupPage() {
  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start tracking your training with RepTrack.
        </p>
      </header>

      <form className="space-y-4 rounded-lg border border-border p-4">
        <div className="space-y-1 text-sm">
          <label htmlFor="name" className="block">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            placeholder="••••••••"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Sign Up (mock)
        </button>
      </form>
    </section>
  );
}
