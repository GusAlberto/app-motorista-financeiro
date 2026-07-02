import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'App Motorista — Controle Financeiro para Motoristas',
    template: '%s | App Motorista',
  },
  description:
    'Gerencie seus ganhos e despesas como motorista de aplicativo. Saiba em segundos se o seu dia está valendo a pena.',
  keywords: ['motorista', 'uber', 'financeiro', 'ganhos', 'despesas', 'controle'],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_APP_URL,
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
      </body>
    </html>
  )
}
