import { Page, PageHeader, Section } from "@website/components/site/ui"
import { SOURCES } from "@website/content/sources"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Sources" }

export default function SourcesPage() {
  const sorted = [...SOURCES].toSorted((a, b) => a.org.localeCompare(b.org) || b.year - a.year)
  return (
    <Page>
      <PageHeader
        eyebrow="Reference"
        title="Sources"
        lede="Every source cited on this site. Notes give the specific figure used. Advocacy-aligned sources are labeled where relevant."
      />
      <Section>
        <ol className="space-y-4">
          {sorted.map((s) => (
            <li key={s.id} id={s.id} className="scroll-mt-20 border-l-2 border-rule pl-4">
              <div className="text-sm text-muted-foreground">
                {s.org} · {s.year}
              </div>
              <div className="font-medium">
                {s.url ? (
                  <a
                    href={s.url}
                    className="underline decoration-rule underline-offset-2 hover:decoration-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.title}
                  </a>
                ) : (
                  s.title
                )}
              </div>
              {s.note && <div className="mt-1 text-sm text-foreground/80">{s.note}</div>}
            </li>
          ))}
        </ol>
      </Section>
    </Page>
  )
}
