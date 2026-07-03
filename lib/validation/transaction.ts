/**
 * lib/validation/transaction.ts
 *
 * Zod validation schemas for transaction forms (income/expense).
 * Used for client-side and server-side validation.
 */

import { z } from 'zod'

/**
 * Common transaction validation fields
 */
const baseTransactionSchema = {
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(999999.99, 'Amount is too large'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category is too long'),
  description: z
    .string()
    .max(500, 'Description is too long')
    .optional()
    .or(z.literal('')),
  transaction_date: z
    .date()
    .refine(
      (date) => date <= new Date(),
      'Transaction date cannot be in the future'
    ),
}

/**
 * Income transaction schema
 */
export const incomeTransactionSchema = z.object({
  type: z.literal('income'),
  amount: baseTransactionSchema.amount,
  category: z
    .enum(['ride', 'bonus', 'other_income'], {
      errorMap: () => ({ message: 'Invalid income category' }),
    })
    .default('ride'),
  description: baseTransactionSchema.description,
  transaction_date: baseTransactionSchema.transaction_date,
})

export type IncomeTransaction = z.infer<typeof incomeTransactionSchema>

/**
 * Expense transaction schema
 */
export const expenseTransactionSchema = z.object({
  type: z.literal('expense'),
  amount: baseTransactionSchema.amount,
  category: z
    .enum(['fuel', 'maintenance', 'tolls', 'parking', 'car_wash', 'insurance', 'other_expense'], {
      errorMap: () => ({ message: 'Invalid expense category' }),
    })
    .default('fuel'),
  description: baseTransactionSchema.description,
  transaction_date: baseTransactionSchema.transaction_date,
})

export type ExpenseTransaction = z.infer<typeof expenseTransactionSchema>

/**
 * Combined transaction schema (for polymorphic handling)
 */
export const transactionSchema = z.discriminatedUnion('type', [
  incomeTransactionSchema,
  expenseTransactionSchema,
])

export type Transaction = z.infer<typeof transactionSchema>

/**
 * Edit transaction schema (allows partial updates)
 */
export const editTransactionSchema = transactionSchema.partial()

export type EditTransaction = z.infer<typeof editTransactionSchema>

/**
 * Category options
 */
export const INCOME_CATEGORIES = [
  { value: 'ride', label: 'Ride' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'other_income', label: 'Other Income' },
]

export const EXPENSE_CATEGORIES = [
  { value: 'fuel', label: 'Fuel' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'tolls', label: 'Tolls' },
  { value: 'parking', label: 'Parking' },
  { value: 'car_wash', label: 'Car Wash' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other_expense', label: 'Other Expense' },
]
