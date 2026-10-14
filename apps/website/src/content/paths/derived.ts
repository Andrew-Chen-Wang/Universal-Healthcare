/**
 * Subpaths: solutions to problems that other paths create (the x-* problems).
 */
import { path } from "./types"

export const DERIVED_PATHS = [
  // ---- plan choice ----
  path({
    id: "choice-accountability",
    problemId: "x-plan-choice",
    title: "Hold the single payer to service standards",
    summary:
      "Publish service metrics (call wait, claim time, appeal outcomes), give an ombudsman power to order fixes, and let patients choose any provider.",
    precedents: [
      {
        place: "Taiwan",
        note: "High public satisfaction with NHI despite no plan choice.",
        sourceIds: ["taiwan-nhi"],
      },
    ],
    pros: ["Accountability without competing insurers", "Patients can still choose any provider"],
    cons: ["Depends on political will to enforce", "Metrics can be gamed"],
    whoGains: ["Patients"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    spawns: ["x-metric-gaming"],
    changes: ["Publish service metrics", "Create an ombudsman with enforcement power"],
  }),
  path({
    id: "choice-supplemental",
    problemId: "x-plan-choice",
    title: "Private supplemental plans for extras",
    summary:
      "People can buy private plans for things outside the public benefit (private rooms, extra therapies), keeping some insurer choice.",
    precedents: [
      {
        place: "France",
        note: "In France, over 95% of the population holds voluntary complementary health insurance to cover statutory cost-sharing, and nearly 20% receives state-subsidized complementary coverage (2023).",
        sourceIds: ["choice-supplemental-european-observatory-on--2023"],
      },
    ],
    pros: ["Choice remains for extras", "Some insurer jobs survive"],
    cons: ["Better care for those who can pay", "Supplemental plans can drive up use"],
    whoGains: ["Insurers, people who value extras"],
    whoLoses: ["Equity"],
    mend: ["N/A"],
    spawns: ["x-copay-billing"],
    complements: ["twotier-supplemental"],
    changes: ["Allow supplemental plans for extras"],
  }),
  path({
    id: "choice-regional-plans",
    problemId: "x-plan-choice",
    title: "Let people choose among public care organizations",
    summary:
      "One public payer, but people pick among competing integrated care organizations (e.g., Kaiser-style groups) paid by capitation.",
    precedents: [
      {
        place: "Sweden (regional choice reforms)",
        note: "Free choice of primary care provider with money following the patient.",
      },
      {
        place: "Sweden",
        note: "A 2022 review reports private ownership of 44% of Swedish primary care centres, compared with about 30% before reform, and cites an earlier three-region survey in which about 60% felt they had chosen their provider.",
        sourceIds: ["choice-regional-plans-scandinavian-journal-of--2022"],
      },
    ],
    pros: ["Competition on service without multiple insurers", "Integrated care"],
    cons: ["Capitation risks", "Limited in rural areas"],
    whoGains: ["Integrated systems"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    requires: ["capitation"],
    changes: ["Let people choose among public care organizations paid by capitation"],
  }),

  // ---- new taxes ----
  path({
    id: "tax-payroll",
    problemId: "x-new-taxes",
    title: "Payroll tax (employer and employee)",
    summary:
      "Replace premiums mainly with a payroll tax, similar to what employers already pay in premiums.",
    precedents: [
      { place: "Germany, France", note: "Payroll contributions fund most care." },
      {
        place: "Germany",
        note: "German statutory health insurance is funded mainly by a payroll contribution of 14.6% of earnings, shared equally by employers and employees, plus a fund-specific supplementary rate (2026).",
        sourceIds: ["tax-payroll-bundesministerium-f-r-ge-2024"],
      },
    ],
    pros: ["Mirrors today's flows", "Easy to collect"],
    cons: ["Only taxes wages, not investment income", "Hurts low-wage firms"],
    whoGains: ["Firms that offered coverage"],
    whoLoses: ["Firms that did not"],
    mend: ["Phase in for small businesses"],
    spawns: ["x-wage-incidence"],
    changes: ["Enact a health payroll tax split between employer and employee"],
  }),
  path({
    id: "tax-income",
    problemId: "x-new-taxes",
    title: "Progressive income tax (including capital income)",
    summary: "Fund mostly from a health income tax that also covers capital gains and dividends.",
    precedents: [
      { place: "Canada, UK", note: "Mostly general revenue." },
      {
        place: "United Kingdom",
        note: "In the UK, government-financed healthcare funded primarily through general taxation accounted for 81% of total healthcare expenditure (£280 billion) in 2025.",
        sourceIds: ["tax-income-office-for-national-stat-2025"],
      },
    ],
    pros: ["Most progressive", "Broad base"],
    cons: ["High earners pay much more", "May reduce investment"],
    whoGains: ["Low- and middle-income households"],
    whoLoses: ["High earners"],
    mend: ["N/A"],
    changes: ["Enact a progressive health income tax including capital income"],
  }),
  path({
    id: "tax-vat",
    problemId: "x-new-taxes",
    title: "Value-added tax",
    summary: "A broad consumption tax dedicated to health.",
    precedents: [
      { place: "Most OECD countries", note: "VATs fund large shares of public spending." },
      {
        place: "OECD countries",
        note: "Across OECD countries that levy a value-added tax (all except the U.S.), VAT revenue accounted on average for almost 22% of total tax revenue in 2022, serving as a primary pillar of public finance.",
        sourceIds: ["tax-vat-tax-foundation-2024"],
      },
    ],
    pros: ["Large revenue at low rates", "Hard to avoid"],
    cons: ["Regressive unless paired with rebates", "New collection system"],
    whoGains: ["N/A"],
    whoLoses: ["Low-income consumers (without rebates)"],
    mend: ["Per-person rebate"],
    changes: ["Enact a VAT dedicated to health with per-person rebates"],
  }),
  path({
    id: "tax-mix",
    problemId: "x-new-taxes",
    title: "A mix of payroll, income, and redirected spending",
    summary:
      "Combine redirected public spending, employer contributions, and a household income-based contribution.",
    precedents: [
      {
        place: "Taiwan",
        note: "A June 2025 article describes Taiwan NHI premiums as 5.17% of monthly income, contributing 89% of its annual budget, and describes the government contribution as statutorily capped at 36%.",
        sourceIds: ["tax-mix-health-and-human-rights--2024"],
      },
    ],
    pros: ["Spreads burden", "Lower rates on each base"],
    cons: ["More complex", "Harder to explain"],
    whoGains: ["N/A"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: [
      "Combine redirected spending, employer contributions, and income-based contributions",
    ],
  }),

  // ---- wage incidence ----
  path({
    id: "wage-small-exempt",
    problemId: "x-wage-incidence",
    title: "Phase in employer taxes for small and low-wage firms",
    summary: "Lower rates for small firms and on the first part of wages.",
    precedents: [
      {
        place: "France",
        note: "In France, employer social contributions on low-wage workers are phased down via a degressive reduction, offering up to a 39.8% to 40.2% maximum contribution exemption at minimum wage (phasing out up to 3 times SMIC in 2026).",
        sourceIds: ["wage-small-exempt-service-public-fr-2026"],
      },
    ],
    pros: ["Protects low-wage jobs", "Small businesses avoid a sudden cost"],
    cons: ["Less revenue", "Firms may split to stay small"],
    whoGains: ["Low-wage workers"],
    whoLoses: ["Taxpayers (less revenue)"],
    mend: ["N/A"],
    changes: ["Phase in employer taxes for small and low-wage firms"],
  }),
  path({
    id: "wage-no-employer",
    problemId: "x-wage-incidence",
    title: "No employer tax: fund from households directly",
    summary: "Employers pay nothing; they must pass former premium spending into wages.",
    precedents: [{ place: "N/A", note: "Wage pass-through mandates are untested." }],
    pros: ["No wage loss at non-offering firms", "Simpler for employers"],
    cons: ["Hard to enforce wage pass-through", "Higher household taxes"],
    whoGains: ["Low-wage workers"],
    whoLoses: ["Households"],
    mend: ["N/A"],
    requires: ["tax-income"],
    changes: [
      "Fund health from households only",
      "Require wage pass-through for a transition period",
    ],
  }),

  // ---- copay billing ----
  path({
    id: "copay-auto-exempt",
    problemId: "x-copay-billing",
    title: "Automatic exemptions and annual collection through taxes",
    summary:
      "No money changes hands at the visit. Charges are tallied by the payer, capped by income, waived automatically for low-income people using tax data, and settled once a year on the tax return.",
    precedents: [
      {
        place: "Germany",
        note: "German copayments are capped each year at 2% of gross household income (1% for people with serious chronic illness); amounts above the cap are exempt on application.",
        sourceIds: ["copay-auto-exempt-bundesministerium-f-r-ge-2024"],
      },
      {
        place: "Sweden",
        note: "Annual high-cost ceiling; care is free after the ceiling for the rest of the year.",
      },
    ],
    pros: ["Keeps a price signal without visit-level billing", "No debt collection at providers"],
    cons: [
      "Still needs a charge ledger and tax integration",
      "The price signal is weaker when bills arrive a year later",
    ],
    whoGains: ["Providers (no front-desk collection)", "Low-income people (automatic exemption)"],
    whoLoses: ["Billing and collections vendors"],
    mend: ["Transition program for collections staff"],
    complements: ["underins-income-cap"],
    changes: ["Create a charge ledger", "Cap charges by income", "Settle annually on tax returns"],
  }),
  path({
    id: "copay-none",
    problemId: "x-copay-billing",
    title: "Drop point-of-care charges entirely",
    summary: "Remove the problem at its source: no copays for covered services.",
    precedents: [
      { place: "UK, Canada", note: "No charges for covered hospital and physician care." },
      {
        place: "Canada",
        note: "Under the Canada Health Act, provinces must prohibit point-of-care patient charges for medically necessary care or face dollar-for-dollar federal transfer deductions, under which $62.2 million was levied in March 2025.",
        sourceIds: ["copay-none-health-canada-2025"],
      },
    ],
    pros: ["No billing apparatus at all", "No deterrence of needed care"],
    cons: ["Use of care rises", "Higher taxes"],
    whoGains: ["Patients"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    requires: ["underins-zero"],
    worsens: ["wait-times"],
    changes: ["Remove all point-of-care charges"],
  }),
  path({
    id: "copay-flat-small",
    problemId: "x-copay-billing",
    title: "Only flat, small charges on a few services",
    summary:
      "Limit charges to a few flat fees (e.g., a small emergency-room fee for non-emergencies, a per-prescription fee) with exemptions for children, the poor, and chronic illness.",
    precedents: [
      {
        place: "UK (England)",
        note: "Flat prescription charge with about 89% of items dispensed free due to exemptions.",
      },
      {
        place: "United Kingdom (England)",
        note: "In England, where the NHS levies a flat prescription charge, approximately 89% of items dispensed in the community are free of charge due to age, medical, and income exemptions (2023).",
        sourceIds: ["copay-flat-small-department-of-health-and-2023"],
      },
    ],
    pros: ["Simple", "Targets specific overuse"],
    cons: ["Deters near-poor", "Still needs collection"],
    whoGains: ["Taxpayers"],
    whoLoses: ["Near-poor patients"],
    mend: ["Prepayment certificates that cap annual charges"],
    changes: ["Set a few flat fees with exemptions"],
  }),

  // ---- central rationing ----
  path({
    id: "rationing-transparent-hta",
    problemId: "x-central-rationing",
    title: "Independent, transparent coverage body with appeals",
    summary:
      "An arm's-length agency evaluates evidence and cost in public meetings with patient representatives, publishes reasons, and allows appeals and reconsideration when new evidence appears.",
    precedents: [
      { place: "UK NICE", note: "Published methods, consultations, and an appeals panel." },
      {
        place: "Germany G-BA and IQWiG",
        note: "Benefit assessment with patient representatives (non-voting).",
      },
      {
        place: "United Kingdom",
        note: "NICE's technology-appraisal appeal procedure allows consultees 15 working days after final draft guidance is issued to submit an appeal before final guidance.",
        sourceIds: ["rationing-transparent-hta-national-institute-for-h-2024"],
      },
    ],
    pros: ["Decisions are explainable and consistent", "Less political interference"],
    cons: ["Slow", "Hard 'no' decisions still happen and are contested"],
    whoGains: ["Patients overall (consistent rules)"],
    whoLoses: ["Makers of low-value products"],
    mend: ["Exceptional-case route for individual patients"],
    changes: ["Create an independent coverage agency with public meetings and appeals"],
  }),
  path({
    id: "rationing-no-qaly",
    problemId: "x-central-rationing",
    title: "Cover everything clinically effective, without cost thresholds",
    summary:
      "Ban cost-per-QALY thresholds; cover any treatment shown to work and control cost through price negotiation instead.",
    precedents: [
      {
        place: "U.S. Medicare",
        note: "Covers what is 'reasonable and necessary' and is barred from using QALYs.",
      },
      {
        place: "United States",
        note: "KFF explains that the Inflation Reduction Act prohibits using QALY-based health outcomes evidence in Medicare's negotiation of a maximum fair drug price.",
        sourceIds: ["rationing-no-qaly-kff-2024"],
      },
    ],
    pros: ["Fewer denials", "No 'death panel' perception"],
    cons: ["Higher spending", "Weaker leverage"],
    whoGains: ["Patients needing expensive treatments", "Manufacturers"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    worsens: ["underfunding"],
    conflicts: ["rationing-transparent-hta"],
    changes: ["Ban cost-per-QALY thresholds"],
  }),
  path({
    id: "rationing-clinician-exceptions",
    problemId: "x-central-rationing",
    title: "Clinician-led exceptions with fast review",
    summary:
      "Clinicians can request coverage for individual patients outside the standard list, decided within days by a clinical panel.",
    precedents: [
      { place: "NHS England Individual Funding Requests", note: "Case-by-case exceptions." },
      {
        place: "United Kingdom (England)",
        note: "A study first published in 2020 found IFR decline rates of 71% for NHS England and 34% for CCGs, with lack of exceptionality cited for 42 of 45 declined requests submitted in 2016–2018.",
        sourceIds: ["rationing-clinician-exceptions-british-journal-of-clini-2020"],
      },
    ],
    pros: ["Flexibility for unusual cases", "Clinician-driven"],
    cons: ["Inconsistent decisions", "Equity concerns"],
    whoGains: ["Patients with rare needs"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    complements: ["rationing-transparent-hta"],
    changes: ["Create a fast clinician exception process"],
  }),

  // ---- budget rationing ----
  path({
    id: "budget-volume-adjust",
    problemId: "x-budget-rationing",
    title: "Budgets adjust automatically for population, age, and volume",
    summary:
      "Each year's budget is recalculated for population growth, aging, and unexpected volume, so demand growth doesn't produce queues.",
    precedents: [
      {
        place: "Maryland",
        note: "Global budgets adjust for demographics and market shifts.",
        sourceIds: ["maryland-model"],
      },
    ],
    pros: ["Reduces slowdowns", "Fair to growing areas"],
    cons: ["Weaker cost control", "Formula disputes"],
    whoGains: ["Patients, hospitals in growing areas"],
    whoLoses: ["Budget holders"],
    mend: ["N/A"],
    changes: ["Adjust budgets for population, age, and volume"],
  }),
  path({
    id: "budget-mixed",
    problemId: "x-budget-rationing",
    title: "Base budget plus activity payments",
    summary:
      "A budget covers fixed costs; extra procedures above a baseline are paid per case to reward throughput.",
    precedents: [
      {
        place: "Norway, Sweden",
        note: "Mixed budgets plus activity-based funding after long waits in the 1990s.",
      },
      {
        place: "Norway",
        note: "Norway introduced activity-based hospital funding in July 1997; since 2006 it has reimbursed 40% of estimated treatment costs.",
        sourceIds: ["budget-mixed-health-policy-2010"],
      },
    ],
    pros: ["Balances control and productivity", "Cuts queues"],
    cons: ["Volume creep", "More billing"],
    whoGains: ["Patients on waiting lists"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    requires: ["waits-activity-pay"],
    changes: ["Pay base budgets plus activity payments"],
  }),
  path({
    id: "budget-guarantee",
    problemId: "x-budget-rationing",
    title: "Waiting-time guarantees as a backstop",
    summary:
      "Budgets are fixed, but if a hospital exceeds a maximum wait, the patient can be treated elsewhere and the cost is charged to the original hospital's budget.",
    precedents: [
      {
        place: "Denmark",
        note: "In Denmark, coupling a maximum waiting-time guarantee with extended free hospital choice reduced experienced waiting times for elective surgery from about 12 weeks in 2001 to 7.6 weeks in 2011 (2013).",
        sourceIds: ["budget-guarantee-oecd-health-policy-studi-2013"],
      },
    ],
    pros: ["Protects patients", "Keeps budgets"],
    cons: ["Needs spare capacity", "Complex accounting"],
    whoGains: ["Patients"],
    whoLoses: ["Slow hospitals"],
    mend: ["N/A"],
    requires: ["waits-guarantee"],
    changes: ["Charge late hospitals for care elsewhere"],
  }),

  // ---- undertreatment ----
  path({
    id: "under-risk-adjust",
    problemId: "x-undertreatment",
    title: "Risk adjustment plus outcome monitoring",
    summary:
      "Pay more per patient for sicker patients, ban patient selection, and monitor access and outcomes publicly.",
    precedents: [
      {
        place: "UK Quality and Outcomes Framework",
        note: "Pay-for-performance in general practice; improvements leveled off and some gaming occurred.",
      },
      {
        place: "United Kingdom",
        note: "A 2011 study states that approximately 25% of UK GP income was tied to QOF quality targets and describes exception reporting as a safeguard against inappropriate or excessive treatment.",
        sourceIds: ["under-risk-adjust-british-journal-of-gener-2011"],
      },
    ],
    pros: ["Reduces avoidance", "Fair payments"],
    cons: ["Upcoding", "Complex"],
    whoGains: ["Sicker patients"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    spawns: ["x-metric-gaming"],
    changes: ["Risk-adjust capitated payments", "Monitor access and outcomes"],
  }),
  path({
    id: "under-blend",
    problemId: "x-undertreatment",
    title: "Blended payment: part capitation, part fee-for-service",
    summary:
      "A per-patient payment covers basic care and a fee per service rewards doing more for patients who need it.",
    precedents: [
      { place: "Denmark GPs", note: "Roughly 20–30% capitation, the rest fee-for-service." },
      { place: "Ontario family health teams", note: "Blended capitation models." },
      {
        place: "Denmark",
        note: "A 2025 article describes Danish GP remuneration as approximately one-third capitation payments and two-thirds fee-for-service payments.",
        sourceIds: ["under-blend-scandinavian-journal-of--2024"],
      },
    ],
    pros: ["Balances incentives", "Proven abroad"],
    cons: ["More billing", "Complex"],
    whoGains: ["Patients with complex needs"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: ["Blend capitation with fees"],
  }),
  path({
    id: "under-salary",
    problemId: "x-undertreatment",
    title: "Salaried clinicians in public or non-profit groups",
    summary:
      "Clinicians are paid salaries, so there's no direct financial reason to do more or less.",
    precedents: [
      { place: "U.S. VA, Kaiser Permanente; Nordic hospitals", note: "Salaried physicians." },
      {
        place: "Sweden",
        note: "A 2024 Swedish primary-care study describes salaried professionals and centres averaging four GPs and 20 staff, with a mean patient list of 8,280 in its 2016 data.",
        sourceIds: ["under-salary-plos-one-2024"],
      },
    ],
    pros: ["Neutral incentives", "Predictable costs"],
    cons: ["Productivity may fall", "Less autonomy"],
    whoGains: ["Clinicians wanting stability"],
    whoLoses: ["High-volume clinicians"],
    mend: ["Productivity bonuses"],
    changes: ["Pay clinicians salaries in public or nonprofit groups"],
  }),

  // ---- price limits causing exit ----
  path({
    id: "exit-price-floors",
    problemId: "x-price-control-exit",
    title: "Price floors and supply guarantees for essential products",
    summary:
      "Set minimum prices or multi-year contracts for essential generics and services so supply stays profitable.",
    precedents: [
      { place: "Civica Rx", note: "Long-term fixed-price contracts with hospitals." },
      {
        place: "United States",
        note: "Under Civica Rx's fixed-price, long-term contracting model to prevent drug shortages, the nonprofit supplies over 70 essential generic medicines to more than 1,400 hospitals with a target 6-month buffer inventory (2026).",
        sourceIds: ["exit-price-floors-civica-rx-2026"],
      },
    ],
    pros: ["Prevents shortages", "Stable supply"],
    cons: ["Pays more", "Hard to set floors"],
    whoGains: ["Patients, manufacturers"],
    whoLoses: ["Budgets"],
    mend: ["N/A"],
    complements: ["shortages-pay-reliability"],
    changes: ["Set price floors and long-term contracts for essential products"],
  }),
  path({
    id: "exit-monitoring",
    problemId: "x-price-control-exit",
    title: "Monitor supply and adjust prices quickly",
    summary:
      "Track launches, discontinuations, and provider participation; raise prices automatically when supply falls.",
    precedents: [
      {
        place: "Japan",
        note: "In Japan's universal health system covering 126 million people, the government centrally regulates prices through a nationwide uniform fee schedule that is routinely revised every 2 years to adjust provider payments (2021).",
        sourceIds: ["exit-monitoring-health-services-insights-2021"],
      },
    ],
    pros: ["Responsive", "Data-driven"],
    cons: ["Reactive", "Needs data systems"],
    whoGains: ["Patients"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: ["Track launches and discontinuations", "Raise prices when supply falls"],
  }),
  path({
    id: "exit-launch-rules",
    problemId: "x-price-control-exit",
    title: "Require timely U.S. launch as a condition of market access",
    summary: "Link favorable pricing to launching in the U.S. promptly.",
    precedents: [{ place: "N/A", note: "Proposed in policy literature; not implemented." }],
    pros: ["Prevents launch delays", "Simple rule"],
    cons: ["Hard to enforce", "Legal challenges"],
    whoGains: ["Patients"],
    whoLoses: ["Manufacturers"],
    mend: ["N/A"],
    changes: ["Tie favorable pricing to prompt U.S. launch"],
  }),

  // ---- public R&D priorities ----
  path({
    id: "rdpri-peer-review",
    problemId: "x-public-rd-priorities",
    title: "Independent peer review with set-asides for high-risk ideas",
    summary:
      "Keep funding decisions with scientific peer review, with a fixed share for high-risk research.",
    precedents: [
      { place: "NIH, ARPA-H", note: "Peer review plus a high-risk agency." },
      {
        place: "United States",
        note: "To fund high-risk, high-reward health technologies beyond traditional peer review, the U.S. established ARPA-H modeled after DARPA, launching with a $1 billion three-year congressional appropriation (2022).",
        sourceIds: ["rdpri-peer-review-advanced-research-projec-2022"],
      },
    ],
    pros: ["Insulates from politics", "Proven"],
    cons: ["Conservative", "Slow"],
    whoGains: ["Researchers"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: ["Keep peer review", "Set aside funds for high-risk research"],
  }),
  path({
    id: "rdpri-mixed",
    problemId: "x-public-rd-priorities",
    title: "Keep private R&D for most drugs; public funds fill gaps",
    summary: "Public funds go only to areas private R&D neglects (antibiotics, rare diseases).",
    precedents: [
      { place: "CARB-X", note: "Public-private antibiotic accelerator." },
      {
        place: "United States",
        note: "A 2026 CARB-X evaluation reports over US$1 billion committed through 2028 and 77 funded applications among the 2016–2019 application cohort, whose outcomes were assessed through February 2024.",
        sourceIds: ["rdpri-mixed-health-affairs-scholar-2024"],
      },
    ],
    pros: ["Limits government role", "Targets gaps"],
    cons: ["Relies on high prices elsewhere", "Gaps hard to define"],
    whoGains: ["N/A"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: ["Fund only neglected areas publicly"],
  }),

  // ---- scope quality ----
  path({
    id: "scopeq-monitor",
    problemId: "x-scope-quality",
    title: "Measure outcomes by clinician type and adjust scope",
    summary:
      "Publish outcome and prescribing data by clinician type; expand or restrict scope based on results.",
    precedents: [
      { place: "U.S. VA", note: "Granted NPs full practice authority (2016) with monitoring." },
      {
        place: "United States",
        note: "A 2020 nonexperimental evaluation of 139 VA medical centres found that a 10% increase in privileged primary-care NPs was associated with about 4% shorter new-patient waits, equivalent to 0.30 days.",
        sourceIds: ["scopeq-monitor-health-services-research-2020"],
      },
    ],
    pros: ["Evidence-based", "Adjusts over time"],
    cons: ["Data take years", "Hard to attribute outcomes"],
    whoGains: ["Patients"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: ["Publish outcomes by clinician type"],
  }),
  path({
    id: "scopeq-transition-period",
    problemId: "x-scope-quality",
    title: "Supervised transition period before independence",
    summary: "Require a set number of supervised hours before independent practice.",
    precedents: [
      {
        place: "Several U.S. states",
        note: "Require 1,000 hours to several years of collaborative practice first; about half of full-practice states require none.",
      },
      {
        place: "United States",
        note: "Among 28 U.S. states granting full practice authority to nurse practitioners, 14 require supervised transition-to-practice periods ranging from 1,040 to 4,600 hours, while 13 states and D.C. require none (2024).",
        sourceIds: ["scopeq-transition-period-journal-of-the-american--2024"],
      },
    ],
    pros: ["Builds experience", "Addresses quality concerns"],
    cons: ["Slows supply", "Supervision bottleneck"],
    whoGains: ["Patients"],
    whoLoses: ["New NPs"],
    mend: ["N/A"],
    changes: ["Require supervised hours before independence"],
  }),

  // ---- staffing mandates ----
  path({
    id: "staffing-phase",
    problemId: "x-staffing-mandate-cost",
    title: "Phase mandates in with workforce growth, funded in rates",
    summary:
      "Ratios tighten in steps as training pipelines grow, and rates are raised to pay for them.",
    precedents: [
      {
        place: "California",
        note: "California phased in hospital nurse staffing mandates under AB 394 by setting medical-surgical ratios to 1:6 in January 2004, tightening them to 1:5 in March 2005 before expanding to specialty units in 2008 (2013).",
        sourceIds: ["staffing-phase-health-services-research-2013"],
      },
    ],
    pros: ["Avoids closures", "Aligns with supply"],
    cons: ["Slower benefits", "Delayed safety gains"],
    whoGains: ["Facilities"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    complements: ["nurse-pipeline"],
    changes: ["Phase staffing rules with workforce growth"],
  }),
  path({
    id: "staffing-waivers",
    problemId: "x-staffing-mandate-cost",
    title: "Hardship waivers for shortage areas",
    summary: "Facilities that prove they can't hire get time-limited waivers.",
    precedents: [
      { place: "U.S. 2024 nursing home rule", note: "Included hardship exemptions." },
      {
        place: "United States",
        note: "The 2024 federal nursing home rule mandated 3.48 nurse hours per resident day (including 0.55 RN hours) while offering hardship exemptions for facilities in shortage areas making good-faith hiring efforts (2024).",
        sourceIds: ["staffing-waivers-federal-register-2024"],
      },
    ],
    pros: ["Prevents closures", "Flexible"],
    cons: ["Waivers can become permanent", "Unequal protections"],
    whoGains: ["Rural facilities"],
    whoLoses: ["Residents of waived facilities"],
    mend: ["N/A"],
    changes: ["Allow time-limited hardship waivers"],
  }),

  // ---- woodwork ----
  path({
    id: "woodwork-assessment",
    problemId: "x-woodwork",
    title: "Standardized needs assessment and tiered benefits",
    summary: "An independent assessor rates need levels; benefits are tiered with set hours.",
    precedents: [
      { place: "Germany, Japan", note: "Care levels determined by independent assessors." },
      {
        place: "Germany",
        note: "A 2024 German long-term-care study describes allocation to care grades 1–5 and reports approximately 5 million people needing long-term care in 2021.",
        sourceIds: ["woodwork-assessment-frontiers-in-public-heal-2024"],
      },
    ],
    pros: ["Controls costs", "Consistent"],
    cons: ["Some needs unmet", "Assessment costs"],
    whoGains: ["Taxpayers"],
    whoLoses: ["People just below thresholds"],
    mend: ["N/A"],
    changes: ["Create independent needs assessment with tiered benefits"],
  }),
  path({
    id: "woodwork-cash",
    problemId: "x-woodwork",
    title: "Cash benefit option for family caregivers",
    summary: "Families can take a smaller cash benefit to provide care themselves.",
    precedents: [
      {
        place: "Germany",
        note: "In Germany's long-term care system, 79% of home-care beneficiaries choose the cash benefit over formal services, receiving a monthly allowance valued at roughly 50% of the in-kind service benefit limit (2012).",
        sourceIds: ["woodwork-cash-health-services-research-2012"],
      },
    ],
    pros: ["Lower cost", "Supports family care"],
    cons: ["Quality hard to monitor", "Gendered caregiving burden"],
    whoGains: ["Family caregivers"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: ["Offer a cash benefit for family caregivers"],
  }),

  // ---- migration ----
  path({
    id: "migration-residence",
    problemId: "x-migration-concern",
    title: "Residence period before eligibility",
    summary:
      "Require proof of residence for a period (e.g., 3–12 months) before full coverage; emergency care always covered.",
    precedents: [
      {
        place: "Canadian provinces",
        note: "Some provinces (e.g., British Columbia, Quebec) make new residents wait up to 3 months; others, such as New Brunswick, have dropped the wait.",
      },
      {
        place: "Canada",
        note: "Under the Canada Health Act portability framework, Canadian provinces such as Quebec can impose a waiting period of up to 3 months before new or returning residents become eligible for public health insurance (2025).",
        sourceIds: ["copay-none-health-canada-2025"],
      },
    ],
    pros: ["Reduces migration concerns", "Lower cost"],
    cons: ["Gaps for new arrivals", "Verification paperwork"],
    whoGains: ["Taxpayers"],
    whoLoses: ["New arrivals"],
    mend: ["Cover children and pregnancy immediately"],
    changes: [
      "Require a residence period before full coverage",
      "Cover emergencies, children, and pregnancy immediately",
    ],
  }),
  path({
    id: "migration-no-wait",
    problemId: "x-migration-concern",
    title: "Cover from day one",
    summary: "Cover all residents immediately.",
    precedents: [
      {
        place: "UK NHS",
        note: "Most residents covered on arrival (visa holders pay a surcharge).",
      },
      {
        place: "United Kingdom",
        note: "Under UK policy, immigrants and visa holders can access the NHS free of charge from the date their visa starts, subject to an upfront Immigration Health Surcharge of £1,035 per year (£776 for students and minors) (2024).",
        sourceIds: ["migration-no-wait-uk-visas-and-immigration-2024"],
      },
    ],
    pros: ["No gaps", "Simple"],
    cons: ["Cost", "Political concerns"],
    whoGains: ["Immigrants"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    changes: ["Cover all residents from day one"],
  }),

  // ---- metric gaming ----
  path({
    id: "gaming-audit",
    problemId: "x-metric-gaming",
    title: "Independent audits and few, simple measures",
    summary:
      "Keep a short list of hard-to-game measures (outcomes, patient-reported) and audit them.",
    precedents: [
      { place: "NHS England", note: "Audits of waiting-list data after gaming." },
      {
        place: "United Kingdom",
        note: "The NAO's 2001 investigation covered nine trusts with inappropriate waiting-list adjustments and recommended investigating 13 trusts meeting both thresholds: over 10% suspended and over 2% waiting longer than twelve months.",
        sourceIds: ["gaming-audit-national-audit-office-2001"],
      },
    ],
    pros: ["Less gaming", "Credible data"],
    cons: ["Fewer things measured", "Audit costs"],
    whoGains: ["Patients"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: ["Audit a short list of measures"],
  }),
  path({
    id: "gaming-no-pay",
    problemId: "x-metric-gaming",
    title: "Report measures publicly without tying pay to them",
    summary:
      "Publish data for transparency but don't attach bonuses, removing the incentive to game.",
    precedents: [
      {
        place: "U.S. MIPS critique",
        note: "MedPAC recommended ending MIPS.",
        sourceIds: ["medpac-2025"],
      },
    ],
    pros: ["No gaming incentive", "Less admin"],
    cons: ["Weaker incentive", "Data quality may drop"],
    whoGains: ["N/A"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: ["Publish measures without tying pay"],
  }),

  // ---- state control ----
  path({
    id: "state-administer",
    problemId: "x-state-control",
    title: "States administer under national rules",
    summary:
      "National rules and funding, but states run enrollment and provider relations, like Canada's provinces.",
    precedents: [
      {
        place: "Canada",
        note: "Under Canada's framework where 13 provinces and territories administer health plans under national standards, the federal government provided over $52.1 billion via the Canada Health Transfer in fiscal year 2024–2025 (2025).",
        sourceIds: ["copay-none-health-canada-2025"],
      },
    ],
    pros: ["Local control", "Experimentation"],
    cons: ["Variation between states", "Duplication"],
    whoGains: ["States"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: ["Let states administer under national rules"],
  }),
  path({
    id: "state-moe",
    problemId: "x-state-control",
    title: "Maintenance-of-effort payments from states",
    summary: "States pay the national program what they spent on Medicaid, indexed.",
    precedents: [
      {
        place: "Medicare Part D clawback",
        note: "States pay Medicare for dual-eligible drug costs.",
      },
      {
        place: "United States",
        note: "Under the Medicare Part D phased-down state contribution (clawback) requirement for dual-eligible drug costs, state payments to the Medicare Part D trust fund totaled $15.8 billion in calendar year 2023 (2024).",
        sourceIds: ["state-moe-centers-for-medicare-med-2024"],
      },
    ],
    pros: ["Lower federal cost", "Simple"],
    cons: ["Locks in historical differences", "State budget burden"],
    whoGains: ["Federal budget"],
    whoLoses: ["States"],
    mend: ["N/A"],
    changes: ["Require state maintenance-of-effort payments"],
  }),
]
