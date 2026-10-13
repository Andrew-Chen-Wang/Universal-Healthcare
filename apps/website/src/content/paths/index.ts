/**
 * Every solution path, with build-time validation of every cross-link.
 * Nothing here is chosen yet: status stays "open" until the user decides.
 */
import { PROBLEM_BY_ID, PROBLEMS } from "../problems"
import { INVENTORY_BY_ID } from "../cost-inventory"
import { SOURCE_BY_ID } from "../sources"
import { CARE_PATHS } from "./care"
import { COVERAGE_PATHS } from "./coverage"
import { DERIVED_PATHS } from "./derived"
import { MONEY_PATHS } from "./money"
import { RISK_PATHS } from "./risks"
import { SUPPLY_PATHS } from "./supply"
import type { SolutionPath } from "./types"

export type { SolutionPath, PathStatus } from "./types"

export const PATHS: SolutionPath[] = [
  ...COVERAGE_PATHS,
  ...MONEY_PATHS,
  ...SUPPLY_PATHS,
  ...CARE_PATHS,
  ...RISK_PATHS,
  ...DERIVED_PATHS,
]

export const PATH_BY_ID: Record<string, SolutionPath> = {}
for (const p of PATHS) {
  if (PATH_BY_ID[p.id]) throw new Error(`Duplicate path id ${p.id}`)
  PATH_BY_ID[p.id] = p
}

/** Paths whose primary problem is this one. */
export function pathsFor(problemId: string): SolutionPath[] {
  return PATHS.filter((p) => p.problemId === problemId)
}

/** Paths for other problems that also help this one. */
export function alsoSolvedBy(problemId: string): SolutionPath[] {
  return PATHS.filter((p) => p.problemId !== problemId && p.solves?.includes(problemId))
}

/** Paths that make this problem worse. */
export function worsenedBy(problemId: string): SolutionPath[] {
  return PATHS.filter((p) => p.worsens?.includes(problemId))
}

/** Paths that create this (derived) problem. */
export function createdBy(problemId: string): SolutionPath[] {
  return PATHS.filter((p) => p.spawns?.includes(problemId))
}

/** Paths that require this one. */
export function requiredBy(pathId: string): SolutionPath[] {
  return PATHS.filter((p) => p.requires?.includes(pathId))
}

/** Symmetric relations: a link declared on either side counts for both. */
function symmetric(pathId: string, key: "conflicts" | "complements"): SolutionPath[] {
  const self = PATH_BY_ID[pathId]
  const ids = new Set(self?.[key] ?? [])
  for (const p of PATHS) if (p[key]?.includes(pathId)) ids.add(p.id)
  ids.delete(pathId)
  return [...ids].map((id) => PATH_BY_ID[id])
}
export const conflictsOf = (id: string) => symmetric(id, "conflicts")
export const complementsOf = (id: string) => symmetric(id, "complements")

// ---- validation ----
const errors: string[] = []
for (const p of PATHS) {
  if (!PROBLEM_BY_ID[p.problemId]) errors.push(`${p.id}: unknown problem ${p.problemId}`)
  if (p.pros.length === 0 || p.cons.length === 0) errors.push(`${p.id}: needs pros and cons`)
  if ((p.changes?.length ?? 0) === 0) errors.push(`${p.id}: needs concrete changes`)
  if (p.precedents.length === 0) errors.push(`${p.id}: needs a precedent`)
  for (const k of ["solves", "worsens", "spawns"] as const)
    for (const id of p[k] ?? [])
      if (!PROBLEM_BY_ID[id]) errors.push(`${p.id}.${k}: unknown problem ${id}`)
  for (const k of ["requires", "conflicts", "complements"] as const)
    for (const id of p[k] ?? [])
      if (!PATH_BY_ID[id]) errors.push(`${p.id}.${k}: unknown path ${id}`)
  for (const id of p.costIds ?? [])
    if (!INVENTORY_BY_ID[id]) errors.push(`${p.id}.costIds: unknown cost ${id}`)
  for (const pr of p.precedents)
    for (const s of pr.sourceIds ?? [])
      if (!SOURCE_BY_ID[s]) errors.push(`${p.id}: unknown source ${s}`)
  for (const id of p.spawns ?? [])
    if (
      PROBLEM_BY_ID[id]?.category !== "Problems created by solution paths" &&
      !id.startsWith("x-") &&
      PROBLEM_BY_ID[id]?.category !== "Risks a universal system can create"
    )
      errors.push(`${p.id}.spawns: ${id} should be a created or risk problem`)
}
for (const pr of PROBLEMS) {
  if (pathsFor(pr.id).length < 2) errors.push(`problem ${pr.id}: needs at least 2 paths`)
  if (pr.category === "Problems created by solution paths" && createdBy(pr.id).length === 0)
    errors.push(`problem ${pr.id}: no path creates it`)
}
if (errors.length) throw new Error(`Path validation failed:\n${errors.join("\n")}`)
