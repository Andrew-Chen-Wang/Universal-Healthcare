/**
 * Numbers for the hybrid plan, computed from the current draft picks with the
 * reform model, plus the hybrid's one-time costs. Every figure in the hybrid
 * Part 2 comes from here or constants.ts.
 */
import { type ConstantId, v } from "../constants"
import { fmt } from "../model"
import { CHOSEN } from "../paths"
import { type ReformLine, reformCost } from "../reform-model"

export const HYBRID_COST = reformCost(new Set(CHOSEN.map((p) => p.id)))

const zero: ReformLine = { id: "", label: "", delta: 0, federal: 0, explanation: "", sourceIds: [] }
export const hybridLine = (id: string) => HYBRID_COST.lines.find((l) => l.id === id) ?? zero

export type HybridComponent = {
  label: string
  amount: number
  formula: string
  inputs: ConstantId[]
}
export type HybridOneTime = {
  id: string
  label: string
  stepId: string
  basis: string
  components: HybridComponent[]
  total: number
}

const n = (x: number) => x.toLocaleString("en-US", { maximumFractionDigits: 2 })
const qty = (label: string, ids: ConstantId[], billions = false): HybridComponent => {
  const product = ids.reduce((p, id) => p * v(id), 1)
  return {
    label,
    amount: billions ? product : product / 1e9,
    formula: ids.map((id) => n(v(id))).join(" × "),
    inputs: ids,
  }
}
const lump = (label: string, id: ConstantId): HybridComponent => ({
  label,
  amount: v(id),
  formula: `$${n(v(id))}B`,
  inputs: [id],
})
const oneTime = (
  id: string,
  label: string,
  stepId: string,
  basis: string,
  components: HybridComponent[],
): HybridOneTime => ({
  id,
  label,
  stepId,
  basis,
  components,
  total: components.reduce((s, c) => s + c.amount, 0),
})

export const HYBRID_ONE_TIME: HybridOneTime[] = [
  oneTime(
    "hy-regulator",
    "Plan regulator start-up",
    "create-regulator",
    "Staff hired and trained before plan fees fund the regulator, plus the technology-assessment institute and patient advocate.",
    [
      qty("Regulator staff hired ahead of steady-state funding", [
        "regulatorStaff",
        "agencyLoadedCost",
        "agencyPreFundedYears",
      ]),
      lump("Technology-assessment institute & patient advocate start-up", "boardsStartup"),
    ],
  ),
  oneTime(
    "hy-systems",
    "Eligibility, enrollment & risk-adjustment systems",
    "eligibility-data-hub",
    "A shared eligibility service every plan and provider can query, the data feeds for automatic enrollment, and the risk-adjustment system. Plans keep their own claims systems.",
    [
      lump("Real-time eligibility service & provider portal", "itEligibilityApi"),
      lump("Risk-adjustment and plan-data system", "riskAdjustmentSystem"),
      lump("Independent verification, load & parallel testing", "itVerification"),
      lump("Cybersecurity and redundancy", "itSecurity"),
    ],
  ),
  oneTime(
    "hy-enrollment",
    "Enrollment cards, outreach & assisters",
    "auto-enrollment",
    "Cards and notices for the people newly enrolled, a multilingual campaign, and in-person help for hard-to-reach groups.",
    [
      {
        label: "Cards for the newly covered",
        amount: (HYBRID_COST.newlyCovered * 1e6 * v("cardCost")) / 1e9,
        formula: `${n(HYBRID_COST.newlyCovered)}M people × $${n(v("cardCost"))}`,
        inputs: ["cardCost"],
      },
      lump("Multilingual outreach campaign", "outreachCampaign"),
      qty("In-person enrollment assisters", ["assisters", "assisterCost", "assisterYears"]),
    ],
  ),
]

export const hybridOneTime = (id: string) => HYBRID_ONE_TIME.find((c) => c.id === id)!.total
export const HYBRID_ONE_TIME_TOTAL = HYBRID_ONE_TIME.reduce((s, c) => s + c.total, 0)

/** Short helpers for prose. */
export const H = {
  national: fmt(HYBRID_COST.delta, { sign: true }),
  federal: fmt(HYBRID_COST.federalDelta),
  federalSigned: fmt(HYBRID_COST.federalDelta, { sign: true }),
  topEnd: fmt(HYBRID_COST.funding?.revenue ?? 0),
  surplus: fmt(-(HYBRID_COST.fundingGap ?? 0)),
  newlyCovered: `${HYBRID_COST.newlyCovered.toFixed(1)} million`,
  coverage: fmt(hybridLine("coverage").delta, { sign: true }),
  coverageFederal: fmt(hybridLine("coverage").federal),
  priceCap: fmt(hybridLine("providerPrices").delta, { sign: true }),
  drugs: fmt(hybridLine("drugPrices").delta, { sign: true }),
  drugsFederal: fmt(hybridLine("drugPrices").federal, { sign: true }),
  overhead: fmt(hybridLine("overhead").delta, { sign: true }),
  workforce: fmt(hybridLine("workforce").delta),
  oneTimeTotal: fmt(HYBRID_ONE_TIME_TOTAL),
}
