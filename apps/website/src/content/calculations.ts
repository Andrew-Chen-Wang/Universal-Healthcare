/**
 * Every cost item on the site, with the arithmetic that produces it.
 *
 * Each item belongs to one implementation step and gets its own page. Steps
 * are generated from the same numbers the model uses (never retyped), so a
 * page can't drift from the ledger.
 */
import { PAYER_LABELS, type Payer, SERVICES_2024, SPONSOR_LINES_2024 } from "./baseline"
import { C, type ConstantId, DERIVED, TOP_END_REVENUE, v } from "./constants"
import {
  DEDICATED_RECEIPTS,
  FEDERAL,
  FEDERAL_OUTLAYS,
  GENERAL_FUND_AFTER,
  GENERAL_FUND_BEFORE,
  TEN_YEAR,
  WINDOW,
  WINDOW_FACTOR,
} from "./fiscal"
import { EMPLOYERS, ESI_BREAK_EVEN, HOUSEHOLDS, INCOME_GRID } from "./households"
import { MODEL, MODEL_COSTLY, MODEL_LEAN, type ModelResult } from "./model"
import {
  ONE_TIME_COSTS,
  PHASE_IN,
  PLAN_YEARS,
  REVENUE_PHASE_IN,
  ENROLLMENT_WAVES,
} from "./transition"
import {
  AVG_DISPLACED_WAGE,
  DISPLACED_GROUPS,
  DISPLACED_TOTAL,
  JOB_GAINS,
  TRANSITION_PROGRAM,
  TRANSITION_PROGRAM_COST,
} from "./workforce"

export type Unit = "B" | "$" | "count" | "%" | "x"

export type CalcStep = {
  label: string
  /** The arithmetic with real numbers, e.g. "$558.9B ÷ 2.20". */
  formula?: string
  value: number
  unit: Unit
  inputs?: ConstantId[]
  sourceIds?: string[]
  note?: string
  /** Visually emphasize (subtotals and results). */
  result?: boolean
}

export type CostKind =
  | "spending"
  | "revenue"
  | "one-time"
  | "loss"
  | "saving"
  | "household"
  | "employer"
  | "jobs"
  | "budget"

export type CostItem = {
  id: string
  title: string
  stepId: string
  kind: CostKind
  summary: string
  amount: number
  amountUnit: "B" | "$"
  before?: number
  after?: number
  calc: CalcStep[]
  byYear?: { label: string; value: number }[]
  range?: { low: number; high: number; note: string }
  tradeoff: string
  sourceIds: string[]
}

// ------------------------------------------------------------------ formatting
const n1 = (x: number) =>
  x.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const n2 = (x: number) =>
  x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const fB = (x: number) => `${x < 0 ? "−" : ""}$${n1(Math.abs(x))}B`
export const fUsd = (x: number) =>
  `${x < 0 ? "−" : ""}$${Math.abs(Math.round(x)).toLocaleString("en-US")}`
export const fx = (x: number) => `${n2(x)}×`
export const fPct = (x: number) =>
  `${(x * 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}%`
const fCount = (x: number) => Math.round(x).toLocaleString("en-US")

const ITEMS: CostItem[] = []
const add = (item: CostItem) => {
  ITEMS.push(item)
  return item
}

const svc = (m: ModelResult, id: string) => m.serviceResults.find((s) => s.id === id)!
const useL = (m: ModelResult, id: string) => m.useLines.find((s) => s.id === id)!
const srcL = (m: ModelResult, id: string) => m.sourceLines.find((s) => s.id === id)!
const sponsor2024 = (id: string) => SPONSOR_LINES_2024.find((l) => l.id === id)!.amount

// ------------------------------------------------------------------ 1. services
const SERVICE_STEP: Record<string, string> = {
  hospital: "hospital-global-budgets",
  physicianClinical: "fee-schedule",
  otherProfessional: "fee-schedule",
  dental: "new-benefits-launch",
  durableEquipment: "new-benefits-launch",
  otherResidential: "ltss-entitlement",
  homeHealth: "ltss-entitlement",
  nursing: "ltss-entitlement",
  prescriptionDrugs: "national-formulary",
  otherNonDurable: "define-benefits",
}

const ABSORBED: Payer[] = ["privateInsurance", "medicare", "medicaid", "outOfPocket"]

for (const r of MODEL.serviceResults) {
  const a = r.assumption
  const row = SERVICES_2024.find((s) => s.id === r.id)!
  const calc: CalcStep[] = []
  calc.push({
    label: "2024 spending on this service (CMS NHE Table 4)",
    value: r.baselineTotal,
    unit: "B",
    sourceIds: ["cms-nhe-2024"],
  })
  for (const p of ABSORBED) {
    const amt = row.byPayer[p] ?? 0
    if (!amt) continue
    const rel = a.relativePrice[p as keyof typeof a.relativePrice]
    if (p === "outOfPocket") {
      calc.push({
        label: "Out-of-pocket spending in 2024",
        value: amt,
        unit: "B",
        sourceIds: ["cms-nhe-2024"],
      })
      if (r.retainedOutOfPocket > 0)
        calc.push({
          label: `Stays out of pocket (items UHP excludes: ${fPct(a.retainedOutOfPocketShare)})`,
          formula: `${fB(amt)} × ${fPct(a.retainedOutOfPocketShare)}`,
          value: r.retainedOutOfPocket,
          unit: "B",
        })
      const covered = amt - r.retainedOutOfPocket
      calc.push({
        label: "Covered out-of-pocket converted to reference-price volume",
        formula:
          r.retainedOutOfPocket > 0
            ? `(${fB(amt)} − ${fB(r.retainedOutOfPocket)}) ÷ ${fx(rel)}`
            : `${fB(amt)} ÷ ${fx(rel)}`,
        value: covered / rel,
        unit: "B",
      })
    } else {
      calc.push({
        label: `${PAYER_LABELS[p]} paid ${fB(amt)} at ${fx(rel)} the reference price → volume`,
        formula: `${fB(amt)} ÷ ${fx(rel)}`,
        value: amt / rel,
        unit: "B",
        sourceIds: ["cms-nhe-2024"],
      })
    }
  }
  calc.push({
    label: "Care UHP takes over, valued at 2024 prices",
    value: r.baselineAbsorbed,
    unit: "B",
    result: true,
  })
  calc.push({
    label: `Same care valued at the reference price (${a.reference})`,
    value: r.volume,
    unit: "B",
    result: true,
  })
  calc.push({
    label: `Re-priced at UHP rate ${fx(a.uhpRate)}`,
    formula: `${fB(r.volume)} × ${fx(a.uhpRate)}`,
    value: r.volume * a.uhpRate,
    unit: "B",
  })
  calc.push({
    label: "Price effect (same care, new prices)",
    formula: `${fB(r.volume * a.uhpRate)} − ${fB(r.baselineAbsorbed)}`,
    value: r.priceEffect,
    unit: "B",
    result: true,
  })
  calc.push({
    label: `Utilization multiplier ${fx(a.utilization)}`,
    formula: `${fB(r.volume * a.uhpRate)} × ${fx(a.utilization)}`,
    value: r.uhpSpending,
    unit: "B",
  })
  calc.push({
    label: "Utilization effect (more care)",
    formula: `${fB(r.uhpSpending)} − ${fB(r.volume * a.uhpRate)}`,
    value: r.utilizationEffect,
    unit: "B",
    result: true,
  })
  calc.push({
    label: "UHP spending on this service",
    value: r.uhpSpending,
    unit: "B",
    result: true,
  })
  if (r.retainedOutOfPocket > 0)
    calc.push({
      label: "Plus spending that stays out of pocket",
      value: r.retainedOutOfPocket,
      unit: "B",
    })
  if (row.byPayer.otherInsurance)
    calc.push({
      label: `Plus ${PAYER_LABELS.otherInsurance} (continues unchanged)`,
      value: row.byPayer.otherInsurance,
      unit: "B",
    })
  if (row.byPayer.otherThirdParty)
    calc.push({
      label: `Plus ${PAYER_LABELS.otherThirdParty} (continues unchanged)`,
      value: row.byPayer.otherThirdParty,
      unit: "B",
    })
  calc.push({
    label: "Total national spending on this service under the plan",
    formula: `${fB(r.uhpSpending)} + ${fB(r.retainedOutOfPocket)} + ${fB(r.continuingOther)}`,
    value: r.newTotal,
    unit: "B",
    result: true,
  })
  calc.push({
    label: "Change from 2024",
    formula: `${fB(r.newTotal)} − ${fB(r.baselineTotal)}`,
    value: r.delta,
    unit: "B",
    result: true,
  })
  add({
    id: `service-${r.id}`,
    title: r.label,
    stepId: SERVICE_STEP[r.id],
    kind: "spending",
    summary: a.notes,
    amount: r.newTotal,
    amountUnit: "B",
    before: r.baselineTotal,
    after: r.newTotal,
    calc,
    range: {
      low: svc(MODEL_LEAN, r.id).newTotal,
      high: svc(MODEL_COSTLY, r.id).newTotal,
      note: "Lean and costly scenarios.",
    },
    tradeoff:
      r.priceEffect < 0
        ? `Providers of this service receive ${fB(-r.priceEffect)} less for the same care; patients receive ${fB(r.utilizationEffect)} more care.`
        : `Prices rise ${fB(r.priceEffect)} (to raise access or wages) and patients receive ${fB(r.utilizationEffect)} more care.`,
    sourceIds: ["cms-nhe-2024", ...a.sourceIds],
  })
}

