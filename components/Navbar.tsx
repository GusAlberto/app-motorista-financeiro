'use client'

/**
 * components/Navbar.tsx
 *
 * Top navigation bar for the protected app area.
 * Mobile-first: 56px height, horizontal layout, sticky.
 * Contains: app logo/title, logout button, theme toggle.
 *
 * Touch targets: all interactive elements ≥ 48px (WCAG AA)
 */

import { LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils/cn'

export function Navbar() {
  const { logout, user } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <nav
      className={cn(
        // Base: mobile-first horizontal bar, sticky at top
        'sticky top-0 z-50 flex h-14 w-full items-center justify-between',
        // Horizontal padding: 16px mobile, 24px md+
        'px-4 md:px-6',
        // Background + border
        'border-b border-gray-200 bg-white',
        // Dark mode overrides
        'dark:border-gray-800 dark:bg-gray-950',
        // Subtle shadow for depth
        'shadow-sm',
      )}
      role="banner"
      aria-label="Navegação principal"
    >
      {/* Logo / App Title */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'text-lg font-bold tracking-tight',
            'text-gray-900 dark:text-gray-50',
          )}
          aria-label="App Motorista"
        >
          App Motorista
        </span>
        {user?.email && (
          <span
            className="hidden text-xs text-gray-500 dark:text-gray-400 md:block"
            aria-label={`Logado como ${user.email}`}
          >
            {user.email}
          </span>
        )}
      </div>

      {/* Right-side actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            // Touch target: min 48px (WCAG AA)
            'flex h-12 w-12 items-center justify-center rounded-lg',
            // Visual styling
            'text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900',
            // Dark mode
            'dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50',
            // Focus ring for keyboard navigation
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          )}
          aria-label={resolvedTheme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          title={resolvedTheme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className={cn(
            // Touch target: min 48px (WCAG AA)
            'flex h-12 items-center gap-2 rounded-lg px-3',
            // Visual styling
            'text-sm font-medium text-gray-600 transition-colors',
            'hover:bg-gray-100 hover:text-gray-900',
            // Dark mode
            'dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50',
            // Focus ring
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          )}
          aria-label="Sair da conta"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span className="hidden md:block">Sair</span>
        </button>
      </div>
    </nav>
  )
}
