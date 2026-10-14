import type { Phase } from "../types"
import { F } from "../figures"
import { MODEL, fmt } from "./helpers"

export const PHASE_0: Phase = {
  id: "groundwork",
  number: 0,
  title: "Preparation",
  window: "Before coverage starts",
  goal: "Before anyone moves to the new program: fix the worst problems in today's system (automatic enrollment of the uninsured, denials, prior authorization, medical debt, surprise bills, drug middlemen), start the long-lead workforce and data work, and settle how state money keeps flowing.",
  exitCriteria: [
    "Interim fixes from the chosen paths for this phase are in force (see Changes by phase).",
    "Workforce expansion (residency slots, nursing faculty, scope of practice) funded and started.",
    "Every state's contribution computed and published.",
    "Payment schedules between states and the national program in place.",
  ],
  steps: [
    {
      id: "state-moe-design",
      title: "Set each state's contribution",
      summary: `States currently pay ${F.stateMedicaid} for Medicaid. Under a national program that money keeps flowing as a maintenance-of-effort (MOE) payment, so states pay what they paid before while the national program takes over the care.`,
      legalVehicle:
        "Federal–state financing agreement, modeled on the Medicare Part D state contribution.",
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
            "Share savings: states receive a share of any national savings below the spending growth target.",
          owner: "HHS / Treasury",
          when: "Month −12",
        },
        {
          action: "Set up monthly MOE payments from each state to the national trust fund.",
          owner: "Treasury / states",
          when: "Month −6 to 0",
        },
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
        { point: "Indexing to national growth may not match each state's own population changes." },
      ],
      tradeoffs: [
        "Freezing state contributions at 2024 levels locks in historical differences between states; redesigning the formula from scratch would be fairer but would shift costs sharply between states.",
      ],
      risks: [
        {
          risk: "A recession squeezes state budgets while MOE payments are fixed.",
          mitigation:
            "Counter-cyclical relief: MOE payments are reduced when a state's unemployment rate rises above a set threshold.",
        },
      ],
      precedent: [
        "Medicare Part D 'clawback' (2006): states pay the federal government for drug costs of dual eligibles.",
      ],
      dependsOn: [],
      sourceIds: ["nfib-sebelius"],
    },
  ],
}
