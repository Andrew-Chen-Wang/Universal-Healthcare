"use client"
/** Reader-facing plan builder: one step at a time (a starting point, then each problem category,
 * then a review), with a pinned summary of what the picks cost and cover. Picks live in
 * localStorage; a reader with nothing saved starts from the site's plan. */
import { Button } from "@website/components/ui/button"
import { cn } from "@website/lib/utils"
import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import { fmt } from "@website/content/model"
import { usePicks } from "@website/lib/picks"
import { costFor, PRICED_PATHS } from "./cost"
import { coverageFor, type Pop, type Status } from "./coverage"

/** One effect or group; `href` is set when it has its own page. */
export type Item = { text: string; href?: string }
export type BuilderProblem = { id: string; title: string; category: string; derived: boolean }
export type BuilderPath = {
  id: string
  problemId: string
  title: string
  summary: string
  fixes: Item[]
  harms: Item[]
  gains: Item[]
  loses: Item[]
  changes: string[]
  requires: string[]
  conflicts: string[]
  spawns: string[]
  /** 0 = keeps current law … 3 = major change (see paths/scale.ts). */
  scale: number
  scaleLabel: string
}
/** A whole approach the reader can start from (see content/approaches.ts). */
export type Preset = { id: string; title: string; summary: string; picks: string[] }

/** One screen of the builder: where to start, one problem category, new problems, or the review. */
type Step =
  | { id: "start"; label: string }
  | { id: string; label: string; category: string }
  | { id: "created"; label: string }
  | { id: "review"; label: string }

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

