import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mocks ---
const push = vi.fn()
const refresh = vi.fn()
const signOut = vi.fn().mockResolvedValue({ error: null })

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signOut,
    },
  }),
}))

import { useAuth } from './useAuth'

describe('useAuth().logout', () => {
  beforeEach(() => {
    push.mockClear()
    refresh.mockClear()
    signOut.mockClear()
  })

  it('signs the user out and redirects to the home page', async () => {
    const { result } = renderHook(() => useAuth())

    // Wait for initial session hydration to settle
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.logout()
    })

    // 1. Signed out of the account
    expect(signOut).toHaveBeenCalledTimes(1)
    // 2. Redirected to HOME (not /login)
    expect(push).toHaveBeenCalledWith('/')
    expect(refresh).toHaveBeenCalled()
  })
})
