import type { Confidence } from "./model"
import { v } from "./constants"
import { MODEL } from "./model"

export type JobGroup = {
  id: string
  label: string
  employed: number
  displacedShare: number
  avgWage: number
  why: string
  confidence: Confidence
  sourceIds: string[]
  /** Where job losses concentrate. */
  geography?: string
}

/** Jobs that shrink or disappear. Employment counts are people, wages are 2024 dollars. */
export const DISPLACED_GROUPS: JobGroup[] = [
  {
    id: "insurers",
    label: "Health & medical insurance carriers (incl. Medicare Advantage & Medicaid plans)",
    employed: v("blsHealthCarriers"),
    displacedShare: 0.85,
    avgWage: v("blsHealthCarriersWage"),
    why: "Underwriting, sales, network contracting, utilization management, and claims adjudication for UHP-covered services end. About 15% of roles (claims processing, nurse care managers, data analysts) map onto UHP and integrated-care-organization jobs.",
    confidence: "medium",
    sourceIds: ["bls-oews-2025"],
    geography:
      "Concentrated in Hartford & Bloomfield CT (Aetna, Cigna), Minnetonka & Eden Prairie MN (UnitedHealth), Louisville KY (Humana), Indianapolis IN (Elevance), St. Louis MO (Centene), Long Beach CA (Molina), plus regional Blues plans in every state.",
  },
  {
    id: "tpa",
    label: "Third-party administrators & claims adjusting (health share)",
    employed: Math.round(v("blsOtherInsuranceRelated") * v("tpaHealthShare")),
    displacedShare: 0.8,
    avgWage: 64_000,
    why: "TPAs administer self-insured employer plans, and those plans end.",
    confidence: "low",
    sourceIds: [],
  },
  {
    id: "brokers",
    label: "Health insurance brokers, agents & benefits consultants",
    employed: Math.round(v("blsAgenciesBrokerages") * v("brokerHealthShare")),
    displacedShare: 0.9,
    avgWage: 72_000,
    why: "There is nothing left to sell except supplementary coverage.",
    confidence: "low",
    sourceIds: [],
  },
  {
    id: "pbm",
    label: "Pharmacy benefit manager corporate staff",
    employed: 40_000,
    displacedShare: 0.85,
    avgWage: 85_000,
    why: "Rebate negotiation, formulary design, and claims adjudication move to the national formulary. Pharmacists in PBM-owned retail and mail pharmacies are not counted here; dispensing continues.",
    confidence: "low",
    sourceIds: [],
  },
  {
    id: "providerBilling",
    label: "Provider billing, coding, prior-authorization & patient-collections staff",
    employed:
      v("blsBillingClerksAmbulatory") +
      v("blsBillingClerksHospitals") +
      v("blsMedicalRecords") +
      v("insuranceFrontOffice"),
    displacedShare: 0.45,
    avgWage: Math.round(
      ((v("blsBillingClerksAmbulatory") + v("blsBillingClerksHospitals")) *
        v("blsBillingClerkWage") +
        v("blsMedicalRecords") * v("blsMedicalRecordsWage") +
        v("insuranceFrontOffice") * 45_000) /
        (v("blsBillingClerksAmbulatory") +
          v("blsBillingClerksHospitals") +
          v("blsMedicalRecords") +
          v("insuranceFrontOffice")),
    ),
    why: "Coding remains for the fee schedule and quality data, but eligibility checks, prior authorization, denial appeals, patient collections, and payer-specific billing disappear. Hospitals under global budgets need far fewer per-claim staff.",
    confidence: "medium",
    sourceIds: ["bls-oews-2025", "jiwani-2014"],
  },
  {
    id: "employerBenefits",
    label: "Employer HR benefits administration (health portion)",
    employed: 50_000,
    displacedShare: 0.5,
    avgWage: 72_000,
    why: "Open enrollment, plan selection, and COBRA administration end. Retirement and other benefits remain.",
    confidence: "low",
    sourceIds: [],
  },
  {
    id: "medicaidEligibility",
    label: "State Medicaid eligibility & managed-care oversight staff",
    employed: 60_000,
    displacedShare: 0.5,
    avgWage: 55_000,
    why: "Income-based eligibility determination and annual redeterminations end. Some staff move to state UHP regional offices or SNAP/TANF.",
    confidence: "low",
    sourceIds: [],
  },
  {
    id: "navigators",
    label: "Marketplace call centers, navigators & enrollment assisters",
    employed: 15_000,
    displacedShare: 0.9,
    avgWage: 45_000,
    why: "The Marketplaces close.",
    confidence: "low",
    sourceIds: [],
  },
  {
    id: "rcm",
    label: "Revenue-cycle management & claims clearinghouse companies",
    employed: 120_000,
    displacedShare: 0.6,
    avgWage: 62_000,
    why: "Outsourced billing, clearinghouses (e.g., Change Healthcare, Waystar), and denial-management vendors lose most of their business. A single claim format needs far less intermediation.",
    confidence: "low",
    sourceIds: [],
  },
]

