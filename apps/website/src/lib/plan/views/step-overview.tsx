import { B, Callout, Sources } from "@website/components/site/ui"
import { SECTION_LABELS } from "@website/content/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import type { PlanVariant } from "@website/content/plan-bundle"
import { getPlan } from "@website/content/plans"
import { loadStep, stepStaticParams, type StepParams } from "@website/lib/plan/step"

export function stepOverviewRoute(variant: PlanVariant) {
  const plan = getPlan(variant)
  const generateStaticParams = stepStaticParams(variant)

  async function generateMetadata({ params }: { params: StepParams }): Promise<Metadata> {
    const { step, number } = await loadStep(variant, params)
    return { title: `${number} ${step.title}` }
  }

  async function StepOverview({ params }: { params: StepParams }) {
    const { step } = await loadStep(variant, params)
    const costs = plan.costsForStep(step.id)
    const extras = plan.extras[step.id]
    const changes = plan.changes.filter((c) => c.stepId === step.id)
    const dependents = plan.allSteps.filter((s) => s.dependsOn.includes(step.id))
    const riskCount = step.risks.length + (extras?.riskIds?.length ?? 0)
    const counts: Record<string, string> = {
      tasks: `${step.tasks.length} tasks`,
      design: `${extras?.decisionIds?.length ?? 0} decisions with alternatives`,
      costs: `${costs.length} cost items, each with its calculation`,
      tradeoffs: `${step.pros.length} pros · ${step.cons.length} cons · ${step.tradeoffs.length + (extras?.tradeoffIds?.length ?? 0)} trade-offs`,
      risks: `${riskCount} risks with mitigations`,
      changes: `${changes.length} existing laws, programs, or institutions changed`,
      international: `${(extras?.international.length ?? 0) + step.precedent.length} comparisons`,
    }

    return (
      <div>
        <p className="max-w-3xl text-lg leading-relaxed">{step.summary}</p>

        <div className="mt-6 grid gap-4 rounded-md border border-rule bg-card p-4 sm:grid-cols-3">
          {[
            ["Legal vehicle", step.legalVehicle],
            ["Who does it", step.owner],
            ["When", step.timeline],
          ].map(([k, val]) => (
            <div key={k}>
              <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                {k}
              </div>
              <div className="mt-0.5 text-sm">{val}</div>
            </div>
          ))}
        </div>

        {Boolean(step.cost.oneTime) || Boolean(step.cost.recurring) ? (
          <div className="mt-4 flex flex-wrap gap-6 rounded-md border border-rule bg-card p-4">
            {step.cost.oneTime ? (
              <div>
                <div className="text-xs text-muted-foreground uppercase">One-time cost</div>
                <div className="text-xl">
                  <B v={step.cost.oneTime} />
                </div>
              </div>
            ) : null}
            {step.cost.recurring ? (
              <div>
                <div className="text-xs text-muted-foreground uppercase">Recurring, per year</div>
                <div className="text-xl">
                  <B v={step.cost.recurring} sign />
                </div>
              </div>
            ) : null}
            <p className="basis-full text-sm text-foreground/80">{step.cost.ledgerNote}</p>
          </div>
        ) : null}

        <h2 className="mt-10 mb-3 text-xl font-semibold">In this step</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {plan
            .sectionsForStep(step.id)
            .filter((s) => s !== "")
            .map((s) => (
              <Link
                key={s}
                href={plan.stepHref(step.id, s)}
                className="rounded-md border border-rule bg-card p-4 hover:border-primary"
              >
                <div className="font-semibold">{SECTION_LABELS[s]}</div>
                <div className="text-sm text-muted-foreground">{counts[s]}</div>
              </Link>
            ))}
        </div>

        {costs.length > 0 && (
          <>
            <h2 className="mt-10 mb-3 text-xl font-semibold">Cost items</h2>
            <ul className="divide-y divide-rule rounded-md border border-rule bg-card">
              {costs.map((c) => (
                <li key={c.id}>
                  <Link
                    href={plan.costHref(step.id, c.id)}
                    className="flex items-baseline justify-between gap-4 px-4 py-2 hover:bg-secondary"
                  >
                    <span>{c.title}</span>
                    <span className="num shrink-0 text-sm">
                      {c.amountUnit === "B" ? (
                        <B v={c.amount} />
                      ) : (
                        `$${Math.round(c.amount).toLocaleString()}`
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {riskCount > 0 && extras?.riskIds?.length ? (
          <Callout tone="caution" title="Biggest risk for this step">
            {plan.risks.find((r) => r.id === extras.riskIds![0])?.title}.{" "}
            <Link className="underline" href={plan.stepHref(step.id, "risks")}>
              See risks.
            </Link>
          </Callout>
        ) : null}

        <div className="mt-10 grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <div className="mb-2 font-semibold">Depends on</div>
            {step.dependsOn.length ? (
              <ul className="space-y-1">
                {step.dependsOn.map((d) => (
                  <li key={d}>
                    <Link
                      className="underline decoration-rule underline-offset-2 hover:decoration-primary"
                      href={plan.stepHref(d)}
                    >
                      {plan.stepNumber[d]} {plan.stepById[d]?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nothing: this step can start first.</p>
            )}
          </div>
          <div>
            <div className="mb-2 font-semibold">Steps that depend on this one</div>
            {dependents.length ? (
              <ul className="space-y-1">
                {dependents.map((d) => (
                  <li key={d.id}>
                    <Link
                      className="underline decoration-rule underline-offset-2 hover:decoration-primary"
                      href={plan.stepHref(d.id)}
                    >
                      {plan.stepNumber[d.id]} {d.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">None.</p>
            )}
          </div>
        </div>
        <Sources ids={step.sourceIds} />
      </div>
    )
  }
  return { Page: StepOverview, generateStaticParams, generateMetadata }
}