export function PlanBuilder({
  problems,
  paths,
  categories,
  presets,
  defaults,
  pop,
}: {
  problems: BuilderProblem[]
  paths: BuilderPath[]
  categories: string[]
  presets: Preset[]
  /** The site's plan: what a reader with nothing saved starts from. */
  defaults: string[]
  pop: Pop
}) {
  const { picks, loaded, fromDefault, setAll, toggle } = usePicks(defaults)
  const [stepId, setStepId] = useState("start")
  const top = useRef<HTMLDivElement>(null)

  const byId = useMemo(() => Object.fromEntries(paths.map((p) => [p.id, p])), [paths])
  const byProblem = useMemo(() => {
    const m: Record<string, BuilderPath[]> = {}
    for (const p of paths) (m[p.problemId] ??= []).push(p)
    return m
  }, [paths])
  const problemById = useMemo(() => Object.fromEntries(problems.map((p) => [p.id, p])), [problems])

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
  const gains = dedupe(picked.flatMap((p) => p.gains))
  const loses = dedupe(picked.flatMap((p) => p.loses))
  const answeredCount = base.filter((p) => answered(p.id)).length
  const issues = conflicts.length + missing.length + unansweredCreated.length

  const cost = useMemo(() => costFor(picks), [picks])
  const coverage = useMemo(() => coverageFor(picks, pop), [picks, pop])
  const coveredGroups = coverage.filter((r) => r.status === "covered").length
  const gapGroups = coverage.filter((r) => r.status === "gap" || r.status === "open").length
  const limitedGroups = coverage.length - coveredGroups - gapGroups

  const steps: Step[] = [
    { id: "start", label: "Starting point" },
    ...categories
      .filter((c) => base.some((p) => p.category === c))
      .map((c) => ({ id: slugify(c), label: c, category: c })),
    ...(created.length > 0 ? [{ id: "created", label: "New problems" } as Step] : []),
    { id: "review", label: "Review" },
  ]
  const index = Math.max(
    0,
    steps.findIndex((s) => s.id === stepId),
  )
  const step = steps[index]
  const go = (id: string) => {
    setStepId(id)
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const stepDone = (s: Step) => {
    if ("category" in s)
      return base.filter((p) => p.category === s.category).every((p) => answered(p.id))
    if (s.id === "created") return unansweredCreated.length === 0
    return false
  }

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
                  <span
                    className="ml-2 inline-flex gap-0.5 align-middle"
                    title={o.scaleLabel}
                    aria-label={o.scaleLabel}
                  >
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-2 w-1 rounded-[1px]",
                          i <= o.scale ? "bg-primary/70" : "bg-rule",
                        )}
                      />
                    ))}
                  </span>
                </button>
              )
            })}
          </div>
        </td>
      </tr>
    )
  }

  const issueList = issues > 0 && (
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
  )

  return (
    <div ref={top} className="scroll-mt-4 pb-24 lg:pb-0">
      <nav
        aria-label="Steps"
        className="relative -mx-4 mb-6 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
      >
        {steps.map((s, i) => {
          const on = s.id === step.id
          const done = stepDone(s)
          return (
            <button
              key={s.id}
              type="button"
              aria-current={on ? "step" : undefined}
              onClick={() => {
                go(s.id)
              }}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-[13px] whitespace-nowrap transition-colors",
                on
                  ? "border-ink bg-ink text-paper"
                  : done
                    ? "border-gain/30 bg-gain-soft text-gain hover:border-gain"
                    : "border-rule bg-card text-foreground/80 hover:border-primary",
              )}
            >
              {done && !on && <span aria-hidden="true">✓ </span>}
              <span className="sr-only">Step {i + 1}: </span>
              {s.label}
            </button>
          )
        })}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {step.id === "start" && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Where do you want to start?</h2>
              {loaded && fromDefault && (
                <p className="text-sm text-muted-foreground">
                  You&apos;re starting from the site&apos;s plan, a Germany-style hybrid. Change any
                  pick in the steps that follow; your changes stay in this browser.
                </p>
              )}
              <div className="grid gap-2">
                {presets.map((a) => {
                  const on = a.picks.length === picks.size && a.picks.every((id) => picks.has(id))
                  return (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setAll(new Set(a.picks))
                      }}
                      className={cn(
                        "grid gap-1 rounded-md border bg-card p-4 text-left",
                        on
                          ? "border-primary shadow-[inset_3px_0_0_var(--color-primary)]"
                          : "border-rule hover:border-primary/60",
                      )}
                    >
                      <span className="font-medium">{a.title}</span>
                      <span className="text-sm text-muted-foreground">{a.summary}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="ghost"
                  className="h-10"
                  disabled={picks.size === 0}
                  onClick={() => {
                    setAll(new Set())
                  }}
                >
                  Clear all picks
                </Button>
                <Link href="/approaches" className="text-sm underline">
                  Compare these side by side
                </Link>
              </div>
            </section>
          )}

          {"category" in step && (
            <section>
              <h2 className="mb-1 text-xl font-semibold">{step.label}</h2>
              <p className="mb-2 text-sm text-muted-foreground">
                Pick one or more solution paths for each problem. Bars show how much each path
                changes today&apos;s system.
              </p>
              <table className="w-full">
                <tbody>{base.filter((p) => p.category === step.category).map(row)}</tbody>
              </table>
            </section>
          )}

          {step.id === "created" && (
            <section>
              <h2 className="mb-1 text-xl font-semibold">New problems your picks create</h2>
              <p className="mb-2 text-sm text-muted-foreground">
                Each needs its own answer, or the plan has a gap.
              </p>
              <table className="w-full">
                <tbody>{created.map(row)}</tbody>
              </table>
            </section>
          )}

          {step.id === "review" && (
            <section className="space-y-2">
              <CoverageTable picks={picks} pop={pop} />
              <CostPanel picks={picks} />
              {picked.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No solution paths picked yet. Go back to a step and pick some, or start from an
                  approach.
                </p>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">What your picks do</h2>
                  {issueList}
                  <SummaryList
                    title={`What it fixes (${picked.reduce((n, p) => n + p.fixes.length, 0)})`}
                    tone="gain"
                  >
                    {picked.map((p) => (
                      <PathItems key={p.id} path={p} items={p.fixes} />
                    ))}
                  </SummaryList>
                  <SummaryList
                    title={`What it creates or worsens (${picked.reduce((n, p) => n + p.harms.length, 0)})`}
                    tone="loss"
                  >
                    {picked.map((p) => (
                      <PathItems key={p.id} path={p} items={p.harms} />
                    ))}
                  </SummaryList>
                  <SummaryList title={`Who gains (${gains.length})`} tone="gain">
                    <ItemList items={gains} />
                  </SummaryList>
                  <SummaryList title={`Who loses (${loses.length})`} tone="loss">
                    <ItemList items={loses} />
                  </SummaryList>
                  <SummaryList title={`Changes required (${changes.length})`} tone="neutral">
                    {picked.map((p) => (
                      <PathItems
                        key={p.id}
                        path={p}
                        items={p.changes.map((text) => ({ text }))}
                        ordered
                      />
                    ))}
                  </SummaryList>
                </div>
              )}
            </section>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-rule pt-4">
            {index > 0 ? (
              <Button
                variant="outline"
                className="h-10"
                onClick={() => {
                  go(steps[index - 1].id)
                }}
              >
                ← {steps[index - 1].label}
              </Button>
            ) : (
              <span />
            )}
            {index < steps.length - 1 && (
              <Button
                className="h-10"
                onClick={() => {
                  go(steps[index + 1].id)
                }}
              >
                {steps[index + 1].label} →
              </Button>
            )}
          </div>
        </div>

        <aside
          aria-label="Your plan so far"
          className="hidden lg:sticky lg:top-4 lg:block lg:self-start"
        >
          <div className="space-y-4 rounded-md border border-rule bg-card p-5 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Your plan so far
            </div>
            <div>
              <div className="font-serif text-3xl leading-none font-semibold tabular-nums">
                {fmt(cost.nationalAfter)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                national health spending a year
              </div>
              <div
                className={cn(
                  "mt-1 text-sm font-medium tabular-nums",
                  cost.delta < 0
                    ? "text-gain"
                    : cost.delta > 0
                      ? "text-loss"
                      : "text-muted-foreground",
                )}
              >
                {fmt(cost.delta, { sign: true })} against today
              </div>
            </div>
            {cost.federalAfter !== undefined && cost.federalBefore !== undefined && (
              <div className="text-sm">
                <div className="text-xs text-muted-foreground">Federal health spending</div>
                <div className="tabular-nums">
                  {fmt(cost.federalAfter - cost.federalBefore, { sign: true })} a year
                </div>
              </div>
            )}
            <div className="text-sm">
              <div className="text-xs text-muted-foreground">Coverage</div>
              <div>
                {coveredGroups} of {coverage.length} groups covered
                {limitedGroups > 0 && (
                  <span className="text-muted-foreground">
                    ; {limitedGroups} with limits (partial, waiting period, emergency only, or a
                    separate system)
                  </span>
                )}
                {gapGroups > 0 && (
                  <span className="text-loss">; {gapGroups} not addressed or undecided</span>
                )}
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Problems answered</dt>
                <dd className="tabular-nums">
                  {answeredCount}/{base.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Issues</dt>
                <dd className={cn("tabular-nums", issues ? "text-loss" : "text-gain")}>{issues}</dd>
              </div>
            </dl>
            {issueList}
            {step.id !== "review" && (
              <Button
                variant="outline"
                className="h-10 w-full"
                onClick={() => {
                  go("review")
                }}
              >
                See the full review
              </Button>
            )}
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-rule bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex items-center gap-4 text-sm">
          <span className="tabular-nums">
            <strong>{fmt(cost.nationalAfter)}</strong>{" "}
            <span className={cost.delta < 0 ? "text-gain" : cost.delta > 0 ? "text-loss" : ""}>
              ({fmt(cost.delta, { sign: true })})
            </span>
          </span>
          <span className={issues ? "text-loss" : "text-gain"}>
            <strong className="tabular-nums">{issues}</strong> issues
          </span>
          {step.id !== "review" && (
            <button
              type="button"
              onClick={() => {
                go("review")
              }}
              className="ml-auto font-medium text-primary underline"
            >
              Review
            </button>
          )}
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
  items: Item[]
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
          <li key={i.text}>
            <ItemText item={i} />
          </li>
        ))}
      </List>
    </div>
  )
}

