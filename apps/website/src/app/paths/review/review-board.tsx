"use client"
/** TEMPORARY: client side of /paths/review. Saves every edit to review-overrides.json. */
import type { Override } from "@website/content/paths"
import { cn } from "@website/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@website/components/ui/button"
import Fuse from "fuse.js"
import { useEffect, useMemo, useState } from "react"

type Status = "chosen" | "rejected"
type Confidence = "high" | "medium" | "low"

export type ReviewRow = {
  id: string
  title: string
  summary: string
  problemId: string
  problemTitle: string
  status: Status
  phase: string | null
  confidence: Confidence
  reason: string
  review: string | null
  requires: string[]
  conflicts: string[]
  creates: string[]
}

type Overrides = Record<string, Override>
type Order = "priority" | "status" | "problem"
type SaveState = "idle" | "saving" | "saved" | "error"

const CONF_ORDER = { low: 0, medium: 1, high: 2 } as const
const CONF_STYLE = {
  low: "bg-loss-soft text-loss",
  medium: "bg-caution-soft text-caution",
  high: "bg-gain-soft text-gain",
} as const

function Tag({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        className,
      )}
    >
      {children}
    </span>
  )
}

export function ReviewBoard({
  rows,
  initial,
  errors,
  phases,
  canSave,
}: {
  rows: ReviewRow[]
  initial: Overrides
  errors: string[]
  phases: { id: string; label: string }[]
  canSave: boolean
}) {
  const router = useRouter()
  const [edits, setEdits] = useState<Overrides>(initial)
  const [saved, setSaved] = useState<Overrides>(initial)
  const [save, setSave] = useState<SaveState>("idle")
  const [order, setOrder] = useState<Order>("priority")
  const [hideReviewed, setHideReviewed] = useState(true)
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [query, setQuery] = useState("")

  const unsaved = rows.filter(
    (r) => JSON.stringify(edits[r.id] ?? {}) !== JSON.stringify(saved[r.id] ?? {}),
  ).length

  useEffect(() => {
    if (!unsaved) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener("beforeunload", warn)
    return () => {
      window.removeEventListener("beforeunload", warn)
    }
  }, [unsaved])

  const saveNow = async () => {
    setSave("saving")
    try {
      const res = await fetch("/paths/review/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(edits),
      })
      if (!res.ok) throw new Error(String(res.status))
      setSaved(edits)
      setSave("saved")
      router.refresh()
    } catch {
      setSave("error")
    }
  }

  const update = (id: string, patch: Partial<Override>) => {
    setEdits((e) => {
      const next: Override = { ...e[id], ...patch }
      for (const k of Object.keys(next) as (keyof Override)[])
        if (next[k] === undefined || next[k] === "") delete next[k]
      const out = { ...e }
      if (Object.keys(next).length) out[id] = next
      else delete out[id]
      return out
    })
  }

  const current = (r: ReviewRow) => {
    const o = edits[r.id] ?? {}
    const status = o.status ?? r.status
    return {
      status,
      phase: status === "chosen" ? (o.phase ?? r.phase) : null,
      reviewed: o.reviewed ?? false,
      note: o.note ?? "",
      changed: (!!o.status && o.status !== r.status) || (!!o.phase && o.phase !== r.phase),
    }
  }

  const reviewedCount = rows.filter((r) => edits[r.id]?.reviewed).length
  const changedCount = rows.filter((r) => current(r).changed).length

  const fuse = useMemo(
    () =>
      new Fuse(
        rows.map((r) => ({ ...r, note: edits[r.id]?.note ?? "" })),
        {
          keys: [
            { name: "title", weight: 3 },
            { name: "problemTitle", weight: 2 },
            "summary",
            "reason",
            "review",
            "note",
            "id",
          ],
          threshold: 0.35,
          ignoreLocation: true,
        },
      ),
    [rows, edits],
  )

  const visible = useMemo(() => {
    const q = query.trim()
    const matches = q ? new Set(fuse.search(q).map((m) => m.item.id)) : null
    const list = rows.filter(
      (r) =>
        (!hideReviewed || !edits[r.id]?.reviewed) &&
        (!flaggedOnly || r.review) &&
        (!matches || matches.has(r.id)),
    )
    const byPriority = (a: ReviewRow, b: ReviewRow) =>
      CONF_ORDER[a.confidence] - CONF_ORDER[b.confidence] || Number(!a.review) - Number(!b.review)
    const reviewed = (r: ReviewRow) => Number(edits[r.id]?.reviewed ?? false)
    if (order === "status")
      return list.toSorted((a, b) => reviewed(a) - reviewed(b) || byPriority(a, b))
    if (order === "problem")
      return list.toSorted((a, b) => a.problemTitle.localeCompare(b.problemTitle))
    return list.toSorted(byPriority)
  }, [rows, edits, hideReviewed, flaggedOnly, query, order, fuse])

  const errorsFor = (id: string) =>
    errors.filter((e) => e.startsWith(`${id}:`) || e.startsWith(`${id}.`))

  return (
    <div className="pb-24">
      {!canSave && (
        <div className="mb-6 rounded-md border-l-4 border-loss/40 bg-loss-soft px-5 py-4 text-sm">
          Saving only works under <code>pnpm run dev</code>. This build is read-only.
        </div>
      )}

      <div className="sticky top-0 z-10 -mx-4 mb-6 border-b border-rule bg-background/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span>
            <strong className="font-mono">{reviewedCount}</strong> / {rows.length} reviewed
          </span>
          <span>
            <strong className="font-mono">{changedCount}</strong> changed from draft
          </span>
          <span className={cn(errors.length ? "text-loss" : "text-gain", "font-medium")}>
            {errors.length ? `${errors.length} consistency problems` : "Plan is consistent"}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
            }}
            placeholder="Search titles, problems, reasons, notes"
            aria-label="Search paths or problems"
            className="min-h-10 w-full rounded-md border border-rule bg-card px-3 text-base sm:w-72 sm:text-sm"
          />
          <label className="flex min-h-10 items-center gap-2">
            <input
              type="checkbox"
              aria-label="Hide reviewed"
              checked={hideReviewed}
              onChange={(e) => {
                setHideReviewed(e.target.checked)
              }}
            />
            Hide reviewed
          </label>
          <label className="flex min-h-10 items-center gap-2">
            <input
              type="checkbox"
              aria-label="Flagged only"
              checked={flaggedOnly}
              onChange={(e) => {
                setFlaggedOnly(e.target.checked)
              }}
            />
            Flagged only
          </label>
          <label className="flex min-h-10 items-center gap-2">
            Order
            <select
              value={order}
              onChange={(e) => {
                const next = e.target.value as Order
                setOrder(next)
                if (next === "status") setHideReviewed(false)
              }}
              className="min-h-10 rounded-md border border-rule bg-card px-2"
            >
              <option value="priority">Review priority</option>
              <option value="status">Review status (unreviewed first)</option>
              <option value="problem">By problem</option>
            </select>
          </label>
        </div>
      </div>

      {errors.length > 0 && (
        <details className="mb-6 rounded-md border border-loss/40 bg-loss-soft px-5 py-3 text-sm">
          <summary className="cursor-pointer font-semibold text-loss">
            {errors.length} consistency problems (the production build fails until these are fixed)
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </details>
      )}

      <p className="mb-4 text-sm text-muted-foreground">Showing {visible.length} paths.</p>

      <ol className="space-y-4">
        {visible.map((r) => {
          const c = current(r)
          const rowErrors = errorsFor(r.id)
          return (
            <li
              key={r.id}
              className={cn(
                "rounded-md border bg-card p-4 sm:p-5",
                rowErrors.length ? "border-loss/60" : "border-rule",
                c.reviewed && "opacity-70",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/paths/${r.id}`}
                    target="_blank"
                    className="text-lg font-semibold hover:text-primary hover:underline"
                  >
                    {r.title}
                  </Link>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Problem:{" "}
                    <Link href={`/problems/${r.problemId}`} target="_blank" className="underline">
                      {r.problemTitle}
                    </Link>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Tag className={CONF_STYLE[r.confidence]}>{r.confidence} confidence</Tag>
                  <Tag className="bg-secondary text-foreground/75">Draft: {r.status}</Tag>
                  {c.changed && <Tag className="bg-accent text-accent-foreground">Changed</Tag>}
                  {c.reviewed && <Tag className="bg-gain-soft text-gain">Reviewed</Tag>}
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-foreground/85">{r.summary}</p>
              <p className="mt-2 text-sm leading-relaxed">
                <span className="font-medium">Why the draft: </span>
                {r.reason}
              </p>
              {r.review && (
                <p className="mt-2 rounded-sm bg-caution-soft px-3 py-2 text-sm leading-relaxed">
                  <span className="font-medium">Check: </span>
                  {r.review}
                </p>
              )}
              {(r.requires.length > 0 || r.conflicts.length > 0 || r.creates.length > 0) && (
                <dl className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
                  {r.requires.length > 0 && (
                    <div>
                      <dt className="font-semibold uppercase">Requires</dt>
                      <dd>{r.requires.join("; ")}</dd>
                    </div>
                  )}
                  {r.conflicts.length > 0 && (
                    <div>
                      <dt className="font-semibold uppercase">Conflicts with</dt>
                      <dd>{r.conflicts.join("; ")}</dd>
                    </div>
                  )}
                  {r.creates.length > 0 && (
                    <div>
                      <dt className="font-semibold uppercase">Creates</dt>
                      <dd>{r.creates.join("; ")}</dd>
                    </div>
                  )}
                </dl>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
                <fieldset className="m-0 flex border-0 p-0">
                  <legend className="sr-only">{`Decision for ${r.title}`}</legend>
                  {(["chosen", "rejected"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={c.status === s}
                      disabled={!canSave}
                      onClick={() => {
                        update(r.id, {
                          status: s === r.status ? undefined : s,
                          phase:
                            s === "chosen" && !r.phase && !edits[r.id]?.phase
                              ? (phases[1]?.id as Override["phase"])
                              : s === "rejected"
                                ? undefined
                                : edits[r.id]?.phase,
                        })
                      }}
                      className={cn(
                        "min-h-10 border px-4 text-sm font-medium first:rounded-l-md last:rounded-r-md",
                        c.status === s
                          ? s === "chosen"
                            ? "border-gain bg-gain-soft text-gain"
                            : "border-loss bg-loss-soft text-loss"
                          : "border-rule bg-card text-foreground/70",
                      )}
                    >
                      {s === "chosen" ? "Choose" : "Reject"}
                    </button>
                  ))}
                </fieldset>
                {c.status === "chosen" && (
                  <select
                    aria-label="Phase"
                    value={c.phase ?? ""}
                    disabled={!canSave}
                    onChange={(e) => {
                      update(r.id, {
                        phase:
                          e.target.value === r.phase
                            ? undefined
                            : (e.target.value as Override["phase"]),
                      })
                    }}
                    className="min-h-10 rounded-md border border-rule bg-card px-2 text-sm"
                  >
                    {phases.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                )}
                <label className="flex min-h-10 items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    aria-label={`Reviewed: ${r.title}`}
                    checked={c.reviewed}
                    disabled={!canSave}
                    onChange={(e) => {
                      update(r.id, { reviewed: e.target.checked || undefined })
                    }}
                  />
                  Reviewed
                </label>
                {edits[r.id] && (
                  <button
                    type="button"
                    disabled={!canSave}
                    onClick={() => {
                      setEdits((e) => {
                        const out = { ...e }
                        delete out[r.id]
                        return out
                      })
                    }}
                    className="ml-auto min-h-10 text-sm text-muted-foreground underline"
                  >
                    Reset to draft
                  </button>
                )}
              </div>
              <textarea
                value={c.note}
                disabled={!canSave}
                onChange={(e) => {
                  update(r.id, { note: e.target.value || undefined })
                }}
                rows={2}
                placeholder="Your note for Claude (optional): e.g. 'flip to regulated multi-payer', 'move to wave one'"
                aria-label={`Your note on ${r.title}`}
                className="mt-3 w-full rounded-md border border-rule bg-background px-3 py-2 text-base sm:text-sm"
              />
              {rowErrors.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-loss">
                  {rowErrors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ol>

      {canSave && (unsaved > 0 || save !== "idle") && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-rule bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <span className="text-sm" aria-live="polite">
              {save === "saving"
                ? "Saving…"
                : save === "error"
                  ? "Save failed. Is the dev server running?"
                  : unsaved
                    ? `${unsaved} unsaved ${unsaved === 1 ? "path" : "paths"}`
                    : "All changes saved"}
            </span>
            <Button
              variant="outline"
              className="ml-auto h-11"
              disabled={!unsaved || save === "saving"}
              onClick={() => {
                setEdits(saved)
                setSave("idle")
              }}
            >
              Discard
            </Button>
            <Button
              className="h-11 px-6"
              disabled={!unsaved || save === "saving"}
              onClick={() => void saveNow()}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
