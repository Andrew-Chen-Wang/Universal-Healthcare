import { DERIVED, householdExemption, show, v } from "./constants"
import { MODEL } from "./model"

/**
 * Household and employer examples. Each line item is computed from the plan's
 * tax rates in model.ts, so changing a rate there changes every example.
 *
 * Two views:
 *  - "Year 1 after the switch": wages haven't adjusted yet except as required
 *    by maintenance of compensation.
 *  - "Long run": employer costs are passed into wages (the economists' standard
 *    assumption). Workers at employers that never offered coverage see slower
 *    wage growth as the employer tax is passed through.
 */

const EMPLOYER_FICA = v("employerFica")
const EMPLOYEE_FICA = v("employeeFica")
export { householdExemption }

export type HouseholdInput = {
  id: string
  name: string
  description: string
  size: number
  /** Adjusted gross income before the reform. */
  agi: number
  /** Wages subject to the employer tax (0 if retired). */
  wages: number
  /** Employer's annual premium contribution for this household (hidden compensation). */
  employerPremium: number
  /** Share of this worker's wages the employer pays the new tax on (accounts for the $250k payroll exemption). */
  employerTaxableShare: number
  /** Employee premium contributions paid pre-tax through payroll. */
  employeePremiumPreTax: number
  /** Other premiums: Marketplace (after subsidy), Medigap, Medicare Part B & D. */
  otherPremiums: number
  /** Share of otherPremiums that was tax-deductible (self-employed health deduction). */
  otherPremiumsDeductibleShare: number
  /** Out-of-pocket for services UHP will cover. */
  coveredOutOfPocket: number
  /** Self-employment income subject to the employer-equivalent tax above $50k. */
  selfEmploymentIncome: number
  /** Marginal federal income tax rate. */
  federalRate: number
  stateRate: number
  /** Income above $1M that would be capital gains taxed at ordinary rates under the plan. */
  capitalGainsAboveMillion: number
  notes: string[]
}

export type LineItem = { label: string; amount: number; explanation: string }

export type HouseholdResult = HouseholdInput & {
  shortRun: LineItem[]
  longRun: LineItem[]
  shortRunNet: number
  longRunNet: number
}

export function computeHousehold(h: HouseholdInput): HouseholdResult {
  const r = MODEL.rates
  const employerTax = h.wages * h.employerTaxableShare * r.employerTaxRate
  const employerSavings = h.employerPremium - employerTax
  // Wages move by the employer's savings net of the employer's own payroll tax on
  // the new wages. Positive for offering employers, negative for non-offering.
  const wageChangeLongRun = (employerSavings * r.wagePassThrough) / (1 + EMPLOYER_FICA)
  // In Year 1, maintenance of compensation forces offering employers to pass through
  // savings; non-offering employers' tax isn't yet reflected in wages.
  const wageChangeShortRun = employerSavings > 0 ? employerSavings / (1 + EMPLOYER_FICA) : 0

  const seTax = Math.max(0, h.selfEmploymentIncome - v("seThreshold")) * r.employerTaxRate

  function build(wageChange: number): LineItem[] {
    const newlyTaxable =
      wageChange + h.employeePremiumPreTax + h.otherPremiums * h.otherPremiumsDeductibleShare
    const payrollTaxed = wageChange + h.employeePremiumPreTax
    const incomeTax = newlyTaxable * (h.federalRate + h.stateRate)
    const fica = payrollTaxed * EMPLOYEE_FICA
    const newAgi = h.agi + newlyTaxable
    const premium = Math.max(0, newAgi - householdExemption(h.size)) * r.householdPremiumRate
    const surtax = Math.max(0, newAgi - v("surtaxThreshold")) * v("surtaxRate")
    const capGains = h.capitalGainsAboveMillion * (v("topRateOrdinary") - v("topRateCapGains"))

    const items: LineItem[] = [
      {
        label: "Worker premium contributions end",
        amount: h.employeePremiumPreTax,
        explanation: "Paycheck deductions for health insurance stop.",
      },
      {
        label: "Other premiums end",
        amount: h.otherPremiums,
        explanation: "Marketplace, Medigap, and Medicare Part B/D premiums.",
      },
      {
        label: "Covered out-of-pocket costs end",
        amount: h.coveredOutOfPocket,
        explanation: "Deductibles, copays, coinsurance, and uncovered dental, vision, and hearing.",
      },
      {
        label:
          wageChange >= 0
            ? "Wage increase from employer savings"
            : "Slower wage growth from employer tax",
        amount: wageChange,
        explanation:
          wageChange >= 0
            ? `Employer paid $${Math.round(h.employerPremium).toLocaleString()} in premiums and now owes $${Math.round(employerTax).toLocaleString()} in health payroll tax on this worker; the difference, net of the employer's own 7.65% FICA, becomes wages.`
            : `Employer owes $${Math.round(employerTax).toLocaleString()} in new health payroll tax on this worker; over time that is passed into lower wage growth.`,
      },
      {
        label: "Income tax on newly taxable compensation",
        amount: -incomeTax,
        explanation: "Premiums were paid with pre-tax dollars; wages are taxed. Federal + state.",
      },
      {
        label: "Employee FICA on newly taxable compensation",
        amount: -fica,
        explanation:
          "7.65% Social Security and Medicare. The Social Security part also raises future benefits.",
      },
      {
        label: "Income-based health premium",
        amount: -premium,
        explanation: `${(r.householdPremiumRate * 100).toFixed(1)}% of AGI above the $${householdExemption(h.size).toLocaleString()} exemption for a household of ${h.size}.`,
      },
    ]
    if (seTax > 0)
      items.push({
        label: "Self-employed health payroll tax",
        amount: -seTax,
        explanation: "Employer-equivalent tax on net self-employment income above $50,000.",
      })
    if (surtax > 0)
      items.push({
        label: "7% surtax on income above $1M",
        amount: -surtax,
        explanation: "Top-end measure.",
      })
    if (capGains > 0)
      items.push({
        label: "Capital gains taxed as ordinary income above $1M",
        amount: -capGains,
        explanation: "37% instead of 20% on gains above the threshold.",
      })
    return items.filter((i) => Math.abs(i.amount) >= 1)
  }

  const shortRun = build(wageChangeShortRun)
  const longRun = build(wageChangeLongRun)
  return {
    ...h,
    shortRun,
    longRun,
    shortRunNet: shortRun.reduce((s, i) => s + i.amount, 0),
    longRunNet: longRun.reduce((s, i) => s + i.amount, 0),
  }
}

