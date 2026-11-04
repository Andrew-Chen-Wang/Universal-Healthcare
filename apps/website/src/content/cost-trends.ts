/**
 * How fast each cost in the inventory is growing, and why: the yearly series it is
 * measured by (cost-trend-data.ts) and the context behind the numbers (new laws,
 * benefits added, enrollment swings, prices, the pandemic).
 *
 * Keyed by inventory id; cost-inventory.ts throws at build time if an item has no
 * entry. Figures quoted in the text are computed from the data, never typed in.
 */
import { show } from "./constants"
import { TREND_LAST_YEAR, TREND_SERIES, type TrendSeriesId } from "./cost-trend-data"

export type CostTrend = {
  /** Yearly series that measure this cost. The first is charted; empty when no yearly series exists. */
  series: TrendSeriesId[]
  /**
   * True when the series measure a wider group than this item (the whole sector's jobs
   * or wages, or the spending an estimate is a share of), not the item itself.
   */
  proxy?: boolean
  /** Why it is growing (or shrinking): the context behind the figures. */
  why: string
}

// ---------------------------------------------------------------- math on the series
export const valueAt = (id: TrendSeriesId, year: number): number | null =>
  TREND_SERIES[id].values[year - TREND_SERIES[id].firstYear] ?? null

/** Average yearly growth from `from` to `to` (compound), or null if either end is missing or zero. */
export function annualGrowth(id: TrendSeriesId, from: number, to = TREND_LAST_YEAR) {
  const a = valueAt(id, from)
  const b = valueAt(id, to)
  if (!a || b === null) return null
  return (b / a) ** (1 / (to - from)) - 1
}

/** Total change from `from` to `to`, or null if either end is missing or zero. */
export function totalChange(id: TrendSeriesId, from: number, to = TREND_LAST_YEAR) {
  const a = valueAt(id, from)
  const b = valueAt(id, to)
  if (!a || b === null) return null
  return b / a - 1
}

export const fmtPct = (x: number | null) =>
  x === null ? "n/a" : `${x >= 0 ? "+" : "−"}${Math.abs(x * 100).toFixed(1)}%`

/** "rose 9.9%" / "fell 2.4%" for prose. */
const moved = (x: number | null) =>
  x === null ? "changed" : `${x >= 0 ? "rose" : "fell"} ${Math.abs(x * 100).toFixed(1)}%`
const yoy = (id: TrendSeriesId, year: number) => moved(totalChange(id, year - 1, year))
/** "rose 10.6% in 2023 and 8.9% in 2024" (repeats the verb only when the direction changes). */
const yoy2 = (id: TrendSeriesId, y1: number, y2: number) => {
  const a = totalChange(id, y1 - 1, y1)
  const b = totalChange(id, y2 - 1, y2)
  const second =
    a !== null && b !== null && a >= 0 === b >= 0 ? `${Math.abs(b * 100).toFixed(1)}%` : moved(b)
  return `${moved(a)} in ${y1} and ${second} in ${y2}`
}
const rate = (id: TrendSeriesId, from: number, to = TREND_LAST_YEAR) => {
  const g = annualGrowth(id, from, to)
  return g === null ? "a few percent" : `${(g * 100).toFixed(1)}%`
}
const times = (id: TrendSeriesId, from: number, to = TREND_LAST_YEAR) => {
  const c = totalChange(id, from, to)
  return c === null ? "several times" : `${(c + 1).toFixed(1)} times`
}

// ---------------------------------------------------------------- shared texts
const PREMIUMS = `Job-based premiums rise with what plans pay for care: higher hospital and physician prices (driven largely by provider consolidation), expensive specialty drugs, and since 2023 the new GLP-1 drugs for diabetes and obesity. The average family premium rose ${show("familyPremiumGrowth2025")} from 2024 to 2025 (KFF), and the total also grows as more people work in jobs that offer coverage.`

const PAYROLL_TAX_GROWTH = `The Medicare payroll tax rate has not changed since 1986, so this line grows only with total wages: more people working and higher pay. It grew fastest in 2021–2022 as employment recovered from the pandemic and wages rose with inflation.`

const MEDICAID_SWING = `Medicaid spending swung with the pandemic. The Families First Coronavirus Response Act (2020) gave states a higher federal match on condition that no one was dropped from Medicaid, so enrollment climbed for three years. When that guarantee ended in 2023, states rechecked every enrollee (the "unwinding"), millions lost coverage, and the extra federal match phased out over 2023, shifting cost back to the states. Underneath the swing, the ACA expansion (from 2014), long-term care for an aging population, and rising provider payments keep spending growing.`

const BUY_IN_GROWTH = `This grows with the number of low-income people on Medicare (more each year as baby boomers age) and with the Part B premium it pays for them, which rises with Part B spending. Several states raised the income limits for these programs, adding enrollees.`

const PUBLIC_HEALTH_GROWTH = `Public health spending is driven by emergencies. It jumped in 2020 as COVID-19 testing, contact tracing, and vaccination were paid for with federal emergency funds, then fell back as that money ran out; between emergencies it grows slowly with state and local budgets.`

const PHYSICIAN_PAY = `Doctors' pay has grown more slowly than health spending: Medicare's physician fee schedule has not been raised with inflation since 2001 and was cut in several recent years, though private insurers pay rising rates. Demand rises with an aging population while the 1997 cap on Medicare-funded residencies limits supply. More physicians are now employed by hospitals and private-equity-backed groups rather than owning their practices.`

