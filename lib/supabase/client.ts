/**
 * lib/supabase/client.ts
 *
 * Browser-side Supabase client (anon key).
 * Safe to use in Client Components ('use client').
 *
 * Security:
 *  - Uses NEXT_PUBLIC_SUPABASE_ANON_KEY (public, limited by RLS)
 *  - RLS enforces user isolation — anon key alone cannot bypass data restrictions
 *  - Session stored in localStorage (persistent across browser reloads)
 *  - JWT auto-refreshed before expiry (autoRefreshToken: true)
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Copy .env.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL ' +
    'and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

/**
 * Singleton browser client — instantiated once per module load.
 * Re-importing this file returns the same instance.
 */
let _browserClient: SupabaseClient<Database> | null = null

/**
 * Returns the browser-side Supabase client.
 * Call this inside Client Components or browser-only hooks.
 */
export function createClient(): SupabaseClient<Database> {
  if (_browserClient) return _browserClient

  _browserClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Persist session in localStorage so users stay logged in across reloads
      persistSession: true,
      // Auto-refresh JWT before expiry — prevents logged-out state mid-session
      autoRefreshToken: true,
      // Detect session from URL hash (required for email verification & password reset flows)
      detectSessionInUrl: true,
      // Use PKCE flow for more secure auth (prevents authorization code interception)
      flowType: 'pkce',
    },
    global: {
      headers: {
        'x-app-name': 'app-motorista',
      },
    },
  })

  return _browserClient
}
