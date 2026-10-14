/**
 * The completeness checklist and automatic checks for each version of Part 2.
 * The single-payer plan keeps its own checklist, model checks, and outside
 * benchmarks (coverage.ts); the hybrid gets the same checklist items linked to
 * its own pages (hybrid/coverage.ts) and the same plan-wide checks.
 */
import { BENCHMARKS, type Benchmark } from "./benchmarks"
import {
  CHECKS as SP_CHECKS,
  COVERAGE as SP_COVERAGE,
  type CoverageGroup,
  type Ref,
} from "./coverage"
import { HY_COVERAGE } from "./hybrid/coverage"
import type { PlanBundle, PlanVariant } from "./plan-bundle"
import { PLANS } from "./plans"

export type Check = { label: string; total: number; failures: string[] }

export function refExistsIn(plan: PlanBundle, r: Ref) {
  switch (r.kind) {
    case "step":
      return Boolean(plan.stepById[r.id])
    case "cost":
      return Boolean(plan.costById[r.id])
    case "change":
      return plan.changes.some((c) => c.id === r.id)
    case "tradeoff":
      return plan.tradeoffs.some((t) => t.id === r.id)
    case "risk":
      return plan.risks.some((x) => x.id === r.id)
    case "decision":
      return plan.designDecisions.some((d) => d.id === r.id)
  }
}

/** Checks that apply to any version of the plan. */
export function planChecks(plan: PlanBundle, coverage: CoverageGroup[]): Check[] {
  const extras = Object.values(plan.extras)
  return [
    {
      label: "Every cost item states its trade-off",
      total: plan.costItems.length,
      failures: plan.costItems.filter((c) => !c.tradeoff.trim()).map((c) => c.id),
    },
    {
      label: "Every task states its trade-off",
      total: plan.allSteps.reduce((s, x) => s + x.tasks.length, 0),
      failures: plan.allSteps.flatMap((s) =>
        s.tasks
          .map((_, i) => (plan.taskTradeoffs[s.id]?.[i]?.trim() ? null : `${s.id}#${i + 1}`))
          .filter((x): x is string => x !== null),
      ),
    },
    {
      label: "Every system change states its trade-off",
      total: plan.changes.length,
      failures: plan.changes.filter((c) => !c.tradeoff.trim()).map((c) => c.id),
    },
    {
      label: "Every step has pros and cons",
      total: plan.allSteps.length,
      failures: plan.allSteps.filter((s) => !s.pros.length || !s.cons.length).map((s) => s.id),
    },
    {
      label: "Every step has at least one risk with a mitigation",
      total: plan.allSteps.length,
      failures: plan.allSteps
        .filter((s) => s.risks.length + (plan.extras[s.id]?.riskIds?.length ?? 0) === 0)
        .map((s) => s.id),
    },
    {
      label: "Every step has at least two comparisons with other countries",
      total: plan.allSteps.length,
      failures: plan.allSteps
        .filter((s) => (plan.extras[s.id]?.international.length ?? 0) < 2)
        .map((s) => s.id),
    },
    {
      label: "Every design decision has at least two alternatives and what it gives up",
      total: plan.designDecisions.length,
      failures: plan.designDecisions
        .filter((d) => d.alternatives.length < 2 || !d.givesUp.length)
        .map((d) => d.id),
    },
    {
      label: "Every design decision is attached to a step",
      total: plan.designDecisions.length,
      failures: plan.designDecisions
        .filter((d) => !extras.some((e) => e.decisionIds?.includes(d.id)))
        .map((d) => d.id),
    },
    {
      label: "Every trade-off dimension in the register is attached to a step",
      total: plan.tradeoffs.length,
      failures: plan.tradeoffs
        .filter((t) => !extras.some((e) => e.tradeoffIds?.includes(t.id)))
        .map((t) => t.id),
    },
    {
      label: "Every major risk is attached to a step",
      total: plan.risks.length,
      failures: plan.risks
        .filter((r) => !extras.some((e) => e.riskIds?.includes(r.id)))
        .map((r) => r.id),
    },
    {
      label: "Every coverage checklist item links to at least one place on the site",
      total: coverage.reduce((s, g) => s + g.items.length, 0),
      failures: coverage.flatMap((g) =>
        g.items.filter((i) => i.refs.length === 0).map((i) => i.id),
      ),
    },
  ]
}

export const PLAN_COVERAGE: Record<
  PlanVariant,
  { coverage: CoverageGroup[]; checks: Check[]; benchmarks: Benchmark[] }
> = {
  "single-payer": { coverage: SP_COVERAGE, checks: SP_CHECKS, benchmarks: BENCHMARKS },
  hybrid: { coverage: HY_COVERAGE, checks: planChecks(PLANS.hybrid, HY_COVERAGE), benchmarks: [] },
}

// Every hybrid checklist link must resolve; the build fails otherwise.
for (const g of HY_COVERAGE)
  for (const item of g.items)
    for (const r of item.refs)
      if (!refExistsIn(PLANS.hybrid, r))
        throw new Error(`Hybrid coverage item ${item.id} references missing ${r.kind} ${r.id}`)
