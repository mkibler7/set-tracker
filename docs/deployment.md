# Deployment Guide (Vercel + Render + MongoDB Atlas)

This document describes how to deploy the RepTracker monorepo to production:

- Frontend: Vercel
- Backend API: Render
- Database: MongoDB Atlas
- Email: SMTP provider (We will replace with resend later)

## Repo Structure (typical)

- `frontend/` – Next.js app (deployed to Vercel)
- `backend/` – Express API (deployed to Render)
- `packages/shared/` – shared types/enums (not deployed directly)

## Environments

You should treat these as separate configs:

- Local development
- Production

Critical differences in production:

- HTTPS is enforced (cookie `Secure=true`)
- CORS must be locked down to your frontend domain
- Cookies typically require `SameSite=None` if frontend and backend are on different domains

---

## 1) MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. Create a DB user/password.
3. Configure **Network Access**:
   - If you can: allowlist Render outbound IPs (best practice).
   - If you cannot: temporarily allow `0.0.0.0/0` (not ideal; tighten later).
4. Copy the connection string and set it to:
   - `MONGODB_URI`

---

## 2) Backend Deployment (Render)

### Create the Render service

1. Create a new **Web Service** from your GitHub repo.
2. Root Directory: `backend`
3. Build command (example):
   - `npm ci && npm run build`
4. Start command (example):
   - `npm start` (or `node dist/server.js`, depending on your scripts)

### Backend environment variables (Render)

Set the following env vars in Render (see `docs/env.md` for details):

- `NODE_ENV`
- `MONGODB_URI`
- `FRONTEND_ORIGIN`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ACCESS_TOKEN_TTL`
- `REFRESH_TOKEN_TTL_DAYS`
- `COOKIE_SECURE`
- `COOKIE_SAMESITE`
- `EMAIL_VERIFY_TTL_MINUTES`
- `PASSWORD_RESET_TTL_MINUTES`
- SMTP:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`
- Optional demo controls:
  - `ENABLE_DEMO`, `DEMO_EMAIL`, `DEMO_WINDOW_DAYS`
- Optional limits:
  - `USER_EXERCISE_LIMIT`

### CORS + Cookies requirements (subdomain setup)

This deployment uses two subdomains on the same parent domain:

- Frontend: `https://app.set-tracker.com`
- Backend API: `https://api.set-tracker.com`

Because both are under the same registrable domain (`set-tracker.com`), they are typically treated as **same-site** by browsers. This allows a more permissive cookie posture than cross-site deployments.

Recommended production settings for this setup:

- `COOKIE_SECURE=true` (HTTPS-only cookies)
- `COOKIE_SAMESITE=lax`

CORS must still be configured correctly:

- Allow the frontend origin explicitly:
  - `FRONTEND_ORIGIN=https://app.set-tracker.com`
- If you are using cookies for auth, ensure:
  - backend CORS enables credentials (`credentials: true`)
  - frontend fetch/axios calls include credentials (`credentials: "include"` / `withCredentials: true`)

When would you need `SameSite=None`?

- If the frontend and backend are no longer under the same parent domain (e.g., `*.vercel.app` + `*.onrender.com`)
- If you embed the app in a third-party site, or rely on cross-site navigations that must carry cookies

In those cases, switch to:

- `COOKIE_SAMESITE=none`
- `COOKIE_SECURE=true` (required when SameSite=None)

---

## 3) Frontend Deployment (Vercel)

### Create the Vercel project

1. Import the repo into Vercel.
2. Root Directory: `frontend`
3. Framework: Next.js
4. Build settings: Vercel defaults are usually correct.

### Frontend environment variables (Vercel)

At minimum, configure the backend base URL used by the frontend:

- `BACKEND_ORIGIN=https://api.set-tracker.com`

---

## 4) Post-Deploy Verification Checklist

### Auth

- Sign up → verification email arrives → link verifies successfully
- Login works and persists on refresh
- Logout clears session and client workout state

### API

- Create workout → add exercises/sets → save and re-open
- Dashboard/charts load without errors

### Email

- SMTP/Resend email verification works
- Password reset email works end-to-end

---

## API Routing Model (important)

Frontend code calls the API using relative paths like `/api/auth/login`.
There are two valid deployment models:

### Model A: Reverse proxy `/api/*` through the frontend domain (recommended)

The frontend host (e.g., `https://app.set-tracker.com`) proxies `/api/*` to the backend service.
Pros:

- Browser sees requests as same-origin to the frontend domain
- Avoids most CORS complexity
- Cookies are stored against the frontend domain and forwarded automatically

Requirements:

- Configure Next.js `rewrites()` or an edge proxy rule to forward `/api/*` to `https://api.set-tracker.com/api/*`
- Backend still should enforce allowed origins at the network/app layer, but browser CORS issues are minimized

### Model B: Direct calls to the API subdomain

`apiClient` prepends a base URL (e.g., `BACKEND_ORIGIN=https://api.set-tracker.com`) and requests go cross-origin at the hostname level.
Requirements:

- Frontend fetch must include credentials (`credentials: "include"` / `withCredentials: true`)
- Backend must allow credentials in CORS and explicitly allow `https://app.set-tracker.com`
- Cookies generally work with `SameSite=Lax` because both hosts share the same registrable domain (`set-tracker.com`)

## Cookie settings (production)

Current cookie behavior:

- `rt` and `at` cookies: `SameSite=Lax` (hard-coded)
- `Secure=true` in production unless `COOKIE_SECURE="false"`

Recommended for your subdomain setup:

- `NODE_ENV=production`
- `COOKIE_SECURE=true` (or omit; production defaults to secure unless explicitly disabled)
- `COOKIE_SAMESITE=lax` (currently relevant only to `has_session`)

## Common Failures (and the fastest fixes)

### 1) “CORS error” or requests blocked

Symptoms:

- Browser console shows CORS failure
  Fix:
- Ensure backend `FRONTEND_ORIGIN` exactly matches your Vercel domain (including `https://`)
- Ensure backend sets `credentials: true` in CORS
- Ensure frontend requests include credentials if you use cookies

### 2) Verification/reset links open but token is “invalid/expired”

Fix:

- Increase TTLs (`EMAIL_VERIFY_TTL_MINUTES`, `PASSWORD_RESET_TTL_MINUTES`) for production
- Confirm server clocks are correct
- Confirm the link points to the correct frontend domain

### 3) Email not sending in production

Fix:

- Validate `SMTP_HOST/PORT/USER/PASS`
- Confirm your provider allows the sender in `MAIL_FROM`
- Check provider logs (authentication failure is most common)

### 4) MongoDB connection failure on Render

Fix:

- Verify `MONGODB_URI` is correct
- Verify Atlas Network Access allowlist includes Render (or temporary 0.0.0.0/0)
- Confirm database user credentials match the URI

---

## Rollback Strategy

- Keep tags/releases (e.g., `v1.0.0`) so you can quickly redeploy a known-good commit.
- If a deploy breaks, revert the commit in GitHub and trigger a rebuild on Render/Vercel.
