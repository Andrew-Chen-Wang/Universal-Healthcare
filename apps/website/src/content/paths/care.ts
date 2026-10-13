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
    precedents: [{ place: "UK GPs, Kaiser Permanente", note: "Capitated primary care." }],
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
    precedents: [{ place: "Oregon, Rhode Island", note: "Primary care spending targets." }],
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
    precedents: [{ place: "UK HSSIB", note: "Independent patient-safety investigations." }],
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
    precedents: [{ place: "NHS England", note: "Allocation formula includes deprivation." }],
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
    precedents: [{ place: "Canada", note: "Disparities shrink but remain." }],
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
    precedents: [{ place: "New Zealand, Sweden, Denmark", note: "No-fault injury compensation." }],
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
    precedents: [{ place: "U.S. proposals", note: "Tested in some states; limited evidence." }],
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
    precedents: [{ place: "Germany, Switzerland", note: "Standardized claims across insurers." }],
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
    precedents: [{ place: "UK NICE, Germany IQWiG", note: "Health technology assessment." }],
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
    precedents: [{ place: "Choosing Wisely", note: "Modest effects." }],
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
    precedents: [{ place: "Taiwan NHI", note: "Data analytics flag unusual billing." }],
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
    precedents: [{ place: "CMS moratoria", note: "Used for home health and ambulances." }],
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
    precedents: [{ place: "U.S. parity laws", note: "Parity on paper, not in pay." }],
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
    precedents: [{ place: "Portugal, Canada", note: "Harm reduction plus treatment." }],
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
        note: "A 1987 law stopped construction of traditional nursing homes from January 1988, shifting to senior housing with separate home care.",
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
    precedents: [{ place: "Most peer countries", note: "Hospice is mostly non-profit." }],
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
      { place: "Nordic countries for children", note: "Free dental care for children." },
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
      { place: "Canada Dental Care Plan (2023–)", note: "Income-based coverage of basic dental." },
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
    precedents: [{ place: "Canada (provinces)", note: "Public health funded separately." }],
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
    precedents: [{ place: "U.S. ACA", note: "Preventive services covered without cost sharing." }],
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
        note: "Medicaid pilot paid for food, housing.",
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
      { place: "Most European countries", note: "Strong social programs outside health." },
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
    precedents: [{ place: "Taiwan, Estonia, Denmark", note: "National records and IDs." }],
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
    precedents: [{ place: "U.S. 21st Century Cures Act", note: "Information-blocking rules." }],
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
      { place: "Change Healthcare attack (2024)", note: "Halted claims nationwide for weeks." },
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
        note: "One clearinghouse outage halted claims nationwide for weeks; redundancy is the lesson.",
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
    precedents: [{ place: "EU GDPR", note: "Strict rules for health data." }],
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
    precedents: [{ place: "UK NHS", note: "National data opt-out." }],
    pros: ["Choice for patients", "Builds trust"],
    cons: ["Gaps in data", "Opt-outs can be higher in some groups, biasing research"],
    whoGains: ["Privacy-conscious patients"],
    whoLoses: ["Researchers"],
    mend: ["N/A"],
    changes: ["Create an opt-out of national record sharing"],
  }),
]
