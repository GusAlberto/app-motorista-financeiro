---
phase: 01-authentication-foundation
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - supabase/config.toml
  - .env.example
  - lib/supabase/client.ts
  - lib/supabase/server.ts
  - lib/supabase/index.ts
autonomous: true
requirements:
  - AUTH-01
  - AUTH-02
  - AUTH-03
  - AUTH-04
  - AUTH-05
  - AUTH-06
  - AUTH-07
  - AUTH-08

must_haves:
  truths:
    - "Email/password authentication is configured in Supabase"
    - "Email verification is required before user can log in"
    - "Password reset flow is functional and sends email"
    - "JWT tokens are issued and validated on every request"
    - "Auth state persists across browser reloads (session storage)"
  artifacts:
    - supabase/config.toml (auth provider config)
    - lib/supabase/client.ts (client-side Supabase instance with session management)
    - lib/supabase/server.ts (server-side Supabase instance with service role)
    - .env.example (SUPABASE_URL, SUPABASE_ANON_KEY)
  key_links:
    - Supabase Auth sends verification email → user clicks link → email verified in auth.users
    - JWT stored in session (not localStorage) → sent with every API request
    - Logout clears session
    - Password reset email → user sets new password → auth.users updated
---

## Objective

Configure Supabase Auth with email/password strategy, verification flow, and session management.

**Purpose:** Enable user signup, login, password reset while maintaining security (no PII in storage).  
**Output:** Auth clients, environment configuration, verified email/password/reset flows.

## Execution Context

@.planning/PROJECT.md  
@.planning/REQUIREMENTS.md  

**Key Resources:**
- Supabase Auth documentation: https://supabase.com/docs/guides/auth
- Next.js integration: https://supabase.com/docs/guides/auth/auth-helpers/nextjs

## Tasks

### Task 1: Configure Supabase Auth provider (email + password)

**Files:** `supabase/config.toml`

**Read First:**
- AUTH-01 to AUTH-08 requirements (email verification, password reset, session)
- Supabase Auth configuration guide

**Action:**

Update `supabase/config.toml` with auth provider settings:

1. **Email Provider:**
   - Enable email provider: `[auth.email]`
   - Require email verification: `enable_signup = true` and `require_email_confirmation = true`
   - Auto-confirm disabled (user must verify)
   - Email from: `from_email = "noreply@{your-project}.supabase.co"` (or custom domain)

2. **Password Requirements:**
   - Min length: 8 characters
   - Include lowercase, uppercase, numbers (enforce in client validation, not DB)

3. **JWT & Session:**
   - JWT expiration: 1 hour (standard)
   - Refresh token: 7 days (standard)
   - Token generation: automatic on signup/login

4. **Email Templates:**
   - Default verification email template (user gets "Confirm your email" with link)
   - Default password reset template (user gets "Reset your password" with link)
   - (Customize templates in Supabase Dashboard → Authentication → Email Templates)

5. **CORS & Redirects:**
   - Allowed redirect URLs: `http://localhost:3000`, `https://{deployed-url}` (set in Dashboard)

**Do NOT enable:** OAuth (not in Phase 1), phone auth, magic links, third-party providers.

**Acceptance Criteria:**

- File exists: supabase/config.toml
- Contains [auth.email] section
- require_email_confirmation = true
- JWT expiration set (1 hour standard)
- No OAuth or third-party providers configured

---

### Task 2: Create Supabase client (server + browser)