// ------------------------------------------------------------------ 2. other uses
{
  const ga = SERVICES_2024.find((s) => s.id === "governmentAdministration")!
  const l = useL(MODEL, "governmentAdministration")
  add({
    id: "use-administration",
    title: "Public program administration",
    stepId: "create-uha",
    kind: "spending",
    summary:
      "Running UHP: claims processing, enrollment, appeals, program integrity, rate-setting, regional offices.",
    amount: l.after,
    amountUnit: "B",
    before: l.before,
    after: l.after,
    calc: [
      {
        label: "2024 government administration (CMS)",
        value: ga.total,
        unit: "B",
        sourceIds: ["cms-nhe-2024"],
      },
      { label: "Medicare administration (replaced)", value: ga.byPayer.medicare ?? 0, unit: "B" },
      { label: "Medicaid administration (replaced)", value: ga.byPayer.medicaid ?? 0, unit: "B" },
      {
        label: "Other programs' administration (continues: VA, DoD, CHIP, others)",
        value: MODEL.side.govAdminContinuing,
        unit: "B",
      },
      {
        label: "UHP benefit spending (all services)",
        value: MODEL.headline.uhpBenefits,
        unit: "B",
        result: true,
      },
      {
        label: `UHP administration at ${fPct(MODEL.rates.uhpAdminRate)} of benefits`,
        formula: `${fB(MODEL.headline.uhpBenefits)} × ${fPct(MODEL.rates.uhpAdminRate)}`,
        value: MODEL.headline.uhpAdmin,
        unit: "B",
        inputs: ["uhpAdminRate"],
      },
      {
        label: "Total public administration under the plan",
        formula: `${fB(MODEL.headline.uhpAdmin)} + ${fB(MODEL.side.govAdminContinuing)}`,
        value: l.after,
        unit: "B",
        result: true,
      },
      {
        label: "Compare: traditional Medicare's administrative share",
        value: v("medicareAdminShare"),
        unit: "%",
        inputs: ["medicareAdminShare"],
      },
    ],
    range: {
      low: useL(MODEL_LEAN, "governmentAdministration").after,
      high: useL(MODEL_COSTLY, "governmentAdministration").after,
      note: "Admin rate 1.8% (lean) to 3.5% (costly).",
    },
    tradeoff:
      "A higher admin budget than Medicare's buys fraud control and service quality; a lower one saves money but risks Medicare-style improper payments (7.7%).",
    sourceIds: ["cms-nhe-2024", "cms-trustees-2025", "cihi-nhex"],
  })
}
{
  const nc = SERVICES_2024.find((s) => s.id === "netCostOfInsurance")!
  const priv = nc.byPayer.privateInsurance ?? 0
  const otherAdmin = priv - v("insurerProfit") - v("brokerCommissions") - v("statePremiumTax")
  const l = useL(MODEL, "netCostOfInsurance")
  add({
    id: "use-insurer-overhead",
    title: "Insurer & plan overhead eliminated",
    stepId: "insurer-runoff",
    kind: "saving",
    summary:
      "The 'net cost of health insurance': premiums minus benefits. It is what private insurers, Medicare Advantage and Part D plans, and Medicaid managed-care plans keep for administration and profit.",
    amount: l.after - l.before,
    amountUnit: "B",
    before: l.before,
    after: l.after,
    calc: [
      {
        label: "Private health insurers' non-medical spending (CMS)",
        value: priv,
        unit: "B",
        sourceIds: ["cms-nhe-2024"],
      },
      {
        label: "  of which: profit (estimate)",
        value: v("insurerProfit"),
        unit: "B",
        inputs: ["insurerProfit"],
      },
      {
        label: "  of which: broker commissions & marketing (estimate)",
        value: v("brokerCommissions"),
        unit: "B",
        inputs: ["brokerCommissions"],
      },
      {
        label: "  of which: state premium taxes (estimate)",
        value: v("statePremiumTax"),
        unit: "B",
        inputs: ["statePremiumTax"],
      },
      {
        label: "  of which: claims processing, utilization management, networks, IT, salaries",
        formula: `${fB(priv)} − ${fB(v("insurerProfit"))} − ${fB(v("brokerCommissions"))} − ${fB(v("statePremiumTax"))}`,
        value: otherAdmin,
        unit: "B",
      },
      {
        label: "Medicare Advantage & Part D plan overhead (CMS)",
        value: nc.byPayer.medicare ?? 0,
        unit: "B",
        sourceIds: ["cms-nhe-2024"],
      },
      {
        label: "Medicaid managed-care plan overhead (CMS)",
        value: nc.byPayer.medicaid ?? 0,
        unit: "B",
        sourceIds: ["cms-nhe-2024"],
      },
      {
        label: "Workers' comp & other programs' overhead (continues)",
        value: MODEL.side.netCostContinuing,
        unit: "B",
      },
      { label: "Net cost of insurance, 2024", value: l.before, unit: "B", result: true },
      { label: "Net cost of insurance under the plan", value: l.after, unit: "B", result: true },
      {
        label: "Eliminated",
        formula: `${fB(l.after)} − ${fB(l.before)}`,
        value: l.after - l.before,
        unit: "B",
        result: true,
      },
    ],
    tradeoff:
      "The largest administrative saving, paid for by insurer shutdowns, about 365,000 insurer jobs, and lost services some people value (care management, plan choice).",
    sourceIds: ["cms-nhe-2024", "naic-health-results"],
  })
}
{
  const w = useL(MODEL, "workforce")
  const comp = (label: string, q: ConstantId, u: ConstantId) => ({
    label,
    formula: `${fCount(v(q))} × ${fUsd(v(u))}`,
    value: (v(q) * v(u)) / 1e9,
    unit: "B" as const,
    inputs: [q, u],
  })
  add({
    id: "use-workforce",
    title: "Workforce capacity investment",
    stepId: "capacity-expansion",
    kind: "spending",
    summary: "Recurring funding to train the clinicians the higher utilization requires.",
    amount: w.after,
    amountUnit: "B",
    before: 0,
    after: w.after,
    calc: [
      comp("New residency positions", "residencySlots", "residencyCostPerSlot"),
      comp("Nursing faculty positions", "nursingFaculty", "nursingFacultyCost"),
      comp("Nursing clinical placements", "clinicalPlacements", "clinicalPlacementCost"),
      comp(
        "Tuition-free service scholars (medicine, dentistry, nursing)",
        "serviceScholars",
        "serviceScholarCost",
      ),
      comp("Community health workers", "communityHealthWorkers", "chwCost"),
      { label: "Total per year", value: DERIVED.workforceInvestment, unit: "B", result: true },
    ],
    range: { low: 8, high: 20, note: "Assumption range." },
    tradeoff:
      "Every dollar here raises costs now; without it, the utilization increase turns into longer waits for everyone.",
    sourceIds: ["aamc-shortage", "hrsa-nursing"],
  })
}
for (const [id, stepId, title, why] of [
  [
    "publicHealth",
    "trust-fund",
    "Government public health",
    "Health departments, surveillance, vaccination. Held constant so the ledger isolates the coverage change.",
  ],
  [
    "research",
    "trust-fund",
    "Non-commercial research",
    "NIH and other non-commercial research, held constant.",
  ],
  [
    "structures",
    "ongoing-capacity-planning",
    "Structures & equipment (capital)",
    "Hospital and clinic construction and major equipment, held at the 2024 level and allocated through regional capital boards.",
  ],
] as const) {
  const l = useL(MODEL, id)
  add({
    id: `use-${id}`,
    title,
    stepId,
    kind: "spending",
    summary: why,
    amount: l.after,
    amountUnit: "B",
    before: l.before,
    after: l.after,
    calc: [
      { label: "2024 (CMS NHE Table 4)", value: l.before, unit: "B", sourceIds: ["cms-nhe-2024"] },
      { label: "Change under the plan", value: l.after - l.before, unit: "B" },
      { label: "Under the plan", value: l.after, unit: "B", result: true },
    ],
    tradeoff:
      id === "structures"
        ? "Planned capital allocation directs investment to shortage areas but can be slow or captured; Canada's central capital planning under-invested in imaging."
        : "Holding this flat is a modeling choice; more public health spending is a separate decision.",
    sourceIds: ["cms-nhe-2024"],
  })
}

