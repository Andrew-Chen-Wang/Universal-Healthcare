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
  {
    id: "underinsured",
    label: "People with unaffordable deductibles or coinsurance",
    summary: "Insured people face cost sharing that makes care difficult to afford.",
  },
  {
    id: "immigrant-families",
    label: "Immigrants and mixed-status families",
    summary: "Immigrants and their families face coverage eligibility restrictions and gaps.",
  },
  {
    id: "territory-residents",
    label: "Residents of U.S. territories",
    summary:
      "People living in United States territories depend on territorial health coverage and services.",
  },
  {
    id: "territory-governments",
    label: "Territory governments",
    summary:
      "Territorial governments administer health programs subject to federal funding limits.",
  },
  {
    id: "providers",
    label: "Hospitals, clinics, and care organizations",
    summary:
      "Organizations deliver care and manage the revenue, staffing, and facilities needed to provide it.",
  },
  {
    id: "health-executives",
    label: "Health care executives",
    summary: "Executives manage health care organizations and receive compensation from them.",
  },
  {
    id: "financial-intermediaries",
    label: "Health financing intermediaries and lenders",
    summary:
      "Businesses administer health savings accounts, arrange health financing, or lend for medical education.",
  },
  {
    id: "debt-collectors",
    label: "Medical debt collectors and buyers",
    summary: "Businesses collect or purchase unpaid medical bills.",
  },
  {
    id: "health-admin-vendors",
    label: "Health administration and software vendors",
    summary:
      "Businesses supply billing, coding, eligibility, utilization management, and health record systems.",
  },
  {
    id: "medicare-beneficiaries",
    label: "Medicare beneficiaries",
    summary: "People enrolled in Medicare depend on its coverage and pay its premiums.",
  },
  {
    id: "pbms",
    label: "Pharmacy benefit managers and their pharmacies",
    summary:
      "Businesses manage prescription benefits and operate affiliated mail and specialty pharmacies.",
  },
  {
    id: "local-pharmacies",
    label: "Community pharmacies",
    summary: "Local pharmacies dispense medicines and depend on prescription reimbursement.",
  },
  {
    id: "private-equity",
    label: "Private equity firms and investors",
    summary: "Investment firms own or finance health care businesses for financial returns.",
  },
  {
    id: "long-term-care-users",
    label: "Older and disabled people needing long-term care",
    summary:
      "People needing ongoing help with daily activities depend on home care or residential facilities.",
  },
  {
    id: "future-care-users",
    label: "People who will need care in the future",
    summary: "People may need future treatments and benefit from prevention and medical research.",
  },
  {
    id: "emergency-care-users",
    label: "People needing emergency or trauma care",
    summary: "People with urgent conditions depend on timely emergency treatment and transport.",
  },
  {
    id: "rural-residents",
    label: "Rural residents",
    summary:
      "People in rural communities depend on local health services and face geographic access barriers.",
  },
  {
    id: "older-adults",
    label: "Older adults",
    summary: "Older people depend on accessible care and coverage for age-related health needs.",
  },
  {
    id: "maternity-families",
    label: "Pregnant and postpartum people and infants",
    summary:
      "People during pregnancy and after birth and their infants depend on maternity and newborn care.",
  },
  {
    id: "underserved-residents",
    label: "Residents of areas with too few health professionals",
    summary: "People in shortage areas have limited access to local clinicians and services.",
  },
  {
    id: "ambulance-operators",
    label: "Private ambulance operators",
    summary: "Businesses provide emergency transport and bill for ambulance services.",
  },
  {
    id: "specialists",
    label: "Specialist clinicians and practices",
    summary:
      "Clinicians and practices provide specialty services whose payment and competition affect their work.",
  },
  {
    id: "health-students",
    label: "Health profession students and trainees",
    summary:
      "Students and trainees prepare for clinical careers while facing education costs and training limits.",
  },
  {
    id: "staffing-agencies",
    label: "Health care staffing agencies",
    summary: "Businesses supply temporary clinical and direct-care staff to care organizations.",
  },
  {
    id: "minority-communities",
    label: "Black, Hispanic, and Native communities",
    summary: "Communities experience racial differences in health access and outcomes.",
  },
  {
    id: "malpractice-services",
    label: "Malpractice insurers and attorneys",
    summary: "Insurers and attorneys handle medical liability coverage and litigation.",
  },
  {
    id: "fraudsters",
    label: "Fraudulent operators and cybercriminals",
    summary: "Actors exploit health payments or information systems for illicit gain.",
  },
  {
    id: "mental-health-users",
    label: "People needing mental health care",
    summary:
      "People with mental health conditions depend on accessible behavioral health treatment.",
  },
  {
    id: "caregiving-families",
    label: "Family caregivers and affected families",
    summary:
      "Families provide unpaid care or support relatives facing illness and treatment needs.",
  },
  {
    id: "addiction-communities",
    label: "People with substance use disorders and affected communities",
    summary:
      "People using drugs and their communities face addiction harms and barriers to treatment.",
  },
  {
    id: "legal-planners",
    label: "Elder-law planners",
    summary: "Legal advisers help families plan for long-term care eligibility and expenses.",
  },
  {
    id: "homeless-people",
    label: "People experiencing homelessness",
    summary:
      "People without stable housing face social needs that health systems struggle to address.",
  },
  {
    id: "data-brokers",
    label: "Health data brokers",
    summary: "Businesses trade or market health information.",
  },
  {
    id: "public-care-users",
    label: "People relying on publicly funded care",
    summary:
      "People depend on public coverage and public care capacity rather than a private alternative.",
  },
  {
    id: "researchers",
    label: "Medical researchers and research institutions",
    summary:
      "Researchers and institutions develop treatments and depend on research priorities and funding.",
  },
  {
    id: "private-practices",
    label: "Cash-pay and private care practices",
    summary: "Practices earn revenue from privately paid care outside public coverage.",
  },
]

export const GROUP_BY_ID: Record<string, Group> = Object.fromEntries(GROUPS.map((g) => [g.id, g]))
