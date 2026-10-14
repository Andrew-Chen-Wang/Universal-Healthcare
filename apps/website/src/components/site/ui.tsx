import { fmt } from "@website/content/model"
import type { ProCon } from "@website/content/types"
import { SOURCE_BY_ID } from "@website/content/sources"
import { cn } from "@website/lib/utils"
import Link from "next/link"
import type { ReactNode } from "react"

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8 lg:py-14">{children}</div>
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: ReactNode
  title: string
  lede?: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="mb-10 border-b border-rule pb-8">
      {eyebrow && (
        <div className="mb-3 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          {eyebrow}
        </div>
      )}
      <h1 className="text-3xl leading-tight font-semibold sm:text-4xl">{title}</h1>
      {lede && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/80">{lede}</p>}
      {children}
    </header>
  )
}

export function Section({
  id,
  title,
  intro,
  children,
  className,
}: {
  id?: string
  title?: string
  intro?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn("mb-14", className)}>
      {title && (
        <h2 className="mb-3 text-2xl font-semibold">
          {id ? (
            <a href={`#${id}`} className="hover:underline">
              {title}
            </a>
          ) : (
            title
          )}
        </h2>
      )}
      {intro && <div className="mb-5 max-w-3xl leading-relaxed text-foreground/80">{intro}</div>}
      {children}
    </section>
  )
}

/** Billions of dollars, e.g. 1234.5 → $1.23T. */
export function B({ v, sign }: { v: number; sign?: boolean }) {
  return <span className="num whitespace-nowrap">{fmt(v, { sign })}</span>
}

export function usd(n: number, opts: { sign?: boolean } = {}) {
  const s = opts.sign && n > 0.5 ? "+" : n < -0.5 ? "−" : ""
  return `${s}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`
}

export function Usd({ v, sign }: { v: number; sign?: boolean }) {
  return <span className="num whitespace-nowrap">{usd(v, { sign })}</span>
}

export function Delta({
  v,
  invert,
  unit = "B",
}: {
  v: number
  invert?: boolean
  unit?: "B" | "$"
}) {
  const good = invert ? v < 0 : v > 0
  const zero = Math.abs(v) < (unit === "B" ? 0.05 : 0.5)
  return (
    <span
      className={cn(
        "num rounded-sm px-1.5 py-0.5 text-[0.95em] whitespace-nowrap",
        zero ? "text-muted-foreground" : good ? "bg-gain-soft text-gain" : "bg-loss-soft text-loss",
      )}
    >
      {unit === "B" ? fmt(v, { sign: true }) : usd(v, { sign: true })}
    </span>
  )
}

export function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  tone?: "gain" | "loss" | "neutral"
}) {
  return (
    <div className="rounded-md border border-rule bg-card p-4">
      <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div
        className={cn(
          "num mt-1 text-2xl font-semibold",
          tone === "gain" && "text-gain",
          tone === "loss" && "text-loss",
        )}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs leading-snug text-muted-foreground">{sub}</div>}
    </div>
  )
}

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("-mx-4 overflow-x-auto sm:mx-0", className)}>
      <table className="w-full min-w-[36rem] border-collapse text-sm [&_td]:border-b [&_td]:border-rule [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_th]:border-b-2 [&_th]:border-ink/70 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wide [&_th]:text-muted-foreground [&_th]:uppercase [&_tfoot_td]:border-t-2 [&_tfoot_td]:border-b-0 [&_tfoot_td]:border-ink/70 [&_tfoot_td]:font-semibold">
        {children}
      </table>
    </div>
  )
}

export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: "note" | "caution" | "loss" | "gain"
  title?: string
  children: ReactNode
}) {
  const styles = {
    note: "border-primary/40 bg-accent/60",
    caution: "border-caution/40 bg-caution-soft",
    loss: "border-loss/40 bg-loss-soft",
    gain: "border-gain/40 bg-gain-soft",
  }[tone]
  return (
    <div className={cn("my-6 rounded-md border-l-4 px-5 py-4 leading-relaxed", styles)}>
      {title && <div className="mb-1 font-semibold">{title}</div>}
      <div className="text-foreground/85">{children}</div>
    </div>
  )
}

