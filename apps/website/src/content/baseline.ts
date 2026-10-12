/**
 * Baseline: U.S. National Health Expenditures, calendar year 2024, in billions of
 * current dollars. Every figure here is transcribed from the CMS Office of the
 * Actuary NHE tables released December 2025 (tables 3, 4, 5, 5-1 through 5-6,
 * 21, 22, 24). Nothing in this file is an estimate.
 */

export const BASE_YEAR = 2024

/** Columns of NHE Table 4 ("Source of Funds"). */
export type Payer =
  | "outOfPocket"
  | "privateInsurance"
  | "medicare"
  | "medicaid"
  | "otherInsurance"
  | "otherThirdParty"
  | "publicHealth"
  | "investment"

export const PAYER_LABELS: Record<Payer, string> = {
  outOfPocket: "Out of pocket",
  privateInsurance: "Private health insurance",
  medicare: "Medicare",
  medicaid: "Medicaid",
  otherInsurance: "Other insurance programs (CHIP, DoD, VA)",
  otherThirdParty: "Other third-party payers & programs",
  publicHealth: "Government public health",
  investment: "Investment",
}

export type ServiceId =
  | "hospital"
  | "physicianClinical"
  | "otherProfessional"
  | "dental"
  | "otherResidential"
  | "homeHealth"
  | "nursing"
  | "prescriptionDrugs"
  | "durableEquipment"
  | "otherNonDurable"
  | "governmentAdministration"
  | "netCostOfInsurance"
  | "publicHealth"
  | "research"
  | "structures"

export type ServiceRow = {
  id: ServiceId
  label: string
  description: string
  total: number
  byPayer: Partial<Record<Payer, number>>
}

