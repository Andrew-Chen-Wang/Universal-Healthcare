import type { Decision } from "./types"
import { F } from "./figures"
import { show } from "./constants"

/**
 * The structural choices that define the plan. Each records what was chosen,
 * every serious alternative with its own pros and cons, and what the choice
 * gives up.
 */
export const DECISIONS: Decision[] = [
  {
    id: "payer-structure",
    title: "One public payer",
    question:
      "Who pays the bills: one public program, many regulated insurers, or a public option alongside private plans?",
    choice:
      "A single public payer, the Universal Health Program (UHP), pays for all covered services for every resident. Private insurers may sell only supplementary coverage for services UHP does not cover.",
    rationale:
      "The ground rules accept insurer shutdowns and job losses, which removes the main argument against single payer. One payer is the only design that captures the full administrative savings (one claim format, one set of rules, no network contracting, no prior-authorization maze) and gives one buyer enough leverage to set prices. Multi-payer systems like Germany's and the Netherlands' reach universality too, but they keep most of the U.S.-style administrative cost and still require heavy price regulation.",
    alternatives: [
      {
        name: "Single payer (chosen)",
        description:
          "One public insurer, as in Canada's provinces, Taiwan, and traditional Medicare.",
        pros: [
          {
            point: "Largest administrative savings",
            detail: `In the central estimate, insurer overhead falls from ${F.netCostBefore} to ${F.netCostAfter}, offset by ${F.uhpAdmin} of UHP administration.`,
          },
          {
            point: "One price list for every patient",
            detail:
              "Providers no longer prefer patients by insurance type. This is the biggest equity gain for today's Medicaid enrollees.",
          },
          { point: "Monopsony bargaining power over drugs, devices, and hospital prices" },
          {
            point: "No networks",
            detail: "Every participating provider is in network for every patient.",
          },
        ],
        cons: [
          {
            point: "Every private insurer's core business ends",
            detail: `About ${F.insurerJobs} insurer jobs are displaced and roughly ${F.insurerProfit} a year of profit disappears.`,
          },
          {
            point: "A single point of failure",
            detail:
              "Political underfunding, IT failure, or bad rate-setting hits everyone at once, with no competitor to switch to.",
          },
          {
            point:
              "No competition on service quality, customer service, or care-management innovation between plans",
          },
          { point: "The largest disruption for the ~179M people with job-based coverage" },
        ],
        precedent:
          "Canada (provincial single payer, 1966–71), Taiwan (1995), South Korea (merged funds in 2000), traditional Medicare.",
      },
      {
        name: "Regulated multi-payer (Germany/Netherlands/Switzerland)",
        description:
          "Everyone must buy coverage from competing nonprofit or tightly regulated insurers, with a standard benefit package, community rating, risk adjustment, and income-based subsidies.",
        pros: [
          { point: "Preserves insurer jobs and consumer choice of plan" },
          {
            point: "Less disruptive to employers",
            detail: "Germany splits contributions between employer and worker through payroll.",
          },
          { point: "Competition can drive service and care-management improvements" },
        ],
        cons: [
          {
            point: "Keeps much of the administrative cost",
            detail:
              "Germany's and Switzerland's insurer administration runs about 4–5% of spending, versus about 2% in single-payer systems.",
          },
          {
            point:
              "Requires either all-payer rate setting (Germany, Japan) or accepting high prices (Switzerland is the second-most-expensive OECD system)",
          },
          { point: "Risk-selection games need constant regulatory policing" },
        ],
        precedent:
          "Germany (Bismarck, 1883; universal mandate 2009), Netherlands (2006 reform), Switzerland (1996 LAMal).",
      },
      {
        name: "Public option + auto-enrollment",
        description:
          "Keep private insurance, add a Medicare-like public plan anyone can buy, and auto-enroll the uninsured.",
        pros: [
          { point: "Least disruption and most politically feasible" },
          { point: "People who like their current plan keep it" },
        ],
        cons: [
          { point: "Administrative savings are small because the multi-payer complexity remains" },
          {
            point:
              "Providers keep preferring higher-paying commercial patients, so the access gap persists",
          },
          { point: "Risk of adverse selection into the public plan" },
          { point: "Gaps remain: deductibles, narrow networks, coverage churn" },
        ],
        precedent:
          "Washington State's Cascade Select (2021), Colorado Option (2023): modest enrollment and savings so far.",
      },
    ],
    givesUp: [
      "Plan choice: no one can pick a different insurer for covered services.",
      "Insurer-driven care-management innovation (e.g., Medicare Advantage supplemental benefits, disease-management programs).",
      "A competitive check on the public administrator's customer service.",
    ],
    sourceIds: ["cbo-single-payer-2019", "germany-gkv", "taiwan-nhi"],
  },
  {
    id: "duplicative-insurance",
    title: "Duplicative private insurance",
    question:
      "Can people buy private insurance that covers the same services UHP covers, to get faster or more private care?",
    choice:
      "Duplicative insurance is prohibited for the first 10 years. Supplementary insurance (dental cosmetic work, private rooms, premium eyewear, non-formulary drugs) is allowed. Physicians may opt out of UHP entirely and see patients for cash, but they cannot bill UHP for anyone during the opt-out period (two years, as Medicare requires today). A legally binding wait-time guarantee replaces the private safety valve. Congress must vote on whether to continue the ban in year 10, based on evaluation data.",
    rationale:
      "If insured people can buy their way to the front of a shared queue, providers shift time toward them, as happens in Germany (private patients get specialist appointments faster) and Australia. That recreates today's two-tier access with different labels. Canada's ban preserves equity but, combined with low capacity, produces long waits. The plan pairs the ban with a care guarantee: if UHP misses its maximum wait, it pays for care at any provider, including opted-out providers, at up to 150% of UHP rates.",
    alternatives: [
      {
        name: "Ban duplicative coverage + care guarantee (chosen)",
        description:
          "Single tier for covered services. UHP must meet maximum waits or pay for care elsewhere.",
        pros: [
          { point: "Keeps all physician capacity in the shared system" },
          {
            point:
              "Wealthy and politically influential patients share the same queue, which creates political pressure to keep it short",
          },
          {
            point: "The wait-time guarantee creates a financial incentive for UHP to fund capacity",
          },
        ],
        cons: [
          {
            point: "People with job-based coverage lose their price-based priority",
            detail: "Their elective specialist waits are likely to lengthen during the transition.",
          },
          {
            point: "Restricts a voluntary transaction",
            detail:
              "This is likely to be litigated (Chaoulli v. Quebec struck down a similar ban in 2005 because waits were unreasonable).",
          },
          {
            point: "Cash-only concierge practices will grow anyway",
            detail: "Physicians can opt out entirely.",
          },
        ],
        precedent:
          "Canada (Canada Health Act plus provincial bans); Denmark, Norway, and Sweden's treatment guarantees.",
      },
      {
        name: "Allow duplicative coverage (Australia/UK/Germany-style two tier)",
        description:
          "Anyone can buy private insurance for faster elective care at private hospitals.",
        pros: [
          {
            point:
              "A pressure valve: people who can pay don't wait, which shortens the public queue somewhat",
          },
          { point: "Keeps a large private insurance industry and its jobs" },
          { point: "Brings private capital into hospital capacity" },
        ],
        cons: [
          {
            point: "Two-tier access by income is formalized",
            detail:
              "In Germany, privately insured patients wait markedly less for specialist appointments.",
          },
          { point: "Physicians split time between tiers, and the public tier gets less" },
          {
            point: "Weakens middle- and upper-class political support for funding the public tier",
          },
        ],
        precedent:
          "Australia (about 45% hold private hospital cover, encouraged by the Medicare Levy Surcharge); UK (about 13% hold private medical insurance); Germany (about 11% in substitutive PKV).",
      },
      {
        name: "Allow it after a capacity threshold",
        description:
          "Ban during the transition; allow it automatically once median waits meet targets for two years.",
        pros: [{ point: "Ties the pressure valve to evidence" }],
        cons: [
          { point: "The threshold becomes a political football" },
          { point: "Creates an incentive for the private sector to lobby against meeting targets" },
        ],
      },
    ],
    givesUp: [
      "The ability of people with means to buy faster elective care for covered services inside the U.S. without leaving the system.",
      "Private insurers' supplemental-market revenue for duplicative coverage.",
    ],
    sourceIds: ["fraser-2025", "germany-gkv"],
  },
  {
    id: "cost-sharing",
    title: "Cost sharing at the point of care",
    question: "Should patients pay deductibles, copays, or coinsurance?",
    choice:
      "No deductibles, copays, or coinsurance for covered services. A $0 / $5 / $15 prescription copay schedule (generic / preferred brand / non-preferred brand), capped at $200 a year per person and waived below 200% of the poverty line, is kept as a standby option Congress can switch on if utilization exceeds the costly-case projection. It is off in the central estimate.",
    rationale: `Cost sharing reduces both low-value and high-value care (RAND Health Insurance Experiment). Its administrative cost (eligibility checks, collection, bad debt) offsets much of its saving under a single payer. Every dollar of induced demand is counted in the utilization effect, ${F.utilization} in the central case.`,
    alternatives: [
      {
        name: "Zero cost sharing (chosen)",
        description: "Free at the point of service.",
        pros: [
          {
            point: "No one skips care because of cost",
            detail: "Today about 1 in 4 adults report skipping care because of cost.",
          },
          { point: "Simplest to administer: no bills to patients at all" },
          { point: "Ends medical debt from covered care" },
        ],
        cons: [
          {
            point: "Highest induced demand",
            detail: `The utilization effect is ${F.utilization} a year in the central estimate and ${F.utilizationCostly} in the costly case.`,
          },
          {
            point:
              "More low-value visits compete with high-value care for the same appointment slots",
          },
        ],
        precedent:
          "UK NHS (except prescriptions in England), Canada (physician and hospital care).",
      },
      {
        name: "Capped copays (Sweden/Japan/France style)",
        description:
          "Small per-visit fees with a low annual cap and exemptions for low-income and chronically ill people.",
        pros: [
          { point: "Reduces induced demand by roughly 3–6%" },
          { point: "Raises some revenue" },
        ],
        cons: [
          { point: "Requires billing infrastructure for every visit" },
          { point: "Deters the poor most, even with exemptions, because of the hassle" },
        ],
        precedent:
          "Sweden (about $20–40 per visit, with a SEK 1,450 annual cap); Japan (30% coinsurance with monthly caps); France (ticket modérateur, mostly covered by supplementary mutuelles).",
      },
      {
        name: "High-deductible catastrophic coverage",
        description: "UHP covers everything above, say, 5% of income.",
        pros: [{ point: "Much lower public cost" }],
        cons: [
          { point: "Doesn't solve underinsurance, which is a goal of the plan" },
          { point: "Keeps billing complexity for everyone" },
        ],
        precedent:
          "Singapore's MediShield Life sits atop mandatory medical savings accounts (Medisave).",
      },
    ],
    givesUp: [
      "A price signal that discourages marginal use.",
      "The $50–100B a year that moderate cost sharing would save.",
    ],
    sourceIds: ["rand-hie", "oregon-experiment"],
  },
  {
    id: "benefits",
    title: "What is covered",
    question: "How broad is the benefit package?",
    choice:
      "Hospital, physician, outpatient, mental health and substance use, maternity and newborn, prescription drugs on the national formulary, lab and imaging, rehabilitation, adult and pediatric dental (preventive, restorative, dentures, medically necessary orthodontics), vision (exams and basic eyewear), hearing (exams and hearing aids), home- and community-based long-term services, and the clinical component of nursing-facility care. Excluded: over-the-counter products, cosmetic procedures, premium eyewear and hearing aids, nursing-home room and board (income-tested contribution), and services the technology-assessment body finds ineffective.",
    rationale:
      "Leaving dental, vision, and hearing out would keep a large out-of-pocket market and leave seniors with today's gaps (traditional Medicare excludes them). Long-term care at home is included because Medicaid's spend-down rules force people into poverty to qualify, which is incompatible with universality. Room and board are excluded, as in Canada, to avoid paying for housing through the health budget.",
    alternatives: [
      {
        name: "Comprehensive incl. home-based LTC (chosen)",
        description: "As described.",
        pros: [
          { point: `Out-of-pocket spending falls from ${F.oopBefore} to about ${F.oopAfter}` },
          { point: "Ends Medicaid's asset spend-down for home care" },
        ],
        cons: [
          {
            point: "The most expensive option",
            detail: `Dental, home health, and HCBS together add about ${F.newBenefitsUtilization} in utilization in the central case.`,
          },
          {
            point:
              "The direct-care workforce (home aides) is already short, so waits for home care are likely",
          },
        ],
      },
      {
        name: "Medicare-equivalent benefits",
        description: "Hospital, physician, and drugs only.",
        pros: [{ point: "About $110–150B a year cheaper" }],
        cons: [
          { point: "Keeps dental, hearing, and vision costs on households" },
          { point: "Seniors would lose Medicare Advantage extras with nothing in their place" },
        ],
      },
      {
        name: "Full LTC including room and board",
        description: "As in the Medicare for All Act, which covers institutional LTC.",
        pros: [{ point: "Complete protection from catastrophic long-term care costs" }],
        cons: [
          { point: "Adds roughly $40–60B a year and creates an incentive to institutionalize" },
          { point: "Turns the health program into a housing program" },
        ],
        precedent:
          "Japan and Germany use separate social LTC insurance programs (Kaigo Hoken, Pflegeversicherung) with their own payroll contributions.",
      },
    ],
    givesUp: [
      "Lower total cost from a narrower package.",
      "Full institutional long-term-care coverage.",
    ],
    sourceIds: ["sanders-m4a", "kff-hcbs-waitlist"],
  },
  {
    id: "provider-payment",
    title: "How providers are paid",
    question: "What payment methods does UHP use?",
    choice:
      "Hospitals: an annual global operating budget negotiated regionally, based on prior-year costs adjusted for volume, case mix, and quality, plus a separate capital budget approved by regional planning boards. Physicians and other clinicians: a national fee schedule based on Medicare's RBRVS, rebalanced toward primary care, with optional per-patient capitation for primary-care practices. Integrated systems (Kaiser-style) can take a single capitated global budget for their enrolled population. Balance billing is banned.",
    rationale:
      "Global budgets are how Canada and Maryland control hospital spending growth. Separating capital from operating budgets ends the arms race of hospitals building profitable service lines to attract commercially insured patients. Keeping fee-for-service for physicians avoids a capacity collapse during the transition, because physicians know how to bill RBRVS codes today.",
    alternatives: [
      {
        name: "Global budgets + fee schedule (chosen)",
        description: "As described.",
        pros: [
          { point: "Predictable total spending: hospitals are 31% of NHE" },
          { point: "Hospitals stop needing billing departments for per-claim adjudication" },
          { point: "Capital planning targets underserved regions" },
        ],
        cons: [
          {
            point: "Global budgets can reward doing less",
            detail: "Canadian hospitals ration OR time near year-end.",
          },
          { point: "Freezes existing inequities if based on historical costs" },
          { point: "Regional capital boards can be captured by incumbent systems" },
        ],
        precedent: "Canada, Maryland (since 2014), Pennsylvania Rural Health Model.",
      },
      {
        name: "Per-case payment (DRGs) for hospitals",
        description: "Keep Medicare's diagnosis-related-group payments at UHP rates.",
        pros: [
          { point: "Rewards hospitals that do more cases, which shortens queues" },
          { point: "Infrastructure already exists" },
        ],
        cons: [{ point: "Weak total-spending control" }, { point: "Encourages upcoding" }],
        precedent: "Germany (G-DRG), France (T2A), Medicare.",
      },
      {
        name: "Activity-based funding with volume caps",
        description: "Pay per case up to a budgeted volume, then at a reduced marginal rate.",
        pros: [{ point: "Combines the volume incentive with cost control" }],
        cons: [{ point: "Complex; hospitals game the threshold" }],
        precedent: "Germany's volume-dependent markdowns (Fixkostendegressionsabschlag).",
      },
    ],
    givesUp: [
      "Per-case volume incentives that shorten waits.",
      "Hospital independence over capital investment decisions.",
    ],
    sourceIds: ["maryland-model", "medpac-2025"],
  },
  {
    id: "rate-level",
    title: "Payment rate levels",
    question: "How much does UHP pay relative to today?",
    choice: `Hospitals: ${show("hospitalRate", "pct")} of Medicare on average. Physicians: ${show("physicianRate", "pct")} of Medicare on average (primary care ${show("primaryCareRate", "pct")}, procedural specialties ${show("proceduralRate", "pct")}). Rates phase in over four years from each provider's current blended rate. A temporary Hospital Transition Fund (${F.hospitalFund} in total) cushions systems that depend on commercial revenue.`,
    rationale: `Paying Medicare rates (100%) would cut hospital revenue by roughly ${F.hospitalAboveMedicare} a year, and MedPAC already finds Medicare margins negative, so closures would follow. Paying today's blended commercial rates would forfeit most of the savings. ${show("hospitalRate", "pct")}/${show("physicianRate", "pct")} is roughly neutral for hospitals overall once billing costs fall, and it raises rates for Medicaid-heavy and rural providers.`,
    alternatives: [
      {
        name: "Medicare rates (100%)",
        description: "As in early Medicare for All scoring.",
        pros: [
          {
            point: `About ${F.hospitalAboveMedicare} a year more savings on hospitals and ${F.physicianAboveMedicare} on physicians than the plan (the lean case shows a partial version)`,
          },
        ],
        cons: [
          { point: "Hospital closures, especially systems with 40%+ commercial revenue" },
          { point: "Physician opt-outs rise, which lengthens waits" },
        ],
      },
      {
        name: `${show("hospitalRate", "pct")} hospitals / ${show("physicianRate", "pct")} physicians (chosen)`,
        description: "As described.",
        pros: [
          { point: "Hospital revenue roughly flat in aggregate (−1.1% in the central estimate)" },
          { point: "Primary care gains" },
        ],
        cons: [
          {
            point: "Large redistribution among hospitals",
            detail: "Hospitals heavily reliant on commercial insurance lose 15–30% of revenue.",
          },
          { point: `Smaller price savings (${F.priceEffect} overall)` },
        ],
      },
      {
        name: "Current blended rates",
        description: "Pay each provider what it earns on average today.",
        pros: [{ point: "No provider loses revenue" }],
        cons: [
          { point: "Price effect near zero: total spending would rise about $350B" },
          { point: "Locks in the market-power price differences between systems" },
        ],
      },
    ],
    givesUp: [
      "The higher incomes of providers that are commercially dominant today.",
      `About ${F.bothAboveMedicare} a year of additional savings that Medicare-level rates would capture.`,
    ],
    sourceIds: ["rand-hospital-2024", "medpac-2025", "cbo-single-payer-2020"],
  },
  {
    id: "drug-pricing",
    title: "Prescription drug pricing",
    question: "How does UHP set drug prices?",
    choice:
      "A National Formulary and Pricing Board negotiates a price for every drug. It uses a value assessment (clinical benefit vs. existing treatments) and an international reference band (the median price in 11 comparable countries) as the opening offer. If a manufacturer refuses to negotiate in good faith, the government may authorize generic production under 28 U.S.C. § 1498 (government use of patents with reasonable compensation). New drugs with no comparator get a provisional launch price for 3 years, then a value-based reassessment.",
    rationale:
      "Medicare's IRA negotiation produced 38–79% discounts from list price on the first 10 drugs. Extending negotiation to every drug and every patient makes UHP the buyer for the whole U.S. market, which ends the ability to charge Americans 4x what other countries pay for brand drugs.",
    alternatives: [
      {
        name: "Negotiation + value assessment + §1498 backstop (chosen)",
        description: "As described.",
        pros: [
          { point: `Retail drug spending falls from ${F.drugsBefore} to about ${F.drugsAfter}` },
          { point: "Patients pay $0 for formulary drugs" },
        ],
        cons: [
          {
            point: "Reduced pharmaceutical revenue lowers R&D incentive",
            detail:
              "CBO estimated H.R. 3 would lead to ~8 fewer of ~300 new drugs in a decade; this plan is broader, so expect more.",
          },
          {
            point: "Some new drugs launch later in the U.S. or not at all",
            detail: "This already happens in other countries with value assessment.",
          },
          { point: "§1498 use would be litigated and anger trading partners" },
        ],
        precedent:
          "UK NICE (cost-per-QALY thresholds), Germany AMNOG (benefit assessment, then negotiation), Medicare IRA negotiation (2026).",
      },
      {
        name: "International reference pricing only",
        description: "Pay no more than the average of other countries.",
        pros: [{ point: "Simple and transparent" }],
        cons: [
          {
            point: "Manufacturers delay or withhold launches abroad, or raise foreign list prices",
          },
          { point: "Ties U.S. policy to other countries' decisions" },
        ],
      },
      {
        name: "Keep market pricing, cap patient costs",
        description: "UHP pays list-minus-rebate like today.",
        pros: [{ point: "Maximum innovation incentive" }],
        cons: [{ point: `Forgoes about ${F.drugPriceSaving} a year in price savings` }],
      },
    ],
    givesUp: [
      "Some future drugs and some speed of access to new drugs.",
      "Pharmaceutical shareholder value.",
    ],
    sourceIds: ["rand-drugs-2024", "cms-negotiation", "cbo-hr3-drugs"],
  },
  {
    id: "administration",
    title: "Who runs it",
    question: "Federal agency, states, or an independent body?",
    choice:
      "A new Universal Health Administration (UHA) inside HHS, led by an administrator confirmed by the Senate for a 6-year term, with 10 regional offices aligned with HHS regions. States may apply for a 'state-administered UHP' waiver if they meet federal standards (the Canadian model). Rate-setting and technology assessment sit with independent expert boards whose recommendations take effect unless Congress votes them down.",
    rationale:
      "A national program keeps standards uniform and lets UHP use Medicare's existing infrastructure: its claims processors (MACs), provider enrollment (PECOS), and fee schedules. The state option lets states like Vermont, California, or New York innovate, as Canadian provinces do.",
    alternatives: [
      {
        name: "Federal agency + state option (chosen)",
        description: "As described.",
        pros: [
          {
            point:
              "Builds on Medicare operations, which have processed over 1 billion claims a year for decades",
          },
          { point: "Uniform national standards" },
        ],
        cons: [
          {
            point:
              "One national bureaucracy is exposed to federal shutdowns and appropriations fights",
            detail: "Mitigated by a trust fund with permanent appropriation.",
          },
          { point: "Regional variation in practice is harder to accommodate" },
        ],
      },
      {
        name: "Fifty state single-payer systems (Canada)",
        description: "Federal block grants with conditions.",
        pros: [{ point: "Local control; policy experimentation" }],
        cons: [
          { point: "Large differences in state capacity; some states would refuse" },
          { point: "Portability problems when people move between states" },
        ],
      },
    ],
    givesUp: ["Full state control over health policy.", "Some local responsiveness."],
    sourceIds: ["cms-trustees-2025"],
  },
  {
    id: "managed-care",
    title: "Medicare Advantage, Medicaid managed care, and integrated systems",
    question:
      "What happens to the private plans that run Medicare Advantage (54% of Medicare) and Medicaid managed care (~75% of Medicaid)?",
    choice:
      "They end. Provider-led integrated delivery systems (e.g., Kaiser Permanente's medical groups, Geisinger, Intermountain) can elect a capitated global budget as Integrated Care Organizations. Patients may choose them, but they bear no insurance risk beyond their enrolled population and cannot market extra benefits.",
    rationale: `MedPAC estimates Medicare Advantage costs about 20% more than traditional Medicare for similar enrollees ($84B in 2025), largely from coding intensity and favorable selection. Medicaid MCO overhead is ${F.mcoOverhead}. Integrated providers keep their care-coordination advantages without an insurance layer.`,
    alternatives: [
      {
        name: "End plans; allow provider ICOs (chosen)",
        description: "As described.",
        pros: [
          {
            point: `Removes ${F.planOverhead} of plan overhead (${F.maOverhead} MA/Part D + ${F.mcoOverhead} Medicaid MCO)`,
          },
          { point: "Ends coding-intensity overpayments" },
        ],
        cons: [
          {
            point:
              "About 33 million MA enrollees lose plans many like (high satisfaction, extra benefits)",
          },
          { point: "Plan-based care-management programs end abruptly" },
        ],
      },
      {
        name: "Keep MA-style plans as option",
        description:
          "Private plans could take UHP capitation, as in the German sickness-fund model.",
        pros: [{ point: "Choice; continuity for MA enrollees" }],
        cons: [
          { point: "Brings back risk selection, coding games, and networks" },
          { point: "Two-tier experience" },
        ],
      },
    ],
    givesUp: [
      "MA supplemental benefits like gym memberships and grocery cards (UHP covers dental, vision, and hearing directly).",
      "Plan-level innovation in care management.",
    ],
    sourceIds: ["medpac-2025"],
  },
  {
    id: "financing",
    title: "How it is financed",
    question: "Which taxes replace premiums and out-of-pocket costs?",
    choice: `Five sources: (1) existing public funds redirected (Medicare, Medicaid, Marketplace subsidies); (2) a ${show("employerTaxRate")} employer health payroll tax, with the first ${show("payrollExemption")} of each employer's payroll exempt; (3) a 4% income-based household premium above a size-adjusted exemption (${show("exemptionFour")} for a family of four); (4) top-end measures: a 7% surtax on income above $1M, taxing capital gains as ordinary income above $1M, and a 0.1% financial transactions tax; (5) whatever remains, ${F.gap} in the central case, from general revenue. State governments pay a maintenance-of-effort contribution equal to their former Medicaid share.`,
    rationale: `Payroll and income taxes replace premiums, which already function as a payroll tax: employers pay them from compensation. The employer tax is set below what offering employers paid in premiums (${show("employerTaxRate")} of payroll versus roughly 9–10% today), so most offering employers save and must pass the savings to wages. The household premium is visible and dedicated, so people see what the program costs. The top-end taxes make the overall financing progressive.`,
    alternatives: [
      {
        name: "Payroll + income premium + top-end (chosen)",
        description: "As described.",
        pros: [
          { point: "Progressive: households under about $150k generally come out ahead" },
          { point: "Mirrors the existing flow of employer money" },
        ],
        cons: [
          {
            point: "Non-offering employers (many small firms, gig platforms) face a new cost",
            detail: "Over time this lowers wages for their workers.",
          },
          {
            point:
              "Payroll and income taxes fall in recessions, exactly when demand for the program does not",
          },
        ],
      },
      {
        name: "Value-added tax (VAT)",
        description: "A 6–8% broad VAT, as used by most OECD countries to fund health care.",
        pros: [
          { point: "Very broad base; hard to avoid; stable" },
          { point: "Doesn't distort hiring decisions as much" },
        ],
        cons: [
          { point: "Regressive unless offset with rebates" },
          {
            point: "Requires building a new federal tax system",
            detail: "No U.S. federal sales tax exists.",
          },
        ],
      },
      {
        name: "Deficit finance",
        description: "Fund the federal increase with borrowing.",
        pros: [{ point: "No new taxes" }],
        cons: [
          {
            point:
              "Federal health outlays more than double, since nearly all health spending runs through the Treasury; borrowing at that scale is unsustainable",
          },
          { point: "Creates an incentive to underfund the program later" },
        ],
      },
    ],
    givesUp: [
      "Employers' discretion over the size of their health benefit.",
      "Tax-free health compensation: the ESI tax exclusion disappears.",
    ],
    sourceIds: ["bea-wages", "irs-soi-2022", "cbo-exclusion", "baicker-chandra"],
  },
  {
    id: "eligibility",
    title: "Who is eligible",
    question: "Who counts as a resident?",
    choice:
      "Every person who lives in the U.S., regardless of immigration status, after 90 days of residence. Visitors and people within 90 days of arrival receive emergency care billed to travel insurance or paid by UHP if uncollectable. Undocumented immigrants are covered. This is the most contested choice in the plan, and the alternatives are set out below.",
    rationale:
      "Leaving out roughly 11 million undocumented residents would keep EMTALA-driven uncompensated emergency care, public-health gaps (infectious disease goes untreated), and the eligibility-verification bureaucracy that single payer is meant to remove. Their care is already in the 2024 baseline (uncompensated care, Emergency Medicaid, out-of-pocket). Covering them adds an estimated $25–40B in utilization, which is included in the utilization effect.",
    alternatives: [
      {
        name: "All residents after 90 days (chosen)",
        description: "As described.",
        pros: [
          { point: "No verification bureaucracy at the point of care" },
          { point: "Public-health benefits from treating contagious disease early" },
        ],
        cons: [
          { point: "Politically very costly; the most common objection" },
          {
            point: "A possible 'magnet' effect",
            detail: "Evidence from Spain and others is weak, but voters believe it.",
          },
        ],
        precedent: "Spain (restored 2018), Italy (STP card), Thailand (migrant health insurance).",
      },
      {
        name: "Citizens and lawful residents only",
        description: "Undocumented people get emergency care only.",
        pros: [{ point: "Politically easier; saves about $25–40B a year" }],
        cons: [
          {
            point:
              "Requires status verification in every clinic, plus a billing system for the uncovered",
          },
          { point: "Hospitals keep uncompensated care" },
        ],
        precedent: "UK charges some overseas visitors; Canada covers permanent residents only.",
      },
    ],
    givesUp: ["Political support from voters who oppose coverage for undocumented immigrants."],
    sourceIds: [],
  },
  {
    id: "transition-speed",
    title: "Transition speed",
    question: "Big bang, multi-year phase-in, or slow glide path?",
    choice:
      "A four-year phase-in after an 18-month build period. Year 1: children (0–18), adults 55+, improved Medicare benefits. Year 2: 45–54. Year 3: 35–44. Year 4: everyone. Employers must keep providing coverage to workers not yet eligible.",
    rationale:
      "Taiwan went from 57% to 92% coverage in under a year in 1995, but it had a much simpler starting point. A phase-in lets UHP's claims systems and staffing scale, tests rate-setting on smaller populations first, and gives displaced workers a staggered labor market. Covering by age, the Medicare for All Act's approach, moves older, more expensive groups first, which front-loads cost but also front-loads relief.",
    alternatives: [
      {
        name: "4-year age-based phase-in (chosen)",
        description: "As described.",
        pros: [
          { point: "IT and staff ramp up gradually" },
          { point: "Insurer layoffs spread over 4 years" },
        ],
        cons: [
          { point: "Four years of running two systems, which costs more" },
          { point: "Employers must manage mixed-eligibility workforces" },
          { point: "Gives opponents four elections in which to stop it" },
        ],
      },
      {
        name: "Big bang (one year)",
        description: "Everyone moves on one date.",
        pros: [
          { point: "Shortest period of dual-system cost" },
          { point: "Hardest for opponents to reverse" },
        ],
        cons: [
          { point: "Highest risk of operational failure (cf. HealthCare.gov 2013)" },
          { point: "A demand surge hits all at once, so waits spike" },
        ],
        precedent: "Taiwan NHI (March 1995).",
      },
      {
        name: "Public option glide path (10+ years)",
        description: "Start with a buy-in and let it grow.",
        pros: [{ point: "Lowest disruption" }],
        cons: [{ point: "May never reach universality; vulnerable to adverse selection" }],
      },
    ],
    givesUp: ["Speed: people not yet eligible keep today's gaps for up to four more years."],
    sourceIds: ["taiwan-nhi", "healthcare-gov", "sanders-m4a"],
  },
  {
    id: "veterans-military",
    title: "VA, TRICARE, and the Indian Health Service",
    question: "Do the existing federal direct-care systems fold into UHP?",
    choice:
      "No. The VA, military health system, and IHS continue as delivery systems, and their beneficiaries are also UHP-eligible. UHP pays the IHS and tribal programs for care they deliver to UHP-eligible patients, which adds money to chronically underfunded programs. TRICARE for dependents and retirees moves to UHP; active-duty care stays with the Defense Health Agency.",
    rationale:
      "These are treaty, service, and readiness obligations with their own politics and legal basis. Merging them would add risk without adding savings.",
    alternatives: [
      {
        name: "Keep as delivery systems (chosen)",
        description: "As described.",
        pros: [{ point: "No disruption to veterans' care; honors tribal sovereignty" }],
        cons: [
          { point: `Keeps ${F.fedPrograms} of separate federal programs and some duplication` },
        ],
      },
      {
        name: "Fold into UHP",
        description: "Single system for everyone.",
        pros: [{ point: "Maximum simplicity" }],
        cons: [{ point: "Veterans' organizations and tribes would strongly oppose" }],
      },
    ],
    givesUp: ["Some administrative simplification."],
    sourceIds: [],
  },
  {
    id: "contested-services",
    title: "Contested services: abortion and gender-affirming care",
    question:
      "Does UHP cover services subject to federal funding restrictions today (the Hyde Amendment)?",
    choice:
      "The plan leaves this to an explicit congressional vote rather than hiding it. Option A: cover them, which repeals Hyde for UHP. Option B: exclude them from UHP while allowing states to fund them through their own supplementary programs. The cost difference is under $1B a year either way, so it doesn't change the ledger. The real trade-off is political: Option A risks losing votes from members who oppose federal abortion funding, and Option B means UHP is not universal for these services in some states.",
    rationale:
      "A single national payer means a single national answer. Today the answer varies by insurer and state. Making that explicit is more honest than leaving it to agency discretion.",
    alternatives: [
      {
        name: "Cover (repeal Hyde for UHP)",
        description: "As in the Medicare for All Act.",
        pros: [{ point: "Uniform coverage nationwide" }],
        cons: [{ point: "Loses votes; likely litigation over conscience protections" }],
      },
      {
        name: "Exclude; allow state supplements",
        description: "Hyde applies; states may fund with their own money.",
        pros: [{ point: "Broader coalition" }],
        cons: [
          {
            point:
              "Coverage differs by state, and many people lose coverage they have now under private plans",
          },
        ],
      },
    ],
    givesUp: ["Either nationwide uniformity or political breadth."],
    sourceIds: ["sanders-m4a"],
  },
  {
    id: "provider-ownership",
    title: "For-profit providers",
    question:
      "Can investor-owned hospitals, nursing homes, and practices participate, and can UHP payments fund their profits?",
    choice:
      "For-profit providers may participate and earn margins within UHP rates and budgets. Ownership must be disclosed, private-equity acquisitions of participating providers need regional review, and capital for new facilities comes only from the regional capital budget, not from operating payments.",
    rationale:
      "About a quarter of U.S. hospitals and roughly 70% of nursing homes are for-profit. Excluding them at once would remove capacity the plan needs. Disclosure, capital controls, and fixed rates remove most of the strategies (out-of-network billing, commercial price leverage, upcoding) that made investor ownership profitable.",
    alternatives: [
      {
        name: "Allow with disclosure & capital controls (chosen)",
        description: "As described.",
        pros: [
          { point: "Keeps all existing capacity" },
          { point: "Fixed rates and capital rules remove the main profit strategies" },
        ],
        cons: [
          {
            point:
              "Profit motive persists inside a public budget, for example through cutting nursing-home staffing",
          },
          { point: "Requires ongoing oversight of ownership and quality" },
        ],
      },
      {
        name: "Bar payments from funding profit (Medicare for All Act §614)",
        description:
          "Payments may not fund profit, marketing, or utilization bonuses; investor-owned providers are effectively pushed to convert or exit.",
        pros: [
          { point: "Every dollar goes to care" },
          { point: "Removes incentives to cut quality for margin" },
        ],
        cons: [
          {
            point:
              "Mass conversions or closures of for-profit hospitals and nursing homes during a capacity crunch",
          },
          { point: "Takings and compensation litigation over forced conversions" },
        ],
        precedent:
          "Canada's hospitals are almost all nonprofit or public; many long-term-care homes are for-profit, and COVID-19 deaths were higher in for-profit homes in Ontario.",
      },
      {
        name: "Allow without restriction",
        description: "Same rules as any provider.",
        pros: [{ point: "Simplest; attracts private capital" }],
        cons: [{ point: "Private-equity roll-ups and staffing cuts continue unchecked" }],
      },
    ],
    givesUp: [
      "A system fully free of profit-driven provider behavior.",
      "Unrestricted private capital investment in health facilities.",
    ],
    sourceIds: ["jayapal-m4a"],
  },
]
