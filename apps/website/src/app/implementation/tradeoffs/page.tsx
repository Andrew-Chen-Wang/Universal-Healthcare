import { Page, PageHeader, Section, ConfidenceTag } from "@website/components/site/ui"
import { TRADEOFFS } from "@website/content/tradeoffs"
import { ALL_STEPS } from "@website/content/plan"
import { STEP_EXTRAS } from "@website/content/step-extras"
import { SINGLE_PAYER_PLAN } from "@website/content/plans"
import Link from "next/link"
import type { Metadata } from "next"

const { stepHref, stepNumber: STEP_NUMBER } = SINGLE_PAYER_PLAN

export const metadata: Metadata = { title: "All trade-offs" }

export default function ImplementationTradeoffs() {
  return (
    <Page>
      <PageHeader
        eyebrow="Full implementation"
        title="All trade-offs"
        lede="The complete trade-off register: who gains, who loses, and the risks that remain. Implementation trade-offs are listed below by step; each step also links to its task, cost, and system-change trade-offs."
      />
      <Section title="System-wide trade-offs">
        <div className="flex flex-col gap-6">
          {TRADEOFFS.map((t) => {
            const host = ALL_STEPS.find((s) => STEP_EXTRAS[s.id]?.tradeoffIds?.includes(t.id))
            return (
              <article key={t.id} id={t.id} className="rounded-md border border-rule bg-card p-5">
                <ConfidenceTag level={t.confidence} />
                <h3 className="mt-2 text-xl font-semibold">{t.title}</h3>
                <p className="mt-2 leading-relaxed">{t.summary}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Who gains", t.winners],
                    ["Who loses", t.losers],
                  ].map(([label, groups]) => (
                    <div key={label as string}>
                      <h4 className="text-sm font-semibold">{label}</h4>
                      <ul className="mt-1 list-disc pl-5 text-sm">
                        {(groups as string[]).length ? (
                          (groups as string[]).map((g) => <li key={g}>{g}</li>)
                        ) : (
                          <li>No group directly</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm">
                  <strong>Magnitude:</strong> {t.magnitude}
                </p>
                <p className="mt-2 text-sm">
                  <strong>Risk that remains:</strong> {t.residualRisk}
                </p>
                {host && (
                  <Link
                    href={`${stepHref(host.id, "tradeoffs")}#${t.id}`}
                    className="mt-4 inline-block text-sm text-primary underline underline-offset-2"
                  >
                    Evidence, mitigations & implementation →
                  </Link>
                )}
              </article>
            )
          })}
        </div>
      </Section>
      <Section title="Implementation trade-offs by step">
        <div className="flex flex-col gap-5">
          {ALL_STEPS.map((s) => (
            <article key={s.id} className="border-t border-rule pt-4">
              <h3 className="font-semibold">
                <Link
                  href={stepHref(s.id, "tradeoffs")}
                  className="underline decoration-rule underline-offset-2"
                >
                  {STEP_NUMBER[s.id]} · {s.title}
                </Link>
              </h3>
              <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm">
                {s.tradeoffs.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
    </Page>
  )
}
