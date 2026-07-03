/**
 * components/transaction-crud.test.tsx
 *
 * Contract tests for the transaction CRUD UI. These render the real form
 * components, drive them like a user, and assert that the payload each one
 * emits is accepted by the SAME Zod schema the server action validates
 * against.
 *
 * Why this file exists: editing silently broke in production when the schema
 * changed transaction_date from z.date() to z.string() but EditTransactionModal
 * kept sending `new Date(...)`. A green build shipped a broken edit. These
 * tests fail the moment a form emits a shape the server would reject — so that
 * class of regression can never reach production again.
 *
 * Not covered here: database-level behavior (RLS policies, soft-delete
 * persistence). That requires E2E against a real Supabase — see e2e/.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { IncomeForm } from './IncomeForm'
import { ExpenseForm } from './ExpenseForm'
import { EditTransactionModal } from './EditTransactionModal'
import {
  transactionSchema,
  editTransactionSchema,
} from '@/lib/validation/transaction'
import type { Database } from '@/types/database'

type TransactionRow = Database['public']['Tables']['transactions']['Row']

function makeTransaction(overrides: Partial<TransactionRow> = {}): TransactionRow {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    user_id: '22222222-2222-2222-2222-222222222222',
    type: 'income',
    category: 'ride',
    amount: 20,
    description: 'Teste',
    transaction_date: '2026-07-02T00:00:00Z',
    created_at: '2026-07-02T10:00:00Z',
    updated_at: '2026-07-02T10:00:00Z',
    deleted_at: null,
    ...overrides,
  }
}

describe('CREATE — IncomeForm', () => {
  it('emits a payload the server schema accepts (transaction_date is a string)', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()

    render(<IncomeForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText('Valor (R$)'), '150.50')
    await user.click(screen.getByRole('button', { name: /registrar ganho/i }))

    expect(onSuccess).toHaveBeenCalledTimes(1)
    const payload = onSuccess.mock.calls[0][0]

    expect(typeof payload.transaction_date).toBe('string')
    expect(transactionSchema.safeParse(payload).success).toBe(true)
  })
})

describe('CREATE — ExpenseForm', () => {
  it('emits a payload the server schema accepts (transaction_date is a string)', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()

    render(<ExpenseForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText('Valor (R$)'), '35')
    await user.click(screen.getByRole('button', { name: /registrar despesa/i }))

    expect(onSuccess).toHaveBeenCalledTimes(1)
    const payload = onSuccess.mock.calls[0][0]

    expect(typeof payload.transaction_date).toBe('string')
    expect(transactionSchema.safeParse(payload).success).toBe(true)
  })
})

describe('UPDATE — EditTransactionModal', () => {
  it('emits a payload the edit schema accepts — regression guard for "Expected string, received date"', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockResolvedValue(undefined)

    render(
      <EditTransactionModal
        transaction={makeTransaction()}
        isOpen
        onClose={() => {}}
        onSave={onSave}
      />,
    )

    // Change the amount and save.
    const amount = screen.getByLabelText('Valor (R$)')
    await user.clear(amount)
    await user.type(amount, '89.99')
    await user.click(screen.getByRole('button', { name: /salvar alterações/i }))

    expect(onSave).toHaveBeenCalledTimes(1)
    const [id, data] = onSave.mock.calls[0]

    expect(id).toBe('11111111-1111-1111-1111-111111111111')
    // The exact field that broke: a Date here fails the string schema.
    expect(typeof data.transaction_date).toBe('string')
    expect(editTransactionSchema.safeParse(data).success).toBe(true)
  })

  it('blocks a future date instead of emitting an invalid payload', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockResolvedValue(undefined)

    render(
      <EditTransactionModal
        transaction={makeTransaction()}
        isOpen
        onClose={() => {}}
        onSave={onSave}
      />,
    )

    // Year 2999 is unambiguously in the future.
    await user.clear(screen.getByLabelText('Data'))
    await user.type(screen.getByLabelText('Data'), '2999-01-01')
    await user.click(screen.getByRole('button', { name: /salvar alterações/i }))

    expect(onSave).not.toHaveBeenCalled()
    expect(screen.getByText(/não pode ser no futuro/i)).toBeInTheDocument()
  })
})
