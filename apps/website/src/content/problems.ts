/**
 * Every problem in today's U.S. health system, and every problem a universal
 * system can create. For each: evidence, who is hurt, who benefits from the
 * status quo (the incentive that keeps the problem alive), root causes, and the
 * open questions whose answers become solution paths. Solutions are not chosen
 * here; they are decided problem by problem.
 */
import { ENROLLMENT_2024, PAYER_TOTALS_2024 } from "./baseline"
import { show, v } from "./constants"
import { DISPLACED_TOTAL } from "./workforce"

export const PROBLEM_CATEGORIES = [
  "Coverage & eligibility",
  "Affordability & medical debt",
  "Insurer practices",
  "Prices & market power",
  "Drugs, patents & supply chain",
  "Geography & physical access",
  "Workforce",
  "Quality, safety & outcomes",
  "Administration & complexity",
  "Waste, fraud & low-value care",
  "Mental health & substance use",
  "Long-term & end-of-life care",
  "Dental, vision & hearing",
  "Public health & prevention",
  "Data, technology & privacy",
  "Risks a universal system can create",
  "Problems created by solution paths",
] as const

export type ProblemCategory = (typeof PROBLEM_CATEGORIES)[number]

export type GroupLink = { group: string; how: string; sourceIds?: string[] }
/** One argument in a debate; may point to related problems instead of repeating them. */
export type Reading = { text: string; sourceIds?: string[]; problems?: string[] }

export type Problem = {
  id: string
  category: ProblemCategory
  title: string
  summary: string
  evidence: { text: string; sourceIds: string[] }[]
  /** Groups this problem hurts (see groups.ts): fixing it helps them, worsening it hurts them. */
  hurts?: GroupLink[]
  /** Groups that gain while the problem continues: fixing it costs them. */
  profits?: GroupLink[]
  /** Whether this really is a problem or cost, argued both ways with sources. */
  debate?: { is: Reading[]; isNot: Reading[] }
  /** Legacy free-text lists, replaced by `hurts` and `profits` as problems join the graph. */
  whoIsHurt?: string[]
  /** Who gains from the problem continuing: the incentive any fix must overcome or compensate. */
  whoProfits?: string[]
  rootCauses: string[]
  /** Questions to decide; each answer becomes a solution path with trade-offs. */
  openQuestions: string[]
}

