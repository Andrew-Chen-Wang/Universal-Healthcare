import { Page, PageHeader, PlanVersionNotice } from "@website/components/site/ui"
import { CHOSEN, DECISION_BY_PATH } from "@website/content/paths"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { PlanVariant } from "@website/content/plan-bundle"
import { getPlan } from "@website/content/plans"

export function phaseRoute(variant: PlanVariant) {
  const plan = getPlan(variant)
  function generateStaticParams() {
    return plan.phases.map((p) => ({ phase: p.id }))
  }

  async function generateMetadata({
    params,
  }: {
    params: Promise<{ phase: string }>
  }): Promise<Metadata> {
    const { phase } = await params
    const p = plan.phases.find((x) => x.id === phase)
    return { title: p ? `Phase ${p.number}: ${p.title}` : "Phase" }
  }

  async function PhasePage({ params }: { params: Promise<{ phase: string }> }) {
    const { phase } = await params
    const p = plan.phases.find((x) => x.id === phase)
    const nav = plan.nav.find((x) => x.id === phase)
    if (!p || !nav) notFound()
    const chosen = CHOSEN.filter((x) => DECISION_BY_PATH[x.id]?.phase === p.id)
    const changeCount = chosen.reduce((n, x) => n + (x.changes?.length ?? 0), 0)
    return (
      <Page>
        <PageHeader eyebrow={`Phase ${p.number} · ${p.window}`} title={p.title} lede={p.goal}>
          <div className="mt-6 rounded-md border border-rule bg-card p-4">
            <div className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Done when
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {p.exitCriteria.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </PageHeader>
        <PlanVersionNotice variant={variant} />
        {variant === "hybrid" && (
          <section className="mb-8 rounded-md border border-rule bg-card p-4">
            <h2 className="text-lg font-semibold">
              Changes from chosen paths in this phase: {changeCount}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {chosen.length} chosen solution paths (draft picks awaiting review) land in this
              phase.{" "}
              <Link href={`/changes#${p.id}`} className="underline">
                See every change
              </Link>
              .
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {chosen.map((x) => (
                <li key={x.id}>
                  <Link
                    href={`/paths/${x.id}`}
                    className="inline-block rounded-sm border border-rule px-2 py-0.5 text-xs hover:border-primary"
                  >
                    {x.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <h2 className="mb-3 text-lg font-semibold">Detailed steps</h2>
        <ol className="space-y-3">
          {p.steps.map((s, i) => (
            <li key={s.id}>
              <Link
                href={nav.steps[i].href}
                className="block rounded-md border border-rule bg-card p-4 hover:border-primary"
              >
                <div className="flex gap-3">
                  <span className="num text-muted-foreground">{nav.steps[i].number}</span>
                  <div>
                    <div className="font-serif text-lg font-semibold">{s.title}</div>
                    <p className="mt-1 text-sm text-foreground/75">{s.summary}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {s.tasks.length} tasks · {plan.costsForStep(s.id).length} cost items ·{" "}
                      {s.timeline}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Page>
    )
  }
  return { Page: PhasePage, generateStaticParams, generateMetadata }
}
