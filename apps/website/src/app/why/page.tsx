import { PathLink, ProblemChip } from "@website/components/site/paths"
import { Page, PageHeader, Sources } from "@website/components/site/ui"
import { fmt } from "@website/content/model"
import { PATH_BY_ID } from "@website/content/paths"
import { PROBLEM_BY_ID } from "@website/content/problems"
import {
  COUNTERWEIGHTS,
  DOWNSTREAM,
  PRICE_EXAMPLE,
  type Reason,
  REASONS,
} from "@website/content/why"
import type { Metadata } from "next"
import Link from "next/link"
import { costFor } from "../your-plan/cost"

export const metadata: Metadata = {
  title: "Why universal health care",
  description:
    "The reasons for universal health care, from coverage and business creation to lower prices and less paperwork, and which of them depend on the paths chosen.",
}

function ReasonSection({ r, n }: { r: Reason; n: string }) {
  const evidence = [
    ...r.problems.flatMap((id) => PROBLEM_BY_ID[id].evidence),
    ...(r.evidence ?? []),
  ]
  return (
    <section id={r.id} className="mb-12 scroll-mt-6">
      <h3 className="mb-2 text-xl font-semibold">{`${n}. ${r.title}`}</h3>
      <p className="mb-4 max-w-prose">{r.body}</p>
      <ul className="space-y-3">
        {evidence.map((e) => (
          <li key={e.text} className="border-l-2 border-rule pl-4 text-sm">
            {e.text}
            <Sources ids={e.sourceIds} />
          </li>
        ))}
      </ul>
      {r.paths && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Example paths that would deliver this
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {r.paths.map((id) => (
              <PathLink key={id} path={PATH_BY_ID[id]} />
            ))}
          </div>
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-muted-foreground">More on:</span>
        {r.problems.map((id) => (
          <ProblemChip key={id} id={id} />
        ))}
      </div>
    </section>
  )
}

function PriceExample() {
  const base = costFor(new Set(PRICE_EXAMPLE.base))
  const priced = costFor(new Set([...PRICE_EXAMPLE.base, ...PRICE_EXAMPLE.withPrices]))
  if (!base || !priced) return null
  const rows = [
    { label: "Today", total: base.nationalBefore, delta: undefined, pct: undefined },
    {
      label: "Single payer, no price paths",
      total: base.nationalAfter,
      delta: base.delta,
      pct: base.deltaPct,
    },
    {
      label: "Single payer with the price paths",
      total: priced.nationalAfter,
      delta: priced.delta,
      pct: priced.deltaPct,
    },
  ]
  return (
    <section className="mb-12 rounded-md border border-rule bg-card p-5">
      <h3 className="mb-1 text-xl font-semibold">Example: the same coverage, two price choices</h3>
      <p className="mb-4 max-w-prose text-sm">
        Both cases cover everyone through a single payer with no point-of-care charges. The second
        adds{" "}
        {PRICE_EXAMPLE.withPrices.map((id, i) => (
          <span key={id}>
            {i > 0 && (i === PRICE_EXAMPLE.withPrices.length - 1 ? ", and " : ", ")}
            <Link href={`/paths/${id}`} className="underline">
              {PATH_BY_ID[id].title.toLowerCase()}
            </Link>
          </span>
        ))}
        . Without them, the cost model uses its high-price and high-admin cases.
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-rule text-left text-muted-foreground">
            <th className="py-2 font-normal">National health spending</th>
            <th className="py-2 text-right font-normal">Per year</th>
            <th className="py-2 text-right font-normal">Change</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-rule last:border-0">
              <td className="py-2">{r.label}</td>
              <td className="num py-2 text-right">{fmt(r.total)}</td>
              <td className="num py-2 text-right">
                {r.delta === undefined || r.pct === undefined
                  ? "—"
                  : `${fmt(r.delta, { sign: true })} (${r.pct > 0 ? "+" : "−"}${Math.abs(r.pct * 100).toFixed(1)}%)`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-muted-foreground">
        From the site&apos;s cost model; see{" "}
        <Link href="/method" className="underline">
          the method
        </Link>{" "}
        for its assumptions, or mix your own paths in{" "}
        <Link href="/your-plan" className="underline">
          Build your plan
        </Link>
        .
      </p>
    </section>
  )
}

export default function WhyPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="The case"
        title="Why universal health care"
        lede="Some benefits come from covering everyone, whatever the design. Others depend on which paths are chosen. Each reason links to the evidence behind it, and the costs and risks are at the end so the case can be weighed, not just read."
      />
      <nav aria-label="Reasons" className="mb-10 grid gap-6 text-sm sm:grid-cols-2">
        {[
          ["Why cover everyone", REASONS, "a"],
          ["What it can also bring, depending on the paths", DOWNSTREAM, "b"],
        ].map(([title, list, k]) => (
          <div key={k as string}>
            <div className="mb-1 font-semibold">{title as string}</div>
            <ol className="list-decimal space-y-1 pl-5">
              {(list as Reason[]).map((r) => (
                <li key={r.id}>
                  <a
                    href={`#${r.id}`}
                    className="underline decoration-rule underline-offset-2 hover:text-primary"
                  >
                    {r.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </nav>

      <h2 className="mb-2 text-2xl font-semibold">Why cover everyone</h2>
      <p className="mb-8 max-w-prose text-sm text-muted-foreground">
        These follow from universal coverage itself, whichever payer structure delivers it.
      </p>
      {REASONS.map((r, i) => (
        <ReasonSection key={r.id} r={r} n={`${i + 1}`} />
      ))}

      <h2 className="mb-2 border-t border-rule pt-10 text-2xl font-semibold">
        What it can also bring, depending on the paths
      </h2>
      <p className="mb-8 max-w-prose text-sm text-muted-foreground">
        Universal coverage makes these possible, but they only happen if the matching paths are
        chosen. Each lists example paths; open one for its trade-offs.
      </p>
      <PriceExample />
      {DOWNSTREAM.map((r, i) => (
        <ReasonSection key={r.id} r={r} n={`${i + 1}`} />
      ))}

      <section className="mb-10 rounded-md border border-rule bg-card p-5">
        <h2 className="mb-2 text-xl font-semibold">What it costs, and what could go wrong</h2>
        <p className="mb-3 text-sm">
          Universal coverage has real costs. Each page below gives the case that it is a serious
          cost and the case that it isn&apos;t, with sources.
        </p>
        <ul className="mb-3 space-y-1 text-sm">
          {COUNTERWEIGHTS.map((id) => (
            <li key={id}>
              <Link
                href={`/problems/${id}`}
                className="underline decoration-rule underline-offset-2 hover:text-primary"
              >
                {PROBLEM_BY_ID[id].title}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm">
          For the full price tag, see the{" "}
          <Link href="/costs" className="underline">
            cost ledger
          </Link>
          , and to weigh the options yourself, try{" "}
          <Link href="/your-plan" className="underline">
            Build your plan
          </Link>
          .
        </p>
      </section>
    </Page>
  )
}
