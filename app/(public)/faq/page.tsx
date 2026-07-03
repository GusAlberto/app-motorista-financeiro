import { ChevronDown } from 'lucide-react';
import { APP_URL } from '@/lib/constants';

export const metadata = {
  title: 'FAQ | app-motorista',
  description: 'Perguntas frequentes sobre app-motorista.',
  openGraph: {
    title: 'FAQ | app-motorista',
    description: 'Perguntas frequentes sobre app-motorista.',
    url: `${APP_URL}/faq`,
    type: 'website',
  },
};

const faqData = [
  {
    q: 'É seguro guardar meus dados financeiros aqui?',
    a: 'Sim. Seus dados são criptografados e armazenados com segurança no Supabase. Você pode fazer login apenas com sua senha.'
  },
  {
    q: 'Meus dados são privados?',
    a: 'Completamente. Ninguém além de você pode acessar suas informações financeiras. Implementamos RLS (Row Level Security) no banco de dados.'
  },
  {
    q: 'Posso usar offline?',
    a: 'Sim! O app funciona como um PWA (Progressive Web App). Você pode instalar no celular e usar offline. Dados sincronizam quando voltar online.'
  },
  {
    q: 'Quanto custa?',
    a: 'Totalmente gratuito. O app-motorista é open source e não tem custos.'
  },
  {
    q: 'Funciona em celulares antigos?',
    a: 'Sim. Otimizamos para funcionar rápido em conexões 4G lentas e celulares com 2GB+ de RAM.'
  },
  {
    q: 'Posso exportar meus dados?',
    a: 'Sim. Você pode solicitar download de todos seus dados conforme a LGPD garante.'
  },
  {
    q: 'E se eu esquecer minha senha?',
    a: 'Você pode resetar sua senha via email. Usamos o fluxo padrão de segurança.'
  },
  {
    q: 'Qual é a política de privacidade?',
    a: 'Leia nossa política completa aqui. Resumo: não vendemos seus dados, não rastreamos, não fazemos publicidade.'
  },
];

export default function FAQ() {
  const faqs = faqData;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="min-h-screen bg-slate-50 px-4 py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Perguntas frequentes
          </h1>
          <p className="mb-12 mt-4 text-lg text-slate-600 dark:text-slate-400">
            Respostas rápidas sobre o app-motorista.
          </p>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-slate-900 marker:content-none dark:text-white">
                  {faq.q}
                  <ChevronDown
                    className="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-slate-600 dark:text-slate-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
