import { ProblemChip } from "@website/components/site/paths"
import { Page, PageHeader, Sources } from "@website/components/site/ui"
import { PROBLEM_BY_ID } from "@website/content/problems"
import { COUNTERWEIGHTS, REASONS } from "@website/content/why"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Why universal health care",
  description:
    "The reasons for universal health care, from coverage and medical debt to business creation and small-business hiring, with the evidence for each.",
}

export default function WhyPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="The case"
        title="Why universal health care"
        lede="The main reasons to cover everyone, each with its evidence. Every reason links to the problem pages behind it, and the costs and risks are at the end so the case can be weighed, not just read."
      />
      <nav aria-label="Reasons" className="mb-10">
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {REASONS.map((r) => (
            <li key={r.id}>
              <a
                href={`#${r.id}`}
                className="underline decoration-rule underline-offset-2 hover:text-primary"
              >
                {r.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {REASONS.map((r, i) => {
        const evidence = [
          ...r.problems.flatMap((id) => PROBLEM_BY_ID[id].evidence),
          ...(r.evidence ?? []),
        ]
        return (
          <section key={r.id} id={r.id} className="mb-12 scroll-mt-6">
            <h2 className="mb-2 text-2xl font-semibold">{`${i + 1}. ${r.title}`}</h2>
            <p className="mb-4 max-w-prose">{r.body}</p>
            <ul className="space-y-3">
              {evidence.map((e) => (
                <li key={e.text} className="border-l-2 border-rule pl-4 text-sm">
                  {e.text}
                  <Sources ids={e.sourceIds} />
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">More on:</span>
              {r.problems.map((id) => (
                <ProblemChip key={id} id={id} />
              ))}
            </div>
          </section>
        )
      })}

      <section className="mb-10 rounded-md border border-rule bg-card p-5">
        <h2 className="mb-2 text-xl font-semibold">What it costs, and what could go wrong</h2>
        <p className="mb-3 text-sm">
          Universal coverage has real costs. Each page below gives the case that it is a serious
          cost and the case that it isn&apos;t, with sources.
        </p>
        <ul className="mb-3 space-y-1 text-sm">
          {COUNTERWEIGHTS.map((id) => (
            <li key={id}>
              <Link
                href={`/problems/${id}`}
                className="underline decoration-rule underline-offset-2 hover:text-primary"
              >
                {PROBLEM_BY_ID[id].title}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm">
          For the full price tag, see the{" "}
          <Link href="/costs" className="underline">
            cost ledger
          </Link>
          , and to weigh the options yourself, try{" "}
          <Link href="/your-plan" className="underline">
            Build your plan
          </Link>
          .
        </p>
      </section>
    </Page>
  )
}
