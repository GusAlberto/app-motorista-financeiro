-- Migration: 006_rate_limits.sql
-- Purpose: Server-side rate limiting for auth flows (login, signup,
-- password reset) — no external dependency (Redis/Upstash), uses the
-- existing Postgres database so it stays lightweight and self-contained.

-- =============================================================================
-- RATE LIMITS TABLE
-- One row per (action, identifier) tracking a fixed time window.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.rate_limits (
  key           TEXT        PRIMARY KEY,
  window_start  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attempts      INT         NOT NULL DEFAULT 1
);

COMMENT ON TABLE public.rate_limits IS
  'Fixed-window rate-limit counters for auth flows. Accessed only via
   check_rate_limit() — RLS blocks all direct client access.';

-- Deny all direct access; the only way in is through the SECURITY DEFINER
-- function below (which runs as the function owner, bypassing RLS).
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ATOMIC RATE-LIMIT CHECK
-- Returns TRUE if the action is allowed (and records the attempt), FALSE if
-- the caller has exceeded p_max_attempts within the current window.
-- Uses SELECT ... FOR UPDATE to serialize concurrent requests for the same
-- key, preventing a race where two simultaneous requests both read
-- "under limit" and both get allowed through.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key TEXT,
  p_max_attempts INT,
  p_window_seconds INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.rate_limits%ROWTYPE;
BEGIN
  -- Opportunistic cleanup of long-expired rows (no cron needed — this
  -- table stays small since every call prunes a little).
  DELETE FROM public.rate_limits
  WHERE window_start < NOW() - (p_window_seconds || ' seconds')::interval * 4;

  SELECT * INTO v_row FROM public.rate_limits WHERE key = p_key FOR UPDATE;

  IF v_row IS NULL THEN
    INSERT INTO public.rate_limits (key, window_start, attempts)
    VALUES (p_key, NOW(), 1);
    RETURN TRUE;
  END IF;

  IF v_row.window_start < NOW() - (p_window_seconds || ' seconds')::interval THEN
    -- Window expired — start a fresh one.
    UPDATE public.rate_limits SET window_start = NOW(), attempts = 1 WHERE key = p_key;
    RETURN TRUE;
  END IF;

  IF v_row.attempts >= p_max_attempts THEN
    RETURN FALSE;
  END IF;

  UPDATE public.rate_limits SET attempts = attempts + 1 WHERE key = p_key;
  RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION public.check_rate_limit(TEXT, INT, INT) IS
  'Atomic fixed-window rate limiter. Returns TRUE if under the limit
   (and counts this call), FALSE if the limit was already reached.';

-- Callable by unauthenticated requests too (login/signup/forgot-password
-- all happen before a session exists).
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, INT, INT) TO anon, authenticated;
