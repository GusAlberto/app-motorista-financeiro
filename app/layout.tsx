import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import { APP_URL } from '@/lib/constants'
import './globals.css'

// Self-hosted via next/font — zero layout shift, no external request.
// Space Grotesk carries the brand's personality (headlines, big numbers);
// DM Sans stays out of the way for body copy and dense UI text. Neither is
// the Inter/Roboto default every template ships with.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

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
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
}

/**
 * Root layout — wraps all pages.
 * ThemeProvider is added here so it covers auth pages too.
 * The <html> element starts with no class; ThemeProvider adds 'dark' client-side.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body
        className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50"
        suppressHydrationWarning
      >
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
