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
 *   4. New benefits: dental, vision, and hearing; long-term care; basic dental,
 *      glasses, and hearing aids in private plans; an income cap on cost sharing.
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
  SPONSOR_LINES_2024,
} from "./baseline"
import { PAYER_LABELS, type Payer, type ServiceId } from "./baseline"
import type { CalcStep } from "./calculations"
import { type ConstantId, DERIVED, v } from "./constants"
import { ASSUMPTIONS, computeService, fmt, SERVICE_ASSUMPTIONS } from "./model"

export type ReformLine = {
  id: string
  label: string
  /** Change in national health spending, $B a year. */
  delta: number
  /** Change in federal spending, $B a year. */
  federal: number
  explanation: string
  sourceIds: string[]
  /** The arithmetic, step by step, for the line's calculation page. */
  steps?: CalcStep[]
  /** Spending private plans take on from households, $B a year (premiums follow it). */
  privateShift?: number
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
  /** Change in federal health spending, $B a year. */
  federalDelta: number
  /** Taxes the picks name to pay for it (top-end income taxes only, for now). */
  funding?: { revenue: number; explanation: string; sourceIds: string[] }
  /** Federal cost the named taxes don't cover; negative is a surplus. */
  fundingGap?: number
  /** Income below which no household pays a new tax, when that's how it's funded. */
  noNewTaxBelow?: number
  /** Picks that change spending but aren't priced yet. */
  notPriced: { label: string; note: string }[]
  /** Private insurance spending (benefits plus overhead), before and after: what premiums follow. */
  privateBefore: number
  privateAfter: number
  /** Change in households' out-of-pocket spending from priced lines. */
  oopChange: number
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
const sponsor = (id: string) => SPONSOR_LINES_2024.find((l) => l.id === id)!.amount
/** Federal share of Medicaid spending (the rest is states'). */
const FEDERAL_MEDICAID_SHARE =
  sponsor("fedMedicaid") / (sponsor("fedMedicaid") + sponsor("slMedicaid"))

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
  /** Change in households' out-of-pocket spending. */
  let oopChange = 0
  /** Federal share of a change in Medicare and Medicaid spending. */
  const publicShare = (payer: string, change: number) =>
    payer === "medicare" ? change : payer === "medicaid" ? change * FEDERAL_MEDICAID_SHARE : 0

  // 1. Coverage
  const cov = newlyCoveredFor(picks)
  if (cov.count > 0) {
    const spendToday = v("uninsuredSpend2013") * (NHE_PER_CAPITA_2024 / v("nhePerCapita2013"))
    const lift = v("hhCoveredPublicSpend") / v("hhUninsuredSpend") - 1
    const extraCare = (cov.count * spendToday * lift) / 1000
    const overheadRate =
      (PRIVATE_OVERHEAD + MEDICAID_OVERHEAD) / (PRIVATE_BENEFITS + MEDICAID_BENEFITS)
    const delta = extraCare * (1 + overheadRate)
    const premium = ((cov.count * spendToday * (1 + lift)) / 1000) * (1 + overheadRate)
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
      federal: premium,
      steps: [
        {
          label: "Uninsured people today (millions)",
          value: v("uninsuredToday"),
          unit: "count",
          inputs: ["uninsuredToday"],
          sourceIds: ["census-p60-291"],
        },
        ...(has("immigrants-all-residents")
          ? []
          : [
              {
                label: "Less uninsured undocumented immigrants who stay ineligible (millions)",
                formula: `(${v("unauthorizedLow")} + ${v("unauthorizedHigh")}) ÷ 2 × ${pct(v("undocumentedUninsuredRate"))}`,
                value: -cov.undocumented,
                unit: "count" as const,
                inputs: [
                  "unauthorizedLow",
                  "unauthorizedHigh",
                  "undocumentedUninsuredRate",
                ] as ConstantId[],
                sourceIds: ["kff-immigrant-coverage-facts"],
              },
            ]),
        {
          label: "Share of the eligible who get covered",
          value: cov.share,
          unit: "%",
          note: cov.automatic
            ? "Automatic enrollment: everyone eligible."
            : "Voluntary enrollment: Urban Reform 2's coverage gain.",
          ...(cov.automatic
            ? {}
            : { inputs: ["urbanCurrentLawUninsured", "urbanR2Uninsured"] as ConstantId[] }),
        },
        { label: "Newly covered people (millions)", value: cov.count, unit: "count", result: true },
        {
          label: "Care used by someone uninsured all year, 2013",
          value: v("uninsuredSpend2013"),
          unit: "$",
          inputs: ["uninsuredSpend2013"],
          sourceIds: ["kff-uncompensated-2013"],
        },
        {
          label: "Grown to 2024 with national spending per person",
          formula: `${usd(v("uninsuredSpend2013"))} × ${usd(NHE_PER_CAPITA_2024)} ÷ ${usd(v("nhePerCapita2013"))}`,
          value: spendToday,
          unit: "$",
          inputs: ["nhePerCapita2013"],
          sourceIds: ["cms-nhe-2013", "cms-nhe-2024"],
        },
        {
          label: "Increase in care once covered by a public-style plan",
          formula: `${usd(v("hhCoveredPublicSpend"))} ÷ ${usd(v("hhUninsuredSpend"))} − 1`,
          value: lift,
          unit: "%",
          inputs: ["hhCoveredPublicSpend", "hhUninsuredSpend"],
          sourceIds: ["hadley-holahan-2003"],
        },
        {
          label: "More care",
          formula: `${cov.count.toFixed(1)}M × ${usd(spendToday)} × ${pct(lift)}`,
          value: extraCare,
          unit: "B",
        },
        {
          label: "Plans' overhead rate (private and Medicaid plans today)",
          formula: `(${fmt(PRIVATE_OVERHEAD)} + ${fmt(MEDICAID_OVERHEAD)}) ÷ (${fmt(PRIVATE_BENEFITS)} + ${fmt(MEDICAID_BENEFITS)})`,
          value: overheadRate,
          unit: "%",
          sourceIds: ["cms-nhe-2024"],
        },
        {
          label: "Change in national spending",
          formula: `${fmt(extraCare)} × (1 + ${pct(overheadRate)})`,
          value: delta,
          unit: "B",
          result: true,
        },
        {
          label: "Federal cost: the whole premium for the newly covered (upper bound)",
          formula: `${cov.count.toFixed(1)}M × ${usd(spendToday * (1 + lift))} × (1 + ${pct(overheadRate)})`,
          value: premium,
          unit: "B",
          result: true,
        },
      ],
      explanation: `${who}: ${cov.count.toFixed(1)} of ${v("uninsuredToday")} million uninsured people. ${immigrants} Someone uninsured all year used ${usd(v("uninsuredSpend2013"))} of care in 2013, against ${usd(v("insuredSpend2013"))} for someone insured; grown with spending per person to 2024, that is ${usd(spendToday)}. Public-plan coverage raises it by ${pct(lift)} (Hadley & Holahan), ${usd(spendToday * lift)} a person, so ${fmt(extraCare)} more care, plus ${pct(overheadRate)} for the plans' overhead (private and Medicaid managed care today). Federal cost: the whole premium for everyone newly covered, ${fmt(premium)}, an upper bound, since income-based premiums pay part of it.`,
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
    let federal = 0
    for (const id of PROVIDER_SERVICES) {
      const a = assumption(id)
      for (const p of PRICED_PAYERS) {
        const change = paid(id, p) * (a.uhpRate / a.relativePrice[p] - 1)
        delta += change
        federal += publicShare(p, change)
        if (p === "privateInsurance") privateChange += change
        if (p === "outOfPocket") oopChange += change
      }
    }
    lines.push({
      id: "providerPrices",
      label: "One rate for every payer",
      delta,
      federal,
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
      federal: 0,
      steps: [
        {
          label: "Cap, as a multiple of Medicare",
          value: cap,
          unit: "x",
          inputs: ["commercialPriceCap"],
        },
        ...PROVIDER_SERVICES.flatMap((id): CalcStep[] => {
          const rel = assumption(id).relativePrice.privateInsurance
          return [
            {
              label: `${row(id).label}: private insurers' 2024 spending`,
              value: paid(id, "privateInsurance"),
              unit: "B",
              sourceIds: ["cms-nhe-2024"],
            },
            {
              label: `${row(id).label}: private price as a multiple of Medicare`,
              value: rel,
              unit: "x",
              note: rel <= cap ? "Below the cap: no change." : undefined,
            },
            ...(rel > cap
              ? [
                  {
                    label: `${row(id).label}: change`,
                    formula: `${fmt(paid(id, "privateInsurance"))} × (${cap} ÷ ${rel} − 1)`,
                    value: paid(id, "privateInsurance") * (cap / rel - 1),
                    unit: "B" as const,
                  },
                ]
              : []),
          ]
        }),
        { label: "Change in national spending", value: delta, unit: "B", result: true },
      ],
      explanation: `Commercial prices capped at ${pct(cap)} of Medicare. Only prices above the cap fall (${parts.join("; ") || "none on average"}). Using the average price understates the savings, since hospitals above the cap lose more than the average suggests.`,
      sourceIds: ["rand-hospital-2024"],
    })
  }

  // 3. Drug prices
  if (DRUG_PRICING.some(has)) {
    const a = assumption("prescriptionDrugs")
    const rate = DERIVED.drugRate
    let delta = 0
    let federal = 0
    for (const p of PRICED_PAYERS) {
      const rel = a.relativePrice[p]
      if (rel <= rate) continue
      const change = paid("prescriptionDrugs", p) * (rate / rel - 1)
      delta += change
      federal += publicShare(p, change)
      if (p === "privateInsurance") privateChange += change
      if (p === "outOfPocket") oopChange += change
    }
    lines.push({
      id: "drugPrices",
      label: "Negotiated drug prices for every payer",
      delta,
      federal,
      steps: [
        {
          label: "Negotiated price as a share of today's Medicare net price",
          formula: `${pct(v("brandShareOfRetailRx"))} brand × (1 − ${pct(v("brandPriceCut"))}) + generics at today's price`,
          value: rate,
          unit: "%",
          inputs: ["brandShareOfRetailRx", "brandPriceCut"],
          sourceIds: ["rand-drugs-2024"],
        },
        ...PRICED_PAYERS.flatMap((p): CalcStep[] => {
          const rel = a.relativePrice[p]
          const spent = paid("prescriptionDrugs", p)
          return rel <= rate
            ? [
                {
                  label: `${PAYER_LABELS[p]}: ${fmt(spent)} at ${rel.toFixed(2)}× the reference price, already below the negotiated price`,
                  value: 0,
                  unit: "B",
                },
              ]
            : [
                {
                  label: `${PAYER_LABELS[p]}: change`,
                  formula: `${fmt(spent)} × (${rate.toFixed(2)} ÷ ${rel.toFixed(2)} − 1)`,
                  value: spent * (rate / rel - 1),
                  unit: "B",
                },
              ]
        }),
        { label: "Change in national spending", value: delta, unit: "B", result: true },
        {
          label: "Federal share (Medicare, and Medicaid's federal share)",
          value: federal,
          unit: "B",
          result: true,
        },
      ],
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
      federal: newPublic + admin,
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

  // 4b. Basic dental, glasses, and hearing aids in every private plan's standard benefit
  if (has("dental-basic") && !DENTAL.some(has)) {
    const adults = v("pop2024Census") - v("popUnder18_2024") - v("pop65plus2024")
    const privateAdults = adults * v("privateShare19to64")
    const gaining = privateAdults * (1 - v("privateWithDental"))
    const perPerson = (row("dental").total * 1000) / POPULATION_2024_MILLIONS
    const today = (gaining * perPerson) / 1000
    const { utilization: u, retainedOutOfPocketShare: r } = assumption("dental")
    const vh =
      (v("cboMedicareVision10yr") + v("cboMedicareHearing10yr")) / v("cboMedicareDental10yr")
    const national = today * (u - 1) * (1 + vh)
    const plans = today * u * (1 - r) * (1 + vh)
    const households = national - plans
    privateChange += plans
    oopChange += households
    lines.push({
      id: "privateDvh",
      label: "Basic dental, glasses, and hearing aids in private plans",
      delta: national,
      federal: 0,
      privateShift: plans,
      explanation: `About ${gaining.toFixed(1)} million working-age adults with private insurance have no dental coverage. Covered, they use ${pct(u - 1)} more dental care (the single-payer model's dental assumption), and plans pay ${pct(1 - r)} of it, through premiums. Glasses and hearing aids add ${pct(vh)} on top, CBO's ratio for Medicare. Both lean high: working-age adults need fewer hearing aids, and people without dental coverage spend less than the average used here. Households pay ${fmt(-households)} less out of pocket and ${fmt(plans)} more in premiums. Its federal cost is counted in the federal side of premium changes.`,
      sourceIds: [
        "census-age-2024",
        "census-p60-288",
        "nchs-db336",
        "ada-hpi",
        "cbo-medicare-dvh-2021",
      ],
      steps: [
        {
          label: "Adults 18 to 64, 2024",
          formula: `${v("pop2024Census")} − ${v("popUnder18_2024")} − ${v("pop65plus2024")}`,
          value: adults * 1e6,
          unit: "count",
          inputs: ["pop2024Census", "popUnder18_2024", "pop65plus2024"],
          sourceIds: ["census-age-2024"],
        },
        {
          label: "With private health insurance",
          formula: `${adults.toFixed(1)} × ${pct(v("privateShare19to64"))}`,
          value: privateAdults * 1e6,
          unit: "count",
          inputs: ["privateShare19to64"],
          sourceIds: ["census-p60-288"],
        },
        {
          label: "Without dental coverage",
          formula: `${privateAdults.toFixed(1)} × (1 − ${pct(v("privateWithDental"))})`,
          value: gaining * 1e6,
          unit: "count",
          inputs: ["privateWithDental"],
          sourceIds: ["nchs-db336"],
        },
        {
          label: "Dental spending per person, 2024",
          formula: `${fmt(row("dental").total)} ÷ ${POPULATION_2024_MILLIONS}M people`,
          value: perPerson,
          unit: "$",
          sourceIds: ["cms-nhe-2024"],
        },
        {
          label: "Their dental spending today",
          formula: `${gaining.toFixed(1)}M × ${usd(perPerson)}`,
          value: today,
          unit: "B",
        },
        {
          label: "Glasses and hearing aids, as a share of dental (CBO, Medicare)",
          formula: `(${fmt(v("cboMedicareVision10yr"))} + ${fmt(v("cboMedicareHearing10yr"))}) ÷ ${fmt(v("cboMedicareDental10yr"))}`,
          value: vh,
          unit: "%",
          inputs: ["cboMedicareVision10yr", "cboMedicareHearing10yr", "cboMedicareDental10yr"],
          sourceIds: ["cbo-medicare-dvh-2021"],
        },
        {
          label: "Paid by plans, through premiums",
          formula: `${fmt(today)} × ${u.toFixed(2)} × ${pct(1 - r)} × (1 + ${pct(vh)})`,
          value: plans,
          unit: "B",
        },
        {
          label: "Change in out-of-pocket spending",
          formula: `${fmt(national)} − ${fmt(plans)}`,
          value: households,
          unit: "B",
        },
        {
          label: "Change in national spending (more care)",
          formula: `${fmt(today)} × (${u.toFixed(2)} − 1) × (1 + ${pct(vh)})`,
          value: national,
          unit: "B",
          result: true,
        },
      ],
    })
  }

  // 4c. An income-based cap on cost sharing in every private plan
  if (has("underins-income-cap")) {
    const people = v("pop2024Census") * v("privateShareAll")
    const growth = NHE_PER_CAPITA_2024 / v("nhePerCapita2013")
    const perPerson = v("oopCapShiftPerPerson") * growth
    const shift = (people * perPerson) / 1000
    privateChange += shift
    oopChange -= shift
    lines.push({
      id: "oopCap",
      label: "Income-based cap on cost sharing",
      delta: 0,
      federal: 0,
      privateShift: shift,
      explanation: `Spending above each family's cap moves from households to plans: about ${usd(perPerson)} a person a year, scaled from a study of income-tiered caps on group plans to 2024 spending, ${fmt(shift)} across ${people.toFixed(1)} million people with private insurance. National spending doesn't change except through extra care people use once they reach the cap, which isn't counted. A tighter cap, such as Germany's ${pct(v("germanyCopayCap"))} of income, would move more. Its federal cost is counted in the federal side of premium changes.`,
      sourceIds: ["riggs-oop-caps-2015", "census-p60-288", "cms-nhe-2024"],
      steps: [
        {
          label: "People with private insurance, 2024",
          formula: `${v("pop2024Census")} × ${pct(v("privateShareAll"))}`,
          value: people * 1e6,
          unit: "count",
          inputs: ["pop2024Census", "privateShareAll"],
          sourceIds: ["census-age-2024", "census-p60-288"],
        },
        {
          label: "Spending moved to premiums per person, 2011–2012 (income-tiered caps)",
          value: v("oopCapShiftPerPerson"),
          unit: "$",
          inputs: ["oopCapShiftPerPerson"],
          sourceIds: ["riggs-oop-caps-2015"],
        },
        {
          label: "Growth in spending per person since 2013, the nearest year the model holds",
          formula: `${usd(NHE_PER_CAPITA_2024)} ÷ ${usd(v("nhePerCapita2013"))}`,
          value: growth,
          unit: "x",
          inputs: ["nhePerCapita2013"],
          sourceIds: ["cms-nhe-2024", "cms-nhe-2013"],
        },
        {
          label: "Per person, 2024",
          formula: `${usd(v("oopCapShiftPerPerson"))} × ${growth.toFixed(2)}`,
          value: perPerson,
          unit: "$",
        },
        {
          label: "Moved from out-of-pocket to premiums",
          formula: `${people.toFixed(1)}M × ${usd(perPerson)}`,
          value: shift,
          unit: "B",
          result: true,
        },
      ],
    })
  }

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
      federal: 0,
      steps: [
        {
          label: "Private insurers' overhead, 2024 (net cost of insurance)",
          value: PRIVATE_OVERHEAD,
          unit: "B",
          sourceIds: ["cms-nhe-2024"],
        },
        {
          label: "Private insurers' benefit payments, 2024",
          value: PRIVATE_BENEFITS,
          unit: "B",
          sourceIds: ["cms-nhe-2024"],
        },
        {
          label: "Overhead as a share of benefits today",
          formula: `${fmt(PRIVATE_OVERHEAD)} ÷ ${fmt(PRIVATE_BENEFITS)}`,
          value: ratioToday,
          unit: "%",
        },
        {
          label: "Change in private benefits from the other lines",
          value: privateChange,
          unit: "B",
        },
        ...(capped
          ? [
              {
                label: "Limit: Swiss administrative share of premiums, as a share of benefits",
                formula: `${pct(v("swissAdminShare"))} ÷ (1 − ${pct(v("swissAdminShare"))})`,
                value: ratioAfter,
                unit: "%" as const,
                inputs: ["swissAdminShare"] as ConstantId[],
                sourceIds: ["overhead-mlr-swiss-federal-council-sw-2024"],
              },
            ]
          : []),
        {
          label: "Overhead after",
          formula: `(${fmt(PRIVATE_BENEFITS)} + ${fmt(privateChange)}) × ${pct(ratioAfter)}`,
          value: overheadAfter,
          unit: "B",
        },
        {
          label: "Change in national spending",
          value: overheadAfter - PRIVATE_OVERHEAD,
          unit: "B",
          result: true,
        },
      ],
      explanation: capped
        ? `Non-profit plans held to Swiss administrative costs, ${pct(v("swissAdminShare"))} of premiums (${pct(ratioAfter)} of benefits), against ${pct(ratioToday)} today, on ${fmt(PRIVATE_BENEFITS + privateChange)} of private benefits.`
        : `Overhead stays ${pct(ratioToday)} of private benefits, which change by ${fmt(privateChange, { sign: true })}.`,
      sourceIds: capped
        ? ["overhead-mlr-swiss-federal-council-sw-2024", "cms-nhe-2024"]
        : ["cms-nhe-2024"],
    })

  // 5b. Medicare: Advantage payment fixes, and basic dental, vision, and hearing
  if (has("ma-reform")) {
    const yearly = v("cboMaRiskAdjust10yr") / 10
    lines.push({
      id: "maFix",
      label: "Medicare Advantage payment fixes",
      delta: -yearly,
      federal: -yearly,
      explanation: `CBO estimates that using two years of diagnosis data and dropping diagnoses from health risk assessments would save ${fmt(v("cboMaRiskAdjust10yr"))} over ten years, ${fmt(yearly)} a year on average. Excluding chart-review diagnoses and expanding audits would save more; for scale, MedPAC puts coding intensity at ${fmt(v("maCodingIntensity2026"))} in 2026. Plans pass part of the cut through as fewer extra benefits, so national spending falls by about the same amount.`,
      sourceIds: ["cbo-ma-risk-2024", "medpac-2026-ma"],
      steps: [
        {
          label: "CBO: ten-year savings from two years of data and no risk-assessment diagnoses",
          value: v("cboMaRiskAdjust10yr"),
          unit: "B",
          inputs: ["cboMaRiskAdjust10yr"],
          sourceIds: ["cbo-ma-risk-2024"],
        },
        {
          label: "Average a year",
          formula: `${fmt(v("cboMaRiskAdjust10yr"))} ÷ 10`,
          value: yearly,
          unit: "B",
        },
        {
          label: "For scale: MA coding intensity, 2026 (MedPAC)",
          value: v("maCodingIntensity2026"),
          unit: "B",
          inputs: ["maCodingIntensity2026"],
          sourceIds: ["medpac-2026-ma"],
        },
        {
          label: "Change in federal and national spending",
          value: -yearly,
          unit: "B",
          result: true,
        },
      ],
    })
  }
  if (has("dental-basic") && !DENTAL.some(has)) {
    const parts = [
      ["Dental", v("cboMedicareDental10yr"), "cboMedicareDental10yr"],
      ["Vision", v("cboMedicareVision10yr"), "cboMedicareVision10yr"],
      ["Hearing", v("cboMedicareHearing10yr"), "cboMedicareHearing10yr"],
    ] as const
    const yearly = parts.reduce((s2, p) => s2 + p[1], 0) / 10
    lines.push({
      id: "medicareDvh",
      label: "Dental, vision, and hearing in Medicare",
      delta: yearly,
      federal: yearly,
      explanation: `Medicare adds dental, vision, and hearing to match the standard benefit. CBO estimated a broader version at ${fmt(parts.reduce((s2, p) => s2 + p[1], 0))} over ten years (dental ${fmt(parts[0][1])}, vision ${fmt(parts[1][1])}, hearing ${fmt(parts[2][1])}), ${fmt(yearly)} a year on average. The hybrid's basic benefit has tighter limits, so this is an upper bound; national spending counts it in full, also an upper bound, since seniors already pay for some of this care themselves.`,
      sourceIds: ["cbo-medicare-dvh-2021"],
      steps: [
        ...parts.map(([label, val, id]): CalcStep => ({
          label: `CBO: ${label.toLowerCase()}, ten years`,
          value: val,
          unit: "B",
          inputs: [id],
          sourceIds: ["cbo-medicare-dvh-2021"],
        })),
        {
          label: "Average a year",
          formula: `${fmt(parts.reduce((s2, p) => s2 + p[1], 0))} ÷ 10`,
          value: yearly,
          unit: "B",
        },
        {
          label: "Change in federal and national spending (upper bound)",
          value: yearly,
          unit: "B",
          result: true,
        },
      ],
    })
  }

  // 5c. Federal side of private premium changes: subsidies follow premiums for people with
  // premium tax credits, and the tax exclusion follows employer premiums.
  const premiumChange = privateChange + overheadAfter - PRIVATE_OVERHEAD
  if (Math.abs(premiumChange) > 0.05) {
    const privatePeople = v("pop2024Census") * v("privateShareAll")
    const employerShare = v("employerShareAll") / v("privateShareAll")
    const subsidizedShare = v("aptcEnrollees2024") / privatePeople
    const taxRate = v("federalMarginalRate") + v("employerFica") + v("employeeFica")
    const perDollar = employerShare * v("wagePassThrough") * taxRate + subsidizedShare
    const federal = premiumChange * perDollar
    const plansOf = (id: string) => lines.find((x) => x.id === id)?.privateShift ?? 0
    const benefitPart = (plansOf("privateDvh") + plansOf("oopCap")) * (1 + ratioAfter)
    lines.push({
      id: "premiumFederal",
      label: "Federal side of premium changes",
      delta: 0,
      federal,
      explanation: `Private premiums change by ${fmt(premiumChange, { sign: true })} for people insured today${Math.abs(benefitPart) > 0.05 ? ` (${fmt(benefitPart, { sign: true })} of it from new benefits and the copay cap, with their overhead)` : ""}. Two federal costs follow premiums. People with premium tax credits (${pct(subsidizedShare)} of the privately insured) pay a premium capped by income, so the government pays every dollar of a change. Employer premiums (${pct(employerShare)} of the privately insured) are untaxed: when they fall, ${pct(v("wagePassThrough"))} comes back as taxable wages, taxed at ${pct(taxRate)} (income tax and both halves of payroll tax), and when they rise the reverse. Together: ${pct(perDollar)} of every premium dollar${Math.abs(benefitPart) > 0.05 ? `, so the new benefits and the copay cap cost the government ${fmt(benefitPart * perDollar)} and the premium savings return ${fmt(-(premiumChange - benefitPart) * perDollar)}` : ""}.`,
      sourceIds: ["census-p60-288", "cms-effectuated-2025", "cbo-exclusion", "baicker-chandra"],
      steps: [
        {
          label: "Change in private premiums (benefits plus overhead), people insured today",
          value: premiumChange,
          unit: "B",
        },
        ...(Math.abs(benefitPart) > 0.05
          ? [
              {
                label: "Of which: new benefits and the copay cap, with overhead",
                formula: `(${fmt(plansOf("privateDvh"))} + ${fmt(plansOf("oopCap"))}) × (1 + ${pct(ratioAfter)})`,
                value: benefitPart,
                unit: "B" as const,
              },
            ]
          : []),
        {
          label: "People with private insurance",
          formula: `${v("pop2024Census")} × ${pct(v("privateShareAll"))}`,
          value: privatePeople * 1e6,
          unit: "count",
          inputs: ["pop2024Census", "privateShareAll"],
          sourceIds: ["census-p60-288"],
        },
        {
          label: "Share with employer coverage",
          formula: `${pct(v("employerShareAll"))} ÷ ${pct(v("privateShareAll"))}`,
          value: employerShare,
          unit: "%",
          inputs: ["employerShareAll", "privateShareAll"],
          sourceIds: ["census-p60-288"],
        },
        {
          label: "Share with premium tax credits",
          formula: `${v("aptcEnrollees2024")}M ÷ ${privatePeople.toFixed(1)}M`,
          value: subsidizedShare,
          unit: "%",
          inputs: ["aptcEnrollees2024"],
          sourceIds: ["cms-effectuated-2025"],
        },
        {
          label: "Tax on compensation: income tax plus both halves of payroll tax",
          formula: `${pct(v("federalMarginalRate"))} + ${pct(v("employerFica"))} + ${pct(v("employeeFica"))}`,
          value: taxRate,
          unit: "%",
          inputs: ["federalMarginalRate", "employerFica", "employeeFica"],
          sourceIds: ["cbo-exclusion"],
        },
        {
          label: "Federal share of each premium dollar",
          formula: `${pct(employerShare)} × ${pct(v("wagePassThrough"))} × ${pct(taxRate)} + ${pct(subsidizedShare)}`,
          value: perDollar,
          unit: "%",
          inputs: ["wagePassThrough"],
          sourceIds: ["baicker-chandra"],
        },
        {
          label: "Change in federal spending and lost revenue",
          formula: `${fmt(premiumChange)} × ${pct(perDollar)}`,
          value: federal,
          unit: "B",
          result: true,
        },
      ],
    })
  }

  // 6. Workforce
  if (WORKFORCE.some(has))
    lines.push({
      id: "workforce",
      label: "Workforce capacity investment",
      delta: ASSUMPTIONS.workforceInvestment.value,
      federal: ASSUMPTIONS.workforceInvestment.value,
      explanation: ASSUMPTIONS.workforceInvestment.rationale,
      sourceIds: ASSUMPTIONS.workforceInvestment.sourceIds,
    })

  const delta = lines.reduce((s, l) => s + l.delta, 0)
  const nationalAfter = NHE_TOTAL_2024 + delta
  const federalDelta = lines.reduce((s, l) => s + l.federal, 0)

  // Funding: top-end income taxes only, so no household below the surtax line pays more.
  const funding = has("tax-income")
    ? {
        revenue: DERIVED.surtaxRevenue + v("capGainsRevenue"),
        explanation: `A ${pct(v("surtaxRate"))} surtax on income above ${usd(v("surtaxThreshold"))} (${fmt(DERIVED.surtaxRevenue)}) and taxing capital gains and dividends as ordinary income above ${usd(v("surtaxThreshold"))} (${fmt(v("capGainsRevenue"))}). No household below ${usd(v("surtaxThreshold"))} of income pays a new tax.`,
        sourceIds: ["tpc-surtax", "jct-capital-gains"],
      }
    : undefined

  const notPriced: ReformCost["notPriced"] = []

  return {
    lines,
    nationalBefore: NHE_TOTAL_2024,
    nationalAfter,
    delta,
    deltaPct: delta / NHE_TOTAL_2024,
    perCapitaBefore: (NHE_TOTAL_2024 * 1000) / POPULATION_2024_MILLIONS,
    perCapitaAfter: (nationalAfter * 1000) / POPULATION_2024_MILLIONS,
    newlyCovered: cov.count,
    federalDelta,
    funding,
    fundingGap: funding ? federalDelta - funding.revenue : undefined,
    noNewTaxBelow: funding ? v("surtaxThreshold") : undefined,
    notPriced,
    privateBefore: PRIVATE_BENEFITS + PRIVATE_OVERHEAD,
    privateAfter: PRIVATE_BENEFITS + privateChange + overheadAfter,
    oopChange,
  }
}
