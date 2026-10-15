import { PathLink, ProblemChip, real, ScalePill, StatusPill } from "@website/components/site/paths"
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
  SINGLE_PAYER_PHASE,
  SINGLE_PAYER_PICKS,
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
  const inSinglePayer = SINGLE_PAYER_PICKS.includes(p.id)
  const spPhase = PHASES.find((ph) => ph.id === SINGLE_PAYER_PHASE[p.id])
  const migrated = isMigrated(p)
  const effects = effectsOf(p)
  const impacts = impactsOf(p)
  const keeps = p.role === "keeps"

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
      <div className="-mt-4 mb-8 flex flex-wrap items-center gap-2 text-sm">
        <ScalePill scale={p.scale} />
        <Link href="/approaches" className="text-muted-foreground underline">
          Compare approaches, from no change to the largest
        </Link>
      </div>
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
      {(inSinglePayer || p.id === "single-payer") && (
        <section className="mb-10 rounded-md border border-rule bg-card p-4 text-sm">
          <span className="font-semibold">In the single-payer plan:</span>{" "}
          {p.id === "single-payer" ? (
            <>
              built out as a complete alternative to the current draft, with every step, cost, and
              change:{" "}
              <Link href="/single-payer/plan" className="underline">
                the single-payer plan
              </Link>
              .
            </>
          ) : (
            <>
              chosen
              {spPhase && (
                <>
                  ,{" "}
                  <Link href={`/single-payer/changes#${spPhase.id}`} className="underline">
                    Phase {spPhase.number}: {spPhase.title}
                  </Link>
                </>
              )}
              . See{" "}
              <Link href="/single-payer/plan" className="underline">
                the single-payer plan
              </Link>
              .
            </>
          )}
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">How this path connects</h2>
        <div className="grid gap-6 rounded-md border border-rule bg-secondary/40 p-4 md:grid-cols-3">
          <Column title={keeps ? "Leaves in place" : "Addresses"}>
            <ProblemChip id={p.problemId} tone={keeps ? "loss" : "gain"} />
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
        {keeps ? (
          <p className="rounded-md border border-rule bg-card p-4 text-sm">
            None. Current law and today&apos;s programs stay as they are.
          </p>
        ) : (
          <ol className="list-decimal space-y-1.5 rounded-md border border-rule bg-card py-3 pr-4 pl-9 text-sm">
            {p.changes?.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        )}
      </section>

      <section className="mb-10">
        <h2 className="mb-1 text-xl font-semibold">Effects</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          {migrated
            ? "Each effect has its own page: the evidence, the case that it is or isn't a real cost, and whom it affects."
            : "This path's effects are still free text; it has not yet been linked into the effects graph."}
        </p>
        {effects.keeps && (
          <div className="mb-4 rounded-md border border-loss/30 bg-loss-soft/40 p-4 text-sm">
            <div className="mb-1 text-xs font-semibold tracking-wide uppercase">
              The problem it leaves in place
            </div>
            <Link
              href={`/problems/${effects.keeps.problemId}`}
              className="font-medium underline decoration-rule underline-offset-2 hover:text-primary"
            >
              {effects.keeps.title}
            </Link>
            {effects.keeps.note && <p className="mt-1 text-foreground/80">{effects.keeps.note}</p>}
            {effects.keeps.sourceIds && <Sources ids={effects.keeps.sourceIds} />}
          </div>
        )}
        {effects.answers && (
          <div className="mb-4 rounded-md border border-rule bg-card p-4 text-sm">
            <div className="mb-1 text-xs font-semibold tracking-wide uppercase">
              The question it answers
            </div>
            <Link
              href={`/problems/${effects.answers.problemId}`}
              className="font-medium underline decoration-rule underline-offset-2 hover:text-primary"
            >
              {effects.answers.title}
            </Link>
            {effects.answers.note && (
              <p className="mt-1 text-foreground/80">{effects.answers.note}</p>
            )}
          </div>
        )}
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
        <div className={`grid gap-4 ${p.mend?.length ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          <ImpactList
            title={keeps ? "Who keeps gaining" : "Who gains"}
            impacts={impacts.gains}
            tone="gain"
          />
          <ImpactList
            title={keeps ? "Who stays hurt" : "Who loses"}
            impacts={impacts.loses}
            tone="loss"
          />
          {p.mend?.length && (
            <People
              title="Other ways to soften the losses"
              items={p.mend}
              tone="border-rule bg-card"
            />
          )}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Where it has been tried</h2>
        {keeps && (
          <p className="border-l-2 border-rule pl-4 text-sm">
            <span className="font-medium">United States:</span> this is how the system works today.
            The evidence is on the{" "}
            <Link href={`/problems/${problem.id}`} className="underline">
              problem page
            </Link>
            .
          </p>
        )}
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
