# REQUIREMENTS.md | app-motorista MVP v1

## Overview

V1 MVP scope for app-motorista: Dashboard (earnings/expenses/profit) + Transaction logging (income/expense) + Basic settings + PWA + SEO on public pages.

**Non-functional requirements are in-scope:** Performance, Security (RLS, LGPD), Accessibility, Mobile-first.

---

## V1 Requirements (In Scope)

### Authentication & User Management

- [ ] **AUTH-01** — User can sign up with email and password
- [ ] **AUTH-02** — User receives email verification link and can confirm email
- [ ] **AUTH-03** — User can log in with email/password
- [ ] **AUTH-04** — User can request password reset via email
- [ ] **AUTH-05** — User can reset password with valid reset link
- [ ] **AUTH-06** — User remains logged in across sessions (Supabase Auth session persistence)
- [ ] **AUTH-07** — User can log out from any page
- [ ] **AUTH-08** — Session expires and re-authenticates securely

### Profile & Settings

- [ ] **SET-01** — User can view their profile (name, email, phone)
- [ ] **SET-02** — User can edit profile (name, phone)
- [ ] **SET-03** — User can change password
- [ ] **SET-04** — User can toggle light/dark theme (persists per session)
- [ ] **SET-05** — User can view Terms of Use in app
- [ ] **SET-06** — User can view Privacy Policy in app
- [ ] **SET-07** — User can download/export all their data (LGPD right to portability) — basic CSV or JSON structure
- [ ] **SET-08** — User can log out

### Dashboard

- [ ] **DASH-01** — Dashboard loads and displays immediately on app entry
- [ ] **DASH-02** — Dashboard shows Total Earnings for selected period
- [ ] **DASH-03** — Dashboard shows Total Expenses for selected period
- [ ] **DASH-04** — Dashboard shows Net Profit = Earnings - Expenses for period
- [ ] **DASH-05** — Dashboard has period selector: Today / This Week / This Month / This Year
- [ ] **DASH-06** — Switching periods updates dashboard without page reload
- [ ] **DASH-07** — Dashboard shows transaction count for period (number of entries + exits)
- [ ] **DASH-08** — Dashboard displays a simple chart: Earnings vs Expenses trend over last 7 days (or selected period)
- [ ] **DASH-09** — Dashboard shows quick-action buttons: "+ Entry" and "+ Exit" (fast access)
- [ ] **DASH-10** — Dashboard shows empty state when no transactions exist for period
- [ ] **DASH-11** — Dashboard handles error states gracefully (network, database errors)
- [ ] **DASH-12** — Dashboard respects dark/light theme

### Income Transactions

- [ ] **INC-01** — User can quickly enter new income (entry) from dashboard or dedicated form
- [ ] **INC-02** — Income form has fields: Amount, Income source (Uber/99/InDrive/Particular/Other), Payment method (Cash/Card/PIX/Transfer/Other), Notes (optional)
- [ ] **INC-03** — Income form defaults date/time to now but allows editing
- [ ] **INC-04** — Income form validation: Amount required and > 0
- [ ] **INC-05** — Income form submission saves transaction to Supabase and shows success feedback
- [ ] **INC-06** — Income form is mobile-optimized (large touch targets, minimal keyboard interaction)
- [ ] **INC-07** — User can submit income form in < 15 seconds from app open
- [ ] **INC-08** — User receives visual confirmation (toast or card flash) when income saved

### Expense Transactions

- [ ] **EXP-01** — User can quickly enter new expense (exit) from dashboard or dedicated form
- [ ] **EXP-02** — Expense form has fields: Amount, Expense category (Fuel/Food/Maintenance/Wash/Rent/Commission/Toll/Other), Payment method (Cash/Card/PIX/Transfer/Other), Notes (optional)
- [ ] **EXP-03** — Expense form defaults date/time to now but allows editing
- [ ] **EXP-04** — Expense form validation: Amount required and > 0
- [ ] **EXP-05** — Expense form submission saves transaction to Supabase and shows success feedback
- [ ] **EXP-06** — Expense form is mobile-optimized
- [ ] **EXP-07** — User can submit expense form in < 15 seconds from app open
- [ ] **EXP-08** — User receives visual confirmation when expense saved

### Transaction History & Management

- [ ] **TXN-01** — User can view list of all transactions (default: last 30 days or selected period)
- [ ] **TXN-02** — Transaction list shows: Amount, Type (Income/Expense), Source/Category, Date/Time, Notes
- [ ] **TXN-03** — Transaction list is sorted by date descending (most recent first)
- [ ] **TXN-04** — Transaction list shows running total (cumulative balance or period total)
- [ ] **TXN-05** — User can filter transaction list by period (date range picker)
- [ ] **TXN-06** — User can filter transaction list by type (Income, Expense, or All)
- [ ] **TXN-07** — User can filter transaction list by source/category
- [ ] **TXN-08** — User can filter transaction list by payment method
- [ ] **TXN-09** — User can edit a transaction (amount, category, notes, date/time)
- [ ] **TXN-10** — User can delete a transaction
- [ ] **TXN-11** — Deleted transactions are soft-deleted and don't appear in views
- [ ] **TXN-12** — Transaction list shows empty state when no transactions match filters
- [ ] **TXN-13** — Transaction list is responsive on mobile and desktop

