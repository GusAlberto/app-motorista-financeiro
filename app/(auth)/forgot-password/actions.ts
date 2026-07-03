'use server'

import { createUserServerClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { APP_URL } from '@/lib/constants'

export async function forgotPasswordAction(email: string): Promise<{ success: boolean }> {
  const supabase = await createUserServerClient()
  const normalizedEmail = email.trim().toLowerCase()
  const ip = await getClientIp()

  const [emailAllowed, ipAllowed] = await Promise.all([
    checkRateLimit(supabase, `forgot-password:email:${normalizedEmail}`, {
      maxAttempts: 3,
      windowSeconds: 60 * 60,
    }),
    checkRateLimit(supabase, `forgot-password:ip:${ip}`, {
      maxAttempts: 10,
      windowSeconds: 60 * 60,
    }),
  ])

  // Always report success regardless of rate-limit or Supabase result —
  // this endpoint must never reveal whether an email is registered, and a
  // rate-limit rejection would leak exactly that (a registered email
  // that's being hammered vs. one that always "succeeds" instantly).
  if (emailAllowed && ipAllowed) {
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${APP_URL}/auth/callback?type=recovery`,
    })

    if (error) {
      console.error('Password reset error:', error.message)
    }
  }

  return { success: true }
}
