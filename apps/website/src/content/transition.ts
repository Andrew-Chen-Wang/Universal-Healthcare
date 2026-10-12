import { type ConstantId, v } from "./constants"
import { MODEL } from "./model"
import { TRANSITION_PROGRAM_COST } from "./workforce"

/** One line inside a one-time cost: quantity × unit cost, or a lump sum. */
export type CostComponent = {
  label: string
  /** Billions. */
  amount: number
  /** Human-readable formula with the actual numbers. */
  formula: string
  inputs: ConstantId[]
}

export type OneTimeCost = {
  id: string
  label: string
  /** Billions, by plan year: index 0 = build period (Year 0), then Years 1-6. */
  byYear: number[]
  basis: string
  stepId: string
  components: CostComponent[]
  /** How the total is spread across years. */
  scheduleNote: string
}

/** Program years: Year 0 is the 18-month build period, coverage starts in Year 1. */
export const PLAN_YEARS = ["Year 0", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"]

const n = (x: number) => x.toLocaleString("en-US", { maximumFractionDigits: 2 })
const usd = (x: number) => `$${n(x)}`
const B = (x: number) => `$${n(x)}B`

/** qty × unit cost (dollars) → billions. */
function qty(
  label: string,
  qId: ConstantId,
  unitId: ConstantId,
  times?: ConstantId,
): CostComponent {
  const q = v(qId)
  const u = v(unitId)
  const t = times ? v(times) : 1
  return {
    label,
    amount: (q * u * t) / 1e9,
    formula: `${n(q)} × ${usd(u)}${times ? ` × ${n(t)} years` : ""}`,
    inputs: times ? [qId, unitId, times] : [qId, unitId],
  }
}

/** A lump sum already in billions. */
function lump(label: string, id: ConstantId): CostComponent {
  return { label, amount: v(id), formula: B(v(id)), inputs: [id] }
}

function spread(total: number, profile: number[]) {
  const sum = profile.reduce((a, b) => a + b, 0)
  return profile.map((p) => (total * p) / sum)
}

function item(
  id: string,
  label: string,
  stepId: string,
  basis: string,
  components: CostComponent[],
  profile: number[],
  scheduleNote: string,
): OneTimeCost {
  const total = components.reduce((s, c) => s + c.amount, 0)
  return { id, label, stepId, basis, components, byYear: spread(total, profile), scheduleNote }
}

const wp = TRANSITION_PROGRAM_COST

export const ONE_TIME_COSTS: OneTimeCost[] = [
  item(
    "it",
    "Claims, enrollment & provider systems (IT)",
    "build-claims-system",
    "Extends Medicare's shared systems instead of building from scratch. For scale: HealthCare.gov cost about $2.1B through 2014 for a far simpler job, and the UK's NHS National Programme for IT spent about £10B and largely failed.",
    [
      lump(
        "Extend & re-platform Medicare shared claims systems (FISS, MCS, CWF)",
        "itClaimsExtension",
      ),
      {
        label: "Scale up Medicare Administrative Contractors for the whole population",
        amount: v("itMacRegions") * v("itMacScaleUp"),
        formula: `${n(v("itMacRegions"))} regions × ${B(v("itMacScaleUp"))}`,
        inputs: ["itMacRegions", "itMacScaleUp"],
      },
      lump("Real-time eligibility API & provider portal", "itEligibilityApi"),
      lump("Hospital global-budget payment & encounter-data system", "itGlobalBudgetRails"),
      lump("New claim types: dental, vision, hearing, HCBS", "itNewClaimTypes"),
      lump("Independent verification, load & parallel testing", "itVerification"),
      lump("Cybersecurity, redundancy & offline interim-payment system", "itSecurity"),
      lump("Legacy system decommissioning & data migration", "itDecommission"),
    ],
    [5, 5, 3, 2, 2, 1, 0],
    "Heaviest during the 18-month build and Year 1; tapering as later waves reuse the same systems.",
  ),
  item(
    "agency",
    "Agency start-up before steady-state funding",
    "create-uha",
    "Staff must be hired and trained before the administrative budget (a share of benefits) reaches its steady-state size.",
    [
      qty(
        "UHA staff hired ahead of steady-state funding",
        "agencyStaff",
        "agencyLoadedCost",
        "agencyPreFundedYears",
      ),
      qty("Regional offices set up", "regionalOffices", "regionalOfficeSetup"),
      lump("Rates Board, HTA Institute & Office of Patient Advocacy start-up", "boardsStartup"),
    ],
    [3, 3, 2, 1, 0, 0, 0],
    "Front-loaded: hiring happens before each wave.",
  ),
  item(
    "enrollment",
    "Enrollment, health cards & outreach",
    "auto-enrollment",
    "Everyone gets a card and notices; hard-to-reach groups get in-person help.",
    [
      {
        label: "Health cards for every resident",
        amount: (v("population") * 1e6 * v("cardCost")) / 1e9,
        formula: `${n(v("population"))}M people × ${usd(v("cardCost"))}`,
        inputs: ["population", "cardCost"],
      },
      {
        label: "Mailed notices",
        amount: (v("households") * 1e6 * v("noticesPerHousehold") * v("noticeCost")) / 1e9,
        formula: `${n(v("households"))}M households × ${n(v("noticesPerHousehold"))} notices × ${usd(v("noticeCost"))}`,
        inputs: ["households", "noticesPerHousehold", "noticeCost"],
      },
      lump("Multilingual outreach campaign", "outreachCampaign"),
      qty("In-person enrollment assisters", "assisters", "assisterCost", "assisterYears"),
    ],
    [0.5, 1.5, 0.8, 0.6, 0.6, 0, 0],
    "Mostly Year 1 (largest wave), then one notice cycle per later wave.",
  ),
  {
    id: "workers",
    label: "Worker transition program",
    stepId: "worker-transition",
    basis:
      "Wage replacement, wage insurance, training, and bridge pensions for displaced workers. The full calculation is on the program's own cost page.",
    components: [
      {
        label: "Wage replacement",
        amount: wp.replacement,
        formula: "See worker program calculation",
        inputs: [
          "wpReplacementY1",
          "wpReplacementY2",
          "wpReplacementY3",
          "wpUnemployedY1",
          "wpUnemployedY2",
          "wpUnemployedY3",
        ],
      },
      {
        label: "Wage insurance",
        amount: wp.wageInsurance,
        formula: "See worker program calculation",
        inputs: ["wpInsuranceShare", "wpReemployedShare", "wpWageLoss", "wpInsuranceYears"],
      },
      {
        label: "Training vouchers",
        amount: wp.training,
        formula: "See worker program calculation",
        inputs: ["wpVoucher", "wpVoucherUptake"],
      },
      {
        label: "Bridge pensions",
        amount: wp.bridge,
        formula: "See worker program calculation",
        inputs: ["wpBridgeShare", "wpBridgeAnnual", "wpBridgeYears"],
      },
    ],
    byYear: spread(wp.total, [0, 15, 25, 25, 25, 7, 3]),
    scheduleNote: "Follows the layoffs, which track the four enrollment waves.",
  },
  (() => {
    const annualShortfall = v("hfHospitals") * v("hfAvgRevenue") * v("hfShortfall")
    const tapers: ConstantId[] = ["hfTaper1", "hfTaper2", "hfTaper3", "hfTaper4"]
    const byYear = [0, ...tapers.map((t) => (annualShortfall * v(t)) / 1e9), 0, 0]
    return {
      id: "hospitalFund",
      label: "Hospital Transition Fund",
      stepId: "hospital-transition-fund",
      basis:
        "Temporary payments to hospitals whose revenue under UHP rates falls more than 5% below baseline, tapering to zero.",
      components: tapers.map((t, i) => ({
        label: `Year ${i + 1}: ${Math.round(v(t) * 100)}% of the shortfall`,
        amount: (annualShortfall * v(t)) / 1e9,
        formula: `${n(v("hfHospitals"))} hospitals × ${usd(v("hfAvgRevenue"))} revenue × ${Math.round(v("hfShortfall") * 100)}% shortfall × ${Math.round(v(t) * 100)}%`,
        inputs: ["hfHospitals", "hfAvgRevenue", "hfShortfall", t],
      })),
      byYear,
      scheduleNote: "Each year's payment is the year's taper share of the annual shortfall.",
    } satisfies OneTimeCost
  })(),
  item(
    "ruralCapital",
    "Rural & safety-net capital fund",
    "capacity-expansion",
    "Facility repair and replacement for rural hospitals at risk of closure, plus health center upgrades.",
    [
      qty("Rural hospitals at risk: repair or replacement", "rcRuralHospitals", "rcRuralCost"),
      qty("Federally qualified health center upgrades", "rcFqhcSites", "rcFqhcCost"),
    ],
    [0, 1, 1, 1, 1, 1, 0],
    "Even over Years 1–5.",
  ),
  item(
    "capacity",
    "Capacity expansion in shortage areas",
    "capacity-expansion",
    "Facilities targeted at the services with the longest waits once demand rises.",
    [
      qty("New or expanded community health center sites", "capChcSites", "capChcCost"),
      qty("Ambulatory surgery & imaging centers", "capAscImaging", "capAscCost"),
      qty("Dental clinics", "capDental", "capDentalCost"),
      qty(
        "Behavioral-health crisis & residential facilities",
        "capBehavioral",
        "capBehavioralCost",
      ),
    ],
    [2, 6, 6, 6, 6, 4, 0],
    "Starts in the build year so capacity is ready before later waves.",
  ),
  item(
    "dualSystems",
    "Running legacy Medicaid, Marketplace & Medicare systems in parallel",
    "wind-down-medicaid",
    "Old systems stay open for people not yet eligible until Year 4.",
    [
      {
        label: "State Medicaid systems kept running",
        amount: (v("dsStates") * v("dsStateAnnual") * v("dsYears")) / 1e9,
        formula: `${n(v("dsStates"))} states × ${usd(v("dsStateAnnual"))}/yr × ${n(v("dsYears"))} years`,
        inputs: ["dsStates", "dsStateAnnual", "dsYears"],
      },
      {
        label: "Federal & state exchanges kept running",
        amount: v("dsMarketplaceAnnual") * v("dsYears"),
        formula: `${B(v("dsMarketplaceAnnual"))}/yr × ${n(v("dsYears"))} years`,
        inputs: ["dsMarketplaceAnnual", "dsYears"],
      },
      lump("Medicare legacy systems in parallel", "dsMedicareLegacy"),
    ],
    [0, 4, 4, 3, 1, 0, 0],
    "Shrinks as each wave moves people off legacy systems.",
  ),
  item(
    "stateWindDown",
    "State Medicaid agency wind-down",
    "wind-down-medicaid",
    "Grants to states to redeploy or separate eligibility staff and decommission systems.",
    [
      qty("Severance & retraining for state eligibility staff", "swStaff", "swPerStaff"),
      qty("System decommissioning", "dsStates", "swSystemsPerState"),
      lump("Data migration to UHA", "swDataMigration"),
    ],
    [0, 0.5, 1, 1, 1, 0.5, 0],
    "Mostly Years 2–4.",
  ),
  item(
    "formulary",
    "Formulary & technology-assessment start-up",
    "national-formulary",
    "Staff, evidence contracts, and reference-price data before these bodies are absorbed into the administrative budget.",
    [
      qty("Start-up staff", "fbStaff", "fbStaffCost", "fbYears"),
      qty("Contracted drug assessments", "fbAssessments", "fbAssessmentCost"),
      lump("International reference-price data & IT", "fbData"),
    ],
    [5, 4, 3, 2, 1, 0, 0],
    "Front-loaded to have prices ready for Year 1.",
  ),
  item(
    "evaluation",
    "Independent evaluation & wait-time registry",
    "wait-time-guarantee",
    "Measurement that makes the wait-time guarantee enforceable and the plan's trade-offs checkable.",
    [
      lump("National wait-time registry build", "evRegistry"),
      qty("Patient-experience surveys", "evSurveyRespondents", "evSurveyCost", "evSurveyYears"),
      lump("Contracted independent evaluations", "evContracts"),
      lump("Data audits & measurement validation", "evDataAudit"),
    ],
    [3, 4, 4, 4, 3, 2, 0],
    "Registry first, then annual surveys and evaluations.",
  ),
  item(
    "legal",
    "Litigation & regulatory defense",
    "legal-defense",
    "DOJ and HHS defense of expected challenges (ERISA, Takings Clause, §1498, state MOE, duplicative-coverage ban).",
    [
      qty("Government attorneys", "lgAttorneys", "lgAttorneyCost", "lgYears"),
      lump("Outside experts & expert witnesses", "lgExperts"),
      lump("§1498 proceedings in the Court of Federal Claims", "lgClaimsCourt"),
    ],
    [3, 3, 2, 1, 1, 0, 0],
    "Most suits come immediately after enactment.",
  ),
]

export const ONE_TIME_TOTAL = ONE_TIME_COSTS.reduce(
  (s, c) => s + c.byYear.reduce((a, b) => a + b, 0),
  0,
)

/**
 * Phase-in. Each enrollment wave moves a share of steady-state UHP benefit
 * spending onto the program. Shares are approximate age-group shares of
 * personal health care spending (CMS age tables).
 */
export const ENROLLMENT_WAVES = [
  {
    year: 1,
    groups: "Everyone 55+ (including current Medicare), all children 0–18, Medicare enhancements",
    people: 176,
    cumulativeSpendingShare: 0.63,
  },
  { year: 2, groups: "Adults 45–54", people: 41, cumulativeSpendingShare: 0.76 },
  { year: 3, groups: "Adults 35–44", people: 44, cumulativeSpendingShare: 0.86 },
  { year: 4, groups: "Adults 19–34 and everyone else", people: 80, cumulativeSpendingShare: 1 },
]

/** New revenue instruments and how fast each phases in (share of steady-state yield, Years 1-4+). */
export const REVENUE_PHASE_IN = [
  {
    id: "bizPayroll+fedPayroll+slPayroll",
    label: "Employer health payroll tax",
    schedule: [0.4, 0.6, 0.8, 1],
  },
  { id: "hhPremium", label: "Household income-based premium", schedule: [0.25, 0.5, 0.75, 1] },
  {
    id: "hhIncomeTax",
    label: "Income tax on former premium dollars",
    schedule: [0.2, 0.4, 0.65, 1],
  },
  { id: "hhTopSurtax", label: "Top-end surtaxes & FTT", schedule: [1, 1, 1, 1] },
  { id: "hiGrowth", label: "Medicare payroll tax growth", schedule: [0.2, 0.4, 0.65, 1] },
]

function newRevenueBySource() {
  const get = (id: string) => MODEL.sourceLines.find((l) => l.id === id)!
  const delta = (id: string) => get(id).after - get(id).before
  return {
    "bizPayroll+fedPayroll+slPayroll":
      get("bizPayroll").after + get("fedPayroll").after + get("slPayroll").after,
    hhPremium: get("hhPremium").after,
    hhIncomeTax: get("hhIncomeTax").after,
    hhTopSurtax: get("hhTopSurtax").after,
    hiGrowth: delta("bizHi") + delta("hhHi"),
  } as Record<string, number>
}

/**
 * Steady-state new financing the plan needs = all new revenue + the general
 * revenue gap. During the phase-in, UHP takes on roughly cumulativeSpendingShare
 * of that need, the general-revenue share of it is appropriated as in steady
 * state, and the new taxes arrive on their own schedule. Anything left is
 * temporary transition borrowing.
 */
export function phaseInSchedule() {
  const revenue = newRevenueBySource()
  const steadyNewRevenue = Object.values(revenue).reduce((a, b) => a + b, 0)
  const steadyNeed = steadyNewRevenue + MODEL.gap
  return ENROLLMENT_WAVES.map((w, i) => {
    const need = steadyNeed * w.cumulativeSpendingShare
    const raised = REVENUE_PHASE_IN.reduce((s, r) => s + revenue[r.id] * r.schedule[i], 0)
    const generalRevenue = MODEL.gap * w.cumulativeSpendingShare
    const shortfall = Math.max(0, need - raised - generalRevenue)
    const oneTime = ONE_TIME_COSTS.reduce((s, c) => s + (c.byYear[w.year] ?? 0), 0)
    return {
      year: w.year,
      groups: w.groups,
      need,
      raised,
      generalRevenue,
      shortfall,
      oneTime,
      borrowing: shortfall + oneTime,
    }
  })
}

export const PHASE_IN = phaseInSchedule()
/** Temporary borrowing: phase-in shortfalls plus every one-time cost, Years 0-6. */
export const TRANSITION_BORROWING_TOTAL =
  PHASE_IN.reduce((s, y) => s + y.borrowing, 0) +
  ONE_TIME_COSTS.reduce((s, c) => s + c.byYear[0] + c.byYear[5] + c.byYear[6], 0)
