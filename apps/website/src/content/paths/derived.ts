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
    how: {
      "x-plan-choice": {
        note: "Publishing service measures and empowering an ombudsman to order fixes provides accountability without competing insurers, while patients retain provider choice.",
      },
      networks: {
        note: "Allowing patients to choose any provider preserves provider choice within the public payer.",
      },
      "t-dependent-reforms": {
        note: "Service measures and an ombudsman’s power to order fixes depend on political will to enforce them.",
      },
      "x-metric-gaming": {
        note: "Published call-wait, claim-time, and appeal measures can be gamed rather than reflect service accurately.",
      },
    },
    worsens: ["t-dependent-reforms"],
    solves: ["networks"],
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
    how: {
      "x-plan-choice": {
        note: "Private plans for benefits outside public coverage preserve insurer choice for extras such as private rooms and extra therapies.",
      },
      "transition-disruption": {
        note: "Keeping private supplemental plans preserves some insurer jobs.",
      },
      "two-tier": {
        note: "Private coverage for extras allows people who can pay to obtain better care.",
      },
      "t-higher-spending": { note: "Supplemental coverage for extras can drive up use of care." },
      "x-copay-billing": {
        note: "The cited complementary insurance model covers statutory cost-sharing, keeping a role for plans that handle patient charges.",
      },
    },
    worsens: ["two-tier", "t-higher-spending"],
    solves: ["transition-disruption"],
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
    how: {
      "x-plan-choice": {
        note: "Letting patients choose among integrated care organizations creates competition on service and integrated care without multiple insurers.",
      },
      "x-undertreatment": {
        note: "Paying the competing care organizations by capitation retains the risks associated with that payment method.",
      },
      "t-limited-reach": {
        note: "Choice among competing integrated care organizations is limited in rural areas.",
      },
    },
    worsens: ["x-undertreatment", "t-limited-reach"],
    requires: ["capitation"],
    changes: ["Let people choose among public care organizations paid by capitation"],
  }),

  // ---- new taxes ----
  path({
    id: "tax-payroll",
    problemId: "x-new-taxes",
    role: "answers",
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
    how: {
      "x-new-taxes": {
        note: "Replacing premiums with an easily collected payroll tax follows existing employer payment flows, but taxes wages rather than investment income.",
      },
      "x-wage-incidence": {
        note: "A payroll tax imposes costs on low-wage firms and can hurt them.",
      },
    },
    mend: ["Phase in for small businesses"],
    spawns: ["x-wage-incidence"],
    changes: ["Enact a health payroll tax split between employer and employee"],
  }),
  path({
    id: "tax-income",
    problemId: "x-new-taxes",
    role: "answers",
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
    how: {
      "x-new-taxes": {
        note: "An income-based health tax including capital gains and dividends provides a broad, progressive funding base. High earners pay much more, and the tax may reduce investment.",
        helps: ["low-middle-income"],
        hurts: ["high-earners"],
      },
    },
    changes: ["Enact a progressive health income tax including capital income"],
  }),
  path({
    id: "tax-vat",
    problemId: "x-new-taxes",
    role: "answers",
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
    how: {
      "x-new-taxes": {
        note: "A broad health consumption tax can raise substantial revenue at low rates and is hard to avoid, but is regressive unless paired with rebates.",
      },
      "t-administrative-work": {
        note: "Collecting a dedicated consumption tax requires a new collection system.",
      },
    },
    mend: ["Per-person rebate"],
    worsens: ["t-administrative-work"],
    changes: ["Enact a VAT dedicated to health with per-person rebates"],
  }),
  path({
    id: "tax-mix",
    problemId: "x-new-taxes",
    role: "answers",
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
    how: {
      "x-new-taxes": {
        note: "Combining redirected public spending, employer contributions, and income-based household contributions spreads the burden and lowers rates on each funding base.",
      },
      "t-administrative-work": {
        note: "Combining different funding sources makes the financing more complex and harder to explain.",
      },
    },
    worsens: ["t-administrative-work"],
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
    how: {
      "x-wage-incidence": {
        note: "Lower employer tax rates for small firms and the initial portion of wages protect low-wage jobs and prevent sudden costs for small businesses.",
      },
      "t-funding-instability": {
        note: "Reducing employer tax rates for small firms and lower wages brings in less revenue.",
        hurts: ["taxpayers"],
      },
      "t-enforcement-burden": {
        note: "Firms may split to remain eligible for the lower small-firm tax rates.",
      },
    },
    worsens: ["t-funding-instability", "t-enforcement-burden"],
    changes: ["Phase in employer taxes for small and low-wage firms"],
  }),
  path({
    id: "wage-no-employer",
    problemId: "x-wage-incidence",
    title: "No employer tax: fund from households directly",
    summary: "Employers pay nothing; they must pass former premium spending into wages.",
    precedents: [{ place: "N/A", note: "Wage pass-through mandates are untested." }],
    how: {
      "x-wage-incidence": {
        note: "Funding care directly from households removes employer taxes, avoids wage loss at firms that did not offer coverage, and simplifies employers’ role.",
      },
      "t-enforcement-burden": {
        note: "Requiring employers to pass former premium spending into wages is hard to enforce; the cited precedent describes such mandates as untested.",
        hurts: ["low-middle-income"],
      },
      "x-new-taxes": {
        note: "Replacing employer payments with direct household funding requires higher household taxes.",
      },
    },
    worsens: ["t-enforcement-burden", "x-new-taxes"],
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
    how: {
      "x-copay-billing": {
        note: "Having the payer tally income-capped charges, automatically exempt low-income people, and settle charges through tax returns keeps a price signal without visit-level billing or provider debt collection. A charge ledger and tax integration are still required.",
      },
      "admin-cost": {
        note: "Payer tallies and tax-return settlement remove visit-level billing and debt collection from providers while retaining a central charge ledger.",
      },
      "t-weaker-incentives": {
        note: "Settling charges later through the annual tax return weakens the price signal compared with charges at the visit.",
      },
    },
    mend: ["Transition program for collections staff"],
    worsens: ["t-weaker-incentives"],
    solves: ["admin-cost"],
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
    how: {
      "x-copay-billing": {
        note: "Eliminating copays for covered services removes the copay billing apparatus and avoids deterring needed care.",
      },
      "admin-cost": {
        note: "Eliminating copays for covered services removes the billing apparatus for those charges.",
      },
      "wait-times": { note: "Removing copays increases use of care, adding demand to the system." },
      "t-higher-spending": {
        note: "Eliminating charges for covered services increases use of care.",
      },
      "x-new-taxes": { note: "Eliminating copays requires higher taxes." },
    },
    solves: ["admin-cost"],
    requires: ["underins-zero"],
    worsens: ["wait-times", "t-higher-spending", "x-new-taxes"],
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
    how: {
      "x-copay-billing": {
        note: "Limiting charges to small flat fees on selected services simplifies charging and targets specific overuse, with exemptions for children, poor people, and chronic illness. Collection is still needed, and charges still deter near-poor patients.",
        hurts: ["low-middle-income"],
      },
      "low-value-care": {
        note: "Small flat charges for selected services, such as non-emergency emergency-room use, target specific overuse.",
      },
    },
    mend: ["Prepayment certificates that cap annual charges"],
    solves: ["low-value-care"],
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
    how: {
      "x-central-rationing": {
        note: "An independent agency’s public evidence and cost review, patient representation, published reasons, and appeals make decisions explainable and consistent while reducing political interference. Contested coverage refusals still occur.",
      },
      "t-delayed-benefits": {
        note: "Public evidence review, appeals, and reconsideration make coverage decisions slow.",
        hurts: ["drug-device-makers"],
      },
    },
    mend: ["Exceptional-case route for individual patients"],
    worsens: ["t-delayed-benefits"],
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
    how: {
      "x-central-rationing": {
        note: "Covering treatments shown to work without cost-per-QALY thresholds reduces denials and the perception of a panel deciding who may receive care, while relying on price negotiation to control cost.",
      },
      denials: {
        note: "Covering any treatment shown to work rather than applying cost-per-QALY thresholds leads to fewer coverage denials.",
      },
      underfunding: {
        note: "Broader treatment coverage raises spending while leaving weaker leverage to control costs through negotiation.",
      },
      "t-higher-spending": {
        note: "Covering effective treatments without cost-per-QALY thresholds raises spending and weakens negotiating leverage.",
      },
    },
    solves: ["denials"],
    worsens: ["underfunding", "t-higher-spending"],
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
    how: {
      "x-central-rationing": {
        note: "Allowing clinicians to request prompt clinical-panel decisions outside the standard coverage list gives unusual cases flexibility through a clinician-driven process.",
      },
      disparities: {
        note: "Individual exceptions to the standard coverage list raise concerns about equity in coverage decisions.",
      },
    },
    worsens: ["disparities"],
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
    how: {
      "x-budget-rationing": {
        note: "Recalculating hospital budgets for population growth, aging, and unexpected volume reduces slowdowns and treats growing areas fairly.",
      },
      "wait-times": {
        note: "Adjusting budgets for changing demand helps prevent demand growth from producing queues.",
      },
      "t-higher-spending": {
        note: "Increasing budgets in response to demand weakens cost control.",
      },
      "t-uncertain-evidence": {
        note: "Recalculating budgets using demand formulas can lead to disputes over those formulas.",
      },
    },
    worsens: ["t-higher-spending", "t-uncertain-evidence"],
    solves: ["wait-times"],
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
    how: {
      "x-budget-rationing": {
        note: "Using a budget for fixed costs and per-case payments above a baseline balances spending control with productivity and cuts queues.",
      },
      "wait-times": {
        note: "Paying for additional procedures above a baseline rewards throughput and cuts queues.",
      },
      "t-higher-spending": {
        note: "Paying per case above a baseline can lead to growing procedure volume.",
      },
      "admin-cost": { note: "Per-case payments for additional procedures require more billing." },
    },
    worsens: ["t-higher-spending", "admin-cost"],
    solves: ["wait-times"],
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
    how: {
      "x-budget-rationing": {
        note: "Allowing patients to receive treatment elsewhere after a hospital exceeds the maximum wait protects patients while keeping fixed budgets, with the original hospital paying the cost.",
      },
      "wait-times": {
        note: "A maximum-wait rule allows delayed patients to receive treatment elsewhere at the original hospital’s expense.",
      },
      "t-dependent-reforms": {
        note: "Allowing delayed patients to move to another hospital requires spare capacity elsewhere.",
        hurts: ["providers"],
      },
      "t-administrative-work": {
        note: "Charging treatment at another hospital back to the original hospital’s budget requires complex accounting.",
      },
    },
    worsens: ["t-dependent-reforms", "t-administrative-work"],
    solves: ["wait-times"],
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
    how: {
      "x-undertreatment": {
        note: "Higher payments for sicker patients, a ban on patient selection, and public access and outcome monitoring reduce avoidance and make payments fairer.",
      },
      "t-administrative-work": {
        note: "Adjusting payments for patient sickness and monitoring access and outcomes adds complexity.",
      },
      "x-metric-gaming": { note: "Higher payments for sicker patients create a risk of upcoding." },
    },
    worsens: ["t-administrative-work"],
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
    how: {
      "x-undertreatment": {
        note: "Combining per-patient payments for basic care with service fees for additional needed care balances incentives; the approach has been used abroad.",
      },
      "admin-cost": { note: "Adding service fees to per-patient payments requires more billing." },
      "t-administrative-work": {
        note: "Combining per-patient payments and service fees makes payment administration more complex.",
      },
    },
    worsens: ["admin-cost", "t-administrative-work"],
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
    how: {
      "x-undertreatment": {
        note: "Paying salaries removes a direct financial reason to provide more or less care and makes costs predictable.",
        helps: ["clinicians"],
      },
      "t-weaker-incentives": {
        note: "Salary payment may reduce clinician productivity.",
        hurts: ["clinicians"],
      },
      "t-reduced-flexibility": { note: "Salary payment gives clinicians less autonomy." },
    },
    mend: ["Productivity bonuses"],
    worsens: ["t-weaker-incentives", "t-reduced-flexibility"],
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
    how: {
      "x-price-control-exit": {
        note: "Minimum prices or longer-term contracts keep essential generic drugs and services profitable to supply, preventing shortages and stabilizing supply.",
      },
      shortages: {
        note: "Minimum prices or longer-term contracts for essential generics keep supply profitable and help prevent shortages.",
      },
      "t-higher-spending": {
        note: "Minimum prices or longer-term supply contracts require paying more.",
      },
      "t-uncertain-evidence": {
        note: "Choosing minimum prices that keep essential supply profitable is difficult.",
      },
    },
    worsens: ["t-higher-spending", "t-uncertain-evidence"],
    solves: ["shortages"],
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
    how: {
      "x-price-control-exit": {
        note: "Tracking launches, discontinuations, and provider participation allows automatic price increases when supply falls, making the response data-driven.",
      },
      "t-limited-reach": {
        note: "Raising prices when tracked supply falls is reactive rather than preventing the initial decline.",
      },
      "t-systems-implementation": {
        note: "Tracking launches, discontinuations, and provider participation requires data systems.",
      },
    },
    worsens: ["t-limited-reach", "t-systems-implementation"],
    changes: ["Track launches and discontinuations", "Raise prices when supply falls"],
  }),
  path({
    id: "exit-launch-rules",
    problemId: "x-price-control-exit",
    title: "Require timely U.S. launch as a condition of market access",
    summary: "Link favorable pricing to launching in the U.S. promptly.",
    precedents: [{ place: "N/A", note: "Proposed in policy literature; not implemented." }],
    how: {
      "x-price-control-exit": {
        note: "Linking favorable pricing to prompt domestic launches uses a simple rule to prevent launch delays.",
      },
      "innovation-slowdown": {
        note: "Making favorable prices conditional on prompt launches helps prevent delays in access to new products.",
      },
      "t-enforcement-burden": {
        note: "Enforcing the link between favorable pricing and prompt launches is difficult.",
        hurts: ["drug-device-makers"],
      },
      "t-political-resistance": {
        note: "Conditioning favorable pricing on prompt launches can face legal challenges.",
      },
    },
    worsens: ["t-enforcement-burden", "t-political-resistance"],
    solves: ["innovation-slowdown"],
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
    how: {
      "x-public-rd-priorities": {
        note: "Using scientific peer review for funding decisions insulates research priorities from politics and uses an established approach, while reserving funding for high-risk research.",
      },
      "innovation-slowdown": {
        note: "Scientific peer review can be conservative even with funding reserved for high-risk research.",
      },
      "t-delayed-benefits": {
        note: "Scientific peer review makes research funding decisions slow.",
      },
    },
    worsens: ["innovation-slowdown", "t-delayed-benefits"],
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
    how: {
      "x-public-rd-priorities": {
        note: "Limiting public research funding to neglected areas such as antibiotics and rare diseases narrows government’s role and targets gaps left by private research.",
      },
      "high-prices": {
        note: "Restricting public funding to neglected research areas leaves reliance on high prices elsewhere.",
      },
      "t-uncertain-evidence": {
        note: "Identifying the research gaps that qualify for public funding is difficult.",
      },
    },
    worsens: ["high-prices", "t-uncertain-evidence"],
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
    how: {
      "x-scope-quality": {
        note: "Publishing outcomes and prescribing by clinician type allows practice scope to expand or contract based on evidence and adjust over time.",
      },
      "t-delayed-benefits": {
        note: "Collecting outcome and prescribing evidence by clinician type takes years.",
      },
      "t-uncertain-evidence": {
        note: "It is hard to attribute observed outcomes to clinician type when deciding practice scope.",
      },
    },
    worsens: ["t-delayed-benefits", "t-uncertain-evidence"],
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
    how: {
      "x-scope-quality": {
        note: "Requiring supervised practice before independence builds experience and addresses quality concerns.",
      },
      "t-delayed-benefits": {
        note: "Requiring supervised hours before independence slows the addition of independent practitioners.",
      },
      "physician-shortage": {
        note: "Requiring supervision before independent practice creates a supervision bottleneck.",
      },
    },
    worsens: ["t-delayed-benefits", "physician-shortage"],
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
    how: {
      "x-staffing-mandate-cost": {
        note: "Tightening staffing ratios in stages as training grows aligns requirements with workforce supply and avoids closures, while raising rates to pay for staffing.",
      },
      "t-delayed-benefits": {
        note: "Introducing tighter staffing ratios in stages delays their benefits.",
      },
      safety: { note: "Phasing in tighter staffing ratios delays safety gains." },
    },
    worsens: ["t-delayed-benefits", "safety"],
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
    how: {
      "x-staffing-mandate-cost": {
        note: "Time-limited waivers for facilities that prove they cannot hire provide flexibility and prevent closures.",
      },
      "t-enforcement-burden": {
        note: "Temporary staffing waivers can become permanent rather than ending as intended.",
        hurts: ["long-term-care-users"],
      },
      disparities: {
        note: "Giving some facilities staffing waivers leaves patients with unequal protections.",
      },
    },
    worsens: ["t-enforcement-burden", "disparities"],
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
    how: {
      "x-woodwork": {
        note: "Independent need assessments and tiered benefits with set care hours provide consistent allocation and control costs.",
      },
      "ltc-spend-down": {
        note: "Tiered benefits with set care hours leave some long-term care needs unmet.",
        hurts: ["changing-lives"],
      },
      "t-administrative-work": {
        note: "Independent assessments of care needs add assessment costs.",
      },
    },
    worsens: ["ltc-spend-down", "t-administrative-work"],
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
    how: {
      "x-woodwork": {
        note: "Offering a smaller cash benefit for families to provide care themselves lowers costs and supports family care.",
        helps: ["caregiving-families"],
      },
      "t-oversight-limits": {
        note: "Quality is hard to monitor when families receive cash to provide care themselves.",
      },
      "t-caregiving-burden": {
        note: "Relying on family-provided care with a cash benefit leaves a gendered caregiving burden.",
      },
    },
    worsens: ["t-oversight-limits", "t-caregiving-burden"],
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
    how: {
      "x-migration-concern": {
        note: "Requiring a period of proven residence before full coverage lowers costs and reduces migration concerns while retaining emergency coverage.",
      },
      "immigrant-coverage": {
        note: "Delaying full coverage until a residence requirement is met leaves gaps for new arrivals even though emergency care remains covered.",
      },
      "t-administrative-work": {
        note: "Checking proof of residence for coverage requires verification paperwork.",
      },
    },
    mend: ["Cover children and pregnancy immediately"],
    worsens: ["immigrant-coverage", "t-administrative-work"],
    changes: [
      "Require a residence period before full coverage",
      "Cover emergencies, children, and pregnancy immediately",
    ],
  }),
  path({
    id: "migration-no-wait",
    problemId: "x-migration-concern",
    role: "answers",
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
    how: {
      "x-migration-concern": {
        note: "Covering all residents immediately leaves no coverage gaps and uses a simple eligibility approach.",
      },
      "immigrant-coverage": {
        note: "Immediate coverage for all residents removes gaps caused by waiting for eligibility.",
      },
      "t-higher-spending": { note: "Immediate coverage for all residents adds cost." },
      "t-political-resistance": {
        note: "Immediate coverage for all residents raises political concerns.",
      },
    },
    worsens: ["t-higher-spending", "t-political-resistance"],
    solves: ["immigrant-coverage"],
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
    how: {
      "x-metric-gaming": {
        note: "Auditing a short list of hard-to-game outcome and patient-reported measures reduces gaming and produces credible data.",
      },
      "t-reduced-data": {
        note: "Restricting monitoring to a short list of measures leaves fewer things measured.",
      },
      "t-administrative-work": { note: "Auditing the selected measures adds audit costs." },
    },
    worsens: ["t-reduced-data", "t-administrative-work"],
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
    how: {
      "x-metric-gaming": {
        note: "Publishing performance data without bonuses removes the financial incentive to game and reduces administration.",
      },
      "admin-cost": {
        note: "Publishing data without attaching bonuses requires less administration.",
      },
      "t-weaker-incentives": {
        note: "Removing performance bonuses weakens the incentive associated with the measures.",
      },
      "t-reduced-data": { note: "Publishing data without bonuses may reduce data quality." },
    },
    worsens: ["t-weaker-incentives", "t-reduced-data"],
    solves: ["admin-cost"],
    changes: ["Publish measures without tying pay"],
  }),

  // ---- state control ----
  path({
    id: "state-administer",
    problemId: "x-state-control",
    role: "answers",
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
    how: {
      "x-state-control": {
        note: "Letting states run enrollment and provider relations under national rules and funding preserves local control and allows experimentation.",
      },
      "admin-cost": {
        note: "Having states administer enrollment and provider relations duplicates administration.",
      },
    },
    worsens: ["admin-cost"],
    changes: ["Let states administer under national rules"],
  }),
  path({
    id: "state-moe",
    problemId: "x-state-control",
    role: "answers",
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
    how: {
      "x-state-control": {
        note: "Requiring indexed state payments based on former Medicaid spending lowers federal costs through a simple contribution rule.",
        helps: ["taxpayers"],
      },
      disparities: {
        note: "Basing state contributions on historical Medicaid spending locks in historical differences.",
        hurts: ["states"],
      },
      "t-funding-instability": {
        note: "Requiring indexed contributions based on former Medicaid spending burdens state budgets.",
      },
    },
    worsens: ["disparities", "t-funding-instability"],
    changes: ["Require state maintenance-of-effort payments"],
  }),
]
