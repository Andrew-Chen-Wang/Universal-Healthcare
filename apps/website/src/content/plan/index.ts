import type { Phase, Step } from "../types"
import { PHASE_0 } from "./phase0"
import { PHASE_1 } from "./phase1"
import { PHASE_2 } from "./phase2"
import { PHASE_3 } from "./phase3"
import { PHASE_4 } from "./phase4"
import { PHASE_5 } from "./phase5"

export const PHASES: Phase[] = [PHASE_0, PHASE_1, PHASE_2, PHASE_3, PHASE_4, PHASE_5]

export const ALL_STEPS: (Step & { phase: Phase })[] = PHASES.flatMap((phase) =>
  phase.steps.map((step) => ({ ...step, phase })),
)

export const STEP_BY_ID = Object.fromEntries(ALL_STEPS.map((s) => [s.id, s]))

export function phaseOfStep(id: string) {
  return STEP_BY_ID[id]?.phase
}
