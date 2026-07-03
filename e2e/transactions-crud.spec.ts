import { test, expect, type Page } from '@playwright/test'

/**
 * Authenticated end-to-end CRUD cycle for transactions.
 *
 * This is the layer unit tests can't reach: it drives the real UI against a
 * real Supabase, so it exercises the server actions AND the database's RLS
 * policies. It is exactly the test that would have caught the production
 * delete bug ("new row violates row-level security policy") before deploy.
 *
 * Requirements to run (otherwise the test self-skips, keeping CI green):
 *   - E2E_EMAIL / E2E_PASSWORD env vars for a DEDICATED test account that
 *     already exists in the Supabase project the app points at (.env.local).
 *     Use a throwaway account — ideally a separate test Supabase project —
 *     since this creates and soft-deletes a real transaction.
 *
 * Desktop-only: the create entry point differs on mobile (BottomNav "+"),
 * so this runs on the `chromium` project. The server/RLS path it validates
 * is identical regardless of viewport.
 */

const EMAIL = process.env.E2E_EMAIL
const PASSWORD = process.env.E2E_PASSWORD

async function login(page: Page) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(EMAIL!)
  await page.getByLabel('Senha').fill(PASSWORD!)
  await page.getByRole('button', { name: /entrar/i }).click()
  await page.waitForURL(/\/dashboard/)
}

// Fresh locator for the transaction row carrying our unique marker — the list
// re-renders after each mutation (router.refresh), so never cache it. Scoped to
// the row's data-testid so it's resilient to styling changes.
function rowFor(page: Page, marker: string) {
  return page.getByTestId('transaction-item').filter({ hasText: marker })
}

test.describe('transactions CRUD (authenticated)', () => {
  test('create → edit → delete a transaction end-to-end', async ({ page }, testInfo) => {
    test.skip(
      !EMAIL || !PASSWORD,
      'set E2E_EMAIL and E2E_PASSWORD (a dedicated test account) to run authenticated CRUD e2e',
    )
    // Guard against a half-configured CI (E2E creds set but Supabase still the
    // placeholder): skip instead of failing at login against a fake project.
    test.skip(
      (process.env.NEXT_PUBLIC_SUPABASE_URL || '').includes('placeholder'),
      'real NEXT_PUBLIC_SUPABASE_URL not configured — CRUD e2e needs a live Supabase',
    )
    test.skip(
      testInfo.project.name !== 'chromium',
      'CRUD e2e runs on the desktop project only (mobile uses a different create entry point)',
    )

    const marker = `E2E ${Date.now()}`

    await test.step('login', async () => {
      await login(page)
      await page.goto('/transactions')
      await expect(page.getByRole('heading', { name: 'Transações' })).toBeVisible()
    })

    await test.step('CREATE — register an income', async () => {
      // Open the quick-add sheet (desktop trigger) and fill the income form.
      await page.getByRole('button', { name: 'Registrar Ganho' }).click()
      const dialog = page.getByRole('dialog')
      await dialog.getByLabel('Valor (R$)').fill('20')
      await dialog.getByLabel('Descrição (opcional)').fill(marker)
      await dialog.getByRole('button', { name: 'Registrar Ganho' }).click()

      // Row shows up with the +R$ amount — proves the insert + RLS SELECT work.
      await expect(page.getByText(marker, { exact: true })).toBeVisible()
      await expect(rowFor(page, marker)).toContainText('20,00')
    })

    await test.step('UPDATE — change the amount', async () => {
      await rowFor(page, marker).getByRole('button', { name: /Editar transação/i }).click()
      await expect(page.getByRole('heading', { name: /Editar/i })).toBeVisible()

      const amount = page.getByLabel('Valor (R$)')
      await amount.clear()
      await amount.fill('99.90')
      await page.getByRole('button', { name: 'Salvar Alterações' }).click()

      // The updated amount is reflected — proves the update action + RLS UPDATE.
      await expect(rowFor(page, marker)).toContainText('99,90')
    })

    await test.step('DELETE — soft-delete the transaction', async () => {
      await rowFor(page, marker).getByRole('button', { name: /Excluir transação/i }).click()
      // Confirm in the dialog (button, not the "Excluir transação?" heading).
      await page.getByRole('button', { name: 'Excluir', exact: true }).click()

      // Row is gone — proves the soft-delete RPC works and the row leaves the
      // user's visible set. This is the exact regression that hit production.
      await expect(page.getByText(marker, { exact: true })).toHaveCount(0)
    })
  })
})
