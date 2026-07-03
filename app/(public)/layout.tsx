import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Navbar — mobile: full-width bar, theme-adaptive (unchanged). */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg md:hidden dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3">
          <Link href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-base font-bold text-slate-900 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-b from-slate-700 to-slate-950 text-white shadow-sm ring-1 ring-white/10 dark:from-white dark:to-slate-200 dark:text-slate-950 dark:ring-black/5">
              <Wallet className="h-4 w-4" aria-hidden="true" />
            </span>
            app-motorista
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full px-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="btn-primary btn-sheen inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full px-3.5 text-sm font-bold shadow-md shadow-slate-900/20 transition-shadow hover:shadow-lg dark:shadow-black/40"
            >
              Criar conta
            </Link>
            <ThemeToggle className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-white" />

          </div>
        </div>
      </nav>

      {/* Navbar — desktop: floating dark pill, deliberately NOT theme-
          adaptive. Chrome stays constant premium-black regardless of the
          page's light/dark toggle, echoing the always-dark floating pill
          from the reference (clean solid surface, pill CTAs) without
          reusing any of its actual assets. Logo on the left, auth actions
          on the right — no center nav links. */}
      <div className="sticky top-4 z-50 hidden px-4 md:block">
        <nav className="relative mx-auto flex h-16 max-w-4xl items-center justify-between rounded-full border border-white/10 bg-slate-950 px-4 shadow-2xl shadow-black/40">
          <Link href="/" className="relative z-10 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/10">
              <Wallet className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-display text-base font-bold tracking-tight text-white">app-motorista</span>
          </Link>

          <div className="relative z-10 flex items-center gap-2">
            <ThemeToggle className="text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white" />
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="btn-sheen-invert inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-slate-950 shadow-md shadow-black/20 transition-shadow hover:shadow-lg"
            >
              Criar conta
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-8 grid gap-8 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <Link href="/" className="flex items-center gap-2 font-display text-base font-bold text-slate-900 dark:text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-b from-slate-700 to-slate-950 text-white ring-1 ring-white/10 dark:from-white dark:to-slate-200 dark:text-slate-950 dark:ring-black/5">
                  <Wallet className="h-4 w-4" aria-hidden="true" />
                </span>
                app-motorista
              </Link>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-500">
                Controle financeiro para motoristas de aplicativo.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-display text-sm font-bold text-slate-900 dark:text-white">Produto</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="/how-it-works" className="transition-colors hover:text-slate-900 dark:hover:text-white">Como funciona</Link></li>
                <li><Link href="/faq" className="transition-colors hover:text-slate-900 dark:hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-display text-sm font-bold text-slate-900 dark:text-white">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="/privacy" className="transition-colors hover:text-slate-900 dark:hover:text-white">Privacidade</Link></li>
                <li><Link href="/terms" className="transition-colors hover:text-slate-900 dark:hover:text-white">Termos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-display text-sm font-bold text-slate-900 dark:text-white">Código</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="https://github.com/GusAlberto/app-motorista-financeiro" className="transition-colors hover:text-slate-900 dark:hover:text-white">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-500">
            <p>&copy; 2026 app-motorista. Open source.</p>
          </div>
        </div>
      </footer>
    </div>
    </ThemeProvider>
  );
}