function ItemText({ item }: { item: Item }) {
  return item.href ? (
    <Link
      href={item.href}
      className="underline decoration-rule underline-offset-2 hover:text-primary"
    >
      {item.text}
    </Link>
  ) : (
    <>{item.text}</>
  )
}

function ItemList({ items }: { items: Item[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((i) => (
        <li key={i.href ?? i.text}>
          <ItemText item={i} />
        </li>
      ))}
    </ul>
  )
}

/** Same group or effect from several paths counts once. */
function dedupe(items: Item[]): Item[] {
  return [...new Map(items.map((i) => [i.href ?? i.text, i])).values()]
}

const STATUS: Record<Status, { label: string; className: string }> = {
  covered: { label: "Covered", className: "bg-gain-soft text-gain" },
  partial: { label: "Partly covered", className: "bg-caution-soft text-caution" },
  waiting: { label: "Waiting period", className: "bg-caution-soft text-caution" },
  emergency: { label: "Emergency care only", className: "bg-loss-soft text-loss" },
  separate: { label: "Separate system", className: "bg-secondary text-foreground/75" },
  gap: { label: "Not addressed", className: "bg-loss-soft text-loss" },
  open: { label: "Undecided", className: "bg-secondary text-foreground/75" },
}

function millions(n: number) {
  return n >= 10 ? n.toFixed(0) : n >= 1 ? n.toFixed(1) : n.toFixed(2)
}

