/**
 * Completeness check. Three checklists:
 *  1. Every dimension on which a move to universal coverage can trade off
 *     (drawn from the Commonwealth Fund's performance domains, the WHO health
 *     system building blocks, and the CBO single-payer design list).
 *  2. Every group of people or organizations affected.
 *  3. Every part of today's system that has to change or be decided on.
 * Each item lists where the site covers it. Automatic checks below verify
 * that every step, task, change, and money flow carries its trade-off.
 */
import { BENCHMARKS } from "./benchmarks"
import { MODEL } from "./model"
import { COST_BY_ID, COST_ITEMS } from "./calculations"
import { CHANGES } from "./changes"
import { DECISIONS } from "./decisions"
import { ALL_STEPS, STEP_BY_ID } from "./plan"
import { RISKS } from "./risks"
import { STEP_EXTRAS } from "./step-extras"
import { TASK_TRADEOFFS } from "./task-tradeoffs"
import { TRADEOFFS } from "./tradeoffs"

export type Ref =
  | { kind: "step"; id: string }
  | { kind: "cost"; id: string }
  | { kind: "change"; id: string }
  | { kind: "tradeoff"; id: string }
  | { kind: "risk"; id: string }
  | { kind: "decision"; id: string }

export type CoverageItem = { id: string; label: string; refs: Ref[] }
export type CoverageGroup = { id: string; title: string; basis: string; items: CoverageItem[] }

const step = (id: string): Ref => ({ kind: "step", id })
const cost = (id: string): Ref => ({ kind: "cost", id })
const change = (id: string): Ref => ({ kind: "change", id })
const tradeoff = (id: string): Ref => ({ kind: "tradeoff", id })
const risk = (id: string): Ref => ({ kind: "risk", id })
const decision = (id: string): Ref => ({ kind: "decision", id })

