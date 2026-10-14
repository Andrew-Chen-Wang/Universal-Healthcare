/**
 * Paths for risks a universal system creates, and for problems that solution
 * paths themselves create (subpaths).
 */
import { path } from "./types"

export const RISK_PATHS = [
  // ---- wait times ----
  path({
    id: "waits-guarantee",
    problemId: "wait-times",
    title: "Legal wait-time guarantees",
    summary:
      "If care isn't provided within a set time, patients may go to another provider, even abroad, at the payer's cost.",
    precedents: [
      {
        place: "Denmark, Sweden",
        note: "Treatment guarantees with free choice of another hospital.",
      },
      {
        place: "Denmark",
        note: "In Denmark, where patients can choose private care if public hospital waits exceed 30 days, regions made a record 242,060 private referrals in 2023 under the extended free choice guarantee.",
        sourceIds: ["waits-guarantee-danske-regioner-2024"],
      },
    ],
    pros: ["Enforces timely care", "Gives patients a concrete right"],
    cons: ["Gaming of referral dates", "Needs spare capacity somewhere"],
    whoGains: ["Patients"],
    whoLoses: ["Slow providers"],
    mend: ["N/A"],
    spawns: ["x-metric-gaming"],
    changes: [
      "Set legal maximum waits by service",
      "Let patients go elsewhere at payer cost when exceeded",
    ],
  }),
  path({
    id: "waits-capacity",
    problemId: "wait-times",
    title: "Build capacity before demand rises",
    summary: "Expand workforce and facilities before universal coverage starts.",
    precedents: [
      {
        place: "Taiwan",
        note: "Under Taiwan's 15-year infrastructure plan launched in 1985 before universal coverage, hospital capacity expanded to 126,476 beds (5.7 per 1,000 people) by 2000, keeping waiting times near zero after NHI launched in 1995.",
        sourceIds: ["waits-capacity-the-epma-journal-2010"],
      },
    ],
    pros: ["Prevents waits", "Builds a sustainable workforce"],
    cons: ["Costly up front", "Slow"],
    whoGains: ["Patients"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    complements: ["phys-residency", "nurse-pipeline", "scope-expand"],
    changes: ["Expand workforce and facilities before coverage starts"],
  }),
  path({
    id: "waits-activity-pay",
    problemId: "wait-times",
    title: "Pay for activity on top of budgets",
    summary: "Pay extra for procedures beyond baseline volume to cut queues.",
    precedents: [
      { place: "Sweden, Norway", note: "Activity-based pay reduced waits." },
      {
        place: "Norway",
        note: "In Norway, hospital wait times to start treatment fell by 13% over four years to an average of 60 days in 2017, as the country combined activity-based funding with national waiting-time targets.",
        sourceIds: ["waits-activity-pay-the-commonwealth-fund-2017"],
      },
    ],
    pros: ["Rewards throughput", "Cuts queues"],
    cons: ["Spending can rise", "Incentive to do more procedures"],
    whoGains: ["Patients on waiting lists"],
    whoLoses: ["Budgets"],
    mend: ["N/A"],
    complements: ["global-budgets"],
    changes: ["Pay extra for procedures beyond baseline volume"],
  }),

  // ---- two-tier ----
  path({
    id: "twotier-allow",
    problemId: "two-tier",
    title: "Allow private insurance for covered services",
    summary: "People may buy private insurance to skip public queues.",
    precedents: [
      { place: "UK, Australia", note: "Private insurance coexists." },
      {
        place: "Australia",
        note: "In Australia, where duplicate private insurance is permitted alongside public Medicare, 45.2% of the population (12.4 million people) held private hospital treatment cover as of December 2024.",
        sourceIds: ["twotier-allow-australian-prudential-re-2025"],
      },
    ],
    pros: ["Relief valve for waits", "Adds private money"],
    cons: ["Clinicians may move to private work", "Unequal care"],
    whoGains: ["Wealthy people"],
    whoLoses: ["Public patients if clinicians move"],
    mend: ["Require minimum public hours"],
    conflicts: ["twotier-ban"],
    changes: [
      "Allow private insurance for covered services",
      "Require minimum public hours for clinicians",
    ],
  }),
  path({
    id: "twotier-ban",
    problemId: "two-tier",
    title: "Ban duplicate private insurance",
    summary: "No private insurance for publicly covered services.",
    precedents: [
      {
        place: "Canada (most provinces)",
        note: "Limits on private payment; in Chaoulli (2005) the Supreme Court ruled 4–3 that Quebec's ban on private insurance violated the Quebec Charter, given long waits.",
      },
      {
        place: "Canada (Quebec)",
        note: "In Chaoulli (2005), the Supreme Court of Canada ruled 4–3 that Quebec's ban on private insurance for covered care violated the Quebec Charter, given delays where access to a waiting list is not access to care.",
        sourceIds: ["twotier-ban-supreme-court-of-canada-2005"],
      },
    ],
    pros: ["Equal care for everyone", "Keeps clinicians in the public system"],
    cons: ["No escape from waits", "Legal challenges (as in Canada)"],
    whoGains: ["Equity"],
    whoLoses: ["People wanting faster care"],
    mend: ["Strong wait-time guarantees"],
    conflicts: ["twotier-allow"],
    changes: ["Ban duplicate private insurance for covered services"],
  }),
  path({
    id: "twotier-supplemental",
    problemId: "two-tier",
    title: "Allow supplemental only (non-covered items)",
    summary: "Private insurance only for things not covered (private rooms, cosmetic).",
    precedents: [
      { place: "Taiwan, Canada", note: "Supplemental only." },
      {
        place: "Canada",
        note: "In Canada, where private insurance is limited to non-covered services like drugs and dental, private supplemental plans covered 27 million people (roughly 75% of the population) and paid $40.8 billion in 2024.",
        sourceIds: ["twotier-supplemental-canadian-life-and-health-2025"],
      },
    ],
    pros: ["Compromise: extras are private, core care is equal", "Keeps some insurer jobs"],
    cons: ["Limited relief for waits", "Line between extras and core care blurs"],
    whoGains: ["People who want extras"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    changes: ["Allow private insurance only for non-covered items"],
  }),

  // ---- underfunding ----
  path({
    id: "underfunding-trust-fund",
    problemId: "underfunding",
    title: "Dedicated trust fund with automatic indexing",
    summary:
      "Health care has its own earmarked revenue (payroll and income contributions) and its budget grows automatically with costs, population, and age mix, not annual votes.",
    precedents: [
      {
        place: "Germany",
        note: "The contribution rate is reset each year so sickness funds cover projected costs.",
        sourceIds: ["germany-gkv"],
      },
      {
        place: "U.S. Medicare Part A",
        note: "Trust fund financed by a dedicated payroll tax.",
        sourceIds: ["cms-trustees-2025"],
      },
    ],
    pros: ["Protects the budget from yearly political fights", "Providers can plan"],
    cons: [
      "Automatic growth weakens spending control",
      "Earmarked funds can face 'insolvency' scares",
    ],
    whoGains: ["Patients and providers (stable funding)"],
    whoLoses: ["Budget writers (less flexibility)"],
    mend: ["Pair with a spending-growth target that triggers review"],
    spawns: ["x-new-taxes"],
    conflicts: ["underfunding-annual"],
    changes: [
      "Create a health trust fund with dedicated revenue",
      "Index funding to costs and demographics",
    ],
  }),
  path({
    id: "underfunding-annual",
    problemId: "underfunding",
    title: "Annual appropriations from general revenue",
    summary: "The health budget is set every year alongside other spending.",
    precedents: [
      {
        place: "UK NHS",
        note: "Years of below-trend budget growth after 2010 were followed by record waiting lists.",
        sourceIds: ["nhs-rtt"],
      },
      {
        place: "Canada",
        note: "Federal transfers to provinces were cut in the 1990s, followed by longer waits.",
        sourceIds: ["fraser-2025"],
      },
    ],
    pros: ["Strong spending control", "Health competes openly with other priorities"],
    cons: ["Health care is squeezed in downturns", "Waits rise when budgets lag demand"],
    whoGains: ["Taxpayers in the short run"],
    whoLoses: ["Patients when budgets lag"],
    mend: ["A legal floor (e.g., per-capita spending cannot fall in real terms)"],
    spawns: ["x-budget-rationing"],
    conflicts: ["underfunding-trust-fund"],
    changes: ["Fund health through annual appropriations", "Set a real per-capita spending floor"],
  }),
  path({
    id: "underfunding-target",
    problemId: "underfunding",
    title: "Spending-growth target tied to GDP, reviewed publicly",
    summary:
      "An independent board recommends the next year's budget against a growth target (e.g., GDP growth plus 0.5 points); departures must be justified publicly.",
    precedents: [
      { place: "Massachusetts", note: "Health Policy Commission sets a cost-growth benchmark." },
      {
        place: "Maryland",
        note: "Hospital spending growth tied to state economic growth.",
        sourceIds: ["maryland-model"],
      },
    ],
    pros: ["Balances stability and control", "Transparent"],
    cons: ["Targets often missed", "Board can be ignored"],
    whoGains: ["Taxpayers and patients"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    complements: ["underfunding-trust-fund", "global-budgets"],
    spawns: ["x-metric-gaming"],
    changes: [
      "Create an independent board with a spending-growth target",
      "Require public justification for departures",
    ],
  }),

  // ---- capital ----
  path({
    id: "capital-separate",
    problemId: "capital-underinvestment",
    title: "Separate public capital budget, planned regionally",
    summary:
      "New buildings and major equipment are funded by a separate capital budget allocated by regional need, not from operating revenue.",
    precedents: [
      {
        place: "Canada",
        note: "Provinces fund hospital capital separately; Canada has fewer MRI scanners per person than the OECD average.",
        sourceIds: ["oecd-health-2025"],
      },
      { place: "Maryland", note: "Certificate-of-need review for major capital projects." },
    ],
    pros: ["Prevents duplicate equipment arms races", "Can direct investment to underserved areas"],
    cons: ["Slow approvals", "Capital is easy to cut in tight budgets"],
    whoGains: ["Underserved regions"],
    whoLoses: ["Hospitals that expand to compete", "Equipment makers"],
    mend: ["Multi-year capital commitments set by law"],
    costIds: ["cap-structures", "nhe-structures"],
    complements: ["global-budgets"],
    spawns: ["x-budget-rationing"],
    changes: ["Create a separate capital budget allocated by regional need"],
  }),
  path({
    id: "capital-in-rates",
    problemId: "capital-underinvestment",
    title: "Build a capital allowance into rates",
    summary: "Each payment includes a capital component; hospitals decide how to invest it.",
    precedents: [
      { place: "U.S. Medicare inpatient payments", note: "Include a capital add-on." },
      {
        place: "Germany",
        note: "States are supposed to fund capital but under-fund it, so hospitals shift operating money to capital.",
      },
      {
        place: "U.S. Medicare",
        note: "U.S. Medicare inpatient prospective payments include a dedicated capital payment ($512.14 per discharge in fiscal year 2025) built directly into rates to fund equipment and facility investments.",
        sourceIds: ["capital-in-rates-centers-for-medicare-med-2024"],
      },
    ],
    pros: ["Hospitals keep flexibility", "No central approval bottleneck"],
    cons: ["Rich systems still out-invest poor ones", "Can fund duplication"],
    whoGains: ["Hospital management"],
    whoLoses: ["Poorer hospitals"],
    mend: ["N/A"],
    complements: ["fee-for-service-fixed"],
    changes: ["Add a capital component to provider rates"],
  }),

  // ---- innovation ----
  path({
    id: "innovation-fast-track",
    problemId: "innovation-slowdown",
    title: "Cover new treatments at launch, then reassess",
    summary:
      "New drugs and devices are covered immediately at a provisional price while evidence is collected; the price is reset after one or two years.",
    precedents: [
      {
        place: "Germany (AMNOG)",
        note: "Free launch price for the first year; Germany has some of the fastest drug availability in Europe.",
      },
      { place: "UK Cancer Drugs Fund", note: "Temporary funding while data mature." },
      {
        place: "Germany",
        note: "In Germany, where AMNOG provides immediate coverage at launch before price reassessment, new drug availability averaged 128 days in 2024, compared to an EU average of 578 days.",
        sourceIds: ["innovation-fast-track-european-federation-of-p-2025"],
      },
    ],
    pros: ["Patients get new drugs fast", "Keeps the U.S. an attractive launch market"],
    cons: ["Pays high prices for drugs that may not work", "Hard to withdraw coverage later"],
    whoGains: ["Patients, manufacturers"],
    whoLoses: ["Budgets"],
    mend: ["Rebate the difference if the reassessed price is lower"],
    complements: ["drugs-negotiate", "rd-value-pricing"],
    changes: [
      "Cover new drugs at launch with provisional prices",
      "Reset prices after evidence review",
    ],
  }),
  path({
    id: "innovation-public-rd",
    problemId: "innovation-slowdown",
    title: "Recycle part of drug savings into research",
    summary:
      "A fixed share of savings from price negotiation goes to public research and late-stage trials.",
    precedents: [
      {
        place: "CBO estimate",
        note: "CBO (2021) estimated that H.R. 3's price limits would mean about 59 fewer new drugs over 30 years, roughly 0.5% fewer approvals a year.",
        sourceIds: ["cbo-pharma-rd-2021"],
      },
    ],
    pros: ["Offsets lost private R&D", "Can target unmet needs"],
    cons: ["Government picks winners", "Savings are smaller"],
    whoGains: ["Researchers, patients with neglected diseases"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    requires: ["rd-public-fund"],
    spawns: ["x-public-rd-priorities"],
    changes: ["Dedicate a share of drug savings to research"],
  }),
  path({
    id: "innovation-accept",
    problemId: "innovation-slowdown",
    title: "Accept somewhat slower adoption",
    summary:
      "Accept that negotiation and assessment delay some new treatments, as in peer countries, in exchange for lower prices.",
    precedents: [
      {
        place: "Canada, Australia",
        note: "New drugs often become publicly covered a year or more after U.S. launch.",
      },
      {
        place: "Canada",
        note: "The Patented Medicine Prices Review Board's June 2025 report found that, among the 2022 new-to-Canada medicines with both Canadian and PMPRB11 sales, Canadian sales began an average of 11 months after the first international sale.",
        sourceIds: ["innovation-accept-patented-medicine-prices-2025"],
      },
    ],
    pros: ["Largest savings", "Avoids paying for unproven drugs"],
    cons: ["Some patients wait", "Manufacturer revenue falls"],
    whoGains: ["Taxpayers"],
    whoLoses: ["Patients needing the newest drugs", "Manufacturers"],
    mend: ["Exceptional-access route for individual patients"],
    spawns: ["x-central-rationing"],
    changes: ["Require assessment before coverage", "Create an exceptional-access route"],
  }),

  // ---- provider exit ----
  path({
    id: "exit-phase-rates",
    problemId: "provider-exit",
    title: "Phase rate changes in over several years",
    summary:
      "Move from today's rates to the new uniform rates in steps, so providers can cut costs instead of closing or leaving.",
    precedents: [
      {
        place: "Maryland",
        note: "Rate changes phased under the all-payer model.",
        sourceIds: ["maryland-model"],
      },
    ],
    pros: ["Time to adjust", "Fewer closures"],
    cons: ["Slower savings", "Prolongs high prices"],
    whoGains: ["Providers with high commercial revenue"],
    whoLoses: ["Taxpayers (savings delayed)"],
    mend: ["N/A"],
    complements: ["all-payer-rates", "prices-cap"],
    changes: ["Phase rate changes over several years"],
  }),
  path({
    id: "exit-opt-out-rules",
    problemId: "provider-exit",
    title: "Strict opt-out rules for cash-only practice",
    summary:
      "Clinicians may opt out, but then cannot bill the public program for anyone for a period (e.g., 2 years).",
    precedents: [
      {
        place: "U.S. Medicare",
        note: "Under U.S. Medicare's rule barring opted-out physicians from billing the program for two years, only 1.2% of active non-pediatric physicians (12,244 doctors) were opted out in 2024.",
        sourceIds: ["networks-any-provider-kff-2025"],
      },
      { place: "Canada (Ontario)", note: "Extra-billing banned; very few physicians opt out." },
    ],
    pros: ["Keeps clinicians public", "Limits two-tier"],
    cons: ["Some leave anyway", "Less flexibility"],
    whoGains: ["Public patients"],
    whoLoses: ["Clinicians wanting both public and private patients"],
    mend: ["N/A"],
    complements: ["twotier-ban"],
    changes: ["Require opted-out clinicians to stay out for a set period"],
  }),
  path({
    id: "exit-workforce-buffer",
    problemId: "provider-exit",
    title: "Lower costs for clinicians, not only pay",
    summary:
      "Offset lower rates with less billing overhead, malpractice reform, and debt relief so take-home income falls less than gross rates.",
    precedents: [
      {
        place: "Canada",
        note: "A 2011 Health Affairs study found U.S. practices spent $82,975 per doctor yearly interacting with payers—nearly four times Ontario's $22,205—while nursing staff spent 20.6 hours weekly on billing versus 2.5 in Canada.",
        sourceIds: ["exit-workforce-buffer-health-affairs-2011"],
      },
    ],
    pros: ["Protects net income", "Less paperwork"],
    cons: ["Depends on other reforms", "Slow"],
    whoGains: ["Clinicians"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    requires: ["admin-one-claims"],
    complements: ["malpractice-no-fault", "debt-free-school"],
    changes: ["Reduce billing overhead, malpractice costs, and debt for clinicians"],
  }),

  // ---- transition disruption ----
  path({
    id: "transition-phased",
    problemId: "transition-disruption",
    title: "Phased transition in waves",
    summary:
      "Move groups in stages (e.g., uninsured and children first, then Medicaid, then the individual market, then employer plans) over four or more years.",
    precedents: [
      {
        place: "Canada",
        note: "Canada expanded universal coverage in stages: the federal Hospital Insurance and Diagnostic Services Act passed in 1957, all provinces and territories had universal hospital insurance by 1961, the Medical Care Act passed in 1966, and all provincial and territorial plans included physician services by 1972.",
        sourceIds: ["churn-portable-health-canada-2025"],
      },
    ],
    pros: ["Systems can be tested before full load", "Workers have time to transition"],
    cons: ["Runs two systems in parallel", "Longer before full savings"],
    whoGains: ["Displaced workers", "People who need time to adjust"],
    whoLoses: ["Taxpayers (running two systems)"],
    mend: ["N/A"],
    conflicts: ["transition-big-bang"],
    complements: ["medicare-age-down"],
    changes: ["Move groups in waves over 4+ years"],
  }),
  path({
    id: "transition-big-bang",
    problemId: "transition-disruption",
    title: "Fast transition in one or two years",
    summary: "Everyone moves to the new system at once after a preparation period.",
    precedents: [
      {
        place: "Taiwan",
        note: "Merged its insurance programs and launched NHI within about a year in 1995.",
        sourceIds: ["taiwan-nhi"],
      },
    ],
    pros: ["Benefits and savings arrive quickly", "No parallel systems"],
    cons: ["IT and enrollment failures affect everyone at once", "Abrupt job losses"],
    whoGains: ["Uninsured people"],
    whoLoses: ["Workers displaced suddenly"],
    mend: ["Large up-front worker transition program"],
    conflicts: ["transition-phased"],
    complements: ["billing-transition"],
    changes: ["Switch everyone in one or two years after preparation"],
  }),
  path({
    id: "transition-pilot-states",
    problemId: "transition-disruption",
    title: "State pilots first",
    summary:
      "Run full universal systems in a few volunteer states, measure, then scale nationally.",
    precedents: [
      { place: "Canada (Saskatchewan)", note: "Provincial program led the national system." },
      {
        place: "Vermont",
        note: "Vermont abandoned its planned single-payer pilot in 2014 after official financing models showed it would require an 11.5% payroll tax and up to 9.5% income tax to raise $2.59 billion in new revenue.",
        sourceIds: ["transition-pilot-states-state-of-vermont-2014"],
      },
    ],
    pros: ["Real evidence before national roll-out", "Lower risk"],
    cons: ["Pilots face migration and funding limits", "Slow"],
    whoGains: ["Pilot-state residents"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    spawns: ["x-state-control"],
    changes: ["Fund volunteer state pilots", "Evaluate before national roll-out"],
  }),

  // ---- fraud concentration ----
  path({
    id: "fraudconc-integrity",
    problemId: "fraud-concentration",
    title: "Fixed budget share for program integrity",
    summary:
      "Reserve a share of administrative spending (e.g., 0.3% of benefits) for fraud detection, audits, and prosecutors.",
    precedents: [
      {
        place: "U.S. Health Care Fraud and Abuse Control Program",
        note: "Recovers several dollars per dollar spent.",
        sourceIds: ["nhcaa-fraud"],
      },
    ],
    pros: ["Proven high return", "Deters fraud"],
    cons: ["Adds admin cost", "Can burden honest providers"],
    whoGains: ["Taxpayers"],
    whoLoses: ["Fraudsters"],
    mend: ["N/A"],
    complements: ["fraud-analytics", "fraud-enrollment"],
    changes: ["Reserve a share of admin spending for program integrity"],
  }),
  path({
    id: "fraudconc-regional",
    problemId: "fraud-concentration",
    title: "Regional administrators under national rules",
    summary:
      "Split claims processing among regional administrators (public or contracted) that compete on integrity metrics.",
    precedents: [
      { place: "U.S. Medicare MACs", note: "Regional contractors process claims." },
      { place: "Canada", note: "Each province runs its own plan." },
    ],
    pros: ["No single point of failure", "Comparisons across regions"],
    cons: ["Less uniform", "More overhead"],
    whoGains: ["Regional contractors"],
    whoLoses: ["Taxpayers (duplicate overhead)"],
    mend: ["N/A"],
    complements: ["cyber-redundant"],
    spawns: ["x-metric-gaming"],
    changes: ["Split claims processing among regional administrators"],
  }),
]
