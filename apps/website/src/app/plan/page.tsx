import { Callout, Page, PageHeader } from "@website/components/site/ui"
import { costsForStep } from "@website/content/calculations"
import { NAV } from "@website/content/navigation"
import { PHASES } from "@website/content/plan"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Changes by phase" }

export default function ChangesPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Part 2"
        title="Changes by phase"
        lede="Every change to the system, grouped into phases. Each change has its tasks, design choices and alternatives, costs with calculations, trade-offs, risks, the existing laws and institutions it affects, and comparisons with other countries. Political feasibility is deliberately set aside."
      />
      <Callout tone="caution" title="Draft">
        The steps below are the detailed build-out of the plan. The full list of concrete changes
        from every chosen solution path is on{" "}
        <Link href="/changes" className="underline">
          Changes by phase
        </Link>
        . The picks are drafts awaiting review in the{" "}
        <Link href="/paths/ledger" className="underline">
          review ledger
        </Link>
        .
      </Callout>
      {PHASES.map((p) => {
        const nav = NAV.find((x) => x.id === p.id)!
        return (
          <section key={p.id} className="mb-10">
            <h2 className="text-2xl font-semibold">
              <Link href={`/plan/${p.id}`} className="hover:underline">
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
                        {s.tasks.length} tasks · {costsForStep(s.id).length} cost items
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
