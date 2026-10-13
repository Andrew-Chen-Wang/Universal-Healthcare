/**
 * Every cost that adds up to U.S. health spending, broken down as far as public
 * data allows: by service, by payer, by occupation (head count × average wage),
 * by industry, and by the economic components behind prices (R&D,
 * manufacturing, administration, profit, liability, fraud, waste).
 *
 * Overlaps are expected: a nurse's wage is inside hospital spending, which is
 * inside national spending. Each item states what it is part of.
 */
import { SERVICES_2024, SPONSOR_LABELS, SPONSOR_LINES_2024 } from "./baseline"
import { v } from "./constants"

export const COST_CATEGORIES = [
  "National spending by service",
  "Who pays (2024)",
  "Clinician & staff wages",
  "Health industries: payroll",
  "Hospital cost structure",
  "Drugs: R&D, manufacturing & distribution",
  "Insurance & intermediaries",
  "Administration",
  "Waste",
  "Liability",
  "Fraud & improper payments",
  "Training the workforce",
  "Long-term & end-of-life care",
  "Margins & executive pay",
  "Capital, research & public health",
] as const

export type CostCategory = (typeof COST_CATEGORIES)[number]

export type InventoryItem = {
  id: string
  category: CostCategory
  label: string
  /** Billions of dollars per year, unless `unit` says otherwise. */
  amount: number
  unit: "usdB" | "usd" | "count"
  /** How the number is built, with the actual figures. */
  formula: string
  partOf: string
  sourceIds: string[]
  note?: string
  /** Problems this cost relates to. */
  problemIds?: string[]
  /** Supporting figures shown on the item's page. */
  details?: { label: string; value: string }[]
}

const n = (x: number) => Math.round(x).toLocaleString("en-US")
const b = (x: number) => `$${x.toLocaleString("en-US", { maximumFractionDigits: 1 })}B`

// ---------------------------------------------------------------- 1. NHE services
const serviceItems: InventoryItem[] = SERVICES_2024.map((s) => ({
  id: `nhe-${s.id}`,
  category: "National spending by service",
  label: s.label,
  amount: s.total,
  unit: "usdB",
  formula: Object.entries(s.byPayer)
    .map(([p, x]) => `${p} ${b(x)}`)
    .join(" + "),
  partOf: "National health expenditures ($5,278.6B, 2024)",
  sourceIds: ["cms-nhe-2024"],
  note: s.description,
  details: Object.entries(s.byPayer).map(([p, x]) => ({ label: p, value: b(x) })),
}))

// ---------------------------------------------------------------- 1b. Who pays
const PAY_PROBLEMS: Record<string, string[]> = {
  bizEsi: ["premium-burden", "job-lock"],
  hhEsi: ["premium-burden", "job-lock"],
  hhDirect: ["premium-burden", "churn"],
  hhOop: ["underinsurance", "medical-debt"],
  hhSmi: ["premium-burden"],
  fedMarketplace: ["churn"],
  fedMedicaid: ["churn", "disparities"],
  slMedicaid: ["churn"],
  fedMedicare: ["ma-upcoding"],
}
const payItems: InventoryItem[] = SPONSOR_LINES_2024.map((l) => ({
  id: `pay-${l.id}`,
  category: "Who pays (2024)",
  label: `${SPONSOR_LABELS[l.sponsor]}: ${l.label}`,
  amount: l.amount,
  unit: "usdB",
  formula: "CMS NHE Tables 5-1 to 5-4",
  partOf: "National health expenditures by sponsor",
  sourceIds: ["cms-nhe-2024"],
  problemIds: PAY_PROBLEMS[l.id],
}))

