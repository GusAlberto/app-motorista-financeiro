# Guia de Deploy — App Motorista

Passo a passo para colocar o app em produção (Vercel + Supabase).

## 1. Supabase (banco de dados)

1. Crie um projeto em [app.supabase.com](https://app.supabase.com)
2. No **SQL Editor**, rode as migrations **na ordem**:
   - `supabase/migrations/001_init_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_transactions_table.sql`
   - `supabase/migrations/004_transactions_rls.sql`
   - `supabase/migrations/005_transactions_soft_delete.sql`
   - `supabase/migrations/006_rate_limits.sql` (rate limiting de login/signup/reset de senha)
   - `supabase/migrations/007_fix_transactions_update_rls.sql` (corrige RLS de UPDATE)
   - `supabase/migrations/008_secure_soft_delete_rpc.sql` (RPC segura de soft-delete — sem ela, excluir falha com "new row violates row-level security policy")
3. Em **Authentication → Providers → Email**, confirme que "Email" está habilitado.
   - Para o MVP, "Confirm email" está desabilitado (`supabase/config.toml`). Para produção real, habilite e configure SMTP.
4. Em **Project Settings → API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secreta, nunca exponha no cliente)

## 2. Vercel (hospedagem)

1. Importe o repositório em [vercel.com/new](https://vercel.com/new)
2. A Vercel detecta Next.js automaticamente (framework preset).
3. Em **Environment Variables**, adicione:
   | Nome | Valor |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | (Project URL) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon key) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (service role key) |
   | `NEXT_PUBLIC_APP_URL` | URL de produção real (ex.: `https://motorista.dev`) — usada em metadata/SEO/sitemap/robots.txt e nos redirects de email |
4. Clique em **Deploy**.
5. Após o deploy, confirme a URL de produção (ex.: `https://motorista.dev`).

## 3. Configuração pós-deploy

1. No Supabase, em **Authentication → URL Configuration**, adicione a URL de produção em:
   - **Site URL**: `https://sua-url.com`
   - **Redirect URLs**: `https://sua-url.com/auth/callback`
2. Se usar domínio próprio, repita com o domínio final.

## 4. CI/CD

O pipeline (`.github/workflows/ci.yml`) roda automaticamente em cada push/PR para `main`/`master`:
- Type check + testes unitários (Vitest) + build
- Testes E2E (Playwright, chromium)

A Vercel faz deploy automático a cada push na branch `main`.

## 5. Verificação (checklist)

- [ ] Home carrega e é indexável (`/`)
- [ ] Signup + login funcionam
- [ ] Dashboard mostra KPIs e gráfico
- [ ] Registrar ganho/despesa persiste e atualiza o dashboard
- [ ] Editar/excluir transação funciona
- [ ] App é instalável (ícone "Instalar" no navegador mobile)
- [ ] Funciona offline (página `/offline.html` como fallback)
- [ ] Lighthouse: PWA installable, Performance > 85, SEO > 90
- [ ] Email de confirmação/reset de senha redireciona corretamente (`/auth/callback` → `/dashboard` ou `/settings`)
- [ ] Trocar a senha em Configurações pede a senha atual corretamente
- [ ] Após 5 tentativas de login erradas para o mesmo email em 15 min, a próxima tentativa é bloqueada com "Muitas tentativas..."

## Comandos úteis

```bash
npm run dev            # desenvolvimento
npm run build          # build de produção
npm test               # testes unitários
npm run test:e2e       # testes E2E (precisa de build)
npm run generate-icons # regenerar ícones PWA a partir de public/icon.svg
npm run type-check     # checagem de tipos
```
