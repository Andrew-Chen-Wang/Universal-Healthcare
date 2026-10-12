/**
 * Connects each implementation step to the design choices, trade-offs, risks,
 * and job impacts that belong to it, and records how other countries handled
 * the same piece of implementation.
 */
export type CountryComparison = {
  country: string
  approach: string
  result: string
  lesson: string
  sourceIds?: string[]
}

export type StepExtras = {
  decisionIds?: string[]
  tradeoffIds?: string[]
  riskIds?: string[]
  jobGroupIds?: string[]
  international: CountryComparison[]
}

export const STEP_EXTRAS: Record<string, StepExtras> = {
  "draft-legislation": {
    decisionIds: ["payer-structure", "transition-speed"],
    international: [
      {
        country: "Taiwan",
        approach:
          "National Health Insurance Act passed July 1994; program launched March 1995, merging 13 existing insurance schemes.",
        result: "Coverage went from about 57% to over 90% within a year.",
        lesson: "A single statute can move a whole country quickly if administration is ready.",
        sourceIds: ["taiwan-nhi"],
      },
      {
        country: "Canada",
        approach:
          "Federal Medical Care Act (1966) offered 50/50 cost sharing to provinces meeting five criteria; provinces wrote their own laws (1968–72).",
        result:
          "All provinces joined within 6 years; Canada Health Act (1984) consolidated the criteria.",
        lesson:
          "A federal framework with conditions lets subnational governments build their own systems.",
      },
      {
        country: "Germany",
        approach:
          "Incremental: Bismarck's 1883 law covered some workers; coverage expanded over a century, with a universal mandate in 2009.",
        result: "Universal, but it took 126 years.",
        lesson: "Incrementalism is durable but slow.",
      },
      {
        country: "United States (Vermont)",
        approach: "Act 48 (2011) created a path to state single payer (Green Mountain Care).",
        result:
          "Abandoned in 2014 when the governor concluded the required 11.5% payroll and up to 9.5% income taxes were unaffordable for one state.",
        lesson:
          "Financing must be settled in the law itself; a single state lacks federal Medicare and ERISA flexibility.",
      },
    ],
  },
  "independent-scoring": {
    international: [
      {
        country: "United Kingdom",
        approach:
          "The Office for Budget Responsibility publishes independent long-term NHS spending projections.",
        result: "Independent projections anchor debates about NHS funding levels.",
        lesson: "Independent scorekeepers make trade-offs explicit.",
      },
      {
        country: "Canada",
        approach:
          "The Parliamentary Budget Officer costs federal health transfers and pharmacare proposals.",
        result: "PBO pharmacare estimates shaped the scope of the 2024 Pharmacare Act.",
        lesson: "Credible costing narrows the scope of plans to what can be funded.",
      },
    ],
  },
  "legislative-path": {
    riskIds: ["filibuster", "repeal"],
    international: [
      {
        country: "United Kingdom",
        approach:
          "The National Health Service Act 1946 passed with a large parliamentary majority, with no supermajority requirement.",
        result: "Launched in 1948 despite doctors' initial opposition.",
        lesson:
          "Parliamentary systems can enact sweeping reform with simple majorities; the U.S. Senate is the binding constraint.",
      },
      {
        country: "Switzerland",
        approach: "LAMal health insurance law approved by national referendum in 1994.",
        result: "Popular vote gave durable legitimacy.",
        lesson: "Durability comes from broad buy-in, not just passage.",
      },
    ],
  },
  "stakeholder-deals": {
    international: [
      {
        country: "United Kingdom",
        approach:
          "Aneurin Bevan let consultants keep private practice and pay beds in NHS hospitals: 'stuffed their mouths with gold'.",
        result: "Won specialists' acceptance, but private practice inside the NHS persists.",
        lesson: "Concessions to physicians buy passage and create long-term two-tier pockets.",
      },
      {
        country: "Canada (Saskatchewan)",
        approach:
          "Doctors struck for 23 days in 1962 against provincial medicare; settled by the Saskatoon Agreement preserving fee-for-service and opt-out rights.",
        result: "Medicare survived and spread nationwide.",
        lesson:
          "Physician resistance is likely; preserving clinical autonomy and fee-for-service can resolve it.",
      },
    ],
  },
  "state-moe-design": {
    riskIds: ["state-holdouts"],
    international: [
      {
        country: "Canada",
        approach:
          "Federal Canada Health Transfer conditional on provinces meeting Canada Health Act criteria; the federal share fell from 50% to about 22–25%.",
        result: "Recurring federal–provincial fights over funding.",
        lesson:
          "Intergovernmental funding formulas need automatic indexing or they become annual battles.",
      },
      {
        country: "Spain",
        approach:
          "Health care devolved to 17 autonomous communities, funded by general tax transfers (completed 2002).",
        result: "Universal coverage with regional variation in waits and benefits.",
        lesson: "Devolution allows local control at the cost of uniformity.",
      },
    ],
  },
  "create-uha": {
    decisionIds: ["administration"],
    riskIds: ["capture"],
    tradeoffIds: ["government-risk"],
    jobGroupIds: [],
    international: [
      {
        country: "Taiwan",
        approach:
          "One national agency (NHIA) runs all claims, with about 2,800 staff at launch for 21 million people.",
        result: "Administrative costs under 2% of spending.",
        lesson: "A single national agency can be lean.",
        sourceIds: ["taiwan-nhi"],
      },
      {
        country: "England",
        approach:
          "NHS England (arm's-length body) plus commissioning boards; repeated reorganizations (2002, 2013, 2022, and NHS England's 2025 abolition).",
        result: "Reorganization costs and distraction.",
        lesson: "Pick a durable structure and avoid serial reorganizations.",
      },
      {
        country: "Canada",
        approach: "Thirteen provincial and territorial ministries administer plans.",
        result: "Low administrative cost, uneven performance across provinces.",
        lesson: "Regional administration enables experimentation but creates unequal access.",
      },
    ],
  },
  "trust-fund": {
    riskIds: ["recession"],
    tradeoffIds: ["government-risk"],
    international: [
      {
        country: "Germany",
        approach:
          "Central Health Fund (Gesundheitsfonds) pools payroll contributions and federal subsidies, then distributes risk-adjusted payments to sickness funds; it holds a liquidity reserve.",
        result: "Stable financing; reserve absorbs shocks.",
        lesson: "A pooled fund with a reserve smooths recessions.",
      },
      {
        country: "France",
        approach:
          "Social security health branch financed by payroll and the earmarked CSG income tax.",
        result: "Persistent deficits financed through a dedicated debt agency (CADES).",
        lesson: "Dedicated revenue doesn't prevent deficits without spending controls.",
      },
    ],
  },
  "build-claims-system": {
    riskIds: ["it-failure"],
    international: [
      {
        country: "Taiwan",
        approach:
          "Built claims processing within a year; introduced a national smart card (2004) and a cloud medication record (2013).",
        result: "Near real-time claims and drug-interaction checks.",
        lesson:
          "One payer allows national data infrastructure that fragmented systems can't build.",
        sourceIds: ["taiwan-nhi"],
      },
      {
        country: "United Kingdom",
        approach:
          "National Programme for IT (2002–2011) tried to build a national electronic record centrally.",
        result: "Spent about £10B and was largely abandoned.",
        lesson: "Big-bang central IT fails; extend proven systems incrementally.",
      },
      {
        country: "Estonia",
        approach:
          "Nationwide health information exchange built on the X-Road data layer and national digital ID.",
        result: "Near-universal e-prescriptions and record sharing.",
        lesson: "Interoperable standards beat one monolithic system.",
      },
    ],
  },
  "auto-enrollment": {
    decisionIds: ["eligibility", "veterans-military"],
    international: [
      {
        country: "Canada",
        approach:
          "Residents apply for a provincial health card; most provinces impose up to a 3-month waiting period for new residents.",
        result: "Gaps for newcomers and people moving between provinces.",
        lesson: "Waiting periods create gaps; the plan uses 90 days with emergency coverage.",
      },
      {
        country: "Taiwan",
        approach:
          "Enrollment is mandatory, tied to household registration; foreign residents join after 6 months.",
        result: "99%+ coverage.",
        lesson: "Automatic enrollment through existing registries gives near-universal coverage.",
      },
      {
        country: "Spain",
        approach: "Restricted coverage for undocumented immigrants in 2012, restored it in 2018.",
        result:
          "Studies linked the 2012 restriction to more ER use and worse outcomes among those excluded.",
        lesson: "Excluding residents shifts costs to emergency care.",
      },
    ],
  },
  "define-benefits": {
    decisionIds: ["benefits", "cost-sharing", "contested-services"],
    tradeoffIds: ["financial-security"],
    international: [
      {
        country: "Canada",
        approach:
          "Covers medically necessary physician and hospital care at no charge; drugs, dental, vision mostly outside the public plan.",
        result: "About 1 in 5 Canadians report cost barriers to prescriptions or dental care.",
        lesson:
          "Narrow benefits leave big out-of-pocket gaps; the plan includes drugs, dental, vision, and hearing.",
        sourceIds: ["cihi-nhex"],
      },
      {
        country: "Japan",
        approach:
          "Uniform benefits with 30% coinsurance (10–20% for children and elderly) and monthly income-based caps.",
        result:
          "High use and low spending, driven by strict price control rather than cost sharing.",
        lesson: "Cost sharing with caps restrains some use without catastrophic exposure.",
      },
      {
        country: "Sweden",
        approach:
          "Small fees per visit with an annual cap (about SEK 1,450) and a separate drug cap.",
        result: "Low financial barriers with some price signal.",
        lesson: "Capped fees are a middle path the plan keeps on standby.",
      },
      {
        country: "France",
        approach:
          "Coinsurance (ticket modérateur) covered by near-universal complementary insurance; full coverage for 30 long-term conditions (ALD).",
        result: "Low out-of-pocket but two layers of insurance.",
        lesson: "Cost sharing paired with private top-up adds administration without much saving.",
      },
    ],
  },
  "provider-enrollment": {
    riskIds: ["physician-exit", "two-tier"],
    tradeoffIds: ["choice"],
    international: [
      {
        country: "Canada",
        approach:
          "Physicians may opt out but cannot bill the public plan while opted out; private insurance for insured services is banned or restricted in most provinces.",
        result:
          "Very few physicians opt out (well under 1%) because there is little private market.",
        lesson: "Banning duplicative insurance keeps physicians in the public system.",
      },
      {
        country: "France",
        approach:
          "Sector 2 physicians may charge above the national fee (dépassements d'honoraires).",
        result:
          "Access gaps for lower-income patients in specialties and regions where most doctors are Sector 2.",
        lesson: "Allowing balance billing creates income-based access tiers; the plan bans it.",
      },
      {
        country: "Australia",
        approach: "Doctors choose per patient whether to bulk-bill (no charge) or charge a gap.",
        result:
          "Out-of-pocket gap fees have risen; bulk-billing rates fell before 2023–24 incentives.",
        lesson: "Per-patient choice to charge extra erodes universality over time.",
      },
    ],
  },
  "fee-schedule": {
    decisionIds: ["provider-payment", "rate-level"],
    tradeoffIds: ["provider-income", "equity"],
    riskIds: ["physician-exit"],
    international: [
      {
        country: "Japan",
        approach:
          "One national fee schedule for every payer, revised every 2 years by the Central Social Insurance Medical Council.",
        result:
          "Strict price control and very high volume; spending about 11% of GDP despite the oldest population.",
        lesson:
          "One price list is the most powerful cost-control tool, more than the number of payers.",
      },
      {
        country: "Germany",
        approach:
          "Collective negotiation of the EBM fee schedule between physician associations and sickness funds; regional budgets with point values.",
        result: "Short waits; private patients pay higher GOÄ fees and get priority.",
        lesson: "Uniform public fees with a higher private schedule recreates two tiers.",
      },
      {
        country: "Canada",
        approach: "Provincial fee schedules negotiated with medical associations.",
        result:
          "Physician incomes comparable to U.S. primary care; specialists earn less than U.S. peers.",
        lesson: "Negotiated schedules compress specialist-to-primary-care income ratios.",
      },
    ],
  },
  "hospital-global-budgets": {
    decisionIds: ["provider-payment", "rate-level"],
    tradeoffIds: ["provider-income"],
    riskIds: ["hospital-closures"],
    international: [
      {
        country: "Canada",
        approach:
          "Hospitals funded through annual global budgets; Ontario and B.C. added activity-based funding for some procedures to cut waits.",
        result:
          "Low spending growth; long surgical waits as hospitals limit OR time to stay within budget.",
        lesson: "Global budgets need volume adjustments; the plan uses ±3% corridors.",
        sourceIds: ["fraser-2025"],
      },
      {
        country: "Germany",
        approach: "DRG per-case payment (G-DRG) since 2003 with volume discounts.",
        result: "Short waits but among the highest hospital admission rates in the OECD.",
        lesson: "Per-case payment boosts volume, both needed and unneeded.",
      },
      {
        country: "Taiwan",
        approach:
          "Sector global budgets with floating point values: fees fall if volume exceeds budget.",
        result: "Hard spending cap; hospitals and staff report burnout.",
        lesson: "Floating point values control cost but squeeze providers.",
      },
      {
        country: "United States (Maryland)",
        approach: "All-payer hospital global budgets since 2014.",
        result:
          "Hospital spending growth held below the national trend; hospitals remained solvent.",
        lesson: "Global budgets can work in the U.S. setting.",
        sourceIds: ["maryland-model"],
      },
    ],
  },
  "national-formulary": {
    decisionIds: ["drug-pricing"],
    tradeoffIds: ["innovation-drugs"],
    riskIds: ["innovation-loss"],
    international: [
      {
        country: "United Kingdom",
        approach:
          "NICE appraises drugs on cost per QALY (threshold raised in 2025 from £20–30k); the NHS must fund approved drugs.",
        result: "Lower prices; some drugs rejected or delayed.",
        lesson: "Explicit value thresholds are transparent and politically contentious.",
      },
      {
        country: "Germany",
        approach:
          "AMNOG (2011): free price for 6 months, then a negotiated price based on added benefit.",
        result: "Fast launches, lower prices for drugs without added benefit.",
        lesson: "Provisional pricing with later assessment protects access speed.",
      },
      {
        country: "New Zealand",
        approach: "PHARMAC buys drugs for the whole country through tenders and a fixed budget.",
        result: "Very low drug prices; fewer new drugs funded than in Australia or Europe.",
        lesson: "Hard budgets save money at the cost of access to new drugs.",
      },
      {
        country: "Canada",
        approach:
          "PMPRB ceiling prices plus pan-Canadian joint negotiation (pCPA); national pharmacare began in 2024–25 with contraceptives and diabetes drugs.",
        result: "Prices well below U.S. levels; launches sometimes later.",
        lesson: "Joint negotiation leverages buying power.",
      },
    ],
  },
  "hta-institute": {
    international: [
      {
        country: "United Kingdom",
        approach: "NICE (1999) issues technology appraisals and clinical guidelines.",
        result: "Global model for HTA; criticized over QALY thresholds.",
        lesson: "An independent body depoliticizes coverage decisions, partly.",
      },
      {
        country: "Germany",
        approach: "IQWiG assesses benefit; G-BA decides coverage.",
        result: "Separates evidence assessment from the decision.",
        lesson: "Separating assessment from appraisal improves legitimacy.",
      },
      {
        country: "Australia",
        approach: "PBAC and MSAC advise on drug and service listing with cost-effectiveness.",
        result: "Strong value discipline.",
        lesson: "HTA works for services as well as drugs.",
      },
    ],
  },
  "erisa-and-insurance-law": {
    decisionIds: ["duplicative-insurance"],
    tradeoffIds: ["choice"],
    riskIds: ["two-tier"],
    international: [
      {
        country: "Canada",
        approach:
          "Provinces ban or restrict private insurance for publicly insured services. Quebec's ban was struck down in Chaoulli (2005) because waits were unreasonable; Quebec allowed private insurance for a few procedures.",
        result:
          "Single tier for covered services; ongoing legal challenges (Cambie, B.C., 2020–24, upheld the ban).",
        lesson:
          "A ban survives court only if public waits are reasonable, hence the wait guarantee.",
      },
      {
        country: "Australia",
        approach:
          "Private duplicative insurance encouraged by the Medicare Levy Surcharge and rebates; about 45% hold private hospital cover.",
        result: "Private patients avoid public queues; public elective waits remain long.",
        lesson: "Private insurance shortens waits for those who buy it, not for everyone.",
      },
      {
        country: "Ireland",
        approach: "About half the population buys private insurance to skip public waiting lists.",
        result:
          "Among the longest public waits in Europe; Sláintecare reform aims to remove private care from public hospitals.",
        lesson: "A large private tier inside public hospitals worsens public waits.",
      },
    ],
  },
  "tax-legislation": {
    decisionIds: ["financing"],
    tradeoffIds: ["taxes"],
    riskIds: ["cost-overrun"],
    international: [
      {
        country: "Germany",
        approach:
          "Payroll contribution of 14.6% plus an average supplementary rate (about 2.9% in 2026), split employer/employee, up to an income ceiling.",
        result:
          "Transparent, dedicated financing; contribution ceiling makes it regressive at the top.",
        lesson: "Payroll financing works but needs a broad base; the plan has no ceiling.",
      },
      {
        country: "France",
        approach:
          "Shifted from payroll toward the CSG, an earmarked tax on almost all income including capital.",
        result: "Broader base, less reliance on wages.",
        lesson:
          "Taxing all income, not just wages, spreads the burden; the plan's household premium follows this.",
      },
      {
        country: "Taiwan",
        approach:
          "Payroll premium split employer/employee/government plus a supplementary 2.11% premium on bonuses, dividends, interest, and rent (2013).",
        result: "Broadened the base to non-wage income.",
        lesson: "Supplementary premiums on capital income improve fairness.",
      },
      {
        country: "Canada / UK",
        approach: "General taxation (income, sales, VAT), not earmarked premiums.",
        result: "Health competes with other spending each budget.",
        lesson: "General-tax financing is efficient but exposes health budgets to annual politics.",
      },
    ],
  },
  "worker-transition": {
    tradeoffIds: ["jobs"],
    jobGroupIds: [
      "insurers",
      "tpa",
      "brokers",
      "pbm",
      "providerBilling",
      "employerBenefits",
      "medicaidEligibility",
      "navigators",
      "rcm",
    ],
    international: [
      {
        country: "Taiwan",
        approach:
          "Merged existing public insurance bureaus into the NHI Administration in 1995, transferring staff.",
        result: "Little job loss because predecessors were public agencies.",
        lesson:
          "The U.S. differs: displaced workers are in private companies, so a transition program is needed.",
      },
      {
        country: "Denmark",
        approach:
          "'Flexicurity': generous unemployment benefits (up to 90% of wages) with active retraining.",
        result: "Rapid reemployment after structural shocks.",
        lesson:
          "High replacement rates plus retraining reduce lasting harm; the plan's program mirrors this.",
      },
    ],
  },
  "legal-defense": {
    riskIds: ["takings-litigation"],
    international: [
      {
        country: "Canada",
        approach:
          "Chaoulli v. Quebec (2005) and Cambie Surgeries v. B.C. (decided 2020, appeal dismissed 2022, leave to Supreme Court denied 2024) tested the private-insurance ban.",
        result: "Bans survive when waits are reasonable.",
        lesson:
          "Litigation will target the private-insurance ban; evidence on waits is the defense.",
      },
      {
        country: "Netherlands / Germany",
        approach: "Insurers challenged risk-equalization schemes under EU competition law.",
        result: "Courts upheld social insurance as non-economic activity.",
        lesson: "Social insurance designs can be defended against market-based legal challenges.",
      },
    ],
  },
  "data-privacy": {
    international: [
      {
        country: "Denmark / Sweden",
        approach: "National registries linked by personal ID numbers; strict research governance.",
        result: "World-class population research.",
        lesson: "Linked data is valuable when governance is trusted.",
      },
      {
        country: "United Kingdom",
        approach:
          "care.data (2014) and the GP data extraction plan (2021) were paused after public backlash over consent.",
        result: "Millions opted out.",
        lesson: "Transparency and opt-outs for secondary data use are essential.",
      },
    ],
  },
  "medicare-upgrade": {
    decisionIds: ["managed-care"],
    tradeoffIds: ["private-insurance-efficiency"],
    international: [
      {
        country: "Taiwan",
        approach: "Merged labor, government-employee, and farmer insurance on launch day.",
        result: "No coverage gaps for existing enrollees.",
        lesson: "Existing public enrollees can be converted overnight.",
      },
      {
        country: "Netherlands",
        approach:
          "Merged public sickness funds and private insurance into one mandatory scheme in 2006.",
        result: "One market; insurers kept but heavily regulated.",
        lesson: "Merging tiers is possible in one step with a fixed switchover date.",
      },
    ],
  },
  "wave-one-enrollment": {
    tradeoffIds: ["equity"],
    international: [
      {
        country: "South Korea",
        approach:
          "Extended coverage in steps: large firms (1977), smaller firms and civil servants (1979), rural self-employed (1988), urban self-employed (1989).",
        result: "Universal in 12 years; merged into a single insurer in 2000.",
        lesson:
          "Phasing by group works; finishing with consolidation captures single-payer efficiencies.",
      },
      {
        country: "Japan",
        approach:
          "Extended employment-based coverage to everyone through community-based insurance in 1961.",
        result: "Universal coverage with many insurers.",
        lesson: "Universality can come by filling gaps around existing coverage.",
      },
    ],
  },
  "employer-coordination": {
    international: [
      {
        country: "Netherlands",
        approach:
          "Employers pay an income-related contribution, and employees pay flat premiums directly to insurers.",
        result: "Employers out of plan selection; coverage portable.",
        lesson: "Employers can fund coverage without choosing it.",
      },
      {
        country: "Germany",
        approach:
          "Employers withhold and pay half the contribution but have no role in choosing the fund.",
        result: "Coverage portable across jobs.",
        lesson: "Separating employer financing from plan choice ends job lock.",
      },
    ],
  },
  "hospital-transition-fund": {
    riskIds: ["hospital-closures"],
    international: [
      {
        country: "Germany",
        approach:
          "Hospital Structure Fund (2016+) pays to close or convert excess hospital capacity; 2024 hospital reform adds transition funding.",
        result: "Gradual consolidation of an over-bedded system.",
        lesson: "Transition money works best when tied to restructuring.",
      },
      {
        country: "Taiwan",
        approach:
          "No dedicated fund; hospitals adapted to global budgets through volume and cost cutting.",
        result: "Smaller hospitals consolidated; staffing strain.",
        lesson: "Without transition support, adjustment falls on staff.",
      },
    ],
  },
  "wait-time-guarantee": {
    tradeoffIds: ["wait-times-esi", "access-medicaid-uninsured"],
    riskIds: ["waits-backlash"],
    international: [
      {
        country: "Denmark",
        approach:
          "30-day treatment guarantee (diagnosis and treatment); after that, patients may use private hospitals at public expense.",
        result: "Waits fell substantially after introduction.",
        lesson: "A guarantee with a funded exit option disciplines the system.",
      },
      {
        country: "Sweden",
        approach:
          "'0-7-90-90' guarantee: same-day contact, GP within 3 days (revised), specialist within 90 days, treatment within 90 days.",
        result: "Guarantees are often missed in some regions.",
        lesson: "Guarantees without automatic consequences become aspirations.",
      },
      {
        country: "England",
        approach: "18-week referral-to-treatment standard with a 92% target.",
        result: "Met only about 59% of the time in 2025.",
        lesson: "Targets without capacity investment and enforcement fail.",
        sourceIds: ["nhs-rtt"],
      },
      {
        country: "Canada",
        approach:
          "2004 Health Accord set benchmarks for five procedures (hips, knees, cataracts, cancer radiation, cardiac).",
        result: `Benchmarks met for some procedures; median overall wait ${show("canadaMedianWeeks")} weeks in 2025.`,
        lesson: "Benchmarks for a few procedures shift capacity away from others.",
        sourceIds: ["fraser-2025"],
      },
    ],
  },
  "capacity-expansion": {
    tradeoffIds: ["wait-times-esi"],
    riskIds: ["waits-backlash"],
    international: [
      {
        country: "Canada",
        approach: "Cut medical-school enrollment by about 10% in the 1990s to contain costs.",
        result: "Contributed to later physician shortages and long waits.",
        lesson: "Cutting training to save money produces queues a decade later.",
        sourceIds: ["fraser-2025"],
      },
      {
        country: "United Kingdom",
        approach: "NHS Long Term Workforce Plan (2023) to double medical-school places by 2031.",
        result: "Expansion after years of shortages; results years away.",
        lesson: "Training must be expanded before demand rises.",
      },
      {
        country: "Japan",
        approach: "Highest number of hospital beds and MRI/CT units per capita in the OECD.",
        result: "Very short waits, but long stays and overuse.",
        lesson: "Abundant capacity eliminates waits at some cost in efficiency.",
      },
      {
        country: "Australia",
        approach:
          "Nurse practitioners and pharmacists given expanded prescribing; rural generalist pathway.",
        result: "Expanded rural access.",
        lesson: "Scope-of-practice expansion is the fastest capacity lever.",
      },
    ],
  },
  "new-benefits-launch": {
    international: [
      {
        country: "United Kingdom",
        approach:
          "NHS dentistry uses a contract that pays dentists per 'unit of dental activity', underfunded relative to costs.",
        result: "Many dentists stopped accepting NHS patients; 'dental deserts'.",
        lesson:
          "Covering a benefit but underpaying for it produces nominal coverage without access.",
      },
      {
        country: "Canada",
        approach:
          "Canadian Dental Care Plan launched in 2024 for uninsured people under $90,000 household income.",
        result: "Rapid enrollment; provider participation grew after billing was simplified.",
        lesson: "Simple billing and adequate fees drive dentist participation.",
      },
      {
        country: "Germany",
        approach: "Statutory insurance covers basic dental with fixed subsidies for prosthetics.",
        result: "Broad access; patients pay more for premium options.",
        lesson: "Fixed subsidies for basic care plus private upgrades works for dental.",
      },
    ],
  },
  "waves-two-three-enrollment": {
    international: [
      {
        country: "South Korea",
        approach:
          "Covered the urban self-employed last (1989), the hardest group to assess for contributions.",
        result:
          "Universal, but contribution assessment for the self-employed remained contentious.",
        lesson: "The last groups to enroll are often the hardest to tax fairly.",
      },
    ],
  },
  "ltss-entitlement": {
    international: [
      {
        country: "Germany",
        approach:
          "Long-term care insurance (Pflegeversicherung, 1995): payroll contribution, benefits by care level, choice of cash or in-kind.",
        result:
          "Universal LTC; cash option supports family caregivers; contribution rates have risen.",
        lesson: "Paying family caregivers is popular; costs rise with aging.",
      },
      {
        country: "Japan",
        approach:
          "Kaigo Hoken (2000): mandatory LTC insurance from age 40; services by assessed need level.",
        result: "Rapid growth in home services; repeated benefit and copay adjustments.",
        lesson: "Demand grows faster than expected (woodwork effect).",
      },
      {
        country: "Canada",
        approach:
          "Provinces fund nursing homes with income-tested co-payments for room and board; home care varies.",
        result: "Long waits for LTC beds in some provinces.",
        lesson: "Room-and-board contributions keep LTC from becoming a housing program.",
      },
    ],
  },
  "insurer-runoff": {
    tradeoffIds: ["private-insurance-efficiency"],
    jobGroupIds: ["insurers", "tpa", "brokers", "pbm"],
    international: [
      {
        country: "Canada",
        approach:
          "Provincial medicare (1960s–70s) displaced private medical insurers for physician and hospital care; insurers shifted to supplementary drug, dental, and vision coverage.",
        result: "A large supplementary market survives (about 2/3 of Canadians have it).",
        lesson: "Insurers adapt by selling what the public plan doesn't cover.",
      },
      {
        country: "United Kingdom (1948)",
        approach:
          "Approved societies and friendly societies lost their role in national health insurance.",
        result: "Absorbed without compensation for lost business.",
        lesson: "Losing a line of business to a public program isn't compensated.",
      },
    ],
  },
  "rate-convergence": {
    international: [
      {
        country: "Germany",
        approach:
          "DRG introduction phased in hospital base rates over 2003–2009 (convergence phase).",
        result: "Gradual redistribution between hospitals.",
        lesson: "Multi-year convergence prevents hospital shocks.",
      },
    ],
  },
  "marketplace-closure": {
    international: [
      {
        country: "Netherlands",
        approach:
          "Abolished the split between public sickness funds and private insurance in a single 2006 switchover.",
        result: "One unified market.",
        lesson: "A fixed end date with automatic transition avoids coverage gaps.",
      },
    ],
  },
  "integrated-care-orgs": {
    decisionIds: ["managed-care"],
    international: [
      {
        country: "Spain (Valencia)",
        approach:
          "'Alzira model': private operators received capitated budgets for regional populations.",
        result: "Lower cost but controversy over profit; reverted to public management (2018+).",
        lesson: "Capitation for private operators needs strict oversight.",
      },
      {
        country: "Germany",
        approach: "Gesundes Kinzigtal integrated care contract with shared savings.",
        result: "Reported savings and better outcomes for enrolled population.",
        lesson: "Provider-led integration with shared savings can work within a public system.",
      },
    ],
  },
  "final-wave": {
    international: [
      {
        country: "Taiwan",
        approach:
          "Final enrollment pushes targeted low-income and rural households with premium subsidies.",
        result: "Coverage above 99%.",
        lesson: "Targeted outreach closes the last gaps.",
      },
    ],
  },
  "end-esi": {
    tradeoffIds: ["wait-times-esi", "labor-mobility"],
    jobGroupIds: ["employerBenefits"],
    international: [
      {
        country: "Germany",
        approach: "High earners may opt out of statutory insurance into private insurance (PKV).",
        result: "About 11% privately insured; faster specialist access for them.",
        lesson: "Letting higher earners exit recreates the tier the plan ends.",
        sourceIds: ["germany-gkv"],
      },
      {
        country: "Canada / UK",
        approach:
          "Employers offer only supplementary benefits (drugs, dental, private rooms, faster private access in the UK).",
        result: "Employers still compete on benefits, but not on core coverage.",
        lesson: "Employer benefits shrink to supplements; recruitment competition moves to wages.",
      },
    ],
  },
  "wind-down-medicaid": {
    tradeoffIds: ["access-medicaid-uninsured"],
    jobGroupIds: ["medicaidEligibility", "navigators"],
    international: [
      {
        country: "South Korea",
        approach:
          "Merged 300+ insurance societies into one National Health Insurance Service in 2000.",
        result: "Administrative savings; unified benefits.",
        lesson: "Consolidating many payers into one is feasible.",
      },
    ],
  },
  "coordinate-other-payers": {
    international: [
      {
        country: "New Zealand",
        approach:
          "ACC no-fault scheme covers all injuries regardless of cause, replacing personal-injury lawsuits.",
        result: "Simple injury compensation; workers' comp and auto merged.",
        lesson:
          "Folding injury systems together is possible, but loses some employer safety incentives.",
      },
      {
        country: "Canada",
        approach:
          "Provincial plans recover costs from workers' compensation boards for work injuries.",
        result: "Patients get care first, payers settle later.",
        lesson: "Pay first, recover later.",
      },
    ],
  },
  "full-tax-rates": {
    riskIds: ["recession"],
    international: [
      {
        country: "Germany",
        approach:
          "Sickness funds set supplementary contribution rates annually to balance budgets.",
        result: "Rates adjust automatically with costs.",
        lesson: "Automatic rate adjustment keeps funds balanced but makes increases visible.",
      },
    ],
  },
  "spending-target": {
    riskIds: ["cost-overrun"],
    international: [
      {
        country: "Japan",
        approach: "Biennial fee revisions set total price changes in line with fiscal targets.",
        result: "Among the slowest spending growth in the OECD for decades.",
        lesson: "Controlling prices centrally controls growth.",
      },
      {
        country: "Germany",
        approach:
          "Statutory principle of contribution-rate stability ties spending growth to wage-base growth.",
        result: "Moderate growth with periodic reforms.",
        lesson: "Tying growth to revenue growth needs periodic legislated reforms to hold.",
      },
      {
        country: "United Kingdom",
        approach: "Spending set in multi-year budget settlements.",
        result: "Below-trend growth in the 2010s produced long waits.",
        lesson: "A target that's too tight shows up as queues.",
      },
    ],
  },
  "program-integrity": {
    riskIds: ["fraud"],
    international: [
      {
        country: "Taiwan",
        approach:
          "Real-time claims analytics and the smart card flag duplicate prescriptions and suspicious billing.",
        result: "Low fraud rates relative to spending.",
        lesson: "Centralized data enables real-time fraud prevention.",
      },
      {
        country: "Germany",
        approach: "Sickness funds and physician associations run plausibility checks on billing.",
        result: "Fraud persists but is policed by peers and payers.",
        lesson: "Professional self-regulation complements payer audits.",
      },
    ],
  },
  "evaluation-review": {
    tradeoffIds: ["quality"],
    international: [
      {
        country: "Canada",
        approach: "CIHI publishes standardized national health system indicators.",
        result: "Transparent comparisons across provinces.",
        lesson: "Independent statistics agencies keep debates evidence-based.",
      },
      {
        country: "Netherlands",
        approach: "Mandated evaluations of the 2006 reform.",
        result: "Adjustments to risk equalization and deductibles.",
        lesson: "Built-in evaluation leads to course corrections.",
      },
    ],
  },
  "malpractice-pilot": {
    international: [
      {
        country: "New Zealand",
        approach:
          "ACC covers treatment injuries on a no-fault basis; lawsuits for compensation are barred.",
        result: "Faster compensation; lower individual awards.",
        lesson: "No-fault trades large awards for broad, fast compensation.",
      },
      {
        country: "Sweden / Denmark",
        approach: "Patient insurance compensates avoidable injuries without proving negligence.",
        result: "Higher share of injured patients compensated.",
        lesson: "Administrative compensation can work alongside safety reporting.",
      },
    ],
  },
  "ongoing-capacity-planning": {
    international: [
      {
        country: "Germany",
        approach:
          "States (Länder) draw up hospital plans; capital funded by states, operations by sickness funds (dual financing).",
        result: "States underfund capital; hospitals divert operating funds.",
        lesson: "Capital budgets must be reliably funded.",
      },
      {
        country: "Canada",
        approach: "Provinces approve and fund capital projects.",
        result: "Fewer MRI and CT units per capita than the OECD average.",
        lesson: "Central capital planning tends toward under-investment.",
      },
    ],
  },
}
import { show } from "./constants"
