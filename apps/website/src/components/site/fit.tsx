"use client"
/**
 * Whether another country's approach would fit the reader's plan: their picks
 * from /your-plan (see lib/picks.ts), checked against the approach's solution
 * path. A path fits unless a picked path conflicts with it or it needs a path
 * that isn't picked; when the plan already uses a different path for the same
 * problem, it is shown as an alternative.
 */
import { usePicks } from "@website/lib/picks"
import { cn } from "@website/lib/utils"
import Link from "next/link"
import { createContext, type ReactNode, useContext } from "react"

export type FitPath = {
  id: string
  /** Paths that can't be combined with this one. */
  conflicts: string[]
  /** Paths this one depends on. */
  requires: string[]
  /** Other paths for the same problem. */
  siblings: string[]
  /** Titles of every path above, for the verdict's links. */
  titles: Record<string, string>
}

type Tone = "gain" | "loss" | "caution" | "neutral" | "primary"
type Verdict = { tone: Tone; label: string; ids: string[] }

export function verdict(p: FitPath, picks: Set<string>): Verdict {
  if (picks.has(p.id)) return { tone: "gain", label: "In your plan", ids: [] }
  const blocking = p.conflicts.filter((id) => picks.has(id))
  if (blocking.length) return { tone: "loss", label: "Conflicts with your pick", ids: blocking }
  const missing = p.requires.filter((id) => !picks.has(id))
  if (missing.length) return { tone: "caution", label: "Needs first", ids: missing }
  const instead = p.siblings.filter((id) => picks.has(id))
  if (instead.length) return { tone: "neutral", label: "Your plan uses instead", ids: instead }
  return { tone: "primary", label: "Fits your plan", ids: [] }
}

const TONES: Record<Tone, string> = {
  neutral: "bg-secondary text-foreground/75",
  gain: "bg-gain-soft text-gain",
  loss: "bg-loss-soft text-loss",
  caution: "bg-caution-soft text-caution",
  primary: "bg-accent text-accent-foreground",
}

const PicksContext = createContext<ReturnType<typeof usePicks> | null>(null)

/** Loads the reader's picks once for every badge inside it. */
export function FitProvider({ defaults, children }: { defaults: string[]; children: ReactNode }) {
  const state = usePicks(defaults)
  return <PicksContext.Provider value={state}>{children}</PicksContext.Provider>
}

/** A fit badge for one approach. */
export function Fit({ path }: { path: FitPath }) {
  const s = useContext(PicksContext)
  if (!s?.loaded) return <span className="text-xs text-muted-foreground">Checking your plan…</span>
  const v = verdict(path, s.picks)
  return (
    <span className="text-xs">
      <span className={cn("inline-block rounded-sm px-2 py-0.5 font-medium", TONES[v.tone])}>
        {v.label}
      </span>
      {v.ids.length > 0 && (
        <span className="ml-1.5 text-foreground/75">
          {v.ids.map((id, i) => (
            <span key={id}>
              {i > 0 && ", "}
              <Link href={`/paths/${id}`} className="underline underline-offset-2">
                {path.titles[id] ?? id}
              </Link>
            </span>
          ))}
        </span>
      )}
    </span>
  )
}

/** One line saying which plan the badges are checked against. */
export function FitNote() {
  const s = useContext(PicksContext)
  if (!s?.loaded) return null
  const which = s.fromLink
    ? "the mix in this link"
    : s.fromDefault
      ? "the site's plan"
      : `your saved plan (${s.picks.size} paths)`
  return (
    <p className="text-sm text-muted-foreground">
      {`Fit is checked against ${which}. `}
      <Link href="/your-plan" className="underline underline-offset-2">
        Change your picks in Build your plan.
      </Link>
    </p>
  )
}
