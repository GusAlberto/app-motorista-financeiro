/**
 * lib/rate-limit.ts
 *
 * Server-only rate limiting for auth flows, backed by the
 * check_rate_limit() Postgres function (supabase/migrations/006_rate_limits.sql).
 * No external service (Redis/Upstash) — keeps the app lightweight and
 * self-contained.
 *
 * Design: fails OPEN. If the rate-limit check itself errors (e.g. the
 * migration hasn't been applied yet, a transient DB hiccup), the action is
 * allowed through rather than blocking legitimate users — a rate limiter
 * must never become the reason someone can't log in.
 */

import { headers } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

interface RateLimitOptions {
  /** Max attempts allowed within the window. */
  maxAttempts: number
  /** Window size in seconds. */
  windowSeconds: number
}

/**
 * Check (and record) a rate-limited attempt for the given key.
 * Returns true if the action is allowed to proceed.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  key: string,
  { maxAttempts, windowSeconds }: RateLimitOptions
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_key: key,
      p_max_attempts: maxAttempts,
      p_window_seconds: windowSeconds,
    })

    if (error) {
      console.error('Rate limit check failed (failing open):', error.message)
      return true
    }

    return data === true
  } catch (err) {
    console.error('Rate limit check threw (failing open):', err)
    return true
  }
}

/**
 * Best-effort client IP from Vercel/proxy-set headers. Falls back to a
 * constant so IP-based limiting degrades to a single shared bucket
 * (still functional, just less precise) rather than throwing when headers
 * aren't present (e.g. local dev without a proxy in front).
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers()
  const forwardedFor = headerList.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  return headerList.get('x-real-ip') || 'unknown'
}
