export type PathStatus = "open" | "chosen" | "rejected"

export type Precedent = { place: string; note: string; sourceIds?: string[] }

/**
 * How this path affects one linked problem: the mechanism, with sources for any
 * figure. `helps` and `hurts` name extra groups (see groups.ts) this path
 * affects through this link, beyond those the problem itself lists; shared
 * trade-offs like "reduces income for some" use these to say whose income.
 */
export type How = { note: string; sourceIds?: string[]; helps?: string[]; hurts?: string[] }

/**
 * One possible solution to one problem. Paths link to each other and to other
 * problems so the site can show how a choice ripples: what it fixes elsewhere,
 * what it makes worse, and which new problems (with their own paths) it creates.
 */
export type SolutionPath = {
  id: string
  /** The problem this path is primarily a solution to. */
  problemId: string
  /**
   * By default a path fixes its main problem. "answers" means it is one answer
   * to that problem's open question (which tax, whether to allow a private
   * tier) rather than a way to shrink it, so no gains or losses flow from it.
   */
  role?: "answers"
  title: string
  summary: string
  precedents: Precedent[]
  /**
   * How this path affects each problem it links to (problemId, solves, worsens,
   * spawns), keyed by problem id. When present, the path is part of the effects
   * graph: what it fixes, what it creates or worsens, and who gains or loses are
   * all derived from these links (see graph.ts), and the free-text lists below
   * are not used.
   */
  how?: Record<string, How>
  /** Legacy free-text lists, replaced by `how` as paths are migrated to the graph. */
  pros?: string[]
  cons?: string[]
  whoGains?: string[]
  whoLoses?: string[]
  /**
   * Ways to soften the losses that aren't (yet) solution paths of their own.
   * Paths that fix this path's harms are listed under each harm instead.
   */
  mend?: string[]
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
  /** Concrete system changes this path requires if chosen (laws, agencies, payment rules, IT). */
  changes?: string[]
  costIds?: string[]
  status: PathStatus
}

/** Helper so content files stay compact. */
export function path(p: Omit<SolutionPath, "status"> & { status?: PathStatus }): SolutionPath {
  return { status: "open", ...p }
}
