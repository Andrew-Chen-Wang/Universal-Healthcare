import type { Phase } from "../types"
import { F } from "../figures"
import { show } from "../constants"
import { MODEL, fmt } from "./helpers"

export const PHASE_0: Phase = {
  id: "groundwork",
  number: 0,
  title: "Groundwork",
  window: "24 months before enactment",
  goal: "Write the law, get it scored, assemble the votes, and settle the deals that decide whether it survives its first election.",
  exitCriteria: [
    "Bill text published with a section-by-section summary and this ledger attached.",
    "CBO, JCT, and CMS Office of the Actuary scores published.",
    "A legislative path that does not depend on budget reconciliation for non-budgetary provisions.",
    "Written commitments from at least 30 states to accept the maintenance-of-effort agreement.",
  ],
  steps: [
    {
      id: "draft-legislation",
      title: "Draft the Universal Health Act",
      summary:
        "Write a single statute with titles covering eligibility, benefits, the administering agency, provider participation and payment, drugs, financing, the transition, and conforming amendments to dozens of existing laws.",
      legalVehicle:
        "New statute; amends the Social Security Act (Titles XVIII, XIX, XXI), ERISA, the Internal Revenue Code, the Public Health Service Act, and the ACA.",
      owner:
        "Congressional committees: Senate Finance and HELP, House Ways & Means and Energy & Commerce. Legislative Counsel drafts.",
      timeline: "Months −24 to −12",
      tasks: [
        {
          action:
            "Title I – Establishment: create the Universal Health Administration (UHA) and the UHP Trust Fund with permanent appropriation.",
          owner: "Legislative Counsel",
          when: "Month −24",
        },
        {
          action:
            "Title II – Eligibility: residency definition, 90-day rule, identifiers, treatment of visitors, cross-border workers, and people living abroad.",
          owner: "Finance / W&M",
          when: "Month −24",
        },
        {
          action:
            "Title III – Benefits: statutory benefit categories, the technology-assessment process for adding and removing services, and exclusions.",
          owner: "HELP / E&C",
          when: "Month −22",
        },
        {
          action:
            "Title IV – Provider participation: participation agreements, opt-out rules, the balance-billing ban, conflict-of-interest rules, and data reporting.",
          owner: "Finance / E&C",
          when: "Month −22",
        },
        {
          action:
            "Title V – Payment: national fee schedule, hospital global budgets, capital budgets, the integrated care organization option, and rate-update formulas.",
          owner: "Finance / W&M",
          when: "Month −20",
        },
        {
          action:
            "Title VI – Drugs and devices: the National Formulary and Pricing Board, negotiation procedure, and §1498 backstop authority.",
          owner: "Finance / E&C",
          when: "Month −20",
        },
        {
          action:
            "Title VII – Financing: employer health payroll tax, household premium, top-end taxes, state maintenance of effort, and trust-fund mechanics.",
          owner: "Finance / W&M / JCT",
          when: "Month −18",
        },
        {
          action:
            "Title VIII – Transition: enrollment waves, the employer maintenance-of-compensation rule, insurer run-off, worker transition, and hospital transition fund.",
          owner: "All committees",
          when: "Month −16",
        },
        {
          action:
            "Title IX – Conforming amendments: repeal or sunset Medicare Parts C and D, Medicaid acute-care eligibility, Marketplace subsidies, the IRC §106 exclusion, COBRA, and FEHB.",
          owner: "Legislative Counsel",
          when: "Month −14",
        },
        {
          action:
            "Publish the draft for 90 days of public comment with this ledger as a companion document.",
          owner: "Lead sponsors",
          when: "Month −14 to −12",
        },
      ],
      cost: { oneTime: 0, ledgerNote: "Normal congressional operating cost; not in the ledger." },
      pros: [
        {
          point:
            "One statute keeps eligibility, payment, and financing consistent with each other.",
        },
        { point: "Public comment surfaces implementation problems before they are law." },
      ],
      cons: [
        {
          point: "A bill of 1,000+ pages is easy to attack piece by piece.",
          detail: "The ACA was about 900 pages.",
        },
        { point: "Every title creates an opposing interest group." },
      ],
      tradeoffs: [
        "Writing details into statute protects against later administrative weakening, but makes fixing mistakes require another act of Congress. The plan puts structures (benefit categories, payment methods) in statute and leaves numbers (rates, formulary) to expert boards with a congressional veto.",
      ],
      risks: [
        {
          risk: "Drafting errors that need technical-corrections bills a hostile Congress won't pass (the ACA's 'established by the State' language led to King v. Burwell).",
          mitigation:
            "Independent legislative-drafting review, plus a general 'implement consistent with purpose' clause.",
        },
      ],
      precedent: [
        "Medicare and Medicaid were enacted in one bill (Social Security Amendments of 1965), and Medicare launched 11 months after signing.",
        "Taiwan's National Health Insurance Act passed in 1994 and the program launched in March 1995.",
      ],
      dependsOn: [],
      sourceIds: ["sanders-m4a", "jayapal-m4a"],
    },
    {
      id: "independent-scoring",
      title: "Get independent cost estimates and publish the ledger",
      summary:
        "Request CBO, JCT, and CMS actuarial scores of the bill text, and publish a reconciliation of every dollar (this site's ledger) so disagreements are about specific assumptions, not totals.",
      legalVehicle:
        "Congressional Budget Act of 1974 (CBO/JCT scoring); CMS Office of the Actuary analyses on request.",
      owner: "CBO, JCT, CMS OACT",
      timeline: "Months −14 to −8",
      tasks: [
        {
          action:
            "Submit the bill for CBO/JCT scoring with a dynamic-analysis request for labor-market effects.",
          owner: "Lead sponsors",
          when: "Month −14",
        },
        {
          action:
            "Request a CMS Office of the Actuary estimate of national health expenditures under the bill.",
          owner: "Senate Finance",
          when: "Month −14",
        },
        {
          action:
            "Commission at least two outside estimates (e.g., Urban Institute, RAND) using the same bill text.",
          owner: "Sponsors / foundations",
          when: "Month −14",
        },
        {
          action:
            "Publish a crosswalk of every estimate against this ledger, line by line: provider rates, utilization, administration, drugs, revenue.",
          owner: "Sponsors",
          when: "Month −8",
        },
      ],
      cost: { oneTime: 0, ledgerNote: "Within existing agency budgets." },
      pros: [
        {
          point:
            "Credible scoring is the single biggest determinant of whether moderates vote yes.",
        },
        {
          point:
            "A line-by-line crosswalk prevents '$32 trillion' headlines that omit the $34T+ already spent privately.",
        },
      ],
      cons: [
        {
          point:
            "Scores will differ by hundreds of billions per year, mostly on utilization and provider rates.",
          detail: `This site's own range: ${fmt(MODEL.headline.delta, { sign: true })} central, versus the costly and lean scenarios on the ledger page.`,
        },
      ],
      tradeoffs: [
        "Being conservative (assuming higher rates and utilization) makes the plan look more expensive but protects against overruns. Being aggressive makes it look cheaper but invites failure.",
      ],
      risks: [
        {
          risk: "CBO assumes more utilization than sponsors expect, making the headline federal cost much larger.",
          mitigation:
            "Publish the costly-case financing in advance: which tax rates rise if utilization comes in high.",
        },
      ],
      precedent: [
        "CBO's 2020 report on five single-payer options found national spending changes from −$0.7T to +$0.3T in 2030, and federal subsidy increases of $1.5–3.0T in 2030.",
      ],
      dependsOn: ["draft-legislation"],
      sourceIds: [
        "cbo-single-payer-2020",
        "mercatus-2018",
        "urban-2019",
        "peri-2018",
        "galvani-2020",
      ],
    },
    {
      id: "legislative-path",
      title: "Choose a legislative path that can pass the Senate",
      summary:
        "Budget reconciliation can pass taxes and spending with 51 votes, but the Byrd rule strikes 'extraneous' provisions: insurance regulation, the duplicative-coverage ban, ERISA amendments, provider participation rules. Passing the whole plan therefore requires 60 votes or a change to the filibuster.",
      legalVehicle: "Senate Rules (cloture, Rule XXII); Congressional Budget Act §313 (Byrd rule).",
      owner: "Senate leadership",
      timeline: "Months −12 to 0",
      tasks: [
        {
          action: "Have the Senate Parliamentarian review which titles survive the Byrd rule.",
          owner: "Senate Budget Committee",
          when: "Month −12",
        },
        {
          action:
            "Decide between: (a) 60 votes; (b) a filibuster exception for this bill; (c) a split strategy, passing financing and spending by reconciliation and regulatory titles separately.",
          owner: "Majority leader",
          when: "Month −10",
        },
        {
          action:
            "If split: design reconciliation titles to function even if the regulatory bill fails (e.g., UHP as a voluntary universal public plan with auto-enrollment).",
          owner: "Budget / Finance",
          when: "Month −10",
        },
      ],
      cost: { ledgerNote: "No direct cost." },
      pros: [
        {
          point:
            "Facing this choice early avoids the ACA's 2010 scramble after losing the 60th vote.",
        },
      ],
      cons: [
        {
          point:
            "Under a split strategy, the duplicative-insurance ban and ERISA preemption may not survive, which weakens the single-payer design.",
        },
        { point: "Changing the filibuster has long-run consequences beyond health policy." },
      ],
      tradeoffs: [
        "Speed and certainty versus durability. Laws passed on a party-line vote are more exposed to repeal, as the 2017 ACA repeal attempt showed.",
      ],
      risks: [
        {
          risk: "Partial enactment: financing passes but structural reforms don't, leaving a costly hybrid.",
          mitigation: "Make tax effective dates contingent on the structural titles taking effect.",
        },
      ],
      precedent: [
        "ACA (2010): 60 Senate votes, then a reconciliation 'fix' bill.",
        "2017 ACA repeal attempt failed 49–51 under reconciliation.",
      ],
      dependsOn: ["draft-legislation"],
      sourceIds: [],
    },
    {
      id: "stakeholder-deals",
      title: "Negotiate with providers, labor, and states",
      summary:
        "Secure written positions from the groups whose opposition historically sank reform: hospitals (AHA), physicians (AMA and specialty societies), unions with bargained health plans, and governors.",
      legalVehicle: "Political negotiation; terms written into bill text.",
      owner: "Sponsors, White House, HHS",
      timeline: "Months −18 to −6",
      tasks: [
        {
          action: `Hospitals: offer the transition fund, a separate capital budget, and the ${show("hospitalRate", "pct")}-of-Medicare rate in exchange for neutrality.`,
          owner: "HHS / sponsors",
          when: "Month −18",
        },
        {
          action:
            "Physicians: offer the end of prior authorization and of payer-specific billing, primary-care rate increases, and GME expansion.",
          owner: "HHS / sponsors",
          when: "Month −18",
        },
        {
          action:
            "Unions: guarantee that bargained health contributions convert to wages or pensions dollar for dollar (maintenance of compensation), and that the union's role in negotiating supplementary benefits is preserved.",
          owner: "DOL / sponsors",
          when: "Month −16",
        },
        {
          action:
            "Governors: show each state its own ledger: Medicaid MOE versus savings on state-employee premiums and Medicaid administration.",
          owner: "HHS",
          when: "Month −16",
        },
        {
          action:
            "Insurers: offer orderly run-off rules and preference for experienced staff in UHA and contractor hiring; no compensation for lost future business.",
          owner: "HHS / DOL",
          when: "Month −12",
        },
      ],
      cost: {
        oneTime: 40,
        ledgerNote: `The hospital transition fund (${F.hospitalFund}) is costed in the transition table. Other concessions are built into the rates in the ledger.`,
      },
      pros: [
        {
          point: "Hospital and physician neutrality was decisive for the ACA and Medicare passage.",
        },
        {
          point:
            "Unions' conversion guarantee answers the strongest labor objection: 'we gave up raises for these benefits'.",
        },
      ],
      cons: [
        {
          point: "Each concession costs money or savings",
          detail: `Hospital rates of ${show("hospitalRate", "pct")} instead of 100% of Medicare cost about ${F.hospitalAboveMedicare} a year.`,
        },
        { point: "Deals entrench incumbent providers' positions." },
      ],
      tradeoffs: [
        "Every point of provider rate above Medicare buys political support at the cost of savings.",
      ],
      risks: [
        {
          risk: "Industry groups take concessions and still oppose.",
          mitigation: "Make concessions contingent on enactment by a fixed date.",
        },
      ],
      precedent: [
        "1965: Medicare paid hospitals 'reasonable costs' and physicians 'customary charges' to win AMA acquiescence, which fed cost inflation for decades.",
        "2009: The AHA and PhRMA struck deals for ACA support ($155B and $80B in concessions).",
      ],
      dependsOn: ["draft-legislation"],
      sourceIds: [],
    },
    {
      id: "state-moe-design",
      title: "Design the state contribution so it survives the Supreme Court",
      summary: `States currently pay ${F.stateMedicaid} for Medicaid. The plan needs that money, but NFIB v. Sebelius (2012) bars Congress from coercing states by threatening existing federal funds. The maintenance-of-effort (MOE) payment therefore has to be a voluntary deal that most states find attractive.`,
      legalVehicle:
        "Spending Clause conditions on new federal funds; interstate compacts optional.",
      owner: "HHS / Treasury / states",
      timeline: "Months −16 to 0",
      tasks: [
        {
          action:
            "Compute each state's MOE: its 2024 Medicaid + CHIP + Medicare buy-in spending, indexed to per-capita national health spending growth.",
          owner: "CMS OACT",
          when: "Month −16",
        },
        {
          action:
            "Compute each state's offsetting gains: state-employee premiums ended, Medicaid administration ended, new income-tax revenue from wage pass-through.",
          owner: "CMS OACT / Treasury",
          when: "Month −16",
        },
        {
          action:
            "Structure the incentive: states that sign the MOE get UHP coverage for their residents' long-term care and a share of any savings below the national growth target; states that don't sign keep running Medicaid themselves for low-income residents, at their own cost, with no federal match.",
          owner: "Sponsors",
          when: "Month −12",
        },
        { action: "Get MOE agreements signed before Year 1.", owner: "HHS", when: "Month −6 to 0" },
      ],
      cost: {
        recurring: 0,
        ledgerNote: `The MOE is a source line: ${fmt(MODEL.side.stateMoe)} in the central estimate. State & local health spending falls from ${fmt(MODEL.sponsorBefore.stateLocal)} to ${fmt(MODEL.sponsorAfter.stateLocal)}.`,
      },
      pros: [
        {
          point: "States save money overall",
          detail: `${fmt(MODEL.sponsorBefore.stateLocal - MODEL.sponsorAfter.stateLocal)} a year combined, before ${fmt(MODEL.side.newStateIncomeTax)} in new state income-tax revenue.`,
        },
        {
          point: "Removes the Medicaid budget's crowd-out of education spending in state budgets.",
        },
      ],
      cons: [
        {
          point:
            "States with low Medicaid spending per person (often Southern, non-expansion states) have the smallest MOE and gain the most federal money; high-spending states pay in more. This is an interstate transfer.",
        },
        { point: `If some states refuse, the federal gap grows by up to ${F.stateMoe}.` },
      ],
      tradeoffs: [
        "Freezing state contributions at 2024 levels locks in historical inequities between states, but redesigning the formula would set off 50 state-by-state fights.",
      ],
      risks: [
        {
          risk: "Holdout states.",
          mitigation:
            "Non-signing states' residents are still covered by UHP for everything except long-term care, and the state forfeits its LTC coverage and savings share. That is a strong, non-coercive incentive.",
        },
      ],
      precedent: [
        "Medicare Part D 'clawback' (2006): states pay the federal government for drug costs of dual eligibles. It survived legal challenge (Texas v. Leavitt).",
      ],
      dependsOn: ["draft-legislation"],
      sourceIds: ["nfib-sebelius"],
    },
  ],
}
