/**
 * Part 2 for the current draft, a Germany-style hybrid: employer plans stay,
 * everyone else is enrolled in regulated nonprofit plans, and new federal
 * costs are paid only by top-end taxes.
 */
import type { PlanData } from "../plan-bundle"
import { HY_CHANGES } from "./changes"
import { HY_COST_ITEMS } from "./costs"
import { HY_DESIGN_DECISIONS } from "./design"
import { splitPhases } from "./helpers"
import { HY_PHASE_0, HY_PHASE_1 } from "./phases-build"
import { HY_PHASE_2, HY_PHASE_3, HY_PHASE_4, HY_PHASE_5 } from "./phases-run"
import { HY_RISKS, HY_TRADEOFFS } from "./register"

const { phases, taskTradeoffs, extras } = splitPhases([
  HY_PHASE_0,
  HY_PHASE_1,
  HY_PHASE_2,
  HY_PHASE_3,
  HY_PHASE_4,
  HY_PHASE_5,
])

export const HYBRID_PLAN_DATA: PlanData = {
  variant: "hybrid",
  name: "Germany-style hybrid",
  base: "/plan",
  phases,
  changes: HY_CHANGES,
  costItems: HY_COST_ITEMS,
  extras,
  taskTradeoffs,
  designDecisions: HY_DESIGN_DECISIONS,
  risks: HY_RISKS,
  tradeoffs: HY_TRADEOFFS,
}
