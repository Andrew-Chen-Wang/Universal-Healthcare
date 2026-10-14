import { ScalePill } from "@website/components/site/paths"
import { B, Callout, Page, PageHeader, Sources } from "@website/components/site/ui"
import { show, v } from "@website/content/constants"
import { APPROACHES, summarize, TODAY_PROBLEMS } from "@website/content/approaches"
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
  if (!c)
    return (
      <span className="text-muted-foreground">
        Not priced: the site&apos;s cost model only prices a single payer so far.
      </span>
    )
  return (
    <>
      <B v={c.nationalAfter} /> a year, <B v={c.delta} sign /> against today
    </>
  )
}

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
                label="National spending"
                cells={SUMMARIES.map((s) => spending(s.approach.picks))}
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
