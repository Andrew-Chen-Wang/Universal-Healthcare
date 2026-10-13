/** Paths for affordability, insurer practices, and prices & market power. */
import { path } from "./types"

export const MONEY_PATHS = [
  // ---- medical debt ----
  path({
    id: "debt-cancel",
    problemId: "medical-debt",
    title: "Buy and cancel existing medical debt",
    summary:
      "Purchase old medical debt in bulk (it sells for pennies on the dollar) and forgive it.",
    precedents: [
      {
        place: "New York City, Cook County, and other localities",
        note: "Used public funds with nonprofits to cancel billions of dollars in medical debt.",
      },
    ],
    pros: ["Very cheap per dollar forgiven", "Immediate relief"],
    cons: ["One-time: debt returns unless its causes are fixed"],
    whoGains: ["Indebted households"],
    whoLoses: ["Debt buyers (small)"],
    mend: ["N/A"],
    costIds: ["med-debt"],
    complements: ["underins-zero", "debt-credit-rules"],
  }),
  path({
    id: "debt-credit-rules",
    problemId: "medical-debt",
    title: "Ban medical debt from credit reports and limit collections",
    summary:
      "Remove medical debt from credit reports, cap interest, ban lawsuits, liens, and wage garnishment over medical bills, and require charity-care screening first.",
    precedents: [
      {
        place: "Colorado, New York, other states",
        note: "State laws banning medical debt from credit reports and limiting collections.",
      },
    ],
    pros: ["Low cost", "Protects credit and housing"],
    cons: ["Hospitals may collect less and raise other prices", "Doesn't stop new bills"],
    whoGains: ["Patients"],
    whoLoses: ["Collection agencies", "Hospitals' collections revenue"],
    mend: ["N/A"],
  }),
  path({
    id: "debt-end-billing",
    problemId: "medical-debt",
    title: "Prevent new debt by ending point-of-care bills",
    summary: "With no cost sharing (or income-capped cost sharing), new medical debt mostly stops.",
    precedents: [{ place: "UK, Canada", note: "Medical debt is rare for covered services." }],
    pros: [
      "Fixes the cause, not the symptom",
      "Hospitals stop spending on collections and bad debt",
      "Patients stop avoiding care for fear of bills",
    ],
    cons: [
      "Depends on choosing zero (or near-zero) cost sharing",
      "Non-covered services (e.g., cosmetic) can still create debt",
    ],
    whoGains: ["Patients"],
    whoLoses: ["Collections industry"],
    mend: ["Transition program for collections workers"],
    requires: ["underins-zero"],
  }),

  // ---- premium burden ----
  path({
    id: "premium-to-tax",
    problemId: "premium-burden",
    title: "Replace premiums with progressive taxes",
    summary:
      "Premiums (a flat amount per worker) are replaced with taxes based on income, so lower earners pay less and higher earners pay more.",
    precedents: [
      { place: "Canada, UK, Taiwan", note: "Funded through general and payroll taxes." },
    ],
    pros: ["Most households below about $240k pay less", "Visible, accountable financing"],
    cons: ["Higher earners pay more", "Taxes are politically harder to raise than premiums"],
    whoGains: ["Low- and middle-income workers"],
    whoLoses: ["High-income households"],
    mend: ["Phase in rates and publish household calculators"],
    spawns: ["x-new-taxes", "x-wage-incidence"],
    requires: ["single-payer"],
  }),
  path({
    id: "premium-income-based",
    problemId: "premium-burden",
    title: "Income-based premiums in a multi-payer system",
    summary:
      "Premiums are set as a percentage of income (like German payroll contributions) instead of a flat amount.",
    precedents: [
      {
        place: "Germany",
        note: "About 14.6% of wages plus an extra contribution, split between employers and employees.",
        sourceIds: ["germany-gkv"],
      },
    ],
    pros: ["Fairer than flat premiums", "Keeps plan choice"],
    cons: ["Effectively a payroll tax", "Self-employed and gig workers need special rules"],
    whoGains: ["Lower earners"],
    whoLoses: ["Higher earners"],
    mend: ["N/A"],
    requires: ["regulated-multipayer"],
    spawns: ["x-wage-incidence"],
  }),

  // ---- price opacity ----
  path({
    id: "opacity-fixed-prices",
    problemId: "price-opacity",
    title: "One public price list for every service",
    summary:
      "A single fee schedule (single payer or all-payer rates) makes prices identical and public.",
    precedents: [
      { place: "Japan", note: "A national fee schedule sets the same price everywhere." },
    ],
    pros: [
      "Ends hidden negotiated rates: everyone pays the same posted price",
      "Patients and employers no longer need to shop",
      "Removes the need for transparency files and enforcement",
    ],
    cons: [
      "One price can be too high in cheap areas and too low in expensive ones",
      "Rate setting becomes a lobbying target",
    ],
    whoGains: ["Patients and employers"],
    whoLoses: ["Providers with high negotiated rates"],
    mend: ["Regional adjustments"],
    requires: ["all-payer-rates"],
  }),
  path({
    id: "opacity-disclosure",
    problemId: "price-opacity",
    title: "Enforce price transparency rules",
    summary:
      "Fully enforce the hospital and insurer transparency rules, with real penalties and standard formats.",
    precedents: [
      {
        place: "U.S. (2021–)",
        note: "Compliance has been partial; files are huge and hard to use.",
      },
    ],
    pros: ["Cheap", "Some employers use data to negotiate"],
    cons: ["Evidence that patients shop on price is weak", "Doesn't lower prices by itself"],
    whoGains: ["Employers, researchers"],
    whoLoses: ["Hospitals with high prices"],
    mend: ["N/A"],
  }),

  // ---- surprise bills ----
  path({
    id: "surprise-rate-default",
    problemId: "surprise-bills",
    title: "Set a default out-of-network rate instead of arbitration",
    summary:
      "Pay out-of-network bills at a fixed benchmark (e.g., a percentage of Medicare), ending the independent dispute resolution system.",
    precedents: [
      {
        place: "Maryland",
        note: "All-payer hospital rates make surprise hospital bills largely impossible.",
        sourceIds: ["maryland-model"],
      },
    ],
    pros: ["Ends costly arbitration", "Predictable"],
    cons: ["Provider groups argue it lowers their pay"],
    whoGains: ["Insurers and patients"],
    whoLoses: ["Private equity staffing firms"],
    mend: ["N/A"],
    costIds: ["ins-idr"],
  }),
  path({
    id: "surprise-single-payer",
    problemId: "surprise-bills",
    title: "Eliminate out-of-network status",
    summary: "With one payer or universal all-payer rates, there is no out-of-network.",
    precedents: [{ place: "Canada", note: "No networks for publicly covered services." }],
    pros: [
      "Ends surprise billing entirely",
      "Removes the federal dispute-resolution system and its cost",
    ],
    cons: [
      "Requires all providers to accept one payer or one rate",
      "Providers who opt out can still charge patients directly",
    ],
    whoGains: ["Patients"],
    whoLoses: [
      "Arbitration firms",
      "Private equity–backed staffing groups that relied on out-of-network billing",
    ],
    mend: ["N/A (arbitration firms are small)"],
    requires: ["networks-any-provider"],
  }),

  // ---- denials ----
  path({
    id: "denials-rules",
    problemId: "denials",
    title: "Regulate denials: reporting, penalties, and fast independent appeals",
    summary:
      "Insurers publish denial rates by service, pay penalties for overturned denials, and patients get fast external appeals.",
    precedents: [
      {
        place: "U.S. ACA",
        note: "Requires external review, but few patients appeal.",
        sourceIds: ["kff-consumer-2023"],
      },
    ],
    pros: [
      "Keeps private insurers but reduces abuse",
      "Public denial data lets patients and employers compare insurers",
    ],
    cons: [
      "Enforcement is hard; insurers can shift from denials to slower approvals",
      "Most patients never appeal, so penalties catch only a fraction",
    ],
    whoGains: ["Patients"],
    whoLoses: ["Insurers"],
    mend: ["N/A"],
  }),
  path({
    id: "denials-coverage-rules",
    problemId: "denials",
    title: "Public coverage rules with clinician-led review",
    summary:
      "One public set of coverage rules; payment decisions are made by a public agency with clinicians, and appeals go to an independent board.",
    precedents: [
      {
        place: "Canada, Taiwan",
        note: "Few claim-level denials; coverage limits are set at the program level instead.",
      },
    ],
    pros: ["Fewer claim denials", "Consistent rules"],
    cons: ["Moves 'no' from claim denials to program-wide coverage decisions"],
    whoGains: ["Patients and providers"],
    whoLoses: ["Utilization management firms"],
    mend: ["Transition program"],
    requires: ["single-payer"],
    spawns: ["x-central-rationing"],
  }),

  // ---- prior auth ----
  path({
    id: "pa-gold-card",
    problemId: "prior-auth",
    title: "Gold-carding and automatic approvals",
    summary:
      "Exempt clinicians with high approval rates; require real-time electronic decisions; ban prior authorization for routine and chronic care.",
    precedents: [
      { place: "Texas (2021)", note: "Gold-card law exempts physicians with 90%+ approval rates." },
    ],
    pros: ["Less paperwork", "Faster care"],
    cons: ["Insurers lose a cost-control tool"],
    whoGains: ["Clinicians and patients"],
    whoLoses: ["Insurers"],
    mend: ["N/A"],
    costIds: ["admin-total"],
  }),
  path({
    id: "pa-eliminate",
    problemId: "prior-auth",
    title: "Eliminate prior authorization except for a short list",
    summary:
      "Keep only for a small published list of high-cost, high-variation services; review afterward instead (retrospective audit).",
    precedents: [
      {
        place: "Traditional Medicare",
        note: "Uses very little prior authorization compared to Medicare Advantage.",
        sourceIds: ["medpac-2025"],
      },
    ],
    pros: ["Large admin savings"],
    cons: ["Risk of more low-value care", "Needs audit capacity"],
    whoGains: ["Clinicians, patients"],
    whoLoses: ["Utilization management firms"],
    mend: ["N/A"],
    worsens: ["low-value-care"],
    complements: ["lowvalue-coverage-list"],
  }),

  // ---- MA upcoding ----
  path({
    id: "ma-fold",
    problemId: "ma-upcoding",
    title: "Fold Medicare Advantage into the public program",
    summary: "End private Medicare plans; enrollees move to the universal public plan.",
    precedents: [
      {
        place: "Traditional Medicare",
        note: "Covers about half of beneficiaries without private plans.",
      },
    ],
    pros: ["Ends coding-intensity overpayments", "One set of rules"],
    cons: [
      "Enrollees lose extra benefits (gym, dental) unless added to the public plan",
      "Large insurer losses",
    ],
    whoGains: ["Taxpayers"],
    whoLoses: ["MA insurers and enrollees who liked their plan"],
    mend: ["Add dental, vision, hearing to the public plan"],
    requires: ["single-payer"],
    spawns: ["x-plan-choice"],
    costIds: ["ins-ma-partd"],
  }),
  path({
    id: "ma-reform",
    problemId: "ma-upcoding",
    title: "Fix Medicare Advantage payments",
    summary:
      "Base risk adjustment on two years of data, exclude diagnoses from home visits and chart reviews, and audit plans.",
    precedents: [
      {
        place: "MedPAC recommendations",
        note: "MedPAC estimates billions of dollars in coding-intensity overpayments.",
        sourceIds: ["medpac-2025"],
      },
    ],
    pros: ["Keeps plan choice", "Saves money"],
    cons: ["Plans adapt; past reforms only partly closed the gap"],
    whoGains: ["Taxpayers"],
    whoLoses: ["MA insurers"],
    mend: ["N/A"],
    spawns: ["x-metric-gaming"],
  }),

  // ---- insurer overhead ----
  path({
    id: "overhead-public",
    problemId: "insurer-overhead",
    title: "Public administration with a cost target",
    summary: "One public administrator with a published admin-cost target (e.g., under 3%).",
    precedents: [
      {
        place: "Traditional Medicare",
        note: "Admin costs around 2% (excluding provider-side costs).",
      },
    ],
    pros: [
      "Lowest overhead of any option",
      "Savings are on the provider side too (one set of rules)",
      "Admin cost target is published and auditable",
    ],
    cons: [
      "Public agencies may underinvest in customer service and fraud control",
      "Hundreds of thousands of insurer jobs end",
    ],
    whoGains: ["Taxpayers"],
    whoLoses: ["Insurer employees"],
    mend: ["Worker transition program"],
    requires: ["single-payer"],
    worsens: ["fraud-concentration"],
    costIds: ["ins-private-net", "ins-carrier-payroll"],
  }),
  path({
    id: "overhead-mlr",
    problemId: "insurer-overhead",
    title: "Tighter medical-loss ratios and non-profit requirement",
    summary:
      "Raise the required share of premiums spent on care, and require non-profit status, as in Germany or Switzerland.",
    precedents: [{ place: "Switzerland", note: "Basic insurance must be non-profit." }],
    pros: ["Keeps multiple plans", "Less profit leakage"],
    cons: [
      "Insurers may raise total spending to raise allowed overhead",
      "Vertical integration hides profits",
    ],
    whoGains: ["Enrollees"],
    whoLoses: ["Insurer shareholders"],
    mend: ["N/A"],
    requires: ["regulated-multipayer"],
    costIds: ["ins-earnings"],
  }),

  // ---- PBM ----
  path({
    id: "pbm-public",
    problemId: "pbm",
    title: "Public drug formulary and direct pricing",
    summary:
      "The public payer negotiates prices directly with manufacturers and pays pharmacies a transparent dispensing fee.",
    precedents: [
      {
        place: "UK, Canada (pCPA), Australia (PBS)",
        note: "National drug purchasing without PBM intermediaries.",
      },
    ],
    pros: [
      "Ends spread pricing, rebate games, and pharmacy clawbacks",
      "One national formulary simplifies prescribing",
    ],
    cons: [
      "The public agency must take on formulary and claims work",
      "One formulary means fewer brand choices for some patients",
    ],
    whoGains: ["Patients, pharmacies"],
    whoLoses: ["PBMs"],
    mend: ["Transition program"],
    costIds: ["pbm-markups"],
    complements: ["drugs-negotiate"],
  }),
  path({
    id: "pbm-regulate",
    problemId: "pbm",
    title: "Regulate PBMs: delink pay from drug prices, ban spread pricing",
    summary:
      "PBMs are paid flat fees, must pass rebates through, and may not own pharmacies they steer patients to.",
    precedents: [
      {
        place: "Arkansas (2025)",
        note: "Law banning PBMs from owning pharmacies in the state.",
        sourceIds: ["ftc-pbm-2025"],
      },
    ],
    pros: ["Keeps private drug plans", "Low cost"],
    cons: ["PBMs adapt with new fees"],
    whoGains: ["Independent pharmacies, patients"],
    whoLoses: ["PBMs"],
    mend: ["N/A"],
  }),

  // ---- high prices ----
  path({
    id: "all-payer-rates",
    problemId: "high-prices",
    title: "All-payer rate setting",
    summary:
      "A public commission sets the same rates for every payer (public and private), as in Maryland or Germany.",
    precedents: [
      {
        place: "Maryland",
        note: "All-payer hospital rates since 1977, later combined with global budgets.",
        sourceIds: ["maryland-model"],
      },
      { place: "Japan, Germany", note: "Uniform national fee schedules." },
    ],
    pros: ["Ends price discrimination between payers", "Works with any payer structure"],
    cons: ["Rate commission becomes the target of lobbying", "Rates too low can cause exits"],
    whoGains: ["Payers, patients"],
    whoLoses: ["High-price hospitals"],
    mend: ["Phase rates over several years; protect rural hospitals"],
    solves: ["price-opacity", "consolidation", "facility-fees"],
    spawns: ["x-price-control-exit"],
    complements: ["global-budgets", "single-payer", "regulated-multipayer"],
  }),
  path({
    id: "prices-cap",
    problemId: "high-prices",
    title: "Cap commercial prices at a multiple of Medicare",
    summary: "Commercial insurers may not pay more than e.g. 200% of Medicare rates.",
    precedents: [
      {
        place: "Montana, Oregon (state employee plans)",
        note: "Reference pricing to Medicare saved millions.",
        sourceIds: ["rand-hospital-2024"],
      },
    ],
    pros: ["Simple", "Big savings"],
    cons: ["Hospitals dependent on high commercial prices lose revenue"],
    whoGains: ["Employers and workers"],
    whoLoses: ["High-price hospitals"],
    mend: ["Phase in; transition funds for hospitals with low margins"],
    spawns: ["x-price-control-exit"],
  }),
  path({
    id: "prices-competition",
    problemId: "high-prices",
    title: "Restore competition and leave prices to markets",
    summary:
      "Antitrust enforcement, ban anti-competitive contract terms, and site-neutral pay; prices still set by negotiation.",
    precedents: [
      {
        place: "FTC hospital merger cases",
        note: "Successful challenges have lowered prices locally.",
      },
    ],
    pros: ["Keeps market pricing", "No price commission"],
    cons: ["Slow; many markets are already concentrated beyond repair"],
    whoGains: ["Patients in competitive markets"],
    whoLoses: ["Dominant systems"],
    mend: ["N/A"],
    complements: ["consolidation-antitrust"],
  }),

  // ---- consolidation ----
  path({
    id: "consolidation-antitrust",
    problemId: "consolidation",
    title: "Stronger antitrust: block mergers and undo some",
    summary:
      "Fund the FTC, review small acquisitions, and break up dominant systems where possible.",
    precedents: [
      {
        place: "U.S. FTC",
        note: "Challenges hospital mergers but rarely reverses completed ones.",
      },
    ],
    pros: ["Restores negotiating leverage"],
    cons: ["Breakups are slow and rare", "Some mergers rescue failing hospitals"],
    whoGains: ["Payers"],
    whoLoses: ["Large health systems"],
    mend: ["N/A"],
  }),
  path({
    id: "consolidation-rates",
    problemId: "consolidation",
    title: "Make consolidation irrelevant to price",
    summary: "With public rate setting, size no longer raises prices.",
    precedents: [
      {
        place: "Maryland",
        note: "Hospital mergers don't change rates set by the commission.",
        sourceIds: ["maryland-model"],
      },
    ],
    pros: ["Removes the price incentive to merge", "Works even where mergers can't be undone"],
    cons: [
      "Consolidation still reduces choice and competition on quality",
      "Large systems keep political influence over the rate commission",
    ],
    whoGains: ["Payers"],
    whoLoses: ["Systems using market power"],
    mend: ["N/A"],
    requires: ["all-payer-rates"],
  }),

  // ---- private equity ----
  path({
    id: "pe-limit",
    problemId: "private-equity",
    title: "Limit private equity ownership and require disclosure",
    summary:
      "Ownership disclosure, review of roll-ups, limits on sale-leasebacks, and liability for owners when facilities are stripped.",
    precedents: [
      { place: "Oregon (2025)", note: "Law restricting corporate control of medical practices." },
    ],
    pros: ["Targets the worst practices"],
    cons: ["Less capital for practices", "Owners restructure to avoid rules"],
    whoGains: ["Patients, staff"],
    whoLoses: ["PE firms"],
    mend: ["N/A"],
  }),
  path({
    id: "pe-rates",
    problemId: "private-equity",
    title: "Remove the profit opportunity through rate setting",
    summary:
      "Uniform rates and no out-of-network billing remove the arbitrage PE roll-ups rely on.",
    precedents: [
      {
        place: "No Surprises Act",
        note: "Hurt PE-backed staffing firms that relied on out-of-network billing.",
      },
    ],
    pros: [
      "Removes the arbitrage PE roll-ups rely on, without banning ownership",
      "No need to define 'bad' ownership in law",
    ],
    cons: [
      "PE still enters areas where margins remain (e.g., hospice, dermatology)",
      "Firms may cut staff to keep returns under fixed rates",
    ],
    whoGains: ["Payers"],
    whoLoses: ["PE firms"],
    mend: ["N/A"],
    requires: ["all-payer-rates"],
  }),

  // ---- facility fees ----
  path({
    id: "facility-site-neutral",
    problemId: "facility-fees",
    title: "Site-neutral payment",
    summary:
      "Pay the same for the same service, whether in a hospital outpatient department or an independent office.",
    precedents: [
      {
        place: "MedPAC",
        note: "Recommends site-neutral payment for many services.",
        sourceIds: ["medpac-2025"],
      },
    ],
    pros: [
      "Ends the incentive to buy practices just to add facility fees",
      "Saves patients and payers money on routine visits",
      "Lets independent practices compete on equal terms",
    ],
    cons: ["Hospitals lose revenue that partly subsidizes emergency and standby capacity"],
    whoGains: ["Patients, payers"],
    whoLoses: ["Hospitals"],
    mend: ["Separate standby-capacity payments"],
  }),
  path({
    id: "facility-ban",
    problemId: "facility-fees",
    title: "Ban facility fees for off-campus clinics",
    summary: "No facility fees for office-type care outside a hospital campus.",
    precedents: [
      { place: "Connecticut, Colorado", note: "State bans on some outpatient facility fees." },
    ],
    pros: ["Simple and easy to understand", "Ends surprise facility fees for office visits"],
    cons: ["Narrower than full site-neutral pay", "Hospitals may raise professional fees instead"],
    whoGains: ["Patients"],
    whoLoses: ["Hospital systems"],
    mend: ["N/A"],
  }),

  // ---- executive pay ----
  path({
    id: "exec-community-benefit",
    problemId: "executive-pay",
    title: "Tie nonprofit tax exemption to community benefit",
    summary:
      "Require a minimum level of charity care and community benefit, and tie executive pay rules to it.",
    precedents: [
      { place: "Oregon", note: "Minimum community benefit spending for nonprofit hospitals." },
    ],
    pros: [
      "More charity care in return for tax exemptions",
      "Ties a public subsidy to public value",
    ],
    cons: ["Community benefit is hard to measure and easy to inflate", "Doesn't directly cap pay"],
    whoGains: ["Low-income patients"],
    whoLoses: ["Executives"],
    mend: ["N/A"],
    costIds: ["ceo-pay"],
  }),
  path({
    id: "exec-budget-review",
    problemId: "executive-pay",
    title: "Public review of hospital budgets",
    summary:
      "Under global budgets, administrative and executive costs are part of the negotiated budget.",
    precedents: [
      {
        place: "Canadian hospitals",
        note: "Executive pay disclosed publicly and capped in some provinces.",
      },
    ],
    pros: [
      "Direct control over administrative spending",
      "Executive pay becomes public and comparable",
    ],
    cons: [
      "Harder to recruit experienced leaders",
      "Budget negotiators can't judge every line item",
    ],
    whoGains: ["Taxpayers"],
    whoLoses: ["Executives"],
    mend: ["N/A"],
    requires: ["global-budgets"],
  }),
]
