export const metadata = {
  title: 'Termos de Uso | app-motorista',
  description: 'Termos de uso do app-motorista.',
  openGraph: {
    title: 'Termos de Uso | app-motorista',
    description: 'Termos de uso do app-motorista.',
    url: 'https://app-motorista.vercel.app/terms',
    type: 'website',
  },
};

export default function Terms() {
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
        name: 'Termos',
        item: 'https://app-motorista.vercel.app/terms',
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
        <div className="mx-auto max-w-2xl prose dark:prose-invert">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Termos de Uso</h1>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Aceitação dos Termos</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Ao usar o app-motorista, você concorda com estes termos. Se não concorda, não use o app.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Licença de Uso</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Você tem licença para usar o app-motorista para gerenciar suas finanças. Não pode vender, copiar ou distribuir o app.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Responsabilidade do Usuário</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Você é responsável:
        </p>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-6">
          <li>Pela segurança de sua senha</li>
          <li>Por suas atividades na conta</li>
          <li>Por manter informações precisas</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Proibições</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Você não pode:
        </p>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-6">
          <li>Hackear ou tentar acessar contas de outros</li>
          <li>Usar o app para atividades ilegais</li>
          <li>Spam ou abuso</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Limitação de Responsabilidade</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          O app-motorista é fornecido "como está" sem garantias. Não somos responsáveis por perda de dados ou danos diretos/indiretos.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">6. Mudanças nos Termos</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Podemos atualizar estes termos. Mudanças entram em vigor quando publicadas.
        </p>
      </div>
    </div>
    </>
  );
}
