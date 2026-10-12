import { Table } from "@website/components/site/ui"
import { type StepParams, loadStep, stepStaticParams } from "@website/lib/plan/step"
import type { Metadata } from "next"

export const generateStaticParams = stepStaticParams

export async function generateMetadata({ params }: { params: StepParams }): Promise<Metadata> {
  const { step, number } = await loadStep(params)
  return { title: `Tasks · ${number} ${step.title}` }
}

export default async function TasksPage({ params }: { params: StepParams }) {
  const { step, number } = await loadStep(params)
  return (
    <div>
      <p className="mb-6 max-w-3xl text-foreground/80">
        Every concrete action this step requires, who is responsible, and when it happens relative
        to enactment.
      </p>
      <Table>
        <thead>
          <tr>
            <th className="w-16">#</th>
            <th>Action</th>
            <th className="w-44">Owner</th>
            <th className="w-36">When</th>
          </tr>
        </thead>
        <tbody>
          {step.tasks.map((t, i) => (
            <tr key={t.action} id={`task-${i + 1}`}>
              <td className="num text-muted-foreground">
                {number}.{i + 1}
              </td>
              <td>{t.action}</td>
              <td className="text-foreground/75">{t.owner}</td>
              <td className="text-foreground/75">{t.when}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
