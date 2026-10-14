import { B, Pill, Table } from "@website/components/site/ui"
import { type Disposition } from "@website/content/changes"
import Link from "next/link"
import type { Metadata } from "next"
import type { PlanVariant } from "@website/content/plan-bundle"
import { getPlan } from "@website/content/plans"
import { loadStep, stepStaticParams, type StepParams } from "@website/lib/plan/step"

export function changesRoute(variant: PlanVariant) {
  const plan = getPlan(variant)
  const generateStaticParams = stepStaticParams(variant)

  async function generateMetadata({ params }: { params: StepParams }): Promise<Metadata> {
    const { step, number } = await loadStep(variant, params)
    return { title: `System changes · ${number} ${step.title}` }
  }

  const TONE: Record<Disposition, "neutral" | "gain" | "loss" | "caution" | "primary"> = {
    ends: "loss",
    replaced: "caution",
    absorbed: "primary",
    amended: "neutral",
    continues: "neutral",
    new: "gain",
    expanded: "gain",
  }

  async function ChangesPage({ params }: { params: StepParams }) {
    const { step } = await loadStep(variant, params)
    const changes = plan.changes.filter((c) => c.stepId === step.id)
    return (
      <div>
        <p className="mb-6 max-w-3xl text-foreground/80">
          Every existing law, program, institution, or practice this step changes: what it is today,
          what happens to it, when, and what that costs or trades off.
        </p>
        <Table>
          <thead>
            <tr>
              <th>What</th>
              <th>Today</th>
              <th>Change</th>
              <th>Trade-off</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((c) => (
              <tr key={c.id} id={c.id}>
                <td className="min-w-48">
                  <Link
                    href={`${plan.stepHref(step.id, "changes")}/${c.id}`}
                    className="font-medium underline decoration-rule underline-offset-2 hover:decoration-primary"
                  >
                    {c.item}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Pill tone={TONE[c.disposition]}>{c.disposition}</Pill>
                    <Pill>{c.when}</Pill>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.area}</div>
                </td>
                <td className="text-sm text-foreground/80">{c.today}</td>
                <td className="text-sm">
                  {c.change}
                  {c.costIds?.map((id) => {
                    const cost = plan.costById[id]
                    return (
                      <div key={id} className="mt-1 text-xs">
                        <Link
                          className="underline decoration-rule underline-offset-2"
                          href={plan.costHref(cost.stepId, id)}
                        >
                          {cost.title}
                        </Link>{" "}
                        {cost.before !== undefined && cost.after !== undefined ? (
                          <span className="text-muted-foreground">
                            <B v={cost.before} /> → <B v={cost.after} />
                          </span>
                        ) : null}
                      </div>
                    )
                  })}
                </td>
                <td className="text-sm text-foreground/80">{c.tradeoff}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
  return { Page: ChangesPage, generateStaticParams, generateMetadata }
}
