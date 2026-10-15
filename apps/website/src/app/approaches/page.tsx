import { ScalePill } from "@website/components/site/paths"
import { B, Callout, Page, PageHeader, Sources } from "@website/components/site/ui"
import { type ConstantId, show, v } from "@website/content/constants"
import { APPROACHES, type Estimate, summarize, TODAY_PROBLEMS } from "@website/content/approaches"
import { NHE_TOTAL_2024 } from "@website/content/baseline"
import { GROUP_BY_ID } from "@website/content/graph"
import { PATH_BY_ID, SCALE_LABEL, SCALES } from "@website/content/paths"
import { PROBLEM_BY_ID, PROBLEM_CATEGORIES } from "@website/content/problems"
import type { Metadata } from "next"
import Link from "next/link"
import { costFor } from "../your-plan/cost"
import { coverageFor, popFromConstants } from "../your-plan/coverage"

export const metadata: Metadata = {
  title: "Compare approaches",
  description:
    "The same problems answered five ways, from keeping current law to one public payer: what each fixes, what it creates, who gains and loses, and what it costs where the model can price it.",
}

const SUMMARIES = APPROACHES.map(summarize)
const POP = popFromConstants()

function coverage(picks: string[]) {
  const status = coverageFor(new Set(picks), POP).find((r) => r.id === "citizens")?.status
  if (status === "covered") return "Everyone enrolled automatically"
  if (status === "partial") return "More people covered; some who don't sign up stay uninsured"
  return `About ${POP.uninsuredToday} million stay uninsured`
}

