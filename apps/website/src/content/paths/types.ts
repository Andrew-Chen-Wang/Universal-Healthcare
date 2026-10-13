export type PathStatus = "open" | "chosen" | "rejected"

export type Precedent = { place: string; note: string; sourceIds?: string[] }

/**
 * One possible solution to one problem. Paths link to each other and to other
 * problems so the site can show how a choice ripples: what it fixes elsewhere,
 * what it makes worse, and which new problems (with their own paths) it creates.
 */
export type SolutionPath = {
  id: string
  /** The problem this path is primarily a solution to. */
  problemId: string
  title: string
  summary: string
  precedents: Precedent[]
  pros: string[]
  cons: string[]
  whoGains: string[]
  whoLoses: string[]
  /** Ways to make up for or soften the losses to those who lose. */
  mend: string[]
  /** Other problems this path also helps. */
  solves?: string[]
  /** Other problems this path makes worse. */
  worsens?: string[]
  /** New problems this path creates (each has its own paths, i.e. subpaths). */
  spawns?: string[]
  /** Paths that must also be chosen for this one to work. */
  requires?: string[]
  /** Paths that can't be chosen together with this one. */
  conflicts?: string[]
  /** Paths that work well together with this one. */
  complements?: string[]
  /** Cost items (Part 1 costs) most affected. */
  costIds?: string[]
  status: PathStatus
}

/** Helper so content files stay compact. */
export function path(p: Omit<SolutionPath, "status"> & { status?: PathStatus }): SolutionPath {
  return { status: "open", ...p }
}
