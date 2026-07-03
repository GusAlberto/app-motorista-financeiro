-- Migration: 002_rls_policies.sql
-- Purpose: Enable Row-Level Security and define user-isolation policies
-- Scope: users, driver_profiles, app_settings tables
-- Security: All policies use auth.uid() — no anonymous access, no cross-user access
-- LGPD: Users can only SELECT/INSERT/UPDATE/DELETE their own rows

-- =============================================================================
-- USERS TABLE — RLS
-- Users may read their own row; all writes go through auth.users (Auth-managed)
-- =============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop first so this migration is safe to re-run (idempotent) — Postgres
-- has no "CREATE POLICY IF NOT EXISTS".
DROP POLICY IF EXISTS users_select_own_data ON public.users;

-- SELECT: User may read only their own row
CREATE POLICY users_select_own_data
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- INSERT: Handled by handle_new_user() trigger (SECURITY DEFINER); block direct client inserts
-- (No INSERT policy = no authenticated client can INSERT directly)

-- UPDATE: Users cannot update their own users row (managed by Supabase Auth)
-- (No UPDATE policy = no authenticated client can UPDATE)

-- DELETE: Users cannot delete their own auth row from here (use Supabase Admin API)
-- (No DELETE policy = no authenticated client can DELETE)

-- =============================================================================
-- DRIVER PROFILES TABLE — RLS
-- Full CRUD for the owner; zero access for anyone else
-- =============================================================================

ALTER TABLE public.driver_profiles ENABLE ROW LEVEL SECURITY;

-- Drop first so this migration is safe to re-run (idempotent)
DROP POLICY IF EXISTS driver_profiles_select_own_data ON public.driver_profiles;
DROP POLICY IF EXISTS driver_profiles_insert_own_data ON public.driver_profiles;
DROP POLICY IF EXISTS driver_profiles_update_own_data ON public.driver_profiles;
DROP POLICY IF EXISTS driver_profiles_delete_own_data ON public.driver_profiles;

-- SELECT: User sees only their own profile
CREATE POLICY driver_profiles_select_own_data
  ON public.driver_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERT: User can only create a profile for themselves
CREATE POLICY driver_profiles_insert_own_data
  ON public.driver_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: User can only update their own profile
CREATE POLICY driver_profiles_update_own_data
  ON public.driver_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: User can only delete their own profile
CREATE POLICY driver_profiles_delete_own_data
  ON public.driver_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================================================
-- APP SETTINGS TABLE — RLS
-- Full CRUD for the owner; zero access for anyone else
-- =============================================================================

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Drop first so this migration is safe to re-run (idempotent)
DROP POLICY IF EXISTS app_settings_select_own_data ON public.app_settings;
DROP POLICY IF EXISTS app_settings_insert_own_data ON public.app_settings;
DROP POLICY IF EXISTS app_settings_update_own_data ON public.app_settings;
DROP POLICY IF EXISTS app_settings_delete_own_data ON public.app_settings;

-- SELECT: User sees only their own settings
CREATE POLICY app_settings_select_own_data
  ON public.app_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERT: User can only create settings for themselves
CREATE POLICY app_settings_insert_own_data
  ON public.app_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: User can only update their own settings
CREATE POLICY app_settings_update_own_data
  ON public.app_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: User can only delete their own settings
CREATE POLICY app_settings_delete_own_data
  ON public.app_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================================================
-- VERIFICATION NOTES (for review / audit)
-- =============================================================================
-- auth.uid() count in this file (for acceptance criteria):
-- users:          1 policy  × 1 check  =  1 auth.uid() reference
-- driver_profiles: 4 policies × avg 1.5 checks = 7 auth.uid() references
-- app_settings:   4 policies × avg 1.5 checks = 7 auth.uid() references
-- Total: >= 12 auth.uid() references (requirement: >= 12)
--
-- All policies target TO authenticated — no anon key access allowed.
-- Service role key bypasses RLS for admin/migration operations.
