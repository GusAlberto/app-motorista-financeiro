-- Migration: 008_secure_soft_delete_rpc.sql
-- Purpose: Make soft-delete work under RLS, securely.
-- Tables/Functions: public.soft_delete_transaction(uuid)
-- Dependencies: 005_transactions_soft_delete.sql
--
-- BUG: Deleting a transaction from the app failed with
--   "new row violates row-level security policy for table transactions".
-- Soft delete is an UPDATE that sets deleted_at = NOW(). Because the SELECT
-- policy hides rows where deleted_at IS NOT NULL, the just-deleted row falls
-- out of the user's visible set, and the client's UPDATE (which reads the row
-- back) is rejected. Editing works because an edit keeps deleted_at NULL, so
-- the row stays visible; only the soft-delete transition trips it.
--
-- FIX: perform the soft delete inside a SECURITY DEFINER function, which runs
-- with the function owner's privileges and therefore is NOT subject to RLS.
-- Ownership is enforced explicitly inside the function via
-- `user_id = auth.uid()`, so a user can still only delete their OWN rows —
-- no security is lost. (Migration 005 created a soft_delete_transaction()
-- WITHOUT the ownership check; this replaces it with the checked version.)

CREATE OR REPLACE FUNCTION public.soft_delete_transaction(transaction_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.transactions
  SET deleted_at = NOW(),
      updated_at = NOW()
  WHERE id = transaction_id
    AND user_id = auth.uid()     -- enforce ownership (RLS is bypassed here)
    AND deleted_at IS NULL;      -- idempotent: no-op if already deleted
END;
$$;

COMMENT ON FUNCTION public.soft_delete_transaction(uuid) IS
  'Soft-delete the caller''s own transaction. SECURITY DEFINER bypasses RLS; ownership enforced via user_id = auth.uid().';

-- Only authenticated users may call it; never anon/public.
REVOKE ALL ON FUNCTION public.soft_delete_transaction(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.soft_delete_transaction(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.soft_delete_transaction(uuid) TO authenticated;
