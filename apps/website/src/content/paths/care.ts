/**
 * Paths for hospital payment, quality, administration, waste, mental health,
 * long-term care, dental, prevention, and data.
 */
import { path } from "./types"

export const CARE_PATHS = [
  // ---- hospital payment method (also a high-prices path) ----
  path({
    id: "global-budgets",
    problemId: "high-prices",
    title: "Global budgets for hospitals",
    summary:
      "Each hospital receives an annual budget for operations, negotiated with the payer, instead of per-service billing; capital is funded separately.",
    precedents: [
      {
        place: "Maryland",
        note: "Hospital global budgets since 2014 lowered spending growth.",
        sourceIds: ["maryland-model"],
      },
      { place: "Canada", note: "Most hospitals funded by global budgets." },
    ],
    pros: ["Predictable spending", "Very little hospital billing", "No incentive to over-treat"],
    cons: ["Incentive to do less or delay elective care", "Budgets can become outdated"],
    whoGains: ["Payers, rural hospitals"],
    whoLoses: ["Hospital billing staff", "Hospitals growing volume for profit"],
    mend: ["Add volume adjustments and wait-time guarantees"],
    solves: ["admin-cost", "billing-jobs", "rural-hospitals"],
    spawns: ["x-budget-rationing", "x-undertreatment"],
    complements: ["all-payer-rates", "single-payer"],
    changes: [
      "Negotiate annual operating budgets with each hospital",
      "Fund capital separately",
      "Adjust budgets for population, age, and service mix",
      "Remove per-claim billing for inpatient and outpatient hospital care",
    ],
  }),
  path({
    id: "fee-for-service-fixed",
    problemId: "high-prices",
    title: "Fee-for-service at public fee schedule",
    summary:
      "Keep paying per service, but at national rates (like Medicare or Japan's fee schedule).",
    precedents: [
      {
        place: "Japan, Taiwan",
        note: "Fee-for-service at national rates, with volume controls in Taiwan.",
      },
      {
        place: "Taiwan",
        note: "In 2023, Taiwan's hospital sector recorded 602 billion medical payment points, or 68.0% of points in the national global-budget payment system.",
        sourceIds: ["fee-for-service-fixed-national-health-insuranc-2024"],
      },
    ],
    pros: ["Rewards productivity", "Shorter waits"],
    cons: ["Encourages volume", "Needs billing"],
    whoGains: ["High-volume providers"],
    whoLoses: ["Payers if volume grows"],
    mend: ["N/A"],
    worsens: ["low-value-care"],
    requires: ["all-payer-rates"],
    changes: [
      "Set one national fee schedule",
      "Revise fees every two years",
      "Add volume controls by specialty",
    ],
  }),
  path({
    id: "capitation",
    problemId: "high-prices",
    title: "Capitation for primary care and integrated systems",
    summary:
      "Pay a fixed amount per enrolled person per year to a primary care practice or integrated system.",
    precedents: [
      { place: "UK GPs, Kaiser Permanente", note: "Capitated primary care." },
      {
        place: "England, United Kingdom",
        note: "For 2023–2024, England's GP global-sum payment rose from £99.70 to £102.28 per weighted patient.",
        sourceIds: ["capitation-nhs-england-2023"],
      },
    ],
    pros: ["Rewards prevention", "Flexible care (calls, messaging)"],
    cons: [
      "Incentive to avoid sick patients or under-treat",
      "Small practices bear financial risk",
    ],
    whoGains: ["Primary care practices"],
    whoLoses: ["Sick patients if practices avoid them"],
    mend: ["Risk-adjusted payments; quality bonuses"],
    spawns: ["x-undertreatment", "x-metric-gaming"],
    changes: [
      "Pay primary care practices per enrolled patient",
      "Risk-adjust payments",
      "Set quality and access requirements",
    ],
  }),

  // ---- outcomes ----
  path({
    id: "outcomes-primary-care",
    problemId: "outcomes",
    title: "Shift spending toward primary care",
    summary: "Set a target share of spending for primary care (e.g., 10–12%).",
    precedents: [
      { place: "Oregon, Rhode Island", note: "Primary care spending targets." },
      {
        place: "Rhode Island, United States",
        note: "Rhode Island's primary care share of medical spending rose from 5.4% in 2007 to 9.1% in 2012, according to a state-commissioned evaluation.",
        sourceIds: ["outcomes-primary-care-rhode-island-office-of-t-2013"],
      },
    ],
    pros: [
      "Primary care supply is linked to lower mortality across regions",
      "Fewer avoidable hospitalizations",
    ],
    cons: [
      "Money must come from specialists or hospitals",
      "Spending targets can be met by relabeling costs",
    ],
    whoGains: ["Primary care"],
    whoLoses: ["Specialists, hospitals"],
    mend: ["Phase in"],
    complements: ["phys-pay-primary"],
    changes: [
      "Set a target share of spending for primary care",
      "Report primary care spending annually",
    ],
  }),
  path({
    id: "outcomes-public-health",
    problemId: "outcomes",
    title: "Invest outside health care",
    summary: "Spend on housing, nutrition, and public health, which drive much of the outcome gap.",
    precedents: [
      { place: "Nordic countries", note: "Higher social spending, lower health spending." },
      {
        place: "Finland",
        note: "From 2008 to 2022, Finland's long-term homelessness fell by 68% during its Housing First policy, according to official housing statistics.",
        sourceIds: ["outcomes-public-health-finnish-ministry-of-the--2023"],
      },
    ],
    pros: [
      "Addresses root causes of the outcome gap (diet, housing, violence, overdoses)",
      "Benefits extend beyond health",
    ],
    cons: ["Outside the health budget; requires other agencies", "Results take years to show"],
    whoGains: ["Low-income communities"],
    whoLoses: ["Taxpayers (unless funded from health savings)"],
    mend: ["N/A"],
    complements: ["social-needs-fund"],
    changes: ["Fund housing, nutrition, and public-health programs from health savings"],
  }),

  // ---- maternal mortality ----
  path({
    id: "maternal-postpartum",
    problemId: "maternal-mortality",
    title: "12-month postpartum coverage and home visits",
    summary: "Guarantee coverage for a year after birth with nurse home visits.",
    precedents: [
      { place: "Most U.S. states (Medicaid)", note: "Extended postpartum Medicaid to 12 months." },
      {
        place: "United States",
        note: "A 2024 Commonwealth Fund report stated that 47 states had implemented 12-month postpartum Medicaid coverage extensions.",
        sourceIds: ["maternal-postpartum-commonwealth-fund-2024"],
      },
    ],
    pros: [
      "About half of pregnancy-related deaths happen after delivery",
      "Home visits catch hypertension and depression early",
    ],
    cons: [
      "Coverage alone doesn't fix shortages of postpartum care",
      "Home-visiting programs need trained nurses",
    ],
    whoGains: ["New mothers and infants"],
    whoLoses: ["Taxpayers (small cost)"],
    mend: ["N/A"],
    changes: ["Guarantee 12-month postpartum coverage", "Fund nurse home visits"],
  }),
  path({
    id: "maternal-safety-bundles",
    problemId: "maternal-mortality",
    title: "Hospital safety bundles and review committees",
    summary: "Require hemorrhage and hypertension protocols and review every death.",
    precedents: [
      {
        place: "California Maternal Quality Care Collaborative",
        note: "Cut maternal mortality significantly.",
      },
      {
        place: "California, United States",
        note: "During 2015–2016, severe maternal complications among hemorrhage patients fell 20.8% in California safety-bundle hospitals, versus 1.2% in comparison hospitals.",
        sourceIds: ["maternal-safety-bundles-american-journal-of-obst-2017"],
      },
    ],
    pros: ["Proven", "Low cost"],
    cons: [
      "Requires hospital participation and data reporting",
      "Smaller rural hospitals may lack resources",
    ],
    whoGains: ["Mothers"],
    whoLoses: ["Hospitals (staff time for protocols)"],
    mend: ["Fund rural hospitals to adopt bundles"],
    changes: [
      "Require hemorrhage and hypertension protocols in all hospitals",
      "Fund maternal mortality review committees",
    ],
  }),

  // ---- safety ----
  path({
    id: "safety-reporting",
    problemId: "safety",
    title: "Mandatory error reporting and learning system",
    summary:
      "National no-blame reporting of adverse events, with public reports and investigation.",
    precedents: [
      { place: "UK HSSIB", note: "Independent patient-safety investigations." },
      {
        place: "England, United Kingdom",
        note: "In 2025–2026, England's independent patient-safety investigation body published 16 investigation reports and 20 recommendations to national bodies.",
        sourceIds: ["safety-reporting-health-services-safety-i-2026"],
      },
    ],
    pros: ["Learns from errors system-wide", "No-blame design encourages reporting"],
    cons: ["Under-reporting persists", "Reports are useful only if someone acts on them"],
    whoGains: ["Patients"],
    whoLoses: ["Clinicians (reporting time)"],
    mend: ["Legal protection for reports so clinicians are not sued based on them"],
    complements: ["malpractice-no-fault"],
    changes: [
      "Create a national no-blame adverse-event reporting system",
      "Create an independent patient-safety investigation agency",
    ],
  }),
  path({
    id: "safety-primary-home",
    problemId: "safety",
    title: "Every person registered with a primary care home",
    summary: "Each resident registers with a primary care practice responsible for coordination.",
    precedents: [
      { place: "Denmark, Netherlands, UK", note: "GP registration and referral gatekeeping." },
      {
        place: "Netherlands",
        note: "A 2020 Commonwealth Fund profile reported that over 95% of Dutch citizens were registered with a chosen GP, who serves as a referral gatekeeper.",
        sourceIds: ["debt-free-school-commonwealth-fund-2020"],
      },
    ],
    pros: ["Better coordination and fewer duplicate tests", "One clinician sees the whole picture"],
    cons: [
      "Gatekeeping limits direct specialist access",
      "Needs enough primary care clinicians to register everyone",
    ],
    whoGains: ["Patients with chronic conditions"],
    whoLoses: ["People wanting direct specialist visits"],
    mend: ["Allow self-referral for some specialties"],
    spawns: ["x-central-rationing"],
    changes: [
      "Register every resident with a primary care practice",
      "Require referrals for most specialist care",
    ],
  }),

  // ---- disparities ----
  path({
    id: "disparities-equity-funding",
    problemId: "disparities",
    title: "Equity-adjusted funding",
    summary: "Add payments for providers serving deprived areas, based on a deprivation index.",
    precedents: [
      { place: "NHS England", note: "Allocation formula includes deprivation." },
      {
        place: "England, United Kingdom",
        note: "For 2023–2024, NHS England's core funding formula gave health inequalities and unmet need a 10.2% weighting.",
        sourceIds: ["disparities-equity-funding-nhs-england-2023"],
      },
    ],
    pros: ["Targets money where needs are greatest", "Supports safety-net providers"],
    cons: ["Deprivation indices are imperfect", "Providers in wealthier areas get less"],
    whoGains: ["Safety-net providers"],
    whoLoses: ["Providers in wealthy areas"],
    mend: ["N/A"],
    changes: ["Add deprivation-index payments to provider rates"],
  }),
  path({
    id: "disparities-uniform",
    problemId: "disparities",
    title: "Rely on universal coverage and uniform rates",
    summary:
      "Universal coverage plus one rate for every patient ends payer-based discrimination (Medicaid patients paying less).",
    precedents: [
      {
        place: "Canada",
        note: "In 2023, 42.8% of Canadian adults in the lowest income group reported very good or excellent health, compared with 60.9% in the highest group.",
        sourceIds: ["disparities-uniform-statistics-canada-2025"],
      },
    ],
    pros: ["Ends payer-based discrimination (Medicaid patients being turned away)", "Simple"],
    cons: [
      "Doesn't address non-financial barriers (distance, language, trust)",
      "Disparities shrink but remain in universal systems",
    ],
    whoGains: ["Former Medicaid patients"],
    whoLoses: ["Providers that relied on commercial revenue to cover Medicaid losses"],
    mend: ["N/A"],
    requires: ["all-payer-rates"],
    changes: ["Pay one rate for every patient regardless of former coverage"],
  }),

  // ---- malpractice ----
  path({
    id: "malpractice-no-fault",
    problemId: "malpractice",
    title: "No-fault compensation for medical injury",
    summary:
      "Injured patients are compensated without suing, from a fund; discipline is handled separately.",
    precedents: [
      { place: "New Zealand, Sweden, Denmark", note: "No-fault injury compensation." },
      {
        place: "New Zealand",
        note: "New Zealand's ACC accepted 15,411 treatment-injury claims lodged in 2022–2023, according to decisions recorded by March 2024.",
        sourceIds: ["malpractice-no-fault-accident-compensation-co-2024"],
      },
    ],
    pros: ["Faster, fairer compensation", "Less defensive medicine"],
    cons: ["Smaller payouts for severe injury", "Lawyers lose cases"],
    whoGains: ["Most injured patients", "Clinicians"],
    whoLoses: ["Malpractice lawyers and insurers"],
    mend: ["N/A"],
    costIds: ["liability-total", "liability-defensive"],
    changes: [
      "Create a no-fault injury compensation fund",
      "Replace most malpractice lawsuits",
      "Separate discipline from compensation",
    ],
  }),
  path({
    id: "malpractice-safe-harbor",
    problemId: "malpractice",
    title: "Safe harbor for following clinical guidelines",
    summary: "Clinicians who follow recognized guidelines are protected from liability.",
    precedents: [
      { place: "U.S. proposals", note: "Tested in some states; limited evidence." },
      {
        place: "Maine, United States",
        note: "In 1993, Maine's liability demonstration gave guidelines for 20 conditions and procedures in four specialties legal force in participating physicians' malpractice cases.",
        sourceIds: ["malpractice-safe-harbor-u-s-government-accountab-1993"],
      },
    ],
    pros: ["Less defensive medicine", "Encourages guideline use"],
    cons: ["Guidelines may not fit every patient", "Harmed patients lose a route to compensation"],
    whoGains: ["Clinicians"],
    whoLoses: ["Patients harmed by guideline care"],
    mend: ["Pair with a no-fault fund"],
    changes: ["Protect clinicians who follow recognized guidelines from liability"],
  }),

  // ---- admin cost ----
  path({
    id: "admin-one-claims",
    problemId: "admin-cost",
    title: "One claims system and standard rules",
    summary: "One claims format, one set of codes and rules, real-time payment.",
    precedents: [
      { place: "Taiwan", note: "Single electronic claims system.", sourceIds: ["taiwan-nhi"] },
    ],
    pros: ["Large savings for providers and payers", "Real-time payment ends accounts receivable"],
    cons: [
      "A big IT project with failure risk",
      "A single system becomes a target (see cyberattacks)",
    ],
    whoGains: ["Providers"],
    whoLoses: ["Clearinghouses"],
    mend: ["Retrain clearinghouse staff"],
    requires: ["single-payer"],
    costIds: ["admin-total", "admin-hospital-collection"],
    changes: ["Build one national claims system with standard codes", "Pay claims in real time"],
  }),
  path({
    id: "admin-standardize",
    problemId: "admin-cost",
    title: "Standardize across many payers",
    summary:
      "Require all insurers to use identical forms, codes, prior-auth rules, and credentialing.",
    precedents: [
      { place: "Germany, Switzerland", note: "Standardized claims across insurers." },
      {
        place: "Netherlands",
        note: "In 2012, the Netherlands reduced standardized hospital billing categories from 30,000 to 4,400 to reduce administrative complexity.",
        sourceIds: ["debt-free-school-commonwealth-fund-2020"],
      },
    ],
    pros: ["Keeps multiple payers", "Reduces provider paperwork"],
    cons: ["Smaller savings than one payer", "Insurers resist losing their own rules"],
    whoGains: ["Providers"],
    whoLoses: ["Clearinghouses"],
    mend: ["N/A"],
    complements: ["regulated-multipayer"],
    changes: ["Require identical forms, codes, prior-auth rules, and credentialing across payers"],
  }),

  // ---- billing jobs ----
  path({
    id: "billing-transition",
    problemId: "billing-jobs",
    title: "Worker transition program",
    summary:
      "Wage replacement, retraining, and placement into growing health jobs (care coordination, aides, IT).",
    precedents: [
      {
        place: "U.S. Trade Adjustment Assistance",
        note: "Mixed record; works better with job placement.",
      },
      {
        place: "United States",
        note: "In fiscal 2023, 76.7% of Trade Adjustment Assistance participants obtained new employment within six months of exiting the program.",
        sourceIds: ["billing-transition-u-s-department-of-labor-2024"],
      },
    ],
    pros: ["Mends the main loser of admin savings", "Uses part of the savings"],
    cons: ["Costly", "Retraining success varies"],
    whoGains: ["Displaced workers"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    changes: ["Fund wage replacement, retraining, and placement for displaced workers"],
  }),
  path({
    id: "billing-redeploy",
    problemId: "billing-jobs",
    title: "Redeploy billing staff to care coordination",
    summary: "Hire displaced staff into patient navigation and scheduling roles in the new system.",
    precedents: [{ place: "N/A", note: "Proposed; no large precedent." }],
    pros: ["Keeps experienced staff in health care", "Fills growing patient-navigation needs"],
    cons: ["Skills differ", "Fewer jobs than are eliminated"],
    whoGains: ["Displaced billing staff"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: ["Hire displaced billing staff into navigation and scheduling roles"],
  }),

  // ---- low-value care ----
  path({
    id: "lowvalue-coverage-list",
    problemId: "low-value-care",
    title: "Evidence-based coverage decisions",
    summary: "A public body reviews evidence and stops covering services proven not to work.",
    precedents: [
      { place: "UK NICE, Germany IQWiG", note: "Health technology assessment." },
      {
        place: "Germany",
        note: "In Germany (2011–2017), health technology assessments by IQWiG found that 58% of 216 newly approved drugs showed no proven added benefit over existing standard care, constraining negotiated reimbursement prices.",
        sourceIds: ["lowvalue-coverage-list-the-bmj-2019"],
      },
    ],
    pros: ["Saves money and protects patients from harmful care", "Decisions are evidence-based"],
    cons: ["Controversial decisions", "Evidence is often incomplete"],
    whoGains: ["Patients, payers"],
    whoLoses: ["Makers of low-value products"],
    mend: ["N/A"],
    spawns: ["x-central-rationing"],
    costIds: ["waste-lowvalue"],
    changes: ["Create an evidence-review agency", "Stop covering services proven ineffective"],
  }),
  path({
    id: "lowvalue-nudges",
    problemId: "low-value-care",
    title: "Feedback and clinician nudges",
    summary: "Report low-value care rates to clinicians and use EHR alerts.",
    precedents: [
      { place: "Choosing Wisely", note: "Modest effects." },
      {
        place: "Choosing Wisely (U.S.)",
        note: "In U.S. Medicare (2014–2018), receipt of 32 Choosing Wisely low-value services fell only from 36.3% to 33.6% of beneficiaries, illustrating the modest impact of voluntary guidelines and clinician feedback alone.",
        sourceIds: ["lowvalue-nudges-jama-network-open-2021"],
      },
    ],
    pros: ["Cheap", "Respects clinician judgment"],
    cons: ["Small effects", "Alert fatigue"],
    whoGains: ["Patients"],
    whoLoses: ["Clinicians (alert fatigue)"],
    mend: ["N/A"],
    changes: ["Report low-value care rates to clinicians", "Add EHR alerts"],
  }),

  // ---- fraud ----
  path({
    id: "fraud-analytics",
    problemId: "fraud",
    title: "Pre-payment analytics and audits",
    summary: "Real-time fraud detection on all claims; more audits and prosecution.",
    precedents: [
      { place: "Taiwan NHI", note: "Data analytics flag unusual billing." },
      {
        place: "Taiwan",
        note: "In Taiwan (2008), data mining models applied to National Health Insurance claims to detect hospital billing fraud and abuse achieved an overall accuracy of 99% using classification tree algorithms.",
        sourceIds: ["fraud-analytics-health-care-management-s-2008"],
      },
    ],
    pros: ["One data system sees all billing", "Stops payments before they go out"],
    cons: ["False positives delay legitimate payments", "Fraudsters adapt"],
    whoGains: ["Taxpayers"],
    whoLoses: ["Fraudsters"],
    mend: ["Fast appeals for flagged claims"],
    costIds: ["fraud-low", "fraud-high", "improper-medicare"],
    changes: ["Run real-time fraud analytics on all claims", "Fund audits and prosecution"],
  }),
  path({
    id: "fraud-enrollment",
    problemId: "fraud",
    title: "Stricter provider enrollment",
    summary:
      "Background checks, site visits, and moratoriums on new providers in high-fraud categories.",
    precedents: [
      { place: "CMS moratoria", note: "Used for home health and ambulances." },
      {
        place: "U.S. (CMS)",
        note: "In Miami-Dade County, CMS reported home health agencies grew 15% annually to 662 providers in 2012 (with 56% billing intermittently), prompting the first federal enrollment moratorium in 2013 to stop fraud.",
        sourceIds: ["fraud-enrollment-centers-for-medicare-med-2013"],
      },
    ],
    pros: ["Stops fraud before payment", "Targets high-fraud categories"],
    cons: ["Slows legitimate new providers", "Moratoria can reduce access"],
    whoGains: ["Taxpayers"],
    whoLoses: ["New providers"],
    mend: ["N/A"],
    changes: [
      "Require background checks and site visits for new providers",
      "Use moratoria in high-fraud categories",
    ],
  }),

  // ---- mental health ----
  path({
    id: "mh-parity-pay",
    problemId: "mental-health-access",
    title: "Pay mental health clinicians at parity",
    summary: "Raise rates so therapists and psychiatrists accept insurance.",
    precedents: [
      { place: "U.S. parity laws", note: "Parity on paper, not in pay." },
      {
        place: "U.S.",
        note: "In the U.S. (2024), an RTI study found commercial insurers reimbursed medical office visits 22% higher than behavioral health visits, driving patients out-of-network 3.5 times more often despite parity laws.",
        sourceIds: ["mh-parity-pay-rti-international-2024"],
      },
    ],
    pros: ["More clinicians accept coverage", "Reduces cash-only practice"],
    cons: ["Costly", "Doesn't add clinicians quickly"],
    whoGains: ["Patients", "Therapists and psychiatrists"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    changes: ["Raise mental health rates to parity with medical care"],
  }),
  path({
    id: "mh-stepped",
    problemId: "mental-health-access",
    title: "Stepped care and integration into primary care",
    summary:
      "Self-referral to talking therapies, collaborative care in primary care, crisis lines.",
    precedents: [{ place: "NHS Talking Therapies", note: "Self-referral, stepped care model." }],
    pros: ["Large capacity at low cost", "Self-referral without a doctor visit"],
    cons: ["Waits for higher-intensity care", "Outcome targets can be gamed"],
    whoGains: ["Patients with mild to moderate conditions"],
    whoLoses: ["Therapists in private practice (competition)"],
    mend: ["N/A"],
    spawns: ["x-metric-gaming"],
    changes: [
      "Allow self-referral to talking therapies",
      "Fund collaborative care in primary care",
      "Fund crisis lines",
    ],
  }),

  // ---- addiction ----
  path({
    id: "addiction-mat",
    problemId: "addiction",
    title: "Easy access to medication treatment",
    summary:
      "Any clinician can prescribe buprenorphine; methadone available in pharmacies and primary care.",
    precedents: [
      { place: "France, Canada", note: "Buprenorphine and methadone widely available." },
      {
        place: "France",
        note: "In France (1995–1999), deregulating buprenorphine to allow general practitioners to prescribe it without special licensing expanded treatment tenfold and reduced fatal opioid overdoses by nearly 80%.",
        sourceIds: ["addiction-mat-the-american-journal-on--2004"],
      },
    ],
    pros: ["Reduces overdose deaths", "Treatment in normal clinics reduces stigma"],
    cons: ["Diversion concerns", "Some clinicians are reluctant to prescribe"],
    whoGains: ["People with addiction", "Families"],
    whoLoses: ["Residential programs that don't offer medication"],
    mend: ["N/A"],
    changes: [
      "Allow any clinician to prescribe buprenorphine",
      "Allow methadone in pharmacies and primary care",
    ],
  }),
  path({
    id: "addiction-harm-reduction",
    problemId: "addiction",
    title: "Harm reduction services",
    summary: "Fund naloxone, drug checking, and supervised consumption sites.",
    precedents: [
      { place: "Portugal, Canada", note: "Harm reduction plus treatment." },
      {
        place: "Canada (Vancouver)",
        note: "In Canada (2011), a Lancet study found fatal drug overdoses dropped by 35% within 500 meters of Vancouver’s supervised injection site after it opened, compared to a 9% decline across the rest of the city.",
        sourceIds: ["addiction-harm-reduction-the-lancet-2011"],
      },
    ],
    pros: ["Fewer deaths", "Connects people to treatment"],
    cons: ["Community opposition", "Legal uncertainty"],
    whoGains: ["People who use drugs"],
    whoLoses: ["Neighborhoods hosting sites (perceived disorder)"],
    mend: ["Site selection with community input"],
    changes: ["Fund naloxone, drug checking, and supervised consumption sites"],
  }),

  // ---- LTC ----
  path({
    id: "ltc-social-insurance",
    problemId: "ltc-spend-down",
    title: "Universal long-term care insurance",
    summary: "Separate public insurance covering home and nursing care based on need, not income.",
    precedents: [
      {
        place: "Germany (1995), Japan (2000)",
        note: "Mandatory LTC insurance funded by contributions.",
      },
      { place: "Washington State", note: "WA Cares: lifetime benefit funded by payroll tax." },
      {
        place: "Germany",
        note: "In Germany (1995), universal long-term care insurance funded by a 1.7% payroll contribution covered the population and relieved means-tested welfare, which had previously funded roughly 80% of nursing home residents.",
        sourceIds: ["ltc-social-insurance-the-milbank-quarterly-2000"],
      },
    ],
    pros: ["Ends spend-down", "Covers home care"],
    cons: ["Expensive; demand grows", "Requires a new tax"],
    whoGains: ["Older adults and families"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    spawns: ["x-woodwork", "x-new-taxes"],
    costIds: ["nhe-nursing", "nhe-homeHealth"],
    changes: [
      "Create universal long-term care insurance",
      "Fund through a dedicated contribution",
      "Create need-based assessments",
    ],
  }),
  path({
    id: "ltc-medicaid-expand",
    problemId: "ltc-spend-down",
    title: "Keep means testing, but expand home care",
    summary: "Keep Medicaid LTC but end waitlists and raise asset limits.",
    precedents: [
      {
        place: "U.S. HCBS waivers",
        note: "Hundreds of thousands on waitlists.",
        sourceIds: ["kff-hcbs-waitlist"],
      },
    ],
    pros: ["Cheaper than universal LTC", "Ends waitlists"],
    cons: ["Spend-down remains", "Middle class still unprotected"],
    whoGains: ["Low-income older adults"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    changes: ["End HCBS waitlists", "Raise Medicaid asset limits"],
  }),
  path({
    id: "ltc-catastrophic",
    problemId: "ltc-spend-down",
    title: "Catastrophic coverage after a waiting period",
    summary:
      "Public coverage starts after, e.g., 2 years of need; private insurance or savings cover the first part.",
    precedents: [
      { place: "UK proposals (Dilnot cap)", note: "Lifetime cap on care costs proposed." },
      {
        place: "UK",
        note: "In the UK (2011), the Dilnot Commission proposed capping individual lifetime social care costs at £35,000, finding that 1 in 10 older adults faced catastrophic costs exceeding £100,000 under existing means testing.",
        sourceIds: ["ltc-catastrophic-the-king-s-fund-2011"],
      },
    ],
    pros: ["Protects against ruin at lower cost", "Encourages private insurance for early years"],
    cons: ["Families still pay early costs", "Private LTC insurance market is weak"],
    whoGains: ["People with long care needs"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    changes: ["Create public LTC coverage after a waiting period"],
  }),

  // ---- nursing home quality ----
  path({
    id: "nh-staffing",
    problemId: "nursing-home-quality",
    title: "Minimum staffing and financial transparency",
    summary:
      "Staffing minimums, disclosure of related-party payments, and minimum spending on care.",
    precedents: [
      {
        place: "U.S. 2024 rule (later blocked)",
        note: "The 2024 federal staffing minimum was repealed by CMS in December 2025 after Congress barred its enforcement until 2034.",
      },
      {
        place: "U.S.",
        note: "In the U.S. (2024), a KFF analysis found only 19% of nursing facilities met all three standards in CMS's federal staffing rule (3.48 hours per resident day), including just 11% of for-profit homes.",
        sourceIds: ["nh-staffing-kff-2024"],
      },
    ],
    pros: ["Better care", "Exposes money diverted to related companies"],
    cons: ["Costly; may close facilities", "Hard to hire in shortage areas"],
    whoGains: ["Residents"],
    whoLoses: ["Operators"],
    mend: ["Fund through rates"],
    spawns: ["x-staffing-mandate-cost"],
    costIds: ["nursing-home-payroll", "aides-payroll"],
    changes: [
      "Set minimum staffing",
      "Require disclosure of related-party payments",
      "Set minimum spending on care",
    ],
  }),
  path({
    id: "nh-small-homes",
    problemId: "nursing-home-quality",
    title: "Shift to small homes and home care",
    summary: "Fund small-house models and home care instead of large institutions.",
    precedents: [
      {
        place: "Denmark",
        note: "In Denmark, a 1987 reform halting conventional nursing home construction contributed to a 30% drop in nursing home beds between 1985 and 1997 as care shifted to home services and adapted housing.",
        sourceIds: ["nh-small-homes-the-gerontologist-2001"],
      },
    ],
    pros: ["Better quality of life", "Fewer infections"],
    cons: ["Transition cost", "Smaller homes cost more per resident"],
    whoGains: ["Residents"],
    whoLoses: ["Large operators"],
    mend: ["N/A"],
    changes: ["Fund small-house models and home care"],
  }),

  // ---- hospice ----
  path({
    id: "hospice-oversight",
    problemId: "hospice-for-profit",
    title: "Tighter hospice oversight",
    summary:
      "Enrollment moratoriums in high-fraud areas, audits of long stays, and ownership disclosure.",
    precedents: [
      {
        place: "CMS hospice special focus program",
        note: "Targets poor performers.",
        sourceIds: ["medpac-hospice-2025"],
      },
    ],
    pros: ["Targets fraud", "Protects patients"],
    cons: ["Slows legitimate growth", "Audits are costly"],
    whoGains: ["Patients"],
    whoLoses: ["Fraudulent operators"],
    mend: ["N/A"],
    costIds: ["hospice-medicare"],
    changes: [
      "Use enrollment moratoria in high-fraud areas",
      "Audit long stays",
      "Require ownership disclosure",
    ],
  }),
  path({
    id: "hospice-nonprofit",
    problemId: "hospice-for-profit",
    title: "Require non-profit hospice",
    summary: "Only non-profit or public organizations may provide hospice.",
    precedents: [
      {
        place: "Most peer countries",
        note: "In 2021, the Medicare aggregate profit margin was 19.2% for for-profit hospices compared to 5.2% for non-profit hospices (and -15.6% for hospital-based hospices), according to MedPAC.",
        sourceIds: ["hospice-nonprofit-medicare-payment-advisor-2024"],
      },
    ],
    pros: ["Removes profit motive", "Matches peer countries"],
    cons: ["Capacity loss when for-profits exit", "Buyouts are costly"],
    whoGains: ["Patients"],
    whoLoses: ["For-profit operators"],
    mend: ["Buyout or conversion"],
    changes: ["Require non-profit or public hospice providers"],
  }),

  // ---- dental ----
  path({
    id: "dental-full",
    problemId: "dental-gap",
    title: "Cover dental, vision, and hearing fully",
    summary: "Include in the standard benefit.",
    precedents: [
      {
        place: "Nordic countries for children",
        note: "In Denmark, dental care is free through age 19 (expanding to 21 in 2025); municipal school-based delivery achieves a participation rate of nearly 100%, including free orthodontic care (2024).",
        sourceIds: ["dental-full-european-observatory-on--2024"],
      },
    ],
    pros: ["Ends a major gap", "Oral health affects overall health"],
    cons: ["Expensive; dentist capacity limited", "Waits for dentists likely"],
    whoGains: ["Low-income adults, seniors"],
    whoLoses: ["Dental insurers"],
    mend: ["N/A"],
    costIds: ["nhe-dental"],
    worsens: ["wait-times"],
    changes: ["Add dental, vision, and hearing to the standard benefit"],
  }),
  path({
    id: "dental-basic",
    problemId: "dental-gap",
    title: "Cover preventive and basic dental; hearing aids and glasses with limits",
    summary:
      "Cover exams, cleanings, fillings, extractions; limited coverage for crowns, implants.",
    precedents: [
      {
        place: "Canada Dental Care Plan (2023–)",
        note: "More than 1 million Canadians had received care under the Canadian Dental Care Plan by October 31, 2024. Eligible services are covered at 100% of established CDCP fees for adjusted family net incomes below C$70,000, 60% for C$70,000–79,999, and 40% for C$80,000–89,999; additional provider charges may apply.",
        sourceIds: ["dental-basic-health-canada-2024"],
      },
    ],
    pros: ["Lower cost", "Covers most needs"],
    cons: ["Gaps for major dental work", "Needs copays or limits"],
    whoGains: ["Most people"],
    whoLoses: ["People needing major dental work"],
    mend: ["N/A"],
    spawns: ["x-copay-billing"],
    changes: ["Cover preventive and basic dental", "Cover hearing aids and glasses with limits"],
  }),

  // ---- prevention ----
  path({
    id: "prevention-fund",
    problemId: "prevention-underfunded",
    title: "Dedicated public health funding",
    summary: "Fixed share of health spending for public health, protected from cuts.",
    precedents: [
      {
        place: "Canada (provinces)",
        note: "In Canada, public health represents 5.6% ($22 billion) of total health spending projected in 2025 (peaking at 5.9% in 2022–2023), with core prevention and promotion programs receiving 3.2% to 3.5%.",
        sourceIds: ["prevention-fund-canadian-institute-for-h-2025"],
      },
    ],
    pros: ["Stable", "Protects public health from cuts"],
    cons: ["Competes with treatment", "Results hard to see"],
    whoGains: ["Everyone"],
    whoLoses: ["Treatment budgets (competition)"],
    mend: ["N/A"],
    costIds: ["nhe-publicHealth"],
    changes: ["Set a fixed share of health spending for public health"],
  }),
  path({
    id: "prevention-free",
    problemId: "prevention-underfunded",
    title: "Free preventive care and vaccines",
    summary: "No charges for screening, vaccines, and preventive visits.",
    precedents: [
      {
        place: "U.S. ACA",
        note: "Under the ACA, over 150 million privately insured Americans (plus 20 million Medicaid expansion enrollees and 61 million on Medicare) have access to recommended preventive care and vaccines without cost sharing (2022).",
        sourceIds: ["prevention-free-aspe-hhs-2022"],
      },
    ],
    pros: ["Proven to increase use", "Simple to explain"],
    cons: ["Some screening is low-value", "Costs rise with use"],
    whoGains: ["Everyone"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    changes: ["Cover preventive services without cost sharing"],
  }),

  // ---- social needs ----
  path({
    id: "social-needs-fund",
    problemId: "social-needs",
    title: "Let health budgets pay for housing and food",
    summary:
      "Allow the health system to pay for housing support, medically tailored meals, and rides.",
    precedents: [
      {
        place: "North Carolina Healthy Opportunities",
        note: "A UNC evaluation of North Carolina’s Healthy Opportunities Pilots found that covering food and housing for over 31,000 Medicaid enrollees reduced healthcare spending by an average of $164 per person per month (2022–2024).",
        sourceIds: ["social-needs-fund-north-carolina-departmen-2026"],
      },
    ],
    pros: ["Targets drivers of illness", "Can pay for itself in some cases"],
    cons: ["Health budgets stretched", "Health systems aren't housing experts"],
    whoGains: ["Low-income patients"],
    whoLoses: ["Health budgets"],
    mend: ["N/A"],
    changes: ["Allow health budgets to pay for housing support, meals, and rides"],
  }),
  path({
    id: "social-needs-separate",
    problemId: "social-needs",
    title: "Keep social programs separate",
    summary: "Fund housing and food programs directly, not through health care.",
    precedents: [
      {
        place: "Most European countries",
        note: "According to the OECD SOCX database, public social spending outside health averages about 14% to 15% of GDP across European nations (and exceeds 20% in France), compared to under 11% in the U.S. (2022).",
        sourceIds: ["social-needs-separate-oecd-2023"],
      },
    ],
    pros: [
      "Clear responsibility: housing and food agencies do what they know",
      "Health budgets aren't stretched by non-medical spending",
    ],
    cons: [
      "Health system can't act directly when a patient's housing is making them sick",
      "Coordination across agencies is weak in the U.S.",
    ],
    whoGains: ["Health budgets"],
    whoLoses: ["Patients whose social needs fall through the cracks"],
    mend: ["Fund social workers in clinics to connect patients with outside programs"],
    changes: ["Fund housing and food programs directly"],
  }),

  // ---- interoperability ----
  path({
    id: "interop-national",
    problemId: "interoperability",
    title: "National health record and patient ID",
    summary: "One national record that follows every patient.",
    precedents: [
      {
        place: "Taiwan, Estonia, Denmark",
        note: "In Estonia, 100% of patients have a nationwide digital health record integrating data across all providers, handling 2.7 million monthly patient queries and 100% digital prescriptions (2024).",
        sourceIds: ["interop-national-e-estonia-2024"],
      },
    ],
    pros: ["Records follow patients everywhere", "Fewer duplicate tests and medication errors"],
    cons: ["Privacy and security risks of one large database", "Large IT project"],
    whoGains: ["Patients, clinicians"],
    whoLoses: ["EHR vendors"],
    mend: ["Retrain staff; keep vendors as contractors"],
    worsens: ["privacy", "cybersecurity"],
    changes: ["Create a national health record and patient ID"],
  }),
  path({
    id: "interop-standards",
    problemId: "interoperability",
    title: "Mandatory data-sharing standards",
    summary: "Enforce FHIR APIs and ban information blocking.",
    precedents: [
      {
        place: "U.S. 21st Century Cures Act",
        note: "Under the 21st Century Cures Act, ONC logged 2,450 possible claims of information blocking between April 2021 and mid-2026, with over 1,500 submitted by patients and 1,938 implicating healthcare providers.",
        sourceIds: ["interop-standards-office-of-the-national-c-2026"],
      },
    ],
    pros: ["Keeps market competition", "Builds on existing law"],
    cons: ["Slow; vendors comply minimally", "Standards keep changing"],
    whoGains: ["Patients", "App developers"],
    whoLoses: ["EHR vendors that profit from lock-in"],
    mend: ["N/A"],
    changes: ["Enforce FHIR APIs", "Ban information blocking"],
  }),

  // ---- cybersecurity ----
  path({
    id: "cyber-standards",
    problemId: "cybersecurity",
    title: "Mandatory security standards and backup payment systems",
    summary: "Minimum security rules, and backup payment for providers during outages.",
    precedents: [
      {
        place: "Change Healthcare attack (2024)",
        note: "Following the 2024 Change Healthcare cyberattack, CMS issued over $3.26 billion in emergency accelerated and advance payments to more than 8,900 hospitals, doctors, and suppliers to prevent cash-flow collapse.",
        sourceIds: ["cyber-standards-centers-for-medicare-med-2024"],
      },
    ],
    pros: ["Resilience against attacks", "Providers paid during outages"],
    cons: ["Compliance costs", "Hardest for small providers"],
    whoGains: ["Providers", "Patients"],
    whoLoses: ["Small providers (compliance cost)"],
    mend: ["Grants for small and rural providers"],
    changes: ["Set minimum security standards", "Create backup payment systems"],
  }),
  path({
    id: "cyber-redundant",
    problemId: "cybersecurity",
    title: "Redundant public infrastructure",
    summary: "Run the claims system on redundant public infrastructure with offline fallback.",
    precedents: [
      {
        place: "Change Healthcare attack (2024)",
        note: "An AHA survey of nearly 1,000 hospitals found that 94% suffered financial harm from the 2024 Change Healthcare clearinghouse attack, with 74% reporting patient care disruptions and 59% losing over $1 million daily.",
        sourceIds: ["cyber-redundant-american-hospital-associ-2024"],
      },
    ],
    pros: ["Avoids single point of failure", "Care continues during outages"],
    cons: ["Costly", "More systems to secure"],
    whoGains: ["Everyone"],
    whoLoses: ["Taxpayers (cost)"],
    mend: ["N/A"],
    changes: ["Run claims on redundant public infrastructure with offline fallback"],
  }),

  // ---- privacy ----
  path({
    id: "privacy-law",
    problemId: "privacy",
    title: "Strong health privacy law",
    summary: "Extend privacy protections to apps and data brokers; strict access logs.",
    precedents: [
      {
        place: "EU GDPR",
        note: "Under the EU GDPR, French regulator CNIL fined commercial health data broker IQVIA €5 million in 2026 for improperly handling pharmacy and medical records covering tens of millions of individuals without adequate safeguards.",
        sourceIds: ["privacy-law-commission-nationale-de--2026"],
      },
    ],
    pros: ["Protects patients", "Covers apps and data brokers HIPAA misses"],
    cons: ["Limits research", "Compliance costs"],
    whoGains: ["Patients"],
    whoLoses: ["Data brokers"],
    mend: ["Research exemptions with safeguards"],
    changes: ["Extend privacy protections to apps and data brokers"],
  }),
  path({
    id: "privacy-opt-out",
    problemId: "privacy",
    title: "Opt-out of national record sharing",
    summary: "Patients can opt out of sharing.",
    precedents: [
      {
        place: "UK NHS",
        note: "In England’s NHS, 1,339,862 patients opted out of secondary data sharing in a single month (June 2021) amid centralized database plans, raising the national opt-out rate from 2.77% to 4.97% of the population.",
        sourceIds: ["privacy-opt-out-bjgp-open-2024"],
      },
    ],
    pros: ["Choice for patients", "Builds trust"],
    cons: ["Gaps in data", "Opt-outs can be higher in some groups, biasing research"],
    whoGains: ["Privacy-conscious patients"],
    whoLoses: ["Researchers"],
    mend: ["N/A"],
    changes: ["Create an opt-out of national record sharing"],
  }),
]
