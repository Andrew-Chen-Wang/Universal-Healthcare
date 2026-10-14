import { B, Pill, Table, Usd } from "@website/components/site/ui"
import { type CostKind, costsForStep } from "@website/content/calculations"
import { costHref } from "@website/content/navigation"
import { type StepParams, loadStep, stepStaticParams } from "@website/lib/plan/step"
import type { Metadata } from "next"
import Link from "next/link"

export const generateStaticParams = stepStaticParams

export async function generateMetadata({ params }: { params: StepParams }): Promise<Metadata> {
  const { step, number } = await loadStep(params)
  return { title: `Costs · ${number} ${step.title}` }
}

const KIND_LABEL: Record<CostKind, string> = {
  spending: "Spending",
  revenue: "Funding source",
  "one-time": "One-time",
  loss: "Loss",
  saving: "Saving",
  household: "Household",
  employer: "Employer",
  jobs: "Jobs",
  budget: "Budget view",
}

export default async function CostsPage({ params }: { params: StepParams }) {
  const { step } = await loadStep(params)
  const costs = costsForStep(step.id)
  return (
    <div>
      <p className="mb-4 max-w-3xl text-foreground/80">{step.cost.ledgerNote}</p>
      {costs.length === 0 ? (
        <p className="text-muted-foreground">
          This step has no separately costed items; its cost is administrative and included in UHP
          administration.
        </p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Cost item</th>
              <th>Type</th>
              <th className="text-right">2024 / before</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {costs.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link
                    href={costHref(step.id, c.id)}
                    className="font-medium underline decoration-rule underline-offset-2 hover:decoration-primary"
                  >
                    {c.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {c.calc.length} calculation steps
                  </div>
                </td>
                <td>
                  <Pill>{KIND_LABEL[c.kind]}</Pill>
                </td>
                <td className="text-right">{c.before !== undefined ? <B v={c.before} /> : "—"}</td>
                <td className="text-right">
                  {c.amountUnit === "B" ? <B v={c.amount} /> : <Usd v={c.amount} sign />}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