// ---------------------------------------------------------------- 2. Occupations (BLS OEWS May 2025)
type Occ = { code: string; label: string; employed: number; wage: number; problems?: string[] }
export const OCCUPATIONS: Occ[] = [
  {
    code: "29-1210",
    label: "Physicians (all specialties)",
    employed: 754760,
    wage: 277260,
    problems: ["physician-shortage"],
  },
  {
    code: "29-1215",
    label: "  Family medicine physicians",
    employed: 107510,
    wage: 255820,
    problems: ["physician-shortage"],
  },
  {
    code: "29-1216",
    label: "  General internal medicine physicians",
    employed: 67150,
    wage: 267200,
  },
  { code: "29-1221", label: "  Pediatricians", employed: 39390, wage: 212110 },
  {
    code: "29-1223",
    label: "  Psychiatrists",
    employed: 27980,
    wage: 269940,
    problems: ["mental-health-access"],
  },
  { code: "29-1211", label: "  Anesthesiologists", employed: 38760, wage: 360570 },
  { code: "29-1240", label: "Surgeons", employed: 49380, wage: 364360 },
  {
    code: "29-1141",
    label: "Registered nurses",
    employed: 3379720,
    wage: 101420,
    problems: ["nursing-shortage"],
  },
  {
    code: "29-1171",
    label: "Nurse practitioners",
    employed: 323040,
    wage: 137300,
    problems: ["scope-of-practice"],
  },
  { code: "29-1151", label: "Nurse anesthetists", employed: 51840, wage: 248320 },
  {
    code: "29-1071",
    label: "Physician assistants",
    employed: 162150,
    wage: 141280,
    problems: ["scope-of-practice"],
  },
  { code: "29-2061", label: "Licensed practical nurses", employed: 648410, wage: 67050 },
  {
    code: "31-1131",
    label: "Nursing assistants",
    employed: 1448910,
    wage: 42700,
    problems: ["nursing-shortage", "nursing-home-quality"],
  },
  {
    code: "31-1120",
    label: "Home health & personal care aides",
    employed: 4305810,
    wage: 36120,
    problems: ["ltc-spend-down", "nursing-shortage"],
  },
  {
    code: "29-1051",
    label: "Pharmacists",
    employed: 321970,
    wage: 140920,
    problems: ["pharmacy-deserts"],
  },
  { code: "29-2052", label: "Pharmacy technicians", employed: 471680, wage: 46620 },
  {
    code: "29-1021",
    label: "Dentists (general)",
    employed: 124390,
    wage: 191350,
    problems: ["dental-gap"],
  },
  { code: "29-1292", label: "Dental hygienists", employed: 222740, wage: 98990 },
  { code: "31-9091", label: "Dental assistants", employed: 387790, wage: 50200 },
  { code: "29-1041", label: "Optometrists", employed: 42790, wage: 141550 },
  { code: "29-2081", label: "Opticians", employed: 73530, wage: 51770 },
  { code: "29-1181", label: "Audiologists", employed: 13660, wage: 97740 },
  { code: "31-9092", label: "Medical assistants", employed: 817870, wage: 46120 },
  { code: "29-1123", label: "Physical therapists", employed: 267330, wage: 105280 },
  { code: "31-2021", label: "Physical therapist assistants", employed: 112430, wage: 68730 },
  { code: "29-1122", label: "Occupational therapists", employed: 162450, wage: 101280 },
  { code: "29-1126", label: "Respiratory therapists", employed: 139790, wage: 87300 },
  { code: "29-2034", label: "Radiologic technologists", employed: 230490, wage: 83840 },
  {
    code: "29-2010",
    label: "Clinical lab technologists & technicians",
    employed: 332940,
    wage: 67350,
  },
  { code: "29-2055", label: "Surgical technologists", employed: 117460, wage: 68710 },
  {
    code: "29-2040",
    label: "EMTs & paramedics",
    employed: 281120,
    wage: 52750,
    problems: ["transport"],
  },
  {
    code: "19-3033",
    label: "Clinical & counseling psychologists",
    employed: 75990,
    wage: 112750,
    problems: ["mental-health-access"],
  },
  {
    code: "21-1018",
    label: "Substance use, behavioral & mental health counselors",
    employed: 491930,
    wage: 64440,
    problems: ["mental-health-access", "addiction"],
  },
  { code: "21-1022", label: "Healthcare social workers", employed: 187630, wage: 71790 },
  {
    code: "11-9111",
    label: "Medical & health services managers",
    employed: 597080,
    wage: 140970,
    problems: ["admin-cost"],
  },
  {
    code: "43-6013",
    label: "Medical secretaries & administrative assistants",
    employed: 961610,
    wage: 46800,
    problems: ["admin-cost", "billing-jobs"],
  },
  {
    code: "29-2072",
    label: "Medical records specialists (coders)",
    employed: 194720,
    wage: 56790,
    problems: ["billing-jobs"],
  },
  { code: "29-9021", label: "Health information technologists", employed: 38100, wage: 74970 },
  {
    code: "13-1031",
    label: "Claims adjusters, examiners & investigators (all industries)",
    employed: 324230,
    wage: 80470,
    problems: ["denials", "billing-jobs"],
  },
  {
    code: "43-9041",
    label: "Insurance claims & policy processing clerks (all industries)",
    employed: 214260,
    wage: 52920,
    problems: ["billing-jobs"],
  },
]

