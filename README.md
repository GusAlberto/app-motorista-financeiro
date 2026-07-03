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
- 📊 Dashboard financeiro em tempo real (ganhos, despesas, lucro) com filtro por período
- 💸 Registro rápido de ganhos e despesas (< 15s)
- 📝 Lista de transações com filtros, busca, edição e exclusão (soft delete)
- 🌐 Páginas públicas com SEO (home, FAQ, privacidade, termos)
- 🌙 Dark mode
- 📱 Mobile-first

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local
# Preencher NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Rodar migrations no Supabase (SQL Editor) na ordem:
#   supabase/migrations/001_init_schema.sql
#   supabase/migrations/002_rls_policies.sql
#   supabase/migrations/003_transactions_table.sql
#   supabase/migrations/004_transactions_rls.sql
#   supabase/migrations/005_transactions_soft_delete.sql

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

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
