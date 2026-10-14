import { B, Pill, Sources, Table, Usd } from "@website/components/site/ui"
import {
  type CalcStep,
  COST_BY_ID,
  HOUSEHOLDS_MILLIONS,
  POP_MILLIONS,
  fPct,
  fx,
} from "@website/content/calculations"
import { C, type ConstantId } from "@website/content/constants"
import { stepHref } from "@website/content/navigation"
import { costStaticParams, loadStep } from "@website/lib/plan/step"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Params = Promise<{ phase: string; step: string; cost: string }>

export const generateStaticParams = costStaticParams

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { cost } = await params
  return { title: COST_BY_ID[cost]?.title ?? "Cost" }
}

function Value({ s }: { s: CalcStep }) {
  switch (s.unit) {
    case "B":
      return <B v={s.value} />
    case "$":
      return <Usd v={s.value} />
    case "%":
      return <span className="num">{fPct(s.value)}</span>
    case "x":
      return <span className="num">{fx(s.value)}</span>
    default:
      return <span className="num">{Math.round(s.value).toLocaleString("en-US")}</span>
  }
}

export default async function CostPage({ params }: { params: Params }) {
  const { step } = await loadStep(params)
  const { cost } = await params
  const item = COST_BY_ID[cost]
  if (!item || item.stepId !== step.id) notFound()
  const inputs = [...new Set(item.calc.flatMap((s) => s.inputs ?? []))] as ConstantId[]
  const perPerson = item.amountUnit === "B" ? (item.amount * 1e9) / (POP_MILLIONS * 1e6) : undefined
  const perHousehold =
    item.amountUnit === "B" ? (item.amount * 1e9) / (HOUSEHOLDS_MILLIONS * 1e6) : undefined

  return (
    <article>
      <Link href={stepHref(step.id, "costs")} className="text-sm text-primary underline">
        ← All costs for this step
      </Link>
      <h2 className="mt-3 text-2xl font-semibold">{item.title}</h2>
      <p className="mt-2 max-w-3xl text-foreground/85">{item.summary}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <div className="rounded-md border border-rule bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase">Result</div>
          <div className="mt-1 text-xl">
            {item.amountUnit === "B" ? <B v={item.amount} /> : <Usd v={item.amount} sign />}
          </div>
          {item.before !== undefined && item.after !== undefined && (
            <div className="text-xs text-muted-foreground">
              <B v={item.before} /> → <B v={item.after} />
            </div>
          )}
        </div>
        {perPerson !== undefined && (
          <div className="rounded-md border border-rule bg-card p-4">
            <div className="text-xs text-muted-foreground uppercase">Per resident, per year</div>
            <div className="mt-1 text-xl">
              <Usd v={perPerson} />
            </div>
            <div className="text-xs text-muted-foreground">÷ {POP_MILLIONS}M people</div>
          </div>
        )}
        {perHousehold !== undefined && (
          <div className="rounded-md border border-rule bg-card p-4">
            <div className="text-xs text-muted-foreground uppercase">Per household</div>
            <div className="mt-1 text-xl">
              <Usd v={perHousehold} />
            </div>
            <div className="text-xs text-muted-foreground">÷ {HOUSEHOLDS_MILLIONS}M households</div>
          </div>
        )}
        {item.range && (
          <div className="rounded-md border border-rule bg-card p-4">
            <div className="text-xs text-muted-foreground uppercase">Range</div>
            <div className="mt-1 text-xl">
              <B v={item.range.low} />–<B v={item.range.high} />
            </div>
            <div className="text-xs text-muted-foreground">{item.range.note}</div>
          </div>
        )}
      </div>

      <h3 className="mt-10 mb-3 text-lg font-semibold">How it's calculated</h3>
      <Table>
        <thead>
          <tr>
            <th className="w-10">#</th>
            <th>Step</th>
            <th>Arithmetic</th>
            <th className="text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          {item.calc.map((s, i) => (
            <tr key={`${s.label}-${i}`} className={s.result ? "bg-secondary/60 font-semibold" : ""}>
              <td className="num text-muted-foreground">{i + 1}</td>
              <td>
                <div>{s.label}</div>
                {s.note && (
                  <div className="text-xs font-normal text-muted-foreground">{s.note}</div>
                )}
                {s.inputs && s.inputs.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {s.inputs.map((id) => (
                      <Link key={id} href={`/inputs#${id}`}>
                        <Pill
                          tone={
                            C[id].kind === "policy"
                              ? "primary"
                              : C[id].kind === "data"
                                ? "neutral"
                                : "caution"
                          }
                        >
                          {id}
                        </Pill>
                      </Link>
                    ))}
                  </div>
                )}
                <Sources ids={s.sourceIds ?? []} />
              </td>
              <td className="num text-sm font-normal text-foreground/80">{s.formula ?? ""}</td>
              <td className="text-right">
                <Value s={s} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {item.byYear && (
        <>
          <h3 className="mt-10 mb-3 text-lg font-semibold">By year</h3>
          <Table>
            <thead>
              <tr>
                {item.byYear.map((y) => (
                  <th key={y.label} className="text-right">
                    {y.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {item.byYear.map((y) => (
                  <td key={y.label} className="text-right">
                    <B v={y.value} />
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </>
      )}

      {inputs.length > 0 && (
        <>
          <h3 className="mt-10 mb-3 text-lg font-semibold">Inputs used</h3>
          <Table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Kind</th>
                <th className="text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {inputs.map((id) => {
                const c = C[id]
                return (
                  <tr key={id}>
                    <td>
                      <Link
                        href={`/inputs#${id}`}
                        className="underline decoration-rule underline-offset-2"
                      >
                        {c.label}
                      </Link>
                      {c.note && <div className="text-xs text-muted-foreground">{c.note}</div>}
                    </td>
                    <td>
                      <Pill
                        tone={
                          c.kind === "policy"
                            ? "primary"
                            : c.kind === "data"
                              ? "neutral"
                              : "caution"
                        }
                      >
                        {c.kind}, {c.confidence} confidence
                      </Pill>
                    </td>
                    <td className="text-right">
                      <Value
                        s={{
                          label: "",
                          value: c.value,
                          unit:
                            c.unit === "usdB"
                              ? "B"
                              : c.unit === "usd"
                                ? "$"
                                : c.unit === "share"
                                  ? "%"
                                  : c.unit === "ratio"
                                    ? "x"
                                    : "count",
                        }}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </>
      )}

      <div className="mt-10 rounded-md border border-caution/30 bg-caution-soft p-4 text-sm">
        <span className="font-semibold">Trade-off:</span> {item.tradeoff}
      </div>
      <Sources ids={item.sourceIds} />
    </article>
  )
}
