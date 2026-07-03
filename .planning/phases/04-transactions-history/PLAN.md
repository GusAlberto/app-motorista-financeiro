# PLAN.md | Phase 4: Transactions & History

**Phase:** 4 of 5  
**Goal:** Enable rapid transaction logging (income/expense) with full CRUD and filtering.  
**Duration:** 1.5 weeks  
**Status:** Ready to Execute

---

## Success Criteria

1. User can log income in < 15 seconds
2. User can log expense in < 15 seconds
3. Transaction list shows all txns with filters
4. User can edit and delete transactions
5. Forms are mobile-optimized (one-handed)
6. Form validation works
7. Running totals visible in list
8. Soft deletes enforced

---

## Execution Plan

### Wave 1: Form Components & Validation

**Task 1.1: Create transaction form components**
- File: `components/IncomeForm.tsx`
- File: `components/ExpenseForm.tsx`
- Minimal fields: amount, category, description, date
- Mobile-optimized (large buttons, tap-friendly)
- Dark mode support

**Task 1.2: Add form validation with Zod**
- File: `lib/validation/transaction.ts`
- Schema for income/expense validation
- Amount > 0, category required, optional description
- Date validation (not future)

**Task 1.3: Create form submission action**
- File: `app/(app)/transactions/actions.ts`
- Server Action for creating transactions
- Return success/error messages
- Optimistic updates support

---

### Wave 2: Transaction List UI

**Task 2.1: Create transaction list page**
- File: `app/(app)/transactions/page.tsx`
- Display all transactions for user (Server Component)
- Date, amount, category, description columns
- Empty state handling
- Responsive grid/table layout

**Task 2.2: Build transaction item component**
- File: `components/TransactionItem.tsx`
- Show transaction details
- Quick actions (edit, delete buttons)
- Running balance calculation
- Category color coding

**Task 2.3: Add filter UI**
- File: `components/TransactionFilters.tsx`
- Filter by: period, type (income/expense), category
- Search by description
- URL params for state persistence
- No full page reload

---

### Wave 3: Edit & Delete Operations

**Task 3.1: Create edit modal/form**
- File: `components/EditTransactionModal.tsx`
- Pre-populate form with transaction data
- Same validation as create form
- Server Action for updating

**Task 3.2: Create delete confirmation**
- File: `components/DeleteTransactionConfirm.tsx`
- Confirmation dialog with soft delete
- Undo support (optional, soft delete means data recoverable)

**Task 3.3: Update database schema**
- Add `deleted_at` column to transactions table (soft delete)
- Update RLS policies to exclude soft-deleted rows
- Migration: `005_transactions_soft_delete.sql`

---

### Wave 4: Polish & Mobile Optimization

**Task 4.1: Optimize forms for mobile**
- One-handed input (buttons on bottom)
- Large touch targets (44px minimum)
- Keyboard-friendly (number input for amounts)
- Auto-focus first field

**Task 4.2: Add loading states & feedback**
- Loading skeletons for list
- Toast notifications (success/error)
- Optimistic UI updates

**Task 4.3: Performance audit**
- Verify list pagination or virtualization if needed
- Check query performance (with indexes)
- Lighthouse audit (mobile)

---

## Dependencies

- ✅ Phase 1: Auth, Database, RLS
- ✅ Phase 3: Dashboard (dashboard shows aggregated data from transactions)
- ⏳ transactions table from Phase 3

---

## Outputs

- Income/Expense form components
- Transaction list page
- Edit/Delete modals
- Filter UI
- Validation schema (Zod)
- Soft delete migration
- Mobile optimization report

---

## Testing Checklist

- [ ] Create income transaction < 15 seconds
- [ ] Create expense transaction < 15 seconds
- [ ] List shows all transactions with correct amounts
- [ ] Filter by period, type, category works
- [ ] Edit transaction updates dashboard
- [ ] Delete (soft delete) hides from list but keeps data
- [ ] Mobile forms work one-handed
- [ ] Dark mode works throughout
- [ ] Form validation prevents invalid entries
- [ ] Running totals are accurate

---

## Git Strategy

Atomic commits per task:
1. `feat(phase-4): add transaction form components and validation`
2. `feat(phase-4): add transaction list page and filtering`
3. `feat(phase-4): add edit/delete operations with soft delete`
4. `feat(phase-4): optimize forms for mobile and add UX feedback`
5. `docs(phase-4): add performance audit and testing checklist`

---

**Next:** Execute Phase 4 with `/gsd-execute-phase 4`
