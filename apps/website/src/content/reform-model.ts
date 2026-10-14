/**
 * Prices reforms that keep today's insurers: incremental changes, a public
 * option, automatic enrollment, or a regulated multi-payer system. The
 * single-payer model (model.ts) re-prices every covered dollar; this one starts
 * from the same 2024 baseline and adds each change the picks make, one line at
 * a time, so every line can be checked on its own:
 *
 *   1. Coverage: people newly covered use more care.
 *   2. Provider prices: a cap on commercial prices, or one rate for every payer.
 *   3. Drug prices: negotiated or reference prices for every payer.
 *   4. New benefits: dental, vision, and hearing; long-term care.
 *   5. Insurer overhead: follows private benefit spending, or falls to a
 *      Swiss-style share under the non-profit requirement.
 *   6. Workforce investment: the same recurring program as the single payer.
 *
 * Every rate and price comes from constants.ts or the single-payer model's own
 * service assumptions, so the two models price the same change the same way.
 */
import {
  NHE_PER_CAPITA_2024,
  NHE_TOTAL_2024,
  POPULATION_2024_MILLIONS,
  SERVICES_2024,
} from "./baseline"
import type { Payer, ServiceId } from "./baseline"
import { DERIVED, v } from "./constants"
import { ASSUMPTIONS, computeService, fmt, SERVICE_ASSUMPTIONS } from "./model"

export type ReformLine = {
  id: string
  label: string
  /** Change in national health spending, $B a year. */
  delta: number
  explanation: string
  sourceIds: string[]
}

export type ReformCost = {
  lines: ReformLine[]
  nationalBefore: number
  nationalAfter: number
  delta: number
  deltaPct: number
  perCapitaBefore: number
  perCapitaAfter: number
  /** Millions of people newly covered. */
  newlyCovered: number
}

/** Paths whose effect this model prices. */
export const AUTOMATIC_COVERAGE = ["regulated-multipayer", "auto-enrollment"]
export const PARTIAL_COVERAGE = ["public-option", "mandate-subsidies", "medicare-age-down"]
const RATE_SETTING = ["all-payer-rates"]
const PRICE_CAP = ["prices-cap"]
const DRUG_PRICING = ["drugs-negotiate", "drugs-reference"]
const DENTAL = ["dental-full"]
const LTC = ["ltc-social-insurance"]
const OVERHEAD = ["overhead-mlr"]
const WORKFORCE = ["phys-residency", "nurse-pipeline", "shortage-service"]
const IMMIGRANTS = ["immigrants-all-residents", "immigrants-lawful-only"]

export const REFORM_PRICED_PATHS = [
  ...AUTOMATIC_COVERAGE,
  ...PARTIAL_COVERAGE,
  ...RATE_SETTING,
  ...PRICE_CAP,
  ...DRUG_PRICING,
  ...DENTAL,
  ...LTC,
  ...OVERHEAD,
  ...WORKFORCE,
  ...IMMIGRANTS,
]

const PROVIDER_SERVICES: ServiceId[] = ["hospital", "physicianClinical", "otherProfessional"]
const PRICED_PAYERS = ["privateInsurance", "medicare", "medicaid", "outOfPocket"] as const

const row = (id: ServiceId) => SERVICES_2024.find((s) => s.id === id)!
const assumption = (id: ServiceId) => SERVICE_ASSUMPTIONS.find((s) => s.id === id)!
const paid = (id: ServiceId, payer: Payer) => row(id).byPayer[payer] ?? 0
const pct = (x: number) => `${(x * 100).toFixed(1)}%`
const usd = (x: number) => `$${Math.round(x).toLocaleString("en-US")}`

/** Private insurers' benefit payments for personal health care (every service with a price index). */
const PRIVATE_BENEFITS = SERVICE_ASSUMPTIONS.reduce((s, a) => s + paid(a.id, "privateInsurance"), 0)
const PRIVATE_OVERHEAD = paid("netCostOfInsurance", "privateInsurance")
const MEDICAID_BENEFITS = SERVICE_ASSUMPTIONS.reduce((s, a) => s + paid(a.id, "medicaid"), 0)
const MEDICAID_OVERHEAD = paid("netCostOfInsurance", "medicaid")

/** Uninsured people the picks cover, in millions, with how that was worked out. */
export function newlyCoveredFor(picks: Set<string>) {
  const has = (id: string) => picks.has(id)
  const undocumented =
    ((v("unauthorizedLow") + v("unauthorizedHigh")) / 2) * v("undocumentedUninsuredRate")
  const eligible = v("uninsuredToday") - (has("immigrants-all-residents") ? 0 : undocumented)
  const urbanShare =
    (v("urbanCurrentLawUninsured") - v("urbanR2Uninsured")) / v("urbanCurrentLawUninsured")
  const automatic = AUTOMATIC_COVERAGE.some(has)
  const partial = !automatic && PARTIAL_COVERAGE.some(has)
  const share = automatic ? 1 : partial ? urbanShare : 0
  return { undocumented, eligible, share, automatic, partial, count: eligible * share }
}

