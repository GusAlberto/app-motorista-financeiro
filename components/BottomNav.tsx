'use client'

/**
 * components/BottomNav.tsx
 *
 * Bottom navigation bar for mobile — 4 nav items with centered action button.
 * Mobile-first: visible only on small screens (sm:hidden), fixed at bottom.
 * Contains: Home, Transactions, centered Action (+), Settings.
 *
 * Touch targets: all interactive elements ≥ 48px (WCAG AA)
 */

import { useRouter, usePathname } from 'next/navigation'
import { Home, History, Plus, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface NavItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  isAction?: boolean
}

const navItems: NavItem[] = [
  { label: 'Início', icon: Home, href: '/' },
  { label: 'Transações', icon: History, href: '/transactions' },
  { label: 'Ação', icon: Plus, href: '#', isAction: true },
  { label: 'Ajustes', icon: Settings, href: '/settings' },
]

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavClick = (item: NavItem) => {
    if (item.isAction) {
      // Action button: open transaction modal or navigate to transaction page
      router.push('/transactions/new')
    } else {
      router.push(item.href)
    }
  }

  return (
    <nav
      className={cn(
        // Mobile-only: hide on desktop (sm: 640px+)
        'fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-between sm:hidden',
        // Background + border
        'border-t border-gray-200 bg-white',
        // Dark mode
        'dark:border-gray-800 dark:bg-gray-950',
        // Safe area for notches
        'pb-safe',
      )}
      role="navigation"
      aria-label="Navegação mobile"
    >
      {/* Left items container */}
      <div className="flex flex-1 items-center justify-start">
        {navItems.slice(0, 1).map((item) => (
          <NavButton
            key={item.label}
            item={item}
            isActive={pathname === item.href}
            onClick={() => handleNavClick(item)}
          />
        ))}
      </div>

      {/* Second item (Transactions) */}
      <div className="flex flex-1 items-center justify-center">
        {navItems.slice(1, 2).map((item) => (
          <NavButton
            key={item.label}
            item={item}
            isActive={pathname === item.href}
            onClick={() => handleNavClick(item)}
          />
        ))}
      </div>

      {/* Center action button (+) - absolutely centered */}
      <div className="absolute left-1/2 -translate-x-1/2">
        {navItems.filter((item) => item.isAction).map((item) => (
          <ActionButton
            key={item.label}
            item={item}
            onClick={() => handleNavClick(item)}
          />
        ))}
      </div>

      {/* Right items container */}
      <div className="flex flex-1 items-center justify-end">
        {navItems.slice(3).map((item) => (
          <NavButton
            key={item.label}
            item={item}
            isActive={pathname === item.href}
            onClick={() => handleNavClick(item)}
          />
        ))}
      </div>
    </nav>
  )
}

interface NavButtonProps {
  item: NavItem
  isActive: boolean
  onClick: () => void
}

function NavButton({ item, isActive, onClick }: NavButtonProps) {
  const Icon = item.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        // Touch target: min 48px (WCAG AA)
        'flex h-16 w-16 items-center justify-center rounded-none transition-colors',
        // State styling
        isActive
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
        // Focus ring
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
      )}
      aria-label={item.label}
      title={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="h-6 w-6" aria-hidden="true" />
    </button>
  )
}

interface ActionButtonProps {
  item: NavItem
  onClick: () => void
}

function ActionButton({ item, onClick }: ActionButtonProps) {
  const Icon = item.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        // Touch target: larger for action button
        'flex h-14 w-14 items-center justify-center rounded-full transition-all',
        // Gradient background with shadow
        'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg',
        // Hover state
        'hover:from-blue-600 hover:to-blue-700 hover:shadow-xl',
        // Active/pressed state
        'active:shadow-md',
        // Focus ring
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950',
      )}
      aria-label={item.label}
      title={item.label}
    >
      <Icon className="h-7 w-7" aria-hidden="true" />
    </button>
  )
}
