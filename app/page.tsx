import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'App Motorista — Controle Financeiro para Motoristas de Aplicativo',
  description:
    'Gerencie seus ganhos e despesas como motorista de Uber, 99, InDrive. Saiba em segundos se o seu dia está valendo a pena.',
}

/**
 * Public home page (/).
 * Visible to unauthenticated users. Server Component (no 'use client').
 * Redirects authenticated users to /app/dashboard via middleware.
 *
 * Phase 2 will expand this into a full SEO-optimized landing page.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-sm text-center">
        {/* App identity */}
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          App Motorista
        </h1>
        <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
          Controle financeiro rápido para motoristas de aplicativo.
          <br />
          Saiba em segundos se o seu dia está valendo a pena.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:bg-blue-800"
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className="flex h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800"
          >
            Criar conta gratuita
          </Link>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/terms" className="hover:underline">
            Termos de uso
          </Link>
          <span aria-hidden>·</span>
          <Link href="/privacy" className="hover:underline">
            Privacidade
          </Link>
        </div>
      </div>
    </main>
  )
}
