/**
 * The effects graph. Nodes are problems, paths, and groups; edges are a path's
 * links to problems (with `how`) and a problem's links to groups (`hurts`,
 * `profits`). Everything a page says about a path's effects or winners and
 * losers is derived here, so each fact is written once and every page that
 * shows it updates together.
 *
 * Paths not yet migrated (no `how`) fall back to their legacy free-text lists.
 */
import { CURRENT_LAW } from "./current-law"
import { GROUP_BY_ID, GROUPS, type Group } from "./groups"
import { alsoSolvedBy, createdBy, PATHS, pathsFor, worsenedBy } from "./paths"
import type { SolutionPath } from "./paths"
import { PROBLEM_BY_ID, PROBLEMS, type Problem } from "./problems"
import { SOURCE_BY_ID } from "./sources"

export type Effect = {
  /** Set when the effect is a problem node with its own page. */
  problemId?: string
  title: string
  note?: string
  sourceIds?: string[]
}

export type Impact = {
  /** Set when the group is a node with its own page. */
  group?: Group
  label: string
  /** The problems through which this path reaches the group. */
  via: { problemId: string; how: string }[]
}

export const isMigrated = (p: SolutionPath) => p.how !== undefined

type Direction = "fixes" | "harms" | "answers" | "keeps"

/** Every problem a path links to, as [id, direction]. */
function links(p: SolutionPath): [string, Direction][] {
  const main: Direction = p.role === "answers" ? "answers" : p.role === "keeps" ? "keeps" : "fixes"
  return [
    [p.problemId, main],
    ...(p.solves ?? []).map((id) => [id, "fixes"] as [string, "fixes"]),
    ...(p.worsens ?? []).map((id) => [id, "harms"] as [string, "harms"]),
    ...(p.spawns ?? []).map((id) => [id, "harms"] as [string, "harms"]),
  ]
}

const legacy = (items?: string[]) => (items ?? []).filter((i) => !i.startsWith("N/A"))

/** What a path fixes and what it creates or worsens. */
export function effectsOf(p: SolutionPath): {
  fixes: Effect[]
  harms: Effect[]
  /** Set when the path answers its main problem's open question instead of fixing it. */
  answers?: Effect
  /** Set when the path keeps current law: the problem it leaves in place. */
  keeps?: Effect
} {
  if (!p.how)
    return {
      fixes: legacy(p.pros).map((title) => ({ title })),
      harms: legacy(p.cons).map((title) => ({ title })),
    }
  const fixes: Effect[] = []
  const harms: Effect[] = []
  let answers: Effect | undefined
  let keeps: Effect | undefined
  for (const [id, dir] of links(p)) {
    const e = { problemId: id, title: PROBLEM_BY_ID[id].title, ...p.how[id] }
    if (dir === "answers") answers = e
    else if (dir === "keeps") keeps = e
    else (dir === "fixes" ? fixes : harms).push(e)
  }
  return { fixes, harms, answers, keeps }
}

/**
 * Paths that fix a problem: its own paths (except those that only answer its
 * open question) plus paths for other problems that solve it.
 */
export const fixersOf = (problemId: string) => [
  ...pathsFor(problemId).filter((p) => p.role !== "answers"),
  ...alsoSolvedBy(problemId),
]
/** Paths that create or worsen a problem. */
export const causersOf = (problemId: string) => [...createdBy(problemId), ...worsenedBy(problemId)]

/**
 * Who gains and who loses from a path, derived from the groups its problems
 * touch. For "Keep current law" this is measured against fixing the problem:
 * those who profit from it keep their gain, and those it hurts stay hurt.
 */
