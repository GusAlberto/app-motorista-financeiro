import { describe, it, expect } from 'vitest'
import {
  incomeTransactionSchema,
  expenseTransactionSchema,
  transactionSchema,
  editTransactionSchema,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from './transaction'

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)

describe('incomeTransactionSchema', () => {
  it('accepts a valid income transaction', () => {
    const result = incomeTransactionSchema.safeParse({
      type: 'income',
      amount: 150.5,
      category: 'ride',
      description: 'Corrida centro',
      transaction_date: yesterday,
    })
    expect(result.success).toBe(true)
  })

  it('rejects amount <= 0', () => {
    const result = incomeTransactionSchema.safeParse({
      type: 'income',
      amount: 0,
      category: 'ride',
      transaction_date: yesterday,
    })
    expect(result.success).toBe(false)
  })

  it('rejects a future transaction date', () => {
    const result = incomeTransactionSchema.safeParse({
      type: 'income',
      amount: 10,
      category: 'ride',
      transaction_date: tomorrow,
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid income category', () => {
    const result = incomeTransactionSchema.safeParse({
      type: 'income',
      amount: 10,
      category: 'fuel',
      transaction_date: yesterday,
    })
    expect(result.success).toBe(false)
  })
})

describe('expenseTransactionSchema', () => {
  it('accepts a valid expense transaction', () => {
    const result = expenseTransactionSchema.safeParse({
      type: 'expense',
      amount: 50,
      category: 'fuel',
      transaction_date: yesterday,
    })
    expect(result.success).toBe(true)
  })

  it('rejects amount above the max', () => {
    const result = expenseTransactionSchema.safeParse({
      type: 'expense',
      amount: 1_000_000,
      category: 'fuel',
      transaction_date: yesterday,
    })
    expect(result.success).toBe(false)
  })
})

describe('transactionSchema (discriminated union)', () => {
  it('discriminates income vs expense by type', () => {
    expect(
      transactionSchema.safeParse({
        type: 'income',
        amount: 10,
        category: 'bonus',
        transaction_date: yesterday,
      }).success
    ).toBe(true)

    // expense category on an income type must fail
    expect(
      transactionSchema.safeParse({
        type: 'income',
        amount: 10,
        category: 'tolls',
        transaction_date: yesterday,
      }).success
    ).toBe(false)
  })
})

describe('editTransactionSchema', () => {
  it('allows partial updates', () => {
    const result = editTransactionSchema.safeParse({ amount: 42 })
    expect(result.success).toBe(true)
  })

  it('still validates provided fields', () => {
    const result = editTransactionSchema.safeParse({ amount: -5 })
    expect(result.success).toBe(false)
  })
})

describe('category label maps', () => {
  it('exposes Portuguese labels for all categories', () => {
    expect(INCOME_CATEGORIES.find((c) => c.value === 'ride')?.label).toBe('Corrida')
    expect(EXPENSE_CATEGORIES.find((c) => c.value === 'fuel')?.label).toBe('Combustível')
  })
})
