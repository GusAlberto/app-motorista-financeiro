---
phase: 01-authentication-foundation
plan: 01
subsystem: database
status: complete
tags: [database, rls, migrations, postgresql, supabase, lgpd]
dependency_graph:
  requires: []
  provides: [users-table, driver_profiles-table, app_settings-table, rls-policies]
  affects: [02-supabase-auth, 03-app-shell]
tech_stack:
  added: [supabase-migrations, postgresql-rls, gen_random_uuid]
  patterns: [row-level-security, cascade-delete, auto-trigger-updated_at, security-definer-trigger]
key_files:
  created:
    - supabase/migrations/001_init_schema.sql
    - supabase/migrations/002_rls_policies.sql
  modified: []
decisions:
  - "users table references auth.users via FK (not a copy) to leverage Supabase Auth lifecycle"
  - "handle_new_user() trigger auto-creates public.users + app_settings on auth signup (SECURITY DEFINER)"
  - "set_updated_at() trigger on driver_profiles and app_settings for audit trail"
  - "All RLS policies target TO authenticated — no anon access permitted"
  - "theme column uses CHECK constraint (light|dark|system) to enforce valid enum values"
metrics:
  duration: 15m
  completed: 2026-07-01
  tasks_completed: 2
  files_created: 2
---

# Phase 01 Plan 01: Database Schema & RLS Summary

**One-liner:** PostgreSQL schema (3 tables) + RLS policies (17 auth.uid() checks) ensuring LGPD-compliant user isolation on all CRUD operations.

## What Was Built

### 001_init_schema.sql

Created three tables forming the user data foundation:

- **public.users** — Mirrors `auth.users` for app-level queries (id, email, created_at). FK to `auth.users(id)` with CASCADE delete. Auto-populated by `handle_new_user()` trigger on auth signup.

- **public.driver_profiles** — Driver personal data (full_name, phone, vehicle_info JSONB). One-to-one with users (UNIQUE on user_id). `updated_at` auto-maintained by trigger.

- **public.app_settings** — User preferences (theme, language, notifications_enabled). One-to-one with users (UNIQUE on user_id). Default theme: `light`, language: `pt-BR`. `updated_at` auto-maintained by trigger.

Additional:
- `handle_new_user()` SECURITY DEFINER trigger: fires on `auth.users INSERT` to auto-create `public.users` row and bootstrap default `app_settings`
- `set_updated_at()` trigger function reused by both driver_profiles and app_settings

### 002_rls_policies.sql

Enabled RLS and created user-isolation policies on all three tables:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| public.users | owner only | blocked (trigger-managed) | blocked | blocked |
| public.driver_profiles | owner only | owner only | owner only | owner only |
| public.app_settings | owner only | owner only | owner only | owner only |

All policies use `auth.uid() = user_id` (or `auth.uid() = id` for users table). Total: **17 auth.uid() references** (requirement: >= 12).

## Acceptance Criteria Verification

- [x] `supabase/migrations/001_init_schema.sql` exists
- [x] Contains CREATE TABLE for users, driver_profiles, app_settings
- [x] FK constraints with ON DELETE CASCADE on driver_profiles.user_id and app_settings.user_id
- [x] UNIQUE constraints on driver_profiles(user_id) and app_settings(user_id)
- [x] No INSERT data statements (schema only)
- [x] `supabase/migrations/002_rls_policies.sql` exists
- [x] ALTER TABLE ... ENABLE ROW LEVEL SECURITY for all three tables
- [x] CREATE POLICY statements for SELECT, INSERT, UPDATE, DELETE (where applicable)
- [x] 17 auth.uid() references (>= 12 required)
- [x] No hardcoded user IDs

## Deviations from Plan

### Auto-added (Rule 2 - Missing Critical Functionality)

**1. [Rule 2 - Security] Added `handle_new_user()` auto-trigger**
- **Found during:** Task 1
- **Issue:** Plan required manual creation of users + app_settings rows after signup; without a trigger, the app would fail if a client forgot to call the insert API or if signup occurred before the client code ran
- **Fix:** Added SECURITY DEFINER trigger on `auth.users` INSERT to atomically create `public.users` and `app_settings` rows
- **Files modified:** `supabase/migrations/001_init_schema.sql`

**2. [Rule 2 - Data Integrity] Added CHECK constraint on theme column**
- **Found during:** Task 1
- **Issue:** `app_settings.theme TEXT` with no constraint would allow arbitrary string values, breaking theme toggle logic
- **Fix:** Added `CHECK (theme IN ('light', 'dark', 'system'))` constraint
- **Files modified:** `supabase/migrations/001_init_schema.sql`

**3. [Rule 2 - Audit] Added `set_updated_at()` trigger with `BEFORE UPDATE` semantics**
- **Found during:** Task 1
- **Issue:** Plan mentioned `updated_at` column but no mechanism to auto-update it; manual maintenance is error-prone
- **Fix:** Created reusable `set_updated_at()` trigger function and attached it to both profile tables

## Commits

| Task | Description | Commit |
|------|-------------|--------|
| Task 1 + 2 | Database schema + RLS policies | 640a781 |

## Self-Check

- [x] `supabase/migrations/001_init_schema.sql` exists on disk
- [x] `supabase/migrations/002_rls_policies.sql` exists on disk
- [x] Commit 640a781 verified in git log

## Self-Check: PASSED
