import { B, Page, PageHeader, Sources, Table, Usd } from "@website/components/site/ui"
import { C } from "@website/content/constants"
import { INVENTORY, INVENTORY_BY_ID } from "@website/content/cost-inventory"
import { slug } from "@website/content/navigation"
import { PROBLEM_BY_ID } from "@website/content/problems"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Params = Promise<{ id: string }>

export function generateStaticParams() {
  return INVENTORY.map((i) => ({ id: i.id }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  return { title: INVENTORY_BY_ID[id]?.label ?? "Cost" }
}

export default async function CostItemPage({ params }: { params: Params }) {
  const { id } = await params
  const i = INVENTORY_BY_ID[id]
  if (!i) notFound()
  const pop = C.population.value
  const hh = C.households.value
  return (
    <Page>
      <PageHeader
        eyebrow={
          <Link href={`/costs#${slug(i.category)}`} className="hover:underline">
            Cost · {i.category}
          </Link>
        }
        title={i.label}
        lede={i.note}
      />
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-rule bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase">Amount</div>
          <div className="mt-1 text-2xl">
            {i.unit === "usdB" ? (
              <B v={i.amount} />
            ) : i.unit === "usd" ? (
              <Usd v={i.amount} />
            ) : (
              Math.round(i.amount).toLocaleString()
            )}
          </div>
          <div className="text-xs text-muted-foreground">{i.unit === "usdB" ? "per year" : ""}</div>
        </div>
        {i.unit === "usdB" && (
          <>
            <div className="rounded-md border border-rule bg-card p-4">
              <div className="text-xs text-muted-foreground uppercase">Per resident, per year</div>
              <div className="mt-1 text-2xl">
                <Usd v={(i.amount * 1e9) / (pop * 1e6)} />
              </div>
              <div className="text-xs text-muted-foreground">÷ {pop}M people</div>
            </div>
            <div className="rounded-md border border-rule bg-card p-4">
              <div className="text-xs text-muted-foreground uppercase">Per household, per year</div>
              <div className="mt-1 text-2xl">
                <Usd v={(i.amount * 1e9) / (hh * 1e6)} />
              </div>
              <div className="text-xs text-muted-foreground">÷ {hh}M households</div>
            </div>
          </>
        )}
      </div>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">How it is built</h2>
        <p className="num rounded-md border border-rule bg-card p-4 text-sm">{i.formula}</p>
        <p className="mt-2 text-sm text-muted-foreground">Part of: {i.partOf}</p>
      </section>

      {i.details && (
        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Details</h2>
          <Table>
            <tbody>
              {i.details.map((d) => (
                <tr key={d.label}>
                  <td>{d.label}</td>
                  <td className="num text-right">{d.value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      )}

      {i.problemIds && i.problemIds.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Problems this cost relates to</h2>
          <ul className="space-y-1">
            {i.problemIds.map((pid) => (
              <li key={pid}>
                <Link
                  className="underline decoration-rule underline-offset-2 hover:decoration-primary"
                  href={`/problems/${pid}`}
                >
                  {PROBLEM_BY_ID[pid]?.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Sources ids={i.sourceIds} />
    </Page>
  )
}
