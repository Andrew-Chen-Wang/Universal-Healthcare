/**
 * What made a cost series jump, drop, or change speed: laws, benefits added or cut,
 * court rulings, payment changes, recessions, and emergencies. Each event names the
 * yearly series it moved (cost-trend-data.ts); the /costs pages mark it on that
 * series' chart and list it under the chart with the series' change that year.
 *
 * The list comes from scanning every series for years whose growth stood far
 * outside its neighbors and for lasting changes in its five-year growth rate, then
 * finding the documented cause. Years with no documented cause are left out rather
 * than guessed. Text never states figures; the page computes them from the data.
 */
import { TREND_LAST_YEAR, TREND_SERIES, type TrendSeriesId } from "./cost-trend-data"
import { SOURCE_BY_ID } from "./sources"

export type CostEvent = {
  /** First year the event moved the series. */
  year: number
  /** Last year of a multi-year episode. */
  endYear?: number
  title: string
  text: string
  series: TrendSeriesId[]
  sourceIds?: string[]
}

const E = (
  year: number,
  title: string,
  text: string,
  series: TrendSeriesId[],
  opts: { endYear?: number; sourceIds?: string[] } = {},
): CostEvent => ({ year, title, text, series, ...opts })

export const COST_EVENTS: CostEvent[] = [
  // ---------------------------------------------------------------- 1960s–1970s
  E(
    1961,
    "NIH budget boom",
    "Congress raised NIH's budget sharply every year from the late 1950s to the mid-1960s, led by Senator Lister Hill and Representative John Fogarty; growth slowed after 1966 as Vietnam War spending squeezed the budget.",
    ["svc-research"],
    { endYear: 1966 },
  ),
  E(
    1966,
    "Medicare and Medicaid begin",
    "Medicaid started in 1966 and Medicare in July 1966, paying hospitals their costs and paying doctors their customary fees. Hospital and nursing home spending sped up at once, and Medicaid began paying for dental care in many states; spending through private insurance slowed because Medicare took over the over-65s' bills.",
    ["nhe-total", "svc-hospital", "svc-nursing", "svc-dental", "phi-total", "ins-medicaid"],
    { endYear: 1968, sourceIds: ["cms-nhe-2024"] },
  ),
  E(
    1968,
    "Medicare pays for capital: a building boom",
    "From 1966 Medicare reimbursed hospitals' capital costs (depreciation and interest) on top of their operating costs, and Hill-Burton grants continued; hospital construction and equipment spending took off from 1968 into the early 1970s.",
    ["svc-structures"],
    { endYear: 1972 },
  ),
  E(
    1969,
    "Medicare tightens extended care and home health",
    "After nursing home and home health use far exceeded forecasts, Medicare issued stricter guidelines on what counted as covered skilled care and its claims processors applied them, so payments to extended-care facilities fell and home health spending stalled for several years.",
    ["svc-nursing", "svc-homeHealth"],
    { endYear: 1972, sourceIds: ["gao-ecf-1971"] },
  ),
  E(
    1971,
    "National Cancer Act: the war on cancer",
    "The National Cancer Act of 1971 gave the National Cancer Institute its own budget authority and a fast-rising appropriation, lifting research spending through the mid-1970s.",
    ["svc-research"],
    { endYear: 1975 },
  ),
  E(
    1971,
    "Wage and price controls",
    "The Economic Stabilization Program capped health care price and revenue increases from November 1971 to April 1974, and hospital spending grew more slowly while controls lasted.",
    ["nhe-total", "svc-hospital"],
    { endYear: 1973, sourceIds: ["hcfr-esp-1994"] },
  ),
  E(
    1974,
    "Controls end: prices catch up",
    "When controls ended in April 1974, hospital and physician prices rose quickly to catch up, and insurers raised premiums sharply in 1976–1977 after paying more in claims than they had priced for.",
    [
      "nhe-total",
      "svc-hospital",
      "svc-physicianClinical",
      "phi-total",
      "ins-private",
      "svc-netCostOfInsurance",
    ],
    { endYear: 1977, sourceIds: ["hcfr-esp-1994"] },
  ),
  E(
    1973,
    "Medicare covers disability and kidney failure; home health takes off",
    "The 1972 Social Security Amendments extended Medicare to people on disability and people with kidney failure from July 1973, and Medicaid had been required to cover home health since 1970. Home health spending then grew rapidly from 1974 to 1983.",
    ["svc-homeHealth"],
    { endYear: 1983, sourceIds: ["crs-home-health-rl31628"] },
  ),
  E(
    1974,
    "Health planning law slows building",
    "The National Health Planning and Resources Development Act of 1974 required states to approve major hospital construction and equipment purchases (certificate of need), and the building boom of the late 1960s slowed.",
    ["svc-structures"],
    { endYear: 1977 },
  ),

  // ---------------------------------------------------------------- 1980s
  E(
    1981,
    "Public health block grants and cuts",
    "OBRA 1981 folded federal public health programs into block grants with less money, and state and local health departments slowed spending through the 1980s.",
    ["svc-publicHealth"],
    { endYear: 1986 },
  ),
  E(
    1982,
    "Medicaid managed care begins",
    "OBRA 1981 let states require Medicaid enrollees to join managed-care plans, and in October 1982 Arizona launched AHCCCS, the first statewide Medicaid managed-care program, which made plan overhead a new line of Medicaid spending.",
    ["ins-medicaid"],
    { endYear: 1984, sourceIds: ["ahcccs-history"] },
  ),
  E(
    1983,
    "Medicare pays hospitals a fixed price per diagnosis",
    "The Social Security Amendments of 1983 replaced cost-based hospital payment with a fixed amount per diagnosis (DRGs), phased in from October 1983. Hospital spending growth roughly halved, national spending slowed, and hospitals cut back on building.",
    ["nhe-total", "svc-hospital", "svc-structures", "phi-total"],
    { endYear: 1987 },
  ),
  E(
    1984,
    "Physician fee freeze; surgery moves to outpatient centers",
    "The Deficit Reduction Act of 1984 froze Medicare physician fees from July 1984, but spending kept rising as more surgery and diagnostic tests were done in outpatient facilities, which Medicare had begun paying in 1982.",
    ["svc-physicianClinical"],
    { endYear: 1986, sourceIds: ["healthaffairs-fee-freeze-1989"] },
  ),
  E(
    1982,
    "Medicare HMO contracts",
    "After early demonstration projects, TEFRA (1982) created Medicare risk contracts, in force from 1985, that pay an HMO a fixed monthly amount per enrollee; plan overhead grew from almost nothing to a steady line by the late 1980s.",
    ["ins-medicare"],
    { endYear: 1987 },
  ),
  E(
    1986,
    "Medicare denies more home health claims",
    "Medicare's contractors applied its home health eligibility rules more strictly and denied many more claims, and home health spending nearly stopped growing.",
    ["svc-homeHealth"],
    { endYear: 1987, sourceIds: ["crs-home-health-rl31628"] },
  ),
  E(
    1988,
    "Duggan v. Bowen loosens home health rules",
    "A class action (Duggan v. Bowen) forced Medicare to loosen its home health coverage rules from 1988–1989, and home health spending grew by double digits nearly every year until 1997.",
    ["svc-homeHealth"],
    { endYear: 1996, sourceIds: ["crs-home-health-rl31628"] },
  ),
  E(
    1988,
    "Part B premium jumps",
    "The standard Part B premium rose by more than a third in 1988 as physician spending grew, and rose again in 1989 with a catastrophic-coverage add-on.",
    ["pay-hhSmi"],
    { sourceIds: ["gao-part-b-1988"] },
  ),
  E(
    1988,
    "Insurers' underwriting losses, then catch-up premiums",
    "Health insurance runs in a cycle of roughly six years: insurers underprice to win business, take losses, then raise premiums faster than claims to restore margins. Losses in the mid-1980s were followed by fast premium increases and rising overhead from 1988.",
    ["ins-private", "svc-netCostOfInsurance"],
    { endYear: 1992 },
  ),
  E(
    1989,
    "Catastrophic Coverage Act: buy-ins and a short-lived nursing home benefit",
    "The Medicare Catastrophic Coverage Act of 1988 required Medicaid to pay Medicare premiums for low-income enrollees (the QMB program, from 1989) and expanded Medicare's skilled nursing benefit in 1989. Congress repealed most of the law in December 1989, but the buy-in survived and nursing home spending had already jumped.",
    ["pay-fedBuyIn", "pay-slBuyIn", "svc-nursing"],
    { endYear: 1990, sourceIds: ["crs-mcca-snf-rs20386"] },
  ),
  E(
    1989,
    "States move Medicaid into managed care",
    "Using 1915(b) and 1115 waivers, states moved Medicaid enrollees into managed-care plans through the 1990s, from under a tenth of enrollees in 1991 to about half by 1998, so plan overhead grew far faster than Medicaid itself.",
    ["ins-medicaid"],
    { endYear: 1994 },
  ),
  E(
    1990,
    "Medicaid DSH and provider-tax boom",
    "States used hospital donations and provider taxes to fund their share of Medicaid disproportionate share hospital (DSH) payments and drew matching federal money; federal DSH payments rose more than tenfold from 1990 to 1992, on top of mandatory coverage expansions for pregnant women and children. Laws in 1991 and 1993 banned donations, capped provider taxes and DSH, and federal Medicaid growth fell sharply.",
    ["pay-fedMedicaid", "pay-slMedicaid"],
    { endYear: 1994, sourceIds: ["crs-dsh-97-483"] },
  ),

  // ---------------------------------------------------------------- 1990s
  E(
    1992,
    "Medicare fee schedule and the managed-care era",
    "Medicare's resource-based fee schedule took effect in 1992, and employers moved workers into HMOs and PPOs that negotiated lower prices. Employer premium growth fell from double digits around 1990 to almost nothing by 1996, and national spending growth roughly halved.",
    [
      "nhe-total",
      "svc-hospital",
      "svc-physicianClinical",
      "phi-total",
      "pay-bizEsi",
      "pay-hhEsi",
      "pay-slEsi",
      "pay-fedEsi",
    ],
    { endYear: 1998, sourceIds: ["bostonfed-premiums"] },
  ),
  E(
    1993,
    "Federal workforce cut",
    "The federal civilian workforce shrank through the 1990s (the 'reinventing government' downsizing), so the federal employer's Medicare payroll tax barely grew.",
    ["pay-fedHi"],
    { endYear: 1999 },
  ),
  E(
    1994,
    "Medicare payroll tax cap removed",
    "OBRA 1993 applied the Medicare payroll tax to all wages from 1994 instead of only wages up to a cap, so the tax on employers and workers jumped that year.",
    ["pay-bizHi", "pay-hhHi"],
  ),
  E(
    1994,
    "Insurers' margins squeezed by managed-care price wars",
    "In the mid-1990s insurers competed hard on price to win employers moving to managed care, holding premiums close to claims, so the net cost of private insurance stopped growing.",
    ["ins-private", "svc-netCostOfInsurance"],
    { endYear: 1998 },
  ),
  E(
    1994,
    "Workers' compensation reforms",
    "States reformed workers' compensation in the early 1990s with medical fee schedules and managed care, and workplace injury rates kept falling, so employers' workers' comp medical costs flattened.",
    ["pay-bizOther"],
    { endYear: 1998 },
  ),
  E(
    1996,
    "Drug boom: new blockbusters and TV advertising",
    "A wave of new best-selling drugs (cholesterol, antidepressant, and stomach-acid drugs), wider drug coverage in managed-care plans, and FDA's 1997 loosening of rules for TV ads drove drug spending growth into double digits until 2003.",
    ["svc-prescriptionDrugs"],
    { endYear: 2003, sourceIds: ["crs-dtc-rl32853"] },
  ),
  E(
    1997,
    "Balanced Budget Act: home health collapse and Medicare+Choice cuts",
    "The 1997 Balanced Budget Act's interim payment system for home health (from October 1997) halved Medicare home health spending from 1996 to 1999 and closed many agencies. The same law slowed payments to Medicare HMOs, and many plans left the program.",
    ["svc-homeHealth", "emp-home-health", "ins-medicare"],
    { endYear: 2000, sourceIds: ["aspe-home-health-1996-1999"] },
  ),
  E(
    1998,
    "CHIP and VA eligibility reform",
    "The Veterans' Health Care Eligibility Reform Act of 1996 opened VA care to more veterans, and CHIP (created in 1997) began covering children from 1998, so federal programs grew faster.",
    ["pay-fedPrograms"],
    { endYear: 2003 },
  ),
  E(
    1998,
    "NIH budget doubled",
    "Congress doubled NIH's budget over five years, from 1998 to 2003, then held it nearly flat.",
    ["svc-research"],
    { endYear: 2003 },
  ),

  // ---------------------------------------------------------------- 2000s
  E(
    2000,
    "Stock market falls cut investment income",
    "This line includes hospitals' and other providers' investment income, which fell with the stock market after the dot-com crash.",
    ["pay-otherPrivate"],
    { endYear: 2002 },
  ),
  E(
    2001,
    "Managed-care backlash: premiums surge",
    "After a backlash against HMO restrictions, employers moved to looser networks and state laws limited managed-care tactics; premium growth returned to double digits from 2001 to about 2004, and insurers' margins peaked in 2002 as premiums outpaced claims.",
    [
      "phi-total",
      "pay-bizEsi",
      "pay-hhEsi",
      "pay-slEsi",
      "pay-fedEsi",
      "ins-private",
      "svc-netCostOfInsurance",
    ],
    { endYear: 2004, sourceIds: ["bostonfed-premiums", "hcfr-underwriting-2002"] },
  ),
  E(
    2001,
    "Part B premium nearly doubles",
    "The standard Part B premium rose from 2001 to 2006 at the fastest pace in its history as Part B spending grew, raising what enrollees and Medicaid buy-in programs pay.",
    ["pay-hhSmi", "pay-fedBuyIn", "pay-slBuyIn"],
    { endYear: 2006 },
  ),
  E(
    2002,
    "Bioterrorism preparedness after 9/11 and the anthrax attacks",
    "Congress multiplied federal preparedness grants to state and local health departments roughly twentyfold in 2002.",
    ["pay-fedPublicHealth"],
    { sourceIds: ["gao-bioterrorism-2004"] },
  ),
  E(
    2004,
    "Medicare Modernization Act raises private-plan payments",
    "The 2003 law raised payments to Medicare private plans (renamed Medicare Advantage) by about a tenth in 2004, and enrollment and plan overhead grew quickly until 2009.",
    ["ins-medicare"],
    { endYear: 2009, sourceIds: ["commonwealth-ma-2004"] },
  ),
  E(
    2004,
    "Drug spending slows: generics and safety withdrawals",
    "Patents on major drugs expired and cheaper generics took their place, few new blockbusters arrived, and safety withdrawals such as Vioxx (2004) cooled prescribing; drug spending growth slowed and was nearly flat in 2010 and 2012 as Lipitor, Plavix, and other best-sellers went generic.",
    ["svc-prescriptionDrugs"],
    { endYear: 2013 },
  ),
  E(
    2006,
    "Medicare Part D begins",
    "Medicare's drug benefit started in January 2006. Medicare's private-plan overhead roughly doubled, enrollees began paying Part D premiums, general revenue for Medicare jumped, employers began receiving the retiree drug subsidy, and states began paying Medicare back for dual eligibles' drugs (the 'clawback,' counted in state programs) while their own Medicaid drug spending fell.",
    [
      "ins-medicare",
      "pay-hhSmi",
      "pay-fedMedicare",
      "pay-fedRds",
      "pay-slPrograms",
      "pay-slMedicaid",
    ],
    { sourceIds: ["cms-nhe-2024"] },
  ),
  E(
    2008,
    "Great Recession",
    "Job losses cut payroll taxes and job-based coverage, injuries at work fell with employment, hospitals put building projects on hold, and families cut back on care they pay for themselves, such as dental; providers' investment income fell with the stock market.",
    [
      "pay-bizHi",
      "pay-hhHi",
      "pay-bizOther",
      "pay-hhEsi",
      "svc-structures",
      "svc-dental",
      "pay-otherPrivate",
    ],
    { endYear: 2011 },
  ),
  E(
    2009,
    "Recovery Act raises the federal Medicaid match",
    "The American Recovery and Reinvestment Act raised the federal share of Medicaid costs from late 2008 through mid-2011 to help states in the recession, shifting cost from states (including their share of Medicare buy-ins) to Washington.",
    ["pay-fedMedicaid", "pay-slMedicaid", "pay-slBuyIn"],
    { endYear: 2010 },
  ),
  E(
    2011,
    "Extra federal Medicaid match ends",
    "The Recovery Act's higher federal match ended in mid-2011, and states' share of Medicaid and of Medicare buy-ins jumped back.",
    ["pay-slMedicaid", "pay-slBuyIn"],
  ),
  E(
    2009,
    "H1N1 pandemic funding",
    "Emergency funding for the 2009 H1N1 flu pandemic and Recovery Act prevention money lifted federal public health spending in 2009–2010.",
    ["pay-fedPublicHealth"],
    { endYear: 2010 },
  ),
  E(
    2011,
    "Emergency public health money runs out",
    "With H1N1 and Recovery Act funds spent and state budgets still cut back after the recession, public health spending fell in 2011.",
    ["pay-fedPublicHealth", "svc-publicHealth"],
  ),
  E(
    2010,
    "Recovery Act research money",
    "The American Recovery and Reinvestment Act gave NIH a one-time sum worth about a third of its yearly budget to spend in 2009–2010.",
    ["svc-research"],
    { sourceIds: ["nih-arra-2009"] },
  ),
  E(
    2011,
    "Budget caps and the sequester",
    "When the Recovery Act money ran out, the Budget Control Act's spending caps (2011) and the 2013 sequester held NIH's budget down, and research spending fell or stalled for several years.",
    ["svc-research"],
    { endYear: 2015 },
  ),
  E(
    2012,
    "Temporary recession programs end",
    "Federal programs here included COBRA premium subsidies for laid-off workers (2009–2011) and the ACA's Early Retiree Reinsurance Program (2010–2011); when both ended, federal program spending dipped in 2012.",
    ["pay-fedPrograms"],
    { sourceIds: ["cms-nhe-2024"] },
  ),
  E(
    2010,
    "ACA cuts Medicare Advantage benchmarks",
    "The ACA phased down payments to Medicare Advantage plans from 2011, closer to the cost of traditional Medicare, and plan overhead grew slowly until about 2015 even as enrollment kept rising.",
    ["ins-medicare"],
    { endYear: 2015, sourceIds: ["jama-ma-benchmarks-2023"] },
  ),
  E(
    2011,
    "FEHB premiums rise; adult children stay on until 26",
    "FEHB premiums rose faster in 2011 than in the years around it, the first plan year in which the ACA let adult children stay on a parent's plan until 26.",
    ["pay-fedEsi"],
    { sourceIds: ["opm-fehb-2011"] },
  ),
  E(
    2010,
    "Part B 'hold harmless' shifts the increase to Medicaid",
    "Social Security paid no cost-of-living raise for 2010 and 2011, so most enrollees were shielded from Part B premium increases; the full higher premium fell on new enrollees and on Medicaid, which pays the standard premium for its buy-in enrollees.",
    ["pay-fedBuyIn", "pay-slBuyIn"],
    { sourceIds: ["kff-part-b-2012"] },
  ),
  E(
    2012,
    "Part B premium falls",
    "The standard Part B premium fell in 2012 after two years of hold-harmless increases, lowering what Medicaid paid for buy-ins.",
    ["pay-fedBuyIn"],
    { sourceIds: ["kff-part-b-2012"] },
  ),
  E(
    2013,
    "Retiree drug subsidy loses its tax break",
    "From 2013 the ACA ended the tax deduction for the subsidized part of employers' retiree drug costs, and most employers moved retirees into Part D plans instead.",
    ["pay-fedRds"],
  ),

  // ---------------------------------------------------------------- 2014 onward
  E(
    2014,
    "ACA coverage expansion",
    "The marketplaces opened with premium tax credits, Medicaid expanded to low-income adults in participating states (mostly through managed-care plans), and insurers began paying the ACA's health insurer fee.",
    ["pay-hhDirect", "pay-fedMarketplace", "ins-medicaid", "ins-private", "pay-fedMedicaid"],
    { endYear: 2015 },
  ),
  E(
    2014,
    "Hepatitis C cures",
    "Sovaldi and Harvoni, priced at tens of thousands of dollars per course, launched in 2014; with ACA coverage, drug spending growth jumped after several flat years.",
    ["svc-prescriptionDrugs"],
    { endYear: 2015 },
  ),
  E(
    2015,
    "Medicare Advantage grows again",
    "Medicare Advantage enrollment grew every year as plans added extra benefits, funded partly by quality bonuses and by coding more diagnoses, and plan overhead grew faster from 2015.",
    ["ins-medicare"],
    { endYear: 2019 },
  ),
  E(
    2016,
    "NIH budget grows again",
    "After years of flat budgets, Congress raised NIH's appropriation every year from 2016, and the 21st Century Cures Act (2016) added dedicated funding.",
    ["svc-research"],
    { endYear: 2023 },
  ),
  E(
    2017,
    "Tax credits absorb premium spikes",
    "Marketplace premiums rose sharply in 2017–2018 (partly from 'silver loading' after cost-sharing reduction payments stopped), but tax credits rise with premiums, so households' share stayed flat.",
    ["pay-hhDirect"],
    { endYear: 2019 },
  ),
  E(
    2020,
    "COVID-19 pandemic",
    "Federal emergency money poured in: the Provider Relief Fund and Paycheck Protection Program loans to providers (counted in other federal programs), testing and vaccines (public health), and a higher federal Medicaid match in exchange for keeping everyone enrolled. Meanwhile people put off care, so payments for dental, equipment, and out-of-pocket care fell, insurers' claims dropped while premiums held, and health care lost jobs.",
    [
      "nhe-total",
      "svc-publicHealth",
      "pay-fedPublicHealth",
      "pay-fedOther",
      "pay-fedMedicaid",
      "svc-netCostOfInsurance",
      "ins-medicaid",
      "emp-healthcare",
      "emp-home-health",
      "pay-bizEsi",
      "pay-hhOop",
      "pay-bizOther",
      "pay-slBuyIn",
      "svc-dental",
    ],
    { sourceIds: ["cms-nhe-covid-accounting"] },
  ),
  E(
    2021,
    "Delayed care returns",
    "Patients came back for dental work, equipment, therapy, and mental health care put off in 2020, so those lines grew far faster than usual; nursing homes, which lost residents and staff, shrank; insurers' net cost fell as claims rebounded; and building projects paused in 2020 resumed.",
    [
      "svc-dental",
      "svc-durableEquipment",
      "svc-otherNonDurable",
      "svc-otherProfessional",
      "svc-nursing",
      "ins-private",
      "svc-structures",
    ],
  ),
  E(
    2021,
    "American Rescue Plan subsidies",
    "The American Rescue Plan (2021) enlarged marketplace tax credits and extended them to higher incomes, and the Inflation Reduction Act kept them through 2025; enrollment roughly doubled and federal subsidy spending rose fastest in 2024.",
    ["pay-fedMarketplace"],
    { endYear: 2024 },
  ),
  E(
    2022,
    "Stock market fall",
    "Stocks and bonds both fell in 2022, cutting providers' investment income.",
    ["pay-otherPrivate"],
  ),
  E(
    2022,
    "Aduhelm and the Part B premium",
    "The 2022 Part B premium rose sharply, partly to cover the Alzheimer's drug Aduhelm, which Medicare then largely declined to cover.",
    ["pay-hhSmi"],
  ),
  E(
    2023,
    "GLP-1 drugs",
    "Spending on Ozempic, Wegovy, Mounjaro and similar drugs for diabetes and obesity exploded; Medicare Part D spending on ten diabetes drugs more than quadrupled from 2019 to 2023.",
    ["svc-prescriptionDrugs", "pay-fedMedicare"],
    { endYear: 2024, sourceIds: ["oig-diabetes-drugs-2025"] },
  ),
  E(
    2023,
    "Hospitals rebound",
    "Patients returned for procedures delayed in the pandemic, and hospitals passed on the wage increases of 2021–2023; hospital spending grew faster in 2023 than in any year since 1990.",
    ["svc-hospital", "emp-hospitals"],
    { endYear: 2024 },
  ),
  E(
    2023,
    "Medicaid unwinding",
    "The pandemic coverage guarantee ended in 2023 and states rechecked every enrollee; millions lost coverage, the extra federal match phased out over 2023, so the state share jumped in 2024 while the federal share barely grew, managed-care overhead fell, and state administrative costs rose.",
    ["pay-slMedicaid", "pay-fedMedicaid", "ins-medicaid", "svc-governmentAdministration"],
    { endYear: 2024 },
  ),
]

for (const e of COST_EVENTS) {
  const where = `cost-events.ts: "${e.title}"`
  if (e.endYear !== undefined && e.endYear < e.year)
    throw new Error(`${where}: endYear before year`)
  if (e.year > TREND_LAST_YEAR) throw new Error(`${where}: year after the data ends`)
  for (const sid of e.sourceIds ?? [])
    if (!SOURCE_BY_ID[sid]) throw new Error(`${where}: unknown source ${sid}`)
  for (const sid of e.series)
    if ((e.endYear ?? e.year) < TREND_SERIES[sid].firstYear)
      throw new Error(`${where}: ${sid} starts after the event`)
}