export const COVERAGE: CoverageGroup[] = [
  {
    id: "dimensions",
    title: "Trade-off dimensions",
    basis:
      "Commonwealth Fund performance domains (access, care process, administrative efficiency, equity, outcomes), WHO building blocks (service delivery, workforce, information, medicines, financing, governance), and the design choices CBO lists for single-payer systems.",
    items: [
      {
        id: "national-cost",
        label: "Total national health spending",
        refs: [cost("service-hospital"), cost("use-insurer-overhead"), cost("budget-ten-year")],
      },
      {
        id: "federal-cost",
        label: "Federal budget and deficit",
        refs: [
          cost("budget-federal"),
          cost("budget-ten-year"),
          cost("source-fedGap"),
          cost("phase-in-borrowing"),
        ],
      },
      {
        id: "state-cost",
        label: "State and local budgets",
        refs: [cost("budget-states"), step("state-moe-design"), change("provider-taxes")],
      },
      {
        id: "household-cost",
        label: "Household finances by income",
        refs: [
          cost("household-income-grid"),
          cost("household-family-esi-100k"),
          cost("household-medicaid-family-30k"),
        ],
      },
      {
        id: "employer-cost",
        label: "Employer costs by firm type",
        refs: [cost("employer-small-none"), cost("employer-large"), cost("employer-high-wage")],
      },
      {
        id: "financing-fairness",
        label: "Progressivity and fairness of financing",
        refs: [
          decision("financing"),
          tradeoff("taxes"),
          cost("source-hhPremium"),
          cost("source-hhTopSurtax"),
        ],
      },
      {
        id: "financial-protection",
        label: "Protection from medical bills and debt",
        refs: [tradeoff("financial-security"), cost("source-hhOop"), change("medical-debt")],
      },
      {
        id: "coverage-breadth",
        label: "Who is covered (eligibility, immigrants, visitors)",
        refs: [decision("eligibility"), step("auto-enrollment"), change("corrections")],
      },
      {
        id: "benefit-breadth",
        label: "What is covered (benefit breadth vs. cost)",
        refs: [decision("benefits"), step("define-benefits"), step("new-benefits-launch")],
      },
      {
        id: "cost-sharing",
        label: "Cost sharing vs. induced demand",
        refs: [decision("cost-sharing"), change("cost-sharing")],
      },
      {
        id: "wait-times",
        label: "Wait times and speed of access",
        refs: [tradeoff("wait-times-esi"), step("wait-time-guarantee"), cost("wait-queue-model")],
      },
      {
        id: "provider-acceptance",
        label: "Provider acceptance and participation",
        refs: [
          tradeoff("access-medicaid-uninsured"),
          step("provider-enrollment"),
          risk("physician-exit"),
        ],
      },
      {
        id: "capacity",
        label: "Capacity: workforce, beds, equipment",
        refs: [
          step("capacity-expansion"),
          cost("use-workforce"),
          cost("onetime-capacity"),
          step("ongoing-capacity-planning"),
        ],
      },
      {
        id: "geography",
        label: "Rural and geographic access",
        refs: [cost("onetime-ruralCapital"), change("cah"), change("rhc-fqhc-pps")],
      },
      {
        id: "quality",
        label: "Quality of care and health outcomes",
        refs: [tradeoff("quality"), step("evaluation-review")],
      },
      {
        id: "choice-plan",
        label: "Choice of plan",
        refs: [tradeoff("choice"), decision("payer-structure"), decision("managed-care")],
      },
      {
        id: "choice-provider",
        label: "Choice of provider (networks)",
        refs: [change("networks"), step("integrated-care-orgs")],
      },
      {
        id: "two-tier",
        label: "Private tier vs. single queue (duplicative insurance, opt-out)",
        refs: [decision("duplicative-insurance"), risk("two-tier"), change("dpc")],
      },
      {
        id: "admin-efficiency",
        label: "Administrative efficiency (payer and provider)",
        refs: [
          tradeoff("private-insurance-efficiency"),
          cost("use-administration"),
          cost("saving-hospital-billing"),
          cost("saving-physician-billing"),
        ],
      },
      {
        id: "insurer-functions",
        label: "What private insurers do well that is lost (care management, service competition)",
        refs: [
          tradeoff("private-insurance-efficiency"),
          step("integrated-care-orgs"),
          step("medicare-upgrade"),
        ],
      },
      {
        id: "prices",
        label: "Provider prices and incomes",
        refs: [
          decision("rate-level"),
          tradeoff("provider-income"),
          cost("service-physicianClinical"),
        ],
      },
      {
        id: "hospital-finance",
        label: "Hospital finances, closures, consolidation",
        refs: [
          step("hospital-transition-fund"),
          risk("hospital-closures"),
          change("hospital-antitrust"),
        ],
      },
      {
        id: "drug-innovation",
        label: "Drug prices vs. pharmaceutical innovation",
        refs: [tradeoff("innovation-drugs"), cost("loss-pharma"), decision("drug-pricing")],
      },
      {
        id: "device-innovation",
        label: "Device and care-model innovation",
        refs: [change("devices"), step("hta-institute"), change("aco-cmmi")],
      },
      {
        id: "jobs",
        label: "Jobs lost and created",
        refs: [
          tradeoff("jobs"),
          cost("worker-program"),
          cost("jobs-insurers"),
          cost("jobs-gain-care"),
        ],
      },
      {
        id: "labor-mobility",
        label: "Job lock, entrepreneurship, early retirement",
        refs: [tradeoff("labor-mobility"), step("end-esi")],
      },
      {
        id: "wages",
        label: "Wage effects of employer costs",
        refs: [
          step("employer-coordination"),
          cost("source-hhIncomeTax"),
          cost("household-medicaid-family-30k"),
        ],
      },
      {
        id: "shareholders",
        label: "Shareholder and investor losses",
        refs: [cost("loss-insurer-equity"), cost("loss-pharma"), cost("loss-pbm")],
      },
      {
        id: "equity",
        label: "Equity by income, race, and geography",
        refs: [tradeoff("equity"), cost("household-income-grid")],
      },
      {
        id: "governance",
        label: "Government capacity, capture, and political risk",
        refs: [tradeoff("government-risk"), risk("capture")],
      },
      {
        id: "federalism",
        label: "Federalism: state control vs. national uniformity",
        refs: [decision("administration"), step("state-moe-design"), change("waivers")],
      },
      {
        id: "liberty",
        label: "Individual liberty (banning duplicative coverage, mandatory taxes)",
        refs: [decision("duplicative-insurance")],
      },
      {
        id: "privacy",
        label: "Privacy and data concentration",
        refs: [step("data-privacy"), change("health-card")],
      },
      {
        id: "fraud",
        label: "Fraud and improper payments",
        refs: [step("program-integrity"), risk("fraud")],
      },
      {
        id: "transition",
        label: "Transition disruption and speed",
        refs: [decision("transition-speed"), cost("phase-in-borrowing"), step("rate-convergence")],
      },
      {
        id: "fiscal-stability",
        label: "Recession and fiscal stability",
        refs: [risk("recession"), step("trust-fund")],
      },
      {
        id: "cost-growth",
        label: "Long-run cost growth",
        refs: [step("spending-target"), risk("cost-overrun")],
      },
      {
        id: "ltc-families",
        label: "Long-term care and family caregivers",
        refs: [step("ltss-entitlement"), cost("service-otherResidential")],
      },
      {
        id: "public-health",
        label: "Public health and surveillance",
        refs: [change("cdc-public-health"), cost("use-publicHealth"), change("vaccines")],
      },
      {
        id: "research",
        label: "Public research funding",
        refs: [change("nih"), cost("use-research")],
      },
      {
        id: "contested",
        label: "Contested services (abortion, gender-affirming care)",
        refs: [decision("contested-services"), change("hyde")],
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
    basis: "Every group whose coverage, costs, income, or role changes.",
    items: [
      {
        id: "employer-insured",
        label: "People with employer coverage",
        refs: [step("end-esi"), tradeoff("wait-times-esi"), cost("household-family-esi-100k")],
      },
      {
        id: "medicaid",
        label: "Medicaid enrollees",
        refs: [
          step("wind-down-medicaid"),
          tradeoff("access-medicaid-uninsured"),
          cost("household-medicaid-family-30k"),
        ],
      },
      {
        id: "uninsured",
        label: "Uninsured people",
        refs: [step("final-wave"), tradeoff("access-medicaid-uninsured")],
      },
      {
        id: "medicare",
        label: "Medicare beneficiaries (traditional)",
        refs: [step("medicare-upgrade"), cost("household-retired-couple"), cost("source-hhSmi")],
      },
      {
        id: "ma",
        label: "Medicare Advantage enrollees",
        refs: [change("medicare-c"), decision("managed-care")],
      },
      {
        id: "marketplace",
        label: "Marketplace enrollees",
        refs: [step("marketplace-closure"), cost("household-family-marketplace-60k")],
      },
      {
        id: "self-employed",
        label: "Self-employed and gig workers",
        refs: [cost("household-self-employed-80k"), step("tax-legislation")],
      },
      {
        id: "high-earners",
        label: "High earners",
        refs: [
          cost("household-high-earner-400k"),
          cost("household-millionaire"),
          cost("source-hhTopSurtax"),
        ],
      },
      {
        id: "children",
        label: "Children",
        refs: [step("wave-one-enrollment"), change("chip"), change("school-health")],
      },
      { id: "pregnant", label: "Pregnant and postpartum people", refs: [change("maternity")] },
      {
        id: "disabled-ltc",
        label: "People with disabilities and long-term care needs",
        refs: [step("ltss-entitlement"), change("medicaid-ltss")],
      },
      { id: "duals", label: "Dual eligibles", refs: [change("dsnp"), change("msp-lis")] },
      {
        id: "immigrants",
        label: "Immigrants, including undocumented",
        refs: [decision("eligibility")],
      },
      {
        id: "veterans-military",
        label: "Veterans and military families",
        refs: [change("va"), change("tricare"), decision("veterans-military")],
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
        refs: [step("hospital-global-budgets"), cost("onetime-hospitalFund"), change("cah")],
      },
      {
        id: "physicians",
        label: "Physicians (primary care, specialists)",
        refs: [step("fee-schedule"), risk("physician-exit")],
      },
      {
        id: "dentists",
        label: "Dentists, optometrists, audiologists",
        refs: [step("new-benefits-launch"), cost("service-dental")],
      },
      {
        id: "ltc-providers",
        label: "Nursing homes and home-care agencies",
        refs: [cost("service-nursing"), cost("service-homeHealth")],
      },
      {
        id: "health-centers",
        label: "Community health centers and rural clinics",
        refs: [change("rhc-fqhc-pps"), change("hrsa")],
      },
      { id: "pharmacies", label: "Pharmacies", refs: [change("pbm"), step("national-formulary")] },
      {
        id: "insurers",
        label: "Health insurers",
        refs: [step("insurer-runoff"), cost("use-insurer-overhead"), cost("loss-insurer-equity")],
      },
      { id: "pbms", label: "Pharmacy benefit managers", refs: [cost("loss-pbm"), change("pbm")] },
      {
        id: "brokers",
        label: "Brokers and benefits consultants",
        refs: [cost("loss-brokers"), cost("jobs-brokers")],
      },
      {
        id: "pharma",
        label: "Drug and device manufacturers",
        refs: [cost("loss-pharma"), change("devices"), change("biosimilars")],
      },
      {
        id: "employers",
        label: "Employers (small, large, high-wage, non-offering)",
        refs: [
          cost("employer-small-none"),
          cost("employer-small-offer"),
          cost("employer-large"),
          cost("employer-high-wage"),
        ],
      },
      {
        id: "unions",
        label: "Unions and multiemployer funds",
        refs: [change("taft-hartley"), step("employer-coordination")],
      },
      {
        id: "admin-workers",
        label: "Insurance and billing workers",
        refs: [step("worker-transition"), cost("jobs-providerBilling"), cost("jobs-tpa")],
      },
      {
        id: "states",
        label: "State and local governments",
        refs: [cost("budget-states"), change("state-employee")],
      },
      { id: "federal", label: "Federal government", refs: [cost("budget-federal")] },
      {
        id: "public-workers",
        label: "Public employees and retirees",
        refs: [change("fehb"), change("state-employee")],
      },
    ],
  },
  {
    id: "system",
    title: "Parts of today's system",
    basis:
      "Every payer and program in the CMS National Health Expenditure accounts, plus the laws, agencies, and private institutions that govern them.",
    items: CHANGES.map((c) => ({ id: c.id, label: c.item, refs: [change(c.id), step(c.stepId)] })),
  },
]

/** Does a reference point at something that exists? */
export function refExists(r: Ref) {
  switch (r.kind) {
    case "step":
      return Boolean(STEP_BY_ID[r.id])
    case "cost":
      return Boolean(COST_BY_ID[r.id])
    case "change":
      return CHANGES.some((c) => c.id === r.id)
    case "tradeoff":
      return TRADEOFFS.some((t) => t.id === r.id)
    case "risk":
      return RISKS.some((x) => x.id === r.id)
    case "decision":
      return DECISIONS.some((d) => d.id === r.id)
  }
}

for (const g of [...COVERAGE, ...BENCHMARKS]) {
  for (const item of g.items) {
    for (const r of item.refs) {
      if (!refExists(r))
        throw new Error(`Coverage item ${item.id} references missing ${r.kind} ${r.id}`)
    }
  }
}

/** Automatic checks over the whole plan. Each returns the IDs that fail. */
export const CHECKS = [
  {
    label: "Every 2024 spending line (uses of funds) has its own calculation page",
    total: MODEL.useLines.length,
    failures: MODEL.useLines
      .filter(
        (l) =>
          !COST_ITEMS.some(
            (c) =>
              c.id === `service-${l.id}` ||
              c.id === `use-${l.id}` ||
              (l.id === "governmentAdministration" && c.id === "use-administration") ||
              (l.id === "netCostOfInsurance" && c.id === "use-insurer-overhead"),
          ),
      )
      .map((l) => l.id),
  },
  {
    label: "Every payment stream (sources of funds), old and new, has its own calculation page",
    total: MODEL.sourceLines.length,
    failures: MODEL.sourceLines.filter((l) => !COST_BY_ID[`source-${l.id}`]).map((l) => l.id),
  },
  {
    label: "Every cost item states its trade-off",
    total: COST_ITEMS.length,
    failures: COST_ITEMS.filter((c) => !c.tradeoff.trim()).map((c) => c.id),
  },
  {
    label: "Every task states its trade-off",
    total: ALL_STEPS.reduce((s, x) => s + x.tasks.length, 0),
    failures: ALL_STEPS.flatMap((s) =>
      s.tasks
        .map((_, i) => (TASK_TRADEOFFS[s.id]?.[i]?.trim() ? null : `${s.id}#${i + 1}`))
        .filter((x): x is string => x !== null),
    ),
  },
  {
    label: "Every system change states its trade-off",
    total: CHANGES.length,
    failures: CHANGES.filter((c) => !c.tradeoff.trim()).map((c) => c.id),
  },
  {
    label: "Every step has pros and cons",
    total: ALL_STEPS.length,
    failures: ALL_STEPS.filter((s) => !s.pros.length || !s.cons.length).map((s) => s.id),
  },
  {
    label: "Every step has at least one risk with a mitigation",
    total: ALL_STEPS.length,
    failures: ALL_STEPS.filter(
      (s) => s.risks.length + (STEP_EXTRAS[s.id]?.riskIds?.length ?? 0) === 0,
    ).map((s) => s.id),
  },
  {
    label: "Every step has at least two comparisons with other countries",
    total: ALL_STEPS.length,
    failures: ALL_STEPS.filter((s) => (STEP_EXTRAS[s.id]?.international.length ?? 0) < 2).map(
      (s) => s.id,
    ),
  },
  {
    label: "Every design decision has at least two alternatives and what it gives up",
    total: DECISIONS.length,
    failures: DECISIONS.filter((d) => d.alternatives.length < 2 || !d.givesUp.length).map(
      (d) => d.id,
    ),
  },
  {
    label: "Every design decision is attached to a step",
    total: DECISIONS.length,
    failures: DECISIONS.filter(
      (d) => !Object.values(STEP_EXTRAS).some((e) => e.decisionIds?.includes(d.id)),
    ).map((d) => d.id),
  },
  {
    label: "Every trade-off dimension in the register is attached to a step",
    total: TRADEOFFS.length,
    failures: TRADEOFFS.filter(
      (t) => !Object.values(STEP_EXTRAS).some((e) => e.tradeoffIds?.includes(t.id)),
    ).map((t) => t.id),
  },
  {
    label: "Every major risk is attached to a step",
    total: RISKS.length,
    failures: RISKS.filter(
      (r) => !Object.values(STEP_EXTRAS).some((e) => e.riskIds?.includes(r.id)),
    ).map((r) => r.id),
  },
  ...BENCHMARKS.map((b) => ({
    label: `Independent benchmark: ${b.title} (${b.source}): every item mapped to the plan`,
    total: b.items.length,
    failures: b.items.filter((i) => i.refs.length === 0).map((i) => i.id),
  })),
  {
    label: "Every coverage checklist item links to at least one place on the site",
    total: COVERAGE.reduce((s, g) => s + g.items.length, 0),
    failures: COVERAGE.flatMap((g) => g.items.filter((i) => i.refs.length === 0).map((i) => i.id)),
  },
]
