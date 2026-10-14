/**
 * Draft decisions on every solution path, made by Claude on the owner's request
 * ("choose the path picks for me now, I'll review them later"). Every entry is
 * unreviewed until the owner sets `reviewed: true`. The ledger page
 * (/paths/ledger) lists them in review order.
 *
 * Two drafts live here. SINGLE_PAYER_ROWS is the first draft: one public
 * payer, no cost sharing, a mix of employer payroll tax and income tax, rolled
 * out in waves. It stays as a complete path to compare (SINGLE_PAYER_PICKS,
 * shown on /approaches). HYBRID_ROWS is the current draft, a Germany-style
 * hybrid the owner asked for: employer plans stay (with a mandate for large
 * employers), everyone else is enrolled in regulated non-profit plans with
 * income-based premiums, and new federal costs are paid only by top-end
 * taxes. Hybrid rows replace single-payer rows for the same path.
 */
import { show } from "../constants"
import { PHASES } from "../plan"
// TEMPORARY: written by the /paths/review page. Fold into ROWS, then delete.
import OVERRIDES from "./review-overrides.json"

export type PhaseId = (typeof PHASES)[number]["id"]
export type Confidence = "high" | "medium" | "low"

export type Decision = {
  pathId: string
  status: "chosen" | "rejected"
  /** Phase whose change list this path's changes join (chosen paths only). */
  phase?: PhaseId
  confidence: Confidence
  reason: string
  /** What the owner should check when reviewing. */
  review?: string
  reviewed: boolean
  /** Owner's own note from the review page. */
  ownerNote?: string
}

/** TEMPORARY: one owner edit saved by /paths/review. */
export type Override = {
  status?: "chosen" | "rejected"
  phase?: PhaseId
  reviewed?: boolean
  note?: string
}
export const REVIEW_OVERRIDES = OVERRIDES as Record<string, Override>

type Row = [
  pathId: string,
  status: "chosen" | "rejected",
  phase: PhaseId | null,
  confidence: Confidence,
  reason: string,
  review?: string,
]

const c = (id: string, phase: PhaseId, conf: Confidence, reason: string, review?: string): Row => [
  id,
  "chosen",
  phase,
  conf,
  reason,
  review,
]
const r = (id: string, conf: Confidence, reason: string, review?: string): Row => [
  id,
  "rejected",
  null,
  conf,
  reason,
  review,
]

