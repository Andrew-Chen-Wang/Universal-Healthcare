import type { Confidence } from "./model"

export type ProCon = {
  /** One-line claim. */
  point: string
  /** Who it affects, and how much where we can say. */
  detail?: string
}

export type Alternative = {
  name: string
  description: string
  pros: ProCon[]
  cons: ProCon[]
  precedent?: string
}

export type Decision = {
  id: string
  title: string
  question: string
  choice: string
  rationale: string
  alternatives: Alternative[]
  /** What the chosen option gives up. */
  givesUp: string[]
  sourceIds: string[]
}

export type Cost = {
  /** One-time cost in billions (transition), if any. */
  oneTime?: number
  /** Recurring annual cost in billions at steady state, if any. Negative is a saving. */
  recurring?: number
  /** Where the figure is reflected in the ledger, or why it is outside it. */
  ledgerNote: string
}

export type Task = {
  /** A concrete action someone must take. */
  action: string
  owner: string
  /** When, relative to enactment (e.g. "Month 0–6"). */
  when: string
}

export type Step = {
  id: string
  title: string
  summary: string
  /** Statute, regulation, or administrative authority that makes this happen. */
  legalVehicle: string
  owner: string
  timeline: string
  tasks: Task[]
  cost: Cost
  pros: ProCon[]
  cons: ProCon[]
  tradeoffs: string[]
  risks: { risk: string; mitigation: string }[]
  precedent: string[]
  dependsOn: string[]
  sourceIds: string[]
}

export type Phase = {
  id: string
  number: number
  title: string
  window: string
  goal: string
  exitCriteria: string[]
  steps: Step[]
}

export type TradeoffDimension = {
  id: string
  title: string
  category:
    | "access"
    | "quality"
    | "money"
    | "choice"
    | "innovation"
    | "labor"
    | "governance"
    | "equity"
  summary: string
  /** Today in the U.S. */
  today: string
  /** Under the plan. */
  underPlan: string
  winners: string[]
  losers: string[]
  magnitude: string
  evidence: { place: string; finding: string; sourceIds: string[] }[]
  mitigations: string[]
  residualRisk: string
  confidence: Confidence
}
