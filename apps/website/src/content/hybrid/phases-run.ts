/**
 * Hybrid plan, Phases 2–5: open the regulated plans, bring Medicaid and
 * insurers under the standard rules, close the remaining gaps, and run the
 * system.
 */
import { show } from "../constants"
import type { HybridPhase } from "./helpers"
import { H, HYBRID_COST } from "./figures"

export const HY_PHASE_2: HybridPhase = {
  id: "wave-one",
  number: 2,
  title: "Year 1: open the regulated plans",
  window: "Year 1",
  goal: "Open the regulated nonprofit plans, enroll the uninsured automatically, start basic dental, glasses, and hearing aids in every plan, and protect access while demand rises.",
  exitCriteria: [
    "Regulated plans selling in every region, at least two per region.",
    "Uninsured people enrolled; enrollment at the point of care working.",
    "Basic dental, glasses, and hearing aids covered in every plan.",
    "Wait-time registry publishing waits by plan type and region.",
  ],
  steps: [
    {
      id: "open-regulated-plans",
      title: "Open the regulated plans",
      summary:
        "The ACA Marketplaces become the regulated market: every plan there is nonprofit, takes everyone at one premium per region, and sells the standard benefit. Today's insurers can run nonprofit subsidiaries in it. Where fewer than two plans sell, a public plan run by the regulator steps in.",
      legalVehicle: "Title III.",
      owner: "Regulator, state insurance departments",
      timeline: "Year 1, open enrollment before January",
      tasks: [
        {
          action:
            "Approve plans for each region and publish their premiums, networks, and quality data.",
          owner: "Regulator",
          when: "Months −6 to 0",
          tradeoff: "Strict approval keeps out weak plans but can leave thin markets.",
        },
        {
          action: "Contract a public fallback plan in any region with fewer than two plans.",
          owner: "Regulator",
          when: "Months −6 to 0",
          tradeoff: "A public fallback may attract sicker people; risk adjustment has to cover it.",
        },
        {
          action: "Move current Marketplace enrollees into the regulated plans without a gap.",
          owner: "Regulator / plans",
          when: "Months −3 to 0",
          tradeoff: "Some people change plans and doctors in the move.",
        },
      ],
      cost: {
        recurring: 0,
        ledgerNote: "Plans are paid from premiums and subsidies; see the subsidy step.",
      },
      pros: [
        { point: "Builds on the Marketplaces people already know." },
        { point: "Every region gets a plan that must take everyone." },
      ],
      cons: [{ point: "Thin rural markets may have only the fallback plan." }],
      tradeoffs: [
        "Plan choice vs. simplicity: several plans per region means more choice and more paperwork.",
      ],
      risks: [
        {
          risk: "Insurers stay out of the regulated market at first.",
          mitigation: "The public fallback plan and a guaranteed first-year risk corridor.",
        },
      ],
      precedent: ["The ACA Marketplaces opened in 2014 with insurers in every state."],
      dependsOn: ["erisa-and-insurance-law", "risk-adjustment", "auto-enrollment"],
      sourceIds: ["cmwf-netherlands-2026"],
      extras: {
        decisionIds: ["hy-two-tier"],
        tradeoffIds: ["hy-choice"],
        riskIds: ["hy-selection"],
        international: [
          {
            country: "Netherlands",
            approach:
              "A single national market of nonprofit insurers selling the statutory package.",
            result: "Universal coverage through competing plans.",
            lesson: "One national market rule set, many plans.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
          {
            country: "Germany",
            approach: "Nearly everyone can choose among sickness funds.",
            result: "Funds compete on service and supplementary rates.",
            lesson: "Choice among plans can coexist with universal coverage.",
            sourceIds: ["cmwf-germany-2026"],
          },
        ],
      },
    },
    {
      id: "new-benefits-launch",
      title: "Launch basic dental, glasses & hearing aids",
      summary:
        "Every regulated plan and employer plan starts covering preventive and basic dental care, glasses, and hearing aids, with limits. They are paid through premiums like the rest of the standard benefit.",
      legalVehicle: "Standard benefit rules (Title II).",
      owner: "Regulator, plans",
      timeline: "Year 1",
      tasks: [
        {
          action: "Require plans to contract with enough dentists, optometrists, and audiologists.",
          owner: "Regulator",
          when: "Months −6 to 6",
          tradeoff: "Many dentists don't take insurance today; networks will be thin at first.",
        },
        {
          action:
            "Set limits: preventive and basic dental, one pair of glasses a year or two, hearing aids every few years.",
          owner: "Regulator",
          when: "Months −6 to 0",
          tradeoff: "Limits keep premiums down but leave major dental work out.",
        },
      ],
      cost: {
        recurring: HYBRID_COST.lines.find((l) => l.id === "privateDvh")?.delta ?? 0,
        ledgerNote: `${H.privateDvh} a year of national spending, as adults without dental coverage use more care; paid through premiums.`,
      },
      pros: [{ point: "Closes the most common gaps in coverage today." }],
      cons: [{ point: "Raises premiums for plans that didn't cover these before." }],
      tradeoffs: [
        "Basic coverage now vs. full coverage later: covers the common needs within the break-even rule.",
      ],
      risks: [
        {
          risk: "Too few dentists accept the plans.",
          mitigation: "Network-adequacy rules and dental capacity grants.",
        },
      ],
      precedent: ["Many Medicare Advantage plans already offer basic dental, vision, and hearing."],
      dependsOn: ["define-benefits", "open-regulated-plans"],
      sourceIds: [],
      extras: {
        decisionIds: ["hy-benefits"],
        international: [
          {
            country: "Germany",
            approach:
              "Statutory insurance covers basic dental care, with patients paying more for higher-end work.",
            result: "Dental access in the basic package.",
            lesson: "Basic dental fits in a standard benefit with limits.",
          },
          {
            country: "Netherlands",
            approach:
              "Adult dental care is outside the basic package, in voluntary supplementary insurance.",
            result: "Adults without supplementary cover pay for dental care themselves.",
            lesson: "Leaving dental to extras leaves gaps.",
          },
        ],
      },
    },
    {
      id: "wait-time-guarantee",
      title: "Publish waits and guarantee them for the regulated plans",
      summary: `Waits are measured and published by plan type and region. People in the regulated plans get a legal maximum wait for specialist and elective care; if their plan misses it, they can go to any provider and the plan pays. This narrows the gap with employer plans, which keep a payment edge and so keep faster access, as private patients do in Germany, where statutory patients waited ${show("germanyPrivateWaitRatio")} as long in one study.`,
      legalVehicle: "Title III; regulator rules.",
      owner: "Regulator, plans",
      timeline: "Year 1 onward",
      tasks: [
        {
          action:
            "Build a wait-time registry from scheduling data, by specialty, region, and plan type.",
          owner: "Regulator",
          when: "Months −12 to 6",
          tradeoff: "Reporting adds work for practices.",
        },
        {
          action:
            "Set maximum waits for the regulated plans and let patients go elsewhere at the plan's cost when they're missed.",
          owner: "Regulator",
          when: "Year 1",
          tradeoff:
            "Plans pay out-of-network prices when they miss the guarantee, which raises premiums.",
        },
      ],
      cost: { recurring: 0, ledgerNote: "Guarantee payments come from plans' premiums." },
      pros: [
        { point: "Makes the gap between plan types visible and enforceable." },
        { point: "Gives plans a reason to build networks that keep waits down." },
      ],
      cons: [
        { point: "Employer plans still get faster access; the gap narrows but doesn't close." },
      ],
      tradeoffs: [
        "The owner's goal (employer-plan waits barely move) means accepting a gap for the regulated plans; the guarantee limits how wide it gets.",
      ],
      risks: [
        {
          risk: "Plans game the measures, for example by booking placeholder appointments.",
          mitigation: "Few, audited measures.",
        },
      ],
      precedent: [
        "Germany's appointment service centers help statutory patients get specialist appointments.",
      ],
      dependsOn: ["open-regulated-plans"],
      sourceIds: ["lungen-waits-2008", "cmwf-germany-2026"],
      extras: {
        tradeoffIds: ["hy-waits"],
        riskIds: ["hy-two-tier-gap"],
        international: [
          {
            country: "Germany",
            approach:
              "Statutory and private patients share doctors; private patients pay more and are seen sooner.",
            result: `Statutory patients waited ${show("germanyPrivateWaitRatio")} as long in a calling study.`,
            lesson: "A payment edge creates a queue edge; guarantees limit it.",
            sourceIds: ["lungen-waits-2008"],
          },
          {
            country: "Netherlands",
            approach: "Waiting-time standards insurers must meet for their members.",
            result: "Insurers arrange care elsewhere when waits run long.",
            lesson: "Make plans responsible for their members' waits.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
    {
      id: "capacity-expansion",
      title: "Expand capacity before demand peaks",
      summary: `${H.newlyCovered} newly covered people will use more care: about ${H.coverage} a year. Community health centers, primary care, and behavioral health capacity expand where the newly covered live, alongside the workforce pipeline started in Phase 0.`,
      legalVehicle: "Appropriations; HRSA grants.",
      owner: "HRSA, states",
      timeline: "Years 0–3",
      tasks: [
        {
          action:
            "Fund new community health center sites in areas with the most newly covered people.",
          owner: "HRSA",
          when: "Years 0–2",
          tradeoff: "Sites take time to staff; money arrives before clinicians.",
        },
        {
          action:
            "Fund behavioral health and urgent-care capacity to keep new demand out of emergency rooms.",
          owner: "HRSA / states",
          when: "Years 0–3",
          tradeoff: "Spreading money thin across many sites vs. building a few large ones.",
        },
      ],
      cost: {
        recurring: HYBRID_COST.lines.find((l) => l.id === "coverage")?.delta ?? 0,
        ledgerNote: `Care for the newly covered adds ${H.coverage} a year to national spending.`,
      },
      pros: [{ point: "Keeps new demand from lengthening everyone's waits." }],
      cons: [{ point: "Capacity lags coverage for years." }],
      tradeoffs: ["Spend on capacity first vs. lower premiums first."],
      risks: [
        {
          risk: "New demand outruns capacity in some regions.",
          mitigation: "Target grants by the wait-time registry.",
        },
      ],
      precedent: ["The ACA's community health center fund expanded sites as coverage grew."],
      dependsOn: ["workforce-start"],
      sourceIds: ["hadley-holahan-2003"],
      extras: {
        tradeoffIds: ["hy-waits"],
        international: [
          {
            country: "Germany",
            approach: "Large ambulatory and hospital capacity.",
            result: `${show("germanyBedsPer100k")} beds per 100,000 people.`,
            lesson: "Capacity is what keeps waits short.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Massachusetts",
            approach: "Near-universal coverage from 2006 without matching primary-care growth.",
            result: "Demand for primary care rose with coverage.",
            lesson: "Expand capacity with coverage.",
          },
        ],
      },
    },
    {
      id: "medicare-fixes",
      title: "Keep Medicare, fix its payments",
      summary:
        "Medicare stays as it is for people 65 and older, with the Medicare Advantage payment fixes from Phase 0 and negotiated drug prices. Medicare enrollees can keep traditional Medicare or a Medicare Advantage plan.",
      legalVehicle: "Medicare statute amendments in Title V.",
      owner: "CMS",
      timeline: "Year 1 onward",
      tasks: [
        {
          action: "Apply the Medicare Advantage risk-score and audit changes.",
          owner: "CMS",
          when: "Year 1",
          tradeoff: "Plans may cut extra benefits.",
        },
        {
          action:
            "Add basic dental, glasses, and hearing aids to traditional Medicare to match the standard benefit.",
          owner: "CMS",
          when: "Years 1–2",
          tradeoff: `Raises federal spending by up to ${H.medicareDvh} a year.`,
        },
      ],
      cost: {
        recurring:
          (HYBRID_COST.lines.find((l) => l.id === "medicareDvh")?.delta ?? 0) +
          (HYBRID_COST.lines.find((l) => l.id === "maFix")?.delta ?? 0),
        ledgerNote: `Dental, vision, and hearing in Medicare: up to ${H.medicareDvh} a year (CBO, a broader benefit). Medicare Advantage payment fixes: ${H.maFix} a year (CBO).`,
      },
      pros: [{ point: "Seniors keep the program they know." }],
      cons: [{ point: "Medicare's own gaps, like long-term care, stay." }],
      tradeoffs: ["Stability for seniors vs. folding everyone into one system."],
      risks: [
        {
          risk: "Adding dental to Medicare raises federal spending beyond the top-end taxes.",
          mitigation: "Price it before enacting; phase it in.",
        },
      ],
      precedent: ["Medicare Advantage plans commonly offer dental, vision, and hearing extras."],
      dependsOn: ["fix-today"],
      sourceIds: ["medpac-2026"],
      extras: {
        international: [
          {
            country: "Germany",
            approach:
              "Retirees stay in their sickness fund; pensions pay part of their contribution.",
            result: "One system across ages.",
            lesson: "The U.S. keeps a separate program for seniors instead.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Netherlands",
            approach:
              "Older people are in the same insurance market, with long-term care in a separate public scheme.",
            result: "Long-term care funded separately from acute care.",
            lesson: "Long-term care can be decided separately, as the hybrid does.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
  ],
}

export const HY_PHASE_3: HybridPhase = {
  id: "waves-two-three",
  number: 3,
  title: "Years 2–3: bring everyone under the standard rules",
  window: "Years 2–3",
  goal: "Align Medicaid with the standard benefit and continuous coverage, convert insurers' standard-benefit business to nonprofit plans, and phase in the commercial price cap and administrative-cost limits.",
  exitCriteria: [
    "Medicaid uses continuous eligibility and covers the standard benefit.",
    "All standard-benefit plans nonprofit and within the administrative-cost limit.",
    "Commercial price cap at its final level.",
  ],
  steps: [
    {
      id: "medicaid-alignment",
      title: "Align Medicaid with the standard rules",
      summary:
        "Medicaid stays, run by states, with continuous eligibility so people stop losing coverage over paperwork, and it covers at least the standard benefit. States may enroll Medicaid members in the regulated plans instead, paying their premiums.",
      legalVehicle: "Medicaid statute amendments (Title IV).",
      owner: "CMS, states",
      timeline: "Years 1–3",
      tasks: [
        {
          action: "Require 12-month continuous eligibility for all Medicaid and CHIP enrollees.",
          owner: "CMS / states",
          when: "Year 1",
          tradeoff: "Some people stay enrolled after their income rises.",
        },
        {
          action:
            "Let states buy Medicaid members into regulated plans with federal matching funds.",
          owner: "CMS / states",
          when: "Years 2–3",
          tradeoff: "Regulated plans pay more than Medicaid, so costs rise for states that do it.",
        },
      ],
      cost: { recurring: 0, ledgerNote: "States keep funding Medicaid as today." },
      pros: [{ point: "Ends coverage loss at paperwork renewals." }],
      cons: [{ point: "Medicaid's lower payments still limit which doctors take it." }],
      tradeoffs: [
        "Keeping Medicaid avoids a big state-federal reshuffle but keeps its access problems.",
      ],
      risks: [
        {
          risk: "States resist new requirements.",
          mitigation: "Federal matching for the added costs.",
        },
      ],
      precedent: ["Continuous eligibility for children is already required in Medicaid and CHIP."],
      dependsOn: ["open-regulated-plans"],
      sourceIds: ["kff-medicaid-renewals-2026"],
      extras: {
        tradeoffIds: ["hy-equity"],
        international: [
          {
            country: "Germany",
            approach:
              "The state pays contributions for the long-term unemployed into sickness funds.",
            result: "Low-income people are in the same funds as everyone else.",
            lesson: "Buying low-income people into regular plans reduces two-tier access.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Netherlands",
            approach: "Low-income people buy the same plans with an allowance.",
            result: "No separate program for the poor.",
            lesson: "Same plans, different subsidies.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
    {
      id: "insurer-conversion",
      title: "Convert insurers' standard-benefit business to nonprofit plans",
      summary: `Insurers move the standard-benefit business into nonprofit plans and phase administrative costs down toward ${show("swissAdminShare")} of premiums. They can keep selling extras and Medicare Advantage for profit. Private insurer overhead falls by ${H.overhead.replace("−", "")} a year.`,
      legalVehicle: "Title III; state insurance law.",
      owner: "Regulator, state regulators, insurers",
      timeline: "Years 1–3",
      tasks: [
        {
          action:
            "Approve nonprofit conversion plans, with assets dedicated to the standard benefit.",
          owner: "Regulator / state regulators",
          when: "Years 1–2",
          tradeoff: "Shareholders resist; conversion law is complex.",
        },
        {
          action: "Phase in the administrative-cost limit and publish each plan's overhead.",
          owner: "Regulator",
          when: "Years 1–3",
          tradeoff: "Plans cut broker commissions and marketing; some jobs go.",
        },
      ],
      cost: {
        recurring: HYBRID_COST.lines.find((l) => l.id === "overhead")?.delta ?? 0,
        ledgerNote: `Private insurer overhead changes by ${H.overhead} a year.`,
      },
      pros: [{ point: "Profit leaves the standard benefit." }],
      cons: [{ point: "Insurer and broker jobs fall as overhead does." }],
      tradeoffs: ["Lower overhead vs. jobs in insurance and brokerage."],
      risks: [
        {
          risk: "Insurers exit the standard market instead of converting.",
          mitigation:
            "Public fallback plans and nonprofit entrants such as Blue Cross plans and provider-sponsored plans.",
        },
      ],
      precedent: ["Many Blue Cross Blue Shield plans began as nonprofits."],
      dependsOn: ["erisa-and-insurance-law"],
      sourceIds: ["overhead-mlr-swiss-federal-council-sw-2024"],
      extras: {
        tradeoffIds: ["hy-insurer-jobs"],
        riskIds: ["hy-insurer-resistance"],
        international: [
          {
            country: "Switzerland",
            approach:
              "Insurers sell basic insurance without profit and supplementary insurance for profit.",
            result: `Administrative costs of ${show("swissAdminShare")} of basic premiums.`,
            lesson: "Separate the nonprofit standard benefit from for-profit extras.",
            sourceIds: ["overhead-mlr-swiss-federal-council-sw-2024"],
          },
          {
            country: "Netherlands",
            approach: "Statutory insurers are nonprofit; many are cooperatives.",
            result: "Competition without shareholder profit on the basic package.",
            lesson: "Nonprofit insurers can still compete hard.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
    {
      id: "price-cap-phase-in",
      title: "Phase the commercial price cap to its final level",
      summary: `The cap starts above ${show("commercialPriceCap", "pct")} of Medicare and steps down over Years 1–4, so high-priced hospitals have time to adjust. Rural and safety-net hospitals can apply for exceptions.`,
      legalVehicle: "Regulator rules under Title V.",
      owner: "Regulator",
      timeline: "Years 1–4",
      tasks: [
        {
          action: "Step the cap down each year and publish which hospitals are affected.",
          owner: "Regulator",
          when: "Years 1–4",
          tradeoff: "Each step hits the same high-priced hospitals.",
        },
        {
          action: "Review exceptions for rural and safety-net hospitals with low margins.",
          owner: "Regulator",
          when: "Years 1–4",
          tradeoff: "Exceptions reduce savings and invite lobbying.",
        },
      ],
      cost: { recurring: 0, ledgerNote: `Savings reach ${H.priceCap} a year at the final level.` },
      pros: [{ point: "Gives hospitals time to cut costs instead of services." }],
      cons: [{ point: "Savings arrive slowly." }],
      tradeoffs: ["Speed of savings vs. hospital stability."],
      risks: [
        {
          risk: "Hospitals cut unprofitable services first.",
          mitigation: "Service-line monitoring and exceptions.",
        },
      ],
      precedent: ["Maryland phased in all-payer hospital rates over decades."],
      dependsOn: ["commercial-price-cap"],
      sourceIds: ["rand-hospital-2024"],
      extras: {
        tradeoffIds: ["hy-provider-income"],
        riskIds: ["hy-hospital-revenue"],
        international: [
          {
            country: "U.S. Maryland",
            approach: "All-payer hospital rate setting, introduced gradually.",
            result: "A state commission sets hospital prices for every payer.",
            lesson: "Gradual phase-in keeps hospitals stable.",
          },
          {
            country: "Germany",
            approach: "Uniform fee schedules for statutory funds, with higher private fees.",
            result: "Providers rely on private fees for part of their income.",
            lesson: "A price gap between payers persists by design.",
            sourceIds: ["cmwf-germany-2026"],
          },
        ],
      },
    },
  ],
}

export const HY_PHASE_4: HybridPhase = {
  id: "universal",
  number: 4,
  title: "Year 4: everyone covered",
  window: "Year 4",
  goal: "Close the remaining gaps, coordinate with the programs that continue separately, and bring the top-end taxes to full strength.",
  exitCriteria: [
    "Everyone eligible enrolled, including immigrants after the residence period and territory residents.",
    "Coordination rules with workers' compensation, VA, TRICARE, and the Indian Health Service in force.",
    "Top-end taxes at full rate; surplus policy decided.",
  ],
  steps: [
    {
      id: "final-wave",
      title: "Close the remaining coverage gaps",
      summary:
        "Residents who were waiting out the residence period, territory residents, and anyone still missed are enrolled. Territories get state-like funding.",
      legalVehicle: "Titles II and IV.",
      owner: "Regulator, territories",
      timeline: "Year 4",
      tasks: [
        {
          action: "Enroll immigrants who complete the residence period.",
          owner: "Regulator",
          when: "Year 4",
          tradeoff: "Covering all residents raises federal cost and political opposition.",
        },
        {
          action: "Give the territories state-like Medicaid funding and regulated plans.",
          owner: "CMS / territories",
          when: "Years 3–4",
          tradeoff: "Raises federal spending in the territories.",
        },
      ],
      cost: { recurring: 0, ledgerNote: "Included in coverage costs." },
      pros: [{ point: "Coverage becomes universal." }],
      cons: [{ point: "Immigrant coverage stays politically contested." }],
      tradeoffs: ["Universality vs. concerns about drawing migration."],
      risks: [
        {
          risk: "Some people still slip through.",
          mitigation: "Enrollment at the point of care.",
        },
      ],
      precedent: [
        "Several states cover all low-income residents regardless of immigration status.",
      ],
      dependsOn: ["auto-enrollment"],
      sourceIds: ["kff-immigrant-coverage-facts", "kff-territories-medicaid"],
      extras: {
        tradeoffIds: ["hy-coverage", "hy-equity"],
        international: [
          {
            country: "Netherlands",
            approach:
              "Separate programs cover uninsured migrants and some groups outside the main system.",
            result: "Safety nets for people the main system misses.",
            lesson: "Keep a backstop for people outside the standard rules.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
          {
            country: "Germany",
            approach: "Compulsory coverage for all residents since 2009.",
            result: `About ${show("germanyCovered")} of residents covered.`,
            lesson: "Make coverage a duty of residence.",
            sourceIds: ["cmwf-germany-2026"],
          },
        ],
      },
    },
    {
      id: "coordinate-other-payers",
      title: "Coordinate with continuing payers: workers' comp, auto, VA, TRICARE, IHS",
      summary:
        "Workers' compensation, auto insurance, the VA, TRICARE, and the Indian Health Service continue. Coordination rules decide who pays first, and the standard claims format applies to them too.",
      legalVehicle: "Title VII.",
      owner: "Regulator, VA, DoD, IHS, states",
      timeline: "Years 3–4",
      tasks: [
        {
          action: "Set who pays first between regulated plans and each continuing payer.",
          owner: "Regulator",
          when: "Year 3",
          tradeoff: "Coordination disputes add billing work.",
        },
        {
          action: "Let veterans and tribal members keep VA or IHS care and also enroll in a plan.",
          owner: "VA / IHS / regulator",
          when: "Year 4",
          tradeoff: "Dual coverage costs more but protects access.",
        },
      ],
      cost: { recurring: 0, ledgerNote: "No new cost; these programs continue." },
      pros: [{ point: "Programs people rely on continue unchanged." }],
      cons: [{ point: "Coordination between payers remains complex." }],
      tradeoffs: ["Continuity for these programs vs. simplicity of one payer."],
      risks: [
        {
          risk: "Gaps when payers dispute who pays.",
          mitigation: "The regulated plan pays first and recovers later.",
        },
      ],
      precedent: ["Medicare's coordination-of-benefits rules."],
      dependsOn: ["open-regulated-plans"],
      sourceIds: [],
      extras: {
        international: [
          {
            country: "Germany",
            approach:
              "Occupational accident insurance pays for work injuries separately from sickness funds.",
            result: "Clear rules on who pays first.",
            lesson: "Separate payers can coexist with clear coordination.",
          },
          {
            country: "Canada",
            approach: "Provincial plans pay first; workers' compensation reimburses work injuries.",
            result: "Patients rarely see the coordination.",
            lesson: "Pay first, sort out later.",
          },
        ],
      },
    },
    {
      id: "full-tax-rates",
      title: "Bring the top-end taxes to full strength",
      summary: `The surtax and capital-gains change reach full revenue, ${H.topEnd} a year against ${H.federal} of new federal cost. The surplus of ${H.surplus} is held as a reserve against shortfalls and reviewed each year.`,
      legalVehicle: "Title VI.",
      owner: "Treasury",
      timeline: "Year 4",
      tasks: [
        {
          action: "Report revenue against federal costs each year.",
          owner: "Treasury",
          when: "Year 4 onward",
          tradeoff: "Annual reviews invite annual fights.",
        },
        {
          action: "Lower the surtax rate if the reserve exceeds a set size.",
          owner: "Congress / Treasury",
          when: "Year 4 onward",
          tradeoff: "A lower rate leaves less cushion for downturns.",
        },
      ],
      cost: { recurring: 0, ledgerNote: `${H.topEnd} a year of revenue at full strength.` },
      pros: [
        { point: "The new costs are fully funded without touching households below the line." },
      ],
      cons: [{ point: "Revenue swings with markets." }],
      tradeoffs: ["Reserve vs. lower rates."],
      risks: [
        {
          risk: "Revenue falls in a recession just as coverage costs rise.",
          mitigation: "The reserve.",
        },
      ],
      precedent: ["Medicare's trust funds hold reserves against shortfalls."],
      dependsOn: ["tax-legislation"],
      sourceIds: ["tpc-surtax", "jct-capital-gains"],
      extras: {
        tradeoffIds: ["hy-taxes"],
        riskIds: ["hy-revenue"],
        international: [
          {
            country: "Germany",
            approach:
              "Sickness funds keep liquidity reserves; the federal government adds grants in bad years.",
            result: "Reserves smooth shortfalls.",
            lesson: "Hold reserves against volatile revenue.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Netherlands",
            approach: "Government grants supplement the central fund.",
            result: "General revenue backs the system.",
            lesson: "A backstop beyond the dedicated tax helps.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
  ],
}

export const HY_PHASE_5: HybridPhase = {
  id: "stabilize",
  number: 5,
  title: "Stabilize & govern",
  window: "Year 5 onward",
  goal: "Keep costs, quality, and waits on track, evaluate the results, and decide long-term care.",
  exitCriteria: [
    "Spending-growth target set and reported.",
    "Independent evaluation published.",
    "Long-term care funding decided.",
  ],
  steps: [
    {
      id: "spending-target",
      title: "Set a spending growth target",
      summary:
        "A public target for national health spending growth, tied to GDP. If spending runs above it, the regulator tightens the price cap and drug negotiation.",
      legalVehicle: "Title VIII.",
      owner: "Regulator",
      timeline: "Year 5 onward",
      tasks: [
        {
          action: "Set and publish the target and report against it each year.",
          owner: "Regulator",
          when: "Year 5",
          tradeoff: "A tight target squeezes providers; a loose one doesn't bind.",
        },
      ],
      cost: { recurring: 0, ledgerNote: "No direct cost." },
      pros: [{ point: "Keeps savings from eroding over time." }],
      cons: [{ point: "Targets in multi-payer systems are hard to enforce." }],
      tradeoffs: ["Cost control vs. provider income."],
      risks: [
        {
          risk: "The target is ignored.",
          mitigation: "Automatic tightening of the cap when it's missed.",
        },
      ],
      precedent: ["Massachusetts' health care cost-growth benchmark (2012)."],
      dependsOn: ["commercial-price-cap"],
      sourceIds: [],
      extras: {
        tradeoffIds: ["hy-cost"],
        riskIds: ["hy-cost-overrun"],
        international: [
          {
            country: "Germany",
            approach: "Contribution rates and fee schedules adjust to keep funds solvent.",
            result: "Supplementary contribution rates rose in 2025 as costs grew.",
            lesson: "Without a target, costs show up as higher contributions.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Netherlands",
            approach: "Agreements with providers on spending growth.",
            result: "Premiums still rose faster than inflation from 2020 to 2025.",
            lesson: "Targets help but don't stop growth by themselves.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
    {
      id: "program-integrity",
      title: "Run program integrity & fraud control",
      summary:
        "Audits of risk-adjustment coding, administrative-cost reporting, and the price cap, with analytics across every plan's claims.",
      legalVehicle: "Title VIII.",
      owner: "Regulator, HHS OIG",
      timeline: "Year 1 onward",
      tasks: [
        {
          action: "Audit risk scores with extrapolated recoveries.",
          owner: "Regulator",
          when: "Year 2 onward",
          tradeoff: "Audits cost money and burden plans.",
        },
        {
          action: "Analyze claims across all plans for fraud patterns.",
          owner: "Regulator / OIG",
          when: "Year 2 onward",
          tradeoff: "Cross-plan data raises privacy concerns.",
        },
      ],
      cost: { recurring: 0, ledgerNote: "Funded inside the regulator's budget." },
      pros: [{ point: "Protects the risk-adjustment money and the cap." }],
      cons: [{ point: "More reporting for plans." }],
      tradeoffs: ["Integrity vs. administrative burden."],
      risks: [
        {
          risk: "Upcoding drains the risk-adjustment fund.",
          mitigation: "Audits and two years of diagnosis data.",
        },
      ],
      precedent: ["Medicare Advantage risk-adjustment audits (RADV)."],
      dependsOn: ["risk-adjustment"],
      sourceIds: ["medpac-2026"],
      extras: {
        international: [
          {
            country: "Netherlands",
            approach: "Insurers check providers' claims; a national authority supervises insurers.",
            result: "Two layers of checks.",
            lesson: "Plans and the regulator both police fraud.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
          {
            country: "Germany",
            approach: "Morbidity-based payments to funds are audited for coding.",
            result: "Coding incentives managed through audits.",
            lesson: "Risk adjustment needs audits from the start.",
            sourceIds: ["cmwf-germany-2026"],
          },
        ],
      },
    },
    {
      id: "evaluation-review",
      title: "Run an independent evaluation and a Year-10 review",
      summary:
        "An independent evaluator tracks coverage, waits by plan type, spending, health outcomes, and household costs by income, and reports to Congress, including whether the break-even and wait-time goals are met.",
      legalVehicle: "Title VIII.",
      owner: "Independent evaluator",
      timeline: "Year 1 onward; full review in Year 10",
      tasks: [
        {
          action: "Publish annual results on waits, costs, and household outcomes by income.",
          owner: "Evaluator",
          when: "Year 2 onward",
          tradeoff: "Honest reporting can be used against the program.",
        },
      ],
      cost: { recurring: 0, ledgerNote: "Small; inside the regulator's budget." },
      pros: [{ point: "Shows whether the owner's goals are met." }],
      cons: [{ point: "Results take years." }],
      tradeoffs: ["Patience vs. early judgments."],
      risks: [
        {
          risk: "Early results are read as failure.",
          mitigation: "Publish what was expected each year in advance.",
        },
      ],
      precedent: ["The Oregon Medicaid experiment's published evaluations."],
      dependsOn: [],
      sourceIds: [],
      extras: {
        international: [
          {
            country: "Netherlands",
            approach:
              "The 2006 reform was evaluated repeatedly and adjusted, including cost sharing.",
            result: "Rules changed in response, such as the planned lower deductible.",
            lesson: "Build in reviews and change course.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
          {
            country: "Germany",
            approach: "Reforms adjust contributions, fees, and hospital structures over time.",
            result: "Ongoing adjustment.",
            lesson: "No design is final.",
            sourceIds: ["cmwf-germany-2026"],
          },
        ],
      },
    },
    {
      id: "malpractice-pilot",
      title: "Pilot a no-fault patient compensation system (optional)",
      summary:
        "States can pilot compensating injured patients without proving fault, paired with safety learning, as an alternative to malpractice suits.",
      legalVehicle: "Title VIII grants to states.",
      owner: "States, HHS",
      timeline: "Year 5 onward",
      tasks: [
        {
          action: "Fund state pilots and evaluate them.",
          owner: "HHS / states",
          when: "Year 5 onward",
          tradeoff: "Trial lawyers oppose it; more patients get compensated, with smaller awards.",
        },
      ],
      cost: { recurring: 0, ledgerNote: "Pilot grants; small." },
      pros: [{ point: "Faster compensation and more learning from errors." }],
      cons: [{ point: "Smaller awards for some patients." }],
      tradeoffs: ["Broad, fast compensation vs. large individual awards."],
      risks: [
        {
          risk: "Pilots are too small to show results.",
          mitigation: "Statewide pilots with evaluation.",
        },
      ],
      precedent: ["Virginia and Florida birth-injury compensation programs."],
      dependsOn: [],
      sourceIds: [],
      extras: {
        international: [
          {
            country: "Sweden",
            approach: "Patient insurance compensates avoidable injuries without fault.",
            result: "Many more claims, smaller awards, more learning.",
            lesson: "No-fault works with safety feedback.",
          },
          {
            country: "New Zealand",
            approach: "A national accident compensation scheme covers treatment injuries.",
            result: "Lawsuits for medical injury are largely barred.",
            lesson: "Trade suits for broad coverage.",
          },
        ],
      },
    },
    {
      id: "ongoing-capacity-planning",
      title: "Plan capacity regionally",
      summary:
        "Use the wait-time registry and population data to plan workforce and facilities by region, so waits stay down as the population ages.",
      legalVehicle: "Title VIII.",
      owner: "Regulator, states, HRSA",
      timeline: "Year 5 onward",
      tasks: [
        {
          action: "Publish regional capacity plans tied to measured waits.",
          owner: "Regulator / HRSA",
          when: "Year 5 onward",
          tradeoff: "Planning can lag fast changes in demand.",
        },
      ],
      cost: { recurring: 0, ledgerNote: "Inside the regulator's and HRSA's budgets." },
      pros: [{ point: "Keeps waits from creeping up." }],
      cons: [{ point: "Plans don't build facilities; others must." }],
      tradeoffs: ["Central planning vs. market entry."],
      risks: [
        {
          risk: "Plans aren't followed by funding.",
          mitigation: "Tie HRSA grants to the plans.",
        },
      ],
      precedent: ["Germany's hospital plans are set by the states."],
      dependsOn: ["wait-time-guarantee"],
      sourceIds: ["cmwf-germany-2026"],
      extras: {
        tradeoffIds: ["hy-waits"],
        international: [
          {
            country: "Germany",
            approach: "States plan hospital capacity.",
            result: `High capacity: ${show("germanyBedsPer100k")} beds per 100,000.`,
            lesson: "Planning keeps capacity, sometimes too much.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Canada",
            approach: "Provinces plan capacity within fixed budgets.",
            result: "Long waits when budgets are tight.",
            lesson: "Plans need funding behind them.",
          },
        ],
      },
    },
    {
      id: "ltc-decision",
      title: "Decide how to fund long-term care",
      summary:
        "Long-term care stays as today in the hybrid: Medicare post-acute care and Medicaid after people spend down their savings. This step decides what comes next. Germany and the Netherlands fund long-term care with their own payroll contributions, which would break the owner's break-even rule; top-end taxes alone can't cover a full benefit.",
      legalVehicle: "A separate future act.",
      owner: "Congress, HHS",
      timeline: "Year 5 onward",
      tasks: [
        {
          action:
            "Publish options and costs: social insurance, catastrophic coverage after a waiting period, or expanded Medicaid home care.",
          owner: "HHS",
          when: "Year 5",
          tradeoff: "Each option trades breadth against who pays.",
        },
        {
          action: "Decide the funding source and whether to relax the break-even rule for it.",
          owner: "Congress",
          when: "Year 5 onward",
          tradeoff: "A broad contribution covers more but reaches households below the line.",
        },
      ],
      cost: {
        recurring: 0,
        ledgerNote: `Not decided, so not in the totals. Catastrophic insurance: about ${H.ltcCatastrophic} a year. Full public long-term care: ${H.ltcFullFederal} a year of federal cost.`,
      },
      pros: [{ point: "Keeps the first stages affordable within the break-even rule." }],
      cons: [
        { point: "Families keep spending down their savings for care until this is decided." },
      ],
      tradeoffs: ["Affordable first stages vs. leaving the biggest uncovered risk for later."],
      risks: [
        {
          risk: "The decision never comes.",
          mitigation: "A required report with a deadline.",
        },
      ],
      precedent: [
        "Germany's long-term care insurance (1995); the Netherlands' long-term care act.",
      ],
      dependsOn: [],
      sourceIds: ["cmwf-germany-2026", "cmwf-netherlands-2026"],
      extras: {
        international: [
          {
            country: "Germany",
            approach: "Mandatory long-term care insurance, a separate contribution, since 1995.",
            result: "Universal long-term care coverage with capped benefits.",
            lesson: "A dedicated contribution funds it; that conflicts with the break-even rule.",
            sourceIds: ["cmwf-germany-2026"],
          },
          {
            country: "Netherlands",
            approach: "An income-based contribution funds long-term care.",
            result: "Broad long-term care coverage.",
            lesson: "Long-term care needs its own funding.",
            sourceIds: ["cmwf-netherlands-2026"],
          },
        ],
      },
    },
  ],
}
