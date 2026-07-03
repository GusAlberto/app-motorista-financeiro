import Link from 'next/link';
import { ArrowRight, Smartphone, Zap, Lock, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'app-motorista | Gestão Financeira para Motoristas de App',
  description: 'Dashboard financeiro em tempo real para motoristas de aplicativo. Ganhos, despesas e lucro — em segundos.',
  openGraph: {
    title: 'app-motorista | Gestão Financeira para Motoristas de App',
    description: 'Dashboard financeiro em tempo real para motoristas de aplicativo.',
    url: 'https://app-motorista.vercel.app',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'app-motorista',
    description: 'Gestão financeira para motoristas de app',
  },
};

export default function Home() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'app-motorista',
    description: 'Dashboard financeiro em tempo real para motoristas de aplicativo',
    url: 'https://app-motorista.vercel.app',
    sameAs: ['https://github.com/GusAlberto/app-motorista-financeiro'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Saiba em segundos se o dia valeu a pena
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8">
            Dashboard financeiro em tempo real. Ganhos, despesas e lucro — exatamente o que você precisa enquanto dirige.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Começar agora <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition"
            >
              Como funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            Tudo o que você precisa
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Smartphone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Mobile-First</h3>
                <p className="text-slate-600 dark:text-slate-300">Rápido no seu celular, mesmo em conexão 4G lenta</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Instantâneo</h3>
                <p className="text-slate-600 dark:text-slate-300">Veja seu saldo em tempo real, sempre sincronizado</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Seguro</h3>
                <p className="text-slate-600 dark:text-slate-300">Seus dados financeiros protegidos com criptografia</p>
              </div>
            </div>
            <div className="flex gap-4">
              <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Produtividade</h3>
                <p className="text-slate-600 dark:text-slate-300">Registre entradas/saídas em 3 toques</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Registre-se agora e comece a acompanhar suas finanças em tempo real.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Criar conta grátis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
