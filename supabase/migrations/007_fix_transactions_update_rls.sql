-- Migration: 007_fix_transactions_update_rls.sql
-- Purpose: Fix the UPDATE RLS policy so soft-deletes (and edits) are allowed.
-- Tables: transactions
-- Dependencies: 004_transactions_rls.sql, 005_transactions_soft_delete.sql
--
-- BUG: In production, deleting a transaction failed with
--   "new row violates row-level security policy for table transactions".
-- Soft delete is an UPDATE that sets deleted_at = NOW(). The active UPDATE
-- policy in production was effectively enforcing `deleted_at IS NULL` on the
-- NEW row (a USING clause with no explicit WITH CHECK — Postgres reuses USING
-- as WITH CHECK). The freshly soft-deleted row has deleted_at != NULL, so the
-- WITH CHECK failed.
--
-- FIX: recreate the UPDATE policy with:
--   USING      (auth.uid() = user_id AND deleted_at IS NULL)  -- only act on active rows the user owns
--   WITH CHECK (auth.uid() = user_id)                          -- new row just has to stay owned by the user
-- This lets the user flip deleted_at from NULL -> NOW() (soft delete) and edit
-- their own active rows, while never touching other users' rows.
--
-- Idempotent: drops every prior UPDATE policy name this table has used.

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own active transactions" ON public.transactions;

CREATE POLICY "Users can update their own active transactions"
ON public.transactions FOR UPDATE
USING (
  auth.uid() = user_id AND deleted_at IS NULL
)
WITH CHECK (
  auth.uid() = user_id
);
