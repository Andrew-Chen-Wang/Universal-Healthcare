import { Page, PageHeader, Section } from "@website/components/site/ui"
import { slug } from "@website/content/navigation"
import { PROBLEM_CATEGORIES, PROBLEMS } from "@website/content/problems"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Problems" }

export default function ProblemsPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Part 1"
        title="Problems"
        lede={`${PROBLEMS.length} problems in today's system and in universal systems elsewhere. Each page states the evidence, who is hurt, who profits from the problem continuing (the incentive any fix has to deal with), root causes, related costs, and the open questions whose answers become solution paths.`}
      />
      {PROBLEM_CATEGORIES.map((c) => (
        <Section key={c} id={slug(c)} title={c}>
          <ul className="divide-y divide-rule rounded-md border border-rule bg-card">
            {PROBLEMS.filter((p) => p.category === c).map((p) => (
              <li key={p.id}>
                <Link href={`/problems/${p.id}`} className="block px-4 py-3 hover:bg-secondary">
                  <div className="font-medium">{p.title}</div>
                  <div className="mt-0.5 line-clamp-2 text-sm text-foreground/70">{p.summary}</div>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </Page>
  )
}
