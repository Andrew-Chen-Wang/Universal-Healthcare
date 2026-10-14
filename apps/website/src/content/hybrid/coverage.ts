/**
 * Hybrid plan: the completeness checklist. Same dimensions and groups as the
 * single-payer plan's (coverage.ts), each linked to where the hybrid covers
 * it. An empty refs list marks a gap the checks report.
 */
import type { CoverageGroup, Ref } from "../coverage"
import { HY_CHANGES } from "./changes"

const step = (id: string): Ref => ({ kind: "step", id })
const cost = (id: string): Ref => ({ kind: "cost", id })
const change = (id: string): Ref => ({ kind: "change", id })
const tradeoff = (id: string): Ref => ({ kind: "tradeoff", id })
const risk = (id: string): Ref => ({ kind: "risk", id })
const decision = (id: string): Ref => ({ kind: "decision", id })

export const HY_COVERAGE: CoverageGroup[] = [
  {
    id: "dimensions",
    title: "Trade-off dimensions",
    basis:
      "The same domains as the single-payer plan's checklist: Commonwealth Fund performance domains, WHO building blocks, and the design choices any universal system has to make.",
    items: [
      {
        id: "national-cost",
        label: "Total national health spending",
        refs: [cost("hy-national"), tradeoff("hy-cost")],
      },
      {
        id: "federal-cost",
        label: "Federal budget and deficit",
        refs: [cost("hy-federal-balance"), cost("hy-subsidies")],
      },
      {
        id: "state-cost",
        label: "State and local budgets",
        refs: [step("medicaid-alignment"), change("provider-taxes")],
      },
      {
        id: "household-cost",
        label: "Household finances by income",
        refs: [cost("hy-who-pays"), cost("hy-hh-family-esi-100k"), cost("hy-hh-millionaire")],
      },
      {
        id: "employer-cost",
        label: "Employer costs",
        refs: [cost("hy-family-premium"), step("employer-mandate")],
      },
      {
        id: "financing-fairness",
        label: "Progressivity and fairness of financing",
        refs: [decision("hy-financing"), tradeoff("hy-taxes"), cost("hy-top-end-taxes")],
      },
      {
        id: "financial-protection",
        label: "Protection from medical bills and debt",
        refs: [step("define-benefits"), change("medical-debt"), change("cost-sharing")],
      },
      {
        id: "coverage-breadth",
        label: "Who is covered",
        refs: [decision("hy-eligibility"), step("auto-enrollment"), step("final-wave")],
      },
      {
        id: "benefit-breadth",
        label: "What is covered",
        refs: [decision("hy-benefits"), step("define-benefits"), step("new-benefits-launch")],
      },
      {
        id: "cost-sharing",
        label: "Cost sharing vs. induced demand",
        refs: [step("define-benefits"), change("cost-sharing")],
      },
      {
        id: "wait-times",
        label: "Wait times and speed of access",
        refs: [tradeoff("hy-waits"), step("wait-time-guarantee"), risk("hy-two-tier-gap")],
      },
      {
        id: "provider-acceptance",
        label: "Provider acceptance and participation",
        refs: [step("open-regulated-plans"), change("networks")],
      },
      {
        id: "capacity",
        label: "Capacity: workforce, beds, equipment",
        refs: [step("workforce-start"), step("capacity-expansion"), cost("hy-workforce")],
      },
      {
        id: "geography",
        label: "Rural and geographic access",
        refs: [step("price-cap-phase-in"), change("cah"), change("rhc-fqhc-pps")],
      },
      {
        id: "quality",
        label: "Quality of care and health outcomes",
        refs: [step("evaluation-review")],
      },
      {
        id: "choice-plan",
        label: "Choice of plan",
        refs: [tradeoff("hy-choice"), decision("hy-payer-structure")],
      },
      {
        id: "choice-provider",
        label: "Choice of provider (networks)",
        refs: [change("networks"), step("open-regulated-plans")],
      },
      {
        id: "two-tier",
        label: "Faster access for some plans vs. one queue",
        refs: [decision("hy-two-tier"), risk("hy-two-tier-gap")],
      },
      {
        id: "admin-efficiency",
        label: "Administrative efficiency",
        refs: [tradeoff("hy-admin"), step("eligibility-data-hub"), cost("hy-overhead")],
      },
      {
        id: "insurer-functions",
        label: "What private insurers do that changes",
        refs: [step("insurer-conversion"), tradeoff("hy-insurer-jobs")],
      },
      {
        id: "prices",
        label: "Provider prices and incomes",
        refs: [decision("hy-price-setting"), tradeoff("hy-provider-income"), cost("hy-price-cap")],
      },
      {
        id: "hospital-finance",
        label: "Hospital finances, closures, consolidation",
        refs: [
          step("price-cap-phase-in"),
          risk("hy-hospital-revenue"),
          change("hospital-antitrust"),
        ],
      },
      {
        id: "drug-innovation",
        label: "Drug prices vs. pharmaceutical innovation",
        refs: [decision("hy-drug-pricing"), cost("hy-drugs"), risk("hy-drug-launch")],
      },
      {
        id: "device-innovation",
        label: "Device and care-model innovation",
        refs: [change("devices"), step("hta-institute")],
      },
      {
        id: "jobs",
        label: "Jobs lost and created",
        refs: [tradeoff("hy-insurer-jobs"), change("brokers")],
      },
      {
        id: "labor-mobility",
        label: "Job lock, entrepreneurship, early retirement",
        refs: [step("employer-mandate"), decision("hy-employer-role")],
      },
      {
        id: "wages",
        label: "Wage effects of employer costs",
        refs: [cost("hy-hh-family-esi-100k"), cost("hy-family-premium")],
      },
      {
        id: "shareholders",
        label: "Shareholder and investor losses",
        refs: [step("insurer-conversion"), change("insurers")],
      },
      {
        id: "equity",
        label: "Equity by income, race, and geography",
        refs: [tradeoff("hy-equity"), cost("hy-who-pays")],
      },
      {
        id: "governance",
        label: "Government capacity, capture, and political risk",
        refs: [step("create-regulator"), risk("hy-capture")],
      },
      {
        id: "federalism",
        label: "Federalism: state control vs. national uniformity",
        refs: [change("state-insurance"), step("medicaid-alignment"), change("waivers")],
      },
      {
        id: "liberty",
        label: "Individual liberty (mandates, default enrollment)",
        refs: [decision("hy-eligibility")],
      },
      {
        id: "privacy",
        label: "Privacy and data concentration",
        refs: [step("data-privacy"), change("hipaa")],
      },
      {
        id: "fraud",
        label: "Fraud and improper payments",
        refs: [step("program-integrity"), cost("hy-ma-fix")],
      },
      {
        id: "transition",
        label: "Transition disruption and speed",
        refs: [step("open-regulated-plans"), step("price-cap-phase-in")],
      },
      {
        id: "fiscal-stability",
        label: "Recession and fiscal stability",
        refs: [risk("hy-revenue"), step("full-tax-rates")],
      },
      {
        id: "cost-growth",
        label: "Long-run cost growth",
        refs: [step("spending-target"), risk("hy-cost-overrun")],
      },
      {
        id: "ltc-families",
        label: "Long-term care and family caregivers",
        refs: [step("ltc-decision"), change("medicaid-ltss")],
      },
      {
        id: "public-health",
        label: "Public health and surveillance",
        refs: [change("cdc-public-health"), change("vaccines")],
      },
      { id: "research", label: "Public research funding", refs: [change("nih")] },
      {
        id: "contested",
        label: "Contested services (abortion, gender-affirming care)",
        refs: [change("hyde")],
      },
      {
        id: "malpractice",
        label: "Malpractice and defensive medicine",
        refs: [step("malpractice-pilot"), change("malpractice")],
      },
    ],
  },
  {
    id: "groups",
    title: "Affected groups",
    basis: "Everyone whose coverage, costs, income, or work changes.",
    items: [
      {
        id: "employer-insured",
        label: "People with employer coverage",
        refs: [step("employer-mandate"), tradeoff("hy-waits"), cost("hy-hh-family-esi-100k")],
      },
      {
        id: "medicaid",
        label: "Medicaid enrollees",
        refs: [step("medicaid-alignment"), cost("hy-hh-medicaid-family-30k")],
      },
      {
        id: "uninsured",
        label: "Uninsured people",
        refs: [step("auto-enrollment"), cost("hy-coverage")],
      },
      {
        id: "medicare",
        label: "Medicare beneficiaries (traditional)",
        refs: [step("medicare-fixes"), cost("hy-medicare-dvh"), cost("hy-hh-retired-couple")],
      },
      {
        id: "ma",
        label: "Medicare Advantage enrollees",
        refs: [change("medicare-c"), cost("hy-ma-fix")],
      },
      {
        id: "marketplace",
        label: "Marketplace enrollees",
        refs: [step("open-regulated-plans"), cost("hy-hh-family-marketplace-60k")],
      },
      {
        id: "self-employed",
        label: "Self-employed and gig workers",
        refs: [cost("hy-hh-self-employed-80k"), step("income-based-premiums")],
      },
      {
        id: "high-earners",
        label: "High earners",
        refs: [cost("hy-hh-high-earner-400k"), cost("hy-hh-millionaire"), cost("hy-top-end-taxes")],
      },
      { id: "children", label: "Children", refs: [change("chip"), change("school-health")] },
      { id: "pregnant", label: "Pregnant and postpartum people", refs: [change("maternity")] },
      {
        id: "disabled-ltc",
        label: "People with disabilities and long-term care needs",
        refs: [step("ltc-decision"), change("medicaid-ltss")],
      },
      { id: "duals", label: "Dual eligibles", refs: [change("dsnp"), change("msp-lis")] },
      { id: "immigrants", label: "Immigrants, including undocumented", refs: [step("final-wave")] },
      {
        id: "veterans-military",
        label: "Veterans and military families",
        refs: [change("va"), change("tricare")],
      },
      { id: "native", label: "American Indians and Alaska Natives", refs: [change("ihs")] },
      {
        id: "incarcerated",
        label: "Incarcerated and recently released people",
        refs: [change("corrections")],
      },
      {
        id: "homeless",
        label: "People experiencing homelessness, migrant workers",
        refs: [change("outreach-hard-to-reach")],
      },
      { id: "hiv", label: "People with HIV", refs: [change("ryan-white")] },
      { id: "kidney", label: "People with kidney failure", refs: [change("esrd")] },
      {
        id: "hospitals",
        label: "Hospitals (academic, suburban, rural, safety-net)",
        refs: [step("commercial-price-cap"), risk("hy-hospital-revenue"), change("cah")],
      },
      {
        id: "physicians",
        label: "Physicians (primary care, specialists)",
        refs: [step("commercial-price-cap"), change("mpfs")],
      },
      {
        id: "dentists",
        label: "Dentists, optometrists, audiologists",
        refs: [step("new-benefits-launch")],
      },
      {
        id: "ltc-providers",
        label: "Nursing homes and home-care agencies",
        refs: [step("ltc-decision")],
      },
      {
        id: "health-centers",
        label: "Community health centers and rural clinics",
        refs: [step("capacity-expansion"), change("hrsa")],
      },
      { id: "pharmacies", label: "Pharmacies", refs: [change("pbm"), step("national-formulary")] },
      {
        id: "insurers",
        label: "Health insurers",
        refs: [step("insurer-conversion"), cost("hy-overhead"), risk("hy-insurer-resistance")],
      },
      { id: "pbms", label: "Pharmacy benefit managers", refs: [change("pbm")] },
      { id: "brokers", label: "Brokers and benefits consultants", refs: [change("brokers")] },
      {
        id: "pharma",
        label: "Drug and device manufacturers",
        refs: [cost("hy-drugs"), change("devices"), change("biosimilars")],
      },
      {
        id: "employers",
        label: "Employers",
        refs: [step("employer-mandate"), cost("hy-family-premium"), risk("hy-employer-dropping")],
      },
      { id: "unions", label: "Unions and multiemployer funds", refs: [change("taft-hartley")] },
      {
        id: "admin-workers",
        label: "Insurance and billing workers",
        refs: [tradeoff("hy-insurer-jobs"), change("provider-revenue-cycle")],
      },
      {
        id: "states",
        label: "State and local governments",
        refs: [step("medicaid-alignment"), change("state-employee")],
      },
      { id: "federal", label: "Federal government", refs: [cost("hy-federal-balance")] },
      {
        id: "public-workers",
        label: "Public employees and retirees",
        refs: [change("fehb"), change("state-employee")],
      },
    ],
  },
  {
    id: "system",
    title: "Every part of today's system",
    basis:
      "Every payer and program in the CMS National Health Expenditure accounts, plus the laws, agencies, and private institutions that govern them.",
    items: HY_CHANGES.map((c) => ({
      id: c.id,
      label: c.item,
      refs: [change(c.id), step(c.stepId)],
    })),
  },
]
