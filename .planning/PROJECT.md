# app-motorista | Financial Management for App Drivers

## What This Is

A mobile-first PWA web app for app-based drivers (Uber, 99, InDrive, etc.) to manage daily finances and operational control in real-time. Dashboard for instant financial status + rapid transaction logging + historical tracking.

**Core premise:** Drivers need to know in seconds if their day is worth it, how much they've earned, what they've spent, and what their net profit is — while driving, parked, or during breaks.

## Core Value Statement

**One thing that must work:**

A driver opens the app between rides → sees dashboard instantly with today's earnings, expenses, and net profit → can log a new transaction in 3 taps → trusts the numbers are accurate.

Simple, fast, reliable.

## Intended Users

App-based drivers who:
- Need to track income and expenses daily
- Operate on tight margins (every decision about fuel, food, maintenance matters)
- Work irregular hours and want to measure productivity (earnings per hour, per trip)
- Use phones while driving or in high-attention situations (need extremely simple UI)
- Value speed over pretty animations
- Want financial clarity to decide if the day is worth continuing

**Primary user context:** Stopped for break, waiting in line, end of shift, refueling station, or between rides. Never requires sustained focus.

## V1 Scope (MVP 4–8 weeks)

### What's In

#### Dashboard / Home
- Period selector: today / this week / this month / this year
- Core KPI cards: Total earnings | Total expenses | Net profit
- Simple chart: earnings vs expenses over time (last 7 days or period)
- Transaction count for period
- Quick action buttons: "+ Entry" | "+ Exit"
- Empty states and error states handled

#### Transactions (Income / Expense)
- Fast entry form for income (amount, source like Uber/99, payment method, notes)
- Fast entry form for expense (amount, category like fuel/food, payment method, notes)
- List view with filters: by period, by type, by source/category
- Ability to edit and delete transactions
- Running totals visible
- Mobile-first forms (few fields, large taps, mobile keyboard awareness)

#### Settings (Minimal)
- Profile (name, email, phone)
- Change password
- Theme toggle (light/dark)
- Backup data to Supabase (one-tap export/import mechanism)
- Terms of use + Privacy policy links
- Logout

#### Public Site (Indexable)
- Home / Landing page (what is it, why use it, CTA signup/login)
- How it works (3–5 key screens)
- FAQ (10–15 common questions)
- Terms of use
- Privacy policy (LGPD-compliant)

### What's Out (V2+)

- ~~Journey/shift tracking~~ (cronometer, pauses, time tracking) — deferred to v2
- ~~Advanced reports~~ (graphs, exports, CSV/PDF) — foundation prepared but UI deferred
- ~~Financial goals / metas~~ — deferred
- ~~Custom categories~~ — use enums only; customization in v2
- ~~Notifications~~ — deferred
- ~~API for third-party integrations~~ — prepare architecture, defer implementation

## Technical Stack

**Frontend:**
- Next.js 15 with App Router
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui components
- PWA: manifest, service worker, offline fallback

**Backend:**
- Supabase (Postgres, Auth, Edge Functions for future server logic)
- Row-Level Security for data isolation
- LGPD-compliant data handling

**Deploy:**
- Vercel (Next.js hosting, serverless functions)
- Supabase cloud (database, auth, storage)

**Key Libraries (to minimize):**
- zod (validation)
- React Query or SWR (data fetching, optional — consider server-side first)
- date-fns (date handling)
- recharts or lightweight chart lib (single chart on dashboard)

## Core Requirements (Must Have)

### Performance
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Page load on 4G mobile: < 3s
- PWA installable and functional offline (cached critical pages)
- Bundle size: < 200KB (gzipped) for app routes

### UX / Accessibility
- Mobile-first: all interactions work with one hand
- Dark mode + light mode (respect prefers-color-scheme)
- Keyboard navigation and screen reader support (WCAG AA)
- Touch targets ≥ 44px minimum
- Tabular numbers for financial displays
- Clear visual states: loading, empty, error, success

### Security / Privacy
- LGPD compliance: explicit data consent, right to deletion, privacy policy
- RLS on all database tables (transactions, user profiles, etc.)
- No sensitive data in browser local storage (use Supabase Auth session)
- Password reset flow via email
- Email verification on signup
- Soft deletes where business-relevant

### SEO (Public Pages)
- Meta tags: title, description per page
- Open Graph + Twitter Cards
- Canonical URLs
- sitemap.xml + robots.txt
- Schema.org markup (FAQ schema, breadcrumbs)
- Server Components for public pages when possible
- Optimized for keywords: "app driver finance management", "motorista app ganhos", etc.

## Key Technical Decisions