const NURSE_PAY = `Hospital wages rose faster in 2021–2023 than at any time since at least 2001 as nurses left bedside jobs in the pandemic and hospitals paid agency "travel nurses" premium rates to fill gaps; staff pay then rose to keep people. Demand keeps growing with an aging population and sicker hospital patients, while nursing schools turn away qualified applicants for lack of faculty and clinical training places.`

const LTC_PAY = `Nursing homes lost many workers in the pandemic, and jobs took until 2024 to recover. Pay has risen faster than in other health jobs since 2021 as states raised Medicaid rates and minimum wages and facilities competed with retail and warehouse jobs for the same workers.`

const AIDE_PAY = `Home care is one of the fastest-growing kinds of work in the country: the population is aging, most people want care at home, and Medicaid has steadily shifted long-term care out of nursing homes since the Olmstead decision (1999). The American Rescue Plan (2021) gave states a temporary boost in federal money for home care, much of it spent on raising aides' pay. Medicaid home-care waiting lists still grew ${show("hcbsWaitlistGrowth2025")} from 2024 to 2025 (KFF).`

const CLINICAL_PAY = `Wages in health care have risen a little faster than wages in the economy as a whole since 2020 because of staff shortages, while jobs have grown with the shift of care to clinics, outpatient centers, and homes. Demand rises with an aging population and wider coverage.`

const ADMIN_PAY = `Administrative work grows with billing complexity: more prior-authorization requirements, more denials to appeal, more payers with different rules, and quality reporting. Electronic records (from 2009) added data work without removing billing work. Automation and AI tools for coding and prior authorization may slow growth from here.`

const GENERAL_PAY = `Its pay tends to track wages in the wider economy.`

const SHARE_OF_SPENDING = `This is a one-time estimate, not a yearly series. It is usually measured as a share of total spending, so it grows roughly as fast as national health spending, shown here for comparison.`

const PHARMACY_GROWTH = `Prescription volume keeps rising, but pharmacy payrolls have not kept up: pharmacy benefit managers have cut what they pay pharmacies to dispense, and thousands of stores have closed since 2010, including large chain closures in 2023–2025. ${GENERAL_PAY}`

// ---------------------------------------------------------------- entries
const S = (...series: TrendSeriesId[]) => series

