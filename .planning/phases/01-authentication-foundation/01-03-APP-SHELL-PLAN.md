---
phase: 01-authentication-foundation
plan: 03
type: execute
wave: 2
depends_on:
  - 01-01
  - 01-02
files_modified:
  - app/layout.tsx
  - app/page.tsx
  - app/(auth)/login/page.tsx
  - app/(auth)/signup/page.tsx
  - app/(auth)/forgot-password/page.tsx
  - app/(auth)/verify-email/page.tsx
  - app/(app)/layout.tsx
  - app/(app)/settings/page.tsx
  - components/Navbar.tsx
  - components/ThemeProvider.tsx
  - lib/hooks/useAuth.ts
  - types/auth.ts
  - middleware.ts
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
  - SET-01
  - SET-02
  - SET-03
  - SET-04
  - SET-05
  - SET-06
  - SET-07
  - SET-08

must_haves:
  truths:
    - "App shell renders with navbar, logout button, theme toggle"
    - "Unauthenticated users cannot access /app/* routes (redirected to /login)"
    - "Authenticated users can access /app/* and settings page"
    - "Settings page allows: profile edit, password change, theme toggle, logout"
    - "Theme persists across sessions (light/dark)"
    - "Mobile-first design (95% priority): all pages responsive"
  artifacts:
    - app/layout.tsx (root layout with theme provider)
    - app/(auth)/* (login, signup, forgot-password, verify-email pages)
    - app/(app)/* (protected routes with navbar)
    - components/Navbar.tsx (navbar with logout + theme toggle)
    - components/ThemeProvider.tsx (Tailwind dark mode context)
    - lib/hooks/useAuth.ts (custom hook for auth state + user context)
    - types/auth.ts (User, AuthContext TypeScript interfaces)
    - middleware.ts (route protection for /app/*)
  key_links:
    - middleware.ts (redirects unauthenticated /app/* to /login)
    - useAuth hook → AuthProvider (context wrapper at root layout)
    - Settings page uses useAuth to display logged-in user
    - Navbar uses useAuth.logout() and theme toggle
    - Theme context syncs with app_settings table (persist to DB in Phase 2)
---

## Objective

Build Next.js app shell with authentication routes, protected app layout, settings page, and mobile-first design.

**Purpose:** Enable users to sign up, log in, reset password, and manage settings. Establish responsive design foundation for subsequent phases.  
**Output:** Pages, components, hooks, and navigation structure ready for Phase 2 (public features).

## Execution Context

@.planning/PROJECT.md  
@.planning/REQUIREMENTS.md  

**Key Resources:**
- Next.js App Router: https://nextjs.org/docs/app
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com
- Mobile-first design: 95% focus, test on iPhone SE (320px) breakpoint

## Tasks

### Task 1: Create authentication pages (login, signup, password reset, verify email)

**Files:**
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/verify-email/page.tsx`

**Read First:**
- Next.js App Router documentation (route groups)
- shadcn/ui form examples
- Supabase Auth method signatures: signUpWithPassword, signInWithPassword, resetPasswordForEmail

**Action:**

Create four authentication pages (mobile-first, responsive):

**1. Login Page (`app/(auth)/login/page.tsx`):**
- Form: email + password inputs, "Login" submit button
- Link: "Don't have an account? Sign up" → /signup
- Link: "Forgot password?" → /forgot-password
- Flow: On submit → `supabase.auth.signInWithPassword({ email, password })` → redirect to /app/dashboard
- Error handling: Display auth errors (invalid credentials, etc.)
- Mobile: Full-width form, large touch targets (min 48px buttons)

**2. Signup Page (`app/(auth)/signup/page.tsx`):**
- Form: email, password, password confirm inputs
- Validation: password ≥ 8 chars, uppercase+lowercase+number, passwords match
- Submit: `supabase.auth.signUpWithPassword({ email, password })` → redirect to /verify-email
- Error handling: Display existing user, weak password, etc.
- Terms: Small checkbox "I agree to Terms" (placeholder)
- Mobile: Full-width form, clear error messages

**3. Forgot Password Page (`app/(auth)/forgot-password/page.tsx`):**
- Form: email input, "Send Reset Link" button
- Flow: `supabase.auth.resetPasswordForEmail(email)` → show success message "Check your email"
- Note: User gets email with reset link (Supabase default template)
- Mobile: Full-width form

**4. Verify Email Page (`app/(auth)/verify-email/page.tsx`):**
- Static page: "Check your email to confirm your account"
- Note: Supabase auto-handles email verification click (no action needed here)
- Button: "Back to login" → /login
- Mobile: Centered, readable text

**All pages:**
- Use Tailwind CSS (no custom CSS)
- shadcn/ui components: Input, Button, Card, Form
- Mobile-first: Tailwind responsive classes (sm:, md:, lg:)
- Spacing: 16px gutters, 24px margins (mobile), scale up on larger screens
- Typography: 16px body (prevents iOS auto-zoom), clear hierarchy
- No auth state check (unauthenticated users reach these pages)

**Acceptance Criteria:**

- Files exist: all four page.tsx files
- Each page imports shadcn/ui components (Input, Button, Card, Form)
- Each page imports createClient() from lib/supabase/client
- Login page calls signInWithPassword on form submit
- Signup page calls signUpWithPassword on form submit
- Forgot password calls resetPasswordForEmail on form submit
- All pages use Tailwind CSS classes (no inline styles)
- grep -c "className=" app/\(auth\)/* ≥ 10 (multiple elements styled)

---

### Task 2: Create protected app layout with navbar and theme toggle

**Files:**
- `app/(app)/layout.tsx`
- `components/Navbar.tsx`
- `components/ThemeProvider.tsx`
- `lib/hooks/useAuth.ts`
- `types/auth.ts`
- `middleware.ts`

**Read First:**
- Next.js middleware documentation
- Tailwind dark mode setup: https://tailwindcss.com/docs/dark-mode
- shadcn/ui theme setup

**Action:**

Create protected app shell:

**1. middleware.ts (Route protection):**
- Check if request is for /app/* and no valid session → redirect to /login
- Use `createServerClient()` to validate session server-side
- Pass user context forward (for useAuth hook)
- All other routes pass through

**2. components/ThemeProvider.tsx:**
- Context provider for theme state: light | dark
- Store preference in localStorage (key: `theme`)
- Apply class `dark` to `<html>` element in dark mode
- Export useTheme hook: { theme, toggleTheme }
- On mount, read localStorage; if missing, use system preference (`prefers-color-scheme`)

**3. lib/hooks/useAuth.ts:**
- Custom hook: `useAuth()` → { user, session, logout, loading }
- On mount: call `supabase.auth.getSession()` to hydrate user state
- Subscribe to `onAuthStateChange` to detect logout/login
- `logout()` function: calls `supabase.auth.signOut()` and redirects to /login
- Return user.email, user.id for profile display

**4. types/auth.ts:**
- Export interface User { id, email, created_at }
- Export interface AuthContext { user: User | null, session, logout, loading }

**5. app/(app)/layout.tsx:**
- Wrap children in <ThemeProvider> and <AuthProvider>
- Render <Navbar /> at top
- Apply Tailwind responsive layout (mobile-first: 100vw, md: sidebar, etc.)
- Navbar sticky (stays visible on scroll)

**6. components/Navbar.tsx:**
- Mobile-first: horizontal bar, 56px height (standard mobile navbar)
- Content: app logo/title, spacer, logout button, theme toggle button
- Logout button: icon or "Sign out", onClick → useAuth().logout()
- Theme toggle button: sun/moon icon, onClick → useTheme().toggleTheme()
- No hamburger menu yet (Phase 2 adds navigation)
- Responsive: md: expand spacing, larger icons
- Touch targets: ≥48px for buttons

**All components:**
- Use Tailwind CSS (no styled-components)
- shadcn/ui buttons, dropdowns as needed
- Mobile-first breakpoints: sm: 640px, md: 768px, lg: 1024px

**Acceptance Criteria:**

- middleware.ts exists, checks /app/* routes
- components/Navbar.tsx renders logout + theme toggle buttons
- components/ThemeProvider.tsx exports useTheme hook
- lib/hooks/useAuth.ts exports useAuth hook
- types/auth.ts exports User, AuthContext interfaces
- app/(app)/layout.tsx wraps children in ThemeProvider + AuthProvider
- grep -c "useAuth()" app/\(app\)/* ≥ 2 (navbar, settings)
- grep -c "dark:" components/Navbar.tsx ≥ 1 (responsive styling)

---

### Task 3: Create settings page (profile edit, password change, theme, logout)

**Files:** `app/(app)/settings/page.tsx`

**Read First:**
- useAuth hook (created in Task 2)
- shadcn/ui form components
- Supabase Auth method: updateUser, updatePassword

**Action:**

Create Settings page (`app/(app)/settings/page.tsx`):

**Layout (mobile-first, vertical sections):**
- Header: "Settings"
- Section 1: Account
  - Display: User email (read-only)
  - Form: name, phone (text inputs, editable)
  - Submit: "Update Profile" → calls `updateUser({ data: { display_name, phone } })`
- Section 2: Password
  - Form: current password, new password, confirm password
  - Validation: new password ≥ 8 chars, different from current
  - Submit: "Change Password" → calls `updateUser({ password: newPassword })`
- Section 3: Preferences
  - Toggle: "Dark Theme" → calls useTheme().toggleTheme()
  - Dropdown: "Language" → [pt-BR, en-US] (placeholder, default pt-BR)
- Section 4: Danger Zone
  - Button: "Sign Out" → calls useAuth().logout() → /login

**Mobile layout:**
- Full-width sections, 16px padding
- Cards with light background (rounded corners)
- Buttons full-width on mobile (md: auto width)
- Clear spacing between sections (24px gaps)

**Error/Success handling:**
- Display form errors inline (validation feedback)
- Show success toast "Profile updated!" after submit
- Show errors in red text under inputs

**Responsive:**
- Mobile: single column
- md: two-column layout for Account + Password sections

**Acceptance Criteria:**

- File exists: app/(app)/settings/page.tsx
- Page imports useAuth hook
- Page imports shadcn/ui Form components
- Contains form for name, phone inputs
- Contains form for password change
- Contains theme toggle (uses useTheme)
- Contains logout button
- grep -c "updateUser" app/\(app\)/settings/page.tsx ≥ 2
- grep -c "toggleTheme" app/\(app\)/settings/page.tsx ≥ 1

---

## Threat Model

### Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Unauthenticated ↔ Authenticated Routes | Middleware enforces /app/* requires session |
| Client Form Input | User input validated before sending to Supabase |
| Password Reset Email | User verifies identity via email link |

### STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-01-10 | Tampering | Login Form | high | mitigate | Password validated client-side (min 8 chars, complexity), server-side enforced by Supabase Auth (bcrypt). |
| T-01-11 | Information Disclosure | Password Reset | high | mitigate | Reset link sent via email (user verifies ownership). Supabase generates time-limited token. HTTPS only. |
| T-01-12 | Denial of Service | Form Submission | medium | accept | Rate limiting on Supabase Auth (default, per-user). Single user can attempt 6 resets per hour. |
| T-01-13 | Tampering | Theme/Settings | low | accept | Client-side preference (localStorage); no sensitive data. Incorrect theme toggle not a security issue. |
| T-01-14 | Elevation of Privilege | Navbar Logout | high | mitigate | Logout clears session (supabase.auth.signOut). Page redirects to /login. Middleware denies access to /app/*. |

---

## Verification

App shell verified when:
1. Unauthenticated user accessing /app/dashboard → redirected to /login (middleware)
2. User signs up → redirected to /verify-email → can verify and log in
3. Logged-in user → navbar displays logout + theme toggle buttons
4. Settings page loads with profile, password, theme forms
5. Theme toggle changes colors on all pages (light ↔ dark)
6. Logout button clears session and redirects to /login
7. Mobile layout: single column, full-width on iPhone SE (320px)
8. All touch targets ≥48px height

---

## Success Criteria

- Authentication pages (login, signup, password reset, verify email) complete and functional
- Protected routes redirect unauthenticated users to /login
- Navbar renders with logout + theme toggle
- Settings page allows profile edit, password change, theme toggle
- Theme persists across page reloads and sessions
- All pages responsive and mobile-first (tested on 320px width)
- SET-01 to SET-08 requirements satisfied
- AUTH-01 to AUTH-08 requirements satisfied

**Artifacts This Phase Produces:**

- `app/(auth)/login/page.tsx` — Login form (email, password, links to signup/forgot-password)
- `app/(auth)/signup/page.tsx` — Signup form (email, password, confirm password, terms checkbox)
- `app/(auth)/forgot-password/page.tsx` — Password reset form (email input, send reset link button)
- `app/(auth)/verify-email/page.tsx` — Email verification status page (static, back to login link)
- `app/(app)/layout.tsx` — Protected app layout with theme provider, auth provider, navbar
- `app/(app)/settings/page.tsx` — User settings page (profile, password, theme, language, logout)
- `components/Navbar.tsx` — Navbar component (logo, logout button, theme toggle)
- `components/ThemeProvider.tsx` — Theme context provider (light/dark mode, localStorage persistence)
- `lib/hooks/useAuth.ts` — Custom auth hook (user state, session, logout function)
- `types/auth.ts` — TypeScript interfaces (User, AuthContext, Session)
- `middleware.ts` — Next.js middleware (route protection for /app/*)
