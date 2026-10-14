/**
 * The steady-state financial model of the plan.
 *
 * Method: take the CMS 2024 National Health Expenditure tables (baseline.ts) and
 * ask "what would 2024 have looked like if the fully phased-in Universal Health
 * Program (UHP) had been in place?" Every number on the site derives from the
 * assumptions in this file, so changing one assumption changes every page.
 *
 * For each type of service:
 *   1. Convert each payer's dollars into "reference-price volume" by dividing by
 *      that payer's price relative to the reference price (Medicare for medical
 *      services, average private fee for dental, Medicare net price for drugs).
 *   2. New UHP spending = volume x UHP payment rate x utilization multiplier.
 *   3. Spending that stays outside UHP (non-covered out-of-pocket items, VA/DoD,
 *      other third-party programs) is carried over unchanged.
 *
 * The change for each service therefore splits exactly into a "price effect"
 * (same care, new prices) and a "utilization effect" (more care).
 */
import {
  type Payer,
  type ServiceId,
  type SponsorId,
  NHE_TOTAL_2024,
  POPULATION_2024_MILLIONS,
  SERVICES_2024,
  SPONSOR_LINES_2024,
} from "./baseline"
import { DERIVED, show, TOP_END_REVENUE, v } from "./constants"

export type Confidence = "high" | "medium" | "low"

export type Assumption = {
  id: string
  label: string
  value: number
  unit: "ratio" | "share" | "billions" | "dollars" | "rate" | "millions" | "count"
  low: number
  high: number
  confidence: Confidence
  rationale: string
  sourceIds: string[]
}

/** Payers whose spending UHP absorbs for covered services. */
const ABSORBED_PAYERS = ["privateInsurance", "medicare", "medicaid", "outOfPocket"] as const
type AbsorbedPayer = (typeof ABSORBED_PAYERS)[number]

export type ServiceAssumption = {
  id: ServiceId
  /** What "1.0" means for this service's price index. */
  reference: string
  /** Price each payer paid in 2024 relative to the reference price. */
  relativePrice: Record<AbsorbedPayer, number>
  /** Share of out-of-pocket dollars for items UHP will not cover. */
  retainedOutOfPocketShare: number
  /** UHP payment rate relative to the reference price. */
  uhpRate: number
  /** Multiplier on volume of care once coverage is universal with no cost sharing. */
  utilization: number
  notes: string
  sourceIds: string[]
}

