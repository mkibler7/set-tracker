# Architecture Overview

SetTrack is a full-stack workout logging application built as a TypeScript monorepo with a Next.js frontend, an Express backend API, and MongoDB Atlas for persistence. Authentication is implemented with short-lived access tokens and long-lived refresh tokens stored in HttpOnly cookies, plus email verification and password reset flows.

## High-Level Diagram

```text
+---------------------------+           +---------------------------+
| User Browser / Mobile     |           | SMTP Provider             |
|https://app.set-tracker.com|           | (verification/reset email)|
+-------------+-------------+           +-------------+-------------+
              | HTTPS                                   ^
              v                                         |
+---------------------------+      HTTPS      +----------+----------+
| Next.js Frontend (Vercel) | <-------------> | Express API (Render)|
| app.set-tracker.com       |                 | api.set-tracker.com |
+-------------+-------------+                 +---------+-----------+
              |                                          |
              | MongoDB driver                           | Mongoose
              v                                          v
        +-------------------------------------------------------+
        | MongoDB Atlas                                         |
        | Users, Workouts, Exercises, Logs                      |
        +-------------------------------------------------------+

## Components

### Frontend (Next.js)

- Hosts the UI/UX for:
  - authentication (register/login/logout)
  - verification / password reset pages
  - exercise catalog
  - daily workout logging
  - dashboard and charts
- Calls backend endpoints via an API client.
- Maintains session/user state in a client store; the backend remains source-of-truth for auth.

### Backend (Express API)

- Owns business logic and persistence:
  - workout CRUD
  - exercise catalog / user exercise constraints
  - auth + session lifecycle (access/refresh cookies)
  - email verification + password reset token issuance/validation
- Issues:
  - access token (short TTL, e.g. `15m`)
  - refresh token (long TTL, e.g. `30d`)
- Stores password hashes and token hashes (verification/reset/refresh depending on your implementation).

### Database (MongoDB Atlas)

- Persistent storage for application entities:
  - users
  - workouts / workout sessions
  - exercises (global + user-defined as applicable)
  - sets, notes, and related metadata

### Email

- SMTP is used to deliver:
  - verification links
  - password reset links
- Planned replacement: Resend.

## Authentication & Session Model

- Access token (`at`) and refresh token (`rt`) are set as **HttpOnly cookies**.
- Access tokens are short-lived; refresh tokens allow silent renewal.
- A non-HttpOnly `has_session` cookie may be used to help the client render UI states (e.g., show/hide auth-aware navigation) without exposing tokens.

Security properties:

- Tokens are never accessible to client-side JS (HttpOnly).
- Production cookies are sent only over HTTPS (`Secure`).
- Same-site posture is compatible with subdomain deployment under the same registrable domain.

## Key Engineering Decisions

- Monorepo organization enables shared types/enums and reduces API contract drift.
- HttpOnly cookie auth is used to reduce token exposure risk in the browser.
- Explicit deployment notes and environment references exist in `/docs` to support maintainability and review.
```
