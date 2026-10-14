/**
 * Part 2 for the current draft, a Germany-style hybrid. TEMPORARY: reuses the
 * single-payer content until the hybrid content is written.
 */
import { COST_ITEMS } from "../calculations"
import { CHANGES } from "../changes"
import { DECISIONS } from "../decisions"
import { PHASES } from "../plan"
import type { PlanData } from "../plan-bundle"
import { RISKS } from "../risks"
import { STEP_EXTRAS } from "../step-extras"
import { TASK_TRADEOFFS } from "../task-tradeoffs"
import { TRADEOFFS } from "../tradeoffs"

export const HYBRID_PLAN_DATA: PlanData = {
  variant: "hybrid",
  name: "Germany-style hybrid",
  base: "/plan",
  phases: PHASES,
  changes: CHANGES,
  costItems: COST_ITEMS,
  extras: STEP_EXTRAS,
  taskTradeoffs: TASK_TRADEOFFS,
  designDecisions: DECISIONS,
  risks: RISKS,
  tradeoffs: TRADEOFFS,
}