export const SERVICE_ASSUMPTIONS: ServiceAssumption[] = [
  {
    id: "hospital",
    reference: "Medicare fee-for-service rates",
    relativePrice: {
      privateInsurance: v("privateHospitalMultiple"),
      medicare: 1,
      medicaid: v("medicaidHospitalIndex"),
      outOfPocket: 1.6,
    },
    retainedOutOfPocketShare: 0,
    uhpRate: v("hospitalRate"),
    utilization: 1.04,
    notes: `Private insurers paid roughly ${show("randHospitalMultiple", "pct")} of Medicare for hospital services in 2022 (RAND round 5); we use 220% to blend in lower-paying Marketplace and Medicare Advantage-adjacent contracts. Medicaid pays below Medicare on base rates but closer to it once supplemental and directed payments are counted, so 90%. UHP pays ${show("hospitalRate", "pct")} of Medicare because MedPAC finds Medicare fee-for-service margins negative for the average hospital (about -13% in 2023); ${show("hospitalRate", "pct")} approximately covers the average efficient hospital's costs once billing overhead falls. Inpatient care is not very price-sensitive, so utilization rises only 4%.`,
    sourceIds: ["rand-hospital-2024", "medpac-2025", "macpac-supplemental"],
  },
  {
    id: "physicianClinical",
    reference: "Medicare Physician Fee Schedule",
    relativePrice: {
      privateInsurance: v("privatePhysicianMultiple"),
      medicare: 1,
      medicaid: v("medicaidFeeIndex"),
      outOfPocket: 1.3,
    },
    retainedOutOfPocketShare: 0,
    uhpRate: v("physicianRate"),
    utilization: 1.12,
    notes: `Commercial physician prices average about 140% of Medicare (higher for specialists, near 120% for primary care). Medicaid's fee index is about ${show("medicaidFeeIndex")} of Medicare. UHP pays an average of ${show("physicianRate", "pct")} of Medicare, weighted toward primary care (${show("primaryCareRate", "pct")}) and away from procedures (${show("proceduralRate", "pct")}). Removing deductibles and copays and covering 28 million uninsured people raises visits by roughly 12%, consistent with RAND Health Insurance Experiment elasticities and Oregon Medicaid experiment results.`,
    sourceIds: ["medpac-2025", "kff-medicaid-fee-index", "rand-hie", "oregon-experiment"],
  },
  {
    id: "otherProfessional",
    reference: "Medicare fee schedule",
    relativePrice: { privateInsurance: 1.3, medicare: 1, medicaid: 0.75, outOfPocket: 1.2 },
    retainedOutOfPocketShare: 0.25,
    uhpRate: 1.1,
    utilization: 1.15,
    notes:
      "Physical therapy, mental-health counseling, optometry. A quarter of today's out-of-pocket spending in this category (elective chiropractic, massage, and therapy beyond clinical-necessity limits) stays out of pocket. Mental-health and therapy demand is highly price-sensitive, so utilization rises 15%.",
    sourceIds: ["medpac-2025", "rand-hie"],
  },
  {
    id: "dental",
    reference: "Average 2024 private-insurance dental fee",
    relativePrice: { privateInsurance: 1, medicare: 1, medicaid: 0.6, outOfPocket: 1.15 },
    retainedOutOfPocketShare: 0.2,
    uhpRate: 0.95,
    utilization: 1.35,
    notes:
      "Adult dental is the largest new benefit. Medicaid dental fees average about 60% of private fees. Cosmetic work and adult orthodontics (about 20% of today's out-of-pocket dental spending) stay out of pocket. About 40% of adults skip dental care today because of cost, so utilization rises 35%.",
    sourceIds: ["ada-hpi"],
  },
  {
    id: "otherResidential",
    reference: "Average 2024 Medicaid waiver rates",
    relativePrice: { privateInsurance: 1.1, medicare: 1, medicaid: 1, outOfPocket: 1.1 },
    retainedOutOfPocketShare: 0.3,
    uhpRate: 1.05,
    utilization: 1.1,
    notes:
      "Home- and community-based services (HCBS) become an entitlement instead of a capped Medicaid waiver with waiting lists (about 700,000 people were on HCBS waiting lists in 2023). Rates rise 5% to raise direct-care worker pay. Non-medical help (housekeeping) stays out of pocket.",
    sourceIds: ["kff-hcbs-waitlist"],
  },
  {
    id: "homeHealth",
    reference: "Medicare home health rates",
    relativePrice: { privateInsurance: 1.1, medicare: 1, medicaid: 0.85, outOfPocket: 1 },
    retainedOutOfPocketShare: 0.2,
    uhpRate: 1,
    utilization: 1.2,
    notes:
      "Medicare's home-health payment becomes the national rate. Utilization rises 20% because long-term home care is covered without the Medicaid asset test.",
    sourceIds: ["medpac-2025"],
  },
  {
    id: "nursing",
    reference: "Blended Medicare/Medicaid nursing facility rate",
    relativePrice: { privateInsurance: 1.2, medicare: 1.3, medicaid: 0.85, outOfPocket: 1.1 },
    retainedOutOfPocketShare: 0.45,
    uhpRate: 1,
    utilization: 1.05,
    notes:
      "UHP pays for the clinical and personal-care component of nursing-home stays. Residents still contribute toward room and board on an income-tested scale, as in Canadian provinces; we estimate that keeps 45% of today's out-of-pocket nursing spending out of pocket. Medicare's short-stay rates are about 30% above the blended reference rate; Medicaid's are about 15% below it.",
    sourceIds: ["macpac-nursing", "cihi-ltc"],
  },
  {
    id: "prescriptionDrugs",
    reference: "Medicare Part D net price (after rebates)",
    relativePrice: { privateInsurance: 1, medicare: 1, medicaid: 0.7, outOfPocket: 1.2 },
    retainedOutOfPocketShare: 0.05,
    uhpRate: DERIVED.drugRate,
    utilization: 1.08,
    notes:
      "A single national formulary negotiating every brand drug cuts brand net prices about 35% (still above the 2-3x lower prices in other wealthy countries, RAND 2024). Generics, about 20% of spending, stay at today's price. 0.8 x 0.65 + 0.2 x 1.0 = 0.72. Medicaid already gets mandatory rebates, so it pays about 70% of the reference price. Removing copays raises fills 8%, mostly adherence to chronic medications. Drugs not on the formulary stay out of pocket (5%).",
    sourceIds: ["rand-drugs-2024", "cms-negotiation"],
  },
  {
    id: "durableEquipment",
    reference: "Medicare competitive-bidding prices",
    relativePrice: { privateInsurance: 1.2, medicare: 1, medicaid: 0.8, outOfPocket: 1.3 },
    retainedOutOfPocketShare: 0.4,
    uhpRate: 0.95,
    utilization: 1.25,
    notes:
      "Basic eyeglasses and hearing aids become covered. Designer frames, premium hearing aids, and convenience items (40% of today's out-of-pocket spending) remain out of pocket. Utilization rises 25%, mostly for hearing aids: only about 30% of adults over 70 who would benefit from one have one.",
    sourceIds: ["medpac-2025"],
  },
  {
    id: "otherNonDurable",
    reference: "Retail price",
    relativePrice: { privateInsurance: 1, medicare: 1, medicaid: 1, outOfPocket: 1 },
    retainedOutOfPocketShare: 1,
    uhpRate: 1,
    utilization: 1,
    notes:
      "Over-the-counter products stay out of pocket, as they do in nearly every universal system. The small Medicare amount (supplies tied to covered conditions) continues under UHP.",
    sourceIds: [],
  },
]

