import { APP_URL } from '@/lib/constants';

export const metadata = {
  title: 'Política de Privacidade | app-motorista',
  description: 'Política de privacidade do app-motorista.',
  openGraph: {
    title: 'Política de Privacidade | app-motorista',
    description: 'Política de privacidade do app-motorista.',
    url: `${APP_URL}/privacy`,
    type: 'website',
  },
};

export default function Privacy() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: APP_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Privacidade',
        item: `${APP_URL}/privacy`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-8">Política de Privacidade</h1>

        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Introdução</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          O app-motorista respeita sua privacidade. Esta política descreve como coletamos, usamos e protegemos seus dados.
        </p>

        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Dados que Coletamos</h2>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-6">
          <li>Email (para login)</li>
          <li>Suas transações (ganhos e despesas)</li>
          <li>Preferências do app (tema, idioma)</li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Como Usamos Seus Dados</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Usamos seus dados apenas para:
        </p>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-6">
          <li>Fazer você acessar sua conta</li>
          <li>Armazenar suas transações financeiras</li>
          <li>Melhorar o app</li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Segurança</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Seus dados são criptografados e protegidos com RLS (Row Level Security). Apenas você pode acessá-los.
        </p>

        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Seus Direitos (LGPD)</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Você tem direito de:
        </p>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-6">
          <li>Acessar seus dados</li>
          <li>Solicitar cópia de todos seus dados</li>
          <li>Deletar sua conta e dados</li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">6. Contato</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Dúvidas sobre privacidade? Entre em contato conosco no GitHub.
        </p>
      </div>
    </div>
    </>
  );
}
