import { Pill, Table } from "@website/components/site/ui"
import { RISKS } from "@website/content/risks"
import { STEP_EXTRAS } from "@website/content/step-extras"
import { type StepParams, loadStep, stepStaticParams } from "@website/lib/plan/step"
import type { Metadata } from "next"

export const generateStaticParams = stepStaticParams

export async function generateMetadata({ params }: { params: StepParams }): Promise<Metadata> {
  const { step, number } = await loadStep(params)
  return { title: `Risks · ${number} ${step.title}` }
}

const TONE = { low: "gain", medium: "caution", high: "loss", severe: "loss" } as const

export default async function RisksPage({ params }: { params: StepParams }) {
  const { step } = await loadStep(params)
  const major = (STEP_EXTRAS[step.id]?.riskIds ?? []).map((id) => RISKS.find((r) => r.id === id)!)
  return (
    <div className="space-y-10">
      {major.map((r) => (
        <section key={r.id} id={r.id} className="rounded-md border border-rule bg-card p-5">
          <div className="mb-2 flex flex-wrap gap-2">
            <Pill>{r.category}</Pill>
            <Pill tone={TONE[r.likelihood]}>likelihood: {r.likelihood}</Pill>
            <Pill tone={TONE[r.impact]}>impact: {r.impact}</Pill>
          </div>
          <h2 className="text-xl font-semibold">{r.title}</h2>
          <p className="mt-2 text-foreground/85">{r.description}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-caution/30 bg-caution-soft p-3 text-sm">
              <div className="mb-1 text-xs font-semibold text-caution uppercase">
                Early warning signs
              </div>
              <ul className="list-disc pl-5">
                {r.earlyWarning.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-primary/30 bg-accent/50 p-3 text-sm">
              <div className="mb-1 text-xs font-semibold text-accent-foreground uppercase">
                Mitigation
              </div>
              <ul className="list-disc pl-5">
                {r.mitigation.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
      {step.risks.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Implementation risks</h2>
          <Table>
            <thead>
              <tr>
                <th>Risk</th>
                <th>Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {step.risks.map((r) => (
                <tr key={r.risk}>
                  <td>{r.risk}</td>
                  <td className="text-foreground/80">{r.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      )}
      {major.length === 0 && step.risks.length === 0 && (
        <p className="text-muted-foreground">
          No step-specific risks identified beyond those in dependent steps.
        </p>
      )}
    </div>
  )
}