const HOUSEHOLD_INPUTS: HouseholdInput[] = [
  {
    id: "family-esi-100k",
    name: "Family of four, $100k, job-based coverage",
    description: "Two parents (one earner at a large employer), two children, typical family plan.",
    size: 4,
    agi: 100_000,
    wages: 100_000,
    employerPremium: DERIVED.employerFamilyPremium,
    employerTaxableShare: 1,
    employeePremiumPreTax: v("workerFamilyContribution"),
    otherPremiums: 0,
    otherPremiumsDeductibleShare: 0,
    coveredOutOfPocket: 3_000,
    selfEmploymentIncome: 0,
    federalRate: 0.12,
    stateRate: 0.04,
    capitalGainsAboveMillion: 0,
    notes: [
      `Premiums from KFF's 2025 Employer Health Benefits Survey: ${show("familyPremium")} total, worker share ${show("workerFamilyContribution")}.`,
      "Out-of-pocket is a typical figure for a family with a deductible plan; families with a serious illness hit the out-of-pocket maximum (up to $18,400 in 2025).",
    ],
  },
  {
    id: "single-esi-45k",
    name: "Single worker, $45k, job-based coverage",
    description: "Works at a large employer, single coverage.",
    size: 1,
    agi: 45_000,
    wages: 45_000,
    employerPremium: DERIVED.employerSinglePremium,
    employerTaxableShare: 1,
    employeePremiumPreTax: v("workerSingleContribution"),
    otherPremiums: 0,
    otherPremiumsDeductibleShare: 0,
    coveredOutOfPocket: 1_000,
    selfEmploymentIncome: 0,
    federalRate: 0.12,
    stateRate: 0.04,
    capitalGainsAboveMillion: 0,
    notes: [
      `KFF 2025: single premium ${show("singlePremium")}, worker share ${show("workerSingleContribution")}.`,
    ],
  },
  {
    id: "family-marketplace-60k",
    name: "Family of four, $60k, Marketplace plan",
    description:
      "Earner works at a 15-person firm that doesn't offer insurance (payroll $600k); family buys a subsidized silver plan.",
    size: 4,
    agi: 60_000,
    wages: 60_000,
    employerPremium: 0,
    employerTaxableShare: (600_000 - v("payrollExemption")) / 600_000,
    employeePremiumPreTax: 0,
    otherPremiums: 2_400,
    otherPremiumsDeductibleShare: 0,
    coveredOutOfPocket: 2_500,
    selfEmploymentIncome: 0,
    federalRate: 0.1,
    stateRate: 0.04,
    capitalGainsAboveMillion: 0,
    notes: [
      "This family gains in the short run, but in the long run the employer's new tax slows their wage growth. That is the cost of covering workers whose employers paid nothing before.",
    ],
  },
  {
    id: "retired-couple",
    name: "Retired couple, $50k AGI, Medicare + Medigap",
    description: "Both 70, traditional Medicare with Medigap Plan G and Part D.",
    size: 2,
    agi: 50_000,
    wages: 0,
    employerPremium: 0,
    employerTaxableShare: 0,
    employeePremiumPreTax: 0,
    otherPremiums: 2 * (DERIVED.partBAnnual + DERIVED.partDAnnual + DERIVED.medigapAnnual),
    otherPremiumsDeductibleShare: 0,
    coveredOutOfPocket: 2_500,
    selfEmploymentIncome: 0,
    federalRate: 0.12,
    stateRate: 0.03,
    capitalGainsAboveMillion: 0,
    notes: [
      `Part B ${show("partBMonthly")}/month each (2025), Part D about $50/month each, Medigap about $200/month each.`,
      "Out-of-pocket includes dental, hearing aids, and glasses that Medicare doesn't cover.",
    ],
  },
  {
    id: "medicaid-family-30k",
    name: "Family of three, $30k, Medicaid",
    description:
      "Parent works part-time at a large retailer that doesn't offer coverage to part-timers; family is on Medicaid.",
    size: 3,
    agi: 30_000,
    wages: 30_000,
    employerPremium: 0,
    employerTaxableShare: 1,
    employeePremiumPreTax: 0,
    otherPremiums: 0,
    otherPremiumsDeductibleShare: 0,
    coveredOutOfPocket: 200,
    selfEmploymentIncome: 0,
    federalRate: 0,
    stateRate: 0.02,
    capitalGainsAboveMillion: 0,
    notes: [
      "Money barely changes in the short run (a small new premium). The gain is access: physicians who refused Medicaid now accept this family's card.",
      "Long run: if the employer passes the new tax into wages, this family is worse off financially. A minimum wage limits how far wages can fall, so some of the cost would instead fall on prices or profits. This is one of the plan's most uncomfortable trade-offs.",
    ],
  },
  {
    id: "high-earner-400k",
    name: "High-earning family, $400k, job-based coverage",
    description: "One earner at a large employer, family plan, two children.",
    size: 4,
    agi: 400_000,
    wages: 400_000,
    employerPremium: DERIVED.employerFamilyPremium,
    employerTaxableShare: 1,
    employeePremiumPreTax: v("workerFamilyContribution"),
    otherPremiums: 0,
    otherPremiumsDeductibleShare: 0,
    coveredOutOfPocket: 3_000,
    selfEmploymentIncome: 0,
    federalRate: 0.32,
    stateRate: 0.06,
    capitalGainsAboveMillion: 0,
    notes: [
      "The employer tax on a $400k salary ($30,000) exceeds the family premium ($20,143), so total compensation falls in the long run.",
      "Today's flat premium is a much smaller share of this family's income than of a $60k family's. That is why this family pays more.",
    ],
  },
  {
    id: "self-employed-80k",
    name: "Self-employed, $80k, unsubsidized Marketplace",
    description: "Single freelancer above the subsidy cliff buying their own plan.",
    size: 1,
    agi: 80_000,
    wages: 0,
    employerPremium: 0,
    employerTaxableShare: 0,
    employeePremiumPreTax: 0,
    otherPremiums: 6_500,
    otherPremiumsDeductibleShare: 1,
    coveredOutOfPocket: 2_500,
    selfEmploymentIncome: 80_000,
    federalRate: 0.22,
    stateRate: 0.05,
    capitalGainsAboveMillion: 0,
    notes: ["The self-employed health insurance deduction disappears along with the premium."],
  },
  {
    id: "millionaire",
    name: "Very high income, $3M AGI",
    description: "Executive with $500k salary, $2.5M in capital gains and dividends, family plan.",
    size: 4,
    agi: 3_000_000,
    wages: 500_000,
    employerPremium: DERIVED.employerFamilyPremium,
    employerTaxableShare: 1,
    employeePremiumPreTax: v("workerFamilyContribution"),
    otherPremiums: 0,
    otherPremiumsDeductibleShare: 0,
    coveredOutOfPocket: 3_000,
    selfEmploymentIncome: 0,
    federalRate: 0.37,
    stateRate: 0.09,
    capitalGainsAboveMillion: 2_000_000,
    notes: [
      "Behavioral responses (timing gains, moving income offshore) would reduce what this household actually pays; the revenue estimate already discounts for that.",
    ],
  },
]

