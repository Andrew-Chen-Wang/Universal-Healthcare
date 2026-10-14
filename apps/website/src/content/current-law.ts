/**
 * What happens to each problem under current law if nothing changes: the
 * trend, with sources. Shown on the problem's page and on its "Keep current
 * law" path (see paths/keep.ts). Problems missing here have no credible
 * current-law projection or recent national trend that we could find.
 */
import { show, v } from "./constants"
import type { Reading } from "./problems"

export const CURRENT_LAW: Record<string, Reading> = {
  uninsured: {
    text: `Under current law the uninsured share grows. CMS's actuaries project direct-purchase enrollment falls by ${show("directPurchaseDrop2026")} million in 2026 as enhanced marketplace subsidies expire, and Medicaid enrollment falls as the 2025 law's work requirements start. The insured share falls from ${show("insuredShare2024")} in 2024 to ${show("insuredShare2028")} in 2028 and is still ${show("insuredShare2034")} in 2034.`,
    sourceIds: ["cms-nhe-proj-2025"],
  },
  "high-prices": {
    text: `Under current law spending keeps growing faster than the economy. CMS's actuaries project national health spending growing ${show("nheGrowth2025to2034")} a year over 2025–2034 against ${show("gdpGrowth2025to2034")} for GDP, reaching $${v("nhe2034") / 1000} trillion in 2034, or ${show("healthGdpShare2034")} of GDP, up from ${show("healthGdpShare2024")} in 2024.`,
    sourceIds: ["cms-nhe-proj-2025"],
  },
  "drug-prices": {
    text: `Under current law, retail prescription drug spending is projected to grow fastest of the major categories: ${show("drugSpendGrowth2025to2034")} a year over 2025–2034. Medicare's existing drug-price negotiation continues for the drugs it covers.`,
    sourceIds: ["cms-nhe-proj-2025"],
  },
  churn: {
    text: `Under current law churn rises: from January 2027, adults covered by the Medicaid expansion must renew their eligibility every ${show("medicaidRenewalMonths2027")} months instead of once a year, and each renewal is a chance to lose coverage over paperwork.`,
    sourceIds: ["kff-medicaid-renewals-2026"],
  },
  underinsurance: {
    text: `Deductibles keep spreading: the share of covered workers in employer plans with a general annual deductible for single coverage rose from ${show("deductibleShare2014")} in 2014 to ${show("deductibleShare2024")} in 2024.`,
    sourceIds: ["kff-ehbs-2024"],
  },
  networks: {
    text: `Narrow networks are holding steady rather than spreading: ${show("narrowNetworkFirms2025")} of firms with at least ten workers that offer benefits offered a narrow-network plan in 2025, against ${show("narrowNetworkFirms2024")} in 2024.`,
    sourceIds: ["kff-ehbs-2025"],
  },
  "immigrant-coverage": {
    text: `Under current law the gap widens: CBO estimates the eligibility restrictions enacted in 2025 could cause ${show("immigrantsLosingCoverage2034")} million lawfully present immigrants to lose coverage by 2034.`,
    sourceIds: ["kff-uninsured-immigrants-2026"],
  },
  territories: {
    text: `Under current law Puerto Rico's federal Medicaid matching rate returns to ${show("puertoRicoFmap2028")} in fiscal 2028, and its yearly federal allotment falls when temporary funding expires.`,
    sourceIds: ["kff-territories-medicaid"],
  },
  "medical-debt": {
    text: `Medical debt is disappearing from credit reports, though not necessarily from people's lives: after the credit bureaus changed their reporting rules, the share of consumers with a credit record who had medical collections fell from about ${show("medicalCollections2022")} in March 2022 to about ${show("medicalCollections2023")} in June 2023.`,
    sourceIds: ["cfpb-medical-collections-2024"],
  },
  "premium-burden": {
    text: `Premiums keep climbing: the average family premium for employer coverage reached ${show("familyPremium2025")} in 2025 at firms with at least ten workers, ${show("familyPremiumGrowth2025")} more than in 2024, counting both the employer's and the worker's share.`,
    sourceIds: ["kff-ehbs-2025"],
  },
  "price-opacity": {
    text: `Under current rules hospitals post more prices: compliance rose from ${show("hospitalPriceCompliance2021")} in early 2021 to ${show("hospitalPriceCompliance2022")} in late 2022. GAO found in 2024 that CMS still can't tell whether the posted prices are complete or accurate.`,
    sourceIds: ["opacity-disclosure-u-s-government-accountab-2024"],
  },
  "surprise-bills": {
    text: `Patients are protected, but the arbitration fights between insurers and providers keep growing: disputes filed under the No Surprises Act rose from ${show("idrDisputes2024H1")} in the first half of 2024 to ${show("idrDisputes2024H2")} in the second half.`,
    sourceIds: ["cms-idr-2024"],
  },
  denials: {
    text: `Denials are not falling: HealthCare.gov insurers denied ${show("marketplaceDenialRate2024")} of in-network claims in 2024, about the same rate as in 2023.`,
    sourceIds: ["kff-marketplace-denials-2024"],
  },
  "prior-auth": {
    text: `Prior-authorization denials are rising: Medicare Advantage insurers denied all or part of ${show("maPriorAuthDenied2024")} of requests in 2024, up from ${show("maPriorAuthDenied2023")} in 2023.`,
    sourceIds: ["kff-ma-prior-auth-2024"],
  },
  "ma-upcoding": {
    text: `Under current rules the overpayment shrinks but doesn't end: MedPAC estimates Medicare paid Advantage plans ${show("maExcess2023")} more than traditional Medicare would have spent in 2023, falling to ${show("maExcess2026")} in 2026 once a new risk-coding model is fully in place.`,
    sourceIds: ["medpac-2026"],
  },
  "insurer-overhead": {
    text: `Insurer overhead is growing faster than the care it pays for: the net cost of private health insurance rose ${show("netCostGrowth2023")} in 2023 and took ${show("netCostShare2023")} of private insurance spending.`,
    sourceIds: ["cms-nhe-2023-health-affairs"],
  },
  pbm: {
    text: `PBM markups have been growing fast: for the specialty generic drugs the FTC studied, revenue above acquisition cost at pharmacies tied to the three largest PBMs grew ${show("pbmMarkupGrowth")} a year from 2017 to 2021.`,
    sourceIds: ["ftc-pbm-interim-2025"],
  },
  consolidation: {
    text: `Consolidation keeps growing: at least ${show("physiciansHospitalOwned2024")} of physicians were part of hospital systems in 2024, against less than ${show("physiciansHospitalOwned2012")} in 2012.`,
    sourceIds: ["gao-consolidation-2025"],
  },
  "private-equity": {
    text: `Private equity keeps buying: across ten specialties, the number of physician practice sites it had acquired rose from ${show("pePracticeSites2012")} in 2012 to ${show("pePracticeSites2021")} in 2021.`,
    sourceIds: ["health-affairs-pe-2024"],
  },
  "facility-fees": {
    text: `Under current rules the gap narrows slowly: in 2026 Medicare extended site-neutral payment to drug administration at some off-campus hospital departments, which CMS estimates cuts outpatient spending by $${v("siteNeutralSavings2026") * 1000} million. Commercial insurers are not covered.`,
    sourceIds: ["cms-opps-2026"],
  },
  "executive-pay": {
    text: `Executive pay keeps rising: mean nonprofit hospital CEO pay grew ${show("ceoPayGrowth")} after inflation between 2012 and 2019.`,
    sourceIds: ["plos-ceo-pay-2024"],
  },
  shortages: {
    text: `New shortages are becoming rarer: FDA recorded ${show("newShortages2023")} new drug shortages in 2023, ${show("newShortages2024")} in 2024, and ${show("newShortages2025")} in 2025.`,
    sourceIds: ["fda-shortages-2025"],
  },
  "pharmacy-deserts": {
    text: `Pharmacies keep closing: closures outnumbered openings from 2018 to 2021, and ${show("pharmaciesClosed2021")} of retail pharmacies that operated during 2010–2020 had closed by 2021.`,
    sourceIds: ["health-affairs-pharmacy-2024"],
  },
  "rural-hospitals": {
    text: `Rural closures continue: ${show("ruralHospitalsClosed")} hospitals in rural counties closed or stopped providing inpatient care between 2005 and 2023.`,
    sourceIds: ["usda-rural-hospitals-2025"],
  },
  "maternity-deserts": {
    text: `Labor and delivery units keep closing: ${show("obUnitsLost")} U.S. hospitals stopped providing obstetric care between 2010 and 2022.`,
    sourceIds: ["jama-obstetric-units-2024"],
  },
  "shortage-areas": {
    text: `Under current trends shortages deepen: HRSA projects the country will be short ${show("primaryCareShortage2038")} full-time primary care physicians in 2038.`,
    sourceIds: ["hrsa-projections-2025"],
  },
  "physician-shortage": {
    text: `Under current trends the shortage grows: HRSA projects the country will be short ${show("physicianShortage2038")} full-time physicians in 2038.`,
    sourceIds: ["hrsa-workforce-2025"],
  },
  "training-debt": {
    text: `Debt keeps rising: median education debt among U.S. MD graduates who borrowed reached ${show("medGradDebt2025")} in 2025, about ${show("medGradDebtGrowth2025")} more than in 2024.`,
    sourceIds: ["aamc-gq-2025"],
  },
  "nursing-shortage": {
    text: `Under current trends the shortage persists: HRSA projects the country will still be short ${show("rnShortage2038")} full-time registered nurses in 2038.`,
    sourceIds: ["hrsa-nursing-2025"],
  },
  "burnout-admin": {
    text: `Burnout is easing from its pandemic peak but remains common: physicians reporting at least one symptom fell from ${show("physicianBurnout2021")} in 2021 to ${show("physicianBurnout2023")} in 2023.`,
    sourceIds: ["mayo-burnout-2025"],
  },
  outcomes: {
    text: `Life expectancy is recovering but still trails peer countries: it rose ${show("lifeExpectancyGain2024")} in 2024 to ${show("lifeExpectancy2024")}.`,
    sourceIds: ["nchs-mortality-2024"],
  },
  "maternal-mortality": {
    text: `Little is changing: maternal deaths went from ${show("maternalDeaths2023")} in 2023 to ${show("maternalDeaths2024")} in 2024, a change in the rate that was not statistically significant.`,
    sourceIds: ["nchs-maternal-2024"],
  },
  safety: {
    text: `Hospital infections are slowly falling: most infection measures in acute care hospitals improved in 2024, including a ${show("clabsiDrop2024")} drop for central line bloodstream infections.`,
    sourceIds: ["cdc-hai-2024"],
  },
  disparities: {
    text: `Under current trends the geographic gap widens: HRSA projects that in 2038 rural (nonmetro) areas will be short physicians equal to ${show("nonmetroPhysicianShortage2038")} of demand, against ${show("metroPhysicianShortage2038")} in metro areas.`,
    sourceIds: ["hrsa-projections-2025"],
  },
  malpractice: {
    text: `Liability premiums are edging up: average surveyed premiums rose ${show("liabilityPremiumGrowth2024")} from 2023 to 2024, and the AMA expects a harder market.`,
    sourceIds: ["ama-liability-2025"],
  },
  "admin-cost": {
    text: `Rules already on the books trim it at the edges: CMS estimates its 2024 interoperability and prior-authorization rule saves about ${show("interopRuleSavings")} over ten years, small next to the yearly total.`,
    sourceIds: ["cms-interop-pa-rule-2024"],
  },
  "billing-jobs": {
    text: `Under current law these jobs keep growing: BLS projects employment of medical records specialists, who do much of the medical coding, grows ${show("recordsJobsGrowth")} from 2025 to 2035.`,
    sourceIds: ["bls-ooh-records-2026"],
  },
  fraud: {
    text: `Improper payments are falling slowly: Medicare fee-for-service's improper payment rate fell from ${show("medicareImproper2024")} in fiscal 2024 to ${show("medicareImproper2025")} in fiscal 2025. Improper payments include errors, not only fraud.`,
    sourceIds: ["cms-improper-payments-2025"],
  },
  "mental-health-access": {
    text: `Under current trends access gets harder: HRSA projects the country will be short ${show("psychiatristShortage2038")} full-time psychiatrists in 2038.`,
    sourceIds: ["hrsa-projections-2025"],
  },
  addiction: {
    text: `Overdose deaths are falling sharply but remain high: the age-adjusted death rate fell from ${show("overdoseRate2023")} to ${show("overdoseRate2024")} per 100,000 people from 2023 to 2024.`,
    sourceIds: ["nchs-overdose-2024"],
  },
  "ltc-spend-down": {
    text: `Waiting lists for home care keep growing: more than ${show("hcbsWaitlist2025")} people were on Medicaid home and community-based services waiting or interest lists in 2025, up ${show("hcbsWaitlistGrowth2025")} from 2024.`,
    sourceIds: ["kff-hcbs-waiting-2025"],
  },
  "nursing-home-quality": {
    text: `Staffing is thinner than a decade ago: average nursing care fell from ${show("nursingHours2015")} hours per resident per day in July 2015 to ${show("nursingHours2025")} in July 2025, despite some recovery since 2022.`,
    sourceIds: ["kff-nursing-facilities-2025"],
  },
  "hospice-for-profit": {
    text: `Hospice spending keeps growing fast: Medicare hospice spending rose ${show("hospiceSpendGrowth2023")} from 2022 to 2023.`,
    sourceIds: ["medpac-hospice-2025"],
  },
  "dental-gap": {
    text: `Dental coverage is spreading among older adults: the share of Medicare recipients without dental insurance fell from ${show("medicareNoDental2021")} in 2021 to ${show("medicareNoDental2024")} in 2024. Traditional Medicare still doesn't cover routine dental care.`,
    sourceIds: ["carequest-oop-2025"],
  },
  "prevention-underfunded": {
    text: `Public health spending fell back after the pandemic and stayed flat: ${show("publicHealthSpend2022")} in 2022, ${show("publicHealthSpend2023")} in 2023, and ${show("publicHealthSpend2024")} in 2024, before inflation.`,
    sourceIds: ["cms-covid-nhe-2026"],
  },
  "social-needs": {
    text: `Little is changing: ${show("foodInsecurity2024")} of households were food insecure in 2024, statistically unchanged from 2022 and 2023.`,
    sourceIds: ["usda-food-security-2024"],
  },
  interoperability: {
    text: `Records are slowly getting better at moving: the share of hospitals that send, receive, find, and use outside records at least sometimes rose from ${show("hospitalInterop2018")} in 2018 to ${show("hospitalInterop2023")} in 2023.`,
    sourceIds: ["onc-interop-2023"],
  },
  cybersecurity: {
    text: `Attacks are rising: reports of large health data breaches grew ${show("largeBreachGrowth")} from 2018 to 2023, mostly from hacking and ransomware.`,
    sourceIds: ["hhs-hipaa-security-nprm-2024"],
  },
  privacy: {
    text: `Reported breaches keep growing: breaches affecting fewer than 500 people rose ${show("smallBreachGrowth")} from 2020 to 2024. Most health apps and data brokers remain outside HIPAA.`,
    sourceIds: ["hhs-breach-report-2024"],
  },
}