export const ASSUMPTIONS: Record<string, Assumption> = {
  uhpAdminRate: {
    id: "uhpAdminRate",
    label: "UHP administrative cost as a share of benefit payments",
    value: v("uhpAdminRate"),
    unit: "share",
    low: 0.018,
    high: 0.035,
    confidence: "medium",
    rationale: `Traditional Medicare spends about 1.4% on administration but is widely considered to under-invest in fraud prevention. Canada's provincial plans spend about 1.5–2.5%. We budget ${show("uhpAdminRate")} to fund program integrity, appeals, a modern claims system, and regional offices.`,
    sourceIds: ["cms-trustees-2025", "cihi-nhex"],
  },
  workforceInvestment: {
    id: "workforceInvestment",
    label: "Recurring workforce capacity investment",
    value: DERIVED.workforceInvestment,
    unit: "billions",
    low: 8,
    high: 20,
    confidence: "medium",
    rationale: `Pays for ${show("residencySlots")} residency slots at ${show("residencyCostPerSlot")} each, ${show("nursingFaculty")} nursing faculty, ${show("clinicalPlacements")} clinical placements, ${show("serviceScholars")} tuition-free service scholars, and ${show("communityHealthWorkers")} community health workers. Without it, the utilization increase turns into longer waits.`,
    sourceIds: ["aamc-shortage", "hrsa-nursing"],
  },
  publicHealthIncrease: {
    id: "publicHealthIncrease",
    label: "Public health increase",
    value: 0,
    unit: "billions",
    low: 0,
    high: 30,
    confidence: "high",
    rationale:
      "Held flat so the ledger isolates the coverage change. A public-health increase is a separate policy choice.",
    sourceIds: [],
  },
  wageBase: {
    id: "wageBase",
    label: "Wages & salaries, 2024",
    value: v("wageBase"),
    unit: "billions",
    low: 12388,
    high: 12388,
    confidence: "high",
    rationale: "BEA National Income and Product Accounts, wages and salaries, 2024.",
    sourceIds: ["bea-wages"],
  },
  smallEmployerExemptShare: {
    id: "smallEmployerExemptShare",
    label: "Share of payroll exempted by the small-employer phase-in",
    value: v("smallEmployerExemptShare"),
    unit: "share",
    low: 0.04,
    high: 0.1,
    confidence: "medium",
    rationale: `The first ${show("payrollExemption")} of each employer's annual payroll is taxed at a reduced rate. Firms under 10 employees pay about 11% of total payroll; the reduction removes roughly 6% of the total wage base.`,
    sourceIds: ["census-susb"],
  },
  employerTaxRate: {
    id: "employerTaxRate",
    label: "Employer health payroll tax rate",
    value: v("employerTaxRate"),
    unit: "rate",
    low: 0.07,
    high: 0.09,
    confidence: "high",
    rationale: `A policy choice, not an estimate. ${show("employerTaxRate")} of payroll raises less than employers paid in premiums in 2024 for those who offered coverage, but it falls on every employer, including the 40%+ of small firms that offer nothing today.`,
    sourceIds: [],
  },
  agiBaseAfterExemption: {
    id: "agiBaseAfterExemption",
    label: "Adjusted gross income above the household exemption",
    value: DERIVED.agiBase,
    unit: "billions",
    low: 12000,
    high: 13600,
    confidence: "medium",
    rationale: `AGI was $15.1T in tax year 2022 (IRS SOI) and grows to about $16.0T in 2024. Exempting the first ${show("exemptionFour")} of a household's income (scaled by household size) removes about $3.2T, since most low-income returns use all of their exemption.`,
    sourceIds: ["irs-soi-2022"],
  },
  householdPremiumRate: {
    id: "householdPremiumRate",
    label: "Income-based household health premium",
    value: v("householdPremiumRate"),
    unit: "rate",
    low: 0.035,
    high: 0.05,
    confidence: "high",
    rationale:
      "A policy choice, not an estimate. 4% of AGI above the exemption, collected through income tax withholding.",
    sourceIds: [],
  },
  wagePassThrough: {
    id: "wagePassThrough",
    label: "Share of employer premium savings passed through to cash wages",
    value: v("wagePassThrough"),
    unit: "share",
    low: 0.6,
    high: 1,
    confidence: "medium",
    rationale:
      "Economists broadly find that employer health costs come out of wages over time. We assume 85% of net employer savings reach paychecks within a few years, enforced in years 1-3 by a maintenance-of-compensation requirement. The remaining 15% stays with employers as profit.",
    sourceIds: ["baicker-chandra", "cbo-exclusion"],
  },
  federalMarginalRate: {
    id: "federalMarginalRate",
    label: "Average federal income tax rate on newly taxable compensation",
    value: v("federalMarginalRate"),
    unit: "rate",
    low: 0.15,
    high: 0.22,
    confidence: "medium",
    rationale:
      "Once health premiums disappear, compensation that was tax-free shows up as taxable wages. 18% is a blended federal income tax rate for the middle-income workers who receive most of it.",
    sourceIds: ["cbo-exclusion"],
  },
  stateMarginalRate: {
    id: "stateMarginalRate",
    label: "Average state income tax rate on newly taxable compensation",
    value: v("stateMarginalRate"),
    unit: "rate",
    low: 0.02,
    high: 0.05,
    confidence: "medium",
    rationale: "Weighted across states, including the nine with no wage income tax.",
    sourceIds: [],
  },
  hiPayrollRate: {
    id: "hiPayrollRate",
    label: "Medicare HI payroll tax on newly taxable wages",
    value: v("hiRate"),
    unit: "rate",
    low: 0.029,
    high: 0.029,
    confidence: "high",
    rationale: "Existing law: 1.45% employer + 1.45% employee.",
    sourceIds: [],
  },
  socialSecurityRate: {
    id: "socialSecurityRate",
    label: "Social Security payroll tax on newly taxable wages",
    value: v("ssRate"),
    unit: "rate",
    low: 0.124,
    high: 0.124,
    confidence: "high",
    rationale:
      "Existing law. This revenue goes to the Social Security trust funds, not health care, so it appears as a side effect outside the health ledger.",
    sourceIds: [],
  },
  statePremiumTaxLost: {
    id: "statePremiumTaxLost",
    label: "State premium taxes on health insurers lost",
    value: v("statePremiumTax"),
    unit: "billions",
    low: 12,
    high: 25,
    confidence: "low",
    rationale:
      "States tax insurance premiums at roughly 1-3%, but self-insured employer plans (about 60% of covered workers) are exempt under ERISA. About $18B of the private insurers' non-medical spending is state premium tax.",
    sourceIds: ["naic-premium-tax"],
  },
  insurerProfit: {
    id: "insurerProfit",
    label: "Private health insurer profit (underwriting + fees)",
    value: v("insurerProfit"),
    unit: "billions",
    low: 30,
    high: 55,
    confidence: "low",
    rationale:
      "Health insurers earned roughly 2-3% pre-tax margins on premiums in 2023-2024, and ASO fees on self-insured plans add more. Earnings at UnitedHealthcare, Elevance, Cigna, Aetna, Humana, Centene, and Molina were squeezed in 2024 by higher medical costs.",
    sourceIds: ["naic-health-results"],
  },
  brokerCommissions: {
    id: "brokerCommissions",
    label: "Broker and agent commissions and marketing",
    value: v("brokerCommissions"),
    unit: "billions",
    low: 25,
    high: 45,
    confidence: "low",
    rationale:
      "Commissions typically run 2-5% of premium in group markets and are a flat fee per member in the individual market. We assume about 2% of private premiums.",
    sourceIds: [],
  },
  stateMoeShare: {
    id: "stateMoeShare",
    label: "State maintenance-of-effort payment, as a share of 2024 state Medicaid & CHIP spending",
    value: v("stateMoeShare"),
    unit: "share",
    low: 0.85,
    high: 1,
    confidence: "high",
    rationale:
      "A policy choice. States keep paying what they paid for Medicaid and Medicare buy-ins, indexed to growth (like the Medicare Part D 'clawback'). They are released from Medicaid's administrative costs and gain income-tax revenue, so most states still come out ahead.",
    sourceIds: [],
  },
  topSurtaxRevenue: {
    id: "topSurtaxRevenue",
    label: "Revenue from top-end measures",
    value: TOP_END_REVENUE,
    unit: "billions",
    low: 250,
    high: 420,
    confidence: "low",
    rationale:
      "A 7% surtax on AGI above $1 million (about $1.9T of income in 2024: roughly $135B), taxing capital gains and dividends as ordinary income above $1 million ($90B), and a 0.1% financial transactions tax ($75B after behavioral response). The remaining ~$30B comes from capping the new employer tax deduction for health spending by the largest employers (no longer needed). Every one of these has wide uncertainty, mostly from behavior and avoidance.",
    sourceIds: ["tpc-surtax", "cbo-ftt", "jct-capital-gains"],
  },
}

