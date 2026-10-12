import { Page, PageHeader, Pill, Section, Sources, Table } from "@website/components/site/ui"
import { COST_BY_ID } from "@website/content/calculations"
import { CHANGES } from "@website/content/changes"
import { BENCHMARKS } from "@website/content/benchmarks"
import { CHECKS, COVERAGE, type Ref } from "@website/content/coverage"
import { DECISIONS } from "@website/content/decisions"
import { costHref, stepHref } from "@website/content/navigation"
import { STEP_BY_ID } from "@website/content/plan"
import { RISKS } from "@website/content/risks"
import { STEP_EXTRAS } from "@website/content/step-extras"
import { TRADEOFFS } from "@website/content/tradeoffs"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Coverage check" }

/** The step page that hosts a decision, trade-off, or risk. */
function hostStep(key: "decisionIds" | "tradeoffIds" | "riskIds", id: string) {
  return Object.entries(STEP_EXTRAS).find(([, e]) => e[key]?.includes(id))?.[0]
}

function refLink(r: Ref): { href: string; label: string; kind: string } {
  switch (r.kind) {
    case "step":
      return { href: stepHref(r.id), label: STEP_BY_ID[r.id].title, kind: "step" }
    case "cost": {
      const c = COST_BY_ID[r.id]
      return { href: costHref(c.stepId, c.id), label: c.title, kind: "calculation" }
    }
    case "change": {
      const c = CHANGES.find((x) => x.id === r.id)!
      return {
        href: `${stepHref(c.stepId, "changes")}/${c.id}`,
        label: c.item,
        kind: "system change",
      }
    }
    case "tradeoff": {
      const s = hostStep("tradeoffIds", r.id)!
      return {
        href: `${stepHref(s, "tradeoffs")}#${r.id}`,
        label: TRADEOFFS.find((t) => t.id === r.id)!.title,
        kind: "trade-off",
      }
    }
    case "risk": {
      const s = hostStep("riskIds", r.id)!
      return {
        href: `${stepHref(s, "risks")}#${r.id}`,
        label: RISKS.find((x) => x.id === r.id)!.title,
        kind: "risk",
      }
    }
    case "decision": {
      const s = hostStep("decisionIds", r.id)!
      return {
        href: `${stepHref(s, "design")}#${r.id}`,
        label: DECISIONS.find((d) => d.id === r.id)!.title,
        kind: "design decision",
      }
    }
  }
}

export default function CoveragePage() {
  const failing = CHECKS.filter((c) => c.failures.length)
  return (
    <Page>
      <PageHeader
        eyebrow="Reference"
        title="Coverage check"
        lede="A checklist of every trade-off dimension, every affected group, and every part of today's system, each linked to where the plan covers it, plus automatic checks that every step, task, change, and money flow states its trade-off. The site will not build if any checklist link points at something missing."
      />

      <Section title="Automatic checks">
        <Table>
          <thead>
            <tr>
              <th>Check</th>
              <th className="text-right">Items</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {CHECKS.map((c) => (
              <tr key={c.label}>
                <td>{c.label}</td>
                <td className="num text-right">{c.total}</td>
                <td>
                  {c.failures.length ? (
                    <Pill tone="loss">
                      {c.failures.length} missing: {c.failures.join(", ")}
                    </Pill>
                  ) : (
                    <Pill tone="gain">all covered</Pill>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <p className="mt-3 text-sm text-muted-foreground">
          {failing.length === 0
            ? "Every automatic check passes."
            : `${failing.length} checks have gaps.`}
        </p>
      </Section>

      {BENCHMARKS.map((b) => (
        <Section
          key={b.id}
          id={b.id}
          title={`Independent benchmark: ${b.title} (${b.items.length})`}
          intro={
            <>
              Checked against an outside document: {b.source}. Where this plan deliberately differs,
              the difference is stated.
            </>
          }
        >
          <Table>
            <thead>
              <tr>
                <th className="w-1/3">Item in the outside document</th>
                <th>Where this plan covers it</th>
              </tr>
            </thead>
            <tbody>
              {b.items.map((item) => (
                <tr key={item.id} id={`${b.id}-${item.id}`}>
                  <td className="font-medium">{item.label}</td>
                  <td className="text-sm">
                    <ul className="space-y-0.5">
                      {item.refs.map((r) => {
                        const l = refLink(r)
                        return (
                          <li key={`${r.kind}-${r.id}`}>
                            <span className="text-xs text-muted-foreground">{l.kind}: </span>
                            <Link
                              className="underline decoration-rule underline-offset-2 hover:decoration-primary"
                              href={l.href}
                            >
                              {l.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                    {item.difference && (
                      <div className="mt-1 text-xs text-caution">Differs: {item.difference}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Sources ids={[b.sourceId]} />
        </Section>
      ))}

      {COVERAGE.map((g) => (
        <Section key={g.id} id={g.id} title={`${g.title} (${g.items.length})`} intro={g.basis}>
          <Table>
            <thead>
              <tr>
                <th className="w-1/3">Item</th>
                <th>Where it is covered</th>
              </tr>
            </thead>
            <tbody>
              {g.items.map((item) => (
                <tr key={item.id} id={`${g.id}-${item.id}`}>
                  <td className="font-medium">{item.label}</td>
                  <td className="text-sm">
                    <ul className="space-y-0.5">
                      {item.refs.map((r) => {
                        const l = refLink(r)
                        return (
                          <li key={`${r.kind}-${r.id}`}>
                            <span className="text-xs text-muted-foreground">{l.kind}: </span>
                            <Link
                              className="underline decoration-rule underline-offset-2 hover:decoration-primary"
                              href={l.href}
                            >
                              {l.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      ))}
    </Page>
  )
}
