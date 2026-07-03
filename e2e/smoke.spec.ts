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

test('home page links to signup', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /começar agora/i }).first()).toBeVisible()
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

test('manifest is served', async ({ request }) => {
  const res = await request.get('/manifest.webmanifest')
  expect(res.ok()).toBeTruthy()
  const json = await res.json()
  expect(json.name).toBe('App Motorista')
  expect(json.icons.length).toBeGreaterThan(0)
})