export function impactsOf(p: SolutionPath): { gains: Impact[]; loses: Impact[] } {
  if (!p.how)
    return {
      gains: legacy(p.whoGains).map((label) => ({ label, via: [] })),
      loses: legacy(p.whoLoses).map((label) => ({ label, via: [] })),
    }
  const gains = new Map<string, Impact>()
  const loses = new Map<string, Impact>()
  const add = (to: Map<string, Impact>, groupId: string, problemId: string, how: string) => {
    const group = GROUP_BY_ID[groupId]
    const i = to.get(groupId) ?? { group, label: group.label, via: [] }
    i.via.push({ problemId, how })
    to.set(groupId, i)
  }
  for (const [id, dir] of links(p)) {
    const pr = PROBLEM_BY_ID[id]
    if (dir !== "answers") {
      const better = dir === "fixes"
      for (const l of pr.hurts ?? []) add(better ? gains : loses, l.group, id, l.how)
      for (const l of pr.profits ?? []) add(better ? loses : gains, l.group, id, l.how)
    }
    const h = p.how[id]
    for (const g of h.helps ?? []) add(gains, g, id, h.note)
    for (const g of h.hurts ?? []) add(loses, g, id, h.note)
  }
  return { gains: [...gains.values()], loses: [...loses.values()] }
}

/** Every problem that touches a group, and how. */
export function problemsFor(groupId: string): {
  problem: Problem
  kind: "hurts" | "profits"
  how: string
  sourceIds?: string[]
}[] {
  return PROBLEMS.flatMap((problem) =>
    (["hurts", "profits"] as const).flatMap((kind) =>
      (problem[kind] ?? [])
        .filter((l) => l.group === groupId)
        .map((l) => ({ problem, kind, how: l.how, sourceIds: l.sourceIds })),
    ),
  )
}

export { GROUPS, GROUP_BY_ID }

// ---- validation ----
const errors: string[] = []
const checkSources = (where: string, ids?: string[]) => {
  for (const s of ids ?? []) if (!SOURCE_BY_ID[s]) errors.push(`${where}: unknown source ${s}`)
}
for (const p of PATHS) {
  if (!p.how) continue
  const linked = new Set(links(p).map(([id]) => id))
  for (const id of linked) if (!p.how[id]) errors.push(`${p.id}: no how-note for linked ${id}`)
  for (const [id, h] of Object.entries(p.how)) {
    if (!linked.has(id)) errors.push(`${p.id}.how: ${id} is not a linked problem`)
    checkSources(`${p.id}.how.${id}`, h.sourceIds)
    for (const g of [...(h.helps ?? []), ...(h.hurts ?? [])])
      if (!GROUP_BY_ID[g]) errors.push(`${p.id}.how.${id}: unknown group ${g}`)
  }
  if (p.pros || p.cons || p.whoGains || p.whoLoses)
    errors.push(`${p.id}: migrated paths must drop the legacy free-text lists`)
}
for (const pr of PROBLEMS) {
  for (const kind of ["hurts", "profits"] as const)
    for (const l of pr[kind] ?? []) {
      if (!GROUP_BY_ID[l.group]) errors.push(`${pr.id}.${kind}: unknown group ${l.group}`)
      checkSources(`${pr.id}.${kind}`, l.sourceIds)
    }
  if ((pr.hurts || pr.profits) && (pr.whoIsHurt || pr.whoProfits))
    errors.push(`${pr.id}: migrated problems must drop whoIsHurt and whoProfits`)
  for (const r of [...(pr.debate?.is ?? []), ...(pr.debate?.isNot ?? [])]) {
    checkSources(`${pr.id}.debate`, r.sourceIds)
    for (const id of r.problems ?? [])
      if (!PROBLEM_BY_ID[id]) errors.push(`${pr.id}.debate: unknown problem ${id}`)
  }
}
for (const [id, r] of Object.entries(CURRENT_LAW)) {
  if (!PROBLEM_BY_ID[id]) errors.push(`current-law: unknown problem ${id}`)
  if (!r.sourceIds?.length) errors.push(`current-law.${id}: needs a source`)
  checkSources(`current-law.${id}`, r.sourceIds)
}
// A migrated path's problems must say whom they affect, or "who gains" would be silently empty.
for (const p of PATHS)
  if (p.how)
    for (const [id] of links(p)) {
      const pr = PROBLEM_BY_ID[id]
      if (!pr.hurts && !pr.profits && pr.category !== "Common trade-offs")
        errors.push(`${p.id}: linked problem ${id} has no group links`)
    }

export const GRAPH_ERRORS = errors
if (errors.length && process.env.NODE_ENV === "production")
  throw new Error(`Graph validation failed:\n${errors.join("\n")}`)
if (errors.length) console.warn(`Graph validation failed:\n${errors.join("\n")}`)