function spending(picks: string[]) {
  if (picks.every((id) => PATH_BY_ID[id].scale === "none"))
    return (
      <>
        <B v={NHE_TOTAL_2024} /> a year (2024). Projected to reach <B v={v("nhe2034")} /> in 2034,{" "}
        {show("healthGdpShare2034")} of GDP, under current law.
        <Sources ids={["cms-nhe-proj-2025"]} />
      </>
    )
  const c = costFor(new Set(picks))
  return (
    <div className="space-y-1.5">
      <p>
        <B v={c.nationalAfter} /> a year, <B v={c.delta} sign /> against today
      </p>
      {c.kind === "reform" && c.federalAfter !== undefined && c.federalBefore !== undefined && (
        <p className="text-xs text-muted-foreground">
          Federal <B v={c.federalAfter - c.federalBefore} sign />
          {c.gap !== undefined && (
            <>
              ; {c.gap > 0 ? "still to fund " : "surplus over named taxes "}
              <B v={Math.abs(c.gap)} />
            </>
          )}
          {c.noNewTaxBelow !== undefined &&
            `; no new tax below $${c.noNewTaxBelow.toLocaleString("en-US")} of income`}
        </p>
      )}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground">
          {c.kind === "single-payer" ? "How the single-payer model prices it" : "Line by line"}
        </summary>
        <ul className="mt-1 space-y-1.5">
          {c.rules.map((r) => (
            <li key={r.label}>
              <span className="font-medium">{r.label}:</span>{" "}
              <span className="text-foreground/80">{r.effect}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}

const pct = (x: number) => `${x > 0 ? "+" : x < 0 ? "−" : ""}${Math.abs(x * 100).toFixed(1)}%`

/** A published estimate for the nearest design, with its change from the study's own baseline. */
function Published({ e }: { e: Estimate }) {
  const n = (part: "Uninsured" | "National" | "Federal", key: Estimate["key"] = e.key) =>
    v(`urban${key}${part}` as ConstantId)
  const base = e.key === "CurrentLaw"
  const national = n("National") - n("National", "CurrentLaw")
  const federal = n("Federal") - n("Federal", "CurrentLaw")
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium">{e.option}</div>
      {base ? (
        <p>
          National spending <B v={n("National")} />; {n("Uninsured")} million uninsured.
        </p>
      ) : (
        <p>
          National spending <B v={national} sign /> ({pct(national / n("National", "CurrentLaw"))});
          federal <B v={federal} sign />; {n("Uninsured")} million uninsured, against{" "}
          {n("Uninsured", "CurrentLaw")} million.
        </p>
      )}
      <p className="text-xs text-muted-foreground">{e.match}</p>
    </div>
  )
}

/** Approaches built out as a full step-by-step plan. */
const PLAN_HREF: Record<string, string> = { "single-payer": "/single-payer/plan", draft: "/plan" }
const builderHref = (picks: string[]) => `/your-plan?paths=${picks.join(",")}`

/** One row of the comparison table: a label and a cell per approach. */
function Row({ label, cells }: { label: string; cells: React.ReactNode[] }) {
  return (
    <tr className="border-t border-rule align-top">
      <th
        scope="row"
        className="sticky left-0 bg-background py-3 pr-4 text-left text-sm font-medium"
      >
        {label}
      </th>
      {cells.map((c, i) => (
        <td key={i} className="min-w-44 py-3 pr-4 text-sm">
          {c}
        </td>
      ))}
    </tr>
  )
}

function ScaleMix({ counts }: { counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  return (
    <div>
      <div className="flex h-2 w-full overflow-hidden rounded-sm bg-rule">
        {SCALES.map((s, i) => (
          <span
            key={s}
            title={`${SCALE_LABEL[s]}: ${counts[s]}`}
            style={{ width: `${(counts[s] / total) * 100}%`, opacity: 0.25 + i * 0.25 }}
            className="bg-primary"
          />
        ))}
      </div>
      <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
        {SCALES.filter((s) => counts[s]).map((s) => (
          <li key={s}>
            {counts[s]} {SCALE_LABEL[s].toLowerCase()}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ApproachesPage() {
  const groupIds = [...new Set(SUMMARIES.flatMap((s) => Object.keys(s.groups)))].toSorted((a, b) =>
    GROUP_BY_ID[a].label.localeCompare(GROUP_BY_ID[b].label),
  )
  const n = TODAY_PROBLEMS.length

  return (
    <Page>
      <PageHeader
        eyebrow="Part 1 · Decisions"
        title="Compare approaches"
        lede="The same problems, answered five ways: from changing nothing, through small fixes and bigger reforms that keep today's insurers, to one public payer. Each column is built by a rule from how much each path changes today's system, so no column is tuned by hand."
      />

      <Callout title="How the columns are built">
        Every solution path is labeled no change, minor, moderate, or major (hover a label for what
        each means). For each of today&apos;s {`${n} problems`}, a column takes every path at the
        largest scale it allows, skipping any that conflict with what it already has. Problems a
        reform creates get the smallest change that answers them. The last column is the site&apos;s
        draft picks, which Claude made for the owner to review. Open any column in the plan builder
        to change it.
        <span className="mt-2 block">
          The site&apos;s spending row prices the single payer with the full cost ledger, and the
          other columns line by line on top of today&apos;s spending (coverage, provider prices,
          drug prices, new benefits, insurer overhead, workforce), with the same rates and prices.
          Both are 2024 dollars as if fully in place in 2024. Picks with no cost input, such as
          antitrust or privacy rules, aren&apos;t priced. For a check from outside, the
          published-estimate row uses one study that priced current law and eight reforms the same
          way: the Urban Institute&apos;s 2019 comparison, for 2020 in 2020 dollars.
        </span>
        <Sources ids={["urban-2019"]} />
      </Callout>

      <section className="mt-10 mb-12">
        <div className="-mx-4 overflow-x-auto px-4">
          <table className="w-full min-w-[56rem] border-collapse">
            <thead>
              <tr className="align-bottom">
                <th className="sticky left-0 w-40 bg-background">
                  <span className="sr-only">Measure</span>
                </th>
                {SUMMARIES.map(({ approach: a }) => (
                  <th key={a.id} scope="col" className="pr-4 pb-3 text-left">
                    <div className="font-serif text-lg leading-tight font-semibold">{a.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row
                label="What it is"
                cells={SUMMARIES.map((s) => (
                  <p key={s.approach.id} className="text-foreground/80">
                    {s.approach.summary}
                  </p>
                ))}
              />
              <Row
                label="Who is covered"
                cells={SUMMARIES.map((s) => coverage(s.approach.picks))}
              />
              <Row
                label="National spending (site's model)"
                cells={SUMMARIES.map((s) => spending(s.approach.picks))}
              />
              <Row
                label="Published estimate for a similar design"
                cells={SUMMARIES.map((s) => (
                  <Published key={s.approach.id} e={s.approach.estimate} />
                ))}
              />
              <Row
                label="Today's problems fixed"
                cells={SUMMARIES.map((s) => (
                  <span key={s.approach.id}>
                    <span className="num text-lg">{s.addressed.length}</span>
                    <span className="text-muted-foreground"> of {n}</span>
                  </span>
                ))}
              />
              <Row
                label="New or worsened problems"
                cells={SUMMARIES.map((s) => (
                  <details key={s.approach.id}>
                    <summary className="cursor-pointer">
                      <span className="num text-lg">{s.harms.length}</span>
                    </summary>
                    <ul className="mt-1 space-y-0.5 text-xs">
                      {s.harms.map((id) => (
                        <li key={id}>
                          <Link href={`/problems/${id}`} className="hover:underline">
                            {PROBLEM_BY_ID[id].title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              />
              <Row
                label="Changes to law and programs"
                cells={SUMMARIES.map((s) => (
                  <span key={s.approach.id} className="num text-lg">
                    {s.changes}
                  </span>
                ))}
              />
              <Row
                label="Paths, by size of change"
                cells={SUMMARIES.map((s) => (
                  <ScaleMix key={s.approach.id} counts={s.byScale} />
                ))}
              />
              <Row
                label="Built by"
                cells={SUMMARIES.map((s) => (
                  <div key={s.approach.id} className="space-y-2">
                    <p className="text-xs text-muted-foreground">{s.approach.rule}</p>
                    <Link href={builderHref(s.approach.picks)} className="text-sm underline">
                      Open in the plan builder
                    </Link>
                    {PLAN_HREF[s.approach.id] && (
                      <Link href={PLAN_HREF[s.approach.id]} className="block text-sm underline">
                        See the full plan, step by step
                      </Link>
                    )}
                  </div>
                ))}
              />
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-1 text-2xl font-semibold">Who gains and who loses</h2>
        <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
          How many of each approach&apos;s paths help or hurt each group, from the effects graph.
          Under current law, the groups each problem profits keep gaining and the groups it hurts
          stay hurt.
        </p>
        <div className="-mx-4 overflow-x-auto px-4">
          <table className="w-full min-w-[48rem] text-sm">
            <thead>
              <tr className="text-left">
                <th className="sticky left-0 bg-background py-2 pr-4">Group</th>
                {SUMMARIES.map(({ approach: a }) => (
                  <th key={a.id} scope="col" className="py-2 pr-4 font-medium">
                    {a.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupIds.map((g) => (
                <tr key={g} className="border-t border-rule">
                  <th
                    scope="row"
                    className="sticky left-0 bg-background py-1.5 pr-4 text-left font-normal"
                  >
                    <Link href={`/groups/${g}`} className="hover:underline">
                      {GROUP_BY_ID[g].label}
                    </Link>
                  </th>
                  {SUMMARIES.map((s) => {
                    const c = s.groups[g]
                    return (
                      <td key={s.approach.id} className="num py-1.5 pr-4 whitespace-nowrap">
                        {c?.gains ? <span className="text-gain">+{c.gains}</span> : null}
                        {c?.gains && c?.loses ? " / " : null}
                        {c?.loses ? <span className="text-loss">−{c.loses}</span> : null}
                        {!c && <span className="text-muted-foreground">·</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-1 text-2xl font-semibold">Problem by problem</h2>
        <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
          What each approach does about each of today&apos;s problems.
        </p>
        {PROBLEM_CATEGORIES.map((cat) => {
          const rows = TODAY_PROBLEMS.filter((p) => p.category === cat)
          if (!rows.length) return null
          return (
            <div key={cat} className="mb-8">
              <h3 className="mb-2 text-lg font-semibold">{cat}</h3>
              <div className="-mx-4 overflow-x-auto px-4">
                <table className="w-full min-w-[56rem] table-fixed text-sm">
                  <tbody>
                    {rows.map((pr) => (
                      <tr key={pr.id} className="border-t border-rule align-top">
                        <th
                          scope="row"
                          className="sticky left-0 w-48 bg-background py-2 pr-4 text-left font-medium"
                        >
                          <Link href={`/problems/${pr.id}`} className="hover:underline">
                            {pr.title}
                          </Link>
                        </th>
                        {SUMMARIES.map((s) => {
                          const own = s.paths.filter((p) => p.problemId === pr.id)
                          return (
                            <td key={s.approach.id} className="py-2 pr-4">
                              <ul className="space-y-1.5">
                                {own.map((p) => (
                                  <li key={p.id}>
                                    <Link
                                      href={`/paths/${p.id}`}
                                      className={
                                        p.scale === "none"
                                          ? "text-muted-foreground hover:underline"
                                          : "hover:underline"
                                      }
                                    >
                                      {p.title}
                                    </Link>
                                  </li>
                                ))}
                                {own.length === 0 && (
                                  <li className="text-muted-foreground">
                                    {s.addressed.includes(pr.id)
                                      ? "Fixed by paths for other problems"
                                      : "No path picked"}
                                  </li>
                                )}
                              </ul>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </section>

      <Callout title="Optimizations every approach can use">
        Some changes work under any of these columns, including keeping current law: running routine
        lab tests and planned surgery at high volume, a virtual first step for routine problems,
        hospital care at home, and pharmacist test-and-treat. They aren&apos;t in the totals above.{" "}
        <Link href="/optimizations" className="underline">
          See the optimizations
        </Link>
        .
      </Callout>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>Scale labels:</span>
        {SCALES.map((s) => (
          <ScalePill key={s} scale={s} />
        ))}
        <span>They are draft labels, listed in one file for review like the draft picks.</span>
      </div>
    </Page>
  )
}
