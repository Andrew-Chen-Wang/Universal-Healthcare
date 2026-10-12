import { costsForStep } from "./calculations"
import { CHANGES } from "./changes"
import { PHASES, STEP_BY_ID } from "./plan"
import { STEP_EXTRAS } from "./step-extras"

export type SectionId =
  | ""
  | "tasks"
  | "design"
  | "costs"
  | "tradeoffs"
  | "risks"
  | "changes"
  | "international"

export const SECTION_LABELS: Record<SectionId, string> = {
  "": "Overview",
  tasks: "Tasks",
  design: "Design choice & alternatives",
  costs: "Costs & calculations",
  tradeoffs: "Trade-offs",
  risks: "Risks",
  changes: "What changes in the system",
  international: "Other countries",
}

export function stepHref(stepId: string, section: SectionId = "") {
  const step = STEP_BY_ID[stepId]
  if (!step) throw new Error(`Unknown step ${stepId}`)
  return `/plan/${step.phase.id}/${stepId}${section ? `/${section}` : ""}`
}

export function costHref(stepId: string, costId: string) {
  return `${stepHref(stepId, "costs")}/${costId}`
}

/** Sections that have content for a step, in display order. */
export function sectionsForStep(stepId: string): SectionId[] {
  const step = STEP_BY_ID[stepId]
  const extras = STEP_EXTRAS[stepId]
  const out: SectionId[] = ["", "tasks"]
  if (extras?.decisionIds?.length) out.push("design")
  if (costsForStep(stepId).length || step.cost.oneTime || step.cost.recurring) out.push("costs")
  out.push("tradeoffs")
  out.push("risks")
  if (CHANGES.some((c) => c.stepId === stepId)) out.push("changes")
  if (extras?.international.length || step.precedent.length) out.push("international")
  return out
}

export type NavStep = {
  id: string
  number: string
  title: string
  href: string
  sections: { id: SectionId; label: string; href: string }[]
}
export type NavPhase = {
  id: string
  number: number
  title: string
  window: string
  href: string
  steps: NavStep[]
}

export const NAV: NavPhase[] = PHASES.map((p) => ({
  id: p.id,
  number: p.number,
  title: p.title,
  window: p.window,
  href: `/plan/${p.id}`,
  steps: p.steps.map((s, i) => ({
    id: s.id,
    number: `${p.number}.${i + 1}`,
    title: s.title,
    href: stepHref(s.id),
    sections: sectionsForStep(s.id).map((sec) => ({
      id: sec,
      label: SECTION_LABELS[sec],
      href: stepHref(s.id, sec),
    })),
  })),
}))

export const STEP_NUMBER = Object.fromEntries(
  NAV.flatMap((p) => p.steps.map((s) => [s.id, s.number])),
)
