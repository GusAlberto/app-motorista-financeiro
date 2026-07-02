import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'

/**
 * Auth route group layout.
 * Wraps all auth pages in ThemeProvider so theme toggle works on auth pages too.
 * Centered, minimal layout optimized for mobile forms.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 dark:bg-gray-950">
        {/* App identity header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            App Motorista
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Controle financeiro para motoristas
          </p>
        </div>

        {/* Auth form card */}
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </ThemeProvider>
  )
}
