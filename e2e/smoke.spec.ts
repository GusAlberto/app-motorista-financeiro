import { test, expect } from '@playwright/test'

/**
 * Smoke tests — verify core public routes render and auth guards work.
 * These run against the production build with no Supabase session.
 */

test('home page renders the landing hero', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: /valeu a pena/i })
  ).toBeVisible()
})

test('home page "Começar agora" CTA navigates to /signup (not 404)', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /começar agora/i }).first().click()
  await expect(page).toHaveURL(/\/signup$/)
  await expect(page.getByRole('button', { name: /criar conta/i })).toBeVisible()
})

test('home page "Criar conta grátis" CTA navigates to /signup (not 404)', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /criar conta grátis/i }).click()
  await expect(page).toHaveURL(/\/signup$/)
})

test('public navbar "Login" link navigates to /login (not 404)', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Login' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByLabel('Email')).toBeVisible()
})

test('login page renders the form', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Senha')).toBeVisible()
  await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible()
})

test('signup page renders', async ({ page }) => {
  await page.goto('/signup')
  await expect(page.getByRole('button', { name: /criar conta/i })).toBeVisible()
})

test('protected dashboard redirects unauthenticated users to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})

test('FAQ page renders questions', async ({ page }) => {
  await page.goto('/faq')
  await expect(
    page.getByRole('heading', { name: /perguntas frequentes/i })
  ).toBeVisible()
})

test('no internal links on public pages return 404', async ({ page, request }) => {
  const publicPages = ['/', '/how-it-works', '/faq', '/privacy', '/terms']
  const found = new Set<string>()

  for (const path of publicPages) {
    await page.goto(path)
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((els) =>
      els.map((el) => el.getAttribute('href') || '')
    )
    hrefs.forEach((h) => found.add(h))
  }

  expect(found.size).toBeGreaterThan(0)

  for (const href of found) {
    const res = await request.get(href)
    expect(res.status(), `link ${href} should not 404`).not.toBe(404)
  }
})

test('manifest is served', async ({ request }) => {
  const res = await request.get('/manifest.webmanifest')
  expect(res.ok()).toBeTruthy()
  const json = await res.json()
  expect(json.name).toBe('App Motorista')
  expect(json.icons.length).toBeGreaterThan(0)
})