export const PROBLEMS: Problem[] = [
  // ---------------------------------------------------------------- Coverage & eligibility
  {
    id: "uninsured",
    category: "Coverage & eligibility",
    title: "Tens of millions of people have no coverage",
    summary: `About ${ENROLLMENT_2024.uninsured} million people (${((1 - ENROLLMENT_2024.insuredShare) * 100).toFixed(1)}%) were uninsured in 2024. They delay care, use emergency rooms as a safety net, and leave hospitals with uncompensated costs that are shifted onto everyone else.`,
    evidence: [
      {
        text: `${ENROLLMENT_2024.uninsured}M uninsured in 2024; insured share fell from 92.5% (2023) to 91.8%.`,
        sourceIds: ["cms-nhe-highlights"],
      },
      {
        text: "Three-quarters of uninsured adults skipped or postponed needed care because of cost.",
        sourceIds: ["kff-cost-2025"],
      },
    ],
    hurts: [{ group: "uninsured", how: "They delay care, go without, or pay full price." }],
    profits: [
      { group: "employers", how: "Employers that don't offer coverage avoid its cost." },
      { group: "taxpayers", how: "Public budgets avoid subsidy costs in the short run." },
    ],
    rootCauses: [
      "Coverage tied to employment",
      "State-by-state Medicaid eligibility",
      "Premiums unaffordable above subsidy cliffs",
      "Eligibility rules that exclude some immigrants",
    ],
    openQuestions: [
      "Who counts as a resident for coverage (citizens only, lawful residents, everyone living here)?",
      "Is coverage automatic, or must people enroll?",
    ],
  },
  {
    id: "churn",
    category: "Coverage & eligibility",
    title: "People lose coverage when their life changes (churn)",
    summary:
      "Coverage changes with jobs, income, age, marriage, and moves. Each switch can mean new networks, new deductibles, interrupted treatment, and paperwork. Medicaid redeterminations removed about 25 million people in 2023–24, many for paperwork reasons.",
    evidence: [
      {
        text: `Medicaid enrollment fell from 92.2M to ${ENROLLMENT_2024.medicaid}M in 2024 as eligibility checks resumed.`,
        sourceIds: ["cms-nhe-highlights"],
      },
    ],
    hurts: [
      { group: "changing-lives", how: "They lose coverage when income, job, or address changes." },
      {
        group: "heavy-care-users",
        how: "Treatment is interrupted when coverage lapses mid-course.",
      },
    ],
    profits: [
      { group: "insurers", how: "Insurers avoid the long-term costs of members who leave." },
      { group: "taxpayers", how: "Budgets save money when eligible people fall off." },
    ],
    rootCauses: [
      "Means-tested programs need repeated income checks",
      "Employer coverage ends with the job",
      "Separate programs by age and income",
    ],
    openQuestions: [
      "Should eligibility ever be re-checked once someone is covered?",
      "Should coverage continue automatically between jobs?",
    ],
  },
  {
    id: "job-lock",
    category: "Coverage & eligibility",
    title: "Job lock: people stay in jobs to keep insurance",
    summary: `About ${ENROLLMENT_2024.employerSponsored} million people get coverage through work. Leaving a job, starting a business, retiring early, or cutting hours can mean losing insurance.`,
    evidence: [
      {
        text: `${ENROLLMENT_2024.employerSponsored}M people in employer-sponsored insurance (2024).`,
        sourceIds: ["cms-nhe-2024"],
      },
    ],
    hurts: [
      {
        group: "changing-lives",
        how: "Would-be founders, early retirees, and caregivers stay in jobs to keep insurance.",
      },
    ],
    profits: [
      {
        group: "employers",
        how: "Benefits help employers keep workers who would otherwise leave.",
      },
      { group: "insurers", how: "Insurers and brokers sell group coverage through employers." },
    ],
    rootCauses: [
      "The WWII-era tax exclusion for employer premiums",
      "No portable coverage outside employment",
    ],
    openQuestions: ["Should employers have any role in providing health coverage?"],
  },
  {
    id: "underinsurance",
    category: "Coverage & eligibility",
    title: "Underinsurance: covered, but can't afford to use it",
    summary:
      "High deductibles and coinsurance mean many insured people avoid care. Average single deductibles in employer plans are about $1,800, and out-of-pocket maximums reach $9,200 single and $18,400 family (2025).",
    evidence: [
      {
        text: `ACA out-of-pocket maximum ${show("oopMaxSingle")} single / ${show("oopMaxFamily")} family (2025).`,
        sourceIds: [],
      },
      {
        text: "36% of adults skipped or postponed care because of cost in the past year.",
        sourceIds: ["kff-cost-2025"],
      },
    ],
    whoIsHurt: [
      "People with chronic illness",
      "Low- and middle-income families in high-deductible plans",
    ],
    whoProfits: ["Insurers and employers through lower premiums", "HSA administrators"],
    rootCauses: ["Cost sharing used to hold down premiums", "Employers shifting costs to workers"],
    openQuestions: [
      "Should patients pay anything at the point of care? If so, how much and with what cap?",
    ],
  },
  {
    id: "networks",
    category: "Coverage & eligibility",
    title: "Narrow networks and out-of-network surprises",
    summary:
      "Plans cover only listed providers; directories are often wrong ('ghost networks'). Seeing an out-of-network doctor, sometimes without knowing it, can mean large bills.",
    evidence: [
      {
        text: "Among insured adults, problems include difficulty finding in-network providers and prior-authorization delays; 58% had at least one coverage problem in a year.",
        sourceIds: ["kff-consumer-2023"],
      },
    ],
    hurts: [
      {
        group: "heavy-care-users",
        how: "Needed specialists and therapists are often out of network.",
      },
    ],
    profits: [
      { group: "insurers", how: "Narrow networks let insurers offer lower premiums." },
      { group: "high-price-providers", how: "Out-of-network providers can bill high charges." },
    ],
    rootCauses: [
      "Many separate payers each negotiating networks",
      "Providers that profit from staying out of network",
    ],
    openQuestions: [
      "Should networks exist at all, or should any licensed provider be able to see any patient?",
    ],
  },
  {
    id: "immigrant-coverage",
    category: "Coverage & eligibility",
    title: "Immigrants and mixed-status families fall through gaps",
    summary:
      "Undocumented immigrants are excluded from most coverage; lawful immigrants face waiting periods. Care comes through ERs, community health centers, and Emergency Medicaid, often late and expensive.",
    evidence: [],
    whoIsHurt: [
      "Undocumented and recently arrived immigrants",
      "Citizen children in mixed-status families",
    ],
    whoProfits: ["Short-term public budgets"],
    rootCauses: [
      "Federal eligibility rules",
      "Fear of immigration consequences discouraging enrollment",
    ],
    openQuestions: [
      "Should coverage depend on immigration status?",
      "Should health data ever be shared with immigration enforcement?",
    ],
  },

  {
    id: "territories",
    category: "Coverage & eligibility",
    title: "U.S. territories get capped, lower federal health funding",
    summary:
      "About 3.5 million U.S. citizens and nationals live in Puerto Rico, Guam, the U.S. Virgin Islands, American Samoa, and the Northern Mariana Islands. Federal Medicaid money there is capped each year instead of open-ended, Medicare works differently, and funding depends on temporary laws that keep expiring.",
    evidence: [
      {
        text: "Federal Medicaid funding is open-ended for the states and DC but capped in all five territories.",
        sourceIds: ["crs-territories-medicaid"],
      },
      {
        text: "Puerto Rico's 76% federal match runs through FY2027; its capped allotment is about $3.6 billion for FY2026.",
        sourceIds: ["kff-territories-medicaid"],
      },
      {
        text: "Puerto Rico's Medicaid spent $3,293 per enrollee in FY2024, against a $10,302 average.",
        sourceIds: ["macpac-macstats-2026"],
      },
      {
        text: "Medicare Part B is not automatic for Social Security recipients in Puerto Rico, and Medicare Savings Programs are unavailable there.",
        sourceIds: ["gao-21-607r"],
      },
      {
        text: "Puerto Rico's physician workforce fell from about 14,500 in 2009 to about 9,000 by 2020.",
        sourceIds: ["pr-physicians-2025"],
      },
    ],
    whoIsHurt: [
      "Low-income residents of the territories",
      "Territory hospitals and clinicians paid less than mainland peers",
      "Territory governments facing recurring funding cliffs",
    ],
    whoProfits: ["Short-term federal budgets"],
    rootCauses: [
      "Medicaid law caps territory funding and sets a fixed matching rate",
      "Temporary funding laws instead of a permanent formula",
      "Territories have no voting representation in Congress",
    ],
    openQuestions: [
      "Should territory residents be covered on the same terms as residents of the states?",
      "Should territories keep running their own programs?",
    ],
  },

  // ---------------------------------------------------------------- Affordability & debt
  {
    id: "medical-debt",
    category: "Affordability & medical debt",
    title: "Medical debt affects about 100 million people",
    summary:
      "About 4 in 10 adults have health care debt. Debt leads people to skip further care, damages credit, and is a leading contributor to personal financial distress.",
    evidence: [
      {
        text: "About 100 million adults have medical or dental debt; 79% of them skipped or delayed care because of cost.",
        sourceIds: ["kff-debt-2022"],
      },
    ],
    whoIsHurt: [
      "Low- and middle-income families",
      "People with serious illness",
      "Uninsured and underinsured people",
    ],
    whoProfits: ["Debt collectors and debt buyers", "Hospitals that sell or sue over debt"],
    rootCauses: ["Cost sharing", "Uninsurance", "Surprise and opaque bills"],
    openQuestions: [
      "Should existing medical debt be bought and forgiven?",
      "Should patients ever be billed for covered care?",
    ],
  },
  {
    id: "premium-burden",
    category: "Affordability & medical debt",
    title: "Premiums are a large, flat, hidden tax on wages",
    summary: `A family premium averages ${show("familyPremium")} (2025), the same whether the worker earns $50,000 or $500,000. Employers pay most of it out of compensation that would otherwise be wages.`,
    evidence: [
      {
        text: `Family premium ${show("familyPremium")}; worker share ${show("workerFamilyContribution")}.`,
        sourceIds: ["kff-ehbs-2025"],
      },
    ],
    hurts: [
      {
        group: "low-middle-income",
        how: "A flat premium takes a large share of a modest paycheck.",
      },
      { group: "employers", how: "Small employers pay the same premiums on lower payrolls." },
    ],
    profits: [
      { group: "high-earners", how: "A flat premium is a small share of high pay." },
      { group: "insurers", how: "Premiums are insurers' revenue." },
    ],
    rootCauses: ["Per-person pricing of coverage", "Tax exclusion that favors richer plans"],
    openQuestions: [
      "Should health care be financed by income-based taxes, payroll taxes, per-person premiums, or a mix?",
    ],
  },
  {
    id: "price-opacity",
    category: "Affordability & medical debt",
    title: "Patients can't know prices in advance",
    summary:
      "The same service can cost wildly different amounts at different places, and the price depends on the insurer's secret contract. Price-transparency rules exist but are hard to use and inconsistently followed.",
    evidence: [
      {
        text: "Private insurers paid on average 254% of Medicare for hospital services, with enormous variation between hospitals.",
        sourceIds: ["rand-hospital-2024"],
      },
    ],
    whoIsHurt: ["Patients with deductibles", "Employers trying to manage costs"],
    whoProfits: ["High-priced providers", "Intermediaries that profit from complexity"],
    rootCauses: ["Prices negotiated privately between thousands of payers and providers"],
    openQuestions: ["Should there be one public price for each service?"],
  },
  {
    id: "surprise-bills",
    category: "Affordability & medical debt",
    title: "Surprise billing and a runaway arbitration system",
    summary:
      "The No Surprises Act protects patients from many surprise bills, but the arbitration process for provider-insurer disputes exploded to 1.42 million disputes in 2024 (versus 17,000 expected), mostly filed by private-equity-backed groups, and providers win about 85%. Ground ambulances are not covered.",
    evidence: [
      {
        text: "1.42M IDR disputes in 2024, over 99% initiated by providers; at least $5B in total process costs through 2024.",
        sourceIds: ["crs-idr-2024"],
      },
    ],
    hurts: [
      {
        group: "heavy-care-users",
        how: "Ambulance rides and out-of-network specialists send bills patients didn't choose.",
      },
      { group: "employer-covered", how: "Premiums fund the higher arbitration awards." },
    ],
    profits: [
      {
        group: "high-price-providers",
        how: "Private-equity-backed emergency, anesthesia, and radiology groups win high awards.",
      },
    ],
    rootCauses: ["Out-of-network billing", "Separate payers disputing prices"],
    openQuestions: ["Should payment disputes be eliminated by having one payment schedule?"],
  },

  // ---------------------------------------------------------------- Insurer practices
  {
    id: "denials",
    category: "Insurer practices",
    title: "Claim denials",
    summary:
      "Nearly one in five insured adults had a claim denied in a year. Few appeal, though many appeals succeed. Denials shift costs to patients and providers.",
    evidence: [
      {
        text: "18% of insured adults reported a denied claim (21% employer coverage, 20% Marketplace, 12% Medicaid, 10% Medicare).",
        sourceIds: ["kff-consumer-2023"],
      },
    ],
    hurts: [
      { group: "heavy-care-users", how: "Care is delayed or denied, and appeals take time." },
      { group: "clinicians", how: "Providers absorb unpaid claims and appeal work." },
    ],
    profits: [{ group: "insurers", how: "Denials lower insurers' medical spending." }],
    rootCauses: [
      "Insurers' financial incentive to pay less",
      "Complex, plan-specific coverage rules",
    ],
    openQuestions: [
      "Who should decide what is covered: each insurer, or one public evidence-based process?",
    ],
  },
  {
    id: "prior-auth",
    category: "Insurer practices",
    title: "Prior authorization delays and blocks care",
    summary:
      "Insurers require approval before many treatments. Physicians say it delays care and causes harm; practices spend about 12 hours a week on it.",
    evidence: [
      {
        text: "94% of physicians say prior authorization delays necessary care; 24% report a serious adverse event; 78% say patients abandon treatment.",
        sourceIds: ["ama-prior-auth-2024"],
      },
    ],
    whoIsHurt: ["Patients with chronic and serious illness", "Physicians and staff"],
    whoProfits: ["Insurers", "Utilization-management vendors"],
    rootCauses: ["Insurers' cost-control incentive", "Lack of trusted, shared evidence rules"],
    openQuestions: [
      "Should prior authorization exist? If so, for which services and decided by whom?",
    ],
  },
  {
    id: "ma-upcoding",
    category: "Insurer practices",
    title: "Medicare Advantage overpayments and coding intensity",
    summary:
      "Private Medicare plans are paid more when enrollees look sicker on paper, which rewards aggressive diagnosis coding. MedPAC estimates MA costs about 20% more than traditional Medicare for similar people.",
    evidence: [
      {
        text: "MA payments about 20% above fee-for-service-equivalent spending (about $84B in 2025).",
        sourceIds: ["medpac-2025"],
      },
    ],
    whoIsHurt: ["Taxpayers", "Medicare beneficiaries through higher Part B premiums"],
    whoProfits: ["Medicare Advantage insurers", "Risk-adjustment and coding vendors"],
    rootCauses: ["Risk-adjusted capitation without enough audit", "Favorable selection"],
    openQuestions: [
      "Should private plans manage public money at all? If so, under what payment and audit rules?",
    ],
  },
  {
    id: "insurer-overhead",
    category: "Insurer practices",
    title: "Insurer overhead and profit",
    summary: `The net cost of private health insurance (premiums minus benefits) was $176.5B in 2024, about 10.7% of private premiums of $${PAYER_TOTALS_2024.privateInsurance.toLocaleString()}B. It covers claims processing, networks, utilization management, marketing, broker commissions, taxes, and profit.`,
    evidence: [
      {
        text: "Health insurer net earnings were about $25B in 2023 and $9B in 2024 (margins of 2.2% and 0.8%).",
        sourceIds: ["naic-health-results"],
      },
    ],
    hurts: [{ group: "employer-covered", how: "Premiums pay for insurer overhead and profit." }],
    profits: [{ group: "insurers", how: "Overhead and profit are insurers' income." }],
    rootCauses: [
      "Many payers duplicating the same functions",
      "Competition on marketing and network design rather than cost",
    ],
    openQuestions: [
      "How many payers should there be: one, a few regulated nonprofits, or a competitive market?",
    ],
  },
  {
    id: "pbm",
    category: "Insurer practices",
    title: "Pharmacy benefit managers profit from opaque drug pricing",
    summary:
      "Three PBMs handle about 80% of prescriptions. Rebates tied to list prices reward higher list prices, spread pricing hides margins, and PBM-owned pharmacies dominate specialty drugs.",
    evidence: [
      {
        text: "The three largest PBMs and affiliates earned over $7.3B dispensing drugs above acquisition cost in 2017–2022 and held 68% of specialty dispensing revenue in 2023.",
        sourceIds: ["ftc-pbm-2025"],
      },
    ],
    whoIsHurt: [
      "Patients whose coinsurance is based on list price",
      "Independent pharmacies",
      "Employers",
    ],
    whoProfits: [
      "PBMs and their insurer parents",
      "Manufacturers that buy formulary placement with rebates",
    ],
    rootCauses: [
      "Rebates based on list price",
      "Vertical integration of insurers, PBMs, and pharmacies",
    ],
    openQuestions: ["Who should negotiate drug prices: PBMs, insurers, or a single public buyer?"],
  },

  // ---------------------------------------------------------------- Prices & market power
  {
    id: "high-prices",
    category: "Prices & market power",
    title: "U.S. prices are far higher than in other countries",
    summary:
      "The U.S. uses about as much care as peer countries but pays much more per unit: hospital stays, physician fees, drugs, devices, and administration all cost more.",
    evidence: [
      {
        text: "Private hospital prices average 254% of Medicare.",
        sourceIds: ["rand-hospital-2024"],
      },
      {
        text: "U.S. drug prices average 278% of 33 OECD countries; brand-name drugs 422%.",
        sourceIds: ["rand-drugs-2024"],
      },
      {
        text: "Pricing failure wastes an estimated $231–241B a year.",
        sourceIds: ["shrank-waste-2019"],
      },
    ],
    hurts: [
      {
        group: "employer-covered",
        how: "Private plans pay the highest prices, passed on through premiums.",
      },
      { group: "taxpayers", how: "Public programs pay more than peer countries too." },
    ],
    profits: [
      { group: "high-price-providers", how: "Providers with pricing power earn more per service." },
      { group: "drug-device-makers", how: "U.S. prices are well above those in peer countries." },
    ],
    rootCauses: [
      "Fragmented buyers with little leverage",
      "Provider consolidation",
      "Patents and exclusivity",
    ],
    openQuestions: [
      "Should prices be set publicly, negotiated by one buyer, or left to markets with transparency?",
    ],
  },
  {
    id: "consolidation",
    category: "Prices & market power",
    title: "Hospital and physician consolidation raises prices",
    summary:
      "Hospital systems have merged into regional near-monopolies and bought physician practices, raising commercial prices without clear quality gains.",
    evidence: [
      {
        text: "Prices vary widely within the same market, reflecting market power rather than cost.",
        sourceIds: ["rand-hospital-2024"],
      },
    ],
    whoIsHurt: ["Commercially insured patients and employers"],
    whoProfits: ["Dominant health systems and their executives"],
    rootCauses: [
      "Leverage over fragmented insurers",
      "Facility fees that reward hospital ownership of practices",
    ],
    openQuestions: [
      "If prices were the same everywhere, would consolidation still matter, and for what (quality, access)?",
    ],
  },
  {
    id: "private-equity",
    category: "Prices & market power",
    title: "Private equity roll-ups in medicine",
    summary:
      "Private-equity firms buy physician practices (anesthesia, dermatology, emergency medicine, gastroenterology), nursing homes, and hospices, often raising prices and cutting staff.",
    evidence: [
      {
        text: "Single PE firms hold more than 30% of the market in 108 metropolitan specialty markets; deals rose from 75 (2012) to 484 (2021).",
        sourceIds: ["ama-pe-2022"],
      },
    ],
    whoIsHurt: ["Patients", "Clinicians who lose autonomy", "Nursing-home residents"],
    whoProfits: ["PE investors"],
    rootCauses: ["Fee-for-service arbitrage, out-of-network billing, and roll-up valuations"],
    openQuestions: ["Should investor-owned providers be allowed? With what limits?"],
  },
  {
    id: "facility-fees",
    category: "Prices & market power",
    title: "Facility fees: the same service costs more in a hospital-owned building",
    summary:
      "When a hospital owns a clinic, it can charge a facility fee on top of the physician fee for the same visit, which encourages hospitals to buy practices.",
    evidence: [],
    whoIsHurt: ["Patients and payers"],
    whoProfits: ["Hospital systems"],
    rootCauses: ["Payment rules that pay more by site rather than by service"],
    openQuestions: ["Should payment be the same regardless of site?"],
  },
  {
    id: "executive-pay",
    category: "Prices & market power",
    title: "Executive pay and nonprofit status",
    summary:
      "Nonprofit hospital systems are tax-exempt but pay CEOs about $1.3 million on average, and community-benefit spending varies widely.",
    evidence: [
      {
        text: "Nonprofit health system CEOs averaged about $1.3M a year; pay grew 30% from 2012 to 2019.",
        sourceIds: ["rice-ceo-pay"],
      },
    ],
    whoIsHurt: ["Taxpayers (forgone taxes)", "Patients"],
    whoProfits: ["Executives"],
    rootCauses: ["Weak community-benefit standards", "Board pay benchmarks against peers"],
    openQuestions: ["Should executive pay be limited for providers paid with public money?"],
  },

  // ---------------------------------------------------------------- Drugs
  {
    id: "drug-prices",
    category: "Drugs, patents & supply chain",
    title: "Brand-name drug prices far above production cost",
    summary:
      "Drug prices reflect market exclusivity, not production cost. Insulin costs roughly $2–6 a vial to make, yet U.S. list prices ran to hundreds of dollars before recent caps.",
    evidence: [
      {
        text: "Estimated insulin production cost about $2–6 per vial; a profitable price would be $48–133 per person per year.",
        sourceIds: ["gotham-insulin-2018"],
      },
      {
        text: "U.S. brand-name prices average 422% of other OECD countries.",
        sourceIds: ["rand-drugs-2024"],
      },
    ],
    whoIsHurt: ["Patients with coinsurance or no coverage", "Payers"],
    whoProfits: ["Manufacturers and shareholders", "PBMs earning rebates on high list prices"],
    rootCauses: ["Patent monopolies", "Fragmented buyers", "Rebate system"],
    openQuestions: [
      "Should drug prices be set by value, by cost-plus, by international reference, or by negotiation?",
    ],
  },
  {
    id: "patents",
    category: "Drugs, patents & supply chain",
    title: "Patent thickets and evergreening delay generics",
    summary:
      "Manufacturers file many secondary patents to extend monopolies. Humira had 247 U.S. patent applications, 89% after approval; biosimilars reached Europe in 2018 but the U.S. only in 2023.",
    evidence: [
      {
        text: "Humira: 247 U.S. patent applications, 89% filed after FDA approval.",
        sourceIds: ["imak-humira"],
      },
    ],
    whoIsHurt: ["Patients and payers paying monopoly prices longer"],
    whoProfits: ["Brand manufacturers"],
    rootCauses: ["Patent office standards", "Cost of challenging many patents"],
    openQuestions: [
      "Should drug patents exist as they do now, be shortened, be limited to one per product, or be replaced by prizes or public funding?",
    ],
  },
  {
    id: "rd-incentives",
    category: "Drugs, patents & supply chain",
    title: "R&D is funded by high prices, which ties innovation to unaffordability",
    summary:
      "The industry spent $83B on R&D in 2019, about a quarter of net revenue, and developing a new drug costs roughly $1–2B+ including failures. Lowering prices lowers expected returns and the number of new drugs.",
    evidence: [
      {
        text: "$83B industry R&D (2019); expected cost per new drug from under $1B to over $2B.",
        sourceIds: ["cbo-pharma-rd-2021"],
      },
      {
        text: "A narrower negotiation policy was estimated to mean about 8 fewer of ~300 new drugs in a decade.",
        sourceIds: ["cbo-hr3-drugs"],
      },
    ],
    whoIsHurt: [
      "Today's patients (high prices)",
      "Future patients (if prices are cut without replacing R&D funding)",
    ],
    whoProfits: ["Manufacturers and investors"],
    rootCauses: ["Private financing of risky R&D recovered through monopoly pricing"],
    openQuestions: [
      "How should drug R&D be paid for: high prices, public funding, prizes, advance purchase commitments, or a mix?",
    ],
  },
  {
    id: "shortages",
    category: "Drugs, patents & supply chain",
    title: "Drug shortages of cheap, essential generics",
    summary:
      "Shortages hit a record 323 in early 2024, about half sterile injectables such as chemotherapy and crash-cart drugs. Generic prices are so low that few factories make them, so one plant problem causes national shortages.",
    evidence: [
      {
        text: "323 active shortages in Q1 2024, the most since 2001.",
        sourceIds: ["ashp-shortages-2024"],
      },
    ],
    whoIsHurt: ["Cancer patients", "Hospitals and emergency patients"],
    whoProfits: [
      "No one sustainably; group purchasing organizations push prices to unsustainable lows",
    ],
    rootCauses: [
      "Race-to-the-bottom generic pricing",
      "Concentrated offshore manufacturing",
      "No reward for reliable supply",
    ],
    openQuestions: [
      "Should a single buyer pay more for reliable supply, fund domestic manufacturing, or make some generics publicly?",
    ],
  },
  {
    id: "pharmacy-deserts",
    category: "Drugs, patents & supply chain",
    title: "Pharmacy closures and pharmacy deserts",
    summary:
      "Independent and chain pharmacies are closing, squeezed by PBM reimbursement; rural and low-income urban areas lose access.",
    evidence: [
      {
        text: "About 1.08M people work in health & personal care retailers (pharmacies).",
        sourceIds: ["bls-oews-2025"],
      },
    ],
    whoIsHurt: ["Rural residents", "Older adults without transportation"],
    whoProfits: ["PBM-owned mail and specialty pharmacies"],
    rootCauses: ["PBM reimbursement below cost", "Shift to mail order"],
    openQuestions: ["How should pharmacies be paid (dispensing fee, cost-plus)?"],
  },

  // ---------------------------------------------------------------- Geography
  {
    id: "rural-hospitals",
    category: "Geography & physical access",
    title: "Rural hospital closures",
    summary:
      "181 rural hospitals closed between 2005 and 2022, and hundreds more are at risk. Low volume, a high share of uninsured and Medicaid patients, and staffing shortages make them unprofitable under per-service payment.",
    evidence: [
      { text: "181 rural hospital closures (2005–2022).", sourceIds: ["ahr-rural-closures"] },
    ],
    whoIsHurt: [
      "About 60 million rural residents",
      "Emergency and trauma patients facing longer transport",
    ],
    whoProfits: ["No one directly; urban systems sometimes gain patients"],
    rootCauses: [
      "Fee-for-service payment that requires volume",
      "Payer mix",
      "Workforce shortages",
    ],
    openQuestions: [
      "Should rural hospitals get fixed budgets regardless of volume?",
      "Should some convert to emergency-plus-outpatient models?",
    ],
  },
  {
    id: "maternity-deserts",
    category: "Geography & physical access",
    title: "Maternity care deserts",
    summary:
      "Over a third of U.S. counties have no maternity care. Obstetric units close because births are low-volume and Medicaid (which pays for about 41% of births) pays little.",
    evidence: [
      {
        text: "Over 35% of counties are maternity care deserts; 5.5M+ women in counties with no or limited care; more than 100 hospitals closed obstetric units in 2021–22.",
        sourceIds: ["march-of-dimes-2024"],
      },
    ],
    whoIsHurt: ["Pregnant people in rural areas", "Newborns"],
    whoProfits: ["No one"],
    rootCauses: ["Low payment for births", "Staffing and liability costs", "Low volume"],
    openQuestions: ["Should obstetric units be funded as essential infrastructure?"],
  },
  {
    id: "shortage-areas",
    category: "Geography & physical access",
    title: "Health professional shortage areas",
    summary:
      "About 75 million people live in primary-care shortage areas, and about 137 million in mental-health shortage areas.",
    evidence: [
      {
        text: "7,501 primary-care HPSAs covering 75.0M people (47% of need met), June 2024.",
        sourceIds: ["hrsa-hpsa-2024"],
      },
      {
        text: "About 137M people live in a mental health HPSA (December 2025).",
        sourceIds: ["hrsa-bh-2025"],
      },
    ],
    whoIsHurt: ["Rural and low-income urban residents"],
    whoProfits: ["No one directly"],
    rootCauses: [
      "Clinicians cluster where pay and amenities are highest",
      "Training located in cities",
    ],
    openQuestions: [
      "Should training be tied to service in shortage areas?",
      "Should pay be higher in shortage areas?",
    ],
  },
  {
    id: "transport",
    category: "Geography & physical access",
    title: "Getting to care: transportation and ambulances",
    summary:
      "Missed appointments from lack of transportation are common; ground-ambulance bills are not covered by surprise-billing protections; rural EMS services are closing.",
    evidence: [
      {
        text: "About 281,000 EMTs & paramedics, mean wage about $52,750.",
        sourceIds: ["bls-oews-2025"],
      },
    ],
    whoIsHurt: ["Older and disabled people", "Rural residents"],
    whoProfits: ["Private ambulance operators billing out of network"],
    rootCauses: [
      "EMS funded by local budgets and fee-for-service",
      "No coverage for non-emergency transport in most plans",
    ],
    openQuestions: [
      "Should transport to care be a covered benefit?",
      "Should EMS be funded as public infrastructure?",
    ],
  },

  // ---------------------------------------------------------------- Workforce
  {
    id: "physician-shortage",
    category: "Workforce",
    title: "Physician shortage, especially in primary care",
    summary:
      "AAMC projects a shortage of up to 86,000 physicians by 2036. Residency slots funded by Medicare have been largely capped since 1997, and primary care pays far less than procedures.",
    evidence: [
      {
        text: "Projected shortage of up to 86,000 physicians by 2036.",
        sourceIds: ["aamc-shortage"],
      },
      {
        text: "Family medicine physicians average about $255,820 vs. anesthesiologists about $360,570 (BLS mean wages).",
        sourceIds: ["bls-oews-2025"],
      },
    ],
    whoIsHurt: ["Patients waiting for appointments", "Physicians facing burnout"],
    whoProfits: ["Incumbent specialists (scarcity supports pay)"],
    rootCauses: [
      "Residency cap",
      "Fee schedule that undervalues primary care",
      "High cost of training",
    ],
    openQuestions: [
      "How many residency slots should be funded, and in which specialties?",
      "Should primary care be paid more relative to procedures?",
    ],
  },
  {
    id: "training-debt",
    category: "Workforce",
    title: "Medical education debt shapes specialty choice",
    summary:
      "Median medical school debt is about $200,000, and residents earn about $70,000 for 3–7 years. High debt pushes graduates toward high-paying specialties and away from primary care and rural practice.",
    evidence: [
      { text: "67% of 2024 graduates had debt, median $200,000.", sourceIds: ["aamc-debt-2024"] },
      {
        text: "Average resident salary about $70,000 (2024).",
        sourceIds: ["medscape-resident-2024"],
      },
    ],
    whoIsHurt: ["Medical students", "Patients who need primary care"],
    whoProfits: ["Lenders; high-paying specialties benefit from limited competition"],
    rootCauses: ["High tuition", "Long training at low pay"],
    openQuestions: [
      "Should medical, dental, and nursing education be tuition-free, possibly in exchange for service?",
    ],
  },
  {
    id: "nursing-shortage",
    category: "Workforce",
    title: "Nursing and direct-care shortages and burnout",
    summary:
      "There are 3.38M registered nurses and about 4.3M home health & personal care aides, but turnover is high, aides earn about $36,000, and nursing schools turn away qualified applicants for lack of faculty.",
    evidence: [
      {
        text: "3.38M RNs (mean $101,420); 4.31M home health & personal care aides (mean $36,120); 1.45M nursing assistants (mean $42,700).",
        sourceIds: ["bls-oews-2025"],
      },
    ],
    whoIsHurt: ["Patients in understaffed hospitals and nursing homes", "Workers"],
    whoProfits: ["Staffing agencies charging premium rates", "Operators who keep staffing thin"],
    rootCauses: ["Low pay for direct care", "Faculty shortages", "Burnout"],
    openQuestions: [
      "Should there be minimum staffing ratios?",
      "Should direct-care pay be set publicly?",
    ],
  },
  {
    id: "burnout-admin",
    category: "Workforce",
    title: "Clinician burnout from paperwork and EHR work",
    summary:
      "Clinicians spend hours a day on documentation, billing codes, and prior authorizations, which drives burnout and early retirement.",
    evidence: [
      {
        text: "Practices spend about 12 hours a week on prior authorization alone.",
        sourceIds: ["ama-prior-auth-2024"],
      },
    ],
    whoIsHurt: ["Physicians and nurses", "Patients who get less face time"],
    whoProfits: ["EHR vendors and billing intermediaries"],
    rootCauses: ["Documentation for billing rather than care", "Multiple payers' rules"],
    openQuestions: ["How much documentation should payment require?"],
  },
  {
    id: "scope-of-practice",
    category: "Workforce",
    title: "Scope-of-practice limits waste capacity",
    summary:
      "Nurse practitioners (323,000), physician assistants (162,000), pharmacists, and dental therapists are trained to do more than many states allow.",
    evidence: [
      {
        text: "323,040 nurse practitioners and 162,150 physician assistants (BLS).",
        sourceIds: ["bls-oews-2025"],
      },
    ],
    whoIsHurt: ["Patients in shortage areas"],
    whoProfits: ["Physicians whose market is protected"],
    rootCauses: ["State licensing rules shaped by professional lobbying"],
    openQuestions: ["Which professionals should be allowed to do what, independently?"],
  },

  // ---------------------------------------------------------------- Quality & outcomes
  {
    id: "outcomes",
    category: "Quality, safety & outcomes",
    title: "Worse outcomes than peer countries despite the highest spending",
    summary:
      "The U.S. has the lowest life expectancy among high-income peers and ranked last overall in the Commonwealth Fund's 2024 comparison, while spending about twice as much per person.",
    evidence: [
      { text: "U.S. last among 10 high-income countries.", sourceIds: ["commonwealth-2024"] },
    ],
    whoIsHurt: ["Everyone, especially low-income and minority communities"],
    whoProfits: ["N/A"],
    rootCauses: [
      "Access barriers",
      "Chronic disease",
      "Social factors (obesity, overdoses, guns, cars)",
    ],
    openQuestions: ["Which outcomes should the system be held accountable for, and how?"],
  },
  {
    id: "maternal-mortality",
    category: "Quality, safety & outcomes",
    title: "High maternal mortality and postpartum coverage gaps",
    summary:
      "U.S. maternal mortality is the highest among wealthy countries, with large racial gaps; Medicaid postpartum coverage historically ended at 60 days.",
    evidence: [],
    whoIsHurt: ["Pregnant and postpartum people, especially Black women"],
    whoProfits: ["N/A"],
    rootCauses: ["Coverage gaps", "Maternity deserts", "Uneven quality"],
    openQuestions: ["Should coverage be continuous through pregnancy and the year after?"],
  },
  {
    id: "safety",
    category: "Quality, safety & outcomes",
    title: "Medical errors and poor care coordination",
    summary:
      "Failures of care delivery and coordination waste an estimated $129–244B a year and cause preventable harm.",
    evidence: [
      {
        text: "Failure of care delivery $102–166B; failure of care coordination $27–78B a year.",
        sourceIds: ["shrank-waste-2019"],
      },
    ],
    whoIsHurt: ["Patients"],
    whoProfits: ["Fee-for-service providers paid for treating complications"],
    rootCauses: ["Fragmented records", "Payment for volume rather than outcomes"],
    openQuestions: [
      "How should providers be paid: per service, per patient, per episode, or by budget?",
    ],
  },
  {
    id: "disparities",
    category: "Quality, safety & outcomes",
    title: "Racial, income, and geographic disparities",
    summary:
      "Access and outcomes differ sharply by race, income, and place, partly because Medicaid pays less and providers prefer better-paying patients.",
    evidence: [
      {
        text: `Only about ${show("acceptMedicaid")} of physicians accept new Medicaid patients vs. ${show("acceptPrivate")} for private insurance.`,
        sourceIds: ["holgash-heberlein"],
      },
    ],
    whoIsHurt: ["Black, Hispanic, Native, rural, and low-income people"],
    whoProfits: ["Providers who select better-paying patients"],
    rootCauses: [
      "Payment differences by insurance type",
      "Geographic maldistribution",
      "Structural racism",
    ],
    openQuestions: ["Should every patient's care pay the provider the same?"],
  },
  {
    id: "malpractice",
    category: "Quality, safety & outcomes",
    title: "Malpractice system: slow, costly, and drives defensive medicine",
    summary:
      "Liability costs about $55.6B a year (2008 dollars), mostly defensive medicine, yet most injured patients are never compensated.",
    evidence: [
      {
        text: "$55.6B a year (2.4% of spending), of which $45.6B is defensive medicine.",
        sourceIds: ["mello-liability"],
      },
    ],
    whoIsHurt: ["Injured patients", "Physicians (premiums, stress)"],
    whoProfits: ["Malpractice insurers and attorneys"],
    rootCauses: ["Fault-based tort system"],
    openQuestions: ["Should injury compensation be no-fault and administrative?"],
  },

  // ---------------------------------------------------------------- Administration
  {
    id: "admin-cost",
    category: "Administration & complexity",
    title: "About $1 trillion a year in administrative cost",
    summary:
      "Roughly a quarter of spending is administration: billing, claims, coding, credentialing, prior authorization, and plan management across thousands of payers and plans.",
    evidence: [
      {
        text: "About $950B a year in administration; about $265B could be removed with existing interventions.",
        sourceIds: ["sahni-admin"],
      },
      {
        text: "Administrative complexity wastes about $266B a year.",
        sourceIds: ["shrank-waste-2019"],
      },
      {
        text: "Hospitals spent about $43B trying to collect payment from insurers.",
        sourceIds: ["aha-cost-caring"],
      },
    ],
    hurts: [
      { group: "clinicians", how: "Time goes to billing and insurer rules instead of patients." },
      { group: "employer-covered", how: "Premiums pay for the administration." },
      { group: "taxpayers", how: "Public programs pay for it too." },
    ],
    profits: [
      {
        group: "insurers",
        how: "Insurers, billing firms, and clearinghouses earn from the complexity.",
      },
      { group: "insurance-billing-workers", how: "Their jobs exist because of the complexity." },
    ],
    rootCauses: ["Many payers with different rules", "Fee-for-service billing", "Means testing"],
    openQuestions: ["How many payers and payment rules should there be?"],
  },
  {
    id: "billing-jobs",
    category: "Administration & complexity",
    title: "Hundreds of thousands of jobs exist only to manage billing complexity",
    summary:
      "Billing clerks, coders, insurance verification staff, claims adjusters, and brokers make up a large workforce. Simplification removes their jobs.",
    evidence: [
      {
        text: "About 165,000 billing clerks in health care, 194,720 medical records specialists, 324,230 claims adjusters and examiners, and 214,260 insurance claims clerks (all industries).",
        sourceIds: ["bls-oews-2025"],
      },
    ],
    hurts: [
      {
        group: "insurance-billing-workers",
        how: "Workers lose jobs if billing is simplified without a transition plan.",
      },
    ],
    rootCauses: ["System complexity"],
    openQuestions: [
      "What do displaced administrative workers receive: wage replacement, retraining, guaranteed jobs?",
    ],
  },

  // ---------------------------------------------------------------- Waste & fraud
  {
    id: "low-value-care",
    category: "Waste, fraud & low-value care",
    title: "Low-value care and overtreatment",
    summary:
      "Tests and treatments with little benefit (imaging for routine back pain, some screenings, end-of-life interventions patients don't want) cost an estimated $76–101B a year.",
    evidence: [
      {
        text: "Overtreatment or low-value care $76–101B a year.",
        sourceIds: ["shrank-waste-2019"],
      },
    ],
    whoIsHurt: ["Patients exposed to harms", "Payers"],
    whoProfits: ["Providers paid per service", "Device and test manufacturers"],
    rootCauses: ["Fee-for-service", "Defensive medicine", "Patient demand without evidence"],
    openQuestions: [
      "Who decides what is low-value, and should it be excluded from coverage or just discouraged?",
    ],
  },
  {
    id: "fraud",
    category: "Waste, fraud & low-value care",
    title: "Fraud and improper payments",
    summary:
      "Fraud is estimated at 3–10% of spending. Medicare's fee-for-service improper payment rate was about 7.7% in FY2024, mostly documentation errors.",
    evidence: [
      {
        text: "Fraud conservatively 3% of spending; up to 10% by some estimates.",
        sourceIds: ["nhcaa-fraud"],
      },
      {
        text: "Medicare FFS improper payment rate about 7.7% (FY2024).",
        sourceIds: ["cms-improper"],
      },
    ],
    whoIsHurt: ["Taxpayers and premium payers"],
    whoProfits: ["Fraudulent providers (DME, hospice, labs, home health have been hotspots)"],
    rootCauses: ["Pay-first, check-later claims", "Fragmented data across payers"],
    openQuestions: [
      "How much should be spent on program integrity, and how much friction is acceptable for honest providers?",
    ],
  },

  // ---------------------------------------------------------------- Mental health
  {
    id: "mental-health-access",
    category: "Mental health & substance use",
    title: "Mental health care is hard to get",
    summary:
      "About 137 million people live in mental-health shortage areas; many therapists and psychiatrists don't take insurance, and only about a third of psychiatrists accept new Medicaid patients.",
    evidence: [
      { text: "137M people in mental health HPSAs.", sourceIds: ["hrsa-bh-2025"] },
      {
        text: `About ${show("acceptMedicaidPsych")} of psychiatrists accept new Medicaid patients.`,
        sourceIds: ["holgash-heberlein"],
      },
    ],
    whoIsHurt: [
      "People with mental illness",
      "Families",
      "Emergency departments that board psychiatric patients",
    ],
    whoProfits: ["Cash-pay practices", "Insurers that avoid behavioral-health costs"],
    rootCauses: ["Low insurer payment", "Workforce shortage", "Weak parity enforcement"],
    openQuestions: [
      "How should therapists be paid so they participate?",
      "Should crisis care be public infrastructure?",
    ],
  },
  {
    id: "addiction",
    category: "Mental health & substance use",
    title: "Overdose crisis and gaps in addiction treatment",
    summary:
      "Overdoses kill tens of thousands each year; treatment with buprenorphine and methadone is restricted, and coverage gaps interrupt treatment.",
    evidence: [],
    whoIsHurt: ["People with substance use disorders", "Families and communities"],
    whoProfits: ["Unregulated treatment operators", "Illicit drug markets"],
    rootCauses: ["Stigma", "Regulatory barriers", "Coverage churn"],
    openQuestions: ["Should addiction treatment be available without cost or prior authorization?"],
  },

  // ---------------------------------------------------------------- LTC & end of life
  {
    id: "ltc-spend-down",
    category: "Long-term & end-of-life care",
    title: "Long-term care requires spending down to poverty",
    summary:
      "Medicare doesn't cover long-term care; Medicaid does only after people exhaust their savings. Hundreds of thousands wait for home-care services.",
    evidence: [
      {
        text: "About 700,000 people on Medicaid HCBS waiting lists (2023).",
        sourceIds: ["kff-hcbs-waitlist"],
      },
    ],
    whoIsHurt: ["Older and disabled people", "Family caregivers"],
    whoProfits: ["Nursing-home operators (institutional bias)", "Elder-law planners"],
    rootCauses: ["No social long-term care insurance", "Medicaid's institutional bias"],
    openQuestions: [
      "Should long-term care be covered for everyone? Including room and board?",
      "Should family caregivers be paid?",
    ],
  },
  {
    id: "nursing-home-quality",
    category: "Long-term & end-of-life care",
    title: "Nursing home understaffing and quality",
    summary:
      "Many nursing homes are understaffed, increasingly private-equity owned, and paid below cost by Medicaid; quality and safety problems persist.",
    evidence: [
      {
        text: "Medicaid nursing facility payments are below cost in many states.",
        sourceIds: ["macpac-nursing"],
      },
    ],
    whoIsHurt: ["Residents", "Staff"],
    whoProfits: ["Owners using related-party transactions and real-estate structures"],
    rootCauses: ["Low Medicaid rates", "Weak ownership transparency"],
    openQuestions: ["Should nursing homes face minimum staffing and ownership rules?"],
  },
  {
    id: "hospice-for-profit",
    category: "Long-term & end-of-life care",
    title: "Hospice growth, for-profit entry, and fraud",
    summary:
      "Medicare spent $25.7B on hospice in 2023 for 1.7 million people. Rapid entry of for-profit hospices has brought fraud concerns and patients enrolled who aren't dying.",
    evidence: [
      {
        text: "$25.7B Medicare hospice spending, 1.7M beneficiaries, ~6,500 providers (2023).",
        sourceIds: ["medpac-hospice-2025"],
      },
    ],
    whoIsHurt: ["Patients who lose curative treatment", "Taxpayers"],
    whoProfits: ["Hospices with long-stay patients"],
    rootCauses: ["Per-diem payment rewards long stays", "Requirement to give up curative care"],
    openQuestions: ["Should patients be able to receive hospice and curative care together?"],
  },

  // ---------------------------------------------------------------- Dental/vision/hearing
  {
    id: "dental-gap",
    category: "Dental, vision & hearing",
    title: "Dental, vision, and hearing are mostly uncovered",
    summary:
      "Traditional Medicare excludes dental, routine vision, and hearing aids; adult Medicaid dental varies by state; dental is the care most often skipped because of cost.",
    evidence: [
      { text: "Out-of-pocket dental spending was $72.5B in 2024.", sourceIds: ["cms-nhe-2024"] },
    ],
    whoIsHurt: ["Seniors", "Low-income adults"],
    whoProfits: ["Medicare Advantage plans marketing 'extra benefits'", "Cash-pay providers"],
    rootCauses: ["Historical separation of dental from medical insurance"],
    openQuestions: ["Should dental, vision, and hearing be covered like medical care?"],
  },

  // ---------------------------------------------------------------- Public health
  {
    id: "prevention-underfunded",
    category: "Public health & prevention",
    title: "Prevention and public health are underfunded",
    summary: `Public health was $157.6B of $5.28T in 2024 (about 3%). Chronic disease (diabetes, heart disease, obesity) drives most spending.`,
    evidence: [
      { text: "Government public health activity $157.6B (2024).", sourceIds: ["cms-nhe-2024"] },
    ],
    whoIsHurt: ["Everyone; future patients"],
    whoProfits: ["Treatment businesses (more chronic disease means more treatment)"],
    rootCauses: ["Payment for treatment, not prevention", "Short budget horizons"],
    openQuestions: ["How much should shift from treatment to prevention and public health?"],
  },
  {
    id: "social-needs",
    category: "Public health & prevention",
    title:
      "Housing, food, and transportation drive health, but health care isn't designed for them",
    summary:
      "Social conditions shape outcomes more than medical care, yet health systems have few tools or funding streams to address them.",
    evidence: [],
    whoIsHurt: ["Low-income people", "People experiencing homelessness"],
    whoProfits: ["N/A"],
    rootCauses: ["Separate silos for health and social services"],
    openQuestions: [
      "Should the health system pay for non-medical needs (housing, food) when they improve health?",
    ],
  },

  // ---------------------------------------------------------------- Data & tech
  {
    id: "interoperability",
    category: "Data, technology & privacy",
    title: "Records don't follow patients",
    summary:
      "Records are scattered across incompatible EHRs; tests are repeated and information is lost between providers.",
    evidence: [],
    whoIsHurt: ["Patients, especially those with many providers"],
    whoProfits: [
      "EHR vendors that profit from lock-in",
      "Providers that keep patients within their systems",
    ],
    rootCauses: ["Proprietary systems", "Competitive incentives to hoard data"],
    openQuestions: [
      "Should there be a single national health record or claims database? Who controls it?",
    ],
  },
  {
    id: "cybersecurity",
    category: "Data, technology & privacy",
    title: "Cyberattacks can halt payments and care",
    summary:
      "The 2024 Change Healthcare ransomware attack disrupted claims nationwide for weeks and exposed data on a large share of Americans.",
    evidence: [],
    whoIsHurt: ["Providers who went unpaid", "Patients whose data was exposed"],
    whoProfits: ["Attackers"],
    rootCauses: ["Concentration of clearinghouses", "Weak security baselines"],
    openQuestions: ["How much redundancy and security should be required, and who pays?"],
  },
  {
    id: "privacy",
    category: "Data, technology & privacy",
    title: "Health privacy",
    summary:
      "Health data is shared widely for payment, research, and marketing; sensitive data (reproductive, mental health, immigration) can expose people to harm.",
    evidence: [],
    whoIsHurt: ["Patients with sensitive conditions"],
    whoProfits: ["Data brokers"],
    rootCauses: ["HIPAA gaps", "Data used for commercial purposes"],
    openQuestions: [
      "Who should be allowed to see a national health dataset, and under what rules?",
    ],
  },

  // ---------------------------------------------------------------- Risks a universal system can create
  {
    id: "wait-times",
    category: "Risks a universal system can create",
    title: "Longer waits if demand grows faster than capacity",
    summary: `When care becomes free and universal, use rises. If supply doesn't grow, people wait, as in Canada (median ${show("canadaMedianWeeks")} weeks from referral to treatment) and the UK (${show("nhsWaitlist")} million on the waiting list). People with good employer coverage today, who are seen fastest, notice most.`,
    evidence: [
      {
        text: `Canada median wait ${show("canadaMedianWeeks")} weeks (2025).`,
        sourceIds: ["fraser-2025"],
      },
      {
        text: `NHS England waiting list about ${show("nhsWaitlist")} million; ${show("nhsWithin18")} treated within 18 weeks.`,
        sourceIds: ["nhs-rtt"],
      },
    ],
    hurts: [
      {
        group: "employer-covered",
        how: "They are seen fastest today and would share one queue with everyone.",
      },
      { group: "heavy-care-users", how: "They need specialists and procedures most often." },
    ],
    debate: {
      is: [
        {
          text: `Single-payer and tax-funded systems can have long waits: Canada's median from GP referral to treatment was ${show("canadaMedianWeeks")} weeks in 2025, and England's waiting list was about ${show("nhsWaitlist")} million.`,
          sourceIds: ["fraser-2025", "nhs-rtt"],
        },
        {
          text: `In a 2016 survey of people who needed a specialist, ${show("specialistWait2moCanada")} in Canada and ${show("specialistWait2moNorway")} in Norway waited two months or more, against ${show("specialistWait2moUs")} in the U.S. and ${show("specialistWait2moGermany")} in Germany.`,
          sourceIds: ["cmwf-specialist-wait-2016"],
        },
        {
          text: `People with private coverage get in fastest today: ${show("acceptPrivate")} of physicians took new privately insured patients, against ${show("acceptMedicaid")} for Medicaid. One shared queue ends that advantage.`,
          sourceIds: ["holgash-heberlein"],
        },
      ],
      isNot: [
        {
          text: `Waits follow capacity, not only how care is paid for: Canada has ${v("doctorsPer1000Canada")} practising doctors per 1,000 people against an OECD average of ${v("doctorsPer1000Oecd")}, and ${v("bedsPer1000Canada")} hospital beds against ${v("bedsPer1000Oecd")}.`,
          sourceIds: ["oecd-hag-2025-canada"],
        },
        {
          text: `The U.S. is no better supplied: ${v("doctorsPer1000Us")} doctors and ${v("bedsPer1000Us")} beds per 1,000 people. A U.S. single payer would need capacity to grow with coverage, which is a choice, not a given.`,
          sourceIds: ["oecd-hag-2025-us"],
          problems: ["physician-shortage"],
        },
        {
          text: "The U.S. already has waits: new-patient appointments in large metro areas average about a month.",
          sourceIds: ["amn-wait-2025"],
        },
      ],
    },
    rootCauses: ["Demand rises with coverage; supply grows slowly", "Budget caps on capacity"],
    openQuestions: [
      "How should waits be prevented: more capacity, small copays, wait-time guarantees, a private tier?",
    ],
  },
  {
    id: "two-tier",
    category: "Risks a universal system can create",
    title: "Two-tier care: a private fast lane for those who can pay",
    summary:
      "Where private insurance or cash practice exists alongside a public system (UK, Australia, Germany), those who pay get faster care, and providers' time shifts to them.",
    evidence: [
      {
        text: "Privately insured patients in Germany get specialist appointments faster.",
        sourceIds: ["germany-gkv"],
      },
    ],
    whoIsHurt: ["People who rely only on the public system"],
    whoProfits: ["Higher-income patients; providers with private practices"],
    rootCauses: ["Higher private prices attract provider time"],
    openQuestions: ["Should private insurance for publicly covered services be allowed?"],
  },
  {
    id: "underfunding",
    category: "Risks a universal system can create",
    title: "Chronic underfunding by government budgets",
    summary:
      "A publicly funded system competes with other spending every budget cycle. The UK's NHS waits rose sharply after a decade of slow funding growth.",
    evidence: [
      {
        text: "NHS England meets its 18-week standard for only about 59% of patients.",
        sourceIds: ["nhs-rtt"],
      },
    ],
    whoIsHurt: ["Patients", "Workers in the system"],
    whoProfits: ["Taxpayers in the short run"],
    rootCauses: ["Annual budget politics", "No automatic link between demand and funding"],
    openQuestions: ["Should funding be automatic (dedicated taxes, formulas) or set annually?"],
  },
  {
    id: "capital-underinvestment",
    category: "Risks a universal system can create",
    title: "Under-investment in equipment and facilities",
    summary:
      "Centrally planned capital budgets tend to under-invest; Canada has far fewer MRI and CT units per person than the U.S.",
    evidence: [
      {
        text: "OECD data show the U.S. with far more MRI/CT units per capita than Canada or the UK.",
        sourceIds: ["oecd-health-2025"],
      },
    ],
    whoIsHurt: ["Patients waiting for diagnostics"],
    whoProfits: ["Short-term budgets"],
    rootCauses: ["Capital competes with operating spending"],
    openQuestions: ["Who decides where hospitals, ORs, and scanners are built?"],
  },
  {
    id: "innovation-slowdown",
    category: "Risks a universal system can create",
    title: "Slower access to new drugs and technology",
    summary:
      "Systems with strict value assessment (UK NICE, Germany AMNOG, NZ PHARMAC) pay less but sometimes delay or refuse new drugs; lower U.S. prices would reduce global R&D.",
    evidence: [
      {
        text: "Lower prices reduce the number of new drugs over time.",
        sourceIds: ["cbo-hr3-drugs"],
      },
    ],
    whoIsHurt: ["Patients needing new therapies", "Biotech workers and investors"],
    whoProfits: ["Payers in the short run"],
    rootCauses: ["Price cuts without replacing R&D incentives"],
    openQuestions: [
      "How much innovation loss is acceptable for lower prices, and how can R&D be funded differently?",
    ],
  },
  {
    id: "provider-exit",
    category: "Risks a universal system can create",
    title: "Providers leave, retire, or go cash-only if pay drops",
    summary:
      "Cutting payment toward Medicare levels would reduce revenue for specialists and commercially dependent hospitals; some may retire, opt out, or close.",
    evidence: [
      { text: "Medicare hospital margins were about −13% in 2023.", sourceIds: ["medpac-2025"] },
    ],
    whoIsHurt: ["Patients in affected specialties and regions"],
    whoProfits: ["Cash practices"],
    rootCauses: ["Revenue cuts without matching cost reductions"],
    openQuestions: ["At what level should provider payment be set, and how fast should it change?"],
  },
  {
    id: "transition-disruption",
    category: "Risks a universal system can create",
    title: "Transition disruption: jobs, companies, and familiar coverage",
    summary: `Ending private insurance as primary coverage would displace about ${(Math.round(DISPLACED_TOTAL / 1000) * 1000).toLocaleString("en-US")} administrative jobs (site estimate), end the core business of insurers and PBMs, and change coverage for about ${ENROLLMENT_2024.employerSponsored} million people with employer plans.`,
    evidence: [
      {
        text: `About ${show("blsHealthCarriers")} people work at health insurance carriers.`,
        sourceIds: ["bls-oews-2025"],
      },
    ],
    hurts: [
      {
        group: "employer-covered",
        how: "People leave plans most of them rate well, and must re-learn how coverage works.",
      },
      {
        group: "insurance-billing-workers",
        how: "Jobs selling coverage and processing claims end.",
      },
      { group: "insurers", how: "Insurers lose their core business, and shareholders lose value." },
    ],
    debate: {
      is: [
        {
          text: `Most people with employer coverage like it: ${show("esiRatedGood")} rate their insurance excellent or good. A required switch takes away something many value.`,
          sourceIds: ["kff-consumer-survey-2023"],
        },
        {
          text: `Hundreds of thousands of insurance and billing jobs end; ${show("blsHealthCarriers")} people work at health insurance carriers alone.`,
          sourceIds: ["bls-oews-2025"],
          problems: ["billing-jobs"],
        },
        {
          text: "For many, the real loss is speed: people with employer coverage are seen fastest today, and in one shared system they lose that edge unless capacity grows.",
          problems: ["wait-times"],
        },
      ],
      isNot: [
        {
          text: "The switch is a one-time cost. What lasts is coverage that no longer ends with a job or an income change.",
          problems: ["job-lock", "churn"],
        },
        {
          text: "The money isn't lost. Workers largely pay for employer premiums through lower wages, so ending premiums can raise pay, but only if wages actually adjust.",
          sourceIds: ["baicker-chandra"],
          problems: ["x-new-taxes", "x-wage-incidence"],
        },
        {
          text: `Leaving an employer plan need not mean losing extras: in Australia, ${show("australiaPrivateHospitalCover")} of people also hold private hospital cover on top of the public system.`,
          sourceIds: ["twotier-allow-australian-prudential-re-2025"],
          problems: ["x-plan-choice"],
        },
      ],
    },
    rootCauses: ["The size of today's insurance-based system"],
    openQuestions: ["How fast should a transition happen, and who gets compensated or supported?"],
  },
  {
    id: "fraud-concentration",
    category: "Risks a universal system can create",
    title: "One payer becomes one target",
    summary:
      "A single national payer concentrates fraud risk and cyber risk; improper payments of 7.7% at national scale would be about $300B.",
    evidence: [
      { text: "Medicare FFS improper payment rate about 7.7%.", sourceIds: ["cms-improper"] },
    ],
    whoIsHurt: ["Taxpayers"],
    whoProfits: ["Fraudsters"],
    rootCauses: ["Pay-and-chase claims processing"],
    openQuestions: ["How should one payer verify claims without burdening honest providers?"],
  },
]

