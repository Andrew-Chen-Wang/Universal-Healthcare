/** TEMPORARY: owner review page for draft decisions. Remove once the review is folded in. */
import { Page, PageHeader } from "@website/components/site/ui"
import {
  conflictsOf,
  DRAFT_DECISIONS,
  PATH_BY_ID,
  PATH_ERRORS,
  REVIEW_OVERRIDES,
} from "@website/content/paths"
import { PHASES } from "@website/content/plan"
import { PROBLEM_BY_ID } from "@website/content/problems"
import type { Metadata } from "next"
import { ReviewBoard, type ReviewRow } from "./review-board"

export const metadata: Metadata = { title: "Review picks (temporary)", robots: { index: false } }
export const dynamic = "force-dynamic"

export default function ReviewPage() {
  const rows: ReviewRow[] = DRAFT_DECISIONS.map((d) => {
    const p = PATH_BY_ID[d.pathId]
    const title = (id: string) => PATH_BY_ID[id]?.title ?? id
    return {
      id: d.pathId,
      title: p.title,
      summary: p.summary,
      problemId: p.problemId,
      problemTitle: PROBLEM_BY_ID[p.problemId]?.title ?? p.problemId,
      status: d.status,
      phase: d.phase ?? null,
      confidence: d.confidence,
      reason: d.reason,
      review: d.review ?? null,
      requires: (p.requires ?? []).map(title),
      conflicts: conflictsOf(p.id).map((x) => x.title),
      creates: (p.spawns ?? []).map((id) => PROBLEM_BY_ID[id]?.title ?? id),
    }
  })
  return (
    <Page>
      <PageHeader
        eyebrow="Part 1 · Decisions · temporary"
        title="Review picks"
        lede="Set each path to chosen or rejected, pick its phase, add a note, and mark it reviewed. Every edit saves to content/paths/review-overrides.json while the dev server runs; Claude folds the file into decisions.ts when you're done."
      />
      <ReviewBoard
        rows={rows}
        initial={REVIEW_OVERRIDES}
        errors={PATH_ERRORS}
        phases={PHASES.map((p) => ({ id: p.id, label: `${p.number}. ${p.title}` }))}
        canSave={process.env.NODE_ENV === "development"}
      />
    </Page>
  )
}
