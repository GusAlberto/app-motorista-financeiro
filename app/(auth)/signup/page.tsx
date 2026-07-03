'use client'

/**
 * app/(auth)/signup/page.tsx
 *
 * Signup page — email, password, confirm password, terms checkbox.
 * Client-side validation: password strength, match, terms.
 * Submission runs server-side (signupAction) so rate limiting applies and
 * the account-exists state is never revealed to the caller.
 * On success: redirects to /verify-email.
 * On error: inline error display.
 */

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signupAction } from './actions'
import { cn } from '@/lib/utils/cn'

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'A senha deve ter pelo menos 8 caracteres.'
  if (!/[A-Z]/.test(password)) return 'A senha deve conter pelo menos uma letra maiúscula.'
  if (!/[a-z]/.test(password)) return 'A senha deve conter pelo menos uma letra minúscula.'
  if (!/[0-9]/.test(password)) return 'A senha deve conter pelo menos um número.'
  return null
}

const inputBase = cn(
  'h-12 w-full rounded-xl border px-4',
  'bg-white text-base text-slate-900 placeholder-slate-400',
  'transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10',
  'dark:bg-slate-900 dark:text-slate-50 dark:placeholder-slate-500',
)

function inputClasses(hasError: boolean) {
  return cn(
    inputBase,
    hasError
      ? 'border-red-500 focus:border-red-500 dark:border-red-500'
      : 'border-slate-300 focus:border-slate-900 dark:border-slate-700 dark:focus:border-white',
  )
}

export default function SignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    // Client-side validation
    const errors: Record<string, string> = {}

    if (!email.includes('@')) {
      errors.email = 'Por favor, insira um email válido.'
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      errors.password = passwordError
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem.'
    }

    if (!agreedToTerms) {
      errors.terms = 'Você precisa aceitar os termos de uso para criar uma conta.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setLoading(true)

    const result = await signupAction(email, password)

    setLoading(false)

    if (!result.success) {
      setError(result.error || 'Erro ao criar conta. Tente novamente em instantes.')
      return
    }

    router.push('/verify-email')
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-6 font-display text-xl font-bold text-slate-900 dark:text-slate-50">
        Criar conta gratuita
      </h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* General error */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Email */}
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
            className={inputClasses(!!fieldErrors.email)}
            disabled={loading}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
          {fieldErrors.email && (
            <p id="email-error" className="text-xs text-red-600 dark:text-red-400">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className={inputClasses(!!fieldErrors.password)}
            disabled={loading}
            aria-describedby={fieldErrors.password ? 'password-error' : 'password-hint'}
          />
          {fieldErrors.password ? (
            <p id="password-error" className="text-xs text-red-600 dark:text-red-400">
              {fieldErrors.password}
            </p>
          ) : (
            <p id="password-hint" className="text-xs text-slate-500 dark:text-slate-400">
              Mínimo 8 caracteres, com letras maiúsculas, minúsculas e números.
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Confirmar senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha"
            className={inputClasses(!!fieldErrors.confirmPassword)}
            disabled={loading}
            aria-describedby={fieldErrors.confirmPassword ? 'confirm-error' : undefined}
          />
          {fieldErrors.confirmPassword && (
            <p id="confirm-error" className="text-xs text-red-600 dark:text-red-400">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="flex flex-col gap-1">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className={cn(
                'mt-0.5 h-5 w-5 flex-shrink-0 rounded border-slate-300 text-slate-900 dark:text-white',
                'focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:ring-offset-2',
                'dark:border-slate-600',
              )}
              disabled={loading}
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Li e aceito os{' '}
              <Link
                href="/terms"
                target="_blank"
                className="font-medium text-slate-900 hover:underline dark:text-white"
              >
                Termos de Uso
              </Link>{' '}
              e a{' '}
              <Link
                href="/privacy"
                target="_blank"
                className="font-medium text-slate-900 hover:underline dark:text-white"
              >
                Política de Privacidade
              </Link>
            </span>
          </label>
          {fieldErrors.terms && (
            <p className="pl-8 text-xs text-red-600 dark:text-red-400">
              {fieldErrors.terms}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'btn-primary btn-sheen mt-2 flex h-12 w-full items-center justify-center rounded-xl',
            'text-base font-semibold shadow-md shadow-slate-900/10 transition-shadow dark:shadow-black/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {loading ? 'Criando conta...' : 'Criar conta gratuita'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Já tem uma conta?{' '}
        <Link
          href="/login"
          className="font-medium text-slate-900 hover:underline dark:text-white"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
