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
    pros: ["Large savings", "One price everywhere"],
    cons: ["Lower revenue may reduce some R&D", "Manufacturers may delay launches"],
    whoGains: ["Patients, payers"],
    whoLoses: ["Drug manufacturers"],
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
    pros: ["Simple and automatic", "Uses prices other countries already negotiated"],
    cons: [
      "Manufacturers may raise prices abroad or delay launches there",
      "Exchange rates and confidential rebates make true prices hard to know",
    ],
    whoGains: ["U.S. patients"],
    whoLoses: ["Manufacturers"],
    mend: ["N/A"],
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
    pros: ["Directly lowers prices on targeted drugs", "Improves supply resilience"],
    cons: ["Only covers off-patent drugs", "Public manufacturing can be slow and costly"],
    whoGains: ["Patients"],
    whoLoses: ["Generic manufacturers on targeted drugs"],
    mend: ["N/A"],
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
    pros: ["Earlier generics and biosimilars", "Keeps core patents and their innovation incentive"],
    cons: [
      "Some incremental innovation (new forms) may be less rewarded",
      "Patent office and courts need new capacity",
    ],
    whoGains: ["Patients, generic makers"],
    whoLoses: ["Brand manufacturers"],
    mend: ["N/A"],
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
    pros: ["Targets the worst price cases", "Strong bargaining threat even if rarely used"],
    cons: ["Weakens patent certainty for investors", "Trade disputes with partners"],
    whoGains: ["Patients"],
    whoLoses: ["Patent holders"],
    mend: ["Pay reasonable royalties"],
    worsens: ["innovation-slowdown"],
    changes: [
      "Define march-in triggers for price and access",
      "Use 28 U.S.C. 1498 for government-use licenses",
      "Set royalty formulas",
    ],
  }),
  path({
    id: "patents-keep",
    problemId: "patents",
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
    pros: ["No disruption to innovation incentives", "No trade disputes"],
    cons: [
      "Thickets keep delaying generics and biosimilars",
      "Prices stay high until all patents expire",
    ],
    whoGains: ["Brand manufacturers"],
    whoLoses: ["Patients"],
    mend: ["N/A"],
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
    pros: ["Offsets lost revenue", "Can target neglected diseases"],
    cons: ["Costs taxpayers", "Government picks priorities"],
    whoGains: ["Researchers"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
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
    pros: ["Rewards innovation without high prices", "Can target neglected areas like antibiotics"],
    cons: [
      "Hard to set prize sizes correctly",
      "Untested at large scale",
      "Government defines which goals count",
    ],
    whoGains: ["Patients with diseases private R&D neglects (e.g., resistant infections)"],
    whoLoses: ["Taxpayers (prize funding)"],
    mend: ["N/A"],
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
    pros: ["Directs R&D to bigger breakthroughs", "Saves money on me-too drugs"],
    cons: ["Requires assessment capacity", "Disputes over how to measure value"],
    whoGains: ["Truly innovative firms"],
    whoLoses: ["Makers of incremental drugs"],
    mend: ["N/A"],
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
    pros: [
      "Directly targets the cause (prices too low to sustain production)",
      "Rewards quality and redundant suppliers",
    ],
    cons: ["Higher generic prices", "Rating supplier reliability is new and complex"],
    whoGains: ["Patients"],
    whoLoses: ["Payers (higher costs)"],
    mend: ["N/A"],
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
    pros: [
      "Buffers short disruptions",
      "Domestic production reduces dependence on a few foreign plants",
    ],
    cons: ["Expensive; drugs expire and must be rotated", "Onshoring is slow and costly"],
    whoGains: ["Patients"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
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
    pros: [
      "Keeps pharmacies open, especially rural and independent ones",
      "Transparent payment replaces opaque PBM reimbursement",
    ],
    cons: ["Higher dispensing costs", "Fee levels must be updated regularly"],
    whoGains: ["Pharmacies, rural patients"],
    whoLoses: ["PBMs"],
    mend: ["N/A"],
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
    pros: ["Cheap and fast to expand", "Restores access in towns with no pharmacist"],
    cons: [
      "Not good for urgent medications or patients needing counseling",
      "Deliveries can be unreliable for temperature-sensitive drugs",
    ],
    whoGains: ["Rural patients"],
    whoLoses: ["Local pharmacies"],
    mend: ["N/A"],
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
    pros: [
      "Stable funding regardless of volume",
      "Hospitals can redesign services for community needs",
      "Ends dependence on a few commercial payers",
    ],
    cons: [
      "Budget may not adjust to changing needs",
      "Low volume can still mean lower quality for some procedures",
    ],
    whoGains: ["Rural communities", "Rural hospital staff"],
    whoLoses: ["Taxpayers (budgets can cost more than letting hospitals close)"],
    mend: ["N/A"],
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
    pros: ["Keeps emergency care open", "Lower cost than full inpatient service"],
    cons: [
      "Longer travel for inpatient care and births",
      "Communities lose jobs and local identity",
    ],
    whoGains: ["Hospitals that would otherwise close"],
    whoLoses: ["Patients needing inpatient care locally"],
    mend: ["Fund transport"],
    worsens: ["maternity-deserts"],
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
    pros: ["Keeps births local", "Reduces risky long drives during labor"],
    cons: ["Low-volume units may have worse outcomes", "Expensive per birth"],
    whoGains: ["Rural mothers and families"],
    whoLoses: ["Taxpayers (standby cost)"],
    mend: ["Link standby funding to quality requirements and transfer agreements"],
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
    pros: ["Lower cost per birth", "More capacity in maternity deserts"],
    cons: [
      "Physician groups raise safety concerns",
      "Needs fast transfer to hospitals for complications",
    ],
    whoGains: ["Mothers in maternity deserts", "Midwives"],
    whoLoses: ["Obstetricians (some competition)"],
    mend: ["Require collaboration agreements and fast transfer to hospital care"],
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
    pros: [
      "Proven to place clinicians in underserved areas",
      "Removes debt that pushes graduates toward high-paying specialties",
    ],
    cons: ["Many leave after service ends", "Costly per clinician placed"],
    whoGains: ["Underserved communities", "Graduates with debt"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
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
    pros: ["Simple; uses the existing fee schedule", "Fast to implement"],
    cons: [
      "Pay alone often doesn't move clinicians (schools, spouses' jobs matter)",
      "Bonuses can go to providers already there",
    ],
    whoGains: ["Clinicians in shortage areas"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
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
    pros: ["Fast, cheap access", "Works especially well for mental health"],
    cons: ["Not a substitute for hands-on care", "Fraud risk", "Many rural areas lack broadband"],
    whoGains: ["Rural patients", "Patients needing mental health care"],
    whoLoses: ["Local practices facing remote competition"],
    mend: ["Fund broadband and local telehealth access points"],
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
    pros: ["Fewer missed appointments", "Ends surprise ground ambulance bills"],
    cons: [
      "Fraud risk (fake rides)",
      "Cost",
      "Brokers that manage rides have poor reliability records",
    ],
    whoGains: ["Patients without cars", "Rural patients"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
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
    pros: ["Ends ambulance bills", "Ambulances deployed by need, not payer"],
    cons: ["Shifts cost to local budgets", "Private ambulance companies lose business"],
    whoGains: ["Patients"],
    whoLoses: ["Private ambulance companies"],
    mend: ["Buy out or contract with private ambulance companies"],
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
    pros: ["Directly increases supply", "Residents stay near where they train"],
    cons: ["Takes 7+ years to show results", "Costly per slot"],
    whoGains: ["Graduates, patients"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
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
    pros: ["More students choose primary care", "Rewards the care most linked to better outcomes"],
    cons: ["Specialists lose income", "Takes years to change the workforce mix"],
    whoGains: ["Primary care physicians"],
    whoLoses: ["Specialists"],
    mend: ["Phase in"],
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
    pros: ["Fast supply increase", "Uses experienced physicians"],
    cons: ["Draws physicians from poorer countries", "Quality assurance concerns"],
    whoGains: ["Patients"],
    whoLoses: ["Countries losing physicians"],
    mend: ["N/A"],
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
    pros: [
      "Lowers pressure to choose high-paying specialties",
      "More diverse students can afford medicine",
    ],
    cons: ["Costly", "Benefits graduates who will earn high incomes anyway"],
    whoGains: ["Students"],
    whoLoses: ["Taxpayers"],
    mend: ["Tie free tuition to service obligations"],
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
    pros: ["Two fewer years of tuition", "Physicians start practicing earlier"],
    cons: ["Less mature students choose careers at 18", "Changes accreditation"],
    whoGains: ["Students"],
    whoLoses: ["Undergraduate institutions"],
    mend: ["N/A"],
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
    pros: ["Safer care", "Less burnout"],
    cons: ["Costly", "Hospitals may close beds if they can't hire"],
    whoGains: ["Nurses, patients"],
    whoLoses: ["Hospital budgets"],
    mend: ["Fund staffing in rates; phase in"],
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
    pros: ["Long-term increase in supply", "Schools already turn away qualified applicants"],
    cons: ["Takes years", "New nurses still leave if working conditions are poor"],
    whoGains: ["Nursing students", "Hospitals"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
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
    pros: ["More time for patients", "Fewer billing staff needed"],
    cons: ["Less data for audits and research", "Depends on payer consolidation"],
    whoGains: ["Clinicians"],
    whoLoses: ["EHR and coding vendors"],
    mend: ["N/A"],
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
    pros: ["Quick to deploy", "Shorter documentation time"],
    cons: [
      "Doesn't reduce the underlying rules",
      "Privacy concerns with recorded visits",
      "AI notes can contain errors",
    ],
    whoGains: ["Clinicians"],
    whoLoses: ["Medical transcriptionists"],
    mend: ["N/A"],
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
    pros: ["More capacity fast", "Lower cost"],
    cons: [
      "Physician groups raise quality concerns",
      "Some studies find more prescribing and referrals",
    ],
    whoGains: ["Patients in shortage areas", "NPs, PAs"],
    whoLoses: ["Physicians (competition)"],
    mend: ["N/A"],
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
    pros: ["Keeps physician oversight", "Adds capacity within teams"],
    cons: ["Supervision is a bottleneck in rural areas", "Supervision fees add cost"],
    whoGains: ["Patients", "Team members with expanded roles"],
    whoLoses: ["Rural areas without supervising physicians"],
    mend: ["Remote supervision"],
    solves: ["wait-times"],
    changes: ["Expand roles within physician-supervised teams", "Allow remote supervision"],
  }),
]
