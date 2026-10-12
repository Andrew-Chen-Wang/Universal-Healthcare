/**
 * Every raw input number used on the site, defined exactly once.
 *
 * Content files import from here instead of writing literals, so a number that
 * appears in the ledger, a plan step, and a household example is always the same
 * number. Each constant records its unit, where it comes from, and how sure we
 * are. The /costs/inputs page renders this whole file.
 *
 * Units:
 *   usdB    billions of dollars
 *   usd     dollars
 *   count   people, jobs, facilities, etc.
 *   share   a fraction between 0 and 1
 *   ratio   a multiplier (e.g. 1.2 = 120% of Medicare)
 *   years   years
 */
export type Unit = "usdB" | "usd" | "count" | "share" | "ratio" | "years"
export type Confidence = "high" | "medium" | "low"
export type Kind = "data" | "policy" | "estimate"

export type Constant = {
  value: number
  unit: Unit
  label: string
  /** data = published statistic; policy = a choice the plan makes; estimate = our assumption. */
  kind: Kind
  confidence: Confidence
  sourceIds: string[]
  note?: string
  group: string
}

function k(
  group: string,
  label: string,
  value: number,
  unit: Unit,
  kind: Kind,
  opts: { confidence?: Confidence; sourceIds?: string[]; note?: string } = {},
): Constant {
  return {
    group,
    label,
    value,
    unit,
    kind,
    confidence:
      opts.confidence ?? (kind === "data" ? "high" : kind === "policy" ? "high" : "medium"),
    sourceIds: opts.sourceIds ?? [],
    note: opts.note,
  }
}

const POP = "Population & economy"
const PREM = "Premiums & cost sharing (2025)"
const PRICE = "Prices & payment rates"
const PLAN = "Plan policy parameters"
const TAX = "Taxes & revenue"
const WF = "Workforce investment (recurring)"
const IT = "One-time: IT systems"
const AG = "One-time: agency start-up"
const EN = "One-time: enrollment & outreach"
const HF = "One-time: hospital transition fund"
const RC = "One-time: rural & safety-net capital"
const CAP = "One-time: capacity expansion"
const DS = "One-time: parallel legacy systems"
const SW = "One-time: state Medicaid wind-down"
const FB = "One-time: formulary & HTA start-up"
const EV = "One-time: evaluation & wait-time registry"
const LG = "One-time: litigation"
const WP = "Worker transition program"
const INS = "Insurer overhead breakdown"
const ACC = "Access & capacity"