/** Wages are about 69% of total compensation in health care (BLS Employer Costs for Employee Compensation). */
export const COMP_FACTOR = 1 / 0.69

const occupationItems: InventoryItem[] = OCCUPATIONS.map((o) => {
  const wageBill = (o.employed * o.wage) / 1e9
  return {
    id: `occ-${o.code}`,
    category: "Clinician & staff wages",
    label: o.label.trim(),
    amount: wageBill,
    unit: "usdB",
    formula: `${n(o.employed)} people × $${n(o.wage)} average annual wage`,
    partOf:
      "Hospital, physician, and other service spending (wages are paid out of what payers spend on services)",
    sourceIds: ["bls-oews-2025"],
    problemIds: o.problems,
    details: [
      { label: "SOC code", value: o.code },
      { label: "Employed (May 2025)", value: n(o.employed) },
      { label: "Average annual wage", value: `$${n(o.wage)}` },
      { label: "Wage bill", value: b(wageBill) },
      {
        label: "Estimated total compensation incl. benefits (÷ 0.69)",
        value: b(wageBill * COMP_FACTOR),
      },
    ],
  }
})

// ---------------------------------------------------------------- 3. Industries
type Ind = { code: string; label: string; employed: number; wage: number }
const INDUSTRIES: Ind[] = [
  { code: "621100", label: "Offices of physicians", employed: 2936460, wage: 106660 },
  { code: "621200", label: "Offices of dentists", employed: 1054930, wage: 79690 },
  {
    code: "621300",
    label: "Offices of other practitioners (therapy, chiropractic, optometry)",
    employed: 1305160,
    wage: 71550,
  },
  { code: "621400", label: "Outpatient care centers", employed: 1182730, wage: 87320 },
  { code: "621500", label: "Medical & diagnostic laboratories", employed: 309310, wage: 78200 },
  { code: "621600", label: "Home health care services", employed: 1789480, wage: 52560 },
  {
    code: "621900",
    label: "Other ambulatory care (ambulance, blood banks)",
    employed: 369130,
    wage: 64440,
  },
  { code: "622000", label: "Hospitals", employed: 6712760, wage: 89180 },
  {
    code: "623000",
    label: "Nursing & residential care facilities",
    employed: 3395180,
    wage: 50770,
  },
  {
    code: "456100",
    label: "Health & personal care retailers (pharmacies)",
    employed: 1076240,
    wage: 56830,
  },
  {
    code: "325400",
    label: "Pharmaceutical & medicine manufacturing",
    employed: 348780,
    wage: 91390,
  },
  {
    code: "339100",
    label: "Medical equipment & supplies manufacturing",
    employed: 330970,
    wage: 76220,
  },
  { code: "524114", label: "Health & medical insurance carriers", employed: 451820, wage: 93210 },
]
const industryItems: InventoryItem[] = INDUSTRIES.map((i) => {
  const bill = (i.employed * i.wage) / 1e9
  return {
    id: `ind-${i.code}`,
    category: "Health industries: payroll",
    label: i.label,
    amount: bill,
    unit: "usdB",
    formula: `${n(i.employed)} employees × $${n(i.wage)} average wage`,
    partOf: "The service spending of that industry",
    sourceIds: ["bls-oews-2025"],
    details: [
      { label: "NAICS", value: i.code },
      { label: "Employees (May 2025)", value: n(i.employed) },
      { label: "Average wage", value: `$${n(i.wage)}` },
      { label: "Payroll (wages only)", value: b(bill) },
    ],
  }
})

