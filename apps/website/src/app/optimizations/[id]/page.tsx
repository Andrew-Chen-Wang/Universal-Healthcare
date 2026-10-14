import { ProblemChip } from "@website/components/site/paths"
import { Callout, Page, PageHeader, Sources } from "@website/components/site/ui"
import { OPTIMIZATION_BY_ID, OPTIMIZATIONS } from "@website/content/optimizations"
import type { Reading } from "@website/content/problems"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Params = Promise<{ id: string }>

export function generateStaticParams() {
  return OPTIMIZATIONS.map((o) => ({ id: o.id }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  return { title: OPTIMIZATION_BY_ID[id]?.title ?? "Optimization" }
}

function Readings({
  title,
  items,
  tone,
}: {
  title: string
  items: Reading[]
  tone: "gain" | "loss"
}) {
  return (
    <div
      className={`rounded-md border p-4 ${tone === "gain" ? "border-gain/25 bg-gain-soft/40" : "border-loss/25 bg-loss-soft/40"}`}
    >
      <div className="mb-3 text-xs font-semibold tracking-wide uppercase">{title}</div>
      <ul className="space-y-4 text-sm">
        {items.map((r) => (
          <li key={r.text}>
            {r.text}
            {r.sourceIds && <Sources ids={r.sourceIds} />}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function OptimizationPage({ params }: { params: Params }) {
  const { id } = await params
  const o = OPTIMIZATION_BY_ID[id]
  if (!o) notFound()

  return (
    <Page>
      <PageHeader
        eyebrow={
          <Link href="/optimizations" className="hover:underline">
            Optimizations for any system · {o.lens}
          </Link>
        }
        title={o.title}
        lede={o.summary}
      />

      <Callout title="Works under any approach">{o.anySystem}</Callout>

      <section className="mt-10 mb-10">
        <h2 className="mb-3 text-2xl font-semibold">What it takes</h2>
        <ul className="list-disc space-y-1 pl-5">
          {o.how.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      {o.size && (
        <section className="mb-10">
          <h2 className="mb-3 text-2xl font-semibold">How much is at stake</h2>
          <p className="max-w-3xl">{o.size.text}</p>
          {o.size.sourceIds && <Sources ids={o.size.sourceIds} />}
        </section>
      )}

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <Readings title="Evidence for" items={o.evidenceFor} tone="gain" />
        <Readings title="Evidence against and limits" items={o.evidenceAgainst} tone="loss" />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-2xl font-semibold">Where it's been tried</h2>
        <ul className="space-y-3">
          {o.precedents.map((p) => (
            <li key={p.place}>
              <span className="font-medium">{p.place}:</span> {p.note}
              {p.sourceIds && <Sources ids={p.sourceIds} />}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-2xl font-semibold">Trade-offs</h2>
        <ul className="list-disc space-y-1 pl-5">
          {o.tradeoffs.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-2xl font-semibold">Problems it helps</h2>
        <div className="flex flex-wrap gap-1.5">
          {o.helps.map((pid) => (
            <ProblemChip key={pid} id={pid} />
          ))}
        </div>
      </section>
    </Page>
  )
}
