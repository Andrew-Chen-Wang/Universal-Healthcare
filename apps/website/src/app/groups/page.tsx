import { Page, PageHeader } from "@website/components/site/ui"
import { GROUPS, problemsFor } from "@website/content/graph"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Who's affected",
  description: "Every group the problems and solution paths affect, and how.",
}

export default function GroupsPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Part 1 · Decisions"
        title="Who's affected"
        lede="Each group links to the problems that hurt it or that it gains from. A path's winners and losers are worked out from these links, so each group is described once. Open a group to see how it fares under your mix of paths."
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {GROUPS.map((g) => {
          const n = problemsFor(g.id).length
          return (
            <li key={g.id}>
              <Link
                href={`/groups/${g.id}`}
                className="block h-full rounded-md border border-rule bg-card p-4 hover:border-primary"
              >
                <div className="font-medium">{g.label}</div>
                <p className="mt-1 text-sm text-foreground/80">{g.summary}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {n} linked {n === 1 ? "problem" : "problems"}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </Page>
  )
}