export const HOUSEHOLDS: HouseholdResult[] = HOUSEHOLD_INPUTS.map(computeHousehold)

export type EmployerExample = {
  id: string
  name: string
  description: string
  payroll: number
  premiumsBefore: number
  taxAfter: number
  change: number
  notes: string
}

function employer(
  id: string,
  name: string,
  description: string,
  payroll: number,
  premiumsBefore: number,
  notes: string,
): EmployerExample {
  const taxAfter = Math.max(0, payroll - v("payrollExemption")) * MODEL.rates.employerTaxRate
  return {
    id,
    name,
    description,
    payroll,
    premiumsBefore,
    taxAfter,
    change: premiumsBefore - taxAfter,
    notes,
  }
}

export const EMPLOYERS: EmployerExample[] = [
  employer(
    "small-none",
    "Small business, no coverage",
    "12 employees, $550k payroll, doesn't offer insurance.",
    550_000,
    0,
    "A new cost of $22,500 a year (4.1% of payroll). Its workers gain coverage they didn't have.",
  ),
  employer(
    "small-offer",
    "Small business, offers coverage",
    "15 employees, $750k payroll, 10 enrolled at about $15k employer share each.",
    750_000,
    150_000,
    "Saves heavily and must pass savings to wages for 3 years.",
  ),
  employer(
    "large",
    "Large employer",
    "10,000 employees, $750M payroll, 80% enrolled at about $15,500 employer share.",
    750_000_000,
    124_000_000,
    "Saves about 9% of payroll; also exits benefits administration.",
  ),
  employer(
    "high-wage",
    "High-wage tech firm",
    "2,000 employees averaging $220k, 85% enrolled at about $18,000 employer share.",
    440_000_000,
    30_600_000,
    `Pays more: ${show("employerTaxRate")} of very high wages exceeds per-person premiums. High-wage industries subsidize low-wage ones.`,
  ),
  employer(
    "state-gov",
    "State government",
    "100,000 employees, $7B payroll, plus retirees, about $1.8B in active and retiree premiums.",
    7_000_000_000,
    1_800_000_000,
    "Also sheds retiree-health (OPEB) liabilities and pays its Medicaid MOE instead of its Medicaid share.",
  ),
]

