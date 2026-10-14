/**
 * Hybrid plan: the design decisions behind its steps, each with the
 * alternatives considered and what the choice gives up.
 */
import { show } from "../constants"
import type { Decision } from "../types"
import { H } from "./figures"

export const HY_DESIGN_DECISIONS: Decision[] = [
  {
    id: "hy-payer-structure",
    title: "Who pays for care",
    question: "One public payer, or many regulated plans?",
    choice:
      "Many regulated nonprofit plans that must take everyone at standard benefits, with employer plans kept and Medicare and Medicaid continuing: a Germany-style hybrid.",
    rationale:
      "The owner judged a single payer too hard to enact, and wants people with employer coverage to keep their plans and their access. A regulated multi-payer system reaches universal coverage without ending employer plans.",
    alternatives: [
      {
        name: "Single payer",
        description: "One public plan for everyone (the earlier draft, kept as its own plan).",
        pros: [
          { point: "Largest administrative savings and one price for every provider." },
          { point: "Ends networks, denials by insurers, and job lock." },
        ],
        cons: [
          {
            point: `Ends employer plans, which ${show("esiRatedGood")} of their members rate good or excellent.`,
          },
          { point: "Needs new broad taxes." },
        ],
        precedent: "Canada, Taiwan.",
      },
      {
        name: "Public option with automatic enrollment",
        description:
          "A public plan beside private ones, with the uninsured enrolled automatically.",
        pros: [{ point: "Less disruption; tests public-plan competition." }],
        cons: [{ point: "Private plans keep their current rules unless regulated separately." }],
        precedent: "Washington State's Cascade Select.",
      },
    ],
    givesUp: ["The administrative savings of one payer.", "One price and one queue for everyone."],
    sourceIds: ["cmwf-germany-2026", "cmwf-netherlands-2026"],
  },
  {
    id: "hy-employer-role",
    title: "The role of employers",
    question: "Should employers keep providing coverage?",
    choice: `Yes. Employers with ${show("employerMandateThreshold")}+ full-time workers must keep offering coverage that meets the standard benefit, as under the ACA.`,
    rationale:
      "Employer plans pay providers more, which is what keeps their members' waits short. Keeping them avoids a payroll tax and keeps employer money in the system.",
    alternatives: [
      {
        name: "End employer coverage and replace it with a payroll tax",
        description: "The single-payer draft's approach.",
        pros: [{ point: "Ends job lock and employer-plan administration." }],
        cons: [{ point: "A tax on every employer and the loss of plans people like." }],
      },
      {
        name: "Employer contribution into a central fund",
        description:
          "Employers pay a share of wages into a fund instead of buying plans, as in the Netherlands.",
        pros: [{ point: "Coverage stops depending on the employer." }],
        cons: [
          { point: "Works like a payroll tax that reaches households below the break-even floor." },
        ],
        precedent: "Netherlands.",
      },
    ],
    givesUp: ["Ending job lock.", "The administrative savings of fewer plans."],
    sourceIds: ["irs-employer-mandate"],
  },
  {
    id: "hy-premiums",
    title: "What people in the regulated plans pay",
    question: "Premiums capped by income, or taxes?",
    choice:
      "A premium capped at a share of income, zero below a set income, with federal subsidies paying the rest.",
    rationale: `It keeps the owner's rule that no household below ${show("breakEvenFloor")} pays more: the uninsured pay at most an affordable premium for coverage they don't have today.`,
    alternatives: [
      {
        name: "No premiums, tax-funded",
        description: "Fund the regulated plans fully from taxes.",
        pros: [{ point: "No premium bill to fall behind on." }],
        cons: [{ point: "Needs a broad tax." }],
      },
      {
        name: "Flat community-rated premiums with allowances",
        description: "Everyone pays the same premium, with allowances for low incomes.",
        pros: [{ point: "Simple and visible." }],
        cons: [{ point: "Heavy for middle incomes just above the allowance." }],
        precedent: "Netherlands.",
      },
    ],
    givesUp: ["A world without premium bills."],
    sourceIds: ["kff-marketplace-2026", "cmwf-netherlands-2026"],
  },
  {
    id: "hy-benefits",
    title: "What the standard benefit covers",
    question: "How broad is the standard benefit?",
    choice:
      "The ACA's essential health benefits plus preventive and basic dental, glasses, and hearing aids. Long-term care stays as today, for a later decision.",
    rationale:
      "Basic dental, vision, and hearing close common gaps at modest cost through premiums. Full dental and long-term care would cost far more than the top-end taxes raise.",
    alternatives: [
      {
        name: "Full dental, vision, hearing, and long-term care",
        description: "The single-payer draft's benefit.",
        pros: [{ point: "Covers the biggest remaining gaps." }],
        cons: [{ point: "Needs a broad tax, breaking the break-even rule." }],
      },
      {
        name: "Essential health benefits only",
        description: "Today's ACA floor.",
        pros: [{ point: "Lowest premiums." }],
        cons: [{ point: "Leaves dental, vision, and hearing out." }],
      },
    ],
    givesUp: ["Long-term care coverage, for now.", "Major dental work."],
    sourceIds: [],
  },
  {
    id: "hy-eligibility",
    title: "How people get covered",
    question: "Mandate, automatic enrollment, or both?",
    choice: `Automatic enrollment from tax and benefit records, with enrollment at the point of care. ${H.newlyCovered} people are newly covered.`,
    rationale:
      "Automatic enrollment reaches more people than a mandate, without penalties on low-income people.",
    alternatives: [
      {
        name: "Individual mandate with larger subsidies",
        description: "Require coverage and penalize people without it.",
        pros: [{ point: "Familiar from the ACA." }],
        cons: [{ point: "Leaves many uninsured; penalties fall on low-income people." }],
      },
    ],
    givesUp: ["Some choice: people are placed in a default plan until they switch."],
    sourceIds: ["auto-enrollment-commonwealth-fund-2026"],
  },
  {
    id: "hy-drug-pricing",
    title: "Drug prices",
    question: "Negotiate for Medicare only, or for every payer?",
    choice: `Extend Medicare's negotiated prices to every plan and employer plan: ${H.drugs} a year nationally.`,
    rationale:
      "Drug prices are the largest saving available without touching providers' payment edge.",
    alternatives: [
      {
        name: "Medicare only (current law)",
        description: "Keep negotiation limited to Medicare.",
        pros: [{ point: "Less disruption for drug makers." }],
        cons: [{ point: "Employer and individual plans keep paying list-based prices." }],
      },
      {
        name: "Reference pricing to other countries",
        description: "Cap prices at an average of other wealthy countries.",
        pros: [{ point: "Simple and large savings." }],
        cons: [
          { point: "Imports other countries' decisions; manufacturers may delay launches abroad." },
        ],
      },
    ],
    givesUp: ["Some future drug launches."],
    sourceIds: ["cms-negotiation", "cbo-ira-new-drugs-2023"],
  },
  {
    id: "hy-price-setting",
    title: "Provider prices",
    question: "One rate for every payer, or a cap on commercial prices?",
    choice: `A cap on commercial prices at ${show("commercialPriceCap", "pct")} of Medicare, phased in. Employer plans still pay more than public plans.`,
    rationale:
      "One rate for everyone would end employer plans' payment edge, which is what keeps their members' waits short. A cap cuts only the highest prices.",
    alternatives: [
      {
        name: "All-payer rates",
        description: "Every payer pays the same rate.",
        pros: [{ point: "Bigger savings; one queue for everyone." }],
        cons: [{ point: "Employer-plan members lose their place at the front of the line." }],
        precedent: "Maryland's hospitals.",
      },
      {
        name: "Competition only",
        description: "Antitrust and transparency, with prices left to negotiation.",
        pros: [{ point: "No price regulation." }],
        cons: [{ point: "Little effect where hospitals already dominate." }],
      },
    ],
    givesUp: ["The savings and equal access of one rate for everyone."],
    sourceIds: ["rand-hospital-2024", "lungen-waits-2008"],
  },
  {
    id: "hy-financing",
    title: "Who pays the new federal costs",
    question: "Broad taxes, or only the very top?",
    choice: `Only the top: a ${show("surtaxRate")} surtax on income above ${show("surtaxThreshold")} and capital gains taxed as ordinary income above ${show("surtaxThreshold")}, raising ${H.topEnd} against ${H.federal} of new federal cost.`,
    rationale: `The owner's rule: no household below ${show("breakEvenFloor")} of income pays more.`,
    alternatives: [
      {
        name: "Payroll tax",
        description: "A health payroll tax shared with employers, as in Germany.",
        pros: [{ point: "Broad and stable." }],
        cons: [{ point: "Reaches every worker." }],
      },
      {
        name: "Mix of payroll and income taxes",
        description: "The single-payer draft's financing.",
        pros: [{ point: "Raises enough for a single payer." }],
        cons: [{ point: "Middle-income households pay more." }],
      },
    ],
    givesUp: ["A broad, stable revenue base."],
    sourceIds: ["tpc-surtax", "jct-capital-gains"],
  },
  {
    id: "hy-two-tier",
    title: "Two tiers of access",
    question: "Should some plans buy faster access?",
    choice:
      "Yes, by design: employer plans pay more and their members get seen sooner, as private patients do in Germany. A wait-time guarantee and capacity investment limit the gap for the regulated plans.",
    rationale:
      "It is what the owner's goal requires: specialist waits barely move for people with employer coverage.",
    alternatives: [
      {
        name: "One queue for everyone",
        description: "Same rate from every payer.",
        pros: [{ point: "Equal access." }],
        cons: [{ point: "Employer-plan members wait longer than today." }],
      },
      {
        name: "Supplemental only",
        description: "Private insurance only for extras, as in the single-payer draft.",
        pros: [{ point: "No fast lane for covered care." }],
        cons: [{ point: "Requires one payer for covered care." }],
      },
    ],
    givesUp: ["Equal access to specialists regardless of plan."],
    sourceIds: ["lungen-waits-2008"],
  },
]
