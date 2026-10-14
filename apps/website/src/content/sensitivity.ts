import { ASSUMPTIONS, MODEL, type Scenario, runModel } from "./model"

/**
 * One-at-a-time sensitivity: move each assumption to its low and high value,
 * holding everything else at central, and record the effect on national
 * spending and on the general-revenue requirement.
 */
type Lever = {
  id: string
  label: string
  lowLabel: string
  highLabel: string
  low: Scenario
  high: Scenario
}

const base = { id: "central" as const, label: "", description: "" }

function assumptionLever(id: string, label: string): Lever {
  const a = ASSUMPTIONS[id]
  const fmtV = (v: number) =>
    a.unit === "billions"
      ? `$${v}B`
      : a.unit === "share" || a.unit === "rate"
        ? `${(v * 100).toFixed(1)}%`
        : String(v)
  return {
    id,
    label,
    lowLabel: fmtV(a.low),
    highLabel: fmtV(a.high),
    low: { ...base, assumptions: { [id]: a.low } },
    high: { ...base, assumptions: { [id]: a.high } },
  }
}

export const LEVERS: Lever[] = [
  {
    id: "hospitalRate",
    label: "Hospital payment rate (× Medicare)",
    lowLabel: "1.10",
    highLabel: "1.35",
    low: { ...base, uhpRate: { hospital: 1.1 } },
    high: { ...base, uhpRate: { hospital: 1.35 } },
  },
  {
    id: "physicianRate",
    label: "Physician payment rate (× Medicare)",
    lowLabel: "1.05",
    highLabel: "1.25",
    low: { ...base, uhpRate: { physicianClinical: 1.05 } },
    high: { ...base, uhpRate: { physicianClinical: 1.25 } },
  },
  {
    id: "drugRate",
    label: "Drug prices (× today's Medicare net)",
    lowLabel: "0.65",
    highLabel: "0.85",
    low: { ...base, uhpRate: { prescriptionDrugs: 0.65 } },
    high: { ...base, uhpRate: { prescriptionDrugs: 0.85 } },
  },
  {
    id: "utilization",
    label: "Induced demand (scale of utilization increase)",
    lowLabel: "0.75×",
    highLabel: "1.5×",
    low: { ...base, utilizationScale: 0.75 },
    high: { ...base, utilizationScale: 1.5 },
  },
  assumptionLever("uhpAdminRate", "UHP administrative cost"),
  assumptionLever("workforceInvestment", "Workforce investment"),
  assumptionLever("employerTaxRate", "Employer payroll tax rate"),
  assumptionLever("householdPremiumRate", "Household premium rate"),
  assumptionLever("agiBaseAfterExemption", "Household premium base (AGI above exemption)"),
  assumptionLever("wagePassThrough", "Employer savings passed to wages"),
  assumptionLever("federalMarginalRate", "Tax rate on newly taxable wages"),
  assumptionLever("topSurtaxRevenue", "Top-end tax revenue"),
  assumptionLever("smallEmployerExemptShare", "Payroll exempted for small employers"),
]

export const SENSITIVITY = LEVERS.map((l) => {
  const lo = runModel(l.low)
  const hi = runModel(l.high)
  return {
    ...l,
    spendingLow: lo.usesAfter - MODEL.usesAfter,
    spendingHigh: hi.usesAfter - MODEL.usesAfter,
    gapLow: lo.gap - MODEL.gap,
    gapHigh: hi.gap - MODEL.gap,
  }
}).toSorted(
  (a, b) =>
    Math.max(Math.abs(b.gapLow), Math.abs(b.gapHigh)) -
    Math.max(Math.abs(a.gapLow), Math.abs(a.gapHigh)),
)
