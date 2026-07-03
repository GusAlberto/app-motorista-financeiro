'use client'

/**
 * components/ui/modern-mobile-menu.tsx
 *
 * Icon+label tab item with a sliding underline beneath the active label.
 * The underline spans the label's natural content width and animates in
 * via `transform: scaleX` (GPU-only, no layout thrash) — see .menu__text
 * in globals.css. Active state is driven by the current route
 * (usePathname), not click state — this is real navigation, not a demo
 * toggle. The underline color is `currentColor`, inherited from
 * .menu__item.active's grayscale color, so there is no separate
 * accent-color token to configure or override.
 */

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

export interface InteractiveMenuItem {
  label: string
  href: string
  icon: React.ElementType<{ className?: string }>
}

interface InteractiveMenuProps {
  items: InteractiveMenuItem[]
  className?: string
  /**
   * Optional non-route action rendered at the row's midpoint (e.g. the
   * raised "+" quick-add button). It splits the tabs evenly around it so
   * it reads as the row's visual anchor rather than just another tab.
   */
  centerAction?: React.ReactNode
}

export function InteractiveMenu({ items, className, centerAction }: InteractiveMenuProps) {
  const pathname = usePathname()

  const activeIndex = useMemo(() => {
    const index = items.findIndex(
      (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`),
    )
    return index === -1 ? 0 : index
  }, [items, pathname])

  const splitAt = centerAction ? Math.ceil(items.length / 2) : items.length

  const renderTab = (item: InteractiveMenuItem, index: number) => {
    const isActive = index === activeIndex
    const Icon = item.icon
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={isActive ? 'page' : undefined}
        className={cn('menu__item', isActive && 'active')}
      >
        <span className="menu__icon">
          <Icon className="icon" aria-hidden="true" />
        </span>
        <strong className={cn('menu__text', isActive && 'active')}>
          {item.label}
        </strong>
      </Link>
    )
  }

  return (
    <div className={cn('menu', className)}>
      {items.slice(0, splitAt).map((item, i) => renderTab(item, i))}
      {centerAction}
      {items.slice(splitAt).map((item, i) => renderTab(item, i + splitAt))}
    </div>
  )
}
