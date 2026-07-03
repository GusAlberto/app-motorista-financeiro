'use server'

import { revalidatePath } from 'next/cache'
import { createUserServerClient } from '@/lib/supabase/server'
import {
  transactionSchema,
  incomeTransactionSchema,
  expenseTransactionSchema,
  type Transaction,
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

    // Prepare database record
    const insertData: Database['public']['Tables']['transactions']['Insert'] = {
      user_id: user.id,
      type: validated.type,
      category: validated.category,
      amount: validated.amount,
      description: validated.description || null,
      transaction_date: validated.transaction_date.toISOString(),
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
        error: 'Failed to create transaction',
      }
    }

    // Revalidate cache
    revalidatePath('/app/transactions')
    revalidatePath('/app/dashboard')

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
  data: Partial<Transaction>
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
    let validated: Partial<Transaction>
    try {
      validated = transactionSchema.partial().parse(data)
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
      updateData.transaction_date = validated.transaction_date.toISOString()
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
        error: 'Failed to update transaction',
      }
    }

    if (!transaction) {
      return {
        success: false,
        error: 'Transaction not found',
      }
    }

    // Revalidate cache
    revalidatePath('/app/transactions')
    revalidatePath('/app/dashboard')

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
 * Note: This requires the deleted_at column to be added (will be done in migration 005)
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

    // For now, hard delete (will change to soft delete after migration 005)
    // In production, we'd set deleted_at instead:
    // const { error } = await supabase
    //   .from('transactions')
    //   .update({ deleted_at: new Date().toISOString() })
    //   .eq('id', id)
    //   .eq('user_id', user.id)

    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Transaction delete error:', deleteError)
      return {
        success: false,
        error: 'Failed to delete transaction',
      }
    }

    // Revalidate cache
    revalidatePath('/app/transactions')
    revalidatePath('/app/dashboard')

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