/** Federal marginal rate for a married couple filing jointly at a given wage (2025 brackets, rough). */
function mfjRate(wage: number) {
  if (wage < 50_000) return 0.1
  if (wage < 130_000) return 0.12
  if (wage < 240_000) return 0.22
  if (wage < 420_000) return 0.24
  if (wage < 530_000) return 0.32
  return 0.35
}

/** A family of four with typical employer family coverage at a given wage. */
export function esiFamilyAt(wage: number) {
  return computeHousehold({
    id: `grid-${wage}`,
    name: `Family of four, ${wage}`,
    description: "",
    size: 4,
    agi: wage,
    wages: wage,
    employerPremium: DERIVED.employerFamilyPremium,
    employerTaxableShare: 1,
    employeePremiumPreTax: v("workerFamilyContribution"),
    otherPremiums: 0,
    otherPremiumsDeductibleShare: 0,
    coveredOutOfPocket: 3_000,
    selfEmploymentIncome: 0,
    federalRate: mfjRate(wage),
    stateRate: 0.04,
    capitalGainsAboveMillion: 0,
    notes: [],
  })
}

export const INCOME_GRID = [
  30_000, 50_000, 75_000, 100_000, 150_000, 200_000, 250_000, 300_000, 400_000, 600_000,
].map((w) => {
  const r = esiFamilyAt(w)
  return { wage: w, shortRun: r.shortRunNet, longRun: r.longRunNet }
})

/** Wage at which a typical employer-covered family of four breaks even in the long run (bisection). */
export const ESI_BREAK_EVEN = (() => {
  let lo = 50_000
  let hi = 1_000_000
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (esiFamilyAt(mid).longRunNet > 0) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
})()
