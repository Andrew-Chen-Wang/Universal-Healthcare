import { Page, PageHeader } from "@website/components/site/ui"
import { v } from "@website/content/constants"
import { type Effect, effectsOf, type Impact, impactsOf } from "@website/content/graph"
import { CHOSEN, conflictsOf, PATHS } from "@website/content/paths"
import { PROBLEM_CATEGORIES, PROBLEMS, SIDE_EFFECT_CATEGORIES } from "@website/content/problems"
import type { Metadata } from "next"
import type { Pop } from "./coverage"
import { PlanBuilder, type BuilderPath, type BuilderProblem, type Item } from "./plan-builder"

const effectItem = (e: Effect): Item => ({
  text: e.problemId && e.note ? `${e.title}: ${e.note}` : e.title,
  href: e.problemId && `/problems/${e.problemId}`,
})
const impactItem = (i: Impact): Item => ({
  text: i.label,
  href: i.group && `/groups/${i.group.id}`,
})

export const metadata: Metadata = {
  title: "Build your plan",
  description:
    "Pick a solution path for each problem and see the combined trade-offs, required changes, and conflicts.",
}

const POP_IDS = [
  "residentPop2025",
  "usBornCitizens",
  "naturalizedCitizens",
  "lawfulPermanentResidents",
  "nonimmigrantResidents",
  "unauthorizedHigh",
  "unauthorizedLow",
  "newLprArrivals",
  "visitorArrivals",
  "uninsuredToday",
  "mandateRepealUninsured2027",
  "tricareActiveFamilies",
  "vaEnrolled",
  "ihsServed",
  "incarcerated",
  "puertoRicoPop",
  "otherTerritoriesPop",
] as const

export default function YourPlanPage() {
  const problems: BuilderProblem[] = PROBLEMS.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    derived: SIDE_EFFECT_CATEGORIES.includes(p.category),
  }))
  const paths: BuilderPath[] = PATHS.map((p) => ({
    id: p.id,
    problemId: p.problemId,
    title: p.title,
    summary: p.summary,
    fixes: effectsOf(p).fixes.map(effectItem),
    harms: effectsOf(p).harms.map(effectItem),
    gains: impactsOf(p).gains.map(impactItem),
    loses: impactsOf(p).loses.map(impactItem),
    changes: p.changes ?? [],
    requires: p.requires ?? [],
    conflicts: conflictsOf(p.id).map((x) => x.id),
    spawns: p.spawns ?? [],
  }))
  return (
    <Page>
      <PageHeader
        eyebrow="Part 1 · Decisions"
        title="Build your plan"
        lede="Pick one or more solution paths for each problem. The summary combines what they fix, what they create or worsen, who gains and who loses, the concrete changes they need, and any conflicts or new problems your picks create. Your picks stay in this browser."
      />
      <PlanBuilder
        problems={problems}
        paths={paths}
        categories={PROBLEM_CATEGORIES.filter((c) => !SIDE_EFFECT_CATEGORIES.includes(c))}
        draft={CHOSEN.map((p) => p.id)}
        pop={Object.fromEntries(POP_IDS.map((id) => [id, v(id)])) as Pop}
      />
    </Page>
  )
}
