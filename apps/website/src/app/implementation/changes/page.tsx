import { Page, PageHeader, Section, Table, Pill } from "@website/components/site/ui"
import { CHANGE_AREAS } from "@website/content/changes"
import { HYBRID_PLAN } from "@website/content/plans"
import Link from "next/link"
import type { Metadata } from "next"

const { stepHref, changes: CHANGES } = HYBRID_PLAN

export const metadata: Metadata = { title: "All system changes" }

export default function ImplementationChanges() {
  return (
    <Page>
      <PageHeader
        eyebrow="Full implementation"
        title="All system changes"
        lede="The complete plan, organized by the parts of the health system it changes. Each entry shows today's system, the proposed result, and its trade-off. Follow an entry for implementation details and costs."
      />
      <nav aria-label="System change areas" className="mb-10 flex flex-wrap gap-2">
        {CHANGE_AREAS.map((area) => (
          <Link
            key={area}
            href={`#${area.toLowerCase().replaceAll(/[^a-z]+/g, "-")}`}
            className="rounded-sm border border-rule px-3 py-1 text-sm hover:border-primary"
          >
            {area}
          </Link>
        ))}
      </nav>
      {CHANGE_AREAS.map((area) => (
        <Section key={area} id={area.toLowerCase().replaceAll(/[^a-z]+/g, "-")} title={area}>
          <Table>
            <thead>
              <tr>
                <th>What</th>
                <th>Today</th>
                <th>Under the plan</th>
                <th>Trade-off</th>
              </tr>
            </thead>
            <tbody>
              {CHANGES.filter((c) => c.area === area).map((c) => (
                <tr key={c.id} id={c.id}>
                  <td className="min-w-48">
                    <Link
                      href={`${stepHref(c.stepId, "changes")}/${c.id}`}
                      className="font-medium underline decoration-rule underline-offset-2 hover:decoration-primary"
                    >
                      {c.item}
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Pill>{c.disposition}</Pill>
                      <Pill>{c.when}</Pill>
                    </div>
                  </td>
                  <td className="text-sm text-foreground/80">{c.today}</td>
                  <td className="text-sm">{c.change}</td>
                  <td className="text-sm text-foreground/80">{c.tradeoff}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      ))}
    </Page>
  )
}
