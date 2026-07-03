'use client'

/**
 * app/(auth)/forgot-password/page.tsx
 *
 * Password reset request page.
 * User enters email → Supabase sends reset link → success message shown.
 * Submission runs server-side (forgotPasswordAction) so rate limiting
 * applies without ever revealing whether the email is registered.
 */

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { forgotPasswordAction } from './actions'
import { cn } from '@/lib/utils/cn'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    await forgotPasswordAction(email)

    setLoading(false)

    // Always show success (security: don't reveal if email exists)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 text-center">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 mx-auto"
          aria-hidden="true"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-50">
          Email enviado!
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Se este email estiver cadastrado, você receberá um link para redefinir sua senha.
          Verifique sua caixa de entrada (e o spam).
        </p>
        <Link
          href="/login"
          className={cn(
            'flex h-12 w-full items-center justify-center rounded-xl',
            'bg-blue-600 text-base font-semibold text-white',
            'transition-colors hover:bg-blue-700',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          )}
        >
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-50">
        Recuperar senha
      </h2>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Insira seu email e enviaremos um link para você redefinir sua senha.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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

        <button
          type="submit"
          disabled={loading || !email}
          className={cn(
            'flex h-12 w-full items-center justify-center rounded-xl',
            'bg-blue-600 text-base font-semibold text-white',
            'transition-colors hover:bg-blue-700 active:bg-blue-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {loading ? 'Enviando...' : 'Enviar link de recuperação'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Lembrou a senha?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
