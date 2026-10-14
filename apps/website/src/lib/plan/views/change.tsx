import { B, Pill } from "@website/components/site/ui"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { PlanVariant } from "@website/content/plan-bundle"
import { getPlan } from "@website/content/plans"
import { loadStep } from "@website/lib/plan/step"

export function changeRoute(variant: PlanVariant) {
  const plan = getPlan(variant)
  type Params = Promise<{ phase: string; step: string; change: string }>

  function generateStaticParams() {
    return plan.changes
      .map((c) => ({
        phase: plan.stepById[c.stepId].phase.id,
        step: c.stepId,
        change: c.id,
      }))
      .filter((p) => plan.phases.some((ph) => ph.id === p.phase))
  }

  async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { change } = await params
    return { title: plan.changes.find((c) => c.id === change)?.item ?? "Change" }
  }

  async function ChangePage({ params }: { params: Params }) {
    const { step } = await loadStep(variant, params)
    const { change } = await params
    const c = plan.changes.find((x) => x.id === change && x.stepId === step.id)
    if (!c) notFound()
    return (
      <article>
        <Link href={plan.stepHref(step.id, "changes")} className="text-sm text-primary underline">
          ← All system changes for this step
        </Link>
        <h2 className="mt-3 text-2xl font-semibold">{c.item}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Pill tone="primary">{c.disposition}</Pill>
          <Pill>{c.when}</Pill>
          <Pill>{c.area}</Pill>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-rule bg-card p-4">
            <div className="mb-1 text-xs font-semibold text-muted-foreground uppercase">Today</div>
            <p>{c.today}</p>
          </div>
          <div className="rounded-md border border-primary/30 bg-accent/50 p-4">
            <div className="mb-1 text-xs font-semibold text-accent-foreground uppercase">
              Under the plan
            </div>
            <p>{c.change}</p>
          </div>
        </div>
        <div className="mt-4 rounded-md border border-caution/30 bg-caution-soft p-4">
          <div className="mb-1 text-xs font-semibold text-caution uppercase">Trade-off</div>
          <p>{c.tradeoff}</p>
        </div>
        {c.costIds && c.costIds.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 font-semibold">Money</div>
            <ul className="divide-y divide-rule rounded-md border border-rule bg-card">
              {c.costIds.map((id) => {
                const cost = plan.costById[id]
                return (
                  <li key={id} className="flex items-baseline justify-between gap-4 px-4 py-2">
                    <Link
                      className="underline decoration-rule underline-offset-2"
                      href={plan.costHref(cost.stepId, id)}
                    >
                      {cost.title}
                    </Link>
                    {cost.before !== undefined && cost.after !== undefined ? (
                      <span className="text-sm">
                        <B v={cost.before} /> → <B v={cost.after} />
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </article>
    )
  }
  return { Page: ChangePage, generateStaticParams, generateMetadata }
}
