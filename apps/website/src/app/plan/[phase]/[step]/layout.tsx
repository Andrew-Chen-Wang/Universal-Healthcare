import { SectionTabs } from "@website/components/site/section-tabs"
import { sectionsForStep, SECTION_LABELS, stepHref } from "@website/content/navigation"
import { type StepParams, loadStep } from "@website/lib/plan/step"
import Link from "next/link"
import type { ReactNode } from "react"

export default async function StepLayout({
  children,
  params,
}: {
  children: ReactNode
  params: StepParams
}) {
  const { phase, step, number, prev, next } = await loadStep(params)
  const tabs = sectionsForStep(step.id).map((s) => ({
    href: stepHref(step.id, s),
    label: SECTION_LABELS[s],
  }))
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 lg:py-12">
      <header className="mb-6">
        <div className="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          <Link href={`/plan/${phase.id}`} className="hover:underline">
            Phase {phase.number}: {phase.title}
          </Link>{" "}
          · Step {number}
        </div>
        <h1 className="text-3xl leading-tight font-semibold sm:text-4xl">{step.title}</h1>
        <div className="mt-2 text-sm text-muted-foreground">
          {step.timeline} · {step.owner}
        </div>
      </header>
      <SectionTabs tabs={tabs} />
      <div className="mt-8">{children}</div>
      <nav className="mt-16 grid gap-3 border-t border-rule pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={prev.href}
            className="rounded-md border border-rule bg-card px-4 py-3 hover:border-primary"
          >
            <div className="text-xs text-muted-foreground">← Previous step {prev.number}</div>
            <div className="font-medium">{prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={next.href}
            className="rounded-md border border-rule bg-card px-4 py-3 text-right hover:border-primary"
          >
            <div className="text-xs text-muted-foreground">Next step {next.number} →</div>
            <div className="font-medium">{next.title}</div>
          </Link>
        )}
      </nav>
    </div>
  )
}
