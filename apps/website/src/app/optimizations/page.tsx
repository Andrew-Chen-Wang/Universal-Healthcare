import { ProblemChip } from "@website/components/site/paths"
import { Callout, Page, PageHeader, Section } from "@website/components/site/ui"
import { slug } from "@website/content/navigation"
import { OPTIMIZATION_LENSES, OPTIMIZATIONS } from "@website/content/optimizations"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Optimizations for any system",
  description:
    "Ways to deliver the same or better care for less that work whoever pays: under current law, a public option, a multi-payer system, or a single payer.",
}

export default function OptimizationsPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Part 1 · Optimizations"
        title="Optimizations for any system"
        lede="Some ways to cut cost or improve care don't depend on who pays. They work under current law, with today's insurers, or under a single payer. They sit outside the choice between approaches, and every approach can use them."
      />

      <Callout title="How to read these">
        Each optimization lists the evidence for it and against it, where it has been tried, and who
        loses. None is priced in the cost models yet, and none is a draft pick: they&apos;re options
        to weigh alongside{" "}
        <Link href="/approaches" className="underline">
          any approach
        </Link>
        .
      </Callout>

      {OPTIMIZATION_LENSES.map((lens) => {
        const items = OPTIMIZATIONS.filter((o) => o.lens === lens)
        if (!items.length) return null
        return (
          <Section key={lens} id={slug(lens)} title={lens} className="mt-10">
            <ul className="grid gap-4 sm:grid-cols-2">
              {items.map((o) => (
                <li key={o.id} className="rounded-md border border-rule bg-card p-4">
                  <Link
                    href={`/optimizations/${o.id}`}
                    className="font-serif text-lg leading-tight font-semibold hover:underline"
                  >
                    {o.title}
                  </Link>
                  <p className="mt-2 text-sm text-foreground/80">{o.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {o.helps.map((id) => (
                      <ProblemChip key={id} id={id} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )
      })}
    </Page>
  )
}