### Data Integrity & Persistence

- [ ] **DATA-01** — All user transactions persist to Supabase (Postgres)
- [ ] **DATA-02** — User data is isolated: User can only see their own transactions (RLS enforced)
- [ ] **DATA-03** — Transactions have audit fields: created_at, updated_at, deleted_at (soft delete)
- [ ] **DATA-04** — User profile data is isolated by user_id
- [ ] **DATA-05** — Concurrent edits don't corrupt data (optimistic locking or timestamps)

### PWA & Offline

- [ ] **PWA-01** — App has web app manifest (name, icons, theme colors, display mode)
- [ ] **PWA-02** — App is installable on mobile (home screen, splash screen)
- [ ] **PWA-03** — App has service worker that caches critical assets (app shell, styles, script)
- [ ] **PWA-04** — App works offline for cached pages (dashboard, transaction form with local storage queue)
- [ ] **PWA-05** — When network returns, queued transactions sync to Supabase
- [ ] **PWA-06** — App has graceful offline fallback UI ("You're offline, changes will sync when connected")
- [ ] **PWA-07** — Manifest includes start_url, orientation, background_color

### Performance

- [ ] **PERF-01** — Dashboard loads in < 2s on 4G mobile (Core Web Vitals LCP < 2.5s)
- [ ] **PERF-02** — First Contentful Paint < 1.5s
- [ ] **PERF-03** — Cumulative Layout Shift < 0.1
- [ ] **PERF-04** — Transaction form loads in < 1s
- [ ] **PERF-05** — JS bundle (app routes) < 200KB gzipped
- [ ] **PERF-06** — Images are optimized (Next.js Image component)
- [ ] **PERF-07** — Public pages use Server Components where possible
- [ ] **PERF-08** — Critical paths prioritize Server Components over Client Components
- [ ] **PERF-09** — No render-blocking resources in critical path
- [ ] **PERF-10** — Third-party scripts deferred (none critical on load)

### Security & Privacy (LGPD)

- [ ] **SEC-01** — All API requests require valid JWT (Supabase Auth)
- [ ] **SEC-02** — RLS policies enforce user isolation (users see only own data)
- [ ] **SEC-03** — Passwords are hashed and never transmitted in plain text
- [ ] **SEC-04** — Email verification prevents spam signups
- [ ] **SEC-05** — Sensitive data (transactions) not stored in browser local storage
- [ ] **SEC-06** — HTTPS enforced (Vercel + Supabase)
- [ ] **SEC-07** — Privacy Policy clearly describes data collection, storage, and deletion rights
- [ ] **SEC-08** — User can request and download all their data (LGPD portability)
- [ ] **SEC-09** — User can request account deletion (soft-delete with audit trail)
- [ ] **SEC-10** — No third-party tracking cookies without explicit consent

### Accessibility

- [ ] **A11Y-01** — All interactive elements are keyboard navigable
- [ ] **A11Y-02** — Focus order is logical (top-to-bottom, left-to-right on mobile)
- [ ] **A11Y-03** — All buttons and links have descriptive labels (aria-label if needed)
- [ ] **A11Y-04** — Color is not the only indicator of state (also use icons, text)
- [ ] **A11Y-05** — Form inputs have associated labels
- [ ] **A11Y-06** — Error messages are linked to form fields (aria-describedby)
- [ ] **A11Y-07** — Touch targets are ≥ 44px minimum
- [ ] **A11Y-08** — Text contrast is WCAG AA compliant (≥ 4.5:1 for normal text)
- [ ] **A11Y-09** — Headings and semantic HTML structure present (h1, h2, h3, etc.)
- [ ] **A11Y-10** — App works with screen readers (NVDA, JAWS on desktop; TalkBack on Android)

### Mobile-First UX

- [ ] **MOB-01** — All interactions work with one hand (no small pinch-to-zoom required)
- [ ] **MOB-02** — Navigation is accessible at bottom of screen (bottom nav or floating action buttons)
- [ ] **MOB-03** — Forms are single-column on mobile (no side-by-side layouts)
- [ ] **MOB-04** — Modal dialogs close with back button or escape key
- [ ] **MOB-05** — Loading states visible (spinners, skeleton screens)
- [ ] **MOB-06** — Error states show clear, actionable messages
- [ ] **MOB-07** — Success feedback is immediate (toast, badge, or subtle animation)
- [ ] **MOB-08** — No horizontal scrolling needed (except intentional swipes)
- [ ] **MOB-09** — Viewport is correctly set (meta viewport tag)
- [ ] **MOB-10** — App is usable at both light and dark mode without visibility issues