| Decision | Rationale | Status |
|----------|-----------|--------|
| **Mobile 95%, desktop nice-to-have** | Drivers use phones exclusively; desktop is secondary | ✓ |
| **Jornada/shift tracking out of MVP** | Adds complexity; transactions alone validate core value | ✓ |
| **Supabase Auth + RLS instead of homegrown** | Battle-tested, LGPD-ready, reduces surface area | ✓ |
| **No external analytics on day 1** | Ship faster; add after validating with real users | ✓ |
| **Enum-based categories (not custom)** | MVP simplicity; custom categories in v2 | ✓ |
| **Server Components + minimal JS** | Mobile performance, SEO, lower TTI | ✓ |
| **Single-page dashboard view (no drill-down)** | Drivers want instant overview; detail in list view | ✓ |

## Database Sketch

**Core entities:**

```
users (Supabase Auth)
  ├─ id (UUID, primary key)
  ├─ email
  ├─ created_at, updated_at

driver_profiles
  ├─ id (UUID)
  ├─ user_id (FK → users)
  ├─ full_name, phone
  ├─ theme_preference (light/dark)
  ├─ created_at, updated_at

transactions
  ├─ id (UUID)
  ├─ user_id (FK → users)
  ├─ type (enum: income / expense)
  ├─ amount (decimal)
  ├─ source (enum: uber / 99 / indrive / particular / etc for income)
  ├─ category (enum: fuel / food / maintenance / wash / rent / commission / toll / other for expense)
  ├─ payment_method (enum: cash / card / pix / transfer / other)
  ├─ notes (optional text)
  ├─ transaction_date (date)
  ├─ transaction_time (time, optional)
  ├─ created_at, updated_at
  ├─ deleted_at (soft delete)
  ├─ Index: (user_id, transaction_date DESC)

app_settings
  ├─ id (UUID)
  ├─ user_id (FK → users)
  ├─ currency (default: BRL)
  ├─ weekly_goal (optional decimal)
  ├─ created_at, updated_at
```

**RLS Policies:**
- Users see only their own transactions
- Users see only their own profile and settings
- No direct user-to-user data access

## Requirements & Traceability

(Populated after Phase 1: Define Requirements)

### Validated
(None yet — ship to validate)

### Active
- [ ] Dashboard shows earnings, expenses, profit for selected period
- [ ] User can log income quickly
- [ ] User can log expense quickly
- [ ] User can view transaction history with filters
- [ ] User can edit/delete transactions
- [ ] User can toggle light/dark theme
- [ ] PWA is installable on mobile
- [ ] Public site is SEO-optimized
- [ ] Authentication works (signup, login, logout, password reset)
- [ ] Data persists in Supabase
- [ ] RLS enforces user isolation
- [ ] App works offline (cached pages, queued transactions on recovery)

### Out of Scope (V2+)
- Advanced shift/journey tracking
- Custom income sources and expense categories
- Financial goal tracking and alerts
- CSV/PDF export and reports
- Mobile notifications
- Third-party integrations (accounting software, etc.)
- Subscription management / payments

## Context & Constraints

**Timeline:** 4–8 weeks to MVP launch  
**Validation:** Dogfooding — developer uses app daily to manage own finances  
**Monetization:** Free initially; future model TBD after user validation  
**Team:** Solo developer (full-stack)  
**Data sensitivity:** Financial data (LGPD-critical)  
**Performance:** Mobile 4G, low-end phone friendly  

## Success Criteria for V1

1. **Usability:** A driver can open the app and know their day's profit in < 5 seconds
2. **Speed:** Dashboard and transaction forms load in < 2s on 4G mobile
3. **Trust:** Data syncs reliably; no lost transactions
4. **Adoption:** App is genuinely useful for daily use (validated by developer)
5. **Technical:** PWA installable, works offline, SEO on public pages, RLS enforced

## Visual Direction

**Philosophy:** Professional, sober, trustworthy, fast. No template aesthetics.

- Clean typography with excellent contrast (readable in sunlight)
- Minimal color palette (primary + neutrals + semantic colors for states)
- Dark mode that's actually useful (not just inverted colors)
- Bottom navigation on mobile (4–5 key sections)
- No unnecessary animations
- Emphasis on data legibility over visual effects
- Icons from Lucide or system icons (not heavy icon sets)
- Spacing and hierarchy that guide the eye to key numbers first

## Guiding Principles

1. **Speed over polish** — An imperfect but fast app is better than a perfect but slow one
2. **Mobile-first is non-negotiable** — Desktop is secondary
3. **Trust through transparency** — Numbers must be clear and verifiable
4. **Friction minimization** — Fastest path to recording a transaction wins
5. **User context matters** — Design for driving, parking, waiting — never full focus
6. **Validate assumptions** — Build incrementally, gather real feedback quickly

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After MVP launch (v1.0):**
1. Gather real-user feedback from dogfooding (2–4 weeks)
2. Validate assumptions about what motoristas actually need
3. Decide: next features based on real usage patterns
4. Plan v1.1 or v2.0

---

*Last updated: 2026-07-01 after deep questioning and scoping*

**Project Code:** APP-MOTORISTA  
**Status:** Initialized, ready for requirement definition
