import { ProblemChip, StatusPill } from "@website/components/site/paths"
import { Callout, Page, PageHeader, Stat } from "@website/components/site/ui"
import { slug } from "@website/content/navigation"
import {
  complementsOf,
  conflictsOf,
  PATH_BY_ID,
  PATHS,
  pathsFor,
  type SolutionPath,
} from "@website/content/paths"
import { PROBLEM_BY_ID, PROBLEM_CATEGORIES, PROBLEMS } from "@website/content/problems"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Solution paths: decide" }

/** The few choices most other paths depend on, shown first. */
const KEY_DECISIONS = [
  { problemId: "uninsured", label: "Who pays: payer structure" },
  { problemId: "high-prices", label: "How providers are paid and prices set" },
  { problemId: "underinsurance", label: "What patients pay at the point of care" },
  { problemId: "x-new-taxes", label: "How the public share is financed" },
  { problemId: "transition-disruption", label: "How fast to transition" },
]

function PathRow({ p, depth, seen }: { p: SolutionPath; depth: number; seen: Set<string> }) {
  const created = (p.spawns ?? []).filter((c) => !seen.has(c))
  const next = new Set([...seen, ...created])
  return (
    <li className="py-1.5">
      <div className="flex flex-wrap items-baseline gap-2">
        <Link href={`/paths/${p.id}`} className="text-sm hover:text-primary hover:underline">
          {p.title}
        </Link>
        <StatusPill status={p.status} />
        {p.requires?.map((r) => (
          <span key={r} className="text-[11px] text-muted-foreground">
            requires{" "}
            <Link href={`/paths/${r}`} className="underline">
              {PATH_BY_ID[r]?.title}
            </Link>
          </span>
        ))}
      </div>
      {created.length > 0 && depth < 3 && (
        <ul className="mt-1 ml-3 space-y-1 border-l border-loss/30 pl-3">
          {created.map((c) => (
            <li key={c}>
              <details>
                <summary className="cursor-pointer text-xs text-loss">
                  creates: {PROBLEM_BY_ID[c]?.title} ({pathsFor(c).length} subpaths)
                </summary>
                <ul className="ml-1">
                  {pathsFor(c).map((sp) => (
                    <PathRow key={sp.id} p={sp} depth={depth + 1} seen={next} />
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function ProblemNode({ id, label, open = false }: { id: string; label?: string; open?: boolean }) {
  const pr = PROBLEM_BY_ID[id]
  const paths = pathsFor(id)
  return (
    <details open={open} className="rounded-md border border-rule bg-card px-4 py-2">
      <summary className="cursor-pointer font-medium">
        {label ?? pr.title}{" "}
        <span className="text-xs font-normal text-muted-foreground">· {paths.length} paths</span>
      </summary>
      {label && (
        <p className="mt-1 text-xs text-muted-foreground">
          Problem: <ProblemChip id={id} />
        </p>
      )}
      <ul className="mt-2 divide-y divide-rule">
        {paths.map((p) => (
          <PathRow key={p.id} p={p} depth={0} seen={new Set([id])} />
        ))}
      </ul>
    </details>
  )
}

export default function PathsPage() {
  const created = PROBLEMS.filter((p) => p.category === "Problems created by solution paths")
  const links = PATHS.reduce(
    (n, p) =>
      n +
      (p.solves?.length ?? 0) +
      (p.worsens?.length ?? 0) +
      (p.spawns?.length ?? 0) +
      (p.requires?.length ?? 0),
    0,
  )
  const conflictPairs = PATHS.reduce((n, p) => n + conflictsOf(p.id).length, 0) / 2
  const complementPairs = PATHS.reduce((n, p) => n + complementsOf(p.id).length, 0) / 2
  const decided = PATHS.filter((p) => p.status !== "open").length
  return (
    <Page>
      <PageHeader
        eyebrow="Part 1 · Solution paths"
        title="Every path, so you can decide"
        lede="Each problem has two or more possible solution paths, each with pros, drawbacks, who gains, who loses, how to mend the losers, and where it has been tried. Many paths create new problems, which have their own subpaths. Nothing here is chosen yet."
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Solution paths" value={PATHS.length.toString()} />
        <Stat label="Problems" value={PROBLEMS.length.toString()} />
        <Stat label="Problems created by paths" value={created.length.toString()} />
        <Stat label="Decided" value={`${decided} / ${PATHS.length}`} />
      </div>

      <Callout title="How to read the relationships">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            <b>Addresses / also helps</b>: problems the path fixes ({links} links in total across
            paths).
          </li>
          <li>
            <b>Creates or worsens</b>: new problems the path causes. Expand “creates” below to see
            the subpaths that answer them.
          </li>
          <li>
            <b>Requires</b>: another path that must also be chosen.
          </li>
          <li>
            <b>Conflicts</b> ({conflictPairs} pairs): choosing one rules out the other.{" "}
            <b>Works well with</b> ({complementPairs} pairs): natural combinations.
          </li>
        </ul>
      </Callout>

      <section className="mb-10">
        <h2 className="mb-1 text-xl font-semibold">Key decisions first</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Most other paths depend on these choices (many require or conflict with them).
        </p>
        <div className="space-y-2">
          {KEY_DECISIONS.map((k, i) => (
            <ProblemNode key={k.problemId} id={k.problemId} label={k.label} open={i === 0} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">All problems and their paths</h2>
        {PROBLEM_CATEGORIES.map((c) => (
          <div key={c} id={slug(c)} className="mb-6 scroll-mt-20">
            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {c}
            </h3>
            <div className="space-y-2">
              {PROBLEMS.filter((p) => p.category === c).map((p) => (
                <ProblemNode key={p.id} id={p.id} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </Page>
  )
}
