/**
 * Independent completeness benchmarks: outside documents that enumerate what a
 * U.S. single-payer law must change or decide. Each entry maps to where this
 * plan covers it, and records where the plan deliberately differs.
 *
 * 1. Medicare for All Act (H.R. 3421, 118th Congress): every section in its
 *    table of contents, plus each benefit category listed in Sec. 201(a).
 * 2. CBO, "Key Design Components and Considerations for Establishing a
 *    Single-Payer Health Care System" (2019): each design component.
 */
import type { Ref } from "./coverage"

export type BenchmarkItem = { id: string; label: string; refs: Ref[]; difference?: string }
export type Benchmark = {
  id: string
  title: string
  source: string
  sourceId: string
  items: BenchmarkItem[]
}

const step = (id: string): Ref => ({ kind: "step", id })
const change = (id: string): Ref => ({ kind: "change", id })
const decision = (id: string): Ref => ({ kind: "decision", id })
const cost = (id: string): Ref => ({ kind: "cost", id })
const tradeoff = (id: string): Ref => ({ kind: "tradeoff", id })

export const BENCHMARKS: Benchmark[] = [
  {
    id: "m4a-sections",
    title: "Medicare for All Act: every section",
    source: "H.R. 3421 (118th Congress), table of contents",
    sourceId: "jayapal-m4a",
    items: [
      {
        id: "s101",
        label: "Sec. 101 Establishment of the program",
        refs: [step("create-uha"), step("draft-legislation")],
      },
      {
        id: "s102",
        label: "Sec. 102 Universal coverage",
        refs: [decision("eligibility"), step("auto-enrollment")],
      },
      {
        id: "s103",
        label: "Sec. 103 Freedom of choice (of provider)",
        refs: [change("networks"), step("provider-enrollment")],
      },
      { id: "s104", label: "Sec. 104 Non-discrimination", refs: [change("nondiscrimination")] },
      {
        id: "s105",
        label: "Sec. 105 Enrollment",
        refs: [step("auto-enrollment"), change("health-card")],
      },
      {
        id: "s106",
        label: "Sec. 106 Effective date of benefits",
        refs: [decision("transition-speed")],
        difference:
          "The bill phases in over 2 years; this plan uses 4 years plus an 18-month build.",
      },
      {
        id: "s107",
        label: "Sec. 107 Prohibition against duplicating coverage",
        refs: [decision("duplicative-insurance"), change("duplicative-ban")],
        difference:
          "This plan sunsets the ban for a mandatory congressional review in Year 10 and adds a wait-time guarantee.",
      },
      {
        id: "s201",
        label: "Sec. 201 Comprehensive benefits",
        refs: [step("define-benefits"), decision("benefits")],
      },
      {
        id: "s202",
        label: "Sec. 202 No cost-sharing",
        refs: [decision("cost-sharing"), change("cost-sharing")],
        difference: "This plan keeps a standby copay schedule Congress can switch on.",
      },
      { id: "s203", label: "Sec. 203 Exclusions and limitations", refs: [step("define-benefits")] },
      {
        id: "s204",
        label: "Sec. 204 Long-term care services",
        refs: [step("ltss-entitlement"), change("medicaid-ltss")],
        difference:
          "The bill covers institutional LTC fully; this plan requires an income-tested room-and-board contribution.",
      },
      {
        id: "s301",
        label: "Sec. 301 Provider participation and standards; whistleblower protections",
        refs: [step("provider-enrollment"), step("program-integrity")],
      },
      {
        id: "s302",
        label: "Sec. 302 Qualifications for providers",
        refs: [step("provider-enrollment")],
      },
      {
        id: "s303",
        label: "Sec. 303 Use of private contracts (opt-out)",
        refs: [step("provider-enrollment"), change("dpc")],
      },
      {
        id: "s401",
        label: "Sec. 401 Administration",
        refs: [step("create-uha"), decision("administration")],
      },
      { id: "s402", label: "Sec. 402 Consultation", refs: [change("stakeholder-consultation")] },
      { id: "s403", label: "Sec. 403 Regional administration", refs: [step("create-uha")] },
      {
        id: "s404",
        label: "Sec. 404 Beneficiary ombudsman",
        refs: [step("create-uha"), change("appeals")],
      },
      {
        id: "s405",
        label: "Sec. 405 Conduct of related health programs",
        refs: [step("coordinate-other-payers")],
      },
      {
        id: "s411",
        label: "Sec. 411 Fraud and abuse sanctions",
        refs: [step("program-integrity"), change("stark-aks")],
      },
      {
        id: "s501",
        label: "Sec. 501 Quality standards",
        refs: [step("evaluation-review"), change("mips-vbp")],
      },
      {
        id: "s502",
        label: "Sec. 502 Addressing health care disparities",
        refs: [change("health-equity-office"), tradeoff("equity")],
      },
      {
        id: "s601",
        label: "Sec. 601 National health budget",
        refs: [step("spending-target")],
        difference:
          "The bill sets an annual national budget; this plan uses a growth target with congressional veto.",
      },
      {
        id: "s611",
        label: "Sec. 611 Global budgets for institutional providers",
        refs: [step("hospital-global-budgets"), decision("provider-payment")],
      },
      {
        id: "s612",
        label: "Sec. 612 Fee-for-service for individual providers",
        refs: [step("fee-schedule")],
      },
      {
        id: "s613",
        label: "Sec. 613 Accurate valuation of physician fee schedule services",
        refs: [step("fee-schedule"), change("mpfs")],
      },
      {
        id: "s614",
        label: "Sec. 614 Payment prohibitions; capital expenditures",
        refs: [
          decision("provider-ownership"),
          step("ongoing-capacity-planning"),
          cost("use-structures"),
        ],
        difference:
          "The bill bars payments from funding profit; this plan allows for-profit providers with disclosure and capital controls.",
      },
      {
        id: "s615",
        label: "Sec. 615 Office of Health Equity",
        refs: [change("health-equity-office")],
      },
      {
        id: "s616",
        label: "Sec. 616 Office of Primary Care",
        refs: [change("primary-care-office")],
      },
      {
        id: "s617",
        label: "Sec. 617 Payments for drugs and devices",
        refs: [step("national-formulary"), decision("drug-pricing"), change("devices")],
      },
      {
        id: "s701",
        label: "Sec. 701 Trust fund",
        refs: [step("trust-fund")],
        difference: "The bill does not specify financing; this plan names every tax.",
      },
      {
        id: "s801",
        label:
          "Sec. 801 ERISA: prohibition of duplicative employee benefits; workers' compensation coordination",
        refs: [step("erisa-and-insurance-law"), change("workers-comp")],
      },
      {
        id: "s802",
        label: "Sec. 802 COBRA and group health plan requirements",
        refs: [change("cobra")],
      },
      { id: "s803", label: "Sec. 803 Effective date of ERISA title", refs: [step("end-esi")] },
      {
        id: "s901",
        label:
          "Sec. 901 Relationship to Medicare, Medicaid, CHIP, FEHB, TRICARE, VA, IHS, school programs",
        refs: [
          change("medicaid-acute"),
          change("chip"),
          change("fehb"),
          change("tricare"),
          change("va"),
          change("ihs"),
          change("school-health"),
        ],
      },
      {
        id: "s902",
        label: "Sec. 902 Sunset of the Exchanges",
        refs: [step("marketplace-closure")],
      },
      {
        id: "s903",
        label: "Sec. 903 Sunset of pay-for-performance programs",
        refs: [change("mips-vbp")],
        difference: "This plan keeps a single 2% quality withhold for hospitals.",
      },
      {
        id: "s1001",
        label: "Sec. 1001 Two-year transition",
        refs: [decision("transition-speed"), step("wave-one-enrollment")],
      },
      { id: "s1002", label: "Sec. 1002 Transitional buy-in", refs: [change("transition-buy-in")] },
      {
        id: "s1011",
        label: "Sec. 1011 End the 24-month disability waiting period",
        refs: [change("ssdi-waiting-period")],
      },
      { id: "s1012", label: "Sec. 1012 Continuity of care", refs: [change("continuity-of-care")] },
      { id: "s1101", label: "Sec. 1101 Definitions", refs: [step("draft-legislation")] },
      { id: "s1102", label: "Sec. 1102 Rules of construction", refs: [step("legal-defense")] },
      {
        id: "s1103",
        label: "Sec. 1103 No use of resources for immigration enforcement",
        refs: [step("data-privacy")],
      },
    ],
  },
  {
    id: "m4a-benefits",
    title: "Medicare for All Act: every benefit category (Sec. 201(a))",
    source: "H.R. 3421 (118th Congress), Sec. 201(a)(1)–(18)",
    sourceId: "jayapal-m4a",
    items: [
      {
        id: "b1",
        label: "Hospital services incl. emergency and inpatient drugs",
        refs: [cost("service-hospital")],
      },
      { id: "b2", label: "Ambulatory patient services", refs: [cost("service-physicianClinical")] },
      {
        id: "b3",
        label: "Primary and preventive services, chronic disease management",
        refs: [change("primary-care-office"), step("fee-schedule")],
      },
      {
        id: "b4",
        label: "Prescription drugs, devices, biologics, contraceptives",
        refs: [
          cost("service-prescriptionDrugs"),
          change("biosimilars"),
          cost("service-durableEquipment"),
        ],
      },
      {
        id: "b5",
        label: "Mental health and substance use treatment",
        refs: [change("samhsa-block"), change("ccbhc"), change("counselors")],
      },
      {
        id: "b6",
        label: "Laboratory and diagnostic services",
        refs: [cost("service-physicianClinical")],
      },
      {
        id: "b7",
        label: "Reproductive care incl. abortion, contraception, assisted reproduction",
        refs: [decision("contested-services"), change("fertility"), change("title-x")],
        difference:
          "Abortion coverage is left to an explicit congressional vote; IVF is covered with evidence-based limits.",
      },
      { id: "b8", label: "Maternity and newborn care", refs: [change("maternity")] },
      {
        id: "b9",
        label: "Gender-affirming care",
        refs: [decision("contested-services")],
        difference: "Left to an explicit congressional vote.",
      },
      {
        id: "b10",
        label: "Oral health, audiology, vision",
        refs: [step("new-benefits-launch"), cost("service-dental")],
      },
      {
        id: "b11",
        label: "Rehabilitative and habilitative services and devices",
        refs: [cost("service-otherProfessional")],
      },
      {
        id: "b12",
        label: "Emergency services and transportation",
        refs: [change("ambulance"), change("emtala")],
      },
      { id: "b13", label: "EPSDT for children", refs: [change("epsdt")] },
      { id: "b14", label: "Non-emergency transportation", refs: [change("nemt")] },
      { id: "b15", label: "Long-term services and supports", refs: [step("ltss-entitlement")] },
      { id: "b16", label: "Hospice care", refs: [change("hospice")] },
      {
        id: "b17",
        label: "Marriage & family therapists and mental health counselors",
        refs: [change("counselors")],
      },
      { id: "b18", label: "Telehealth", refs: [change("telehealth")] },
    ],
  },
  {
    id: "cbo-components",
    title: "CBO's single-payer design components",
    source:
      "CBO, Key Design Components and Considerations for Establishing a Single-Payer Health Care System (2019)",
    sourceId: "cbo-single-payer-2019",
    items: [
      {
        id: "c-admin",
        label: "Administration: federal vs. state, public vs. contractors",
        refs: [decision("administration"), step("create-uha"), step("build-claims-system")],
      },
      {
        id: "c-eligibility",
        label: "Eligibility and enrollment (residency, immigrants, enrollment process)",
        refs: [decision("eligibility"), step("auto-enrollment")],
      },
      {
        id: "c-benefits",
        label: "Covered services, including long-term care",
        refs: [decision("benefits"), step("ltss-entitlement")],
      },
      { id: "c-costsharing", label: "Cost sharing", refs: [decision("cost-sharing")] },
      {
        id: "c-private",
        label: "Role of private insurance (supplementary vs. duplicative)",
        refs: [decision("duplicative-insurance"), step("insurer-runoff")],
      },
      {
        id: "c-provider-rates",
        label: "Provider payment rates",
        refs: [decision("rate-level"), step("rate-convergence")],
      },
      {
        id: "c-provider-methods",
        label: "Provider payment methods (FFS, global budgets, capitation)",
        refs: [decision("provider-payment"), step("integrated-care-orgs")],
      },
      {
        id: "c-ownership",
        label: "Provider ownership and capital investment",
        refs: [decision("provider-ownership"), step("ongoing-capacity-planning")],
      },
      {
        id: "c-drugs",
        label: "Purchasing prescription drugs",
        refs: [decision("drug-pricing"), step("national-formulary")],
      },
      {
        id: "c-cost-containment",
        label: "Cost containment (budgets, targets)",
        refs: [step("spending-target")],
      },
      {
        id: "c-financing",
        label: "Financing sources",
        refs: [decision("financing"), step("tax-legislation")],
      },
      {
        id: "c-transition",
        label: "Transition: timing, provider and insurer adjustment, displaced workers",
        refs: [
          decision("transition-speed"),
          step("worker-transition"),
          step("hospital-transition-fund"),
        ],
      },
      {
        id: "c-supply",
        label: "Effects on provider supply and wait times",
        refs: [step("capacity-expansion"), cost("wait-queue-model"), tradeoff("wait-times-esi")],
      },
      {
        id: "c-spending",
        label: "Effects on national and government spending",
        refs: [cost("budget-ten-year"), cost("budget-federal")],
      },
      {
        id: "c-economy",
        label: "Effects on the economy and labor market",
        refs: [tradeoff("macroeconomy"), tradeoff("jobs"), tradeoff("labor-mobility")],
      },
      {
        id: "c-other-programs",
        label: "Interaction with VA, TRICARE, IHS, workers' comp",
        refs: [step("coordinate-other-payers"), decision("veterans-military")],
      },
    ],
  },
]
