import { Table } from "@website/components/site/ui"
import Link from "next/link"
import type { Metadata } from "next"
import type { PlanVariant } from "@website/content/plan-bundle"
import { getPlan } from "@website/content/plans"
import { loadStep, stepStaticParams, type StepParams } from "@website/lib/plan/step"

export function tasksRoute(variant: PlanVariant) {
  const plan = getPlan(variant)
  const generateStaticParams = stepStaticParams(variant)

  async function generateMetadata({ params }: { params: StepParams }): Promise<Metadata> {
    const { step, number } = await loadStep(variant, params)
    return { title: `Tasks · ${number} ${step.title}` }
  }

  async function TasksPage({ params }: { params: StepParams }) {
    const { step, number } = await loadStep(variant, params)
    return (
      <div>
        <p className="mb-6 max-w-3xl text-foreground/80">
          Every concrete action this step requires, who is responsible, and when it happens relative
          to enactment.
        </p>
        <Table>
          <thead>
            <tr>
              <th className="w-16">#</th>
              <th>Action</th>
              <th className="w-44">Owner</th>
              <th className="w-36">When</th>
              <th>Trade-off</th>
            </tr>
          </thead>
          <tbody>
            {step.tasks.map((t, i) => (
              <tr key={t.action} id={`task-${i + 1}`}>
                <td className="num text-muted-foreground">
                  {number}.{i + 1}
                </td>
                <td>
                  <Link
                    href={plan.taskHref(step.id, i + 1)}
                    className="underline decoration-rule underline-offset-2 hover:decoration-primary"
                  >
                    {t.action}
                  </Link>
                </td>
                <td className="text-foreground/75">{t.owner}</td>
                <td className="text-foreground/75">{t.when}</td>
                <td className="text-sm text-foreground/80">{plan.taskTradeoffs[step.id][i]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
  return { Page: TasksPage, generateStaticParams, generateMetadata }
}