// ------------------------------------------------------------------ 3. sources of funds
const SOURCE_STEP: Record<string, string> = {
  bizEsi: "end-esi",
  hhEsi: "end-esi",
  fedEsi: "end-esi",
  slEsi: "end-esi",
  fedRds: "end-esi",
  hhDirect: "marketplace-closure",
  fedMarketplace: "marketplace-closure",
  hhSmi: "medicare-upgrade",
  fedMedicare: "trust-fund",
  fedBuyIn: "trust-fund",
  hhOop: "define-benefits",
  bizPayroll: "tax-legislation",
  fedPayroll: "tax-legislation",
  slPayroll: "tax-legislation",
  hhPremium: "tax-legislation",
  hhTopSurtax: "tax-legislation",
  fedGap: "tax-legislation",
  hhIncomeTax: "employer-coordination",
  bizHi: "trust-fund",
  hhHi: "trust-fund",
  fedHi: "trust-fund",
  slHi: "trust-fund",
  fedMedicaid: "wind-down-medicaid",
  slMoe: "state-moe-design",
  bizOther: "coordinate-other-payers",
  hhPc: "coordinate-other-payers",
  fedPrograms: "coordinate-other-payers",
  otherPrivate: "trust-fund",
  fedPublicHealth: "trust-fund",
  fedOther: "trust-fund",
  slPrograms: "trust-fund",
  slPublicHealth: "trust-fund",
  slOther: "trust-fund",
}

