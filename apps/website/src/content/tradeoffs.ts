import { MODEL, fmt } from "./model"
import { F } from "./figures"
import { show } from "./constants"
import type { TradeoffDimension } from "./types"
import { DISPLACED_TOTAL } from "./workforce"

const h = MODEL.headline

/**
 * The master trade-off register. Every dimension on which some people are
 * better off and some are worse off, with evidence from the U.S. and abroad.
 */
export const TRADEOFFS: TradeoffDimension[] = [
  {
    id: "wait-times-esi",
    title: "Speed of access for people with employer insurance",
    category: "access",
    summary:
      "Today, commercially insured patients are the most profitable patients, so they get scheduled first. Under one price for everyone, that advantage disappears. Employer-insured people will likely wait somewhat longer for non-urgent specialist care, especially in Years 1–5.",
    today:
      "Private insurers pay hospitals about 2.2–2.5x Medicare and physicians about 1.4x. Practices limit Medicaid slots and prioritize commercial patients. New-patient waits across 15 large metros already average about a month.",
    underPlan: `Every patient pays the provider the same rate. Physician-visit demand rises about 12% (${fmt(MODEL.serviceResults.find((s) => s.id === "physicianClinical")!.utilizationEffect)} a year), while supply grows slowly. The commercially insured lose their place at the front of the line.`,
    winners: [
      "Medicaid enrollees",
      "The uninsured",
      "Underinsured people who delay care due to deductibles",
    ],
    losers: [
      "People with generous employer coverage in specialties with tight supply (dermatology, orthopedics, psychiatry, gastroenterology)",
    ],
    magnitude:
      "Likely days to a few weeks longer for elective specialist care in Years 1–5 for the previously commercially insured, if capacity investment lags. No predicted change for emergency or cancer care, which is triaged by urgency.",
    evidence: [
      {
        place: "U.S. Medicaid",
        finding:
          "Only about 74% of physicians accept new Medicaid patients versus 96% for private insurance; secret-shopper studies find Medicaid callers get appointments much less often. Availability rose when Medicaid fees rose, so the gap is about price, not public coverage itself.",
        sourceIds: ["holgash-heberlein", "secret-shopper"],
      },
      {
        place: "U.S. Medicare",
        finding: `About 88% of physicians accept new Medicare patients, close to private insurance. Medicare is public, pays roughly Medicare rates by definition, and its access is broadly comparable to commercial. UHP pays 112–${show("hospitalRate", "pct")} of Medicare.`,
        sourceIds: ["holgash-heberlein"],
      },
      {
        place: "Canada",
        finding: `Median ${show("canadaMedianWeeks")} weeks from GP referral to treatment in 2025, ranging from 19.2 weeks in Ontario to 60.9 in New Brunswick. Driven by low capacity (fewer MRI units, operating-room time limited by global budgets) and the ban on private duplicative insurance.`,
        sourceIds: ["fraser-2025"],
      },
      {
        place: "United Kingdom",
        finding:
          "About 7.4 million cases on NHS England's waiting list in 2025; about 59% treated within 18 weeks against a 92% standard. Long-term underinvestment and post-COVID backlog.",
        sourceIds: ["nhs-rtt"],
      },
      {
        place: "Germany",
        finding:
          "Short waits overall, but privately insured patients (about 11%) get specialist appointments substantially faster than statutory-insured patients because physicians earn more from them. The same dynamic as U.S. commercial vs. Medicaid.",
        sourceIds: ["germany-gkv"],
      },
      {
        place: "Taiwan",
        finding:
          "Single payer with very short waits and high visit volumes, but short physician visits (often a few minutes) and high physician workloads.",
        sourceIds: ["taiwan-nhi"],
      },
    ],
    mitigations: [
      `Pay rates above Medicare (${show("hospitalRate", "pct")} hospitals, ${show("physicianRate", "pct")} physicians) so participation matches Medicare's.`,
      "Legally binding wait-time guarantee with vouchers to any provider.",
      `${fmt(MODEL.useLines.find((l) => l.id === "workforce")!.after)} a year in workforce investment and ${F.capacityCapital} in capacity capital.`,
      "Keep U.S. capital spending at today's level: the U.S. has far more MRI/CT units per capita than Canada and the UK.",
      "Expand nurse practitioner and PA scope; telehealth.",
    ],
    residualRisk:
      "Training takes years. If demand grows faster than supply, waits rise for everyone, and the employer-insured, who wait least today, notice most. This is the most likely politically fatal failure mode.",
    confidence: "medium",
  },
  {
    id: "access-medicaid-uninsured",
    title: "Access for Medicaid enrollees and the uninsured",
    category: "access",
    summary:
      "The largest gain. 28 million uninsured people get coverage, and 84 million Medicaid enrollees go from a payer many physicians refuse to one every participating physician accepts.",
    today:
      "About 26% of physicians don't accept new Medicaid patients, and only about 35% of psychiatrists do. The uninsured delay care and often get it through emergency rooms.",
    underPlan: "Same card, same rate, same access as everyone else.",
    winners: [
      "About 112 million people on Medicaid or uninsured",
      "Safety-net hospitals and community health centers (rates rise)",
    ],
    losers: [],
    magnitude:
      "Large. The Oregon experiment found Medicaid coverage reduced depression and catastrophic spending and raised use of preventive care.",
    evidence: [
      {
        place: "U.S. Oregon experiment",
        finding:
          "Coverage increased outpatient use and prescriptions, nearly eliminated catastrophic out-of-pocket spending, and reduced depression.",
        sourceIds: ["oregon-experiment"],
      },
      {
        place: "U.S. Medicaid fee bump (2013–14)",
        finding:
          "Raising Medicaid primary-care fees to Medicare levels increased appointment availability.",
        sourceIds: ["secret-shopper"],
      },
    ],
    mitigations: [],
    residualRisk:
      "If capacity doesn't grow, gains for these groups come partly at the expense of longer waits for others.",
    confidence: "high",
  },
  {
    id: "financial-security",
    title: "Financial protection from medical bills",
    category: "money",
    summary: `Out-of-pocket spending falls from ${fmt(MODEL.sourceLines.find((l) => l.id === "hhOop")!.before)} to ${fmt(MODEL.sourceLines.find((l) => l.id === "hhOop")!.after)}. No deductibles, copays, surprise bills, or medical debt for covered care.`,
    today:
      "About 100 million Americans carry some medical debt (KFF). Deductibles average about $1,800 for single coverage in employer plans (KFF). Bankruptcy filings often cite medical bills.",
    underPlan:
      "Medical debt from covered care ends. Remaining out-of-pocket spending is for non-covered items.",
    winners: ["Everyone who gets sick", "Especially people with chronic conditions and cancer"],
    losers: [
      "Hospitals' and collection agencies' patient-collections revenue (offset by global budgets)",
    ],
    magnitude: `${fmt(MODEL.sourceLines.find((l) => l.id === "hhOop")!.before - MODEL.sourceLines.find((l) => l.id === "hhOop")!.after)} a year less paid at the point of care.`,
    evidence: [
      {
        place: "Every universal system",
        finding: "Medical bankruptcy is rare or non-existent in Canada, the UK, and Taiwan.",
        sourceIds: [],
      },
    ],
    mitigations: [],
    residualRisk: "Nursing-home room and board remains a large out-of-pocket cost for some.",
    confidence: "high",
  },
  {
    id: "private-insurance-efficiency",
    title: "Efficiency: what private insurance does well, and what is lost",
    category: "quality",
    summary:
      "Private insurers do provide services: utilization management, network negotiation, care management, fraud control, customer service, and product innovation. Single payer removes them and must either replace them or accept losing them. The evidence on whether they save more than they cost is mixed to negative.",
    today: `Private insurers' net cost (administration + profit) is ${fmt(176.5)} of ${fmt(1644.6)} in premiums (10.7%). Medicare's administration is about 1.4% of spending (Trustees), though it does far less care management and fraud prevention.`,
    underPlan: `Insurer and plan overhead falls from ${fmt(MODEL.useLines.find((l) => l.id === "netCostOfInsurance")!.before)} to ${fmt(MODEL.useLines.find((l) => l.id === "netCostOfInsurance")!.after)}; UHP administration costs ${fmt(h.uhpAdmin)}. Net administrative saving ${fmt(h.adminSavings)} a year, before provider-side billing savings.`,
    winners: [
      "Providers (one set of rules, no prior authorizations)",
      "Patients (no denials, appeals, or network surprises)",
    ],
    losers: [
      "Insurer employees and shareholders",
      "Patients who valued plan-level care management (some MA enrollees)",
    ],
    magnitude: `About ${fmt(h.adminSavings)} a year in insurer-side savings.`,
    evidence: [
      {
        place: "Private insurance: prior authorization",
        finding:
          "Insurers argue prior authorization reduces low-value care. Physicians report it delays necessary care; Medicare Advantage plans denied about 6% of prior-authorization requests in 2023; few denials were appealed, but about 80% of those that were got overturned (KFF).",
        sourceIds: [],
      },
      {
        place: "Medicare Advantage",
        finding:
          "Coordinated care and extra benefits are popular, but MA costs about 20% more than traditional Medicare for similar enrollees, largely from coding intensity and favorable selection.",
        sourceIds: ["medpac-2025"],
      },
      {
        place: "Price negotiation",
        finding: `Private insurers' 'negotiation' yields hospital prices at about ${show("randHospitalMultiple", "pct")} of Medicare on average. Fragmented buyers have little leverage against consolidated health systems.`,
        sourceIds: ["rand-hospital-2024"],
      },
      {
        place: "Customer service",
        finding:
          "Competition gives insurers some incentive for service quality; a monopoly public payer has none except politics. Medicare's 1-800 line and appeals are slower than the best private plans but faster than Medicaid.",
        sourceIds: [],
      },
      {
        place: "Canada vs U.S. administration",
        finding:
          "Researchers estimate total administrative costs (payers + providers) at about 34% of U.S. spending vs 17% in Canada. These are advocacy-aligned authors, so treat this as an upper bound.",
        sourceIds: ["himmelstein-2020"],
      },
    ],
    mitigations: [
      `Program integrity funded at ${show("uhpAdminRate")} of benefits, above Medicare's 1.4%.`,
      "Integrated care organizations keep care management inside provider systems.",
      "Health Technology Assessment Institute replaces prior authorization with evidence-based coverage rules.",
    ],
    residualRisk:
      "A public monopoly can become complacent; customer-service failures have no competitor to absorb dissatisfied patients.",
    confidence: "medium",
  },
  {
    id: "choice",
    title: "Choice: of plan vs. of doctor",
    category: "choice",
    summary:
      "People lose the choice of insurance plan but gain an unrestricted choice of doctors and hospitals, since networks disappear.",
    today:
      "Choice of plan is mostly the employer's choice: about half of firms offering coverage offer only one plan type. Narrow networks are common in Marketplace and MA plans.",
    underPlan: "One plan for everyone; every participating provider is in network.",
    winners: ["People in narrow-network plans", "People who change jobs or move"],
    losers: [
      "People who valued choosing between plans (e.g., MA vs. traditional Medicare)",
      "People who would buy faster access if allowed",
    ],
    magnitude: "Qualitative.",
    evidence: [
      {
        place: "Canada, Taiwan",
        finding: "Free choice of physician within the public system; no plan choice.",
        sourceIds: [],
      },
    ],
    mitigations: ["Integrated care organizations provide a choice of care model."],
    residualRisk: "Opted-out providers create a de facto cash tier for the wealthy.",
    confidence: "high",
  },
  {
    id: "innovation-drugs",
    title: "Pharmaceutical & device innovation",
    category: "innovation",
    summary: `Lower drug prices reduce manufacturer revenue: about ${fmt(-MODEL.serviceResults.find((s) => s.id === "prescriptionDrugs")!.priceEffect)} a year in retail drug prices alone, more counting physician-administered drugs. That reduces expected returns to R&D, so fewer new drugs get developed.`,
    today:
      "The U.S. pays about 422% of other OECD countries' brand-name prices and supplies a large share of global pharmaceutical profits.",
    underPlan:
      "Prices negotiated toward value-based levels, still above other countries' prices (we assume a 35% brand cut, not a 75% cut).",
    winners: ["Patients today", "Taxpayers"],
    losers: [
      "Pharmaceutical shareholders",
      "Future patients who would have benefited from drugs not developed",
      "Biotech workers and investors",
    ],
    magnitude:
      "CBO estimated a narrower negotiation policy (H.R. 3) would mean about 8 fewer of about 300 new drugs in 2020–2029 and about 30 fewer in the following decade. This plan is broader, so a plausible range is 2–5x that effect.",
    evidence: [
      {
        place: "CBO",
        finding: "Fewer new drugs, with effects growing over time.",
        sourceIds: ["cbo-hr3-drugs"],
      },
      {
        place: "Europe",
        finding:
          "Value assessment (NICE, AMNOG) delays or prevents some launches; Europe's share of global pharma R&D has declined relative to the U.S. over decades.",
        sourceIds: [],
      },
    ],
    mitigations: [
      "Optional: increase NIH and BARDA funding (not in the base ledger).",
      "Higher prices for drugs with large demonstrated benefit (value-based pricing).",
    ],
    residualRisk:
      "Long-run innovation losses are the hardest cost to measure and could be larger than estimated.",
    confidence: "low",
  },
  {
    id: "jobs",
    title: "Jobs and local economies",
    category: "labor",
    summary: `About ${Math.round(DISPLACED_TOTAL / 1000)}k jobs are displaced in insurance, billing, brokerage, and PBMs; far more clinical jobs are demanded. Net employment rises, but the people and places differ.`,
    today:
      "Health administration employs a large workforce whose jobs exist because of payer complexity.",
    underPlan: "Administrative jobs disappear; clinical, home-care, and UHA jobs grow.",
    winners: ["Clinical and direct-care workers", "Workers freed from job lock"],
    losers: ["Insurance and billing workers", "Insurer-headquarters cities"],
    magnitude: "See the workforce page for the full table and transition-program cost.",
    evidence: [
      {
        place: "PERI (2018)",
        finding:
          "Estimated about 1.8M displaced jobs under Medicare for All with a transition program.",
        sourceIds: ["peri-2018"],
      },
    ],
    mitigations: [
      "Worker transition program",
      "Hiring preference at UHA",
      "Regional adjustment grants",
    ],
    residualRisk: "Displaced workers' earnings often stay lower for years.",
    confidence: "medium",
  },
  {
    id: "provider-income",
    title: "Provider incomes and hospital finances",
    category: "money",
    summary:
      "Hospitals' revenue is roughly flat in aggregate but redistributes sharply, toward Medicaid-heavy and rural hospitals and away from commercially dominant systems. Primary-care physicians gain and procedural specialists lose.",
    today:
      "Commercial revenue subsidizes losses on Medicare and Medicaid; hospital margins depend on payer mix.",
    underPlan: `Hospital spending ${fmt(MODEL.serviceResults.find((s) => s.id === "hospital")!.delta, { sign: true })} overall. Billing costs fall (about 8.5% of hospital and 13% of physician revenue today).`,
    winners: [
      "Rural and safety-net hospitals",
      "Primary care",
      "Pediatrics",
      "Psychiatry (more patients covered at better rates)",
    ],
    losers: [
      "Academic medical centers and suburban systems with high commercial shares",
      "High-earning procedural specialties",
    ],
    magnitude:
      "Commercial-heavy hospitals may see 15–30% revenue reductions before administrative savings.",
    evidence: [
      {
        place: "Maryland",
        finding: "Global budgets kept hospitals financially stable while slowing growth.",
        sourceIds: ["maryland-model"],
      },
      {
        place: "RAND",
        finding:
          "Prices vary widely between hospitals in the same market, showing market power rather than cost.",
        sourceIds: ["rand-hospital-2024"],
      },
    ],
    mitigations: ["Hospital Transition Fund", "4-year rate convergence", "Rural add-ons"],
    residualRisk: "Some hospitals will close or merge.",
    confidence: "medium",
  },
  {
    id: "taxes",
    title: "Taxes vs. premiums",
    category: "money",
    summary:
      "Premiums and out-of-pocket costs are replaced by visible taxes. Most households pay less in total, while high earners and non-offering employers pay more. Total national spending changes far less than the federal budget does.",
    today:
      "Premiums function like a hidden, flat per-person tax: a $27,000 family premium is the same for a $60,000 worker as for a $600,000 one.",
    underPlan: `Federal health spending (sponsor view) rises from ${fmt(h.federalBefore)} to ${fmt(h.federalAfter)}, and households pay income-based premiums and taxes instead.`,
    winners: ["Low- and middle-income households", "Seniors", "Employers that offered coverage"],
    losers: [
      "High-income households",
      "Employers that didn't offer coverage",
      "Young healthy workers with high incomes",
    ],
    magnitude: "See the households page.",
    evidence: [],
    mitigations: ["$250k payroll exemption for small employers", "Household premium exemption"],
    residualRisk: "Tax increases are politically harder than premium increases even when smaller.",
    confidence: "medium",
  },
  {
    id: "government-risk",
    title: "Dependence on government competence and politics",
    category: "governance",
    summary:
      "Everyone's coverage depends on one agency's budget, IT, and political support. Underfunding, a shutdown, or bad rate-setting affects everyone, and there is no exit option.",
    today: "Risk is spread across thousands of plans; failures are local.",
    underPlan:
      "Concentrated risk; strong protections (trust fund, permanent appropriation) needed.",
    winners: [],
    losers: ["Everyone, if governance fails"],
    magnitude: "Low probability, very high impact.",
    evidence: [
      {
        place: "UK",
        finding: "NHS waits rose sharply after years of below-trend funding growth (2010s).",
        sourceIds: ["nhs-rtt"],
      },
      {
        place: "U.S. Medicare",
        finding:
          "Medicare has paid claims continuously since 1966, including through government shutdowns, because of its trust funds.",
        sourceIds: ["cms-trustees-2025"],
      },
    ],
    mitigations: [
      "Trust fund with permanent appropriation",
      "Independent boards",
      "Automatic stabilizers",
      "Annual independent evaluation",
    ],
    residualRisk: "A future Congress can always cut funding.",
    confidence: "medium",
  },
  {
    id: "quality",
    title: "Quality of care and health outcomes",
    category: "quality",
    summary:
      "Coverage improves outcomes for the previously uninsured and underinsured. For the already well-insured, quality is unlikely to change much. Waits could harm outcomes if they become long for time-sensitive care.",
    today:
      "The U.S. ranks last among 10 high-income countries in the Commonwealth Fund's 2024 comparison, and has the lowest life expectancy among peers.",
    underPlan:
      "Universal access to primary care and medications; single dataset for quality measurement.",
    winners: [
      "The previously uninsured (mortality reductions estimated in Medicaid expansion studies)",
    ],
    losers: ["Possibly patients facing longer waits for elective procedures"],
    magnitude:
      "Studies estimate thousands to tens of thousands of lives saved per year (Galvani et al. estimated 68,000; estimates vary widely).",
    evidence: [
      {
        place: "Commonwealth Fund",
        finding: "U.S. last overall among 10 countries.",
        sourceIds: ["commonwealth-2024"],
      },
      {
        place: "Lancet (Galvani 2020)",
        finding:
          "Estimated about 68,000 lives saved per year; advocacy-aligned and at the high end.",
        sourceIds: ["galvani-2020"],
      },
    ],
    mitigations: ["Quality withholds in global budgets", "Public quality reporting"],
    residualRisk:
      "Life expectancy depends heavily on non-medical factors (obesity, overdoses, guns, cars) that coverage doesn't fix.",
    confidence: "medium",
  },
  {
    id: "equity",
    title: "Equity across income, race, and geography",
    category: "equity",
    summary:
      "One tier for everyone removes payer-based segregation of care, which falls along income and racial lines today.",
    today: "Who you see and how fast depends on your insurance, which tracks income and race.",
    underPlan:
      "Same card, same rates. A cash tier for opted-out providers remains for the wealthy.",
    winners: ["Low-income and minority communities", "Rural residents"],
    losers: ["People who benefit from today's priority access"],
    magnitude: "Large.",
    evidence: [
      {
        place: "Canada/UK",
        finding:
          "Income-related gradients in access are smaller than in the U.S., though they persist for specialist care.",
        sourceIds: [],
      },
    ],
    mitigations: [],
    residualRisk: "Geographic shortages persist without capacity investment.",
    confidence: "medium",
  },
  {
    id: "labor-mobility",
    title: "Labor market: job lock and entrepreneurship",
    category: "labor",
    summary:
      "Health coverage no longer depends on employment, so people can change jobs, start businesses, retire early, or work part-time without losing coverage.",
    today: "Many workers stay in jobs for the health insurance.",
    underPlan: "Coverage is portable and unconditional.",
    winners: ["Workers", "Entrepreneurs", "Early retirees"],
    losers: [
      "Employers who relied on benefits for retention",
      "Labor supply may fall slightly as some people retire earlier",
    ],
    magnitude: "Qualitative to moderate.",
    evidence: [],
    mitigations: [],
    residualRisk: "Slightly lower labor-force participation among 55–64-year-olds.",
    confidence: "medium",
  },
]
