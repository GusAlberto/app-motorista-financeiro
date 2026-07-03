# app-motorista | Gestão Financeira para Motoristas de App

PWA mobile-first para motoristas de aplicativo (Uber, 99, InDrive) gerenciarem suas finanças e operação diária em tempo real.

**Premissa:** o motorista precisa saber em segundos se o dia valeu a pena — quanto ganhou, quanto gastou e qual o lucro líquido — enquanto dirige, parado ou em uma pausa.

## Stack

- **Next.js 15** (App Router, Server Components)
- **TypeScript** (strict)
- **Tailwind CSS** (dark mode)
- **Supabase** (Auth + Postgres + RLS)
- **Recharts** (gráficos)
- **PWA** (manifest + service worker)

## Funcionalidades

- 🔐 Autenticação por email/senha com RLS (isolamento total por usuário)
- 🛡️ Segurança: rate limiting em login/signup/reset de senha, Content-Security-Policy e re-autenticação para troca de senha
- 📊 Dashboard financeiro em tempo real (ganhos, despesas, lucro) com filtro por período (Hoje / Semana / Mês / Ano)
- 💸 Registro rápido de ganhos e despesas (< 15s) via modal, acionado pelo botão **"+"** central da barra de navegação inferior no mobile
- 📝 Lista de transações com filtros, busca, edição e exclusão (soft delete)
- 📅 Datas tratadas como **data de calendário** (sem conversão de fuso), evitando que uma transação de "hoje" apareça no dia anterior
- 🌐 Páginas públicas com SEO (home, FAQ, privacidade, termos)
- 🌙 Dark mode
- 📱 Mobile-first + PWA instalável (funciona offline)

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local
# Preencher NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
# (NEXT_PUBLIC_APP_URL é opcional em dev; obrigatória em produção — ver DEPLOY.md)

# Rodar migrations no Supabase (SQL Editor) na ordem:
#   supabase/migrations/001_init_schema.sql
#   supabase/migrations/002_rls_policies.sql
#   supabase/migrations/003_transactions_table.sql
#   supabase/migrations/004_transactions_rls.sql
#   supabase/migrations/005_transactions_soft_delete.sql
#   supabase/migrations/006_rate_limits.sql

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev            # servidor de desenvolvimento
npm run build          # build de produção
npm test               # testes unitários (Vitest)
npm run test:e2e       # testes E2E (Playwright — precisa de build)
npm run type-check     # checagem de tipos (tsc --noEmit)
npm run lint           # ESLint
```

Guias detalhados: [DEPLOY.md](DEPLOY.md) (produção) · [PERFORMANCE.md](PERFORMANCE.md) (otimizações).

## Roadmap

| Fase | Status |
|------|--------|
| 1. Autenticação & Foundation | ✅ |
| 2. Páginas Públicas & SEO | ✅ |
| 3. Dashboard & Analytics | ✅ |
| 4. Transações & Histórico | ✅ |
| 5. PWA, Performance & Deploy | 🚧 |

## Licença

Open source.
