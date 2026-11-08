/**
 * Other countries, gathered from what the site already cites: each solution
 * path's precedents (what a country does about a problem, and what happened)
 * and each plan step's international comparisons (where the plans borrow from
 * a country). Nothing here is typed in twice; a country page is a view over
 * those sources.
 *
 * Only named countries count. Group labels ("Most European countries",
 * "Nordic countries") and U.S. states and programs are left out, so a
 * country is never credited with something the source doesn't say it does.
 */
import { pathsFor, PATHS, type SolutionPath } from "./paths"
import type { PlanVariant } from "./plan-bundle"
import { PLANS } from "./plans"

export type Country = { id: string; name: string; match: RegExp }

export const COUNTRIES: Country[] = [
  { id: "australia", name: "Australia", match: /\bAustralia/ },
  { id: "brazil", name: "Brazil", match: /\bBrazil/ },
  {
    id: "canada",
    name: "Canada",
    match: /\b(Canada|Canadian|Ontario|Quebec|Saskatchewan|Vancouver)\b/,
  },
  { id: "denmark", name: "Denmark", match: /\bDenmark\b/ },
  { id: "estonia", name: "Estonia", match: /\bEstonia\b/ },
  { id: "finland", name: "Finland", match: /\bFinland\b/ },
  { id: "france", name: "France", match: /\bFrance\b/ },
  { id: "germany", name: "Germany", match: /\b(Germany|IQWiG|AMNOG|G-BA)\b/ },
  { id: "ireland", name: "Ireland", match: /\bIreland\b/ },
  { id: "japan", name: "Japan", match: /\bJapan\b/ },
  { id: "netherlands", name: "Netherlands", match: /\bNetherlands\b/ },
  { id: "new-zealand", name: "New Zealand", match: /\bNew Zealand\b/ },
  { id: "norway", name: "Norway", match: /\bNorway\b/ },
  { id: "portugal", name: "Portugal", match: /\bPortugal\b/ },
  { id: "south-korea", name: "South Korea", match: /\bSouth Korea\b/ },
  { id: "spain", name: "Spain", match: /\bSpain\b/ },
  { id: "sweden", name: "Sweden", match: /\bSweden\b/ },
  { id: "switzerland", name: "Switzerland", match: /\bSwitzerland\b/ },
  { id: "taiwan", name: "Taiwan", match: /\bTaiwan\b/ },
  { id: "thailand", name: "Thailand", match: /\bThailand\b/ },
  {
    id: "united-kingdom",
    name: "United Kingdom",
    match: /\b(UK|United Kingdom|(?<!New )England|NHS|NICE)\b/,
  },
]

export const COUNTRY_BY_ID: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.id, c]),
)

/** The countries a place label names, e.g. "UK, Canada (pCPA), Australia (PBS)". */
export const countriesIn = (place: string): string[] =>
  COUNTRIES.filter((c) => c.match.test(place)).map((c) => c.id)

/** What a country does about a problem: one precedent on one solution path. */
export type CountryApproach = {
  countryId: string
  path: SolutionPath
  /** The label the precedent was written under, e.g. "Canada (Ontario)". */
  place: string
  note: string
  sourceIds: string[]
}

const APPROACHES: CountryApproach[] = PATHS.flatMap((path) =>
  path.precedents.flatMap((pr) =>
    countriesIn(pr.place).map((countryId) => ({
      countryId,
      path,
      place: pr.place,
      note: pr.note,
      sourceIds: pr.sourceIds ?? [],
    })),
  ),
)

export const approachesOf = (countryId: string) =>
  APPROACHES.filter((a) => a.countryId === countryId)

/** Country approaches to one problem, through its own solution paths, grouped by country. */
export function approachesFor(problemId: string): { country: Country; items: CountryApproach[] }[] {
  const ids = new Set(pathsFor(problemId).map((p) => p.id))
  const items = APPROACHES.filter((a) => ids.has(a.path.id))
  return COUNTRIES.map((country) => ({
    country,
    items: items.filter((a) => a.countryId === country.id),
  })).filter((g) => g.items.length > 0)
}

/** Where one of the site's plans borrows from a country, from its steps' comparisons. */
export type PlanBorrow = {
  countryId: string
  plan: PlanVariant
  stepTitle: string
  href: string
  approach: string
  result: string
  lesson: string
  sourceIds: string[]
}

const BORROWS: PlanBorrow[] = (["hybrid", "single-payer"] as const).flatMap((plan) => {
  const bundle = PLANS[plan]
  return bundle.allSteps.flatMap((step) =>
    (bundle.extras[step.id]?.international ?? []).flatMap((c) =>
      countriesIn(c.country).map((countryId) => ({
        countryId,
        plan,
        stepTitle: step.title,
        href: bundle.stepHref(step.id, "international"),
        approach: c.approach,
        result: c.result,
        lesson: c.lesson,
        sourceIds: c.sourceIds ?? [],
      })),
    ),
  )
})

export const borrowsFrom = (countryId: string) => BORROWS.filter((b) => b.countryId === countryId)

/** Countries with anything to show, most-cited first. */
export const COUNTRY_SUMMARY = COUNTRIES.map((country) => {
  const approaches = approachesOf(country.id)
  return {
    country,
    approaches: approaches.length,
    problems: new Set(approaches.map((a) => a.path.problemId)).size,
    borrows: borrowsFrom(country.id).length,
  }
})
  .filter((s) => s.approaches + s.borrows > 0)
  .toSorted((a, b) => b.approaches + b.borrows - (a.approaches + a.borrows))
