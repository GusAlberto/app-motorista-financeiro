---
phase: 01-authentication-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - supabase/migrations/001_init_schema.sql
  - supabase/migrations/002_rls_policies.sql
autonomous: true
requirements:
  - DATA-01
  - DATA-02
  - DATA-03
  - DATA-04
  - DATA-05
  - SEC-01
  - SEC-02
  - SEC-03
  - SEC-04
  - SEC-05

must_haves:
  truths:
    - "Users can only see/modify their own driver profile"
    - "Users can only see/modify their own app settings"
    - "App prevents unauthorized access via RLS (100% enforcement)"
    - "Database enforces user isolation at row level"
    - "LGPD compliance: PII stored securely, accessible only to owner"
  artifacts:
    - supabase/migrations/001_init_schema.sql (users, driver_profiles, app_settings tables)
    - supabase/migrations/002_rls_policies.sql (RLS for all user-scoped tables)
  key_links:
    - users table ← Supabase Auth (auto-linked via auth.users)
    - driver_profiles.user_id → users.id (FK with cascade)
    - app_settings.user_id → users.id (FK with cascade)
    - RLS policies reference auth.uid() for user isolation
---

## Objective

Create secure database schema with RLS policies ensuring zero unauthorized data access. 

**Purpose:** Foundation for user isolation; every subsequent feature relies on RLS enforcement.  
**Output:** Migration files (SQL) and verified RLS policies in Supabase.

## Execution Context

@.planning/PROJECT.md  
@.planning/REQUIREMENTS.md  

**Project Stack:** Supabase (PostgreSQL), Next.js TypeScript  
**LGPD Requirements:** PII isolation, user-owned data, RLS mandatory

## Tasks

### Task 1: Create database schema migration (users, driver_profiles, app_settings)

**Files:** `supabase/migrations/001_init_schema.sql`

**Read First:**
- `.planning/REQUIREMENTS.md` (DATA-01 to DATA-05 — what tables/columns needed)
- Supabase documentation on migrations and RLS

**Action:**

Create migration file `supabase/migrations/001_init_schema.sql` with:

1. **users table** — extends Supabase auth.users
   - Columns: id (UUID, PK, references auth.users.id), email (TEXT), created_at (TIMESTAMP)
   - Purpose: Link driver profile to Supabase Auth

2. **driver_profiles table** — personal driver info
   - Columns: id (UUID, PK), user_id (UUID, FK → users.id, NOT NULL, UNIQUE), name (TEXT), phone (TEXT), vehicle_info (JSONB), created_at (TIMESTAMP), updated_at (TIMESTAMP)
   - Constraints: ON DELETE CASCADE for user_id
   - Purpose: Store driver personal/vehicle data (one profile per user)

3. **app_settings table** — user preferences
   - Columns: id (UUID, PK), user_id (UUID, FK → users.id, NOT NULL, UNIQUE), theme (TEXT DEFAULT 'light'), language (TEXT DEFAULT 'pt-BR'), notifications_enabled (BOOLEAN DEFAULT true), created_at (TIMESTAMP), updated_at (TIMESTAMP)
   - Constraints: ON DELETE CASCADE for user_id
   - Purpose: User's app preferences (theme, language, notifications toggle)

4. **Add indexes:**
   - driver_profiles(user_id) UNIQUE
   - app_settings(user_id) UNIQUE

5. **No data inserted** — this migration creates schema only.

Name the file with sequential prefix: `001_init_schema.sql`

**Acceptance Criteria:**

- File exists: supabase/migrations/001_init_schema.sql
- Contains CREATE TABLE for users, driver_profiles, app_settings
- Contains FK constraints with CASCADE deletes
- Contains UNIQUE constraints on (user_id)
- No INSERT statements (schema only)
- SQL syntax valid (no parse errors)

---

### Task 2: Create RLS policies (users, driver_profiles, app_settings)

**Files:** `supabase/migrations/002_rls_policies.sql`

**Read First:**
- `supabase/migrations/001_init_schema.sql` (table names, columns)
- Supabase RLS documentation
- SEC-01 to SEC-05 requirements (user isolation, 100% enforcement)

