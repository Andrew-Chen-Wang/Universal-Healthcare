/**
 * The case for universal health care, as reasons. Each reason points to the
 * problem pages whose evidence it rests on (shown from problems.ts, not
 * repeated here) and adds only evidence those pages don't already carry.
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
}

export const REASONS: Reason[] = [
  {
    id: "coverage",
    title: "Everyone is covered, and coverage saves lives",
    body: "Tens of millions of people have no coverage, and many more have coverage they can't afford to use. People without coverage skip care until it becomes an emergency. When coverage has expanded, death rates have fallen.",
    problems: ["uninsured", "underinsurance"],
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
    id: "debt",
    title: "Illness stops causing debt and surprise bills",
    body: "Getting sick can mean bills a family can't pay, and people with medical debt put off further care. Bills from providers a patient never chose to see add to it. When care is covered in full at the point of use, those bills stop.",
    problems: ["medical-debt", "surprise-bills"],
  },
  {
    id: "admin",
    title: "Less money goes to paperwork",
    body: "Hundreds of payers, each with its own rules, forms, networks, and approvals, make U.S. health care costly to administer. Simpler payment frees money and clinicians' time for care.",
    problems: ["admin-cost", "insurer-overhead"],
  },
  {
    id: "prices",
    title: "Prices come down to what other countries pay",
    body: "The U.S. uses about as much care as peer countries but pays far more per service. A payer that covers everyone can bargain for everyone.",
    problems: ["high-prices"],
  },
  {
    id: "wages",
    title: "Workers keep more of their pay",
    body: "Employer premiums come mostly out of wages. A family premium costs the same for a cashier as for an executive, so it takes the biggest bite from modest pay.",
    problems: ["premium-burden"],
  },
  {
    id: "results",
    title: "Better results for the money",
    body: "The U.S. spends the most of any country on health care and gets shorter lives and worse outcomes than its peers.",
    problems: ["outcomes"],
  },
]

/** The costs and risks, so the case is read alongside them. */
export const COUNTERWEIGHTS = [
  "x-new-taxes",
  "wait-times",
  "transition-disruption",
  "x-plan-choice",
]
