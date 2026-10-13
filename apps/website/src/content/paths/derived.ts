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
      { place: "France", note: "Most people hold complementary insurance (mutuelles)." },
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
    precedents: [{ place: "Germany, France", note: "Payroll contributions fund most care." }],
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
    precedents: [{ place: "Canada, UK", note: "Mostly general revenue." }],
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
    precedents: [{ place: "Taiwan", note: "Premiums based on payroll plus government subsidies." }],
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
    precedents: [{ place: "France", note: "Reduced employer contributions on low wages." }],
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
        note: "Annual cap at 2% of income (1% for chronic illness); exemptions on application.",
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
    precedents: [{ place: "Denmark", note: "Extended free hospital choice after 30 days." }],
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
    precedents: [{ place: "Civica Rx", note: "Long-term fixed-price contracts with hospitals." }],
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
      { place: "Japan", note: "Biennial fee-schedule revisions respond to supply data." },
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
    precedents: [{ place: "NIH, ARPA-H", note: "Peer review plus a high-risk agency." }],
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
    precedents: [{ place: "CARB-X", note: "Public-private antibiotic accelerator." }],
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
        note: "Ratios phased in from 2004 (medical-surgical 1:6, tightened to 1:5 in 2005) and completed in 2008.",
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
    precedents: [{ place: "U.S. 2024 nursing home rule", note: "Included hardship exemptions." }],
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
        note: "Many beneficiaries choose the cash option, which costs less than services.",
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
    precedents: [{ place: "NHS England", note: "Audits of waiting-list data after gaming." }],
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
    precedents: [{ place: "Canada", note: "Provincial plans under the Canada Health Act." }],
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
    ],
    pros: ["Lower federal cost", "Simple"],
    cons: ["Locks in historical differences", "State budget burden"],
    whoGains: ["Federal budget"],
    whoLoses: ["States"],
    mend: ["N/A"],
    changes: ["Require state maintenance-of-effort payments"],
  }),
]
