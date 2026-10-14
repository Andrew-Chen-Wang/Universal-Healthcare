/**
 * Paths for coverage and eligibility problems. The payer-structure paths
 * (single payer, regulated multi-payer, public option, ...) live under
 * "uninsured" because every other problem depends on which one is chosen.
 */
import { ENROLLMENT_2024 } from "../baseline"
import { show, v } from "../constants"
import { path } from "./types"

export const COVERAGE_PATHS = [
  // ---- uninsured: the payer-structure hub ----
  path({
    id: "single-payer",
    problemId: "uninsured",
    title: "Single public payer for everyone",
    summary:
      "One public program covers every resident automatically. Private insurance for covered services ends; providers stay mostly private and bill one payer at one set of rates.",
    precedents: [
      {
        place: "Taiwan",
        note: "National Health Insurance (1995) covers 99%+ of residents with one payer and a smart card; administrative cost is about 1% of spending (1.07% in 2014, per Brookings).",
        sourceIds: ["taiwan-nhi"],
      },
      {
        place: "Canada",
        note: "Provincial single payers for hospital and physician care; drugs, dental, and vision are largely outside the public plan.",
        sourceIds: ["cihi-nhex"],
      },
    ],
    how: {
      uninsured: {
        note: "Every resident is enrolled automatically from tax, Social Security, and immigration records, with nothing to sign up for or lose. Taiwan's single payer covers over 99% of residents.",
        sourceIds: ["taiwan-nhi"],
      },
      churn: { note: "Coverage no longer ends when income, job, family, or state changes." },
      "job-lock": { note: "Coverage no longer depends on having or keeping a job." },
      networks: {
        note: "Every provider bills the same payer, so there are no networks to be in or out of.",
      },
      "premium-burden": {
        note: "Premiums end. The money moves into taxes instead (see Replacing premiums with taxes).",
      },
      "surprise-bills": {
        note: "With one payer and one fee schedule, no provider is out of network, so there is no surprise bill.",
      },
      "insurer-overhead": {
        note: "Private insurers stop administering covered care, so their overhead and profit on it end. Taiwan's administrative cost is about 1% of spending.",
        sourceIds: ["taiwan-nhi"],
      },
      "admin-cost": {
        note: "Providers deal with one claims system and one set of rules instead of hundreds.",
      },
      denials: {
        note: "One public rulebook replaces each insurer's prior-authorization and denial rules. Denials still happen, but under one appeal system.",
      },
      "high-prices": {
        note: `One buyer sets rates for all care. Employer plans paid hospitals ${show("randHospitalMultiple")} what Medicare paid in 2022, and that gap is what one rate schedule closes.`,
        sourceIds: ["rand-hospital-2024"],
      },
      "transition-disruption": {
        note: `About ${ENROLLMENT_2024.employerSponsored} million people leave employer plans, and insurers lose their core business.`,
        sourceIds: ["cms-nhe-2024"],
      },
      "billing-jobs": {
        note: `Most insurer, broker, and billing work for covered care ends; ${show("blsHealthCarriers")} people work at health insurance carriers alone.`,
        sourceIds: ["bls-oews-2025"],
      },
      "wait-times": {
        note: "Care with no premiums or networks gets used more. Unless capacity grows too, waits get longer, and people seen fastest today notice most.",
        sourceIds: ["rand-hie"],
      },
      "x-plan-choice": {
        note: "There is no other insurer to switch to if the public plan is run poorly.",
      },
      "x-new-taxes": {
        note: `Taxes replace premiums and most out-of-pocket costs. In CBO's single-payer options, federal subsidies rise by $${v("cboSinglePayerFederalLow") / 1000} trillion to $${v("cboSinglePayerFederalHigh") / 1000} trillion in 2030.`,
        sourceIds: ["cbo-single-payer-2020"],
      },
      "x-central-rationing": {
        note: "One public body decides what is covered for everyone, so each 'no' applies nationwide.",
      },
      "x-state-control": {
        note: "A national program replaces state-run Medicaid and CHIP, along with the state choices built into them.",
      },
    },
    solves: [
      "churn",
      "job-lock",
      "networks",
      "premium-burden",
      "surprise-bills",
      "insurer-overhead",
      "admin-cost",
      "denials",
      "high-prices",
    ],
    worsens: ["transition-disruption", "billing-jobs", "wait-times"],
    spawns: ["x-plan-choice", "x-new-taxes", "x-central-rationing", "x-state-control"],
    conflicts: ["regulated-multipayer", "public-option", "mandate-subsidies"],
    complements: ["all-payer-rates", "global-budgets"],
    costIds: ["nhe-netCostOfInsurance", "admin-total", "ind-524114"],
    changes: [
      "Create a national health program (or expand Medicare) covering every resident, with automatic enrollment from tax, Social Security, and immigration records",
      "Prohibit private insurance from selling coverage that duplicates the public benefit",
      "Fold Medicare, Medicaid, CHIP, ACA marketplace subsidies, FEHB, and TRICARE civilian coverage into the program; decide whether the VA and IHS stay separate",
      "Replace employer premiums, employee premiums, and state Medicaid spending with dedicated taxes and maintenance-of-effort payments",
      "Build one national enrollment, eligibility, and claims-payment system with a member card",
      "Set one national fee schedule and/or hospital budgets, with regional adjustments",
      "Amend ERISA so employer self-insured health plans end for covered services",
      "Fund a worker transition program for insurer, broker, and billing staff",
    ],
  }),
  path({
    id: "regulated-multipayer",
    problemId: "uninsured",
    title: "Regulated multi-payer: everyone must have a non-profit or tightly regulated plan",
    summary:
      "Everyone is required to join one of several competing plans (sickness funds or private insurers) that must accept all applicants, cover a standard benefit, and pay providers mostly uniform rates.",
    precedents: [
      {
        place: "Germany",
        note: "About 93–94 statutory sickness funds (2025) plus private insurance for some high earners; payroll contributions split between employer and employee.",
        sourceIds: ["germany-gkv"],
      },
      {
        place: "Switzerland & Netherlands",
        note: "Mandatory private insurance with community rating, risk adjustment, and income-based subsidies.",
      },
    ],
    pros: [
      "Keeps choice of plan and competition on service",
      "Less disruption for people who like their insurer",
      "Proven to reach near-universal coverage",
    ],
    cons: [
      "Smaller admin savings than single payer (multiple insurers remain)",
      "Requires a mandate or auto-enrollment plus enforcement",
      "Needs strong risk adjustment to stop plans from avoiding sick people",
    ],
    whoGains: ["Uninsured people", "Insurers that adapt to non-profit or regulated rules"],
    whoLoses: ["Insurers' profit margins", "Plans that relied on selecting healthy members"],
    mend: ["Let existing insurers convert to regulated plans", "Income-based premium subsidies"],
    solves: ["churn", "job-lock", "networks", "surprise-bills"],
    spawns: ["x-new-taxes", "x-metric-gaming"],
    conflicts: ["single-payer"],
    complements: ["all-payer-rates", "auto-enrollment"],
    requires: ["auto-enrollment"],
    changes: [
      "Require every resident to hold a standard plan, with automatic default enrollment for non-choosers",
      "Require all plans to accept every applicant (guaranteed issue), charge community-rated or income-based premiums, and cover one standard benefit package",
      "Create a central risk-adjustment fund that redistributes money between plans by enrollee health",
      "Convert insurers to non-profit or capped-profit status for the standard benefit",
      "Standardize claims, codes, and prior-authorization rules across all plans",
      "Set uniform provider rates (all-payer) or require collective negotiation",
      "Fund income-based premium subsidies",
    ],
  }),
  path({
    id: "public-option",
    problemId: "uninsured",
    title: "Public option alongside private insurance",
    summary:
      "Anyone can buy into a public plan (Medicare-like) at a subsidized premium; employer and private plans continue. Uninsured people can be auto-enrolled.",
    precedents: [
      {
        place: "Washington State",
        note: "In January 2025, about 94,000 marketplace customers selected Cascade Select public option plans, up 50% from 2024.",
        sourceIds: ["public-option-washington-health-benefi-2025"],
      },
      {
        place: "Australia",
        note: "Medicare covers everyone; about half also buy private insurance for faster elective care.",
      },
    ],
    pros: [
      "Gradual: no one is forced off a plan they like",
      "Tests whether a public plan can compete",
      "Lower up-front tax increase",
    ],
    cons: [
      "Admin savings are small while many payers remain",
      "Coverage only universal if paired with auto-enrollment",
      "Risk the public plan attracts sicker people and becomes costly",
    ],
    whoGains: ["Uninsured and self-employed people"],
    whoLoses: ["Insurers in markets where the public plan is cheaper"],
    mend: ["Risk adjustment between public and private plans"],
    solves: ["job-lock"],
    spawns: ["two-tier"],
    conflicts: ["single-payer"],
    complements: ["auto-enrollment", "medicare-age-down"],
    changes: [
      "Create a public plan sold on every ACA marketplace and open to employers",
      "Set its provider rates (e.g., Medicare plus a percentage) and require Medicare-participating providers to accept it",
      "Fund start-up reserves and risk adjustment with private plans",
      "Auto-enroll the uninsured into the zero-premium version",
    ],
  }),
  path({
    id: "medicare-age-down",
    problemId: "uninsured",
    title: "Lower the Medicare age step by step (and enroll children at birth)",
    summary:
      "Expand Medicare from both ends: children at birth and the age threshold lowered in stages (65 → 60 → 55 ...) until everyone is covered.",
    precedents: [
      {
        place: "Canada (Saskatchewan → national)",
        note: "Hospital coverage (1947) came 15 years before physician coverage (1962) and spread province by province.",
      },
      {
        place: "Saskatchewan, Canada",
        note: "After Saskatchewan added public physician coverage in 1962, physician-care insurance coverage rose from 67% in 1960 to 99.9% by 1965.",
        sourceIds: ["medicare-age-down-journal-of-general-inter-2020"],
      },
    ],
    pros: [
      "Each step is a natural experiment that can be measured",
      "Uses an existing program and payment system",
      "Spreads disruption over many years",
    ],
    cons: [
      "Takes a decade or more to reach universality",
      "Covering older ages first is the most expensive per person",
      "Medicare's current gaps (no cap on costs, no dental) must be fixed",
    ],
    whoGains: ["Near-retirees and children first"],
    whoLoses: [
      "Insurers covering 55–64 year-olds",
      "Hospitals paid commercial rates for those patients",
    ],
    mend: ["Phase hospital rate changes with each age step"],
    complements: ["public-option", "single-payer"],
    spawns: ["x-new-taxes"],
    changes: [
      "Amend Medicare eligibility to cover all children from birth",
      "Lower the Medicare age in published steps (e.g., to 60, then 55, 50 ...) with a fixed schedule",
      "Add an out-of-pocket cap and missing benefits (dental, vision, hearing) to Medicare first",
      "Adjust the Medicare payroll tax and premiums at each step",
      "Coordinate employer plans as secondary payers until the final step",
    ],
  }),
  path({
    id: "auto-enrollment",
    problemId: "uninsured",
    title: "Automatic enrollment with free default coverage",
    summary:
      "Keep today's mix of coverage, but automatically enroll anyone without coverage into a zero-premium plan (Medicaid or a free marketplace plan) using tax and benefit data.",
    precedents: [
      {
        place: "Massachusetts",
        note: "2006 reform with subsidies and a mandate reached about 97% coverage.",
      },
      {
        place: "Netherlands",
        note: "In 2023, about 28,500 people remained uninsured in the Netherlands, which identifies uninsured residents and can collect insurance premiums from wages.",
        sourceIds: ["auto-enrollment-commonwealth-fund-2026"],
      },
    ],
    pros: [
      "Closes most of the coverage gap with little disruption",
      "Uses existing programs",
      "Cheapest path to near-universal coverage",
    ],
    cons: [
      "Keeps the cost, complexity, networks, and denials of the current system",
      "Default plans may have high cost sharing (underinsurance)",
      "Needs data matching that misses some people",
    ],
    whoGains: ["Uninsured people"],
    whoLoses: ["Taxpayers (new subsidies)"],
    mend: ["N/A"],
    complements: ["regulated-multipayer", "public-option"],
    worsens: ["underinsurance"],
    changes: [
      "Allow IRS, SSA, and state agencies to share data to identify uninsured residents",
      "Enroll uninsured people automatically in Medicaid or a zero-premium marketplace plan",
      "Fully fund zero-premium plans for everyone below a set income",
      "Allow retroactive coverage for anyone who arrives at a hospital uninsured",
    ],
  }),
  path({
    id: "mandate-subsidies",
    problemId: "uninsured",
    title: "Individual mandate with larger subsidies",
    summary:
      "Require everyone to buy coverage, with a penalty for not doing so, and raise ACA subsidies so it is affordable.",
    precedents: [
      {
        place: "U.S. ACA (2014–2018)",
        note: "The federal mandate penalty was set to $0 in 2019; coverage fell only slightly.",
      },
      {
        place: "United States",
        note: "The U.S. uninsured rate among people ages 0–64 rose from 10.4% in 2018 to 10.9% in 2019, when the federal mandate penalty ended.",
        sourceIds: ["mandate-subsidies-kff-2025"],
      },
    ],
    pros: ["Familiar structure", "Keeps private insurance intact"],
    cons: [
      "Penalties fall on lower-income people",
      "Weak mandates leave millions uninsured",
      "Keeps all current administrative costs",
    ],
    whoGains: ["Insurers (more customers)"],
    whoLoses: ["People who pay penalties"],
    mend: ["Exempt low-income people from penalties"],
    conflicts: ["single-payer"],
    changes: [
      "Restore an individual mandate penalty collected on tax returns",
      "Raise ACA premium subsidies permanently and extend them to all incomes with a cap as a percentage of income",
      "Exempt low-income households from penalties",
    ],
  }),

  // ---- churn ----
  path({
    id: "churn-continuous",
    problemId: "churn",
    title: "Continuous eligibility (12-month or multi-year) in Medicaid and CHIP",
    summary:
      "Once enrolled, people keep coverage for at least 12 months (or until age 6 for children) regardless of income changes.",
    precedents: [
      {
        place: "Oregon, Washington",
        note: "Multi-year continuous eligibility for young children under Medicaid waivers.",
      },
      {
        place: "Oregon",
        note: "By December 2024, 80.5% of Oregon Medicaid members completing renewal kept benefits; most adults then received two years of continuous eligibility.",
        sourceIds: ["churn-continuous-oregon-health-authority-2024"],
      },
    ],
    pros: ["Cheap and quick to implement", "Reduces paperwork for states and families"],
    cons: [
      "Doesn't fix churn between employer and individual coverage",
      "Some people stay covered after becoming ineligible",
    ],
    whoGains: ["Low-income families"],
    whoLoses: ["Budgets (slightly more enrollees)"],
    mend: ["N/A"],
    complements: ["auto-enrollment"],
    changes: [
      "Require 12-month continuous eligibility for adults in Medicaid and multi-year eligibility for children up to age 6",
      "Use automated renewals with tax and benefit data (ex parte renewals)",
    ],
  }),
  path({
    id: "churn-portable",
    problemId: "churn",
    title: "Coverage tied to residence, not job or income",
    summary:
      "Under single payer or a regulated multi-payer system, coverage never depends on employment or income, so life changes do not end coverage.",
    precedents: [
      { place: "Most OECD countries", note: "Coverage is based on residence or legal status." },
      {
        place: "Canada",
        note: "In 2023–2024, Canada's provinces and territories reciprocally billed about C$1 billion for insured hospital and physician care outside patients' home jurisdictions.",
        sourceIds: ["churn-portable-health-canada-2025"],
      },
    ],
    pros: [
      "Ends churn entirely: no re-enrollment, no gaps between jobs",
      "Removes Medicaid redetermination paperwork for states and families",
      "Continuity with the same doctors when life changes",
    ],
    cons: [
      "Only possible with one of the larger payer-structure changes",
      "Residence still has to be verified, which creates some paperwork",
    ],
    whoGains: [
      "People who change jobs, move, marry, divorce, or have income swings",
      "State Medicaid agencies (no redeterminations)",
    ],
    whoLoses: ["Eligibility vendors and enrollment brokers"],
    mend: ["Retrain eligibility caseworkers for residence verification and navigation"],
    requires: ["single-payer"],
    changes: [
      "Base eligibility only on residence",
      "Remove income and employment checks from enrollment",
    ],
  }),

  // ---- job lock ----
  path({
    id: "joblock-decouple",
    problemId: "job-lock",
    title: "Decouple coverage from employment",
    summary:
      "Replace employer-sponsored insurance with public or individually chosen coverage so leaving a job never ends coverage.",
    precedents: [
      { place: "Canada, UK, Taiwan", note: "Job changes never affect health coverage." },
      {
        place: "Canada",
        note: "Canada's public and primary voluntary health insurance covered 100% of the population in 2023, with public hospital and physician coverage based on residence.",
        sourceIds: ["joblock-decouple-oecd-2023"],
      },
    ],
    pros: ["Ends job lock", "More entrepreneurship and early retirement"],
    cons: ["Ends a benefit many workers value", "Employers lose a recruiting tool"],
    whoGains: ["Workers wanting to switch jobs or start businesses"],
    whoLoses: ["Benefits consultants and brokers"],
    mend: ["Require employers to pass premium savings into wages"],
    requires: ["single-payer"],
    spawns: ["x-wage-incidence"],
    changes: [
      "End the tax exclusion for employer health premiums (or make it irrelevant by ending employer plans for covered services)",
      "Require employers to report premium savings and pass them into wages for a transition period",
    ],
  }),
  path({
    id: "joblock-portable-esi",
    problemId: "job-lock",
    title: "Keep employer insurance but make it portable",
    summary:
      "Employers contribute to an individual plan the worker owns (an ICHRA-style account), so coverage moves with the person.",
    precedents: [
      {
        place: "U.S. ICHRA (2020)",
        note: "Employers may fund individual-market coverage tax-free.",
      },
      {
        place: "United States",
        note: "In 2025, 4% of U.S. firms offering health benefits and employing at least 10 workers funded individual-market insurance for some employees.",
        sourceIds: ["joblock-portable-esi-peterson-kff-health-syst-2025"],
      },
    ],
    pros: ["Keeps employer funding", "Little disruption"],
    cons: ["Individual market risk pools may be sicker", "Doesn't help people without jobs"],
    whoGains: [
      "Workers at small firms that can't run a group plan",
      "Workers who want to change jobs without changing doctors",
    ],
    whoLoses: ["Brokers who sell group plans"],
    mend: [
      "Strong individual-market rules (community rating, risk adjustment) so the pool stays healthy",
    ],
    complements: ["regulated-multipayer"],
    changes: [
      "Expand ICHRA so any employer can fund individual coverage tax-free",
      "Strengthen individual-market rules (risk adjustment, reinsurance)",
    ],
  }),

  // ---- underinsurance ----
  path({
    id: "underins-zero",
    problemId: "underinsurance",
    title: "No cost sharing at the point of care",
    summary: "Covered services are free when used: no deductibles, copays, or coinsurance.",
    precedents: [
      { place: "UK, Canada (hospital & physician care)", note: "No charges for covered services." },
      {
        place: "England",
        note: "In a November 2024 parliamentary answer, the government reported that about 89% of prescription items in England were dispensed free in the community.",
        sourceIds: ["underins-zero-uk-parliament-department-2024"],
      },
    ],
    pros: ["Ends underinsurance and most medical debt", "Removes billing at the point of care"],
    cons: [
      "Increases use of care (the RAND experiment found 30% more spending with free care)",
      "Higher taxes needed",
    ],
    whoGains: ["Chronically ill and low-income people"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    solves: ["medical-debt"],
    worsens: ["wait-times"],
    spawns: ["x-new-taxes"],
    conflicts: ["underins-income-cap"],
    changes: [
      "Set cost sharing to zero for all covered services by law",
      "Remove deductibles and coinsurance from claims systems",
      "Ban balance billing by participating providers",
    ],
  }),
  path({
    id: "underins-income-cap",
    problemId: "underinsurance",
    title: "Modest copays with an income-based annual cap",
    summary:
      "Keep small charges to discourage low-value use, but cap total out-of-pocket at a share of income and exempt the poor.",
    precedents: [
      {
        place: "Germany",
        note: "In 2018, 7.9% of Germany's statutory health insurance members exceeded the 1% income cap for chronic illness and became exempt from further copays.",
        sourceIds: ["underins-income-cap-european-observatory-on--2020"],
      },
      {
        place: "France",
        note: "Copays largely covered by supplemental insurance; exemptions for chronic disease.",
      },
    ],
    pros: ["Some cost control from patients", "Lower taxes than zero cost sharing"],
    cons: ["Copays still deter some needed care", "Requires billing and income verification"],
    whoGains: ["Taxpayers"],
    whoLoses: ["Lower-income people just above exemption limits"],
    mend: ["Automatic exemptions using tax data"],
    spawns: ["x-copay-billing"],
    conflicts: ["underins-zero"],
    changes: [
      "Set copay schedule by service",
      "Set annual out-of-pocket cap as a percentage of income using tax data",
      "Automatic exemptions for low-income people, children, and chronic illness",
    ],
  }),
  path({
    id: "underins-value-based",
    problemId: "underinsurance",
    title: "Value-based cost sharing",
    summary:
      "Free for high-value care (primary care, chronic-disease drugs, prevention); copays only for low-value services.",
    precedents: [
      {
        place: "U.S. employers & HSAs",
        note: "Some employers waive copays for chronic-disease drugs.",
      },
      {
        place: "United States",
        note: "A 2011 randomized trial found that removing copays for preventive drugs after a heart attack increased medication adherence by 4–6 percentage points.",
        sourceIds: ["underins-value-based-new-england-journal-of-m-2011"],
      },
    ],
    pros: [
      "Encourages needed care while discouraging waste",
      "Free chronic-disease drugs improve adherence and can lower hospital use",
    ],
    cons: [
      "Lists of 'high-value' and 'low-value' services are complex to define and keep updated",
      "Still needs claim-level billing and cost-sharing tracking",
      "Patients may not understand why some services are free and others aren't",
    ],
    whoGains: ["People with chronic conditions (free maintenance drugs and visits)"],
    whoLoses: ["Makers of products placed in the low-value tier"],
    mend: ["Publish the evidence for each tier and allow appeals"],
    complements: ["lowvalue-coverage-list"],
    spawns: ["x-copay-billing"],
    changes: [
      "Create and publish a list of high-value services exempt from cost sharing",
      "Assign an agency to update the list annually",
    ],
  }),

  // ---- networks ----
  path({
    id: "networks-any-provider",
    problemId: "networks",
    title: "Every licensed provider is in-network",
    summary:
      "Under one payer or all-payer rates, any licensed provider can see any patient at the standard rate.",
    precedents: [
      {
        place: "Traditional Medicare, Canada",
        note: "Nearly all physicians accept the public payer.",
      },
      {
        place: "United States",
        note: "As of November 2024, 1.2% of active non-pediatric physicians had formally opted out of Medicare.",
        sourceIds: ["networks-any-provider-kff-2025"],
      },
    ],
    pros: [
      "Ends network surprises and directory errors",
      "Free choice of doctor and hospital",
      "No credentialing with dozens of payers",
    ],
    cons: [
      "Removes a tool insurers use to steer patients to cheaper or higher-quality providers",
      "Weak providers keep patients they might lose under selective contracting",
    ],
    whoGains: ["Patients"],
    whoLoses: ["Insurers relying on narrow networks"],
    mend: ["N/A"],
    complements: ["all-payer-rates"],
    changes: [
      "Require the payer to pay any licensed, enrolled provider at the standard rate",
      "Create one national provider enrollment and credentialing system",
    ],
  }),
  path({
    id: "networks-adequacy",
    problemId: "networks",
    title: "Stronger network adequacy rules and audited directories",
    summary:
      "Keep networks but set strict distance and wait standards, with fines for 'ghost' directory listings.",
    precedents: [
      {
        place: "U.S. secret-shopper audits",
        note: "Audits found many listed providers unavailable.",
        sourceIds: ["secret-shopper"],
      },
    ],
    pros: [
      "Little disruption",
      "Keeps the savings narrow networks produce (premiums often 10–20% lower)",
    ],
    cons: [
      "Hard to enforce; regulators rely on insurer-reported data",
      "Keeps network complexity and out-of-network risk",
    ],
    whoGains: ["Patients in plans with narrow networks"],
    whoLoses: ["Insurers (compliance costs)"],
    mend: ["N/A"],
    changes: [
      "Set national time-and-distance and wait-time standards for networks",
      "Require monthly directory audits with fines for ghost listings",
      "Pay out-of-network care at in-network cost sharing when standards are missed",
    ],
  }),

  // ---- immigrants ----
  path({
    id: "immigrants-all-residents",
    problemId: "immigrant-coverage",
    title: "Cover all residents regardless of immigration status",
    summary:
      "Eligibility is based on residence (e.g., proof of living in the U.S. for a set period), not status.",
    precedents: [
      {
        place: "California",
        note: "In 2025, California's Legislative Analyst estimated that 1.7 million undocumented Medi-Cal enrollees had comprehensive coverage.",
        sourceIds: ["immigrants-all-residents-california-legislative-a-2025"],
      },
      {
        place: "Spain, Thailand",
        note: "Coverage for undocumented residents in many circumstances.",
      },
    ],
    pros: [
      "Ends emergency-only care and uncompensated hospital costs",
      "Better public health (infectious disease, prenatal care)",
    ],
    cons: ["Higher cost", "Political and migration concerns"],
    whoGains: ["Immigrant families", "Hospitals with uncompensated care"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    spawns: ["x-migration-concern"],
    conflicts: ["immigrants-lawful-only"],
    changes: [
      "Define eligibility by residence, with proof via lease, utility, school, or employment documents",
      "Separate health enrollment data from immigration enforcement by law",
      "Fund outreach in multiple languages",
    ],
  }),
  path({
    id: "immigrants-lawful-only",
    problemId: "immigrant-coverage",
    title: "Cover lawful residents; keep emergency care for others",
    summary:
      "Citizens and lawfully present residents are covered; undocumented people keep emergency Medicaid and community health centers.",
    precedents: [
      {
        place: "Most European countries",
        note: "Undocumented migrants usually limited to emergency or basic care.",
      },
      {
        place: "United States",
        note: "Emergency Medicaid spending was $3.8 billion in fiscal 2023, or 0.4% of total Medicaid spending, for people ineligible for full coverage because of immigration status.",
        sourceIds: ["immigrants-lawful-only-kff-2025"],
      },
    ],
    pros: ["Lower cost", "Fewer migration concerns"],
    cons: [
      "Keeps uncompensated emergency care",
      "Mixed-status families remain confused about eligibility",
    ],
    whoGains: ["Taxpayers"],
    whoLoses: ["Undocumented immigrants", "Safety-net hospitals"],
    mend: ["Fund community health centers to serve everyone"],
    conflicts: ["immigrants-all-residents"],
    changes: [
      "Define eligibility by citizenship or lawful presence",
      "Keep emergency Medicaid for others",
      "Fund community health centers to serve all residents",
    ],
  }),
  path({
    id: "territories-full",
    problemId: "territories",
    title: "Cover the territories in the national program on the same terms as the states",
    summary:
      "Residents of Puerto Rico and the other territories are enrolled in the national program like everyone else, with the same benefits, payment rules, and federal funding.",
    precedents: [
      {
        place: "Puerto Rico (GAO estimate)",
        note: "GAO estimated federal Medicaid spending in Puerto Rico would have been $1.1–2.1 billion as a state in 2011, versus $685 million actually spent.",
        sourceIds: ["gao-14-31"],
      },
      {
        place: "Hawaii and Alaska",
        note: "Non-contiguous states receive open-ended federal Medicaid funding under the same formula as other states.",
        sourceIds: ["crs-territories-medicaid"],
      },
    ],
    pros: [
      "Ends the funding cliffs and the gap between territory and mainland coverage",
      "Same benefits for every U.S. citizen regardless of where they live",
      "Raises payment to territory clinicians, which may slow their move to the mainland",
    ],
    cons: [
      "Higher federal cost: GAO's estimate implies about 1.6 to 3 times current federal Medicaid spending in Puerto Rico",
      "National payment rates may not fit island cost structures without adjustments",
      "Territories lose some control over how their programs run",
    ],
    whoGains: [
      "Territory residents",
      "Territory hospitals and clinicians",
      "Territory governments",
    ],
    whoLoses: ["Federal taxpayers (higher spending)"],
    mend: [
      "Set geographic payment adjustments for island costs",
      "Let territory governments administer enrollment under national rules, as states do",
    ],
    complements: ["single-payer", "state-administer"],
    conflicts: ["territories-capped-increase"],
    changes: [
      "Define program residency to include all five territories",
      "Remove the territories' Medicaid caps and fixed matching rates from federal law",
      "Make Medicare Part B enrollment automatic in Puerto Rico",
      "Set geographic payment adjustments for the territories",
    ],
  }),
  path({
    id: "territories-medicaid-parity",
    problemId: "territories",
    title: "Give the territories state-like Medicaid funding but keep separate programs",
    summary:
      "Remove the caps and apply the regular state matching formula, while each territory keeps running its own Medicaid program and eligibility rules.",
    precedents: [
      {
        place: "U.S. territories (ACA)",
        note: "The ACA gave the five territories $7.3 billion in extra Medicaid and CHIP funding through at least FY2019, a temporary version of this approach.",
        sourceIds: ["gao-16-324"],
      },
    ],
    pros: [
      "Ends the recurring funding cliffs",
      "Lets territories keep programs designed for local conditions",
      "Smaller change than full inclusion",
    ],
    cons: [
      "Coverage still depends on territory Medicaid eligibility, not universal enrollment",
      "Medicare differences (such as Part B enrollment) remain unless fixed separately",
    ],
    whoGains: ["Low-income territory residents", "Territory governments"],
    whoLoses: ["Federal taxpayers (higher spending)"],
    mend: ["Fix Medicare Part B enrollment and Medicare Savings Programs separately"],
    conflicts: ["territories-capped-increase"],
    changes: [
      "Remove the Medicaid caps for the territories",
      "Apply the state matching-rate formula to the territories",
      "Require territories to meet state Medicaid eligibility standards",
    ],
  }),
  path({
    id: "territories-capped-increase",
    problemId: "territories",
    title: "Keep capped funding but raise it and index it to costs",
    summary:
      "Keep annual caps, but set them higher and grow them with health costs so funding stops depending on temporary laws.",
    precedents: [
      {
        place: "Puerto Rico (2023 law)",
        note: "The Consolidated Appropriations Act, 2023 set Puerto Rico's federal match at 76% through FY2027 with a capped allotment of about $3.6 billion for FY2026.",
        sourceIds: ["kff-territories-medicaid"],
      },
    ],
    pros: ["Predictable federal cost", "Ends cliffs if indexing is permanent"],
    cons: [
      "Territory residents stay covered on different terms from states",
      "Caps can fall behind real costs again after disasters or epidemics",
    ],
    whoGains: ["Federal budget planners"],
    whoLoses: ["Territory residents, who keep lower funding per person"],
    mend: ["Add an automatic disaster adjustment to the caps"],
    conflicts: ["territories-full", "territories-medicaid-parity"],
    changes: ["Set new permanent cap levels in law", "Index the caps to medical inflation"],
  }),
]