const round1 = (x: number) => Math.round(x * 10) / 10

export type ServiceResult = {
  id: ServiceId
  label: string
  baselineTotal: number
  baselineAbsorbed: number
  volume: number
  priceEffect: number
  utilizationEffect: number
  uhpSpending: number
  retainedOutOfPocket: number
  continuingOther: number
  newTotal: number
  delta: number
  baselineByPayer: Partial<Record<Payer, number>>
  assumption: ServiceAssumption
}

/** A line in the "uses of funds" ledger: what the money is spent on. */
export type UseLine = {
  id: string
  label: string
  before: number
  after: number
  explanation: string
}

export type SourceTreatment = "continues" | "redirected" | "eliminated" | "new" | "reduced"

export type SourceLine = {
  id: string
  sponsor: SponsorId
  label: string
  before: number
  after: number
  treatment: SourceTreatment
  explanation: string
}

export function computeService(a: ServiceAssumption): ServiceResult {
  const row = SERVICES_2024.find((s) => s.id === a.id)
  if (!row) throw new Error(`Unknown service ${a.id}`)
  const p = row.byPayer
  const oop = p.outOfPocket ?? 0
  const retainedOutOfPocket = oop * a.retainedOutOfPocketShare
  const absorbed: Record<AbsorbedPayer, number> = {
    privateInsurance: p.privateInsurance ?? 0,
    medicare: p.medicare ?? 0,
    medicaid: p.medicaid ?? 0,
    outOfPocket: oop - retainedOutOfPocket,
  }
  const baselineAbsorbed = ABSORBED_PAYERS.reduce((sum, k) => sum + absorbed[k], 0)
  const volume = ABSORBED_PAYERS.reduce((sum, k) => sum + absorbed[k] / a.relativePrice[k], 0)
  const atNewPrices = volume * a.uhpRate
  const uhpSpending = atNewPrices * a.utilization
  const continuingOther = (p.otherInsurance ?? 0) + (p.otherThirdParty ?? 0)
  const newTotal = uhpSpending + retainedOutOfPocket + continuingOther
  return {
    id: a.id,
    label: row.label,
    baselineTotal: row.total,
    baselineAbsorbed,
    volume,
    priceEffect: atNewPrices - baselineAbsorbed,
    utilizationEffect: uhpSpending - atNewPrices,
    uhpSpending,
    retainedOutOfPocket,
    continuingOther,
    newTotal,
    delta: newTotal - row.total,
    baselineByPayer: p,
    assumption: a,
  }
}

function baselineRow(id: ServiceId) {
  const row = SERVICES_2024.find((s) => s.id === id)
  if (!row) throw new Error(`Unknown service ${id}`)
  return row
}

const sponsorLine = (id: string) => {
  const line = SPONSOR_LINES_2024.find((l) => l.id === id)
  if (!line) throw new Error(`Unknown sponsor line ${id}`)
  return line
}

export function sumBySponsor(lines: SourceLine[], key: "before" | "after") {
  const out: Record<SponsorId, number> = {
    business: 0,
    household: 0,
    otherPrivate: 0,
    federal: 0,
    stateLocal: 0,
  }
  for (const l of lines) out[l.sponsor] += l[key]
  return out
}

export type Scenario = {
  id: "central" | "costly" | "lean"
  label: string
  description: string
  /** Per-service overrides of the UHP payment rate. */
  uhpRate?: Partial<Record<ServiceId, number>>
  /** Scales the utilization increase: 1.5 means 50% more induced demand than central. */
  utilizationScale?: number
  assumptions?: Partial<Record<string, number>>
}

