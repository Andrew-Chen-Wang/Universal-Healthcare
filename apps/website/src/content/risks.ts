export type Risk = {
  id: string
  title: string
  category: "political" | "legal" | "fiscal" | "operational" | "capacity" | "market"
  likelihood: "low" | "medium" | "high"
  impact: "low" | "medium" | "high" | "severe"
  description: string
  earlyWarning: string[]
  mitigation: string[]
}

export const RISKS: Risk[] = [
  {
    id: "waits-backlash",
    title: "Wait times rise and the employer-insured revolt",
    category: "capacity",
    likelihood: "high",
    impact: "severe",
    description:
      "Demand rises immediately while training new clinicians takes years. The previously commercially insured, the largest and most politically active group, notice longer waits and turn against the program before capacity catches up.",
    earlyWarning: [
      "Registry shows specialty waits above guarantee in 3+ regions",
      "Rising voucher payments",
      "Physician opt-out above 5% in any specialty",
    ],
    mitigation: [
      "Age-phased enrollment",
      "Wait-time guarantee vouchers",
      "Capacity capital in Years 0–5",
      "Scope-of-practice expansion",
      "Rates above Medicare",
    ],
  },
  {
    id: "cost-overrun",
    title: "Costs come in at the costly case",
    category: "fiscal",
    likelihood: "medium",
    impact: "high",
    description: `Provider lobbying raises rates, induced demand is higher, and drug savings are smaller. The ledger's costly case adds about ${F.gapCostly} a year in required general revenue.`,
    earlyWarning: [
      "First-year actual vs. ledger by line",
      "Rates Board recommendations overridden",
    ],
    mitigation: [
      "Automatic household-premium adjustment",
      "Standby copay option",
      "Spending growth target",
    ],
  },
  {
    id: "it-failure",
    title: "Claims system failure at launch",
    category: "operational",
    likelihood: "medium",
    impact: "high",
    description:
      "Providers go unpaid; patients are turned away. HealthCare.gov's 2013 launch is the cautionary tale.",
    earlyWarning: ["Parallel-run error rates", "Load-test results", "Independent verifier reports"],
    mitigation: [
      "Extend proven Medicare systems",
      "Go/no-go gate",
      "Interim payments based on prior-year billing",
    ],
  },
  {
    id: "recession",
    title: "Recession cuts revenue",
    category: "fiscal",
    likelihood: "medium",
    impact: "medium",
    description:
      "Payroll, income, and top-end capital-gains revenue all fall in a downturn while health spending doesn't.",
    earlyWarning: ["Unemployment above 6%", "Reserve below 1 month"],
    mitigation: ["2-month reserve", "Counter-cyclical general-revenue transfers"],
  },
  {
    id: "hospital-closures",
    title: "Hospital closures in commercially dependent markets",
    category: "market",
    likelihood: "medium",
    impact: "medium",
    description:
      "Systems that relied on commercial margins can't adjust, even with the transition fund.",
    earlyWarning: ["Days cash on hand", "Bond rating downgrades"],
    mitigation: ["Transition fund", "Essential-facility designation", "Regional capital boards"],
  },
  {
    id: "physician-exit",
    title: "Physician early retirement and opt-out",
    category: "capacity",
    likelihood: "medium",
    impact: "high",
    description:
      "Specialists facing fee cuts retire early or move to cash practice, shrinking capacity just as demand rises.",
    earlyWarning: ["Opt-out filings", "Medical licensing renewals", "Specialty-specific waits"],
    mitigation: [
      "4-year rate convergence",
      "Specialty-specific adjustments",
      "Removal of administrative burden as a non-financial benefit",
    ],
  },
  {
    id: "innovation-loss",
    title: "Larger-than-expected drop in drug innovation",
    category: "market",
    likelihood: "medium",
    impact: "medium",
    description:
      "Lower U.S. prices reduce global R&D investment more than CBO-style estimates predict.",
    earlyWarning: ["Venture funding for biotech", "Phase I trial starts", "U.S. launch delays"],
    mitigation: ["Value-based pricing that rewards breakthroughs", "Increase NIH/BARDA funding"],
  },
  {
    id: "capture",
    title: "Rate-setting captured by providers or politics",
    category: "political",
    likelihood: "medium",
    impact: "medium",
    description: "Medicare's history shows rates shaped by lobbying (the AMA RUC, SGR overrides).",
    earlyWarning: ["Overrides of Rates Board", "Revolving-door appointments"],
    mitigation: ["Independent board", "Public data", "Congressional veto requires both chambers"],
  },
  {
    id: "fraud",
    title: "Fraud concentrated on one payer",
    category: "operational",
    likelihood: "medium",
    impact: "medium",
    description: `Medicare FFS's 7.7% improper payment rate applied to UHP benefits would be about ${F.improperAtUhpScale}.`,
    earlyWarning: ["Improper payment rate", "Billing anomalies"],
    mitigation: [
      `${show("uhpAdminRate")} admin budget with integrity funding`,
      "Prepayment review in high-risk categories",
    ],
  },
  {
    id: "two-tier",
    title: "Cash-only concierge tier grows",
    category: "market",
    likelihood: "medium",
    impact: "medium",
    description:
      "Opted-out physicians serve the wealthy for cash, recreating two tiers and draining capacity.",
    earlyWarning: ["Opt-out rates by region and specialty"],
    mitigation: [
      "All-or-nothing opt-out",
      "Duplicative insurance ban (cash only, no insurance)",
      "Rates competitive with cash practice",
    ],
  },
]
import { show } from "./constants"
import { F } from "./figures"
