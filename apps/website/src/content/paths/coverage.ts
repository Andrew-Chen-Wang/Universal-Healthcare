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
      "One public program covers every resident automatically. Providers stay mostly private and bill one payer at one set of rates. Whether private insurance may still sell coverage for the same care is a separate choice: Australia and the UK allow it, Canada mostly bans it (see Two-tier care).",
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
        note: "The public plan pays every covered claim, so insurers no longer administer the core benefit, and their overhead and profit on it end. Taiwan's administrative cost is about 1% of spending. If duplicate private insurance is allowed, people who buy it pay that insurer's overhead on top.",
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
        note: `About ${ENROLLMENT_2024.employerSponsored} million people leave employer plans as their main coverage, and insurers lose their core business. What is left for them depends on whether private insurance may duplicate the public plan or only sell extras.`,
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
        note: "There is no other public plan to switch to if it is run poorly. Private cover on top, where it is allowed, costs extra.",
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
      "two-tier": {
        note: "Once one public plan covers everyone, it has to be decided whether private insurance may still sell coverage for the same care. Allowing it keeps today's insurers and gives a faster private lane for those who pay; banning it keeps clinicians in the public system.",
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
    spawns: ["x-plan-choice", "x-new-taxes", "x-central-rationing", "x-state-control", "two-tier"],
    conflicts: ["regulated-multipayer", "public-option", "mandate-subsidies"],
    complements: ["all-payer-rates", "global-budgets"],
    costIds: ["nhe-netCostOfInsurance", "admin-total", "ind-524114"],
    changes: [
      "Create a national health program (or expand Medicare) covering every resident, with automatic enrollment from tax, Social Security, and immigration records",
      "Fold Medicare, Medicaid, CHIP, ACA marketplace subsidies, FEHB, and TRICARE civilian coverage into the program; decide whether the VA and IHS stay separate",
      "Replace employer premiums, employee premiums, and state Medicaid spending with dedicated taxes and maintenance-of-effort payments",
      "Build one national enrollment, eligibility, and claims-payment system with a member card",
      "Set one national fee schedule and/or hospital budgets, with regional adjustments",
      "Amend ERISA so employer plans are no longer people's primary coverage for services the public plan covers",
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
    how: {
      uninsured: {
        note: "Requiring enrollment in competing plans that accept all applicants and cover standard benefits has reached near-universal coverage. It preserves plan choice and competition on service, with less disruption for people who like their insurer.",
      },
      churn: {
        note: "Mandatory enrollment in plans that accept all applicants provides a continuing route to standard coverage.",
      },
      "job-lock": {
        note: "Mandatory plans accepting all applicants provide coverage beyond reliance on a particular employer.",
      },
      networks: {
        note: "Standard benefits and mostly uniform provider rates reduce differences between competing plans.",
      },
      "surprise-bills": {
        note: "Mostly uniform provider payments reduce differences in the rates charged across plans.",
      },
      "x-new-taxes": {
        note: "The cited sickness-fund model finances coverage through payroll contributions shared by employers and employees.",
      },
      "x-metric-gaming": {
        note: "Plans may avoid sick people unless risk adjustment counters that incentive.",
      },
      "x-plan-choice": {
        note: "Competing regulated plans retain insurer choice and competition on service.",
      },
      "transition-disruption": {
        note: "Allowing competing insurers to remain reduces disruption for people who like their current insurer.",
      },
      "admin-cost": {
        note: "Multiple insurers remain, so administrative savings are smaller than under a single payer.",
      },
      "t-enforcement-burden": {
        note: "Mandatory enrollment or automatic enrollment requires enforcement.",
      },
      "t-uneven-risk-pools": {
        note: "Competing plans need strong risk adjustment to prevent avoidance of sick people.",
      },
    },
    mend: ["Let existing insurers convert to regulated plans", "Income-based premium subsidies"],
    worsens: ["t-enforcement-burden", "t-uneven-risk-pools"],
    solves: [
      "churn",
      "job-lock",
      "networks",
      "surprise-bills",
      "x-plan-choice",
      "transition-disruption",
      "admin-cost",
    ],
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
    how: {
      uninsured: {
        note: "A subsidized public plan gives uninsured people another coverage option while employer and private plans continue. This gradual approach lets people keep plans they like, tests public-plan competition, and requires a smaller initial tax increase.",
      },
      "job-lock": {
        note: "A public plan available to anyone offers coverage outside employer insurance.",
      },
      "two-tier": {
        note: "Public coverage alongside private insurance can preserve faster elective access for people buying private coverage, as in the cited Australian example.",
      },
      "transition-disruption": {
        note: "Keeping employer and private plans lets people retain coverage they like during a gradual expansion.",
      },
      "x-new-taxes": {
        note: "Keeping existing coverage alongside a public option limits the initial tax increase.",
      },
      "admin-cost": { note: "Keeping many payers limits administrative savings." },
      "t-dependent-reforms": {
        note: "Universal coverage through the public option depends on automatic enrollment.",
      },
      "t-uneven-risk-pools": {
        note: "The public plan may attract sicker people, making its coverage more costly.",
      },
    },
    mend: ["Risk adjustment between public and private plans"],
    worsens: ["t-dependent-reforms", "t-uneven-risk-pools"],
    solves: ["job-lock", "transition-disruption", "x-new-taxes", "admin-cost"],
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
    how: {
      uninsured: {
        note: "Enrolling children at birth and lowering the Medicare eligibility age in stages extends coverage through an existing program and payment system. Each stage can be measured as a natural experiment while disruption is spread over many years.",
        helps: ["changing-lives"],
      },
      "x-new-taxes": {
        note: "Expanding Medicare enrollment brings more people into the existing public program, with older entrants costing more per person.",
      },
      "transition-disruption": {
        note: "Expanding an existing program in stages spreads disruption over many years.",
      },
      "t-delayed-benefits": {
        note: "Staged age expansion takes many years to reach universal coverage.",
        hurts: ["high-price-providers", "insurers"],
      },
      "t-higher-spending": {
        note: "Covering older people first raises spending because their coverage costs the most per person.",
      },
      "t-limited-reach": {
        note: "Expanding current Medicare carries forward the lack of a cost cap and dental coverage unless those gaps are fixed.",
      },
    },
    mend: ["Phase hospital rate changes with each age step"],
    worsens: ["t-delayed-benefits", "t-higher-spending", "t-limited-reach"],
    solves: ["transition-disruption"],
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
    how: {
      uninsured: {
        note: "Using tax and benefit data to enroll uninsured people in free existing plans closes most coverage gaps with little disruption and at the lowest cost among the described routes to near-universal coverage. Data matching can still miss people.",
      },
      "t-limited-reach": {
        note: "Free-premium default plans may still have high cost sharing. Automatic enrollment preserves the existing system's costs, complexity, networks, and denials.",
      },
    },
    complements: ["regulated-multipayer", "public-option"],
    worsens: ["t-limited-reach"],
    changes: [
      "Allow IRS, SSA, and state agencies to share data to identify uninsured residents",
      "Enroll uninsured people automatically in Medicaid or a zero-premium marketplace plan",
      "Fully fund zero-premium plans for everyone below a set income",
      "Allow retroactive coverage for anyone who arrives at a hospital uninsured",
    ],
  }),
  path({
    id: "employer-mandate-50",
    problemId: "uninsured",
    title: `Keep the employer mandate for firms with ${show("employerMandateThreshold")}+ workers`,
    summary: `Employers with ${show("employerMandateThreshold")} or more full-time workers must keep offering coverage that meets the standard benefit, as under the ACA. Their workers keep their plans, doctors, and payment rates; everyone else is enrolled in the regulated plans.`,
    precedents: [
      {
        place: "U.S. ACA (since 2015)",
        note: `Employers with an average of at least ${show("employerMandateThreshold")} full-time workers owe a payment if they don't offer affordable coverage and a worker gets a premium tax credit.`,
        sourceIds: ["irs-employer-mandate"],
      },
      {
        place: "Germany",
        note: "Employers pay half of their workers' sickness-fund contributions; people above an income threshold can choose private insurance instead.",
      },
    ],
    how: {
      uninsured: {
        note: "Keeps the largest source of coverage in place, so the new plans only have to cover people without it.",
        helps: ["employer-covered"],
      },
      "transition-disruption": {
        note: "Most people with job-based coverage see no change in their plan or their doctors.",
        helps: ["employer-covered"],
      },
      "admin-cost": { note: "Keeps thousands of employer plans and their billing rules." },
      "t-reduced-flexibility": {
        note: "Employers near 50 workers face a cost cliff, as they do today.",
        hurts: ["employers"],
      },
    },
    solves: ["transition-disruption"],
    worsens: ["admin-cost", "t-reduced-flexibility"],
    complements: ["regulated-multipayer", "auto-enrollment", "joblock-portable-esi"],
    conflicts: ["single-payer"],
    changes: [
      `Keep the employer shared-responsibility requirement (IRC §4980H) for employers with ${show("employerMandateThreshold")}+ full-time workers`,
      "Require employer plans to cover at least the standard benefit",
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
    how: {
      uninsured: {
        note: "Requiring coverage and increasing affordability subsidies uses a familiar structure while keeping private insurance intact. Weak mandates still leave many people uninsured.",
      },
      "t-imperfect-targeting": {
        note: "Mandate penalties fall on lower-income people.",
        hurts: ["uninsured"],
      },
      "t-limited-reach": {
        note: "Retaining private insurance preserves current administrative costs.",
      },
    },
    mend: ["Exempt low-income people from penalties"],
    worsens: ["t-imperfect-targeting", "t-limited-reach"],
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
    how: {
      churn: {
        note: "Keeping Medicaid and CHIP coverage through income changes reduces paperwork for states and families and is inexpensive and quick to implement. It does not prevent gaps between employer and individual coverage.",
        helps: ["low-middle-income"],
      },
      "admin-cost": {
        note: "Continuous eligibility reduces enrollment paperwork for states and families.",
      },
      "t-imperfect-targeting": {
        note: "Continuous eligibility can keep people covered after they become ineligible.",
      },
    },
    worsens: ["t-imperfect-targeting"],
    solves: ["admin-cost"],
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
    how: {
      churn: {
        note: "Residence-based coverage removes re-enrollment, gaps between jobs, and Medicaid income redetermination paperwork for states and families. Life changes no longer end coverage or interrupt continuity with the same doctors.",
        helps: ["states"],
      },
      "admin-cost": {
        note: "Residence-based coverage removes Medicaid redetermination paperwork for states and families.",
      },
      "t-dependent-reforms": {
        note: "Residence-based coverage requires a larger change to the payer structure.",
        hurts: ["health-admin-vendors"],
      },
      "t-administrative-work": { note: "Verifying residence still creates paperwork." },
    },
    mend: ["Retrain eligibility caseworkers for residence verification and navigation"],
    worsens: ["t-dependent-reforms", "t-administrative-work"],
    solves: ["admin-cost"],
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
    how: {
      "job-lock": {
        note: "Replacing employer insurance with public or individually chosen coverage lets people leave jobs without losing insurance. This ends job lock and makes entrepreneurship and early retirement easier.",
      },
      "transition-disruption": {
        note: "Replacing employer coverage ends a benefit many workers value.",
      },
      "t-reduced-flexibility": { note: "Employers lose health coverage as a recruiting tool." },
    },
    mend: ["Require employers to pass premium savings into wages"],
    worsens: ["transition-disruption", "t-reduced-flexibility"],
    requires: ["single-payer"],
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
    how: {
      "job-lock": {
        note: "Employer contributions fund an individual plan owned by the worker, allowing coverage to move with the person. This preserves employer funding with little disruption.",
      },
      "t-uneven-risk-pools": {
        note: "Moving workers into individual plans may leave individual-market risk pools sicker.",
      },
      "t-limited-reach": {
        note: "Employer-funded portable plans do not help people without jobs.",
      },
    },
    mend: [
      "Strong individual-market rules (community rating, risk adjustment) so the pool stays healthy",
    ],
    worsens: ["t-uneven-risk-pools", "t-limited-reach"],
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
    how: {
      underinsurance: {
        note: "Removing deductibles, copays, and coinsurance makes covered services free when used. It ends underinsurance and removes billing at the point of care.",
      },
      "medical-debt": {
        note: "Removing deductibles, copays, and coinsurance ends most medical debt for covered services.",
      },
      "wait-times": {
        note: "Free covered care increases use, placing more demand on care services.",
      },
      "admin-cost": { note: "Removing cost sharing eliminates billing at the point of care." },
      "t-higher-spending": {
        note: "Making care free increases use and spending, as found in the RAND experiment.",
      },
      "x-new-taxes": { note: "Free covered care requires higher taxes." },
    },
    solves: ["medical-debt", "admin-cost"],
    worsens: ["wait-times", "t-higher-spending"],
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
    how: {
      underinsurance: {
        note: "Small copays discourage low-value use while an income-based annual cap and exemptions protect affordability. Patient cost control allows lower taxes than eliminating cost sharing.",
      },
      "low-value-care": { note: "Small patient charges discourage low-value use." },
      "x-new-taxes": {
        note: "Keeping modest copays requires lower taxes than eliminating cost sharing.",
      },
      "x-copay-billing": {
        note: "Retaining copays still deters some needed care and requires billing and income verification.",
      },
    },
    mend: ["Automatic exemptions using tax data"],
    solves: ["low-value-care", "x-new-taxes"],
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
    how: {
      underinsurance: {
        note: "Making primary care, prevention, and chronic-disease drugs free encourages needed care while copays discourage low-value services. Free chronic-disease drugs improve adherence and can reduce hospital use.",
      },
      "low-value-care": {
        note: "Charging only for low-value services discourages waste while needed care remains free.",
      },
      "t-administrative-work": {
        note: "Defining and updating service-value tiers is complex, and patients may not understand why some services are free while others are charged.",
      },
      "x-copay-billing": {
        note: "Tiered cost sharing still requires claim-level billing and tracking.",
      },
    },
    mend: ["Publish the evidence for each tier and allow appeals"],
    worsens: ["t-administrative-work"],
    solves: ["low-value-care"],
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
    how: {
      networks: {
        note: "Allowing every licensed provider to treat patients at a standard rate ends network surprises and directory errors and preserves free choice of doctor and hospital. Providers no longer need separate credentialing with many payers.",
      },
      "admin-cost": {
        note: "A standard rate with universal provider access removes separate credentialing with many payers.",
      },
      "t-higher-spending": {
        note: "Universal provider access removes insurers' ability to steer patients toward cheaper or higher-quality providers.",
      },
      safety: {
        note: "Without selective contracting, weak providers retain patients they might otherwise lose.",
      },
    },
    worsens: ["t-higher-spending", "safety"],
    solves: ["admin-cost"],
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
    how: {
      networks: {
        note: "Distance and wait standards and fines for inaccurate directories improve access while preserving narrow-network premium savings with little disruption. Network complexity and out-of-network risk remain.",
      },
      "t-enforcement-burden": {
        note: "Enforcing network standards is difficult because regulators rely on insurer-reported data.",
      },
    },
    worsens: ["t-enforcement-burden"],
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
    how: {
      "immigrant-coverage": {
        note: "Residence-based eligibility regardless of immigration status ends emergency-only care and uncompensated hospital costs. Broader access also supports infectious-disease care and prenatal care.",
        helps: ["providers"],
      },
      "x-migration-concern": {
        note: "Covering all residents adds costs and raises political and migration concerns.",
      },
    },
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
    how: {
      "immigrant-coverage": {
        note: "Covering citizens and lawfully present residents while retaining emergency Medicaid and community health centers for undocumented people costs less and raises fewer migration concerns. Uncompensated emergency care remains.",
        helps: ["taxpayers"],
      },
      "t-administrative-work": {
        note: "Different eligibility rules leave mixed-status families confused about coverage.",
        hurts: ["immigrant-families", "providers"],
      },
    },
    mend: ["Fund community health centers to serve everyone"],
    worsens: ["t-administrative-work"],
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
    how: {
      territories: {
        note: "National enrollment gives territory residents the same benefits, payment rules, and federal funding as other citizens, ending funding cliffs and coverage gaps with the mainland. Higher clinician payments may slow moves to the mainland.",
      },
      "t-higher-spending": {
        note: "Full national inclusion raises federal spending substantially relative to current federal Medicaid spending in Puerto Rico.",
      },
      "t-reduced-flexibility": {
        note: "National rates may not fit island cost structures without adjustments.",
      },
      "x-state-control": {
        note: "National inclusion reduces territory control over program administration.",
      },
    },
    mend: [
      "Set geographic payment adjustments for island costs",
      "Let territory governments administer enrollment under national rules, as states do",
    ],
    worsens: ["t-higher-spending", "t-reduced-flexibility", "x-state-control"],
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
    worsens: ["t-limited-reach"],
    how: {
      territories: {
        note: "Removing funding caps and using the state matching formula ends recurring funding cliffs while preserving locally designed territory programs, with less change than full national inclusion. Medicare differences, including enrollment in its outpatient coverage, still need separate fixes.",
      },
      "t-limited-reach": {
        note: "Keeping territory Medicaid eligibility rules leaves coverage short of universal enrollment.",
      },
    },
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
    how: {
      territories: {
        note: "Higher annual caps indexed to health costs make federal spending predictable and end funding cliffs if indexing is permanent. Territory residents still receive coverage on different terms from residents of states.",
      },
      underfunding: {
        note: "Even indexed caps can fall behind actual costs after disasters or epidemics.",
        hurts: ["territory-residents"],
      },
    },
    mend: ["Add an automatic disaster adjustment to the caps"],
    worsens: ["underfunding"],
    conflicts: ["territories-full", "territories-medicaid-parity"],
    changes: ["Set new permanent cap levels in law", "Index the caps to medical inflation"],
  }),
]
