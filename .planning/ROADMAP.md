# ROADMAP.md | app-motorista MVP v1

## Roadmap Strategy

**Scope:** 5 sequential phases covering authentication, public pages, core dashboard, transaction management, and PWA deployment.

**Timeline:** ~4-8 weeks (MVP)

**Mode:** YOLO (execute with auto-approval)

**Execution:** Sequential (Phase → Phase, 1-3 plans per phase)

---

## Phase Structure

| Phase | Name | Goal | Requirements | Duration |
|-------|------|------|--------------|----------|
| 1 | Authentication & Foundation | Set up secure auth, database schema, and app shell | AUTH, SET-core, DATA | 1 week |
| 2 | Public Pages & SEO | Launch indexable marketing site (home, FAQ, legal) | PUB (SEO, schema, metadata) | 1 week |
| 3 | Dashboard & Analytics | Build core financial dashboard with period filtering | DASH, PWA-manifest | 1 week |
| 4 | Transactions & History | Rapid income/expense entry + list with filters + edit/delete | INC, EXP, TXN | 1.5 weeks |
| 5 | PWA, Performance & Deploy | Service worker, offline sync, optimize perf, deploy to Vercel | PWA, PERF, A11Y, MOB, deploy | 1.5 weeks |

**Total:** ~6 weeks (comfortable buffer for bugs, refining)

---

## Detailed Phase Plans

### Phase 1: Authentication & Foundation

**Goal:** Establish secure user authentication, database schema with RLS, app shell, and basic settings.

**Success Criteria:**
1. User can sign up and receive verification email
2. User can log in and stay logged in
3. User can request and complete password reset
4. Database schema is in place with RLS policies
5. App shell (navbar, theme toggle, logout) works
6. Settings page (profile, password, theme) functional
7. Zero unauthorized data access (RLS enforced)

**Requirements Mapped:**
- AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, AUTH-07, AUTH-08
- SET-01, SET-02, SET-03, SET-04, SET-05, SET-06, SET-08
- DATA-01, DATA-02, DATA-03, DATA-04, DATA-05
- SEC-01, SEC-02, SEC-03, SEC-04, SEC-05

**Key Tasks:**
1. Set up Supabase auth (email + password strategy)
2. Create Postgres schema (users, driver_profiles, transactions, app_settings)
3. Write RLS policies (user isolation)
4. Build Next.js auth flow (login page, signup page, password reset)
5. Create app shell (navbar, logout, theme context)
6. Build settings page (profile edit, password change, theme toggle)
7. Email verification flow
8. Test RLS enforcement (manual security audit)

**Outputs:**
- Supabase project with auth + schema
- Next.js login, signup, password-reset pages
- Settings page
- App shell with navbar + theme toggle
- RLS policies documented
- Initial seed data for testing

---

### Phase 2: Public Pages & SEO

**Goal:** Launch SEO-optimized public pages (marketing site) with proper metadata, schema.org, and indexability.

**Success Criteria:**
1. Home page is published and SEO-optimized
2. How it works page shows app flow
3. FAQ page with schema.org FAQPage markup
4. Privacy policy and terms pages exist
5. sitemap.xml and robots.txt present
6. All pages have OG/Twitter cards
7. Lighthouse SEO score > 90
8. Keywords indexed (Google Search Console ready)

**Requirements Mapped:**
- PUB-01 to PUB-14

**Key Tasks:**
1. Design home/landing page (CTA, value prop, screenshots)
2. Build how-it-works page (flow diagrams or screenshots)
3. Build FAQ page + FAQPage schema markup
4. Write privacy policy (LGPD-compliant)
5. Write terms of use
6. Add meta tags to all pages (title, description, OG, Twitter, canonical)
7. Create sitemap.xml (dynamic from page routes)
8. Create robots.txt
9. Add schema.org BreadcrumbList to all pages
10. Test with Lighthouse and SEO tools

**Outputs:**
- Home page (/public)
- How it works page (/how-it-works)
- FAQ page (/faq) with schema
- Privacy policy page (/privacy)
- Terms page (/terms)
- sitemap.xml
- robots.txt
- Meta tags in layout
- Lighthouse audit report

---

### Phase 3: Dashboard & Analytics

**Goal:** Build the core financial dashboard with instant KPI display and period filtering.

**Success Criteria:**
1. Dashboard shows earnings, expenses, profit for period
2. Period selector (today, week, month, year) works instantly
3. Simple chart renders (earnings vs expenses trend)
4. Empty and error states handled
5. Dashboard loads in < 2s on 4G
6. Dark mode works
7. Transaction count visible
8. Quick action buttons (" + Entry", "+ Exit") accessible

