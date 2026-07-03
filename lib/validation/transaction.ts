/**
 * lib/validation/transaction.ts
 *
 * Zod validation schemas for transaction forms (income/expense).
 * Used for client-side and server-side validation.
 */

import { z } from 'zod'

/**
 * Category value lists — single source of truth. Both the create schema
 * (via z.enum) and the edit schema derive their allowed values from these,
 * so an edited transaction can never end up with a category outside the
 * app's known set.
 */
export const INCOME_CATEGORY_VALUES = ['ride', 'bonus', 'other_income'] as const
export const EXPENSE_CATEGORY_VALUES = [
  'fuel',
  'maintenance',
  'tolls',
  'parking',
  'car_wash',
  'insurance',
  'other_expense',
] as const

/**
 * Category options (Portuguese labels) — for <select> UI.
 */
export const INCOME_CATEGORIES = [
  { value: 'ride', label: 'Corrida' },
  { value: 'bonus', label: 'Bônus' },
  { value: 'other_income', label: 'Outros Ganhos' },
]

export const EXPENSE_CATEGORIES = [
  { value: 'fuel', label: 'Combustível' },
  { value: 'maintenance', label: 'Manutenção' },
  { value: 'tolls', label: 'Pedágios' },
  { value: 'parking', label: 'Estacionamento' },
  { value: 'car_wash', label: 'Lavagem' },
  { value: 'insurance', label: 'Seguro' },
  { value: 'other_expense', label: 'Outras Despesas' },
]

/**
 * Common transaction validation fields
 */
const baseTransactionSchema = {
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(999999.99, 'Amount is too large'),
  description: z
    .string()
    .max(500, 'Description is too long')
    .optional()
    .or(z.literal('')),
  transaction_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(
      (dateStr) => {
        const today = new Date().toISOString().split('T')[0]
        return dateStr <= today
      },
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
    .enum(INCOME_CATEGORY_VALUES, {
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
    .enum(EXPENSE_CATEGORY_VALUES, {
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
 * Edit transaction schema (allows partial updates).
 * NOTE: discriminated unions don't support .partial(), so this is a plain
 * object schema with all editable fields optional. `type` is immutable on
 * edit, so `category` is validated against the union of BOTH income and
 * expense values here (the schema doesn't know which type the target row
 * is) — still restricted to the app's known category set, never a
 * free-form string.
 */
export const editTransactionSchema = z.object({
  amount: baseTransactionSchema.amount.optional(),
  category: z
    .enum([...INCOME_CATEGORY_VALUES, ...EXPENSE_CATEGORY_VALUES], {
      errorMap: () => ({ message: 'Invalid category' }),
    })
    .optional(),
  description: baseTransactionSchema.description,
  transaction_date: baseTransactionSchema.transaction_date.optional(),
})

export type EditTransaction = z.infer<typeof editTransactionSchema>
