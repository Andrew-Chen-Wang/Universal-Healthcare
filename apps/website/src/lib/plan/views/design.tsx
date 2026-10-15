import { Callout, ProsCons, Sources } from "@website/components/site/ui"
import type { Metadata } from "next"
import type { PlanVariant } from "@website/content/plan-bundle"
import { getPlan } from "@website/content/plans"
import { loadStep, stepStaticParams, type StepParams } from "@website/lib/plan/step"

export function designRoute(variant: PlanVariant) {
  const plan = getPlan(variant)
  const generateStaticParams = stepStaticParams(variant)

  async function generateMetadata({ params }: { params: StepParams }): Promise<Metadata> {
    const { step, number } = await loadStep(variant, params)
    return { title: `Design · ${number} ${step.title}` }
  }

  async function DesignPage({ params }: { params: StepParams }) {
    const { step } = await loadStep(variant, params)
    const decisions = (plan.extras[step.id]?.decisionIds ?? []).map((id) =>
      plan.designDecisions.find((d) => d.id === id)!,
    )
    if (decisions.length === 0)
      return (
        <p className="text-muted-foreground">
          This step implements choices made elsewhere; it has no separate design decision.
        </p>
      )
    return (
      <div className="space-y-16">
        {decisions.map((d) => (
          <section key={d.id} id={d.id}>
            <h2 className="text-2xl font-semibold">{d.title}</h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{d.question}</p>
            <Callout title="The plan chooses">{d.choice}</Callout>
            <p className="max-w-3xl leading-relaxed">{d.rationale}</p>
            <div className="mt-8 space-y-8">
              {d.alternatives.map((a) => (
                <div key={a.name}>
                  <h3 className="text-lg font-semibold">{a.name}</h3>
                  <p className="mb-3 text-sm text-foreground/75">{a.description}</p>
                  <ProsCons pros={a.pros} cons={a.cons} />
                  {a.precedent && (
                    <p className="mt-2 text-sm text-muted-foreground">Precedent: {a.precedent}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-md border border-loss/30 bg-loss-soft/50 p-4">
              <div className="mb-2 text-xs font-semibold tracking-wide text-loss uppercase">
                What this choice gives up
              </div>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {d.givesUp.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
            <Sources ids={d.sourceIds} />
          </section>
        ))}
      </div>
    )
  }
  return { Page: DesignPage, generateStaticParams, generateMetadata }
}
