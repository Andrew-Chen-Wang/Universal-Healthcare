import { Sources, Table } from "@website/components/site/ui"
import { STEP_EXTRAS } from "@website/content/step-extras"
import { type StepParams, loadStep, stepStaticParams } from "@website/lib/plan/step"
import type { Metadata } from "next"

export const generateStaticParams = stepStaticParams

export async function generateMetadata({ params }: { params: StepParams }): Promise<Metadata> {
  const { step, number } = await loadStep(params)
  return { title: `Other countries · ${number} ${step.title}` }
}

export default async function InternationalPage({ params }: { params: StepParams }) {
  const { step } = await loadStep(params)
  const comps = STEP_EXTRAS[step.id]?.international ?? []
  return (
    <div>
      <p className="mb-6 max-w-3xl text-foreground/80">
        How other countries handled this same piece of implementation, what happened, and what it
        means for this plan.
      </p>
      {comps.length > 1 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Side by side</h2>
          <Table>
            <thead>
              <tr>
                <th>Country</th>
                <th>Approach</th>
                <th>Result</th>
                <th>Lesson for this plan</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-accent/40">
                <td className="font-medium">This plan (U.S.)</td>
                <td className="text-sm" colSpan={3}>
                  {step.summary}
                </td>
              </tr>
              {comps.map((c) => (
                <tr key={c.country + c.approach}>
                  <td className="font-medium">{c.country}</td>
                  <td className="text-sm">{c.approach}</td>
                  <td className="text-sm">{c.result}</td>
                  <td className="text-sm">{c.lesson}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <div className="space-y-4">
        {comps.map((c) => (
          <div key={c.country + c.approach} className="rounded-md border border-rule bg-card p-5">
            <h2 className="text-lg font-semibold">{c.country}</h2>
            <dl className="mt-3 grid gap-3 text-sm md:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold text-muted-foreground uppercase">
                  What they did
                </dt>
                <dd className="mt-1">{c.approach}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted-foreground uppercase">
                  What happened
                </dt>
                <dd className="mt-1">{c.result}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-primary uppercase">
                  Lesson for this plan
                </dt>
                <dd className="mt-1">{c.lesson}</dd>
              </div>
            </dl>
            <Sources ids={c.sourceIds ?? []} />
          </div>
        ))}
      </div>
      {step.precedent.length > 0 && (
        <>
          <h2 className="mt-10 mb-3 text-lg font-semibold">More precedent</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/85">
            {step.precedent.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
