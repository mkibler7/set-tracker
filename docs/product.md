# Product Scope

This document defines the v1 scope (what SetTracker guarantees) and the v1.1 backlog (next increment).

## v1.0 (Shippable Scope)

### Primary user flows (guaranteed)

1. **Register → Verify Email → Login**
   - User can create an account, receive a verification email, verify, and sign in.
2. **Log a workout**
   - Create or open a workout session, add exercises, add sets, add notes, and save.
3. **Exercise discovery**
   - Browse/search exercises and add to a session.
4. **Dashboard visibility**
   - View basic charts/summary metrics from logged data.
5. **Logout**
   - Properly ends the session and clears client state.

### Functional features

- Authentication
  - register/login/logout
  - email verification
  - password reset
  - demo login (if enabled in env)
- Workouts
  - CRUD for workouts/logs (as implemented)
  - adding/removing exercises and sets
  - set fields (reps, weight, etc. as implemented)
- Exercises
  - global catalog
  - user-created exercises (if enabled) subject to limits
- UX baseline
  - loading and empty states for primary pages
  - responsive/mobile-first layouts for major screens

### Non-functional requirements

- Secure session handling via HttpOnly cookies
- Production deployment on:
  - Vercel (frontend)
  - Render (backend)
  - MongoDB Atlas (database)

## v1.1 Backlog (Next Increment)

### UX polish

- Stronger form validation + consistent toasts across all save actions
- Additional mobile layout refinements for:
  - Daily log
  - Exercise picker
  - Charts (label/legend readability)
- More robust empty states and onboarding prompts

### Product enhancements

- Improved workout templates and re-use flows
- Better exercise filtering and metadata
- More analytics and chart views (progression trends, volume by group over time)

### Platform

- Capacitor mobile wrapper
- Deep links (universal/app links) for verification/reset flows
- Mobile-friendly token/session strategy validation

### Engineering

- Expanded test coverage for auth edge cases (expiry, resend behavior, invalid tokens)
- CI enhancements (lint/typecheck/test gating on PRs)

### Set Timer

- Add a timer/metronome that matches the speed of the users set(4-2-1-2, 1-1-1-1, etc..)
- The tone may have a different pitch for each portion of the rep(format negative-stretch-positive-contraction for X-X-X-X)
