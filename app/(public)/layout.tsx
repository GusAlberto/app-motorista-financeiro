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
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-b from-slate-700 to-slate-950 text-white shadow-sm ring-1 ring-white/10 dark:from-white dark:to-slate-200 dark:text-slate-950 dark:ring-black/5">
              <Wallet className="h-4 w-4" aria-hidden="true" />
            </span>
            app-motorista
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Secondary links — a brushed-metal capsule instead of bare
                text, riffing on the black/silver language of premium
                mobility apps without reusing any real brand assets. */}
            <div className="hidden items-center gap-0.5 rounded-full bg-gradient-to-b from-slate-800 to-slate-950 p-1 shadow-inner sm:flex dark:bg-white/10 dark:from-transparent dark:to-transparent dark:shadow-none dark:ring-1 dark:ring-white/10">
              <Link
                href="/how-it-works"
                className="rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                Como funciona
              </Link>
              <Link
                href="/faq"
                className="rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                FAQ
              </Link>
            </div>

            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-full border-2 border-slate-900 px-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white dark:border-white/70 dark:text-white dark:hover:bg-white dark:hover:text-slate-950"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="btn-primary btn-sheen inline-flex h-9 items-center justify-center rounded-full px-5 text-sm font-bold shadow-md shadow-slate-900/20 transition-shadow hover:shadow-lg dark:shadow-black/40"
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
  );
}
