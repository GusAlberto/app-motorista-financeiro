-- Migration: 003_transactions_table.sql
-- Purpose: Create transactions table for recording income and expenses
-- Tables: transactions
-- Dependencies: users table (from 001_init_schema.sql)

-- =============================================================================
-- TRANSACTIONS TABLE
-- Records all income and expense events for drivers
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.transactions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type            TEXT        NOT NULL CHECK (type IN ('income', 'expense')),
  category        TEXT        NOT NULL,
  amount          NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  description     TEXT,
  transaction_date TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.transactions IS
  'Financial transactions (income/expenses) for drivers. User-scoped via RLS.';
COMMENT ON COLUMN public.transactions.type IS
  'Transaction type: income (ride earnings) or expense (fuel, maintenance, etc.)';
COMMENT ON COLUMN public.transactions.category IS
  'Category: Ride (income), Fuel, Maintenance, Tolls, etc.';
COMMENT ON COLUMN public.transactions.amount IS
  'Amount in local currency (BRL). Always positive; type determines sign in calculations.';
COMMENT ON COLUMN public.transactions.transaction_date IS
  'Date and time of the transaction (when it occurred, not when logged).';

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions (user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions (type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions (category);

-- Auto-update updated_at on row modifications
CREATE OR REPLACE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