const X = "Problems created by solution paths" as const

/**
 * Problems that exist only because a solution path was chosen. Each is linked
 * from the paths that create it and has its own paths (subpaths).
 */
const DERIVED: Problem[] = [
  {
    id: "x-plan-choice",
    category: X,
    title: "Losing the choice of health plan and insurer competition",
    summary:
      "With one public payer, people can't switch plans if they dislike how their coverage is run, and insurers no longer compete on service, care management, or extra benefits.",
    evidence: [
      {
        text: `${show("esiRatedGood")} of adults with employer coverage rate their insurance excellent or good.`,
        sourceIds: ["kff-consumer-survey-2023"],
      },
    ],
    hurts: [
      {
        group: "employer-covered",
        how: "They can't keep or pick a plan they like, or switch if service is poor.",
      },
    ],
    debate: {
      is: [
        {
          text: `${show("esiRatedGood")} of adults with employer coverage rate it excellent or good, and they lose the option to keep it.`,
          sourceIds: ["kff-consumer-survey-2023"],
        },
        {
          text: "With one payer, there is no competitor to move to if service is poor, so service depends on public accountability alone.",
        },
      ],
      isNot: [
        {
          text: "Choosing an insurer today largely means choosing a network. With one payer, every provider is covered.",
          problems: ["networks"],
        },
        {
          text: `Choice can survive in other forms: in Australia, ${show("australiaPrivateHospitalCover")} of people add private hospital cover to the public system.`,
          sourceIds: ["twotier-allow-australian-prudential-re-2025"],
        },
      ],
    },
    rootCauses: ["A single payer has no competitors"],
    openQuestions: ["How can a single payer be held to good service without competition?"],
  },
  {
    id: "x-new-taxes",
    category: X,
    title: "Replacing premiums with taxes",
    summary:
      "Public financing replaces premiums and out-of-pocket costs with taxes. Total spending may fall, but taxes become larger and more visible, change incentives to work and invest, and fall on different people than premiums did.",
    evidence: [],
    hurts: [
      {
        group: "high-earners",
        how: "They pay more under income-based taxes than they did in flat premiums.",
      },
      { group: "employers", how: "Businesses that never offered coverage start paying toward it." },
    ],
    profits: [
      {
        group: "low-middle-income",
        how: "Income-based taxes replace flat premiums that took a large share of their pay.",
      },
    ],
    debate: {
      is: [
        {
          text: `Federal spending rises sharply: CBO's single-payer options add $${v("cboSinglePayerFederalLow") / 1000} trillion to $${v("cboSinglePayerFederalHigh") / 1000} trillion in federal subsidies in 2030, which taxes must cover.`,
          sourceIds: ["cbo-single-payer-2020"],
        },
        {
          text: "Taxes fall on different people than premiums did, and change incentives to work, hire, and invest.",
          problems: ["x-wage-incidence"],
        },
      ],
      isNot: [
        {
          text: `Most new taxes replace premiums and out-of-pocket costs instead of adding spending: in the same CBO options, national health spending changes by −$${-v("cboSinglePayerNationalLow") / 1000} trillion to +$${v("cboSinglePayerNationalHigh") / 1000} trillion in 2030.`,
          sourceIds: ["cbo-single-payer-2020"],
        },
        {
          text: `Premiums already work like a tax on pay: the average employer family premium was ${show("familyPremium")} in 2025, and workers largely pay it through lower wages.`,
          sourceIds: ["kff-ehbs-2025", "baicker-chandra"],
        },
      ],
    },
    rootCauses: ["Shifting payment from private premiums to public revenue"],
    openQuestions: [
      "Which taxes should fund health care: payroll, income, consumption (VAT), wealth, or a mix?",
    ],
  },
  {
    id: "x-wage-incidence",
    category: X,
    title: "Employer health taxes can lower wages at firms that never offered coverage",
    summary:
      "When employers pay a payroll tax instead of premiums, firms that used to offer coverage save money, but firms that didn't (often low-wage, small, or gig) face a new cost that tends to come out of wages over time.",
    evidence: [
      {
        text: "Employer health costs are largely passed on to workers as lower wages.",
        sourceIds: ["baicker-chandra"],
      },
    ],
    whoIsHurt: ["Low-wage workers at non-offering employers", "Small businesses"],
    whoProfits: ["Workers at firms that offered expensive coverage (wages rise)"],
    rootCauses: ["Uniform payroll tax replacing uneven premium spending"],
    openQuestions: [
      "Should employers pay anything toward health care? If so, how should small and low-wage employers be treated?",
    ],
  },
  {
    id: "x-copay-billing",
    category: X,
    title: "Copays keep billing systems alive and still deter poorer patients",
    summary:
      "Any point-of-care charge requires billing, collections, exemptions, and caps, and even small charges deter low-income patients more than others.",
    evidence: [
      {
        text: "The RAND Health Insurance Experiment found cost sharing reduced both needed and unneeded care.",
        sourceIds: ["rand-hie"],
      },
    ],
    whoIsHurt: ["Low-income and chronically ill patients", "Providers who must collect"],
    whoProfits: ["Billing vendors"],
    rootCauses: ["Charging at the point of care"],
    openQuestions: ["If charges exist, who is exempt, what is the cap, and how is it collected?"],
  },
  {
    id: "x-central-rationing",
    category: X,
    title: "Central coverage decisions can feel like rationing",
    summary:
      "When one public body decides which treatments are covered or worth their price, every 'no' becomes a national controversy, and patients have no other insurer to turn to.",
    evidence: [
      {
        text: "NICE in the UK applies cost-per-QALY thresholds and has faced public disputes over declined drugs.",
        sourceIds: [],
      },
    ],
    hurts: [
      {
        group: "heavy-care-users",
        how: "People needing a declined or delayed treatment have no other insurer to turn to.",
      },
      { group: "drug-device-makers", how: "A declined product loses the whole national market." },
    ],
    profits: [{ group: "taxpayers", how: "Declining low-value care holds down public spending." }],
    rootCauses: ["Finite budget with one decision-maker"],
    openQuestions: ["How should coverage decisions be made, appealed, and balanced against cost?"],
  },
  {
    id: "x-budget-rationing",
    category: X,
    title: "Fixed budgets can ration care",
    summary:
      "Global budgets cap spending, but if demand exceeds what the budget pays for, hospitals may limit operating-room time or slow elective work near the end of the budget year.",
    evidence: [
      {
        text: "Canadian hospitals on global budgets have long elective-surgery queues.",
        sourceIds: ["fraser-2025"],
      },
    ],
    whoIsHurt: ["Patients needing elective procedures"],
    whoProfits: ["Budget holders"],
    rootCauses: ["Payment not tied to volume"],
    openQuestions: ["How should budgets adjust when demand rises?"],
  },
  {
    id: "x-undertreatment",
    category: X,
    title: "Paying a fixed amount per patient rewards doing less",
    summary:
      "Capitation and bundled payments remove the incentive to over-treat, but create an incentive to under-treat, avoid sick patients, or refer costly cases elsewhere.",
    evidence: [
      {
        text: "Medicare Advantage plans deny some prior-authorization requests that would be approved under traditional Medicare.",
        sourceIds: ["medpac-2025"],
      },
    ],
    whoIsHurt: ["Sicker, costlier patients"],
    whoProfits: ["Providers or plans that keep the difference"],
    rootCauses: ["Fixed payment regardless of care delivered"],
    openQuestions: ["How should quality and access be monitored under fixed payments?"],
  },
  {
    id: "x-price-control-exit",
    category: X,
    title: "Price limits can cause shortages, launch delays, or exits",
    summary:
      "If a single buyer sets prices too low, manufacturers may not launch products, generic makers may stop producing, and providers may leave or limit services.",
    evidence: [
      {
        text: "Low generic prices contribute to sterile-injectable shortages.",
        sourceIds: ["ashp-shortages-2024"],
      },
    ],
    whoIsHurt: ["Patients who need the affected products or services"],
    whoProfits: ["Short-term budgets"],
    rootCauses: ["Prices below what sustains supply"],
    openQuestions: ["How should prices be set to sustain supply and innovation?"],
  },
  {
    id: "x-public-rd-priorities",
    category: X,
    title: "Government chooses which research gets funded",
    summary:
      "Publicly funded R&D or prizes put research priorities in government hands, which may underfund risky ideas or be swayed by politics.",
    evidence: [],
    whoIsHurt: ["Researchers in unfunded areas", "Patients with rare conditions"],
    whoProfits: ["Well-connected research institutions"],
    rootCauses: ["Centralized funding decisions"],
    openQuestions: ["Who should set research priorities, and how much should remain private?"],
  },
  {
    id: "x-scope-quality",
    category: X,
    title: "Quality concerns when non-physicians practice independently",
    summary:
      "Expanding what nurse practitioners, physician assistants, pharmacists, and dental therapists can do adds capacity, but some studies and physician groups raise concerns about over-prescribing, more referrals, and missed diagnoses.",
    evidence: [],
    whoIsHurt: ["Patients if quality falls"],
    whoProfits: ["N/A"],
    rootCauses: ["Shorter training for some roles"],
    openQuestions: ["How should quality be measured and assured as roles expand?"],
  },
  {
    id: "x-staffing-mandate-cost",
    category: X,
    title: "Staffing mandates raise costs and may close facilities",
    summary:
      "Minimum nurse or aide staffing levels improve safety, but cost money and, during shortages, may force facilities to close beds or shut down.",
    evidence: [],
    whoIsHurt: ["Facilities that can't hire", "Patients in areas where beds close"],
    whoProfits: ["Staffing agencies"],
    rootCauses: ["Mandates without workforce supply"],
    openQuestions: ["Should staffing rules phase in with workforce growth?"],
  },
  {
    id: "x-woodwork",
    category: X,
    title: "Covering long-term care can pull unpaid family care into the paid system",
    summary:
      "If home care becomes covered, families who now provide care for free may switch to paid aides, raising costs far above today's spending (the 'woodwork effect').",
    evidence: [
      {
        text: "Japan's long-term care insurance saw demand grow faster than expected after launch in 2000.",
        sourceIds: [],
      },
    ],
    whoIsHurt: ["Taxpayers"],
    whoProfits: ["Families relieved of caregiving", "Home-care agencies"],
    rootCauses: ["Large hidden demand met today by unpaid family care"],
    openQuestions: ["How should eligibility for long-term care be assessed and capped?"],
  },
  {
    id: "x-migration-concern",
    category: X,
    title: "Covering all residents raises cost and migration concerns",
    summary:
      "Covering undocumented immigrants adds cost and, critics argue, could attract migration; leaving them out keeps emergency-room care and public-health gaps.",
    evidence: [],
    whoIsHurt: ["Taxpayers (cost)", "Immigrants (if excluded)"],
    whoProfits: ["N/A"],
    rootCauses: ["Residence-based vs. status-based eligibility"],
    openQuestions: ["What proof of residence is required, and is there a waiting period?"],
  },
  {
    id: "x-metric-gaming",
    category: X,
    title: "Targets and quality metrics invite gaming",
    summary:
      "Wait-time guarantees, quality bonuses, and spending targets can be gamed: re-labeling referral dates, avoiding sick patients, or upcoding.",
    evidence: [
      {
        text: "NHS England's waiting-list targets have been associated with documented gaming.",
        sourceIds: ["nhs-rtt"],
      },
    ],
    whoIsHurt: ["Patients the metrics are meant to protect"],
    whoProfits: ["Providers that game measures"],
    rootCauses: ["Rewards tied to measurable proxies"],
    openQuestions: ["How should metrics be audited and designed to resist gaming?"],
  },
  {
    id: "x-state-control",
    category: X,
    title: "States lose control and budgets shift between levels of government",
    summary:
      "A national program takes over Medicaid from states, which changes who pays and who decides, and creates winners and losers between states.",
    evidence: [
      { text: `State share of Medicaid was $335.0B in 2024.`, sourceIds: ["cms-nhe-2024"] },
    ],
    hurts: [
      {
        group: "states",
        how: "States that designed their own programs lose control, and budgets shift between levels of government.",
      },
    ],
    rootCauses: ["Centralizing a state-run program"],
    openQuestions: ["How much should states run, pay for, and decide?"],
  },
]

PROBLEMS.push(...DERIVED)

export const PROBLEM_BY_ID = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]))
