'use server'

import { redirect } from 'next/navigation'
import { createUserServerClient } from '@/lib/supabase/server'

export async function loginAction(email: string, password: string) {
  const supabase = await createUserServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  redirect('/app/dashboard')
}
