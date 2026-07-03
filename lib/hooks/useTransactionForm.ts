/**
 * lib/hooks/useTransactionForm.ts
 *
 * Custom hook for managing transaction form state and submission
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/app/(app)/transactions/actions'

export interface TransactionFormState {
  isLoading: boolean
  error: string | null
  success: boolean
}

/**
 * Hook for transaction form operations
 */
export function useTransactionForm() {
  const router = useRouter()
  const [state, setState] = useState<TransactionFormState>({
    isLoading: false,
    error: null,
    success: false,
  })

  /**
   * Create a new transaction
   */
  const handleCreateTransaction = useCallback(
    async (data: any) => {
      setState({ isLoading: true, error: null, success: false })

      try {
        const result = await createTransaction(data)

        if (result.success) {
          setState({ isLoading: false, error: null, success: true })
          // Revalidate and refresh UI
          router.refresh()
          return result.data
        } else {
          setState({
            isLoading: false,
            error: result.error || 'Failed to create transaction',
            success: false,
          })
          throw new Error(result.error)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred'
        setState({ isLoading: false, error: message, success: false })
        throw error
      }
    },
    [router]
  )

  /**
   * Update an existing transaction
   */
  const handleUpdateTransaction = useCallback(
    async (id: string, data: any) => {
      setState({ isLoading: true, error: null, success: false })

      try {
        const result = await updateTransaction(id, data)

        if (result.success) {
          setState({ isLoading: false, error: null, success: true })
          // Revalidate and refresh UI
          router.refresh()
          return result.data
        } else {
          setState({
            isLoading: false,
            error: result.error || 'Failed to update transaction',
            success: false,
          })
          throw new Error(result.error)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred'
        setState({ isLoading: false, error: message, success: false })
        throw error
      }
    },
    [router]
  )

  /**
   * Delete a transaction (soft delete)
   */
  const handleDeleteTransaction = useCallback(
    async (id: string) => {
      setState({ isLoading: true, error: null, success: false })

      try {
        const result = await deleteTransaction(id)

        if (result.success) {
          setState({ isLoading: false, error: null, success: true })
          // Revalidate and refresh UI
          router.refresh()
          return result.data
        } else {
          setState({
            isLoading: false,
            error: result.error || 'Failed to delete transaction',
            success: false,
          })
          throw new Error(result.error)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred'
        setState({ isLoading: false, error: message, success: false })
        throw error
      }
    },
    [router]
  )

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  /**
   * Clear success message
   */
  const clearSuccess = useCallback(() => {
    setState((prev) => ({ ...prev, success: false }))
  }, [])

  return {
    state,
    handleCreateTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    clearError,
    clearSuccess,
  }
}
