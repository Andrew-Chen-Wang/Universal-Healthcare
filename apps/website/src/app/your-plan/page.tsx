import { Page, PageHeader } from "@website/components/site/ui"
import { type Effect, effectsOf, type Impact, impactsOf } from "@website/content/graph"
import { APPROACHES } from "@website/content/approaches"
import { CHOSEN, conflictsOf, PATHS, SCALE_LABEL, SCALE_RANK } from "@website/content/paths"
import { PROBLEM_CATEGORIES, PROBLEMS, SIDE_EFFECT_CATEGORIES } from "@website/content/problems"
import type { Metadata } from "next"
import { popFromConstants } from "./coverage"
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
    scale: SCALE_RANK[p.scale],
    scaleLabel: SCALE_LABEL[p.scale],
  }))
  return (
    <Page>
      <PageHeader
        eyebrow="What changes for you"
        title="Build your plan"
        lede="Pick a solution path for each problem, one area at a time, and watch what your plan costs and who it covers. It starts from the site's plan; your picks stay in this browser."
      />
      <PlanBuilder
        problems={problems}
        paths={paths}
        categories={PROBLEM_CATEGORIES.filter((c) => !SIDE_EFFECT_CATEGORIES.includes(c))}
        presets={APPROACHES.map(({ id, title, summary, picks }) => ({ id, title, summary, picks }))}
        defaults={CHOSEN.map((p) => p.id)}
        pop={popFromConstants()}
      />
    </Page>
  )
}