export function ProsCons({
  pros,
  cons,
  prosLabel = "Pros",
  consLabel = "Cons",
}: {
  pros: ProCon[]
  cons: ProCon[]
  prosLabel?: string
  consLabel?: string
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ProConList items={pros} label={prosLabel} tone="gain" />
      <ProConList items={cons} label={consLabel} tone="loss" />
    </div>
  )
}

function ProConList({
  items,
  label,
  tone,
}: {
  items: ProCon[]
  label: string
  tone: "gain" | "loss"
}) {
  if (items.length === 0) return null
  return (
    <div
      className={cn(
        "rounded-md border p-4",
        tone === "gain" ? "border-gain/25 bg-gain-soft/50" : "border-loss/25 bg-loss-soft/50",
      )}
    >
      <div
        className={cn(
          "mb-2 text-xs font-semibold tracking-wide uppercase",
          tone === "gain" ? "text-gain" : "text-loss",
        )}
      >
        {label}
      </div>
      <ul className="space-y-2 text-sm leading-snug">
        {items.map((p) => (
          <li key={p.point} className="flex gap-2">
            <span className={cn("mt-0.5 select-none", tone === "gain" ? "text-gain" : "text-loss")}>
              {tone === "gain" ? "+" : "−"}
            </span>
            <span>
              {p.point}
              {p.detail && <span className="text-foreground/65"> {p.detail}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Sources({ ids }: { ids: string[] }) {
  const known = ids.filter((id) => SOURCE_BY_ID[id])
  if (known.length === 0) return null
  return (
    <div className="mt-3 text-xs text-muted-foreground">
      Sources:{" "}
      {known.map((id, i) => (
        <span key={id}>
          {i > 0 && "; "}
          <Link
            href={`/sources#${id}`}
            className="underline decoration-rule underline-offset-2 hover:text-foreground"
          >
            {SOURCE_BY_ID[id].org} ({SOURCE_BY_ID[id].year})
          </Link>
        </span>
      ))}
    </div>
  )
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "neutral" | "gain" | "loss" | "caution" | "primary"
}) {
  const styles = {
    neutral: "bg-secondary text-foreground/75",
    gain: "bg-gain-soft text-gain",
    loss: "bg-loss-soft text-loss",
    caution: "bg-caution-soft text-caution",
    primary: "bg-accent text-accent-foreground",
  }[tone]
  return (
    <span
      className={cn(
        "inline-block rounded-sm px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        styles,
      )}
    >
      {children}
    </span>
  )
}

/** Horizontal paired bar: before vs after. */
export function BeforeAfterBar({
  before,
  after,
  max,
}: {
  before: number
  after: number
  max: number
}) {
  const w = (x: number) => `${Math.max(0.5, (x / max) * 100)}%`
  return (
    <div className="space-y-1">
      <div
        className="h-2 rounded-sm bg-ink/25"
        style={{ width: w(before) }}
        title={`Before: ${fmt(before)}`}
      />
      <div
        className={cn("h-2 rounded-sm", after <= before ? "bg-gain" : "bg-loss")}
        style={{ width: w(after) }}
        title={`After: ${fmt(after)}`}
      />
    </div>
  )
}

export function Legend() {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-4 rounded-sm bg-ink/25" /> 2024 actual
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-4 rounded-sm bg-gain" /> Under plan (lower)
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-4 rounded-sm bg-loss" /> Under plan (higher)
      </span>
    </div>
  )
}

export function ConfidenceTag({ level }: { level: "high" | "medium" | "low" }) {
  const tone = level === "high" ? "gain" : level === "medium" ? "caution" : "loss"
  return <Pill tone={tone}>{level} confidence</Pill>
}

export function NextLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div className="mt-16 grid gap-3 border-t border-rule pt-8 sm:grid-cols-2">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="group rounded-md border border-rule bg-card px-4 py-3 hover:border-primary"
        >
          <div className="text-xs text-muted-foreground">Continue</div>
          <div className="font-medium group-hover:text-primary">{l.label} →</div>
        </Link>
      ))}
    </div>
  )
}

/** Part 2 still describes the earlier single-payer draft until it's rewritten for the hybrid. */
export function SinglePayerPlanNotice() {
  return (
    <Callout tone="caution" title="This plan describes the single-payer path">
      The current draft is a Germany-style hybrid that keeps employer plans; this phased plan still
      describes the earlier single-payer draft and is being rewritten. Compare both on{" "}
      <Link href="/approaches" className="underline">
        Compare approaches
      </Link>
      .
    </Callout>
  )
}
