## Build Commands

```bash
# Install dependencies
pnpm install

# Start development server (website + API)
pnpm run dev --workspace=website

# Run all tests
pnpm test

# Run a single test file
pnpm dlx vitest run path/to/file.test.ts --config .config/vitest.config.mts

# Lint and format
pnpm run format        # Oxfmt format with .config/oxfmt.config.ts
pnpm run lint          # Oxlint check with auto-fix

# Database
docker-compose up -d                              # Start PostgreSQL
pnpm run migrate:latest --workspace=dbmigrator     # Run migrations
pnpm run db-codegen --workspace=@universal/db        # Generate Kysely types

# Create new migration
cd apps/dbmigrator/src && pnpm dlx kysely migrate:make <name>

# Generate OpenAPI client (requires dev server running)
pnpm run openapi --workspace=website
```

## Architecture

This is a TypeScript monorepo with npm workspaces:

**Apps:**

- `apps/website` - Next.js frontend with Tailwind/ShadCN UI. API routes are proxied through `/api`
- `apps/internal-api` - Hono API with TypeBox schemas and OpenAPI generation. Mounted at `/api` via Next.js
- `apps/dbmigrator` - Kysely database migrations

**Packages:**

- `packages/db` - Kysely database client and generated types (`@universal/db`)
- `lib/typescript/dao` - Data access objects shared between API and website (`@lib/dao`)
- `lib/typescript/utils/*` - Utility libraries (e.g., `@utils/numbers`)

The website (`apps/website`) is a static content site. It does not use the database,
the internal API, or auth; those packages remain from the template but are not linked
into the website and are not deployed.

**Website content:**

- `apps/website/src/content/constants.ts` defines every raw number once. Never write a
  number literal in prose or pages; import it (`v("id")`, `show("id")`) instead.
- `model.ts` computes the ledger; `calculations.ts` turns every cost into arithmetic
  steps; each cost item has `stepId` and its own page.
- `reform-model.ts` prices picks without a single payer line by line on top of the 2024
  baseline (coverage, provider and drug prices, new benefits, insurer overhead, workforce),
  reusing `model.ts`'s rates; `/your-plan` and `/approaches` use it via `costFor`.
- Plan steps live in `content/plan/`; `step-extras.ts` links each step to decisions,
  trade-offs, risks, jobs, and international comparisons; `changes.ts` lists every
  system change with its step.
- Routes: `/plan/[phase]/[step]` plus subpages (tasks, design, costs, costs/[cost],
  tradeoffs, risks, changes, international).
- Problems live in `content/problems.ts` (including problems created by solution
  paths, ids `x-*`). Solution paths live in `content/paths/`, one `path({...})` per
  option with pros, cons, who gains/loses, mend, precedents, and links (`solves`,
  `worsens`, `spawns`, `requires`, `conflicts`, `complements`). `paths/index.ts`
  validates every link at build time. Status stays `"open"` until the owner decides;
  only chosen paths get folded into Part 2. Routes: `/problems/[id]`, `/paths`
  (decision tree), `/paths/[id]`.
- Draft decisions live in `content/paths/decisions.ts`: `SINGLE_PAYER_ROWS` (the first
  draft, kept as a path to compare via `SINGLE_PAYER_PICKS`) with `HYBRID_ROWS` (the current
  Germany-style hybrid draft) layered on top.
- Part 2 has two versions, each a `PlanBundle` (`content/plan-bundle.ts`, `content/plans.ts`):
  the hybrid (current draft) at `/plan`, written in `content/hybrid/` (steps with their task
  trade-offs and extras, design decisions, trade-offs, risks, changes as overrides of
  `changes.ts`, costs from `reform-model.ts`), and the single-payer plan at
  `/single-payer/plan` (`content/plan/`, `changes.ts`, `calculations.ts`, `step-extras.ts`,
  ...). Page code lives in `lib/plan/views/`; route files pick a version.
- Optimizations that work in any system (whoever pays: labs, virtual-first, hospital at
  home) live in `content/optimizations.ts`, outside the problem → path tree, with evidence
  for and against. Routes: `/optimizations`, `/optimizations/[id]`.
