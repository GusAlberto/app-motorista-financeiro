# PLAN.md | Phase 5: PWA, Performance, CI/CD & Deploy

**Phase:** 5 of 5 (final)
**Goal:** Make the app an installable PWA, add CI/CD + automated tests, optimize performance, and deploy to production.
**Duration:** 1.5 weeks
**Status:** In Progress

---

## Success Criteria

1. App is installable on mobile (manifest + service worker)
2. Offline shell cached (dashboard, forms load offline)
3. Core Web Vitals pass (LCP < 2.5s, CLS < 0.1)
4. Lighthouse: PWA installable, Performance > 85, Accessibility > 90
5. CI pipeline runs on every push (build + typecheck + tests)
6. Automated tests: unit (Vitest) + E2E smoke (Playwright)
7. Deployed to Vercel with env vars configured
8. Vercel deploy succeeds (route conflict already fixed)

---

## Execution Plan

### Wave 1: Deploy Unblock & Config ✅ (partially done)

**Task 1.1: Fix Vercel build error** ✅ DONE
- Removed duplicate `app/page.tsx` (route conflict with `(public)/page.tsx`)

**Task 1.2: Add vercel.json / deploy config**
- File: `vercel.json` (build command, headers, security)
- Document env var requirements
- Add security headers (CSP-lite, X-Frame-Options via next.config)

---

### Wave 2: PWA (Installable + Offline)

**Task 2.1: Verify/expand web manifest**
- Review `app/manifest.ts` — icons, theme_color, display: standalone
- Add proper icon sizes (192, 512, maskable)

**Task 2.2: Generate app icons**
- Create `public/icons/` with 192px, 512px, maskable variants
- Reference from manifest

**Task 2.3: Service worker (offline shell)**
- Use `next-pwa` or custom SW
- Cache app shell, static assets
- Offline fallback page

**Task 2.4: Install prompt (optional)**
- `beforeinstallprompt` handler + install button

---

### Wave 3: CI/CD + Tests

**Task 3.1: Set up Vitest**
- Install vitest + testing-library
- Config: `vitest.config.ts`
- Unit tests for validation schemas, dashboard queries (pure logic)

**Task 3.2: Set up Playwright**
- Install playwright
- Config: `playwright.config.ts`
- E2E smoke: home loads, login page renders, signup validation

**Task 3.3: GitHub Actions CI**
- File: `.github/workflows/ci.yml`
- Jobs: install → typecheck → build → unit tests → (optional) e2e
- Runs on push + PR to main/master

**Task 3.4: Add test scripts to package.json**
- `test`, `test:unit`, `test:e2e`, `typecheck`

---

### Wave 4: Performance & A11y

**Task 4.1: Performance optimizations**
- Verify Server Components usage
- Code-split heavy components (Recharts already split)
- Optimize fonts (next/font)

**Task 4.2: Accessibility audit**
- Keyboard navigation on forms/modals
- ARIA labels, focus management in modals
- Color contrast check

**Task 4.3: Final Lighthouse audit**
- Document scores in PERFORMANCE.md
- Fix any blocking issues

---

## Dependencies

- ✅ Phases 1-4 complete
- ✅ Vercel deploy error fixed (Wave 1.1)

---

## Outputs

- Installable PWA (manifest + service worker + icons)
- `vercel.json` + security headers
- Vitest unit tests + Playwright E2E
- GitHub Actions CI pipeline
- Lighthouse audit report
- Production deployment on Vercel

---

## Git Strategy

Atomic commits per task:
1. `fix(deploy): remove duplicate root page` ✅ done
2. `chore(deploy): add vercel.json and security headers`
3. `feat(pwa): add manifest, icons, and service worker`
4. `test: set up Vitest with unit tests`
5. `test: set up Playwright E2E smoke tests`
6. `ci: add GitHub Actions pipeline`
7. `perf: optimize fonts and accessibility`
8. `docs(phase-5): add final Lighthouse audit`

---

**Final phase — after this the MVP is production-ready.**