// ---------------------------------------------------------------- 4. Hospital cost structure (AHA 2024)
const hospital: InventoryItem[] = [
  {
    id: "hosp-labor",
    label: "Hospital labor (wages, benefits, contract staff)",
    amount: 890,
    share: 0.56,
  },
  { id: "hosp-supplies", label: "Hospital medical supplies", amount: 202, share: 0.13 },
  { id: "hosp-drugs", label: "Hospital drugs", amount: 144, share: 0.09 },
  {
    id: "hosp-other",
    label: "Other hospital costs (purchased services, IT, facilities, insurance, depreciation)",
    amount: 352,
    share: 0.22,
  },
].map((x) => ({
  id: x.id,
  category: "Hospital cost structure" as const,
  label: x.label,
  amount: x.amount,
  unit: "usdB" as const,
  formula: `${Math.round(x.share * 100)}% of total hospital expenses (AHA estimate from Strata benchmarks, 2024)`,
  partOf: "Hospital care spending ($1,634.7B)",
  sourceIds: ["aha-cost-caring"],
  problemIds:
    x.id === "hosp-drugs"
      ? ["drug-prices", "shortages"]
      : x.id === "hosp-labor"
        ? ["nursing-shortage"]
        : undefined,
}))

// ---------------------------------------------------------------- 5. Drugs
const drugs: InventoryItem[] = [
  {
    id: "pharma-rd",
    category: "Drugs: R&D, manufacturing & distribution",
    label: "Pharmaceutical industry R&D",
    amount: 83,
    unit: "usdB",
    formula: "CBO estimate for 2019: about a quarter of the industry's net revenue",
    partOf: "Drug prices (recovered through revenue worldwide)",
    sourceIds: ["cbo-pharma-rd-2021"],
    problemIds: ["rd-incentives", "innovation-slowdown"],
    details: [
      {
        label: "Expected cost per new drug (incl. failures & capital)",
        value: "under $1B to over $2B",
      },
    ],
  },
  {
    id: "pharma-payroll",
    category: "Drugs: R&D, manufacturing & distribution",
    label: "Drug manufacturing payroll (U.S.)",
    amount: (348780 * 91390) / 1e9,
    unit: "usdB",
    formula: "348,780 employees × $91,390",
    partOf: "Drug prices",
    sourceIds: ["bls-oews-2025"],
  },
  {
    id: "insulin-cost",
    category: "Drugs: R&D, manufacturing & distribution",
    label: "Insulin: production cost per vial",
    amount: 6,
    unit: "usd",
    formula: "Estimated $2–6 per vial (human insulin about $2.28–3.42, analogs about $3.69–6.16)",
    partOf: "An example of price vs. production cost",
    sourceIds: ["gotham-insulin-2018"],
    problemIds: ["drug-prices"],
  },
  {
    id: "pbm-markups",
    category: "Drugs: R&D, manufacturing & distribution",
    label: "Big Three PBM dispensing markups above acquisition cost (2017–2022, total)",
    amount: 7.3,
    unit: "usdB",
    formula: "FTC interim staff report",
    partOf: "Retail drug spending",
    sourceIds: ["ftc-pbm-2025"],
    problemIds: ["pbm"],
  },
  {
    id: "pharmacy-payroll",
    category: "Drugs: R&D, manufacturing & distribution",
    label: "Pharmacy & drugstore payroll",
    amount: (1076240 * 56830) / 1e9,
    unit: "usdB",
    formula: "1,076,240 employees × $56,830",
    partOf: "Retail drug spending (dispensing margins)",
    sourceIds: ["bls-oews-2025"],
    problemIds: ["pharmacy-deserts"],
  },
  {
    id: "device-payroll",
    category: "Drugs: R&D, manufacturing & distribution",
    label: "Medical device & supply manufacturing payroll",
    amount: (330970 * 76220) / 1e9,
    unit: "usdB",
    formula: "330,970 employees × $76,220",
    partOf: "Supplies and durable equipment spending",
    sourceIds: ["bls-oews-2025"],
  },
]

