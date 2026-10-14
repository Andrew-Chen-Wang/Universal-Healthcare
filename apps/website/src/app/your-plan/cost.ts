/**
 * Turn a reader's picks into a cost-model scenario. Only picks that map to a
 * model input are priced; every alternative value comes from the model's own
 * costly and lean cases (SCENARIOS) or an assumption's documented range, so
 * nothing here introduces a new number.
 */
import { ASSUMPTIONS, runModel, SCENARIOS, type Scenario } from "@website/content/model"

const COSTLY = SCENARIOS.find((s) => s.id === "costly")!
const LEAN = SCENARIOS.find((s) => s.id === "lean")!

const RATE_SETTING = ["all-payer-rates", "prices-cap", "fee-for-service-fixed", "global-budgets"]
const DRUG_PRICING = ["drugs-negotiate", "drugs-reference"]
const NO_COST_SHARING = ["underins-zero", "copay-none"]
const COST_SHARING = ["underins-income-cap", "underins-value-based", "copay-flat-small"]
const PUBLIC_ADMIN = ["overhead-public", "admin-one-claims"]

export const PRICED_PATHS = new Set([
  "single-payer",
  ...RATE_SETTING,
  ...DRUG_PRICING,
  ...NO_COST_SHARING,
  ...COST_SHARING,
  ...PUBLIC_ADMIN,
  "wage-small-exempt",
])

export type Rule = { label: string; effect: string; central: boolean }

export function costFor(picks: Set<string>) {
  const has = (id: string) => picks.has(id)
  if (!has("single-payer")) return null

  const scenario: Scenario = { id: "central", label: "Your plan", description: "" }
  const assumptions: Record<string, number> = {}
  const rules: Rule[] = []

  if (RATE_SETTING.some(has)) {
    rules.push({
      label: "Provider prices",
      effect: "Public rate-setting: central rates",
      central: true,
    })
  } else {
    scenario.uhpRate = {
      hospital: COSTLY.uhpRate?.hospital,
      physicianClinical: COSTLY.uhpRate?.physicianClinical,
      otherProfessional: COSTLY.uhpRate?.otherProfessional,
    }
    rules.push({
      label: "Provider prices",
      effect: "No public rate-setting picked: the model's high-rate case",
      central: false,
    })
  }

  if (DRUG_PRICING.some(has)) {
    rules.push({
      label: "Drug prices",
      effect: "Negotiated or reference prices: central",
      central: true,
    })
  } else {
    scenario.uhpRate = { ...scenario.uhpRate, prescriptionDrugs: COSTLY.uhpRate?.prescriptionDrugs }
    rules.push({
      label: "Drug prices",
      effect: "No drug-price path picked: the model's high drug-price case",
      central: false,
    })
  }

  if (COST_SHARING.some(has) && !NO_COST_SHARING.some(has)) {
    scenario.utilizationScale = LEAN.utilizationScale
    rules.push({
      label: "Use of care",
      effect: "Copays dampen extra use: the model's low induced-demand case",
      central: false,
    })
  } else if (NO_COST_SHARING.some(has)) {
    rules.push({
      label: "Use of care",
      effect: "No cost sharing: central induced demand",
      central: true,
    })
  } else {
    rules.push({
      label: "Use of care",
      effect: "No cost-sharing path picked: central induced demand",
      central: true,
    })
  }

  if (PUBLIC_ADMIN.some(has)) {
    rules.push({
      label: "Administration",
      effect: "Public claims system: central admin cost",
      central: true,
    })
  } else {
    assumptions.uhpAdminRate = ASSUMPTIONS.uhpAdminRate.high
    rules.push({
      label: "Administration",
      effect: "No admin-simplification path picked: the high admin-cost case",
      central: false,
    })
  }

  if (has("twotier-allow")) {
    rules.push({
      label: "Private insurance",
      effect:
        "Duplicate private insurance allowed: not priced. What people spend on it, and its insurers' overhead, comes on top of these totals",
      central: false,
    })
  }

  if (!has("wage-small-exempt")) {
    assumptions.smallEmployerExemptShare = 0
    rules.push({
      label: "Small employers",
      effect: "No phase-in: all payroll taxed (changes who pays, not total spending)",
      central: false,
    })
  }

  scenario.assumptions = assumptions
  const r = runModel(scenario)
  return {
    rules,
    nationalBefore: r.headline.baselineTotal,
    nationalAfter: r.headline.newTotal,
    delta: r.headline.delta,
    deltaPct: r.headline.deltaPct,
    perCapitaBefore: r.headline.perCapitaBefore,
    perCapitaAfter: r.headline.perCapitaAfter,
    federalBefore: r.headline.federalBefore,
    federalAfter: r.headline.federalAfter,
    gap: r.gap,
  }
}
