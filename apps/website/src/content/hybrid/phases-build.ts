/**
 * Hybrid plan, Phases 0 and 1: fix today's system, then pass the law and
 * build the regulator, the standard benefit, the plan rules, and the money
 * flows before the regulated plans open.
 */
import { show } from "../constants"
import type { HybridPhase } from "./helpers"
import { H, hybridOneTime, HYBRID_COST } from "./figures"
import { fmt } from "../model"

export const HY_PHASE_0: HybridPhase = {
  id: "groundwork",
  number: 0,
  title: "Preparation",
  window: "Before the new plans open",
  goal: "Fix the worst problems in today's system first, inside today's insurers and programs, and start the long-lead workforce work. None of it waits for the new plans.",
  exitCriteria: [
    "Interim fixes from the chosen paths for this phase are in force (see Changes by phase).",
    "Residency slots, nursing faculty, and scope-of-practice changes funded and started.",
  ],
  steps: [
    {
      id: "fix-today",
      title: "Fix today's system first",
      summary:
        "Rules that work under any payer go first: limits on claim denials and prior authorization, a default rate for surprise bills, price transparency, PBM rules, Medicare Advantage payment fixes, and protection from medical debt. They help people now and carry over unchanged into the new system.",
      legalVehicle:
        "Title I of the enabling act, plus CMS and Department of Labor rulemaking under existing authority where it suffices.",
      owner: "Congress, HHS (CMS), Labor, Treasury, FTC",
      timeline: "Enactment to Year 1",
      tasks: [
        {
          action:
            "Set reporting, penalties, and fast independent appeals for claim denials across every insurer, including self-insured employer plans.",
          owner: "HHS / Labor",
          when: "Months 0–12",
          tradeoff:
            "Insurers lose a cost-control tool, so premiums may rise slightly; patients get care they were wrongly denied.",
        },
        {
          action:
            "Limit prior authorization to a short published list, with gold-carding for clinicians whose requests are almost always approved.",
          owner: "CMS / state regulators",
          when: "Months 0–12",
          tradeoff:
            "Some low-value care that prior authorization blocked will get through; clinicians and patients lose far less time.",
        },
        {
          action:
            "Replace No Surprises Act arbitration with a default out-of-network rate tied to Medicare.",
          owner: "HHS / Labor / Treasury",
          when: "Months 0–9",
          tradeoff:
            "Out-of-network specialists lose leverage to win high arbitration awards; disputes stop clogging the system.",
        },
        {
          action:
            "Fix Medicare Advantage payments: two years of diagnosis data for risk scores, no diagnoses from home visits and chart reviews alone, and expanded audits.",
          owner: "CMS",
          when: "Months 0–12",
          tradeoff: "Plans may cut extra benefits such as dental as payments fall.",
        },
        {
          action:
            "Ban medical debt from credit reports, limit collections, and buy and cancel existing medical debt.",
          owner: "CFPB / HHS",
          when: "Months 0–12",
          tradeoff:
            "Hospitals collect less from patients who can pay but don't; families stop being ruined by bills.",
        },
      ],
      cost: {
        recurring: 0,
        ledgerNote: `Mostly rules, not spending. The Medicare Advantage payment fix changes federal spending by ${H.maFix} a year (CBO).`,
      },
      pros: [
        { point: "Help arrives in the first year, not after the new plans are built." },
        {
          point:
            "Every fix still works if the hybrid stalls, so nothing is wasted if later steps are delayed.",
        },
      ],
      cons: [
        { point: "Insurers and hospitals fight each rule separately, in rulemaking and in court." },
        { point: "Fixes inside today's system don't reach the uninsured by themselves." },
      ],
      tradeoffs: [
        "Doing the fixes first gives quick, visible wins but spends political capital before the larger law is in force.",
      ],
      risks: [
        {
          risk: "Courts block rules issued under existing authority.",
          mitigation: "Put each rule in the statute itself, not only in agency rulemaking.",
        },
      ],
      precedent: [
        "The No Surprises Act (2022) applied one federal rule to every insurer, including self-insured plans.",
      ],
      dependsOn: [],
      sourceIds: ["medpac-2026"],
      extras: {
        riskIds: ["hy-legal"],
        international: [
          {
            country: "Germany",
            approach:
              "Sickness funds must cover the services the Federal Joint Committee approves, so there is little room for plan-by-plan denials of covered care.",
            result:
              "Coverage disputes are about what the national benefit includes, not plan practices.",
            lesson:
              "A clear standard benefit shrinks the space for denials; the denial rules are a bridge until it exists.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Netherlands",
            approach:
              "Nonprofit insurers must accept every applicant and cover the statutory package.",
            result: "Insurers compete on service and networks, not on avoiding sick people.",
            lesson:
              "Rules on what plans must do can carry over from today's market into the new one.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
    {
      id: "workforce-start",
      title: "Start the workforce pipeline",
      summary: `Training clinicians takes years, so it starts first: more residency slots, nursing faculty, clinical placements, service scholarships, and community health workers, at ${H.workforce} a year. It is the main lever for keeping specialist waits from rising as ${H.newlyCovered} newly covered people start using care.`,
      legalVehicle: "Title I of the enabling act; appropriations to HRSA and Medicare GME.",
      owner: "HHS (HRSA, CMS), states",
      timeline: "Enactment onward",
      tasks: [
        {
          action:
            "Fund new residency slots, weighted to primary care, psychiatry, and short-staffed specialties.",
          owner: "CMS / HRSA",
          when: "Months 0–24",
          tradeoff:
            "New slots take years to produce doctors; the money is spent long before the benefit.",
        },
        {
          action:
            "Fund nursing faculty and clinical placements so nursing schools can admit more students.",
          owner: "HRSA",
          when: "Months 0–24",
          tradeoff: "Draws experienced nurses out of bedside care into teaching.",
        },
        {
          action:
            "Expand scope of practice for nurse practitioners and physician assistants, with team-based supervision where evidence is thin.",
          owner: "States / Congress (federal programs)",
          when: "Months 0–18",
          tradeoff:
            "Physician groups object; quality has to be monitored where the evidence is thin.",
        },
      ],
      cost: {
        recurring: HYBRID_COST.lines.find((l) => l.id === "workforce")?.delta ?? 0,
        ledgerNote: `${H.workforce} a year, the same workforce program the single-payer plan funds.`,
      },
      pros: [
        { point: "Adds the capacity that keeps waits from rising, for everyone." },
        { point: "Helps under any version of reform, including keeping current law." },
      ],
      cons: [{ point: "Takes five to ten years to change the number of practicing doctors." }],
      tradeoffs: [
        "Spending on capacity now vs. lower premiums now: the plan pays for capacity first so waits don't rise later.",
      ],
      risks: [
        {
          risk: "Graduates cluster in high-paying specialties and cities.",
          mitigation:
            "Tie scholarships and new slots to service in shortage areas and specialties.",
        },
      ],
      precedent: [
        "Medicare has funded most graduate medical education since 1965; the slot cap set in 1997 is what limits supply.",
      ],
      dependsOn: [],
      sourceIds: ["aamc-shortage", "hrsa-nursing"],
      extras: {
        tradeoffIds: ["hy-waits"],
        international: [
          {
            country: "Germany",
            approach: "Keeps a large hospital and physician supply.",
            result: `${show("germanyBedsPer100k")} hospital beds per 100,000 people against an EU average of ${show("euBedsPer100k")}, with ${show("germanyBedOccupancy")} occupancy in 2024.`,
            lesson:
              "Capacity is why most Germans wait little, but spare capacity also costs money; aim for enough, not the most.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Canada",
            approach:
              "Universal coverage without matching growth in specialists and operating capacity.",
            result: "Long waits for specialist and elective care.",
            lesson: "Coverage without capacity turns into waiting lists.",
          },
        ],
      },
    },
  ],
}

export const HY_PHASE_1: HybridPhase = {
  id: "build",
  number: 1,
  title: "Enactment & build",
  window: "Year 0: the 18 months between signing and the new plans opening",
  goal: "Pass the law and build what the regulated plans need: a regulator, the standard benefit, rules that make plans take everyone, risk adjustment, income-based premiums, the employer mandate, a shared eligibility service, drug negotiation for every payer, the commercial price cap, and the top-end taxes.",
  exitCriteria: [
    "Regulator staffed; standard benefit and cost-sharing caps published.",
    "Plan rules in force: nonprofit status, guaranteed issue, standard premiums, administrative-cost limits.",
    "Risk adjustment, premium schedule, and subsidies tested with live data.",
    "Eligibility service live; enrollment file built for the uninsured.",
    "First negotiated drug prices and the commercial price cap published.",
    "Top-end taxes enacted.",
  ],
  steps: [
    {
      id: "create-regulator",
      title: "Create the national plan regulator",
      summary:
        "A national regulator sets the standard benefit, approves plans, runs risk adjustment, enforces administrative-cost limits, and publishes quality and wait-time data. It doesn't pay claims: plans do. That keeps it far smaller than a single-payer agency.",
      legalVehicle: "Title II of the enabling act, creating an independent agency within HHS.",
      owner: "HHS",
      timeline: "Months 0–12",
      tasks: [
        {
          action: "Appoint a board with fixed staggered terms; publish all decisions and methods.",
          owner: "President / Senate",
          when: "Months 0–6",
          tradeoff:
            "Independence protects decisions from lobbying but makes the regulator less accountable to voters.",
        },
        {
          action: "Hire staff for plan approval, risk adjustment, data, and enforcement.",
          owner: "Regulator",
          when: "Months 3–18",
          tradeoff: "Hiring ahead of plan fees costs money before the agency has revenue.",
        },
        {
          action:
            "Fund the regulator from a small fee on every regulated and employer plan, after start-up funding runs out.",
          owner: "Regulator / Treasury",
          when: "Year 2 onward",
          tradeoff:
            "Fees add slightly to premiums; general-revenue funding would hide the cost instead.",
        },
      ],
      cost: {
        oneTime: hybridOneTime("hy-regulator"),
        ledgerNote: `${fmt(hybridOneTime("hy-regulator"))} one-time start-up, then funded by plan fees.`,
      },
      pros: [
        { point: "One rulebook for every plan, instead of 50 state insurance codes plus ERISA." },
        {
          point:
            "Small: plans keep paying claims, so the regulator doesn't need a claims operation.",
        },
      ],
      cons: [
        { point: "A new federal agency is a target for capture by the insurers it regulates." },
      ],
      tradeoffs: [
        "National rules end state-by-state variation in plan rules, which some states value.",
      ],
      risks: [
        {
          risk: "The regulator is captured by insurers or hospitals.",
          mitigation:
            "Public data and methods, conflict-of-interest rules, and patient members on the board.",
        },
      ],
      precedent: [
        "Germany's Federal Joint Committee decides the benefit package for all sickness funds.",
      ],
      dependsOn: [],
      sourceIds: ["cmwf-germany-2026"],
      extras: {
        decisionIds: ["hy-payer-structure"],
        riskIds: ["hy-capture"],
        tradeoffIds: ["hy-admin"],
        international: [
          {
            country: "Germany",
            approach:
              "The Federal Joint Committee (doctors, hospitals, sickness funds, patient representatives) decides what statutory insurance covers.",
            result: `One benefit package; ${show("germanyCovered")} of residents covered.`,
            lesson: "A joint body sets the benefit; plans compete on service.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Netherlands",
            approach:
              "A national institute advises on the benefit package; a separate authority supervises insurers.",
            result: "Nonprofit insurers compete under one set of national rules.",
            lesson: "Separate the benefit-setter from the market supervisor.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
    {
      id: "define-benefits",
      title: "Define the standard benefit & cost sharing",
      summary:
        "Every regulated plan and every employer plan covers at least the same standard benefit: hospital, physician, prescription drugs, mental health, maternity, preventive care, and basic dental, glasses, and hearing aids. Copays stay flat and small, with an annual cap tied to income. Long-term care stays as it is today for now.",
      legalVehicle: "Title II; benefit rules issued by the regulator.",
      owner: "Regulator",
      timeline: "Months 3–15",
      tasks: [
        {
          action:
            "Publish the standard benefit, starting from the ACA's essential health benefits and adding basic dental, glasses, and hearing aids.",
          owner: "Regulator",
          when: "Months 3–12",
          tradeoff: "A richer benefit raises premiums; a thinner one leaves gaps people fall into.",
        },
        {
          action:
            "Set flat, small copays and an annual out-of-pocket cap as a share of income, with low-income people exempt.",
          owner: "Regulator",
          when: "Months 6–12",
          tradeoff:
            "Copays deter some low-value care but also some needed care; the income cap limits the harm.",
        },
        {
          action:
            "Require employer plans to cover at least the standard benefit within the cost-sharing cap.",
          owner: "Regulator / Labor",
          when: "Months 9–15",
          tradeoff: "Some lean employer plans get more expensive.",
        },
      ],
      cost: {
        recurring: 0,
        ledgerNote: `The income cap on cost sharing moves about ${H.oopCap} a year from households to premiums. Basic dental, glasses, and hearing aids are priced at their launch step; adding them to Medicare, in the Medicare step.`,
      },
      pros: [
        { point: "Everyone, whatever their plan, gets the same core coverage." },
        { point: "Adds basic dental, vision, and hearing without a new tax." },
      ],
      cons: [
        { point: "Copays remain, so some people still skip care for cost." },
        { point: "Long-term care is left out until a later decision." },
      ],
      tradeoffs: [
        "Basic dental in premiums vs. full public dental: cheaper and fits the break-even rule, but covers less than the single-payer plan would.",
      ],
      risks: [
        {
          risk: "Lobbying adds services until premiums jump.",
          mitigation: "Add services only after a technology assessment with a published cost.",
        },
      ],
      precedent: [
        "The ACA's essential health benefits (2014) set a floor for individual and small-group plans.",
      ],
      dependsOn: ["create-regulator"],
      sourceIds: [],
      extras: {
        decisionIds: ["hy-benefits"],
        tradeoffIds: ["hy-coverage"],
        international: [
          {
            country: "Netherlands",
            approach:
              "A statutory basic package with a compulsory annual deductible; extras through voluntary insurance.",
            result: "Universal core coverage, with cost sharing debated every few years.",
            lesson: "Keep the standard benefit broad and cost sharing capped.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
          {
            country: "Germany",
            approach: "One statutory benefit package, decided nationally, for every sickness fund.",
            result: "Benefits don't depend on which fund you choose.",
            lesson: "Plans compete on service, not on what they cover.",
            sourceIds: ["cmwf-germany-2026"],
          },
        ],
      },
    },
    {
      id: "erisa-and-insurance-law",
      title: "Rewrite insurance law: nonprofit plans that take everyone",
      summary: `Plans selling the standard benefit become nonprofit, must accept every applicant, charge everyone in a region the same premium, and are held to tight administrative-cost limits like Switzerland's ${show("swissAdminShare")} of premiums. ERISA is amended so self-insured employer plans meet the same benefit and cost-sharing rules.`,
      legalVehicle:
        "Title III: amendments to the Public Health Service Act, ERISA, and the Internal Revenue Code.",
      owner: "Congress / regulator / Labor",
      timeline: "Months 0–18",
      tasks: [
        {
          action:
            "Require guaranteed issue and renewal, and one premium per plan per region for everyone.",
          owner: "Regulator",
          when: "Months 0–12",
          tradeoff:
            "Young and healthy people pay more than under medical underwriting; sick people pay far less.",
        },
        {
          action:
            "Require plans selling the standard benefit to be nonprofit, or nonprofit subsidiaries of today's insurers.",
          owner: "Regulator / state regulators",
          when: "Months 6–24",
          tradeoff:
            "Insurer shareholders lose profit on the standard benefit; they can still sell extras for profit.",
        },
        {
          action: `Cap administrative costs on the standard benefit, phasing down toward ${show("swissAdminShare")} of premiums.`,
          owner: "Regulator",
          when: "Years 1–4",
          tradeoff: "Plans cut marketing, broker fees, and some care-management staff.",
        },
        {
          action:
            "Amend ERISA so self-insured employer plans meet the standard benefit, cost-sharing cap, and denial rules.",
          owner: "Congress / Labor",
          when: "Months 0–18",
          tradeoff: "Large employers lose some freedom in plan design they have had since 1974.",
        },
      ],
      cost: {
        recurring: HYBRID_COST.lines.find((l) => l.id === "overhead")?.delta ?? 0,
        ledgerNote: `Insurer overhead on private plans changes by ${H.overhead} a year once the limit and lower prices apply.`,
      },
      pros: [
        { point: "Ends medical underwriting and plans designed to avoid sick people." },
        { point: `Cuts private insurer overhead by about ${H.overhead.replace("−", "")} a year.` },
      ],
      cons: [
        { point: "Insurers fight conversion to nonprofit status." },
        {
          point: "Tight administrative limits can squeeze useful care management along with waste.",
        },
      ],
      tradeoffs: [
        "Nonprofit plans vs. investor-owned plans: less profit leakage, but less capital and possibly less innovation in plan services.",
      ],
      risks: [
        {
          risk: "Insurers shift profit into owned providers and pharmacies to evade the limit.",
          mitigation: "Count related-party payments in the administrative limit and audit them.",
        },
      ],
      precedent: [
        "The ACA's medical-loss ratio rule (2011) already limits insurer overhead as a share of premiums.",
      ],
      dependsOn: ["create-regulator"],
      sourceIds: ["overhead-mlr-swiss-federal-council-sw-2024", "cmwf-netherlands-2026"],
      extras: {
        riskIds: ["hy-insurer-resistance"],
        tradeoffIds: ["hy-insurer-jobs"],
        international: [
          {
            country: "Switzerland",
            approach:
              "Basic insurance sold by insurers that may not profit from it, under federal supervision.",
            result: `Administrative costs were ${show("swissAdminShare")} of basic-insurance premiums in 2023.`,
            lesson: "Nonprofit basic insurance can keep overhead low with many insurers.",
            sourceIds: ["overhead-mlr-swiss-federal-council-sw-2024"],
          },
          {
            country: "Netherlands",
            approach:
              "Private nonprofit insurers must accept every applicant at one premium per plan.",
            result: "Universal coverage through competing private plans.",
            lesson:
              "Guaranteed issue plus one premium per plan works when everyone must be insured.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
    {
      id: "risk-adjustment",
      title: "Set up risk adjustment between plans",
      summary:
        "Because plans must take everyone at one premium, a plan that attracts sicker members would lose money. A national risk-adjustment fund moves money from plans with healthier members to plans with sicker ones, so plans compete on service instead of on avoiding sick people.",
      legalVehicle: "Title III; regulator rules building on the ACA's risk-adjustment program.",
      owner: "Regulator",
      timeline: "Months 6–18",
      tasks: [
        {
          action:
            "Build a risk model from diagnoses, age, and prior use, audited to resist upcoding.",
          owner: "Regulator",
          when: "Months 6–15",
          tradeoff:
            "Diagnosis-based models invite coding games; simpler models leave more selection.",
        },
        {
          action:
            "Collect enrollment and claims data from every regulated plan into the risk-adjustment system.",
          owner: "Regulator / plans",
          when: "Months 9–18",
          tradeoff: "More data sharing raises privacy stakes.",
        },
        {
          action: "Run a dry year: compute transfers without paying them, and publish the results.",
          owner: "Regulator",
          when: "Months 12–18",
          tradeoff: "Delays real transfers but catches errors before money moves.",
        },
      ],
      cost: {
        recurring: 0,
        ledgerNote:
          "Transfers between plans net to zero; the system build is inside the eligibility and data systems cost.",
      },
      pros: [
        { point: "Removes the reward for avoiding sick people." },
        { point: "Makes guaranteed issue and one premium per plan workable." },
      ],
      cons: [{ point: "Risk scores create an incentive to code patients as sicker." }],
      tradeoffs: [
        "Precise risk adjustment needs detailed diagnosis data, which invites upcoding; a looser model invites selection.",
      ],
      risks: [
        {
          risk: "Plans upcode diagnoses to raise transfers, as in Medicare Advantage.",
          mitigation: "Audits with extrapolated recoveries and two years of diagnosis data.",
        },
      ],
      precedent: [
        "The ACA has run risk adjustment in the individual and small-group markets since 2014.",
      ],
      dependsOn: ["create-regulator", "eligibility-data-hub"],
      sourceIds: ["cmwf-netherlands-2026", "medpac-2026"],
      extras: {
        riskIds: ["hy-selection"],
        international: [
          {
            country: "Netherlands",
            approach:
              "Contributions go into a central fund that pays insurers according to their members' health risk.",
            result: "Insurers can take everyone at one premium.",
            lesson: "Pool contributions centrally and pay plans by risk.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
          {
            country: "Germany",
            approach:
              "Sickness funds are paid from a central fund adjusted for members' morbidity.",
            result: "Funds compete without screening applicants.",
            lesson: "Morbidity-based adjustment is central to a multi-payer system.",
            sourceIds: ["cmwf-germany-2026"],
          },
        ],
      },
    },
    {
      id: "income-based-premiums",
      title: "Set income-based premiums and subsidies",
      summary:
        "People in the regulated plans pay a premium capped at a share of income; federal subsidies pay the rest, through the tax system as ACA tax credits do today. People with employer coverage keep paying their share as they do now.",
      legalVehicle: "Title IV: amendments to the ACA premium tax credit (IRC §36B).",
      owner: "Treasury / regulator",
      timeline: "Months 6–18",
      tasks: [
        {
          action: "Set the income-based premium cap and a zero premium below a set income.",
          owner: "Treasury / regulator",
          when: "Months 6–12",
          tradeoff: "A higher cap lowers federal cost but makes coverage less affordable.",
        },
        {
          action:
            "Pay subsidies in advance to plans each month, reconciled at tax time without clawbacks for small changes.",
          owner: "Treasury",
          when: "Months 9–18",
          tradeoff:
            "Smaller clawbacks cost more but stop people dropping coverage for fear of a tax bill.",
        },
      ],
      cost: {
        recurring: HYBRID_COST.lines.find((l) => l.id === "coverage")?.federal ?? 0,
        ledgerNote: `Federal subsidies for the newly covered are at most ${H.coverageFederal} a year (an upper bound, assuming government pays the whole premium).`,
      },
      pros: [
        { point: "Premiums people can afford, without a new broad tax." },
        { point: "Builds on the ACA's tax-credit machinery instead of new systems." },
      ],
      cons: [{ point: "Premiums remain a bill that people can fall behind on." }],
      tradeoffs: [
        "Income-based premiums vs. tax financing: they keep the break-even rule but leave a premium bill in place.",
      ],
      risks: [
        {
          risk: "People skip premiums and lose coverage.",
          mitigation:
            "Zero premium below a set income, automatic payment from withholding, and no loss of coverage for arrears.",
        },
      ],
      precedent: [
        "ACA premium tax credits since 2014; Dutch health care allowances for lower-income households.",
      ],
      dependsOn: ["create-regulator"],
      sourceIds: ["kff-marketplace-2026", "cmwf-netherlands-2026"],
      extras: {
        decisionIds: ["hy-premiums"],
        international: [
          {
            country: "Netherlands",
            approach: `Everyone pays a community-rated premium (about EUR ${show("nlAvgPremiumEur2025")} a year in 2025); lower-income households get a health care allowance.`,
            result: "Universal coverage with premiums as a visible price.",
            lesson: "Allowances must rise with premiums or affordability erodes.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
          {
            country: "Germany",
            approach:
              "Contributions are a share of wages, split with employers, plus a supplementary rate set by each fund.",
            result: "Payments rise with income automatically.",
            lesson: "Tie what people pay to income, not to their health.",
            sourceIds: ["cmwf-germany-2026"],
          },
        ],
      },
    },
    {
      id: "employer-mandate",
      title: `Keep the employer mandate for firms with ${show("employerMandateThreshold")}+ workers`,
      summary: `Employers with ${show("employerMandateThreshold")} or more full-time workers keep offering coverage that meets the standard benefit, as under the ACA. Their workers keep their plans, doctors, and payment rates, which is what keeps their specialist waits from moving. Coverage becomes portable: someone who changes jobs keeps their plan until the new employer's starts.`,
      legalVehicle: "Keeps IRC §4980H; Title III adds the standard-benefit and portability rules.",
      owner: "Treasury / Labor / regulator",
      timeline: "Months 0–18",
      tasks: [
        {
          action:
            "Keep the employer shared-responsibility payment and update the affordability test.",
          owner: "Treasury",
          when: "Months 0–12",
          tradeoff: "Employers near the threshold keep facing a cost cliff, as they do today.",
        },
        {
          action:
            "Let workers who leave a job keep their plan at the regulated premium until new coverage starts.",
          owner: "Regulator / Labor",
          when: "Months 6–18",
          tradeoff: "Plans carry some people who leave employers; risk adjustment covers the cost.",
        },
      ],
      cost: {
        recurring: 0,
        ledgerNote: "No new federal cost: employers keep paying for their plans.",
      },
      pros: [
        { point: "No disruption for people who like their employer plan." },
        { point: "Keeps employer money in the system without a new payroll tax." },
      ],
      cons: [
        { point: "Coverage stays tied to large employers, so job lock eases but doesn't end." },
        { point: "Keeps thousands of employer plans and their administrative cost." },
      ],
      tradeoffs: [
        "Keeping employer plans protects their members' access and avoids a payroll tax, at the cost of the administrative savings a single payer would bring.",
      ],
      risks: [
        {
          risk: "Employers drop coverage and pay the penalty instead, pushing workers into subsidized plans.",
          mitigation:
            "Set the penalty near the average employer premium contribution and index it.",
        },
      ],
      precedent: ["The ACA employer mandate since 2015."],
      dependsOn: ["define-benefits"],
      sourceIds: ["irs-employer-mandate"],
      extras: {
        decisionIds: ["hy-employer-role"],
        tradeoffIds: ["hy-choice"],
        riskIds: ["hy-employer-dropping"],
        international: [
          {
            country: "Germany",
            approach: "Employers pay half of the wage-based contribution for their workers.",
            result: "Employers stay a major funder of coverage.",
            lesson: "Employer money can stay in a universal system.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Netherlands",
            approach: "Employers pay an income-related contribution into the central fund.",
            result: "Coverage doesn't depend on which employer you work for.",
            lesson: "Employer money can fund coverage without employers choosing the plan.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
    {
      id: "eligibility-data-hub",
      title: "Build the shared eligibility and data service",
      summary:
        "One service tells any provider, in real time, which plan a person has, and feeds automatic enrollment and risk adjustment. Plans keep their own claims systems; claims and data follow one national standard so providers bill every plan the same way.",
      legalVehicle: "Title II; HIPAA transaction-standard updates.",
      owner: "Regulator / CMS",
      timeline: "Months 3–18",
      tasks: [
        {
          action: "Build a real-time eligibility service and provider portal covering every plan.",
          owner: "Regulator / CMS",
          when: "Months 3–15",
          tradeoff: "A central service is a single point of failure; it needs redundancy.",
        },
        {
          action:
            "Require one claim format, one set of codes, and one prior-authorization standard across plans.",
          owner: "HHS",
          when: "Months 6–18",
          tradeoff: "Plans lose the ability to use custom rules as a cost-control tool.",
        },
        {
          action: "Test at full load with independent verification before the plans open.",
          owner: "Regulator",
          when: "Months 12–18",
          tradeoff: "Testing time delays launch; skipping it risks a HealthCare.gov-style failure.",
        },
      ],
      cost: {
        oneTime: hybridOneTime("hy-systems"),
        ledgerNote: `${fmt(hybridOneTime("hy-systems"))} one-time for the eligibility service, risk-adjustment system, testing, and security.`,
      },
      pros: [
        { point: "Providers check coverage once, for every plan." },
        { point: "Far smaller than building a national claims system." },
      ],
      cons: [{ point: "Billing complexity across many plans remains, only standardized." }],
      tradeoffs: [
        "Standardizing claims cuts some billing cost but keeps much of it; one claims system would cut more.",
      ],
      risks: [
        {
          risk: "The service fails at launch.",
          mitigation:
            "Full-load testing, staged launch, and a fallback that treats people as covered.",
        },
      ],
      precedent: ["HealthCare.gov's failed launch in 2013 and its recovery."],
      dependsOn: ["create-regulator"],
      sourceIds: [],
      extras: {
        tradeoffIds: ["hy-admin"],
        riskIds: ["hy-it"],
        international: [
          {
            country: "Germany",
            approach: "An electronic health card identifies each member's sickness fund.",
            result: "Providers verify coverage at the point of care.",
            lesson: "One identifier across plans is enough; one payer isn't required.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Netherlands",
            approach: "Insurers exchange standardized claims and enrollment data with providers.",
            result: "Many insurers, one data standard.",
            lesson: "Standards, not a single system, cut friction.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
    {
      id: "auto-enrollment",
      title: "Enroll the uninsured automatically",
      summary: `Everyone without employer coverage, Medicare, or Medicaid is enrolled automatically in a regulated plan from tax and benefit records, with a zero premium below a set income. ${H.newlyCovered} people are newly covered. Anyone who shows up for care uninsured is enrolled on the spot.`,
      legalVehicle: "Title II; data-sharing authority with IRS, SSA, and states.",
      owner: "Regulator, IRS, SSA, states",
      timeline: "Months 6–18, then continuously",
      tasks: [
        {
          action:
            "Match tax, Social Security, and state records to find everyone without coverage.",
          owner: "Regulator / IRS / SSA",
          when: "Months 6–12",
          tradeoff: "Data matching raises privacy concerns and misses people outside the records.",
        },
        {
          action:
            "Assign each uninsured person a default plan in their region, with 90 days to switch.",
          owner: "Regulator",
          when: "Months 12–18",
          tradeoff: "Default assignment may put people in plans that don't include their doctors.",
        },
        {
          action: "Enroll people at the point of care, with retroactive coverage for the visit.",
          owner: "Regulator / providers",
          when: "Day 1",
          tradeoff: "Some ineligible people get care before eligibility is checked.",
        },
        {
          action: "Fund in-person assisters and a multilingual campaign for hard-to-reach groups.",
          owner: "Regulator",
          when: "Months 9–36",
          tradeoff: "Outreach costs money that reaches fewer people per dollar each year.",
        },
      ],
      cost: {
        oneTime: hybridOneTime("hy-enrollment"),
        ledgerNote: `${fmt(hybridOneTime("hy-enrollment"))} one-time for cards, outreach, and assisters. Care for the newly covered adds ${H.coverage} a year to national spending.`,
      },
      pros: [
        { point: `Covers ${H.newlyCovered} people without anyone having to apply.` },
        { point: "Avoids the gaps that come from enrollment that depends on people signing up." },
      ],
      cons: [{ point: "Some people will be enrolled in plans they didn't choose." }],
      tradeoffs: [
        "Automatic enrollment vs. an individual mandate: it reaches more people without penalties, but people may not know they're covered.",
      ],
      risks: [
        {
          risk: "People enrolled automatically don't know they are covered and don't use their plan.",
          mitigation: "Cards, notices, and enrollment at the point of care.",
        },
      ],
      precedent: [
        "Medicare enrolls people automatically at 65.",
        "The Netherlands identifies uninsured residents and enrolls them.",
      ],
      dependsOn: ["eligibility-data-hub", "income-based-premiums"],
      sourceIds: ["auto-enrollment-commonwealth-fund-2026", "census-p60-291"],
      extras: {
        decisionIds: ["hy-eligibility"],
        tradeoffIds: ["hy-coverage"],
        riskIds: ["hy-enrollment-gaps"],
        international: [
          {
            country: "Netherlands",
            approach: "Identifies uninsured residents and can collect premiums from wages.",
            result: "Very few people remain uninsured.",
            lesson: "Automatic enrollment backed by data works in a multi-payer system.",
            sourceIds: ["auto-enrollment-commonwealth-fund-2026"],
          },
          {
            country: "Germany",
            approach:
              "Insurance is compulsory; the state contributes for the long-term unemployed.",
            result: `About ${show("germanyCovered")} of residents are covered.`,
            lesson: "Make coverage the default and pay for those who can't.",
            sourceIds: ["cmwf-germany-2026"],
          },
        ],
      },
    },
    {
      id: "national-formulary",
      title: "Negotiate drug prices for every payer",
      summary: `Extend Medicare's drug-price negotiation so the negotiated price applies to every plan and employer plan, not only Medicare. National spending on drugs changes by ${H.drugs} a year, of which ${H.drugsFederal} is federal.`,
      legalVehicle: "Title V: amends the Inflation Reduction Act's negotiation program.",
      owner: "CMS",
      timeline: "Months 0–24, then annually",
      tasks: [
        {
          action: "Raise the number of drugs negotiated each year and apply prices to all payers.",
          owner: "CMS",
          when: "Months 0–24",
          tradeoff: "Lower prices may mean somewhat fewer new drugs over decades.",
        },
        {
          action: "Use technology assessment of added benefit to set the ceiling for each drug.",
          owner: "CMS / technology-assessment institute",
          when: "Months 6–24",
          tradeoff:
            "Drugs with little added benefit get low prices, which manufacturers will contest.",
        },
      ],
      cost: {
        recurring: HYBRID_COST.lines.find((l) => l.id === "drugPrices")?.delta ?? 0,
        ledgerNote: `${H.drugs} a year nationally, ${H.drugsFederal} federal.`,
      },
      pros: [
        { point: "The largest single saving in the hybrid." },
        { point: "Every patient benefits, not only Medicare's." },
      ],
      cons: [{ point: "Drug makers sue and lobby hard." }],
      tradeoffs: ["Lower drug prices vs. some reduction in new-drug development."],
      risks: [
        {
          risk: "Manufacturers delay launches or withdraw drugs from the U.S.",
          mitigation: "Launch rules and supply monitoring.",
        },
      ],
      precedent: ["Medicare's first negotiated prices took effect in 2026."],
      dependsOn: ["hta-institute"],
      sourceIds: ["cms-negotiation", "rand-drugs-2024", "cbo-ira-new-drugs-2023"],
      extras: {
        decisionIds: ["hy-drug-pricing"],
        riskIds: ["hy-drug-launch"],
        international: [
          {
            country: "Germany",
            approach:
              "New drugs are assessed for added benefit; prices are then negotiated for all sickness funds.",
            result: "One negotiated price for the whole statutory system.",
            lesson: "Assessment plus negotiation works across many payers.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "U.S. Medicare",
            approach:
              "Negotiates prices for a limited list of drugs under the Inflation Reduction Act.",
            result: "First negotiated prices in 2026.",
            lesson: "The machinery exists; the hybrid widens it to all payers.",
            sourceIds: ["cms-negotiation"],
          },
        ],
      },
    },
    {
      id: "hta-institute",
      title: "Create the technology-assessment institute",
      summary:
        "An independent institute assesses whether new drugs, devices, and procedures work better than what exists, and at what cost. Its findings set drug-price ceilings and decide what joins the standard benefit.",
      legalVehicle: "Title V.",
      owner: "HHS",
      timeline: "Months 0–18",
      tasks: [
        {
          action: "Set up the institute with published methods and patient and clinician input.",
          owner: "HHS",
          when: "Months 0–12",
          tradeoff: "Assessment slows coverage of new treatments while it runs.",
        },
        {
          action:
            "Assess new drugs within months of approval, with fast-track coverage while assessment runs.",
          owner: "Institute",
          when: "Month 12 onward",
          tradeoff:
            "Fast-track coverage costs money for treatments that may prove of little value.",
        },
      ],
      cost: { recurring: 0, ledgerNote: "Funded inside the regulator's budget." },
      pros: [{ point: "Prices and coverage follow evidence." }],
      cons: [{ point: "Critics will call it rationing." }],
      tradeoffs: ["Evidence-based coverage vs. faster access to every new treatment."],
      risks: [
        {
          risk: "Assessments are seen as rationing care.",
          mitigation: "No cost-per-QALY cutoffs; clinician exceptions for individual patients.",
        },
      ],
      precedent: ["Germany's IQWiG; England's NICE."],
      dependsOn: [],
      sourceIds: [],
      extras: {
        international: [
          {
            country: "Germany",
            approach: "IQWiG assesses added benefit; the Federal Joint Committee decides.",
            result: "Benefit assessment feeds price negotiation.",
            lesson: "Separate assessment from the price decision.",
          },
          {
            country: "England",
            approach: "NICE appraises cost-effectiveness for the NHS.",
            result: "Clear rules, with recurring controversy over rejected drugs.",
            lesson: "Transparency and exceptions reduce backlash.",
          },
        ],
      },
    },
    {
      id: "commercial-price-cap",
      title: `Cap commercial prices at ${show("commercialPriceCap", "pct")} of Medicare`,
      summary: `Commercial insurers and employer plans may not pay more than ${show("commercialPriceCap", "pct")} of Medicare rates. Only the highest prices fall: ${H.priceCap} a year, mostly hospital care. Employer plans still pay well above public plans, so their members keep their place in line, as private patients do in Germany.`,
      legalVehicle: "Title V; regulator rules; phased in over several years.",
      owner: "Regulator",
      timeline: "Published in Year 0; phased in over Years 1–4",
      tasks: [
        {
          action: "Publish the cap and the phase-in schedule, starting above the final level.",
          owner: "Regulator",
          when: "Months 6–18",
          tradeoff: "A slower phase-in protects hospitals but delays the savings.",
        },
        {
          action:
            "Ban contract terms that get around the cap, such as facility fees and bundling games.",
          owner: "Regulator / FTC",
          when: "Months 6–18",
          tradeoff: "More rules for hospitals' billing departments to follow.",
        },
      ],
      cost: {
        recurring: HYBRID_COST.lines.find((l) => l.id === "providerPrices")?.delta ?? 0,
        ledgerNote: `${H.priceCap} a year once fully phased in. Using the average price understates the savings.`,
      },
      pros: [
        { point: "Cuts only the highest prices; most providers see no change." },
        { point: "Lowers employer premiums." },
      ],
      cons: [{ point: "High-priced hospitals lose revenue and will fight it." }],
      tradeoffs: [
        "A cap instead of one rate for everyone: smaller savings, but employer plans keep their payment edge, which keeps their members' waits short.",
      ],
      risks: [
        {
          risk: "Hospitals that depend on high commercial prices cut services or close.",
          mitigation: "Phase in over several years; rural and safety-net exceptions.",
        },
      ],
      precedent: [
        "Montana's and Oregon's state-employee plans pay hospitals a set multiple of Medicare.",
      ],
      dependsOn: ["create-regulator"],
      sourceIds: ["rand-hospital-2024"],
      extras: {
        decisionIds: ["hy-price-setting"],
        tradeoffIds: ["hy-provider-income", "hy-waits"],
        riskIds: ["hy-hospital-revenue"],
        international: [
          {
            country: "Germany",
            approach:
              "Statutory funds pay a uniform fee schedule; private insurers pay higher fees.",
            result: `Private patients get appointments faster: statutory patients waited ${show("germanyPrivateWaitRatio")} as long in one calling study.`,
            lesson: "A payment edge for one group buys that group faster access.",
            sourceIds: ["lungen-waits-2008"],
          },
          {
            country: "U.S. state employee plans",
            approach: "Montana and Oregon pay hospitals a multiple of Medicare.",
            result: "The state plans saved money.",
            lesson: "Reference pricing to Medicare is workable at scale.",
            sourceIds: ["rand-hospital-2024"],
          },
        ],
      },
    },
    {
      id: "tax-legislation",
      title: "Enact the top-end taxes",
      summary: `New federal costs are paid only by people with very high incomes: a ${show("surtaxRate")} surtax on income above ${show("surtaxThreshold")}, and taxing capital gains and dividends as ordinary income above ${show("surtaxThreshold")}. Together they raise ${H.topEnd} a year against ${H.federal} of new federal cost, a surplus of ${H.surplus}. No household below ${show("surtaxThreshold")} of income pays a new tax, which meets the owner's ${show("breakEvenFloor")} rule.`,
      legalVehicle: "Title VI: Internal Revenue Code amendments.",
      owner: "Congress / Treasury",
      timeline: "Months 0–12; in force from Year 1",
      tasks: [
        {
          action: `Enact the ${show("surtaxRate")} surtax on adjusted gross income above ${show("surtaxThreshold")}.`,
          owner: "Congress",
          when: "Month 0",
          tradeoff: "High earners shift income and timing to avoid it; revenue is uncertain.",
        },
        {
          action: `Tax capital gains and qualified dividends as ordinary income above ${show("surtaxThreshold")}.`,
          owner: "Congress",
          when: "Month 0",
          tradeoff: "Investors may hold assets longer to defer gains.",
        },
        {
          action:
            "Use any surplus to lower the surtax rate or build a reserve, reviewed each year.",
          owner: "Treasury",
          when: "Year 2 onward",
          tradeoff: "A reserve guards against overruns; a lower rate returns money to taxpayers.",
        },
      ],
      cost: {
        recurring: 0,
        ledgerNote: `${H.topEnd} a year of new revenue against ${H.federal} of new federal cost.`,
      },
      pros: [
        { point: `No new tax for any household below ${show("surtaxThreshold")} of income.` },
        { point: "Revenue rises with the incomes that have grown fastest." },
      ],
      cons: [
        { point: "Top-end revenue swings with the stock market." },
        { point: "The estimates have wide uncertainty from behavior and avoidance." },
      ],
      tradeoffs: [
        "Funding only from the top keeps the break-even rule, but ties health funding to a narrow, volatile tax base.",
      ],
      risks: [
        {
          risk: "Revenue falls short in a downturn.",
          mitigation: "Keep the surplus as a reserve before cutting the rate.",
        },
      ],
      precedent: [
        "The net investment income tax (2013) already funds Medicare from investment income.",
      ],
      dependsOn: [],
      sourceIds: ["tpc-surtax", "jct-capital-gains"],
      extras: {
        decisionIds: ["hy-financing"],
        tradeoffIds: ["hy-taxes"],
        riskIds: ["hy-revenue"],
        international: [
          {
            country: "Germany",
            approach: "Funds health care mostly from wage contributions shared with employers.",
            result: "Broad, stable funding that every worker pays.",
            lesson: "Broad funding is stabler; the hybrid trades that for the break-even rule.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Netherlands",
            approach: "Premiums, an income-related employer contribution, and government grants.",
            result: "Funding shared across households, employers, and taxpayers.",
            lesson: "Most systems spread the cost more widely than the hybrid does.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
    {
      id: "data-privacy",
      title: "Set data governance & privacy rules",
      summary:
        "The eligibility service, risk adjustment, and enrollment matching move more health and tax data than today. One privacy law covers all of it, including health apps and data brokers outside HIPAA.",
      legalVehicle: "Title VII.",
      owner: "HHS / FTC",
      timeline: "Months 0–18",
      tasks: [
        {
          action: "Limit each data flow to its purpose, with audit logs and penalties for misuse.",
          owner: "HHS / FTC",
          when: "Months 0–12",
          tradeoff: "Strict limits slow research and fraud detection.",
        },
        {
          action: "Extend privacy protections to health apps and data brokers.",
          owner: "FTC",
          when: "Months 6–18",
          tradeoff: "Tech companies lose some business models.",
        },
      ],
      cost: { recurring: 0, ledgerNote: "Regulatory; no separate cost." },
      pros: [{ point: "Public trust in the data flows the system needs." }],
      cons: [{ point: "More compliance work for plans and providers." }],
      tradeoffs: ["Privacy vs. data for research and fraud control."],
      risks: [
        {
          risk: "A breach of the eligibility service exposes millions of records.",
          mitigation: "Security standards, minimal data, and breach penalties.",
        },
      ],
      precedent: ["HIPAA (1996) covers insurers and providers but not most apps or brokers."],
      dependsOn: [],
      sourceIds: ["hhs-breach-report-2024"],
      extras: {
        international: [
          {
            country: "European Union",
            approach: "The GDPR treats health data as a special category with strict limits.",
            result: "Strong protections, with friction for research.",
            lesson: "Purpose limits work if research has a clear legal path.",
          },
          {
            country: "Germany",
            approach: "Digital health records lag other European countries.",
            result: "Privacy concerns slowed the electronic record.",
            lesson: "Privacy rules shouldn't stall the basic data the system needs.",
            sourceIds: ["cmwf-germany-2026"],
          },
        ],
      },
    },
  ],
}
