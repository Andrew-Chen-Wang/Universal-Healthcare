import { show } from "./constants"
import { F } from "./figures"

/**
 * Every existing piece of the U.S. health system and what happens to it.
 * Each row links to the plan step that makes the change, where one exists.
 */
export type ChangeArea =
  | "Federal programs"
  | "Federal tax code"
  | "Federal insurance & health law"
  | "Provider payment & regulation"
  | "Drugs & devices"
  | "States & localities"
  | "Private sector"
  | "Patients"
  | "Workforce & training"
  | "Data & technology"

export type Disposition =
  | "ends"
  | "replaced"
  | "absorbed"
  | "amended"
  | "continues"
  | "new"
  | "expanded"

export type SystemChange = {
  id: string
  area: ChangeArea
  item: string
  today: string
  change: string
  disposition: Disposition
  when: string
  stepId: string
  /** Cost items (on their own pages) that carry the dollars for this change. */
  costIds?: string[]
  tradeoff: string
}

const CORE_CHANGES: SystemChange[] = [
  // ---------------------------------------------------------------- Federal programs
  {
    id: "medicare-a",
    area: "Federal programs",
    item: "Medicare Part A (hospital insurance)",
    today:
      "Covers inpatient, SNF, hospice, and some home health for 65+ and disabled; funded by the 2.9% HI payroll tax; deductible $1,676 per benefit period (2025).",
    change:
      "Folded into UHP. The HI payroll tax continues and flows to the UHP Trust Fund; deductibles and coinsurance end.",
    disposition: "absorbed",
    when: "Year 1",
    stepId: "medicare-upgrade",
    costIds: ["source-bizHi", "source-hhHi"],
    tradeoff:
      "Seniors gain; the separate Medicare 'earned benefit' identity, which is politically protective, is diluted into a program for everyone.",
  },
  {
    id: "medicare-b",
    area: "Federal programs",
    item: "Medicare Part B (physician & outpatient)",
    today: `Voluntary; ${show("partBMonthly")}/month premium (2025) plus income-related surcharges (IRMAA); 20% coinsurance with no cap.`,
    change:
      "Folded into UHP. Premiums, IRMAA, and coinsurance end; Social Security checks rise by the premium amount.",
    disposition: "absorbed",
    when: "Year 1",
    stepId: "medicare-upgrade",
    costIds: ["source-hhSmi"],
    tradeoff:
      "Higher-income seniors who paid IRMAA gain the most per person among seniors, though they pay the household premium.",
  },
  {
    id: "medicare-c",
    area: "Federal programs",
    item: "Medicare Part C (Medicare Advantage)",
    today:
      "About 54% of Medicare enrollees in private plans paid by capitation, with networks, prior authorization, and supplemental benefits.",
    change:
      "Ends after a final contract year (Year 1). Provider-run integrated care organizations may take capitated budgets without an insurance layer.",
    disposition: "ends",
    when: "End of Year 1",
    stepId: "medicare-upgrade",
    costIds: ["use-insurer-overhead"],
    tradeoff:
      "Ends coding-intensity overpayments (MedPAC: ~20% above FFS), but about 33 million people lose plans that score high on satisfaction.",
  },
  {
    id: "medicare-d",
    area: "Federal programs",
    item: "Medicare Part D (drug plans)",
    today:
      "Standalone and MA drug plans run by private sponsors and PBMs; $2,000 out-of-pocket cap (2025); IRA negotiation of selected drugs.",
    change:
      "Replaced by the national formulary with $0 cost sharing. IRA negotiation is extended to all drugs.",
    disposition: "replaced",
    when: "Year 1",
    stepId: "national-formulary",
    tradeoff:
      "No premiums or cost sharing; formulary choice moves from plan competition to one public formulary with an exceptions process.",
  },
  {
    id: "medigap",
    area: "Federal programs",
    item: "Medigap (federally standardized supplemental plans)",
    today: "About 12.6M people pay roughly $2,000–4,000/yr to cover Medicare cost sharing.",
    change: "Ends; no cost sharing remains to insure. Unearned premiums refunded.",
    disposition: "ends",
    when: "Year 1",
    stepId: "medicare-upgrade",
    costIds: ["source-hhDirect"],
    tradeoff: "Seniors save premiums; Medigap insurers and agents lose that business.",
  },
  {
    id: "msp-lis",
    area: "Federal programs",
    item: "Medicare Savings Programs & Part D Low-Income Subsidy",
    today:
      "Means-tested help paying Medicare premiums and cost sharing; complex enrollment, low take-up.",
    change: "End: nothing left to subsidize.",
    disposition: "ends",
    when: "Year 1",
    stepId: "medicare-upgrade",
    costIds: ["source-fedBuyIn", "source-slMoe"],
    tradeoff: "Removes a means test that many eligible people never navigated.",
  },
  {
    id: "medicaid-acute",
    area: "Federal programs",
    item: "Medicaid (acute care)",
    today:
      "84.3M enrollees; state-run with federal match (FMAP); income eligibility varies by state (10 states have not expanded); ~75% in managed care; annual redeterminations.",
    change:
      "Folded into UHP by age wave; acute-care eligibility rules, redeterminations, and managed-care contracts end. States pay a maintenance-of-effort amount instead of their share.",
    disposition: "absorbed",
    when: "Years 1–4",
    stepId: "wind-down-medicaid",
    costIds: ["source-fedMedicaid", "source-slMoe"],
    tradeoff:
      "Enrollees go from the lowest-paying payer to the same rate as everyone; states lose program control.",
  },
  {
    id: "medicaid-ltss",
    area: "Federal programs",
    item: "Medicaid long-term services (nursing homes, HCBS waivers)",
    today:
      "The main U.S. payer for long-term care, but only after people spend down to poverty; HCBS waivers capped, with waiting lists.",
    change:
      "UHP covers LTSS by functional need, with no asset test; HCBS becomes an entitlement; room and board income-tested.",
    disposition: "replaced",
    when: "Year 2",
    stepId: "ltss-entitlement",
    costIds: ["service-otherResidential", "service-homeHealth", "service-nursing"],
    tradeoff:
      "Ends impoverishment for long-term care; risk of the 'woodwork effect' as paid care replaces family care.",
  },
  {
    id: "medicaid-residual",
    area: "Federal programs",
    item: "Medicaid non-medical supports",
    today:
      "Some states use Medicaid for housing supports, non-emergency transport, and social-needs pilots (e.g., 1115 waivers).",
    change: "A residual, optional Medicaid continues for non-medical supports with federal match.",
    disposition: "amended",
    when: "Year 4",
    stepId: "wind-down-medicaid",
    tradeoff: "Keeps innovation in social supports; continues some state-by-state variation.",
  },
  {
    id: "chip",
    area: "Federal programs",
    item: "Children's Health Insurance Program (CHIP)",
    today: "7.3M children; separate state programs or Medicaid expansions; some premiums.",
    change: "Children move to UHP in Year 1; CHIP funding is redirected.",
    disposition: "absorbed",
    when: "Year 1",
    stepId: "wave-one-enrollment",
    tradeoff: "Ends coverage gaps when children age out or family income changes.",
  },
  {
    id: "aca-exchanges",
    area: "Federal programs",
    item: "ACA Marketplaces (HealthCare.gov and state exchanges)",
    today:
      "21.1M enrollees (2024) with premium tax credits; annual open enrollment; narrow networks.",
    change: `Close at end of Year 3; premium tax credits (${F.marketplace}) redirected.`,
    disposition: "ends",
    when: "End of Year 3",
    stepId: "marketplace-closure",
    tradeoff: "Ends subsidy cliffs and churn; Marketplace staff and navigator jobs end.",
  },
  {
    id: "basic-health",
    area: "Federal programs",
    item: "ACA Basic Health Program (NY Essential Plan, MN MinnesotaCare, OR Bridge)",
    today: "State programs for people just above Medicaid income.",
    change: "Absorbed into UHP.",
    disposition: "absorbed",
    when: "Years 1–4",
    stepId: "wind-down-medicaid",
    tradeoff: "Simplification; states lose a policy tool they built.",
  },
  {
    id: "fehb",
    area: "Federal programs",
    item: "Federal Employees Health Benefits (FEHB) & Postal Service plan (PSHB)",
    today: "About 8M federal employees, retirees, and families.",
    change: "Closes in Year 4; the employer contribution converts to pay or retirement benefits.",
    disposition: "ends",
    when: "Year 4",
    stepId: "end-esi",
    costIds: ["source-fedEsi", "source-fedPayroll"],
    tradeoff:
      "Federal workers lose a valued benefit choice; the government becomes a regular employer-taxpayer.",
  },
  {
    id: "tricare",
    area: "Federal programs",
    item: "TRICARE (military dependents & retirees)",
    today: "Defense Health Agency coverage for about 9.5M.",
    change:
      "Active-duty care continues through the military health system; dependents and retirees move to UHP.",
    disposition: "amended",
    when: "Years 1–4",
    stepId: "coordinate-other-payers",
    tradeoff:
      "Simplifies coverage for families; military health leadership loses a large beneficiary population used for medical readiness training.",
  },
  {
    id: "va",
    area: "Federal programs",
    item: "Veterans Health Administration",
    today:
      "Direct-care system for about 9M enrolled veterans; Community Care program pays outside providers.",
    change: "Continues as a delivery system; veterans are also UHP-eligible and may use either.",
    disposition: "continues",
    when: "—",
    stepId: "coordinate-other-payers",
    tradeoff:
      "Preserves VA's specialized care; may reduce VA volume as veterans use UHP providers closer to home.",
  },
  {
    id: "ihs",
    area: "Federal programs",
    item: "Indian Health Service & tribal programs",
    today:
      "Treaty-based care, chronically underfunded (per-capita spending far below other federal programs).",
    change:
      "Continues; UHP pays IHS and tribal facilities for care to UHP-eligible patients, adding revenue.",
    disposition: "expanded",
    when: "Year 1",
    stepId: "coordinate-other-payers",
    tradeoff:
      "More money for IHS without disturbing tribal sovereignty; requires consultation under treaty obligations.",
  },
  {
    id: "cobra",
    area: "Federal insurance & health law",
    item: "COBRA continuation coverage",
    today: "Lets people keep employer coverage after job loss at up to 102% of premium.",
    change: "Repealed for health coverage once everyone is eligible.",
    disposition: "ends",
    when: "Year 4",
    stepId: "erisa-and-insurance-law",
    tradeoff: "No longer needed: coverage no longer depends on a job.",
  },
  {
    id: "hcgov-navigators",
    area: "Federal programs",
    item: "Navigator and enrollment-assistance grants",
    today: "Fund community groups to help people enroll in coverage.",
    change: "End; resources shift to UHA patient advocacy and outreach for hard-to-reach groups.",
    disposition: "replaced",
    when: "Year 4",
    stepId: "marketplace-closure",
    tradeoff: "Less need for enrollment help; community organizations lose a funding stream.",
  },

  // ---------------------------------------------------------------- Tax code
  {
    id: "irc-106",
    area: "Federal tax code",
    item: "IRC §106 exclusion of employer health coverage",
    today: `Employer premiums are excluded from income and payroll tax: the largest federal tax expenditure (~${show("esiTaxExclusion")}/yr incl. payroll).`,
    change:
      "Ends for UHP-covered services; retained (capped) for supplementary dental, vision, and LTC coverage.",
    disposition: "ends",
    when: "By wave",
    stepId: "erisa-and-insurance-law",
    costIds: ["source-hhIncomeTax"],
    tradeoff:
      "Removes a regressive subsidy worth more to high earners; workers see higher taxable wages instead of tax-free benefits.",
  },
  {
    id: "irc-125",
    area: "Federal tax code",
    item: "IRC §125 cafeteria plans & Flexible Spending Accounts",
    today: "Pre-tax premium payments and FSAs for out-of-pocket costs.",
    change: "Pre-tax premium conversion ends; health FSAs limited to non-covered items.",
    disposition: "amended",
    when: "By wave",
    stepId: "erisa-and-insurance-law",
    tradeoff: "Simpler; benefits administrators lose FSA business.",
  },
  {
    id: "hsa",
    area: "Federal tax code",
    item: "Health Savings Accounts (IRC §223) and high-deductible plans",
    today: "About 38M accounts; triple tax advantage; requires a high-deductible plan.",
    change:
      "New contributions end when the owner's wave enrolls (no HDHP exists); existing balances may be used for non-covered care or rolled into retirement accounts without penalty.",
    disposition: "ends",
    when: "By wave",
    stepId: "erisa-and-insurance-law",
    tradeoff:
      "Ends a tax shelter mostly used by higher earners; savers lose a tax-advantaged account.",
  },
  {
    id: "hra",
    area: "Federal tax code",
    item: "HRAs, ICHRA & QSEHRA",
    today: "Employer accounts to reimburse individual premiums and costs.",
    change: "End for UHP-covered care.",
    disposition: "ends",
    when: "Year 4",
    stepId: "erisa-and-insurance-law",
    tradeoff: "No longer needed.",
  },
  {
    id: "irc-36b",
    area: "Federal tax code",
    item: "IRC §36B premium tax credits",
    today: `${F.marketplace} in 2024 for Marketplace coverage.`,
    change: "Repealed after Year 3; money redirected to UHP.",
    disposition: "ends",
    when: "Year 4",
    stepId: "marketplace-closure",
    tradeoff: "Ends complex reconciliation and repayment at tax time.",
  },
  {
    id: "irc-4980h",
    area: "Federal tax code",
    item: "Employer mandate (IRC §4980H)",
    today: "Large employers must offer coverage or pay a penalty.",
    change: "Repealed; replaced by the universal employer health payroll tax.",
    disposition: "replaced",
    when: "Year 4",
    stepId: "tax-legislation",
    tradeoff: "No more 30-hour cliffs that push employers to cap part-timers' hours.",
  },
  {
    id: "irc-213",
    area: "Federal tax code",
    item: "Medical expense deduction (IRC §213) and self-employed health insurance deduction (§162(l))",
    today: `Itemized deduction above ${show("employerTaxRate")} of AGI; self-employed deduct premiums.`,
    change:
      "Self-employed premium deduction ends; medical deduction kept for non-covered costs (e.g., nursing-home room and board).",
    disposition: "amended",
    when: "By wave",
    stepId: "tax-legislation",
    tradeoff: "Small revenue gain; keeps relief for catastrophic non-covered costs.",
  },
  {
    id: "new-payroll",
    area: "Federal tax code",
    item: "Employer health payroll tax (new)",
    today: "—",
    change: `${show("employerTaxRate")} of payroll above a ${show("payrollExemption")} per-employer exemption; self-employed above $50,000 of net earnings.`,
    disposition: "new",
    when: "Phased Years 1–4",
    stepId: "tax-legislation",
    costIds: ["source-bizPayroll", "source-fedPayroll", "source-slPayroll"],
    tradeoff: "Universal and predictable; new cost for employers that never offered coverage.",
  },
  {
    id: "new-premium",
    area: "Federal tax code",
    item: "Household income-based health premium (new)",
    today: "—",
    change: "4% of AGI above $16k–$32k+ size-adjusted exemption, through withholding.",
    disposition: "new",
    when: "Phased Years 1–4",
    stepId: "tax-legislation",
    tradeoff: "Proportional to income rather than flat per person; visible tax.",
  },
  {
    id: "new-top",
    area: "Federal tax code",
    item: "Top-end surtax, capital-gains change, financial transactions tax (new)",
    today: "Top rate 37%; long-term capital gains 20% (+3.8% NIIT).",
    change:
      "7% surtax above $1M AGI; gains and dividends taxed as ordinary income above $1M; 0.1% FTT.",
    disposition: "new",
    when: "Year 1",
    stepId: "tax-legislation",
    tradeoff: "Progressive but volatile and avoidance-prone revenue.",
  },
  {
    id: "irc-501r",
    area: "Federal tax code",
    item: "Nonprofit hospital tax exemption & charity care rules (IRC §501(r))",
    today:
      "Nonprofit hospitals are exempt from income and property taxes in exchange for 'community benefit', much of it counted as charity care and Medicaid shortfall.",
    change:
      "Charity care for covered services disappears; community-benefit standard redefined around public-health investment, or exemption reconsidered by Congress.",
    disposition: "amended",
    when: "Year 4",
    stepId: "hospital-global-budgets",
    tradeoff:
      "The main rationale for the exemption (uncompensated care) disappears; ending exemptions would raise revenue but cut hospital margins.",
  },

  // ---------------------------------------------------------------- Insurance & health law
  {
    id: "erisa",
    area: "Federal insurance & health law",
    item: "ERISA (employer benefit plans) & its preemption of state law (§514)",
    today:
      "Self-insured employer plans (about 60% of covered workers) are federally regulated and shielded from state insurance law.",
    change:
      "Employer health plans for UHP services end; preemption amended so states can regulate supplementary coverage.",
    disposition: "amended",
    when: "Year 0",
    stepId: "erisa-and-insurance-law",
    tradeoff:
      "Large multistate employers lose uniform federal treatment of their remaining benefits.",
  },
  {
    id: "aca-market-rules",
    area: "Federal insurance & health law",
    item: "ACA insurance market rules (guaranteed issue, community rating, essential health benefits, MLR)",
    today: "Govern the individual and small-group markets.",
    change: "Moot for core coverage; adapted to regulate supplementary coverage (85% minimum MLR).",
    disposition: "amended",
    when: "Year 4",
    stepId: "erisa-and-insurance-law",
    tradeoff: "None for patients; insurers face strict rules on a much smaller market.",
  },
  {
    id: "duplicative-ban",
    area: "Federal insurance & health law",
    item: "Ban on duplicative private insurance (new)",
    today: "—",
    change:
      "Insurance covering UHP benefits may not be sold to UHP-eligible people (100% excise tax on premiums), for at least 10 years.",
    disposition: "new",
    when: "By wave",
    stepId: "erisa-and-insurance-law",
    tradeoff: "Keeps one queue; removes a private fast lane (see access trade-off).",
  },
  {
    id: "emtala",
    area: "Federal insurance & health law",
    item: "EMTALA (emergency treatment requirement)",
    today: "Hospitals must screen and stabilize anyone, which generates uncompensated care.",
    change: "Continues; uncompensated care for residents disappears because everyone is covered.",
    disposition: "continues",
    when: "—",
    stepId: "define-benefits",
    tradeoff: "Emergency departments no longer serve as the de facto safety net.",
  },
  {
    id: "no-surprises",
    area: "Federal insurance & health law",
    item: "No Surprises Act & independent dispute resolution",
    today: "Limits surprise out-of-network bills; arbitration between insurers and providers.",
    change:
      "Becomes largely moot (no networks, no balance billing); retained for supplementary insurance and visitors.",
    disposition: "amended",
    when: "Year 4",
    stepId: "provider-enrollment",
    tradeoff: "Ends an arbitration industry that has produced high awards.",
  },
  {
    id: "hipaa",
    area: "Federal insurance & health law",
    item: "HIPAA (privacy, security, transaction standards)",
    today:
      "Governs covered entities and standard electronic transactions across thousands of payers.",
    change:
      "Continues and is strengthened for the national claims database (warrant requirement, access logs).",
    disposition: "amended",
    when: "Year 0",
    stepId: "data-privacy",
    tradeoff: "Stronger protections for a far more concentrated dataset.",
  },
  {
    id: "msp",
    area: "Federal insurance & health law",
    item: "Medicare Secondary Payer rules & coordination of benefits",
    today: "Complex rules decide which insurer pays first.",
    change: "Replaced by UHP recovery from workers' comp and auto/liability insurers only.",
    disposition: "replaced",
    when: "Year 4",
    stepId: "coordinate-other-payers",
    tradeoff: "Eliminates most coordination-of-benefits work for providers.",
  },
  {
    id: "hyde",
    area: "Federal insurance & health law",
    item: "Hyde Amendment",
    today: "Annual appropriations rider barring federal funds for most abortions.",
    change: "Requires an explicit congressional decision for UHP (see design decisions).",
    disposition: "amended",
    when: "Year 0",
    stepId: "define-benefits",
    tradeoff: "Uniform coverage vs. political breadth.",
  },

  // ---------------------------------------------------------------- Provider payment & regulation
  {
    id: "ipps-opps",
    area: "Provider payment & regulation",
    item: "Medicare hospital payment systems (IPPS DRGs, OPPS)",
    today:
      "Per-case and per-service rates for Medicare; commercial insurers pay negotiated prices about 2.5x Medicare.",
    change: `Replaced by global operating budgets at about ${show("hospitalRate", "pct")} of Medicare-equivalent volume; DRGs retained as a measurement tool and for out-of-region patients.`,
    disposition: "replaced",
    when: "Years 1–4 (converging)",
    stepId: "hospital-global-budgets",
    tradeoff: "Spending control and less billing vs. weaker volume incentives.",
  },
  {
    id: "mpfs",
    area: "Provider payment & regulation",
    item: "Medicare Physician Fee Schedule (RBRVS) & the AMA RUC",
    today:
      "Medicare fees anchor all payers; relative values largely developed by the AMA's RUC committee.",
    change:
      "Becomes the UHP national fee schedule, rebalanced toward primary care; independent review of relative values.",
    disposition: "amended",
    when: "Year 0–2",
    stepId: "fee-schedule",
    tradeoff: "Primary care gains, procedural specialists lose.",
  },
  {
    id: "dsh",
    area: "Provider payment & regulation",
    item: "Medicaid & Medicare DSH and supplemental payments",
    today:
      "Billions in disproportionate-share and supplemental payments compensate hospitals for uninsured and Medicaid patients.",
    change:
      "End; the need disappears and the money is built into global budgets (safety-net adjustment).",
    disposition: "replaced",
    when: "Year 4",
    stepId: "hospital-global-budgets",
    tradeoff:
      "Simpler, but safety-net hospitals depend on budget-setting getting their adjustment right.",
  },
  {
    id: "340b",
    area: "Provider payment & regulation",
    item: "340B Drug Pricing Program",
    today:
      "Safety-net hospitals and clinics buy outpatient drugs at deep discounts and keep the spread from insurer reimbursement (tens of billions a year).",
    change:
      "Ends as a revenue mechanism: UHP pays negotiated drug prices to all; the lost spread is replaced by explicit safety-net budget adjustments.",
    disposition: "replaced",
    when: "Year 2",
    stepId: "national-formulary",
    tradeoff:
      "Ends an opaque subsidy that partly flows to well-off systems and contract pharmacies; covered entities lose flexible revenue.",
  },
  {
    id: "gme",
    area: "Provider payment & regulation",
    item: "Medicare Graduate Medical Education funding",
    today:
      "Medicare funds most residency positions, capped since 1997 apart from recent small additions.",
    change: `Moves to UHP with ${show("residencySlots")} new slots focused on shortage specialties.`,
    disposition: "expanded",
    when: "Years 0–5",
    stepId: "capacity-expansion",
    tradeoff: "More physicians long-run; training takes 3–7 years after medical school.",
  },
  {
    id: "con",
    area: "Provider payment & regulation",
    item: "State certificate-of-need laws",
    today: "About 35 states require approval for some facility investments.",
    change: "Replaced by regional UHP capital planning.",
    disposition: "replaced",
    when: "Year 5",
    stepId: "ongoing-capacity-planning",
    tradeoff: "One national approach vs. state control.",
  },
  {
    id: "stark-aks",
    area: "Provider payment & regulation",
    item: "Stark law & Anti-Kickback Statute",
    today: "Fraud and abuse laws for Medicare and Medicaid.",
    change: "Extended to all UHP payments.",
    disposition: "expanded",
    when: "Year 1",
    stepId: "program-integrity",
    tradeoff:
      "Uniform rules; more compliance obligations for providers who mainly served commercial patients.",
  },
  {
    id: "price-transparency",
    area: "Provider payment & regulation",
    item: "Hospital and insurer price transparency rules",
    today: "Hospitals and insurers must publish negotiated rates.",
    change: "Largely moot: one public price list; retained for cash/opt-out providers.",
    disposition: "amended",
    when: "Year 4",
    stepId: "fee-schedule",
    tradeoff: "Transparency is automatic.",
  },
  {
    id: "prior-auth",
    area: "Provider payment & regulation",
    item: "Prior authorization & utilization management",
    today: "Payer-specific rules; major administrative burden.",
    change:
      "Replaced by evidence-based national coverage rules from the HTA Institute, with narrow prior review only for listed high-risk services.",
    disposition: "replaced",
    when: "Year 1",
    stepId: "hta-institute",
    tradeoff: "Less burden; less case-by-case policing of low-value care.",
  },
  {
    id: "aco-cmmi",
    area: "Provider payment & regulation",
    item: "Medicare ACOs & CMS Innovation Center models",
    today: "Value-based payment experiments layered on fee-for-service.",
    change:
      "ACOs can convert to integrated care organizations; the Innovation Center continues within UHA.",
    disposition: "amended",
    when: "Years 2–4",
    stepId: "integrated-care-orgs",
    tradeoff:
      "Keeps experimentation; ends shared-savings arrangements tied to MA and commercial contracts.",
  },
  {
    id: "malpractice",
    area: "Provider payment & regulation",
    item: "Medical malpractice (state tort law)",
    today: "Litigation-based compensation; premiums are a cost of practice.",
    change: "Unchanged except for optional no-fault pilots.",
    disposition: "continues",
    when: "Years 3–10",
    stepId: "malpractice-pilot",
    tradeoff: "Defensive medicine persists unless pilots succeed.",
  },

  // ---------------------------------------------------------------- Drugs
  {
    id: "pbm",
    area: "Drugs & devices",
    item: "Pharmacy benefit managers",
    today:
      "Three PBMs process about 80% of prescriptions; rebates, spread pricing, formulary placement.",
    change: "Role ends for UHP; pharmacies are paid acquisition cost plus a dispensing fee by UHA.",
    disposition: "ends",
    when: "By wave",
    stepId: "insurer-runoff",
    tradeoff: "Transparent prices; loses PBMs' (contested) role in squeezing manufacturer prices.",
  },
  {
    id: "ira-negotiation",
    area: "Drugs & devices",
    item: "Medicare Drug Price Negotiation (IRA)",
    today: "Up to 15–20 drugs a year negotiated for Medicare only.",
    change:
      "Expanded to every drug and every patient through the National Formulary and Pricing Board.",
    disposition: "expanded",
    when: "Years 1–3",
    stepId: "national-formulary",
    tradeoff: "Large savings; lower innovation incentive.",
  },
  {
    id: "part-b-drugs",
    area: "Drugs & devices",
    item: "Physician-administered drugs (Medicare Part B ASP+6%)",
    today: "Paid at average sales price + 6%, which rewards using pricier drugs.",
    change: "Negotiated price + flat handling fee.",
    disposition: "replaced",
    when: "Year 2",
    stepId: "national-formulary",
    tradeoff: "Removes the incentive for costlier drugs; oncology practices lose margin.",
  },
  {
    id: "rebates",
    area: "Drugs & devices",
    item: "Manufacturer rebates and Medicaid Drug Rebate Program",
    today: "Opaque rebate system; Medicaid gets statutory rebates and 'best price'.",
    change: "Replaced by net negotiated prices; Medicaid best-price rules end.",
    disposition: "replaced",
    when: "Year 4",
    stepId: "national-formulary",
    tradeoff: "Simpler and transparent; 'best price' cross-market spillovers end.",
  },
  {
    id: "devices",
    area: "Drugs & devices",
    item: "Medical devices & durable medical equipment pricing",
    today:
      "Hospitals and payers negotiate device prices; Medicare competitive bidding for some DME.",
    change:
      "National reference prices for high-cost implants within hospital budgets; competitive bidding expanded for DME.",
    disposition: "amended",
    when: "Years 2–4",
    stepId: "national-formulary",
    tradeoff: "Lower prices; device makers' U.S. margins fall.",
  },

  // ---------------------------------------------------------------- States
  {
    id: "state-insurance",
    area: "States & localities",
    item: "State insurance departments & mandated benefits",
    today: "Regulate fully insured plans; impose benefit mandates and premium taxes.",
    change: `Regulate supplementary insurance only; benefit mandates moot; premium tax base shrinks (~${F.premiumTax} lost).`,
    disposition: "amended",
    when: "Year 4",
    stepId: "erisa-and-insurance-law",
    tradeoff: "States lose revenue and regulatory reach.",
  },
  {
    id: "state-employee",
    area: "States & localities",
    item: "State & local employee and retiree health plans",
    today:
      "Teachers, police, and public workers; large unfunded retiree-health (OPEB) liabilities.",
    change: "Close; employer pays payroll tax; OPEB liabilities largely extinguished.",
    disposition: "ends",
    when: "Year 4",
    stepId: "end-esi",
    costIds: ["source-slEsi", "source-slPayroll"],
    tradeoff: "Big savings for state budgets; public-sector unions lose a core bargained benefit.",
  },
  {
    id: "state-medicaid-agency",
    area: "States & localities",
    item: "State Medicaid agencies",
    today: "Run eligibility, managed-care contracting, and payment.",
    change: "Wind down acute-care functions; some staff join UHA regional offices.",
    disposition: "amended",
    when: "Years 3–5",
    stepId: "wind-down-medicaid",
    tradeoff: "Administrative savings; job losses in state government.",
  },
  {
    id: "county-indigent",
    area: "States & localities",
    item: "County indigent-care programs & public hospital subsidies",
    today: "Counties fund care for uninsured residents.",
    change: "Need largely ends; county funds can shift to public health.",
    disposition: "amended",
    when: "Year 4",
    stepId: "wind-down-medicaid",
    tradeoff: "Local budget relief; counties must decide whether to keep public hospitals.",
  },
  {
    id: "scope",
    area: "States & localities",
    item: "Scope-of-practice laws (NPs, PAs, pharmacists, dental therapists)",
    today: "Vary widely; many states restrict independent practice.",
    change: "Federal grants encourage full practice authority to expand capacity.",
    disposition: "amended",
    when: "Years 1–3",
    stepId: "capacity-expansion",
    tradeoff: "More capacity vs. physician-group concerns about quality and supervision.",
  },
  {
    id: "workers-comp",
    area: "States & localities",
    item: "Workers' compensation medical benefits",
    today: "Separate state systems pay for work injuries.",
    change: "Continue (they also replace wages), but pay UHP rates and reimburse UHP.",
    disposition: "amended",
    when: "Year 4",
    stepId: "coordinate-other-payers",
    costIds: ["source-bizOther"],
    tradeoff: "Keeps employer liability incentives for safety; some double administration remains.",
  },
  {
    id: "auto-pip",
    area: "States & localities",
    item: "Auto insurance personal injury protection & liability medical payments",
    today: "Auto insurers pay medical bills for crashes.",
    change: "Continue; UHP pays first and recovers from auto insurers.",
    disposition: "amended",
    when: "Year 4",
    stepId: "coordinate-other-payers",
    costIds: ["source-hhPc"],
    tradeoff: "Patients never wait on auto insurers to get care.",
  },

  // ---------------------------------------------------------------- Private sector
  {
    id: "insurers",
    area: "Private sector",
    item: "Private health insurers (commercial, MA, Medicaid MCO)",
    today: `${F.privatePremiums} in private premiums; ~${F.insurerNonMedical} in non-medical spending across private, MA/Part D, and Medicaid plans.`,
    change:
      "Core business ends; run-off rules; Blues assets to charitable foundations; may sell supplementary coverage or contract with UHA.",
    disposition: "ends",
    when: "Years 1–5",
    stepId: "insurer-runoff",
    tradeoff: `Largest administrative saving; ~${F.insurerJobs} jobs and $400–700B of shareholder value at risk.`,
  },
  {
    id: "employers",
    area: "Private sector",
    item: "Employer health benefits",
    today: "179M people covered through work; employers choose plans and administer enrollment.",
    change: "End for covered services; payroll tax; maintenance-of-compensation for 3 years.",
    disposition: "ends",
    when: "Year 4",
    stepId: "end-esi",
    tradeoff: "Ends job lock; employers lose a recruitment tool.",
  },
  {
    id: "taft-hartley",
    area: "Private sector",
    item: "Multiemployer (Taft-Hartley) union health funds",
    today: "Jointly trusteed funds covering millions of union members.",
    change: "Convert to supplementary benefits or dissolve; assets to members or pensions.",
    disposition: "ends",
    when: "Year 4",
    stepId: "end-esi",
    tradeoff: "Unions lose an institutional role; members gain portable coverage.",
  },
  {
    id: "brokers",
    area: "Private sector",
    item: "Brokers, agents, benefits consultants",
    today: "Sell and service group and individual health coverage.",
    change: "Health line of business ends except supplementary.",
    disposition: "ends",
    when: "Year 4",
    stepId: "insurer-runoff",
    tradeoff: "~72k jobs displaced.",
  },
  {
    id: "rcm",
    area: "Private sector",
    item: "Revenue-cycle, clearinghouse & claims-editing vendors",
    today: "A large industry handling billing, denials, and claim scrubbing.",
    change: "Most demand ends; some vendors contract with UHA.",
    disposition: "ends",
    when: "Years 1–4",
    stepId: "build-claims-system",
    tradeoff: "~72k jobs displaced; providers' overhead falls.",
  },
  {
    id: "medical-debt",
    area: "Private sector",
    item: "Medical debt collection & credit reporting",
    today: "About 100M Americans carry medical debt.",
    change:
      "No new debt from covered care; existing medical debt purchase-and-forgive program optional (not costed).",
    disposition: "ends",
    when: "Year 4",
    stepId: "define-benefits",
    tradeoff: "Collection industry shrinks.",
  },
  {
    id: "pe-ownership",
    area: "Private sector",
    item: "Private-equity and investor ownership of practices and facilities",
    today:
      "Growing PE ownership in anesthesiology, dermatology, emergency medicine, nursing homes; strategies often depend on commercial pricing and out-of-network billing.",
    change:
      "Ownership disclosure required; out-of-network and commercial-arbitrage strategies end.",
    disposition: "amended",
    when: "Year 1",
    stepId: "provider-enrollment",
    tradeoff: "Less extraction; investor exits may destabilize some practices.",
  },

  // ---------------------------------------------------------------- Patients
  {
    id: "networks",
    area: "Patients",
    item: "Provider networks",
    today: "Plans limit which providers are covered; out-of-network costs.",
    change: "Abolished: every participating provider is in network for everyone.",
    disposition: "ends",
    when: "By wave",
    stepId: "provider-enrollment",
    tradeoff: "More choice of provider; no plan choice.",
  },
  {
    id: "cost-sharing",
    area: "Patients",
    item: "Deductibles, copays, coinsurance, out-of-pocket maximums",
    today:
      "Average single deductible about $1,800 in employer plans; out-of-pocket max up to $9,200 single (2025).",
    change: "Abolished for covered services.",
    disposition: "ends",
    when: "By wave",
    stepId: "define-benefits",
    tradeoff: "No financial barrier; more induced demand.",
  },
  {
    id: "open-enrollment",
    area: "Patients",
    item: "Annual open enrollment and plan selection",
    today: "Yearly choice of plans, re-verification of eligibility.",
    change: "Ends; enrollment is automatic and permanent while resident.",
    disposition: "ends",
    when: "Year 4",
    stepId: "auto-enrollment",
    tradeoff: "No paperwork; no plan choice.",
  },
  {
    id: "appeals",
    area: "Patients",
    item: "Claim denials and appeals",
    today: "Different processes per insurer; external review varies.",
    change: "One national appeals process with 30-day decisions; ombudsman.",
    disposition: "replaced",
    when: "Year 1",
    stepId: "create-uha",
    tradeoff: "Simpler; a single payer's denial has no alternative insurer.",
  },
  {
    id: "wait-guarantee",
    area: "Patients",
    item: "Wait-time guarantee (new)",
    today: "No legal access standard except network adequacy rules.",
    change: "Maximum waits with vouchers to any provider when missed.",
    disposition: "new",
    when: "Years 1–2",
    stepId: "wait-time-guarantee",
    tradeoff: "Enforceable access; costs rise when capacity is short.",
  },

  // ---------------------------------------------------------------- Workforce
  {
    id: "nhsc",
    area: "Workforce & training",
    item: "National Health Service Corps & Title VII/VIII training programs",
    today: "Scholarships and loan repayment for service in shortage areas; small scale.",
    change: "Expanded to tuition-free training tied to 4 years of service.",
    disposition: "expanded",
    when: "Year 1+",
    stepId: "capacity-expansion",
    tradeoff: "More clinicians where needed; service obligations limit graduates' choices.",
  },
  {
    id: "img",
    area: "Workforce & training",
    item: "Licensing for internationally trained clinicians",
    today: "Most must repeat residency in the U.S.",
    change: "Supervised-practice pathways to licensure.",
    disposition: "amended",
    when: "Years 1–3",
    stepId: "capacity-expansion",
    tradeoff: "Faster capacity; contributes to 'brain drain' from other countries.",
  },
  {
    id: "dw-program",
    area: "Workforce & training",
    item: "Displaced-worker transition program (new)",
    today: "—",
    change: `Wage replacement, wage insurance, training, and bridge pensions for ~${F.displaced} workers.`,
    disposition: "new",
    when: "Years 1–6",
    stepId: "worker-transition",
    tradeoff: `Costs ~${F.workerProgram}; reduces hardship and opposition.`,
  },

  // ---------------------------------------------------------------- Data
  {
    id: "claims-standards",
    area: "Data & technology",
    item: "X12 claim transactions (837/835/270/271) across payers",
    today: "Thousands of payer-specific companion guides and edits.",
    change: "One national standard, one set of edits, real-time eligibility API.",
    disposition: "replaced",
    when: "Year 0–1",
    stepId: "build-claims-system",
    tradeoff: "Huge simplification; single point of failure.",
  },
  {
    id: "health-card",
    area: "Data & technology",
    item: "UHP number and card (new)",
    today: "Different member IDs per insurer; Medicare MBI.",
    change: "One lifelong identifier (extending the MBI format); digital card.",
    disposition: "new",
    when: "Year 0–1",
    stepId: "auto-enrollment",
    tradeoff: "Simplicity; privacy concerns about a universal identifier.",
  },
  {
    id: "wait-registry",
    area: "Data & technology",
    item: "National wait-time registry (new)",
    today: "No national data on waits.",
    change: "Every referral and scheduled procedure time-stamped and published.",
    disposition: "new",
    when: "Year 1",
    stepId: "wait-time-guarantee",
    tradeoff: "Transparency; reporting burden on providers.",
  },
]

