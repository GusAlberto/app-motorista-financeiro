'use server'

import { redirect } from 'next/navigation'
import { createUserServerClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function loginAction(email: string, password: string) {
  const supabase = await createUserServerClient()
  const normalizedEmail = email.trim().toLowerCase()
  const ip = await getClientIp()

  // Two layers: a tight per-account limit (stops brute-forcing one victim)
  // and a looser per-IP limit (stops one attacker spraying many emails).
  const [emailAllowed, ipAllowed] = await Promise.all([
    checkRateLimit(supabase, `login:email:${normalizedEmail}`, {
      maxAttempts: 5,
      windowSeconds: 15 * 60,
    }),
    checkRateLimit(supabase, `login:ip:${ip}`, {
      maxAttempts: 20,
      windowSeconds: 15 * 60,
    }),
  ])

  if (!emailAllowed || !ipAllowed) {
    return {
      success: false,
      error: 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.',
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  redirect('/dashboard')
}
