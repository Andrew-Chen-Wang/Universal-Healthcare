/**
 * Part 2 exists in two versions: the current hybrid draft (at /plan) and the
 * earlier single-payer draft (at /single-payer/plan). A PlanBundle holds one
 * version's phases, system changes, costs, step extras, design decisions,
 * trade-offs, and risks, plus the links between its pages, so the same page
 * components render either version.
 */
import type { CostItem } from "./calculations"
import type { SystemChange } from "./changes"
import type { Risk } from "./risks"
import type { StepExtras } from "./step-extras"
import type { Decision as DesignDecision, Phase, Step, TradeoffDimension } from "./types"

export type PlanVariant = "hybrid" | "single-payer"

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

export type PlanStep = Step & { phase: Phase }

export type PlanData = {
  variant: PlanVariant
  /** Short name, e.g. "Germany-style hybrid". */
  name: string
  /** URL prefix for this version's Part 2 pages. */
  base: string
  phases: Phase[]
  changes: SystemChange[]
  costItems: CostItem[]
  extras: Record<string, StepExtras>
  taskTradeoffs: Record<string, string[]>
  designDecisions: DesignDecision[]
  risks: Risk[]
  tradeoffs: TradeoffDimension[]
}

export type PlanBundle = PlanData & {
  allSteps: PlanStep[]
  stepById: Record<string, PlanStep>
  costById: Record<string, CostItem>
  costsForStep: (stepId: string) => CostItem[]
  sectionsForStep: (stepId: string) => SectionId[]
  stepHref: (stepId: string, section?: SectionId) => string
  costHref: (stepId: string, costId: string) => string
  taskHref: (stepId: string, n: number) => string
  nav: NavPhase[]
  stepNumber: Record<string, string>
}

export function makeBundle(d: PlanData): PlanBundle {
  const allSteps: PlanStep[] = d.phases.flatMap((phase) =>
    phase.steps.map((s) => ({ ...s, phase })),
  )
  const stepById = Object.fromEntries(allSteps.map((s) => [s.id, s]))
  const costById = Object.fromEntries(d.costItems.map((c) => [c.id, c]))
  const costsForStep = (stepId: string) => d.costItems.filter((c) => c.stepId === stepId)

  const stepHref = (stepId: string, section: SectionId = "") => {
    const step = stepById[stepId]
    if (!step) throw new Error(`${d.variant} plan: unknown step ${stepId}`)
    return `${d.base}/${step.phase.id}/${stepId}${section ? `/${section}` : ""}`
  }
  const costHref = (stepId: string, costId: string) => `${stepHref(stepId, "costs")}/${costId}`
  const taskHref = (stepId: string, n: number) => `${stepHref(stepId, "tasks")}/${n}`

  const sectionsForStep = (stepId: string): SectionId[] => {
    const step = stepById[stepId]
    const extras = d.extras[stepId]
    const out: SectionId[] = ["", "tasks"]
    if (extras?.decisionIds?.length) out.push("design")
    if (costsForStep(stepId).length || step.cost.oneTime || step.cost.recurring) out.push("costs")
    out.push("tradeoffs", "risks")
    if (d.changes.some((c) => c.stepId === stepId)) out.push("changes")
    if (extras?.international.length || step.precedent.length) out.push("international")
    return out
  }

  const nav: NavPhase[] = d.phases.map((p) => ({
    id: p.id,
    number: p.number,
    title: p.title,
    window: p.window,
    href: `${d.base}/${p.id}`,
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
  const stepNumber = Object.fromEntries(nav.flatMap((p) => p.steps.map((s) => [s.id, s.number])))

  // Every link inside a plan version must resolve within that version.
  const errors: string[] = []
  for (const s of allSteps) {
    const t = d.taskTradeoffs[s.id]
    if (!t || t.length !== s.tasks.length)
      errors.push(`task trade-offs for ${s.id}: ${t?.length ?? 0} entries, ${s.tasks.length} tasks`)
    for (const dep of s.dependsOn) if (!stepById[dep]) errors.push(`${s.id} depends on ${dep}`)
  }
  for (const c of d.changes) {
    if (!stepById[c.stepId]) errors.push(`change ${c.id}: unknown step ${c.stepId}`)
    for (const id of c.costIds ?? []) if (!costById[id]) errors.push(`change ${c.id}: cost ${id}`)
  }
  for (const c of d.costItems) if (!stepById[c.stepId]) errors.push(`cost ${c.id}: ${c.stepId}`)
  for (const [stepId, e] of Object.entries(d.extras)) {
    if (!stepById[stepId]) errors.push(`extras for unknown step ${stepId}`)
    for (const id of e.decisionIds ?? [])
      if (!d.designDecisions.some((x) => x.id === id)) errors.push(`${stepId}: decision ${id}`)
    for (const id of e.tradeoffIds ?? [])
      if (!d.tradeoffs.some((x) => x.id === id)) errors.push(`${stepId}: trade-off ${id}`)
    for (const id of e.riskIds ?? [])
      if (!d.risks.some((x) => x.id === id)) errors.push(`${stepId}: risk ${id}`)
  }
  if (errors.length) throw new Error(`${d.variant} plan validation failed:\n${errors.join("\n")}`)

  return {
    ...d,
    allSteps,
    stepById,
    costById,
    costsForStep,
    sectionsForStep,
    stepHref,
    costHref,
    taskHref,
    nav,
    stepNumber,
  }
}