const SINGLE_PAYER_ROWS: Row[] = [
  // ---- Who pays ----
  c(
    "single-payer",
    "build",
    "medium",
    "Only path that ends churn, networks, job lock, and most admin cost at once; matches the site's cost model.",
    "The biggest call on the site. Weigh against regulated multi-payer (Germany/Switzerland), which keeps plan choice with smaller savings. Single payer no longer bans private insurance by itself; that is decided under Two-tier care (draft: supplemental only). Compare at /approaches.",
  ),
  r(
    "regulated-multipayer",
    "medium",
    "Conflicts with single payer; keeps several insurers' overhead.",
    "Reconsider if keeping plan choice matters more than admin savings.",
  ),
  r("public-option", "high", "Conflicts with single payer; universal only with auto-enrollment."),
  r(
    "medicare-age-down",
    "medium",
    "Too slow as the main route; the wave roll-out already borrows its age-based sequencing.",
    "Could replace the wave plan if you prefer a slower, measurable expansion.",
  ),
  c(
    "auto-enrollment",
    "groundwork",
    "medium",
    "Interim: enroll uninsured people in free coverage while the public program is built.",
    "Only a bridge; check it doesn't delay the main transition.",
  ),
  r(
    "mandate-subsidies",
    "high",
    "Conflicts with single payer; penalties fall on low-income people.",
  ),
  // ---- Coverage gaps ----
  c(
    "churn-continuous",
    "groundwork",
    "high",
    "Cheap interim fix for Medicaid churn before the transition.",
  ),
  c("churn-portable", "universal", "high", "Follows from residence-based coverage."),
  c("joblock-decouple", "universal", "high", "Follows from single payer."),
  r("joblock-portable-esi", "high", "Unneeded once coverage is decoupled from jobs."),
  c(
    "underins-zero",
    "build",
    "medium",
    "Ends underinsurance and new medical debt; the model already assumes it.",
    "Costs the most of the cost-sharing options and raises use; compare with Germany-style income-capped copays.",
  ),
  r(
    "underins-income-cap",
    "medium",
    "Conflicts with zero cost sharing; keeps billing at the point of care.",
    "The main alternative if zero cost sharing proves too expensive.",
  ),
  r(
    "underins-value-based",
    "medium",
    "Keeps billing; the coverage-list path handles low-value care instead.",
  ),
  c("networks-any-provider", "wave-one", "high", "Follows from one payer and one rate."),
  r("networks-adequacy", "high", "Unneeded once networks end."),
  c(
    "immigrants-all-residents",
    "universal",
    "low",
    "Residence-based eligibility ends emergency-only care and uncompensated costs; a residence period limits migration concerns.",
    "Value judgment with real cost; decide whether undocumented residents are covered.",
  ),
  c(
    "territories-full",
    "universal",
    "medium",
    "Universal means every U.S. citizen; the territories join with the last wave.",
    "Higher federal cost (GAO's Puerto Rico estimate implies about 1.6 to 3 times today's federal Medicaid spending there). Parity Medicaid is the smaller alternative.",
  ),
  r(
    "territories-medicaid-parity",
    "medium",
    "Full inclusion chosen; parity would keep coverage tied to territory Medicaid eligibility.",
  ),
  r("territories-capped-increase", "high", "Keeps territory residents on different terms."),
  r(
    "immigrants-lawful-only",
    "low",
    "Keeps uncompensated emergency care and mixed-status confusion.",
    "The alternative to the pick above.",
  ),
  // ---- Affordability ----
  c("debt-cancel", "groundwork", "high", "Cheap per dollar forgiven; immediate relief."),
  c(
    "debt-credit-rules",
    "groundwork",
    "high",
    "Low cost; protects credit while old debt winds down.",
  ),
  c("debt-end-billing", "wave-one", "high", "Follows from zero cost sharing."),
  c(
    "premium-to-tax",
    "build",
    "medium",
    "Progressive replacement for flat premiums; required by single payer.",
    "Check the household calculator: households above about $240k pay more.",
  ),
  r("premium-income-based", "high", "Requires a multi-payer system, which was rejected."),
  c("opacity-fixed-prices", "build", "high", "Follows from all-payer rates."),
  c("opacity-disclosure", "groundwork", "high", "Interim enforcement until one price list exists."),
  c(
    "surprise-rate-default",
    "groundwork",
    "high",
    "Interim: ends arbitration costs before networks disappear.",
  ),
  c("surprise-single-payer", "universal", "high", "Out-of-network ends with one payer."),
  // ---- Insurers ----
  c("denials-rules", "groundwork", "high", "Interim protection while private plans remain."),
  c(
    "denials-coverage-rules",
    "build",
    "medium",
    "One public rulebook with independent appeals.",
    "Moves 'no' to program-wide decisions; see the rationing subpaths.",
  ),
  c("pa-gold-card", "groundwork", "high", "Interim relief for clinicians."),
  c(
    "pa-eliminate",
    "wave-one",
    "medium",
    "Keep prior authorization only for a short list; audit afterwards.",
    "Watch for more low-value care; depends on audit capacity.",
  ),
  c(
    "ma-fold",
    "wave-one",
    "medium",
    "Medicare joins the public program in wave one; extra benefits move into the public plan.",
    "MA enrollees lose plans they chose; check dental/vision/hearing are added first.",
  ),
  c("ma-reform", "groundwork", "high", "Interim savings until Medicare Advantage is folded in."),
  c("overhead-public", "build", "high", "Follows from single payer; publish an admin-cost target."),
  r("overhead-mlr", "high", "Requires a multi-payer system."),
  c("pbm-public", "build", "high", "Public formulary and direct pricing replace PBMs."),
  c("pbm-regulate", "groundwork", "high", "Interim rules until public drug purchasing starts."),
  // ---- Prices and payment ----
  c(
    "all-payer-rates",
    "build",
    "high",
    "One rate for every payer; works during the transition and after.",
  ),
  c(
    "prices-cap",
    "build",
    "medium",
    "Caps commercial prices while private plans remain during the waves.",
    "Set the cap level; too low risks closures.",
  ),
  r(
    "prices-competition",
    "medium",
    "Too slow as the main price tool; antitrust is still chosen separately.",
  ),
  c(
    "global-budgets",
    "build",
    "medium",
    "Hospital budgets end most hospital billing and stabilize rural hospitals.",
    "Main risk is rationing and under-treatment; see the subpaths chosen for those.",
  ),
  c(
    "fee-for-service-fixed",
    "build",
    "medium",
    "Physicians and clinics paid per service at a national fee schedule; rewards productivity and short waits.",
    "Encourages volume; compare with capitation for primary care.",
  ),
  c(
    "capitation",
    "build",
    "medium",
    "Optional, as the detailed plan sets out: primary care practices can take a blended per-patient payment, and integrated systems can take a risk-adjusted budget for patients who choose them.",
    "Opt-in only; the fee schedule stays the default. Watch for upcoding and avoiding sick patients.",
  ),
  c("consolidation-antitrust", "groundwork", "high", "Still useful while prices are negotiated."),
  c("consolidation-rates", "build", "high", "Uniform rates remove the price reason to merge."),
  c("pe-limit", "groundwork", "medium", "Targets asset stripping and roll-ups."),
  c("pe-rates", "build", "high", "Uniform rates remove out-of-network arbitrage."),
  c("facility-site-neutral", "groundwork", "high", "Same pay for the same service."),
  r("facility-ban", "high", "Covered by site-neutral pay."),
  c(
    "exec-community-benefit",
    "groundwork",
    "medium",
    "Ties nonprofit tax exemptions to charity care.",
  ),
  c(
    "exec-budget-review",
    "waves-two-three",
    "medium",
    "Executive and admin costs reviewed within hospital budgets.",
  ),
  // ---- Drugs ----
  c(
    "drugs-negotiate",
    "build",
    "medium",
    "National negotiation for all drugs, tied to added benefit.",
    "Weigh savings against slower launches and some lost R&D (CBO: about 59 fewer drugs over 30 years for H.R. 3).",
  ),
  r("drugs-reference", "medium", "Negotiation already uses international prices as a benchmark."),
  c(
    "drugs-public-manufacture",
    "build",
    "medium",
    "Public or nonprofit production of off-patent drugs with high prices or shortages.",
  ),
  c(
    "patents-reform",
    "groundwork",
    "medium",
    "Limits thickets and pay-for-delay; keeps core patents.",
  ),
  r(
    "patents-march-in",
    "low",
    "Weakens patent certainty; negotiation covers most cases.",
    "Could be kept as a backstop.",
  ),
  r("patents-keep", "medium", "Thickets keep delaying generics."),
  c("rd-public-fund", "build", "medium", "Offsets some lost private R&D with public funding."),
  c("rd-prizes", "stabilize", "low", "Start with antibiotics, where markets fail."),
  c(
    "rd-value-pricing",
    "build",
    "medium",
    "Pays more for real breakthroughs, less for me-too drugs.",
  ),
  c(
    "shortages-pay-reliability",
    "build",
    "high",
    "Pays enough to keep essential generics in supply.",
  ),
  c("shortages-stockpile", "stabilize", "medium", "Buffer for disruptions."),
  c("pharmacy-fee", "build", "high", "Transparent dispensing fees keep pharmacies open."),
  c("pharmacy-mail-telehealth", "groundwork", "high", "Cheap rural access now."),
  // ---- Geography ----
  c("rural-global-budget", "wave-one", "high", "Stable funding for rural hospitals."),
  c(
    "rural-convert",
    "groundwork",
    "medium",
    "Lets hospitals that can't sustain inpatient care keep emergency care.",
    "Worsens maternity deserts; paired with maternity standby payments.",
  ),
  c("maternity-standby", "wave-one", "medium", "Keeps rural labor units open."),
  c("maternity-midwives", "groundwork", "medium", "Adds capacity in maternity deserts."),
  c("shortage-service", "groundwork", "high", "Proven to place clinicians in shortage areas."),
  c("shortage-pay", "build", "medium", "Simple add-on to the fee schedule."),
  c("shortage-telehealth", "groundwork", "high", "Fast access, especially mental health."),
  c("transport-fund", "wave-one", "high", "Covers ambulances and rides."),
  c(
    "transport-public-ems",
    "waves-two-three",
    "medium",
    "EMS funded by budget like fire departments.",
  ),
  // ---- Workforce ----
  c("phys-residency", "groundwork", "high", "Long lead time; start first."),
  c(
    "phys-pay-primary",
    "build",
    "medium",
    "Shifts fee-schedule dollars to primary care.",
    "Specialists lose income.",
  ),
  c("phys-foreign", "groundwork", "medium", "Fast supply increase under supervision."),
  c(
    "debt-free-school",
    "groundwork",
    "medium",
    "Tuition-free medical and nursing school tied to service.",
  ),
  r(
    "debt-shorter-training",
    "low",
    "Large accreditation change; lower priority.",
    "Could revisit later.",
  ),
  c("nurse-staffing-ratios", "stabilize", "medium", "Phased in once the pipeline grows."),
  c("nurse-pipeline", "groundwork", "high", "Schools turn away qualified applicants today."),
  c("burnout-simplify", "universal", "high", "Simpler billing under one payer."),
  c("burnout-scribes", "groundwork", "medium", "Quick relief now."),
  c(
    "scope-expand",
    "groundwork",
    "medium",
    "Fastest way to add capacity before demand rises.",
    "Physician groups raise quality concerns; paired with outcome monitoring.",
  ),
  r(
    "scope-team",
    "medium",
    "Supervision is a bottleneck in rural areas; full scope chosen instead.",
  ),
  // ---- Quality ----
  c("outcomes-primary-care", "build", "high", "Primary care spending target."),
  c("outcomes-public-health", "stabilize", "medium", "Addresses causes outside health care."),
  c("maternal-postpartum", "groundwork", "high", "Cheap, proven."),
  c("maternal-safety-bundles", "groundwork", "high", "Proven in California."),
  c("safety-reporting", "build", "high", "No-blame learning system."),
  c(
    "safety-primary-home",
    "universal",
    "medium",
    "Every resident registered with a primary care practice, with self-referral for some specialties.",
    "Gatekeeping limits direct specialist access.",
  ),
  c("disparities-equity-funding", "build", "medium", "Extra pay for deprived areas."),
  c("disparities-uniform", "build", "high", "One rate for every patient."),
  c("malpractice-no-fault", "stabilize", "medium", "Faster compensation, less defensive medicine."),
  r("malpractice-safe-harbor", "medium", "No-fault chosen instead."),
  // ---- Administration and waste ----
  c("admin-one-claims", "build", "high", "One claims system under one payer."),
  c("admin-standardize", "groundwork", "high", "Interim standardization across today's insurers."),
  c("billing-transition", "build", "high", "Mends the main losers of admin savings."),
  c("billing-redeploy", "build", "medium", "Keeps some experienced staff in navigation roles."),
  c(
    "lowvalue-coverage-list",
    "build",
    "medium",
    "Evidence-based coverage decisions.",
    "Controversial; see the rationing subpaths.",
  ),
  c("lowvalue-nudges", "stabilize", "medium", "Cheap feedback to clinicians."),
  c("fraud-analytics", "build", "high", "One data system sees all billing."),
  c("fraud-enrollment", "build", "high", "Stops fraud before payment."),
  // ---- Mental health, LTC, dental, prevention ----
  c("mh-parity-pay", "build", "high", "Pays enough that clinicians accept coverage."),
  c("mh-stepped", "groundwork", "medium", "Large capacity at low cost."),
  c("addiction-mat", "groundwork", "high", "Reduces overdose deaths."),
  c(
    "addiction-harm-reduction",
    "groundwork",
    "medium",
    "Fewer deaths; community opposition.",
    "Supervised consumption sites are contested.",
  ),
  c(
    "ltc-social-insurance",
    "wave-one",
    "medium",
    "Ends spend-down. Funded inside the public plan, as the cost model already assumes: home- and community-based care becomes an entitlement, home health has no asset test, and nursing-home care is covered except room and board.",
    "The model assumes 10–20% more use of home care; the woodwork effect could be larger (Japan's demand grew faster than expected).",
  ),
  c("ltc-medicaid-expand", "groundwork", "medium", "Ends home-care waitlists now."),
  r(
    "ltc-catastrophic",
    "low",
    "Full long-term care coverage inside the public plan chosen instead.",
    "Cheaper fallback if the full program is too costly.",
  ),
  c("nh-staffing", "stabilize", "medium", "Phased staffing minimums with funding in rates."),
  c("nh-small-homes", "stabilize", "medium", "Better quality of life over time."),
  c("hospice-oversight", "groundwork", "high", "Targets fraud."),
  r("hospice-nonprofit", "medium", "Oversight first; capacity loss risk."),
  c(
    "dental-full",
    "universal",
    "medium",
    "Matches the cost model: adult dental, glasses, and hearing aids covered; only cosmetic dental, orthodontics, and premium eyewear stay out of pocket.",
    "Dentist capacity is limited; the model assumes 35% more dental use. Basic-only coverage is the cheaper fallback.",
  ),
  r(
    "dental-basic",
    "medium",
    "Full dental chosen to match the cost model.",
    "The fallback if dental capacity or cost is a problem.",
  ),
  c("prevention-fund", "build", "high", "Protects public health from cuts."),
  c("prevention-free", "groundwork", "high", "Already the rule for ACA preventive services."),
  c(
    "social-needs-fund",
    "stabilize",
    "low",
    "Lets health budgets pay for housing and food in pilots.",
    "Health systems aren't housing experts; start as pilots.",
  ),
  r("social-needs-separate", "low", "Health-budget pilots chosen instead."),
  // ---- Data ----
  c(
    "interop-national",
    "build",
    "medium",
    "Records follow patients.",
    "Privacy and security risks; paired with privacy law and redundancy.",
  ),
  c("interop-standards", "groundwork", "high", "Enforce existing standards now."),
  c("cyber-standards", "groundwork", "high", "Lesson of the Change Healthcare attack."),
  c(
    "cyber-redundant",
    "build",
    "high",
    "No single point of failure for the national claims system.",
  ),
  c("privacy-law", "groundwork", "high", "Covers apps and data brokers."),
  c("privacy-opt-out", "build", "medium", "Choice for patients."),
  // ---- Risks ----
  c(
    "waits-guarantee",
    "universal",
    "medium",
    "Legal maximum waits with care elsewhere when missed.",
  ),
  c("waits-capacity", "groundwork", "high", "Build capacity before demand rises."),
  c("waits-activity-pay", "waves-two-three", "medium", "Pays for extra volume on top of budgets."),
  r("twotier-allow", "medium", "Conflicts with banning duplicate private insurance."),
  r("twotier-ban", "medium", "Supplemental-only chosen as the middle ground."),
  c(
    "twotier-supplemental",
    "universal",
    "medium",
    "Private insurance only for non-covered extras.",
    "Decide where the line between extras and core care sits.",
  ),
  c("underfunding-trust-fund", "build", "medium", "Earmarked revenue indexed to costs."),
  r("underfunding-annual", "medium", "Conflicts with the trust fund; underfunding risk."),
  c("underfunding-target", "stabilize", "medium", "Independent board with a growth target."),
  c("capital-separate", "build", "medium", "Regional capital planning."),
  r("capital-in-rates", "medium", "Separate capital budget chosen."),
  c("innovation-fast-track", "build", "medium", "Cover new drugs at launch, reassess later."),
  c("innovation-public-rd", "build", "medium", "Recycle part of drug savings into research."),
  r("innovation-accept", "medium", "Fast-track coverage chosen instead."),
  c("exit-phase-rates", "waves-two-three", "high", "Phase rate changes over years."),
  c("exit-opt-out-rules", "build", "medium", "Opted-out clinicians stay out for a set period."),
  c("exit-workforce-buffer", "stabilize", "medium", "Lower clinicians' costs, not just pay."),
  c(
    "transition-phased",
    "groundwork",
    "high",
    "Waves over several years; matches the site's draft plan.",
  ),
  r("transition-big-bang", "medium", "Too risky at U.S. scale."),
  r(
    "transition-pilot-states",
    "medium",
    "Phased national waves chosen instead.",
    "State pilots could precede wave one if you prefer more evidence first.",
  ),
  c("fraudconc-integrity", "build", "high", "Fixed budget for program integrity."),
  c("fraudconc-regional", "build", "medium", "Regional administrators under national rules."),
  // ---- Subpaths for problems created by chosen paths ----
  c("choice-accountability", "stabilize", "high", "Service standards and an ombudsman."),
  c("choice-supplemental", "universal", "medium", "Supplemental plans for extras."),
  c(
    "choice-regional-plans",
    "waves-two-three",
    "medium",
    "Integrated systems (Kaiser/Geisinger style) can enroll patients who choose them, as in the detailed plan.",
  ),
  r("tax-payroll", "medium", "Mix chosen."),
  r("tax-income", "medium", "Mix chosen."),
  r("tax-vat", "medium", "Regressive without rebates; mix chosen."),
  c(
    "tax-mix",
    "build",
    "medium",
    "Employer payroll tax plus an income-based household premium and recaptured income tax, as in the model.",
    "Check the rates and the $250k payroll exemption.",
  ),
  c("wage-small-exempt", "build", "high", "Matches the model's payroll exemption."),
  r(
    "wage-no-employer",
    "medium",
    "Requires household-only financing; the model keeps an employer tax.",
  ),
  c(
    "copay-auto-exempt",
    "universal",
    "medium",
    "Applies only to standby copays (if activated) and to supplemental plans.",
  ),
  c("copay-none", "build", "medium", "No charges for core covered care."),
  r("copay-flat-small", "medium", "Zero cost sharing chosen."),
  c("rationing-transparent-hta", "build", "high", "Independent coverage body with appeals."),
  r("rationing-no-qaly", "medium", "Conflicts with evidence-based coverage."),
  c("rationing-clinician-exceptions", "build", "high", "Fast exceptions for unusual cases."),
  c("budget-volume-adjust", "waves-two-three", "high", "Budgets follow population and age."),
  c("budget-mixed", "waves-two-three", "medium", "Activity payments on top of budgets."),
  c("budget-guarantee", "universal", "medium", "Wait guarantees as a backstop."),
  c(
    "under-risk-adjust",
    "waves-two-three",
    "medium",
    "Outcome monitoring for budget-funded hospitals.",
  ),
  c(
    "under-blend",
    "build",
    "high",
    "The primary-care option is blended: per-patient payment for about 70% of expected revenue plus fees for the rest.",
  ),
  r("under-salary", "low", "Fee schedule chosen for clinicians."),
  c("exit-price-floors", "build", "high", "Protects supply of essentials."),
  c("exit-monitoring", "stabilize", "high", "Raise prices when supply falls."),
  r("exit-launch-rules", "low", "Hard to enforce."),
  c("rdpri-peer-review", "build", "high", "Keeps scientists, not politicians, choosing grants."),
  r("rdpri-mixed", "medium", "Public R&D expanded beyond gap-filling."),
  c("scopeq-monitor", "groundwork", "high", "Measure outcomes by clinician type."),
  c("scopeq-transition-period", "groundwork", "medium", "Supervised hours before independence."),
  c("staffing-phase", "stabilize", "high", "Mandates tighten with workforce growth."),
  c("staffing-waivers", "stabilize", "medium", "Time-limited waivers for shortage areas."),
  c("woodwork-assessment", "stabilize", "high", "Independent needs assessment."),
  c("woodwork-cash", "stabilize", "medium", "Cash option for family caregivers."),
  c(
    "migration-residence",
    "universal",
    "medium",
    "Residence period; emergencies, children, pregnancy covered immediately.",
  ),
  r("migration-no-wait", "medium", "Residence period chosen."),
  c("gaming-audit", "stabilize", "high", "Few, audited measures."),
  r("gaming-no-pay", "medium", "Some pay-for-performance kept (wait guarantees, risk adjustment)."),
  c(
    "state-administer",
    "build",
    "medium",
    "States run enrollment and provider relations under national rules.",
  ),
  c(
    "state-moe",
    "build",
    "medium",
    "States pay in what they spent on Medicaid.",
    "Locks in historical differences between states.",
  ),
]