/** NHE Table 4, Year 2024, amounts in billions. */
export const SERVICES_2024: ServiceRow[] = [
  {
    id: "hospital",
    label: "Hospital care",
    description:
      "Inpatient and outpatient services billed by hospitals, including hospital-employed physician services billed by the hospital.",
    total: 1634.7,
    byPayer: {
      outOfPocket: 40.6,
      privateInsurance: 558.9,
      medicare: 439.8,
      medicaid: 318.9,
      otherInsurance: 103.3,
      otherThirdParty: 173.2,
    },
  },
  {
    id: "physicianClinical",
    label: "Physician & clinical services",
    description:
      "Offices of physicians, outpatient care centers, freestanding labs, ambulatory surgery centers.",
    total: 1109.7,
    byPayer: {
      outOfPocket: 94.3,
      privateInsurance: 505.1,
      medicare: 251.2,
      medicaid: 112.5,
      otherInsurance: 48,
      otherThirdParty: 98.7,
    },
  },
  {
    id: "otherProfessional",
    label: "Other professional services",
    description:
      "Physical therapy, optometry, podiatry, chiropractic, independent mental-health practitioners.",
    total: 184.9,
    byPayer: {
      outOfPocket: 44.8,
      privateInsurance: 57.3,
      medicare: 47.5,
      medicaid: 17.1,
      otherInsurance: 0.8,
      otherThirdParty: 17.3,
    },
  },
  {
    id: "dental",
    label: "Dental services",
    description: "Offices of dentists and dental specialists.",
    total: 189.2,
    byPayer: {
      outOfPocket: 72.5,
      privateInsurance: 78.2,
      medicare: 12.6,
      medicaid: 15.2,
      otherInsurance: 6.7,
      otherThirdParty: 4,
    },
  },
  {
    id: "otherResidential",
    label: "Other health, residential & personal care",
    description:
      "Home- and community-based waiver services, residential mental-health and substance-use facilities, ambulance, school and worksite care.",
    total: 320.5,
    byPayer: {
      outOfPocket: 11.2,
      privateInsurance: 21.1,
      medicare: 4.6,
      medicaid: 199.8,
      otherInsurance: 3.8,
      otherThirdParty: 79.9,
    },
  },
  {
    id: "homeHealth",
    label: "Home health care",
    description: "Freestanding home health agencies (skilled nursing and therapy at home).",
    total: 169.4,
    byPayer: {
      outOfPocket: 30.4,
      privateInsurance: 37.3,
      medicare: 55.7,
      medicaid: 38.2,
      otherInsurance: 1.7,
      otherThirdParty: 6.1,
    },
  },
  {
    id: "nursing",
    label: "Nursing facilities & continuing-care communities",
    description:
      "Freestanding skilled nursing facilities and continuing care retirement communities.",
    total: 219.9,
    byPayer: {
      outOfPocket: 48.7,
      privateInsurance: 19.3,
      medicare: 47.3,
      medicaid: 78.9,
      otherInsurance: 7,
      otherThirdParty: 18.7,
    },
  },
  {
    id: "prescriptionDrugs",
    label: "Retail prescription drugs",
    description:
      "Drugs dispensed through retail and mail-order pharmacies, net of manufacturer rebates. Excludes drugs administered in hospitals and clinics (those sit inside hospital and physician spending).",
    total: 467,
    byPayer: {
      outOfPocket: 55,
      privateInsurance: 172.1,
      medicare: 162.8,
      medicaid: 53.9,
      otherInsurance: 16.9,
      otherThirdParty: 6.3,
    },
  },
  {
    id: "durableEquipment",
    label: "Durable medical equipment",
    description: "Eyeglasses, contact lenses, hearing aids, wheelchairs, oxygen equipment rental.",
    total: 86.4,
    byPayer: {
      outOfPocket: 35.8,
      privateInsurance: 18.9,
      medicare: 18.5,
      medicaid: 11.5,
      otherInsurance: 0.3,
      otherThirdParty: 1.3,
    },
  },
  {
    id: "otherNonDurable",
    label: "Other non-durable medical products",
    description: "Over-the-counter medicines, bandages, medical instruments bought at retail.",
    total: 128.7,
    byPayer: { outOfPocket: 123.2, medicare: 5.5 },
  },
  {
    id: "governmentAdministration",
    label: "Government administration",
    description: "Cost of running Medicare, Medicaid, CHIP and other public programs.",
    total: 66.1,
    // CMS prints 7.3 for other insurance programs, but the row total (66.1) and the
    // health-insurance subtotal (63.2) both imply 8.1. We use 8.1 so the row balances.
    byPayer: { medicare: 15, medicaid: 40.1, otherInsurance: 8.1, otherThirdParty: 2.9 },
  },
  {
    id: "netCostOfInsurance",
    label: "Net cost of health insurance",
    description:
      "Premiums minus benefits paid: insurer administration, marketing, broker commissions, premium taxes, and profit. For Medicare and Medicaid this is mostly Medicare Advantage, Part D, and Medicaid managed-care plan overhead.",
    total: 306,
    byPayer: {
      privateInsurance: 176.5,
      medicare: 57.6,
      medicaid: 45.5,
      otherInsurance: 2,
      otherThirdParty: 24.4,
    },
  },
  {
    id: "publicHealth",
    label: "Government public health activity",
    description:
      "Health departments, disease surveillance, vaccination programs, epidemic preparedness.",
    total: 157.6,
    byPayer: { publicHealth: 157.6 },
  },
  {
    id: "research",
    label: "Non-commercial research",
    description:
      "NIH and other non-commercial research. Pharmaceutical company R&D is not here; it is embedded in drug prices.",
    total: 70.4,
    byPayer: { investment: 70.4 },
  },
  {
    id: "structures",
    label: "Structures & equipment",
    description:
      "Construction of hospitals and clinics, and purchases of capital equipment such as MRI machines.",
    total: 168.2,
    byPayer: { investment: 168.2 },
  },
]

/** NHE Table 3, 2024 totals by source of funds. */
export const PAYER_TOTALS_2024: Record<Payer, number> = {
  outOfPocket: 556.6,
  privateInsurance: 1644.6,
  medicare: 1118,
  medicaid: 931.7,
  otherInsurance: 198.6,
  otherThirdParty: 432.9,
  publicHealth: 157.6,
  investment: 238.7,
}

export const NHE_TOTAL_2024 = 5278.6
export const NHE_PER_CAPITA_2024 = 15474
export const NHE_SHARE_OF_GDP_2024 = 0.18
export const POPULATION_2024_MILLIONS = 341.1

export type SponsorId = "business" | "household" | "otherPrivate" | "federal" | "stateLocal"

export type SponsorLine = {
  id: string
  sponsor: SponsorId
  label: string
  amount: number
}

export const SPONSOR_LABELS: Record<SponsorId, string> = {
  business: "Private businesses",
  household: "Households",
  otherPrivate: "Other private (philanthropy, investment income)",
  federal: "Federal government",
  stateLocal: "State & local government",
}

/**
 * NHE Tables 5-1 to 5-4, 2024: who ultimately pays (the "sponsor"). These lines
 * sum to total NHE. Note that government employers paying premiums for their
 * own workers are counted as government, not business.
 */
