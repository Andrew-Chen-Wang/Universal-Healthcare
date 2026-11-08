/**
 * One country's approach to a problem: what it does and what happened (the
 * path precedent), what that kind of approach fixes and what it creates or
 * worsens, the site plan's decision on it, and whether it fits the reader's
 * plan (a client badge inside FitProvider).
 */
import { Fit, type FitPath } from "@website/components/site/fit"
import { Sources } from "@website/components/site/ui"
import type { CountryApproach } from "@website/content/countries"
import { effectsOf } from "@website/content/graph"
import {
  conflictsOf,
  DECISION_BY_PATH,
  PATH_BY_ID,
  pathsFor,
  type SolutionPath,
} from "@website/content/paths"
import { PROBLEM_BY_ID } from "@website/content/problems"
import Link from "next/link"

export function fitPath(p: SolutionPath): FitPath {
  const conflicts = conflictsOf(p.id).map((x) => x.id)
  const requires = p.requires ?? []
  const siblings = pathsFor(p.problemId)
    .filter((x) => x.id !== p.id && x.role !== "keeps")
    .map((x) => x.id)
  const titles = Object.fromEntries(
    [...conflicts, ...requires, ...siblings].map((id) => [id, PATH_BY_ID[id]?.title ?? id]),
  )
  return { id: p.id, conflicts, requires, siblings, titles }
}

function Effects({
  label,
  items,
}: {
  label: string
  items: { title: string; problemId?: string }[]
}) {
  if (!items.length) return null
  return (
    <div>
      <span className="font-medium text-foreground/85">{label}: </span>
      {items.map((e, i) => (
        <span key={e.title}>
          {i > 0 && "; "}
          {e.problemId ? (
            <Link href={`/problems/${e.problemId}`} className="hover:underline">
              {e.title}
            </Link>
          ) : (
            e.title
          )}
        </span>
      ))}
    </div>
  )
}

export function CountryApproachCard({
  a,
  showProblem = true,
  showPlace = false,
}: {
  a: CountryApproach
  showProblem?: boolean
  /** Show the precedent's own label, e.g. "Canada (Ontario)". */
  showPlace?: boolean
}) {
  const p = a.path
  const fx = effectsOf(p)
  const d = DECISION_BY_PATH[p.id]
  return (
    <article className="rounded-md border border-rule bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <Link href={`/paths/${p.id}`} className="font-medium hover:underline">
            {p.title}
          </Link>
          {showProblem && (
            <div className="text-xs text-muted-foreground">
              For{" "}
              <Link href={`/problems/${p.problemId}`} className="hover:underline">
                {PROBLEM_BY_ID[p.problemId]?.title}
              </Link>
            </div>
          )}
        </div>
        <Fit path={fitPath(p)} />
      </div>
      <p className="mt-2 text-sm leading-relaxed">
        {showPlace && <span className="font-medium">{a.place}: </span>}
        {a.note}
      </p>
      <div className="mt-3 space-y-1 text-xs text-foreground/75">
        <Effects label="This approach fixes" items={fx.fixes} />
        <Effects label="Issues it creates or worsens" items={fx.harms} />
        {d && (
          <div>
            <span className="font-medium text-foreground/85">
              {d.status === "chosen" ? "In the site's plan" : "Not in the site's plan"}:{" "}
            </span>
            {d.reason}
          </div>
        )}
      </div>
      <Sources ids={a.sourceIds} />
    </article>
  )
}
