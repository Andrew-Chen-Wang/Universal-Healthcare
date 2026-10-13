import { B, Page, PageHeader, Sources, Usd } from "@website/components/site/ui"
import { INVENTORY } from "@website/content/cost-inventory"
import { slug } from "@website/content/navigation"
import { PROBLEM_BY_ID, PROBLEMS } from "@website/content/problems"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Params = Promise<{ id: string }>

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  return { title: PROBLEM_BY_ID[id]?.title ?? "Problem" }
}

function List({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: "loss" | "caution" | "neutral"
}) {
  const styles = {
    loss: "border-loss/25 bg-loss-soft/50",
    caution: "border-caution/30 bg-caution-soft",
    neutral: "border-rule bg-card",
  }[tone]
  return (
    <div className={`rounded-md border p-4 ${styles}`}>
      <div className="mb-2 text-xs font-semibold tracking-wide uppercase">{title}</div>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  )
}

export default async function ProblemPage({ params }: { params: Params }) {
  const { id } = await params
  const p = PROBLEM_BY_ID[id]
  if (!p) notFound()
  const costs = INVENTORY.filter((i) => i.problemIds?.includes(p.id))
  const idx = PROBLEMS.findIndex((x) => x.id === id)
  const prev = PROBLEMS[idx - 1]
  const next = PROBLEMS[idx + 1]
  return (
    <Page>
      <PageHeader
        eyebrow={
          <Link href={`/problems#${slug(p.category)}`} className="hover:underline">
            Problem · {p.category}
          </Link>
        }
        title={p.title}
        lede={p.summary}
      />

      {p.evidence.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Evidence</h2>
          <ul className="space-y-3">
            {p.evidence.map((e) => (
              <li key={e.text} className="border-l-2 border-rule pl-4 text-sm">
                {e.text}
                <Sources ids={e.sourceIds} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <List title="Who is hurt" items={p.whoIsHurt} tone="loss" />
        <List title="Who profits from the status quo" items={p.whoProfits} tone="caution" />
        <List title="Root causes" items={p.rootCauses} tone="neutral" />
      </div>

      {costs.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Related costs</h2>
          <ul className="divide-y divide-rule rounded-md border border-rule bg-card">
            {costs.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/costs/${c.id}`}
                  className="flex items-baseline justify-between gap-4 px-4 py-2 hover:bg-secondary"
                >
                  <span>{c.label}</span>
                  <span className="shrink-0 text-sm">
                    {c.unit === "usdB" ? (
                      <B v={c.amount} />
                    ) : c.unit === "usd" ? (
                      <Usd v={c.amount} />
                    ) : (
                      c.amount.toLocaleString()
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-10 rounded-md border border-primary/30 bg-accent/50 p-5">
        <h2 className="mb-2 text-xl font-semibold">Open questions (solution paths to decide)</h2>
        <ul className="list-disc space-y-1 pl-5">
          {p.openQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Each answer becomes a solution path with its own trade-offs, recorded in Part 2.
        </p>
      </section>

      <nav className="mt-12 grid gap-3 border-t border-rule pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/problems/${prev.id}`}
            className="rounded-md border border-rule bg-card px-4 py-3 hover:border-primary"
          >
            <div className="text-xs text-muted-foreground">← Previous problem</div>
            <div className="font-medium">{prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/problems/${next.id}`}
            className="rounded-md border border-rule bg-card px-4 py-3 text-right hover:border-primary"
          >
            <div className="text-xs text-muted-foreground">Next problem →</div>
            <div className="font-medium">{next.title}</div>
          </Link>
        )}
      </nav>
    </Page>
  )
}
