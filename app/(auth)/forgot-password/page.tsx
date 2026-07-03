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
import { CheckCircle2 } from 'lucide-react'
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
          aria-hidden="true"
        >
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="mb-2 font-display text-xl font-bold text-slate-900 dark:text-slate-50">
          Email enviado!
        </h2>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Se este email estiver cadastrado, você receberá um link para redefinir sua senha.
          Verifique sua caixa de entrada (e o spam).
        </p>
        <Link
          href="/login"
          className={cn(
            'flex h-12 w-full items-center justify-center rounded-xl',
            'bg-amber-500 text-base font-semibold text-slate-950',
            'transition-colors hover:bg-amber-400',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
          )}
        >
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-2 font-display text-xl font-bold text-slate-900 dark:text-slate-50">
        Recuperar senha
      </h2>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        Insira seu email e enviaremos um link para você redefinir sua senha.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
            className={cn(
              'h-12 w-full rounded-xl border border-slate-300 px-4',
              'bg-white text-base text-slate-900 placeholder-slate-400',
              'transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20',
              'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder-slate-500',
              'dark:focus:border-amber-400',
            )}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className={cn(
            'flex h-12 w-full items-center justify-center rounded-xl',
            'bg-amber-500 text-base font-semibold text-slate-950',
            'transition-colors hover:bg-amber-400 active:bg-amber-600',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {loading ? 'Enviando...' : 'Enviar link de recuperação'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Lembrou a senha?{' '}
        <Link
          href="/login"
          className="font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
