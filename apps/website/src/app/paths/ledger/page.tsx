import { ProblemChip, StatusPill } from "@website/components/site/paths"
import { Callout, Page, PageHeader, Pill, Stat } from "@website/components/site/ui"
import { DECISIONS, PATH_BY_ID, type Decision } from "@website/content/paths"
import { PHASES } from "@website/content/plan"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Review ledger" }

const CONF_ORDER = { low: 0, medium: 1, high: 2 } as const
const CONF_TONE = { low: "loss", medium: "caution", high: "gain" } as const
const PHASE_TITLE = Object.fromEntries(PHASES.map((p) => [p.id, `${p.number}. ${p.title}`]))

function Row({ d }: { d: Decision }) {
  const p = PATH_BY_ID[d.pathId]
  return (
    <tr className="border-t border-rule align-top">
      <td className="py-3 pr-4">
        <Link href={`/paths/${p.id}`} className="font-medium hover:text-primary hover:underline">
          {p.title}
        </Link>
        <div className="mt-1">
          <ProblemChip id={p.problemId} />
        </div>
      </td>
      <td className="py-3 pr-4 whitespace-nowrap">
        <StatusPill status={p.status} />
        {d.phase && (
          <div className="mt-1 text-xs text-muted-foreground">{PHASE_TITLE[d.phase]}</div>
        )}
      </td>
      <td className="py-3 pr-4">
        <Pill tone={CONF_TONE[d.confidence]}>{d.confidence}</Pill>
      </td>
      <td className="py-3 pr-4 text-sm">{d.reason}</td>
      <td className="py-3 text-sm text-foreground/80">{d.review ?? "—"}</td>
    </tr>
  )
}

function LedgerTable({ rows }: { rows: Decision[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-rule bg-card px-4">
      <table className="w-full min-w-[900px] text-left">
        <thead>
          <tr className="text-xs tracking-wide text-muted-foreground uppercase">
            <th scope="col" className="py-3 pr-4 font-medium">
              Path
            </th>
            <th scope="col" className="py-3 pr-4 font-medium">
              Decision
            </th>
            <th scope="col" className="py-3 pr-4 font-medium">
              Confidence
            </th>
            <th scope="col" className="py-3 pr-4 font-medium">
              Why
            </th>
            <th scope="col" className="py-3 font-medium">
              What to review
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <Row key={d.pathId} d={d} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function LedgerPage() {
  const pending = DECISIONS.filter((d) => !d.reviewed)
  const sorted = [...pending].toSorted(
    (a, b) =>
      CONF_ORDER[a.confidence] - CONF_ORDER[b.confidence] || Number(!a.review) - Number(!b.review),
  )
  const flagged = sorted.filter((d) => d.review)
  const rest = sorted.filter((d) => !d.review)
  const chosen = DECISIONS.filter((d) => d.status === "chosen").length
  const byConf = (c: Decision["confidence"]) => pending.filter((d) => d.confidence === c).length
  return (
    <Page>
      <PageHeader
        eyebrow="Part 1 · Decisions"
        title="Review ledger"
        lede="Every solution path has a draft decision, made by Claude on the owner's request so the plan could be built. None is reviewed yet. Work through this list top to bottom: the least certain and most consequential picks come first."
      />
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Awaiting review" value={`${pending.length} / ${DECISIONS.length}`} />
        <Stat label="Chosen" value={chosen.toString()} />
        <Stat label="Low confidence" value={byConf("low").toString()} tone="loss" />
        <Stat label="Flagged for a closer look" value={flagged.length.toString()} />
      </div>
      <Callout title="How to review">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {/* The review page only exists in development; the static site omits it. */}
          {process.env.NODE_ENV === "development" && (
            <li>
              Use the temporary{" "}
              <Link href="/paths/review" className="underline">
                review page
              </Link>{" "}
              (under <code>pnpm run dev</code>) to choose, reject, re-phase, and note each pick; it
              saves to a file Claude folds in afterwards.
            </li>
          )}
          <li>Open a path, read its trade-offs, and tell Claude to keep, flip, or change it.</li>
          <li>
            Flipping a pick can break others: the build checks that every chosen path's requirements
            are chosen, no two chosen paths conflict, and every problem a chosen path creates has a
            chosen answer.
          </li>
          <li>
            Reviewed decisions get <code>reviewed: true</code> in{" "}
            <code>content/paths/decisions.ts</code> and drop off this list.
          </li>
          <li>
            Chosen paths feed{" "}
            <Link href="/changes" className="underline">
              Changes by phase
            </Link>
            .
          </li>
        </ul>
      </Callout>
      <section className="mb-10">
        <h2 className="mb-1 text-xl font-semibold">
          1. Flagged for a closer look ({flagged.length})
        </h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Picks with a specific question for you, least confident first.
        </p>
        <LedgerTable rows={flagged} />
      </section>
      <section>
        <h2 className="mb-1 text-xl font-semibold">2. Everything else ({rest.length})</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Mostly picks that follow from the ones above, or interim fixes. Quick to confirm.
        </p>
        <LedgerTable rows={rest} />
      </section>
    </Page>
  )
}
