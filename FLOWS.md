# SetTracker – Core User Flows

This document describes the primary user flows in SetTrack and how we’ll know each flow is working (acceptance criteria). At this stage, flows are **mock-only** (no real backend), but the criteria anticipate real behavior.

---

## 1. Sign Up

**Goal:** A new user can create an account and land on their dashboard.

**Acceptance Criteria**

- AC1: Given valid name, email, and password, when the user submits the sign-up form, they see a success path (e.g., redirected to `/dashboard` or `/login` with a success message).
- AC2: If required fields are missing or invalid (bad email format, short password), inline validation messages are shown and the form is not submitted.
- AC3: If the email is already used (later when backend exists), the user sees a clear error (“Email already in use”) and is not registered.

---

## 2. Login

**Goal:** An existing user can log in and access protected pages.

**Acceptance Criteria**

- AC1: Given a valid account, when the user submits email + password, they are redirected to `/dashboard`.
- AC2: Invalid credentials show an error state (e.g., “Invalid email or password”), and the user remains on the login page.
- AC3: After login, navigating to `/login` or `/signup` should either redirect to `/dashboard` or clearly indicate the user is already logged in (once auth is wired up).

---

## 3. View Dashboard

**Goal:** The user sees a high-level overview of their training.

**Acceptance Criteria**

- AC1: When an authenticated user visits `/dashboard`, they see a “Welcome” context plus sections for: “Today’s Workout”, “Recent Workouts”, and maybe “Highlights/Stats” (mock data for now).
- AC2: If not authenticated (later), going to `/dashboard` redirects to `/login`.
- AC3: From the dashboard, the user can navigate to `/start`, `/workouts`, and `/exercises` via obvious UI controls.

---

## 4. Start Workout

**Goal:** The user can initiate a new workout session from `/start`.

**Acceptance Criteria**

- AC1: Visiting `/start` shows today’s date and clear “Start Workout” context (title, subtitle, etc.).
- AC2: The user can open an `ExercisePicker` (modal/drawer/section) and select exercises into the current session (mock list for now).
- AC3: Selected exercises appear in a visible session area, ready for sets to be added (even if the sets are not fully implemented yet).

---

## 5. Log Sets Within a Workout

**Goal:** The user can log sets (reps, weight, RPE, tempo, etc.) for chosen exercises.

**Acceptance Criteria**

- AC1: For each selected exercise, the user can add one or more sets via a `SetEntry` control (mock-only local state initially).
- AC2: When a set is added, it appears immediately in the UI grouped under the correct exercise.
- AC3: The user can edit or delete a set from the session (even if this is only client-side state at first).

---

## 6. View Workout History

**Goal:** The user can browse previous workouts and inspect details.

**Acceptance Criteria**

- AC1: Visiting `/workouts` shows a list of past workouts (date, basic stats), using mock data for now.
- AC2: Each workout in the list is clickable and navigates to `/workouts/[id]`.
- AC3: The page layout leaves room for filters or search (e.g., date range, body part), even if filtering is not yet implemented.

---

## 7. View Workout Details

**Goal:** The user can inspect sets for a specific workout.

**Acceptance Criteria**

- AC1: Visiting `/workouts/[id]` shows workout metadata (date, title/notes) and a list of exercises and sets (mock data).
- AC2: If an invalid or missing `id` is provided (later with real backend), the user sees a friendly “Workout not found” state instead of a crash.
- AC3: There is clear navigation back to `/workouts` and `/dashboard`.

---

## 8. View Exercises and Exercise Details

**Goal:** The user can browse exercises and inspect details.

**Acceptance Criteria**

- AC1: Visiting `/exercises` shows a list of exercises (name, muscle group, maybe tags) using mock data.
- AC2: Each exercise is clickable and navigates to `/exercises/[id]`.
- AC3: On `/exercises/[id]`, the user sees the exercise name, primary muscle group, description, and example usage (mocked), plus a way to navigate back.

---

## 9. Authorization / Access Guardrails (Future-Ready)

These won’t be fully implemented until backend & auth are ready, but we'll define them now:

- AC1: All routes except `/login` and `/signup` are considered “protected” and require a logged-in user.
- AC2: Attempting to visit a protected page while not logged in redirects to `/login`.
- AC3: Once auth is in place, protected pages should only show data for the currently authenticated user.
