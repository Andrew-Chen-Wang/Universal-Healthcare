/**
 * Whole approaches to compare side by side, from keeping current law to the
 * site's draft single-payer picks. Each is built by a rule from the paths'
 * scale labels (paths/scale.ts), not picked by hand, so the comparison updates
 * when a path or a label changes:
 *
 For each problem in today's system, take every path at the largest scale the
 * approach allows (all of them, when several tie), skipping any that conflict
 * with paths already taken or require a path above the limit. Problems those
 * paths create get the smallest change that answers them instead, so a
 * reform doesn't pull in more reform than it needs. Where the options only
 * answer an open question (which tax, whether to allow private insurance),
 * take just one, since the answers are alternatives.
 */
import { effectsOf, impactsOf } from "./graph"
import {
  CHOSEN,
  conflictsOf,
  PATH_BY_ID,
  pathsFor,
  type Scale,
  SCALE_RANK,
  type SolutionPath,
  TODAY_CATEGORIES,
} from "./paths"
import { PROBLEM_BY_ID, PROBLEMS } from "./problems"

export type Approach = {
  id: string
  title: string
  summary: string
  /** How the picks were made. */
  rule: string
  picks: string[]
}

/** Problems in today's system, which every approach must say something about. */
export const TODAY_PROBLEMS = PROBLEMS.filter((p) => TODAY_CATEGORIES(p.category))

function compose(max: Scale, seed: string[] = []) {
  const picks = new Set<string>()
  const allowed = (p: SolutionPath) => SCALE_RANK[p.scale] <= SCALE_RANK[max]
  const blocked = (p: SolutionPath) => conflictsOf(p.id).some((c) => picks.has(c.id))
  const today = new Set(TODAY_PROBLEMS.map((p) => p.id))
  const queue = [...today]

  const add = (p: SolutionPath, force = false): boolean => {
    if (picks.has(p.id)) return true
    if (blocked(p) || (!force && !allowed(p))) return false
    const reqs = (p.requires ?? []).map((r) => PATH_BY_ID[r])
    if (reqs.some((r) => !picks.has(r.id) && (blocked(r) || !allowed(r)))) return false
    picks.add(p.id)
    for (const r of reqs) add(r)
    queue.push(...(p.spawns ?? []))
    return true
  }

  for (const id of seed) add(PATH_BY_ID[id], true)
  const seen = new Set<string>()
  while (queue.length) {
    const id = queue.shift()!
    if (seen.has(id)) continue
    seen.add(id)
    const own = pathsFor(id)
    if (own.some((p) => picks.has(p.id))) continue
    // Try each scale in order of preference; stop at the first that adds anything.
    const ranks = [...new Set(own.filter(allowed).map((p) => SCALE_RANK[p.scale]))].toSorted(
      (x, y) => (today.has(id) ? y - x : x - y),
    )
    for (const rank of ranks) {
      const at = own.filter((p) => SCALE_RANK[p.scale] === rank)
      const fixes = at.filter((p) => p.role !== "answers")
      const added = fixes.length ? fixes.map((p) => add(p)).some(Boolean) : at.some((p) => add(p))
      if (added) break
    }
  }
  return [...picks]
}

export const APPROACHES: Approach[] = [
  {
    id: "keep",
    title: "Keep current law",
    summary:
      "Change nothing. Every problem continues on its current course, and today's insurers, programs, and taxes stay as they are.",
    rule: "For every problem, the no-change option.",
    picks: compose("none"),
  },
  {
    id: "minor",
    title: "Minor changes",
    summary:
      "Fix what can be fixed with rules, standards, and funding inside today's programs and insurers. Most people keep the coverage they have now.",
    rule: "For every problem, every minor-change path; no change where there is none.",
    picks: compose("minor"),
  },
  {
    id: "moderate",
    title: "Larger changes, same insurers",
    summary:
      "Add new public programs and payment rules alongside today's insurers: a public option, a lower Medicare age, automatic enrollment, rate setting, and drug negotiation.",
    rule: "For every problem, the moderate-change paths; minor or no change where there are none.",
    picks: compose("moderate"),
  },
  {
    id: "multipayer",
    title: "Universal, multi-payer",
    summary:
      "Everyone must have a plan, and competing non-profit or tightly regulated insurers must take everyone at standard benefits, as in Germany, Switzerland, and the Netherlands. Other problems get the same moderate changes as the previous column.",
    rule: "Regulated multi-payer, then moderate-change paths for everything else.",
    picks: compose("moderate", ["regulated-multipayer"]),
  },
  {
    id: "draft",
    title: "The site's draft picks",
    summary:
      "One public payer for everyone, with no cost sharing, financed by payroll and income taxes. Claude made these picks for the owner to review; none is final.",
    rule: "The draft decisions in the review ledger.",
    picks: CHOSEN.map((p) => p.id),
  },
]

export type ApproachSummary = {
  approach: Approach
  paths: SolutionPath[]
  /** Today's problems a picked path fixes. */
  addressed: string[]
  /** Today's problems left as they are. */
  leftAsIs: string[]
  /** Problems the picks create or worsen. */
  harms: string[]
  /** Problems the picks create that no pick answers. */
  unanswered: string[]
  /** Group id → how many picked paths help (+) or hurt (−) it. */
  groups: Record<string, { gains: number; loses: number }>
  changes: number
  byScale: Record<Scale, number>
}

export function summarize(a: Approach): ApproachSummary {
  const paths = a.picks.map((id) => PATH_BY_ID[id])
  // A no-change path leaves things as they are, even where its links describe
  // the problem relative to reform (keeping patents "worsens" drug prices).
  const changing = paths.filter((p) => p.scale !== "none")
  const fixed = new Set(changing.flatMap((p) => effectsOf(p).fixes.map((e) => e.problemId!)))
  const addressed = TODAY_PROBLEMS.filter((p) => fixed.has(p.id)).map((p) => p.id)
  const harms = [...new Set(changing.flatMap((p) => [...(p.spawns ?? []), ...(p.worsens ?? [])]))]
  const picked = new Set(a.picks)
  const unanswered = [...new Set(changing.flatMap((p) => p.spawns ?? []))].filter(
    (id) => !pathsFor(id).some((q) => picked.has(q.id)),
  )
  const groups: ApproachSummary["groups"] = {}
  for (const p of paths) {
    const { gains, loses } = impactsOf(p)
    for (const i of gains) if (i.group) (groups[i.group.id] ??= { gains: 0, loses: 0 }).gains++
    for (const i of loses) if (i.group) (groups[i.group.id] ??= { gains: 0, loses: 0 }).loses++
  }
  const byScale: Record<Scale, number> = { none: 0, minor: 0, moderate: 0, major: 0 }
  for (const p of paths) byScale[p.scale]++
  return {
    approach: a,
    paths,
    addressed,
    leftAsIs: TODAY_PROBLEMS.filter((p) => !fixed.has(p.id)).map((p) => p.id),
    harms: harms.filter((id) => PROBLEM_BY_ID[id]),
    unanswered,
    groups,
    changes: paths.reduce((n, p) => n + (p.changes?.length ?? 0), 0),
    byScale,
  }
}
