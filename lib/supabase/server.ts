/**
 * lib/supabase/server.ts
 *
 * Server-side Supabase client (service role key).
 * Use ONLY in Server Components, Route Handlers, Server Actions, and middleware.
 * NEVER import this file in Client Components or expose to the browser.
 *
 * Security:
 *  - Uses SUPABASE_SERVICE_ROLE_KEY — bypasses RLS entirely
 *  - This key must NEVER be sent to the browser (not prefixed with NEXT_PUBLIC_)
 *  - Use for admin operations, migrations, and trusted server-side logic
 *  - For user-scoped server queries (respecting RLS), use createUserClient() below
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient as createSSRClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Admin server client — bypasses RLS.
 * Use only for trusted server-side operations (e.g., creating user rows, admin queries).
 */
export function createServerClient(): SupabaseClient<Database> {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing server-side Supabase environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set ' +
      'in .env.local (development) or Vercel environment variables (production).'
    )
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      // Service role client should not persist a user session
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        'x-app-name': 'app-motorista-server',
      },
    },
  })
}

/**
 * User-scoped server client — respects RLS using the authenticated user's JWT.
 * Use in Server Components and Route Handlers where you want RLS to apply.
 * Reads the user session from cookies (Next.js App Router pattern).
 *
 * Requires @supabase/ssr package.
 */
export async function createUserServerClient(): Promise<SupabaseClient<Database>> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables for user server client.'
    )
  }

  const cookieStore = await cookies()

  return createSSRClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component — cookies cannot be set here.
          // The middleware will handle session refresh.
        }
      },
    },
  })
}
