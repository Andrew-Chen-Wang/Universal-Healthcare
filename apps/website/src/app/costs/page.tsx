import { B, Page, PageHeader, Section, Table, Usd } from "@website/components/site/ui"
import { COST_CATEGORIES, INVENTORY, type InventoryItem } from "@website/content/cost-inventory"
import { slug } from "@website/content/navigation"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Costs" }

function Amount({ i }: { i: InventoryItem }) {
  if (i.unit === "usdB") return <B v={i.amount} />
  if (i.unit === "usd") return <Usd v={i.amount} />
  return <span className="num">{Math.round(i.amount).toLocaleString()}</span>
}

const ADDITIVE: Record<string, boolean> = {
  "National spending by service": true,
  "Who pays (2024)": true,
  "Hospital cost structure": true,
}

export default function CostsPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Part 1"
        title="Costs"
        lede={`${INVENTORY.length} cost items that make up U.S. health spending, broken down by service, payer, occupation (head count × average wage), industry payroll, hospital cost structure, drug R&D and manufacturing, insurance and intermediaries, administration, waste, liability, fraud, training, long-term care, margins, and capital. Many items overlap (a nurse's wage is inside hospital spending), so only categories marked "adds up" can be summed.`}
      />
      {COST_CATEGORIES.map((c) => {
        const items = INVENTORY.filter((i) => i.category === c)
        const total = items.filter((i) => i.unit === "usdB").reduce((s, i) => s + i.amount, 0)
        return (
          <Section key={c} id={slug(c)} title={c}>
            <Table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>How it is built</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <Link
                        href={`/costs/${i.id}`}
                        className="font-medium underline decoration-rule underline-offset-2 hover:decoration-primary"
                      >
                        {i.label}
                      </Link>
                    </td>
                    <td className="text-sm text-foreground/75">{i.formula}</td>
                    <td className="text-right">
                      <Amount i={i} />
                    </td>
                  </tr>
                ))}
              </tbody>
              {ADDITIVE[c] && (
                <tfoot>
                  <tr>
                    <td colSpan={2}>Total (adds up)</td>
                    <td className="text-right">
                      <B v={total} />
                    </td>
                  </tr>
                </tfoot>
              )}
            </Table>
          </Section>
        )
      })}
    </Page>
  )
}
