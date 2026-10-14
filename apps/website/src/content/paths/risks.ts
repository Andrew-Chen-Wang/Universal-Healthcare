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
        note: "Danish regions made a historically high 242,060 referrals to private hospitals and clinics in 2023, as reported by Danske Regioner in January 2024.",
        sourceIds: ["waits-guarantee-danske-regioner-2024"],
      },
    ],
    how: {
      "wait-times": {
        note: "A time limit gives patients a concrete right to timely care by allowing them to use another provider, including abroad, at the payer’s cost.",
      },
      "x-metric-gaming": { note: "A care deadline can encourage gaming of referral dates." },
      "t-dependent-reforms": {
        note: "Allowing patients to switch providers after a care deadline requires spare capacity somewhere else.",
        hurts: ["providers"],
      },
    },
    worsens: ["t-dependent-reforms"],
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
        note: "Taiwan's 15-year Health and Medical Care Plan began in July 1985, and by 2000 its hospitals had 126,476 beds, or 5.7 beds per 1,000 population.",
        sourceIds: ["waits-capacity-the-epma-journal-2010"],
      },
    ],
    how: {
      "wait-times": {
        note: "Expanding workforce and facilities before universal coverage begins prevents waits and builds a sustainable workforce.",
      },
      "t-delayed-benefits": {
        note: "Expanding workforce and facilities before universal coverage is costly up front and slow.",
        hurts: ["taxpayers"],
      },
    },
    worsens: ["t-delayed-benefits"],
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
    how: {
      "wait-times": {
        note: "Extra payment for procedures beyond baseline volume rewards throughput and cuts queues.",
      },
      "t-higher-spending": {
        note: "Paying extra for procedures beyond baseline volume can increase spending.",
      },
      "low-value-care": {
        note: "Extra payment beyond baseline volume creates an incentive to perform more procedures.",
      },
    },
    worsens: ["t-higher-spending", "low-value-care"],
    complements: ["global-budgets"],
    changes: ["Pay extra for procedures beyond baseline volume"],
  }),

  // ---- two-tier ----
  path({
    id: "twotier-allow",
    problemId: "two-tier",
    role: "answers",
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
    how: {
      "two-tier": {
        note: "Allowing private insurance to bypass public queues offers relief from waits and adds private money. Clinicians may move into private work, and care becomes unequal.",
        helps: ["high-earners"],
        hurts: ["public-care-users"],
      },
      "wait-times": {
        note: "Private insurance lets patients bypass public queues, providing a relief valve for waits.",
      },
    },
    mend: ["Require minimum public hours"],
    solves: ["wait-times"],
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
    how: {
      "two-tier": {
        note: "Banning private insurance for publicly covered services keeps clinicians in the public system and supports equal care for everyone.",
      },
      "wait-times": {
        note: "Banning private insurance for publicly covered services leaves patients without a private escape from waits.",
      },
      "t-political-resistance": {
        note: "A ban on private insurance for publicly covered services can face legal challenges, as in Canada.",
      },
    },
    mend: ["Strong wait-time guarantees"],
    worsens: ["wait-times", "t-political-resistance"],
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
        note: "Private supplemental insurers in Canada covered 27 million people and paid $53.3 billion in health claims in 2024.",
        sourceIds: ["twotier-supplemental-canadian-life-and-health-2025"],
      },
    ],
    how: {
      "two-tier": {
        note: "Limiting private insurance to uncovered extras keeps core care equal while allowing private rooms and cosmetic services. It also preserves some insurer jobs.",
        helps: ["employer-covered"],
      },
      "t-enforcement-burden": {
        note: "Restricting private insurance to extras is difficult when the boundary between extras and core care blurs.",
      },
      "t-limited-reach": {
        note: "Private insurance limited to uncovered extras offers little relief from waits for core care.",
      },
    },
    worsens: ["t-enforcement-burden", "t-limited-reach"],
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
    how: {
      underfunding: {
        note: "Earmarked revenue and automatic budget growth protect health funding from annual political fights and allow providers to plan.",
        helps: ["heavy-care-users"],
      },
      "t-higher-spending": {
        note: "Automatic budget growth with costs, population, and age mix weakens spending control.",
      },
      "t-funding-instability": { note: "Earmarked health funds can face insolvency scares." },
      "x-new-taxes": {
        note: "Dedicated health financing uses earmarked payroll and income contributions.",
      },
    },
    mend: ["Pair with a spending-growth target that triggers review"],
    worsens: ["t-higher-spending", "t-funding-instability"],
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
    role: "answers",
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
    how: {
      underfunding: {
        note: "Setting the health budget annually alongside other spending provides strong spending control and lets health compete openly with other priorities. Health funding is squeezed in downturns.",
      },
      "wait-times": { note: "Waits rise when annually set health budgets lag demand." },
      "x-budget-rationing": {
        note: "Setting the health budget annually can leave funding behind demand, with longer waits for care.",
      },
    },
    mend: ["A legal floor (e.g., per-capita spending cannot fall in real terms)"],
    worsens: ["wait-times"],
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
    how: {
      underfunding: {
        note: "An independent board’s budget recommendations against a growth target balance stability and spending control. Requiring public justification for departures makes budget decisions transparent.",
        helps: ["taxpayers"],
      },
      "t-enforcement-burden": {
        note: "Budget growth targets are often missed, and the independent board’s recommendations can be ignored.",
      },
    },
    worsens: ["t-enforcement-burden"],
    complements: ["underfunding-trust-fund", "global-budgets"],
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
    how: {
      "capital-underinvestment": {
        note: "A separate capital budget allocates buildings and major equipment by regional need rather than operating revenue, allowing investment in underserved areas. Capital funding remains easy to cut when budgets are tight.",
        helps: ["underserved-residents"],
      },
      "low-value-care": {
        note: "Allocating major equipment through a separate regional capital budget prevents duplicate equipment arms races.",
      },
      disparities: {
        note: "Allocating capital by regional need allows investment to be directed to underserved areas.",
      },
      "t-delayed-benefits": {
        note: "Regional allocation through a separate capital budget can involve slow approvals.",
      },
      "x-budget-rationing": {
        note: "A separate capital budget is vulnerable to cuts when budgets are tight.",
      },
    },
    mend: ["Multi-year capital commitments set by law"],
    worsens: ["t-delayed-benefits"],
    solves: ["low-value-care", "disparities"],
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
        note: "Medicare's FY 2025 inpatient capital prospective-payment calculation uses a national capital standard federal base rate of $512.14, subject to applicable payment adjustments.",
        sourceIds: ["capital-in-rates-centers-for-medicare-med-2024"],
      },
    ],
    how: {
      "capital-underinvestment": {
        note: "Including a capital component in payments lets hospitals decide how to invest, preserving flexibility and avoiding a central approval bottleneck.",
        helps: ["health-executives"],
      },
      disparities: {
        note: "Funding capital through hospital payments leaves richer systems able to out-invest poorer ones.",
        hurts: ["providers"],
      },
      "low-value-care": {
        note: "Letting hospitals invest capital components of payments can fund duplicate equipment or facilities.",
      },
    },
    worsens: ["disparities", "low-value-care"],
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
    how: {
      "innovation-slowdown": {
        note: "Immediate coverage at a provisional price gives patients fast access to new drugs and keeps the United States an attractive launch market.",
      },
      "t-uncertain-evidence": {
        note: "Immediate provisional coverage pays high prices for drugs that may not work while evidence is collected.",
      },
      "t-political-resistance": {
        note: "Once new drugs or devices receive immediate coverage, withdrawing that coverage later is difficult.",
      },
    },
    mend: ["Rebate the difference if the reassessed price is lower"],
    worsens: ["t-uncertain-evidence", "t-political-resistance"],
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
    how: {
      "innovation-slowdown": {
        note: "Directing part of price-negotiation savings to public research and late-stage trials offsets lost private research and can target unmet needs.",
      },
      "x-public-rd-priorities": {
        note: "Directing negotiation savings to public research puts the choice of research winners in government hands.",
      },
      "t-limited-reach": {
        note: "Allocating part of negotiation savings to public research leaves smaller savings.",
      },
    },
    worsens: ["t-limited-reach"],
    requires: ["rd-public-fund"],
    spawns: ["x-public-rd-priorities"],
    changes: ["Dedicate a share of drug savings to research"],
  }),
  path({
    id: "innovation-accept",
    problemId: "innovation-slowdown",
    role: "answers",
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
    how: {
      "innovation-slowdown": {
        note: "Accepting delays from negotiation and assessment yields the largest savings and avoids paying for unproven drugs. Some patients wait for new treatments.",
      },
      "drug-prices": {
        note: "Accepting negotiation and assessment delays obtains lower prices and the largest savings on new treatments.",
      },
      "low-value-care": { note: "Assessment before coverage avoids paying for unproven drugs." },
      "t-income-loss": {
        note: "Negotiating lower prices and assessing new treatments reduces manufacturer revenue.",
      },
      "x-central-rationing": {
        note: "Coverage assessment delays some new treatments while avoiding payment for unproven drugs.",
      },
    },
    mend: ["Exceptional-access route for individual patients"],
    worsens: ["t-income-loss"],
    solves: ["drug-prices", "low-value-care"],
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
    how: {
      "provider-exit": {
        note: "Moving to uniform payment rates in steps gives providers time to cut costs and adjust, reducing closures.",
      },
      "t-delayed-benefits": { note: "Phasing payment rates in gradually delays savings." },
      "high-prices": {
        note: "Gradually moving to uniform payment rates prolongs today’s high prices.",
      },
    },
    worsens: ["t-delayed-benefits", "high-prices"],
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
    how: {
      "provider-exit": {
        note: "Barring opted-out clinicians from billing the public program for a period encourages them to remain in public practice, although some still leave.",
      },
      "two-tier": {
        note: "Barring opted-out clinicians from public billing limits mixing public and cash-only practice and helps limit a private fast lane.",
      },
      "t-reduced-flexibility": {
        note: "The public billing restriction limits clinicians’ flexibility to combine public and private practice.",
        hurts: ["clinicians"],
      },
    },
    worsens: ["t-reduced-flexibility"],
    solves: ["two-tier"],
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
        note: "A 2011 Health Affairs study estimated annual payer-interaction costs of $82,975 per U.S. physician versus $22,205 in Ontario, with nursing staff spending 20.6 versus 2.5 hours per physician per week on all payer interactions.",
        sourceIds: ["exit-workforce-buffer-health-affairs-2011"],
      },
    ],
    how: {
      "provider-exit": {
        note: "Reducing billing overhead, reforming malpractice, and relieving debt protect clinicians’ take-home income when payment rates fall.",
      },
      "admin-cost": {
        note: "Reducing billing overhead cuts the paperwork clinicians must handle.",
      },
      "t-dependent-reforms": {
        note: "Protecting take-home income through lower overhead, malpractice reform, and debt relief depends on those other reforms being carried out.",
      },
      "t-delayed-benefits": {
        note: "Reducing clinicians’ costs through complementary reforms is slow, so the income protection takes time to arrive.",
      },
    },
    worsens: ["t-dependent-reforms", "t-delayed-benefits"],
    solves: ["admin-cost"],
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
    how: {
      "transition-disruption": {
        note: "Moving coverage groups in stages lets systems be tested before the full load arrives and gives workers time to transition.",
        helps: ["changing-lives"],
      },
      "admin-cost": {
        note: "Moving groups in stages requires the old and new systems to operate in parallel.",
      },
      "t-delayed-benefits": {
        note: "Moving groups in stages extends the time before the new system delivers its full savings.",
      },
    },
    worsens: ["admin-cost", "t-delayed-benefits"],
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
    how: {
      "transition-disruption": {
        note: "Moving everyone after a preparation period brings benefits and savings quickly and avoids parallel systems, but causes abrupt job losses.",
        helps: ["uninsured"],
      },
      "admin-cost": {
        note: "Moving everyone to the new system together avoids operating parallel coverage systems.",
      },
      "t-systems-implementation": {
        note: "Moving everyone together means information-system and enrollment failures affect everyone at once.",
      },
    },
    mend: ["Large up-front worker transition program"],
    worsens: ["t-systems-implementation"],
    solves: ["admin-cost"],
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
        note: "Vermont's December 2014 Green Mountain Care report estimated $2.580 billion in needed new state tax revenue for 2017 and modeled an 11.5% employer payroll tax plus income-based public premiums up to 9.5%.",
        sourceIds: ["transition-pilot-states-state-of-vermont-2014"],
      },
    ],
    how: {
      "transition-disruption": {
        note: "Testing full universal systems in volunteer states provides real evidence before national expansion and lowers rollout risk.",
        helps: ["states"],
      },
      "t-funding-instability": {
        note: "Volunteer-state pilots face migration and funding limits while attempting to run full universal systems.",
      },
      "t-delayed-benefits": {
        note: "Testing state systems before expanding nationally makes the transition slow.",
      },
    },
    worsens: ["t-funding-instability", "t-delayed-benefits"],
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
    how: {
      "fraud-concentration": {
        note: "Reserving administrative funding for fraud detection, audits, and prosecutors deters fraud; the cited control program recovers more than it spends.",
      },
      fraud: {
        note: "Dedicated funding for fraud detection, audits, and prosecutors supports deterrence and recovery of fraudulent payments.",
      },
      "admin-cost": {
        note: "Reserving funding for fraud detection, audits, and prosecutors adds administrative cost.",
      },
      "t-administrative-work": {
        note: "Fraud detection and audits can also burden honest providers.",
      },
    },
    worsens: ["admin-cost", "t-administrative-work"],
    solves: ["fraud"],
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
      {
        place: "United States",
        note: "In FY 2024, 12 regional A/B and 4 DME Medicare Administrative Contractors processed over 1.1 billion fee-for-service claims and paid $459.7 billion in benefits for 33.9 million beneficiaries under national rules.",
        sourceIds: ["fraudconc-regional-centers-for-medicare-med-2024"],
      },
    ],
    how: {
      "fraud-concentration": {
        note: "Dividing claims processing among regional administrators avoids a single point of failure and permits comparisons of integrity across regions.",
        helps: ["health-admin-vendors"],
      },
      "admin-cost": {
        note: "Splitting claims processing among regional administrators adds overhead.",
      },
      "x-metric-gaming": {
        note: "Making regional administrators compete on integrity metrics puts those measures at the center of performance comparisons.",
      },
    },
    worsens: ["admin-cost"],
    complements: ["cyber-redundant"],
    spawns: ["x-metric-gaming"],
    changes: ["Split claims processing among regional administrators"],
  }),
]
