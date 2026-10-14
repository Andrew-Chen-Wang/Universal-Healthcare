import { PathLink, ProblemChip, real, StatusPill } from "@website/components/site/paths"
import { EffectList, ImpactList } from "@website/components/site/effects"
import { B, Page, PageHeader, Sources, Usd } from "@website/components/site/ui"
import { INVENTORY_BY_ID } from "@website/content/cost-inventory"
import { effectsOf, impactsOf, isMigrated } from "@website/content/graph"
import {
  DECISION_BY_PATH,
  complementsOf,
  conflictsOf,
  PATH_BY_ID,
  PATHS,
  pathsFor,
  requiredBy,
} from "@website/content/paths"
import { PHASES } from "@website/content/plan"
import { PROBLEM_BY_ID } from "@website/content/problems"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Params = Promise<{ id: string }>

export function generateStaticParams() {
  return PATHS.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  return { title: PATH_BY_ID[id]?.title ?? "Solution path" }
}

function People({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  const list = real(items)
  return (
    <div className={`rounded-md border p-4 ${tone}`}>
      <div className="mb-2 text-xs font-semibold tracking-wide uppercase">{title}</div>
      {list.length ? (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {list.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">None identified.</p>
      )}
    </div>
  )
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-2">
      <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </div>
      {children}
    </div>
  )
}

export default async function PathPage({ params }: { params: Params }) {
  const { id } = await params
  const p = PATH_BY_ID[id]
  if (!p) notFound()
  const problem = PROBLEM_BY_ID[p.problemId]
  const siblings = pathsFor(p.problemId).filter((s) => s.id !== p.id)
  const requires = (p.requires ?? []).map((r) => PATH_BY_ID[r])
  const needed = requiredBy(p.id)
  const conflicts = conflictsOf(p.id)
  const complements = complementsOf(p.id)
  const created = [...(p.spawns ?? []), ...(p.worsens ?? [])]
  const decision = DECISION_BY_PATH[p.id]
  const phase = PHASES.find((ph) => ph.id === decision?.phase)
  const migrated = isMigrated(p)
  const effects = effectsOf(p)
  const impacts = impactsOf(p)

  return (
    <Page>
      <PageHeader
        eyebrow={
          <Link href={`/problems/${problem.id}`} className="hover:underline">
            Solution path · {problem.title}
          </Link>
        }
        title={p.title}
        lede={p.summary}
      />
      {decision && (
        <section className="mb-10 rounded-md border border-rule bg-card p-4 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">Draft decision:</span>
            <StatusPill status={p.status} />
            {phase && (
              <Link href={`/changes#${phase.id}`} className="underline">
                Phase {phase.number}: {phase.title}
              </Link>
            )}
            <span className="text-muted-foreground">
              Confidence: {decision.confidence} ·{" "}
              {decision.reviewed ? "reviewed" : "not yet reviewed"}
            </span>
          </div>
          <p className="mt-2">{decision.reason}</p>
          {decision.review && (
            <p className="mt-2 text-foreground/80">
              <span className="font-medium">To review:</span> {decision.review}
            </p>
          )}
          <Link href="/paths/ledger" className="mt-2 inline-block text-xs underline">
            Review ledger
          </Link>
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">How this path connects</h2>
        <div className="grid gap-6 rounded-md border border-rule bg-secondary/40 p-4 md:grid-cols-3">
          <Column title="Addresses">
            <ProblemChip id={p.problemId} tone="gain" />
            {p.solves?.map((s) => (
              <div key={s}>
                <ProblemChip id={s} tone="gain" />
              </div>
            ))}
          </Column>
          <Column title="This path">
            <div className="rounded-md border border-primary bg-card px-3 py-2 text-sm font-medium">
              {p.title}
            </div>
            {requires.length > 0 && <div className="text-xs text-muted-foreground">Requires:</div>}
            {requires.map((r) => (
              <PathLink key={r.id} path={r} />
            ))}
          </Column>
          <Column title="Creates or worsens">
            {created.length === 0 && (
              <p className="text-sm text-muted-foreground">No new problems identified.</p>
            )}
            {created.map((c) => (
              <div key={c} className="space-y-1">
                <ProblemChip id={c} tone="loss" />
                <ul className="ml-3 border-l border-rule pl-2 text-xs">
                  {pathsFor(c).map((sp) => (
                    <li key={sp.id}>
                      <Link
                        href={`/paths/${sp.id}`}
                        className="text-foreground/70 hover:text-primary hover:underline"
                      >
                        ↳ {sp.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Column>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-1 text-xl font-semibold">Concrete changes if chosen</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          What would actually have to change in law, agencies, payment rules, or systems.
        </p>
        <ol className="list-decimal space-y-1.5 rounded-md border border-rule bg-card py-3 pr-4 pl-9 text-sm">
          {p.changes?.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="mb-1 text-xl font-semibold">Effects</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          {migrated
            ? "Each effect has its own page: the evidence, the case that it is or isn't a real cost, and whom it affects."
            : "This path's effects are still free text; it has not yet been linked into the effects graph."}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <EffectList title="What it fixes" effects={effects.fixes} tone="gain" />
          <EffectList
            title="What it creates or worsens"
            effects={effects.harms}
            tone="loss"
            showFixes
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Who&apos;s affected</h2>
        <div className={`grid gap-4 ${migrated ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          <ImpactList title="Who gains" impacts={impacts.gains} tone="gain" />
          <ImpactList title="Who loses" impacts={impacts.loses} tone="loss" />
          {!migrated && (
            <People
              title="How to mend the losers"
              items={p.mend ?? []}
              tone="border-rule bg-card"
            />
          )}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Where it has been tried</h2>
        <ul className="space-y-3">
          {p.precedents.map((pr) => (
            <li key={pr.place + pr.note} className="border-l-2 border-rule pl-4 text-sm">
              <span className="font-medium">{pr.place}:</span> {pr.note}
              {pr.sourceIds && <Sources ids={pr.sourceIds} />}
            </li>
          ))}
        </ul>
      </section>

      {(p.costIds?.length ?? 0) > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Costs this path changes</h2>
          <ul className="divide-y divide-rule rounded-md border border-rule bg-card">
            {p.costIds?.map((cid) => {
              const c = INVENTORY_BY_ID[cid]
              return (
                <li key={cid}>
                  <Link
                    href={`/costs/${cid}`}
                    className="flex justify-between gap-4 px-4 py-2 hover:bg-secondary"
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
              )
            })}
          </ul>
        </section>
      )}

      {[
        ["Conflicts with (choose one or the other)", conflicts],
        ["Works well with", complements],
        ["Other paths that depend on this one", needed],
        [`Other paths for “${problem.title}”`, siblings],
      ].map(([title, list]) =>
        (list as typeof siblings).length ? (
          <section key={title as string} className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">{title as string}</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {(list as typeof siblings).map((s) => (
                <PathLink key={s.id} path={s} />
              ))}
            </div>
          </section>
        ) : null,
      )}
    </Page>
  )
}
