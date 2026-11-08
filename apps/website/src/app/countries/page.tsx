import { NextLinks, Page, PageHeader } from "@website/components/site/ui"
import { COUNTRY_SUMMARY } from "@website/content/countries"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Other countries",
  description:
    "What other countries do about each problem the site covers, what happened there, and whether their approach would fit your plan.",
}

export default function CountriesPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="The options"
        title="Other countries"
        lede="What other countries do about the problems on this site, what happened when they did it, and whether their approach would fit the plan you've built. Open a country to see each of its approaches with its pros, its issues, and a fit check against your picks."
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {COUNTRY_SUMMARY.map((s) => (
          <li key={s.country.id}>
            <Link
              href={`/countries/${s.country.id}`}
              className="block rounded-md border border-rule bg-card px-4 py-3 hover:border-primary"
            >
              <div className="font-medium">{s.country.name}</div>
              <div className="text-sm text-muted-foreground">
                {[
                  s.approaches > 0 &&
                    `${s.approaches} ${s.approaches === 1 ? "approach" : "approaches"} across ${s.problems} ${s.problems === 1 ? "problem" : "problems"}`,
                  s.borrows > 0 &&
                    `${s.borrows} ${s.borrows === 1 ? "comparison" : "comparisons"} in the plans`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
        Countries appear when the site cites them by name, as a precedent for a solution path or as
        a comparison in one of the plans. Labels like &quot;most European countries&quot;
        aren&apos;t credited to any one country.
      </p>
      <NextLinks
        links={[
          { href: "/your-plan", label: "Build your plan" },
          { href: "/approaches", label: "Compare approaches" },
        ]}
      />
    </Page>
  )
}
