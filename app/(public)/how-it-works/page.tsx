export const metadata = {
  title: 'Como Funciona | app-motorista',
  description: 'Aprenda como usar o app-motorista para gerenciar suas finanças.',
  openGraph: {
    title: 'Como Funciona | app-motorista',
    description: 'Aprenda como usar o app-motorista para gerenciar suas finanças.',
    url: 'https://app-motorista.vercel.app/how-it-works',
    type: 'website',
  },
};

export default function HowItWorks() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://app-motorista.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Como Funciona',
        item: 'https://app-motorista.vercel.app/how-it-works',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-white dark:bg-slate-950 py-20 px-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Como funciona</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-12">
            Acompanhe suas finanças em 3 passos simples.
          </p>

          <div className="space-y-12">
            {[
              {
                step: 1,
                title: 'Crie sua conta',
                description: 'Registre-se com seu email. Verifique e faça login.'
              },
              {
                step: 2,
                title: 'Registre entradas e saídas',
                description: 'Lançe ganhos (Uber, 99, etc) e despesas (combustível, comida, etc) em segundos.'
              },
              {
                step: 3,
                title: 'Veja seu saldo em tempo real',
                description: 'Dashboard mostra ganhos, despesas e lucro. Entenda se o dia valeu a pena.'
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
