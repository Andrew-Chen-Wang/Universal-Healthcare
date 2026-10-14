/**
 * Groups of people and organizations that problems and paths affect. Problems
 * link to groups (`hurts`, `profits`); a path's winners and losers are derived
 * from those links in graph.ts, so each group is described once, here.
 */
import { ENROLLMENT_2024 } from "./baseline"
import { show, v } from "./constants"
import { DISPLACED_TOTAL } from "./workforce"

export type Group = {
  id: string
  label: string
  summary: string
  /** Size in words, built from constants; omitted when no good count exists. */
  size?: { text: string; sourceIds: string[] }
}

export const GROUPS: Group[] = [
  {
    id: "uninsured",
    label: "Uninsured people",
    summary: "People with no health coverage, who pay for care themselves or go without.",
    size: {
      text: `${v("uninsuredToday")} million uninsured all year (2025)`,
      sourceIds: ["census-p60-291"],
    },
  },
  {
    id: "employer-covered",
    label: "People with employer coverage",
    summary:
      "Workers and their families insured through a job. Many like their plans, and they are usually seen fastest today.",
    size: {
      text: `${ENROLLMENT_2024.employerSponsored} million people (2024)`,
      sourceIds: ["cms-nhe-2024"],
    },
  },
  {
    id: "changing-lives",
    label: "People whose job, income, or home changes",
    summary:
      "People who change or lose jobs, start businesses, retire early, cut hours, or have incomes that rise and fall, and so move between coverage types.",
  },
  {
    id: "heavy-care-users",
    label: "People with ongoing or specialist care needs",
    summary:
      "People with chronic conditions, disabilities, or serious illness, who meet networks, prior authorization, and denials most often.",
  },
  {
    id: "low-middle-income",
    label: "Low- and middle-income households",
    summary: "Households for whom a flat premium is a large share of pay.",
  },
  {
    id: "high-earners",
    label: "High earners",
    summary:
      "Households for whom a flat premium is a small share of pay, and who pay more under income-based taxes.",
  },
  {
    id: "employers",
    label: "Employers",
    summary: "Businesses that buy coverage for workers today, and those that don't.",
  },
  {
    id: "insurers",
    label: "Health insurers, brokers, and their shareholders",
    summary: "Companies that sell, administer, and broker private coverage.",
  },
  {
    id: "insurance-billing-workers",
    label: "Insurance and billing workers",
    summary:
      "People whose jobs exist to sell coverage, process claims, or manage billing between providers and many payers.",
    size: {
      text: `About ${Math.round(DISPLACED_TOTAL).toLocaleString("en-US")} jobs would be displaced in a full transition (site estimate); ${show("blsHealthCarriers")} work at health insurance carriers`,
      sourceIds: ["bls-oews-2025"],
    },
  },
  {
    id: "clinicians",
    label: "Doctors, nurses, and other clinicians",
    summary: "People who deliver care and spend part of their time on billing and insurer rules.",
  },
  {
    id: "high-price-providers",
    label: "Hospitals and specialist groups with high private prices",
    summary:
      "Providers that charge private insurers far more than public payers, including out-of-network specialty groups.",
  },
  {
    id: "drug-device-makers",
    label: "Drug and device makers",
    summary: "Manufacturers whose products a payer can cover, price, or decline.",
  },
  {
    id: "states",
    label: "State governments",
    summary: "States that run and co-fund Medicaid and CHIP today.",
  },
  {
    id: "taxpayers",
    label: "Taxpayers and public budgets",
    summary: "Everyone who funds public programs, and the budgets that pay for them.",
  },
]

export const GROUP_BY_ID: Record<string, Group> = Object.fromEntries(GROUPS.map((g) => [g.id, g]))
