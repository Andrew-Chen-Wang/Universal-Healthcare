import { Page, PageHeader } from "@website/components/site/ui"
import { costsForStep } from "@website/content/calculations"
import { NAV } from "@website/content/navigation"
import { PHASES } from "@website/content/plan"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return PHASES.map((p) => ({ phase: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ phase: string }>
}): Promise<Metadata> {
  const { phase } = await params
  const p = PHASES.find((x) => x.id === phase)
  return { title: p ? `Phase ${p.number}: ${p.title}` : "Phase" }
}

export default async function PhasePage({ params }: { params: Promise<{ phase: string }> }) {
  const { phase } = await params
  const p = PHASES.find((x) => x.id === phase)
  const nav = NAV.find((x) => x.id === phase)
  if (!p || !nav) notFound()
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
                    {s.tasks.length} tasks · {costsForStep(s.id).length} cost items · {s.timeline}
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