**Requirements Mapped:**
- DASH-01 to DASH-12
- PERF-01, PERF-02, PERF-05, PERF-06 (partial)
- UI-01 to UI-03 (theme support)
- MOB-01, MOB-05, MOB-06, MOB-07

**Key Tasks:**
1. Create dashboard query (aggregate earnings, expenses by period)
2. Build dashboard layout (KPI cards, chart, quick actions)
3. Implement period selector (no full page reload)
4. Add simple chart (Recharts with earnings vs expenses)
5. Add empty state UI
6. Add error boundary and error UI
7. Optimize images (use Next.js Image)
8. Implement Server Components for dashboard
9. Add loading skeleton
10. Dark mode support (verify with prefers-color-scheme)

**Outputs:**
- Dashboard page (/app/dashboard)
- Dashboard query and data layer
- Recharts integration
- Period filtering UI
- Audit: Lighthouse performance report

---

### Phase 4: Transactions & History

**Goal:** Enable rapid transaction logging (income/expense) with full CRUD and filtering.

**Success Criteria:**
1. User can log income in < 15 seconds
2. User can log expense in < 15 seconds
3. Transaction list shows all txns with filters
4. User can edit and delete transactions
5. Forms are mobile-optimized (one-handed)
6. Form validation works
7. Running totals visible in list
8. Soft deletes enforced

**Requirements Mapped:**
- INC-01 to INC-08
- EXP-01 to EXP-08
- TXN-01 to TXN-13
- DATA-03 (soft delete)
- MOB-02, MOB-03, MOB-04, MOB-06, MOB-07

**Key Tasks:**
1. Create transaction form components (income, expense) with minimal fields
2. Build form validation (Zod)
3. Implement form submission (Server Action or API route)
4. Create transaction list page with date, amount, category, notes
5. Add filters: period, type (income/expense), category, payment method
6. Add edit modal/form
7. Add delete confirmation dialog (soft delete)
8. Display running totals
9. Add empty state for list
10. Mobile-optimize all forms (large buttons, no horizontal scroll)

**Outputs:**
- Transaction form components (income, expense)
- Transaction list page (/app/transactions)
- Edit modal
- Delete confirmation
- Filter UI
- Validation schema (Zod)

---

### Phase 5: PWA, Performance & Deploy

**Goal:** Convert app to installable PWA, optimize performance, ensure accessibility, and deploy to production.

**Success Criteria:**
1. App is installable on mobile (manifest + service worker)
2. Offline pages cached (dashboard, forms)
3. Queued transactions sync when online
4. Core Web Vitals pass (LCP < 2.5s, FID < 100ms, CLS < 0.1)
5. JS bundle < 200KB gzipped
6. Lighthouse accessibility score > 90
7. WCAG AA compliant
8. Deployed to Vercel + Supabase production
9. HTTPS everywhere
10. Dogfooding validation (developer uses for 1-2 weeks)

**Requirements Mapped:**
- PWA-01 to PWA-07
- PERF-01 to PERF-10
- A11Y-01 to A11Y-10
- MOB-01 to MOB-10
- SEC-06, SEC-07, SEC-08, SEC-09, SEC-10 (privacy)
- MON-01 to MON-03 (error tracking)

**Key Tasks:**
1. Create web app manifest (icons, colors, display mode)
2. Generate app icons (144px, 192px, 512px for Android + iOS)
3. Create service worker (cache app shell, offline fallback)
4. Implement offline transaction queue (IndexedDB or localStorage + sync on reconnect)
5. Optimize images (Next.js Image, responsive sizes)
6. Code-split (lazy load transaction list, reports)
7. Remove unused dependencies
8. Audit bundle size (webpack-bundle-analyzer)
9. Audit accessibility (axe DevTools, keyboard nav, screen reader)
10. Set up error boundary and Sentry integration (optional)
11. Configure Vercel deployment (environment variables, preview)
12. Test on real mobile device (Android Chrome, iOS Safari)
13. Lighthouse audit (performance, PWA, accessibility, SEO)
14. Dogfooding week 1 (log real transactions, verify data accuracy, measure usage)
15. Iterate on UX feedback

**Outputs:**
- web app manifest
- Service worker with offline strategy
- Production deployment (Vercel + Supabase)
- Lighthouse audit reports
- Accessibility audit report
- Dogfooding notes + feedback

