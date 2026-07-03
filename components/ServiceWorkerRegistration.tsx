'use client'

import { useEffect } from 'react'

/**
 * Registers the service worker (public/sw.js) on mount.
 * Only runs in the browser, in production, when SW is supported.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return
    }

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service worker registration failed:', err)
      })
    }

    // Register after load to avoid competing with initial render
    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register)
      return () => window.removeEventListener('load', register)
    }
  }, [])

  return null
}
