import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verifique seu email | App Motorista',
  description: 'Confirme seu email para ativar sua conta no App Motorista.',
}

/**
 * app/(auth)/verify-email/page.tsx
 *
 * Static confirmation page shown after signup.
 * Tells user to check email and click the verification link.
 * Supabase handles the actual verification via email link (no action needed here).
 */
export default function VerifyEmailPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 text-center">
      {/* Email icon */}
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 mx-auto"
        aria-hidden="true"
      >
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-50">
        Verifique seu email
      </h2>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        Enviamos um link de confirmação para o seu email.
      </p>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Abra o email e clique no link para ativar sua conta. Verifique também a
        pasta de spam caso não encontre.
      </p>

      {/* Back to login */}
      <Link
        href="/login"
        className="flex h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
      >
        Voltar ao login
      </Link>

      {/* Resend hint */}
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Não recebeu o email?{' '}
        <Link
          href="/signup"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Tente cadastrar novamente
        </Link>
      </p>
    </div>
  )
}
