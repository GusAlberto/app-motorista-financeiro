-- Migration: 004_transactions_rls.sql
-- Purpose: Add RLS policies for the transactions table
-- Ensures users can only access their own transactions

-- Enable RLS on transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only SELECT their own transactions
CREATE POLICY "Users can read their own transactions"
  ON public.transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only INSERT transactions for themselves
CREATE POLICY "Users can insert their own transactions"
  ON public.transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only UPDATE their own transactions
CREATE POLICY "Users can update their own transactions"
  ON public.transactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only DELETE their own transactions
CREATE POLICY "Users can delete their own transactions"
  ON public.transactions
  FOR DELETE
  USING (auth.uid() = user_id);