export const SPONSOR_LINES_2024: SponsorLine[] = [
  {
    id: "bizEsi",
    sponsor: "business",
    label: "Employer share of job-based insurance premiums",
    amount: 753.1,
  },
  {
    id: "bizHi",
    sponsor: "business",
    label: "Employer Medicare payroll tax (1.45%)",
    amount: 159.2,
  },
  {
    id: "bizOther",
    sponsor: "business",
    label: "Workers' comp, worksite clinics, temporary disability",
    amount: 55.1,
  },

  {
    id: "hhEsi",
    sponsor: "household",
    label: "Worker share of job-based insurance premiums",
    amount: 382.1,
  },
  {
    id: "hhDirect",
    sponsor: "household",
    label: "Individually purchased insurance (net of subsidies)",
    amount: 86.3,
  },
  {
    id: "hhPc",
    sponsor: "household",
    label: "Medical portion of auto & property insurance",
    amount: 55.3,
  },
  {
    id: "hhHi",
    sponsor: "household",
    label: "Worker & self-employed Medicare payroll tax",
    amount: 246.4,
  },
  { id: "hhSmi", sponsor: "household", label: "Medicare Part B & D premiums", amount: 132.3 },
  { id: "hhOop", sponsor: "household", label: "Out-of-pocket spending", amount: 556.6 },

  {
    id: "otherPrivate",
    sponsor: "otherPrivate",
    label: "Philanthropy, provider investment income, private research",
    amount: 340.5,
  },

  { id: "fedEsi", sponsor: "federal", label: "Federal employer premiums (FEHB)", amount: 46.7 },
  { id: "fedHi", sponsor: "federal", label: "Federal employer Medicare payroll tax", amount: 5.8 },
  {
    id: "fedMedicare",
    sponsor: "federal",
    label: "Medicare general revenue & net trust fund draw",
    amount: 509.6,
  },
  { id: "fedMedicaid", sponsor: "federal", label: "Federal share of Medicaid", amount: 596.7 },
  {
    id: "fedBuyIn",
    sponsor: "federal",
    label: "Federal Medicare buy-in premiums for dual eligibles",
    amount: 16.1,
  },
  { id: "fedRds", sponsor: "federal", label: "Retiree drug subsidy", amount: 0.5 },
  {
    id: "fedPrograms",
    sponsor: "federal",
    label: "VA, DoD, CHIP (federal), IHS and other federal programs",
    amount: 306.8,
  },
  { id: "fedPublicHealth", sponsor: "federal", label: "Federal public health", amount: 35.4 },
  { id: "fedOther", sponsor: "federal", label: "Other federal programs", amount: 17.9 },
  {
    id: "fedMarketplace",
    sponsor: "federal",
    label: "ACA Marketplace tax credits & subsidies",
    amount: 116.6,
  },

  { id: "slEsi", sponsor: "stateLocal", label: "State & local employer premiums", amount: 246.8 },
  {
    id: "slHi",
    sponsor: "stateLocal",
    label: "State & local employer Medicare payroll tax",
    amount: 19.9,
  },
  { id: "slMedicaid", sponsor: "stateLocal", label: "State share of Medicaid", amount: 335 },
  { id: "slBuyIn", sponsor: "stateLocal", label: "State Medicare buy-in premiums", amount: 10.7 },
  {
    id: "slPrograms",
    sponsor: "stateLocal",
    label: "State & local health programs (CHIP share, hospitals, etc.)",
    amount: 84.2,
  },
  {
    id: "slPublicHealth",
    sponsor: "stateLocal",
    label: "State & local public health",
    amount: 122.1,
  },
  { id: "slOther", sponsor: "stateLocal", label: "Other state & local programs", amount: 40.9 },
]

export const SPONSOR_TOTALS_2024: Record<SponsorId, number> = {
  business: 967.4,
  household: 1458.9,
  otherPrivate: 340.5,
  federal: 1652,
  stateLocal: 859.7,
}

/** NHE Table 22, 2024, enrollees in millions (people can appear in more than one row). */
export const ENROLLMENT_2024 = {
  privateTotal: 214.3,
  employerSponsored: 178.6,
  directPurchase: 36.7,
  marketplace: 21.1,
  medigap: 12.6,
  medicare: 66.6,
  medicaid: 84.3,
  chip: 7.3,
  otherPublic: 14.7,
  uninsured: 28,
  insuredShare: 0.918,
}

/** NHE Table 24, 2024: employer-sponsored insurance premiums by who pays. */
export const ESI_2024 = {
  total: 1429.1,
  employerPrivate: 753.4,
  employerFederal: 46.7,
  employerStateLocal: 247,
  employeePrivate: 289.7,
  employeeFederal: 20.7,
  employeeStateLocal: 71.6,
}

/** NHE Table 21, 2024 private health insurance by market. */
export const PRIVATE_MARKETS_2024 = {
  employer: 1429.1,
  marketplace: 149.5,
  medigap: 38.3,
  otherDirect: 27.8,
}