// ---------------------------------------------------------------- 6. Insurance
const insurance: InventoryItem[] = [
  {
    id: "ins-private-net",
    label: "Private insurer overhead & profit (net cost of insurance)",
    amount: 176.5,
    src: ["cms-nhe-2024"],
    f: "Premiums minus benefits, private health insurance",
    p: ["insurer-overhead"],
  },
  {
    id: "ins-ma-partd",
    label: "Medicare Advantage & Part D plan overhead",
    amount: 57.6,
    src: ["cms-nhe-2024"],
    f: "Net cost of insurance, Medicare column",
    p: ["ma-upcoding"],
  },
  {
    id: "ins-mco",
    label: "Medicaid managed-care plan overhead",
    amount: 45.5,
    src: ["cms-nhe-2024"],
    f: "Net cost of insurance, Medicaid column",
    p: ["insurer-overhead"],
  },
  {
    id: "ins-earnings",
    label: "Health insurer net earnings (average 2023–2024)",
    amount: v("insurerProfit"),
    src: ["naic-health-results"],
    f: "($25B + $9B) ÷ 2",
    p: ["insurer-overhead"],
  },
  {
    id: "ins-brokers",
    label: "Broker & agent commissions and marketing (estimate)",
    amount: v("brokerCommissions"),
    src: [],
    f: "About 2% of private premiums",
    p: ["insurer-overhead"],
  },
  {
    id: "ins-premium-tax",
    label: "State premium taxes on health insurers (estimate)",
    amount: v("statePremiumTax"),
    src: ["naic-premium-tax"],
    f: "1–3% of fully insured premiums",
    p: [],
  },
  {
    id: "ins-carrier-payroll",
    label: "Health insurer payroll",
    amount: (451820 * 93210) / 1e9,
    src: ["bls-oews-2025"],
    f: "451,820 employees × $93,210",
    p: ["billing-jobs"],
  },
  {
    id: "ins-idr",
    label: "Surprise-billing arbitration (IDR) costs, per year",
    amount: 2.25,
    src: ["crs-idr-2024"],
    f: "At least $5B through 2024, about $2–2.5B a year",
    p: ["surprise-bills"],
  },
].map((x) => ({
  id: x.id,
  category: "Insurance & intermediaries" as const,
  label: x.label,
  amount: x.amount,
  unit: "usdB" as const,
  formula: x.f,
  partOf: "Net cost of health insurance ($306.0B)",
  sourceIds: x.src,
  problemIds: x.p,
}))

// ---------------------------------------------------------------- 7. Administration, waste, liability, fraud
const nhe = 5278.6
const admin: InventoryItem[] = [
  {
    id: "admin-total",
    category: "Administration",
    label: "Total administrative spending (payers + providers)",
    amount: 950,
    f: "About 25% of spending (2019 base); $265B removable with existing interventions",
    src: ["sahni-admin"],
    p: ["admin-cost"],
  },
  {
    id: "admin-hospital-collection",
    category: "Administration",
    label: "Hospitals' cost of collecting payment from insurers",
    amount: 43,
    f: "AHA 2026 estimate",
    src: ["aha-cost-caring"],
    p: ["denials", "admin-cost"],
  },
  {
    id: "waste-admin",
    category: "Waste",
    label: "Waste: administrative complexity",
    amount: 266,
    f: "Midpoint of published estimate",
    src: ["shrank-waste-2019"],
    p: ["admin-cost"],
  },
  {
    id: "waste-pricing",
    category: "Waste",
    label: "Waste: pricing failure",
    amount: 236,
    f: "$231–241B",
    src: ["shrank-waste-2019"],
    p: ["high-prices"],
  },
  {
    id: "waste-delivery",
    category: "Waste",
    label: "Waste: failure of care delivery",
    amount: 134,
    f: "$102–166B",
    src: ["shrank-waste-2019"],
    p: ["safety"],
  },
  {
    id: "waste-lowvalue",
    category: "Waste",
    label: "Waste: overtreatment & low-value care",
    amount: 88.5,
    f: "$76–101B",
    src: ["shrank-waste-2019"],
    p: ["low-value-care"],
  },
  {
    id: "waste-fraud",
    category: "Waste",
    label: "Waste: fraud & abuse",
    amount: 71.5,
    f: "$59–84B",
    src: ["shrank-waste-2019"],
    p: ["fraud"],
  },
  {
    id: "waste-coordination",
    category: "Waste",
    label: "Waste: failure of care coordination",
    amount: 52.5,
    f: "$27–78B",
    src: ["shrank-waste-2019"],
    p: ["safety", "interoperability"],
  },
  {
    id: "liability-total",
    category: "Liability",
    label: "Medical liability system (2008 dollars)",
    amount: 55.6,
    f: "Payments, legal costs, lost time, and defensive medicine; 2.4% of spending",
    src: ["mello-liability"],
    p: ["malpractice"],
  },
  {
    id: "liability-defensive",
    category: "Liability",
    label: "Defensive medicine (2008 dollars)",
    amount: 45.6,
    f: "Part of the liability total",
    src: ["mello-liability"],
    p: ["malpractice", "low-value-care"],
  },
  {
    id: "fraud-low",
    category: "Fraud & improper payments",
    label: "Fraud at 3% of 2024 spending",
    amount: nhe * 0.03,
    f: `$5,278.6B × 3%`,
    src: ["nhcaa-fraud"],
    p: ["fraud"],
  },
  {
    id: "fraud-high",
    category: "Fraud & improper payments",
    label: "Fraud at 10% of 2024 spending",
    amount: nhe * 0.1,
    f: `$5,278.6B × 10%`,
    src: ["nhcaa-fraud"],
    p: ["fraud"],
  },
  {
    id: "improper-medicare",
    category: "Fraud & improper payments",
    label: "Medicare FFS improper payments (7.7% rate)",
    amount: 0.077 * 439.8 + 0.077 * 251.2,
    f: "7.7% × Medicare hospital and physician spending (illustrative; CMS reports about $31B for FFS)",
    src: ["cms-improper"],
    p: ["fraud"],
  },
].map((x) => ({
  id: x.id,
  category: x.category as CostCategory,
  label: x.label,
  amount: x.amount,
  unit: "usdB" as const,
  formula: x.f,
  partOf: "Spread across national spending (overlapping estimates; do not add)",
  sourceIds: x.src,
  problemIds: x.p,
}))

