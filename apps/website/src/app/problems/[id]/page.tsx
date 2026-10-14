import { PathCard, PathLink, ProblemChip } from "@website/components/site/paths"
import { type MiniPath, ProblemScenario } from "@website/components/site/scenario"
import { B, Page, PageHeader, Sources, Usd } from "@website/components/site/ui"
import { INVENTORY } from "@website/content/cost-inventory"
import { slug } from "@website/content/navigation"
import { fixersOf, GROUP_BY_ID } from "@website/content/graph"
import {
  alsoSolvedBy,
  createdBy,
  pathsFor,
  type SolutionPath,
  worsenedBy,
} from "@website/content/paths"
import { type GroupLink, PROBLEM_BY_ID, PROBLEMS, type Reading } from "@website/content/problems"
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

const mini = (x: SolutionPath): MiniPath => ({ id: x.id, title: x.title })

function Readings({
  title,
  items,
  tone,
}: {
  title: string
  items: Reading[]
  tone: "loss" | "neutral"
}) {
  return (
    <div
      className={`rounded-md border p-4 ${tone === "loss" ? "border-loss/25 bg-loss-soft/40" : "border-rule bg-card"}`}
    >
      <div className="mb-3 text-xs font-semibold tracking-wide uppercase">{title}</div>
      <ul className="space-y-4 text-sm">
        {items.map((r) => (
          <li key={r.text}>
            {r.text}
            {(r.problems?.length ?? 0) > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {r.problems?.map((id) => (
                  <ProblemChip key={id} id={id} />
                ))}
              </div>
            )}
            {r.sourceIds && <Sources ids={r.sourceIds} />}
          </li>
        ))}
      </ul>
    </div>
  )
}

function GroupLinks({
  title,
  links,
  tone,
}: {
  title: string
  links: GroupLink[]
  tone: "loss" | "caution"
}) {
  return (
    <div
      className={`rounded-md border p-4 ${tone === "loss" ? "border-loss/25 bg-loss-soft/50" : "border-caution/30 bg-caution-soft"}`}
    >
      <div className="mb-2 text-xs font-semibold tracking-wide uppercase">{title}</div>
      {links.length === 0 ? (
        <p className="text-sm text-muted-foreground">None identified.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {links.map((l) => (
            <li key={l.group}>
              <Link
                href={`/groups/${l.group}`}
                className="font-medium underline decoration-rule underline-offset-2 hover:text-primary"
              >
                {GROUP_BY_ID[l.group].label}
              </Link>
              <span className="text-foreground/80">: {l.how}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default async function ProblemPage({ params }: { params: Params }) {
  const { id } = await params
  const p = PROBLEM_BY_ID[id]
  if (!p) notFound()
  const costs = INVENTORY.filter((i) => i.problemIds?.includes(p.id))
  const paths = pathsFor(p.id)
  const also = alsoSolvedBy(p.id)
  const causes = [...createdBy(p.id), ...worsenedBy(p.id)]
  const derived = causes.length > 0
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

      {p.debate && (
        <section className="mb-10">
          <h2 className="mb-1 text-xl font-semibold">
            Is it really a {derived ? "cost" : "problem"}?
          </h2>
          <p className="mb-3 text-sm text-muted-foreground">
            The arguments on each side, with sources. Whether it matters depends on whom you ask.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Readings title="The case that it is" items={p.debate.is} tone="loss" />
            <Readings
              title="The case that it isn't, or matters less"
              items={p.debate.isNot}
              tone="neutral"
            />
          </div>
        </section>
      )}

      {(p.hurts ?? p.profits) && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Who&apos;s affected</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <GroupLinks title="Who is hurt" links={p.hurts ?? []} tone="loss" />
            <GroupLinks title="Who gains while it lasts" links={p.profits ?? []} tone="caution" />
          </div>
        </section>
      )}

      <ProblemScenario causers={causes.map(mini)} fixers={fixersOf(p.id).map(mini)} />

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {p.whoIsHurt && <List title="Who is hurt" items={p.whoIsHurt} tone="loss" />}
        {p.whoProfits && (
          <List title="Who profits from the status quo" items={p.whoProfits} tone="caution" />
        )}
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
        <h2 className="mb-2 text-xl font-semibold">Open questions</h2>
        <ul className="list-disc space-y-1 pl-5">
          {p.openQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>

      {causes.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-1 text-xl font-semibold">Caused or worsened by these paths</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            This problem only matters if one of these paths is chosen.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {causes.map((c) => (
              <PathLink key={c.id} path={c} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-1 text-xl font-semibold">Solution paths ({paths.length})</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Open a path for what it fixes, what it creates or worsens, who gains and who loses,
          precedents, and how it connects to other paths.{" "}
          <Link href="/paths" className="underline">
            See all paths as a decision tree.
          </Link>
        </p>
        <div className="space-y-3">
          {paths.map((x) => (
            <PathCard key={x.id} path={x} />
          ))}
        </div>
      </section>

      {also.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Also addressed by paths for other problems</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {also.map((x) => (
              <PathLink key={x.id} path={x} />
            ))}
          </div>
        </section>
      )}

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
