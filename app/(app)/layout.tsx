import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'

/**
 * app/(app)/layout.tsx
 *
 * Protected app layout — wraps all authenticated app routes.
 * - ThemeProvider: enables dark mode across all app pages
 * - Navbar: sticky top bar with logout + theme toggle (+ nav links on desktop)
 * - BottomNav: fixed tab bar, primary navigation on mobile
 * - Route protection: handled by middleware.ts (redirects unauthenticated users to /login)
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Sticky navbar */}
        <Navbar />

        {/* Page content — bottom padding on mobile clears the fixed BottomNav */}
        <main
          className="mx-auto w-full max-w-6xl px-4 py-6 pb-24 md:px-6 md:pb-6"
          id="main-content"
        >
          {children}
        </main>

        {/* Mobile-only fixed bottom tab bar */}
        <BottomNav />
      </div>
    </ThemeProvider>
  )
}
