'use client'

/**
 * components/ThemeProvider.tsx
 *
 * Context provider for theme state (light | dark | system).
 * Persists user preference in localStorage.
 * Applies 'dark' class to <html> element for Tailwind dark mode.
 * On first visit, respects system prefers-color-scheme.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme'

interface ThemeContextValue {
  /** Current theme preference (may be 'system') */
  theme: Theme
  /** Resolved theme after applying system preference */
  resolvedTheme: ResolvedTheme
  /** Set a specific theme */
  setTheme: (theme: Theme) => void
  /** Toggle between light and dark (skips system) */
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') return getSystemTheme()
  return theme
}

function applyTheme(resolved: ResolvedTheme): void {
  const html = document.documentElement
  if (resolved === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')
  const [mounted, setMounted] = useState(false)

  // On mount: read persisted theme or fall back to system preference
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    const initial: Theme = stored ?? 'system'
    const resolved = resolveTheme(initial)
    setThemeState(initial)
    setResolvedTheme(resolved)
    applyTheme(resolved)
    setMounted(true)

    // Listen for system preference changes (only relevant when theme === 'system')
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = (e: MediaQueryListEvent) => {
      setThemeState((prev) => {
        if (prev === 'system') {
          const newResolved: ResolvedTheme = e.matches ? 'dark' : 'light'
          setResolvedTheme(newResolved)
          applyTheme(newResolved)
        }
        return prev
      })
    }

    mediaQuery.addEventListener('change', handleSystemChange)
    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    const resolved = resolveTheme(newTheme)
    setThemeState(newTheme)
    setResolvedTheme(resolved)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    applyTheme(resolved)
  }, [])

  const toggleTheme = useCallback(() => {
    // Toggle between light and dark (not system)
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }, [resolvedTheme, setTheme])

  // Prevent flash of wrong theme by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme hook — access theme state and actions.
 * Must be used inside <ThemeProvider>.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
