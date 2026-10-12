/**
 * Model outputs formatted for prose. Text anywhere on the site that mentions a
 * computed number must use these instead of typing the number.
 */
import { PAYER_TOTALS_2024, SERVICES_2024, SPONSOR_LINES_2024 } from "./baseline"
import { v } from "./constants"
import { MODEL, MODEL_COSTLY, fmt } from "./model"
import { ONE_TIME_COSTS } from "./transition"
import { DISPLACED_GROUPS, DISPLACED_TOTAL, TRANSITION_PROGRAM_COST } from "./workforce"

const svc = (id: string) => MODEL.serviceResults.find((s) => s.id === id)!
const src = (id: string) => MODEL.sourceLines.find((s) => s.id === id)!
const use = (id: string) => MODEL.useLines.find((s) => s.id === id)!
const nc = SERVICES_2024.find((s) => s.id === "netCostOfInsurance")!
const ga = SERVICES_2024.find((s) => s.id === "governmentAdministration")!
const oneTime = (id: string) =>
  ONE_TIME_COSTS.find((c) => c.id === id)!.byYear.reduce((a, b) => a + b, 0)
const hospital = svc("hospital")
const physician = svc("physicianClinical")

/** Extra cost of paying above Medicare rates (rate − 1) at the model's volume and utilization. */
const aboveMedicare = (r: typeof hospital) =>
  r.volume * (r.assumption.uhpRate - 1) * r.assumption.utilization

export const F = {
  netCostBefore: fmt(use("netCostOfInsurance").before),
  netCostAfter: fmt(use("netCostOfInsurance").after),
  uhpAdmin: fmt(MODEL.headline.uhpAdmin),
  insurerProfit: fmt(v("insurerProfit")),
  utilization: fmt(MODEL.headline.utilizationEffect),
  utilizationCostly: fmt(MODEL_COSTLY.headline.utilizationEffect),
  priceEffect: fmt(-MODEL.headline.priceEffect),
  oopBefore: fmt(src("hhOop").before),
  oopAfter: fmt(src("hhOop").after),
  newBenefitsUtilization: fmt(
    svc("dental").utilizationEffect +
      svc("homeHealth").utilizationEffect +
      svc("otherResidential").utilizationEffect,
  ),
  hospitalFund: fmt(oneTime("hospitalFund")),
  hospitalAboveMedicare: fmt(aboveMedicare(hospital)),
  physicianAboveMedicare: fmt(aboveMedicare(physician)),
  bothAboveMedicare: fmt(aboveMedicare(hospital) + aboveMedicare(physician)),
  drugsBefore: fmt(svc("prescriptionDrugs").baselineTotal),
  drugsAfter: fmt(svc("prescriptionDrugs").newTotal),
  drugPriceSaving: fmt(-svc("prescriptionDrugs").priceEffect),
  maOverhead: fmt(nc.byPayer.medicare ?? 0),
  mcoOverhead: fmt(nc.byPayer.medicaid ?? 0),
  planOverhead: fmt((nc.byPayer.medicare ?? 0) + (nc.byPayer.medicaid ?? 0)),
  medicaidAdmin: fmt(ga.byPayer.medicaid ?? 0),
  gap: fmt(MODEL.gap),
  gapCostly: fmt(MODEL_COSTLY.gap),
  fedPrograms: fmt(src("fedPrograms").after),
  improperAtUhpScale: fmt(MODEL.headline.uhpBenefits * v("improperPaymentRate")),
  reserve: fmt((MODEL.headline.uhpBenefits / 12) * v("reserveMonths")),
  capacityCapital: fmt(oneTime("capacity") + oneTime("ruralCapital")),
  stateMedicaid: fmt(SPONSOR_LINES_2024.find((l) => l.id === "slMedicaid")!.amount),
  stateMoe: fmt(MODEL.side.stateMoe),
  marketplace: fmt(src("fedMarketplace").before),
  premiumTax: fmt(v("statePremiumTax")),
  privatePremiums: fmt(PAYER_TOTALS_2024.privateInsurance),
  insurerNonMedical: fmt(
    use("netCostOfInsurance").before -
      (nc.byPayer.otherInsurance ?? 0) -
      (nc.byPayer.otherThirdParty ?? 0),
  ),
  workerProgram: fmt(TRANSITION_PROGRAM_COST.total),
  topEnd: fmt(src("hhTopSurtax").after),
  topEndCostly: fmt(MODEL_COSTLY.sourceLines.find((l) => l.id === "hhTopSurtax")!.after),
  displaced: Math.round(DISPLACED_TOTAL).toLocaleString("en-US"),
  insurerJobs: Math.round(
    DISPLACED_GROUPS.find((g) => g.id === "insurers")!.employed *
      DISPLACED_GROUPS.find((g) => g.id === "insurers")!.displacedShare,
  ).toLocaleString("en-US"),
}
