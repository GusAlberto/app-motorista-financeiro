# PLAN.md | Phase 3: Dashboard & Analytics

**Phase:** 3 of 5  
**Goal:** Build the core financial dashboard with instant KPI display and period filtering.  
**Duration:** 1 week  
**Status:** Ready to Execute

---

## Success Criteria

1. Dashboard shows earnings, expenses, profit for period
2. Period selector (today, week, month, year) works instantly
3. Simple chart renders (earnings vs expenses trend)
4. Empty and error states handled
5. Dashboard loads in < 2s on 4G
6. Dark mode works
7. Transaction count visible
8. Quick action buttons ("+Entry", "+Exit") accessible

---

## Execution Plan

### Wave 1: Data Layer & Query

**Task 1.1: Create dashboard database query**
- File: `lib/queries/dashboard.ts`
- Fetch transactions for selected period
- Calculate: total_earnings, total_expenses, net_profit
- Count transactions by type
- Use Server Component with Supabase client

**Task 1.2: Add type definitions**
- File: `types/dashboard.ts`
- Define DashboardStats, PeriodType, DashboardData interfaces
- Export for reuse in components

---

### Wave 2: Dashboard UI Components

**Task 2.1: Create dashboard layout**
- File: `app/(app)/dashboard/page.tsx`
- Replace placeholder with real dashboard
- KPI cards (earnings, expenses, profit)
- Period selector dropdown
- Quick action buttons
- Chart container
- Empty state

**Task 2.2: Build KPI card component**
- File: `components/DashboardKPICard.tsx`
- Display label, amount, icon
- Dark mode support
- Responsive sizing

**Task 2.3: Build period selector**
- File: `components/PeriodSelector.tsx`
- Dropdown: Today, Week, Month, Year
- State management with URL params or React state
- No full page reload

---

### Wave 3: Charts & Analytics

**Task 3.1: Add Recharts integration**
- Install: `recharts` (if not present)
- File: `components/EarningsChart.tsx`
- Line or bar chart: earnings vs expenses by day/week
- Responsive sizing
- Dark mode colors
- Loading state

**Task 3.2: Create error boundary**
- File: `components/DashboardErrorBoundary.tsx`
- Catch chart and query errors
- Show user-friendly error message

---

### Wave 4: Polish & Performance

**Task 4.1: Add loading skeleton**
- File: `components/DashboardSkeleton.tsx`
- Skeleton loaders for KPI cards and chart
- Match final layout

**Task 4.2: Optimize Server Component**
- Use Next.js Server Component for data fetching
- Cache strategy (revalidate: 60)
- Image optimization (next/image if needed)

**Task 4.3: Dark mode verification**
- Test with `prefers-color-scheme`
- Verify Recharts colors in dark mode
- Test theme toggle from navbar

**Task 4.4: Audit performance**
- Lighthouse audit (target: > 85 on 4G)
- Check Core Web Vitals
- Document baseline metrics

---

## Dependencies

- ✅ Phase 1: Auth, Database, RLS policies
- ✅ Phase 2: Public pages (no dependency)
- ⏳ transactions table populated with seed data (or handle empty gracefully)

---

## Outputs

- Dashboard page (`/app/dashboard`)
- Dashboard queries and data layer (`lib/queries/dashboard.ts`)
- KPI, chart, period selector components
- Type definitions
- Lighthouse performance report
- Baseline metrics documented

---

## Testing Checklist

- [ ] Dashboard loads with real data
- [ ] Period selector changes data without reload
- [ ] Chart renders and updates
- [ ] Empty state shows when no transactions
- [ ] Error boundary catches errors
- [ ] Dark mode works
- [ ] Mobile responsive (< 768px)
- [ ] Load time < 2s on 4G
- [ ] Lighthouse SEO > 90, Performance > 85, Accessibility > 90

---

## Git Strategy

Atomic commits per task:
1. `feat(phase-3): add dashboard queries and types`
2. `feat(phase-3): add KPI card component`
3. `feat(phase-3): add period selector component`
4. `feat(phase-3): add earnings chart with Recharts`
5. `feat(phase-3): add dashboard page with layout`
6. `feat(phase-3): add dashboard error boundary and skeleton`
7. `docs(phase-3): add performance baseline and audit report`

---

**Next:** Execute Phase 3 with `/gsd-execute-phase 3`