export function runModel(scenario: Scenario) {
  const assumptions = ASSUMPTIONS
  const A = (id: string) => scenario.assumptions?.[id] ?? ASSUMPTIONS[id].value
  const scale = scenario.utilizationScale ?? 1
  const services: ServiceAssumption[] = SERVICE_ASSUMPTIONS.map((s) => ({
    ...s,
    uhpRate: scenario.uhpRate?.[s.id] ?? s.uhpRate,
    utilization: 1 + (s.utilization - 1) * scale,
  }))

  const SERVICE_RESULTS: ServiceResult[] = services.map(computeService)

  const UHP_BENEFITS = SERVICE_RESULTS.reduce((s, r) => s + r.uhpSpending, 0)

  const govAdmin = baselineRow("governmentAdministration")
  const netCost = baselineRow("netCostOfInsurance")

  const uhpAdmin = UHP_BENEFITS * A("uhpAdminRate")
  const govAdminContinuing =
    (govAdmin.byPayer.otherInsurance ?? 0) + (govAdmin.byPayer.otherThirdParty ?? 0)
  const netCostContinuing =
    (netCost.byPayer.otherInsurance ?? 0) + (netCost.byPayer.otherThirdParty ?? 0)

  const USE_LINES: UseLine[] = [
    ...SERVICE_RESULTS.map((r) => ({
      id: r.id,
      label: r.label,
      before: r.baselineTotal,
      after: r.newTotal,
      explanation: `Price effect ${fmt(r.priceEffect)}, utilization effect ${fmt(r.utilizationEffect)}.`,
    })),
    {
      id: "governmentAdministration",
      label: "Public program administration",
      before: govAdmin.total,
      after: uhpAdmin + govAdminContinuing,
      explanation: `UHP administration at ${(A("uhpAdminRate") * 100).toFixed(1)}% of ${fmt(UHP_BENEFITS)} in benefits, plus ${fmt(govAdminContinuing)} for VA/DoD and other programs that continue. Replaces Medicare and Medicaid administration.`,
    },
    {
      id: "netCostOfInsurance",
      label: "Net cost of insurance (insurer overhead & profit)",
      before: netCost.total,
      after: netCostContinuing,
      explanation: `Private insurer overhead (${fmt(netCost.byPayer.privateInsurance ?? 0)}), Medicare Advantage & Part D plan overhead (${fmt(netCost.byPayer.medicare ?? 0)}), and Medicaid managed-care overhead (${fmt(netCost.byPayer.medicaid ?? 0)}) are all eliminated. ${fmt(netCostContinuing)} for workers' comp and other programs continues.`,
    },
    {
      id: "publicHealth",
      label: "Government public health",
      before: baselineRow("publicHealth").total,
      after: baselineRow("publicHealth").total + A("publicHealthIncrease"),
      explanation: "Held constant to isolate the coverage change.",
    },
    {
      id: "research",
      label: "Non-commercial research",
      before: baselineRow("research").total,
      after: baselineRow("research").total,
      explanation: "Unchanged. Commercial pharmaceutical R&D effects are discussed separately.",
    },
    {
      id: "structures",
      label: "Structures & equipment",
      before: baselineRow("structures").total,
      after: baselineRow("structures").total,
      explanation:
        "Held at the 2024 level, now allocated through regional capital budgets rather than by each hospital's own finances.",
    },
    {
      id: "workforce",
      label: "Workforce capacity investment (new)",
      before: 0,
      after: A("workforceInvestment"),
      explanation: assumptions.workforceInvestment.rationale,
    },
  ]

  const USES_BEFORE = USE_LINES.reduce((s, l) => s + l.before, 0)
  const USES_AFTER = USE_LINES.reduce((s, l) => s + l.after, 0)

  const retainedOop = SERVICE_RESULTS.reduce((s, r) => s + r.retainedOutOfPocket, 0)

  // Employer payroll tax splits by employer type in proportion to wages.
  const PRIVATE_WAGE_SHARE = v("privateWages") / (v("privateWages") + v("governmentWages"))
  const FEDERAL_SHARE_OF_GOV_WAGES = v("federalShareOfGovWages")
  const taxableWages = A("wageBase") * (1 - A("smallEmployerExemptShare"))
  const employerTax = taxableWages * A("employerTaxRate")
  const employerTaxBusiness = employerTax * PRIVATE_WAGE_SHARE
  const employerTaxGov = employerTax - employerTaxBusiness
  const employerTaxFederal = employerTaxGov * FEDERAL_SHARE_OF_GOV_WAGES
  const employerTaxStateLocal = employerTaxGov - employerTaxFederal

  // Compensation that used to be tax-free premiums and becomes taxable wages.
  const oldEmployerPremiums =
    sponsorLine("bizEsi").amount + sponsorLine("fedEsi").amount + sponsorLine("slEsi").amount
  const employerNetSavings = oldEmployerPremiums - employerTax
  const newlyTaxableWages =
    Math.max(0, employerNetSavings) * A("wagePassThrough") + sponsorLine("hhEsi").amount
  const newFederalIncomeTax = newlyTaxableWages * A("federalMarginalRate")
  const newHiPayroll = newlyTaxableWages * A("hiPayrollRate")
  const newStateIncomeTax = newlyTaxableWages * A("stateMarginalRate")
  const newSocialSecurity = newlyTaxableWages * A("socialSecurityRate")

  const householdPremium = A("agiBaseAfterExemption") * A("householdPremiumRate")
  const stateMoe =
    (sponsorLine("slMedicaid").amount + sponsorLine("slBuyIn").amount) * A("stateMoeShare")

  const fixedSources: SourceLine[] = [
    // Business
    {
      id: "bizEsi",
      sponsor: "business",
      label: sponsorLine("bizEsi").label,
      before: sponsorLine("bizEsi").amount,
      after: 0,
      treatment: "eliminated",
      explanation: "No private health insurance premiums exist for UHP-covered services.",
    },
    {
      id: "bizPayroll",
      sponsor: "business",
      label: "Employer health payroll tax (new)",
      before: 0,
      after: employerTaxBusiness,
      treatment: "new",
      explanation: `${(A("employerTaxRate") * 100).toFixed(1)}% of private payroll after the small-employer phase-in.`,
    },
    {
      id: "bizHi",
      sponsor: "business",
      label: sponsorLine("bizHi").label,
      before: sponsorLine("bizHi").amount,
      after: sponsorLine("bizHi").amount + newHiPayroll * 0.5 * PRIVATE_WAGE_SHARE,
      treatment: "continues",
      explanation:
        "Continues and now flows into the UHP Trust Fund. It rises slightly because more compensation is paid as taxable wages.",
    },
    {
      id: "bizOther",
      sponsor: "business",
      label: sponsorLine("bizOther").label,
      before: sponsorLine("bizOther").amount,
      after: sponsorLine("bizOther").amount,
      treatment: "continues",
      explanation:
        "Workers' compensation stays a separate system (it also replaces lost wages), but it pays UHP rates and UHP recovers medical costs from workers' comp carriers.",
    },
    // Households
    {
      id: "hhEsi",
      sponsor: "household",
      label: sponsorLine("hhEsi").label,
      before: sponsorLine("hhEsi").amount,
      after: 0,
      treatment: "eliminated",
      explanation: "Paycheck premium deductions end.",
    },
    {
      id: "hhDirect",
      sponsor: "household",
      label: sponsorLine("hhDirect").label,
      before: sponsorLine("hhDirect").amount,
      after: 0,
      treatment: "eliminated",
      explanation: "Marketplace and Medigap premiums end.",
    },
    {
      id: "hhSmi",
      sponsor: "household",
      label: sponsorLine("hhSmi").label,
      before: sponsorLine("hhSmi").amount,
      after: 0,
      treatment: "eliminated",
      explanation: `The Part B (${show("partBMonthly")}/month in 2025) and Part D premiums end.`,
    },
    {
      id: "hhOop",
      sponsor: "household",
      label: "Out-of-pocket spending",
      before: sponsorLine("hhOop").amount,
      after: retainedOop,
      treatment: "reduced",
      explanation:
        "Only non-covered items remain: over-the-counter products, cosmetic dental, premium eyewear and hearing aids, nursing-home room and board, non-formulary drugs.",
    },
    {
      id: "hhPc",
      sponsor: "household",
      label: sponsorLine("hhPc").label,
      before: sponsorLine("hhPc").amount,
      after: sponsorLine("hhPc").amount,
      treatment: "continues",
      explanation:
        "Auto and liability insurers keep paying for injuries they are responsible for, reimbursing UHP.",
    },
    {
      id: "hhHi",
      sponsor: "household",
      label: sponsorLine("hhHi").label,
      before: sponsorLine("hhHi").amount,
      after: sponsorLine("hhHi").amount + newHiPayroll * 0.5,
      treatment: "continues",
      explanation: "Continues into the UHP Trust Fund and rises slightly with the wage base.",
    },
    {
      id: "hhPremium",
      sponsor: "household",
      label: "Income-based health premium (new)",
      before: 0,
      after: householdPremium,
      treatment: "new",
      explanation: `${(A("householdPremiumRate") * 100).toFixed(1)}% of AGI above a household exemption of ${show("exemptionFour")} for a family of four.`,
    },
    {
      id: "hhIncomeTax",
      sponsor: "household",
      label: "Federal income tax on former premium dollars (new)",
      before: 0,
      after: newFederalIncomeTax,
      treatment: "new",
      explanation: `Health premiums were paid with untaxed dollars. Now ${fmt(newlyTaxableWages)} in compensation that used to be premiums is paid as taxable wages. This recaptures most of the roughly ${show("esiTaxExclusion")}/yr federal tax subsidy for job-based insurance (CBO).`,
    },
    {
      id: "hhTopSurtax",
      sponsor: "household",
      label: "Top-end surtaxes & financial transactions tax (new)",
      before: 0,
      after: A("topSurtaxRevenue"),
      treatment: "new",
      explanation: assumptions.topSurtaxRevenue.rationale,
    },
    // Other private
    {
      id: "otherPrivate",
      sponsor: "otherPrivate",
      label: sponsorLine("otherPrivate").label,
      before: sponsorLine("otherPrivate").amount,
      after: sponsorLine("otherPrivate").amount,
      treatment: "continues",
      explanation: "Hospital philanthropy and investment income continue.",
    },
    // Federal
    {
      id: "fedEsi",
      sponsor: "federal",
      label: sponsorLine("fedEsi").label,
      before: sponsorLine("fedEsi").amount,
      after: 0,
      treatment: "eliminated",
      explanation: "The Federal Employees Health Benefits program closes.",
    },
    {
      id: "fedPayroll",
      sponsor: "federal",
      label: "Federal employer health payroll tax (new)",
      before: 0,
      after: employerTaxFederal,
      treatment: "new",
      explanation:
        "The federal government pays the employer tax on its civilian and military payroll like any employer.",
    },
    {
      id: "fedHi",
      sponsor: "federal",
      label: sponsorLine("fedHi").label,
      before: sponsorLine("fedHi").amount,
      after: sponsorLine("fedHi").amount,
      treatment: "continues",
      explanation: "Continues.",
    },
    {
      id: "fedMedicare",
      sponsor: "federal",
      label: sponsorLine("fedMedicare").label,
      before: sponsorLine("fedMedicare").amount,
      after: sponsorLine("fedMedicare").amount,
      treatment: "redirected",
      explanation: "Medicare general-revenue funding is redirected into the UHP Trust Fund.",
    },
    {
      id: "fedMedicaid",
      sponsor: "federal",
      label: sponsorLine("fedMedicaid").label,
      before: sponsorLine("fedMedicaid").amount,
      after: sponsorLine("fedMedicaid").amount,
      treatment: "redirected",
      explanation: "Federal Medicaid matching funds are redirected into the UHP Trust Fund.",
    },
    {
      id: "fedBuyIn",
      sponsor: "federal",
      label: sponsorLine("fedBuyIn").label,
      before: sponsorLine("fedBuyIn").amount,
      after: sponsorLine("fedBuyIn").amount,
      treatment: "redirected",
      explanation:
        "There are no more premiums to buy in to, so the appropriation is redirected to UHP.",
    },
    {
      id: "fedRds",
      sponsor: "federal",
      label: sponsorLine("fedRds").label,
      before: sponsorLine("fedRds").amount,
      after: 0,
      treatment: "eliminated",
      explanation: "Employer retiree drug plans no longer exist.",
    },
    {
      id: "fedPrograms",
      sponsor: "federal",
      label: sponsorLine("fedPrograms").label,
      before: sponsorLine("fedPrograms").amount,
      after: sponsorLine("fedPrograms").amount,
      treatment: "continues",
      explanation:
        "The VA and military health systems continue as direct-care systems. CHIP funding transfers into UHP. The Indian Health Service continues, with UHP paying for its patients' care.",
    },
    {
      id: "fedPublicHealth",
      sponsor: "federal",
      label: sponsorLine("fedPublicHealth").label,
      before: sponsorLine("fedPublicHealth").amount,
      after: sponsorLine("fedPublicHealth").amount,
      treatment: "continues",
      explanation: "Continues.",
    },
    {
      id: "fedOther",
      sponsor: "federal",
      label: sponsorLine("fedOther").label,
      before: sponsorLine("fedOther").amount,
      after: sponsorLine("fedOther").amount,
      treatment: "continues",
      explanation: "Continues.",
    },
    {
      id: "fedMarketplace",
      sponsor: "federal",
      label: sponsorLine("fedMarketplace").label,
      before: sponsorLine("fedMarketplace").amount,
      after: sponsorLine("fedMarketplace").amount,
      treatment: "redirected",
      explanation: "The ACA Marketplaces close and the money is redirected to the UHP Trust Fund.",
    },
    // State & local
    {
      id: "slEsi",
      sponsor: "stateLocal",
      label: sponsorLine("slEsi").label,
      before: sponsorLine("slEsi").amount,
      after: 0,
      treatment: "eliminated",
      explanation:
        "State and local employee health plans close (public-school teachers, police, and others).",
    },
    {
      id: "slPayroll",
      sponsor: "stateLocal",
      label: "State & local employer health payroll tax (new)",
      before: 0,
      after: employerTaxStateLocal,
      treatment: "new",
      explanation: "State and local governments pay the employer tax on their payrolls.",
    },
    {
      id: "slHi",
      sponsor: "stateLocal",
      label: sponsorLine("slHi").label,
      before: sponsorLine("slHi").amount,
      after: sponsorLine("slHi").amount,
      treatment: "continues",
      explanation: "Continues.",
    },
    {
      id: "slMoe",
      sponsor: "stateLocal",
      label: "State Medicaid share → UHP maintenance-of-effort payment",
      before: sponsorLine("slMedicaid").amount + sponsorLine("slBuyIn").amount,
      after: stateMoe,
      treatment: "redirected",
      explanation:
        "States pay UHP what they paid for Medicaid and Medicare buy-ins in 2024, indexed to per-capita NHE growth.",
    },
    {
      id: "slPrograms",
      sponsor: "stateLocal",
      label: sponsorLine("slPrograms").label,
      before: sponsorLine("slPrograms").amount,
      after: sponsorLine("slPrograms").amount,
      treatment: "continues",
      explanation: "Continues.",
    },
    {
      id: "slPublicHealth",
      sponsor: "stateLocal",
      label: sponsorLine("slPublicHealth").label,
      before: sponsorLine("slPublicHealth").amount,
      after: sponsorLine("slPublicHealth").amount,
      treatment: "continues",
      explanation: "Continues.",
    },
    {
      id: "slOther",
      sponsor: "stateLocal",
      label: sponsorLine("slOther").label,
      before: sponsorLine("slOther").amount,
      after: sponsorLine("slOther").amount,
      treatment: "continues",
      explanation: "Continues.",
    },
  ]

  const fixedAfter = fixedSources.reduce((s, l) => s + l.after, 0)

  /**
   * Whatever the named sources do not cover is the remaining general-revenue
   * requirement: new federal borrowing or additional taxes. It is reported as its
   * own line, never hidden.
   */
  const GENERAL_REVENUE_GAP = USES_AFTER - fixedAfter

  const SOURCE_LINES: SourceLine[] = [
    ...fixedSources,
    {
      id: "fedGap",
      sponsor: "federal",
      label: "Remaining federal general revenue requirement",
      before: 0,
      after: GENERAL_REVENUE_GAP,
      treatment: "new",
      explanation:
        GENERAL_REVENUE_GAP >= 0
          ? "Spending the named sources do not cover. It must come from additional taxes or federal borrowing; the financing page lists options."
          : "Named sources raise more than is spent. The surplus can lower the household premium rate.",
    },
  ]

  const SOURCES_BEFORE = SOURCE_LINES.reduce((s, l) => s + l.before, 0)
  const SOURCES_AFTER = SOURCE_LINES.reduce((s, l) => s + l.after, 0)

  const SIDE_EFFECTS = {
    newStateIncomeTax,
    newSocialSecurity,
    newlyTaxableWages,
    employerNetSavings,
    oldEmployerPremiums,
    employerTax,
    employerTaxBusiness,
    employerTaxFederal,
    employerTaxStateLocal,
    householdPremium,
    stateMoe,
    retainedOop,
    uhpAdmin,
    taxableWages,
    privateWageShare: PRIVATE_WAGE_SHARE,
    federalShareOfGovWages: FEDERAL_SHARE_OF_GOV_WAGES,
    employerTaxGov,
    newFederalIncomeTax,
    newHiPayroll,
    govAdminContinuing,
    netCostContinuing,
    fixedAfter,
  }

  const SPONSOR_BEFORE = sumBySponsor(SOURCE_LINES, "before")
  const SPONSOR_AFTER = sumBySponsor(SOURCE_LINES, "after")
  const HEADLINE = {
    baselineTotal: NHE_TOTAL_2024,
    newTotal: USES_AFTER,
    delta: USES_AFTER - USES_BEFORE,
    deltaPct: (USES_AFTER - USES_BEFORE) / USES_BEFORE,
    perCapitaBefore: (USES_BEFORE * 1000) / POPULATION_2024_MILLIONS,
    perCapitaAfter: (USES_AFTER * 1000) / POPULATION_2024_MILLIONS,
    federalBefore: SPONSOR_BEFORE.federal,
    federalAfter: SPONSOR_AFTER.federal,
    uhpBenefits: UHP_BENEFITS,
    uhpAdmin,
    adminSavings:
      govAdmin.total + netCost.total - (uhpAdmin + govAdminContinuing + netCostContinuing),
    priceEffect: SERVICE_RESULTS.reduce((s, r) => s + r.priceEffect, 0),
    utilizationEffect: SERVICE_RESULTS.reduce((s, r) => s + r.utilizationEffect, 0),
  }

  return {
    scenario,
    serviceResults: SERVICE_RESULTS,
    useLines: USE_LINES,
    sourceLines: SOURCE_LINES,
    usesBefore: USES_BEFORE,
    usesAfter: USES_AFTER,
    sourcesBefore: SOURCES_BEFORE,
    sourcesAfter: SOURCES_AFTER,
    gap: GENERAL_REVENUE_GAP,
    sponsorBefore: SPONSOR_BEFORE,
    sponsorAfter: SPONSOR_AFTER,
    headline: HEADLINE,
    side: SIDE_EFFECTS,
    rates: {
      employerTaxRate: A("employerTaxRate"),
      householdPremiumRate: A("householdPremiumRate"),
      federalMarginalRate: A("federalMarginalRate"),
      stateMarginalRate: A("stateMarginalRate"),
      wagePassThrough: A("wagePassThrough"),
      uhpAdminRate: A("uhpAdminRate"),
    },
  }
}

