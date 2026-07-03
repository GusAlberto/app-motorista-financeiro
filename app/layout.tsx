import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import { APP_URL } from '@/lib/constants'
import './globals.css'

export const metadata: Metadata = {
  // Resolves relative URLs used elsewhere in the Metadata API (OG images,
  // canonical links) against the real production domain instead of
  // silently defaulting to http://localhost:3000.
  metadataBase: new URL(APP_URL),
  title: {
    default: 'App Motorista — Controle Financeiro para Motoristas',
    template: '%s | App Motorista',
  },
  description:
    'Gerencie seus ganhos e despesas como motorista de aplicativo. Saiba em segundos se o seu dia está valendo a pena.',
  keywords: ['motorista', 'uber', 'financeiro', 'ganhos', 'despesas', 'controle'],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'App Motorista',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: APP_URL,
    siteName: 'App Motorista',
    title: 'App Motorista — Controle Financeiro para Motoristas',
    description:
      'Gerencie seus ganhos e despesas como motorista de aplicativo.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

/**
 * Root layout — wraps all pages.
 * ThemeProvider is added here so it covers auth pages too.
 * The <html> element starts with no class; ThemeProvider adds 'dark' client-side.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body
        className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-50"
        suppressHydrationWarning
      >
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
