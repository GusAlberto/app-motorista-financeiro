'use client'

/**
 * lib/hooks/useAuth.ts
 *
 * Custom hook for authentication state and actions.
 * Wraps Supabase auth session management with a clean, typed interface.
 *
 * Usage:
 *   const { user, session, loading, logout } = useAuth()
 *
 * Must be used inside a Client Component (uses the browser Supabase client).
 */

import { useEffect, useState, useCallback } from 'react'
import type { Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { logoutAction } from '@/app/(app)/actions'
import type { User, AuthContext } from '@/types/auth'

/**
 * Maps a Supabase auth user to our application User type.
 * Fetches display name from driver_profiles if available.
 */
function mapSupabaseUser(supabaseUser: { id: string; email?: string; created_at: string }): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    displayName: null, // loaded separately from driver_profiles if needed
    created_at: supabaseUser.created_at,
  }
}

/**
 * useAuth hook — provides auth state and actions.
 *
 * @returns {AuthContext} User, session, loading state, and logout function
 */
export function useAuth(): AuthContext {
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Hydrate initial session from Supabase (stored in cookies, shared with the server)
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return
      setSession(initialSession)
      setUser(initialSession?.user ? mapSupabaseUser(initialSession.user) : null)
      setLoading(false)
    })

    // Subscribe to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      setUser(newSession?.user ? mapSupabaseUser(newSession.user) : null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Sign out the current user.
   *
   * Runs server-side (logoutAction) so the auth cookies are cleared via
   * the HTTP response — this is what middleware.ts checks on protected
   * routes. A client-only supabase.auth.signOut() would only clear the
   * browser's copy of the session and could leave a stale cookie that
   * still lets a "logged out" user load /dashboard directly.
   */
  const logout = useCallback(async () => {
    await logoutAction()
  }, [])

  return { user, session, loading, logout }
}
