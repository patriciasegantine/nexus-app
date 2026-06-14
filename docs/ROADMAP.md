# Nexus Dashboard — Roadmap

This document captures what the project currently does, what it needs to feel complete, and where it could go if evolved into a full SaaS product.

---

## Current State

### Authentication
- Google OAuth + email/password (register, login, forgot password, reset password)
- Welcome email on sign-up
- Rate limiting on sensitive endpoints (forgot/reset password)
- Edge middleware protecting all private routes
- bcrypt (12 rounds) + SHA-256 token hashing

### Dashboard
- Real-time stats: total tasks, in-progress, completed, overdue
- Tasks by status (bar chart) and priority distribution (pie chart)
- Recent tasks table and recent projects list
- Empty state with guided CTA
- "Try with sample data" — seeds 3 projects and 15 tasks in one click

### Projects
- Full CRUD with color picker, tags, and slug-based URLs
- Kanban board view (3 columns: To Do / In Progress / Done)
- Destructive delete requires typing the project slug to confirm

### Tasks
- Full CRUD + duplicate
- Fields: title, description, project, priority, status, due date, tags
- Overdue highlight on due date
- Filters: status, priority, project, due date (overdue / today / this week / no date / exact date), text search, tag
- Pagination (12 per page), active filter chips, clickable badges that trigger filters
- Responsive: desktop filter panel + mobile bottom drawer

### Settings
- Edit display name
- Theme toggle (light / dark / system)
- Danger zone: clear all data (requires typing "DELETE")

### Technical foundation
- Next.js 15 App Router with Server Components + Server Actions
- Prisma + PostgreSQL (Neon)
- Auth.js v5 with Prisma adapter
- Zod validation on all inputs
- IDOR protection — every query scoped by `userId`
- shadcn/ui + Tailwind, dark mode throughout

---

## Phase 1 — Polish (portfolio-ready)

Small gaps that matter for a finished feel.

- [ ] **Drag-and-drop Kanban** — `@hello-pangea/dnd` is already installed; wire it up to `updateTaskStatus`
- [ ] **Change password in settings** — email/password users have no way to update their password
- [ ] **Delete account** — Danger Zone clears data but does not remove the user record
- [ ] **Task sorting** — currently fixed to `updatedAt desc`; expose sort options in the UI
- [ ] **Project search** — the projects list has no search or filter
- [ ] **Granular loading skeletons** — `loading.tsx` files exist but pages load as a unit; add per-component Skeleton

---

## Phase 2 — Product depth

Features that make the tool genuinely useful day-to-day, scoped to a single-user context.

- [ ] **Saved views** — name and persist a filter combination (e.g. "High priority this week") and switch between them instantly
- [ ] **Recurring tasks** — daily / weekly / monthly repeats with automatic re-creation on completion
- [ ] **Subtasks** — simple checklist inside a task (flat, not nested); good for breaking down work without adding a new layer of complexity
- [ ] **Metrics by period** — completion rate by week or month; how many tasks were created vs. closed over time (no burndown — that requires sprints, which this product doesn't have)
- [ ] **Due date reminders by email** — a daily digest of tasks due today or overdue; no in-app notifications needed at this stage
- [ ] **Keyboard shortcuts** — quick-add task, navigate between pages, open filters without touching the mouse

---

## Phase 3 — SaaS foundation

Everything needed to go from a personal tool to a multi-user product.

### Multi-user
- [ ] **Workspaces** — isolated environments, one per team or company
- [ ] **Members and roles** — invite by email; roles: Owner, Admin, Member
- [ ] **Assignees** — assign tasks to workspace members
- [ ] **Shared projects** — project-level visibility and permission settings
- [ ] **Comments on tasks** — only meaningful with multiple users; threaded discussion per task
- [ ] **@mentions** in task comments
- [ ] **Activity log** — audit trail of changes per task and project ("who moved this?")
- [ ] **Task attachments** — file uploads (images, docs) linked to a task; requires object storage (S3 or equivalent)

### Auth & compliance
- [ ] **Email verification** — verify address before accessing the workspace
- [ ] **Social login expansion** — add GitHub provider
- [ ] **SSO / SAML** — for enterprise plans
- [ ] **GDPR compliance** — data export (JSON/CSV) + full account deletion
- [ ] **Terms of Service and Privacy Policy pages**

### Monetization
- [ ] **Billing with Stripe** — subscription management, plan upgrades/downgrades
- [ ] **Free tier limits** — e.g. 3 projects, 1 member; upgrade to unlock more
- [ ] **Usage-based limits** enforced server-side per workspace plan

### Infrastructure
- [ ] **Rate limiting on all mutations** — not just auth endpoints
- [ ] **Error monitoring** — Sentry (or equivalent)
- [ ] **Product analytics** — PostHog or Mixpanel for feature adoption tracking
- [ ] **CI/CD pipeline** — GitHub Actions: lint + typecheck + test on every PR
- [ ] **E2E tests** — Playwright (already installed as a dev dependency)
- [ ] **Uptime monitoring** — external health checks and alerting

### Go-to-market
- [ ] **Landing page** — marketing site separate from the app
- [ ] **Onboarding flow** — guided setup after first sign-up
- [ ] **Public changelog** — communicate updates to users
- [ ] **API** — REST or GraphQL for integrations and third-party tools
- [ ] **Webhooks** — push events to external services on task/project changes

---

## Out of scope (for now)

- Time tracking
- Gantt / timeline view
- AI-generated task suggestions
- Native mobile apps
