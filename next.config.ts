import type { NextConfig } from 'next'

// Scope connect-src to the actual configured Supabase project when known,
// falling back to the wildcard so the build never breaks if the env var
// isn't set in a given environment (e.g. a local `next build` without
// .env.local).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : 'https://*.supabase.co'
const supabaseWsOrigin = supabaseOrigin.replace(/^https:/, 'wss:')

const isDev = process.env.NODE_ENV !== 'production'

// Content-Security-Policy — no nonce/strict-dynamic setup (keeps this a
// pure header-only, zero-runtime-cost change) but still meaningfully
// restricts script/connect/frame origins, which is CSP's main XSS/data-
// exfiltration value even without nonces. 'unsafe-eval' is only added in
// dev, where Next's webpack HMR needs it — production never gets it.
const cspDirectives = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? ` 'unsafe-eval'` : ''}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: ${supabaseOrigin}`,
  `font-src 'self' data:`,
  `connect-src 'self' ${supabaseOrigin} ${supabaseWsOrigin}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
]

const nextConfig: NextConfig = {
  // Use strict mode for highlighting potential problems
  reactStrictMode: true,

  // Image optimization — allow Supabase storage domain
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: cspDirectives.join('; ') },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

export default nextConfig
