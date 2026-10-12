import { COST_ITEMS } from "@website/content/calculations"
import { NAV, STEP_NUMBER } from "@website/content/navigation"
import { PHASES } from "@website/content/plan"
import { notFound } from "next/navigation"

export type StepParams = Promise<{ phase: string; step: string }>

export function stepStaticParams() {
  return PHASES.flatMap((p) => p.steps.map((s) => ({ phase: p.id, step: s.id })))
}

export function costStaticParams() {
  return PHASES.flatMap((p) =>
    p.steps.flatMap((s) =>
      COST_ITEMS.filter((c) => c.stepId === s.id).map((c) => ({
        phase: p.id,
        step: s.id,
        cost: c.id,
      })),
    ),
  )
}

export async function loadStep(params: StepParams) {
  const { phase: phaseId, step: stepId } = await params
  const phase = PHASES.find((p) => p.id === phaseId)
  const step = phase?.steps.find((s) => s.id === stepId)
  if (!phase || !step) notFound()
  const flat = NAV.flatMap((p) => p.steps)
  const idx = flat.findIndex((s) => s.id === stepId)
  return { phase, step, number: STEP_NUMBER[stepId], prev: flat[idx - 1], next: flat[idx + 1] }
}
