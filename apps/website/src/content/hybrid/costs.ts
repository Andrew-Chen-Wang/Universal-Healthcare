/**
 * Hybrid plan: cost items, each with its arithmetic, built from the reform
 * model's lines for the current draft picks and the hybrid's one-time costs.
 */
import { NHE_TOTAL_2024 } from "../baseline"
import type { CalcStep, CostItem } from "../calculations"
import { type ConstantId, DERIVED, show, v } from "../constants"
import { fmt } from "../model"
import { H, HYBRID_COST, HYBRID_ONE_TIME, hybridLine } from "./figures"

const usd = (x: number) => `$${Math.round(x).toLocaleString("en-US")}`
const items: CostItem[] = []
const add = (c: CostItem) => items.push(c)

const fromLine = (
  lineId: string,
  id: string,
  stepId: string,
  kind: CostItem["kind"],
  title: string,
  tradeoff: string,
) => {
  const l = hybridLine(lineId)
  if (!l.id) return
  add({
    id,
    title,
    stepId,
    kind,
    summary: l.explanation,
    amount: l.delta,
    amountUnit: "B",
    calc: l.steps ?? [{ label: l.label, value: l.delta, unit: "B", result: true }],
    tradeoff,
    sourceIds: l.sourceIds,
  })
}

fromLine(
  "coverage",
  "hy-coverage",
  "auto-enrollment",
  "spending",
  "Care for the newly covered",
  "More care for people who go without today, at the cost of higher national spending and federal subsidies.",
)
fromLine(
  "providerPrices",
  "hy-price-cap",
  "commercial-price-cap",
  "saving",
  "Cap on commercial prices",
  "Lower employer premiums vs. revenue for the highest-priced hospitals.",
)
fromLine(
  "drugPrices",
  "hy-drugs",
  "national-formulary",
  "saving",
  "Negotiated drug prices for every payer",
  "Lower drug spending vs. somewhat fewer new drugs over decades.",
)
fromLine(
  "overhead",
  "hy-overhead",
  "insurer-conversion",
  "saving",
  "Private insurer overhead",
  "Lower premiums vs. insurer, broker, and marketing jobs.",
)

// Federal subsidies for the newly covered.
const cov = hybridLine("coverage")
if (cov.id)
  add({
    id: "hy-subsidies",
    title: "Federal subsidies for the newly covered",
    stepId: "income-based-premiums",
    kind: "spending",
    summary: `The whole premium for everyone newly covered, ${fmt(cov.federal)} a year: an upper bound, since income-based premiums pay part of it.`,
    amount: cov.federal,
    amountUnit: "B",
    calc: (cov.steps ?? []).filter((s) => !s.label.startsWith("Change in national")),
    tradeoff: "Affordable coverage for people without it vs. federal cost paid by top-end taxes.",
    sourceIds: cov.sourceIds,
  })

// Workforce.
const wf: [string, ConstantId, ConstantId][] = [
  ["Residency slots", "residencySlots", "residencyCostPerSlot"],
  ["Nursing faculty", "nursingFaculty", "nursingFacultyCost"],
  ["Clinical placements", "clinicalPlacements", "clinicalPlacementCost"],
  ["Service scholars", "serviceScholars", "serviceScholarCost"],
  ["Community health workers", "communityHealthWorkers", "chwCost"],
]
add({
  id: "hy-workforce",
  title: "Workforce capacity investment",
  stepId: "workforce-start",
  kind: "spending",
  summary: `${H.workforce} a year for residency slots, nursing faculty, clinical placements, service scholars, and community health workers: the same program as the single-payer plan.`,
  amount: DERIVED.workforceInvestment,
  amountUnit: "B",
  calc: [
    ...wf.map(
      ([label, q, c]): CalcStep => ({
        label,
        formula: `${v(q).toLocaleString("en-US")} × ${usd(v(c))}`,
        value: (v(q) * v(c)) / 1e9,
        unit: "B",
        inputs: [q, c],
      }),
    ),
    { label: "Total a year", value: DERIVED.workforceInvestment, unit: "B", result: true },
  ],
  tradeoff: "Spending on capacity years before it pays off, to keep waits from rising.",
  sourceIds: ["aamc-shortage", "hrsa-nursing"],
})

// Top-end taxes.
add({
  id: "hy-top-end-taxes",
  title: "Top-end taxes",
  stepId: "tax-legislation",
  kind: "revenue",
  summary: HYBRID_COST.funding?.explanation ?? "",
  amount: HYBRID_COST.funding?.revenue ?? 0,
  amountUnit: "B",
  calc: [
    {
      label: `Income above ${show("surtaxThreshold")} per return, summed`,
      value: v("incomeAboveMillion"),
      unit: "B",
      inputs: ["incomeAboveMillion"],
      sourceIds: ["tpc-surtax"],
    },
    {
      label: "Surtax revenue",
      formula: `${fmt(v("incomeAboveMillion"))} × ${show("surtaxRate")}`,
      value: DERIVED.surtaxRevenue,
      unit: "B",
      inputs: ["surtaxRate"],
    },
    {
      label: `Capital gains and dividends taxed as ordinary income above ${show("surtaxThreshold")}`,
      value: v("capGainsRevenue"),
      unit: "B",
      inputs: ["capGainsRevenue"],
      sourceIds: ["jct-capital-gains"],
    },
    { label: "Total a year", value: HYBRID_COST.funding?.revenue ?? 0, unit: "B", result: true },
  ],
  tradeoff: `No household below ${show("surtaxThreshold")} pays a new tax vs. a narrow, volatile revenue base.`,
  sourceIds: HYBRID_COST.funding?.sourceIds ?? [],
})

