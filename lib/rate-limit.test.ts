import { describe, it, expect, vi } from 'vitest'
import { checkRateLimit } from './rate-limit'
import type { SupabaseClient } from '@supabase/supabase-js'

function mockSupabase(rpcImpl: () => Promise<{ data: unknown; error: unknown }>) {
  return {
    rpc: vi.fn().mockImplementation(rpcImpl),
  } as unknown as SupabaseClient
}

describe('checkRateLimit', () => {
  it('allows the request when the RPC returns true', async () => {
    const supabase = mockSupabase(async () => ({ data: true, error: null }))
    const allowed = await checkRateLimit(supabase, 'test:key', {
      maxAttempts: 5,
      windowSeconds: 60,
    })
    expect(allowed).toBe(true)
  })

  it('blocks the request when the RPC returns false (limit exceeded)', async () => {
    const supabase = mockSupabase(async () => ({ data: false, error: null }))
    const allowed = await checkRateLimit(supabase, 'test:key', {
      maxAttempts: 5,
      windowSeconds: 60,
    })
    expect(allowed).toBe(false)
  })

  it('fails OPEN (allows the request) when the RPC returns an error', async () => {
    // Critical guarantee: if check_rate_limit() errors — e.g. migration
    // 006 hasn't been applied yet, or a transient DB issue — the rate
    // limiter must never become the reason a legitimate user can't log in.
    const supabase = mockSupabase(async () => ({
      data: null,
      error: { message: 'function check_rate_limit does not exist' },
    }))
    const allowed = await checkRateLimit(supabase, 'test:key', {
      maxAttempts: 5,
      windowSeconds: 60,
    })
    expect(allowed).toBe(true)
  })

  it('fails OPEN (allows the request) when the RPC call throws', async () => {
    const supabase = mockSupabase(async () => {
      throw new Error('network error')
    })
    const allowed = await checkRateLimit(supabase, 'test:key', {
      maxAttempts: 5,
      windowSeconds: 60,
    })
    expect(allowed).toBe(true)
  })
})
