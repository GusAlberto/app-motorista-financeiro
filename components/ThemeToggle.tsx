'use client'

/**
 * components/ThemeToggle.tsx
 *
 * Standalone light/dark toggle button for use outside the authenticated
 * app shell (e.g. the public marketing navbar), so visitors can switch
 * themes without logging in. Shares the same useTheme() context and the
 * Sun/Moon affordance as the in-app Navbar toggle. Grayscale by default;
 * pass `className` to tune it for the surface it sits on (the always-dark
 * desktop pill vs. the theme-adaptive mobile bar).
 */

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
        'focus-visible:outline-none focus-visible:ring-2',
        className,
      )}
      aria-label={resolvedTheme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={resolvedTheme === 'dark' ? 'Tema claro' : 'Tema escuro'}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  )
}
