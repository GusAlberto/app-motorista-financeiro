import Link from 'next/link';
import { Wallet } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950">
              <Wallet className="h-4 w-4" aria-hidden="true" />
            </span>
            app-motorista
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/how-it-works"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:block dark:text-slate-400 dark:hover:text-white"
            >
              Como funciona
            </Link>
            <Link
              href="/faq"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:block dark:text-slate-400 dark:hover:text-white"
            >
              FAQ
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-amber-500 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </nav>

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
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950">
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
  );
}
