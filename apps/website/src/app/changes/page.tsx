import { Callout, Page, PageHeader, Stat } from "@website/components/site/ui"
import { CHOSEN, DECISION_BY_PATH } from "@website/content/paths"
import { HYBRID_PLAN } from "@website/content/plans"
import { PROBLEM_BY_ID } from "@website/content/problems"
import type { Metadata } from "next"
import Link from "next/link"

const PHASES = HYBRID_PLAN.phases

export const metadata: Metadata = { title: "Changes by phase" }

export default function ChangesPage() {
  const total = CHOSEN.reduce((n, p) => n + (p.changes?.length ?? 0), 0)
  return (
    <Page>
      <PageHeader
        eyebrow="Part 2 · Changes by phase"
        title="Every change, in order"
        lede="The concrete changes required by every chosen solution path, grouped by the phase in which they happen. Choices are drafts awaiting review, so this list changes when a pick is flipped."
      />
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Chosen paths" value={CHOSEN.length.toString()} />
        <Stat label="Concrete changes" value={total.toString()} />
        <Stat label="Phases" value={PHASES.length.toString()} />
      </div>
      <Callout title="Draft" tone="caution">
        Every pick behind this list is unreviewed. See the{" "}
        <Link href="/paths/ledger" className="underline">
          review ledger
        </Link>
        .
      </Callout>
      <nav aria-label="Phases" className="mb-10 flex flex-wrap gap-2">
        {PHASES.map((ph) => (
          <a
            key={ph.id}
            href={`#${ph.id}`}
            className="rounded-sm border border-rule bg-card px-3 py-2 text-sm hover:border-primary"
          >
            {ph.number}. {ph.title}
          </a>
        ))}
      </nav>
      {PHASES.map((ph) => {
        const paths = CHOSEN.filter((p) => DECISION_BY_PATH[p.id]?.phase === ph.id)
        const n = paths.reduce((k, p) => k + (p.changes?.length ?? 0), 0)
        return (
          <section key={ph.id} id={ph.id} className="mb-12 scroll-mt-20">
            <h2 className="text-2xl font-semibold">
              Phase {ph.number}: {ph.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {ph.window} · {paths.length} paths · {n} changes ·{" "}
              <Link href={`/plan/${ph.id}`} className="underline">
                phase detail
              </Link>
            </p>
            <p className="mt-2 max-w-3xl text-sm">{ph.goal}</p>
            <div className="mt-4 space-y-4">
              {paths.map((p) => (
                <div key={p.id} className="rounded-md border border-rule bg-card p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link
                      href={`/paths/${p.id}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {p.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      For: {PROBLEM_BY_ID[p.problemId]?.title}
                    </span>
                  </div>
                  <ol className="mt-2 list-decimal space-y-1 pl-6 text-sm">
                    {p.changes?.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </Page>
  )
}
