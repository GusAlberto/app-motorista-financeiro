/**
 * lib/supabase/index.ts
 *
 * Central re-export for Supabase client utilities.
 * Import from here for cleaner import paths:
 *
 *   // Browser / Client Component
 *   import { createClient } from '@/lib/supabase'
 *
 *   // Server / Server Component / API Route
 *   import { createServerClient, createUserServerClient } from '@/lib/supabase'
 *
 * Security note: Do NOT import server.ts in Client Components.
 * The bundler resolves the import at build time, but the service role key
 * must never reach the browser. Use 'server-only' guards in production.
 */

// Browser-safe client (anon key + RLS)
export { createClient } from './client'

// Server-only clients (service role key or user JWT via SSR cookies)
export { createServerClient, createUserServerClient } from './server'
