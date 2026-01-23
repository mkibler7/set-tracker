# Environment Variables Reference

This repo uses environment variables for auth, cookies, database connectivity, and email.
Do not commit secrets to Git.

## Backend (Render / backend service)

### Runtime

- `NODE_ENV`
  - Purpose: Sets environment mode (`production`, `development`, etc.)
  - Example: `production`

- `MONGODB_URI`
  - Purpose: MongoDB Atlas connection string
  - Example: `mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority`

### CORS / Origins

- `FRONTEND_ORIGIN`
  - Purpose: Allowed origin for CORS (your Vercel domain)
  - Example: `https://app.set-tracker.com`

### JWT / Auth

- `JWT_ACCESS_SECRET`
  - Purpose: Secret used to sign access tokens
  - Generate: `openssl rand -hex 32`

- `JWT_REFRESH_SECRET`
  - Purpose: Secret used to sign refresh tokens
  - Generate: `openssl rand -hex 32`

- `ACCESS_TOKEN_TTL`
  - Purpose: Access token lifetime
  - Typical formats: depends on your implementation (e.g., `15m`, `900s`, or `900`)
  - Recommendation: keep short in prod (e.g., 10–20 minutes)

- `REFRESH_TOKEN_TTL_DAYS`
  - Purpose: Refresh token lifetime in days
  - Example: `7` or `14`

### Cookies

The backend sets three cookies:

- `rt` (refresh token) — HttpOnly
- `at` (access token) — HttpOnly
- `has_session` (client-readable marker)

Current behavior:

- `rt` and `at` are always set with:
  - `SameSite=Lax` (hard-coded)
  - `Secure=true` only when `NODE_ENV=production` AND `COOKIE_SECURE` is not `"false"`
- `has_session` uses:
  - `COOKIE_SAMESITE` (defaults to `lax`)

  Env vars:

- `COOKIE_SECURE`
  - In production, `true` by default unless explicitly set to `"false"`.

- `COOKIE_SAMESITE`
  - Currently affects only the `has_session` cookie, not `rt`/`at` (unless code is updated).

### Email Verification / Password Reset TTLs

- `EMAIL_VERIFY_TTL_MINUTES`
  - Purpose: Minutes before verification token expires
  - Example: `30` or `60`

- `PASSWORD_RESET_TTL_MINUTES`
  - Purpose: Minutes before password reset token expires
  - Example: `15` or `30`

### SMTP (Email Sending)

- `SMTP_HOST`
  - Purpose: SMTP server hostname
  - Example: `smtp.resend.com` or provider hostname

- `SMTP_PORT`
  - Purpose: SMTP port
  - Common: `587` (STARTTLS) or `465` (SSL)

- `SMTP_USER`
  - Purpose: SMTP username

- `SMTP_PASS`
  - Purpose: SMTP password / API key (provider-specific)

- `MAIL_FROM`
  - Purpose: From address for outbound email
  - Example: `SetTrack <no-reply@yourdomain.com>`

### Demo / Seed Behavior (Optional)

- `ENABLE_DEMO`
  - Purpose: Enables demo mode (if your code supports it)
  - Example: `true` / `false`

- `DEMO_EMAIL`
  - Purpose: Email used for demo mode behavior
  - Example: `demo@yourdomain.com`

- `DEMO_WINDOW_DAYS`
  - Purpose: Window length used for demo-limited behavior
  - Example: `7`

### Limits (Optional)

- `USER_EXERCISE_LIMIT`
  - Purpose: Hard cap for user-created exercises
  - Example: `200`

---

## Frontend (Vercel / frontend service)

- `BACKEND_ORIGIN`
  - Purpose: Base URL for the backend API (Render domain)
  - Example: `https://api.set-tracker.com`

---

## Recommended .env.example Files

Create:

- `backend/.env.example` with non-secret placeholders and variable names
- `frontend/.env.example` with `BACKEND_ORIGIN`

Never include real secrets in `.env.example`.