const MORE_CHANGES: SystemChange[] = [
  {
    id: "cah",
    area: "Provider payment & regulation",
    item: "Critical Access Hospitals (cost-based reimbursement)",
    today:
      "About 1,370 small rural hospitals are paid 101% of reasonable cost by Medicare instead of prospective rates.",
    change:
      "Become a protected category in global budgets: budgets set from audited costs plus a margin, with a floor so isolated hospitals cannot be squeezed out.",
    disposition: "replaced",
    when: "Years 1–4",
    stepId: "hospital-global-budgets",
    tradeoff:
      "Protects rural access; cost-based budgets reward high costs and weaken efficiency incentives.",
  },
  {
    id: "rhc-fqhc-pps",
    area: "Provider payment & regulation",
    item: "FQHC and Rural Health Clinic prospective payment (encounter rates)",
    today:
      "Health centers get a per-visit rate from Medicare and Medicaid, plus Section 330 grants for uninsured care.",
    change:
      "UHP keeps an all-inclusive encounter rate for health centers at no less than today's Medicaid PPS rate; Section 330 grants shift from uninsured care to capacity and enabling services (translation, transport).",
    disposition: "amended",
    when: "Year 1",
    stepId: "fee-schedule",
    tradeoff:
      "Health centers keep stable funding but lose their unique role as the uninsured safety net, since every provider now accepts everyone.",
  },
  {
    id: "esrd",
    area: "Federal programs",
    item: "Medicare End-Stage Renal Disease program",
    today:
      "Since 1972, Medicare covers dialysis and transplants for nearly everyone with kidney failure; private insurers pay first for 30 months and pay dialysis firms several times Medicare rates.",
    change:
      "Folded into UHP; the 30-month private coordination period ends; dialysis paid at the UHP bundled rate.",
    disposition: "absorbed",
    when: "Year 1",
    stepId: "medicare-upgrade",
    tradeoff:
      "Ends the commercial-rate premium that dialysis chains (DaVita, Fresenius) depend on for profit; their margins fall sharply.",
  },
  {
    id: "hospice",
    area: "Federal programs",
    item: "Medicare hospice benefit",
    today:
      "Per-diem payment for terminally ill patients who forgo curative treatment; rapid growth of for-profit hospices with documented fraud.",
    change:
      "Continues under UHP with concurrent care allowed (patients need not give up curative treatment) and enhanced program-integrity review.",
    disposition: "amended",
    when: "Year 1",
    stepId: "program-integrity",
    tradeoff:
      "Concurrent care improves end-of-life choice but raises spending; stricter review burdens legitimate hospices.",
  },
  {
    id: "pace",
    area: "Federal programs",
    item: "PACE (Programs of All-Inclusive Care for the Elderly)",
    today:
      "Capitated programs for frail elders eligible for nursing-home care, mostly dual eligibles.",
    change: "Convert to integrated care organizations paid a risk-adjusted capitated budget.",
    disposition: "replaced",
    when: "Year 2",
    stepId: "integrated-care-orgs",
    tradeoff:
      "Preserves a successful integrated model; small programs bear more administrative work to meet ICO rules.",
  },
  {
    id: "dsnp",
    area: "Federal programs",
    item: "Dual Eligible Special Needs Plans (D-SNPs)",
    today: "Medicare Advantage plans for people with both Medicare and Medicaid.",
    change:
      "End with Medicare Advantage; duals get all care through UHP, ending Medicare–Medicaid coordination problems.",
    disposition: "ends",
    when: "End of Year 1",
    stepId: "medicare-upgrade",
    tradeoff:
      "Ends a long-standing coordination failure; care-coordination staff of D-SNPs must move to providers.",
  },
  {
    id: "ryan-white",
    area: "Federal programs",
    item: "Ryan White HIV/AIDS Program",
    today:
      "Payer of last resort for HIV care, drugs (ADAP), and support services for low-income and uninsured people.",
    change:
      "Medical care and drugs move to UHP; Ryan White funds refocus on case management, housing, and support services.",
    disposition: "amended",
    when: "Year 4",
    stepId: "define-benefits",
    tradeoff:
      "More stable coverage of HIV medications; HIV service organizations lose some of their funding role.",
  },
  {
    id: "title-x",
    area: "Federal programs",
    item: "Title X family planning program",
    today: "Grants for family-planning services for low-income and uninsured people.",
    change:
      "Clinical services move to UHP; Title X refocuses on outreach, education, and confidential services for minors.",
    disposition: "amended",
    when: "Year 4",
    stepId: "define-benefits",
    tradeoff:
      "Universal coverage of contraception; Title X's future scope becomes a political fight.",
  },
  {
    id: "samhsa-block",
    area: "Federal programs",
    item: "SAMHSA mental health & substance use block grants",
    today: "Fund services for uninsured people and services insurers do not cover.",
    change:
      "Treatment moves to UHP; block grants refocus on crisis systems (988), prevention, and recovery support.",
    disposition: "amended",
    when: "Year 4",
    stepId: "define-benefits",
    tradeoff:
      "Treatment is covered for all; state behavioral-health agencies must redefine their role.",
  },
  {
    id: "ccbhc",
    area: "Provider payment & regulation",
    item: "Certified Community Behavioral Health Clinics",
    today: "Clinics paid a cost-based daily or monthly rate under Medicaid demonstrations.",
    change: "Become a UHP provider type with a prospective all-inclusive rate.",
    disposition: "amended",
    when: "Year 2",
    stepId: "fee-schedule",
    tradeoff:
      "Stable funding for behavioral health; cost-based rates weaken efficiency incentives.",
  },
  {
    id: "csr",
    area: "Federal programs",
    item: "ACA cost-sharing reductions & silver loading",
    today:
      "Lower deductibles for low-income Marketplace enrollees; insurers load the cost into silver premiums.",
    change: "End with the Marketplaces; no cost sharing exists to reduce.",
    disposition: "ends",
    when: "End of Year 3",
    stepId: "marketplace-closure",
    tradeoff: "Ends a convoluted subsidy mechanism.",
  },
  {
    id: "risk-adjustment",
    area: "Federal insurance & health law",
    item: "ACA and Medicare Advantage risk adjustment",
    today: "Transfers between insurers based on enrollee health; drives coding intensity.",
    change:
      "Ends for insurers; retained only for integrated care organization budgets, with audits.",
    disposition: "amended",
    when: "Year 4",
    stepId: "integrated-care-orgs",
    tradeoff:
      "Removes most of the upcoding industry; risk-adjustment gaming can still occur for ICOs.",
  },
  {
    id: "waivers",
    area: "States & localities",
    item: "Section 1332 (ACA) and Section 1115 (Medicaid) waivers",
    today:
      "States run reinsurance programs, Medicaid work requirements, managed-care designs, and pilots under waivers.",
    change:
      "1332 reinsurance waivers end with the individual market; 1115 waivers limited to residual non-medical Medicaid. A new state-administered UHP option replaces them as the route for state innovation.",
    disposition: "replaced",
    when: "Year 4",
    stepId: "state-moe-design",
    tradeoff:
      "Ends coverage restrictions like work requirements; states lose broad waiver flexibility.",
  },
  {
    id: "stldi",
    area: "Federal insurance & health law",
    item: "Short-term limited-duration plans, fixed indemnity plans & health care sharing ministries",
    today:
      "Cheaper, underwritten coverage outside ACA rules; sharing ministries are not insurance.",
    change:
      "Banned as duplicative coverage for UHP-covered services; indemnity products allowed only as supplementary income protection.",
    disposition: "ends",
    when: "Year 4",
    stepId: "erisa-and-insurance-law",
    tradeoff:
      "Removes products that left people underinsured; members of sharing ministries lose a faith-based arrangement they chose.",
  },
  {
    id: "dpc",
    area: "Private sector",
    item: "Direct primary care & concierge medicine",
    today: "Monthly membership practices, often outside insurance.",
    change:
      "Permitted only for opted-out physicians; memberships cannot be bought with insurance. Participating practices may offer UHP primary-care capitation instead.",
    disposition: "amended",
    when: "Year 1",
    stepId: "provider-enrollment",
    tradeoff:
      "Keeps one queue; preserves a cash option that creates a de facto tier for those who can pay.",
  },
  {
    id: "hospital-antitrust",
    area: "Provider payment & regulation",
    item: "Antitrust enforcement for hospital and physician mergers",
    today: "FTC challenges some mergers because consolidation raises commercial prices.",
    change:
      "Price effects disappear under one fee schedule; merger review refocuses on access, quality, and capacity in each region.",
    disposition: "amended",
    when: "Year 4",
    stepId: "ongoing-capacity-planning",
    tradeoff:
      "Consolidation no longer raises prices, so more mergers may be allowed; that can still reduce patient choice and quality competition.",
  },
  {
    id: "site-neutral",
    area: "Provider payment & regulation",
    item: "Site-of-service payment differences (hospital outpatient vs. physician office)",
    today:
      "The same service pays more when billed by a hospital outpatient department, which encourages hospitals to buy practices.",
    change:
      "One price per service regardless of setting (site-neutral), except where added costs are documented.",
    disposition: "replaced",
    when: "Year 2",
    stepId: "fee-schedule",
    tradeoff: "Removes the incentive to acquire practices; hospital outpatient revenue falls.",
  },
  {
    id: "poh-ban",
    area: "Provider payment & regulation",
    item: "ACA ban on new physician-owned hospitals",
    today: "Section 6001 bars new physician-owned hospitals from Medicare.",
    change: "Retained under UHP to limit self-referral, subject to review by the Rates Board.",
    disposition: "continues",
    when: "—",
    stepId: "provider-enrollment",
    tradeoff: "Limits self-referral; blocks a potential source of new surgical capacity.",
  },
  {
    id: "telehealth",
    area: "Provider payment & regulation",
    item: "Telehealth coverage rules",
    today:
      "Medicare telehealth flexibilities repeatedly extended on short-term deadlines; private coverage varies.",
    change:
      "Permanent UHP telehealth coverage at parity for clinically appropriate services, including audio-only for behavioral health.",
    disposition: "expanded",
    when: "Year 1",
    stepId: "define-benefits",
    tradeoff:
      "Expands capacity and rural access; higher fraud risk and possible extra visits that add to rather than replace in-person care.",
  },
  {
    id: "licensure-compacts",
    area: "Workforce & training",
    item: "State licensure (interstate compacts for physicians, nurses, psychologists)",
    today:
      "Clinicians need a license in each state where the patient is located; compacts cover some states.",
    change:
      "Federal grants encourage all states to join compacts so clinicians can serve UHP patients across state lines.",
    disposition: "amended",
    when: "Years 1–3",
    stepId: "capacity-expansion",
    tradeoff:
      "More capacity, especially for telehealth; states cede some control over discipline and standards.",
  },
  {
    id: "transplant",
    area: "Provider payment & regulation",
    item: "Organ transplant financing (organ acquisition cost centers)",
    today:
      "Medicare reimburses transplant hospitals for organ acquisition costs through cost reports; patients need insurance to be listed.",
    change:
      "UHP covers transplants and lifetime immunosuppressive drugs for all; insurance status no longer affects listing.",
    disposition: "expanded",
    when: "Year 1",
    stepId: "define-benefits",
    tradeoff:
      "Ends insurance-based barriers to transplant listing; more demand for a fixed supply of organs.",
  },
  {
    id: "clinical-trials",
    area: "Federal insurance & health law",
    item: "Coverage of routine costs in clinical trials",
    today:
      "Required for Medicare and ACA plans, but patients still face network and prior-authorization barriers.",
    change: "UHP covers routine care costs in all approved trials nationwide.",
    disposition: "expanded",
    when: "Year 1",
    stepId: "define-benefits",
    tradeoff: "Easier trial enrollment; small added cost.",
  },
  {
    id: "maternity",
    area: "Patients",
    item: "Pregnancy coverage (Medicaid covers about 41% of births)",
    today:
      "Many pregnant people move into Medicaid during pregnancy and lose coverage after 12 months postpartum (where states extended it).",
    change:
      "Continuous UHP coverage before, during, and after pregnancy; doulas and midwives covered.",
    disposition: "replaced",
    when: "Year 1",
    stepId: "define-benefits",
    tradeoff:
      "Ends postpartum coverage cliffs; obstetric units in low-volume rural hospitals still need budget protection to stay open.",
  },
  {
    id: "school-health",
    area: "States & localities",
    item: "School-based health services billed to Medicaid",
    today: "Schools bill Medicaid for services to eligible students (therapy, nursing).",
    change: "Schools bill UHP for every student, which removes eligibility checks.",
    disposition: "replaced",
    when: "Year 1",
    stepId: "wave-one-enrollment",
    tradeoff: "More funding for school health services; schools must meet UHP billing standards.",
  },
  {
    id: "corrections",
    area: "States & localities",
    item: "Health care in jails and prisons (Medicaid inmate exclusion)",
    today:
      "Medicaid cannot pay for care of incarcerated people except inpatient stays; recent 1115 waivers allow pre-release services.",
    change:
      "UHP covers incarcerated residents in the 90 days before release and immediately at release, so there is no gap.",
    disposition: "amended",
    when: "Year 4",
    stepId: "auto-enrollment",
    tradeoff:
      "Reduces overdose deaths and readmissions after release; corrections systems still fund in-custody care.",
  },
  {
    id: "employer-wellness",
    area: "Private sector",
    item: "Employer wellness programs and on-site clinics",
    today: "Tied to health plans (premium discounts for participation).",
    change:
      "Premium-based incentives end; on-site clinics may bill UHP as participating providers.",
    disposition: "amended",
    when: "Year 4",
    stepId: "end-esi",
    tradeoff:
      "Ends incentive schemes that penalized less healthy workers; employers lose a tool they used to manage costs.",
  },
  {
    id: "medical-tourism",
    area: "Patients",
    item: "Medical travel abroad and across borders",
    today:
      "Some uninsured or underinsured Americans travel to Mexico, Canada, or elsewhere for cheaper care and drugs.",
    change:
      "Demand falls; UHP pays for care abroad only for emergencies or when the wait-time guarantee is missed and a foreign provider is approved.",
    disposition: "amended",
    when: "Year 4",
    stepId: "wait-time-guarantee",
    tradeoff: "Less need to travel; border-region clinics lose U.S. patients.",
  },
  {
    id: "life-insurance-disability",
    area: "Private sector",
    item: "Disability, long-term-care, and life insurers",
    today: "Separate products, often bundled with employer benefits.",
    change: "Continue; private long-term-care insurance shrinks to room-and-board coverage.",
    disposition: "amended",
    when: "Year 2",
    stepId: "ltss-entitlement",
    tradeoff: "The private LTC insurance market, already small, mostly disappears.",
  },
  {
    id: "provider-taxes",
    area: "States & localities",
    item: "State provider taxes and intergovernmental transfers funding Medicaid",
    today: "States tax hospitals and nursing homes to draw federal Medicaid match.",
    change:
      "End for acute care because there is no match to draw; the revenue is counted in state MOE calculations.",
    disposition: "ends",
    when: "Year 4",
    stepId: "state-moe-design",
    tradeoff:
      "Ends a financing gimmick; states that relied on it must replace the revenue within their MOE.",
  },
  {
    id: "gpo",
    area: "Drugs & devices",
    item: "Group purchasing organizations & drug wholesalers",
    today:
      "GPOs negotiate hospital supply prices and collect administrative fees from suppliers; three wholesalers distribute most drugs.",
    change:
      "Continue for logistics; national reference prices for drugs and high-cost devices reduce their negotiating role.",
    disposition: "amended",
    when: "Years 2–4",
    stepId: "national-formulary",
    tradeoff:
      "Less opaque fee income in the supply chain; less room for hospitals to negotiate below reference prices.",
  },
  {
    id: "biosimilars",
    area: "Drugs & devices",
    item: "Biosimilar and generic substitution",
    today: "Slow biosimilar uptake because rebates favor brand biologics.",
    change:
      "The national formulary prefers biosimilars and generics, with automatic pharmacy substitution.",
    disposition: "amended",
    when: "Year 1",
    stepId: "national-formulary",
    tradeoff:
      "Large savings; some patients must switch products, and brand makers lose market share faster.",
  },
  {
    id: "vaccines",
    area: "Federal programs",
    item: "Vaccines for Children & adult vaccine coverage",
    today: "VFC buys vaccines for Medicaid and uninsured children; adult coverage varies by payer.",
    change: "UHP covers all recommended vaccines for everyone; VFC folds into the formulary.",
    disposition: "absorbed",
    when: "Year 1",
    stepId: "national-formulary",
    tradeoff:
      "Universal vaccine coverage; politicization of vaccine recommendations directly affects coverage.",
  },
  {
    id: "residency-cap",
    area: "Workforce & training",
    item: "1997 Medicare cap on funded residency positions",
    today: "Hospitals' Medicare-funded residency slots largely frozen at 1996 levels.",
    change: `Lifted for shortage specialties; ${show("residencySlots")} new positions funded.`,
    disposition: "expanded",
    when: "Years 0–5",
    stepId: "capacity-expansion",
    tradeoff:
      "More physicians long term; teaching hospitals gain influence over workforce composition.",
  },
  {
    id: "insurer-reserves",
    area: "Private sector",
    item: "Insurer statutory reserves and guaranty associations",
    today:
      "States require insurers to hold reserves; guaranty funds protect policyholders if insurers fail.",
    change:
      "Reserves are released only after run-off claims are certified paid; guaranty associations backstop any failure during wind-down.",
    disposition: "amended",
    when: "Years 1–5",
    stepId: "insurer-runoff",
    tradeoff: "Protects pending claims; delays shareholders' access to released capital.",
  },
  {
    id: "provider-contracts",
    area: "Private sector",
    item: "Provider–insurer contracts and value-based agreements",
    today: "Each provider holds dozens of payer contracts with different rates and rules.",
    change: "Terminated by statute at each wave; one UHP participation agreement replaces them.",
    disposition: "replaced",
    when: "By wave",
    stepId: "provider-enrollment",
    tradeoff: "Ends contracting overhead; ends negotiated deals some providers valued.",
  },
  {
    id: "uncompensated",
    area: "Provider payment & regulation",
    item: "Hospital uncompensated care and charity care policies",
    today:
      "Hospitals provide tens of billions of dollars a year in charity care and absorb bad debt.",
    change:
      "Charity care and bad debt for covered services disappear; hospital financial-assistance policies apply only to non-covered items.",
    disposition: "ends",
    when: "Year 4",
    stepId: "hospital-global-budgets",
    tradeoff:
      "Hospitals stop absorbing these losses; the community-benefit justification for tax exemption weakens.",
  },
]

export const CHANGES: SystemChange[] = [...CORE_CHANGES, ...MORE_CHANGES]

export const CHANGE_AREAS: ChangeArea[] = [
  "Federal programs",
  "Federal tax code",
  "Federal insurance & health law",
  "Provider payment & regulation",
  "Drugs & devices",
  "States & localities",
  "Private sector",
  "Patients",
  "Workforce & training",
  "Data & technology",
]
