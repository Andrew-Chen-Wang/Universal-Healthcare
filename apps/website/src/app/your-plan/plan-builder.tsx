"use client"
/** Reader-facing plan builder: pick paths, see combined trade-offs. Picks live in localStorage. */
import { Button } from "@website/components/ui/button"
import { cn } from "@website/lib/utils"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

export type BuilderProblem = { id: string; title: string; category: string; derived: boolean }
export type BuilderPath = {
  id: string
  problemId: string
  title: string
  summary: string
  pros: string[]
  cons: string[]
  whoGains: string[]
  whoLoses: string[]
  changes: string[]
  requires: string[]
  conflicts: string[]
  spawns: string[]
}

const STORAGE_KEY = "universal.build.picks.v1"

function loadPicks(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []
  } catch {
    return []
  }
}

function storePicks(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Storage unavailable (private mode); picks last for this visit only.
  }
}

export function PlanBuilder({
  problems,
  paths,
  categories,
  draft,
}: {
  problems: BuilderProblem[]
  paths: BuilderPath[]
  categories: string[]
  draft: string[]
}) {
  const [picks, setPicks] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setPicks(new Set(loadPicks()))
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) storePicks([...picks])
  }, [picks, loaded])

  const byId = useMemo(() => Object.fromEntries(paths.map((p) => [p.id, p])), [paths])
  const byProblem = useMemo(() => {
    const m: Record<string, BuilderPath[]> = {}
    for (const p of paths) (m[p.problemId] ??= []).push(p)
    return m
  }, [paths])
  const problemById = useMemo(() => Object.fromEntries(problems.map((p) => [p.id, p])), [problems])

  const toggle = (id: string) => {
    setPicks((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const picked = paths.filter((p) => picks.has(p.id))
  const answered = (problemId: string) => (byProblem[problemId] ?? []).some((p) => picks.has(p.id))
  const base = problems.filter((p) => !p.derived)
  const created = [...new Set(picked.flatMap((p) => p.spawns))]
    .map((id) => problemById[id])
    .filter(Boolean)
  const unansweredCreated = created.filter((p) => !answered(p.id))

  const conflicts: [BuilderPath, BuilderPath][] = []
  for (const p of picked)
    for (const c of p.conflicts) if (picks.has(c) && p.id < c) conflicts.push([p, byId[c]])
  const missing = picked.flatMap((p) =>
    p.requires.filter((r) => !picks.has(r)).map((r) => [p, byId[r]] as const),
  )
  const changes = picked.flatMap((p) => p.changes.map((c) => ({ path: p, text: c })))
  const gains = [...new Set(picked.flatMap((p) => p.whoGains))]
  const loses = [...new Set(picked.flatMap((p) => p.whoLoses))]
  const answeredCount = base.filter((p) => answered(p.id)).length
  const issues = conflicts.length + missing.length + unansweredCreated.length

  const row = (pr: BuilderProblem) => {
    const options = byProblem[pr.id] ?? []
    return (
      <tr key={pr.id} className="border-t border-rule align-top">
        <th scope="row" className="w-1/3 py-3 pr-4 text-left text-sm font-medium">
          <Link href={`/problems/${pr.id}`} className="hover:text-primary hover:underline">
            {pr.title}
          </Link>
          {!answered(pr.id) && (
            <div className="mt-1 text-xs font-normal text-muted-foreground">No path picked</div>
          )}
        </th>
        <td className="py-3">
          <div className="flex flex-wrap gap-2">
            {options.map((o) => {
              const on = picks.has(o.id)
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  title={o.summary}
                  onClick={() => {
                    toggle(o.id)
                  }}
                  className={cn(
                    "min-h-10 rounded-md border px-3 py-2 text-left text-sm leading-snug",
                    on
                      ? "border-primary bg-accent font-medium text-accent-foreground"
                      : "border-rule bg-card text-foreground/80 hover:border-primary/50",
                  )}
                >
                  {on && <span aria-hidden="true">✓ </span>}
                  {o.title}
                </button>
              )
            })}
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="pb-20 lg:pb-0">
      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="h-11"
          onClick={() => {
            setPicks(new Set(draft))
          }}
        >
          Start from the site&apos;s draft plan
        </Button>
        <Button
          variant="ghost"
          className="h-11"
          disabled={picks.size === 0}
          onClick={() => {
            setPicks(new Set())
          }}
        >
          Clear all picks
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-8">
          {categories.map((cat) => {
            const rows = base.filter((p) => p.category === cat)
            if (!rows.length) return null
            return (
              <section key={cat}>
                <h2 className="mb-2 text-lg font-semibold">{cat}</h2>
                <table className="w-full">
                  <tbody>{rows.map(row)}</tbody>
                </table>
              </section>
            )
          })}
          {created.length > 0 && (
            <section>
              <h2 className="mb-1 text-lg font-semibold">New problems your picks create</h2>
              <p className="mb-2 text-sm text-muted-foreground">
                Each needs its own answer, or the plan has a gap.
              </p>
              <table className="w-full">
                <tbody>{created.map(row)}</tbody>
              </table>
            </section>
          )}
        </div>

        <aside id="summary" aria-label="Your plan" className="lg:sticky lg:top-4 lg:self-start">
          <div className="space-y-5 rounded-md border border-rule bg-card p-5 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <h2 className="text-lg font-semibold">Your plan</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Problems answered</dt>
                <dd className="font-mono text-xl">
                  {answeredCount}/{base.length}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Paths picked</dt>
                <dd className="font-mono text-xl">{picked.length}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Changes required</dt>
                <dd className="font-mono text-xl">{changes.length}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Issues</dt>
                <dd className={cn("font-mono text-xl", issues ? "text-loss" : "text-gain")}>
                  {issues}
                </dd>
              </div>
            </dl>

            {issues > 0 && (
              <ul className="space-y-2 rounded-sm bg-loss-soft p-3 text-sm">
                {conflicts.map(([a, b]) => (
                  <li key={`${a.id}-${b.id}`}>
                    <strong>Conflict:</strong> {a.title} / {b.title}
                  </li>
                ))}
                {missing.map(([p, r]) => (
                  <li key={`${p.id}-${r.id}`}>
                    <strong>Missing:</strong> {p.title} needs{" "}
                    <button
                      type="button"
                      className="underline"
                      onClick={() => {
                        toggle(r.id)
                      }}
                    >
                      {r.title}
                    </button>
                  </li>
                ))}
                {unansweredCreated.map((p) => (
                  <li key={p.id}>
                    <strong>Unanswered new problem:</strong> {p.title}
                  </li>
                ))}
              </ul>
            )}

            {picked.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Pick paths in the table, or start from the site&apos;s draft plan.
              </p>
            ) : (
              <>
                <SummaryList
                  title={`Pros (${picked.reduce((n, p) => n + p.pros.length, 0)})`}
                  tone="gain"
                >
                  {picked.map((p) => (
                    <PathItems key={p.id} path={p} items={p.pros} />
                  ))}
                </SummaryList>
                <SummaryList
                  title={`Drawbacks (${picked.reduce((n, p) => n + p.cons.length, 0)})`}
                  tone="loss"
                >
                  {picked.map((p) => (
                    <PathItems key={p.id} path={p} items={p.cons} />
                  ))}
                </SummaryList>
                <SummaryList title={`Who gains (${gains.length})`} tone="gain">
                  <ul className="list-disc space-y-1 pl-5">
                    {gains.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </SummaryList>
                <SummaryList title={`Who loses (${loses.length})`} tone="loss">
                  <ul className="list-disc space-y-1 pl-5">
                    {loses.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </SummaryList>
                <SummaryList title={`Changes required (${changes.length})`} tone="neutral">
                  {picked.map((p) => (
                    <PathItems key={p.id} path={p} items={p.changes} ordered />
                  ))}
                </SummaryList>
              </>
            )}
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-rule bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex items-center gap-4 text-sm">
          <span>
            <strong className="font-mono">{answeredCount}</strong>/{base.length} answered
          </span>
          <span className={issues ? "text-loss" : "text-gain"}>
            <strong className="font-mono">{issues}</strong> issues
          </span>
          <a href="#summary" className="ml-auto font-medium text-primary underline">
            See your plan
          </a>
        </div>
      </div>
    </div>
  )
}

function SummaryList({
  title,
  tone,
  children,
}: {
  title: string
  tone: "gain" | "loss" | "neutral"
  children: React.ReactNode
}) {
  return (
    <details className="group text-sm">
      <summary
        className={cn(
          "cursor-pointer font-semibold",
          tone === "gain" && "text-gain",
          tone === "loss" && "text-loss",
        )}
      >
        {title}
      </summary>
      <div className="mt-2 space-y-3">{children}</div>
    </details>
  )
}

function PathItems({
  path,
  items,
  ordered,
}: {
  path: BuilderPath
  items: string[]
  ordered?: boolean
}) {
  if (!items.length) return null
  const List = ordered ? "ol" : "ul"
  return (
    <div>
      <Link href={`/paths/${path.id}`} className="text-xs font-semibold uppercase hover:underline">
        {path.title}
      </Link>
      <List className={cn("mt-1 space-y-1 pl-5", ordered ? "list-decimal" : "list-disc")}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </List>
    </div>
  )
}
