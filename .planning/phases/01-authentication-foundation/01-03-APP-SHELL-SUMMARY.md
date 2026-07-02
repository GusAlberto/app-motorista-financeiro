---
phase: 01-authentication-foundation
plan: 03
subsystem: frontend
status: complete
tags: [nextjs, typescript, tailwind, auth, mobile-first, settings, middleware, theme]
dependency_graph:
  requires: [01-01-AUTH-SCHEMA, 01-02-SUPABASE-AUTH]
  provides: [auth-pages, protected-routes, settings-page, navbar, theme-system, middleware]
  affects: [phase-02-public-pages]
tech_stack:
  added: [next15-app-router, react19, tailwind-v4, lucide-react, supabase-ssr]
  patterns: [route-groups, middleware-session-refresh, pkce-callback, singleton-client, theme-provider]
key_files:
  created:
    - app/layout.tsx
    - app/globals.css
    - app/page.tsx
    - app/(auth)/layout.tsx
    - app/(auth)/login/page.tsx
    - app/(auth)/signup/page.tsx
    - app/(auth)/forgot-password/page.tsx
    - app/(auth)/verify-email/page.tsx
    - app/(app)/layout.tsx
    - app/(app)/dashboard/page.tsx
    - app/(app)/settings/page.tsx
    - app/auth/callback/route.ts
    - components/Navbar.tsx
    - components/ThemeProvider.tsx
    - lib/hooks/useAuth.ts
    - lib/utils/cn.ts
    - types/auth.ts
    - types/database.ts
    - middleware.ts
    - package.json
    - tsconfig.json
    - next.config.ts
  modified: []
decisions:
  - "Profile updates use supabase.from('driver_profiles').upsert() instead of updateUser({data}) — updateUser stores data in auth.users metadata, not driver_profiles table"
  - "Auth callback route created at /auth/callback to handle email verification and password reset redirects via PKCE code exchange"
  - "Middleware uses @supabase/ssr createServerClient with cookie-based session refresh (recommended pattern for Next.js App Router)"
  - "ThemeProvider uses visibility:hidden on initial mount to prevent flash of wrong theme"
  - "Language selector kept as placeholder (pt-BR default); actual i18n deferred to post-MVP"
  - "auth/(auth) layout wraps ThemeProvider so theme works on auth pages too"
metrics:
  duration: 45m
  completed: 2026-07-01
  tasks_completed: 3
  files_created: 22
---

# Phase 01 Plan 03: App Shell & Settings Summary

**One-liner:** Full Next.js 15 app shell with 4 auth pages, protected route middleware, Navbar (logout + theme toggle), settings page (profile/password/theme), and dark mode system — all mobile-first with 48px+ touch targets.

## What Was Built

### Project Foundation

- **package.json:** Next.js 15, React 19, Supabase JS v2, Tailwind v4, Lucide icons, Zod, date-fns
- **tsconfig.json:** Strict TypeScript, `@/*` path alias
- **next.config.ts:** Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection), Supabase image remote patterns

### Auth Pages (app/(auth)/*)

All pages share the centered card layout from `app/(auth)/layout.tsx`.

| Page | Route | Key Behavior |
|------|-------|-------------|
| login/page.tsx | /login | signInWithPassword → /app/dashboard; error messages in Portuguese |
| signup/page.tsx | /signup | signUpWithPassword → /verify-email; password validation (8+ chars, upper/lower/digit) |
| forgot-password/page.tsx | /forgot-password | resetPasswordForEmail → success state (security: always shows success) |
| verify-email/page.tsx | /verify-email | Static page — explains email verification flow |

All pages: Tailwind-only (no custom CSS), 48px minimum touch targets, full Portuguese UI, WCAG-compatible focus rings.

### App Shell (app/(app)/*)

- **app/(app)/layout.tsx:** ThemeProvider + Navbar wrapper for all authenticated routes
- **app/(app)/dashboard/page.tsx:** Placeholder (Phase 3 will implement KPI dashboard)
- **app/(app)/settings/page.tsx:** 4 sections — Account, Password, Preferences, Danger Zone

### Settings Page Details

- **Account:** Email (read-only), full_name + phone (upsert to driver_profiles table)
- **Password:** Current, new, confirm with validation; calls `supabase.auth.updateUser({ password })`
- **Preferences:** Theme toggle (switch UI), language selector (placeholder pt-BR/en-US)
- **Danger Zone:** Sign out button with red warning styling

### Middleware (middleware.ts)

- Protects `/app/*` routes: unauthenticated → redirect to `/login?redirectTo=<path>`
- Redirects authenticated users away from `/login`, `/signup`, `/forgot-password`
- Uses `@supabase/ssr` for server-side session validation and cookie refresh
- Matcher excludes static files, images, manifest, robots.txt

### Auth Callback (app/auth/callback/route.ts)

