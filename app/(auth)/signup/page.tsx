'use client'

/**
 * app/(auth)/signup/page.tsx
 *
 * Signup page — email, password, confirm password, terms checkbox.
 * Client-side validation: password strength, match, terms.
 * On success: redirects to /verify-email.
 * On error: inline error display.
 */

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'A senha deve ter pelo menos 8 caracteres.'
  if (!/[A-Z]/.test(password)) return 'A senha deve conter pelo menos uma letra maiúscula.'
  if (!/[a-z]/.test(password)) return 'A senha deve conter pelo menos uma letra minúscula.'
  if (!/[0-9]/.test(password)) return 'A senha deve conter pelo menos um número.'
  return null
}

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

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

    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      // options: {
      //   emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      // },
    })
    
    if (authError) {
      setLoading(false)      
      if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
        setError(
          'Este email já está cadastrado. Tente fazer login ou recuperar sua senha.'
        )
      } else {
        setError('Erro ao criar conta. Tente novamente em instantes.')
      }
      return
    }

    router.push('/verify-email')
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-50">
        Criar conta gratuita
      </h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* General error */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Email */}
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
              'h-12 w-full rounded-xl border px-4',
              'bg-white text-base text-gray-900 placeholder-gray-400',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-500',
              fieldErrors.email
                ? 'border-red-500 focus:border-red-500 dark:border-red-500'
                : 'border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400',
            )}
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
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
            className={cn(
              'h-12 w-full rounded-xl border px-4',
              'bg-white text-base text-gray-900 placeholder-gray-400',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-500',
              fieldErrors.password
                ? 'border-red-500 focus:border-red-500 dark:border-red-500'
                : 'border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400',
            )}
            disabled={loading}
            aria-describedby={fieldErrors.password ? 'password-error' : 'password-hint'}
          />
          {fieldErrors.password ? (
            <p id="password-error" className="text-xs text-red-600 dark:text-red-400">
              {fieldErrors.password}
            </p>
          ) : (
            <p id="password-hint" className="text-xs text-gray-500 dark:text-gray-400">
              Mínimo 8 caracteres, com letras maiúsculas, minúsculas e números.
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
            className={cn(
              'h-12 w-full rounded-xl border px-4',
              'bg-white text-base text-gray-900 placeholder-gray-400',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-500',
              fieldErrors.confirmPassword
                ? 'border-red-500 focus:border-red-500 dark:border-red-500'
                : 'border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400',
            )}
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
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className={cn(
                'mt-0.5 h-5 w-5 flex-shrink-0 rounded border-gray-300 text-blue-600',
                'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'dark:border-gray-600',
              )}
              disabled={loading}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Li e aceito os{' '}
              <Link
                href="/terms"
                target="_blank"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Termos de Uso
              </Link>{' '}
              e a{' '}
              <Link
                href="/privacy"
                target="_blank"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Política de Privacidade
              </Link>
            </span>
          </label>
          {fieldErrors.terms && (
            <p className="text-xs text-red-600 dark:text-red-400 pl-8">
              {fieldErrors.terms}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'mt-2 flex h-12 w-full items-center justify-center rounded-xl',
            'bg-blue-600 text-base font-semibold text-white',
            'transition-colors hover:bg-blue-700 active:bg-blue-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {loading ? 'Criando conta...' : 'Criar conta gratuita'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Já tem uma conta?{' '}
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
