import { ConfidenceTag, Delta, ProsCons, Sources } from "@website/components/site/ui"
import { COST_BY_ID, costsForStep } from "@website/content/calculations"
import { CHANGES } from "@website/content/changes"
import { costHref, stepHref } from "@website/content/navigation"
import { STEP_EXTRAS } from "@website/content/step-extras"
import { TRADEOFFS } from "@website/content/tradeoffs"
import { DISPLACED_GROUPS } from "@website/content/workforce"
import { type StepParams, loadStep, stepStaticParams } from "@website/lib/plan/step"
import type { Metadata } from "next"
import Link from "next/link"

export const generateStaticParams = stepStaticParams

export async function generateMetadata({ params }: { params: StepParams }): Promise<Metadata> {
  const { step, number } = await loadStep(params)
  return { title: `Trade-offs · ${number} ${step.title}` }
}

export default async function TradeoffsPage({ params }: { params: StepParams }) {
  const { step } = await loadStep(params)
  const extras = STEP_EXTRAS[step.id]
  const dims = (extras?.tradeoffIds ?? []).map((id) => TRADEOFFS.find((t) => t.id === id)!)
  const jobs = (extras?.jobGroupIds ?? []).map((id) => DISPLACED_GROUPS.find((g) => g.id === id)!)
  const changes = CHANGES.filter((c) => c.stepId === step.id)
  const costs = costsForStep(step.id)

  return (
    <div className="space-y-12">
      <section>
        <h2 className="mb-3 text-xl font-semibold">Pros & cons of this step</h2>
        <ProsCons pros={step.pros} cons={step.cons} />
        {step.tradeoffs.length > 0 && (
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            {step.tradeoffs.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </section>

      {dims.map((t) => (
        <section key={t.id} id={t.id} className="border-t-2 border-ink/80 pt-6">
          <div className="mb-1 flex items-center gap-2">
            <ConfidenceTag level={t.confidence} />
          </div>
          <h2 className="text-xl font-semibold">{t.title}</h2>
          <p className="mt-2 max-w-3xl leading-relaxed">{t.summary}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-rule bg-card p-4 text-sm">
              <div className="mb-1 text-xs font-semibold text-muted-foreground uppercase">
                Today
              </div>
              {t.today}
            </div>
            <div className="rounded-md border border-primary/30 bg-accent/50 p-4 text-sm">
              <div className="mb-1 text-xs font-semibold text-accent-foreground uppercase">
                Under the plan
              </div>
              {t.underPlan}
            </div>
            <div className="rounded-md border border-gain/25 bg-gain-soft/50 p-4 text-sm">
              <div className="mb-1 text-xs font-semibold text-gain uppercase">Who gains</div>
              <ul className="list-disc pl-5">
                {t.winners.length ? (
                  t.winners.map((w) => <li key={w}>{w}</li>)
                ) : (
                  <li>No group directly</li>
                )}
              </ul>
            </div>
            <div className="rounded-md border border-loss/25 bg-loss-soft/50 p-4 text-sm">
              <div className="mb-1 text-xs font-semibold text-loss uppercase">Who loses</div>
              <ul className="list-disc pl-5">
                {t.losers.length ? (
                  t.losers.map((w) => <li key={w}>{w}</li>)
                ) : (
                  <li>No group directly</li>
                )}
              </ul>
            </div>
          </div>
          <p className="mt-3 text-sm">
            <span className="font-semibold">Magnitude:</span> {t.magnitude}
          </p>
          {t.evidence.length > 0 && (
            <ul className="mt-4 space-y-3">
              {t.evidence.map((e) => (
                <li key={e.place + e.finding} className="border-l-2 border-rule pl-4 text-sm">
                  <div className="font-semibold">{e.place}</div>
                  <div className="text-foreground/85">{e.finding}</div>
                  <Sources ids={e.sourceIds} />
                </li>
              ))}
            </ul>
          )}
          {t.mitigations.length > 0 && (
            <>
              <div className="mt-4 text-sm font-semibold">Mitigations</div>
              <ul className="list-disc pl-5 text-sm">
                {t.mitigations.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </>
          )}
          <div className="mt-4 rounded-md border border-caution/30 bg-caution-soft p-3 text-sm">
            <span className="font-semibold">Risk that remains:</span> {t.residualRisk}
          </div>
        </section>
      ))}

      {jobs.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Jobs affected by this step</h2>
          <ul className="space-y-2">
            {jobs.map((g) => (
              <li key={g.id} className="rounded-md border border-rule bg-card p-3 text-sm">
                <Link
                  href={costHref(COST_BY_ID[`jobs-${g.id}`].stepId, `jobs-${g.id}`)}
                  className="font-medium underline decoration-rule underline-offset-2"
                >
                  {g.label}
                </Link>
                : {Math.round((g.employed * g.displacedShare) / 1000)}k of{" "}
                {Math.round(g.employed / 1000)}k jobs displaced. {g.why}
              </li>
            ))}
          </ul>
        </section>
      )}

      {costs.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Trade-off behind each cost item</h2>
          <ul className="space-y-2 text-sm">
            {costs.map((c) => (
              <li key={c.id} className="rounded-md border border-rule bg-card p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={costHref(step.id, c.id)}
                    className="font-medium underline decoration-rule underline-offset-2"
                  >
                    {c.title}
                  </Link>
                  {c.amountUnit === "B" ? <Delta v={c.amount} /> : null}
                </div>
                <div className="mt-1 text-foreground/80">{c.tradeoff}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {changes.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Trade-off behind each system change</h2>
          <ul className="space-y-2 text-sm">
            {changes.map((c) => (
              <li key={c.id} className="rounded-md border border-rule bg-card p-3">
                <Link
                  href={`${stepHref(step.id, "changes")}#${c.id}`}
                  className="font-medium underline decoration-rule underline-offset-2"
                >
                  {c.item}
                </Link>
                <div className="mt-1 text-foreground/80">{c.tradeoff}</div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
