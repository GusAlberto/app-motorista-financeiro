import Link from 'next/link'
import type { Metadata } from 'next'
import { Mail } from 'lucide-react'

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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400"
        aria-hidden="true"
      >
        <Mail className="h-8 w-8" strokeWidth={1.5} />
      </div>

      <h2 className="mb-2 font-display text-xl font-bold text-slate-900 dark:text-slate-50">
        Verifique seu email
      </h2>
      <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
        Enviamos um link de confirmação para o seu email.
      </p>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        Abra o email e clique no link para ativar sua conta. Verifique também a
        pasta de spam caso não encontre.
      </p>

      {/* Back to login */}
      <Link
        href="/login"
        className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"
      >
        Voltar ao login
      </Link>

      {/* Resend hint */}
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Não recebeu o email?{' '}
        <Link
          href="/signup"
          className="font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          Tente cadastrar novamente
        </Link>
      </p>
    </div>
  )
}
