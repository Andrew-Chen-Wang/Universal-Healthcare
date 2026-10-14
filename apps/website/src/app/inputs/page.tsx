import {
  ConfidenceTag,
  Page,
  PageHeader,
  Pill,
  Section,
  Sources,
  Table,
} from "@website/components/site/ui"
import { COST_ITEMS } from "@website/content/calculations"
import { C, type ConstantId } from "@website/content/constants"
import { SINGLE_PAYER_PLAN } from "@website/content/plans"
import type { Metadata } from "next"
import Link from "next/link"

const { costHref } = SINGLE_PAYER_PLAN

export const metadata: Metadata = { title: "Every input number" }

function formatValue(value: number, unit: string) {
  switch (unit) {
    case "usdB":
      return `$${value.toLocaleString("en-US")}B`
    case "usd":
      return `$${value.toLocaleString("en-US")}`
    case "share":
      return `${(value * 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}%`
    case "ratio":
      return `${value}×`
    case "years":
      return `${value} years`
    default:
      return value.toLocaleString("en-US")
  }
}

export default function InputsPage() {
  const ids = Object.keys(C) as ConstantId[]
  const groups = [...new Set(ids.map((id) => C[id].group))]
  const usedBy = (id: ConstantId) =>
    COST_ITEMS.filter((c) => c.calc.some((s) => s.inputs?.includes(id)))
  return (
    <Page>
      <PageHeader
        eyebrow="Reference"
        title="Every input number"
        lede={`All ${ids.length} raw numbers the site uses, defined once in one file and reused everywhere. "Data" means a published statistic, "policy" a choice the plan makes, and "estimate" our assumption.`}
      />
      {groups.map((g) => (
        <Section key={g} title={g}>
          <Table>
            <thead>
              <tr>
                <th>Input</th>
                <th className="text-right">Value</th>
                <th>Kind</th>
                <th>Used in</th>
              </tr>
            </thead>
            <tbody>
              {ids
                .filter((id) => C[id].group === g)
                .map((id) => {
                  const c = C[id]
                  const uses = usedBy(id)
                  return (
                    <tr key={id} id={id} className="scroll-mt-20">
                      <td>
                        <div className="font-medium">{c.label}</div>
                        <div className="num text-xs text-muted-foreground">{id}</div>
                        {c.note && <div className="text-xs text-foreground/70">{c.note}</div>}
                        <Sources ids={c.sourceIds} />
                      </td>
                      <td className="num text-right whitespace-nowrap">
                        {formatValue(c.value, c.unit)}
                      </td>
                      <td>
                        <div className="flex flex-col items-start gap-1">
                          <Pill
                            tone={
                              c.kind === "policy"
                                ? "primary"
                                : c.kind === "data"
                                  ? "neutral"
                                  : "caution"
                            }
                          >
                            {c.kind}
                          </Pill>
                          <ConfidenceTag level={c.confidence} />
                        </div>
                      </td>
                      <td className="text-xs">
                        {uses.slice(0, 4).map((u) => (
                          <div key={u.id}>
                            <Link
                              className="underline decoration-rule underline-offset-2"
                              href={costHref(u.stepId, u.id)}
                            >
                              {u.title}
                            </Link>
                          </div>
                        ))}
                        {uses.length > 4 && (
                          <div className="text-muted-foreground">+{uses.length - 4} more</div>
                        )}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        </Section>
      ))}
    </Page>
  )
}