// ---------------------------------------------------------------- 8. Training
const training: InventoryItem[] = [
  {
    id: "med-debt",
    category: "Training the workforce",
    label: "Median medical school debt (per graduate)",
    amount: 200000,
    unit: "usd",
    formula: "AAMC Class of 2024; 67% of graduates have debt",
    partOf: "Physician cost structure (recovered through future pay)",
    sourceIds: ["aamc-debt-2024"],
    problemIds: ["training-debt"],
  },
  {
    id: "resident-salary",
    category: "Training the workforce",
    label: "Average resident salary",
    amount: 70000,
    unit: "usd",
    formula: "Medscape 2024",
    partOf: "Hospital labor (residents are hospital employees; Medicare GME pays part)",
    sourceIds: ["medscape-resident-2024"],
    problemIds: ["physician-shortage"],
  },
  {
    id: "residency-slot-cost",
    category: "Training the workforce",
    label: "Annual cost per residency position (estimate)",
    amount: v("residencyCostPerSlot"),
    unit: "usd",
    formula: "Salary, benefits, teaching time, and overhead",
    partOf: "Hospital spending and Medicare GME",
    sourceIds: ["aamc-shortage"],
    problemIds: ["physician-shortage"],
  },
]

// ---------------------------------------------------------------- 9. LTC & end of life
const ltc: InventoryItem[] = [
  {
    id: "hospice-medicare",
    category: "Long-term & end-of-life care",
    label: "Medicare hospice spending (2023)",
    amount: 25.7,
    unit: "usdB",
    formula: "1.7M beneficiaries, about 6,500 providers; $28.3B in 2024",
    partOf: "Medicare spending",
    sourceIds: ["medpac-hospice-2025"],
    problemIds: ["hospice-for-profit"],
  },
  {
    id: "aides-payroll",
    category: "Long-term & end-of-life care",
    label: "Home health & personal care aide wages",
    amount: (4305810 * 36120) / 1e9,
    unit: "usdB",
    formula: "4,305,810 aides × $36,120",
    partOf: "Home health and HCBS spending",
    sourceIds: ["bls-oews-2025"],
    problemIds: ["ltc-spend-down", "nursing-shortage"],
  },
  {
    id: "nursing-home-payroll",
    category: "Long-term & end-of-life care",
    label: "Nursing & residential care payroll",
    amount: (3395180 * 50770) / 1e9,
    unit: "usdB",
    formula: "3,395,180 employees × $50,770",
    partOf: "Nursing facility and residential care spending",
    sourceIds: ["bls-oews-2025"],
    problemIds: ["nursing-home-quality"],
  },
]