/**
 * The current draft: a Germany-style hybrid. Owner's requirements: specialist
 * waits barely move for people with employer coverage, no household under
 * the break-even floor (constants.ts) pays more, and basic dental in every
 * plan with long-term care left for later.
 */
const HYBRID_ROWS: Row[] = [
  // ---- Who pays and who is covered ----
  r(
    "single-payer",
    "medium",
    "Kept as a separate path to compare (Single payer column on /approaches), not in the current draft: the owner judged it too hard to enact, and it ends the employer plans whose higher payments keep their waits short.",
    "The earlier draft. Its picks are saved in full as SINGLE_PAYER_PICKS.",
  ),
  c(
    "regulated-multipayer",
    "build",
    "medium",
    "Germany-style: everyone without employer coverage, Medicare, or Medicaid joins a non-profit plan that must take everyone at standard benefits.",
    "The new core of the draft. Check plan-market rules: standard benefit, risk adjustment, and how many plans each region needs.",
  ),
  c(
    "employer-mandate-50",
    "groundwork",
    "high",
    `Employers with ${show("employerMandateThreshold")}+ workers keep offering coverage, so their workers keep their plans, doctors, and payment rates; that's what keeps their specialist waits from moving.`,
  ),
  c(
    "joblock-portable-esi",
    "build",
    "medium",
    "Employer plans stay, so make them portable for job changers; a regulated plan is always available as well.",
  ),
  r("joblock-decouple", "medium", "Requires single payer; employer plans stay in the hybrid."),
  r("churn-portable", "medium", "Requires single payer; continuous eligibility handles churn."),
  c(
    "premium-income-based",
    "build",
    "high",
    "People in the regulated plans pay a share of income, capped, with subsidies covering the rest, as in Germany and the ACA.",
  ),
  r(
    "premium-to-tax",
    "medium",
    "Premiums stay in a multi-payer system; they become income-based instead.",
  ),
  c(
    "tax-income",
    "build",
    "high",
    `New federal costs are paid by the surtax on income over ${show("surtaxThreshold")} and by taxing capital gains as ordinary income above it, so no household under ${show("breakEvenFloor")} pays a new tax.`,
    `The owner's break-even rule: nobody under ${show("breakEvenFloor")} of income pays more. Check the funding gap on /approaches.`,
  ),
  r(
    "tax-mix",
    "high",
    `No new payroll tax or broad income tax: the owner's ${show("breakEvenFloor")} break-even rules them out.`,
  ),
  r(
    "tax-payroll",
    "high",
    `A payroll tax would fall on households under ${show("breakEvenFloor")}.`,
  ),
  c(
    "wage-no-employer",
    "build",
    "medium",
    "No new employer tax: employers keep paying for their own plans; households in the regulated plans pay income-based premiums.",
  ),
  r("wage-small-exempt", "medium", "There is no new employer tax to phase in."),
  // ---- Benefits and cost sharing ----
  c(
    "underins-income-cap",
    "build",
    "medium",
    "Modest copays with an annual cap tied to income, in every plan including employer plans.",
  ),
  r(
    "underins-zero",
    "medium",
    "Zero cost sharing across many payers would raise premiums for employer plans.",
  ),
  r("debt-end-billing", "medium", "Requires zero cost sharing."),
  c("copay-flat-small", "build", "medium", "Copays stay flat and small, so bills stay simple."),
  r("copay-none", "medium", "Copays stay, with an income-based cap."),
  c(
    "networks-adequacy",
    "build",
    "high",
    "Plans keep networks, held to adequacy standards and accurate directories.",
  ),
  r("networks-any-provider", "medium", "Requires one payer for every provider."),
  c(
    "dental-basic",
    "wave-one",
    "medium",
    "The owner's pick: preventive and basic dental, glasses, and hearing aids in every plan's standard benefit, paid through premiums as in Germany.",
  ),
  r(
    "dental-full",
    "medium",
    "Full public dental, vision, and hearing costs too much to fund from top-end taxes.",
  ),
  c(
    "keep-ltc-spend-down",
    "stabilize",
    "medium",
    "The owner's pick: long-term care stays as today (Medicare post-acute care, Medicaid after spend-down) for now; a later phase decides how to fund it.",
    `Revisit: Germany funds long-term care with its own payroll contribution, which would break the ${show("breakEvenFloor")} rule.`,
  ),
  r("ltc-social-insurance", "medium", "Left for later: it needs its own funding decision."),
  r("ltc-medicaid-expand", "medium", "Left for later with the rest of long-term care."),
  r("woodwork-assessment", "medium", "Only needed with a new long-term care benefit."),
  r("woodwork-cash", "medium", "Only needed with a new long-term care benefit."),
  // ---- Prices and payment: employer plans keep their payment edge ----
  r(
    "all-payer-rates",
    "medium",
    "One rate for every payer would end employer plans' payment edge, which is what keeps their specialist waits short.",
  ),
  r("global-budgets", "medium", "Hospitals keep being paid per service by many payers."),
  r("fee-for-service-fixed", "medium", "Requires one national fee schedule."),
  r("consolidation-rates", "medium", "Requires all-payer rates."),
  r("pe-rates", "medium", "Requires all-payer rates."),
  r("exec-budget-review", "medium", "Requires global budgets."),
  r("rural-global-budget", "medium", "Requires global budgets."),
  r("transport-public-ems", "medium", "Requires global budgets."),
  r("disparities-uniform", "medium", "Requires all-payer rates."),
  r(
    "opacity-fixed-prices",
    "medium",
    "Prices still differ by plan; disclosure rules apply instead.",
  ),
  r(
    "surprise-single-payer",
    "medium",
    "Requires single payer; the default out-of-network rate applies instead.",
  ),
  // ---- Insurers and administration ----
  c(
    "overhead-mlr",
    "build",
    "medium",
    "Non-profit plans held to tight administrative-cost limits, as in Switzerland.",
  ),
  r("overhead-public", "medium", "There is no single public administrator."),
  r(
    "admin-one-claims",
    "medium",
    "Many plans remain; standard claims and data rules apply instead.",
  ),
  r(
    "burnout-simplify",
    "medium",
    "Requires single payer; scribes and standard claims help instead.",
  ),
  r(
    "denials-coverage-rules",
    "medium",
    "Requires single payer; denial rules apply to every plan instead.",
  ),
  r("ma-fold", "medium", "Medicare Advantage stays, with payment fixes."),
  // ---- Risks of the transition ----
  c(
    "twotier-allow",
    "build",
    "medium",
    "The hybrid is two-tier by design: employer plans pay more and their members get seen sooner, as private patients do in Germany.",
    "The trade-off for the owner's wait-time goal: people in the regulated plans will wait longer than people with employer plans. Capacity investment narrows the gap.",
  ),
  r("twotier-supplemental", "medium", "Employer plans are full coverage, not only extras."),
  c(
    "capital-in-rates",
    "build",
    "medium",
    "Hospitals keep funding buildings and equipment through payment rates, as today.",
  ),
  r("capital-separate", "medium", "Requires a public capital budget."),
  r("budget-volume-adjust", "medium", "No global budgets in the hybrid."),
  r("budget-mixed", "medium", "No global budgets in the hybrid."),
  r("budget-guarantee", "medium", "No global budgets in the hybrid."),
  r(
    "underfunding-trust-fund",
    "medium",
    "Premiums fund the plans; only subsidies come from taxes.",
  ),
  r("waits-activity-pay", "medium", "Providers are already paid per service."),
  r("exit-opt-out-rules", "medium", "Practices can keep taking any plan or none, as today."),
  r("exit-workforce-buffer", "medium", "Requires one claims system."),
  r("fraudconc-regional", "medium", "No single administrator to split into regions."),
  r(
    "choice-accountability",
    "medium",
    "Plan choice stays, so no single payer to hold to standards.",
  ),
  r("choice-supplemental", "medium", "Plan choice stays."),
  r("choice-regional-plans", "medium", "Plan choice stays."),
  r("state-administer", "medium", "No single payer for states to run."),
  r("state-moe", "medium", "Medicaid stays, so states keep funding it as today."),
]

