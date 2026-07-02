-- Migration: 001_init_schema.sql
-- Purpose: Create core user tables for app-motorista
-- Tables: users (extends auth.users), driver_profiles, app_settings
-- LGPD compliance: PII stored in driver_profiles, accessible only by owner via RLS

-- =============================================================================
-- USERS TABLE
-- Extends Supabase auth.users; stores minimal public-facing user data
-- auth.users is managed by Supabase Auth — this table mirrors & extends it
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users IS
  'Mirror of auth.users for app-level queries. PII is in driver_profiles.';

-- Index: fast lookup by email (used in profile hydration)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- =============================================================================
-- DRIVER PROFILES TABLE
-- One profile per user; holds personal info and vehicle data (PII — LGPD scope)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.driver_profiles (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  phone        TEXT,
  vehicle_info JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.driver_profiles IS
  'Driver personal and vehicle information. LGPD-critical PII — restricted by RLS.';
COMMENT ON COLUMN public.driver_profiles.vehicle_info IS
  'Optional JSON with vehicle details (make, model, year, plate) — no sensitive ID numbers.';

-- Index: FK join performance (also enforced UNIQUE above, but explicit for clarity)
CREATE UNIQUE INDEX IF NOT EXISTS idx_driver_profiles_user_id ON public.driver_profiles (user_id);

-- Auto-update updated_at on row modifications
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_driver_profiles_updated_at
  BEFORE UPDATE ON public.driver_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- APP SETTINGS TABLE
-- One settings row per user; stores app preferences (non-PII)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.app_settings (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID        NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  theme                  TEXT        NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language               TEXT        NOT NULL DEFAULT 'pt-BR',
  notifications_enabled  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.app_settings IS
  'Per-user app preferences. Non-PII. Restricted by RLS.';
COMMENT ON COLUMN public.app_settings.theme IS
  'UI theme: light | dark | system (follows OS preference).';

-- Index: FK join (also UNIQUE above)
CREATE UNIQUE INDEX IF NOT EXISTS idx_app_settings_user_id ON public.app_settings (user_id);

CREATE OR REPLACE TRIGGER trg_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- AUTO-INSERT USER ROW ON AUTH SIGNUP
-- Trigger fires when Supabase Auth creates a new auth.users row
-- Creates matching public.users and initial app_settings rows automatically
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  -- Mirror auth.users into public.users
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NEW.created_at)
  ON CONFLICT (id) DO NOTHING;

  -- Bootstrap default app settings for new user
  INSERT INTO public.app_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
