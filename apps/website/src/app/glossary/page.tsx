import { Page, PageHeader, Section } from "@website/components/site/ui"
import { GLOSSARY } from "@website/content/glossary"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Glossary" }

export default function GlossaryPage() {
  const sorted = [...GLOSSARY].toSorted((a, b) => a.term.localeCompare(b.term))
  return (
    <Page>
      <PageHeader eyebrow="Reference" title="Glossary" />
      <Section>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-[minmax(10rem,14rem)_1fr]">
          {sorted.map((g) => (
            <div key={g.term} className="contents">
              <dt className="font-semibold">{g.term}</dt>
              <dd className="text-foreground/85">{g.definition}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </Page>
  )
}