function sourceCalc(id: string): CalcStep[] {
  const m = MODEL
  const s = m.side
  const l = srcL(m, id)
  const base: CalcStep = {
    label: "2024 amount (CMS NHE Tables 5-1 to 5-4)",
    value: l.before,
    unit: "B",
    sourceIds: ["cms-nhe-2024"],
  }
  switch (id) {
    case "bizPayroll":
    case "fedPayroll":
    case "slPayroll": {
      const steps: CalcStep[] = [
        {
          label: "Wages & salaries, 2024 (BEA)",
          value: v("wageBase"),
          unit: "B",
          inputs: ["wageBase"],
          sourceIds: ["bea-wages"],
        },
        {
          label: `Remove payroll under each employer's ${fUsd(v("payrollExemption"))} exemption (${fPct(v("smallEmployerExemptShare"))})`,
          formula: `${fB(v("wageBase"))} × (1 − ${fPct(v("smallEmployerExemptShare"))})`,
          value: s.taxableWages,
          unit: "B",
          inputs: ["smallEmployerExemptShare", "payrollExemption"],
        },
        {
          label: `Tax at ${fPct(m.rates.employerTaxRate)}`,
          formula: `${fB(s.taxableWages)} × ${fPct(m.rates.employerTaxRate)}`,
          value: s.employerTax,
          unit: "B",
          inputs: ["employerTaxRate"],
          result: true,
        },
        {
          label: "Private employers' share of wages",
          formula: `${fB(v("privateWages"))} ÷ (${fB(v("privateWages"))} + ${fB(v("governmentWages"))})`,
          value: s.privateWageShare,
          unit: "%",
          inputs: ["privateWages", "governmentWages"],
        },
        {
          label: "Private employers pay",
          formula: `${fB(s.employerTax)} × ${fPct(s.privateWageShare)}`,
          value: s.employerTaxBusiness,
          unit: "B",
          result: id === "bizPayroll",
        },
        {
          label: "Government employers pay",
          formula: `${fB(s.employerTax)} − ${fB(s.employerTaxBusiness)}`,
          value: s.employerTaxGov,
          unit: "B",
        },
        {
          label: `  Federal (${fPct(s.federalShareOfGovWages)} of government wages)`,
          formula: `${fB(s.employerTaxGov)} × ${fPct(s.federalShareOfGovWages)}`,
          value: s.employerTaxFederal,
          unit: "B",
          inputs: ["federalShareOfGovWages"],
          result: id === "fedPayroll",
        },
        {
          label: "  State & local",
          formula: `${fB(s.employerTaxGov)} − ${fB(s.employerTaxFederal)}`,
          value: s.employerTaxStateLocal,
          unit: "B",
          result: id === "slPayroll",
        },
      ]
      return steps
    }
    case "hhPremium":
      return [
        {
          label: "Adjusted gross income, tax year 2022 (IRS)",
          value: v("agi2022"),
          unit: "B",
          inputs: ["agi2022"],
          sourceIds: ["irs-soi-2022"],
        },
        {
          label: `Grown to 2024 (+${fPct(v("agiGrowth2022to2024"))})`,
          formula: `${fB(v("agi2022"))} × (1 + ${fPct(v("agiGrowth2022to2024"))})`,
          value: DERIVED.agi2024,
          unit: "B",
          inputs: ["agiGrowth2022to2024"],
        },
        {
          label: "Minus income under household exemptions ($16k single … $32k family of four)",
          value: -v("agiExempted"),
          unit: "B",
          inputs: ["agiExempted", "exemptionSingle", "exemptionFour"],
        },
        {
          label: "AGI subject to the premium",
          formula: `${fB(DERIVED.agi2024)} − ${fB(v("agiExempted"))}`,
          value: DERIVED.agiBase,
          unit: "B",
        },
        {
          label: `Premium at ${fPct(m.rates.householdPremiumRate)}`,
          formula: `${fB(DERIVED.agiBase)} × ${fPct(m.rates.householdPremiumRate)}`,
          value: s.householdPremium,
          unit: "B",
          inputs: ["householdPremiumRate"],
          result: true,
        },
      ]
    case "hhIncomeTax":
      return [
        {
          label: "Employer premiums paid in 2024 (private + federal + state & local)",
          formula: `${fB(sponsor2024("bizEsi"))} + ${fB(sponsor2024("fedEsi"))} + ${fB(sponsor2024("slEsi"))}`,
          value: s.oldEmployerPremiums,
          unit: "B",
          sourceIds: ["cms-nhe-2024"],
        },
        { label: "Minus the new employer payroll tax", value: -s.employerTax, unit: "B" },
        { label: "Employers' net savings", value: s.employerNetSavings, unit: "B" },
        {
          label: `Share passed to wages (${fPct(m.rates.wagePassThrough)})`,
          formula: `${fB(s.employerNetSavings)} × ${fPct(m.rates.wagePassThrough)}`,
          value: Math.max(0, s.employerNetSavings) * m.rates.wagePassThrough,
          unit: "B",
          inputs: ["wagePassThrough"],
        },
        {
          label: "Plus worker premiums that used to be deducted pre-tax",
          value: sponsor2024("hhEsi"),
          unit: "B",
          sourceIds: ["cms-nhe-2024"],
        },
        { label: "Newly taxable wages", value: s.newlyTaxableWages, unit: "B", result: true },
        {
          label: `Federal income tax at ${fPct(m.rates.federalMarginalRate)}`,
          formula: `${fB(s.newlyTaxableWages)} × ${fPct(m.rates.federalMarginalRate)}`,
          value: s.newFederalIncomeTax,
          unit: "B",
          inputs: ["federalMarginalRate"],
          result: true,
        },
        {
          label: `Side effect (outside health): state income tax at ${fPct(m.rates.stateMarginalRate)}`,
          formula: `${fB(s.newlyTaxableWages)} × ${fPct(m.rates.stateMarginalRate)}`,
          value: s.newStateIncomeTax,
          unit: "B",
          inputs: ["stateMarginalRate"],
        },
        {
          label: `Side effect (outside health): Social Security tax at ${fPct(v("ssRate"))}`,
          formula: `${fB(s.newlyTaxableWages)} × ${fPct(v("ssRate"))}`,
          value: s.newSocialSecurity,
          unit: "B",
          inputs: ["ssRate"],
        },
      ]
    case "hhTopSurtax":
      return [
        {
          label: "Income above $1M per return, summed (estimate)",
          value: v("incomeAboveMillion"),
          unit: "B",
          inputs: ["incomeAboveMillion"],
        },
        {
          label: `Surtax at ${fPct(v("surtaxRate"))}`,
          formula: `${fB(v("incomeAboveMillion"))} × ${fPct(v("surtaxRate"))}`,
          value: DERIVED.surtaxRevenue,
          unit: "B",
          inputs: ["surtaxRate"],
        },
        {
          label: "Capital gains & dividends taxed as ordinary income above $1M",
          value: v("capGainsRevenue"),
          unit: "B",
          inputs: ["capGainsRevenue"],
          sourceIds: ["jct-capital-gains"],
        },
        {
          label: `Financial transactions tax (${fPct(v("fttRate"))}), after behavioral response`,
          value: v("fttRevenue"),
          unit: "B",
          inputs: ["fttRate", "fttRevenue"],
          sourceIds: ["cbo-ftt"],
        },
        {
          label: "Caps on remaining health-benefit deductions",
          value: v("deductionCapRevenue"),
          unit: "B",
          inputs: ["deductionCapRevenue"],
        },
        { label: "Total top-end revenue", value: TOP_END_REVENUE, unit: "B", result: true },
      ]
    case "bizHi":
    case "hhHi":
      return [
        base,
        {
          label: "Newly taxable wages (see income-tax item)",
          value: s.newlyTaxableWages,
          unit: "B",
        },
        {
          label: `× HI rate ${fPct(v("hiRate"))}, half paid by each side`,
          formula: `${fB(s.newlyTaxableWages)} × ${fPct(v("hiRate"))} × 50%${id === "bizHi" ? ` × ${fPct(s.privateWageShare)} private` : ""}`,
          value: l.after - l.before,
          unit: "B",
          inputs: ["hiRate"],
        },
        {
          label: "Under the plan (flows to the UHP Trust Fund)",
          value: l.after,
          unit: "B",
          result: true,
        },
      ]
    case "slMoe":
      return [
        {
          label: "State share of Medicaid, 2024",
          value: sponsor2024("slMedicaid"),
          unit: "B",
          sourceIds: ["cms-nhe-2024"],
        },
        {
          label: "State Medicare buy-in premiums, 2024",
          value: sponsor2024("slBuyIn"),
          unit: "B",
          sourceIds: ["cms-nhe-2024"],
        },
        {
          label: `× MOE share ${fPct(v("stateMoeShare"))}`,
          formula: `(${fB(sponsor2024("slMedicaid"))} + ${fB(sponsor2024("slBuyIn"))}) × ${fPct(v("stateMoeShare"))}`,
          value: s.stateMoe,
          unit: "B",
          inputs: ["stateMoeShare"],
          result: true,
        },
      ]
    case "hhOop": {
      const steps: CalcStep[] = [base]
      for (const r of m.serviceResults) {
        if (r.retainedOutOfPocket > 0.05)
          steps.push({
            label: `Stays out of pocket: ${r.label} (${fPct(r.assumption.retainedOutOfPocketShare)} of ${fB(r.baselineByPayer.outOfPocket ?? 0)})`,
            value: r.retainedOutOfPocket,
            unit: "B",
          })
      }
      steps.push({ label: "Out-of-pocket under the plan", value: l.after, unit: "B", result: true })
      steps.push({
        label: "Out-of-pocket eliminated",
        value: l.after - l.before,
        unit: "B",
        result: true,
      })
      return steps
    }
    case "fedGap": {
      const steps: CalcStep[] = [
        {
          label: "Total uses of funds under the plan",
          value: m.usesAfter,
          unit: "B",
          result: true,
        },
        { label: "Minus every named source (all other lines)", value: -s.fixedAfter, unit: "B" },
        {
          label: "Remaining general-revenue requirement",
          formula: `${fB(m.usesAfter)} − ${fB(s.fixedAfter)}`,
          value: m.gap,
          unit: "B",
          result: true,
        },
      ]
      return steps
    }
    default:
      return [
        base,
        { label: `Treatment: ${l.treatment}`, value: l.after - l.before, unit: "B" },
        { label: "Under the plan", value: l.after, unit: "B", result: true },
      ]
  }
}

