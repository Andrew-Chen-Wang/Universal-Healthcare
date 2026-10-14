/**
 * "Keep current law" for every problem in today's system that doesn't already
 * have a no-change path (like "Keep the current patent system"). Each one is
 * derived from its problem: it fixes nothing, the groups the problem hurts stay
 * hurt, and the groups that profit from it keep profiting (see graph.ts). A
 * problem's `currentLaw` note, when present, says where things are heading.
 *
 * Risks of a universal system and problems created by solution paths don't get
 * one: they exist only once a reform is chosen.
 */
import { PROBLEMS, SIDE_EFFECT_CATEGORIES, type ProblemCategory } from "../problems"
import { PATH_SCALE } from "./scale"
import { path, type SolutionPath } from "./types"

/** Categories of problems in today's system, which "keep current law" applies to. */
export const TODAY_CATEGORIES = (cat: ProblemCategory) =>
  !SIDE_EFFECT_CATEGORIES.includes(cat) && cat !== "Risks a universal system can create"

export const keepId = (problemId: string) => `keep-${problemId}`

/** Problems whose own paths already include a no-change option. */
function hasNoChangePath(problemId: string, paths: SolutionPath[]) {
  return paths.some((p) => p.problemId === problemId && PATH_SCALE[p.id] === "none")
}

export function keepPaths(existing: SolutionPath[]): SolutionPath[] {
  return PROBLEMS.filter((pr) => TODAY_CATEGORIES(pr.category))
    .filter((pr) => !hasNoChangePath(pr.id, existing))
    .map((pr) =>
      path({
        id: keepId(pr.id),
        problemId: pr.id,
        role: "keeps",
        scale: "none",
        title: "Keep current law",
        summary: pr.currentLaw
          ? `Change nothing. ${pr.currentLaw.text}`
          : "Change nothing. The problem continues as described, and so do today's costs and benefits for each side.",
        precedents: [],
        how: {
          [pr.id]: pr.currentLaw
            ? { note: pr.currentLaw.text, sourceIds: pr.currentLaw.sourceIds }
            : { note: "Nothing changes, so the problem continues as its page describes." },
        },
        changes: [],
      }),
    )
}
