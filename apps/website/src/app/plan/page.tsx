import { Delta, Section, Stat, Table } from "@website/components/site/ui"
import { H } from "@website/content/hybrid/figures"
import { HYBRID_PLAN } from "@website/content/plans"
import { planIndexRoute } from "@website/lib/plan/views/plan-index"
import Link from "next/link"

/** The plan's headline figures and what it means for typical households. */
function HybridSummary() {
  return (
    <Section
      id="at-a-glance"
      title="The plan at a glance"
      intro="Employer plans stay; everyone else is enrolled in regulated nonprofit plans; new federal costs are paid only by taxes on the highest incomes. Priced line by line on top of 2024 spending."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat
          label="National health spending"
          value={H.national}
          sub="vs 2024, priced lines only"
        />
        <Stat
          label="Federal spending"
          value={H.federalSigned}
          sub={`against ${H.topEnd} of top-end taxes`}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        One-time set-up costs: {H.oneTimeTotal}.{" "}
        <Link href="/approaches" className="underline">
          Compare it with the other approaches
        </Link>
        .
      </p>
      <h3 id="households" className="mt-6 mb-2 text-lg font-semibold">
        Households under the plan
      </h3>
      <Table>
        <thead>
          <tr>
            <th>Household</th>
            <th className="text-right">Change a year</th>
          </tr>
        </thead>
        <tbody>
          {HYBRID_PLAN.costItems
            .filter((c) => c.kind === "household" && c.id.startsWith("hy-hh-"))
            .map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={HYBRID_PLAN.costHref(c.stepId, c.id)} className="underline">
                    {c.title.replace("Household: ", "")}
                  </Link>
                </td>
                <td className="text-right">
                  <Delta v={c.amount} unit="$" />
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <p className="mt-2 text-sm text-muted-foreground">
        Long run, once employers pass premium savings into wages. New dental, vision, and hearing
        coverage and out-of-pocket drug savings aren&apos;t counted.{" "}
        <Link href={HYBRID_PLAN.costHref("tax-legislation", "hy-who-pays")} className="underline">
          Who pays more and who pays less
        </Link>
        .
      </p>
    </Section>
  )
}

const route = planIndexRoute("hybrid", HybridSummary)
export const metadata = route.metadata
export default route.Page
