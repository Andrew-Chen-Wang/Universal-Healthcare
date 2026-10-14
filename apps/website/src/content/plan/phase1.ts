import type { Phase } from "../types"
import { F } from "../figures"
import { show } from "../constants"
import { MODEL, fmt, oneTime, service, sourceLine, useLine } from "./helpers"

const drugs = service("prescriptionDrugs")
const hospital = service("hospital")
const physician = service("physicianClinical")

export const PHASE_1: Phase = {
  id: "build",
  number: 1,
  title: "Enactment & build",
  window: "Year 0: the 18 months between signing and first coverage",
  goal: "Stand up the agency, the money, the systems, the rules, and the people, so that coverage day works.",
  exitCriteria: [
    "Claims system processes 100% of Medicare volume in parallel testing with error rates at or below current Medicare contractors.",
    "Every Year-1-eligible person has an identifier and a card mailed.",
    "At least 90% of physicians who bill Medicare today have signed UHP participation agreements.",
    "Every hospital has a Year-1 global budget.",
    "The national formulary covers 100% of drugs currently on Medicare Part D formularies.",
    "IRS withholding tables published for the new taxes.",
  ],
  steps: [
    {
      id: "create-uha",
      title: "Create the Universal Health Administration",
      summary:
        "Stand up the agency that runs UHP by absorbing CMS's Medicare operations, then building out 10 regional offices, independent rate-setting and technology-assessment boards, and an Office of Patient Advocacy.",
      legalVehicle:
        "Universal Health Act, Title I. CMS's Center for Medicare is transferred by statute.",
      owner:
        "HHS Secretary; UHA Administrator (Senate-confirmed, 6-year term, removable only for cause)",
      timeline: "Months 0–18",
      tasks: [
        {
          action:
            "Transfer CMS Center for Medicare staff (about 2,000 FTE) and its Medicare Administrative Contractor (MAC) contracts to the UHA.",
          owner: "HHS",
          when: "Month 0–3",
        },
        {
          action:
            "Nominate and confirm the Administrator, Deputy for Operations, Chief Medical Officer, and Chief Information Officer.",
          owner: "President / Senate",
          when: "Month 0–4",
        },
        {
          action:
            "Open 10 regional offices aligned with HHS regions; each runs hospital budget negotiation, provider relations, and wait-time monitoring for its region.",
          owner: "UHA",
          when: "Month 3–12",
        },
        {
          action:
            "Constitute the Payment Rates Board (11 members: economists, clinicians, and patient advocates; no current industry employees) and the Health Technology Assessment Institute.",
          owner: "UHA / Congress",
          when: "Month 2–8",
        },
        {
          action:
            "Create the Office of Patient Advocacy: an ombudsman, an appeals process with 30-day decisions, and a 24/7 multilingual help line.",
          owner: "UHA",
          when: "Month 6–15",
        },
        {
          action:
            "Hire about 40,000 staff through direct-hire authority, with priority for displaced insurer, Medicaid-agency, and Marketplace staff.",
          owner: "UHA / OPM",
          when: "Month 3–18",
        },
        {
          action:
            "Publish a governance charter: conflict-of-interest rules, a 2-year revolving-door ban for board members, and open meetings.",
          owner: "UHA",
          when: "Month 3",
        },
      ],
      cost: {
        oneTime: oneTime("agency"),
        recurring: MODEL.side.uhpAdmin,
        ledgerNote: `Start-up staffing is ${fmt(oneTime("agency"))} one-time. Steady-state UHP administration is ${fmt(MODEL.side.uhpAdmin)} a year (${(MODEL.rates.uhpAdminRate * 100).toFixed(1)}% of benefits) in the 'Public program administration' ledger line, which replaces Medicare and Medicaid administration.`,
      },
      pros: [
        { point: "Builds on an agency that already pays for 67 million people's care." },
        { point: "Independent boards insulate rates from annual lobbying." },
        { point: "Hiring preference turns displaced insurance workers' skills into public jobs." },
      ],
      cons: [
        {
          point:
            "The federal hiring process is slow; direct-hire authority must be granted by statute.",
        },
        { point: "A large new agency becomes a political target in every budget cycle." },
        { point: "Independent boards reduce democratic accountability for unpopular decisions." },
      ],
      tradeoffs: [
        "Independence vs. accountability: a board that can't be overruled can make painful but necessary cuts. It can also become unresponsive. The congressional-veto design (recommendations take effect unless both chambers vote them down) splits the difference.",
      ],
      risks: [
        {
          risk: "Agency capture by the providers it pays.",
          mitigation:
            "Revolving-door bans, public data on every rate decision, and a statutory Inspector General with a dedicated budget.",
        },
        {
          risk: "Under-staffing leads to slow appeals and claims.",
          mitigation:
            "Administrative funding set as a fixed share of benefit spending, not annually appropriated.",
        },
      ],
      precedent: [
        "Medicare enrolled 19 million seniors within 11 months in 1965–66 using Social Security field offices.",
        "Taiwan's Bureau of National Health Insurance launched with about 2,800 staff for 21 million people.",
      ],
      dependsOn: [],
      sourceIds: ["cms-trustees-2025", "taiwan-nhi"],
    },
    {
      id: "trust-fund",
      title: "Create the UHP Trust Fund",
      summary:
        "All dedicated revenues (the payroll taxes, household premium, state MOE, and redirected federal appropriations) flow into a single trust fund with permanent budget authority to pay claims, so a government shutdown never stops payment for care.",
      legalVehicle:
        "Universal Health Act, Title VII; modeled on the Medicare HI and SMI trust funds.",
      owner: "Treasury (managing trustee), UHA",
      timeline: "Months 0–12",
      tasks: [
        {
          action:
            "Merge the Medicare HI and SMI trust funds into the UHP Trust Fund; transfer balances.",
          owner: "Treasury",
          when: "Month 12",
        },
        {
          action:
            "Set up automatic transfers: payroll and premium receipts, state MOE payments (monthly), and federal general-revenue appropriations (permanent, indefinite).",
          owner: "Treasury",
          when: "Month 6–12",
        },
        {
          action: `Establish a contingency reserve equal to 2 months of benefits (about ${F.reserve} at steady state), built over 5 years.`,
          owner: "Treasury",
          when: "Years 1–5",
        },
        {
          action:
            "Create an annual trustees report with a 10-year and 75-year projection, and an automatic trigger when the reserve falls below 1 month.",
          owner: "Trustees",
          when: "Year 1+",
        },
      ],
      cost: {
        recurring: 0,
        ledgerNote:
          "Accounting structure only. Building the reserve is cash timing and is not in the steady-state ledger.",
      },
      pros: [
        { point: "Claims keep getting paid during shutdowns and debt-ceiling standoffs." },
        { point: "Dedicated revenue is politically durable (cf. Social Security)." },
      ],
      cons: [
        {
          point:
            "Trust-fund 'insolvency' dates create recurring crisis politics (cf. Medicare HI).",
        },
        { point: "Permanent appropriation reduces Congress's annual control." },
      ],
      tradeoffs: ["Stability for patients and providers vs. annual fiscal discipline."],
      risks: [
        {
          risk: "Recessions cut payroll and income revenue while costs keep rising.",
          mitigation:
            "Counter-cyclical general-revenue transfers when unemployment exceeds 6%, and the contingency reserve.",
        },
      ],
      precedent: [
        "Medicare HI and SMI Trust Funds; Canada's Canada Health Transfer (formula-based, not annual appropriation).",
      ],
      dependsOn: ["create-uha"],
      sourceIds: ["cms-trustees-2025"],
    },
    {
      id: "build-claims-system",
      title: "Build the claims, payment & data systems",
      summary:
        "Scale Medicare's existing fee-for-service claims infrastructure from about 1.3 billion to about 5 billion claims a year, add hospital global-budget payments, dental and vision claim types, and a national real-time eligibility check.",
      legalVehicle:
        "UHA administrative authority; procurement under the Federal Acquisition Regulation with statutory exemptions for speed.",
      owner: "UHA Chief Information Officer; MACs; U.S. Digital Service",
      timeline: "Months 0–18, then continuous",
      tasks: [
        {
          action:
            "Inventory Medicare's Fiscal Intermediary Shared System (FISS), Multi-Carrier System (MCS), Common Working File (CWF), and the DME system; decide extend-vs-replace for each.",
          owner: "UHA CIO",
          when: "Month 0–3",
        },
        {
          action:
            "Expand MAC capacity: re-compete MAC contracts for 10 regions sized to the full population.",
          owner: "UHA",
          when: "Month 3–12",
        },
        {
          action:
            "Add claim types: dental (ADA CDT codes), vision, hearing, and home- and community-based services.",
          owner: "UHA / MACs",
          when: "Month 3–15",
        },
        {
          action:
            "Build a real-time eligibility API so any provider can check coverage in under 1 second (replacing 270/271 transactions with hundreds of payers).",
          owner: "USDS / UHA",
          when: "Month 3–12",
        },
        {
          action:
            "Build hospital global-budget payment rails: bi-weekly fixed payments plus encounter data submission for quality and planning.",
          owner: "UHA",
          when: "Month 6–15",
        },
        {
          action:
            "Run parallel testing: process 3 months of real Medicare claims through the new system and compare.",
          owner: "UHA / independent verifier",
          when: "Month 12–17",
        },
        {
          action:
            "Set up a load-test and go/no-go gate with an independent verification contractor (lesson from HealthCare.gov).",
          owner: "UHA / GAO observer",
          when: "Month 15–18",
        },
        {
          action:
            "Retire payer-specific claim edits: one national set of coding edits (NCCI) published openly.",
          owner: "UHA",
          when: "Month 18",
        },
      ],
      cost: {
        oneTime: oneTime("it"),
        ledgerNote: `${fmt(oneTime("it"))} one-time in the transition table. Ongoing IT operation is inside UHP administration (${fmt(MODEL.side.uhpAdmin)} a year).`,
      },
      pros: [
        {
          point: "Medicare already pays most claims within 14–30 days at very low cost per claim.",
        },
        {
          point:
            "One claim format ends the per-payer billing complexity that costs providers 8–13% of revenue.",
          detail: "Jiwani et al. 2014.",
        },
      ],
      cons: [
        {
          point:
            "Medicare's core systems are decades old (some COBOL); scaling them 4x carries real risk.",
        },
        {
          point: "Concentrates cyber risk: an attack on one payer would stop payment nationwide.",
          detail: "Cf. the 2024 Change Healthcare ransomware attack.",
        },
      ],
      tradeoffs: [
        "Extending legacy systems is faster but locks in technical debt. Rebuilding is cleaner but riskier on an 18-month deadline. The plan extends first and rebuilds in Years 3–6.",
      ],
      risks: [
        {
          risk: "Launch-day failure (HealthCare.gov, October 2013).",
          mitigation:
            "Independent verification, parallel run, phased enrollment waves, and a legal fallback that pays providers interim amounts based on prior-year billing if claims processing fails.",
        },
        {
          risk: "Ransomware or outage.",
          mitigation:
            "Geographically redundant processing across MACs, offline interim-payment protocol, and a mandatory security baseline for all connected providers.",
        },
      ],
      precedent: [
        "Taiwan launched NHI claims processing within 12 months and later introduced a universal smart card (2004) that holds recent visits and prescriptions.",
        "GAO's review of HealthCare.gov found inadequate oversight and testing.",
      ],
      dependsOn: ["create-uha"],
      sourceIds: ["healthcare-gov", "taiwan-nhi", "jiwani-2014"],
    },
    {
      id: "auto-enrollment",
      title: "Enroll everyone automatically",
      summary:
        "Nobody applies. Everyone with a Social Security number or ITIN and a U.S. address is enrolled from existing federal records; others enroll at any provider, Social Security office, or community health center with proof of residence.",
      legalVehicle:
        "Universal Health Act, Title II; data-sharing authority with SSA, IRS, DHS, and states.",
      owner: "UHA, SSA, IRS",
      timeline: "Months 6–18 for Wave 1, then before each wave",
      tasks: [
        {
          action:
            "Build the enrollment file from SSA (Numident), IRS (filers and dependents), Medicare and Medicaid rolls, and state birth records.",
          owner: "UHA / SSA / IRS",
          when: "Month 6–12",
        },
        {
          action:
            "Issue a UHP number to each person (extending the Medicare Beneficiary Identifier format); do not use SSNs on cards.",
          owner: "UHA",
          when: "Month 9–15",
        },
        {
          action:
            "Mail cards in waves; offer a digital card in a mobile app; providers can verify by name and date of birth if the card is lost.",
          owner: "UHA",
          when: "Month 12–18",
        },
        {
          action:
            "Presumptive eligibility: anyone who shows up for care is treated and enrolled at the point of care. No one is turned away for lack of a card.",
          owner: "UHA / providers",
          when: "Day 1",
        },
        {
          action:
            "Define residency rules: 90 days of residence, with evidence such as a lease, utility bill, school enrollment, or employer letter. Students and workers on visas are covered while resident.",
          owner: "UHA",
          when: "Month 6",
        },
        {
          action:
            "Set rules for Americans abroad: coverage pauses after 12 months abroad and resumes on return. Cross-border commuters are covered.",
          owner: "UHA",
          when: "Month 6",
        },
        {
          action:
            "Use the IRS address file to notify every household which wave covers each member.",
          owner: "UHA / IRS",
          when: "Month 12",
        },
      ],
      cost: {
        oneTime: oneTime("enrollment"),
        ledgerNote: `${fmt(oneTime("enrollment"))} one-time (cards, mailing, outreach). Ongoing enrollment maintenance is inside UHP administration.`,
      },
      pros: [
        {
          point:
            "Ends coverage churn: today millions lose Medicaid each year at redetermination, often for paperwork reasons.",
          detail: "About 25 million people were disenrolled in the 2023–24 Medicaid 'unwinding'.",
        },
        {
          point: "No premiums to collect from individuals at enrollment means no enrollment gaps.",
        },
      ],
      cons: [
        {
          point:
            "A national enrollment file linking SSA, IRS, and health data raises privacy concerns.",
        },
        {
          point:
            "Residency verification for people without documents is administratively and politically fraught.",
        },
      ],
      tradeoffs: [
        "Easy enrollment vs. program integrity: presumptive eligibility at the point of care means some non-residents will receive care. The plan accepts that cost (small) to guarantee no eligible person is turned away.",
      ],
      risks: [
        {
          risk: "Identity fraud using UHP numbers.",
          mitigation:
            "Claims analytics flag one identifier used in multiple places; card photos optional.",
        },
      ],
      precedent: [
        "Medicare Part A auto-enrollment at 65 for Social Security recipients.",
        "Taiwan's NHI card; Canada's provincial health cards.",
      ],
      dependsOn: ["create-uha", "build-claims-system"],
      sourceIds: [],
    },
    {
      id: "define-benefits",
      title: "Define the benefit package & cost sharing",
      summary: `Write down exactly what UHP covers, what it excludes, and what patients pay at the point of care: nothing for covered services. Out-of-pocket spending falls from ${fmt(sourceLine("hhOop").before)} to ${fmt(sourceLine("hhOop").after)}; what remains is for excluded items.`,
      legalVehicle:
        "Universal Health Act, Title III (benefits); HTA Institute coverage determinations for additions and removals.",
      owner: "Congress (statutory categories); UHA Chief Medical Officer; HTA Institute",
      timeline: "Months 0–12",
      tasks: [
        {
          action:
            "Enact statutory benefit categories: hospital, physician, outpatient, mental health & substance use, maternity & newborn, prescription drugs, lab & imaging, rehabilitation & habilitation, dental, vision, hearing, home- and community-based long-term services, and the clinical component of nursing-facility care.",
          owner: "Congress",
          when: "Drafting",
        },
        {
          action:
            "List statutory exclusions: over-the-counter products, cosmetic procedures, premium eyewear and hearing-aid upgrades, nursing-home room and board, and services the HTA Institute finds ineffective.",
          owner: "Congress",
          when: "Drafting",
        },
        {
          action:
            "Set $0 cost sharing for all covered services; write the standby prescription copay schedule ($0/$5/$15, $200 annual cap, waived below 200% FPL) that Congress can switch on.",
          owner: "Congress",
          when: "Drafting",
        },
        {
          action:
            "Publish a national coverage manual by converting Medicare's National Coverage Determinations and adding pediatric, maternity, dental, vision, and hearing coverage rules.",
          owner: "UHA CMO",
          when: "Months 3–12",
        },
        {
          action:
            "Define the nursing-home room-and-board contribution: residents keep a personal-needs allowance and contribute up to 80% of income above it.",
          owner: "UHA",
          when: "Month 6",
        },
        {
          action:
            "Decide the contested services (abortion / Hyde Amendment, gender-affirming care) by explicit vote; see Design.",
          owner: "Congress",
          when: "Drafting",
        },
        {
          action:
            "Create a public petition process to add services, with HTA review within 180 days.",
          owner: "HTA Institute",
          when: "Month 12",
        },
      ],
      cost: {
        recurring: MODEL.headline.utilizationEffect,
        ledgerNote: `The benefit package drives the utilization effect (${fmt(MODEL.headline.utilizationEffect, { sign: true })} a year across all services) and the remaining out-of-pocket spending (${fmt(sourceLine("hhOop").after)}).`,
      },
      pros: [
        {
          point: "No one skips covered care because of cost; medical debt from covered care ends.",
        },
        {
          point:
            "Seniors and working adults gain dental, vision, and hearing coverage that Medicare and many plans lack.",
        },
        { point: "No bills means no billing staff, collections, or bad debt for covered care." },
      ],
      cons: [
        {
          point: "Free care increases demand",
          detail: `About ${fmt(MODEL.headline.utilizationEffect)} a year, which competes for the same appointment slots.`,
        },
        {
          point:
            "A single national package removes the ability to buy richer or leaner coverage for covered services.",
        },
        {
          point:
            "Some services people use now (e.g., some elective procedures) may be excluded after HTA review.",
        },
      ],
      tradeoffs: [
        "Zero cost sharing removes financial barriers but also the price signal against low-value care. The plan relies on clinical guidelines and the HTA Institute instead of prices to limit low-value use.",
        "Broad benefits (dental, home care) cost more but end the largest remaining out-of-pocket burdens. A Medicare-equivalent package would cost about $110–150B a year less but keep those burdens.",
      ],
      risks: [
        {
          risk: "Utilization exceeds the central estimate.",
          mitigation: "Standby copay schedule and spending growth target.",
        },
        {
          risk: "Benefit creep through political additions.",
          mitigation: "Additions require HTA review and budget impact statements.",
        },
      ],
      precedent: [
        "Canada covers physician and hospital care fully but not drugs, dental, or vision for most adults, leaving large out-of-pocket gaps.",
        "The UK NHS is free at the point of use except prescription charges in England and dental charges.",
        "Japan charges 30% coinsurance with monthly caps; France uses coinsurance mostly covered by complementary insurance.",
      ],
      dependsOn: [],
      sourceIds: ["rand-hie", "oregon-experiment", "sanders-m4a"],
    },
    {
      id: "provider-enrollment",
      title: "Sign up providers & set participation rules",
      summary:
        "Every licensed provider that wants to bill UHP signs one participation agreement. Participating providers accept UHP payment as payment in full (no balance billing). Opted-out providers may see patients privately but cannot bill UHP for anyone.",
      legalVehicle:
        "Universal Health Act, Title IV; extends Medicare's PECOS enrollment and opt-out rules (SSA §1802(b)).",
      owner: "UHA Provider Enrollment; state licensing boards",
      timeline: "Months 6–18",
      tasks: [
        {
          action:
            "Auto-convert every Medicare-enrolled provider in PECOS (about 1.5 million) to a UHP provider, with a 90-day opt-out window.",
          owner: "UHA",
          when: "Month 9–12",
        },
        {
          action:
            "Enroll providers not in Medicare today: pediatricians, obstetricians, dentists, optometrists, audiologists, and HCBS agencies.",
          owner: "UHA",
          when: "Month 6–18",
        },
        {
          action:
            "Publish participation terms: payment in full, no balance billing, data reporting (quality, waits, ownership), non-discrimination, and posted hours.",
          owner: "UHA",
          when: "Month 6",
        },
        {
          action:
            "Set opt-out rules: a 2-year all-or-nothing commitment; opted-out providers must post a notice and give patients written fee estimates.",
          owner: "UHA",
          when: "Month 6",
        },
        {
          action:
            "Ownership transparency: every participating entity reports its ultimate owners (private equity, health systems, insurers).",
          owner: "UHA",
          when: "Month 12",
        },
        {
          action:
            "Establish provider-relations offices in each region for disputes and onboarding.",
          owner: "UHA regional offices",
          when: "Month 9–18",
        },
      ],
      cost: {
        ledgerNote:
          "Inside UHP administration. Opt-out providers' cash revenue is outside the ledger (private spending on non-UHP care).",
      },
      pros: [
        { point: "One enrollment, one contract, one set of rules for every provider." },
        { point: "Every participating provider sees every patient: networks no longer exist." },
      ],
      cons: [
        {
          point:
            "Some high-demand specialists (dermatology, plastic surgery, some psychiatry) may opt out and go cash-only, shrinking public capacity.",
        },
        {
          point:
            "The balance-billing ban removes a revenue source for physicians in high-cost areas.",
        },
      ],
      tradeoffs: [
        "Allowing opt-out keeps the system voluntary for providers (and constitutionally safer) but creates a private cash tier for the wealthy. Banning opt-out would be more equal but would push some physicians into early retirement.",
      ],
      risks: [
        {
          risk: "Mass opt-out in specific specialties or regions.",
          mitigation:
            "Monitor opt-out rates by specialty and region monthly; targeted rate adjustments if any specialty exceeds 10% opt-out; wait-time guarantee pays opted-out providers at 150% when UHP can't meet waits.",
        },
      ],
      precedent: [
        "Medicare: about 1% of physicians have opted out (concentrated in psychiatry).",
        "Canada: physicians may opt out but few do, because private insurance for covered services is barred so the cash market is small.",
      ],
      dependsOn: ["create-uha"],
      sourceIds: ["holgash-heberlein"],
    },
    {
      id: "fee-schedule",
      title: "Set the national fee schedule",
      summary: `Adopt Medicare's RBRVS fee schedule as the base, raise primary care to ${show("primaryCareRate", "pct")} of Medicare, procedural specialties to ${show("proceduralRate", "pct")}, and others to ${show("physicianRate", "pct")} on average. Physician & clinical UHP spending becomes ${fmt(physician.uhpSpending)} (price effect ${fmt(physician.priceEffect, { sign: true })}, utilization effect ${fmt(physician.utilizationEffect, { sign: true })}).`,
      legalVehicle:
        "Universal Health Act, Title V; Payment Rates Board recommendations with congressional veto.",
      owner: "Payment Rates Board; UHA",
      timeline: "Months 3–15; annual updates thereafter",
      tasks: [
        {
          action:
            "Start from the CY Medicare Physician Fee Schedule (about 10,000 codes) and apply specialty-group multipliers.",
          owner: "Rates Board",
          when: "Month 3–9",
        },
        {
          action:
            "Create fee schedules for services Medicare doesn't pay for: dental (CDT codes priced at 95% of the average private fee), pediatric and obstetric codes, vision, and hearing.",
          owner: "Rates Board",
          when: "Month 3–12",
        },
        {
          action: "Adopt a geographic practice-cost index (GPCI) and a rural add-on of 10%.",
          owner: "Rates Board",
          when: "Month 6",
        },
        {
          action:
            "Publish 4-year convergence paths: each provider's payments move 25% per year from its current blended rate to the UHP rate.",
          owner: "UHA",
          when: "Month 9",
        },
        {
          action:
            "Re-value overpriced procedures: commission an independent review of RVU inputs, which are currently developed largely by the AMA's RUC.",
          owner: "Rates Board",
          when: "Months 6–24",
        },
        {
          action:
            "Offer primary-care capitation: a per-patient monthly payment covering 70% of expected revenue, plus fee-for-service for the rest, for practices that opt in.",
          owner: "UHA",
          when: "Month 15",
        },
      ],
      cost: {
        recurring: physician.delta,
        ledgerNote: `Ledger line 'Physician & clinical services': ${fmt(physician.baselineTotal)} → ${fmt(physician.newTotal)}.`,
      },
      pros: [
        {
          point: "Medicaid patients become as valuable as any other patient",
          detail: `Today Medicaid pays about ${show("medicaidFeeIndex")} of Medicare and private insurers pay about 140%.`,
        },
        { point: "Primary care gets a raise, which helps the primary-care shortage." },
        { point: "Physicians stop needing billing staff for dozens of payers." },
      ],
      cons: [
        {
          point:
            "Specialists whose income depends on commercial rates (orthopedics, cardiology, gastroenterology, dermatology) see fee cuts of 20–30%.",
        },
        { point: "Fee-for-service keeps volume incentives." },
      ],
      tradeoffs: [
        "Raising primary care while cutting procedures narrows the income gap between specialties, which may shift medical students toward primary care but lowers the payoff from long specialty training.",
      ],
      risks: [
        {
          risk: "Specialist early retirement or opt-out.",
          mitigation:
            "4-year phase-in, malpractice premium relief through a pilot no-fault program, and monitoring of specialty-specific waits.",
        },
      ],
      precedent: [
        "Japan sets a single national fee schedule every two years for all payers, and has kept spending growth low for decades.",
        "Germany's EBM and Canada's provincial schedules are negotiated with physician associations.",
      ],
      dependsOn: ["create-uha"],
      sourceIds: ["medpac-2025", "kff-medicaid-fee-index"],
    },
    {
      id: "hospital-global-budgets",
      title: "Set hospital global budgets",
      summary: `Each hospital gets an annual operating budget covering all UHP patients, negotiated with its regional office. In aggregate, hospital spending goes from ${fmt(hospital.baselineTotal)} to ${fmt(hospital.newTotal)} (price effect ${fmt(hospital.priceEffect, { sign: true })}, utilization ${fmt(hospital.utilizationEffect, { sign: true })}).`,
      legalVehicle:
        "Universal Health Act, Title V; Maryland Total Cost of Care methodology as a template.",
      owner: "UHA regional offices; Payment Rates Board",
      timeline: "Months 6–18; annual negotiation thereafter",
      tasks: [
        {
          action:
            "Collect each hospital's audited 2-year cost reports, payer mix, case mix, and service lines.",
          owner: "UHA",
          when: "Month 6–9",
        },
        {
          action:
            "Compute a base budget: Medicare-equivalent volume × 1.20, adjusted for case mix, teaching status, safety-net share, and rural isolation.",
          owner: "Rates Board",
          when: "Month 9–12",
        },
        {
          action:
            "Set volume corridors: budgets adjust up if volume rises more than 3% (to avoid rationing) and down if it falls more than 3%.",
          owner: "Rates Board",
          when: "Month 9",
        },
        {
          action:
            "Withhold 2% of the budget for quality performance: readmissions, hospital-acquired infections, patient experience, and wait times.",
          owner: "UHA",
          when: "Month 12",
        },
        {
          action:
            "Pay budgets in 26 bi-weekly installments; hospitals submit encounter data (not claims) for every patient.",
          owner: "UHA",
          when: "Month 18+",
        },
        {
          action:
            "Separate capital: hospitals may not use operating budgets for construction or major equipment over $1M; they apply to the regional capital board instead.",
          owner: "UHA / regional boards",
          when: "Month 18+",
        },
        {
          action:
            "Create an out-of-region payment rule: hospitals receive fee-schedule payment for patients from outside their region (e.g., referrals to academic centers).",
          owner: "Rates Board",
          when: "Month 12",
        },
      ],
      cost: {
        recurring: hospital.delta,
        ledgerNote: `Ledger line 'Hospital care': ${fmt(hospital.baselineTotal)} → ${fmt(hospital.newTotal)}. The capital spending line (structures & equipment) stays at ${fmt(useLine("structures").after)}.`,
      },
      pros: [
        { point: "Predictable revenue: hospitals stop chasing commercially insured patients." },
        {
          point:
            "Hospital billing departments shrink dramatically: no claims adjudication, no denials.",
        },
        {
          point:
            "Maryland's global budgets held hospital spending growth below the national trend while keeping hospitals solvent.",
        },
      ],
      cons: [
        {
          point: "Hospitals with high commercial revenue lose money",
          detail:
            "Academic medical centers and suburban systems may see 15–30% revenue cuts before admin savings.",
        },
        {
          point:
            "Budgets based on history reward past inefficiency and penalize hospitals that were already lean.",
        },
        { point: "A fixed budget can encourage rationing near year-end." },
      ],
      tradeoffs: [
        "Cost control vs. responsiveness: a global budget caps spending, but if demand rises faster than the volume corridor, patients wait. Canada's waits are partly a global-budget phenomenon.",
      ],
      risks: [
        {
          risk: "Hospital closures in markets where commercial revenue subsidized losses.",
          mitigation:
            "Hospital Transition Fund; closure reviews; regional boards can designate 'essential' facilities with protected budgets.",
        },
        {
          risk: "Rationing to stay within budget.",
          mitigation:
            "Volume corridors and wait-time guarantee penalties paid by the hospital, not the patient.",
        },
      ],
      precedent: [
        "Maryland all-payer global budgets (2014–present).",
        "Canadian provincial hospital global budgets (since the 1970s); Ontario has moved part of funding to activity-based payment to reduce waits.",
      ],
      dependsOn: ["create-uha", "build-claims-system"],
      sourceIds: ["maryland-model", "rand-hospital-2024", "medpac-2025"],
    },
    {
      id: "national-formulary",
      title: "Create the national formulary & negotiate drug prices",
      summary: `A National Formulary and Pricing Board covers every FDA-approved drug with a negotiated price. Retail drug spending falls from ${fmt(drugs.baselineTotal)} to ${fmt(drugs.newTotal)} (price effect ${fmt(drugs.priceEffect, { sign: true })}, utilization ${fmt(drugs.utilizationEffect, { sign: true })}).`,
      legalVehicle:
        "Universal Health Act, Title VI; extends IRA negotiation (SSA §1191 et seq.) to all drugs; 28 U.S.C. §1498 backstop.",
      owner: "National Formulary and Pricing Board; HTA Institute",
      timeline: "Months 0–18 for the initial formulary; continuous negotiation",
      tasks: [
        {
          action:
            "Start with the union of all Medicare Part D formularies, so no patient loses access to a drug they take on day one.",
          owner: "Formulary Board",
          when: "Month 0–6",
        },
        {
          action:
            "Year-1 interim prices: Medicare negotiated prices where they exist; elsewhere the lower of Medicaid's net price + 10% or the median price in 11 reference countries + 20%.",
          owner: "Formulary Board",
          when: "Month 6–12",
        },
        {
          action:
            "Run full negotiations for the 500 highest-spend brand drugs over Years 1–3, using value assessments from the HTA Institute.",
          owner: "Formulary Board / HTA Institute",
          when: "Years 1–3",
        },
        {
          action:
            "Define the §1498 process: if a manufacturer won't sign a price within 18 months, the Board may contract for generic supply and pay the patent holder 'reasonable and entire compensation' set by the Court of Federal Claims.",
          owner: "Formulary Board / DOJ",
          when: "Month 12",
        },
        {
          action:
            "Pay pharmacies directly: a dispensing fee ($10.50 per prescription, roughly the Medicaid average) plus acquisition cost. Spread pricing and PBM rebates end.",
          owner: "UHA",
          when: "Month 18",
        },
        {
          action:
            "Include physician-administered drugs (now Part B and hospital outpatient) in negotiation; hospitals and clinics are reimbursed at the negotiated price + 6%.",
          owner: "Formulary Board",
          when: "Year 2",
        },
        {
          action:
            "Exceptions process: a physician can request a non-formulary drug, with a 72-hour decision (24 hours if urgent).",
          owner: "UHA",
          when: "Month 18",
        },
      ],
      cost: {
        oneTime: oneTime("formulary"),
        recurring: drugs.delta,
        ledgerNote: `Ledger line 'Retail prescription drugs': ${fmt(drugs.baselineTotal)} → ${fmt(drugs.newTotal)}. Board start-up ${fmt(oneTime("formulary"))} one-time.`,
      },
      pros: [
        {
          point:
            "Patients pay $0 for formulary drugs: no deductibles, no coinsurance on insulin or cancer drugs.",
        },
        { point: "Eliminates the PBM rebate system and its opaque spread pricing." },
        { point: "U.S. stops paying about 4x other countries' prices for brand drugs." },
      ],
      cons: [
        {
          point: `Pharmaceutical revenue falls (about ${F.drugPriceSaving} a year at retail alone), which reduces R&D investment.`,
          detail:
            "CBO estimated a narrower policy (H.R. 3) would mean about 8 fewer new drugs in its first decade and about 30 fewer in the next; this plan is broader.",
        },
        {
          point:
            "Some drugs may launch later in the U.S. or not at all if the price offered is too low.",
        },
        {
          point:
            "Formulary exclusions mean some patients can't get a specific brand without an exception.",
        },
      ],
      tradeoffs: [
        "Lower prices today vs. fewer new drugs tomorrow. The plan accepts some loss of future innovation in exchange for affordability now, and partly offsets it by raising NIH funding (optional; not in the base ledger).",
      ],
      risks: [
        {
          risk: "Manufacturers withdraw drugs from the U.S. market.",
          mitigation:
            "§1498 authority; the U.S. is about 45% of global pharma revenue, so withdrawal is costly for manufacturers.",
        },
        {
          risk: "Trade retaliation or treaty disputes over §1498.",
          mitigation:
            "Use §1498 sparingly as a backstop; TRIPS Article 31 permits government use with compensation.",
        },
      ],
      precedent: [
        "Medicare IRA negotiation: the first 10 drugs' prices were 38–79% below list.",
        "Germany's AMNOG: benefit assessment within 6 months of launch, then a negotiated price.",
        "UK NICE: a cost-per-QALY threshold of £20,000–30,000 (raised in 2025).",
      ],
      dependsOn: ["create-uha"],
      sourceIds: ["cms-negotiation", "rand-drugs-2024", "cbo-hr3-drugs"],
    },
    {
      id: "hta-institute",
      title: "Create the Health Technology Assessment Institute",
      summary:
        "An independent body that evaluates whether new services, devices, and drugs work better than existing alternatives, and recommends coverage and price. Removes ineffective services from the benefit package.",
      legalVehicle: "Universal Health Act, Title III; builds on AHRQ and PCORI.",
      owner: "HTA Institute (independent, within HHS)",
      timeline: "Months 0–18; continuous",
      tasks: [
        {
          action:
            "Merge PCORI and AHRQ's evidence centers into the Institute; staff about 600 analysts and clinicians.",
          owner: "HHS",
          when: "Month 0–12",
        },
        {
          action:
            "Publish methods: comparative effectiveness and budget impact. If cost-per-QALY is used, also report results without it, to address disability-discrimination concerns.",
          owner: "HTA Institute",
          when: "Month 6",
        },
        {
          action:
            "Build a 'low-value care' list (e.g., imaging for uncomplicated low-back pain, vitamin D screening) for non-coverage or clinical guidance.",
          owner: "HTA Institute",
          when: "Year 1–2",
        },
        {
          action:
            "Set a 180-day maximum for assessment of new drugs and devices, with provisional coverage during review.",
          owner: "HTA Institute",
          when: "Month 12",
        },
      ],
      cost: { recurring: 0.4, ledgerNote: "About $400M a year, inside UHP administration." },
      pros: [
        { point: "Spending follows evidence rather than marketing." },
        { point: "Provisional coverage avoids access delays during review." },
      ],
      cons: [
        {
          point:
            "'Death panel' politics: coverage denials of expensive treatments are politically explosive.",
        },
        { point: "Assessments can lag behind clinical practice." },
      ],
      tradeoffs: [
        "Rigor vs. speed: thorough assessment delays some innovations; provisional coverage speeds access but makes later removal politically hard.",
      ],
      risks: [
        {
          risk: "Political override of evidence.",
          mitigation: "Congressional veto requires both chambers; reports are public.",
        },
      ],
      precedent: ["NICE (UK, 1999); IQWiG (Germany, 2004); CADTH (Canada); HAS (France)."],
      dependsOn: ["create-uha"],
      sourceIds: [],
    },
    {
      id: "erisa-and-insurance-law",
      title: "Rewrite insurance & benefits law",
      summary:
        "Amend ERISA, the tax code, and the ACA so that employer plans and private insurance cannot duplicate UHP benefits, and so supplementary insurance is regulated.",
      legalVehicle:
        "Universal Health Act, Title IX: amends ERISA §514, IRC §§105, 106, 125, 4980H, and ACA Title I; ends COBRA for health coverage.",
      owner: "Congress; DOL EBSA; Treasury; state insurance commissioners",
      timeline: "Effective in stages with each enrollment wave",
      tasks: [
        {
          action:
            "Prohibit sale of insurance covering UHP benefits to UHP-eligible people (wave by wave). Penalty: a 100% excise tax on premiums for prohibited coverage.",
          owner: "Congress / Treasury",
          when: "Each wave",
        },
        {
          action:
            "Define 'supplementary coverage' (non-covered services only) and regulate it under state insurance law; require a minimum 85% medical loss ratio.",
          owner: "Congress / NAIC",
          when: "Month 12",
        },
        {
          action:
            "Repeal the employer mandate penalty (IRC §4980H) and the individual-market subsidies (IRC §36B) at Year 4.",
          owner: "Congress",
          when: "Year 4",
        },
        {
          action:
            "End the tax exclusion for employer health coverage (IRC §106) for UHP-covered services; keep it for supplementary dental, vision, and LTC coverage up to a cap.",
          owner: "Congress",
          when: "Each wave",
        },
        {
          action:
            "Amend ERISA preemption so states can regulate supplementary coverage and enforce UHP coordination of benefits.",
          owner: "Congress",
          when: "Month 0",
        },
        {
          action: "Repeal health COBRA continuation once everyone is eligible.",
          owner: "Congress",
          when: "Year 4",
        },
      ],
      cost: {
        recurring: 0,
        ledgerNote: `The revenue effect of ending the tax exclusion is the ledger line 'Federal income tax on former premium dollars': ${fmt(sourceLine("hhIncomeTax").after)}.`,
      },
      pros: [
        { point: "Prevents a duplicative tier from draining capacity." },
        {
          point:
            "Ending the exclusion removes a regressive subsidy that is worth more to high earners.",
        },
      ],
      cons: [
        {
          point:
            "The duplicative-coverage ban is a restriction on voluntary contracts; it will be litigated.",
        },
        { point: "Employers lose a flexible, tax-favored tool for recruiting." },
      ],
      tradeoffs: ["Equity of a single tier vs. liberty to buy more."],
      risks: [
        {
          risk: "Courts strike the duplicative-coverage ban.",
          mitigation:
            "Severability clause; the wait-time guarantee is the strongest legal defense, since Chaoulli hinged on unreasonable waits.",
        },
      ],
      precedent: ["Canada Health Act and provincial bans; Chaoulli v. Quebec (2005)."],
      dependsOn: [],
      sourceIds: ["cbo-exclusion"],
    },
    {
      id: "tax-legislation",
      title: "Set up the new taxes",
      summary: `IRS and Treasury implement the employer health payroll tax (${(MODEL.rates.employerTaxRate * 100).toFixed(1)}%), the household income-based premium (${(MODEL.rates.householdPremiumRate * 100).toFixed(1)}% above an exemption), and the top-end surtaxes, each phased in with the enrollment waves.`,
      legalVehicle: "Universal Health Act, Title VII; Internal Revenue Code new chapters.",
      owner: "Treasury, IRS, SSA",
      timeline: "Months 0–18",
      tasks: [
        {
          action: `Employer tax: add a line to Form 941 (quarterly payroll); exempt the first ${show("payrollExemption")} of annual payroll per employer (aggregated across controlled groups to prevent splitting).`,
          owner: "IRS",
          when: "Month 6–12",
        },
        {
          action:
            "Self-employed: apply the employer rate to net SE earnings above $50,000 via Schedule SE.",
          owner: "IRS",
          when: "Month 12",
        },
        {
          action: `Household premium: collected through wage withholding (new W-4 tables) and estimated payments; exemption $16,000 single, $24,000 couple, $28,000 for 3, ${show("exemptionFour")} for 4, plus $4,000 per additional member.`,
          owner: "IRS",
          when: "Month 9–15",
        },
        {
          action:
            "Top-end taxes: a 7% surtax on AGI above $1M; capital gains and qualified dividends taxed as ordinary income above $1M AGI; a 0.1% financial transactions tax collected by exchanges and brokers.",
          owner: "IRS / SEC",
          when: "Month 6–18",
        },
        {
          action:
            "Phase-in schedules: employer tax 40/60/80/100% of the full rate in Years 1–4; household premium 25/50/75/100%.",
          owner: "IRS",
          when: "Years 1–4",
        },
        {
          action: "Publish employer and household calculators.",
          owner: "Treasury",
          when: "Month 12",
        },
      ],
      cost: {
        ledgerNote: `New revenue (central, steady state): employer tax ${fmt(MODEL.side.employerTax)}, household premium ${fmt(MODEL.side.householdPremium)}, recaptured income tax ${fmt(sourceLine("hhIncomeTax").after)}, top-end ${fmt(sourceLine("hhTopSurtax").after)}; remaining general revenue need ${fmt(MODEL.gap)}. IRS implementation is about $1B, inside existing appropriations.`,
      },
      pros: [
        {
          point: "Uses existing payroll and withholding infrastructure: no new collection system.",
        },
        {
          point:
            "Visible, dedicated health taxes make the trade explicit: premiums are gone and this replaces them.",
        },
      ],
      cons: [
        { point: "Big new taxes are politically toxic even when they replace bigger premiums." },
        {
          point:
            "The $250k payroll exemption creates an incentive to split firms (anti-abuse rules needed).",
        },
        {
          point: "Top-end taxes are the most uncertain revenue: avoidance and behavioral response.",
        },
      ],
      tradeoffs: [
        "Progressivity vs. revenue stability: top-end income is volatile and falls sharply in market downturns.",
      ],
      risks: [
        {
          risk: `Top-end taxes raise less than estimated (costly case: ${F.topEndCostly} instead of ${F.topEnd}).`,
          mitigation:
            "An automatic trigger raises the household premium rate by 0.25 points if the trust-fund reserve falls below 1 month.",
        },
      ],
      precedent: [
        "Germany's statutory health insurance contribution: 14.6% of wages + an average 2.9% supplementary rate (2026), split employer/employee.",
        "France's CSG: a broad income tax earmarked for social security.",
      ],
      dependsOn: [],
      sourceIds: ["bea-wages", "irs-soi-2022"],
    },
    {
      id: "worker-transition",
      title: "Launch the displaced-worker program",
      summary: `About ${F.displaced} workers in insurance, billing, brokerage, PBMs, and related jobs will lose them over four years. The program pays wage replacement, wage insurance, training, and bridge pensions, and gives hiring preference at UHA and in health care.`,
      legalVehicle:
        "Universal Health Act, Title VIII; administered by DOL through state workforce agencies.",
      owner: "Department of Labor; state workforce boards",
      timeline: "Month 6 onward; benefits through Year 6",
      tasks: [
        {
          action:
            "Define eligibility: any worker whose job loss is certified as caused by the Act (modeled on Trade Adjustment Assistance certification).",
          owner: "DOL",
          when: "Month 6",
        },
        {
          action:
            "Benefits: wage replacement of 90% / 70% / 50% in Years 1–3 of unemployment (capped at $120k), 50% wage insurance for 2 years if reemployed at lower pay, $12,000 training voucher, and bridge pensions for workers 58+.",
          owner: "DOL",
          when: "Month 12",
        },
        {
          action:
            "Require insurers to give 12 months' notice of layoffs (beyond the WARN Act's 60 days) and pay retention bonuses for claims run-off staff.",
          owner: "DOL / Congress",
          when: "Month 0",
        },
        {
          action:
            "Fast-track retraining into shortage occupations: medical assistants, community health workers, care coordinators, coders for UHA, and nursing (with paid apprenticeships).",
          owner: "DOL / HRSA",
          when: "Month 12+",
        },
        {
          action:
            "Regional economic adjustment grants for insurer-headquarters cities (Hartford, Minnetonka, Louisville, Indianapolis, St. Louis).",
          owner: "Commerce EDA",
          when: "Year 1–4",
        },
      ],
      cost: {
        oneTime: oneTime("workers"),
        ledgerNote: `${fmt(oneTime("workers"))} total over Years 1–6 (see the workforce page), in the transition table. Not in the steady-state ledger.`,
      },
      pros: [
        { point: "Turns an accepted cost (job loss) into a managed transition." },
        {
          point: "Many displaced workers have health-system skills that are in shortage elsewhere.",
        },
      ],
      cons: [
        {
          point: "Wage losses for many displaced workers will be permanent despite the program",
          detail: "Displaced-worker research finds earnings 10–20% lower for years.",
        },
        { point: "Concentrated local economic shocks in a handful of cities." },
      ],
      tradeoffs: ["Generous benefits cost more but reduce political opposition and hardship."],
      risks: [
        {
          risk: "Training programs with weak placement.",
          mitigation: "Pay training providers partly on placement outcomes.",
        },
      ],
      precedent: [
        "Trade Adjustment Assistance; PERI (2018) proposed a similar program for Medicare for All.",
      ],
      dependsOn: [],
      sourceIds: ["peri-2018", "bls-oews-524114"],
    },
    {
      id: "data-privacy",
      title: "Set data governance & privacy rules",
      summary:
        "A single payer holds every American's claims history. Strict rules decide who can see it, for what purpose, and how it is protected.",
      legalVehicle: "Universal Health Act, Title I; HIPAA amendments; Privacy Act.",
      owner: "UHA Chief Privacy Officer; HHS OCR",
      timeline: "Months 0–18",
      tasks: [
        {
          action:
            "Prohibit use of UHP data for law enforcement or immigration enforcement without a judicial warrant.",
          owner: "Congress",
          when: "Drafting",
        },
        {
          action:
            "Create a research data enclave with de-identified data, approved projects only, and public audit logs.",
          owner: "UHA",
          when: "Year 1–2",
        },
        {
          action: "Give patients a portal showing who accessed their records.",
          owner: "UHA",
          when: "Year 2",
        },
        {
          action: "Require annual third-party security audits; publish results.",
          owner: "UHA / IG",
          when: "Annual",
        },
      ],
      cost: { recurring: 0.3, ledgerNote: "Inside UHP administration." },
      pros: [
        {
          point:
            "One national dataset enables research and fraud detection that is impossible with fragmented payers.",
        },
        { point: "Patients get a complete record across providers." },
      ],
      cons: [
        { point: "One large target for breaches." },
        {
          point:
            "Concerns about government access to sensitive health data (reproductive, mental health, substance use).",
        },
      ],
      tradeoffs: ["Research value vs. privacy."],
      risks: [
        {
          risk: "Breach of national claims data.",
          mitigation:
            "Segmented storage, encryption, zero-trust architecture, breach-notification law.",
        },
      ],
      precedent: ["Nordic national health registries; Taiwan's NHI research database."],
      dependsOn: ["create-uha"],
      sourceIds: [],
    },
  ],
}
