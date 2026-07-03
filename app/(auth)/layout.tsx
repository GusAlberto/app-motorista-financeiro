import type { ReactNode } from 'react'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { ThemeProvider } from '@/components/ThemeProvider'

/**
 * Auth route group layout.
 * Wraps all auth pages in ThemeProvider so theme toggle works on auth pages too.
 * Centered, minimal layout optimized for mobile forms.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 dark:bg-slate-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-slate-400/20 blur-[100px] dark:bg-white/[0.06]"
        />

        {/* App identity header */}
        <Link href="/" className="relative mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-b from-slate-700 to-slate-950 text-white ring-1 ring-white/10 dark:from-white dark:to-slate-200 dark:text-slate-950 dark:ring-black/5">
            <Wallet className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            App Motorista
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Controle financeiro para motoristas
          </p>
        </Link>

        {/* Auth form card */}
        <div className="relative w-full max-w-sm">
          {children}
        </div>
      </div>
    </ThemeProvider>
  )
}