export const C = {
  // ---------------------------------------------------------------- Population & economy
  population: k(
    POP,
    "U.S. population, 2024 (millions, CMS-implied: $5,278.6B ÷ $15,474)",
    341.1,
    "count",
    "data",
    { sourceIds: ["cms-nhe-2024"] },
  ),
  households: k(POP, "U.S. households, 2024 (millions)", 132.2, "count", "data", {
    sourceIds: ["census-susb"],
    note: "Census CPS ASEC household count.",
  }),
  wageBase: k(POP, "Wages & salaries, 2024", 12388, "usdB", "data", { sourceIds: ["bea-wages"] }),
  privateWages: k(
    POP,
    "Private-industry wages & salaries (Q4 2024 annual rate)",
    10739,
    "usdB",
    "data",
    { sourceIds: ["bea-wages"] },
  ),
  governmentWages: k(
    POP,
    "Government wages & salaries (Q4 2024 annual rate)",
    1887,
    "usdB",
    "data",
    { sourceIds: ["bea-wages"] },
  ),
  federalShareOfGovWages: k(
    POP,
    "Federal share of government wages (civilian + military)",
    0.23,
    "share",
    "estimate",
    { sourceIds: ["bea-wages"] },
  ),
  agi2022: k(POP, "Adjusted gross income, tax year 2022", 15100, "usdB", "data", {
    sourceIds: ["irs-soi-2022"],
  }),
  agiGrowth2022to2024: k(POP, "AGI growth 2022 → 2024", 0.06, "share", "estimate", {
    note: "Roughly nominal wage + capital income growth over two years.",
  }),
  agiExempted: k(POP, "AGI removed by household exemptions", 3200, "usdB", "estimate", {
    confidence: "medium",
    note: "Most low-income returns use their full exemption; ~160M returns × an average ~$20k exemption, less unused exemption.",
  }),
  nheGrowth: k(
    POP,
    "Average annual NHE growth, 2024–2033 (CMS projection)",
    0.056,
    "share",
    "data",
    { sourceIds: ["cms-nhe-2024"], note: "CMS projects ~$8.6T by 2033." },
  ),
  medicareEnrollees: k(POP, "Medicare enrollees, 2024 (millions)", 66.6, "count", "data", {
    sourceIds: ["cms-nhe-2024"],
  }),
  maEnrollees: k(POP, "Medicare Advantage enrollees (millions)", 33, "count", "data", {
    sourceIds: ["medpac-2025"],
  }),
  esiPeople: k(POP, "People with employer coverage, 2024 (millions)", 178.6, "count", "data", {
    sourceIds: ["cms-nhe-2024"],
  }),

  // ---------------------------------------------------------------- Premiums
  familyPremium: k(PREM, "Average family premium, employer plan", 26993, "usd", "data", {
    sourceIds: ["kff-ehbs-2025"],
  }),
  singlePremium: k(PREM, "Average single premium, employer plan", 9325, "usd", "data", {
    sourceIds: ["kff-ehbs-2025"],
  }),
  workerFamilyContribution: k(PREM, "Worker contribution, family", 6850, "usd", "data", {
    sourceIds: ["kff-ehbs-2025"],
  }),
  workerSingleContribution: k(PREM, "Worker contribution, single", 1440, "usd", "data", {
    sourceIds: ["kff-ehbs-2025"],
  }),
  partBMonthly: k(PREM, "Medicare Part B standard premium, per month", 185, "usd", "data", {
    sourceIds: ["cms-trustees-2025"],
  }),
  partDMonthly: k(PREM, "Typical Part D premium, per month", 50, "usd", "estimate"),
  medigapMonthly: k(PREM, "Typical Medigap Plan G premium, per month", 200, "usd", "estimate"),
  oopMaxSingle: k(PREM, "ACA out-of-pocket maximum, single", 9200, "usd", "data"),
  oopMaxFamily: k(PREM, "ACA out-of-pocket maximum, family", 18400, "usd", "data"),

  // ---------------------------------------------------------------- Prices
  randHospitalMultiple: k(
    PRICE,
    "Private hospital prices as a multiple of Medicare (RAND, employer plans)",
    2.54,
    "ratio",
    "data",
    { sourceIds: ["rand-hospital-2024"] },
  ),
  privateHospitalMultiple: k(
    PRICE,
    "Private hospital prices vs Medicare, all private (blended)",
    2.2,
    "ratio",
    "estimate",
    {
      sourceIds: ["rand-hospital-2024"],
      note: "RAND's 254% is employer plans; Marketplace and other contracts pay less.",
    },
  ),
  privatePhysicianMultiple: k(
    PRICE,
    "Private physician prices vs Medicare",
    1.4,
    "ratio",
    "estimate",
    { sourceIds: ["medpac-2025"] },
  ),
  medicaidFeeIndex: k(PRICE, "Medicaid physician fees vs Medicare", 0.72, "ratio", "data", {
    sourceIds: ["kff-medicaid-fee-index"],
  }),
  medicaidHospitalIndex: k(
    PRICE,
    "Medicaid hospital payments vs Medicare (incl. supplemental)",
    0.9,
    "ratio",
    "estimate",
    { sourceIds: ["macpac-supplemental"] },
  ),
  hospitalMedicareMargin: k(
    PRICE,
    "Hospital Medicare fee-for-service margin, 2023",
    -0.13,
    "share",
    "data",
    { sourceIds: ["medpac-2025"] },
  ),
  medicareAdminShare: k(
    PRICE,
    "Traditional Medicare administrative cost share",
    0.014,
    "share",
    "data",
    { sourceIds: ["cms-trustees-2025"] },
  ),
  hospitalBirShare: k(
    PRICE,
    "Billing & insurance-related cost share of hospital revenue",
    0.085,
    "share",
    "data",
    { sourceIds: ["jiwani-2014"] },
  ),
  physicianBirShare: k(
    PRICE,
    "Billing & insurance-related cost share of physician revenue",
    0.13,
    "share",
    "data",
    { sourceIds: ["jiwani-2014"] },
  ),
  birReduction: k(
    PRICE,
    "Share of billing costs eliminated under one payer",
    0.5,
    "share",
    "estimate",
  ),
  maOverpayment: k(
    PRICE,
    "Medicare Advantage payments above FFS-equivalent",
    0.2,
    "share",
    "data",
    { sourceIds: ["medpac-2025"] },
  ),
  brandShareOfRetailRx: k(
    PRICE,
    "Brand-name share of retail drug spending",
    0.8,
    "share",
    "estimate",
    { sourceIds: ["rand-drugs-2024"] },
  ),
  brandPriceCut: k(
    PRICE,
    "Average brand net price reduction from national negotiation",
    0.35,
    "share",
    "estimate",
    { sourceIds: ["cms-negotiation", "rand-drugs-2024"] },
  ),
  improperPaymentRate: k(
    PRICE,
    "Medicare FFS improper payment rate, FY2024",
    0.077,
    "share",
    "data",
    { sourceIds: ["cms-improper"] },
  ),

  // ---------------------------------------------------------------- Plan policy
  hospitalRate: k(PLAN, "UHP hospital payment rate (× Medicare)", 1.2, "ratio", "policy"),
  physicianRate: k(
    PLAN,
    "UHP physician payment rate, average (× Medicare)",
    1.12,
    "ratio",
    "policy",
  ),
  primaryCareRate: k(PLAN, "UHP primary-care rate (× Medicare)", 1.25, "ratio", "policy"),
  proceduralRate: k(PLAN, "UHP procedural-specialty rate (× Medicare)", 1.05, "ratio", "policy"),
  ruralAddOn: k(PLAN, "Rural physician add-on", 0.1, "share", "policy"),
  uhpAdminRate: k(PLAN, "UHP administration as a share of benefits", 0.025, "share", "policy", {
    sourceIds: ["cms-trustees-2025", "cihi-nhex"],
  }),
  residencySlots: k(PLAN, "New residency positions", 14000, "count", "policy", {
    sourceIds: ["aamc-shortage"],
  }),
  qualityWithhold: k(PLAN, "Hospital budget quality withhold", 0.02, "share", "policy"),
  volumeCorridor: k(PLAN, "Hospital budget volume corridor (±)", 0.03, "share", "policy"),
  optOutYears: k(PLAN, "Physician opt-out commitment", 2, "years", "policy"),
  duplicativeBanYears: k(
    PLAN,
    "Duplicative-insurance ban before mandatory review",
    10,
    "years",
    "policy",
  ),
  guaranteeVoucherRate: k(
    PLAN,
    "Wait-guarantee voucher payment (× UHP rate)",
    1.5,
    "ratio",
    "policy",
  ),
  residencyDays: k(PLAN, "Residency requirement for eligibility (days)", 90, "count", "policy"),
  dispensingFee: k(PLAN, "Pharmacy dispensing fee per prescription", 10.5, "usd", "policy"),
  icoDiscount: k(
    PLAN,
    "Integrated care organization capitation (share of expected spending)",
    0.97,
    "share",
    "policy",
  ),
  maintenanceOfCompYears: k(PLAN, "Maintenance-of-compensation requirement", 3, "years", "policy"),
  rateConvergenceYears: k(PLAN, "Provider rate convergence period", 4, "years", "policy"),
  stateMoeShare: k(
    PLAN,
    "State MOE as share of 2024 Medicaid + buy-in spending",
    1,
    "share",
    "policy",
  ),
  spendingTargetMargin: k(
    PLAN,
    "Spending growth target: GDP per capita growth + …",
    0.005,
    "share",
    "policy",
  ),
  reserveMonths: k(
    PLAN,
    "Trust fund contingency reserve (months of benefits)",
    2,
    "count",
    "policy",
  ),

  // ---------------------------------------------------------------- Taxes
  employerTaxRate: k(TAX, "Employer health payroll tax rate", 0.075, "share", "policy"),
  payrollExemption: k(TAX, "Payroll exempt per employer", 250000, "usd", "policy"),
  smallEmployerExemptShare: k(
    TAX,
    "Share of total payroll exempted by the $250k exemption",
    0.06,
    "share",
    "estimate",
    { sourceIds: ["census-susb"] },
  ),
  seThreshold: k(
    TAX,
    "Self-employment earnings exempt from the employer-equivalent tax",
    50000,
    "usd",
    "policy",
  ),
  householdPremiumRate: k(TAX, "Household income-based premium rate", 0.04, "share", "policy"),
  exemptionSingle: k(TAX, "Household exemption: 1 person", 16000, "usd", "policy"),
  exemptionCouple: k(TAX, "Household exemption: 2 people", 24000, "usd", "policy"),
  exemptionThree: k(TAX, "Household exemption: 3 people", 28000, "usd", "policy"),
  exemptionFour: k(TAX, "Household exemption: 4 people", 32000, "usd", "policy"),
  exemptionPerExtra: k(TAX, "Household exemption: each additional person", 4000, "usd", "policy"),
  surtaxRate: k(TAX, "Surtax rate above $1M AGI", 0.07, "share", "policy"),
  surtaxThreshold: k(TAX, "Surtax threshold", 1000000, "usd", "policy"),
  incomeAboveMillion: k(TAX, "AGI above $1M per return, summed", 1930, "usdB", "estimate", {
    confidence: "low",
    sourceIds: ["irs-soi-2022"],
  }),
  surtaxBehavioral: k(TAX, "Surtax yield lost to avoidance", 0.0, "share", "estimate", {
    confidence: "low",
    note: "Applied through the conservative income base above.",
  }),
  capGainsRevenue: k(
    TAX,
    "Capital gains & dividends as ordinary income above $1M",
    90,
    "usdB",
    "estimate",
    { confidence: "low", sourceIds: ["jct-capital-gains"] },
  ),
  fttRate: k(TAX, "Financial transactions tax rate", 0.001, "share", "policy"),
  fttRevenue: k(
    TAX,
    "Financial transactions tax revenue after behavioral response",
    75,
    "usdB",
    "estimate",
    { confidence: "low", sourceIds: ["cbo-ftt"] },
  ),
  deductionCapRevenue: k(
    TAX,
    "Other: caps on remaining health-benefit deductions",
    30,
    "usdB",
    "estimate",
    { confidence: "low" },
  ),
  topRateOrdinary: k(TAX, "Top ordinary income tax rate", 0.37, "share", "data"),
  topRateCapGains: k(TAX, "Top long-term capital gains rate", 0.2, "share", "data"),
  employerFica: k(TAX, "Employer FICA rate", 0.0765, "share", "data"),
  employeeFica: k(TAX, "Employee FICA rate", 0.0765, "share", "data"),
  hiRate: k(TAX, "Medicare HI payroll tax (employer + employee)", 0.029, "share", "data"),
  ssRate: k(TAX, "Social Security payroll tax (employer + employee)", 0.124, "share", "data"),
  federalMarginalRate: k(
    TAX,
    "Average federal income tax rate on newly taxable compensation",
    0.18,
    "share",
    "estimate",
    { sourceIds: ["cbo-exclusion"] },
  ),
  stateMarginalRate: k(
    TAX,
    "Average state income tax rate on newly taxable compensation",
    0.035,
    "share",
    "estimate",
  ),
  wagePassThrough: k(TAX, "Employer savings passed to wages", 0.85, "share", "estimate", {
    sourceIds: ["baicker-chandra"],
  }),
  esiTaxExclusion: k(TAX, "Federal tax subsidy for employer coverage, 2024", 400, "usdB", "data", {
    confidence: "medium",
    sourceIds: ["cbo-exclusion"],
  }),
  statePremiumTax: k(TAX, "State premium taxes paid by health insurers", 18, "usdB", "estimate", {
    confidence: "low",
    sourceIds: ["naic-premium-tax"],
  }),
  copayStandbyRevenue: k(
    TAX,
    "Standby prescription copays (if activated)",
    15,
    "usdB",
    "estimate",
    { confidence: "low" },
  ),
  vatPerPoint: k(TAX, "Broad VAT revenue per percentage point", 60, "usdB", "estimate", {
    confidence: "low",
    sourceIds: ["cbo-ftt"],
  }),

  // ---------------------------------------------------------------- Insurer overhead
  insurerProfit: k(
    INS,
    "Private health insurer profit (underwriting + fees)",
    42,
    "usdB",
    "estimate",
    { confidence: "low", sourceIds: ["naic-health-results"] },
  ),
  brokerCommissions: k(INS, "Broker & agent commissions and marketing", 32, "usdB", "estimate", {
    confidence: "low",
  }),
  pbmGrossProfit: k(INS, "PBM gross profit (rebates, spread, fees)", 28, "usdB", "estimate", {
    confidence: "low",
  }),
  insurerEquityMultipleLow: k(
    INS,
    "Earnings multiple for capitalizing lost profit (low)",
    10,
    "ratio",
    "estimate",
    { confidence: "low" },
  ),
  insurerEquityMultipleHigh: k(
    INS,
    "Earnings multiple for capitalizing lost profit (high)",
    17,
    "ratio",
    "estimate",
    { confidence: "low" },
  ),
  pharmaManufacturerShare: k(
    INS,
    "Manufacturer share of retail drug price reductions",
    0.75,
    "share",
    "estimate",
    { confidence: "low" },
  ),

  // ---------------------------------------------------------------- Workforce investment
  residencyCostPerSlot: k(WF, "Annual cost per residency position", 150000, "usd", "estimate", {
    sourceIds: ["aamc-shortage"],
  }),
  nursingFaculty: k(WF, "New nursing faculty positions funded", 10000, "count", "policy", {
    sourceIds: ["hrsa-nursing"],
  }),
  nursingFacultyCost: k(WF, "Annual cost per nursing faculty position", 120000, "usd", "estimate"),
  clinicalPlacements: k(
    WF,
    "Funded nursing clinical placements per year",
    60000,
    "count",
    "policy",
  ),
  clinicalPlacementCost: k(WF, "Cost per clinical placement", 30000, "usd", "estimate"),
  serviceScholars: k(
    WF,
    "Students on tuition-free service scholarships at any time",
    32000,
    "count",
    "policy",
  ),
  serviceScholarCost: k(
    WF,
    "Annual tuition + stipend per service scholar",
    125000,
    "usd",
    "estimate",
  ),
  communityHealthWorkers: k(WF, "Community health workers funded", 60000, "count", "policy"),
  chwCost: k(WF, "Annual loaded cost per community health worker", 48333, "usd", "estimate"),

  // ---------------------------------------------------------------- One-time: IT
  itClaimsExtension: k(
    IT,
    "Extend & re-platform Medicare shared claims systems (FISS, MCS, CWF)",
    6.0,
    "usdB",
    "estimate",
    { sourceIds: ["healthcare-gov"] },
  ),
  itMacRegions: k(IT, "Claims-processing regions (MAC contracts)", 10, "count", "policy"),
  itMacScaleUp: k(IT, "Scale-up cost per MAC region", 0.4, "usdB", "estimate"),
  itEligibilityApi: k(IT, "Real-time eligibility API & provider portal", 1.5, "usdB", "estimate"),
  itGlobalBudgetRails: k(
    IT,
    "Hospital global-budget payment & encounter-data system",
    1.5,
    "usdB",
    "estimate",
  ),
  itNewClaimTypes: k(IT, "New claim types: dental, vision, hearing, HCBS", 1.0, "usdB", "estimate"),
  itVerification: k(
    IT,
    "Independent verification, load and parallel testing",
    1.0,
    "usdB",
    "estimate",
  ),
  itSecurity: k(
    IT,
    "Cybersecurity, geographic redundancy, offline interim-payment system",
    2.0,
    "usdB",
    "estimate",
  ),
  itDecommission: k(IT, "Legacy system decommissioning & data migration", 1.0, "usdB", "estimate"),

  // ---------------------------------------------------------------- One-time: agency
  agencyStaff: k(AG, "UHA staff hired ahead of steady-state funding", 40000, "count", "estimate"),
  agencyLoadedCost: k(AG, "Loaded annual cost per UHA employee", 110000, "usd", "estimate"),
  agencyPreFundedYears: k(
    AG,
    "Average years each hire is funded before steady state",
    1.75,
    "years",
    "estimate",
  ),
  regionalOffices: k(AG, "Regional offices", 10, "count", "policy"),
  regionalOfficeSetup: k(AG, "Set-up cost per regional office", 80000000, "usd", "estimate"),
  boardsStartup: k(
    AG,
    "Rates Board, HTA Institute & Patient Advocacy start-up",
    0.5,
    "usdB",
    "estimate",
  ),

  // ---------------------------------------------------------------- One-time: enrollment
  cardCost: k(EN, "Cost per health card (production + mailing)", 3, "usd", "estimate"),
  noticesPerHousehold: k(EN, "Notices mailed per household across waves", 3, "count", "policy"),
  noticeCost: k(EN, "Cost per mailed notice", 1.5, "usd", "estimate"),
  outreachCampaign: k(EN, "Multilingual outreach campaign", 1.2, "usdB", "estimate"),
  assisters: k(EN, "In-person enrollment assisters", 5000, "count", "policy"),
  assisterCost: k(EN, "Loaded annual cost per assister", 70000, "usd", "estimate"),
  assisterYears: k(EN, "Years assisters are funded", 3.4, "years", "policy"),

  // ---------------------------------------------------------------- One-time: hospital fund
  hfHospitals: k(
    HF,
    "Hospitals with revenue shortfall above 5% under UHP rates",
    900,
    "count",
    "estimate",
    { confidence: "low", sourceIds: ["rand-hospital-2024"] },
  ),
  hfAvgRevenue: k(
    HF,
    "Average annual net patient revenue of those hospitals",
    250000000,
    "usd",
    "estimate",
    { confidence: "low" },
  ),
  hfShortfall: k(HF, "Average shortfall beyond the 5% threshold", 0.1, "share", "estimate", {
    confidence: "low",
  }),
  hfTaper1: k(HF, "Share of shortfall covered, Year 1", 0.75, "share", "policy"),
  hfTaper2: k(HF, "Share of shortfall covered, Year 2", 0.5, "share", "policy"),
  hfTaper3: k(HF, "Share of shortfall covered, Year 3", 0.3, "share", "policy"),
  hfTaper4: k(HF, "Share of shortfall covered, Year 4", 0.15, "share", "policy"),

  // ---------------------------------------------------------------- One-time: rural capital
  rcRuralHospitals: k(RC, "Rural hospitals at risk of closure", 700, "count", "data", {
    confidence: "medium",
  }),
  rcRuralCost: k(
    RC,
    "Average repair/replacement grant per rural hospital",
    20000000,
    "usd",
    "estimate",
  ),
  rcFqhcSites: k(RC, "Federally qualified health center sites upgraded", 1500, "count", "policy"),
  rcFqhcCost: k(RC, "Average grant per FQHC site", 4000000, "usd", "estimate"),

  // ---------------------------------------------------------------- One-time: capacity
  capChcSites: k(CAP, "New or expanded community health center sites", 1000, "count", "policy"),
  capChcCost: k(CAP, "Cost per community health center site", 8000000, "usd", "estimate"),
  capAscImaging: k(
    CAP,
    "Ambulatory surgery & imaging centers in shortage areas",
    400,
    "count",
    "policy",
  ),
  capAscCost: k(CAP, "Cost per surgery/imaging center", 25000000, "usd", "estimate"),
  capDental: k(CAP, "Dental clinics (operatories) added", 2500, "count", "policy"),
  capDentalCost: k(CAP, "Cost per dental clinic", 2000000, "usd", "estimate"),
  capBehavioral: k(
    CAP,
    "Behavioral-health crisis & residential facilities",
    350,
    "count",
    "policy",
  ),
  capBehavioralCost: k(CAP, "Cost per behavioral-health facility", 20000000, "usd", "estimate"),

  // ---------------------------------------------------------------- One-time: legacy systems
  dsStates: k(DS, "State Medicaid systems run in parallel", 50, "count", "data"),
  dsStateAnnual: k(
    DS,
    "Average annual cost per state Medicaid system kept running",
    40000000,
    "usd",
    "estimate",
  ),
  dsYears: k(DS, "Years run in parallel", 3, "years", "policy"),
  dsMarketplaceAnnual: k(DS, "Annual cost of federal + state exchanges", 1.5, "usdB", "estimate"),
  dsMedicareLegacy: k(DS, "Medicare legacy systems in parallel", 1.5, "usdB", "estimate"),

  // ---------------------------------------------------------------- One-time: state wind-down
  swStaff: k(SW, "State eligibility staff separated or redeployed", 30000, "count", "estimate"),
  swPerStaff: k(SW, "Severance & retraining per staff member", 40000, "usd", "estimate"),
  swSystemsPerState: k(SW, "Decommissioning cost per state system", 36000000, "usd", "estimate"),
  swDataMigration: k(SW, "Data migration to UHA", 1.0, "usdB", "estimate"),

  // ---------------------------------------------------------------- One-time: formulary
  fbStaff: k(FB, "Formulary Board & HTA start-up staff", 400, "count", "estimate"),
  fbStaffCost: k(FB, "Loaded annual cost per staff member", 150000, "usd", "estimate"),
  fbYears: k(FB, "Start-up years before absorption into admin budget", 4, "years", "policy"),
  fbAssessments: k(FB, "Drug assessments contracted during start-up", 500, "count", "policy"),
  fbAssessmentCost: k(FB, "Cost per contracted assessment", 1500000, "usd", "estimate"),
  fbData: k(FB, "International reference-price data & IT", 0.51, "usdB", "estimate"),

  // ---------------------------------------------------------------- One-time: evaluation
  evRegistry: k(EV, "National wait-time registry build", 0.6, "usdB", "estimate"),
  evSurveyRespondents: k(
    EV,
    "Patient-experience survey respondents per year",
    400000,
    "count",
    "policy",
  ),
  evSurveyCost: k(EV, "Cost per survey response", 100, "usd", "estimate"),
  evSurveyYears: k(EV, "Survey years funded from transition budget", 5, "years", "policy"),
  evContracts: k(EV, "Contracted independent evaluations", 0.6, "usdB", "estimate"),
  evDataAudit: k(EV, "Data audits & wait-time measurement validation", 0.6, "usdB", "estimate"),

  // ---------------------------------------------------------------- One-time: legal
  lgAttorneys: k(LG, "DOJ/HHS attorneys assigned", 300, "count", "estimate"),
  lgAttorneyCost: k(LG, "Loaded annual cost per attorney", 250000, "usd", "estimate"),
  lgYears: k(LG, "Years of litigation", 5, "years", "estimate"),
  lgExperts: k(LG, "Outside experts & expert witnesses", 0.3, "usdB", "estimate"),
  lgClaimsCourt: k(LG, "Court of Federal Claims §1498 proceedings", 0.325, "usdB", "estimate"),

  // ---------------------------------------------------------------- Worker program
  wpReplacementY1: k(WP, "Wage replacement, year 1 of unemployment", 0.9, "share", "policy"),
  wpReplacementY2: k(WP, "Wage replacement, year 2", 0.7, "share", "policy"),
  wpReplacementY3: k(WP, "Wage replacement, year 3", 0.5, "share", "policy"),
  wpUnemployedY1: k(WP, "Average share still unemployed, year 1", 0.75, "share", "estimate", {
    confidence: "low",
  }),
  wpUnemployedY2: k(WP, "Average share still unemployed, year 2", 0.4, "share", "estimate", {
    confidence: "low",
  }),
  wpUnemployedY3: k(WP, "Average share still unemployed, year 3", 0.25, "share", "estimate", {
    confidence: "low",
  }),
  wpWageCap: k(WP, "Wage replacement cap", 120000, "usd", "policy"),
  wpInsuranceShare: k(WP, "Wage insurance: share of pay gap covered", 0.5, "share", "policy"),
  wpInsuranceYears: k(WP, "Wage insurance duration", 2, "years", "policy"),
  wpReemployedShare: k(WP, "Share reemployed (eventually)", 0.75, "share", "estimate", {
    confidence: "low",
  }),
  wpWageLoss: k(WP, "Average pay cut when reemployed", 0.15, "share", "estimate", {
    confidence: "low",
  }),
  wpVoucher: k(WP, "Training voucher", 12000, "usd", "policy"),
  wpVoucherUptake: k(WP, "Training voucher uptake", 0.6, "share", "estimate"),
  wpBridgeShare: k(WP, "Share of displaced workers aged 58+", 0.12, "share", "estimate"),
  wpBridgeAnnual: k(WP, "Bridge pension per year", 35000, "usd", "policy"),
  wpBridgeYears: k(WP, "Bridge pension years", 3, "years", "policy"),
  uhaJobs: k(WP, "UHA & claims-contractor jobs", 210000, "count", "estimate"),
  icoJobs: k(
    WP,
    "Care coordinators moving to integrated care organizations",
    40000,
    "count",
    "estimate",
    { confidence: "low" },
  ),
  clinicalLaborShare: k(
    WP,
    "Labor share of incremental clinical spending",
    0.55,
    "share",
    "estimate",
  ),
  clinicalComp: k(WP, "Average loaded compensation of new clinical jobs", 85000, "usd", "estimate"),

  // ---------------------------------------------------------------- BLS employment (OEWS May 2025)
  blsHealthCarriers: k(
    "Employment data (BLS OEWS, May 2025)",
    "Employment, direct health & medical insurance carriers (NAICS 524114)",
    451820,
    "count",
    "data",
    { sourceIds: ["bls-oews-2025"] },
  ),
  blsHealthCarriersWage: k(
    "Employment data (BLS OEWS, May 2025)",
    "Mean annual wage, health & medical insurance carriers",
    93210,
    "usd",
    "data",
    { sourceIds: ["bls-oews-2025"] },
  ),
  blsOtherInsuranceRelated: k(
    "Employment data (BLS OEWS, May 2025)",
    "Employment, other insurance-related activities incl. TPAs & claims adjusting (NAICS 524290)",
    396750,
    "count",
    "data",
    { sourceIds: ["bls-oews-2025"] },
  ),
  tpaHealthShare: k(
    "Employment data (BLS OEWS, May 2025)",
    "Health-related share of NAICS 524290 employment",
    0.32,
    "share",
    "estimate",
    {
      confidence: "low",
      note: "TPAs for self-insured health plans are a large part of this industry; property & casualty claims adjusting is the rest.",
    },
  ),
  blsAgenciesBrokerages: k(
    "Employment data (BLS OEWS, May 2025)",
    "Employment, insurance agencies & brokerages (NAICS 524210)",
    1004520,
    "count",
    "data",
    { sourceIds: ["bls-oews-2025"] },
  ),
  brokerHealthShare: k(
    "Employment data (BLS OEWS, May 2025)",
    "Health-insurance share of agency & brokerage employment",
    0.08,
    "share",
    "estimate",
    { confidence: "low", note: "Health is a minority line next to property & casualty and life." },
  ),
  blsBillingClerksAmbulatory: k(
    "Employment data (BLS OEWS, May 2025)",
    "Billing & posting clerks in ambulatory health care (NAICS 621)",
    127200,
    "count",
    "data",
    { sourceIds: ["bls-oews-2025"] },
  ),
  blsBillingClerksHospitals: k(
    "Employment data (BLS OEWS, May 2025)",
    "Billing & posting clerks in hospitals (NAICS 622)",
    37680,
    "count",
    "data",
    { sourceIds: ["bls-oews-2025"] },
  ),
  blsMedicalRecords: k(
    "Employment data (BLS OEWS, May 2025)",
    "Medical records specialists (coders), all industries",
    194720,
    "count",
    "data",
    { sourceIds: ["bls-oews-2025"] },
  ),
  insuranceFrontOffice: k(
    "Employment data (BLS OEWS, May 2025)",
    "Medical secretaries & front-office staff doing eligibility, prior authorization & collections (full-time equivalent)",
    180000,
    "count",
    "estimate",
    {
      confidence: "low",
      note: "A fraction of roughly 800,000 medical secretaries and administrative assistants.",
    },
  ),
  blsBillingClerkWage: k(
    "Employment data (BLS OEWS, May 2025)",
    "Mean wage, billing & posting clerks",
    51070,
    "usd",
    "data",
    { sourceIds: ["bls-oews-2025"] },
  ),
  blsMedicalRecordsWage: k(
    "Employment data (BLS OEWS, May 2025)",
    "Mean wage, medical records specialists",
    56790,
    "usd",
    "data",
    { sourceIds: ["bls-oews-2025"] },
  ),

  // ---------------------------------------------------------------- Access
  acceptPrivate: k(
    ACC,
    "Physicians accepting new privately insured patients",
    0.96,
    "share",
    "data",
    { sourceIds: ["holgash-heberlein"] },
  ),
  acceptMedicare: k(ACC, "Physicians accepting new Medicare patients", 0.88, "share", "data", {
    sourceIds: ["holgash-heberlein"],
  }),
  acceptMedicaid: k(ACC, "Physicians accepting new Medicaid patients", 0.74, "share", "data", {
    sourceIds: ["holgash-heberlein"],
  }),
  acceptMedicaidPsych: k(
    ACC,
    "Psychiatrists accepting new Medicaid patients",
    0.35,
    "share",
    "data",
    { sourceIds: ["holgash-heberlein"] },
  ),
  canadaMedianWeeks: k(
    ACC,
    "Canada median wait, GP referral to treatment (weeks, 2025)",
    28.6,
    "count",
    "data",
    { sourceIds: ["fraser-2025"] },
  ),
  nhsWaitlist: k(ACC, "NHS England waiting list (millions, 2025)", 7.4, "count", "data", {
    sourceIds: ["nhs-rtt"],
  }),
  nhsWithin18: k(ACC, "NHS England share treated within 18 weeks", 0.59, "share", "data", {
    sourceIds: ["nhs-rtt"],
  }),
} satisfies Record<string, Constant>

