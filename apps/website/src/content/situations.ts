/**
 * "What changes for you": everyday situations a reader can pick, each tied to one group in
 * groups.ts. What the plan does for each comes from the chosen solution paths through
 * graph.ts (`impactsOf`), so nothing here restates the plan in new words.
 */
import { GROUP_BY_ID, impactsOf } from "./graph"
import { CHOSEN } from "./paths"
import { PROBLEM_BY_ID } from "./problems"

/** First-person wording for the groups a person would recognize themselves in. */
const SITUATION_LABELS: [groupId: string, label: string][] = [
  ["employer-covered", "I get insurance through work"],
  ["uninsured", "I don't have insurance"],
  ["underinsured", "I have insurance but can't afford to use it"],
  ["changing-lives", "My job, income, or home is changing"],
  ["low-middle-income", "Premiums are a big share of my pay"],
  ["heavy-care-users", "I have ongoing or specialist care needs"],
  ["medicare-beneficiaries", "I'm on Medicare"],
  ["older-adults", "I'm an older adult"],
  ["maternity-families", "I'm pregnant or planning a family"],
  ["long-term-care-users", "I need long-term care"],
  ["rural-residents", "I live in a rural area"],
  ["immigrant-families", "I'm an immigrant or in a mixed-status family"],
  ["territory-residents", "I live in a U.S. territory"],
  ["high-earners", "I have a high income"],
  ["clinicians", "I'm a doctor, nurse, or other clinician"],
  ["employers", "I run a business"],
]

export type SituationEffect = {
  problemId: string
  problem: string
  /** How the problem reaches this group, in the site's own words. */
  how: string[]
  /** The plan's solution paths behind this effect. */
  paths: { id: string; title: string }[]
}

export type Situation = {
  groupId: string
  label: string
  summary: string
  size?: { text: string; sourceIds: string[] }
  better: SituationEffect[]
  harder: SituationEffect[]
}

function collect(groupId: string, side: "gains" | "loses"): SituationEffect[] {
  const byProblem = new Map<string, SituationEffect>()
  for (const p of CHOSEN) {
    for (const impact of impactsOf(p)[side]) {
      if (impact.group?.id !== groupId) continue
      for (const via of impact.via) {
        const pr = PROBLEM_BY_ID[via.problemId]
        if (!pr) continue
        const e = byProblem.get(pr.id) ?? {
          problemId: pr.id,
          problem: pr.title,
          how: [],
          paths: [],
        }
        if (via.how && !e.how.includes(via.how)) e.how.push(via.how)
        if (!e.paths.some((x) => x.id === p.id)) e.paths.push({ id: p.id, title: p.title })
        byProblem.set(pr.id, e)
      }
    }
  }
  // Effects backed by more solution paths come first.
  return [...byProblem.values()].toSorted((a, b) => b.paths.length - a.paths.length)
}

export const SITUATIONS: Situation[] = SITUATION_LABELS.filter(([id]) => GROUP_BY_ID[id]).map(
  ([groupId, label]) => {
    const g = GROUP_BY_ID[groupId]
    return {
      groupId,
      label,
      summary: g.summary,
      size: g.size,
      better: collect(groupId, "gains"),
      harder: collect(groupId, "loses"),
    }
  },
)