const merged = new Map<string, Row>()
for (const row of [...SINGLE_PAYER_ROWS, ...HYBRID_ROWS]) merged.set(row[0], row)
const ROWS: Row[] = [...merged.values()]

/** The earlier single-payer draft, kept as its own path to compare. */
export const SINGLE_PAYER_PICKS: string[] = SINGLE_PAYER_ROWS.filter((r) => r[1] === "chosen").map(
  (r) => r[0],
)

/** Draft decisions as written above, before owner edits. */
export const DRAFT_DECISIONS: Decision[] = ROWS.map(
  ([pathId, status, phase, confidence, reason, review]) => ({
    pathId,
    status,
    ...(phase ? { phase } : {}),
    confidence,
    reason,
    ...(review ? { review } : {}),
    reviewed: false,
  }),
)

export const DECISIONS: Decision[] = DRAFT_DECISIONS.map((d) => {
  const o = REVIEW_OVERRIDES[d.pathId]
  if (!o) return d
  const status = o.status ?? d.status
  const phase = status === "chosen" ? (o.phase ?? d.phase) : undefined
  return {
    ...d,
    status,
    phase,
    reviewed: o.reviewed ?? d.reviewed,
    ...(o.note ? { ownerNote: o.note } : {}),
  }
})

export const DECISION_BY_PATH: Record<string, Decision> = Object.fromEntries(
  DECISIONS.map((d) => [d.pathId, d]),
)
