import type { Phase } from "../types"
import { show } from "../constants"
import { MODEL, fmt, oneTime, service, sourceLine } from "./helpers"

const dental = service("dental")
const dme = service("durableEquipment")

export const PHASE_2: Phase = {
  id: "wave-one",
  number: 2,
  title: "Wave 1: seniors, near-seniors, and children",
  window: "Year 1",
  goal: "Cover the 176 million people who are 55+ or under 19, upgrade Medicare into UHP, and prove the system works at scale.",
  exitCriteria: [
    "Claims paid within 14 days (clean claims) at 95%+.",
    "No measurable drop in physician participation among those who accepted Medicare.",
    "Wait-time registry live in every region with baseline data.",
    "Medicare Advantage and Medigap contracts ended without coverage gaps.",
  ],
  steps: [
    {
      id: "medicare-upgrade",
      title: "Upgrade Medicare enrollees into UHP",
      summary:
        "All 67 million Medicare enrollees move into UHP on day one. Part B and Part D premiums, deductibles, and coinsurance end. Dental, vision, and hearing are added.",
      legalVehicle:
        "Universal Health Act, Title VIII (transition); repeal of SSA §§1839, 1860D-13 premiums.",
      owner: "UHA",
      timeline: "Year 1, Day 1",
      tasks: [
        {
          action:
            "Convert Medicare Beneficiary Identifiers into UHP numbers (same number, new card).",
          owner: "UHA",
          when: "Month 15–18 of build",
        },
        {
          action: "Stop Part B premium deductions from Social Security checks.",
          owner: "SSA",
          when: "Day 1",
        },
        {
          action:
            "Medicare Advantage: no new contract year after Year 1. MA enrollees stay in their plan for Year 1 (to avoid mid-year disruption), and plans are paid on UHP rates through capitation. Plans end on the last day of Year 1.",
          owner: "UHA",
          when: "Year 1",
        },
        {
          action:
            "Part D plans: drugs move to the national formulary on Day 1; Part D sponsors administer run-out claims for 90 days.",
          owner: "UHA",
          when: "Day 1",
        },
        {
          action:
            "Medigap: policies terminate on Day 1; insurers refund unearned premiums pro rata within 60 days.",
          owner: "State regulators",
          when: "Day 1",
        },
        {
          action:
            "Dual eligibles (Medicare + Medicaid, about 12M): UHP covers all medical and long-term services; state Medicaid's role ends except the MOE payment.",
          owner: "UHA / states",
          when: "Day 1",
        },
        {
          action:
            "Mail every beneficiary a plain-language letter: what changes, what doesn't, and that their doctors are already in UHP.",
          owner: "UHA",
          when: "Month 16",
        },
      ],
      cost: {
        ledgerNote: `The ledger's elimination of 'Medicare Part B & D premiums' (${fmt(sourceLine("hhSmi").before)} → $0) and the Medicare Advantage/Part D plan overhead share of the 'Net cost of insurance' line.`,
      },
      pros: [
        {
          point: "Seniors immediately save their premiums",
          detail: `Part B alone was ${show("partBMonthly")} a month in 2025, or $2,220 a year per person.`,
        },
        {
          point:
            "Ends the Medigap market, where premiums can rise with age and underwriting can deny coverage after the open-enrollment window.",
        },
        { point: "Adds dental, vision, and hearing, which traditional Medicare excludes." },
      ],
      cons: [
        {
          point:
            "About 33 million MA enrollees lose plans with high reported satisfaction, care coordination, and extra benefits (gym memberships, OTC allowances, transportation).",
        },
        {
          point:
            "Plans' disease-management and home-visit programs end; UHP and providers must replace them.",
        },
      ],
      tradeoffs: [
        "Ending MA saves about 20% per enrollee relative to the MA payment premium (MedPAC), but removes a product many seniors chose.",
      ],
      risks: [
        {
          risk: "Care disruption for frail MA enrollees in care-management programs.",
          mitigation:
            "Transfer care-management data to the patient's primary-care practice; integrated care organizations can absorb MA plan clinical staff.",
        },
      ],
      precedent: ["Taiwan merged 10+ existing insurance programs into NHI on one day in 1995."],
      dependsOn: ["create-uha", "build-claims-system", "auto-enrollment"],
      sourceIds: ["medpac-2025"],
    },
    {
      id: "wave-one-enrollment",
      title: "Enroll children and adults 55–64",
      summary:
        "About 73 million children and 42 million adults aged 55–64 join. Children's Medicaid and CHIP coverage converts automatically, and private family coverage stops covering children.",
      legalVehicle: "Universal Health Act, Title VIII.",
      owner: "UHA; employers; states",
      timeline: "Year 1, Day 1",
      tasks: [
        {
          action: "Convert children in Medicaid and CHIP (about 37M) automatically.",
          owner: "UHA / states",
          when: "Day 1",
        },
        {
          action:
            "Enroll privately insured children and adults 55–64 from IRS and employer records. Employer plans may not cover them for UHP services after Day 1.",
          owner: "UHA / employers",
          when: "Day 1",
        },
        {
          action:
            "Employers re-price family coverage for workers who still have it: children are removed, and premiums drop accordingly.",
          owner: "Employers / insurers",
          when: "Day 1",
        },
        {
          action:
            "Pediatric dental and vision: participating pediatric dentists are paid from Day 1.",
          owner: "UHA",
          when: "Day 1",
        },
        {
          action: "Newborns: enrolled at birth from the hospital's birth record; no application.",
          owner: "UHA / hospitals",
          when: "Day 1",
        },
      ],
      cost: {
        ledgerNote:
          "Phase-in spending is in the transition schedule (Year 1 covers about 63% of steady-state UHP spending).",
      },
      pros: [
        { point: "Covers every child, ending a gap where about 4 million children are uninsured." },
        {
          point:
            "Adults 55–64 are the most expensive group in the individual market; moving them first lowers premiums for everyone still in it.",
        },
      ],
      cons: [
        {
          point:
            "Mixed-coverage households: parents in employer plans, kids in UHP. This is confusing for a few years.",
        },
        { point: "Front-loads cost: this is the most expensive age group to cover." },
      ],
      tradeoffs: [
        "Relief for the oldest and youngest first vs. the fiscal ease of covering cheaper, younger adults first.",
      ],
      risks: [
        {
          risk: "Employers don't pass child-premium savings to workers.",
          mitigation: "Maintenance-of-compensation rule (next step).",
        },
      ],
      precedent: [
        "The Medicare for All Act covers children and lowers the Medicare age in Year 1.",
      ],
      dependsOn: ["medicare-upgrade"],
      sourceIds: ["sanders-m4a"],
    },
    {
      id: "employer-coordination",
      title: "Enforce maintenance of compensation",
      summary: `Employers that paid health premiums must convert their savings into wages or other compensation. In steady state employers paid ${fmt(MODEL.side.oldEmployerPremiums)} in premiums (private, federal, state & local) and owe ${fmt(MODEL.side.employerTax)} in the new tax; ${(MODEL.rates.wagePassThrough * 100).toFixed(0)}% of the difference is assumed to reach paychecks.`,
      legalVehicle:
        "Universal Health Act, Title VIII; DOL enforcement; collective bargaining law (NLRA).",
      owner: "DOL Wage & Hour Division; employers; unions",
      timeline: "Years 1–4 (requirement lasts 3 years after each worker's wave)",
      tasks: [
        {
          action:
            "Require employers to report per-worker health premium contributions in the last full year before each worker's wave (from W-2 box 12, code DD).",
          owner: "IRS / DOL",
          when: "Year 0",
        },
        {
          action:
            "For 3 years after each wave, employers must pay each affected worker at least: prior premium contribution − new employer tax attributable to that worker, as wages, retirement contributions, or other benefits.",
          owner: "Employers",
          when: "Each wave",
        },
        {
          action:
            "Union contracts: savings are added to the bargaining table as wages or pensions; reopener clauses triggered by law.",
          owner: "Unions / employers",
          when: "Each wave",
        },
        {
          action: "Worker-paid premiums end; paycheck deductions stop, raising take-home pay.",
          owner: "Employers",
          when: "Each wave",
        },
        {
          action: "Complaint and audit system with back-pay remedies.",
          owner: "DOL",
          when: "Year 1+",
        },
      ],
      cost: {
        ledgerNote: `This is what generates ${fmt(MODEL.side.newlyTaxableWages)} in newly taxable wages and the ${fmt(sourceLine("hhIncomeTax").after)} income-tax line.`,
      },
      pros: [
        { point: "Workers get a raise equal to the health benefit they used to receive in-kind." },
        { point: "Addresses the union objection that 'we traded wages for these benefits'." },
      ],
      cons: [
        { point: "Complex to administer for employers with varied plans and turnover." },
        { point: "After 3 years, enforcement ends and pass-through depends on labor markets." },
      ],
      tradeoffs: [
        "Mandating compensation conversion vs. letting markets do it: mandates are certain but bureaucratic.",
      ],
      risks: [
        {
          risk: "Employers with low-wage workers and no previous coverage now face a new tax with no offsetting savings.",
          mitigation:
            "The $250k payroll exemption shields the smallest firms; for others, long-run wage incidence is the honest answer (see trade-offs).",
        },
      ],
      precedent: [
        "Hawaii's Prepaid Health Care Act (1974) mandated employer coverage, with wage effects that studies found modest.",
      ],
      dependsOn: ["tax-legislation"],
      sourceIds: ["baicker-chandra"],
    },
    {
      id: "hospital-transition-fund",
      title: "Run the Hospital Transition Fund",
      summary:
        "Hospitals whose revenue falls more than 5% below baseline when commercial rates disappear receive temporary support that tapers to zero by Year 6, conditioned on cost-reduction plans.",
      legalVehicle: "Universal Health Act, Title VIII.",
      owner: "UHA regional offices",
      timeline: "Years 1–5",
      tasks: [
        {
          action: "Compute each hospital's projected UHP revenue vs. its 2024 baseline revenue.",
          owner: "UHA",
          when: "Year 0",
        },
        {
          action:
            "Pay 75% of the shortfall beyond 5% in Year 1, tapering to 50%, 30%, 15%, and 0%.",
          owner: "UHA",
          when: "Years 1–5",
        },
        {
          action:
            "Require each recipient to file a cost-alignment plan (admin reductions, service-line consolidation, executive compensation limits).",
          owner: "Hospitals",
          when: "Year 1",
        },
        {
          action:
            "Bar recipients from paying bonuses to executives above $1M while receiving funds.",
          owner: "UHA",
          when: "Year 1+",
        },
      ],
      cost: {
        oneTime: oneTime("hospitalFund"),
        ledgerNote: `${fmt(oneTime("hospitalFund"))} total, in the transition table.`,
      },
      pros: [
        {
          point: "Prevents abrupt closures while hospitals cut billing overhead (8.5% of revenue).",
          detail: "Jiwani et al. 2014.",
        },
        { point: "Conditions money on restructuring." },
      ],
      cons: [
        {
          point: "Rewards hospitals that charged the highest commercial prices",
          detail: "They get the most transition money.",
        },
        { point: "Temporary funds create pressure to make them permanent." },
      ],
      tradeoffs: ["Stability vs. rewarding past market power."],
      risks: [{ risk: "Lobbying to extend the fund.", mitigation: "Hard statutory sunset." }],
      precedent: [
        "Medicare's 'hold harmless' payments during the outpatient PPS transition (2000s).",
      ],
      dependsOn: ["hospital-global-budgets"],
      sourceIds: ["jiwani-2014", "rand-hospital-2024"],
    },
    {
      id: "wait-time-guarantee",
      title: "Launch the wait-time guarantee",
      summary:
        "Legally binding maximum waits, monitored in a national registry. If UHP misses the standard, the patient may go to any provider, including opted-out providers, and UHP pays up to 150% of its rate.",
      legalVehicle: "Universal Health Act, Title III (patient rights).",
      owner: "UHA Office of Patient Advocacy; regional offices",
      timeline: "Year 1 (registry), Year 2 (enforceable guarantee)",
      tasks: [
        {
          action:
            "Set maximum waits: urgent care same day; primary care 7 days (non-urgent) and 48 hours (acute); specialist consult 30 days; elective surgery or procedure 90 days after decision to treat; diagnostic imaging 21 days; cancer treatment 14 days from diagnosis; mental health intake 14 days.",
          owner: "UHA / clinical panel",
          when: "Year 0",
        },
        {
          action:
            "Build the national wait-time registry: every referral and scheduled procedure is time-stamped through the claims and encounter system.",
          owner: "UHA",
          when: "Year 1",
        },
        {
          action: "Publish waits by region, specialty, and provider monthly.",
          owner: "UHA",
          when: "Year 1+",
        },
        {
          action:
            "Activate the guarantee: patients past the maximum get a voucher to any provider; the cost is charged back to the regional budget, which pressures regions to fund capacity.",
          owner: "UHA",
          when: "Year 2",
        },
        {
          action:
            "Create clinical triage: urgent cases are categorized by clinicians, and the guarantee runs from the triage decision.",
          owner: "UHA / providers",
          when: "Year 1",
        },
      ],
      cost: {
        oneTime: oneTime("evaluation"),
        ledgerNote: `Registry and evaluation ${fmt(oneTime("evaluation"))} one-time. Voucher payments are inside benefits spending; in the costly case, higher utilization covers this.`,
      },
      pros: [
        { point: "A concrete, enforceable answer to 'Canada's waits'." },
        {
          point: "Gives UHP a financial incentive to fund capacity instead of rationing by queue.",
        },
      ],
      cons: [
        { point: "Measurement can be gamed (e.g., delaying the 'decision to treat' date)." },
        { point: "Vouchers to opted-out providers at 150% may make opting out more attractive." },
      ],
      tradeoffs: [
        "Firm guarantees cost more when capacity is short, but without them waits grow silently.",
      ],
      risks: [
        {
          risk: "Guarantees are routinely missed and become meaningless (as with the NHS's 18-week target).",
          mitigation:
            "Automatic payment, not discretionary; the cost falls on the regional budget.",
        },
      ],
      precedent: [
        "Denmark: a 30-day treatment guarantee, after which patients may use private hospitals at public expense.",
        "Sweden: a 0-7-90-90 care guarantee.",
        "NHS England: 18-week referral-to-treatment standard (met for about 59% of patients in 2025, against a 92% target).",
      ],
      dependsOn: ["build-claims-system"],
      sourceIds: ["nhs-rtt", "fraser-2025"],
    },
    {
      id: "capacity-expansion",
      title: "Expand capacity before demand peaks",
      summary: `Utilization rises by ${fmt(MODEL.headline.utilizationEffect)} a year at steady state. Without more clinicians and facilities, that demand turns into longer waits. This step funds training slots, scope-of-practice changes, and facilities in shortage areas.`,
      legalVehicle:
        "Universal Health Act, Title VIII; Public Health Service Act Titles VII & VIII; Medicare GME (SSA §1886(h)).",
      owner: "HRSA; UHA; states (scope of practice)",
      timeline: "Year 0 onward; continuous",
      tasks: [
        {
          action: `Fund ${show("residencySlots")} new residency positions over 5 years, prioritizing primary care, psychiatry, OB-GYN, and general surgery.`,
          owner: "UHA / CMS GME",
          when: "Years 0–5",
        },
        {
          action:
            "Tuition-free medical, dental, and nursing school for graduates who serve 4 years in shortage areas (expanded National Health Service Corps).",
          owner: "HRSA",
          when: "Year 1+",
        },
        {
          action:
            "Encourage states (via grants) to give nurse practitioners and physician assistants full practice authority, and dental therapists a defined scope.",
          owner: "States / HRSA",
          when: "Years 1–3",
        },
        {
          action: "Fund 1,000 new or expanded community health center sites, plus dental clinics.",
          owner: "HRSA",
          when: "Years 1–5",
        },
        {
          action:
            "Capital grants for ambulatory surgery, imaging (MRI, CT), and dialysis in regions with the longest waits.",
          owner: "UHA regional capital boards",
          when: "Years 1–5",
        },
        {
          action: "Rural & safety-net capital fund for at-risk hospitals.",
          owner: "UHA",
          when: "Years 1–5",
        },
        {
          action:
            "Fast-track licensing for internationally trained physicians and nurses with supervised practice pathways (as Tennessee and others began in 2023–24).",
          owner: "States / Congress",
          when: "Years 1–3",
        },
        {
          action:
            "Raise home-care aide pay through the 5% HCBS rate increase, and fund aide training.",
          owner: "UHA / states",
          when: "Year 1+",
        },
      ],
      cost: {
        oneTime: oneTime("capacity") + oneTime("ruralCapital"),
        recurring: MODEL.useLines.find((l) => l.id === "workforce")!.after,
        ledgerNote: `${fmt(oneTime("capacity") + oneTime("ruralCapital"))} one-time capital in the transition table, plus ${fmt(MODEL.useLines.find((l) => l.id === "workforce")!.after)} a year recurring in the ledger line 'Workforce capacity investment'.`,
      },
      pros: [
        {
          point:
            "Addresses the main cause of long waits in Canada and the UK: too little capacity, not single payer per se.",
        },
        {
          point:
            "The U.S. already has a projected shortage of up to 86,000 physicians by 2036 (AAMC), so this is needed regardless.",
        },
      ],
      cons: [
        { point: "Training takes 4–11 years, so capacity lags demand by years." },
        { point: "Scope-of-practice expansion is opposed by physician groups." },
      ],
      tradeoffs: [
        "Spending more on capacity raises costs now, but it is the only durable way to keep waits short with zero cost sharing.",
      ],
      risks: [
        {
          risk: "Demand surge in Years 1–4 outpaces capacity growth.",
          mitigation:
            "Phase-in by age spreads the surge; telehealth; triage; the wait-time guarantee.",
        },
      ],
      precedent: [
        "Canada cut medical-school enrollment in the 1990s to control costs; the result was long-term shortages.",
        "OECD comparisons show the U.S. has far more MRI and CT units per capita than Canada or the UK, so the U.S. starts from higher diagnostic capacity.",
      ],
      dependsOn: [],
      sourceIds: ["aamc-shortage", "hrsa-nursing", "oecd-health-2025"],
    },
    {
      id: "new-benefits-launch",
      title: "Launch dental, vision & hearing benefits",
      summary: `Adult dental, vision, and hearing are the largest benefit additions. Dental spending rises from ${fmt(dental.baselineTotal)} to ${fmt(dental.newTotal)}, and durable equipment (eyeglasses, hearing aids) from ${fmt(dme.baselineTotal)} to ${fmt(dme.newTotal)}.`,
      legalVehicle: "Universal Health Act, Title III.",
      owner: "UHA; Rates Board",
      timeline: "Year 1 for Wave 1 populations",
      tasks: [
        {
          action:
            "Define dental coverage: two cleanings a year, X-rays, fillings, extractions, root canals, crowns (non-cosmetic), dentures, periodontal care, and medically necessary orthodontics.",
          owner: "UHA / clinical panel",
          when: "Year 0",
        },
        {
          action:
            "Define vision: an annual eye exam and one pair of basic glasses or a contact-lens allowance every 2 years.",
          owner: "UHA",
          when: "Year 0",
        },
        {
          action:
            "Define hearing: an exam every 3 years and hearing aids every 5 years (basic model; premium models are an out-of-pocket upgrade).",
          owner: "UHA",
          when: "Year 0",
        },
        {
          action:
            "Enroll dentists (about 200,000) and optometrists; most don't bill Medicare today.",
          owner: "UHA",
          when: "Year 0–1",
        },
      ],
      cost: {
        recurring: dental.delta + dme.delta,
        ledgerNote: "Ledger lines 'Dental services' and 'Durable medical equipment'.",
      },
      pros: [
        {
          point:
            "Ends a major gap in Medicare and for working adults: dental is the most commonly skipped care because of cost.",
        },
        { point: "Untreated hearing loss is linked to social isolation and cognitive decline." },
      ],
      cons: [
        {
          point:
            "Dentists accustomed to cash and private-pay fees face lower fees in some cases, and many may limit UHP patients.",
        },
        {
          point:
            "Dental capacity is limited: a 35% utilization jump means longer waits for routine dental care.",
        },
      ],
      tradeoffs: [
        "Coverage breadth vs. access: covering dental doesn't guarantee a dentist has a slot.",
      ],
      risks: [
        {
          risk: "Low dentist participation (Medicaid dental participation is about 1 in 3 dentists).",
          mitigation: "Fees at 95% of average private fees, far above Medicaid's ~60%.",
        },
      ],
      precedent: [
        "UK NHS dentistry: banded patient charges and well-documented access problems as fees lagged costs. A warning about underpaying.",
      ],
      dependsOn: ["provider-enrollment", "fee-schedule"],
      sourceIds: ["ada-hpi"],
    },
  ],
}
