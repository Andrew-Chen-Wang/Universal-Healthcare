import { SectionTabs } from "@website/components/site/section-tabs"
import { PlanVersionNotice } from "@website/components/site/ui"
import { SECTION_LABELS } from "@website/content/navigation"
import Link from "next/link"
import type { ReactNode } from "react"
import type { PlanVariant } from "@website/content/plan-bundle"
import { getPlan } from "@website/content/plans"
import { loadStep, type StepParams } from "@website/lib/plan/step"

export function stepLayoutRoute(variant: PlanVariant) {
  const plan = getPlan(variant)
  async function StepLayout({ children, params }: { children: ReactNode; params: StepParams }) {
    const { phase, step, number, prev, next } = await loadStep(variant, params)
    const tabs = plan.sectionsForStep(step.id).map((s) => ({
      href: plan.stepHref(step.id, s),
      label: SECTION_LABELS[s],
    }))
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 lg:py-12">
        <header className="mb-6">
          <div className="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            <Link href={`${plan.base}/${phase.id}`} className="hover:underline">
              Phase {phase.number}: {phase.title}
            </Link>{" "}
            · Step {number}
          </div>
          <h1 className="text-3xl leading-tight font-semibold sm:text-4xl">{step.title}</h1>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 text-sm text-muted-foreground">
            <span>
              {step.timeline} · {step.owner}
            </span>
            <a
              className="text-primary underline"
              href={`https://github.com/Andrew-Chen-Wang/Universal-Healthcare/issues/new?title=${encodeURIComponent(`Step ${number}: ${step.title}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              Discuss this step
            </a>
          </div>
        </header>
        <PlanVersionNotice variant={variant} />
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
  return { Page: StepLayout }
}
