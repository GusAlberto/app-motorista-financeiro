'use server'

import { redirect } from 'next/navigation'
import { createUserServerClient } from '@/lib/supabase/server'

/**
 * Sign the current user out server-side.
 *
 * Runs as a Server Action so the auth cookies are cleared via the HTTP
 * response (Set-Cookie), which is authoritative for middleware.ts —
 * unlike a client-only signOut(), this can't leave a stale session that
 * still passes the route-protection check on /dashboard, /transactions, etc.
 */
export async function logoutAction() {
  const supabase = await createUserServerClient()
  await supabase.auth.signOut()
  redirect('/')
}