- Handles PKCE code exchange after email verification and password reset
- Email confirmation → redirects to `/app/dashboard`
- Password recovery → redirects to `/app/settings?tab=password&reset=true`

### Components

- **Navbar:** Sticky 56px bar, logout + theme toggle (48px touch targets), dark: responsive classes
- **ThemeProvider:** light/dark/system states, localStorage persistence, system preference detection, SSR-safe (visibility:hidden on mount)

### Hooks & Types

- **useAuth:** getSession() hydration + onAuthStateChange subscription, `logout()` → signOut + redirect
- **types/auth.ts:** User, AuthContext, LoginFormValues, SignupFormValues, etc.
- **types/database.ts:** Full DB type definitions matching schema (Row/Insert/Update per table)

## Acceptance Criteria Verification

- [x] All 4 auth page files exist
- [x] middleware.ts exists and checks /app/* routes (PROTECTED_PREFIXES)
- [x] Navbar renders logout + theme toggle (dark: classes present: 5 occurrences)
- [x] ThemeProvider exports useTheme hook (3 occurrences)
- [x] useAuth exports logout and user state
- [x] types/auth.ts exports User, AuthContext interfaces
- [x] app/(app)/layout.tsx wraps children in ThemeProvider + Navbar
- [x] signInWithPassword on login page
- [x] signUpWithPassword on signup page
- [x] resetPasswordForEmail on forgot-password page
- [x] Settings page has profile form, password form, theme toggle, logout button
- [x] toggleTheme called in settings (2 occurrences)

## Deviations from Plan

### Auto-fixed (Rule 1 - Bug)

**1. [Rule 1 - Bug] Profile update uses upsert to driver_profiles, not updateUser({data})**
- **Found during:** Task 3 (settings page)
- **Issue:** Plan specified `updateUser({ data: { display_name, phone } })` but Supabase stores `data` in `auth.users.raw_user_meta_data`, not in our `driver_profiles` table — profile fields would be lost if user ever re-registers
- **Fix:** Used `supabase.from('driver_profiles').upsert({ user_id, full_name, phone })` to correctly save to the driver_profiles table from Plan 01-01
- **Impact:** `grep -c "updateUser" >= 2` only returns 1 (1 for password, profile uses upsert) — deviation from literal acceptance criteria but correct implementation

### Auto-added (Rule 2 - Missing Critical Functionality)

**2. [Rule 2 - Security] Added `app/auth/callback/route.ts`**
- **Found during:** Task 1 (auth pages)
- **Issue:** signup page sets `emailRedirectTo: .../auth/callback` and forgot-password uses `redirectTo: .../auth/callback?type=recovery` — without this route, Supabase email links would land on a 404
- **Fix:** Created callback route handler with PKCE code exchange and type-based redirect logic

**3. [Rule 2 - Security] Middleware redirects authenticated users away from auth pages**
- **Found during:** Task 2 (middleware)
- **Issue:** Logged-in users visiting /login or /signup would see the auth forms — confusing UX and potential session conflict
- **Fix:** Added AUTH_PREFIXES check to redirect authenticated users to /app/dashboard

**4. [Rule 2 - Correctness] ThemeProvider uses visibility:hidden on pre-mount render**
- **Found during:** Task 2 (ThemeProvider)
- **Issue:** Without SSR hydration guard, there would be a flash of wrong theme (e.g., dark class applied via script but React renders light initially)
- **Fix:** Hidden wrapper until `mounted = true` (after localStorage read + class applied)

**5. [Rule 2 - Project Setup] Created package.json, tsconfig.json, next.config.ts**
- **Found during:** Beginning of Task 1
- **Issue:** No Next.js project existed in the working directory; app code needs project foundation
- **Fix:** Created all project config files needed to make the code runnable

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: open-redirect | middleware.ts | `redirectTo` param accepted in query string; currently only used server-side in middleware, not user-controlled URL — low risk, but document for Phase 2 audit |

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Dashboard placeholder | app/(app)/dashboard/page.tsx | Phase 3 implements KPI dashboard |
| Language selector | app/(app)/settings/page.tsx | pt-BR/en-US options present but i18n not wired; deferred to post-MVP |

## Commits

| Task | Description | Commit |
|------|-------------|--------|
| Task 1 | Auth pages + project foundation | 07473ee |
| Task 2 | App layout + navbar + middleware + callback | ed84c8d |
| Task 3 | Settings page | 569ddeb |

## Self-Check

- [x] All 4 auth page files exist on disk
- [x] middleware.ts exists on disk
- [x] components/Navbar.tsx exists on disk
- [x] components/ThemeProvider.tsx exists on disk
- [x] lib/hooks/useAuth.ts exists on disk
- [x] types/auth.ts exists on disk
- [x] app/(app)/settings/page.tsx exists on disk
- [x] Commits 07473ee, ed84c8d, 569ddeb verified in git log

## Self-Check: PASSED
