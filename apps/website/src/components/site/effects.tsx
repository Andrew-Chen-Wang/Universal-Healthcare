import { PathLink } from "@website/components/site/paths"
import { Sources } from "@website/components/site/ui"
import { type Effect, fixersOf, type Impact } from "@website/content/graph"
import { PROBLEM_BY_ID } from "@website/content/problems"
import { cn } from "@website/lib/utils"
import Link from "next/link"

const TONE = {
  gain: "border-gain/25 bg-gain-soft/40",
  loss: "border-loss/25 bg-loss-soft/40",
}

/** What a path fixes, or what it creates or worsens; each effect links to its own page. */
export function EffectList({
  title,
  effects,
  tone,
  showFixes,
}: {
  title: string
  effects: Effect[]
  tone: "gain" | "loss"
  /** Under each harm, list the paths that soften it. */
  showFixes?: boolean
}) {
  return (
    <div className={cn("rounded-md border p-4", TONE[tone])}>
      <div className="mb-3 text-xs font-semibold tracking-wide uppercase">{title}</div>
      {effects.length === 0 ? (
        <p className="text-sm text-muted-foreground">None identified.</p>
      ) : (
        <ul className="space-y-4 text-sm">
          {effects.map((e) => (
            <li key={e.problemId ?? e.title}>
              {e.problemId ? (
                <Link
                  href={`/problems/${e.problemId}`}
                  className="font-medium underline decoration-rule underline-offset-2 hover:text-primary"
                >
                  {e.title}
                </Link>
              ) : (
                <span>{e.title}</span>
              )}
              {e.note && <p className="mt-1 text-foreground/80">{e.note}</p>}
              {e.sourceIds && <Sources ids={e.sourceIds} />}
              {showFixes && e.problemId && <Softeners problemId={e.problemId} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Softeners({ problemId }: { problemId: string }) {
  const fixes = fixersOf(problemId)
  if (!fixes.length) return null
  return (
    <details className="mt-2">
      <summary className="cursor-pointer text-xs text-muted-foreground">
        {fixes.length} {fixes.length === 1 ? "path softens" : "paths soften"} this
      </summary>
      <div className="mt-2 grid gap-1.5">
        {fixes.map((f) => (
          <PathLink key={f.id} path={f} />
        ))}
      </div>
    </details>
  )
}

/** Who gains or loses, each group linking to its page, with the problems that connect them. */
export function ImpactList({
  title,
  impacts,
  tone,
}: {
  title: string
  impacts: Impact[]
  tone: "gain" | "loss"
}) {
  return (
    <div className={cn("rounded-md border p-4", TONE[tone])}>
      <div className="mb-3 text-xs font-semibold tracking-wide uppercase">{title}</div>
      {impacts.length === 0 ? (
        <p className="text-sm text-muted-foreground">None identified.</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {impacts.map((i) => (
            <li key={i.label}>
              {i.group ? (
                <Link
                  href={`/groups/${i.group.id}`}
                  className="font-medium underline decoration-rule underline-offset-2 hover:text-primary"
                >
                  {i.label}
                </Link>
              ) : (
                <span>{i.label}</span>
              )}
              {i.via.length > 0 && (
                <ul className="mt-1 space-y-0.5 text-xs text-foreground/75">
                  {i.via.map((v) => (
                    <li key={v.problemId}>
                      <Link href={`/problems/${v.problemId}`} className="hover:underline">
                        {PROBLEM_BY_ID[v.problemId].title}
                      </Link>
                      : {v.how}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