export type ModelResult = ReturnType<typeof runModel>

export const SCENARIOS: Scenario[] = [
  {
    id: "central",
    label: "Central estimate",
    description: "Every assumption at its central value. This is the plan as written.",
  },
  {
    id: "costly",
    label: "Costly case",
    description: `Providers win higher rates in Congress (hospitals 135% of Medicare, physicians 125%), induced demand is 50% larger, drug negotiation yields less (85% of today's net price), administration costs 3.5%, only 60% of employer savings reach wages, top-end taxes raise less, and workforce investment is larger.`,
    uhpRate: {
      hospital: 1.35,
      physicianClinical: 1.25,
      otherProfessional: 1.2,
      prescriptionDrugs: 0.85,
    },
    utilizationScale: 1.5,
    assumptions: {
      uhpAdminRate: 0.035,
      wagePassThrough: 0.6,
      topSurtaxRevenue: 250,
      agiBaseAfterExemption: 12000,
      workforceInvestment: 20,
    },
  },
  {
    id: "lean",
    label: "Lean case",
    description: `Rates set at hospitals 110% and physicians 105% of Medicare, induced demand 25% smaller, drug prices 65% of today's net, administration 1.8%, full wage pass-through, top-end taxes at the high end.`,
    uhpRate: {
      hospital: 1.1,
      physicianClinical: 1.05,
      otherProfessional: 1.05,
      prescriptionDrugs: 0.65,
    },
    utilizationScale: 0.75,
    assumptions: {
      uhpAdminRate: 0.018,
      wagePassThrough: 1,
      topSurtaxRevenue: 420,
      agiBaseAfterExemption: 13600,
      workforceInvestment: 8,
    },
  },
]

export const MODEL = runModel(SCENARIOS[0])
export const MODEL_COSTLY = runModel(SCENARIOS[1])
export const MODEL_LEAN = runModel(SCENARIOS[2])

/** Format billions: 1234.5 -> "$1,234.5B", 0.4 -> "$0.4B". */
export function fmt(billions: number, opts: { sign?: boolean } = {}) {
  const sign = opts.sign && billions > 0.05 ? "+" : billions < -0.05 ? "−" : ""
  const abs = Math.abs(round1(billions))
  if (abs >= 1000) {
    return `${sign}$${(abs / 1000).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}T`
  }
  return `${sign}$${abs.toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 })}B`
}
