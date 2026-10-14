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
      {
        place: "Cook County, Illinois",
        note: "By June 2025, Cook County's medical debt relief program had canceled $664.7 million in debt for 556,815 residents since its 2022 launch.",
        sourceIds: ["debt-cancel-cook-county-government-2025"],
      },
    ],
    how: {
      "medical-debt": {
        note: "Buying old medical debt in bulk at a low price and forgiving it provides immediate relief and credit repair. Debt selling for pennies on the dollar makes forgiveness inexpensive relative to the amount forgiven.",
      },
      "t-limited-reach": {
        note: "Forgiveness offers relief only once, and debt returns unless its causes change. It reaches debt sold to buyers rather than debt still held by hospitals.",
      },
    },
    worsens: ["t-limited-reach"],
    costIds: ["med-debt"],
    complements: ["underins-zero", "debt-credit-rules"],
    changes: [
      "Appropriate funds to buy medical debt from debt buyers and hospitals",
      "Contract with nonprofits to buy and forgive debt",
      "Notify forgiven patients and credit bureaus",
    ],
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
      {
        place: "United States",
        note: "After 2023 credit-report changes, consumers whose largest medical collection was just below $500 saw credit scores rise about 20 points more than those just above it.",
        sourceIds: ["debt-credit-rules-consumer-financial-prote-2024"],
      },
    ],
    how: {
      "medical-debt": {
        note: "Removing medical debt from credit reports and restricting interest and collections protects credit and housing at low cost. These protections do not stop new medical bills.",
      },
      "high-prices": {
        note: "Limits on debt collection may reduce hospital collections and lead hospitals to raise other prices.",
      },
    },
    worsens: ["high-prices"],
    changes: [
      "Ban medical debt on credit reports nationally",
      "Cap interest on medical debt at 0–3%",
      "Ban lawsuits, liens, and wage garnishment for medical debt",
      "Require charity-care screening before collections",
    ],
  }),
  path({
    id: "debt-end-billing",
    problemId: "medical-debt",
    title: "Prevent new debt by ending point-of-care bills",
    summary: "With no cost sharing (or income-capped cost sharing), new medical debt mostly stops.",
    precedents: [
      { place: "UK, Canada", note: "Medical debt is rare for covered services." },
      {
        place: "United Kingdom",
        note: "In 2023, 4% of UK adults reported serious difficulty paying medical bills or being unable to pay them, compared with 22% in the United States.",
        sourceIds: ["debt-end-billing-commonwealth-fund-2024"],
      },
    ],
    how: {
      "medical-debt": {
        note: "Eliminating or closely capping cost sharing addresses the cause of new medical debt, reduces hospitals' collections and bad-debt work, and removes patients' fear of bills when seeking care. Uncovered services, such as cosmetic care, can still create debt.",
      },
      "admin-cost": {
        note: "Eliminating or closely capping cost sharing removes hospital work on collections and bad debt.",
      },
      "t-dependent-reforms": {
        note: "Preventing bills from generating debt depends on eliminating or nearly eliminating cost sharing.",
      },
    },
    mend: ["Transition program for collections workers"],
    worsens: ["t-dependent-reforms"],
    solves: ["admin-cost"],
    requires: ["underins-zero"],
    changes: [
      "Eliminate point-of-care charges for covered services",
      "Wind down hospital patient-collections departments",
    ],
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
      {
        place: "Canada",
        note: "In 2022, government spending financed 71% of Canada's total health expenditure in a system funded mainly through taxes.",
        sourceIds: ["premium-to-tax-commonwealth-fund-2026"],
      },
    ],
    how: {
      "premium-burden": {
        note: "Replacing flat premiums with income-based taxes lowers payments for most households below the stated high-income threshold. Tax financing also makes the funding visible and accountable.",
      },
      "x-new-taxes": { note: "Income-based taxes make higher earners pay more." },
      "t-political-resistance": {
        note: "Tax financing is politically harder to increase than premiums.",
      },
    },
    mend: ["Phase in rates and publish household calculators"],
    worsens: ["t-political-resistance"],
    spawns: ["x-new-taxes"],
    requires: ["single-payer"],
    changes: [
      "End employer and employee premiums for covered services",
      "Enact replacement taxes (payroll, income, or both) at published rates",
      "Publish household calculators showing net change",
    ],
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
        note: "14.6% of wages split between employers and employees, plus a fund-specific extra contribution averaging about 3% in 2026 (roughly 17.5% in total).",
        sourceIds: ["germany-gkv"],
      },
    ],
    how: {
      "premium-burden": {
        note: "Setting premiums as a share of income makes contributions fairer than flat premiums while retaining plan choice.",
      },
      "x-wage-incidence": {
        note: "Income-based premiums function as payroll contributions rather than a flat amount per worker.",
      },
      "x-plan-choice": {
        note: "Income-based premiums retain the ability to choose a health plan.",
      },
      "x-new-taxes": { note: "Income-based premiums function as a payroll tax." },
      "t-administrative-work": {
        note: "Income-based contributions require special rules for self-employed and gig workers.",
      },
    },
    worsens: ["x-new-taxes", "t-administrative-work"],
    solves: ["x-plan-choice"],
    requires: ["regulated-multipayer"],
    spawns: ["x-wage-incidence"],
    changes: [
      "Set premiums as a percentage of wages, split between employer and employee",
      "Create rules for self-employed and gig workers",
      "Collect through payroll withholding",
    ],
  }),

  // ---- price opacity ----
  path({
    id: "opacity-fixed-prices",
    problemId: "price-opacity",
    title: "One public price list for every service",
    summary:
      "A single fee schedule (single payer or all-payer rates) makes prices identical and public.",
    precedents: [
      {
        place: "Japan",
        note: "A 2019 study reported that Japan's national fee schedule listed about 4,000 service items and 17,000 pharmaceuticals.",
        sourceIds: ["opacity-fixed-prices-globalization-and-health-2019"],
      },
    ],
    how: {
      "price-opacity": {
        note: "A public uniform fee schedule ends hidden negotiated rates by making everyone pay the same posted price. Patients and employers no longer need to shop, and transparency files and their enforcement become unnecessary.",
        helps: ["heavy-care-users"],
      },
      "t-reduced-flexibility": {
        note: "Uniform prices can be too high in low-cost areas and too low in high-cost areas.",
      },
      "t-political-resistance": {
        note: "Setting a public fee schedule creates a target for lobbying.",
      },
    },
    mend: ["Regional adjustments"],
    worsens: ["t-reduced-flexibility", "t-political-resistance"],
    requires: ["all-payer-rates"],
    changes: [
      "Publish one national fee schedule and all hospital budgets",
      "Ban confidential negotiated rates for covered services",
    ],
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
      {
        place: "United States",
        note: "CMS estimated that 70% of hospitals fully complied with both federal price-transparency requirements in November 2022, up from 27% in February 2021.",
        sourceIds: ["opacity-disclosure-u-s-government-accountab-2024"],
      },
    ],
    how: {
      "price-opacity": {
        note: "Enforcing price disclosure with penalties and standard formats makes prices available at low cost. Some employers use the data to negotiate.",
      },
      "t-limited-reach": {
        note: "Evidence that patients shop by price is weak, and disclosure alone does not reduce prices.",
      },
    },
    worsens: ["t-limited-reach"],
    changes: [
      "Raise penalties for transparency non-compliance",
      "Standardize file formats and require patient-facing price estimates",
    ],
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
    how: {
      "surprise-bills": {
        note: "A fixed benchmark for out-of-network bills replaces costly arbitration in a dispute system flooded with cases. It makes payment predictable for providers and insurers.",
        helps: ["insurers"],
      },
      "t-income-loss": {
        note: "Provider groups argue that fixed benchmarks reduce their pay.",
        hurts: ["private-equity"],
      },
      "provider-exit": { note: "Benchmarks set too low weaken emergency and anesthesia staffing." },
    },
    worsens: ["t-income-loss", "provider-exit"],
    costIds: ["ins-idr"],
    changes: [
      "Set out-of-network payment at a fixed percentage of Medicare",
      "End the independent dispute resolution process",
      "Include ground ambulances",
    ],
  }),
  path({
    id: "surprise-single-payer",
    problemId: "surprise-bills",
    title: "Eliminate out-of-network status",
    summary: "With one payer or universal all-payer rates, there is no out-of-network.",
    precedents: [
      { place: "Canada", note: "No networks for publicly covered services." },
      {
        place: "Taiwan",
        note: "At the end of 2023, Taiwan's national insurer contracted with 23,085 hospitals and clinics, representing 91.6% of medical institutions nationwide.",
        sourceIds: ["surprise-single-payer-taiwan-ministry-of-healt-2024"],
      },
    ],
    how: {
      "surprise-bills": {
        note: "A single payer or universal all-payer rates removes out-of-network billing and ends surprise bills entirely. It also removes the federal dispute-resolution system and its cost.",
      },
      "admin-cost": {
        note: "Removing out-of-network billing eliminates the federal dispute-resolution system and its cost.",
      },
      "t-dependent-reforms": {
        note: "Removing out-of-network billing requires all providers to accept the payer or uniform rate.",
        hurts: ["health-admin-vendors", "private-equity"],
      },
      "provider-exit": { note: "Providers opting out can still charge patients directly." },
    },
    worsens: ["t-dependent-reforms", "provider-exit"],
    solves: ["admin-cost"],
    requires: ["networks-any-provider"],
    changes: [
      "Eliminate network status for covered services",
      "Ban balance billing by any provider that bills the program",
    ],
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
    how: {
      denials: {
        note: "Publishing denial rates, penalizing overturned denials, and providing fast external appeals reduces abuse while retaining private insurers. Public data lets patients and employers compare insurers.",
      },
      "t-enforcement-burden": {
        note: "Insurers can respond to denial penalties by slowing approvals, making enforcement difficult.",
      },
      "t-limited-reach": {
        note: "Most patients never appeal, so overturned-denial penalties catch only a fraction of cases.",
      },
    },
    worsens: ["t-enforcement-burden", "t-limited-reach"],
    changes: [
      "Require insurers to publish denial rates by service and reason",
      "Penalize insurers for denials overturned on appeal",
      "Create fast external appeals (72 hours for urgent care)",
    ],
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
      {
        place: "Taiwan",
        note: "In a 2017 Taiwan claims-review experiment, decisions judged too harsh fell from 11.08% to 2.59% of assessed cases when physician reviewers' identities were disclosed.",
        sourceIds: ["denials-coverage-rules-scientific-reports-2022"],
      },
    ],
    how: {
      denials: {
        note: "Public coverage rules administered with clinicians and independent appeals replace many claim-level denials with consistent rules for every patient and provider.",
      },
      "x-central-rationing": {
        note: "Public coverage decisions move refusals from individual claims to program-wide rules.",
      },
      "t-reduced-flexibility": {
        note: "An error in the shared rulebook affects everyone.",
        hurts: ["health-admin-vendors"],
      },
    },
    mend: ["Transition program"],
    worsens: ["t-reduced-flexibility"],
    requires: ["single-payer"],
    spawns: ["x-central-rationing"],
    changes: [
      "Publish one national coverage rulebook",
      "Create an independent appeals board with clinician reviewers",
    ],
  }),

  // ---- prior auth ----
  path({
    id: "pa-gold-card",
    problemId: "prior-auth",
    title: "Gold-carding and automatic approvals",
    summary:
      "Exempt clinicians with high approval rates; require real-time electronic decisions; ban prior authorization for routine and chronic care.",
    precedents: [
      {
        place: "Texas (2021)",
        note: "HB 3459 (2021) exempts physicians with 90%+ approval rates over six months, but only in state-regulated plans (about a fifth of the market).",
      },
      {
        place: "Texas",
        note: "A 2024 Texas insurance department report found that 74% of providers meeting evaluation thresholds received a prior-authorization gold card.",
        sourceIds: ["pa-gold-card-texas-department-of-insu-2024"],
      },
    ],
    how: {
      "prior-auth": {
        note: "Exempting clinicians with strong approval records, requiring immediate electronic decisions, and removing authorization for routine and chronic care reduces paperwork for high-performing clinicians. Their patients receive care faster.",
      },
      "t-higher-spending": {
        note: "Authorization exemptions remove an insurer cost-control tool.",
      },
      "t-limited-reach": {
        note: "Few physicians qualified for the Texas exemptions during the early implementation period.",
      },
    },
    worsens: ["t-higher-spending", "t-limited-reach"],
    costIds: ["admin-total"],
    changes: [
      "Exempt clinicians with high approval rates from prior authorization",
      "Require electronic real-time decisions",
      "Ban prior authorization for routine and chronic care",
    ],
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
    how: {
      "prior-auth": {
        note: "Restricting prior authorization to a small published list and reviewing other care afterward removes care delays. It produces substantial administrative savings for clinics and insurers.",
      },
      "admin-cost": {
        note: "Removing most prior authorization produces substantial administrative savings for clinics and insurers.",
      },
      "low-value-care": { note: "Removing most advance review risks more low-value care." },
      "t-oversight-limits": { note: "Retrospective review requires audit capacity." },
    },
    solves: ["admin-cost"],
    worsens: ["low-value-care", "t-oversight-limits"],
    complements: ["lowvalue-coverage-list"],
    changes: ["Limit prior authorization to a published short list", "Fund post-payment audits"],
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
      {
        place: "United States",
        note: "For 2024, MedPAC estimated Medicare Advantage spending would be $83 billion higher than spending for similar beneficiaries in traditional Medicare.",
        sourceIds: ["ma-fold-kff-2024"],
      },
    ],
    how: {
      "ma-upcoding": {
        note: "Moving private Medicare enrollees into a universal public plan ends coding-intensity overpayments and applies the same rules across coverage.",
      },
      "x-plan-choice": {
        note: "Ending private Medicare plans moves enrollees into the universal public plan and removes their private-plan options.",
      },
      "dental-gap": {
        note: "Enrollees lose extra benefits, including gym and dental benefits, unless the public plan adds them.",
      },
      "t-income-loss": { note: "Ending private Medicare plans causes large insurer losses." },
    },
    mend: ["Add dental, vision, hearing to the public plan"],
    worsens: ["dental-gap", "t-income-loss"],
    requires: ["single-payer"],
    spawns: ["x-plan-choice"],
    costIds: ["ins-ma-partd"],
    changes: [
      "Stop new Medicare Advantage enrollment",
      "Move enrollees into the public plan on a fixed date",
      "Add dental, vision, hearing to the public plan",
    ],
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
    how: {
      "ma-upcoding": {
        note: "Changing diagnosis sources and risk-adjustment data and auditing plans saves money while preserving plan choice and extra benefits. It retains the existing popular program.",
      },
      "x-plan-choice": {
        note: "Reforming payments while retaining private Medicare plans preserves plan choice and extra benefits.",
      },
      "x-metric-gaming": {
        note: "Plans adapt to coding reforms, and previous reforms only partly closed the payment gap.",
      },
      "dental-gap": { note: "Plans may cut extra benefits as payments decline." },
    },
    worsens: ["dental-gap"],
    solves: ["x-plan-choice"],
    spawns: ["x-metric-gaming"],
    changes: [
      "Use two years of diagnosis data for risk scores",
      "Exclude diagnoses from home visits and chart reviews",
      "Expand RADV audits with extrapolated recoveries",
    ],
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
        note: "Administrative costs are about 1.4% of spending per the Trustees, excluding provider-side costs and work done by Social Security and the IRS.",
      },
      {
        place: "United States",
        note: "In 2023, federal administrative expenses were 1.4% of Medicare hospital-insurance costs and 0.9% of supplementary medical-insurance costs.",
        sourceIds: ["overhead-public-social-security-administ-2024"],
      },
    ],
    how: {
      "insurer-overhead": {
        note: "A public administrator minimizes overhead and reduces provider-side administration through a shared set of rules. Publishing an administrative-cost target makes performance auditable.",
      },
      "fraud-concentration": {
        note: "A public administrator takes over administration while public agencies may underinvest in fraud control.",
      },
      "admin-cost": {
        note: "A public administrator reduces provider-side administrative work through a shared set of rules.",
      },
      underfunding: {
        note: "Public agencies may underinvest in customer service and fraud control.",
      },
      "transition-disruption": {
        note: "Moving to a public administrator ends a large number of insurer jobs.",
      },
    },
    mend: ["Worker transition program"],
    solves: ["admin-cost"],
    requires: ["single-payer"],
    worsens: ["fraud-concentration", "underfunding", "transition-disruption"],
    costIds: ["ins-private-net", "ins-carrier-payroll"],
    changes: [
      "Create a public administering agency with a published admin-cost target",
      "Fund customer service and integrity staff",
    ],
  }),
  path({
    id: "overhead-mlr",
    problemId: "insurer-overhead",
    title: "Tighter medical-loss ratios and non-profit requirement",
    summary:
      "Raise the required share of premiums spent on care, and require non-profit status, as in Germany or Switzerland.",
    precedents: [
      {
        place: "Switzerland",
        note: "In 2023, administrative costs for Switzerland's compulsory basic health insurance equaled 4.9% of earned premiums.",
        sourceIds: ["overhead-mlr-swiss-federal-council-sw-2024"],
      },
    ],
    how: {
      "insurer-overhead": {
        note: "Requiring more premium revenue to go to care and requiring nonprofit status reduces profit leakage while retaining multiple plans.",
      },
      "x-plan-choice": {
        note: "Premium-spending requirements and nonprofit status preserve multiple plans.",
      },
      "t-higher-spending": {
        note: "Insurers may increase total spending to enlarge their permitted overhead.",
      },
      "t-enforcement-burden": {
        note: "Vertical integration can hide profits despite premium-spending rules.",
      },
    },
    worsens: ["t-higher-spending", "t-enforcement-burden"],
    solves: ["x-plan-choice"],
    requires: ["regulated-multipayer"],
    costIds: ["ins-earnings"],
    changes: [
      "Raise the medical-loss ratio to 90%+",
      "Require non-profit status for standard plans",
      "Count vertically integrated provider profits toward the MLR",
    ],
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
    how: {
      pbm: {
        note: "Direct public negotiation with manufacturers and a transparent pharmacy dispensing fee end spread pricing, rebate games, and pharmacy clawbacks. A national formulary simplifies prescribing.",
        helps: ["heavy-care-users"],
      },
      "t-administrative-work": {
        note: "Direct public drug administration requires the agency to handle formulary and claims work.",
      },
      "t-reduced-flexibility": {
        note: "A shared formulary leaves fewer brand choices for some patients.",
      },
    },
    mend: ["Transition program"],
    worsens: ["t-administrative-work", "t-reduced-flexibility"],
    costIds: ["pbm-markups"],
    complements: ["drugs-negotiate"],
    changes: [
      "Create a national drug formulary and negotiating agency",
      "Pay pharmacies a published dispensing fee plus acquisition cost",
      "End PBM contracts for covered drugs",
    ],
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
        note: "Law banning PBMs from owning pharmacies in the state; a federal court blocked it before it took effect.",
        sourceIds: ["ftc-pbm-2025"],
      },
    ],
    how: {
      pbm: {
        note: "Flat PBM fees, rebate pass-through, and restrictions on ownership of pharmacies receiving steered patients help independent pharmacies. The approach retains private drug plans at low government cost.",
      },
      "t-enforcement-burden": {
        note: "PBMs may adapt to flat-fee and rebate rules by introducing new fees.",
      },
      "t-delayed-benefits": { note: "Enforcing rules against dominant PBM firms is slow." },
    },
    worsens: ["t-enforcement-burden", "t-delayed-benefits"],
    changes: [
      "Delink PBM pay from drug prices (flat fees)",
      "Ban spread pricing",
      "Require 100% rebate pass-through",
      "Ban PBM ownership of pharmacies they steer patients to",
    ],
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
    how: {
      "high-prices": {
        note: "A public commission sets uniform rates across public and private payers, ending price discrimination. The approach works with any payer structure.",
      },
      "price-opacity": {
        note: "A public commission sets the same rates for public and private payers rather than separate payer-specific prices.",
      },
      consolidation: {
        note: "Uniform rates remove payer-specific price advantages rather than allowing different negotiated prices.",
      },
      "t-political-resistance": { note: "The rate commission becomes a target for lobbying." },
      "x-price-control-exit": { note: "Uniform rates set too low can cause exits." },
    },
    mend: ["Phase rates over several years; protect rural hospitals"],
    worsens: ["t-political-resistance"],
    solves: ["price-opacity", "consolidation"],
    spawns: ["x-price-control-exit"],
    complements: ["global-budgets", "single-payer", "regulated-multipayer"],
    changes: [
      "Create a rate-setting commission",
      "Require every payer to pay commission rates",
      "Ban billing above commission rates",
      "Publish rates and methodology",
    ],
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
    how: {
      "high-prices": {
        note: "Limiting commercial payments relative to Medicare rates offers substantial savings for employers and workers and is simple to enforce. The cap can become a price floor for cheaper hospitals.",
        helps: ["employers"],
      },
      "x-price-control-exit": {
        note: "Capping commercial payments reduces revenue for hospitals dependent on high commercial prices.",
      },
      "t-income-loss": {
        note: "Hospitals reliant on high commercial payments lose revenue under the cap.",
      },
    },
    mend: ["Phase in; transition funds for hospitals with low margins"],
    worsens: ["t-income-loss"],
    spawns: ["x-price-control-exit"],
    changes: [
      "Cap commercial payments at a set multiple of Medicare",
      "Phase the cap in over several years",
    ],
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
      {
        place: "North Carolina",
        note: "In 2024, Novant abandoned its proposed purchase of two North Carolina hospitals after an FTC challenge and an appeals-court injunction.",
        sourceIds: ["prices-competition-federal-trade-commission-2024"],
      },
    ],
    how: {
      "high-prices": {
        note: "Antitrust enforcement, limits on anticompetitive contracts, and site-neutral payment seek lower negotiated prices while retaining market pricing. There is no price commission to lobby.",
        helps: ["heavy-care-users"],
      },
      "t-delayed-benefits": {
        note: "Competition measures work slowly, and many markets are already concentrated beyond repair.",
      },
      "t-limited-reach": {
        note: "Rural areas may support only a single hospital, limiting the reach of competition measures.",
      },
    },
    worsens: ["t-delayed-benefits", "t-limited-reach"],
    complements: ["consolidation-antitrust"],
    changes: [
      "Increase FTC funding and lower merger-review thresholds",
      "Ban anti-tiering and all-or-nothing contract terms",
    ],
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
      {
        place: "United States",
        note: "Between 2002 and 2020, the FTC took enforcement action against 13 of 1,164 hospital mergers, according to a 2024 study.",
        sourceIds: ["consolidation-antitrust-american-economic-review-2024"],
      },
    ],
    how: {
      consolidation: {
        note: "Funding acquisition review and breaking up dominant systems where possible restores negotiating leverage and protects future competition.",
        helps: ["insurers"],
      },
      "t-delayed-benefits": { note: "Hospital breakups are slow and rare." },
      "rural-hospitals": {
        note: "Blocking mergers can prevent arrangements that rescue failing hospitals.",
      },
    },
    mend: ["Exemptions for genuinely failing rural hospitals"],
    worsens: ["t-delayed-benefits", "rural-hospitals"],
    changes: [
      "Fund FTC and DOJ health-care enforcement",
      "Review small physician-practice acquisitions",
      "Allow retrospective challenges to completed mergers",
    ],
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
    how: {
      consolidation: {
        note: "Public rate setting removes the price incentive to merge, including where mergers cannot be undone. Consolidation can still reduce choice and competition on quality.",
        helps: ["insurers"],
      },
      "t-political-resistance": {
        note: "Large systems retain political influence over the rate commission.",
      },
    },
    worsens: ["t-political-resistance"],
    requires: ["all-payer-rates"],
    changes: ["Apply uniform rates regardless of system size"],
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
    how: {
      "private-equity": {
        note: "Ownership disclosure, acquisition review, sale-leaseback limits, and owner liability target asset stripping and make ownership visible to regulators and patients.",
      },
      "capital-underinvestment": {
        note: "Ownership restrictions reduce capital available to practices.",
      },
      "t-enforcement-burden": { note: "Owners may restructure to evade the rules." },
    },
    worsens: ["capital-underinvestment", "t-enforcement-burden"],
    changes: [
      "Require ownership disclosure for all providers",
      "Ban corporate control of medical decisions",
      "Limit sale-leasebacks",
      "Make owners liable for stripped assets",
    ],
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
      {
        place: "United States",
        note: "After the No Surprises Act began, out-of-network emergency bills declined 24% in 2022 compared with 2019, according to a federal evaluation.",
        sourceIds: ["pe-rates-hhs-office-of-the-assist-2026"],
      },
    ],
    how: {
      "private-equity": {
        note: "Uniform rates and an end to out-of-network billing remove the pricing arbitrage used by private-equity roll-ups. This does not require banning ownership or defining harmful ownership in law.",
        helps: ["insurers"],
      },
      "t-limited-reach": {
        note: "Private equity can still enter areas with remaining margins, including hospice and dermatology.",
      },
      "nursing-shortage": { note: "Firms may cut staff to maintain returns under fixed rates." },
    },
    worsens: ["t-limited-reach", "nursing-shortage"],
    requires: ["all-payer-rates"],
    changes: ["Apply uniform rates and end out-of-network billing"],
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
    how: {
      "facility-fees": {
        note: "Equal payment for the same service across hospital outpatient departments and independent offices saves patients and payers money on routine visits. It removes the incentive to acquire practices just to add facility fees and lets independent practices compete on equal terms.",
        helps: ["heavy-care-users"],
      },
      consolidation: {
        note: "Equal payment across settings removes the incentive to buy practices merely to add facility fees.",
      },
      "t-income-loss": {
        note: "Hospitals lose revenue that partly supports emergency and standby capacity.",
      },
      "t-administrative-work": { note: "Defining which services count as the same is complex." },
    },
    mend: ["Separate standby-capacity payments"],
    worsens: ["t-income-loss", "t-administrative-work"],
    solves: ["consolidation"],
    changes: [
      "Pay hospital outpatient departments the same as physician offices for the same services",
      "Fund standby capacity separately",
    ],
  }),
  path({
    id: "facility-ban",
    problemId: "facility-fees",
    title: "Ban facility fees for off-campus clinics",
    summary: "No facility fees for office-type care outside a hospital campus.",
    precedents: [
      { place: "Connecticut, Colorado", note: "State bans on some outpatient facility fees." },
      {
        place: "Connecticut",
        note: "A 2025 study found that Connecticut's 2017 facility-fee ban was associated with a 6.91% relative decline in outpatient charges' share of total hospital charges.",
        sourceIds: ["facility-ban-health-affairs-scholar-2025"],
      },
    ],
    how: {
      "facility-fees": {
        note: "Banning facility fees for office-type care away from hospital campuses ends surprise facility fees for office visits. The rule is simple to understand.",
        helps: ["heavy-care-users"],
      },
      "t-limited-reach": {
        note: "The off-campus fee ban reaches less care than full site-neutral payment.",
      },
      "high-prices": { note: "Hospitals may respond to the fee ban by raising professional fees." },
    },
    worsens: ["t-limited-reach", "high-prices"],
    changes: ["Ban facility fees for off-campus clinics"],
  }),

  // ---- executive pay ----
  path({
    id: "exec-community-benefit",
    problemId: "executive-pay",
    title: "Tie nonprofit tax exemption to community benefit",
    summary:
      "Require a minimum level of charity care and community benefit, and tie executive pay rules to it.",
    precedents: [
      {
        place: "Oregon",
        note: "In fiscal 2024, 27 of Oregon's 34 assigned hospital or health-system community-benefit spending floors were met, a compliance rate of 79.4%.",
        sourceIds: ["exec-community-benefit-oregon-health-authority-2026"],
      },
    ],
    how: {
      "executive-pay": {
        note: "Tying nonprofit tax exemption and executive pay rules to charity care requires more community benefit in return for the public subsidy.",
      },
      "t-oversight-limits": {
        note: "Tying tax exemption to community benefit requires measuring benefits that are hard to assess and easy to inflate.",
      },
      "t-limited-reach": {
        note: "Tying executive pay rules to community benefit does not directly cap executive pay.",
      },
    },
    worsens: ["t-oversight-limits", "t-limited-reach"],
    costIds: ["ceo-pay"],
    changes: [
      "Set minimum community-benefit spending for nonprofit hospitals",
      "Tie executive pay to community benefit",
    ],
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
      {
        place: "Vermont",
        note: "For fiscal 2025, Vermont's Green Mountain Care Board reviewed and established budgets for the state's 14 community hospitals.",
        sourceIds: ["exec-budget-review-green-mountain-care-boar-2024"],
      },
    ],
    how: {
      "executive-pay": {
        note: "Including administrative and executive costs in negotiated hospital budgets directly controls administrative spending and makes executive pay public and comparable.",
      },
      "admin-cost": {
        note: "Negotiating administrative costs within hospital budgets directly controls administrative spending.",
      },
      "t-oversight-limits": {
        note: "Public budget review depends on negotiators who cannot judge every line item.",
      },
    },
    worsens: ["t-oversight-limits"],
    solves: ["admin-cost"],
    requires: ["global-budgets"],
    changes: [
      "Include admin and executive costs in hospital budget review",
      "Publish executive pay",
    ],
  }),
]
