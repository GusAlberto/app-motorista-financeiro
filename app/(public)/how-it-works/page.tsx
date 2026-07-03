import { APP_URL } from '@/lib/constants';

export const metadata = {
  title: 'Como Funciona | app-motorista',
  description: 'Aprenda como usar o app-motorista para gerenciar suas finanças.',
  openGraph: {
    title: 'Como Funciona | app-motorista',
    description: 'Aprenda como usar o app-motorista para gerenciar suas finanças.',
    url: `${APP_URL}/how-it-works`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: 1,
    title: 'Crie sua conta',
    description: 'Registre-se com seu email. Verifique e faça login.',
  },
  {
    step: 2,
    title: 'Registre entradas e saídas',
    description: 'Lance ganhos (Uber, 99, etc) e despesas (combustível, comida, etc) em segundos.',
  },
  {
    step: 3,
    title: 'Veja seu saldo em tempo real',
    description: 'Dashboard mostra ganhos, despesas e lucro. Entenda se o dia valeu a pena.',
  },
];

export default function HowItWorks() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: APP_URL },
      { '@type': 'ListItem', position: 2, name: 'Como Funciona', item: `${APP_URL}/how-it-works` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-slate-50 px-4 py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Como funciona
          </h1>
          <p className="mb-12 mt-4 text-lg text-slate-600 dark:text-slate-400">
            Acompanhe suas finanças em 3 passos simples.
          </p>

          <div className="space-y-10">
            {STEPS.map((item, i) => (
              <div key={item.step} className="relative flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-slate-700 to-slate-950 font-display text-lg font-bold text-white ring-1 ring-white/10 dark:from-white dark:to-slate-200 dark:text-slate-950 dark:ring-black/5">
                    {item.step}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="mt-2 w-px flex-1 bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