export type JobGain = {
  id: string
  label: string
  jobs: number
  why: string
  confidence: Confidence
}

const utilizationDollars = MODEL.headline.utilizationEffect
/** Share of incremental clinical spending that is labor, and average loaded compensation. */
const LABOR_SHARE = v("clinicalLaborShare")
const AVG_CLINICAL_COMP = v("clinicalComp")

export const JOB_GAINS: JobGain[] = [
  {
    id: "uha",
    label: "Universal Health Administration & claims contractors",
    jobs: v("uhaJobs"),
    why: `UHP administration costs about $${Math.round(MODEL.headline.uhpAdmin)}B a year. Roughly 45% is labor at about $105k loaded compensation, after IT, facilities, and contracts.`,
    confidence: "medium",
  },
  {
    id: "care",
    label: "Clinical & direct-care jobs demanded by higher utilization",
    jobs: Math.round(((utilizationDollars * 1e9 * LABOR_SHARE) / AVG_CLINICAL_COMP / 1000) * 1000),
    why: `The ${Math.round(utilizationDollars)}B utilization increase is about 55% labor at about $85k loaded compensation. This is demand, not supply: these jobs exist only if people are trained to fill them, which is what the workforce investment pays for. Until then, the gap shows up as longer waits.`,
    confidence: "low",
  },
  {
    id: "ico",
    label: "Integrated care organization care coordinators",
    jobs: v("icoJobs"),
    why: "Care-management nurses and social workers move from insurers to provider-run integrated systems.",
    confidence: "low",
  },
]

export const DISPLACED_TOTAL = DISPLACED_GROUPS.reduce(
  (s, g) => s + g.employed * g.displacedShare,
  0,
)
export const DISPLACED_WAGES = DISPLACED_GROUPS.reduce(
  (s, g) => s + g.employed * g.displacedShare * g.avgWage,
  0,
)
export const AVG_DISPLACED_WAGE = DISPLACED_WAGES / DISPLACED_TOTAL
export const GAINS_TOTAL = JOB_GAINS.reduce((s, g) => s + g.jobs, 0)

/**
 * Worker transition program. Parameters are policy choices; the share still
 * unemployed in each year is an assumption based on displaced-worker surveys.
 */
export const TRANSITION_PROGRAM = {
  wageReplacement: [v("wpReplacementY1"), v("wpReplacementY2"), v("wpReplacementY3")],
  /** Average share of displaced workers still without a job during year 1, 2, 3. */
  stillUnemployed: [v("wpUnemployedY1"), v("wpUnemployedY2"), v("wpUnemployedY3")],
  wageCap: v("wpWageCap"),
  /** Reemployed workers who earn less get this share of the gap. */
  wageInsuranceShare: v("wpInsuranceShare"),
  wageInsuranceYears: v("wpInsuranceYears"),
  reemployedWageLoss: v("wpWageLoss"),
  reemployedShare: v("wpReemployedShare"),
  trainingVoucher: v("wpVoucher"),
  trainingUptake: v("wpVoucherUptake"),
  bridgePensionShare: v("wpBridgeShare"),
  bridgePensionAnnual: v("wpBridgeAnnual"),
  bridgePensionYears: v("wpBridgeYears"),
}

function programCost() {
  const p = TRANSITION_PROGRAM
  const wage = Math.min(AVG_DISPLACED_WAGE, p.wageCap)
  const n = DISPLACED_TOTAL
  const replacement = p.wageReplacement.reduce(
    (s, rate, i) => s + n * wage * rate * p.stillUnemployed[i],
    0,
  )
  const wageInsurance =
    n *
    p.reemployedShare *
    wage *
    p.reemployedWageLoss *
    p.wageInsuranceShare *
    p.wageInsuranceYears
  const training = n * p.trainingUptake * p.trainingVoucher
  const bridge = n * p.bridgePensionShare * p.bridgePensionAnnual * p.bridgePensionYears
  return {
    replacement: replacement / 1e9,
    wageInsurance: wageInsurance / 1e9,
    training: training / 1e9,
    bridge: bridge / 1e9,
    total: (replacement + wageInsurance + training + bridge) / 1e9,
  }
}

export const TRANSITION_PROGRAM_COST = programCost()
