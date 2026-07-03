/* App Motorista — service worker (offline shell) */
const CACHE_VERSION = 'v1'
const CACHE_NAME = `app-motorista-${CACHE_VERSION}`
const OFFLINE_URL = '/offline.html'

const PRECACHE_URLS = [
  OFFLINE_URL,
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.webmanifest',
]

// Install: precache the offline shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch strategy:
//  - Navigations: network-first, fall back to offline page
//  - Static assets (_next/static, icons): cache-first
//  - Everything else: network, fall back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle GET
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Skip cross-origin and Supabase/API requests (always network)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api')) return

  // Navigations
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((res) => res || Response.error())
      )
    )
    return
  }

  // Static assets — cache-first
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/icons') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
            return response
          })
      )
    )
    return
  }
})
