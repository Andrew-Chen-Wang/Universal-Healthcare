import {
  TREND_FIRST_YEAR,
  TREND_LAST_YEAR,
  TREND_SERIES,
  type TrendSeriesId,
} from "@website/content/cost-trend-data"
import { annualGrowth, fmtPct, totalChange } from "@website/content/cost-trends"

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
  if (unit === "usdB")
    return v >= 1000 ? `$${(v / 1000).toFixed(2)}T` : `$${v.toLocaleString("en-US")}B`
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

/** Yearly bars for one series, with a hover title per bar and a table view. */
export function TrendChart({ id, title }: { id: TrendSeriesId; title: string }) {
  const values = TREND_SERIES[id].values
  const years = values.map((_, i) => TREND_FIRST_YEAR + i)
  const max = Math.max(...values.map((v) => v ?? 0))
  const first = values.find((v) => v !== null && v > 0)
  const last = values.at(-1)
  return (
    <figure className="mb-4">
      <figcaption className="mb-1 text-sm font-medium">{title}</figcaption>
      {/* Bars are hidden from screen readers; the yearly figures below carry the data. */}
      <div aria-hidden className="flex h-36 items-end gap-0.5 border-b border-rule">
        {values.map((v, i) => (
          <div
            key={years[i]}
            title={v === null ? `${years[i]}: none` : `${years[i]}: ${formatValue(id, v)}`}
            className="group flex h-full flex-1 items-end"
          >
            {v !== null && max > 0 && (
              <div
                className="w-full rounded-t-[4px] bg-primary/70 group-hover:bg-primary"
                style={{ height: `${Math.max(v > 0 ? 1 : 0, (100 * v) / max)}%` }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        {years.map((y, i) =>
          i % 5 === 0 || i === years.length - 1 ? (
            <span key={y} className="num">
              {y}
            </span>
          ) : null,
        )}
      </div>
      <div className="mt-1 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {first !== undefined && `${years[values.indexOf(first)]}: ${formatValue(id, first)}`}
        </span>
        <span>{last != null && `${TREND_LAST_YEAR}: ${formatValue(id, last)}`}</span>
      </div>
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
