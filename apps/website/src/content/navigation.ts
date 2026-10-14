import { costsForStep } from "./calculations"
import { COST_CATEGORIES, INVENTORY } from "./cost-inventory"
import { PROBLEM_CATEGORIES, PROBLEMS } from "./problems"
import { pathsFor } from "./paths"
import { CHANGES } from "./changes"
import { PHASES, STEP_BY_ID } from "./plan"
import { STEP_EXTRAS } from "./step-extras"
import { TASK_TRADEOFFS } from "./task-tradeoffs"

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

for (const p of PHASES) {
  for (const s of p.steps) {
    const t = TASK_TRADEOFFS[s.id]
    if (!t || t.length !== s.tasks.length) {
      throw new Error(
        `Task trade-offs for ${s.id}: ${t?.length ?? 0} entries, ${s.tasks.length} tasks`,
      )
    }
  }
}

export function taskHref(stepId: string, n: number) {
  return `${stepHref(stepId, "tasks")}/${n}`
}

export const slug = (x: string) =>
  x
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

export type SideItem = {
  id: string
  label: string
  href: string
  number?: string
  children?: SideItem[]
}
export type SideGroup = { id: string; title: string; href?: string; items: SideItem[] }
export type SidePart = { id: string; title: string; href: string; groups: SideGroup[] }

export const SIDEBAR: SidePart[] = [
  {
    id: "problems",
    title: "Part 1 · Problems",
    href: "/problems",
    groups: PROBLEM_CATEGORIES.map((c) => ({
      id: `p-${slug(c)}`,
      title: c,
      href: `/problems#${slug(c)}`,
      items: PROBLEMS.filter((p) => p.category === c).map((p) => ({
        id: p.id,
        label: p.title,
        href: `/problems/${p.id}`,
        children: pathsFor(p.id).map((x) => ({ id: x.id, label: x.title, href: `/paths/${x.id}` })),
      })),
    })),
  },
  {
    id: "paths",
    title: "Part 1 · Decide solution paths",
    href: "/paths",
    groups: [
      {
        id: "decide",
        title: "Decisions",
        href: "/paths",
        items: [
          { id: "tree", label: "Decision tree", href: "/paths" },
          { id: "approaches", label: "Compare approaches", href: "/approaches" },
          { id: "your-plan", label: "Build your plan", href: "/your-plan" },
          { id: "groups", label: "Who's affected", href: "/groups" },
          { id: "ledger", label: "Review ledger (draft picks)", href: "/paths/ledger" },
        ],
      },
    ],
  },
  {
    id: "costs",
    title: "Part 1 · Costs",
    href: "/costs",
    groups: COST_CATEGORIES.map((c) => ({
      id: `c-${slug(c)}`,
      title: c,
      href: `/costs#${slug(c)}`,
      items: INVENTORY.filter((i) => i.category === c).map((i) => ({
        id: i.id,
        label: i.label,
        href: `/costs/${i.id}`,
      })),
    })),
  },
  {
    id: "changes",
    title: "Part 2 · Changes by phase",
    href: "/plan",
    groups: [
      {
        id: "all-changes",
        title: "All changes from chosen paths",
        href: "/changes",
        items: [{ id: "changes", label: "Changes by phase", href: "/changes" }],
      },
      ...NAV.map((p) => ({
        id: `ph-${p.id}`,
        title: `${p.number}. ${p.title}`,
        href: p.href,
        items: p.steps.map((s) => ({
          id: s.id,
          label: s.title,
          number: s.number,
          href: s.href,
          children: s.sections.map((sec) => ({
            id: `${s.id}-${sec.id}`,
            label: sec.label,
            href: sec.href,
          })),
        })),
      })),
    ],
  },
]
