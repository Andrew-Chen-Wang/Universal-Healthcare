import { TREND_LAST_YEAR, TREND_SERIES, type TrendSeriesId } from "@website/content/cost-trend-data"
import type { CostEvent } from "@website/content/cost-events"
import { annualGrowth, fmtPct, totalChange } from "@website/content/cost-trends"
import { SOURCE_BY_ID } from "@website/content/sources"
import Link from "next/link"

const LAST = TREND_LAST_YEAR
const WINDOWS = [
  { label: `${LAST - 1} → ${LAST}`, sub: "change in the latest year", from: LAST - 1, kind: "yoy" },
  { label: `${LAST - 5}–${LAST}`, sub: "average per year, 5 years", from: LAST - 5, kind: "avg" },
  {
    label: `${LAST - 10}–${LAST}`,
    sub: "average per year, 10 years",
    from: LAST - 10,
    kind: "avg",
  },
] as const

const COMPARE: Record<string, TrendSeriesId[]> = {
  usdB: ["nhe-total", "cpi"],
  thousands: ["emp-healthcare"],
  index: ["eci-private", "cpi"],
}
const COMPARE_LABEL: Partial<Record<TrendSeriesId, string>> = {
  "nhe-total": "All health spending",
  cpi: "Inflation (CPI)",
  "emp-healthcare": "All health care jobs",
  "eci-private": "All private-sector wages",
}

const growthOver = (id: TrendSeriesId, from: number, kind: "yoy" | "avg") =>
  kind === "yoy" ? totalChange(id, from) : annualGrowth(id, from)

export function formatValue(id: TrendSeriesId, v: number) {
  const unit = TREND_SERIES[id].unit
  if (unit === "usdB") {
    if (v >= 1000) return `$${(v / 1000).toFixed(2)}T`
    if (v < 1) return `$${Math.round(v * 1000).toLocaleString("en-US")}M`
    return `$${v.toLocaleString("en-US", { maximumFractionDigits: 1 })}B`
  }
  if (unit === "thousands") return `${(v / 1000).toFixed(2)}M jobs`
  return v.toFixed(1)
}

