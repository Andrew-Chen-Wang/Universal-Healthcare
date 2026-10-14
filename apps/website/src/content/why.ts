/**
 * The case for universal health care, in two parts: what covering everyone
 * does by itself (REASONS), and what it can also bring depending on which
 * solution paths are chosen (DOWNSTREAM). Each item points to the problem
 * pages whose evidence it rests on (shown from problems.ts, not repeated here)
 * and adds only evidence those pages don't already carry.
 */
import { show } from "./constants"

export type Reason = {
  id: string
  title: string
  body: string
  /** Problems whose evidence supports this reason. */
  problems: string[]
  /** Evidence not already on those problem pages. */
  evidence?: { text: string; sourceIds: string[] }[]
  /** Example paths that would deliver this; only for DOWNSTREAM. */
  paths?: string[]
}

export const REASONS: Reason[] = [
  {
    id: "coverage",
    title: "Everyone is covered, and coverage saves lives",
    body: "Tens of millions of people have no coverage. People without coverage skip care until it becomes an emergency. When coverage has expanded, death rates have fallen.",
    problems: ["uninsured"],
    evidence: [
      {
        text: `After the ACA's Medicaid expansion, deaths among adults aged 20 to 64 fell by ${show("medicaidExpansionMortalityCut")} in expansion states over its first four years.`,
        sourceIds: ["borgschulte-vogler-2020"],
      },
    ],
  },
  {
    id: "business",
    title: "More people start businesses, and small firms can hire the talent they need",
    body: "When health insurance comes with a job, leaving that job is risky. Would-be founders stay put to keep coverage for their families, and small firms, which offer coverage far less often than large ones, struggle to hire people who would otherwise join them. Coverage that doesn't depend on an employer removes that barrier.",
    problems: ["job-lock"],
    evidence: [
      {
        text: `Business ownership among male workers jumps from ${show("businessOwnershipUnder65")} just before age 65 to ${show("businessOwnershipOver65")} just after, when Medicare starts. No such jump appears at other ages.`,
        sourceIds: ["fairlie-kapur-gates-2009"],
      },
      {
        text: `Only ${show("smallFirmOfferRate")} of firms with 10 to 24 workers offer health benefits, against ${show("largeFirmOfferRate")} of firms with 200 or more. A worker with a family to insure has a reason to pick the large firm.`,
        sourceIds: ["kff-esi-101-2026"],
      },
      {
        text: `Job lock cut voluntary job changes by people with employer coverage by ${show("jobLockTurnoverCut")} in a classic study.`,
        sourceIds: ["madrian-1994"],
      },
      {
        text: "The evidence isn't one-sided: when the ACA let young adults stay on a parent's plan, overall self-employment and job mobility among young adults did not measurably rise, though self-employment rose among young adults with disabilities.",
        sourceIds: ["bailey-2017", "bailey-chorniy-2016"],
      },
    ],
  },
  {
    id: "continuity",
    title: "Coverage stays put when life changes",
    body: "Today people lose or switch coverage when they change jobs, earn a little more or less, move, marry, age off a parent's plan, or age into Medicare. Each switch can mean new doctors, new rules, or a gap. Coverage that belongs to the person, not the job or the income bracket, doesn't break.",
    problems: ["churn"],
  },
]

/** Benefits that depend on how universal coverage is designed. */
export const DOWNSTREAM: Reason[] = [
  {
    id: "debt",
    title: "Illness stops causing debt and surprise bills",
    body: "Getting sick can mean bills a family can't pay, and people with medical debt put off further care. Bills from providers a patient never chose to see add to it. How far debt falls depends on what patients still pay at the point of care.",
    problems: ["medical-debt", "surprise-bills", "underinsurance"],
    paths: ["underins-zero", "debt-end-billing", "underins-income-cap"],
  },
  {
    id: "admin",
    title: "Less money goes to paperwork",
    body: "Hundreds of payers, each with its own rules, forms, networks, and approvals, make U.S. health care costly to administer. The savings depend on how far billing is simplified: one claims system saves the most, common standards across many payers less.",
    problems: ["admin-cost", "insurer-overhead"],
    paths: ["admin-one-claims", "overhead-public", "admin-standardize"],
  },
  {
    id: "prices",
    title: "Prices come down toward what other countries pay",
    body: "The U.S. uses about as much care as peer countries but pays far more per service. Covering everyone doesn't lower prices by itself; a payer or rate-setter that covers everyone can bargain for everyone.",
    problems: ["high-prices", "drug-prices"],
    paths: ["all-payer-rates", "prices-cap", "drugs-negotiate"],
  },
  {
    id: "wages",
    title: "Workers keep more of their pay",
    body: "Employer premiums come mostly out of wages. A family premium costs the same for a cashier as for an executive, so it takes the biggest bite from modest pay. Who comes out ahead depends on how the replacement is funded.",
    problems: ["premium-burden"],
    paths: ["premium-to-tax", "premium-income-based"],
  },
  {
    id: "results",
    title: "Better results for the money",
    body: "The U.S. spends the most of any country on health care and gets shorter lives and worse outcomes than its peers. Coverage helps, but results depend on where the money goes.",
    problems: ["outcomes"],
    paths: ["outcomes-primary-care", "outcomes-public-health"],
  },
]

/**
 * A worked example for the cost model: the same single payer with and without
 * the price paths. Both are run through the model on the /why page.
 */
export const PRICE_EXAMPLE = {
  base: ["single-payer", "underins-zero"],
  withPrices: ["all-payer-rates", "drugs-negotiate", "admin-one-claims", "overhead-public"],
}

/** The costs and risks, so the case is read alongside them. */
export const COUNTERWEIGHTS = [
  "x-new-taxes",
  "wait-times",
  "transition-disruption",
  "x-plan-choice",
]