export function reformCost(picks: Set<string>): ReformCost {
  const has = (id: string) => picks.has(id)
  const lines: ReformLine[] = []
  /** Change in private insurers' benefit payments, which their overhead follows. */
  let privateChange = 0

  // 1. Coverage
  const cov = newlyCoveredFor(picks)
  if (cov.count > 0) {
    const spendToday = v("uninsuredSpend2013") * (NHE_PER_CAPITA_2024 / v("nhePerCapita2013"))
    const lift = v("hhCoveredPublicSpend") / v("hhUninsuredSpend") - 1
    const extraCare = (cov.count * spendToday * lift) / 1000
    const overheadRate =
      (PRIVATE_OVERHEAD + MEDICAID_OVERHEAD) / (PRIVATE_BENEFITS + MEDICAID_BENEFITS)
    const delta = extraCare * (1 + overheadRate)
    const who = cov.automatic
      ? "Everyone eligible is enrolled automatically"
      : `Enrollment is voluntary, so we use the share of the uninsured that Urban's Reform 2 (bigger subsidies and a mandate) covered: ${pct(cov.share)}`
    const immigrants = has("immigrants-all-residents")
      ? "Undocumented immigrants are eligible."
      : `About ${cov.undocumented.toFixed(1)} million uninsured undocumented immigrants stay ineligible (${pct(v("undocumentedUninsuredRate"))} of ${((v("unauthorizedLow") + v("unauthorizedHigh")) / 2).toFixed(1)} million).`
    lines.push({
      id: "coverage",
      label: "Care for the newly covered",
      delta,
      explanation: `${who}: ${cov.count.toFixed(1)} of ${v("uninsuredToday")} million uninsured people. ${immigrants} Someone uninsured all year used ${usd(v("uninsuredSpend2013"))} of care in 2013, against ${usd(v("insuredSpend2013"))} for someone insured; grown with spending per person to 2024, that is ${usd(spendToday)}. Public-plan coverage raises it by ${pct(lift)} (Hadley & Holahan), ${usd(spendToday * lift)} a person, so ${fmt(extraCare)} more care, plus ${pct(overheadRate)} for the plans' overhead (private and Medicaid managed care today).`,
      sourceIds: [
        "census-p60-291",
        "kff-uncompensated-2013",
        "cms-nhe-2013",
        "hadley-holahan-2003",
        "urban-2019",
        "kff-immigrant-coverage-facts",
      ],
    })
  }

  // 2. Provider prices
  if (RATE_SETTING.some(has)) {
    let delta = 0
    for (const id of PROVIDER_SERVICES) {
      const a = assumption(id)
      for (const p of PRICED_PAYERS) {
        const change = paid(id, p) * (a.uhpRate / a.relativePrice[p] - 1)
        delta += change
        if (p === "privateInsurance") privateChange += change
      }
    }
    lines.push({
      id: "providerPrices",
      label: "One rate for every payer",
      delta,
      explanation: `Every payer pays the single-payer model's rates for hospitals (${pct(assumption("hospital").uhpRate)} of Medicare), physicians (${pct(assumption("physicianClinical").uhpRate)}), and other professionals (${pct(assumption("otherProfessional").uhpRate)}). Private insurers' prices fall; Medicare's rise slightly and Medicaid's rise to match.`,
      sourceIds: ["rand-hospital-2024", "medpac-2025"],
    })
  } else if (PRICE_CAP.some(has)) {
    const cap = v("commercialPriceCap")
    let delta = 0
    const parts: string[] = []
    for (const id of PROVIDER_SERVICES) {
      const rel = assumption(id).relativePrice.privateInsurance
      if (rel <= cap) continue
      const change = paid(id, "privateInsurance") * (cap / rel - 1)
      delta += change
      parts.push(
        `${row(id).label.toLowerCase()}: ${pct(rel)} of Medicare on ${fmt(paid(id, "privateInsurance"))}, ${fmt(change, { sign: true })}`,
      )
    }
    privateChange += delta
    lines.push({
      id: "providerPrices",
      label: "Cap on commercial prices",
      delta,
      explanation: `Commercial prices capped at ${pct(cap)} of Medicare. Only prices above the cap fall (${parts.join("; ") || "none on average"}). Using the average price understates the savings, since hospitals above the cap lose more than the average suggests.`,
      sourceIds: ["rand-hospital-2024"],
    })
  }

  // 3. Drug prices
  if (DRUG_PRICING.some(has)) {
    const a = assumption("prescriptionDrugs")
    const rate = DERIVED.drugRate
    let delta = 0
    for (const p of PRICED_PAYERS) {
      const rel = a.relativePrice[p]
      if (rel <= rate) continue
      const change = paid("prescriptionDrugs", p) * (rate / rel - 1)
      delta += change
      if (p === "privateInsurance") privateChange += change
    }
    lines.push({
      id: "drugPrices",
      label: "Negotiated drug prices for every payer",
      delta,
      explanation: `Every payer pays the single-payer model's negotiated price, ${pct(rate)} of today's Medicare net price (brand drugs ${pct(v("brandShareOfRetailRx"))} of spending, cut ${pct(v("brandPriceCut"))}). Medicaid already pays less through its rebates and keeps its price. No change in use, since copays stay.`,
      sourceIds: ["rand-drugs-2024", "cms-negotiation"],
    })
  }

  // 4. New benefits, priced as the single-payer model prices them
  const benefit = (id: string, label: string, services: ServiceId[], sourceIds: string[]) => {
    const results = services.map((s) => computeService(assumption(s)))
    const care = results.reduce((s, r) => s + r.delta, 0)
    const newPublic = results.reduce(
      (s, r) => s + r.uhpSpending - (paid(r.id, "medicare") + paid(r.id, "medicaid")),
      0,
    )
    const admin = newPublic * ASSUMPTIONS.uhpAdminRate.value
    for (const s of services) privateChange -= paid(s, "privateInsurance")
    lines.push({
      id,
      label,
      delta: care + admin,
      explanation: `A public benefit for ${results.map((r) => r.label.toLowerCase()).join(", ")}, at the single-payer model's rates and use: price effect ${fmt(
        results.reduce((s, r) => s + r.priceEffect, 0),
        { sign: true },
      )}, more use ${fmt(
        results.reduce((s, r) => s + r.utilizationEffect, 0),
        { sign: true },
      )}. Private insurance and most out-of-pocket spending for them moves to the public benefit, plus ${pct(ASSUMPTIONS.uhpAdminRate.value)} administration on ${fmt(newPublic)} of new public spending.`,
      sourceIds,
    })
  }
  if (DENTAL.some(has))
    benefit(
      "dental",
      "Dental, vision, and hearing",
      ["dental", "durableEquipment"],
      [...assumption("dental").sourceIds, ...assumption("durableEquipment").sourceIds],
    )
  if (LTC.some(has))
    benefit(
      "ltc",
      "Long-term care insurance",
      ["nursing", "otherResidential", "homeHealth"],
      [
        ...assumption("nursing").sourceIds,
        ...assumption("otherResidential").sourceIds,
        ...assumption("homeHealth").sourceIds,
      ],
    )

  // 5. Insurer overhead follows private benefits
  const ratioToday = PRIVATE_OVERHEAD / PRIVATE_BENEFITS
  const capped = OVERHEAD.some(has)
  const ratioAfter = capped ? v("swissAdminShare") / (1 - v("swissAdminShare")) : ratioToday
  const overheadAfter = (PRIVATE_BENEFITS + privateChange) * ratioAfter
  if (Math.abs(overheadAfter - PRIVATE_OVERHEAD) > 0.05)
    lines.push({
      id: "overhead",
      label: "Private insurer overhead",
      delta: overheadAfter - PRIVATE_OVERHEAD,
      explanation: capped
        ? `Non-profit plans held to Swiss administrative costs, ${pct(v("swissAdminShare"))} of premiums (${pct(ratioAfter)} of benefits), against ${pct(ratioToday)} today, on ${fmt(PRIVATE_BENEFITS + privateChange)} of private benefits.`
        : `Overhead stays ${pct(ratioToday)} of private benefits, which change by ${fmt(privateChange, { sign: true })}.`,
      sourceIds: capped
        ? ["overhead-mlr-swiss-federal-council-sw-2024", "cms-nhe-2024"]
        : ["cms-nhe-2024"],
    })

  // 6. Workforce
  if (WORKFORCE.some(has))
    lines.push({
      id: "workforce",
      label: "Workforce capacity investment",
      delta: ASSUMPTIONS.workforceInvestment.value,
      explanation: ASSUMPTIONS.workforceInvestment.rationale,
      sourceIds: ASSUMPTIONS.workforceInvestment.sourceIds,
    })

  const delta = lines.reduce((s, l) => s + l.delta, 0)
  const nationalAfter = NHE_TOTAL_2024 + delta
  return {
    lines,
    nationalBefore: NHE_TOTAL_2024,
    nationalAfter,
    delta,
    deltaPct: delta / NHE_TOTAL_2024,
    perCapitaBefore: (NHE_TOTAL_2024 * 1000) / POPULATION_2024_MILLIONS,
    perCapitaAfter: (nationalAfter * 1000) / POPULATION_2024_MILLIONS,
    newlyCovered: cov.count,
  }
}
