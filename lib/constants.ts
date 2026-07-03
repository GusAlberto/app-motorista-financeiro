/**
 * lib/constants.ts
 *
 * Shared app-wide constants. Single source of truth for values referenced
 * across metadata, SEO structured data, and redirect URLs — avoids stale
 * hardcoded domains drifting out of sync when the production domain changes.
 */

/**
 * Canonical production URL (no trailing slash).
 * Falls back to the current production domain if the env var isn't set
 * (local dev should set NEXT_PUBLIC_APP_URL in .env.local).
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://motorista.dev'
