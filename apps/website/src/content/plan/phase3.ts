import type { Phase } from "../types"
import { F } from "../figures"
import { MODEL, fmt, service, sourceLine, useLine } from "./helpers"

const hcbs = service("otherResidential")
const home = service("homeHealth")
const nursing = service("nursing")
const netCost = useLine("netCostOfInsurance")

export const PHASE_3: Phase = {
  id: "waves-two-three",
  number: 3,
  title: "Waves 2 & 3: working-age adults",
  window: "Years 2–3",
  goal: "Bring adults 35–54 into UHP, convert long-term care into an entitlement, and wind down the private insurance industry in an orderly way.",
  exitCriteria: [
    "Adults 35+ enrolled with no measurable coverage gap.",
    "HCBS waiting lists eliminated.",
    "Every health insurer has an approved run-off plan.",
    "Rates for all providers at least 50% converged to UHP levels.",
  ],
  steps: [
    {
      id: "waves-two-three-enrollment",
      title: "Enroll adults 45–54 (Year 2) and 35–44 (Year 3)",
      summary:
        "About 85 million working-age adults move from employer, Marketplace, Medicaid, or no coverage into UHP. Employer plans shrink to covering only workers under 35 and their spouses.",
      legalVehicle: "Universal Health Act, Title VIII.",
      owner: "UHA; employers",
      timeline: "Start of Years 2 and 3",
      tasks: [
        {
          action:
            "Notify each employer which of its workers move in the coming wave (from W-2 data with birth dates).",
          owner: "UHA / IRS",
          when: "6 months before each wave",
        },
        {
          action:
            "Employers remove moving workers from plans and recalculate the remaining pool's premiums.",
          owner: "Employers / insurers",
          when: "Each wave",
        },
        {
          action:
            "Spouses enroll by their own age (a 50-year-old with a 30-year-old spouse: one in UHP, one in the employer plan until Year 4).",
          owner: "UHA",
          when: "Each wave",
        },
        {
          action:
            "Medicaid adults in each age band convert automatically; states stop redeterminations.",
          owner: "States / UHA",
          when: "Each wave",
        },
      ],
      cost: {
        ledgerNote:
          "In the transition phase-in schedule (Year 2 ≈ 76% and Year 3 ≈ 86% of steady-state UHP spending).",
      },
      pros: [
        { point: "Gradual: the claims system scales in steps." },
        { point: "Employer pools get younger and cheaper for the remaining workers." },
      ],
      cons: [
        { point: "Families split across systems for up to two years." },
        { point: "Insurer layoffs accelerate in these years." },
      ],
      tradeoffs: ["Smoothness vs. the confusion of mixed families."],
      risks: [
        {
          risk: "Adverse selection in the remaining individual market (younger, healthier people leave last, but the sickest young people may drop out of employer plans early).",
          mitigation: "The Marketplace remains with subsidies until Year 4.",
        },
      ],
      precedent: ["The Medicare for All Act uses the same age-band approach."],
      dependsOn: ["wave-one-enrollment"],
      sourceIds: ["sanders-m4a"],
    },
    {
      id: "ltss-entitlement",
      title: "Make home- and community-based care an entitlement",
      summary: `Long-term services at home stop depending on Medicaid's poverty rules and capped waivers. HCBS spending goes from ${fmt(hcbs.baselineTotal)} to ${fmt(hcbs.newTotal)}, home health from ${fmt(home.baselineTotal)} to ${fmt(home.newTotal)}, and nursing facilities from ${fmt(nursing.baselineTotal)} to ${fmt(nursing.newTotal)}.`,
      legalVehicle:
        "Universal Health Act, Title III; repeal of Medicaid §1915(c) waiver caps for UHP enrollees.",
      owner: "UHA; state aging & disability agencies",
      timeline: "Year 2",
      tasks: [
        {
          action:
            "Eligibility by functional need (needs help with 2+ activities of daily living, or cognitive impairment), with no income or asset test.",
          owner: "UHA",
          when: "Year 2",
        },
        {
          action:
            "Standardized national needs assessment, performed by independent assessors (not providers).",
          owner: "UHA / states",
          when: "Year 2",
        },
        {
          action:
            "Self-directed care option: people can hire family caregivers (paid at the aide rate).",
          owner: "UHA",
          when: "Year 2",
        },
        {
          action:
            "Nursing facility residents: UHP pays the care component; residents contribute up to 80% of income above a personal-needs allowance toward room and board (as in Canadian provinces).",
          owner: "UHA",
          when: "Year 2",
        },
        {
          action: "End Medicaid estate recovery for long-term care.",
          owner: "Congress",
          when: "Year 2",
        },
      ],
      cost: {
        recurring: hcbs.delta + home.delta + nursing.delta,
        ledgerNote: `Ledger lines 'Other health, residential & personal care', 'Home health care', and 'Nursing facilities'. Combined change ${fmt(hcbs.delta + home.delta + nursing.delta, { sign: true })}.`,
      },
      pros: [
        { point: "Ends the requirement to spend down to poverty to get home care." },
        { point: "Ends waiting lists, which held about 700,000 people in 2023." },
        { point: "Pays family caregivers, who today provide care unpaid." },
      ],
      cons: [
        {
          point:
            "Expensive, and demand may grow faster than projected as families substitute paid for unpaid care (the 'woodwork effect').",
        },
        {
          point:
            "The home-care workforce is already short; covered care won't help if no aide is available.",
        },
      ],
      tradeoffs: [
        "Paying family caregivers is humane but raises costs sharply if many families opt in.",
      ],
      risks: [
        {
          risk: "Woodwork effect exceeds projection.",
          mitigation:
            "Functional assessment by independent assessors; cost growth target applies to LTSS.",
        },
      ],
      precedent: [
        "Germany's Pflegeversicherung (1995): cash or in-kind benefits by need level; Japan's Kaigo Hoken (2000).",
      ],
      dependsOn: ["wave-one-enrollment"],
      sourceIds: ["kff-hcbs-waitlist"],
    },
    {
      id: "insurer-runoff",
      title: "Wind down the private health insurers",
      summary: `Insurers' UHP-duplicative business ends. They must process all claims for prior coverage (run-off), protect policyholders, and convert or close in an orderly way. The 'Net cost of insurance' line falls from ${fmt(netCost.before)} to ${fmt(netCost.after)}.`,
      legalVehicle:
        "Universal Health Act, Title VIII; state insurance receivership law; IRS rules for nonprofit conversions.",
      owner: "State insurance commissioners; NAIC; UHA",
      timeline: "Years 1–5",
      tasks: [
        {
          action:
            "Each insurer files a run-off plan: claims for services before the switch are paid for 18 months after; reserves are held until run-off ends.",
          owner: "Insurers / state regulators",
          when: "Year 1",
        },
        {
          action:
            "Prohibit dividend payouts and buybacks until run-off reserves are certified adequate.",
          owner: "State regulators",
          when: "Year 1+",
        },
        {
          action:
            "Nonprofit insurers (most Blue Cross Blue Shield plans): when they dissolve or convert, their assets go to charitable health foundations, as with prior Blue conversions (e.g., the California Endowment).",
          owner: "State AGs",
          when: "Years 2–5",
        },
        {
          action:
            "Insurers may continue in supplementary insurance, workers' comp, Medicare-to-UHP integrated care organizations (as providers, not insurers), international markets, and administrative contracting for UHA.",
          owner: "Insurers",
          when: "Year 1+",
        },
        {
          action:
            "Pharmacy benefit managers: contracts end; PBM-owned pharmacies keep dispensing under UHA dispensing fees.",
          owner: "UHA",
          when: "Day 1 of each wave",
        },
        {
          action:
            "Broker licenses for health insurance lapse; brokers may sell supplementary and other lines.",
          owner: "State regulators",
          when: "Year 4",
        },
      ],
      cost: {
        recurring: netCost.after - netCost.before,
        ledgerNote: `Insurers' economic losses: about ${fmt(MODEL.useLines.find((l) => l.id === "netCostOfInsurance")!.before - MODEL.useLines.find((l) => l.id === "netCostOfInsurance")!.after)} a year in overhead and profit that no longer exists, of which about ${F.insurerProfit} is profit. These are private losses, not a government cost. No compensation is paid.`,
      },
      pros: [
        { point: "Orderly run-off protects patients' pending claims." },
        { point: "Nonprofit assets go to public-benefit health foundations." },
      ],
      cons: [
        {
          point:
            "Shareholders lose: a rough estimate of insurance-segment equity value at risk is $400–700B, though diversified firms (UnitedHealth's Optum, CVS) keep other businesses.",
        },
        { point: "Some workers lose pensions if insurers fail rather than wind down." },
      ],
      tradeoffs: [
        "No compensation for lost future profits (legally sound, and consistent with the ground rules) vs. political and market backlash.",
      ],
      risks: [
        {
          risk: "Insurers fail during run-off, leaving claims unpaid.",
          mitigation:
            "State guaranty associations; UHA backstop for unpaid provider claims, recovered from the insurer's estate.",
        },
      ],
      precedent: [
        "Blue Cross conversions in California, New York, and elsewhere created large health foundations.",
        "UK, 1948: voluntary hospitals and friendly societies were absorbed into the NHS.",
      ],
      dependsOn: ["erisa-and-insurance-law"],
      sourceIds: ["naic-health-results"],
    },
    {
      id: "rate-convergence",
      title: "Converge provider rates",
      summary:
        "Each provider's payments move from its prior blended rate toward UHP rates by 25% a year over four years, so revenue changes are gradual.",
      legalVehicle: "Universal Health Act, Title V.",
      owner: "Payment Rates Board",
      timeline: "Years 1–4",
      tasks: [
        {
          action:
            "Year 1: 75% prior rate / 25% UHP rate; Year 2: 50/50; Year 3: 25/75; Year 4: 100% UHP.",
          owner: "Rates Board",
          when: "Years 1–4",
        },
        {
          action: "Publish each hospital's and large group's revenue projection under convergence.",
          owner: "UHA",
          when: "Year 0",
        },
        {
          action:
            "Review specialty-level supply response annually; adjust the conversion factor if any specialty's wait times exceed the guarantee in 3+ regions.",
          owner: "Rates Board",
          when: "Annual",
        },
      ],
      cost: {
        ledgerNote:
          "The steady-state rates are in the ledger. Convergence is a timing effect that raises Years 1–3 costs slightly above the phase-in shares (not separately modeled).",
      },
      pros: [{ point: "No overnight revenue cliff for providers." }],
      cons: [{ point: "Prolongs high payments to providers with market power." }],
      tradeoffs: ["Gradualism vs. savings speed."],
      risks: [
        {
          risk: "Political pressure to freeze convergence partway.",
          mitigation: "Statutory schedule; the Board can only speed it up.",
        },
      ],
      precedent: ["Medicare's 4-year transition to the inpatient PPS (1983–87)."],
      dependsOn: ["fee-schedule", "hospital-global-budgets"],
      sourceIds: [],
    },
    {
      id: "marketplace-closure",
      title: "Close the ACA Marketplaces",
      summary: `HealthCare.gov and state exchanges close at the end of Year 3. The ${fmt(sourceLine("fedMarketplace").before)} in premium tax credits is redirected to the UHP Trust Fund.`,
      legalVehicle:
        "Universal Health Act, Title IX; repeal of ACA §1311 exchanges and IRC §36B at Year 4.",
      owner: "CMS CCIIO; state exchanges",
      timeline: "End of Year 3",
      tasks: [
        {
          action: "Final open enrollment covers only people under 35 for Year 3.",
          owner: "CMS / states",
          when: "Year 2",
        },
        {
          action:
            "Transfer state exchange staff and call centers to UHA regional help lines where possible.",
          owner: "States / UHA",
          when: "Year 3",
        },
        {
          action: "Final reconciliation of premium tax credits on Year-3 tax returns.",
          owner: "IRS",
          when: "Year 4",
        },
      ],
      cost: {
        ledgerNote: `Source line 'ACA Marketplace tax credits & subsidies' redirected (${fmt(sourceLine("fedMarketplace").after)}).`,
      },
      pros: [
        { point: "Ends the annual enrollment cycle, subsidy cliffs, and narrow-network plans." },
      ],
      cons: [{ point: "Marketplace navigator and exchange jobs end." }],
      tradeoffs: [],
      risks: [
        {
          risk: "Under-35s left in a shrinking, unstable individual market in Year 3.",
          mitigation: "Allow under-35s to buy in to UHP at a community-rated price in Year 3.",
        },
      ],
      precedent: [],
      dependsOn: ["waves-two-three-enrollment"],
      sourceIds: [],
    },
    {
      id: "integrated-care-orgs",
      title: "Create integrated care organizations (ICOs)",
      summary:
        "Provider-run integrated systems can accept a single risk-adjusted global budget for patients who choose them. This preserves the Kaiser/Geisinger model without an insurance layer.",
      legalVehicle: "Universal Health Act, Title V.",
      owner: "UHA",
      timeline: "Years 2–4",
      tasks: [
        {
          action:
            "Define requirements: own or employ primary care and hospital services, accept all comers in their service area, publish quality and waits.",
          owner: "UHA",
          when: "Year 1",
        },
        {
          action:
            "Set capitation at 97% of expected UHP spending for the enrolled population (risk-adjusted), with audits of risk coding.",
          owner: "Rates Board",
          when: "Year 2",
        },
        {
          action:
            "Patients choose an ICO annually; they can see non-ICO providers only for emergencies and the wait-time guarantee.",
          owner: "UHA",
          when: "Year 2+",
        },
        {
          action: "Prohibit ICOs from offering cash benefits, gift cards, or marketing.",
          owner: "UHA",
          when: "Year 2",
        },
      ],
      cost: {
        ledgerNote: "Budget-neutral or slightly saving (3% discount); not separately modeled.",
      },
      pros: [
        { point: "Keeps the best-performing integrated systems' model." },
        { point: "Gives patients a meaningful choice of care model." },
      ],
      cons: [
        { point: "Risk-adjusted capitation invites upcoding (the MA problem)." },
        { point: "Restricted provider choice for ICO enrollees." },
      ],
      tradeoffs: ["Choice and integration vs. reintroducing some managed-care gaming."],
      risks: [
        {
          risk: "Coding intensity.",
          mitigation: "Risk scores audited against encounter records; coding-intensity adjustment.",
        },
      ],
      precedent: ["Kaiser Permanente; Medicare ACOs; Germany's integrated care contracts."],
      dependsOn: ["hospital-global-budgets"],
      sourceIds: ["medpac-2025"],
    },
  ],
}