/** Three growth tiles for the main series, each with comparisons underneath. */
export function GrowthTiles({ id }: { id: TrendSeriesId }) {
  const compare = (COMPARE[TREND_SERIES[id].unit] ?? []).filter((c) => c !== id)
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-3">
      {WINDOWS.map((w) => (
        <div key={w.label} className="rounded-md border border-rule bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase">{w.label}</div>
          <div className="num mt-1 text-2xl">{fmtPct(growthOver(id, w.from, w.kind))}</div>
          <div className="text-xs text-muted-foreground">{w.sub}</div>
          {compare.length > 0 && (
            <ul className="mt-2 space-y-0.5 border-t border-rule pt-2 text-xs text-muted-foreground">
              {compare.map((c) => (
                <li key={c} className="flex justify-between gap-2">
                  <span>{COMPARE_LABEL[c]}</span>
                  <span className="num">{fmtPct(growthOver(c, w.from, w.kind))}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

/** An event numbered for this page, with the series it moved. */
export type NumberedEvent = CostEvent & { n: number }

const NO_EVENTS: NumberedEvent[] = []
const pos = (i: number, n: number) => `${((i + 0.5) / n) * 100}%`

/** Yearly bars for one series, with event markers, decade labels, and a table view. */
export function TrendChart({
  id,
  title,
  events = NO_EVENTS,
}: {
  id: TrendSeriesId
  title: string
  events?: NumberedEvent[]
}) {
  const { values, firstYear } = TREND_SERIES[id]
  const n = values.length
  const years = values.map((_, i) => firstYear + i)
  const max = Math.max(...values.map((v) => v ?? 0))
  const first = values.find((v) => v !== null && v > 0)
  const last = values.at(-1)
  const marks = events.filter((e) => e.series.includes(id) && e.year <= TREND_LAST_YEAR)
  const idx = (y: number) => Math.min(n - 1, Math.max(0, y - firstYear))
  return (
    <figure className="mb-4">
      <figcaption className="mb-1 text-sm font-medium">{title}</figcaption>
      {/* Bars and markers are hidden from screen readers; the event list and the yearly figures below carry the data. */}
      <div aria-hidden className="relative">
        <div className="relative h-5">
          {marks.map((e) => (
            <span
              key={e.n}
              title={`${e.n}. ${e.year}${e.endYear ? `–${e.endYear}` : ""}: ${e.title}`}
              className="absolute top-0 flex h-4 min-w-4 -translate-x-1/2 items-center justify-center rounded-full bg-foreground px-1 text-[10px] leading-none font-medium text-background"
              style={{ left: pos(idx(e.year), n) }}
            >
              {e.n}
            </span>
          ))}
        </div>
        <div
          className={`relative flex h-36 items-end border-b border-rule ${n > 40 ? "gap-px" : "gap-0.5"}`}
        >
          {marks
            .filter((e) => e.endYear && e.endYear > e.year)
            .map((e) => (
              <div
                key={`band-${e.n}`}
                className="pointer-events-none absolute inset-y-0 bg-foreground/[0.06]"
                style={{
                  left: `${(idx(e.year) / n) * 100}%`,
                  width: `${((idx(e.endYear ?? e.year) - idx(e.year) + 1) / n) * 100}%`,
                }}
              />
            ))}
          {marks.map((e) => (
            <div
              key={`line-${e.n}`}
              className="pointer-events-none absolute inset-y-0 w-px bg-foreground/40"
              style={{ left: pos(idx(e.year), n) }}
            />
          ))}
          {values.map((v, i) => (
            <div
              key={years[i]}
              title={v === null ? `${years[i]}: none` : `${years[i]}: ${formatValue(id, v)}`}
              className="group relative flex h-full flex-1 items-end"
            >
              {v !== null && max > 0 && (
                <div
                  className="w-full rounded-t-[3px] bg-primary/70 group-hover:bg-primary"
                  style={{ height: `${Math.max(v > 0 ? 1 : 0, (100 * v) / max)}%` }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="relative mt-1 h-4 text-xs text-muted-foreground">
          {years.map((y, i) =>
            (y % 10 === 0 &&
              TREND_LAST_YEAR - y >= Math.ceil(n / 9) &&
              y - firstYear >= Math.ceil(n / 9)) ||
            i === n - 1 ||
            i === 0 ? (
              <span
                key={y}
                className={`num absolute -translate-x-1/2 ${i === 0 ? "translate-x-0" : ""} ${i === n - 1 ? "-translate-x-full" : ""}`}
                style={{ left: i === 0 ? 0 : i === n - 1 ? "100%" : pos(i, n) }}
              >
                {y}
              </span>
            ) : null,
          )}
        </div>
      </div>
      <div className="mt-1 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {first !== undefined && `${years[values.indexOf(first)]}: ${formatValue(id, first)}`}
        </span>
        <span>{last != null && `${TREND_LAST_YEAR}: ${formatValue(id, last)}`}</span>
      </div>
      <DecadeGrowth id={id} />
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Show the yearly figures
        </summary>
        <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-0.5 sm:grid-cols-4">
          {values.map((v, i) =>
            v === null ? null : (
              <div key={years[i]} className="flex justify-between gap-2">
                <span className="text-muted-foreground">{years[i]}</span>
                <span className="num">{formatValue(id, v)}</span>
              </div>
            ),
          )}
        </div>
      </details>
    </figure>
  )
}

/** Average yearly growth in each decade the series covers. */
function DecadeGrowth({ id }: { id: TrendSeriesId }) {
  const { firstYear } = TREND_SERIES[id]
  const rows: { label: string; g: number | null }[] = []
  for (let d = Math.floor(firstYear / 10) * 10; d <= TREND_LAST_YEAR; d += 10) {
    const from = Math.max(d, firstYear)
    const to = Math.min(d + 10, TREND_LAST_YEAR)
    if (to - from < 2) continue
    const partial = from !== d || to !== d + 10
    rows.push({
      label: partial ? `${from}–${String(to).slice(2)}` : `${d}s`,
      g: annualGrowth(id, from, to),
    })
  }
  if (rows.length < 2) return null
  return (
    <div className="mt-3">
      <div className="mb-1 text-xs text-muted-foreground">Average growth per year, by decade</div>
      <div className="flex flex-wrap gap-1.5">
        {rows.map((r) => (
          <span key={r.label} className="rounded border border-rule bg-card px-2 py-0.5 text-xs">
            <span className="text-muted-foreground">{r.label}</span>{" "}
            <span className="num">{fmtPct(r.g)}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** The series' change during an event: that year's change, or the yearly average over the episode. */
export function eventChange(id: TrendSeriesId, e: CostEvent) {
  const { firstYear } = TREND_SERIES[id]
  const from = Math.max(e.year - 1, firstYear)
  const to = Math.min(e.endYear ?? e.year, TREND_LAST_YEAR)
  if (to <= from) return null
  const during = to - from === 1 ? totalChange(id, from, to) : annualGrowth(id, from, to)
  const beforeFrom = Math.max(from - 5, firstYear)
  const raw = from - beforeFrom >= 2 ? annualGrowth(id, beforeFrom, from) : null
  // A rate from a near-zero base (a program's first years) says nothing useful.
  const before = raw !== null && Math.abs(raw) <= 1 ? raw : null
  return { from, to, during, before, single: to - from === 1 }
}

/** Numbered list of the events that moved this page's series, with each series' change. */
export function EventList({
  events,
  seriesIds,
  labelFor,
}: {
  events: NumberedEvent[]
  seriesIds: TrendSeriesId[]
  labelFor: (id: TrendSeriesId) => string
}) {
  if (events.length === 0) return null
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-base font-semibold">What made it jump, drop, or change speed</h3>
      <ol className="space-y-3">
        {events.map((e) => (
          <li key={e.n} className="flex gap-3">
            <span className="mt-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-medium text-background">
              {e.n}
            </span>
            <div className="min-w-0">
              <div className="font-medium">
                <span className="num text-muted-foreground">
                  {e.year}
                  {e.endYear ? `–${e.endYear}` : ""}
                </span>{" "}
                {e.title}
              </div>
              <p className="text-sm leading-relaxed text-foreground/85">{e.text}</p>
              <ul className="mt-1 flex flex-wrap gap-1.5 text-xs">
                {e.series
                  .filter((sid) => seriesIds.includes(sid))
                  .map((sid) => {
                    const c = eventChange(sid, e)
                    if (!c) return null
                    return (
                      <li key={sid} className="rounded border border-rule bg-card px-2 py-0.5">
                        {seriesIds.length > 1 && (
                          <span className="text-muted-foreground">{labelFor(sid)}: </span>
                        )}
                        <span className="num">{fmtPct(c.during)}</span>
                        <span className="text-muted-foreground">
                          {c.single ? ` in ${c.to}` : ` a year, ${c.from}–${c.to}`}
                          {c.before !== null && `, vs ${fmtPct(c.before)} a year before`}
                        </span>
                      </li>
                    )
                  })}
              </ul>
              {e.sourceIds && e.sourceIds.length > 0 && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {e.sourceIds
                    .filter((sid) => SOURCE_BY_ID[sid])
                    .map((sid, i) => (
                      <span key={sid}>
                        {i > 0 && "; "}
                        <Link
                          href={`/sources#${sid}`}
                          className="underline decoration-rule underline-offset-2 hover:text-foreground"
                        >
                          {SOURCE_BY_ID[sid].org} ({SOURCE_BY_ID[sid].year})
                        </Link>
                      </span>
                    ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** One-line growth summary for a secondary series. */
export function GrowthRow({ id }: { id: TrendSeriesId }) {
  return (
    <tr>
      <td>{TREND_SERIES[id].label}</td>
      {WINDOWS.map((w) => (
        <td key={w.label} className="num text-right">
          {fmtPct(growthOver(id, w.from, w.kind))}
        </td>
      ))}
    </tr>
  )
}

export const GROWTH_WINDOWS = WINDOWS