export const COST_TRENDS: Record<string, CostTrend> = {
  // ------------------------------------------------ National spending by service
  "nhe-hospital": {
    series: S("svc-hospital"),
    why: `Hospital spending ${yoy2("svc-hospital", 2023, 2024)}, the fastest growth since 1990, as patients returned for care delayed in the pandemic and hospitals passed on higher labor costs. Over the long run the main driver is price, not use: hospital mergers since the 1990s let systems charge private insurers more, while Medicare and Medicaid set their own rates. Medicaid's pandemic enrollment (2020–2023) also added patients with coverage.`,
  },
  "nhe-physicianClinical": {
    series: S("svc-physicianClinical"),
    why: `Growth comes mostly from more services rather than higher Medicare rates: an older population, more people insured, and the shift of procedures, imaging, and infusions out of hospitals into outpatient centers, surgery centers, and labs, which are counted here. Spending ${yoy("svc-physicianClinical", 2024)} in 2024. Private insurers' rates rise faster than Medicare's, especially where hospitals and private-equity firms have bought up practices.`,
  },
  "nhe-otherProfessional": {
    series: S("svc-otherProfessional"),
    why: `This is one of the fastest-growing lines: it ${yoy("svc-otherProfessional", 2024)} in 2024 and grew ${times("svc-otherProfessional", 2014)} over ten years. Most of the growth is mental health and behavioral therapy: demand rose sharply in the pandemic, telehealth made therapy easier to reach, parity laws pushed plans to cover it, every state now requires coverage of autism therapy (applied behavior analysis), and Medicare added counselors and family therapists in 2024.`,
  },
  "nhe-dental": {
    series: S("svc-dental"),
    why: `Dental spending fell in 2020 when offices closed and rebounded ${yoy("svc-dental", 2021)} in 2021. Since then it has grown with prices and with Medicare Advantage plans adding dental benefits to attract enrollees; several states also added or restored adult dental coverage in Medicaid. Because so much is paid out of pocket, it grows more slowly than other services when household budgets are tight.`,
  },
  "nhe-otherResidential": {
    series: S("svc-otherResidential"),
    why: `Medicaid home- and community-based services drive this line. States have moved long-term care out of institutions since the Olmstead decision (1999), the American Rescue Plan (2021) temporarily raised federal funding for home care, and the population needing help with daily life grows each year. Waiting lists for these services still grew ${show("hcbsWaitlistGrowth2025")} from 2024 to 2025 (KFF), so demand outruns spending. Residential addiction and mental-health treatment also grew after the opioid crisis.`,
  },
  "nhe-homeHealth": {
    series: S("svc-homeHealth"),
    why: `Home health spending ${yoy("svc-homeHealth", 2024)} in 2024. More patients are sent home rather than to nursing homes after a hospital stay, especially in Medicare Advantage, "hospital at home" programs spread after Medicare allowed them in 2020, and aides' wages have risen. Medicare has cut its home health payment rates in recent years, which slows the Medicare part.`,
  },
  "nhe-nursing": {
    series: S("svc-nursing"),
    why: `Nursing home spending grew slowly through the 2010s as more older people received care at home and occupancy fell. It jumped in 2020 with pandemic relief money, then ${yoy2("svc-nursing", 2023, 2024)} as staff wages rose and states raised Medicaid rates. As baby boomers reach their eighties (from 2026), demand is set to rise faster.`,
  },
  "nhe-prescriptionDrugs": {
    series: S("svc-prescriptionDrugs"),
    why: `Drug spending moves in steps when new drugs arrive. It ${yoy("svc-prescriptionDrugs", 2014)} in 2014 with the new hepatitis C cures and ACA coverage, and ${yoy2("svc-prescriptionDrugs", 2023, 2024)}, driven largely by GLP-1 drugs such as Ozempic, Wegovy, and Mounjaro for diabetes and obesity. Specialty drugs for cancer and autoimmune disease, priced at tens of thousands of dollars a year, add steadily. Generic competition and Medicare's negotiated prices (from 2026) push the other way.`,
  },
  "nhe-durableEquipment": {
    series: S("svc-durableEquipment"),
    why: `Spending ${yoy("svc-durableEquipment", 2021)} in 2021 as purchases delayed in 2020 came back. Growth since has come from continuous glucose monitors and other home devices for chronic disease, an aging population needing mobility and oxygen equipment, and rising prices for glasses and hearing aids, most of it paid out of pocket.`,
  },
  "nhe-otherNonDurable": {
    series: S("svc-otherNonDurable"),
    why: `Spending jumped in 2020 and 2021 on masks, home COVID tests, and over-the-counter medicines, then slowed (it ${yoy("svc-otherNonDurable", 2024)} in 2024). The long-run growth comes from more medicines moving from prescription to over-the-counter status, and from the 2020 CARES Act letting health savings and flexible spending accounts pay for them.`,
  },
  "nhe-governmentAdministration": {
    series: S("svc-governmentAdministration"),
    why: `Administration ${yoy("svc-governmentAdministration", 2024)} in 2024, its fastest growth since 2002. That year states were rechecking the eligibility of every Medicaid enrollee after the pandemic coverage guarantee ended (the "unwinding"), and states have been rebuilding Medicaid eligibility and claims systems with federal money. Over the long run it grows with enrollment in public programs.`,
  },
  "nhe-netCostOfInsurance": {
    series: S("svc-netCostOfInsurance", "ins-private", "ins-medicare", "ins-medicaid"),
    why: `Net cost is premiums minus claims, so it swings with how claims compare with what insurers expected. It ${yoy("svc-netCostOfInsurance", 2020)} in 2020, when people put off care while premiums were already set, and insurers' profits spiked. It ${yoy("svc-netCostOfInsurance", 2024)} in 2024 as Medicare Advantage and Medicaid plans paid far more in claims than they had planned for, and as the Medicaid "unwinding" shrank managed-care enrollment. Over the long run it grows with premiums and with the shift of Medicare and Medicaid enrollees into private plans.`,
  },
  "nhe-publicHealth": { series: S("svc-publicHealth"), why: PUBLIC_HEALTH_GROWTH },
  "nhe-research": {
    series: S("svc-research"),
    why: `Research spending follows NIH's budget, which Congress roughly doubled from 1998 to 2003, then held nearly flat in real terms for a decade before raising it again from 2016. It ${yoy("svc-research", 2024)} in 2024. In 2025 the administration terminated many NIH grants and proposed deep cuts, so this line may shrink.`,
  },
  "nhe-structures": {
    series: S("svc-structures"),
    why: `Construction and equipment spending grows steadily, a little more slowly than total spending. Hospitals are building outpatient centers and replacing aging buildings, and equipment such as imaging machines and surgical robots keeps getting more expensive. Higher interest rates since 2022 and construction cost inflation have slowed new projects while raising their price.`,
  },

  // ------------------------------------------------ Who pays
  "pay-bizEsi": { series: S("pay-bizEsi"), why: PREMIUMS },
  "pay-bizHi": { series: S("pay-bizHi"), why: PAYROLL_TAX_GROWTH },
  "pay-bizOther": {
    series: S("pay-bizOther"),
    why: `This line has barely grown in twenty years. Workplace injury rates have fallen steadily as jobs moved from factories to offices and services, and many states have tightened workers' compensation medical fee schedules. It fell in 2020 when many workplaces closed.`,
  },
  "pay-hhEsi": {
    series: S("pay-hhEsi"),
    why: `${PREMIUMS} Workers' share also grows as employers shift more of the premium onto employees, especially for family coverage.`,
  },
  "pay-hhDirect": {
    series: S("pay-hhDirect"),
    why: `This line ${yoy("pay-hhDirect", 2014)} in 2014 when the ACA marketplaces opened. It grew slowly from 2021 because the American Rescue Plan's larger premium tax credits cut what households paid even as enrollment rose. Those larger credits expired at the end of 2025, so households' share of premiums jumps in 2026.`,
  },
  "pay-hhPc": {
    series: S("pay-hhPc"),
    why: `The medical part of auto and property insurance ${yoy("pay-hhPc", 2024)} in 2024. Crashes have become more severe since 2020 (more speeding and distracted driving), medical prices for injury care keep rising, and more claims involve attorneys, which raises medical bills.`,
  },
  "pay-hhHi": { series: S("pay-hhHi"), why: PAYROLL_TAX_GROWTH },
  "pay-hhSmi": {
    series: S("pay-hhSmi"),
    why: `Part B premiums are set to cover about a quarter of Part B costs, so they rise with Part B spending: more enrollees as baby boomers turn 65, and costly drugs given in doctors' offices. The premium ${yoy("pay-hhSmi", 2022)} in 2022 partly to cover the Alzheimer's drug Aduhelm, which Medicare then largely declined to cover. The 2006 jump is the start of Part D premiums.`,
  },
  "pay-hhOop": {
    series: S("pay-hhOop"),
    why: `Out-of-pocket spending grows more slowly than total spending because more people are insured, but it keeps rising as deductibles spread and grow: the share of workers with a deductible in employer plans rose from ${show("deductibleShare2014")} in 2014 to ${show("deductibleShare2024")} in 2024 (KFF). It ${yoy("pay-hhOop", 2021)} in 2021 as delayed care returned. The Inflation Reduction Act's cap on Part D costs (from 2025) lowers it for people on Medicare.`,
  },
  "pay-otherPrivate": {
    series: S("pay-otherPrivate"),
    why: `This line grows with hospitals' investment income, gifts, and other private revenue, so it moves with the stock market: it ${yoy2("pay-otherPrivate", 2023, 2024)} as markets rose.`,
  },
  "pay-fedEsi": {
    series: S("pay-fedEsi"),
    why: `This grows with FEHB premiums, which rise for the same reasons as other job-based plans (provider prices, specialty drugs), and with the size of the federal workforce. It ${yoy("pay-fedEsi", 2024)} in 2024; federal workforce cuts in 2025 may slow it.`,
  },
  "pay-fedHi": {
    series: S("pay-fedHi"),
    why: `This grows with the federal payroll: the number of federal employees and their pay raises. ${PAYROLL_TAX_GROWTH.split(". ")[0]}.`,
  },
  "pay-fedMedicare": {
    series: S("pay-fedMedicare"),
    why: `General revenue covers a growing share of Medicare as baby boomers (born 1946–1964) enroll, a wave that began in 2011, and as Part B and Part D, which are funded mostly by general revenue, grow faster than Part A. The 2006 jump is the start of Part D. It ${yoy("pay-fedMedicare", 2024)} in 2024. The Inflation Reduction Act's Part D redesign (from 2025) shifted more drug costs to plans and federal subsidies.`,
  },
  "pay-fedMedicaid": { series: S("pay-fedMedicaid"), why: MEDICAID_SWING },
  "pay-fedBuyIn": { series: S("pay-fedBuyIn"), why: BUY_IN_GROWTH },
  "pay-fedRds": {
    series: S("pay-fedRds"),
    why: `This line is shrinking toward nothing. After the ACA ended the tax deduction for the subsidy (from 2013), most employers moved their retirees into Part D plans run for employers, which Medicare subsidizes through Part D instead.`,
  },
  "pay-fedPrograms": {
    series: S("pay-fedPrograms"),
    why: `Most growth is in veterans' care. The MISSION Act (2018) expanded paid care from community providers, and the PACT Act (2022) extended VA care to millions of veterans exposed to burn pits and other toxins. Military health care (TRICARE) and the Indian Health Service grow more slowly with their budgets.`,
  },
  "pay-fedPublicHealth": { series: S("pay-fedPublicHealth"), why: PUBLIC_HEALTH_GROWTH },
  "pay-fedOther": {
    series: S("pay-fedOther"),
    why: `This line spiked in 2020 with pandemic relief payments to hospitals and other providers and fell back by 2022 when they ended. Apart from that it grows slowly with the budgets of the programs it covers, such as community health centers and the Ryan White HIV/AIDS Program.`,
  },
  "pay-fedMarketplace": {
    series: S("pay-fedMarketplace"),
    why: `Marketplace subsidies ${yoy("pay-fedMarketplace", 2024)} in 2024. The American Rescue Plan (2021) made premium tax credits larger and available to people with higher incomes, and enrollment roughly doubled from 2021 to 2025. Insurers' "silver loading" after 2017 also raised the credits. The larger credits expired at the end of 2025, so this line shrinks in 2026 as enrollees pay more or drop coverage.`,
  },
  "pay-slEsi": {
    series: S("pay-slEsi"),
    why: `${PREMIUMS} Public employers' cost ${yoy("pay-slEsi", 2024)} in 2024 as state and local governments hired back workers after the pandemic and many public plans, which are generous by design, faced large premium increases.`,
  },
  "pay-slHi": {
    series: S("pay-slHi"),
    why: `This grows with state and local payrolls. It rose faster in 2023–2024 as governments refilled positions lost in the pandemic and raised pay to compete for workers.`,
  },
  "pay-slMedicaid": {
    series: S("pay-slMedicaid"),
    why: `States' Medicaid costs ${yoy("pay-slMedicaid", 2024)} in 2024 because the extra federal match from the pandemic phased out over 2023, shifting cost from Washington back to states even as total Medicaid spending held steady. ${MEDICAID_SWING}`,
  },
  "pay-slBuyIn": { series: S("pay-slBuyIn"), why: BUY_IN_GROWTH },
  "pay-slPrograms": {
    series: S("pay-slPrograms"),
    why: `This grows with states' share of CHIP and with county spending on public hospitals and care for the uninsured. It ${yoy("pay-slPrograms", 2024)} in 2024 as states took on more of CHIP's cost and some covered people who lost Medicaid in the unwinding.`,
  },
  "pay-slPublicHealth": { series: S("pay-slPublicHealth"), why: PUBLIC_HEALTH_GROWTH },
  "pay-slOther": {
    series: S("pay-slOther"),
    why: `This collection of smaller programs (school health, maternal and child health, vocational rehabilitation, workers' compensation for public employees) grows slowly with state and local budgets.`,
  },

  // ------------------------------------------------ Occupations
  "occ-29-1210": {
    series: S("eci-healthcare", "emp-physician-offices"),
    proxy: true,
    why: PHYSICIAN_PAY,
  },
  "occ-29-1215": {
    series: S("eci-healthcare", "emp-physician-offices"),
    proxy: true,
    why: `Medicare's 2021 increase in payment for office visits raised primary-care pay relative to specialists for the first time in years. ${PHYSICIAN_PAY}`,
  },
  "occ-29-1216": {
    series: S("eci-healthcare", "emp-physician-offices"),
    proxy: true,
    why: PHYSICIAN_PAY,
  },
  "occ-29-1221": {
    series: S("eci-healthcare", "emp-physician-offices"),
    proxy: true,
    why: `Pediatric pay depends heavily on Medicaid rates, which rise slowly and unevenly by state. ${PHYSICIAN_PAY}`,
  },
  "occ-29-1223": {
    series: S("eci-healthcare", "emp-physician-offices"),
    proxy: true,
    why: `Demand for psychiatrists rose sharply in the pandemic, and telehealth let them see patients across a wider area; because many do not take insurance, their fees rise with what patients will pay. ${PHYSICIAN_PAY}`,
  },
  "occ-29-1211": {
    series: S("eci-healthcare", "emp-physician-offices"),
    proxy: true,
    why: `Anesthesia pay rose as private-equity groups consolidated practices and negotiated higher rates; hospitals now pay large subsidies to keep anesthesia groups staffed. ${PHYSICIAN_PAY}`,
  },
  "occ-29-1240": {
    series: S("eci-healthcare", "emp-physician-offices"),
    proxy: true,
    why: PHYSICIAN_PAY,
  },
  "occ-29-1141": { series: S("eci-hospitals", "emp-hospitals"), proxy: true, why: NURSE_PAY },
  "occ-29-1171": {
    series: S("eci-healthcare", "emp-outpatient"),
    proxy: true,
    why: `Nurse practitioners are among the fastest-growing occupations in the country: more states have given them full practice authority, retail clinics and telehealth companies hire them, and practices use them to fill primary-care gaps. ${CLINICAL_PAY}`,
  },
  "occ-29-1151": { series: S("eci-hospitals", "emp-hospitals"), proxy: true, why: NURSE_PAY },
  "occ-29-1071": {
    series: S("eci-healthcare", "emp-outpatient"),
    proxy: true,
    why: `Physician assistant jobs have grown fast as practices and hospitals use them to extend physicians' time. ${CLINICAL_PAY}`,
  },
  "occ-29-2061": { series: S("eci-nursing", "emp-nursing"), proxy: true, why: LTC_PAY },
  "occ-31-1131": { series: S("eci-nursing", "emp-nursing"), proxy: true, why: LTC_PAY },
  "occ-31-1120": { series: S("emp-home-health", "eci-healthcare"), proxy: true, why: AIDE_PAY },
  "occ-29-1051": { series: S("eci-private"), proxy: true, why: PHARMACY_GROWTH },
  "occ-29-2052": { series: S("eci-private"), proxy: true, why: PHARMACY_GROWTH },
  "occ-29-1021": {
    series: S("eci-healthcare", "emp-healthcare"),
    proxy: true,
    why: `Dentists' pay grows with dental prices and with consolidation into larger dental service organizations. ${CLINICAL_PAY}`,
  },
  "occ-29-1292": {
    series: S("eci-healthcare", "emp-healthcare"),
    proxy: true,
    why: `Many hygienists left the field in 2020 and dental offices raised pay to bring them back. ${CLINICAL_PAY}`,
  },
  "occ-31-9091": { series: S("eci-healthcare", "emp-healthcare"), proxy: true, why: CLINICAL_PAY },
  "occ-29-1041": { series: S("eci-healthcare", "emp-healthcare"), proxy: true, why: CLINICAL_PAY },
  "occ-29-2081": { series: S("eci-healthcare", "emp-healthcare"), proxy: true, why: CLINICAL_PAY },
  "occ-29-1181": {
    series: S("eci-healthcare", "emp-healthcare"),
    proxy: true,
    why: `Hearing loss rises with age, so demand grows with the older population; over-the-counter hearing aids (from 2022) may take some routine fitting work. ${CLINICAL_PAY}`,
  },
  "occ-31-9092": {
    series: S("eci-healthcare", "emp-physician-offices"),
    proxy: true,
    why: `Medical assistant jobs grow with physician practices and with the paperwork and patient intake work that practices push to lower-paid staff. ${CLINICAL_PAY}`,
  },
  "occ-29-1123": {
    series: S("eci-healthcare", "emp-outpatient"),
    proxy: true,
    why: `Demand rises with an aging population and more joint replacements, but Medicare has cut physical therapy payment rates in most recent years, which holds pay down. ${CLINICAL_PAY}`,
  },
  "occ-31-2021": { series: S("eci-healthcare", "emp-outpatient"), proxy: true, why: CLINICAL_PAY },
  "occ-29-1122": { series: S("eci-healthcare", "emp-outpatient"), proxy: true, why: CLINICAL_PAY },
  "occ-29-1126": {
    series: S("eci-hospitals", "emp-hospitals"),
    proxy: true,
    why: NURSE_PAY.replace(
      "nurses left bedside jobs",
      "nurses and respiratory therapists left bedside jobs",
    ),
  },
  "occ-29-2034": {
    series: S("eci-healthcare", "emp-outpatient"),
    proxy: true,
    why: `Imaging volume keeps rising, much of it moving to freestanding imaging centers. ${CLINICAL_PAY}`,
  },
  "occ-29-2010": {
    series: S("eci-healthcare", "emp-healthcare"),
    proxy: true,
    why: `Lab work surged with COVID-19 testing in 2020–2022; labs now report shortages of trained technologists as older workers retire and few training programs remain. ${CLINICAL_PAY}`,
  },
  "occ-29-2055": { series: S("eci-hospitals", "emp-hospitals"), proxy: true, why: NURSE_PAY },
  "occ-29-2040": {
    series: S("eci-healthcare", "emp-healthcare"),
    proxy: true,
    why: `Ambulance services report severe staffing shortages because pay is low and the work is hard; many have raised wages since 2021, funded by local taxes and higher ambulance charges. ${CLINICAL_PAY}`,
  },
  "occ-19-3033": {
    series: S("eci-healthcare", "emp-outpatient"),
    proxy: true,
    why: `Demand for therapy rose sharply in the pandemic and has stayed high; telehealth widened psychologists' reach. ${CLINICAL_PAY}`,
  },
  "occ-21-1018": {
    series: S("eci-healthcare", "emp-outpatient"),
    proxy: true,
    why: `Counseling jobs grew fast with demand for mental health and addiction treatment, opioid settlement money, and Medicare coverage of counselors from 2024. ${CLINICAL_PAY}`,
  },
  "occ-21-1022": { series: S("eci-hospitals", "emp-hospitals"), proxy: true, why: CLINICAL_PAY },
  "occ-11-9111": { series: S("eci-healthcare", "emp-healthcare"), proxy: true, why: ADMIN_PAY },
  "occ-43-6013": { series: S("eci-healthcare", "emp-healthcare"), proxy: true, why: ADMIN_PAY },
  "occ-29-2072": { series: S("eci-healthcare", "emp-healthcare"), proxy: true, why: ADMIN_PAY },
  "occ-29-9021": { series: S("eci-healthcare", "emp-healthcare"), proxy: true, why: ADMIN_PAY },
  "occ-13-1031": {
    series: S("eci-private"),
    proxy: true,
    why: `Claims work grows with prior authorization and denials; insurers are automating more of it, and some have faced lawsuits over algorithms that deny claims in bulk. ${GENERAL_PAY}`,
  },
  "occ-43-9041": {
    series: S("eci-private"),
    proxy: true,
    why: `Routine claims processing is increasingly automated, which holds down these jobs even as claims volume grows. ${GENERAL_PAY}`,
  },

  // ------------------------------------------------ Industries
  "ind-621100": {
    series: S("emp-physician-offices", "eci-healthcare"),
    proxy: true,
    why: `Jobs in physician offices grow steadily, about ${rate("emp-physician-offices", 2014)} a year over ten years, with an aging population and the shift of care out of hospitals. More of these offices are now owned by hospitals, insurers, and private-equity firms.`,
  },
  "ind-621200": { series: S("eci-healthcare", "emp-healthcare"), proxy: true, why: CLINICAL_PAY },
  "ind-621300": {
    series: S("eci-healthcare", "emp-healthcare"),
    proxy: true,
    why: `Offices of therapists and counselors are among the fastest-growing parts of health care, led by mental health and physical therapy. ${CLINICAL_PAY}`,
  },
  "ind-621400": {
    series: S("emp-outpatient", "eci-healthcare"),
    proxy: true,
    why: `Outpatient care centers are where care has been moving: surgery, imaging, dialysis, urgent care, and addiction treatment shifted out of hospitals because it is cheaper and Medicare pays for it. Jobs ${yoy("emp-outpatient", 2024)} in 2024.`,
  },
  "ind-621500": {
    series: S("eci-healthcare", "emp-healthcare"),
    proxy: true,
    why: `Lab employment rose with COVID-19 testing in 2020–2022 and then fell back; underlying growth comes from more genetic and specialty testing. ${CLINICAL_PAY}`,
  },
  "ind-621600": {
    series: S("emp-home-health", "eci-healthcare"),
    proxy: true,
    why: `Home health jobs ${yoy("emp-home-health", 2024)} in 2024. ${AIDE_PAY}`,
  },
  "ind-621900": { series: S("eci-healthcare", "emp-healthcare"), proxy: true, why: CLINICAL_PAY },
  "ind-622000": {
    series: S("emp-hospitals", "eci-hospitals"),
    proxy: true,
    why: `Hospital jobs grew slowly for years (about ${rate("emp-hospitals", 2004, 2019)} a year from 2004 to 2019) as care moved to outpatient settings, then ${yoy2("emp-hospitals", 2023, 2024)} as hospitals rehired after the pandemic. ${NURSE_PAY}`,
  },
  "ind-623000": {
    series: S("emp-nursing", "eci-nursing"),
    proxy: true,
    why: `Jobs in nursing and residential care ${yoy("emp-nursing", 2021)} in 2021 and took until 2024 to recover. ${LTC_PAY}`,
  },
  "ind-456100": { series: S("eci-private"), proxy: true, why: PHARMACY_GROWTH },
  "ind-325400": {
    series: S("eci-private"),
    proxy: true,
    why: `Drug makers have announced large new U.S. plants since 2024, partly in response to tariff threats and supply-chain concerns, which may raise U.S. manufacturing employment. ${GENERAL_PAY}`,
  },
  "ind-339100": { series: S("eci-private"), proxy: true, why: GENERAL_PAY },
  "ind-524114": {
    series: S("eci-private"),
    proxy: true,
    why: `Insurer employment grows with Medicare Advantage and Medicaid managed-care enrollment and with prior-authorization and claims review work. ${GENERAL_PAY}`,
  },

  // ------------------------------------------------ Hospital cost structure
  "hosp-labor": {
    series: S("eci-hospitals", "emp-hospitals"),
    proxy: true,
    why: NURSE_PAY,
  },
  "hosp-supplies": {
    series: S("svc-hospital"),
    proxy: true,
    why: `Supply costs rose sharply in 2021–2022 with pandemic shortages and shipping costs, and keep rising with more expensive implants and devices.`,
  },
  "hosp-drugs": {
    series: S("svc-hospital"),
    proxy: true,
    why: `Hospital drug costs have grown faster than other hospital costs, driven by expensive cancer and specialty drugs given in hospital outpatient departments.`,
  },
  "hosp-other": {
    series: S("svc-hospital"),
    proxy: true,
    why: `Costs for IT, cybersecurity, insurance, and outside services have risen; ransomware attacks such as the 2024 Change Healthcare breach pushed hospitals to spend more on security.`,
  },

  // ------------------------------------------------ Drugs
  "pharma-rd": {
    series: S(),
    why: `Industry R&D spending has grown for decades: CBO found it rose from about an eighth of industry revenue in the 1980s to about a quarter by 2019. Trials have grown larger and longer, more drugs target rare diseases and cancer, and high U.S. prices make more projects worth pursuing.`,
  },
  "pharma-payroll": { series: S("eci-private"), proxy: true, why: GENERAL_PAY },
  "insulin-cost": {
    series: S(),
    why: `The cost of making insulin has not risen; what rose was list prices, which climbed for years as manufacturers paid bigger rebates to pharmacy benefit managers. List prices fell sharply in 2023–2024 after the American Rescue Plan removed the cap on Medicaid rebates (so high list prices became costly to manufacturers) and the Inflation Reduction Act capped Medicare copays.`,
  },
  "pbm-markups": {
    series: S(),
    why: `The FTC found that revenue above acquisition cost on the specialty generics it studied grew about ${show("pbmMarkupGrowth")} a year at pharmacies affiliated with the three largest PBMs from 2017 to 2021, as they steered more prescriptions to their own specialty and mail-order pharmacies.`,
  },
  "pharmacy-payroll": { series: S("eci-private"), proxy: true, why: PHARMACY_GROWTH },
  "device-payroll": { series: S("eci-private"), proxy: true, why: GENERAL_PAY },

  // ------------------------------------------------ Insurance
  "ins-private-net": {
    series: S("ins-private", "phi-total"),
    why: `Private insurers' overhead and profit grow with premiums, because the medical loss ratio rule caps them as a share of premiums, not in dollars. The net cost of private insurance grew ${show("netCostGrowth2023")} in 2023 (CMS) and ${yoy("ins-private", 2024)} in 2024. It jumped in 2020, when people put off care while premiums were already set.`,
  },
  "ins-ma-partd": {
    series: S("ins-medicare"),
    why: `This line has grown fastest of all insurance lines because enrollment in Medicare Advantage has grown every year since 2006 and now covers more than half of Medicare; the 2006 jump is the start of Part D plans. It ${yoy("ins-medicare", 2024)} in 2024 when plans paid more in claims than they expected, squeezing their margins.`,
  },
  "ins-mco": {
    series: S("ins-medicaid"),
    why: `Medicaid managed-care overhead grew with the ACA expansion (2014) and with pandemic enrollment, as states moved more enrollees and services into private plans. It ${yoy("ins-medicaid", 2024)} in 2024 as the "unwinding" removed millions of enrollees and plans' remaining members were sicker than expected.`,
  },
  "ins-earnings": {
    series: S("phi-total"),
    proxy: true,
    why: `Insurer earnings swing from year to year: they spiked in 2020 when people delayed care, then fell in 2023–2024 as use of care rose, especially in Medicare Advantage. Over time profits grow with premiums, and insurers' owned clinics, pharmacies, and data businesses add earnings outside the medical loss ratio cap.`,
  },
  "ins-brokers": {
    series: S("phi-total"),
    proxy: true,
    why: `Commissions are paid as a share of premiums or per enrollee, so they grow with premiums and enrollment; marketplace enrollment growth since 2021 added commissions, along with some fraudulent enrollments by brokers that CMS cracked down on in 2024.`,
  },
  "ins-premium-tax": {
    series: S("phi-total"),
    proxy: true,
    why: `Premium taxes are a share of fully insured premiums, so they grow with premiums; the shift of large employers to self-funded plans, which these taxes do not reach, slows them.`,
  },
  "ins-carrier-payroll": {
    series: S("eci-private"),
    proxy: true,
    why: `Insurer employment grows with Medicare Advantage and Medicaid managed-care enrollment and with prior-authorization and claims review work, while automation of routine claims holds it back. ${GENERAL_PAY}`,
  },
  "ins-idr": {
    series: S(),
    why: `Dispute volume has grown every year since the No Surprises Act took effect in 2022, far beyond what the government expected, as large provider groups (many backed by private equity) filed in bulk and won most cases, which encourages more filings.`,
  },

  // ------------------------------------------------ Administration, waste, liability, fraud
  "admin-total": {
    series: S("nhe-total"),
    proxy: true,
    why: `${SHARE_OF_SPENDING} Administrative work is also growing as prior authorization spreads and more care moves into Medicare Advantage and Medicaid plans with their own rules.`,
  },
  "admin-hospital-collection": {
    series: S("nhe-total"),
    proxy: true,
    why: `Hospitals report that denials and prior-authorization requests have risen in recent years, especially from Medicare Advantage plans. ${SHARE_OF_SPENDING}`,
  },
  "waste-admin": { series: S("nhe-total"), proxy: true, why: SHARE_OF_SPENDING },
  "waste-pricing": {
    series: S("nhe-total"),
    proxy: true,
    why: `${SHARE_OF_SPENDING} Continued hospital and physician consolidation keeps pushing prices up.`,
  },
  "waste-delivery": { series: S("nhe-total"), proxy: true, why: SHARE_OF_SPENDING },
  "waste-lowvalue": { series: S("nhe-total"), proxy: true, why: SHARE_OF_SPENDING },
  "waste-fraud": { series: S("nhe-total"), proxy: true, why: SHARE_OF_SPENDING },
  "waste-coordination": { series: S("nhe-total"), proxy: true, why: SHARE_OF_SPENDING },
  "liability-total": {
    series: S("nhe-total"),
    proxy: true,
    why: `This estimate is in 2008 dollars. Average surveyed malpractice premiums rose ${show("liabilityPremiumGrowth2024")} from 2023 to 2024 (AMA), and very large jury awards ("nuclear verdicts") have become more common since 2020. ${SHARE_OF_SPENDING}`,
  },
  "liability-defensive": {
    series: S("nhe-total"),
    proxy: true,
    why: `This estimate is in 2008 dollars. ${SHARE_OF_SPENDING}`,
  },
  "fraud-low": {
    series: S("nhe-total"),
    proxy: true,
    why: `Fraud estimates are a fixed share of spending, so they grow exactly as fast as national health spending. New schemes follow new benefits: telehealth, genetic testing, and hospice fraud grew after those benefits expanded.`,
  },
  "fraud-high": {
    series: S("nhe-total"),
    proxy: true,
    why: `Fraud estimates are a fixed share of spending, so they grow exactly as fast as national health spending. New schemes follow new benefits: telehealth, genetic testing, and hospice fraud grew after those benefits expanded.`,
  },
  "improper-medicare": {
    series: S("svc-hospital", "svc-physicianClinical"),
    proxy: true,
    why: `This is a fixed error rate applied to Medicare hospital and physician spending, so it grows with that spending. Medicare's measured error rate has fallen since its peak in the mid-2010s as documentation rules tightened.`,
  },

  // ------------------------------------------------ Training
  "med-debt": {
    series: S(),
    why: `Median debt among indebted graduates grew about ${show("medGradDebtGrowth2025")} from 2024 to 2025 (AAMC), tracking tuition. More schools now offer free tuition through large gifts, which has lowered the share of graduates with debt, but debt for those who borrow keeps rising. The 2025 budget law's borrowing caps will push more students to private loans.`,
  },
  "resident-salary": {
    series: S("eci-hospitals"),
    proxy: true,
    why: `Resident pay rose faster than usual after 2021 as residents unionized and hospitals raised stipends to keep up with inflation and housing costs.`,
  },
  "residency-slot-cost": {
    series: S("eci-hospitals"),
    proxy: true,
    why: `The cost of a residency position grows with resident pay, faculty time, and hospital overhead; Medicare's payments per resident are based on old hospital-specific costs updated for inflation, so hospitals cover more of the gap over time.`,
  },

  // ------------------------------------------------ Long-term & end-of-life care
  "hospice-medicare": {
    series: S(),
    why: `Medicare hospice spending grows as more people choose hospice at the end of life and as patients stay longer, particularly people with dementia. For-profit hospices, which now run most programs, have grown fastest; Medicare added extra scrutiny of new hospices in several states in 2023 after a wave of suspicious enrollments.`,
  },
  "aides-payroll": { series: S("emp-home-health", "eci-healthcare"), proxy: true, why: AIDE_PAY },
  "nursing-home-payroll": {
    series: S("emp-nursing", "eci-nursing"),
    proxy: true,
    why: LTC_PAY,
  },

  // ------------------------------------------------ Margins & executive pay
  "hospital-margin": {
    series: S("svc-hospital"),
    proxy: true,
    why: `Hospital margins collapsed in 2022 as labor and supply costs spiked, then recovered in 2023–2024 as volumes rose and contract-labor costs fell; large systems recovered far faster than rural and safety-net hospitals.`,
  },
  "ceo-pay": {
    series: S(),
    why: `Mean nonprofit hospital CEO pay rose about ${show("ceoPayGrowth")} after inflation from 2012 to 2019 (PLOS study), as boards benchmarked pay against ever-larger merged systems.`,
  },
  "physician-pay-gap": {
    series: S(),
    why: `The gap widened for decades as procedures were valued generously; Medicare's 2021 increase in office-visit payments narrowed it somewhat, but private-equity consolidation of specialties such as anesthesia and dermatology has pushed specialist rates up.`,
  },

  // ------------------------------------------------ Capital, research & public health
  "cap-structures": { series: S("svc-structures"), why: "" },
  "cap-research": { series: S("svc-research"), why: "" },
  "cap-publichealth": { series: S("svc-publicHealth"), why: PUBLIC_HEALTH_GROWTH },
}
COST_TRENDS["cap-structures"].why = COST_TRENDS["nhe-structures"].why
COST_TRENDS["cap-research"].why = COST_TRENDS["nhe-research"].why
