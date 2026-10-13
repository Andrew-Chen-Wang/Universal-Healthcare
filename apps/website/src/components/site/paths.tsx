import { Pill } from "@website/components/site/ui"
import type { PathStatus, SolutionPath } from "@website/content/paths"
import { PROBLEM_BY_ID } from "@website/content/problems"
import { cn } from "@website/lib/utils"
import Link from "next/link"

/** Drop "N/A" placeholders so empty lists render as "None identified". */
export function real(items: string[]): string[] {
  return items.filter((i) => !i.startsWith("N/A"))
}

const STATUS: Record<PathStatus, { label: string; tone: "neutral" | "gain" | "loss" }> = {
  open: { label: "Undecided", tone: "neutral" },
  chosen: { label: "Chosen", tone: "gain" },
  rejected: { label: "Rejected", tone: "loss" },
}

export function StatusPill({ status }: { status: PathStatus }) {
  const s = STATUS[status]
  return <Pill tone={s.tone}>{s.label}</Pill>
}

export function ProblemChip({
  id,
  tone = "neutral",
}: {
  id: string
  tone?: "neutral" | "loss" | "gain"
}) {
  const p = PROBLEM_BY_ID[id]
  if (!p) return null
  return (
    <Link
      href={`/problems/${id}`}
      className={cn(
        "inline-block rounded-sm border px-2 py-0.5 text-xs hover:border-primary",
        tone === "loss" && "border-loss/30 bg-loss-soft/50",
        tone === "gain" && "border-gain/30 bg-gain-soft/50",
        tone === "neutral" && "border-rule bg-card",
      )}
    >
      {p.title}
    </Link>
  )
}

/** Compact card used on problem pages and in the decision tree. */
export function PathCard({
  path: p,
  showProblem = false,
}: {
  path: SolutionPath
  showProblem?: boolean
}) {
  return (
    <div className="rounded-md border border-rule bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Link href={`/paths/${p.id}`} className="font-medium hover:text-primary hover:underline">
          {p.title}
        </Link>
        <StatusPill status={p.status} />
      </div>
      {showProblem && (
        <div className="mt-1 text-xs text-muted-foreground">
          For: <ProblemChip id={p.problemId} />
        </div>
      )}
      <p className="mt-2 text-sm text-foreground/80">{p.summary}</p>
      <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <ul className="space-y-1">
          {p.pros.map((x) => (
            <li key={x} className="flex gap-1.5">
              <span className="text-gain">+</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
        <ul className="space-y-1">
          {p.cons.map((x) => (
            <li key={x} className="flex gap-1.5">
              <span className="text-loss">−</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>
      {((p.spawns?.length ?? 0) > 0 || (p.worsens?.length ?? 0) > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">Creates or worsens:</span>
          {[...(p.spawns ?? []), ...(p.worsens ?? [])].map((id) => (
            <ProblemChip key={id} id={id} tone="loss" />
          ))}
        </div>
      )}
      {(p.solves?.length ?? 0) > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">Also helps:</span>
          {p.solves?.map((id) => (
            <ProblemChip key={id} id={id} tone="gain" />
          ))}
        </div>
      )}
    </div>
  )
}

export function PathLink({ path: p }: { path: SolutionPath }) {
  return (
    <Link
      href={`/paths/${p.id}`}
      className="flex items-start justify-between gap-2 rounded-sm border border-rule bg-card px-3 py-2 text-sm hover:border-primary"
    >
      <span>
        {p.title}
        <span className="block text-xs text-muted-foreground">
          {PROBLEM_BY_ID[p.problemId]?.title}
        </span>
      </span>
      <StatusPill status={p.status} />
    </Link>
  )
}
