"use client"
/**
 * Mix-and-match panels for problem and group pages: toggle the paths that
 * cause or fix something and see the result under that mix. Picks are shared
 * with /your-plan (see lib/picks.ts).
 */
import { Button } from "@website/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@website/components/ui/sheet"
import { usePicks } from "@website/lib/picks"
import { cn } from "@website/lib/utils"
import Link from "next/link"
import { useState } from "react"

export type MiniPath = { id: string; title: string }

function Chip({ path, on, onToggle }: { path: MiniPath; on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={cn(
        "min-h-9 rounded-md border px-2.5 py-1.5 text-left text-xs leading-snug",
        on
          ? "border-primary bg-accent font-medium text-accent-foreground"
          : "border-rule bg-card text-foreground/80 hover:border-primary/50",
      )}
    >
      {on && <span aria-hidden="true">✓ </span>}
      {path.title}
    </button>
  )
}

function Chips({
  label,
  paths,
  picks,
  toggle,
}: {
  label: string
  paths: MiniPath[]
  picks: Set<string>
  toggle: (id: string) => void
}) {
  if (!paths.length) return null
  return (
    <div className="mt-2">
      <div className="mb-1 text-xs text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {paths.map((p) => (
          <Chip
            key={p.id}
            path={p}
            on={picks.has(p.id)}
            onToggle={() => {
              toggle(p.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}

function Footer({ s }: { s: ReturnType<typeof usePicks> }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-3 text-xs text-muted-foreground">
      <span>
        {`${s.fromLink ? "Showing the mix from this link." : "Using your saved plan."} ${s.picks.size} paths picked.`}
      </span>
      {s.fromLink ? (
        <button type="button" className="underline" onClick={s.useSaved}>
          Use my saved plan instead
        </button>
      ) : (
        <Link href="/your-plan" className="underline">
          Edit all picks
        </Link>
      )}
      <button
        type="button"
        className="underline"
        onClick={() => {
          void navigator.clipboard.writeText(s.shareUrl()).then(() => {
            setCopied(true)
          })
        }}
      >
        {copied ? "Link copied" : "Copy a link to this mix"}
      </button>
    </div>
  )
}

const names = (ps: MiniPath[]) => ps.map((p) => p.title).join(", ")

/** On a problem page: is it caused, and is it fixed, under the reader's mix? */
export function ProblemScenario({ causers, fixers }: { causers: MiniPath[]; fixers: MiniPath[] }) {
  const s = usePicks()
  const cause = causers.filter((p) => s.picks.has(p.id))
  const fix = fixers.filter((p) => s.picks.has(p.id))
  const derived = causers.length > 0
  const verdict = !s.loaded
    ? ""
    : derived && cause.length === 0
      ? "Not caused by your mix: none of the paths that create or worsen it is picked."
      : fix.length
        ? `${derived ? `Caused by ${names(cause)}; ` : ""}addressed by ${names(fix)}.`
        : `${derived ? `Caused by ${names(cause)} and ` : ""}not addressed by any picked path.`
  const tone = derived && cause.length === 0 ? "neutral" : fix.length ? "gain" : "loss"
  return (
    <section className="mb-10 rounded-md border border-rule bg-card p-4">
      <h2 className="text-lg font-semibold">Under your mix of paths</h2>
      <p
        className={cn(
          "mt-1 min-h-5 text-sm",
          tone === "gain" && "text-gain",
          tone === "loss" && "text-loss",
        )}
      >
        {verdict}
      </p>
      <Chips
        label="Paths that create or worsen it"
        paths={causers}
        picks={s.picks}
        toggle={s.toggle}
      />
      <Chips label="Paths that fix or soften it" paths={fixers} picks={s.picks} toggle={s.toggle} />
      <Footer s={s} />
    </section>
  )
}

export type GroupRow = {
  problemId: string
  title: string
  kind: "hurts" | "profits"
  how: string
  causers: MiniPath[]
  fixers: MiniPath[]
}

/** On a group page: how the group fares, problem by problem, under the reader's mix. */
export function GroupScenario({ label, rows }: { label: string; rows: GroupRow[] }) {
  const s = usePicks()
  const results = rows.map((r) => {
    const cause = r.causers.filter((p) => s.picks.has(p.id))
    const fix = r.fixers.filter((p) => s.picks.has(p.id))
    // Fixing a problem helps those it hurts and costs those who profit from it; causing it does the reverse.
    const gainBy = r.kind === "hurts" ? fix : cause
    const loseBy = r.kind === "hurts" ? cause : fix
    return { r, gainBy, loseBy }
  })
  const gains = results.filter((x) => x.gainBy.length)
  const losses = results.filter((x) => x.loseBy.length)
  return (
    <section className="mb-10 rounded-md border border-rule bg-card p-4">
      <h2 className="text-lg font-semibold">Under your mix of paths</h2>
      {s.loaded && (
        <div className="mt-3 grid gap-4 text-sm md:grid-cols-2">
          <div>
            <div className="mb-1 font-semibold text-gain">{`${label} gain (${gains.length})`}</div>
            {gains.length ? (
              <ul className="list-disc space-y-1 pl-5">
                {gains.map(({ r, gainBy }) => (
                  <li key={r.problemId}>
                    {`${r.title} `}
                    <span className="text-muted-foreground">{`via ${names(gainBy)}`}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nothing in this mix.</p>
            )}
          </div>
          <div>
            <div className="mb-1 font-semibold text-loss">{`${label} lose (${losses.length})`}</div>
            {losses.length ? (
              <ul className="list-disc space-y-1 pl-5">
                {losses.map(({ r, loseBy }) => (
                  <li key={r.problemId}>
                    {`${r.title} `}
                    <span className="text-muted-foreground">{`via ${names(loseBy)}`}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nothing in this mix.</p>
            )}
          </div>
        </div>
      )}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="mt-4 h-11">
            Mix and match paths
          </Button>
        </SheetTrigger>
        <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-rule p-4 pr-12 text-left">
            <SheetTitle>Mix and match paths</SheetTitle>
            <SheetDescription>
              {`Toggle paths to see how ${label.toLowerCase()} fare. ${gains.length} gains, ${losses.length} losses under this mix.`}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            {rows.map((r) => (
              <div key={r.problemId} className="border-l-2 border-rule pl-3">
                <Link
                  href={`/problems/${r.problemId}`}
                  className="text-sm font-medium hover:underline"
                >
                  {r.title}
                </Link>
                <Chips
                  label={
                    r.kind === "hurts"
                      ? "Hurt them (create or worsen it)"
                      : "Help them (create or worsen it)"
                  }
                  paths={r.causers}
                  picks={s.picks}
                  toggle={s.toggle}
                />
                <Chips
                  label={r.kind === "hurts" ? "Help them (fix it)" : "Cost them (fix it)"}
                  paths={r.fixers}
                  picks={s.picks}
                  toggle={s.toggle}
                />
              </div>
            ))}
          </div>
          <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Footer s={s} />
          </div>
        </SheetContent>
      </Sheet>
      <Footer s={s} />
    </section>
  )
}
