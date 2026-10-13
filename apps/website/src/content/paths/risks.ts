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
    ],
    pros: ["Enforces timely care", "Gives patients a concrete right"],
    cons: ["Gaming of referral dates", "Needs spare capacity somewhere"],
    whoGains: ["Patients"],
    whoLoses: ["Slow providers"],
    mend: ["N/A"],
    spawns: ["x-metric-gaming"],
  }),
  path({
    id: "waits-capacity",
    problemId: "wait-times",
    title: "Build capacity before demand rises",
    summary: "Expand workforce and facilities before universal coverage starts.",
    precedents: [{ place: "Taiwan", note: "Waits remained short after universal coverage." }],
    pros: ["Prevents waits", "Builds a sustainable workforce"],
    cons: ["Costly up front", "Slow"],
    whoGains: ["Patients"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    complements: ["phys-residency", "nurse-pipeline", "scope-expand"],
  }),
  path({
    id: "waits-activity-pay",
    problemId: "wait-times",
    title: "Pay for activity on top of budgets",
    summary: "Pay extra for procedures beyond baseline volume to cut queues.",
    precedents: [{ place: "Sweden, Norway", note: "Activity-based pay reduced waits." }],
    pros: ["Rewards throughput", "Cuts queues"],
    cons: ["Spending can rise", "Incentive to do more procedures"],
    whoGains: ["Patients on waiting lists"],
    whoLoses: ["Budgets"],
    mend: ["N/A"],
    complements: ["global-budgets"],
  }),

  // ---- two-tier ----
  path({
    id: "twotier-allow",
    problemId: "two-tier",
    title: "Allow private insurance for covered services",
    summary: "People may buy private insurance to skip public queues.",
    precedents: [{ place: "UK, Australia", note: "Private insurance coexists." }],
    pros: ["Relief valve for waits", "Adds private money"],
    cons: ["Clinicians may move to private work", "Unequal care"],
    whoGains: ["Wealthy people"],
    whoLoses: ["Public patients if clinicians move"],
    mend: ["Require minimum public hours"],
    conflicts: ["twotier-ban"],
  }),
  path({
    id: "twotier-ban",
    problemId: "two-tier",
    title: "Ban duplicate private insurance",
    summary: "No private insurance for publicly covered services.",
    precedents: [
      {
        place: "Canada (most provinces)",
        note: "Limits on private payment; Chaoulli (2005) struck down Quebec's ban.",
      },
    ],
    pros: ["Equal care for everyone", "Keeps clinicians in the public system"],
    cons: ["No escape from waits", "Legal challenges (as in Canada)"],
    whoGains: ["Equity"],
    whoLoses: ["People wanting faster care"],
    mend: ["Strong wait-time guarantees"],
    conflicts: ["twotier-allow"],
  }),
  path({
    id: "twotier-supplemental",
    problemId: "two-tier",
    title: "Allow supplemental only (non-covered items)",
    summary: "Private insurance only for things not covered (private rooms, cosmetic).",
    precedents: [{ place: "Taiwan, Canada", note: "Supplemental only." }],
    pros: ["Compromise: extras are private, core care is equal", "Keeps some insurer jobs"],
    cons: ["Limited relief for waits", "Line between extras and core care blurs"],
    whoGains: ["People who want extras"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
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
    ],
    pros: ["Hospitals keep flexibility", "No central approval bottleneck"],
    cons: ["Rich systems still out-invest poor ones", "Can fund duplication"],
    whoGains: ["Hospital management"],
    whoLoses: ["Poorer hospitals"],
    mend: ["N/A"],
    complements: ["fee-for-service-fixed"],
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
    ],
    pros: ["Patients get new drugs fast", "Keeps the U.S. an attractive launch market"],
    cons: ["Pays high prices for drugs that may not work", "Hard to withdraw coverage later"],
    whoGains: ["Patients, manufacturers"],
    whoLoses: ["Budgets"],
    mend: ["Rebate the difference if the reassessed price is lower"],
    complements: ["drugs-negotiate", "rd-value-pricing"],
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
        note: "Lower drug revenue would reduce new drug approvals slightly over 30 years.",
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
    ],
    pros: ["Largest savings", "Avoids paying for unproven drugs"],
    cons: ["Some patients wait", "Manufacturer revenue falls"],
    whoGains: ["Taxpayers"],
    whoLoses: ["Patients needing the newest drugs", "Manufacturers"],
    mend: ["Exceptional-access route for individual patients"],
    spawns: ["x-central-rationing"],
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
  }),
  path({
    id: "exit-opt-out-rules",
    problemId: "provider-exit",
    title: "Strict opt-out rules for cash-only practice",
    summary:
      "Clinicians may opt out, but then cannot bill the public program for anyone for a period (e.g., 2 years).",
    precedents: [
      { place: "U.S. Medicare", note: "Opted-out physicians may not bill Medicare for two years." },
      { place: "Canada (Ontario)", note: "Extra-billing banned; very few physicians opt out." },
    ],
    pros: ["Keeps clinicians public", "Limits two-tier"],
    cons: ["Some leave anyway", "Less flexibility"],
    whoGains: ["Public patients"],
    whoLoses: ["Clinicians wanting both public and private patients"],
    mend: ["N/A"],
    complements: ["twotier-ban"],
  }),
  path({
    id: "exit-workforce-buffer",
    problemId: "provider-exit",
    title: "Lower costs for clinicians, not only pay",
    summary:
      "Offset lower rates with less billing overhead, malpractice reform, and debt relief so take-home income falls less than gross rates.",
    precedents: [{ place: "Canada", note: "Physician practices need very little billing staff." }],
    pros: ["Protects net income", "Less paperwork"],
    cons: ["Depends on other reforms", "Slow"],
    whoGains: ["Clinicians"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    requires: ["admin-one-claims"],
    complements: ["malpractice-no-fault", "debt-free-school"],
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
        note: "Hospital coverage came in 1957 and physician coverage in 1966, rolled out province by province.",
      },
    ],
    pros: ["Systems can be tested before full load", "Workers have time to transition"],
    cons: ["Runs two systems in parallel", "Longer before full savings"],
    whoGains: ["Displaced workers", "People who need time to adjust"],
    whoLoses: ["Taxpayers (running two systems)"],
    mend: ["N/A"],
    conflicts: ["transition-big-bang"],
    complements: ["medicare-age-down"],
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
  }),
  path({
    id: "transition-pilot-states",
    problemId: "transition-disruption",
    title: "State pilots first",
    summary:
      "Run full universal systems in a few volunteer states, measure, then scale nationally.",
    precedents: [
      { place: "Canada (Saskatchewan)", note: "Provincial program led the national system." },
      { place: "Vermont", note: "Planned a single payer in 2014 but abandoned it over financing." },
    ],
    pros: ["Real evidence before national roll-out", "Lower risk"],
    cons: ["Pilots face migration and funding limits", "Slow"],
    whoGains: ["Pilot-state residents"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
    spawns: ["x-state-control"],
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
  }),
]
