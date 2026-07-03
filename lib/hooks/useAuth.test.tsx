import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mocks ---
const logoutAction = vi.fn().mockResolvedValue(undefined)

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  }),
}))

vi.mock('@/app/(app)/actions', () => ({
  logoutAction: () => logoutAction(),
}))

import { useAuth } from './useAuth'

describe('useAuth().logout', () => {
  beforeEach(() => {
    logoutAction.mockClear()
  })

  it('signs the user out server-side (clears the auth cookie, not just client state)', async () => {
    const { result } = renderHook(() => useAuth())

    // Wait for initial session hydration to settle
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.logout()
    })

    // logout() must delegate to the server action — a client-only
    // supabase.auth.signOut() would leave the middleware-visible auth
    // cookie intact, letting a "logged out" user still load /dashboard.
    expect(logoutAction).toHaveBeenCalledTimes(1)
  })
})
