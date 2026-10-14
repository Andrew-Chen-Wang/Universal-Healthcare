/**
 * Optimizations that work in any system: ways to deliver the same or better
 * care for less, whoever pays. They don't take a side between keeping current
 * law and universal coverage, so they sit outside the problem → path tree and
 * apply to every approach on /approaches. Each lists evidence for and against;
 * none is priced in the cost models yet.
 */
import { show, v } from "./constants"
import type { Precedent } from "./paths/types"
import { PROBLEM_BY_ID, type Reading } from "./problems"
import { SOURCE_BY_ID } from "./sources"

export const OPTIMIZATION_LENSES = [
  "Operations & scale",
  "Access channel",
  "Site of care",
  "Housing & community",
] as const
export type OptimizationLens = (typeof OPTIMIZATION_LENSES)[number]

export type Optimization = {
  id: string
  title: string
  summary: string
  lens: OptimizationLens
  /** What it takes to do it. */
  how: string[]
  /** A rough size of what's at stake, with its arithmetic. */
  size?: Reading
  evidenceFor: Reading[]
  evidenceAgainst: Reading[]
  precedents: Precedent[]
  tradeoffs: string[]
  /** How it works today and under a reform: the same idea, different levers. */
  anySystem: string
  /** Problems it helps (problems.ts). */
  helps: string[]
}

const pct = (x: number) => `${Math.round(x * 100)}%`
const labMarkup = v("lipidPriceHopd") / v("lipidPriceIndependent")
const cmpMarkup = v("cmpPriceHopd") / v("cmpPriceIndependent")
const labSaving =
  v("esiLabSpend2022") *
  v("esiLabHopdSpendShare") *
  (1 - v("lipidPriceIndependent") / v("lipidPriceHopd"))

