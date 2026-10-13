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
  }),
  path({
    id: "drugs-reference",
    problemId: "drug-prices",
    title: "International reference pricing",
    summary: "Cap U.S. prices at the median (or lowest) of peer countries.",
    precedents: [{ place: "Canada (PMPRB), Japan", note: "Use international reference baskets." }],
    pros: ["Simple and automatic", "Uses prices other countries already negotiated"],
    cons: [
      "Manufacturers may raise prices abroad or delay launches there",
      "Exchange rates and confidential rebates make true prices hard to know",
    ],
    whoGains: ["U.S. patients"],
    whoLoses: ["Manufacturers"],
    mend: ["N/A"],
    spawns: ["x-price-control-exit"],
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
    ],
    pros: ["Directly lowers prices on targeted drugs", "Improves supply resilience"],
    cons: ["Only covers off-patent drugs", "Public manufacturing can be slow and costly"],
    whoGains: ["Patients"],
    whoLoses: ["Generic manufacturers on targeted drugs"],
    mend: ["N/A"],
    solves: ["shortages"],
    costIds: ["insulin-cost"],
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
    pros: ["Earlier generics", "Keeps core patents"],
    cons: ["Some incremental innovation (new forms) may be less rewarded"],
    whoGains: ["Patients, generic makers"],
    whoLoses: ["Brand manufacturers"],
    mend: ["N/A"],
  }),
  path({
    id: "patents-march-in",
    problemId: "patents",
    title: "Use government march-in and compulsory licensing",
    summary:
      "For publicly funded drugs or extreme prices, license patents to other manufacturers (28 U.S.C. §1498, Bayh-Dole march-in).",
    precedents: [{ place: "Thailand, Brazil", note: "Compulsory licenses for HIV drugs." }],
    pros: ["Targets the worst cases"],
    cons: ["Weakens patent certainty", "Trade disputes"],
    whoGains: ["Patients"],
    whoLoses: ["Patent holders"],
    mend: ["Pay reasonable royalties"],
    worsens: ["innovation-slowdown"],
  }),
  path({
    id: "patents-keep",
    problemId: "patents",
    title: "Keep the current patent system",
    summary: "Leave patents unchanged and control prices through negotiation instead.",
    precedents: [
      { place: "Most peer countries", note: "Similar patent law; lower prices from negotiation." },
    ],
    pros: ["No disruption to innovation incentives", "No trade disputes"],
    cons: ["Thickets keep delaying generics and biosimilars"],
    whoGains: ["Brand manufacturers"],
    whoLoses: ["Patients"],
    mend: ["N/A"],
    complements: ["drugs-negotiate"],
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
    ],
    pros: ["Offsets lost revenue", "Can target neglected diseases"],
    cons: ["Costs taxpayers", "Government picks priorities"],
    whoGains: ["Researchers"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    spawns: ["x-public-rd-priorities"],
    costIds: ["pharma-rd", "nhe-research"],
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
    ],
    pros: ["Rewards innovation without high prices"],
    cons: [
      "Hard to set prize sizes correctly",
      "Untested at large scale",
      "Government defines which goals count",
    ],
    whoGains: ["Patients with diseases private R&D neglects (e.g., resistant infections)"],
    whoLoses: ["Taxpayers (prize funding)"],
    mend: ["N/A"],
    spawns: ["x-public-rd-priorities"],
  }),
  path({
    id: "rd-value-pricing",
    problemId: "rd-incentives",
    title: "Value-based prices that reward real innovation",
    summary:
      "Pay high prices only for drugs with large added benefit; pay little for me-too drugs.",
    precedents: [
      { place: "Germany (AMNOG), France", note: "Prices tied to added-benefit rating." },
    ],
    pros: ["Directs R&D to bigger breakthroughs"],
    cons: ["Requires assessment capacity", "Disputes over value"],
    whoGains: ["Truly innovative firms"],
    whoLoses: ["Makers of incremental drugs"],
    mend: ["N/A"],
    spawns: ["x-central-rationing"],
    complements: ["drugs-negotiate"],
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
  }),

  // ---- pharmacy deserts ----
  path({
    id: "pharmacy-fee",
    problemId: "pharmacy-deserts",
    title: "Fair dispensing fees and support for rural pharmacies",
    summary:
      "Pay pharmacies a transparent dispensing fee covering costs, with extra payments in underserved areas.",
    precedents: [{ place: "Canadian provinces", note: "Set dispensing fees publicly." }],
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
  }),
  path({
    id: "pharmacy-mail-telehealth",
    problemId: "pharmacy-deserts",
    title: "Mail-order and telepharmacy",
    summary: "Allow remote pharmacist supervision and expand mail delivery.",
    precedents: [
      { place: "North Dakota", note: "Telepharmacy since 2001 restored service to rural towns." },
    ],
    pros: ["Cheap and fast to expand", "Restores access in towns with no pharmacist"],
    cons: [
      "Not good for urgent medications or patients needing counseling",
      "Deliveries can be unreliable for temperature-sensitive drugs",
    ],
    whoGains: ["Rural patients"],
    whoLoses: ["Local pharmacies"],
    mend: ["N/A"],
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
    whoLoses: ["N/A (budgets cost more than letting hospitals close)"],
    mend: ["N/A"],
    requires: ["global-budgets"],
    spawns: ["x-budget-rationing"],
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
        note: "Dozens of hospitals have converted.",
      },
    ],
    pros: ["Keeps emergency care open", "Lower cost"],
    cons: ["Longer travel for inpatient care and births"],
    whoGains: ["Hospitals that would otherwise close"],
    whoLoses: ["Patients needing inpatient care locally"],
    mend: ["Fund transport"],
    worsens: ["maternity-deserts"],
    complements: ["transport-fund"],
  }),

  // ---- maternity deserts ----
  path({
    id: "maternity-standby",
    problemId: "maternity-deserts",
    title: "Standby payments to keep labor units open",
    summary: "Pay rural labor and delivery units a fixed amount for readiness, not per birth.",
    precedents: [
      { place: "Norway, Sweden", note: "Maternity units funded by budget, not volume." },
    ],
    pros: ["Keeps births local", "Reduces risky long drives during labor"],
    cons: ["Low-volume units may have worse outcomes", "Expensive per birth"],
    whoGains: ["Rural mothers and families"],
    whoLoses: ["Taxpayers (standby cost)"],
    mend: ["Link standby funding to quality requirements and transfer agreements"],
  }),
  path({
    id: "maternity-midwives",
    problemId: "maternity-deserts",
    title: "Expand midwives and birth centers",
    summary:
      "License and pay certified midwives and freestanding birth centers, with transfer agreements.",
    precedents: [{ place: "UK, Netherlands", note: "Midwives lead most low-risk births." }],
    pros: ["Lower cost", "More capacity"],
    cons: ["Physician groups raise safety concerns"],
    whoGains: ["Mothers in maternity deserts", "Midwives"],
    whoLoses: ["Obstetricians (some competition)"],
    mend: ["Require collaboration agreements and fast transfer to hospital care"],
    spawns: ["x-scope-quality"],
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
  }),
  path({
    id: "shortage-pay",
    problemId: "shortage-areas",
    title: "Higher pay in shortage areas",
    summary: "Add a bonus to fees in shortage areas.",
    precedents: [{ place: "U.S. Medicare HPSA bonus", note: "10% bonus in shortage areas." }],
    pros: ["Simple; uses the existing fee schedule"],
    cons: [
      "Pay alone often doesn't move clinicians (schools, spouses' jobs matter)",
      "Bonuses can go to providers already there",
    ],
    whoGains: ["Clinicians in shortage areas"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
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
    ],
    pros: ["Fast, cheap access"],
    cons: ["Not a substitute for hands-on care", "Fraud risk", "Many rural areas lack broadband"],
    whoGains: ["Rural patients", "Patients needing mental health care"],
    whoLoses: ["Local practices facing remote competition"],
    mend: ["Fund broadband and local telehealth access points"],
    solves: ["mental-health-access"],
  }),

  // ---- transport ----
  path({
    id: "transport-fund",
    problemId: "transport",
    title: "Cover ambulance and non-emergency transport",
    summary:
      "Cover ambulances (ending surprise bills for ground ambulances) and rides to care for everyone, not only Medicaid.",
    precedents: [{ place: "Medicaid NEMT", note: "Medicaid covers rides to appointments." }],
    pros: ["Fewer missed appointments"],
    cons: [
      "Fraud risk (fake rides)",
      "Cost",
      "Brokers that manage rides have poor reliability records",
    ],
    whoGains: ["Patients without cars", "Rural patients"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
  }),
  path({
    id: "transport-public-ems",
    problemId: "transport",
    title: "Publicly funded EMS as essential service",
    summary: "Fund ambulances by budget like fire departments, not per trip.",
    precedents: [{ place: "Many European countries", note: "Ambulances free at use." }],
    pros: ["Ends ambulance bills", "Ambulances deployed by need, not payer"],
    cons: ["Shifts cost to local budgets", "Private ambulance companies lose business"],
    whoGains: ["Patients"],
    whoLoses: ["Private ambulance companies"],
    mend: ["Buy out or contract with private ambulance companies"],
    requires: ["global-budgets"],
  }),

  // ---- physician shortage ----
  path({
    id: "phys-residency",
    problemId: "physician-shortage",
    title: "Fund more residency slots",
    summary:
      "Fund more residency positions, prioritizing primary care, psychiatry, and rural sites.",
    precedents: [{ place: "U.S. 2021 & 2023 laws", note: "Added about 1,200 slots." }],
    pros: ["Directly increases supply"],
    cons: ["Takes 7+ years to show results", "Costly per slot"],
    whoGains: ["Graduates, patients"],
    whoLoses: ["Taxpayers"],
    mend: ["N/A"],
    costIds: ["residency-slot-cost"],
  }),
  path({
    id: "phys-pay-primary",
    problemId: "physician-shortage",
    title: "Raise primary care pay relative to specialties",
    summary: "Shift fee-schedule dollars from procedures to primary care.",
    precedents: [
      { place: "UK, Netherlands", note: "GPs earn closer to specialists than in the U.S." },
    ],
    pros: ["More students choose primary care", "Rewards the care most linked to better outcomes"],
    cons: ["Specialists lose income", "Takes years to change the workforce mix"],
    whoGains: ["Primary care physicians"],
    whoLoses: ["Specialists"],
    mend: ["Phase in"],
    costIds: ["physician-pay-gap"],
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
    ],
    pros: ["Fast supply increase"],
    cons: ["Draws physicians from poorer countries", "Quality assurance concerns"],
    whoGains: ["Patients"],
    whoLoses: ["Countries losing physicians"],
    mend: ["N/A"],
  }),

  // ---- training debt ----
  path({
    id: "debt-free-school",
    problemId: "training-debt",
    title: "Tuition-free medical and nursing school",
    summary: "Public funding covers tuition, possibly in exchange for service.",
    precedents: [
      { place: "Most European countries", note: "Tuition-free or low-cost medical school." },
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
  }),
  path({
    id: "debt-shorter-training",
    problemId: "training-debt",
    title: "Shorter training: combined undergrad/medical programs",
    summary: "Six-year programs straight from high school, as in most countries.",
    precedents: [{ place: "UK, Europe", note: "Medical school directly after secondary school." }],
    pros: ["Two fewer years of tuition"],
    cons: ["Less mature students", "Changes accreditation"],
    whoGains: ["Students"],
    whoLoses: ["Undergraduate institutions"],
    mend: ["N/A"],
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
    ],
    pros: ["Safer care", "Less burnout"],
    cons: ["Costly", "Hospitals may close beds if they can't hire"],
    whoGains: ["Nurses, patients"],
    whoLoses: ["Hospital budgets"],
    mend: ["Fund staffing in rates; phase in"],
    spawns: ["x-staffing-mandate-cost"],
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
  }),

  // ---- burnout ----
  path({
    id: "burnout-simplify",
    problemId: "burnout-admin",
    title: "Cut documentation and billing burden",
    summary: "Simplify billing codes and documentation rules; fewer quality-reporting programs.",
    precedents: [{ place: "Taiwan, Canada", note: "Simpler billing reduces physician paperwork." }],
    pros: ["More time for patients", "Fewer billing staff needed"],
    cons: ["Less data for audits and research", "Depends on payer consolidation"],
    whoGains: ["Clinicians"],
    whoLoses: ["EHR and coding vendors"],
    mend: ["N/A"],
    requires: ["single-payer"],
  }),
  path({
    id: "burnout-scribes",
    problemId: "burnout-admin",
    title: "Fund scribes and AI documentation",
    summary: "Pay for scribes or ambient AI documentation tools.",
    precedents: [
      { place: "U.S. health systems", note: "Early studies show reduced documentation time." },
    ],
    pros: ["Quick to deploy"],
    cons: [
      "Doesn't reduce the underlying rules",
      "Privacy concerns with recorded visits",
      "AI notes can contain errors",
    ],
    whoGains: ["Clinicians"],
    whoLoses: ["Medical transcriptionists"],
    mend: ["N/A"],
  }),

  // ---- scope of practice ----
  path({
    id: "scope-expand",
    problemId: "scope-of-practice",
    title: "Full practice authority for NPs, PAs, pharmacists, dental therapists",
    summary: "Let each profession practice to the full extent of its training.",
    precedents: [
      { place: "About half of U.S. states", note: "Grant NPs full practice authority." },
    ],
    pros: ["More capacity fast", "Lower cost"],
    cons: ["Physician groups raise quality concerns"],
    whoGains: ["Patients in shortage areas", "NPs, PAs"],
    whoLoses: ["Physicians (competition)"],
    mend: ["N/A"],
    spawns: ["x-scope-quality"],
    solves: ["physician-shortage", "shortage-areas"],
  }),
  path({
    id: "scope-team",
    problemId: "scope-of-practice",
    title: "Team-based care with physician oversight",
    summary: "Expand roles within teams under physician supervision.",
    precedents: [{ place: "Kaiser Permanente, VA", note: "Team-based models." }],
    pros: ["Keeps physician oversight", "Adds capacity within teams"],
    cons: ["Supervision is a bottleneck in rural areas", "Supervision fees add cost"],
    whoGains: ["Patients", "Team members with expanded roles"],
    whoLoses: ["N/A"],
    mend: ["N/A"],
  }),
]