for (const l of MODEL.sourceLines) {
  const lean = srcL(MODEL_LEAN, l.id)
  const costly = srcL(MODEL_COSTLY, l.id)
  add({
    id: `source-${l.id}`,
    title: l.label,
    stepId: SOURCE_STEP[l.id] ?? "trust-fund",
    kind: "revenue",
    summary: l.explanation,
    amount: l.after,
    amountUnit: "B",
    before: l.before,
    after: l.after,
    calc: sourceCalc(l.id),
    range:
      Math.abs(lean.after - costly.after) > 0.5
        ? {
            low: Math.min(lean.after, costly.after),
            high: Math.max(lean.after, costly.after),
            note: "Lean and costly scenarios.",
          }
        : undefined,
    tradeoff:
      l.treatment === "eliminated"
        ? "Payers stop paying this; the money is replaced by the new taxes listed under financing."
        : l.treatment === "new"
          ? "A new, visible tax replaces premiums and out-of-pocket costs. It is proportional to income or payroll instead of flat per person."
          : l.treatment === "redirected"
            ? "Existing public money keeps flowing, now to UHP instead of separate programs."
            : "Continues as before.",
    sourceIds: ["cms-nhe-2024"],
  })
}

// ------------------------------------------------------------------ 4. one-time costs
for (const c of ONE_TIME_COSTS) {
  const total = c.byYear.reduce((a, b) => a + b, 0)
  add({
    id: `onetime-${c.id}`,
    title: c.label,
    stepId: c.stepId,
    kind: "one-time",
    summary: c.basis,
    amount: total,
    amountUnit: "B",
    calc: [
      ...c.components.map((k) => ({
        label: k.label,
        formula: k.formula,
        value: k.amount,
        unit: "B" as const,
        inputs: k.inputs,
      })),
      { label: "Total one-time cost", value: total, unit: "B", result: true },
    ],
    byYear: c.byYear.map((value, i) => ({ label: PLAN_YEARS[i], value })),
    tradeoff: c.scheduleNote,
    sourceIds: [],
  })
}

// ------------------------------------------------------------------ 5. workforce
{
  const p = TRANSITION_PROGRAM
  const wage = Math.min(AVG_DISPLACED_WAGE, p.wageCap)
  const nW = DISPLACED_TOTAL
  const calc: CalcStep[] = [
    { label: "Displaced workers (sum of job groups)", value: nW, unit: "count", result: true },
    {
      label: "Average wage of displaced workers (capped)",
      value: wage,
      unit: "$",
      inputs: ["wpWageCap"],
    },
  ]
  p.wageReplacement.forEach((rate, i) => {
    const amt = (nW * wage * rate * p.stillUnemployed[i]) / 1e9
    calc.push({
      label: `Wage replacement, year ${i + 1}: ${fPct(rate)} of wage × ${fPct(p.stillUnemployed[i])} still unemployed`,
      formula: `${fCount(nW)} × ${fUsd(wage)} × ${fPct(rate)} × ${fPct(p.stillUnemployed[i])}`,
      value: amt,
      unit: "B",
      inputs: [
        (["wpReplacementY1", "wpReplacementY2", "wpReplacementY3"] as const)[i],
        (["wpUnemployedY1", "wpUnemployedY2", "wpUnemployedY3"] as const)[i],
      ],
    })
  })
  calc.push({
    label: "Wage insurance for reemployed workers",
    formula: `${fCount(nW)} × ${fPct(p.reemployedShare)} × ${fUsd(wage)} × ${fPct(p.reemployedWageLoss)} pay cut × ${fPct(p.wageInsuranceShare)} × ${p.wageInsuranceYears} years`,
    value: TRANSITION_PROGRAM_COST.wageInsurance,
    unit: "B",
    inputs: ["wpReemployedShare", "wpWageLoss", "wpInsuranceShare", "wpInsuranceYears"],
  })
  calc.push({
    label: "Training vouchers",
    formula: `${fCount(nW)} × ${fPct(p.trainingUptake)} × ${fUsd(p.trainingVoucher)}`,
    value: TRANSITION_PROGRAM_COST.training,
    unit: "B",
    inputs: ["wpVoucher", "wpVoucherUptake"],
  })
  calc.push({
    label: "Bridge pensions for workers 58+",
    formula: `${fCount(nW)} × ${fPct(p.bridgePensionShare)} × ${fUsd(p.bridgePensionAnnual)} × ${p.bridgePensionYears} years`,
    value: TRANSITION_PROGRAM_COST.bridge,
    unit: "B",
    inputs: ["wpBridgeShare", "wpBridgeAnnual", "wpBridgeYears"],
  })
  calc.push({
    label: "Total program cost",
    value: TRANSITION_PROGRAM_COST.total,
    unit: "B",
    result: true,
  })
  add({
    id: "worker-program",
    title: "Worker transition program: full calculation",
    stepId: "worker-transition",
    kind: "one-time",
    summary:
      "What it costs to support every displaced worker through wage replacement, wage insurance, training, and bridge pensions.",
    amount: TRANSITION_PROGRAM_COST.total,
    amountUnit: "B",
    calc,
    tradeoff:
      "More generous support costs more but reduces hardship and political opposition; displaced-worker research finds lasting earnings losses even with support.",
    sourceIds: ["peri-2018", "bls-oews-524114"],
  })
}
for (const g of DISPLACED_GROUPS) {
  const displaced = g.employed * g.displacedShare
  add({
    id: `jobs-${g.id}`,
    title: `Jobs: ${g.label}`,
    stepId:
      g.id === "insurers" || g.id === "tpa" || g.id === "brokers" || g.id === "pbm"
        ? "insurer-runoff"
        : g.id === "medicaidEligibility" || g.id === "navigators"
          ? "wind-down-medicaid"
          : g.id === "employerBenefits"
            ? "end-esi"
            : "worker-transition",
    kind: "jobs",
    summary: g.why + (g.geography ? ` Where: ${g.geography}` : ""),
    amount: -(displaced * g.avgWage) / 1e9,
    amountUnit: "B",
    calc: [
      { label: "Employed today", value: g.employed, unit: "count", sourceIds: g.sourceIds },
      { label: "Share displaced", value: g.displacedShare, unit: "%" },
      {
        label: "Jobs displaced",
        formula: `${fCount(g.employed)} × ${fPct(g.displacedShare)}`,
        value: displaced,
        unit: "count",
        result: true,
      },
      { label: "Average annual wage", value: g.avgWage, unit: "$" },
      {
        label: "Annual wages lost (before reemployment and transition support)",
        formula: `${fCount(displaced)} × ${fUsd(g.avgWage)}`,
        value: -(displaced * g.avgWage) / 1e9,
        unit: "B",
        result: true,
      },
    ],
    tradeoff:
      "Accepted under the plan's ground rules; cushioned by the worker transition program and hiring preference at UHA.",
    sourceIds: g.sourceIds,
  })
}
for (const g of JOB_GAINS) {
  add({
    id: `jobs-gain-${g.id}`,
    title: `Jobs created: ${g.label}`,
    stepId:
      g.id === "uha"
        ? "create-uha"
        : g.id === "ico"
          ? "integrated-care-orgs"
          : "capacity-expansion",
    kind: "jobs",
    summary: g.why,
    amount: 0,
    amountUnit: "B",
    calc:
      g.id === "care"
        ? [
            {
              label: "Utilization effect (more care)",
              value: MODEL.headline.utilizationEffect,
              unit: "B",
            },
            {
              label: "Labor share",
              value: v("clinicalLaborShare"),
              unit: "%",
              inputs: ["clinicalLaborShare"],
            },
            {
              label: "Average loaded compensation",
              value: v("clinicalComp"),
              unit: "$",
              inputs: ["clinicalComp"],
            },
            {
              label: "Jobs demanded",
              formula: `${fB(MODEL.headline.utilizationEffect)} × ${fPct(v("clinicalLaborShare"))} ÷ ${fUsd(v("clinicalComp"))}`,
              value: g.jobs,
              unit: "count",
              result: true,
            },
          ]
        : [
            {
              label: "Jobs",
              value: g.jobs,
              unit: "count",
              result: true,
              inputs: g.id === "uha" ? ["uhaJobs"] : ["icoJobs"],
            },
          ],
    tradeoff:
      g.id === "care"
        ? "Demand, not supply: jobs only exist if people are trained to fill them. Until then, unmet demand shows up as waits."
        : "New jobs for some displaced workers, but in different roles and places.",
    sourceIds: [],
  })
}

