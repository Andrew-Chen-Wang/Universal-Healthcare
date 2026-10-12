import { SPONSOR_LINES_2024 } from "./baseline"
import { MODEL } from "./model"

/**
 * The federal budget view: how much health money flows through the federal
 * government before and after. Under single payer nearly all health spending
 * becomes federal outlays, which is why headline federal-cost numbers are huge
 * even when national spending barely changes.
 */
const src = (id: string) => MODEL.sourceLines.find((l) => l.id === id)!
const use = (id: string) => MODEL.useLines.find((l) => l.id === id)!

export type FiscalLine = { label: string; before: number; after: number; note: string }

const MEDICARE_TOTAL_2024 = 1118
const STATE_BUY_IN_2024 = SPONSOR_LINES_2024.find((l) => l.id === "slBuyIn")!.amount

export const FEDERAL_OUTLAYS: FiscalLine[] = [
  {
    label: "Medicare benefits & administration",
    before: MEDICARE_TOTAL_2024,
    after: 0,
    note: "Absorbed into UHP.",
  },
  {
    label: "Federal share of Medicaid & buy-ins",
    before: src("fedMedicaid").before + src("fedBuyIn").before,
    after: 0,
    note: "Absorbed into UHP. Before the plan, buy-ins are paid by Medicaid to Medicare and appear in both outlays and premium receipts.",
  },
  {
    label: "Marketplace tax credits & subsidies",
    before: src("fedMarketplace").before,
    after: 0,
    note: "Absorbed into UHP.",
  },
  {
    label: "FEHB employer premiums",
    before: src("fedEsi").before,
    after: 0,
    note: "Replaced by federal employer payroll tax (a transfer within government, shown as outlay below).",
  },
  {
    label: "Federal employer payroll tax (to UHP)",
    before: 0,
    after: src("fedPayroll").after,
    note: "Intragovernmental; counted for completeness.",
  },
  {
    label: "UHP benefits",
    before: 0,
    after: MODEL.headline.uhpBenefits,
    note: "Every covered service for every resident.",
  },
  { label: "UHP administration", before: 0, after: MODEL.headline.uhpAdmin, note: "" },
  { label: "Workforce investment", before: 0, after: use("workforce").after, note: "" },
  {
    label: "VA, DoD, IHS, CHIP & other federal programs",
    before:
      src("fedPrograms").before +
      src("fedPublicHealth").before +
      src("fedOther").before +
      src("fedRds").before,
    after: src("fedPrograms").after + src("fedPublicHealth").after + src("fedOther").after,
    note: "Continue.",
  },
]

export const DEDICATED_RECEIPTS: FiscalLine[] = [
  {
    label: "Medicare payroll taxes (HI)",
    before: src("bizHi").before + src("hhHi").before + src("fedHi").before + src("slHi").before,
    after: src("bizHi").after + src("hhHi").after + src("fedHi").after + src("slHi").after,
    note: "Continue to the UHP Trust Fund.",
  },
  {
    label: "Medicare premiums",
    before: src("hhSmi").before + src("fedBuyIn").before + STATE_BUY_IN_2024,
    after: 0,
    note: "Part B/D premiums and Medicaid buy-ins end. The federal buy-in appropriation is redirected to UHP (an intragovernmental transfer, netted out after); the state buy-in becomes part of MOE.",
  },
  {
    label: "Employer health payroll tax",
    before: 0,
    after: MODEL.side.employerTax,
    note: "Includes federal and state & local employers.",
  },
  {
    label: "Household income-based premium",
    before: 0,
    after: MODEL.side.householdPremium,
    note: "",
  },
  {
    label: "Income tax on former premium dollars",
    before: 0,
    after: src("hhIncomeTax").after,
    note: "",
  },
  { label: "Top-end taxes", before: 0, after: src("hhTopSurtax").after, note: "" },
  {
    label: "State maintenance of effort",
    before: 0,
    after: src("slMoe").after,
    note: "States paid this to their own Medicaid programs before.",
  },
]

const sum = (xs: FiscalLine[], k: "before" | "after") => xs.reduce((s, x) => s + x[k], 0)

export const FEDERAL = {
  outlaysBefore: sum(FEDERAL_OUTLAYS, "before"),
  outlaysAfter: sum(FEDERAL_OUTLAYS, "after"),
  receiptsBefore: sum(DEDICATED_RECEIPTS, "before"),
  receiptsAfter: sum(DEDICATED_RECEIPTS, "after"),
}
export const GENERAL_FUND_BEFORE = FEDERAL.outlaysBefore - FEDERAL.receiptsBefore
export const GENERAL_FUND_AFTER = FEDERAL.outlaysAfter - FEDERAL.receiptsAfter

/**
 * Ten-year window. CMS projects NHE growing about 5.6% a year on average over
 * 2024–2033 (to about $8.6T in 2033). We scale 2024-dollar steady-state flows by
 * that growth for 2027–2036, as if the program were fully in place, to compare
 * with CBO, Urban, and Mercatus 10-year federal estimates.
 */
export const NHE_GROWTH = 0.056
export const WINDOW = Array.from({ length: 10 }, (_, i) => 2027 + i)
export const WINDOW_FACTOR = WINDOW.reduce((s, y) => s + (1 + NHE_GROWTH) ** (y - 2024), 0)

export const TEN_YEAR = {
  outlayIncrease: (FEDERAL.outlaysAfter - FEDERAL.outlaysBefore) * WINDOW_FACTOR,
  newDedicatedRevenue: (FEDERAL.receiptsAfter - FEDERAL.receiptsBefore) * WINDOW_FACTOR,
  generalFundIncrease: (GENERAL_FUND_AFTER - GENERAL_FUND_BEFORE) * WINDOW_FACTOR,
  nationalSpendingChange: MODEL.headline.delta * WINDOW_FACTOR,
  householdOutOfPocketSaved: (src("hhOop").before - src("hhOop").after) * WINDOW_FACTOR,
  premiumsEliminated:
    (src("bizEsi").before +
      src("hhEsi").before +
      src("hhDirect").before +
      src("hhSmi").before +
      src("fedEsi").before +
      src("slEsi").before) *
    WINDOW_FACTOR,
}
