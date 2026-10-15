import { Page, PageHeader, Pill, Section, Sources, Table } from "@website/components/site/ui"
import type { Ref } from "@website/content/coverage"
import { PLAN_COVERAGE } from "@website/content/plan-coverage"
import { HYBRID_PLAN, SINGLE_PAYER_PLAN } from "@website/content/plans"
import Link from "next/link"

import type { PlanBundle } from "@website/content/plan-bundle"

/** Links a checklist reference to its page in one plan. */
function linker(plan: PlanBundle) {
  /** The step page that hosts a decision, trade-off, or risk. */
  function hostStep(key: "decisionIds" | "tradeoffIds" | "riskIds", id: string) {
    return Object.entries(plan.extras).find(([, e]) => e[key]?.includes(id))?.[0]
  }

  function refLink(r: Ref): { href: string; label: string; kind: string } {
    switch (r.kind) {
      case "step":
        return { href: plan.stepHref(r.id), label: plan.stepById[r.id].title, kind: "step" }
      case "cost": {
        const c = plan.costById[r.id]
        return { href: plan.costHref(c.stepId, c.id), label: c.title, kind: "calculation" }
      }
      case "change": {
        const c = plan.changes.find((x) => x.id === r.id)!
        return {
          href: `${plan.stepHref(c.stepId, "changes")}/${c.id}`,
          label: c.item,
          kind: "system change",
        }
      }
      case "tradeoff": {
        const s = hostStep("tradeoffIds", r.id)!
        return {
          href: `${plan.stepHref(s, "tradeoffs")}#${r.id}`,
          label: plan.tradeoffs.find((t) => t.id === r.id)!.title,
          kind: "trade-off",
        }
      }
      case "risk": {
        const s = hostStep("riskIds", r.id)!
        return {
          href: `${plan.stepHref(s, "risks")}#${r.id}`,
          label: plan.risks.find((x) => x.id === r.id)!.title,
          kind: "risk",
        }
      }
      case "decision": {
        const s = hostStep("decisionIds", r.id)!
        return {
          href: `${plan.stepHref(s, "design")}#${r.id}`,
          label: plan.designDecisions.find((d) => d.id === r.id)!.title,
          kind: "design decision",
        }
      }
    }
  }

  return refLink
}

const PLANS = [
  { key: "hybrid" as const, title: "Current draft (hybrid)", link: linker(HYBRID_PLAN) },
  { key: "single-payer" as const, title: "Single-payer plan", link: linker(SINGLE_PAYER_PLAN) },
]

function RefList({ refs, link }: { refs: Ref[]; link: ReturnType<typeof linker> }) {
  return (
    <ul className="space-y-0.5">
      {refs.map((r) => {
        const l = link(r)
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
  )
}

/** Every checklist item, from either plan, with where each plan covers it. */
function mergedGroups() {
  const [hy, sp] = PLANS.map((p) => PLAN_COVERAGE[p.key].coverage)
  return hy.map((g) => {
    const other = sp.find((x) => x.id === g.id)
    const ids = g.items.map((i) => i.id)
    for (const i of other?.items ?? []) if (!ids.includes(i.id)) ids.push(i.id)
    return {
      id: g.id,
      title: g.title,
      basis: g.basis,
      items: ids.map((id) => {
        const h = g.items.find((i) => i.id === id)
        const s = other?.items.find((i) => i.id === id)
        return { id, label: (h ?? s)!.label, refs: [h?.refs, s?.refs] }
      }),
    }
  })
}

export function CoveragePage() {
  const groups = mergedGroups()
  const checks = PLANS.map((p) => PLAN_COVERAGE[p.key].checks)
  const failing = checks.flat().filter((c) => c.failures.length).length
  return (
    <Page>
      <PageHeader
        eyebrow="Reference"
        title="Coverage check"
        lede="One checklist for both plans: every trade-off dimension, every affected group, and every part of today's system, each linked to where the current draft (the Germany-style hybrid) and the earlier single-payer plan cover it, plus automatic checks that every step, task, change, and money flow states its trade-off. The site will not build if any checklist link points at something missing."
      />

      <Section title="Automatic checks">
        <Table>
          <thead>
            <tr>
              <th>Check</th>
              {PLANS.map((p) => (
                <th key={p.key}>{p.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {checks[0].map((c, n) => (
              <tr key={c.label}>
                <td>{c.label}</td>
                {checks.map((planChecks, k) => {
                  const x = planChecks[n]
                  return (
                    <td key={PLANS[k].key}>
                      {x.failures.length ? (
                        <Pill tone="loss">
                          {x.failures.length} of {x.total} missing: {x.failures.join(", ")}
                        </Pill>
                      ) : (
                        <Pill tone="gain">all {x.total} covered</Pill>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </Table>
        <p className="mt-3 text-sm text-muted-foreground">
          {failing === 0
            ? "Every automatic check passes for both plans."
            : `${failing} checks have gaps.`}
        </p>
      </Section>

      {groups.map((g) => (
        <Section key={g.id} id={g.id} title={`${g.title} (${g.items.length})`} intro={g.basis}>
          <Table>
            <thead>
              <tr>
                <th className="w-1/4">Item</th>
                {PLANS.map((p) => (
                  <th key={p.key}>{p.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {g.items.map((item) => (
                <tr key={item.id} id={`${g.id}-${item.id}`}>
                  <td className="font-medium">{item.label}</td>
                  {PLANS.map((p, k) => (
                    <td key={p.key} className="text-sm">
                      {item.refs[k] ? (
                        <RefList refs={item.refs[k]} link={p.link} />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not part of this plan.
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      ))}

      {PLAN_COVERAGE["single-payer"].benchmarks.map((b) => (
        <Section
          key={b.id}
          id={b.id}
          title={`Independent benchmark: ${b.title} (${b.items.length})`}
          intro={
            <>
              Single-payer plan, checked against an outside document: {b.source}. Where the plan
              deliberately differs, the difference is stated.
            </>
          }
        >
          <Table>
            <thead>
              <tr>
                <th className="w-1/3">Item in the outside document</th>
                <th>Where the single-payer plan covers it</th>
              </tr>
            </thead>
            <tbody>
              {b.items.map((item) => (
                <tr key={item.id} id={`${b.id}-${item.id}`}>
                  <td className="font-medium">{item.label}</td>
                  <td className="text-sm">
                    <RefList refs={item.refs} link={PLANS[1].link} />
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
    </Page>
  )
}