export const OPTIMIZATIONS: Optimization[] = [
  {
    id: "high-volume-labs",
    title: "Run routine lab tests at high volume, at high-volume prices",
    summary:
      "Routine tests such as metabolic panels, lipid panels, and blood counts are the same test wherever they're run. Send them to high-volume automated labs and pay every setting the same price, keeping on-site hospital labs for urgent and inpatient testing.",
    lens: "Operations & scale",
    how: [
      "Pay the same price for a routine test in every setting, as site-neutral payment does for visits",
      "Route non-urgent specimens from clinics and hospital outpatient departments to high-volume labs",
      "Keep hospital labs for emergency, inpatient, and time-critical tests",
    ],
    size: {
      text: `For employer coverage alone: hospital outpatient departments took ${show("esiLabHopdSpendShare")} of the ${show("esiLabSpend2022")} spent on the tests HCCI studied in 2022. Paying them independent-lab prices (a lipid panel at ${show("lipidPriceIndependent")} instead of ${show("lipidPriceHopd")}) would save roughly $${labSaving.toFixed(1)}B a year. A rough figure: markups vary by test, and Medicare and Medicaid labs aren't included.`,
      sourceIds: ["hcci-lab-2024"],
    },
    evidenceFor: [
      {
        text: `With employer coverage, the same test cost several times as much in a hospital outpatient department as in an independent lab in 2022: a lipid panel's median price was ${show("lipidPriceHopd")} against ${show("lipidPriceIndependent")} (${labMarkup.toFixed(1)}×), and a comprehensive metabolic panel ${show("cmpPriceHopd")} against ${show("cmpPriceIndependent")} (${cmpMarkup.toFixed(1)}×).`,
        sourceIds: ["hcci-lab-2024"],
      },
      {
        text: `Hospital outpatient departments ran ${show("esiLabHopdUseShare")} of the tests but took ${show("esiLabHopdSpendShare")} of the spending. From 2012 to 2022, lab prices fell at independent labs and rose at hospital outpatient departments.`,
        sourceIds: ["hcci-lab-2024"],
      },
    ],
    evidenceAgainst: [
      {
        text: `The prize for routine tests is modest next to total health spending. Medicare Part B spent ${show("medicareLabSpend2024")} on lab tests in 2024, and ${show("medicareGeneticLabShare2024")} of it went to genetic tests, which are not routine high-volume chemistry.`,
        sourceIds: ["oig-lab-2024"],
      },
      {
        text: "The U.S. already has very large national commercial labs. The gap HCCI measured is mostly in what hospital outpatient departments are paid for the same test, so the lever is payment and routing more than building new capacity.",
        sourceIds: ["hcci-lab-2024"],
      },
    ],
    precedents: [
      {
        place: "U.S. independent labs",
        note: `Independent labs' median prices for common panels were around ${show("lipidPriceIndependent")} or less, and varied far less than hospital outpatient prices.`,
        sourceIds: ["hcci-lab-2024"],
      },
    ],
    tradeoffs: [
      "Hospitals lose lab revenue that cross-subsidizes other services.",
      "Couriering specimens adds hours, which matters for some tests.",
      "Concentrating volume in a few labs gives them more market power over prices.",
    ],
    anySystem:
      "Today, employers and insurers can steer tests through networks or pay one reference price, and Medicare can extend site-neutral payment to labs. A single payer or all-payer rate setting would set one fee schedule for every setting.",
    helps: ["high-prices", "facility-fees", "price-opacity"],
  },
  {
    id: "virtual-first",
    title: "A virtual first step for routine acute problems",
    summary:
      "For common short-term problems (sinus infections, rashes, urinary infections), start with a video, phone, or written review. A clinician decides whether an in-person visit is needed, by the type of problem and what the review finds.",
    lens: "Access channel",
    how: [
      "Make the virtual review the default entry point, not an extra option on top of in-person care",
      "Publish which problems can be handled virtually and which always need an exam",
      "Let the virtual clinician book the in-person visit directly when one is needed",
    ],
    evidenceFor: [
      {
        text: `In a large insurer's 2022 claims, episodes that started virtually cost ${pct(v("virtualFirstSavingLow"))}–${pct(v("virtualFirstSavingHigh"))} less than in-person-first episodes for over half of the common conditions studied among Medicare Advantage members, and less for most conditions among commercial members. Only ${show("virtualFirstShareMa")} of Medicare Advantage episodes started virtually. The study is observational, and its authors work for the insurer.`,
        sourceIds: ["zaleski-virtual-first-2025"],
      },
    ],
    evidenceAgainst: [
      {
        text: `As an add-on, telehealth raises spending: in commercial claims for acute respiratory illness, only ${show("dtcTelehealthReplaced")} of direct-to-consumer telehealth visits replaced another visit and ${show("dtcTelehealthNew")} were new care, adding ${show("dtcTelehealthNetSpend")} a year per user. Savings depend on the virtual step replacing visits, not adding to them.`,
        sourceIds: ["ashwood-telehealth-2017"],
      },
    ],
    precedents: [
      {
        place: "U.S. Medicare Advantage and commercial plans",
        note: "Virtual-first episodes for common acute conditions mostly cost less than in-person-first ones in one insurer's claims.",
        sourceIds: ["zaleski-virtual-first-2025"],
      },
    ],
    tradeoffs: [
      "Some problems are missed or delayed without an exam, and a virtual step that ends in an in-person visit anyway adds cost and time.",
      "People without broadband, a private space, or comfort with technology need a phone option.",
      "Easy access invites more visits, which is why add-on telehealth raised spending.",
    ],
    anySystem:
      "Any insurer, employer plan, or public program can make a virtual review the default entry point and waive its copay. A single payer could do it nationally, with one list of conditions that need an exam.",
    helps: ["physician-shortage", "shortage-areas", "wait-times"],
  },
  {
    id: "hospital-at-home",
    title: "Hospital-level care at home",
    summary:
      "Patients who need admission for conditions such as infections, heart failure, or COPD flare-ups are treated at home, with nurse and physician visits, IV medications, remote monitoring, and point-of-care tests.",
    lens: "Site of care",
    how: [
      "Pay for an acute episode at home as for the same admission in a hospital",
      "Select patients in the emergency department by condition, stability, and home situation",
      "Staff round-the-clock nurse coverage and rapid return to hospital",
    ],
    evidenceFor: [
      {
        text: `In a randomized trial at two Boston hospitals, the acute episode cost ${show("hospitalAtHomeCostCut")} less at home. Home patients had fewer lab orders (median ${show("hospitalAtHomeLabsHome")} against ${show("hospitalAtHomeLabsUsual")}) and fewer 30-day readmissions (${show("hospitalAtHomeReadmitHome")} against ${show("hospitalAtHomeReadmitUsual")}).`,
        sourceIds: ["levine-hospital-at-home-2020"],
      },
    ],
    evidenceAgainst: [
      {
        text: `The trial was small and highly selected: two academic sites, a few home physicians, and ${show("hospitalAtHomeRefusal")} of eligible patients declined. Results may not hold at scale or in other systems.`,
        sourceIds: ["levine-hospital-at-home-2020"],
      },
    ],
    precedents: [
      {
        place: "U.S. Medicare",
        note: "Medicare's Acute Hospital Care at Home program was extended in 2026 through September 30, 2030, with a required CMS study of its quality and costs.",
        sourceIds: ["ama-hospital-at-home-2026"],
      },
    ],
    tradeoffs: [
      "Family members take on more of the caregiving.",
      "Only some patients qualify, and many prefer the hospital.",
      "Hospitals lose bed-day revenue unless payment follows the patient home.",
    ],
    anySystem:
      "Works under any payer that pays for the episode wherever it happens. Today that's Medicare's waiver and some insurers; a single payer or global hospital budgets would let hospitals shift beds to homes without losing revenue.",
    helps: ["high-prices", "safety"],
  },
  {
    id: "senior-communities",
    title: "Build care into where older people live",
    summary:
      "Retirement communities and senior housing concentrate people who use the most care. That makes it practical to put clinics, home-care routes, day centers, and care teams on site. PACE, a Medicare and Medicaid program built around a day center and one care team, is the tested version.",
    lens: "Housing & community",
    how: [
      "Site primary care, therapy, and a care team in or next to large senior communities",
      "Plan home-care routes and transport around those communities",
      "Expand PACE-style programs that take one payment for all of a person's care",
    ],
    evidenceFor: [
      {
        text: `PACE enrollees' mortality was ${show("paceMortalityGapLow")}–${show("paceMortalityGapHigh")} percentage points lower than a matched group of new nursing-home residents and home-care waiver enrollees, and they used nursing homes much less. Unobserved differences in health may explain part of the gap.`,
        sourceIds: ["aspe-pace-2014"],
      },
    ],
    evidenceAgainst: [
      {
        text: "It didn't save money: PACE's Medicare payments roughly matched what enrollees would have cost in fee-for-service, and Medicaid paid more than predicted in most of the states studied. We found no rigorous evidence that concentrating older people by itself lowers costs.",
        sourceIds: ["aspe-pace-2014"],
      },
    ],
    precedents: [
      {
        place: "U.S. PACE",
        note: "One team and one payment for all of a frail older person's care, organized around a day center.",
        sourceIds: ["aspe-pace-2014"],
      },
    ],
    tradeoffs: [
      "Separates older people from mixed-age neighborhoods, and many prefer to age where they are.",
      "Benefits people in large communities more than those who live alone or in rural areas.",
      "Better care may cost the same or more; the gain is in outcomes, not the budget.",
    ],
    anySystem:
      "Works today through Medicare, Medicaid, and housing policy, and under any reform; long-term care insurance or a single payer would make the one-payment model easier to fund.",
    helps: ["ltc-spend-down", "nursing-home-quality", "social-needs", "transport"],
  },
]

export const OPTIMIZATION_BY_ID = Object.fromEntries(OPTIMIZATIONS.map((o) => [o.id, o]))

export const optimizationsFor = (problemId: string) =>
  OPTIMIZATIONS.filter((o) => o.helps.includes(problemId))

// Every link must resolve; the build fails otherwise.
const errors: string[] = []
const seen = new Set<string>()
for (const o of OPTIMIZATIONS) {
  if (seen.has(o.id)) errors.push(`duplicate optimization ${o.id}`)
  seen.add(o.id)
  for (const id of o.helps) if (!PROBLEM_BY_ID[id]) errors.push(`${o.id}: unknown problem ${id}`)
  const readings = [...o.evidenceFor, ...o.evidenceAgainst, ...(o.size ? [o.size] : [])]
  const sources = [...readings, ...o.precedents].flatMap((r) => r.sourceIds ?? [])
  for (const id of sources) if (!SOURCE_BY_ID[id]) errors.push(`${o.id}: unknown source ${id}`)
}
if (errors.length) throw new Error(`Optimization validation failed:\n${errors.join("\n")}`)