// Federal balance.
add({
  id: "hy-federal-balance",
  title: "Federal cost vs. top-end taxes",
  stepId: "full-tax-rates",
  kind: "budget",
  summary: `New federal cost of ${H.federal} a year against ${H.topEnd} of top-end taxes: a surplus of ${H.surplus}, held as a reserve.`,
  amount: -(HYBRID_COST.fundingGap ?? 0),
  amountUnit: "B",
  calc: [
    ...HYBRID_COST.lines.map(
      (l): CalcStep => ({ label: `Federal: ${l.label}`, value: l.federal, unit: "B" }),
    ),
    { label: "New federal cost", value: HYBRID_COST.federalDelta, unit: "B", result: true },
    { label: "Top-end taxes", value: HYBRID_COST.funding?.revenue ?? 0, unit: "B" },
    {
      label: "Surplus (negative: still to fund)",
      value: -(HYBRID_COST.fundingGap ?? 0),
      unit: "B",
      result: true,
    },
  ],
  tradeoff: "A reserve guards against shortfalls; a lower surtax would return the money instead.",
  sourceIds: ["tpc-surtax", "jct-capital-gains"],
})

// National spending.
add({
  id: "hy-national",
  title: "National health spending",
  stepId: "spending-target",
  kind: "budget",
  summary: `The draft's priced lines change national spending by ${H.national} a year, against ${fmt(NHE_TOTAL_2024)} in 2024. Picks with no cost input aren't included.`,
  amount: HYBRID_COST.delta,
  amountUnit: "B",
  before: NHE_TOTAL_2024,
  after: HYBRID_COST.nationalAfter,
  calc: [
    {
      label: "National health spending, 2024",
      value: NHE_TOTAL_2024,
      unit: "B",
      sourceIds: ["cms-nhe-2024"],
    },
    ...HYBRID_COST.lines.map((l): CalcStep => ({ label: l.label, value: l.delta, unit: "B" })),
    { label: "After", value: HYBRID_COST.nationalAfter, unit: "B", result: true },
  ],
  tradeoff: "Savings depend on drug negotiation and overhead limits holding.",
  sourceIds: ["cms-nhe-2024"],
})

// A family with employer coverage.
const premiumChange = HYBRID_COST.privateAfter / HYBRID_COST.privateBefore - 1
add({
  id: "hy-family-premium",
  title: "A family with an employer plan",
  stepId: "employer-mandate",
  kind: "household",
  summary: `Private insurance spending falls ${(-premiumChange * 100).toFixed(1)}% from the price cap, drug prices, and overhead limits, so the average family premium falls by about ${usd(-premiumChange * v("familyPremium"))} a year, shared between employer and worker. No new tax applies below ${show("surtaxThreshold")} of income.`,
  amount: -premiumChange * v("familyPremium"),
  amountUnit: "$",
  calc: [
    {
      label: "Private insurance spending, 2024 (benefits plus overhead)",
      value: HYBRID_COST.privateBefore,
      unit: "B",
      sourceIds: ["cms-nhe-2024"],
    },
    {
      label: "After the hybrid's price, drug, and overhead changes",
      value: HYBRID_COST.privateAfter,
      unit: "B",
    },
    {
      label: "Change",
      formula: `${fmt(HYBRID_COST.privateAfter)} ÷ ${fmt(HYBRID_COST.privateBefore)} − 1`,
      value: premiumChange,
      unit: "%",
    },
    {
      label: "Average family premium, employer plan",
      value: v("familyPremium"),
      unit: "$",
      inputs: ["familyPremium"],
      sourceIds: ["kff-ehbs-2025"],
    },
    {
      label: "Premium saving a year",
      formula: `${usd(v("familyPremium"))} × ${(-premiumChange * 100).toFixed(1)}%`,
      value: -premiumChange * v("familyPremium"),
      unit: "$",
      result: true,
    },
  ],
  tradeoff: "Premiums fall if savings pass through to plans; insurers and hospitals keep less.",
  sourceIds: ["kff-ehbs-2025"],
})

// One-time costs.
for (const c of HYBRID_ONE_TIME)
  add({
    id: c.id,
    title: c.label,
    stepId: c.stepId,
    kind: "one-time",
    summary: c.basis,
    amount: c.total,
    amountUnit: "B",
    calc: [
      ...c.components.map(
        (x): CalcStep => ({
          label: x.label,
          formula: x.formula,
          value: x.amount,
          unit: "B",
          inputs: x.inputs,
        }),
      ),
      { label: "Total, one-time", value: c.total, unit: "B", result: true },
    ],
    tradeoff: "Spending before the plans open so they work on day one.",
    sourceIds: [],
  })

export const HY_COST_ITEMS = items