// ---------------------------------------------------------------- 10. Margins & executive pay
const margins: InventoryItem[] = [
  {
    id: "hospital-margin",
    category: "Margins & executive pay",
    label: "Hospital operating margin (median 4.9%, 2024), applied to hospital spending",
    amount: 1634.7 * 0.049,
    unit: "usdB",
    formula: "$1,634.7B × 4.9% (illustrative; margins vary widely and many hospitals lose money)",
    partOf: "Hospital care spending",
    sourceIds: ["kaufman-margins", "cms-nhe-2024"],
    problemIds: ["consolidation", "rural-hospitals"],
  },
  {
    id: "ceo-pay",
    category: "Margins & executive pay",
    label: "Average nonprofit health system CEO pay",
    amount: 1300000,
    unit: "usd",
    formula: "Rice University study",
    partOf: "Hospital other costs",
    sourceIds: ["rice-ceo-pay"],
    problemIds: ["executive-pay"],
  },
  {
    id: "physician-pay-gap",
    category: "Margins & executive pay",
    label: "Specialist vs. primary-care pay gap (anesthesiology vs. family medicine, mean wage)",
    amount: 360570 - 255820,
    unit: "usd",
    formula: "$360,570 − $255,820 (BLS means; specialty surveys show larger gaps)",
    partOf: "Physician services spending",
    sourceIds: ["bls-oews-2025", "doximity-2025"],
    problemIds: ["physician-shortage"],
  },
]

// ---------------------------------------------------------------- 11. Capital etc.
const capital: InventoryItem[] = [
  {
    id: "cap-structures",
    category: "Capital, research & public health",
    label: "Structures & equipment",
    amount: 168.2,
    unit: "usdB",
    formula: "CMS NHE 2024",
    partOf: "National health expenditures",
    sourceIds: ["cms-nhe-2024"],
    problemIds: ["capital-underinvestment"],
  },
  {
    id: "cap-research",
    category: "Capital, research & public health",
    label: "Non-commercial research (NIH etc.)",
    amount: 70.4,
    unit: "usdB",
    formula: "CMS NHE 2024",
    partOf: "National health expenditures",
    sourceIds: ["cms-nhe-2024"],
    problemIds: ["rd-incentives"],
  },
  {
    id: "cap-publichealth",
    category: "Capital, research & public health",
    label: "Government public health",
    amount: 157.6,
    unit: "usdB",
    formula: "CMS NHE 2024",
    partOf: "National health expenditures",
    sourceIds: ["cms-nhe-2024"],
    problemIds: ["prevention-underfunded"],
  },
]

export const INVENTORY: InventoryItem[] = [
  ...serviceItems,
  ...payItems,
  ...occupationItems,
  ...industryItems,
  ...hospital,
  ...drugs,
  ...insurance,
  ...admin,
  ...training,
  ...ltc,
  ...margins,
  ...capital,
]

/** Extra problem links for items built from tables above. */
const EXTRA_LINKS: Record<string, string[]> = {
  "nhe-hospital": [
    "uninsured",
    "facility-fees",
    "consolidation",
    "rural-hospitals",
    "maternity-deserts",
    "provider-exit",
  ],
  "nhe-physicianClinical": ["provider-exit", "facility-fees", "private-equity"],
  "nhe-prescriptionDrugs": ["drug-prices", "patents", "pbm"],
  "nhe-netCostOfInsurance": [
    "insurer-overhead",
    "networks",
    "denials",
    "prior-auth",
    "transition-disruption",
  ],
  "nhe-governmentAdministration": ["fraud-concentration", "underfunding"],
  "nhe-dental": ["dental-gap"],
  "nhe-durableEquipment": ["dental-gap"],
  "nhe-otherResidential": ["ltc-spend-down", "social-needs"],
  "nhe-structures": ["capital-underinvestment", "wait-times"],
  "pay-hhOop": ["uninsured"],
  "occ-29-1215": ["shortage-areas", "wait-times"],
  "occ-29-1210": ["burnout-admin", "two-tier"],
  "occ-43-6013": ["prior-auth", "burnout-admin"],
  "ins-idr": ["private-equity"],
  "waste-pricing": ["price-opacity"],
  "admin-total": ["cybersecurity", "privacy"],
  "ins-carrier-payroll": ["transition-disruption"],
  "pay-fedMedicare": ["underfunding"],
  "occ-29-1141": ["outcomes", "maternal-mortality"],
  "occ-29-1223": ["immigrant-coverage"],
}
for (const item of INVENTORY) {
  const extra = EXTRA_LINKS[item.id]
  if (extra) item.problemIds = [...new Set([...(item.problemIds ?? []), ...extra])]
}

export const INVENTORY_BY_ID = Object.fromEntries(INVENTORY.map((i) => [i.id, i]))