---

## Cross-Phase Concerns

### Performance & Core Web Vitals
- **Phase 1:** Set up database indices, avoid N+1 queries
- **Phase 3:** Implement Server Components, lazy loading
- **Phase 5:** Final optimization, bundle analysis, service worker caching

### Accessibility
- **Phase 1:** Form labels, keyboard nav in login
- **Phase 3:** Dashboard focus management, color contrast
- **Phase 4:** Form accessibility, filter controls
- **Phase 5:** Full audit and remediation

### Security & LGPD
- **Phase 1:** RLS policies, password hashing, email verification
- **Phase 2:** Privacy policy + terms
- **Phase 4:** Soft deletes, data isolation
- **Phase 5:** HTTPS, error logging (no PII), audit trail

### Testing
- **Phase 1:** Unit tests for auth, RLS audit
- **Phase 3:** Dashboard query tests
- **Phase 4:** Form validation tests
- **Phase 5:** E2E tests (Playwright or Cypress), dogfooding

---

## Dependency Graph

```
Phase 1 (Auth & Foundation)
  ├─→ Phase 2 (Public Pages) — independent, can start after 1 day of phase 1
  ├─→ Phase 3 (Dashboard) — depends on Auth + Database
  │     ├─→ Phase 4 (Transactions) — depends on Dashboard + Database
  │           └─→ Phase 5 (PWA & Deploy) — depends on all
  └─→ Phase 5 (PWA) — depends on Phase 1 auth + all routes functional
```

**Execution Model:** Sequential (no parallelization)
- Phase 1 → Phase 2 (parallel start ok) + Phase 3
- Phase 3 → Phase 4
- Phase 4 → Phase 5

---

## Traceability: Requirements → Phases

| REQ ID Range | Phase | Count |
|--------------|-------|-------|
| AUTH-01 to AUTH-08 | 1 | 8 |
| SET-01 to SET-08 | 1 | 8 |
| DATA-01 to DATA-05 | 1 | 5 |
| SEC-01 to SEC-05 | 1 | 5 |
| PUB-01 to PUB-14 | 2 | 14 |
| DASH-01 to DASH-12 | 3 | 12 |
| PERF-01 to PERF-10 | 3, 5 | 10 |
| INC-01 to INC-08 | 4 | 8 |
| EXP-01 to EXP-08 | 4 | 8 |
| TXN-01 to TXN-13 | 4 | 13 |
| PWA-01 to PWA-07 | 5 | 7 |
| A11Y-01 to A11Y-10 | 5 | 10 |
| MOB-01 to MOB-10 | 4, 5 | 10 |
| UI-01 to UI-10 | 3, 5 | 10 |
| MON-01 to MON-03 | 5 | 3 |

**Coverage:** 100% of v1 requirements mapped to phases

---

## Estimated Effort per Phase

| Phase | Tasks | Plans | Weeks | Notes |
|-------|-------|-------|-------|-------|
| 1 | 8 | 1 | 1 | Setup, schema, auth |
| 2 | 10 | 1 | 1 | Content-heavy, SEO setup |
| 3 | 10 | 1 | 1 | Dashboard queries + UI |
| 4 | 10 | 1-2 | 1.5 | Forms, CRUD, filtering |
| 5 | 15 | 1-2 | 1.5 | PWA, perf, deploy, dogfooding |
| **Total** | **53** | **6** | **6** | **MVP ready in ~6 weeks** |

---

## Launch Readiness Checklist

- [ ] Phase 1 complete: Auth functional, RLS enforced, settings working
- [ ] Phase 2 complete: Public pages indexed, SEO verified
- [ ] Phase 3 complete: Dashboard fast and accurate
- [ ] Phase 4 complete: Transactions fast to enter, no data loss
- [ ] Phase 5 complete: PWA installable, offline working, performance verified
- [ ] Lighthouse: SEO > 90, Accessibility > 90, Performance > 85, PWA > 90
- [ ] Dogfooding: 1-2 week real usage validation
- [ ] Deploy: Vercel + Supabase production ready
- [ ] Monitoring: Error tracking active

---

## Next Steps

1. `/gsd-plan-phase 1` — Create detailed plans for Phase 1 (Auth & Foundation)
2. Execute Phase 1 plans
3. Dogfood weekly feedback
4. Iterate roadmap if needed (adjust v2 scope based on real usage)

---

*Roadmap created: 2026-07-01*

**Status:** Ready to plan Phase 1