// ------------------------------------------------------------------ 6. households & employers
for (const h of HOUSEHOLDS) {
  add({
    id: `household-${h.id}`,
    title: `Household: ${h.name}`,
    stepId: "tax-legislation",
    kind: "household",
    summary: h.description,
    amount: h.longRunNet,
    amountUnit: "$",
    calc: [
      { label: "AGI today", value: h.agi, unit: "$" },
      { label: "Employer premium (hidden compensation)", value: h.employerPremium, unit: "$" },
      ...h.longRun.map((i) => ({
        label: i.label,
        value: i.amount,
        unit: "$" as const,
        note: i.explanation,
      })),
      { label: "Net change per year, long run", value: h.longRunNet, unit: "$", result: true },
      { label: "Net change per year, Year 1", value: h.shortRunNet, unit: "$", result: true },
    ],
    tradeoff: h.notes.join(" "),
    sourceIds: ["kff-ehbs-2025", "baicker-chandra"],
  })
}
for (const e of EMPLOYERS) {
  add({
    id: `employer-${e.id}`,
    title: `Employer: ${e.name}`,
    stepId: "end-esi",
    kind: "employer",
    summary: e.description,
    amount: e.change,
    amountUnit: "$",
    calc: [
      { label: "Annual payroll", value: e.payroll, unit: "$" },
      { label: "Health premiums paid before", value: e.premiumsBefore, unit: "$" },
      {
        label: `Payroll above the ${fUsd(v("payrollExemption"))} exemption`,
        formula: `max(0, ${fUsd(e.payroll)} − ${fUsd(v("payrollExemption"))})`,
        value: Math.max(0, e.payroll - v("payrollExemption")),
        unit: "$",
        inputs: ["payrollExemption"],
      },
      {
        label: `Health payroll tax at ${fPct(MODEL.rates.employerTaxRate)}`,
        value: e.taxAfter,
        unit: "$",
        inputs: ["employerTaxRate"],
      },
      {
        label: "Change (positive = employer saves)",
        formula: `${fUsd(e.premiumsBefore)} − ${fUsd(e.taxAfter)}`,
        value: e.change,
        unit: "$",
        result: true,
      },
    ],
    tradeoff: e.notes,
    sourceIds: ["kff-ehbs-2025"],
  })
}

add({
  id: "household-income-grid",
  title: "Who gains and who pays more, by income (family of four with employer coverage)",
  stepId: "tax-legislation",
  kind: "household",
  summary:
    "The same typical employer-covered family of four at different wages: premium, tax, wage, and out-of-pocket changes combined. It shows where the plan shifts from a net gain to a net cost.",
  amount: ESI_BREAK_EVEN,
  amountUnit: "$",
  calc: [
    ...INCOME_GRID.flatMap((g) => [
      { label: `Wage ${fUsd(g.wage)}: net change, Year 1`, value: g.shortRun, unit: "$" as const },
      {
        label: `Wage ${fUsd(g.wage)}: net change, long run`,
        value: g.longRun,
        unit: "$" as const,
        result: true,
      },
    ]),
    {
      label: "Break-even wage (long run), found by bisection",
      value: ESI_BREAK_EVEN,
      unit: "$",
      result: true,
    },
  ],
  tradeoff:
    "Replacing a flat per-family premium with income-based taxes is a transfer from high earners to everyone else. Families below roughly the break-even wage gain; those above pay more.",
  sourceIds: ["kff-ehbs-2025", "baicker-chandra"],
})

{
  const physicianUtil = MODEL.serviceResults.find((x) => x.id === "physicianClinical")!.assumption
    .utilization
  const rows: CalcStep[] = []
  for (const start of [0.75, 0.85, 0.9]) {
    for (const growth of [0, 0.03, 0.06, 0.1]) {
      const after = (start * physicianUtil) / (1 + growth)
      const mult =
        after >= 1 ? Number.POSITIVE_INFINITY : after / (1 - after) / (start / (1 - start))
      rows.push({
        label: `Practices ${fPct(start)} busy, capacity +${fPct(growth)} → ${after >= 1 ? "over 100% busy (queue grows without limit)" : `${fPct(after)} busy`}`,
        formula:
          after >= 1
            ? undefined
            : `[${n2(after)} ÷ (1 − ${n2(after)})] ÷ [${n2(start)} ÷ (1 − ${n2(start)})]`,
        value: Number.isFinite(mult) ? mult : 999,
        unit: "x",
        result: Number.isFinite(mult) && mult > 2,
      })
    }
  }
  add({
    id: "wait-queue-model",
    title: "How much waits grow if demand outpaces capacity (queueing model)",
    stepId: "capacity-expansion",
    kind: "budget",
    summary: `Physician visit demand rises by ${fPct(physicianUtil - 1)} under the plan. In a simple queue (M/M/1), the expected wait scales with utilization ÷ (1 − utilization), so waits explode as practices approach full capacity. This is illustrative, not a forecast: real practices triage, add hours, and use telehealth. A value of 999 means the queue grows without limit.`,
    amount: 0,
    amountUnit: "B",
    calc: [
      { label: "Demand multiplier (physician visits)", value: physicianUtil, unit: "x" },
      ...rows,
    ],
    tradeoff:
      "Covering everyone with no cost sharing is only compatible with short waits if capacity grows with demand. Every percentage point of capacity added before demand peaks cuts waits sharply; every point missed lengthens them sharply.",
    sourceIds: ["aamc-shortage", "fraser-2025", "nhs-rtt"],
  })
}

