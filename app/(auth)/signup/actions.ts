'use server'

import { createUserServerClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

interface SignupResult {
  success: boolean
  error?: string
}

export async function signupAction(email: string, password: string): Promise<SignupResult> {
  const supabase = await createUserServerClient()
  const normalizedEmail = email.trim().toLowerCase()
  const ip = await getClientIp()

  const [emailAllowed, ipAllowed] = await Promise.all([
    checkRateLimit(supabase, `signup:email:${normalizedEmail}`, {
      maxAttempts: 3,
      windowSeconds: 60 * 60,
    }),
    checkRateLimit(supabase, `signup:ip:${ip}`, {
      maxAttempts: 10,
      windowSeconds: 60 * 60,
    }),
  ])

  if (!emailAllowed || !ipAllowed) {
    return {
      success: false,
      error: 'Muitas tentativas. Aguarde antes de tentar novamente.',
    }
  }

  const { error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
  })

  if (error) {
    // Deliberately generic — do NOT tell the caller whether this email is
    // already registered. Supabase's own message ("User already
    // registered") would let an attacker enumerate valid accounts by
    // submitting signup attempts. Anyone who already owns the account can
    // recover it via "Esqueceu a senha?", which is unaffected by this.
    console.error('Signup error:', error.message)
    return {
      success: false,
      error: 'Não foi possível criar a conta com esses dados. Verifique o email e tente novamente, ou faça login se já tiver uma conta.',
    }
  }

  return { success: true }
}
