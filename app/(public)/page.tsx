import Link from 'next/link';
import { ArrowRight, Smartphone, Zap, ShieldCheck, TrendingUp, TrendingDown, Fuel } from 'lucide-react';
import { APP_URL } from '@/lib/constants';

export const metadata = {
  title: 'app-motorista | Gestão Financeira para Motoristas de App',
  description: 'Dashboard financeiro em tempo real para motoristas de aplicativo. Ganhos, despesas e lucro — em segundos.',
  openGraph: {
    title: 'app-motorista | Gestão Financeira para Motoristas de App',
    description: 'Dashboard financeiro em tempo real para motoristas de aplicativo.',
    url: APP_URL,
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'app-motorista',
    description: 'Gestão financeira para motoristas de app',
  },
};

const FEATURES = [
  {
    icon: Zap,
    title: 'Instantâneo',
    description: 'Saldo atualizado em tempo real, sem esperar sincronizar.',
    span: 'sm:col-span-2',
  },
  {
    icon: Smartphone,
    title: 'Mobile-first',
    description: 'Feito para o celular no suporte do carro, não encolhido do desktop.',
    span: '',
  },
  {
    icon: ShieldCheck,
    title: 'Seus dados, só seus',
    description: 'Isolamento total por usuário no banco de dados. Ninguém mais vê suas finanças.',
    span: '',
  },
  {
    icon: TrendingUp,
    title: '3 toques para registrar',
    description: 'Ganho de corrida ou gasto com combustível — lançado antes do próximo sinal fechar.',
    span: 'sm:col-span-2',
  },
];

export default function Home() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'app-motorista',
    description: 'Dashboard financeiro em tempo real para motoristas de aplicativo',
    url: APP_URL,
    sameAs: ['https://github.com/GusAlberto/app-motorista-financeiro'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Ambient glow — decorative, purely visual. Silver/chrome, not color. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-slate-400/20 blur-[120px] dark:bg-white/[0.06]"
        />

        {/* ============================================================ */}
        {/* Hero */}
        {/* ============================================================ */}
        <section className="relative px-4 pb-16 pt-16 sm:pb-24 sm:pt-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Copy */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900 dark:bg-white" aria-hidden="true" />
                GRÁTIS · SEM CARTÃO DE CRÉDITO
              </div>

              <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                Saiba em segundos se{' '}
                <span className="underline decoration-4 underline-offset-4 decoration-slate-300 dark:decoration-white/20">
                  o dia valeu a pena
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Ganhos, despesas e lucro líquido — atualizados na hora, no seu celular.
                Feito para motoristas de Uber, 99 e InDrive que não têm tempo a perder.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="btn-primary btn-sheen group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold shadow-lg shadow-slate-900/20 transition-shadow duration-200 hover:shadow-xl dark:shadow-black/40"
                >
                  Começar agora
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-slate-300 px-6 font-semibold text-slate-900 transition-colors duration-200 hover:border-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:border-white dark:hover:bg-white/5"
                >
                  Como funciona
                </Link>
              </div>

              <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
                Sem taxas escondidas. Cancele quando quiser (não que você vá querer).
              </p>
            </div>

            {/* Visual — a crafted preview of the real dashboard, not a stock photo */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-[2rem] bg-gradient-to-br from-slate-300/40 to-slate-400/20 blur-2xl dark:from-white/10 dark:to-transparent"
              />
              <div className="mx-auto max-w-sm rounded-[1.75rem] border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40">
                <div className="rounded-[1.4rem] bg-slate-50 p-5 dark:bg-slate-950">
                  <p className="font-display text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                    Hoje, quinta-feira
                  </p>

                  <p className="mt-3 font-display text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
                    R$ 187,40
                  </p>
                  <p className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    Lucro líquido do dia
                  </p>

                  {/* Mini "chart" — decorative bars suggesting the real trend chart.
                      Brushed-metal gradient instead of a color accent. */}
                  <div
                    className="mt-6 flex h-16 items-end gap-1.5"
                    role="img"
                    aria-label="Gráfico ilustrativo de ganhos crescendo ao longo do dia"
                  >
                    {[38, 52, 44, 68, 58, 80, 71].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-slate-400 to-slate-700 dark:from-slate-600 dark:to-white"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="text-xs font-semibold">Ganhos</span>
                      </div>
                      <p className="mt-1 font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                        R$ 312,00
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                        <Fuel className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="text-xs font-semibold">Combustível</span>
                      </div>
                      <p className="mt-1 font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                        R$ 124,60
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* Features — bento grid, not a flat icon list */}
        {/* ============================================================ */}
        <section className="relative px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Feito para quem dirige, não para quem programa
              </h2>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
                Cada decisão de produto parte de uma pergunta: isso funciona com uma mão no volante?
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-200 hover:border-slate-300 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 ${feature.span}`}
                  >
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-b from-slate-700 to-slate-950 text-white ring-1 ring-white/10 dark:from-white dark:to-slate-200 dark:text-slate-950 dark:ring-black/5">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CTA */}
        {/* ============================================================ */}
        <section className="relative px-4 pb-24">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-100 p-10 text-center shadow-xl shadow-slate-900/5 sm:p-16 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:shadow-black/20">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Pronto para saber quanto você realmente ganha?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-slate-600 dark:text-slate-400">
              Crie sua conta em menos de um minuto. Sem cartão, sem pegadinha.
            </p>
            <Link
              href="/signup"
              className="btn-primary btn-sheen group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-8 font-semibold shadow-lg shadow-slate-900/20 transition-shadow duration-200 hover:shadow-xl dark:shadow-black/40"
            >
              Criar conta grátis
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