export type ConstantId = keyof typeof C

/** Value of a constant. */
export const v = (id: ConstantId) => C[id].value

/** Household exemption for a household of a given size. */
export function householdExemption(size: number) {
  if (size <= 1) return v("exemptionSingle")
  if (size === 2) return v("exemptionCouple")
  if (size === 3) return v("exemptionThree")
  return v("exemptionFour") + Math.max(0, size - 4) * v("exemptionPerExtra")
}

/** Derived quantities that several files need. */
export const DERIVED = {
  agi2024: v("agi2022") * (1 + v("agiGrowth2022to2024")),
  agiBase: v("agi2022") * (1 + v("agiGrowth2022to2024")) - v("agiExempted"),
  employerFamilyPremium: v("familyPremium") - v("workerFamilyContribution"),
  employerSinglePremium: v("singlePremium") - v("workerSingleContribution"),
  partBAnnual: v("partBMonthly") * 12,
  partDAnnual: v("partDMonthly") * 12,
  medigapAnnual: v("medigapMonthly") * 12,
  drugRate:
    v("brandShareOfRetailRx") * (1 - v("brandPriceCut")) + (1 - v("brandShareOfRetailRx")) * 1,
  surtaxRevenue: v("incomeAboveMillion") * v("surtaxRate"),
  workforceInvestment:
    (v("residencySlots") * v("residencyCostPerSlot") +
      v("nursingFaculty") * v("nursingFacultyCost") +
      v("clinicalPlacements") * v("clinicalPlacementCost") +
      v("serviceScholars") * v("serviceScholarCost") +
      v("communityHealthWorkers") * v("chwCost")) /
    1e9,
}

export const TOP_END_REVENUE =
  DERIVED.surtaxRevenue + v("capGainsRevenue") + v("fttRevenue") + v("deductionCapRevenue")

/** Display a constant in prose, e.g. show("familyPremium") → "$26,993". */
export function show(id: ConstantId, as?: "pct"): string {
  const c = C[id]
  const x = c.value
  if (as === "pct" || c.unit === "share")
    return `${(x * 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}%`
  switch (c.unit) {
    case "usd":
      return `$${x.toLocaleString("en-US")}`
    case "usdB":
      return `$${x.toLocaleString("en-US")}B`
    case "ratio":
      return `${x}×`
    case "years":
      return `${x} years`
    default:
      return x.toLocaleString("en-US")
  }
}
