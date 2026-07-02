---
phase: 01-authentication-foundation
plan: 02
subsystem: auth
status: complete
tags: [supabase, auth, jwt, email-verification, typescript, environment]
dependency_graph:
  requires: [01-01-AUTH-SCHEMA]
  provides: [supabase-client, supabase-server-client, env-config, auth-config]
  affects: [03-app-shell]
tech_stack:
  added: [supabase-js-v2, supabase-ssr, pkce-flow]
  patterns: [singleton-browser-client, user-scoped-server-client, cookie-session-ssr]
key_files:
  created:
    - supabase/config.toml
    - lib/supabase/client.ts
    - lib/supabase/server.ts
    - lib/supabase/index.ts
    - .env.example
    - .gitignore
  modified: []
decisions:
  - "Browser client uses PKCE flow (more secure than implicit flow) for email verification and password reset"
  - "Singleton pattern for browser client — prevents multiple Supabase instances per page"
  - "createUserServerClient() added (beyond plan) to support RLS-aware server-side queries via @supabase/ssr"
  - ".gitignore created alongside .env.example to ensure .env.local is never accidentally committed"
metrics:
  duration: 20m
  completed: 2026-07-01
  tasks_completed: 3
  files_created: 6
---

# Phase 01 Plan 02: Supabase Auth Configuration Summary

**One-liner:** Email/password auth configured (require_email_confirmation=true, JWT 1h, PKCE flow), plus singleton browser client and cookie-based SSR server client.

## What Was Built

### supabase/config.toml

Supabase local CLI configuration with:
- **Email auth:** `enable_confirmations = true` — users must verify email before logging in
- **JWT expiry:** 3600 seconds (1 hour), refresh token rotation enabled
- **Redirect URLs:** `localhost:3000` (dev) and `app-motorista.vercel.app` (prod)
- **Anonymous sign-ins:** disabled
- **SMS auth:** disabled (Phase 1: email/password only)
- **OAuth:** not configured (Phase 1 only)

### lib/supabase/client.ts

Browser-side Supabase client:
- Singleton pattern (`_browserClient` module-level variable — one instance per app lifecycle)
- PKCE flow for secure email verification and password reset redirect handling
- `autoRefreshToken: true` — JWT auto-refreshed before 3600s expiry
- `detectSessionInUrl: true` — required to pick up token from email verification links
- `persistSession: true` — session survives browser reload (stored in localStorage)
- Env var validation with descriptive error on missing config

### lib/supabase/server.ts

Two server clients:
1. **`createServerClient()`** — service role key, bypasses RLS, for admin/migration operations
2. **`createUserServerClient()`** — anon key + user JWT via SSR cookies, respects RLS, for Server Components

### lib/supabase/index.ts

Clean re-exports for both client and server utilities with security comments.

### .env.example

Template with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`, `NODE_ENV`. Instructions to copy to `.env.local`.

### .gitignore

Comprehensive gitignore covering Node, Next.js, Vercel, Supabase local data, OS files, and `.env*.local`.

## Acceptance Criteria Verification

- [x] `supabase/config.toml` exists
- [x] Contains `[auth.email]` section
- [x] `enable_confirmations = true` (equivalent to require_email_confirmation)
- [x] JWT expiration set (`jwt_expiry = 3600`)
- [x] No OAuth or third-party providers configured
- [x] `lib/supabase/client.ts` exists, exports `createClient()`
- [x] `lib/supabase/server.ts` exists, exports `createServerClient()`
- [x] `lib/supabase/index.ts` exists, re-exports both
- [x] `NEXT_PUBLIC_SUPABASE_URL` in .env.example
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` in .env.example
- [x] `SUPABASE_SERVICE_ROLE_KEY` in .env.example
- [x] `.gitignore` contains `.env*.local` pattern

## Deviations from Plan

### Auto-added (Rule 2 - Missing Critical Functionality)

**1. [Rule 2 - Security] Added `createUserServerClient()` in server.ts**
- **Found during:** Task 2
- **Issue:** Plan specified only a service-role admin client for server use, but Server Components need a RLS-respecting client (user JWT, not service role) for safe data fetching
- **Fix:** Added `createUserServerClient()` using `@supabase/ssr` package with cookie-based session — required by Plan 03's middleware and server-side data fetching
- **Files modified:** `lib/supabase/server.ts`

**2. [Rule 2 - Security] Added PKCE flow configuration to browser client**
- **Found during:** Task 2
- **Issue:** Default implicit flow is less secure; PKCE prevents authorization code interception attacks — critical for email verification links
- **Fix:** Added `flowType: 'pkce'` to browser client auth options
- **Files modified:** `lib/supabase/client.ts`

**3. [Rule 2 - Security] Created `.gitignore`**
- **Found during:** Task 3
- **Issue:** `.env.example` acceptance criteria requires `.gitignore` to contain `.env.local`; no `.gitignore` existed
- **Fix:** Created comprehensive `.gitignore` covering all Next.js project artifacts
- **Files created:** `.gitignore`

## Commits

| Task | Description | Commit |
|------|-------------|--------|
| Task 1 | supabase/config.toml auth configuration | 1324ad2 |
| Task 2 | Supabase client and server utilities | 0e72077 |
| Task 3 | .env.example + .gitignore | 5b7a916 |

## Self-Check

- [x] `supabase/config.toml` exists on disk
- [x] `lib/supabase/client.ts` exists on disk
- [x] `lib/supabase/server.ts` exists on disk
- [x] `lib/supabase/index.ts` exists on disk
- [x] `.env.example` exists on disk
- [x] `.gitignore` exists on disk
- [x] Commits 1324ad2, 0e72077, 5b7a916 verified in git log

## Self-Check: PASSED
