/** Paths for drugs & supply chain, geography, and workforce. */
import { path } from "./types"

export const SUPPLY_PATHS = [
  // ---- drug prices ----
  path({
    id: "drugs-negotiate",
    problemId: "drug-prices",
    title: "National negotiation for all drugs",
    summary:
      "One national body negotiates prices for every drug, using international prices and value assessments as benchmarks.",
    precedents: [
      {
        place: "U.S. Medicare negotiation (IRA)",
        note: "First negotiated prices took effect in 2026.",
        sourceIds: ["cms-negotiation"],
      },
      {
        place: "Germany (AMNOG)",
        note: "Free launch price for one year, then a negotiated price based on added benefit.",
      },
    ],
    how: {
      "drug-prices": {
        note: "National negotiation uses international prices and value assessments to obtain large savings and a uniform drug price across locations.",
        helps: ["heavy-care-users"],
      },
      "x-central-rationing": {
        note: "A national negotiating body uses value assessments as benchmarks for drug prices, placing those assessments within a national decision process.",
      },
      "innovation-slowdown": {
        note: "National price negotiation lowers manufacturer revenue, which may reduce some research and development.",
      },
      "x-price-control-exit": {
        note: "National price negotiation may lead manufacturers to delay drug launches.",
      },
    },
    mend: ["Link prices to added benefit so true innovation is still rewarded"],
    spawns: ["x-price-control-exit", "x-central-rationing"],
    worsens: ["innovation-slowdown"],
    costIds: ["nhe-prescriptionDrugs"],
    changes: [
      "Extend national negotiation to all drugs for all payers",
      "Use international prices and added-benefit assessments as benchmarks",
      "Apply an excise tax or exclusion if manufacturers refuse to negotiate",
    ],
  }),
  path({
    id: "drugs-reference",
    problemId: "drug-prices",
    title: "International reference pricing",
    summary: "Cap U.S. prices at the median (or lowest) of peer countries.",
    precedents: [
      { place: "Canada (PMPRB), Japan", note: "Use international reference baskets." },
      {
        place: "Canada",
        note: "In 2023, about 84% of Canadian patented-medicine sales were for drugs whose list prices exceeded the median in Canada's 11-country reference basket.",
        sourceIds: ["drugs-reference-patented-medicine-prices-2024"],
      },
    ],
    how: {
      "drug-prices": {
        note: "An automatic cap based on peer-country prices uses prices those countries have already negotiated to limit domestic drug prices.",
        helps: ["heavy-care-users"],
      },
      "x-price-control-exit": {
        note: "Linking domestic price caps to foreign prices may lead manufacturers to raise prices abroad or delay launches there.",
      },
      "t-uncertain-evidence": {
        note: "Reference pricing depends on foreign prices that exchange rates and confidential rebates make difficult to establish.",
      },
    },
    worsens: ["t-uncertain-evidence"],
    spawns: ["x-price-control-exit"],
    changes: [
      "Cap prices at the median of a basket of peer countries",
      "Require manufacturers to report foreign prices",
    ],
  }),
  path({
    id: "drugs-public-manufacture",
    problemId: "drug-prices",
    title: "Public manufacturing of off-patent drugs",
    summary:
      "A public or nonprofit manufacturer produces generics with high prices or shortages (e.g., insulin).",
    precedents: [
      {
        place: "California CalRx; Civica Rx",
        note: "State-branded insulin and nonprofit generics.",
      },
      {
        place: "California",
        note: "In October 2025, California announced CalRx insulin glargine would launch in January 2026 at a suggested retail price of no more than $55 for five pens.",
        sourceIds: ["drugs-public-manufacture-governor-of-california-2025"],
      },
    ],
    how: {
      "drug-prices": {
        note: "Public or nonprofit manufacturing directly lowers prices for targeted off-patent drugs such as insulin.",
      },
      shortages: {
        note: "Public or nonprofit production of drugs affected by shortages improves supply resilience.",
      },
      "t-limited-reach": {
        note: "Public or nonprofit manufacturing covers only off-patent drugs.",
      },
      "t-delayed-benefits": {
        note: "Establishing public drug manufacturing can be slow and costly.",
      },
    },
    worsens: ["t-limited-reach", "t-delayed-benefits"],
    solves: ["shortages"],
    costIds: ["insulin-cost"],
    changes: [
      "Fund a public or nonprofit manufacturer for off-patent drugs with high prices or shortages",
      "Guarantee volume purchases",
    ],
  }),

  // ---- patents ----
  path({
    id: "patents-reform",
    problemId: "patents",
    title: "Limit patent thickets and evergreening",
    summary:
      "Limit the number of patents asserted per drug, end exclusivity extensions for minor changes, and ban pay-for-delay deals.",
    precedents: [
      {
        place: "Europe",
        note: "Humira had far fewer patents in Europe; biosimilars entered years earlier.",
        sourceIds: ["imak-humira"],
      },
    ],
    how: {
      patents: {
        note: "Limiting asserted patents, exclusivity extensions for minor changes, and pay-for-delay deals brings generics and biosimilars to market earlier while retaining core patents and their innovation incentive.",
      },
      "innovation-slowdown": {
        note: "Limiting patents and exclusivity extensions may reduce rewards for incremental innovations such as new drug forms.",
      },
      "t-administrative-work": {
        note: "Patent limits and restrictions on exclusivity extensions require new capacity in patent offices and courts.",
      },
    },
    worsens: ["innovation-slowdown", "t-administrative-work"],
    changes: [
      "Limit the number of patents asserted per drug",
      "End exclusivity extensions for minor changes",
      "Ban pay-for-delay settlements",
    ],
  }),
  path({
    id: "patents-march-in",
    problemId: "patents",
    title: "Use government march-in and compulsory licensing",
    summary:
      "For publicly funded drugs or extreme prices, license patents to other manufacturers (28 U.S.C. §1498, Bayh-Dole march-in).",
    precedents: [
      { place: "Thailand, Brazil", note: "Compulsory licenses for HIV drugs." },
      {
        place: "Thailand",
        note: "A compulsory license granted in 2006 enabled Thailand to import 66,000 bottles of generic efavirenz at half the price offered by Merck.",
        sourceIds: ["patents-march-in-mpi-studies-on-intellect-2014"],
      },
    ],
    how: {
      patents: {
        note: "Licensing patents to other manufacturers targets extreme drug prices and publicly funded drugs. The possibility of licensing provides a strong bargaining threat even when rarely used.",
      },
      "innovation-slowdown": {
        note: "Licensing patents to other manufacturers weakens patent certainty for investors.",
      },
      "t-political-resistance": {
        note: "Government licensing of drug patents can lead to trade disputes with partners.",
      },
    },
    mend: ["Pay reasonable royalties"],
    worsens: ["innovation-slowdown", "t-political-resistance"],
    changes: [
      "Define march-in triggers for price and access",
      "Use 28 U.S.C. 1498 for government-use licenses",
      "Set royalty formulas",
    ],
  }),
  path({
    id: "patents-keep",
    problemId: "patents",
    role: "answers",
    title: "Keep the current patent system",
    summary: "Leave patents unchanged and control prices through negotiation instead.",
    precedents: [
      { place: "Most peer countries", note: "Similar patent law; lower prices from negotiation." },
      {
        place: "France",
        note: "In 2023, patented medicines sold in both France and Canada had a French-to-Canadian average list-price ratio of 0.69.",
        sourceIds: ["drugs-reference-patented-medicine-prices-2024"],
      },
    ],
    how: {
      patents: {
        note: "Leaving patents unchanged preserves innovation incentives and avoids trade disputes while relying on price negotiation instead. Patent thickets still delay generics and biosimilars.",
      },
      "drug-prices": {
        note: "Leaving patents unchanged keeps prices high until all patents expire.",
        hurts: ["heavy-care-users"],
      },
    },
    worsens: ["drug-prices"],
    complements: ["drugs-negotiate"],
    changes: ["No patent-law changes; rely on negotiation"],
  }),

  // ---- R&D ----
  path({
    id: "rd-public-fund",
    problemId: "rd-incentives",
    title: "Expand public R&D funding",
    summary:
      "Increase NIH and public trial funding, especially for late-stage trials, so innovation relies less on high prices.",
    precedents: [
      {
        place: "U.S. NIH, BARDA",
        note: "Public funding contributed to nearly every new drug approved 2010–2016.",
      },
      {
        place: "United States",
        note: "A 2018 study linked NIH-funded research to all 210 new drugs approved in 2010–2016, with associated NIH project costs exceeding $100 billion.",
        sourceIds: ["rd-public-fund-proceedings-of-the-natio-2018"],
      },
    ],
    how: {
      "rd-incentives": {
        note: "Expanded public research and trial funding, especially for late-stage trials, offsets lost revenue and reduces reliance on high prices while allowing neglected diseases to receive funding.",
      },
      "t-higher-spending": { note: "Expanded public research and trial funding costs taxpayers." },
      "x-public-rd-priorities": {
        note: "Expanded public research funding puts the selection of research priorities in government hands.",
      },
    },
    worsens: ["t-higher-spending"],
    spawns: ["x-public-rd-priorities"],
    costIds: ["pharma-rd", "nhe-research"],
    changes: [
      "Increase NIH and late-stage trial funding",
      "Create a public clinical-trial network",
    ],
  }),
  path({
    id: "rd-prizes",
    problemId: "rd-incentives",
    title: "Prize funds and advance market commitments",
    summary:
      "Pay large prizes or guaranteed purchases for drugs meeting set goals (e.g., new antibiotics), then sell at low prices.",
    precedents: [
      {
        place: "UK antibiotic subscription model (2022)",
        note: "Pays a fixed annual fee for new antibiotics regardless of use.",
      },
      {
        place: "England, United Kingdom",
        note: "In 2022, NHS antibiotic subscription contracts offered up to £10 million a year for up to 10 years, regardless of prescribing volume.",
        sourceIds: ["rd-prizes-nhs-england-2022"],
      },
    ],
    how: {
      "rd-incentives": {
        note: "Prizes or guaranteed purchases reward drugs meeting specified goals without requiring high selling prices, including in neglected areas such as antibiotics.",
      },
      "drug-prices": {
        note: "Prizes or guaranteed purchases pay for innovation so qualifying drugs can then be sold at low prices.",
      },
      "t-uncertain-evidence": {
        note: "Prize funds require judgments about reward sizes that are difficult to set correctly. Prize funds and guaranteed purchases remain untested at large scale.",
        hurts: ["taxpayers"],
      },
      "x-public-rd-priorities": {
        note: "Government defines which drug-development goals qualify for prizes or guaranteed purchases.",
      },
    },
    worsens: ["t-uncertain-evidence"],
    solves: ["drug-prices"],
    spawns: ["x-public-rd-priorities"],
    changes: [
      "Create a prize fund for set goals",
      "Set advance market commitments for antibiotics",
    ],
  }),
  path({
    id: "rd-value-pricing",
    problemId: "rd-incentives",
    title: "Value-based prices that reward real innovation",
    summary:
      "Pay high prices only for drugs with large added benefit; pay little for me-too drugs.",
    precedents: [
      { place: "Germany (AMNOG), France", note: "Prices tied to added-benefit rating." },
      {
        place: "Germany",
        note: "A 2024 IQWiG analysis found that prices fell in 18 of 23 orphan-drug cases after full added-benefit assessment and subsequent price negotiations.",
        sourceIds: ["rd-value-pricing-institute-for-quality-an-2024"],
      },
    ],
    how: {
      "rd-incentives": {
        note: "Paying more for large added benefits directs research toward bigger breakthroughs while spending less on me-too drugs.",
        helps: ["drug-device-makers"],
      },
      "x-central-rationing": {
        note: "Drug pricing depends on assessments of added benefit, with disputes over how that value should be measured.",
      },
      "drug-prices": {
        note: "Paying little for me-too drugs saves money while reserving high prices for drugs with large added benefits.",
      },
      "t-administrative-work": {
        note: "Basing drug prices on added benefit requires capacity to assess that benefit.",
      },
      "t-uncertain-evidence": {
        note: "Basing drug prices on added benefit leads to disputes over how value should be measured.",
      },
    },
    worsens: ["t-administrative-work", "t-uncertain-evidence"],
    solves: ["drug-prices"],
    spawns: ["x-central-rationing"],
    complements: ["drugs-negotiate"],
    changes: [
      "Create a health-technology-assessment agency",
      "Tie negotiated prices to added-benefit ratings",
    ],
  }),

  // ---- shortages ----
  path({
    id: "shortages-pay-reliability",
    problemId: "shortages",
    title: "Pay more for reliable supply",
    summary:
      "Pay a premium to manufacturers with redundant, quality-rated supply chains; long-term contracts with minimum volumes.",
    precedents: [
      { place: "Civica Rx", note: "Long-term contracts with hospitals for essential generics." },
      {
        place: "United States",
        note: "In December 2024, Civica's hospital contracting model served member systems comprising about 1,400 hospitals and over 30% of licensed U.S. hospital beds.",
        sourceIds: ["shortages-pay-reliability-civica-rx-2024"],
      },
    ],
    how: {
      shortages: {
        note: "Premiums and long-term contracts with minimum volumes address prices too low to sustain production and reward quality-rated, redundant supply chains.",
      },
      "t-higher-spending": {
        note: "Premiums for reliable manufacturers and long-term supply contracts raise generic drug prices.",
        hurts: ["insurers"],
      },
      "t-administrative-work": {
        note: "Paying for reliable supply requires supplier reliability ratings, which are new and complex.",
      },
    },
    worsens: ["t-higher-spending", "t-administrative-work"],
    costIds: ["hosp-drugs"],
    changes: [
      "Pay premiums for redundant, quality-rated supply chains",
      "Use long-term contracts with minimum volumes",
    ],
  }),
  path({
    id: "shortages-stockpile",
    problemId: "shortages",
    title: "National stockpile and onshore production",
    summary: "Keep buffer stocks of essential drugs and fund domestic manufacturing.",
    precedents: [
      {
        place: "Strategic National Stockpile",
        note: "Exists mostly for emergencies, not routine shortages.",
      },
      {
        place: "United States",
        note: "In 2020, HHS awarded nearly $2.9 billion in contracts to supply about 198,000 ventilators for the Strategic National Stockpile.",
        sourceIds: ["shortages-stockpile-hhs-office-of-inspector--2022"],
      },
    ],
    how: {
      shortages: {
        note: "Buffer stocks cushion short disruptions, while domestic manufacturing reduces dependence on a few foreign plants.",
      },
      "t-higher-spending": {
        note: "Drug buffer stocks are expensive, and expiring drugs must be rotated.",
      },
      "t-delayed-benefits": {
        note: "Funding domestic drug manufacturing involves a slow and costly onshoring process.",
      },
    },
    worsens: ["t-higher-spending", "t-delayed-benefits"],
    complements: ["drugs-public-manufacture"],
    changes: [
      "Maintain buffer stocks of essential drugs",
      "Fund domestic production of active ingredients",
    ],
  }),

  // ---- pharmacy deserts ----
  path({
    id: "pharmacy-fee",
    problemId: "pharmacy-deserts",
    title: "Fair dispensing fees and support for rural pharmacies",
    summary:
      "Pay pharmacies a transparent dispensing fee covering costs, with extra payments in underserved areas.",
    precedents: [
      { place: "Canadian provinces", note: "Set dispensing fees publicly." },
      {
        place: "Ontario, Canada",
        note: "In 2021–2022, Ontario's public drug plan had a standard dispensing fee of C$8.83 per prescription, with higher fees up to C$13.25 for rural pharmacies; long-term care residents were covered by a separate capitation model.",
        sourceIds: ["pharmacy-fee-patented-medicine-prices-2024"],
      },
    ],
    how: {
      "pharmacy-deserts": {
        note: "Transparent dispensing fees covering costs, with extra payments in underserved areas, help rural and independent pharmacies stay open and replace opaque pharmacy benefit manager reimbursement.",
        helps: ["local-pharmacies"],
      },
      "t-higher-spending": {
        note: "Cost-covering dispensing fees and additional underserved-area payments raise dispensing costs.",
      },
      "t-administrative-work": {
        note: "Cost-covering dispensing fees require regular updates to fee levels.",
      },
    },
    worsens: ["t-higher-spending", "t-administrative-work"],
    costIds: ["pharmacy-payroll"],
    complements: ["pbm-public", "pbm-regulate"],
    changes: ["Set a transparent dispensing fee covering costs", "Add rural pharmacy payments"],
  }),
  path({
    id: "pharmacy-mail-telehealth",
    problemId: "pharmacy-deserts",
    title: "Mail-order and telepharmacy",
    summary: "Allow remote pharmacist supervision and expand mail delivery.",
    precedents: [
      { place: "North Dakota", note: "Telepharmacy since 2001 restored service to rural towns." },
      {
        place: "North Dakota, United States",
        note: "A 2015–2016 survey covered North Dakota's telepharmacy network of 24 remote community pharmacy sites and 14 central sites.",
        sourceIds: ["pharmacy-mail-telehealth-journal-of-the-american--2017"],
      },
    ],
    how: {
      "pharmacy-deserts": {
        note: "Remote pharmacist supervision and mail delivery can restore pharmacy access in towns without a pharmacist and are cheap and quick to expand.",
      },
      "t-limited-reach": {
        note: "Mail delivery and remote pharmacist supervision are poorly suited to urgent medications or patients needing counseling.",
        hurts: ["local-pharmacies"],
      },
      safety: { note: "Mail delivery can be unreliable for temperature-sensitive drugs." },
    },
    worsens: ["t-limited-reach", "safety"],
    changes: ["Allow remote pharmacist supervision in all states", "Cover mail delivery"],
  }),

  // ---- rural hospitals ----
  path({
    id: "rural-global-budget",
    problemId: "rural-hospitals",
    title: "Global budgets for rural hospitals",
    summary:
      "Pay rural hospitals a fixed annual budget instead of per service, so low volume does not cause closure.",
    precedents: [
      {
        place: "Pennsylvania Rural Health Model",
        note: "Global budgets for rural hospitals since 2019.",
      },
      {
        place: "Pennsylvania, United States",
        note: "In 2021, 18 of Pennsylvania's 65 eligible hospitals participated in the rural global-budget model, covering about 125,000 Medicare patients.",
        sourceIds: ["rural-global-budget-centers-for-medicare-med-2023"],
      },
    ],
    how: {
      "rural-hospitals": {
        note: "Fixed annual hospital budgets provide stable funding despite low service volume, allowing services to be redesigned for community needs and ending dependence on a few commercial payers.",
        helps: ["clinicians"],
      },
      "x-budget-rationing": {
        note: "Fixed annual rural hospital budgets may fail to adjust to changing needs.",
      },
      safety: {
        note: "Keeping low-volume rural hospitals open can still leave lower quality for some procedures.",
        hurts: ["taxpayers"],
      },
    },
    worsens: ["safety"],
    requires: ["global-budgets"],
    spawns: ["x-budget-rationing"],
    changes: ["Give rural hospitals fixed annual budgets", "Adjust for service changes"],
  }),
  path({
    id: "rural-convert",
    problemId: "rural-hospitals",
    title: "Convert to emergency and outpatient centers",
    summary:
      "Let rural hospitals drop inpatient beds and become Rural Emergency Hospitals with transfer agreements.",
    precedents: [
      {
        place: "U.S. Rural Emergency Hospital (2023)",
        note: "About 40–50 hospitals had converted by late 2025.",
      },
      {
        place: "United States",
        note: "In 2025, Medicare paid each Rural Emergency Hospital an additional $285,625.90 per month after sequestration to support its facilities.",
        sourceIds: ["rural-convert-centers-for-medicare-med-2025"],
      },
    ],
    how: {
      "rural-hospitals": {
        note: "Converting rural hospitals to emergency and outpatient centers keeps emergency care open at lower cost than maintaining full inpatient services.",
        helps: ["providers"],
      },
      "maternity-deserts": {
        note: "Dropping inpatient beds means patients must travel farther for births, with transfer agreements connecting the emergency center to hospital care.",
      },
      transport: {
        note: "Removing rural inpatient beds makes travel longer for inpatient care and births.",
      },
      "transition-disruption": {
        note: "Conversion to emergency and outpatient centers leaves communities with lost jobs and local identity.",
      },
    },
    mend: ["Fund transport"],
    worsens: ["maternity-deserts", "transport", "transition-disruption"],
    complements: ["transport-fund"],
    changes: [
      "Expand Rural Emergency Hospital eligibility",
      "Fund transfer agreements and transport",
    ],
  }),

  // ---- maternity deserts ----
  path({
    id: "maternity-standby",
    problemId: "maternity-deserts",
    title: "Standby payments to keep labor units open",
    summary: "Pay rural labor and delivery units a fixed amount for readiness, not per birth.",
    precedents: [
      { place: "Norway, Sweden", note: "Maternity units funded by budget, not volume." },
      {
        place: "Germany",
        note: "Germany provided €120 million in additional maternity funding independent of service volume in each of 2023 and 2024.",
        sourceIds: ["maternity-standby-german-federal-ministry--2024"],
      },
    ],
    how: {
      "maternity-deserts": {
        note: "Paying labor units for readiness rather than per birth keeps births local and reduces risky long drives during labor.",
      },
      safety: {
        note: "Keeping labor units ready locally reduces risky long drives during labor. Standby payments also keep low-volume units open, where outcomes may be worse.",
      },
      "t-higher-spending": {
        note: "Paying labor units for readiness rather than per birth is expensive per birth.",
      },
      transport: {
        note: "Standby payments keep births local, reducing the need for long drives during labor.",
      },
    },
    mend: ["Link standby funding to quality requirements and transfer agreements"],
    worsens: ["safety", "t-higher-spending"],
    solves: ["transport", "safety"],
    changes: ["Pay rural labor units a fixed readiness payment"],
  }),
  path({
    id: "maternity-midwives",
    problemId: "maternity-deserts",
    title: "Expand midwives and birth centers",
    summary:
      "License and pay certified midwives and freestanding birth centers, with transfer agreements.",
    precedents: [
      { place: "UK, Netherlands", note: "Midwives lead most low-risk births." },
      {
        place: "United Kingdom and four other countries",
        note: "A 2024 review of trials in five countries, including the UK, found midwife continuity care likely reduced caesarean births from 16% to 15%.",
        sourceIds: ["maternity-midwives-cochrane-2024"],
      },
    ],
    how: {
      "maternity-deserts": {
        note: "Licensing and paying certified midwives and freestanding birth centers adds capacity in maternity deserts at lower cost per birth.",
        helps: ["clinicians"],
      },
      "x-scope-quality": {
        note: "Expanding certified midwives and freestanding birth centers raises safety concerns among physician groups.",
      },
      "t-administrative-work": {
        note: "Midwives and freestanding birth centers need fast hospital transfers when complications occur.",
        hurts: ["clinicians"],
      },
    },
    mend: ["Require collaboration agreements and fast transfer to hospital care"],
    worsens: ["t-administrative-work"],
    spawns: ["x-scope-quality"],
    changes: [
      "License certified midwives in all states",
      "Cover birth centers",
      "Require transfer agreements",
    ],
  }),

  // ---- shortage areas ----
  path({
    id: "shortage-service",
    problemId: "shortage-areas",
    title: "Loan forgiveness and service obligations",
    summary:
      "Expand the National Health Service Corps: free training in exchange for years of service in shortage areas.",
    precedents: [
      {
        place: "Japan (Jichi Medical University)",
        note: "Free medical school in exchange for rural service.",
      },
      {
        place: "Japan",
        note: "A 2021 study found 98% of Jichi Medical University graduates remained in their rural-service scholarship contracts five years after graduation.",
        sourceIds: ["shortage-service-human-resources-for-heal-2021"],
      },
    ],
    how: {
      "shortage-areas": {
        note: "Free training in exchange for service places clinicians in underserved areas and removes debt that pushes graduates toward high-paying specialties.",
      },
      "training-debt": {
        note: "Free training in exchange for service removes debt that pushes graduates toward high-paying specialties.",
      },
      "t-limited-reach": {
        note: "Training in exchange for service does not ensure lasting staffing because many clinicians leave when their service ends.",
      },
      "t-higher-spending": {
        note: "Free training tied to service is costly per clinician placed.",
      },
    },
    worsens: ["t-limited-reach", "t-higher-spending"],
    solves: ["training-debt"],
    costIds: ["resident-salary"],
    changes: [
      "Expand National Health Service Corps",
      "Offer free training for service commitments",
    ],
  }),
  path({
    id: "shortage-pay",
    problemId: "shortage-areas",
    title: "Higher pay in shortage areas",
    summary: "Add a bonus to fees in shortage areas.",
    precedents: [
      { place: "U.S. Medicare HPSA bonus", note: "10% bonus in shortage areas." },
      {
        place: "United States",
        note: "In 2026, Medicare's shortage-area program provides eligible physicians a 10% quarterly bonus on payments for professional services.",
        sourceIds: ["shortage-pay-centers-for-medicare-med-2026"],
      },
    ],
    how: {
      "shortage-areas": {
        note: "Adding bonuses to the existing fee schedule in shortage areas is a simple change that can be implemented quickly.",
        helps: ["clinicians"],
      },
      "t-limited-reach": {
        note: "Fee bonuses alone often do not move clinicians because schools and spouses' jobs also matter.",
        hurts: ["taxpayers"],
      },
      "t-imperfect-targeting": {
        note: "Bonuses for shortage-area practice can go to providers already working there.",
      },
    },
    worsens: ["t-limited-reach", "t-imperfect-targeting"],
    changes: ["Raise the shortage-area fee bonus"],
  }),
  path({
    id: "shortage-telehealth",
    problemId: "shortage-areas",
    title: "Permanent telehealth coverage",
    summary:
      "Cover telehealth at parity across state lines with a national license for telehealth.",
    precedents: [
      {
        place: "U.S. pandemic waivers",
        note: "Telehealth use rose sharply and stayed above pre-pandemic levels.",
      },
      {
        place: "United States",
        note: "Medicare fee-for-service telehealth visits rose from about 840,000 in 2019 to 52.7 million in 2020 during pandemic coverage waivers.",
        sourceIds: ["shortage-telehealth-centers-for-medicare-med-2021"],
      },
    ],
    how: {
      "shortage-areas": {
        note: "Covering telehealth across state lines with a national telehealth license offers quick, low-cost access to clinicians.",
      },
      "mental-health-access": {
        note: "Telehealth coverage across state lines offers quick, low-cost access and works especially well for mental health care.",
      },
      "t-limited-reach": {
        note: "Telehealth cannot substitute for hands-on care. Telehealth expansion is limited by the lack of broadband in many rural areas.",
      },
      fraud: { note: "Expanded telehealth coverage carries a risk of fraud." },
    },
    mend: ["Fund broadband and local telehealth access points"],
    worsens: ["t-limited-reach", "fraud"],
    solves: ["mental-health-access"],
    changes: ["Cover telehealth at parity permanently", "Create interstate telehealth licensing"],
  }),

  // ---- transport ----
  path({
    id: "transport-fund",
    problemId: "transport",
    title: "Cover ambulance and non-emergency transport",
    summary:
      "Cover ambulances (ending surprise bills for ground ambulances) and rides to care for everyone, not only Medicaid.",
    precedents: [
      { place: "Medicaid NEMT", note: "Medicaid covers rides to appointments." },
      {
        place: "United States",
        note: "A 2016 KFF brief cited estimated annual Medicaid non-emergency transport spending of $3 billion, less than 1% of total Medicaid expenditures.",
        sourceIds: ["transport-fund-kff-2016"],
      },
    ],
    how: {
      transport: {
        note: "Covering rides and ambulances for everyone reduces missed appointments and ends surprise ground ambulance bills.",
      },
      "surprise-bills": { note: "Covering ground ambulances ends surprise bills for these trips." },
      fraud: {
        note: "Universal ride coverage creates a risk of fraudulent claims for fake rides.",
      },
      "t-higher-spending": { note: "Covering rides and ambulances for everyone adds costs." },
      safety: { note: "Covered rides depend on brokers whose reliability records are poor." },
    },
    worsens: ["fraud", "t-higher-spending", "safety"],
    solves: ["surprise-bills"],
    changes: ["Cover ground ambulance and non-emergency rides for everyone"],
  }),
  path({
    id: "transport-public-ems",
    problemId: "transport",
    title: "Publicly funded EMS as essential service",
    summary: "Fund ambulances by budget like fire departments, not per trip.",
    precedents: [
      { place: "Many European countries", note: "Ambulances free at use." },
      {
        place: "England, United Kingdom",
        note: "England's NHS ambulance services handled 760,589 incidents in December 2023, including 380,793 transports to emergency departments.",
        sourceIds: ["transport-public-ems-nhs-england-2024"],
      },
    ],
    how: {
      transport: {
        note: "Budget funding for ambulances ends patient ambulance bills and allows deployment according to need rather than payer.",
      },
      "t-higher-spending": { note: "Budget funding for ambulances shifts costs to local budgets." },
      "t-income-loss": {
        note: "Budget-funded ambulances reduce business for private ambulance companies.",
      },
    },
    mend: ["Buy out or contract with private ambulance companies"],
    worsens: ["t-higher-spending", "t-income-loss"],
    requires: ["global-budgets"],
    changes: [
      "Fund EMS by budget like fire departments",
      "Ban ambulance bills for covered services",
    ],
  }),

  // ---- physician shortage ----
  path({
    id: "phys-residency",
    problemId: "physician-shortage",
    title: "Fund more residency slots",
    summary:
      "Fund more residency positions, prioritizing primary care, psychiatry, and rural sites.",
    precedents: [
      {
        place: "U.S. 2021 & 2023 laws",
        note: "Added 1,000 Medicare-funded slots (2021, phased in at up to 200 a year) plus 200 more, half for psychiatry (2023).",
      },
      {
        place: "United States",
        note: "In 2023, CMS awarded 200 new Medicare-funded residency positions to 100 teaching hospitals, with the positions effective July 1.",
        sourceIds: ["phys-residency-centers-for-medicare-med-2023"],
      },
    ],
    how: {
      "physician-shortage": {
        note: "Funding additional residency positions directly increases physician supply, with priority for primary care, psychiatry, and rural sites. Residents tend to stay near where they train.",
        helps: ["health-students"],
      },
      "wait-times": {
        note: "Additional residency positions increase physician supply, including primary care, psychiatry, and rural sites, to address capacity behind waits.",
      },
      "t-delayed-benefits": {
        note: "Additional residency positions take years before they yield more practicing physicians.",
      },
      "t-higher-spending": { note: "Funding additional residency positions is costly per slot." },
    },
    worsens: ["t-delayed-benefits", "t-higher-spending"],
    costIds: ["residency-slot-cost"],
    solves: ["wait-times"],
    changes: ["Fund more residency slots, prioritizing primary care and rural sites"],
  }),
  path({
    id: "phys-pay-primary",
    problemId: "physician-shortage",
    title: "Raise primary care pay relative to specialties",
    summary: "Shift fee-schedule dollars from procedures to primary care.",
    precedents: [
      { place: "UK, Netherlands", note: "GPs earn closer to specialists than in the U.S." },
      {
        place: "Germany",
        note: "In 2021 or the nearest available year, self-employed specialists in Germany earned about 12% more than self-employed general practitioners.",
        sourceIds: ["phys-pay-primary-oecd-2023"],
      },
    ],
    how: {
      "physician-shortage": {
        note: "Shifting fee-schedule payments from procedures to primary care encourages more students to choose primary care and rewards care most linked to better outcomes.",
      },
      outcomes: {
        note: "Shifting payments toward primary care rewards the care most linked to better outcomes.",
      },
      "t-income-loss": {
        note: "Shifting fee-schedule dollars from procedures to primary care reduces specialist income.",
      },
      "t-delayed-benefits": {
        note: "Changing payments toward primary care takes years to change the workforce mix.",
      },
    },
    mend: ["Phase in"],
    worsens: ["t-income-loss", "t-delayed-benefits"],
    solves: ["outcomes"],
    costIds: ["physician-pay-gap"],
    changes: [
      "Shift fee-schedule dollars from procedures to primary care",
      "Change the fee-update committee to include more primary care",
    ],
  }),
  path({
    id: "phys-foreign",
    problemId: "physician-shortage",
    title: "Easier licensing for foreign-trained physicians",
    summary:
      "Let experienced international physicians practice without repeating residency, under supervised pathways.",
    precedents: [
      {
        place: "Tennessee (2023) and other states",
        note: "Alternative licensing for international physicians.",
      },
      {
        place: "Tennessee, United States",
        note: "In March 2026, Tennessee reported two approved foreign-training physician licenses and one pending approval under its alternative licensing pathway.",
        sourceIds: ["phys-foreign-tennessee-general-assemb-2026"],
      },
    ],
    how: {
      "physician-shortage": {
        note: "Supervised pathways that avoid repeating residency quickly increase supply by allowing experienced international physicians to practice.",
        helps: ["heavy-care-users"],
      },
      safety: {
        note: "Allowing international physicians to practice without repeating residency raises quality assurance concerns.",
      },
    },
    worsens: ["safety"],
    changes: ["Create supervised licensing pathways for experienced foreign physicians"],
  }),

  // ---- training debt ----
  path({
    id: "debt-free-school",
    problemId: "training-debt",
    title: "Tuition-free medical and nursing school",
    summary: "Public funding covers tuition, possibly in exchange for service.",
    precedents: [
      { place: "Most European countries", note: "Tuition-free or low-cost medical school." },
      {
        place: "Denmark",
        note: "A 2020 Commonwealth Fund profile reported that Denmark's four public medical schools charged no tuition for their six-year medical programs.",
        sourceIds: ["debt-free-school-commonwealth-fund-2020"],
      },
    ],
    how: {
      "training-debt": {
        note: "Publicly funded tuition lowers pressure to choose high-paying specialties and allows a more diverse group of students to afford medical education.",
      },
      "t-higher-spending": { note: "Public funding of medical tuition is costly." },
      "t-imperfect-targeting": {
        note: "Publicly funded tuition also benefits graduates who would earn high incomes anyway.",
      },
    },
    mend: ["Tie free tuition to service obligations"],
    worsens: ["t-higher-spending", "t-imperfect-targeting"],
    complements: ["shortage-service"],
    changes: ["Fund tuition for medical and nursing school", "Tie to service obligations"],
  }),
  path({
    id: "debt-shorter-training",
    problemId: "training-debt",
    title: "Shorter training: combined undergrad/medical programs",
    summary: "Six-year programs straight from high school, as in most countries.",
    precedents: [
      { place: "UK, Europe", note: "Medical school directly after secondary school." },
      {
        place: "New York, United States",
        note: "A 2024 NYU study found three-year medical graduates averaged 84% on preclerkship exams, compared with 83% for four-year graduates.",
        sourceIds: ["debt-shorter-training-nyu-langone-health-2024"],
      },
    ],
    how: {
      "training-debt": {
        note: "Programs beginning directly after high school reduce tuition by shortening training and allow physicians to start practicing earlier.",
      },
      "physician-shortage": {
        note: "Shorter programs beginning after high school allow physicians to start practicing earlier.",
      },
      "t-uncertain-evidence": {
        note: "Programs starting after high school require less mature students to choose their careers earlier.",
      },
      "t-political-resistance": {
        note: "Shorter medical programs beginning after high school require changes to accreditation.",
      },
    },
    worsens: ["t-uncertain-evidence", "t-political-resistance"],
    solves: ["physician-shortage"],
    changes: ["Accredit six-year combined programs"],
  }),

  // ---- nursing shortage ----
  path({
    id: "nurse-staffing-ratios",
    problemId: "nursing-shortage",
    title: "Minimum nurse staffing ratios",
    summary: "Set enforceable ratios of nurses to patients.",
    precedents: [
      {
        place: "California (2004)",
        note: "Ratios linked to lower nurse burnout and lower mortality.",
      },
      {
        place: "California, United States",
        note: "In 2006, two years after California's staffing mandate, hospital nurses cared for one fewer patient on average than nurses in New Jersey and Pennsylvania.",
        sourceIds: ["nurse-staffing-ratios-health-services-research-2010"],
      },
    ],
    how: {
      "nursing-shortage": {
        note: "Enforceable nurse-to-patient ratios make care safer and reduce nurse burnout.",
      },
      safety: { note: "Enforceable nurse-to-patient ratios make care safer." },
      "x-staffing-mandate-cost": {
        note: "Enforceable nurse staffing ratios are costly and may force hospitals to close beds if they cannot hire enough nurses.",
      },
    },
    mend: ["Fund staffing in rates; phase in"],
    solves: ["safety"],
    spawns: ["x-staffing-mandate-cost"],
    changes: ["Set nurse-to-patient ratios by unit", "Fund ratios through rates"],
  }),
  path({
    id: "nurse-pipeline",
    problemId: "nursing-shortage",
    title: "Expand nursing schools and faculty pay",
    summary:
      "Fund faculty salaries and clinical placements; schools turn away qualified applicants today.",
    precedents: [
      {
        place: "HRSA nursing programs",
        sourceIds: ["hrsa-nursing"],
        note: "Projections show RN and LPN shortages.",
      },
    ],
    how: {
      "nursing-shortage": {
        note: "Funding faculty salaries and clinical placements expands the long-term nursing supply by allowing schools to admit qualified applicants they currently turn away. New nurses can still leave if working conditions remain poor.",
        helps: ["health-students", "providers"],
      },
      "t-delayed-benefits": {
        note: "Expanded nursing education takes years to increase the workforce.",
        hurts: ["taxpayers"],
      },
    },
    worsens: ["t-delayed-benefits"],
    changes: ["Fund nursing faculty salaries", "Fund clinical placements"],
  }),

  // ---- burnout ----
  path({
    id: "burnout-simplify",
    problemId: "burnout-admin",
    title: "Cut documentation and billing burden",
    summary: "Simplify billing codes and documentation rules; fewer quality-reporting programs.",
    precedents: [
      { place: "Taiwan, Canada", note: "Simpler billing reduces physician paperwork." },
      {
        place: "Ontario, Canada",
        note: "A 2011 study estimated annual costs of dealing with payers at US$22,205 per physician in Ontario, versus US$82,975 in the United States.",
        sourceIds: ["burnout-simplify-health-affairs-2011"],
      },
    ],
    how: {
      "burnout-admin": {
        note: "Simpler billing codes, documentation rules, and fewer quality-reporting programs leave more time for patients and reduce the need for billing staff.",
      },
      "admin-cost": {
        note: "Simplifying billing and documentation rules reduces the need for billing staff.",
      },
      "t-reduced-data": {
        note: "Fewer documentation and quality-reporting requirements leave less data for audits and research.",
      },
      "t-dependent-reforms": {
        note: "Simplifying billing and documentation depends on payer consolidation.",
      },
    },
    worsens: ["t-reduced-data", "t-dependent-reforms"],
    solves: ["admin-cost"],
    requires: ["single-payer"],
    changes: ["Simplify billing codes and documentation rules", "Cut quality-reporting programs"],
  }),
  path({
    id: "burnout-scribes",
    problemId: "burnout-admin",
    title: "Fund scribes and AI documentation",
    summary: "Pay for scribes or ambient AI documentation tools.",
    precedents: [
      { place: "U.S. health systems", note: "Early studies show reduced documentation time." },
      {
        place: "Los Angeles, United States",
        note: "A 2025 randomized trial found Nabla AI scribes reduced physician note-writing time by 9.5% versus usual care, while DAX showed no significant change.",
        sourceIds: ["burnout-scribes-nejm-ai-2025"],
      },
    ],
    how: {
      "burnout-admin": {
        note: "Scribes or ambient documentation tools can be deployed quickly to shorten documentation time. They leave the underlying documentation rules in place.",
      },
      privacy: {
        note: "Ambient documentation records visits, raising privacy concerns.",
        hurts: ["insurance-billing-workers"],
      },
      safety: {
        note: "Artificial intelligence documentation can produce notes containing errors.",
      },
    },
    worsens: ["privacy", "safety"],
    changes: ["Pay for scribes or AI documentation tools"],
  }),

  // ---- scope of practice ----
  path({
    id: "scope-expand",
    problemId: "scope-of-practice",
    title: "Full practice authority for NPs, PAs, pharmacists, dental therapists",
    summary: "Let each profession practice to the full extent of its training.",
    precedents: [
      { place: "About half of U.S. states", note: "Grant NPs full practice authority." },
      {
        place: "United States",
        note: "As of March 2023, 27 U.S. states granted nurse practitioners full, independent practice authority.",
        sourceIds: ["scope-expand-association-of-american--2024"],
      },
    ],
    how: {
      "scope-of-practice": {
        note: "Allowing each profession to practice to the full extent of its training adds capacity quickly at lower cost.",
      },
      "physician-shortage": {
        note: "Letting other professions use their full training adds care capacity quickly.",
      },
      "shortage-areas": {
        note: "Allowing professions to use their full training adds care capacity quickly at lower cost.",
      },
      "wait-times": {
        note: "Expanding practice to the full extent of training quickly adds capacity for care.",
      },
      "x-scope-quality": {
        note: "Expanding professions' practice raises quality concerns among physician groups, and some studies find more prescribing and referrals.",
      },
    },
    spawns: ["x-scope-quality"],
    solves: ["physician-shortage", "shortage-areas", "wait-times"],
    changes: [
      "Grant full practice authority to NPs, PAs, pharmacists, dental therapists nationally",
    ],
  }),
  path({
    id: "scope-team",
    problemId: "scope-of-practice",
    title: "Team-based care with physician oversight",
    summary: "Expand roles within teams under physician supervision.",
    precedents: [
      { place: "Kaiser Permanente, VA", note: "Team-based models." },
      {
        place: "United States",
        note: "In 2014, the VA reported a 12% decline in acute hospital admissions associated with implementation of its Patient Aligned Care Teams.",
        sourceIds: ["scope-team-u-s-department-of-vetera-2014"],
      },
    ],
    how: {
      "scope-of-practice": {
        note: "Expanding roles within teams adds capacity while retaining physician oversight.",
        helps: ["clinicians"],
      },
      "wait-times": {
        note: "Expanded roles within physician-supervised teams add capacity for care.",
      },
      "t-higher-spending": {
        note: "Physician-supervised team roles involve supervision fees that add costs.",
      },
      "t-limited-reach": {
        note: "Expanded team roles still depend on physician supervision, which can be a bottleneck in rural areas.",
      },
    },
    mend: ["Remote supervision"],
    worsens: ["t-higher-spending", "t-limited-reach"],
    solves: ["wait-times"],
    changes: ["Expand roles within physician-supervised teams", "Allow remote supervision"],
  }),
]
