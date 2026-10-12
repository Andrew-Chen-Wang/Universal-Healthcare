import type { Phase } from "../types"
import { F } from "../figures"
import { show } from "../constants"
import { MODEL, fmt } from "./helpers"

export const PHASE_5: Phase = {
  id: "stabilize",
  number: 5,
  title: "Stabilize & govern",
  window: "Year 5 onward",
  goal: "Keep costs growing no faster than the economy, keep waits within the guarantee, keep the program honest, and decide with evidence whether to change the core design.",
  exitCriteria: [
    "Per-capita spending growth at or below the target for 3 consecutive years.",
    "90%+ of patients treated within the guarantee in every specialty and region.",
    "Improper payment rate below 3%.",
    "Year-10 review completed and voted on.",
  ],
  steps: [
    {
      id: "spending-target",
      title: "Set a spending growth target",
      summary:
        "Total UHP spending per person grows at most at GDP-per-capita growth + 0.5 points. The Rates Board sets fee updates and hospital budget growth to meet it.",
      legalVehicle: "Universal Health Act, Title V.",
      owner: "Payment Rates Board; Congress (veto)",
      timeline: "Annual, starting Year 5",
      tasks: [
        {
          action: "Compute the target each spring; publish projected spending by sector.",
          owner: "Rates Board",
          when: "Annual",
        },
        {
          action:
            "If the projection exceeds the target, recommend fee-update reductions, budget growth limits, or formulary actions, which take effect unless Congress votes them down.",
          owner: "Rates Board",
          when: "Annual",
        },
        {
          action:
            "If spending runs below target for 2 years, share savings with providers (half) and lower the household premium (half).",
          owner: "Rates Board / Treasury",
          when: "Annual",
        },
      ],
      cost: {
        ledgerNote: "Not in the 2024-dollar ledger. It governs growth after implementation.",
      },
      pros: [
        {
          point:
            "U.S. health spending has grown faster than GDP for most of 60 years; a binding target changes that.",
        },
        { point: "Shared savings give providers a stake in meeting it." },
      ],
      cons: [
        { point: "Too tight a target produces Canadian- or British-style queues." },
        {
          point:
            "Congress overrode Medicare's Sustainable Growth Rate formula 17 times between 2003 and 2015 before repealing it.",
        },
      ],
      tradeoffs: ["Cost control vs. access: the target is the dial between them."],
      risks: [
        {
          risk: "Repeated congressional overrides (the SGR precedent).",
          mitigation: "Overrides require offsets within the Trust Fund.",
        },
      ],
      precedent: [
        "Maryland, Massachusetts, and other states' cost-growth benchmarks; Japan's biennial fee revisions; Germany's 'income-oriented expenditure policy'.",
      ],
      dependsOn: ["fee-schedule", "hospital-global-budgets"],
      sourceIds: ["maryland-model"],
    },
    {
      id: "program-integrity",
      title: "Run program integrity & fraud control",
      summary:
        "With one payer, fraud schemes that exploit gaps between payers disappear, but every scheme now targets one payer. UHP funds fraud control at a higher rate than Medicare does today.",
      legalVehicle:
        "Universal Health Act; extends the False Claims Act, the Anti-Kickback Statute, and HHS-OIG authority.",
      owner: "UHA Program Integrity; HHS-OIG; DOJ",
      timeline: "Year 1 onward",
      tasks: [
        {
          action:
            "Real-time predictive analytics on every claim (extending Medicare's Fraud Prevention System).",
          owner: "UHA",
          when: "Year 1+",
        },
        {
          action:
            "Prepayment review for high-risk categories (DME, hospice, lab, home health, behavioral-health outpatient), which have been Medicare's biggest fraud areas.",
          owner: "UHA",
          when: "Year 1+",
        },
        {
          action: "Publish improper-payment rates by provider type annually; target below 3%.",
          owner: "UHA / OIG",
          when: "Annual",
        },
        {
          action: "Whistleblower rewards under the False Claims Act.",
          owner: "DOJ",
          when: "Ongoing",
        },
      ],
      cost: {
        ledgerNote: `Inside UHP administration (part of why it's budgeted at ${show("uhpAdminRate")} rather than Medicare's 1.4%).`,
      },
      pros: [{ point: "One national dataset makes patterns visible that fragmented payers miss." }],
      cons: [{ point: "Prepayment review slows payment to honest providers." }],
      tradeoffs: ["Integrity vs. administrative burden on providers."],
      risks: [
        {
          risk: `Medicare FFS's improper payment rate was about 7.7% in FY2024. Applied to UHP benefits, that would be about ${F.improperAtUhpScale} a year.`,
          mitigation:
            "Most improper payments are documentation errors, not fraud; budget enough for review.",
        },
      ],
      precedent: [
        "Medicare's Fraud Prevention System (2011); Taiwan's real-time NHI claims analytics.",
      ],
      dependsOn: ["build-claims-system"],
      sourceIds: ["cms-improper"],
    },
    {
      id: "evaluation-review",
      title: "Run an independent evaluation and the Year-10 review",
      summary:
        "An independent evaluator reports annually on access, quality, waits, health outcomes, costs, and the labor market. In Year 10 Congress must vote on the duplicative-insurance ban and the cost-sharing standby option based on that evidence.",
      legalVehicle:
        "Universal Health Act, Title I; statutory sunset of the duplicative-coverage ban absent reauthorization.",
      owner: "Independent evaluator (National Academies + GAO); Congress",
      timeline: "Annual reports; Year 10 vote",
      tasks: [
        {
          action:
            "Publish annual reports covering mortality amenable to health care, wait times, patient experience, financial hardship, provider supply, and spending vs. ledger.",
          owner: "Evaluator",
          when: "Annual",
        },
        {
          action:
            "Year-10 report: compare outcomes against the stated trade-offs on this site and recommend continue/modify.",
          owner: "Evaluator",
          when: "Year 9",
        },
        {
          action:
            "Congress votes on: (1) continuing the duplicative-coverage ban; (2) activating copays; (3) adjusting the benefit package.",
          owner: "Congress",
          when: "Year 10",
        },
      ],
      cost: { ledgerNote: "In the transition table (evaluation) and administration thereafter." },
      pros: [
        { point: "Turns contested predictions (waits, innovation, quality) into measured facts." },
      ],
      cons: [{ point: "Scheduled votes are opportunities for repeal." }],
      tradeoffs: ["Accountability vs. stability."],
      risks: [
        {
          risk: "Evaluation is politicized or delayed, so the Year-10 vote happens on anecdotes.",
          mitigation:
            "Statutory independence (National Academies + GAO), fixed publication dates, and public microdata in the research enclave.",
        },
        {
          risk: "Outcomes that take decades (mortality, innovation) can't be measured by Year 10.",
          mitigation:
            "Pre-registered interim indicators and comparison with the CBO baseline projections.",
        },
      ],
      precedent: ["Oregon Health Insurance Experiment-style evaluation; Canada's CIHI reporting."],
      dependsOn: ["wait-time-guarantee"],
      sourceIds: ["commonwealth-2024"],
    },
    {
      id: "malpractice-pilot",
      title: "Pilot a no-fault patient compensation system (optional)",
      summary:
        "Replace malpractice litigation in pilot states with an administrative compensation system for avoidable injuries, funded from the Trust Fund, paired with mandatory safety reporting.",
      legalVehicle: "Universal Health Act, optional Title; state opt-in.",
      owner: "UHA; participating states",
      timeline: "Years 3–10",
      tasks: [
        {
          action:
            "Invite 5 states to pilot, with an expert panel deciding 'avoidable injury' claims within 6 months.",
          owner: "UHA / states",
          when: "Year 3",
        },
        {
          action:
            "Fund compensation from a small per-provider assessment that replaces malpractice premiums.",
          owner: "UHA",
          when: "Year 3",
        },
        {
          action: "Evaluate injury rates, defensive medicine, and patient satisfaction.",
          owner: "Evaluator",
          when: "Year 8",
        },
      ],
      cost: {
        ledgerNote: "Not in the base ledger. Malpractice premiums are inside provider costs today.",
      },
      pros: [
        { point: "Faster, more consistent compensation for injured patients." },
        { point: "May reduce defensive medicine." },
      ],
      cons: [
        {
          point:
            "Trial lawyers oppose it; it can lower compensation for severely injured patients.",
        },
        { point: "Constitutional right-to-jury issues in some states." },
      ],
      tradeoffs: ["Access to compensation for many vs. large awards for a few."],
      risks: [
        {
          risk: "State constitutional right-to-jury challenges strike down the pilot.",
          mitigation:
            "Opt-in pilots only in states whose courts have upheld administrative compensation; patients may elect court within 60 days.",
        },
        {
          risk: "Claim volume rises sharply once compensation is easier, raising costs.",
          mitigation:
            "Avoidable-injury standard with schedule-based awards and an annual budget cap per pilot.",
        },
      ],
      precedent: [
        "New Zealand ACC (1974); Sweden's Patient Insurance; Denmark's Patient Compensation Association.",
      ],
      dependsOn: [],
      sourceIds: [],
    },
    {
      id: "ongoing-capacity-planning",
      title: "Plan capacity regionally",
      summary: `Regional capital boards allocate the ${fmt(MODEL.useLines.find((l) => l.id === "structures")!.after)}-a-year capital budget toward the services with the longest waits, and publish 5-year capacity plans.`,
      legalVehicle: "Universal Health Act, Title V (capital).",
      owner: "Regional capital boards",
      timeline: "Annual",
      tasks: [
        {
          action:
            "Publish regional supply-and-demand plans: beds, ORs, imaging, physicians and nurses by specialty.",
          owner: "Regional boards",
          when: "Annual",
        },
        {
          action: "Approve major capital projects (> $1M) through open hearings.",
          owner: "Regional boards",
          when: "Ongoing",
        },
        {
          action: "Repeal state certificate-of-need laws in favor of this process.",
          owner: "States",
          when: "Year 5",
        },
      ],
      cost: {
        ledgerNote: `Ledger line 'Structures & equipment' (${fmt(MODEL.useLines.find((l) => l.id === "structures")!.after)}).`,
      },
      pros: [
        {
          point: "Capital goes where waits are longest, not where commercial margins are highest.",
        },
      ],
      cons: [
        { point: "Central planning can be slow, captured by incumbents, or politicized." },
        { point: "Hospitals lose control of their own expansion." },
      ],
      tradeoffs: ["Planned allocation vs. market-driven investment."],
      risks: [
        {
          risk: "Under-investment (Canada and the UK have far fewer MRI units per capita).",
          mitigation:
            "Capital budget pegged to at least 3% of spending; wait-time data drives allocation.",
        },
      ],
      precedent: ["Canadian provincial capital planning; German state (Länder) hospital plans."],
      dependsOn: ["hospital-global-budgets"],
      sourceIds: ["oecd-health-2025"],
    },
  ],
}
