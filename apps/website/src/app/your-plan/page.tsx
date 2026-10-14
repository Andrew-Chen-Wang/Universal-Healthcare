import { real } from "@website/components/site/paths"
import { Page, PageHeader } from "@website/components/site/ui"
import { CHOSEN, conflictsOf, PATHS } from "@website/content/paths"
import { PROBLEM_CATEGORIES, PROBLEMS } from "@website/content/problems"
import type { Metadata } from "next"
import { PlanBuilder, type BuilderPath, type BuilderProblem } from "./plan-builder"

export const metadata: Metadata = {
  title: "Build your plan",
  description:
    "Pick a solution path for each problem and see the combined trade-offs, required changes, and conflicts.",
}

const DERIVED = "Problems created by solution paths"

export default function YourPlanPage() {
  const problems: BuilderProblem[] = PROBLEMS.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    derived: p.category === DERIVED,
  }))
  const paths: BuilderPath[] = PATHS.map((p) => ({
    id: p.id,
    problemId: p.problemId,
    title: p.title,
    summary: p.summary,
    pros: real(p.pros),
    cons: real(p.cons),
    whoGains: real(p.whoGains),
    whoLoses: real(p.whoLoses),
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
        lede="Pick one or more solution paths for each problem. The summary combines their pros and drawbacks, who gains and who loses, the concrete changes they need, and any conflicts or new problems your picks create. Your picks stay in this browser."
      />
      <PlanBuilder
        problems={problems}
        paths={paths}
        categories={PROBLEM_CATEGORIES.filter((c) => c !== DERIVED)}
        draft={CHOSEN.map((p) => p.id)}
      />
    </Page>
  )
}
