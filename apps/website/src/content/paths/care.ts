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
    how: {
      "high-prices": {
        note: "Negotiated annual operating budgets make hospital spending predictable, replace most hospital billing, and remove the incentive to provide extra services simply to earn more.",
      },
      "admin-cost": {
        note: "Annual hospital budgets replace per-service billing and require very little hospital billing.",
      },
      "billing-jobs": {
        note: "Replacing per-service hospital payments with annual budgets removes much of the hospital billing work, displacing the staff who do it.",
      },
      "rural-hospitals": {
        note: "An annual operating budget replaces payment per service, making hospital spending predictable rather than dependent on service billing.",
      },
      "x-undertreatment": {
        note: "An annual operating budget creates an incentive to do less care or delay elective services.",
      },
      "low-value-care": {
        note: "An annual operating budget removes the incentive to provide extra services to earn more revenue.",
      },
      "x-budget-rationing": {
        note: "Annual hospital budgets create an incentive to do less or delay elective care, and the budgets can become outdated.",
      },
    },
    mend: ["Add volume adjustments and wait-time guarantees"],
    worsens: ["billing-jobs"],
    solves: ["admin-cost", "rural-hospitals", "low-value-care"],
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
    how: {
      "high-prices": {
        note: "National fee schedules retain payment per service, rewarding productivity and supporting shorter waits while fixing the rates paid.",
      },
      "wait-times": {
        note: "Retaining payment per service rewards productivity and supports shorter waits.",
      },
      "low-value-care": {
        note: "Payment per service continues to encourage greater service volume even with fixed national rates.",
      },
      "t-limited-reach": { note: "Payment per service at national rates still requires billing." },
    },
    solves: ["wait-times"],
    worsens: ["low-value-care", "t-limited-reach"],
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
    how: {
      "high-prices": {
        note: "Paying a fixed amount per enrolled person instead of per service removes the incentive to bill more services, rewarding prevention and allowing care by calls and messaging.",
        helps: ["clinicians"],
      },
      "x-metric-gaming": {
        note: "Fixed payments per enrollee create an incentive to avoid sick patients rather than provide their costly care.",
      },
      "prevention-underfunded": {
        note: "Fixed payments per enrolled person reward prevention rather than additional services.",
      },
      "x-undertreatment": {
        note: "Fixed payments per enrolled person create incentives to avoid sick patients or under-treat them.",
      },
      "t-income-loss": {
        note: "Fixed payments per enrolled person leave small practices bearing financial risk.",
      },
    },
    mend: ["Risk-adjusted payments; quality bonuses"],
    worsens: ["t-income-loss"],
    solves: ["prevention-underfunded"],
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
    how: {
      outcomes: {
        note: "Directing a target share of spending to primary care supports care whose supply is linked to lower mortality across regions and fewer avoidable hospitalizations.",
        helps: ["clinicians"],
      },
      "t-income-loss": {
        note: "A higher primary care spending share requires money to come from specialists or hospitals.",
        hurts: ["specialists"],
      },
      "x-metric-gaming": { note: "Primary care spending targets can be met by relabeling costs." },
    },
    mend: ["Phase in"],
    worsens: ["t-income-loss", "x-metric-gaming"],
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
    how: {
      outcomes: {
        note: "Spending on housing, nutrition, and public health addresses diet, housing, violence, and overdoses as root causes of the outcome gap, with benefits extending beyond health.",
      },
      "social-needs": {
        note: "Spending on housing and nutrition addresses social conditions contributing to the outcome gap.",
      },
      "prevention-underfunded": {
        note: "Spending on public health addresses root causes of the outcome gap, with benefits extending beyond health.",
      },
      "t-administrative-work": {
        note: "Spending on housing, nutrition, and public health extends outside the health budget and requires coordination with other agencies.",
        hurts: ["taxpayers"],
      },
      "t-delayed-benefits": {
        note: "Spending on housing, nutrition, and public health takes years to show results.",
      },
    },
    worsens: ["t-administrative-work", "t-delayed-benefits"],
    solves: ["social-needs", "prevention-underfunded"],
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
    how: {
      "maternal-mortality": {
        note: "Extended coverage after birth addresses the substantial share of pregnancy-related deaths occurring after delivery. Nurse home visits catch hypertension and depression early.",
      },
      "nursing-shortage": { note: "Nurse home-visiting programs require trained nurses." },
      "t-limited-reach": {
        note: "Postpartum coverage alone does not fix shortages of postpartum care.",
      },
    },
    worsens: ["nursing-shortage", "t-limited-reach"],
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
    how: {
      "maternal-mortality": {
        note: "Required hemorrhage and hypertension protocols and review of every death provide a proven, low-cost approach to maternal safety.",
      },
      "t-dependent-reforms": {
        note: "Maternal safety protocols and death reviews depend on hospital participation and data reporting.",
        hurts: ["providers"],
      },
      "t-imperfect-targeting": {
        note: "Smaller rural hospitals may lack the resources needed to adopt maternal safety protocols and death reviews.",
      },
    },
    mend: ["Fund rural hospitals to adopt bundles"],
    worsens: ["t-dependent-reforms", "t-imperfect-targeting"],
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
    how: {
      safety: {
        note: "National reporting, public reports, and investigation allow learning from errors across the system, while a no-blame approach encourages reporting.",
      },
      "t-oversight-limits": {
        note: "Adverse-event reporting still leaves some events unreported despite its no-blame design.",
        hurts: ["clinicians"],
      },
      "t-dependent-reforms": {
        note: "Adverse-event reports are useful only when someone acts on them.",
      },
    },
    mend: ["Legal protection for reports so clinicians are not sued based on them"],
    worsens: ["t-oversight-limits", "t-dependent-reforms"],
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
    how: {
      safety: {
        note: "Registering each resident with a coordinating primary care practice reduces duplicate tests and lets a clinician see the whole picture.",
      },
      "t-reduced-flexibility": {
        note: "Primary care coordination through registration introduces gatekeeping that limits direct specialist access.",
      },
      "physician-shortage": {
        note: "Registering every resident with primary care requires enough primary care clinicians.",
      },
    },
    mend: ["Allow self-referral for some specialties"],
    worsens: ["t-reduced-flexibility", "physician-shortage"],
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
    how: {
      disparities: {
        note: "Additional payments based on area deprivation direct money toward the greatest needs and support safety-net providers.",
        helps: ["providers"],
      },
      "t-imperfect-targeting": {
        note: "Deprivation-based payments rely on imperfect indices to allocate funding.",
        hurts: ["high-price-providers"],
      },
      "t-income-loss": {
        note: "Deprivation-based payments leave providers in wealthier areas receiving less.",
      },
    },
    worsens: ["t-imperfect-targeting", "t-income-loss"],
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
    worsens: ["t-limited-reach"],
    how: {
      disparities: {
        note: "Universal coverage and uniform payment rates provide a simple way to end payer-based discrimination, including turning away Medicaid patients. Disparities can shrink but still remain under universal coverage.",
      },
      "t-limited-reach": {
        note: "Universal coverage and uniform rates do not address nonfinancial barriers such as distance, language, and trust.",
      },
    },
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
    how: {
      malpractice: {
        note: "Compensating injured patients from a fund without requiring a lawsuit provides faster, fairer compensation and reduces defensive medicine, with discipline handled separately.",
      },
      "t-reduced-compensation": {
        note: "Compensation without lawsuits provides smaller payouts for severe injuries.",
      },
      "t-income-loss": {
        note: "Compensation through a fund instead of lawsuits leaves lawyers with fewer cases.",
      },
      "low-value-care": {
        note: "Compensating injured patients without lawsuits reduces defensive medicine.",
      },
    },
    worsens: ["t-reduced-compensation", "t-income-loss"],
    solves: ["low-value-care"],
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
        note: "GAO’s 1993 report states that Maine guidelines for 20 conditions and procedures in four specialties acquired the force and effect of state law on January 1, 1992, for the participating-physician liability demonstration.",
        sourceIds: ["malpractice-safe-harbor-u-s-government-accountab-1993"],
      },
    ],
    how: {
      malpractice: {
        note: "Protecting clinicians from liability when they follow recognized guidelines reduces defensive medicine and encourages guideline use.",
      },
      "t-reduced-flexibility": {
        note: "Liability protection relies on following recognized guidelines, which may not fit every patient.",
        hurts: ["heavy-care-users"],
      },
      "t-reduced-compensation": {
        note: "Protecting clinicians who follow guidelines removes a route to compensation for patients harmed by that care.",
      },
    },
    mend: ["Pair with a no-fault fund"],
    worsens: ["t-reduced-flexibility", "t-reduced-compensation"],
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
    how: {
      "admin-cost": {
        note: "A common claims format, codes, and rules produces substantial savings for providers and payers. Immediate payment ends accounts receivable.",
        helps: ["providers"],
      },
      "t-systems-implementation": {
        note: "Building a unified claims and payment system is a large information technology project with a risk of failure.",
        hurts: ["health-admin-vendors"],
      },
      cybersecurity: {
        note: "Concentrating claims in a single system makes that system a target for cyberattacks.",
      },
    },
    mend: ["Retrain clearinghouse staff"],
    worsens: ["t-systems-implementation", "cybersecurity"],
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
    how: {
      "admin-cost": {
        note: "Identical insurer forms, codes, prior authorization rules, and credentialing reduce provider paperwork while retaining multiple payers. Savings are smaller than with a single payer.",
        helps: ["providers"],
      },
      "burnout-admin": {
        note: "Requiring insurers to use identical forms, codes, prior authorization rules, and credentialing reduces provider paperwork.",
      },
      "x-plan-choice": {
        note: "Standardizing insurer rules retains multiple payers rather than replacing them with a single payer.",
      },
      "t-political-resistance": {
        note: "Insurers may resist requirements to give up their own forms, codes, and rules.",
      },
    },
    worsens: ["t-political-resistance"],
    solves: ["burnout-admin", "x-plan-choice"],
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
    how: {
      "billing-jobs": {
        note: "Wage replacement, retraining, and job placement support workers displaced by administrative savings. The program uses part of those savings to help workers move into growing health jobs.",
      },
      "t-delayed-benefits": {
        note: "Wage replacement, retraining, and job placement for displaced billing workers are costly.",
        hurts: ["taxpayers"],
      },
      "t-workforce-adjustment": {
        note: "Retraining displaced billing workers for care coordination, aide, or information technology jobs has variable success.",
      },
    },
    worsens: ["t-delayed-benefits", "t-workforce-adjustment"],
    changes: ["Fund wage replacement, retraining, and placement for displaced workers"],
  }),
  path({
    id: "billing-redeploy",
    problemId: "billing-jobs",
    title: "Redeploy billing staff to care coordination",
    summary: "Hire displaced staff into patient navigation and scheduling roles in the new system.",
    precedents: [{ place: "N/A", note: "Proposed; no large precedent." }],
    how: {
      "billing-jobs": {
        note: "Hiring displaced billing staff into patient navigation and scheduling keeps experienced staff in health care and fills growing navigation needs. These roles provide fewer jobs than are eliminated.",
      },
      "t-workforce-adjustment": {
        note: "Patient navigation and scheduling require skills that differ from those used in billing.",
      },
    },
    worsens: ["t-workforce-adjustment"],
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
        note: "Between 2011 and 2017, IQWiG assessed 216 German-market drug approvals, comprising 152 new molecular entities and 64 new indications, and found no proven added benefit over standard care in 125 assessments (58%).",
        sourceIds: ["lowvalue-coverage-list-the-bmj-2019"],
      },
    ],
    how: {
      "low-value-care": {
        note: "A public body uses evidence to stop covering services proven not to work, saving money and protecting patients from harmful care.",
      },
      safety: {
        note: "Stopping coverage of services proven not to work protects patients from harmful care.",
      },
      "x-central-rationing": {
        note: "A public body deciding which services to stop covering can generate controversy over coverage decisions.",
      },
      "t-uncertain-evidence": {
        note: "Decisions to stop covering services depend on evidence that is often incomplete.",
      },
    },
    worsens: ["t-uncertain-evidence"],
    solves: ["safety"],
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
        note: "Among older Medicare fee-for-service beneficiaries, receipt of at least one of 32 measured low-value services declined from 36.3% in 2014 to 33.6% in 2018, a descriptive trend that does not isolate the effect of voluntary guidelines or clinician feedback.",
        sourceIds: ["lowvalue-nudges-jama-network-open-2021"],
      },
    ],
    how: {
      "low-value-care": {
        note: "Reporting low-value care rates and using electronic record alerts offers an inexpensive way to discourage low-value care while respecting clinician judgment.",
      },
      "t-limited-reach": {
        note: "Feedback on low-value care rates and electronic record alerts have only small effects.",
      },
      "burnout-admin": {
        note: "Electronic record alerts about low-value care can cause alert fatigue for clinicians.",
      },
    },
    worsens: ["t-limited-reach", "burnout-admin"],
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
    how: {
      fraud: {
        note: "A unified data system sees all billing and detects suspicious claims before payment. Audits and prosecution complement detection that stops payments before they go out.",
      },
      "t-administrative-work": {
        note: "Pre-payment fraud detection can flag legitimate claims incorrectly and delay their payment.",
      },
      "t-enforcement-burden": {
        note: "Fraudsters adapt to claims analytics, complicating detection, audits, and prosecution.",
      },
    },
    mend: ["Fast appeals for flagged claims"],
    worsens: ["t-administrative-work", "t-enforcement-burden"],
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
        note: "CMS reported Miami-Dade’s active home health agencies grew from 385 in 2008 to 662 in 2012, a 15% compound annual increase, and that 56% had not billed continuously since 2008, a category including new entrants rather than necessarily intermittent billers.",
        sourceIds: ["fraud-enrollment-centers-for-medicare-med-2013"],
      },
    ],
    how: {
      fraud: {
        note: "Background checks, site visits, and enrollment moratoriums target high-fraud provider categories and stop fraud before payment.",
      },
      "t-administrative-work": {
        note: "Background checks, site visits, and enrollment restrictions slow legitimate new providers.",
        hurts: ["providers"],
      },
      "shortage-areas": {
        note: "Moratoriums on new providers in high-fraud categories can reduce access to care.",
      },
    },
    worsens: ["t-administrative-work", "shortage-areas"],
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
        note: "RTI’s 2024 report, using 2021 claims, found medical/surgical office-visit reimbursement averaged 21.7% higher than behavioral-health reimbursement and behavioral-health out-of-network clinician use was 3.5 times as frequent, without establishing that the payment disparity caused that difference.",
        sourceIds: ["mh-parity-pay-rti-international-2024"],
      },
    ],
    how: {
      "mental-health-access": {
        note: "Raising payment rates encourages therapists and psychiatrists to accept insurance and reduces cash-only practice.",
        helps: ["clinicians", "heavy-care-users"],
      },
      "t-higher-spending": {
        note: "Raising payment rates for therapists and psychiatrists is costly.",
      },
      "t-delayed-benefits": {
        note: "Higher payment rates do not add mental health clinicians quickly.",
      },
    },
    worsens: ["t-higher-spending", "t-delayed-benefits"],
    changes: ["Raise mental health rates to parity with medical care"],
  }),
  path({
    id: "mh-stepped",
    problemId: "mental-health-access",
    title: "Stepped care and integration into primary care",
    summary:
      "Self-referral to talking therapies, collaborative care in primary care, crisis lines.",
    precedents: [{ place: "NHS Talking Therapies", note: "Self-referral, stepped care model." }],
    how: {
      "mental-health-access": {
        note: "Self-referral to talking therapies, collaborative primary care, and crisis lines provide substantial capacity at low cost. Patients can refer themselves without a doctor visit.",
        helps: ["heavy-care-users"],
      },
      "wait-times": {
        note: "Stepped care can leave patients waiting for higher-intensity mental health care.",
      },
      "x-metric-gaming": { note: "Outcome targets in stepped mental health care can be gamed." },
    },
    worsens: ["wait-times"],
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
        note: "The French study reported approximately 65,000 buprenorphine patients annually—about ten times the number treated under restrictive methadone policies—and a coincident 79% decline in overdose deaths from 1995 to 1999.",
        sourceIds: ["addiction-mat-the-american-journal-on--2004"],
      },
    ],
    how: {
      addiction: {
        note: "Allowing clinicians to prescribe buprenorphine and offering methadone in pharmacies and primary care reduces overdose deaths. Treatment in ordinary clinics also reduces stigma.",
      },
      fraud: {
        note: "Broader access to buprenorphine and methadone raises concerns about medication diversion.",
      },
      "t-political-resistance": {
        note: "Some clinicians are reluctant to prescribe medication for addiction despite broader prescribing access.",
      },
    },
    worsens: ["fraud", "t-political-resistance"],
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
    how: {
      addiction: {
        note: "Funding naloxone, drug checking, and supervised consumption sites reduces deaths and connects people to treatment.",
      },
      "t-political-resistance": {
        note: "Supervised consumption sites and other harm reduction services face community opposition and legal uncertainty.",
      },
    },
    mend: ["Site selection with community input"],
    worsens: ["t-political-resistance"],
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
        note: "Germany introduced mandatory long-term-care insurance in 1995 with a 1.0% gross-income contribution, rising to 1.7% in July 1996, replacing much public assistance previously received by about 80% of nursing-home residents.",
        sourceIds: ["ltc-social-insurance-the-milbank-quarterly-2000"],
      },
    ],
    how: {
      "ltc-spend-down": {
        note: "Public insurance covering home and nursing care based on need rather than income ends spend-down and covers home care.",
      },
      "x-woodwork": {
        note: "Covering home and nursing care through public insurance is expensive, and demand grows.",
      },
      "x-new-taxes": { note: "Separate public long-term care insurance requires a new tax." },
    },
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
    how: {
      "ltc-spend-down": {
        note: "Raising Medicaid asset limits and expanding home care ends waitlists at lower cost than universal long-term care insurance. Spend-down remains, and the middle class remains unprotected.",
        helps: ["low-middle-income"],
        hurts: ["taxpayers"],
      },
      "wait-times": { note: "Expanding Medicaid home care ends waitlists for those services." },
    },
    solves: ["wait-times"],
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
        note: "In England in 2011, the Dilnot Commission recommended a £35,000 cap on lifetime individual care contributions, while its briefing described one in ten people over 65 facing care costs exceeding £100,000.",
        sourceIds: ["ltc-catastrophic-the-king-s-fund-2011"],
      },
    ],
    how: {
      "ltc-spend-down": {
        note: "Public coverage after a waiting period protects against financial ruin at lower cost and encourages private insurance for the early period of care. Families still pay the initial costs.",
      },
      "t-limited-reach": {
        note: "Coverage after a waiting period relies on private insurance or savings for initial care, but the private long-term care insurance market is weak.",
        hurts: ["taxpayers"],
      },
    },
    worsens: ["t-limited-reach"],
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
    how: {
      "nursing-home-quality": {
        note: "Staffing minimums and minimum spending on care improve nursing home care. Disclosure of related-party payments exposes money diverted to related companies.",
      },
      "x-staffing-mandate-cost": {
        note: "Staffing minimums are costly and may cause facilities to close.",
      },
      "shortage-areas": {
        note: "Nursing homes have difficulty hiring to meet staffing minimums in shortage areas.",
      },
    },
    mend: ["Fund through rates"],
    worsens: ["shortage-areas"],
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
        note: "Denmark’s nursing-home beds declined 30% between 1985 and 1997 as home services and adapted housing expanded; the cited paper dates legislation limiting new nursing-home construction to 1988.",
        sourceIds: ["nh-small-homes-the-gerontologist-2001"],
      },
    ],
    how: {
      "nursing-home-quality": {
        note: "Funding small-house models and home care instead of large institutions improves quality of life and reduces infections.",
      },
      safety: {
        note: "Shifting care from large institutions to small homes and home care reduces infections.",
      },
      "t-delayed-benefits": {
        note: "Moving from large institutions to small homes and home care brings transition costs.",
      },
      "t-higher-spending": { note: "Smaller care homes cost more per resident." },
    },
    worsens: ["t-delayed-benefits", "t-higher-spending"],
    solves: ["safety"],
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
    how: {
      "hospice-for-profit": {
        note: "Enrollment moratoriums in high-fraud areas, audits of long stays, and ownership disclosure target hospice fraud and protect patients.",
      },
      fraud: {
        note: "Moratoriums in high-fraud areas, audits of long hospice stays, and ownership disclosure target hospice fraud.",
      },
      "t-administrative-work": {
        note: "Hospice enrollment restrictions slow legitimate growth, and audits of long stays are costly.",
      },
    },
    worsens: ["t-administrative-work"],
    solves: ["fraud"],
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
    how: {
      "hospice-for-profit": {
        note: "Restricting hospice provision to nonprofit or public organizations removes the profit motive and follows the approach of peer countries.",
      },
      "provider-exit": {
        note: "Restricting hospice provision to nonprofit or public organizations can reduce capacity when for-profit providers exit.",
      },
      "t-delayed-benefits": { note: "Buying out for-profit hospice providers is costly." },
    },
    mend: ["Buyout or conversion"],
    worsens: ["provider-exit", "t-delayed-benefits"],
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
    how: {
      "dental-gap": {
        note: "Including dental care in the standard benefit closes a major coverage gap for care that affects overall health.",
      },
      "t-higher-spending": { note: "Including dental care in the standard benefit is expensive." },
      "wait-times": {
        note: "Dentist capacity is limited, so covering dental care in the standard benefit is likely to create waits for dentists.",
      },
    },
    costIds: ["nhe-dental"],
    worsens: ["wait-times", "t-higher-spending"],
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
    how: {
      "dental-gap": {
        note: "Covering exams, cleanings, fillings, and extractions meets most dental needs at lower cost. Limited coverage for crowns and implants leaves gaps for major dental work.",
      },
      "x-copay-billing": { note: "Limited dental coverage requires copays or coverage limits." },
    },
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
    how: {
      "prevention-underfunded": {
        note: "Reserving a fixed share of health spending for public health provides stable funding and protects it from cuts.",
      },
      "t-funding-instability": {
        note: "Reserving health spending for public health competes with treatment for funding.",
        hurts: ["taxpayers"],
      },
      "t-oversight-limits": {
        note: "The results of protected public health spending are hard to see.",
      },
    },
    worsens: ["t-funding-instability", "t-oversight-limits"],
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
    how: {
      "prevention-underfunded": {
        note: "Removing charges for screening, vaccines, and preventive visits increases use and provides a simple coverage rule to explain.",
      },
      "low-value-care": { note: "Free screening can increase use of screening that is low-value." },
      "t-higher-spending": {
        note: "Removing charges for preventive services raises costs as use increases.",
      },
    },
    worsens: ["low-value-care", "t-higher-spending"],
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
    how: {
      "social-needs": {
        note: "Health-system payments for housing support, medically tailored meals, and rides target drivers of illness and can pay for themselves in some cases.",
      },
      "t-funding-instability": {
        note: "Paying for housing support, meals, and rides stretches health budgets.",
        hurts: ["taxpayers"],
      },
      "t-workforce-adjustment": {
        note: "Paying for housing support asks health systems to work in an area where they lack housing expertise.",
      },
    },
    worsens: ["t-funding-instability", "t-workforce-adjustment"],
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
        note: "Strong social programs outside health.",
      },
    ],
    how: {
      "social-needs": {
        note: "Direct funding gives housing and food agencies clear responsibility for work they know. It avoids stretching health budgets with nonmedical spending.",
        helps: ["taxpayers"],
      },
      "t-limited-reach": {
        note: "Funding housing and food outside health care leaves the health system unable to act directly when a patient’s housing is making them sick.",
        hurts: ["homeless-people"],
      },
      "t-administrative-work": {
        note: "Separate housing, food, and health programs depend on coordination across agencies, which is weak in the United States.",
      },
    },
    mend: ["Fund social workers in clinics to connect patients with outside programs"],
    worsens: ["t-limited-reach", "t-administrative-work"],
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
        note: "Every resident of Estonia has a nationwide digital health record; the system handles about 2.7 million patient queries a month, and 100% of prescriptions are digital.",
        sourceIds: ["interop-national-e-estonia-2024"],
      },
    ],
    how: {
      interoperability: {
        note: "A national record follows patients everywhere and reduces duplicate tests and medication errors.",
      },
      "low-value-care": {
        note: "A national record that follows patients reduces duplicate tests.",
      },
      safety: { note: "A national record that follows patients reduces medication errors." },
      privacy: {
        note: "A national patient record concentrates health information in a large database, creating privacy risks.",
      },
      cybersecurity: {
        note: "A national patient record places information in a large database with security risks.",
      },
      "t-systems-implementation": {
        note: "Creating a national patient record is a large information technology project.",
      },
    },
    mend: ["Retrain staff; keep vendors as contractors"],
    solves: ["low-value-care", "safety"],
    worsens: ["privacy", "cybersecurity", "t-systems-implementation"],
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
    how: {
      interoperability: {
        note: "Enforcing record-sharing interfaces and banning information blocking builds on existing law while retaining market competition.",
        helps: ["health-admin-vendors"],
      },
      "t-delayed-benefits": {
        note: "Enforcing record-sharing standards is slow, and vendors may comply only minimally.",
      },
      "t-systems-implementation": {
        note: "Record-sharing standards keep changing, requiring systems to adapt.",
      },
    },
    worsens: ["t-delayed-benefits", "t-systems-implementation"],
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
        note: "CMS reported more than $3.26 billion in Change Healthcare emergency payments in June 2024, comprising over $2.55 billion to more than 4,200 Part A providers and over $717.18 million through 4,722 Part B advance payments.",
        sourceIds: ["cyber-standards-centers-for-medicare-med-2024"],
      },
    ],
    how: {
      cybersecurity: {
        note: "Minimum security rules improve resilience against attacks, while backup payments keep providers paid during outages.",
        helps: ["heavy-care-users"],
      },
      "t-administrative-work": {
        note: "Complying with minimum security rules adds costs for providers.",
        hurts: ["providers"],
      },
      "t-imperfect-targeting": {
        note: "Minimum security requirements are hardest for small providers to meet.",
      },
    },
    mend: ["Grants for small and rural providers"],
    worsens: ["t-administrative-work", "t-imperfect-targeting"],
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
        note: "AHA’s March 2024 survey of about 1,000 hospitals found 94% reported financial effects and 74% patient-care effects; among hospitals reporting cash-flow effects, nearly 60% reported revenue impacts of at least $1 million per day.",
        sourceIds: ["cyber-redundant-american-hospital-associ-2024"],
      },
    ],
    how: {
      cybersecurity: {
        note: "Redundant public claims infrastructure and an offline fallback avoid a single point of failure and allow care to continue during outages. Redundancy also leaves more systems to secure.",
        helps: ["future-care-users"],
      },
      "t-higher-spending": {
        note: "Running redundant public claims infrastructure with an offline fallback is costly.",
      },
    },
    worsens: ["t-higher-spending"],
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
    how: {
      privacy: {
        note: "Extending privacy protections and requiring strict access logs protects patients, including in apps and data brokers that existing health privacy protections miss.",
      },
      "t-reduced-data": {
        note: "Extending privacy restrictions to apps and data brokers limits research.",
      },
      "t-administrative-work": {
        note: "Extended privacy protections and strict access logs bring compliance costs.",
      },
    },
    mend: ["Research exemptions with safeguards"],
    worsens: ["t-reduced-data", "t-administrative-work"],
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
        note: "Between 31 May and 30 June 2021, England recorded 1,339,862 additional national data opt-outs, increasing the opt-out share of people registered with GP practices from 2.77% to 4.97%.",
        sourceIds: ["privacy-opt-out-bjgp-open-2024"],
      },
    ],
    how: {
      privacy: {
        note: "Allowing patients to opt out of sharing health information gives them a choice and builds trust.",
      },
      "t-reduced-data": {
        note: "Patient opt-outs leave gaps in shared health data. Higher opt-out rates in some groups can bias research.",
        hurts: ["researchers"],
      },
    },
    worsens: ["t-reduced-data"],
    changes: ["Create an opt-out of national record sharing"],
  }),
]