function CoverageTable({ picks, pop }: { picks: Set<string>; pop: Pop }) {
  const rows = coverageFor(picks, pop)
  return (
    <section className="mb-10" aria-labelledby="coverage-heading">
      <h2 id="coverage-heading" className="mb-1 text-lg font-semibold">
        Who your plan covers
      </h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Counts in millions, from different surveys and years (see{" "}
        <Link href="/inputs" className="underline">
          inputs
        </Link>
        ), so they are not summed. U.S. resident population: {millions(pop.residentPop2025)}{" "}
        million.
      </p>
      <div className="overflow-x-auto rounded-md border border-rule bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-xs tracking-wide text-muted-foreground uppercase">
              <th scope="col" className="px-4 py-2 font-medium">
                Group
              </th>
              <th scope="col" className="px-4 py-2 text-right font-medium">
                Millions
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Why
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-rule align-top">
                <th scope="row" className="px-4 py-2 font-medium">
                  {r.label}
                </th>
                <td className="px-4 py-2 text-right font-mono whitespace-nowrap">
                  {Array.isArray(r.count)
                    ? `${millions(r.count[0])}–${millions(r.count[1])}`
                    : millions(r.count)}
                  {r.per === "year" && <span className="text-muted-foreground"> /yr</span>}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={cn(
                      "inline-block rounded-sm px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                      STATUS[r.status].className,
                    )}
                  >
                    {STATUS[r.status].label}
                  </span>
                </td>
                <td className="px-4 py-2 text-foreground/80">{r.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function usdPerPerson(dollars: number) {
  return `$${Math.round(dollars).toLocaleString("en-US")}`
}

function CostPanel({ picks }: { picks: Set<string> }) {
  const cost = useMemo(() => costFor(picks), [picks])
  const unpriced = [...picks].filter(
    (id) => !PRICED_PATHS.has(id) && !id.startsWith("keep-"),
  ).length
  return (
    <section className="mb-10" aria-labelledby="cost-heading">
      <h2 id="cost-heading" className="mb-1 text-lg font-semibold">
        What your plan costs
      </h2>
      <p className="mb-3 text-sm text-muted-foreground">
        2024 dollars, steady state, as if your plan had been fully in place in 2024.{" "}
        {cost.kind === "single-payer" ? (
          <>
            Same method as the{" "}
            <Link href="/costs" className="underline">
              cost ledger
            </Link>
            .
          </>
        ) : (
          "Without a single payer, each change is priced as a line on top of today's spending, with the same rates and prices the single-payer model uses."
        )}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CostStat
          label="National health spending"
          value={fmt(cost.nationalAfter)}
          sub={`${fmt(cost.delta, { sign: true })} (${(cost.deltaPct * 100).toFixed(1)}%) vs ${fmt(cost.nationalBefore)} today`}
        />
        <CostStat
          label="Per person"
          value={usdPerPerson(cost.perCapitaAfter)}
          sub={`vs ${usdPerPerson(cost.perCapitaBefore)} today`}
        />
        {cost.federalAfter !== undefined && cost.federalBefore !== undefined && (
          <CostStat
            label="Federal health spending"
            value={fmt(cost.federalAfter)}
            sub={`vs ${fmt(cost.federalBefore)} today`}
          />
        )}
        {cost.gap !== undefined && (
          <CostStat
            label={cost.gap >= 0 ? "Still to fund (general revenue)" : "Surplus over named taxes"}
            value={fmt(Math.abs(cost.gap))}
            sub={
              cost.kind === "single-payer"
                ? "After the plan's payroll tax, household premium, and redirected spending"
                : cost.gap === undefined
                  ? ""
                  : "New federal cost minus the top-end taxes you picked"
            }
            tone={cost.gap > 0 ? "loss" : "gain"}
          />
        )}
      </div>
      <ul className="mt-4 space-y-1 text-sm">
        {cost.rules.map((r) => (
          <li key={r.label} className="flex gap-2">
            <span className={cn("font-medium", r.central ? "text-gain" : "text-caution")}>
              {r.label}:
            </span>
            <span className="text-foreground/80">{r.effect}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted-foreground">
        {unpriced} of your picks have no cost input in the model (for example antitrust, staffing,
        or privacy rules); their trade-offs are described, not priced.{" "}
        {cost.kind === "single-payer"
          ? "Coverage scope (immigrants, territories) is not yet reflected in the total."
          : cost.noNewTaxBelow
            ? `No household with income below $${cost.noNewTaxBelow.toLocaleString("en-US")} pays a new tax: the only new taxes are on income above it. The federal figure counts new subsidies and benefits; employers' and households' premium savings aren't in it.`
            : "Pick how to pay for it (for example, a progressive income tax) to see the funding gap."}
      </p>
    </section>
  )
}

function CostStat({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string
  sub: string
  tone?: "gain" | "loss"
}) {
  return (
    <div className="rounded-md border border-rule bg-card p-4">
      <div className="text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div
        className={cn(
          "mt-1 font-mono text-2xl",
          tone === "gain" && "text-gain",
          tone === "loss" && "text-loss",
        )}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  )
}