// ------------------------------------------------------------------ 7. stakeholder & budget views
{
  const r = svc(MODEL, "prescriptionDrugs")
  add({
    id: "loss-pharma",
    title: "Pharmaceutical manufacturer revenue",
    stepId: "national-formulary",
    kind: "loss",
    summary: "How much less drug makers receive for retail drugs under national negotiation.",
    amount: r.priceEffect * v("pharmaManufacturerShare"),
    amountUnit: "B",
    calc: [
      {
        label: "Brand share of retail drug spending",
        value: v("brandShareOfRetailRx"),
        unit: "%",
        inputs: ["brandShareOfRetailRx"],
      },
      {
        label: "Brand net price cut",
        value: v("brandPriceCut"),
        unit: "%",
        inputs: ["brandPriceCut"],
      },
      {
        label: "Resulting UHP drug rate",
        formula: `${fPct(v("brandShareOfRetailRx"))} × (1 − ${fPct(v("brandPriceCut"))}) + ${fPct(1 - v("brandShareOfRetailRx"))} × 1`,
        value: DERIVED.drugRate,
        unit: "x",
      },
      {
        label: "Retail drug price effect (see drug spending item)",
        value: r.priceEffect,
        unit: "B",
      },
      {
        label: "Manufacturer share of the price effect",
        value: v("pharmaManufacturerShare"),
        unit: "%",
        inputs: ["pharmaManufacturerShare"],
      },
      {
        label: "Manufacturer revenue change",
        formula: `${fB(r.priceEffect)} × ${fPct(v("pharmaManufacturerShare"))}`,
        value: r.priceEffect * v("pharmaManufacturerShare"),
        unit: "B",
        result: true,
      },
      {
        label: "Partly offset by higher volume (utilization effect)",
        value: r.utilizationEffect,
        unit: "B",
      },
    ],
    tradeoff:
      "Lower prices now vs. fewer new drugs later (CBO: a narrower policy meant about 8 fewer of ~300 new drugs in a decade).",
    sourceIds: ["rand-drugs-2024", "cbo-hr3-drugs"],
  })
}
{
  const profit = v("insurerProfit")
  add({
    id: "loss-insurer-equity",
    title: "Insurer shareholder value at risk",
    stepId: "insurer-runoff",
    kind: "loss",
    summary:
      "A one-time wealth loss, not an annual cash flow: the market value of the insurance profits that disappear.",
    amount: -profit * ((v("insurerEquityMultipleLow") + v("insurerEquityMultipleHigh")) / 2),
    amountUnit: "B",
    calc: [
      { label: "Annual insurer profit lost", value: profit, unit: "B", inputs: ["insurerProfit"] },
      {
        label: "Low earnings multiple",
        value: v("insurerEquityMultipleLow"),
        unit: "x",
        inputs: ["insurerEquityMultipleLow"],
      },
      {
        label: "High earnings multiple",
        value: v("insurerEquityMultipleHigh"),
        unit: "x",
        inputs: ["insurerEquityMultipleHigh"],
      },
      {
        label: "Value lost, low",
        formula: `${fB(profit)} × ${v("insurerEquityMultipleLow")}`,
        value: -profit * v("insurerEquityMultipleLow"),
        unit: "B",
        result: true,
      },
      {
        label: "Value lost, high",
        formula: `${fB(profit)} × ${v("insurerEquityMultipleHigh")}`,
        value: -profit * v("insurerEquityMultipleHigh"),
        unit: "B",
        result: true,
      },
    ],
    tradeoff:
      "No compensation is paid. Losing a market to regulation is not a taking, but shareholders (including pension funds) bear the loss.",
    sourceIds: ["naic-health-results"],
  })
}
for (const [id, stepId, constId, title, why] of [
  [
    "loss-pbm",
    "insurer-runoff",
    "pbmGrossProfit",
    "PBM gross profit lost",
    "Pharmacy benefit managers' rebate retention, spread pricing, and administrative fees end when UHA pays pharmacies directly.",
  ],
  [
    "loss-brokers",
    "insurer-runoff",
    "brokerCommissions",
    "Broker & agent commissions lost",
    "Commissions and marketing for health coverage end except for supplementary insurance. This is part of insurer overhead, shown separately.",
  ],
] as const) {
  add({
    id,
    title,
    stepId,
    kind: "loss",
    summary: why,
    amount: -v(constId),
    amountUnit: "B",
    calc: [
      { label: title, value: -v(constId), unit: "B", inputs: [constId], result: true },
      {
        label: "Per resident, per year (what everyone was paying for it)",
        formula: `${fB(v(constId))} ÷ ${C.population.value}M`,
        value: (v(constId) * 1e9) / (C.population.value * 1e6),
        unit: "$",
      },
    ],
    tradeoff:
      "Intermediaries' revenue is the system's administrative cost; ending it saves money and ends their jobs and business.",
    sourceIds: [],
  })
}
for (const [id, stepId, svcId, shareId, label] of [
  [
    "saving-hospital-billing",
    "hospital-global-budgets",
    "hospital",
    "hospitalBirShare",
    "Hospital billing costs avoided",
  ],
  [
    "saving-physician-billing",
    "fee-schedule",
    "physicianClinical",
    "physicianBirShare",
    "Physician billing costs avoided",
  ],
] as const) {
  const r = svc(MODEL, svcId)
  const saved = r.baselineTotal * v(shareId) * v("birReduction")
  add({
    id,
    title: label,
    stepId,
    kind: "saving",
    summary:
      "Provider-side administrative savings from one payer, one claim format, no prior authorization, and no patient collections. These savings are what make UHP rates viable; they are not subtracted again in the ledger.",
    amount: saved,
    amountUnit: "B",
    calc: [
      {
        label: "2024 revenue for this service",
        value: r.baselineTotal,
        unit: "B",
        sourceIds: ["cms-nhe-2024"],
      },
      {
        label: "Billing & insurance-related cost share",
        value: v(shareId),
        unit: "%",
        inputs: [shareId],
        sourceIds: ["jiwani-2014"],
      },
      {
        label: "Share eliminated under one payer",
        value: v("birReduction"),
        unit: "%",
        inputs: ["birReduction"],
      },
      {
        label: "Annual cost avoided",
        formula: `${fB(r.baselineTotal)} × ${fPct(v(shareId))} × ${fPct(v("birReduction"))}`,
        value: saved,
        unit: "B",
        result: true,
      },
      { label: "Compare: revenue change under UHP", value: r.delta, unit: "B" },
      {
        label: "Net effect on providers' margin (revenue change + cost avoided)",
        formula: `${fB(r.delta)} + ${fB(saved)}`,
        value: r.delta + saved,
        unit: "B",
        result: true,
      },
    ],
    tradeoff:
      "Billing staff lose jobs; providers' margins improve on average, but the distribution across hospitals and practices is uneven.",
    sourceIds: ["jiwani-2014"],
  })
}
{
  const s = MODEL
  add({
    id: "budget-states",
    title: "State & local government budgets",
    stepId: "state-moe-design",
    kind: "budget",
    summary:
      "The net effect on state and local governments, combining health spending, new income-tax revenue, and lost premium taxes.",
    amount:
      s.sponsorBefore.stateLocal -
      s.sponsorAfter.stateLocal +
      s.side.newStateIncomeTax -
      v("statePremiumTax"),
    amountUnit: "B",
    calc: [
      {
        label: "State & local health spending, 2024",
        value: s.sponsorBefore.stateLocal,
        unit: "B",
        sourceIds: ["cms-nhe-2024"],
      },
      {
        label: "State & local health spending under the plan",
        value: s.sponsorAfter.stateLocal,
        unit: "B",
      },
      {
        label: "Health spending saved",
        formula: `${fB(s.sponsorBefore.stateLocal)} − ${fB(s.sponsorAfter.stateLocal)}`,
        value: s.sponsorBefore.stateLocal - s.sponsorAfter.stateLocal,
        unit: "B",
        result: true,
      },
      {
        label: "Plus state income tax on newly taxable wages",
        value: s.side.newStateIncomeTax,
        unit: "B",
      },
      {
        label: "Minus state premium taxes lost",
        value: -v("statePremiumTax"),
        unit: "B",
        inputs: ["statePremiumTax"],
      },
      {
        label: "Net gain to state & local budgets",
        value:
          s.sponsorBefore.stateLocal -
          s.sponsorAfter.stateLocal +
          s.side.newStateIncomeTax -
          v("statePremiumTax"),
        unit: "B",
        result: true,
      },
    ],
    tradeoff:
      "States gain money but lose control of Medicaid; high-Medicaid-spending states pay more MOE per resident than low-spending states.",
    sourceIds: ["cms-nhe-2024", "nfib-sebelius"],
  })
}
{
  const calc: CalcStep[] = [
    ...FEDERAL_OUTLAYS.map((l) => ({
      label: `Outlay: ${l.label}`,
      formula: `${fB(l.before)} → ${fB(l.after)}`,
      value: l.after - l.before,
      unit: "B" as const,
      note: l.note,
    })),
    {
      label: "Federal health outlays, before",
      value: FEDERAL.outlaysBefore,
      unit: "B",
      result: true,
    },
    {
      label: "Federal health outlays, after",
      value: FEDERAL.outlaysAfter,
      unit: "B",
      result: true,
    },
    ...DEDICATED_RECEIPTS.map((l) => ({
      label: `Receipt: ${l.label}`,
      formula: `${fB(l.before)} → ${fB(l.after)}`,
      value: l.after - l.before,
      unit: "B" as const,
      note: l.note,
    })),
    { label: "Dedicated receipts, before", value: FEDERAL.receiptsBefore, unit: "B", result: true },
    { label: "Dedicated receipts, after", value: FEDERAL.receiptsAfter, unit: "B", result: true },
    {
      label: "General fund needed, before",
      formula: `${fB(FEDERAL.outlaysBefore)} − ${fB(FEDERAL.receiptsBefore)}`,
      value: GENERAL_FUND_BEFORE,
      unit: "B",
    },
    {
      label: "General fund needed, after",
      formula: `${fB(FEDERAL.outlaysAfter)} − ${fB(FEDERAL.receiptsAfter)}`,
      value: GENERAL_FUND_AFTER,
      unit: "B",
    },
    {
      label: "Change in general-fund health spending",
      value: GENERAL_FUND_AFTER - GENERAL_FUND_BEFORE,
      unit: "B",
      result: true,
      note: "Differs slightly from the ledger's general-revenue line because the federal government also stops paying FEHB premiums and starts paying the employer tax as an employer.",
    },
  ]
  add({
    id: "budget-federal",
    title: "Federal budget view (one year, 2024 dollars)",
    stepId: "trust-fund",
    kind: "budget",
    summary:
      "Under single payer nearly all health spending flows through the Treasury, so federal outlays roughly double even though national spending barely changes.",
    amount: FEDERAL.outlaysAfter - FEDERAL.outlaysBefore,
    amountUnit: "B",
    calc,
    tradeoff:
      "Headline 'federal cost' numbers look enormous because private premiums become public taxes; the fair comparison is national spending and who pays.",
    sourceIds: ["cms-nhe-2024", "cbo-single-payer-2020"],
  })
  add({
    id: "budget-ten-year",
    title: `Ten-year federal window (${WINDOW[0]}–${WINDOW[WINDOW.length - 1]})`,
    stepId: "trust-fund",
    kind: "budget",
    summary:
      "The one-year figures grown at projected health spending growth and summed over a ten-year budget window, for comparison with CBO, Urban Institute, and Mercatus estimates.",
    amount: TEN_YEAR.outlayIncrease,
    amountUnit: "B",
    calc: [
      {
        label: "Annual NHE growth assumed",
        value: v("nheGrowth"),
        unit: "%",
        inputs: ["nheGrowth"],
        sourceIds: ["cms-nhe-2024"],
      },
      ...WINDOW.map((y) => ({
        label: `${y} growth factor vs 2024`,
        formula: `(1 + ${fPct(v("nheGrowth"))})^${y - 2024}`,
        value: (1 + v("nheGrowth")) ** (y - 2024),
        unit: "x" as const,
      })),
      { label: "Sum of growth factors", value: WINDOW_FACTOR, unit: "x", result: true },
      {
        label: "Federal outlay increase over ten years",
        formula: `${fB(FEDERAL.outlaysAfter - FEDERAL.outlaysBefore)} × ${n2(WINDOW_FACTOR)}`,
        value: TEN_YEAR.outlayIncrease,
        unit: "B",
        result: true,
      },
      {
        label: "New dedicated federal revenue over ten years",
        value: TEN_YEAR.newDedicatedRevenue,
        unit: "B",
      },
      {
        label: "Net general-fund increase over ten years",
        value: TEN_YEAR.generalFundIncrease,
        unit: "B",
        result: true,
      },
      {
        label: "National health spending change over ten years",
        value: TEN_YEAR.nationalSpendingChange,
        unit: "B",
        result: true,
      },
      {
        label: "Premiums eliminated over ten years",
        value: TEN_YEAR.premiumsEliminated,
        unit: "B",
      },
      {
        label: "Out-of-pocket spending eliminated over ten years",
        value: TEN_YEAR.householdOutOfPocketSaved,
        unit: "B",
      },
      {
        label: "Compare: Mercatus (2018), federal increase 2022–2031",
        value: 32600,
        unit: "B",
        sourceIds: ["mercatus-2018"],
      },
      {
        label: "Compare: Urban Institute (2019), federal increase 2020–2029",
        value: 34000,
        unit: "B",
        sourceIds: ["urban-2019"],
      },
    ],
    tradeoff:
      "Federal spending rises by tens of trillions of dollars over a decade while private spending falls by about as much; the totals are a shift in who pays, not mostly new spending.",
    sourceIds: ["mercatus-2018", "urban-2019", "cbo-single-payer-2020"],
  })
}
{
  const calc: CalcStep[] = []
  const revenue = REVENUE_PHASE_IN
  for (const y of PHASE_IN) {
    const wave = ENROLLMENT_WAVES.find((w) => w.year === y.year)!
    calc.push({
      label: `Year ${y.year}: UHP carries ${fPct(wave.cumulativeSpendingShare)} of steady-state spending — new financing needed`,
      value: y.need,
      unit: "B",
    })
    calc.push({
      label: `Year ${y.year}: new taxes raised (${revenue.map((r) => `${r.label} ${fPct(r.schedule[y.year - 1])}`).join("; ")})`,
      value: y.raised,
      unit: "B",
    })
    calc.push({
      label: `Year ${y.year}: general revenue (as in steady state)`,
      value: y.generalRevenue,
      unit: "B",
    })
    calc.push({
      label: `Year ${y.year}: phase-in shortfall`,
      formula: `${fB(y.need)} − ${fB(y.raised)} − ${fB(y.generalRevenue)}`,
      value: y.shortfall,
      unit: "B",
    })
    calc.push({ label: `Year ${y.year}: one-time costs`, value: y.oneTime, unit: "B" })
    calc.push({
      label: `Year ${y.year}: temporary borrowing`,
      value: y.borrowing,
      unit: "B",
      result: true,
    })
  }
  add({
    id: "phase-in-borrowing",
    title: "Phase-in financing gap & temporary borrowing",
    stepId: "full-tax-rates",
    kind: "budget",
    summary:
      "During the four-year phase-in, spending moves to UHP faster than the new taxes ramp up.",
    amount: PHASE_IN.reduce((s, y) => s + y.borrowing, 0),
    amountUnit: "B",
    calc,
    byYear: PHASE_IN.map((y) => ({ label: `Year ${y.year}`, value: y.borrowing })),
    tradeoff:
      "Faster tax phase-in would cut borrowing but hit taxpayers before many of them are covered.",
    sourceIds: [],
  })
}

export const COST_ITEMS = ITEMS
export const COST_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]))
export const costsForStep = (stepId: string) => ITEMS.filter((i) => i.stepId === stepId)

export const POP_MILLIONS = C.population.value
export const HOUSEHOLDS_MILLIONS = C.households.value
