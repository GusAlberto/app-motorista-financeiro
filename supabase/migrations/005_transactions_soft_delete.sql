-- Migration: 005_transactions_soft_delete.sql
-- Purpose: Add soft delete support to transactions table
-- Tables: transactions
-- Dependencies: transactions table (from 003_transactions_table.sql)

-- =============================================================================
-- ADD SOFT DELETE COLUMN
-- =============================================================================

-- Add deleted_at column to transactions table for soft deletes
ALTER TABLE IF EXISTS public.transactions
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN public.transactions.deleted_at IS
  'Timestamp when the transaction was soft-deleted. NULL means the transaction is active.';

-- Create index for soft delete queries (common filter: deleted_at IS NULL)
CREATE INDEX IF NOT EXISTS idx_transactions_deleted_at
ON public.transactions (deleted_at)
WHERE deleted_at IS NULL;

-- Create composite index for finding active transactions by user and date
CREATE INDEX IF NOT EXISTS idx_transactions_user_date_active
ON public.transactions (user_id, transaction_date DESC)
WHERE deleted_at IS NULL;

-- =============================================================================
-- UPDATE RLS POLICIES
-- =============================================================================

-- Drop existing policies (if they exist) to prevent conflicts
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;

-- Enable RLS if not already enabled
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own active (non-deleted) transactions
CREATE POLICY "Users can view their own active transactions"
ON public.transactions FOR SELECT
USING (
  auth.uid() = user_id AND deleted_at IS NULL
);

-- Policy: Users can insert their own transactions
CREATE POLICY "Users can create transactions"
ON public.transactions FOR INSERT
WITH CHECK (
  auth.uid() = user_id
);

-- Policy: Users can update their own active transactions
CREATE POLICY "Users can update their own active transactions"
ON public.transactions FOR UPDATE
USING (
  auth.uid() = user_id AND deleted_at IS NULL
)
WITH CHECK (
  auth.uid() = user_id
);

-- Policy: Users can soft-delete their own transactions
CREATE POLICY "Users can delete their own transactions"
ON public.transactions FOR DELETE
USING (
  auth.uid() = user_id
);

-- =============================================================================
-- HELPER FUNCTION FOR SOFT DELETES
-- =============================================================================

-- Create a function to soft-delete transactions instead of hard-deleting
CREATE OR REPLACE FUNCTION public.soft_delete_transaction(transaction_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.transactions
  SET deleted_at = NOW(),
      updated_at = NOW()
  WHERE id = transaction_id
    AND deleted_at IS NULL;
END;
$$;

COMMENT ON FUNCTION public.soft_delete_transaction(UUID) IS
  'Soft-delete a transaction by setting deleted_at timestamp. Only works on active (non-deleted) transactions.';

-- =============================================================================
-- HELPER FUNCTION TO RESTORE SOFT-DELETED TRANSACTIONS
-- =============================================================================

-- Create a function to restore soft-deleted transactions
CREATE OR REPLACE FUNCTION public.restore_transaction(transaction_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.transactions
  SET deleted_at = NULL,
      updated_at = NOW()
  WHERE id = transaction_id
    AND deleted_at IS NOT NULL;
END;
$$;

COMMENT ON FUNCTION public.restore_transaction(UUID) IS
  'Restore a soft-deleted transaction by clearing the deleted_at timestamp.';
