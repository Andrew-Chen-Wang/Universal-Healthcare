import { type GroupRow, GroupScenario } from "@website/components/site/scenario"
import { Page, PageHeader, Sources } from "@website/components/site/ui"
import { causersOf, fixersOf, GROUP_BY_ID, GROUPS, problemsFor } from "@website/content/graph"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Params = Promise<{ id: string }>

export function generateStaticParams() {
  return GROUPS.map((g) => ({ id: g.id }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  return { title: GROUP_BY_ID[id]?.label ?? "Group" }
}

export default async function GroupPage({ params }: { params: Params }) {
  const { id } = await params
  const g = GROUP_BY_ID[id]
  if (!g) notFound()
  const links = problemsFor(g.id)
  const rows: GroupRow[] = links.map((l) => ({
    problemId: l.problem.id,
    title: l.problem.title,
    kind: l.kind,
    how: l.how,
    causers: causersOf(l.problem.id).map((p) => ({ id: p.id, title: p.title })),
    fixers: fixersOf(l.problem.id).map((p) => ({ id: p.id, title: p.title })),
  }))
  const hurts = links.filter((l) => l.kind === "hurts")
  const profits = links.filter((l) => l.kind === "profits")
  return (
    <Page>
      <PageHeader
        eyebrow={
          <Link href="/groups" className="hover:underline">
            Who&apos;s affected
          </Link>
        }
        title={g.label}
        lede={g.summary}
      />
      {g.size && (
        <div className="-mt-4 mb-8 text-sm">
          <span className="font-medium">Size:</span> {g.size.text}
          <Sources ids={g.size.sourceIds} />
        </div>
      )}

      <GroupScenario label={g.label} rows={rows} />

      <section className="mb-10 grid gap-4 md:grid-cols-2">
        {[
          [
            "Problems that hurt them",
            "Paths that fix these help them.",
            hurts,
            "border-loss/25 bg-loss-soft/40",
          ],
          [
            "Problems they gain from",
            "Paths that fix these cost them.",
            profits,
            "border-caution/30 bg-caution-soft",
          ],
        ].map(([title, hint, list, tone]) => (
          <div key={title as string} className={`rounded-md border p-4 ${tone as string}`}>
            <div className="text-xs font-semibold tracking-wide uppercase">{title as string}</div>
            <p className="mb-3 text-xs text-muted-foreground">{hint as string}</p>
            {(list as typeof links).length === 0 ? (
              <p className="text-sm text-muted-foreground">None linked yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {(list as typeof links).map((l) => (
                  <li key={l.problem.id}>
                    <Link
                      href={`/problems/${l.problem.id}`}
                      className="font-medium underline decoration-rule underline-offset-2 hover:text-primary"
                    >
                      {l.problem.title}
                    </Link>
                    <span className="text-foreground/80">: {l.how}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    </Page>
  )
}
