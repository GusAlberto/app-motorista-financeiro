'use client'

/**
 * components/Navbar.tsx
 *
 * Top navigation bar for the protected app area.
 * Desktop: logo + horizontal nav links + theme toggle + logout.
 * Mobile: logo + theme toggle + logout — primary navigation moves to
 * BottomNav (fixed tab bar), which sits in comfortable thumb reach.
 *
 * Touch targets: all interactive elements ≥ 44px (WCAG AA)
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Sun, Moon, Wallet, LayoutDashboard, Receipt, Settings } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils/cn'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: Receipt },
  { href: '/settings', label: 'Configurações', icon: Settings },
]

export function Navbar() {
  const { logout, user } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur-lg md:px-6 dark:border-slate-800 dark:bg-slate-950/90"
      role="banner"
      aria-label="Navegação principal"
    >
      {/* Logo + desktop nav links */}
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2 font-display text-base font-bold text-slate-900 dark:text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950">
            <Wallet className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">App Motorista</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Right-side actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {user?.email && (
          <span
            className="hidden pr-2 text-xs text-slate-500 md:block dark:text-slate-500"
            aria-label={`Logado como ${user.email}`}
          >
            {user.email}
          </span>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-lg',
            'text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900',
            'dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
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
            'flex h-11 items-center gap-2 rounded-lg px-3',
            'text-sm font-medium text-slate-600 transition-colors',
            'hover:bg-slate-100 hover:text-slate-900',
            'dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
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
