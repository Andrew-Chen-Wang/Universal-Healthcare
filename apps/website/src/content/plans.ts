/**
 * The two versions of Part 2. The hybrid is the current draft and lives at
 * /plan; the single-payer plan is the earlier draft, kept whole at
 * /single-payer/plan.
 */
import { COST_ITEMS } from "./calculations"
import { CHANGES } from "./changes"
import { DECISIONS } from "./decisions"
import { HYBRID_PLAN_DATA } from "./hybrid"
import { PHASES } from "./plan"
import { makeBundle, type PlanBundle, type PlanVariant } from "./plan-bundle"
import { RISKS } from "./risks"
import { STEP_EXTRAS } from "./step-extras"
import { TASK_TRADEOFFS } from "./task-tradeoffs"
import { TRADEOFFS } from "./tradeoffs"

export const SINGLE_PAYER_PLAN = makeBundle({
  variant: "single-payer",
  name: "Single payer",
  base: "/single-payer/plan",
  phases: PHASES,
  changes: CHANGES,
  costItems: COST_ITEMS,
  extras: STEP_EXTRAS,
  taskTradeoffs: TASK_TRADEOFFS,
  designDecisions: DECISIONS,
  risks: RISKS,
  tradeoffs: TRADEOFFS,
})

export const HYBRID_PLAN = makeBundle(HYBRID_PLAN_DATA)

export const PLANS: Record<PlanVariant, PlanBundle> = {
  hybrid: HYBRID_PLAN,
  "single-payer": SINGLE_PAYER_PLAN,
}

export const getPlan = (v: PlanVariant) => PLANS[v]
