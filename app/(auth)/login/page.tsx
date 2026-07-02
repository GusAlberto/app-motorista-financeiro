'use client'

/**
 * app/(auth)/login/page.tsx
 *
 * Login page — email + password form.
 * Mobile-first, full-width, large touch targets.
 * On success: redirects to /app/dashboard.
 * On error: displays inline error message.
 */

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

// Note: 'use client' components cannot export metadata; parent layout handles title
// export const metadata: Metadata = { title: 'Entrar' }

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setLoading(false)
      // Translate Supabase error messages to Portuguese
      if (authError.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos. Verifique seus dados e tente novamente.')
      }
      // Email confirmation disabled for MVP (can be re-enabled in Phase 5)
      // else if (authError.message.includes('Email not confirmed')) {
      //   setError(
      //     'Seu email ainda não foi verificado. Verifique sua caixa de entrada e clique no link de confirmação.'
      //   )
      // }
      else {
        setError('Erro ao fazer login. Tente novamente em instantes.')
      }
      return
    }

    router.push('/app/dashboard')
    router.refresh()
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-50">
        Entrar na sua conta
      </h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Email field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className={cn(
              'h-12 w-full rounded-xl border border-gray-300 px-4',
              'bg-white text-base text-gray-900 placeholder-gray-400',
              'transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-500',
              'dark:focus:border-blue-400',
            )}
            disabled={loading}
          />
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={cn(
              'h-12 w-full rounded-xl border border-gray-300 px-4',
              'bg-white text-base text-gray-900 placeholder-gray-400',
              'transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-500',
              'dark:focus:border-blue-400',
            )}
            disabled={loading}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !email || !password}
          className={cn(
            'mt-2 flex h-12 w-full items-center justify-center rounded-xl',
            'bg-blue-600 text-base font-semibold text-white',
            'transition-colors hover:bg-blue-700 active:bg-blue-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Sign up link */}
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Não tem uma conta?{' '}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Criar conta gratuita
        </Link>
      </p>
    </div>
  )
}
