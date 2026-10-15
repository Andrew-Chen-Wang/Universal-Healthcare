import { Callout, Page, PageHeader, PlanVersionNotice } from "@website/components/site/ui"
import type { Metadata } from "next"
import Link from "next/link"
import type { PlanVariant } from "@website/content/plan-bundle"
import { getPlan } from "@website/content/plans"

export function planIndexRoute(variant: PlanVariant) {
  const plan = getPlan(variant)
  const metadata: Metadata = { title: "Changes by phase" }

  function ChangesPage() {
    return (
      <Page>
        <PageHeader
          eyebrow="Part 2"
          title="Changes by phase"
          lede="Every change to the system, grouped into phases. Each change has its tasks, design choices and alternatives, costs with calculations, trade-offs, risks, the existing laws and institutions it affects, and comparisons with other countries. Political feasibility is deliberately set aside."
        />
        <PlanVersionNotice variant={variant} />
        <Callout tone="caution" title="Draft">
          The steps below are the detailed build-out of the plan. The full list of concrete changes
          from every chosen solution path is on{" "}
          <Link
            href={variant === "hybrid" ? "/changes" : "/single-payer/changes"}
            className="underline"
          >
            Changes by phase
          </Link>
          . The picks are drafts awaiting review in the{" "}
          <Link href="/paths/ledger" className="underline">
            review ledger
          </Link>
          .
        </Callout>
        {plan.phases.map((p) => {
          const nav = plan.nav.find((x) => x.id === p.id)!
          return (
            <section key={p.id} className="mb-10">
              <h2 className="text-2xl font-semibold">
                <Link href={`${plan.base}/${p.id}`} className="hover:underline">
                  Phase {p.number}: {p.title}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.window}</p>
              <p className="mt-2 text-foreground/80">{p.goal}</p>
              <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                {p.steps.map((s, i) => (
                  <li key={s.id}>
                    <Link
                      href={nav.steps[i].href}
                      className="flex gap-2 rounded-md border border-rule bg-card px-3 py-2 text-sm hover:border-primary"
                    >
                      <span className="num text-muted-foreground">{nav.steps[i].number}</span>
                      <span>
                        {s.title}
                        <span className="block text-xs text-muted-foreground">
                          {s.tasks.length} tasks · {plan.costsForStep(s.id).length} cost items
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
      </Page>
    )
  }
  return { Page: ChangesPage, metadata }
}
