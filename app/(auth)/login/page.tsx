'use client'

/**
 * app/(auth)/login/page.tsx
 *
 * Login page — email + password form.
 * Mobile-first, full-width, large touch targets.
 * On success: redirects to /dashboard (via Server Action).
 * On error: displays inline error message.
 */

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { loginAction } from './actions'
import { cn } from '@/lib/utils/cn'

// Note: 'use client' components cannot export metadata; parent layout handles title

const inputClasses = cn(
  'h-12 w-full rounded-xl border border-slate-300 px-4',
  'bg-white text-base text-slate-900 placeholder-slate-400',
  'transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10',
  'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder-slate-500',
  'dark:focus:border-white dark:focus:ring-white/10',
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await loginAction(email, password)

      if (result && !result.success) {
        setLoading(false)
        // Translate Supabase error messages to Portuguese
        if (result.error.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos. Verifique seus dados e tente novamente.')
        } else {
          setError(result.error.includes('Muitas tentativas') ? result.error : 'Erro ao fazer login. Tente novamente em instantes.')
        }
        return
      }

      // If successful, loginAction will redirect via server-side redirect()
      // This line won't be reached, but TypeScript needs it for control flow
    } catch (err) {
      setLoading(false)
      setError('Erro ao fazer login. Tente novamente em instantes.')
      console.error('Login error:', err)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-6 font-display text-xl font-bold text-slate-900 dark:text-slate-50">
        Entrar na sua conta
      </h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Email field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
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
            className={inputClasses}
            disabled={loading}
          />
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-slate-900 hover:underline dark:text-white"
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
            className={inputClasses}
            disabled={loading}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !email || !password}
          className={cn(
            'btn-primary btn-sheen mt-2 flex h-12 w-full items-center justify-center rounded-xl',
            'text-base font-semibold shadow-md shadow-slate-900/10 transition-shadow dark:shadow-black/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Sign up link */}
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Não tem uma conta?{' '}
        <Link
          href="/signup"
          className="font-medium text-slate-900 hover:underline dark:text-white"
        >
          Criar conta gratuita
        </Link>
      </p>
    </div>
  )
}
