import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-900 dark:text-white">
            app-motorista
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/how-it-works" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              Como funciona
            </Link>
            <Link href="/faq" className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              FAQ
            </Link>
            <Link href="/login" className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li><Link href="/how-it-works" className="hover:text-slate-900 dark:hover:text-white">Como funciona</Link></li>
                <li><Link href="/faq" className="hover:text-slate-900 dark:hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li><Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white">Privacidade</Link></li>
                <li><Link href="/terms" className="hover:text-slate-900 dark:hover:text-white">Termos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Links</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li><a href="https://github.com/GusAlberto/app-motorista-financeiro" className="hover:text-slate-900 dark:hover:text-white">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>&copy; 2026 app-motorista. Open source.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