**Action:**

Create migration file `supabase/migrations/002_rls_policies.sql` with RLS policies for every table:

**For driver_profiles table:**
- Enable RLS: `ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;`
- Policy 1 (SELECT): Allow users to SELECT only rows where `(auth.uid() = user_id)`
- Policy 2 (INSERT): Allow authenticated users to INSERT only if `(auth.uid() = user_id)` (prevents inserting for other users)
- Policy 3 (UPDATE): Allow users to UPDATE only rows where `(auth.uid() = user_id)`
- Policy 4 (DELETE): Allow users to DELETE only rows where `(auth.uid() = user_id)`

**For app_settings table:**
- Enable RLS: `ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;`
- Policy 1 (SELECT): Allow users to SELECT only rows where `(auth.uid() = user_id)`
- Policy 2 (INSERT): Allow authenticated users to INSERT only if `(auth.uid() = user_id)`
- Policy 3 (UPDATE): Allow users to UPDATE only rows where `(auth.uid() = user_id)`
- Policy 4 (DELETE): Allow users to DELETE only rows where `(auth.uid() = user_id)`

**For users table** (store-only, not queried directly from client):
- Enable RLS: `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`
- Policy 1 (SELECT): Allow users to SELECT only rows where `(auth.uid() = id)`

**Naming convention for policies:**
- `{table_name}_{operation}_{description}` (e.g., `driver_profiles_select_own_data`)

**Security:** No anonymous access — all policies check `auth.uid()` (authenticated users only).

**Acceptance Criteria:**

- File exists: supabase/migrations/002_rls_policies.sql
- Contains ALTER TABLE ... ENABLE ROW LEVEL SECURITY for all three tables
- Contains CREATE POLICY statements checking auth.uid() for all operations (SELECT, INSERT, UPDATE, DELETE)
- grep -c "auth.uid()" supabase/migrations/002_rls_policies.sql ≥ 12 (at least 3 operations × 4 tables)
- No hardcoded user IDs; all policies use auth.uid()

---

## Threat Model

### Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Client ↔ Database | Untrusted client queries; RLS enforces authorization |
| Client ↔ Auth | Unauthenticated requests; Supabase Auth validates session |
| User A ↔ User B Data | Row-level isolation required; RLS enforces user_id match |

### STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-01-01 | Tampering | RLS Policies | critical | mitigate | Every DML operation (SELECT, INSERT, UPDATE, DELETE) checks auth.uid() == row.user_id. No policy allows cross-user access. |
| T-01-02 | Information Disclosure | driver_profiles table | critical | mitigate | RLS SELECT policy enforces auth.uid() = user_id. Unauthorized users receive 0 rows, not error. |
| T-01-03 | Information Disclosure | app_settings table | critical | mitigate | RLS SELECT policy enforces auth.uid() = user_id. Settings visible only to owner. |
| T-01-04 | Elevation of Privilege | users table | high | mitigate | users table itself is RLS-protected; only reachable through Supabase Auth context. No direct client query bypasses auth. |
| T-01-05 | Denial of Service | database schema | medium | accept | Single-user query isolation via RLS; DOS limited to individual user's data. Rate limiting applied at API layer (Wave 2). |

---

## Verification

Phase 1 database foundation verified when:
1. Migrations pass Supabase SQL syntax check
2. RLS policies created and enabled on all three tables
3. No policy allows anonymous access (all require auth.uid())
4. Manual test: Authenticated user A cannot query user B's data via RLS

---

## Success Criteria

- Migration files exist and are syntactically valid SQL
- RLS enabled on users, driver_profiles, app_settings
- Every policy checks auth.uid() for user isolation
- No cross-user data access possible
- LGPD compliance: Users see only their own data

**Artifacts This Phase Produces:**

- `supabase/migrations/001_init_schema.sql` — Database schema (users, driver_profiles, app_settings tables with FK constraints)
- `supabase/migrations/002_rls_policies.sql` — RLS policies (auth.uid() checks on SELECT, INSERT, UPDATE, DELETE for all tables)