**Files:** 
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/index.ts`

**Read First:**
- Supabase Auth Helpers for Next.js
- .env.local pattern for secrets
- @supabase/supabase-js package documentation

**Action:**

Create Supabase client utilities:

**1. lib/supabase/client.ts** (Browser client, anon key):
```typescript
// Initialize with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
// Use @supabase/supabase-js package
// Configure storage option: use browser's localStorage for session
// Export: function createClient(): SupabaseClient
```

- Initialize with: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Use `@supabase/supabase-js` package version ≥ 2.30
- Configure storage option: use localStorage for session (browser only)
- Use autoRefreshToken: true (auto-refresh JWT before expiration)

**2. lib/supabase/server.ts** (Server-side client, service role):
```typescript
// Initialize with SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (secret, server-only)
// Use for RLS-bypass operations (admin tasks, migrations)
// Include session forwarding for user context
// Export: function createServerClient(): SupabaseClient
```

- Initialize with: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (secret, server-only)
- Use for RLS-bypass operations (admin tasks, migrations)
- Include session forwarding for user context in Next.js middleware
- Export: function createServerClient(): SupabaseClient

**3. lib/supabase/index.ts** (Re-export):
```typescript
export { createClient, createServerClient } from './client';
```

**Security rules:**
- NEXT_PUBLIC_* keys are safe (anon key has limited permissions via RLS)
- SUPABASE_SERVICE_ROLE_KEY is secret (never expose in browser)
- Every client call includes JWT in Authorization header (automatic via Supabase JS SDK)

**Acceptance Criteria:**

- Files exist: lib/supabase/client.ts, lib/supabase/server.ts, lib/supabase/index.ts
- grep -c "createClient" lib/supabase/client.ts ≥ 1
- grep -c "NEXT_PUBLIC_SUPABASE_" lib/supabase/client.ts ≥ 2
- grep -c "SUPABASE_SERVICE_ROLE_KEY" lib/supabase/server.ts ≥ 1
- lib/supabase/index.ts exports both functions
- No hardcoded URLs or keys in code

---

### Task 3: Create environment configuration (.env.example)

**Files:** `.env.example`

**Read First:**
- Supabase project keys (from Supabase Dashboard → Settings → API)

**Action:**

Create `.env.example` with required variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Instructions in comments:**
1. Copy `.env.example` to `.env.local` (Git-ignored)
2. Replace YOUR_PROJECT, YOUR_ANON_KEY, YOUR_SERVICE_ROLE_KEY with actual values from Supabase Dashboard
3. NEXT_PUBLIC_* variables are exposed to browser; SERVICE_ROLE_KEY is secret

**Security:**
- Do NOT commit `.env.local` — add to .gitignore if not present
- SERVICE_ROLE_KEY must be server-only (never sent to browser)
- NEXT_PUBLIC_* keys are safe (limited by RLS)

**Acceptance Criteria:**

- File exists: .env.example
- Contains NEXT_PUBLIC_SUPABASE_URL
- Contains NEXT_PUBLIC_SUPABASE_ANON_KEY
- Contains SUPABASE_SERVICE_ROLE_KEY
- .gitignore contains .env.local
- All keys have placeholder values (YOUR_*, not empty)

---

## Threat Model

### Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Browser ↔ Supabase API | Anon key is public; RLS enforces authorization |
| Server ↔ Supabase API | Service role key is secret; server-only |
| Client JWT | Session-stored token; no PII in JWT claims |

### STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-01-06 | Information Disclosure | JWT / Session | high | mitigate | JWT stored in sessionStorage (cleared on browser close), not localStorage. No PII in token claims. HTTPS enforced (Vercel). |
| T-01-07 | Tampering | Auth Config | medium | mitigate | Supabase Auth handles password hashing (bcrypt + salt). Client cannot modify auth state without valid JWT. |
| T-01-08 | Elevation of Privilege | Service Role Key | critical | mitigate | SUPABASE_SERVICE_ROLE_KEY is server-only (never sent to browser). Environment variables secured in Vercel/CI. |
| T-01-09 | Denial of Service | Email Verification | medium | accept | Rate limiting on auth endpoints (Supabase default). Single user verification limited to their account. |

---

## Verification

Auth configuration verified when:
1. Supabase Dashboard shows email provider enabled
2. Test signup → email received → link clicked → email verified
3. Test login → JWT issued and stored
4. Test logout → session cleared
5. Environment variables load correctly (no "undefined" errors)

---

## Success Criteria

- Supabase auth provider configured (email + password)
- Client and server Supabase instances created
- Environment variables documented
- Verification email and password reset templates available in Dashboard
- No hardcoded secrets in code
- All JWT operations working (issue, refresh, revoke)

**Artifacts This Phase Produces:**

- `supabase/config.toml` — Auth provider configuration (email, password, JWT settings, CORS)
- `lib/supabase/client.ts` — Browser-side Supabase client (anon key, session management)
- `lib/supabase/server.ts` — Server-side Supabase client (service role key, admin operations)
- `lib/supabase/index.ts` — Re-export utility for clean imports
- `.env.example` — Environment variable template (SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY)
