import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { PlanVariant } from "@website/content/plan-bundle"
import { getPlan } from "@website/content/plans"
import { loadStep } from "@website/lib/plan/step"

export function taskRoute(variant: PlanVariant) {
  const plan = getPlan(variant)
  type Params = Promise<{ phase: string; step: string; task: string }>

  function generateStaticParams() {
    return plan.phases.flatMap((p) =>
      p.steps.flatMap((s) =>
        s.tasks.map((_, i) => ({ phase: p.id, step: s.id, task: String(i + 1) })),
      ),
    )
  }

  async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { step, task } = await params
    return { title: `Task ${plan.stepNumber[step]}.${task}` }
  }

  async function TaskPage({ params }: { params: Params }) {
    const { step, number } = await loadStep(variant, params)
    const { task } = await params
    const n = Number(task)
    const t = step.tasks[n - 1]
    if (!t) notFound()
    const tradeoff = plan.taskTradeoffs[step.id][n - 1]
    const changes = plan.changes.filter((c) => c.stepId === step.id)
    return (
      <article>
        <Link href={plan.stepHref(step.id, "tasks")} className="text-sm text-primary underline">
          ← All tasks for this step
        </Link>
        <div className="num mt-4 text-sm text-muted-foreground">
          Task {number}.{n} of {step.tasks.length}
        </div>
        <h2 className="mt-1 max-w-3xl text-2xl leading-snug font-semibold">{t.action}</h2>
        <div className="mt-6 grid gap-4 rounded-md border border-rule bg-card p-4 sm:grid-cols-2">
          <div>
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Who does it
            </div>
            <div className="mt-0.5 text-sm">{t.owner}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              When
            </div>
            <div className="mt-0.5 text-sm">{t.when}</div>
          </div>
        </div>
        <div className="mt-6 rounded-md border border-caution/30 bg-caution-soft p-4">
          <div className="mb-1 text-xs font-semibold tracking-wide text-caution uppercase">
            Trade-off
          </div>
          <p>{tradeoff}</p>
        </div>
        <div className="mt-8 text-sm">
          <div className="mb-2 font-semibold">Part of: {step.title}</div>
          <p className="max-w-3xl text-foreground/80">{step.summary}</p>
          {changes.length > 0 && (
            <p className="mt-3 text-foreground/80">
              This step changes {changes.length} existing laws, programs, or institutions.{" "}
              <Link className="underline" href={plan.stepHref(step.id, "changes")}>
                See the list.
              </Link>
            </p>
          )}
        </div>
        <nav className="mt-10 flex justify-between gap-4 text-sm">
          {n > 1 ? (
            <Link className="underline" href={plan.taskHref(step.id, n - 1)}>
              ← Task {number}.{n - 1}
            </Link>
          ) : (
            <span />
          )}
          {n < step.tasks.length && (
            <Link className="underline" href={plan.taskHref(step.id, n + 1)}>
              Task {number}.{n + 1} →
            </Link>
          )}
        </nav>
      </article>
    )
  }
  return { Page: TaskPage, generateStaticParams, generateMetadata }
}