### Public Pages (SEO & Marketing)

- [ ] **PUB-01** — Home/landing page exists (what is app-motorista, why use it, CTA to signup/login)
- [ ] **PUB-02** — Home page is optimized for SEO (meta title, description, OG tags)
- [ ] **PUB-03** — "How it works" page (3-5 screenshots/sections showing app flow)
- [ ] **PUB-04** — FAQ page (10-15 common questions)
- [ ] **PUB-05** — Privacy Policy page (compliant with LGPD)
- [ ] **PUB-06** — Terms of Use page
- [ ] **PUB-07** — All public pages have valid meta tags (title, description, OG:image, OG:url)
- [ ] **PUB-08** — All public pages have schema.org markup (BreadcrumbList, FAQPage schema)
- [ ] **PUB-09** — sitemap.xml exists and includes all public pages
- [ ] **PUB-10** — robots.txt exists (allows crawling of public, disallows private)
- [ ] **PUB-11** — Canonical URLs set correctly
- [ ] **PUB-12** — Public pages optimized for keywords: "motorista app ganhos", "gestão financeira motorista", "app controle entradas saídas"
- [ ] **PUB-13** — Landing page loads in < 2.5s (SEO signal)
- [ ] **PUB-14** — Open Graph and Twitter Cards configured

### UI / Theme

- [ ] **UI-01** — Light mode available and usable
- [ ] **UI-02** — Dark mode available and usable
- [ ] **UI-03** — App respects prefers-color-scheme system setting
- [ ] **UI-04** — Theme toggle accessible in settings
- [ ] **UI-05** — Financial numbers use tabular font (monospace) for alignment
- [ ] **UI-06** — Color palette is professional and sober (no loud gradients)
- [ ] **UI-07** — Typography is clear and scannable (adequate line-height, size)
- [ ] **UI-08** — UI is responsive on: mobile (375px), tablet (768px), desktop (1024px+)
- [ ] **UI-09** — Navigation structure is intuitive (main nav at bottom on mobile)
- [ ] **UI-10** — Icons from Lucide or system set (consistent, legible)

### Analytics & Monitoring (Minimal MVP)

- [ ] **MON-01** — App has basic error tracking (optional: Sentry or similar)
- [ ] **MON-02** — Unhandled errors don't crash app (error boundary)
- [ ] **MON-03** — Network errors show user-friendly messages

---

## V2 & Later (Out of Scope for MVP)

### Shift/Journey Tracking
- Shift start/pause/resume/end flow
- Cumulative time tracking with breaks
- Shift history and analytics
- Time-based metrics (earnings per hour, productivity trend)

### Advanced Settings
- Custom income sources and expense categories
- Financial goals (daily, weekly, monthly)
- Automatic backup scheduling
- Multi-language support
- Notification preferences

### Reports & Analytics
- Weekly/monthly earnings report
- Expense breakdown by category
- Productivity metrics (trips per hour, earnings trends)
- Comparisons with previous periods
- CSV/PDF export

### Monetization
- Freemium tiers
- Subscription management
- Payment processing (Stripe)

### Integrations
- Sync with accounting software
- Third-party APIs (taxi apps, etc.)
- Push notifications

---

## Acceptance Criteria (Testing Strategy)

Each requirement is testable by:

1. **Functional test:** Requirement behavior works as described
2. **Mobile test:** Works on 375px width, 4G network, low-end phone
3. **Accessibility test:** Keyboard + screen reader
4. **Performance test:** Meets Core Web Vitals targets
5. **Security test:** RLS enforced, no data leaks, HTTPS enforced

---

## Success Metrics for MVP Launch

| Metric | Target |
|--------|--------|
| **Dashboard load time** | < 2s (4G mobile) |
| **Transaction form time** | < 15 seconds from open to save |
| **Uptime** | 99.5% |
| **Error rate** | < 0.1% |
| **RLS coverage** | 100% (zero user cross-contamination) |
| **Accessibility** | WCAG AA compliant |
| **Mobile usability** | One-handed operation |
| **PWA installable** | Yes, works offline |

---

## Requirements Evolution

- Requirements are validated through dogfooding (developer uses app daily)
- After 2-4 weeks of MVP use, reassess based on real workflows
- Plan V1.1 or V2.0 based on actual usage patterns

---

*Last updated: 2026-07-01 after scoping deep-questioning*

**Total V1 Requirements:** 72 user-facing + non-functional requirements  
**Status:** Ready for roadmap creation
