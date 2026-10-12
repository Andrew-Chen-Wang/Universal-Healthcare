import type { Phase } from "../types"
import { MODEL, fmt, oneTime, sourceLine } from "./helpers"

export const PHASE_4: Phase = {
  id: "universal",
  number: 4,
  title: "Wave 4: everyone",
  window: "Year 4",
  goal: "Cover the remaining adults, end job-based insurance, fold Medicaid into UHP, and switch every tax to its full rate.",
  exitCriteria: [
    "100% of residents enrolled; uninsured rate effectively zero.",
    "No employer plans for UHP-covered services remain.",
    "State MOE payments flowing from every participating state.",
    "Ledger matches actual spending within ±5% by line.",
  ],
  steps: [
    {
      id: "final-wave",
      title: "Enroll everyone remaining",
      summary: "Adults 19–34 and anyone not yet enrolled join. About 80 million people.",
      legalVehicle: "Universal Health Act, Title VIII.",
      owner: "UHA",
      timeline: "Year 4, Day 1",
      tasks: [
        {
          action:
            "Enroll from IRS, SSA, and employer records; presumptive enrollment at point of care for anyone missed.",
          owner: "UHA",
          when: "Day 1",
        },
        {
          action:
            "Targeted outreach to the hardest to reach: people experiencing homelessness, migrant farmworkers, and people without tax filings, through community health centers and shelters.",
          owner: "UHA / HRSA",
          when: "Year 4",
        },
      ],
      cost: { ledgerNote: "Year 4 reaches 100% of steady-state UHP spending." },
      pros: [{ point: "The uninsured rate goes from 28.0M people (8.2%) to near zero." }],
      cons: [
        {
          point:
            "Young adults are healthiest and use the least care; many will pay more in tax than they did in premiums.",
        },
      ],
      tradeoffs: [
        "Young, healthy, higher-income workers subsidize older and sicker people more than in risk-rated insurance. That is the design.",
      ],
      risks: [
        {
          risk: "IT or call-center load at the final wave.",
          mitigation:
            "This is the smallest per-person-cost wave and the system has run for 3 years.",
        },
      ],
      precedent: [],
      dependsOn: ["waves-two-three-enrollment"],
      sourceIds: [],
    },
    {
      id: "end-esi",
      title: "End employer-sponsored insurance for covered services",
      summary: `Job-based coverage for UHP services ends for about 179 million people. Employer premium payments of ${fmt(MODEL.side.oldEmployerPremiums)} (private, federal, state & local) stop; the employer tax (${fmt(MODEL.side.employerTax)}) is at its full rate. Worker premium contributions (${fmt(sourceLine("hhEsi").before)}) end.`,
      legalVehicle: "Universal Health Act, Titles VIII & IX.",
      owner: "Employers; DOL; OPM (FEHB); state & local governments",
      timeline: "Year 4",
      tasks: [
        {
          action:
            "Private employer plans terminate for UHP services; employers may offer supplementary benefits (cosmetic dental, premium eyewear, private rooms).",
          owner: "Employers",
          when: "Day 1",
        },
        {
          action:
            "The Federal Employees Health Benefits program (FEHB, about 8M people) closes; OPM converts the employer contribution to pay or retirement contributions per maintenance-of-compensation rules.",
          owner: "OPM",
          when: "Day 1",
        },
        {
          action:
            "State and local employee and retiree health plans close (teachers, police, firefighters); their premium spending becomes employer tax plus wage conversion.",
          owner: "States / localities",
          when: "Day 1",
        },
        {
          action:
            "Retiree health benefits (pre-65 and Medicare supplements): employers with contractual obligations convert them to cash or pension increases at actuarial value; OPEB liabilities are largely extinguished.",
          owner: "Employers / unions",
          when: "Year 4",
        },
        {
          action:
            "Taft-Hartley multiemployer health funds: convert to supplementary benefits or close, with assets distributed to participants or pension funds by trustee vote.",
          owner: "Trustees / DOL",
          when: "Year 4",
        },
        {
          action: "Self-insured employer stop-loss and TPA contracts end.",
          owner: "Employers",
          when: "Day 1",
        },
      ],
      cost: {
        ledgerNote: `Source lines 'Employer share of job-based insurance premiums' (${fmt(sourceLine("bizEsi").before)}), 'Federal employer premiums (FEHB)' (${fmt(sourceLine("fedEsi").before)}), and 'State & local employer premiums' (${fmt(sourceLine("slEsi").before)}) go to $0.`,
      },
      pros: [
        {
          point:
            "Job lock ends: people can change jobs, start businesses, or retire early without losing coverage.",
        },
        { point: "State and local governments shed large retiree-health (OPEB) liabilities." },
        {
          point:
            "Employers exit the health-benefits business, which most say they don't want to manage.",
        },
      ],
      cons: [
        {
          point: "People with generous employer plans lose them",
          detail:
            "These plans often feature broad networks and fast specialist access, because commercial rates make them the most profitable patients.",
        },
        {
          point:
            "Unions lose a central bargaining issue and the institutional role of running health funds.",
        },
        { point: "Employers lose a recruitment tool (rich benefits)." },
      ],
      tradeoffs: [
        "This is where the trade-off between fast access for employer-insured people and equal access for everyone is sharpest. Under one price for every patient, providers no longer prioritize the commercially insured. Their waits for elective specialist care will likely lengthen modestly, while Medicaid and uninsured people's waits shorten substantially.",
      ],
      risks: [
        {
          risk: "Employer-insured voters' backlash (the largest and most politically engaged group).",
          mitigation:
            "Maintenance of compensation, visible take-home pay increases, and published wait times.",
        },
      ],
      precedent: [
        "No wealthy country has made this exact transition from majority employer coverage. The closest is Taiwan, which merged labor and government employee insurance programs in 1995.",
      ],
      dependsOn: ["employer-coordination", "final-wave"],
      sourceIds: ["kff-ehbs-2025"],
    },
    {
      id: "wind-down-medicaid",
      title: "Fold Medicaid and CHIP into UHP",
      summary: `Medicaid's acute-care and LTSS functions move to UHP. States begin paying the maintenance-of-effort amount (${fmt(MODEL.side.stateMoe)} a year) in place of their Medicaid share. Medicaid managed-care contracts end.`,
      legalVehicle:
        "Universal Health Act, Titles VIII & IX; SSA Title XIX amended to a residual program for non-medical services.",
      owner: "States; UHA",
      timeline: "Year 4 (dual eligibles and children earlier)",
      tasks: [
        {
          action: "Terminate Medicaid MCO contracts with 90-day run-out.",
          owner: "States",
          when: "Year 4",
        },
        {
          action:
            "Keep a residual Medicaid for non-medical supports (housing assistance pilots, non-emergency transportation if not in UHP) at state option with federal match.",
          owner: "States / CMS",
          when: "Year 4",
        },
        {
          action: "Transfer Medicaid provider enrollment and HCBS assessment data to UHA.",
          owner: "States / UHA",
          when: "Year 3–4",
        },
        {
          action: "Begin monthly MOE payments to the Trust Fund.",
          owner: "States",
          when: "Year 4",
        },
        {
          action:
            "Re-deploy or separate state eligibility staff (the worker program covers separated staff).",
          owner: "States",
          when: "Year 4",
        },
        {
          action:
            "Decommission state Medicaid eligibility systems; MMIS systems retained 7 years for audits.",
          owner: "States",
          when: "Years 4–5",
        },
      ],
      cost: {
        oneTime: oneTime("dualSystems") + oneTime("stateWindDown"),
        ledgerNote: `Parallel systems ${fmt(oneTime("dualSystems"))} and state wind-down grants ${fmt(oneTime("stateWindDown"))}, in the transition table.`,
      },
      pros: [
        {
          point:
            "Ends Medicaid's lower payment rates, the main reason 26% of physicians don't accept new Medicaid patients.",
        },
        { point: "Ends redeterminations and churn." },
        { point: "Removes $45.5B of managed-care overhead and $40.1B of Medicaid administration." },
      ],
      cons: [
        {
          point:
            "Medicaid managed-care plans (Centene, Molina, Elevance, UnitedHealthcare) lose a large business.",
        },
        { point: "States lose control over a major program and their ability to tailor it." },
      ],
      tradeoffs: ["National uniformity vs. state flexibility."],
      risks: [
        {
          risk: "States refuse the MOE.",
          mitigation:
            "See the state MOE step; holdout states forfeit LTC coverage and savings sharing.",
        },
      ],
      precedent: [],
      dependsOn: ["state-moe-design", "final-wave"],
      sourceIds: ["holgash-heberlein", "nfib-sebelius"],
    },
    {
      id: "coordinate-other-payers",
      title: "Coordinate with continuing payers: workers' comp, auto, VA, TRICARE, IHS",
      summary: `Several payment systems continue alongside UHP. UHP pays first for every resident and recovers costs from workers' compensation and auto/liability insurers. Workers' comp (${fmt(sourceLine("bizOther").after)}) and the medical portion of auto and property insurance (${fmt(sourceLine("hhPc").after)}) continue. The VA, military health system, and IHS remain delivery systems (${fmt(sourceLine("fedPrograms").after)} in federal programs).`,
      legalVehicle:
        "Universal Health Act, Titles II & VIII; amendments to state workers' compensation and auto insurance laws through federal conditions; 38 U.S.C. (VA); 10 U.S.C. ch. 55 (TRICARE); Indian Health Care Improvement Act.",
      owner:
        "UHA; state workers' comp agencies & insurance regulators; VA; Defense Health Agency; IHS & tribes",
      timeline: "Years 1–4",
      tasks: [
        {
          action:
            "UHP pays first for injuries and recovers from workers' comp and auto/liability insurers at UHP rates (subrogation), so patients never wait for liability decisions.",
          owner: "UHA",
          when: "Year 1",
        },
        {
          action:
            "Require workers' comp and auto insurers to pay UHP fee-schedule rates for medical care they owe.",
          owner: "Congress / states",
          when: "Year 2",
        },
        {
          action:
            "Veterans: enroll all veterans in UHP while keeping VA eligibility; VA Community Care referrals become UHP care; VA keeps specialized services (spinal-cord injury, PTSD, prosthetics).",
          owner: "VA / UHA",
          when: "Year 1",
        },
        {
          action:
            "TRICARE dependents and retirees move to UHP by wave; active-duty care stays with the Defense Health Agency.",
          owner: "DoD / UHA",
          when: "Years 1–4",
        },
        {
          action:
            "IHS & tribal programs: UHP pays IHS, tribal, and urban Indian facilities at UHP rates for eligible patients; formal tribal consultation on implementation.",
          owner: "UHA / IHS / tribes",
          when: "Year 1",
        },
        {
          action:
            "Visitors and short-term residents: emergency care billed to travel insurance; unpaid balances covered by UHP.",
          owner: "UHA",
          when: "Year 1",
        },
      ],
      cost: {
        ledgerNote: `Continuing streams in the ledger: workers' comp etc. ${fmt(sourceLine("bizOther").after)}, auto & property insurance medical ${fmt(sourceLine("hhPc").after)}, VA/DoD/IHS/other federal programs ${fmt(sourceLine("fedPrograms").after)}.`,
      },
      pros: [
        {
          point: "Injured patients get care immediately instead of waiting on liability disputes.",
        },
        { point: "IHS gains a new revenue stream for chronically underfunded care." },
        {
          point:
            "Veterans and military families gain portable coverage without losing VA or military care.",
        },
      ],
      cons: [
        {
          point:
            "Several payment systems remain, so some coordination-of-benefits administration continues.",
        },
        {
          point:
            "VA volume may fall as veterans use closer UHP providers, weakening VA's scale in specialized care.",
        },
      ],
      tradeoffs: [
        "Keeping workers' comp separate preserves employers' financial incentive for workplace safety but keeps a second administrative system; folding it in would be simpler but remove that incentive.",
      ],
      risks: [
        {
          risk: "Cost-shifting from workers' comp and auto insurers to UHP.",
          mitigation:
            "Mandatory subrogation and data matching between UHP claims and injury reports.",
        },
      ],
      precedent: [
        "Canada's provincial plans recover costs from workers' compensation boards; New Zealand's ACC covers all injuries through one no-fault scheme.",
      ],
      dependsOn: ["build-claims-system"],
      sourceIds: [],
    },
    {
      id: "full-tax-rates",
      title: "Switch every tax to its full rate",
      summary: `The employer tax reaches ${(MODEL.rates.employerTaxRate * 100).toFixed(1)}% and the household premium ${(MODEL.rates.householdPremiumRate * 100).toFixed(1)}%. The trust fund starts building its 2-month reserve.`,
      legalVehicle: "Universal Health Act, Title VII.",
      owner: "IRS; Treasury",
      timeline: "Year 4",
      tasks: [
        { action: "Update withholding tables and Form 941 rates.", owner: "IRS", when: "Year 4" },
        {
          action:
            "First full-year trustees report comparing actual revenue and spending against the ledger.",
          owner: "Trustees",
          when: "End of Year 4",
        },
        {
          action:
            "Apply the automatic adjustment rule if actual spending exceeds revenue by more than 3%: raise the household premium rate by up to 0.5 points, after which Congress must act.",
          owner: "Treasury",
          when: "Year 5+",
        },
      ],
      cost: {
        ledgerNote: `Steady state: the ledger. Remaining general-revenue requirement ${fmt(MODEL.gap)}.`,
      },
      pros: [{ point: "Dedicated revenue matches spending, with an automatic stabilizer." }],
      cons: [
        { point: "Automatic tax increases are politically difficult; Congress may override them." },
      ],
      tradeoffs: [],
      risks: [
        {
          risk: "Revenues fall short in a recession.",
          mitigation: "The reserve and counter-cyclical general-revenue transfer.",
        },
      ],
      precedent: [],
      dependsOn: ["tax-legislation"],
      sourceIds: [],
    },
  ],
}
