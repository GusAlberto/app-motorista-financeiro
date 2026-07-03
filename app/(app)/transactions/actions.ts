'use server'

import { revalidatePath } from 'next/cache'
import { createUserServerClient } from '@/lib/supabase/server'
import {
  transactionSchema,
  editTransactionSchema,
  type Transaction,
  type EditTransaction,
} from '@/lib/validation/transaction'
import type { Database } from '@/types/database'

interface ActionResult {
  success: boolean
  data?: {
    id: string
    type: 'income' | 'expense'
    amount: number
    category: string
    description?: string | null
  }
  error?: string
}

/**
 * Create a new transaction (income or expense)
 */
export async function createTransaction(data: any): Promise<ActionResult> {
  try {
    const supabase = await createUserServerClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Authentication required',
      }
    }

    // Validate input
    let validated: Transaction
    try {
      validated = transactionSchema.parse(data)
    } catch (validationError: any) {
      return {
        success: false,
        error: validationError.errors?.[0]?.message || 'Validation failed',
      }
    }

    // Convert date string to ISO timestamp
    // The client sends YYYY-MM-DD (user's local date, no timezone offset).
    // We convert to midnight UTC of that date to preserve the user's intended date
    // regardless of their timezone. This avoids the "madrugada" bug where
    // new Date("2024-03-03") → UTC midnight → converts back to user's TZ = day before.
    const isoTimestamp = `${validated.transaction_date}T00:00:00Z`

    // Prepare database record
    const insertData: Database['public']['Tables']['transactions']['Insert'] = {
      user_id: user.id,
      type: validated.type,
      category: validated.category,
      amount: validated.amount,
      description: validated.description || null,
      transaction_date: isoTimestamp,
    }

    // Insert into database
    const { data: transaction, error: insertError } = await supabase
      .from('transactions')
      .insert([insertData])
      .select()
      .single()

    if (insertError) {
      console.error('Transaction insert error:', insertError)
      return {
        success: false,
        error: `Failed to create transaction: ${insertError.message}`,
      }
    }

    // Revalidate cache
    revalidatePath('/transactions')
    revalidatePath('/dashboard')

    return {
      success: true,
      data: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
      },
    }
  } catch (error) {
    console.error('Create transaction error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(
  id: string,
  data: EditTransaction
): Promise<ActionResult> {
  try {
    const supabase = await createUserServerClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Authentication required',
      }
    }

    // Validate input
    let validated: EditTransaction
    try {
      validated = editTransactionSchema.parse(data)
    } catch (validationError: any) {
      return {
        success: false,
        error: validationError.errors?.[0]?.message || 'Validation failed',
      }
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (validated.amount !== undefined) updateData.amount = validated.amount
    if (validated.category !== undefined) updateData.category = validated.category
    if (validated.description !== undefined) updateData.description = validated.description
    if (validated.transaction_date !== undefined) {
      updateData.transaction_date = `${validated.transaction_date}T00:00:00Z`
    }

    // Update transaction
    const { data: transaction, error: updateError } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns this transaction
      .select()
      .single()

    if (updateError) {
      console.error('Transaction update error:', updateError)
      return {
        success: false,
        error: `Failed to update transaction: ${updateError.message}`,
      }
    }

    if (!transaction) {
      return {
        success: false,
        error: 'Transaction not found',
      }
    }

    // Revalidate cache
    revalidatePath('/transactions')
    revalidatePath('/dashboard')

    return {
      success: true,
      data: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
      },
    }
  } catch (error) {
    console.error('Update transaction error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

/**
 * Soft delete a transaction (mark as deleted_at)
 */
export async function deleteTransaction(id: string): Promise<ActionResult> {
  try {
    const supabase = await createUserServerClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Authentication required',
      }
    }

    // Soft delete via a SECURITY DEFINER RPC. A plain UPDATE fails here:
    // setting deleted_at moves the row out of the SELECT policy's visible set
    // (deleted_at IS NULL), so RLS rejects it. The function bypasses RLS but
    // enforces ownership internally (user_id = auth.uid()). See migration 008.
    const { error: deleteError } = await supabase.rpc('soft_delete_transaction', {
      transaction_id: id,
    })

    if (deleteError) {
      console.error('Transaction delete error:', deleteError)
      // Surface the real Postgres error to speed up diagnosis (solo app,
      // owner testing their own data). Revert to a generic message once the
      // root cause is fixed.
      return {
        success: false,
        error: `Failed to delete transaction: ${deleteError.message}`,
      }
    }

    // Revalidate cache
    revalidatePath('/transactions')
    revalidatePath('/dashboard')

    return {
      success: true,
      data: {
        id,
        type: 'income',
        amount: 0,
        category: '',
      },
    }
  } catch (error) {
    console.error('Delete transaction error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
