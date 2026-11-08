import { CountryApproachCard } from "@website/components/site/country-approach"
import { FitNote, FitProvider } from "@website/components/site/fit"
import { NextLinks, Page, PageHeader, Section, Sources } from "@website/components/site/ui"
import {
  approachesOf,
  borrowsFrom,
  COUNTRY_BY_ID,
  COUNTRY_SUMMARY,
} from "@website/content/countries"
import { slug } from "@website/content/navigation"
import { CHOSEN } from "@website/content/paths"
import { PROBLEM_BY_ID, PROBLEM_CATEGORIES } from "@website/content/problems"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Params = Promise<{ id: string }>

export function generateStaticParams() {
  return COUNTRY_SUMMARY.map((s) => ({ id: s.country.id }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const c = COUNTRY_BY_ID[id]
  return {
    title: c ? `${c.name}: what it does` : "Country",
    description: c
      ? `What ${c.name} does about each problem the site covers, what happened, and whether it would fit your plan.`
      : undefined,
  }
}

const PLAN_LABEL = { hybrid: "The plan", "single-payer": "The single-payer alternative" }

export default async function CountryPage({ params }: { params: Params }) {
  const { id } = await params
  const country = COUNTRY_BY_ID[id]
  if (!country) notFound()
  const approaches = approachesOf(id)
  const borrows = borrowsFrom(id)
  const byCategory = PROBLEM_CATEGORIES.map((category) => ({
    category,
    items: approaches.filter((a) => PROBLEM_BY_ID[a.path.problemId]?.category === category),
  })).filter((g) => g.items.length > 0)
  const idx = COUNTRY_SUMMARY.findIndex((s) => s.country.id === id)
  const next = COUNTRY_SUMMARY[(idx + 1) % COUNTRY_SUMMARY.length].country

  return (
    <Page>
      <PageHeader
        eyebrow={
          <Link href="/countries" className="hover:underline">
            Other countries
          </Link>
        }
        title={country.name}
        lede={`What ${country.name} does about the problems on this site, what happened there, and whether each approach would fit your plan. Pros and issues are those of the approach in general, from the solution path it belongs to.`}
      />
      <FitProvider defaults={CHOSEN.map((p) => p.id)}>
        <div className="mb-10">
          <FitNote />
        </div>

        {byCategory.map((g) => (
          <Section key={g.category} id={slug(g.category)} title={g.category}>
            <div className="space-y-3">
              {g.items.map((a) => (
                <CountryApproachCard key={`${a.path.id}-${a.place}-${a.note}`} a={a} showPlace />
              ))}
            </div>
          </Section>
        ))}

        {borrows.length > 0 && (
          <Section
            id="in-the-plans"
            title="Where the plans borrow from it"
            intro={`Steps in the site's plans that compare themselves with ${country.name}, and the lesson each takes.`}
          >
            <div className="space-y-3">
              {borrows.map((b) => (
                <article
                  key={`${b.href}-${b.approach}`}
                  className="rounded-md border border-rule bg-card p-4"
                >
                  <div className="text-xs text-muted-foreground">{PLAN_LABEL[b.plan]}</div>
                  <Link href={b.href} className="font-medium hover:underline">
                    {b.stepTitle}
                  </Link>
                  <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-[7rem_1fr]">
                    <dt className="font-medium text-foreground/85">What it does</dt>
                    <dd>{b.approach}</dd>
                    <dt className="font-medium text-foreground/85">What happened</dt>
                    <dd>{b.result}</dd>
                    <dt className="font-medium text-foreground/85">Lesson</dt>
                    <dd>{b.lesson}</dd>
                  </dl>
                  <Sources ids={b.sourceIds} />
                </article>
              ))}
            </div>
          </Section>
        )}
      </FitProvider>

      <NextLinks
        links={[
          { href: "/countries", label: "All countries" },
          { href: `/countries/${next.id}`, label: next.name },
        ]}
      />
    </Page>
  )
}
