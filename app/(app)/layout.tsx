import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'

/**
 * app/(app)/layout.tsx
 *
 * Protected app layout — wraps all authenticated app routes.
 * - ThemeProvider: enables dark mode across all app pages
 * - Navbar: sticky top bar with logout + theme toggle
 * - Route protection: handled by middleware.ts (redirects unauthenticated users to /login)
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {/* Sticky navbar */}
      <Navbar />

      {/* Page content */}
      <main
        className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6"
        id="main-content"
      >
        {children}
      </main>
    </ThemeProvider>
  )
}
