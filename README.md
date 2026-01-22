### Status

- Frontend: ✅ Next.js app deployed on Vercel
- Backend: ⏳ In progress – current data is mock (no login, no real persistence yet).

# SetTrack

SetTrack is a full-stack workout logging app designed as a professional portfolio project.
It lets lifters log workouts quickly, review history, and track basic progress over time.

## Tech Stack

- **Frontend**: Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT + bcrypt

## Monorepo Layout

- `frontend/` – Next.js app (UI, routing, API client)
- `backend/` – Express API (MVC controllers, routes, models)
- `docs/` – Design docs (PDFs: senior design plan, 14-day checklist, branching, etc.)

## Running Locally

### Frontend

```bash
cd frontend
npm install   # only needed once
npm run dev   # http://localhost:3000
```

### Backend

```bash
cd backend
npm install   # already done once
npm run dev   # http://localhost:5000
```
