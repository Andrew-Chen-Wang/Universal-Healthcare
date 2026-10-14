import { getPlan } from "@website/content/plans"
import type { PlanVariant } from "@website/content/plan-bundle"
import { notFound } from "next/navigation"

export type StepParams = Promise<{ phase: string; step: string }>

export function stepStaticParams(variant: PlanVariant) {
  return () =>
    getPlan(variant).phases.flatMap((p) => p.steps.map((s) => ({ phase: p.id, step: s.id })))
}

export function costStaticParams(variant: PlanVariant) {
  return () => {
    const plan = getPlan(variant)
    return plan.phases.flatMap((p) =>
      p.steps.flatMap((s) =>
        plan.costsForStep(s.id).map((c) => ({ phase: p.id, step: s.id, cost: c.id })),
      ),
    )
  }
}

export async function loadStep(variant: PlanVariant, params: StepParams) {
  const plan = getPlan(variant)
  const { phase: phaseId, step: stepId } = await params
  const phase = plan.phases.find((p) => p.id === phaseId)
  const step = phase?.steps.find((s) => s.id === stepId)
  if (!phase || !step) notFound()
  const flat = plan.nav.flatMap((p) => p.steps)
  const idx = flat.findIndex((s) => s.id === stepId)
  return {
    plan,
    phase,
    step,
    number: plan.stepNumber[stepId],
    prev: flat[idx - 1],
    next: flat[idx + 1],
  }
}
