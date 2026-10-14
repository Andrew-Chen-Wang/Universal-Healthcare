/**
 * Authoring helpers for the hybrid plan: each step is written with its task
 * trade-offs and its extras (design decisions, trade-off dimensions, risks,
 * other countries) beside it, then split into the shapes Part 2 pages use.
 */
import type { StepExtras } from "../step-extras"
import type { Phase, Step, Task } from "../types"

export type HybridTask = Task & { tradeoff: string }
export type HybridStep = Omit<Step, "tasks"> & { tasks: HybridTask[]; extras: StepExtras }
export type HybridPhase = Omit<Phase, "steps"> & { steps: HybridStep[] }

export function splitPhases(phases: HybridPhase[]) {
  const taskTradeoffs: Record<string, string[]> = {}
  const extras: Record<string, StepExtras> = {}
  const out: Phase[] = phases.map((p) => ({
    ...p,
    steps: p.steps.map(({ extras: e, tasks, ...s }) => {
      taskTradeoffs[s.id] = tasks.map((t) => t.tradeoff)
      extras[s.id] = e
      return { ...s, tasks: tasks.map(({ tradeoff: _, ...t }) => t) }
    }),
  }))
  return { phases: out, taskTradeoffs, extras }
}
