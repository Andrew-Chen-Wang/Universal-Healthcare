import { Page, Section } from "@website/components/site/ui"
import { show, v } from "@website/content/constants"
import { COST_CATEGORIES, INVENTORY } from "@website/content/cost-inventory"
import { HYBRID_COST } from "@website/content/hybrid/figures"
import { fmt } from "@website/content/model"
import { OPTIMIZATIONS } from "@website/content/optimizations"
import { PATHS } from "@website/content/paths"
import { HYBRID_PLAN } from "@website/content/plans"
import { PROBLEMS } from "@website/content/problems"
import { DOWNSTREAM, REASONS } from "@website/content/why"
import { cn } from "@website/lib/utils"
import Link from "next/link"
import type { ReactNode } from "react"

/** A headline figure on the home page: one number, one plain sentence. */
function KeyNumber({ value, children }: { value: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-1.5 rounded-md border border-rule bg-card p-4">
      <div className="font-serif text-3xl leading-none font-semibold tabular-nums">{value}</div>
      <div className="text-sm leading-snug text-muted-foreground">{children}</div>
    </div>
  )
}

/** One of the home page's three ways in. The first is the main one. */
function Door({
  href,
  title,
  sub,
  primary,
}: {
  href: string
  title: string
  sub: string
  primary?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "grid content-start gap-1 rounded-md border p-4 transition-colors",
        primary
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-rule bg-card hover:border-primary",
      )}
    >
      <span className="font-serif text-lg font-semibold">{title}</span>
      <span
        className={cn("text-sm", primary ? "text-primary-foreground/85" : "text-muted-foreground")}
      >
        {sub}
      </span>
    </Link>
  )
}

/** A card pointing to one of the detailed breakdowns. */
function Breakdown({ href, title, sub }: { href: string; title: string; sub: string }) {
  return (
    <Link
      href={href}
      className="grid content-start gap-1 rounded-md border border-rule bg-card p-4 hover:border-primary"
    >
      <span className="font-semibold">{title}</span>
      <span className="text-sm text-muted-foreground">{sub}</span>
    </Link>
  )
}

/** The reasons from /why shown on the home page, in this order. */
const HOME_REASONS = ["coverage", "debt", "continuity", "prices"]

export default function Home() {
  const taskCount = HYBRID_PLAN.allSteps.reduce((s, x) => s + x.tasks.length, 0)
  const hybridSaves = HYBRID_COST.delta < 0
  const coversAllUninsured = Math.abs(HYBRID_COST.newlyCovered - v("uninsuredToday")) < 0.05
  const allReasons = [...REASONS, ...DOWNSTREAM]
  const reasons = HOME_REASONS.map((id) => allReasons.find((r) => r.id === id)!)
  return (
    <Page>
      <header className="mb-14 border-b border-rule pb-10">
        <div className="mb-4 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          A plan for universal health care · 2024 dollars
        </div>
        <h1 className="max-w-3xl text-4xl leading-[1.1] font-semibold sm:text-5xl">
          {hybridSaves
            ? "Everyone in the U.S. covered, for less than the country spends today."
            : "Everyone in the U.S. covered, with every dollar shown."}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/80">
          This site lays out one way to get there, building on the coverage people already have
          instead of replacing it. Employer plans, Medicare, and Medicaid stay. Everyone else is
          enrolled automatically in a nonprofit plan, with premiums based on income. New federal
          costs are paid only by taxes on the highest incomes. Every number, step, and trade-off is
          open to check.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KeyNumber value={`${HYBRID_COST.newlyCovered.toFixed(1)}M`}>
            {coversAllUninsured
              ? "people newly covered: everyone uninsured today, enrolled automatically."
              : `people newly covered, enrolled automatically, of ${show("uninsuredToday")} million uninsured all of 2025.`}
          </KeyNumber>
          <KeyNumber value={fmt(HYBRID_COST.nationalAfter)}>
            national health spending a year,{" "}
            <span className={hybridSaves ? "font-medium text-gain" : "font-medium text-loss"}>
              {fmt(Math.abs(HYBRID_COST.delta))} {hybridSaves ? "less" : "more"}
            </span>{" "}
            than in 2024.
          </KeyNumber>
          <KeyNumber value={`$${(HYBRID_COST.noNewTaxBelow ?? 0).toLocaleString("en-US")}`}>
            of household income: below this, no one pays a new tax.
          </KeyNumber>
          <KeyNumber value={`${HYBRID_PLAN.nav.length} phases`}>
            from fixing today&apos;s system to everyone covered, each step with its costs and
            trade-offs.
          </KeyNumber>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Door href="/for-you" title="What changes for me?" sub="Pick your situation" primary />
          <Door href="/plan" title="How would it work?" sub="The plan, phase by phase" />
          <Door href="/your-plan" title="Build your own plan" sub="Make different choices" />
        </div>
      </header>

      <Section
        id="why"
        title="Why change"
        intro="The U.S. spends the most of any high-income country on health care and still leaves people uncovered, in debt, or one job change away from losing their plan."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {reasons.map((r) => (
            <li key={r.id}>
              <Link
                href={`/why#${r.id}`}
                className="block h-full rounded-md border border-rule bg-card p-4 hover:border-primary"
              >
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          <Link href="/why" className="underline">
            All {allReasons.length} reasons, with the evidence and the costs that weigh against them
          </Link>{" "}
          ·{" "}
          <Link href="/problems" className="underline">
            {PROBLEMS.length} problems with today&apos;s system
          </Link>
        </p>
      </Section>

      <Section
        id="approach"
        title="Why this approach"
        intro="The plan aims for a change that can actually be enacted and carried out, not the most ambitious design on paper."
      >
        <ol className="grid gap-3 sm:grid-cols-3">
          <li className="rounded-md border border-rule bg-card p-4">
            <div className="font-semibold">It builds on what people have.</div>
            <p className="mt-1 text-sm text-foreground/75">
              People with job-based coverage, Medicare, or Medicaid keep it. The new plans fill the
              gaps around them, so the change is a set of additions, not a switch-over.
            </p>
          </li>
          <li className="rounded-md border border-rule bg-card p-4">
            <div className="font-semibold">It is proven elsewhere.</div>
            <p className="mt-1 text-sm text-foreground/75">
              Germany, the Netherlands, and Switzerland cover everyone through regulated plans that
              must take all comers, the model this plan follows.{" "}
              <Link href="/paths/regulated-multipayer" className="underline">
                The evidence
              </Link>
              .
            </p>
          </li>
          <li className="rounded-md border border-rule bg-card p-4">
            <div className="font-semibold">The alternatives are priced too.</div>
            <p className="mt-1 text-sm text-foreground/75">
              Single payer is built out and priced in full, and set aside as too hard to enact.{" "}
              <Link href="/approaches" className="underline">
                Compare every approach
              </Link>{" "}
              or{" "}
              <Link href="/single-payer" className="underline">
                see single payer in full
              </Link>
              .
            </p>
          </li>
        </ol>
      </Section>

      <Section
        id="transition"
        title="How the transition happens"
        intro="Phased so each part can be built, tested, and checked before the next depends on it. The first phase fixes today's system before any new plan opens."
      >
        <ol className="divide-y divide-rule overflow-hidden rounded-md border border-rule bg-card">
          {HYBRID_PLAN.nav.map((p) => (
            <li key={p.id}>
              <Link
                href={p.href}
                className="flex flex-col gap-0.5 px-4 py-3 hover:bg-secondary/60 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <span className="num w-6 shrink-0 text-sm text-muted-foreground">{p.number}</span>
                <span className="font-medium">{p.title}</span>
                <span className="text-sm text-muted-foreground sm:ml-auto sm:text-right">
                  {p.window}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted-foreground">
          {HYBRID_PLAN.allSteps.length} steps and {taskCount} tasks in all.{" "}
          <Link href="/plan" className="underline">
            The plan, phase by phase
          </Link>{" "}
          ·{" "}
          <Link href="/changes" className="underline">
            Every change to today&apos;s system
          </Link>
        </p>
      </Section>

      <Section
        id="check"
        title="Check every detail"
        intro="Nothing here asks to be taken on trust. Each figure links to the arithmetic behind it, each step lists what it gives up and what could go wrong, and the ground rules are stated up front."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Breakdown
            href="/costs"
            title="What it costs"
            sub={`${INVENTORY.length} cost items in ${COST_CATEGORIES.length} categories, each with its calculation`}
          />
          <Breakdown
            href="/implementation/tradeoffs"
            title="Trade-offs"
            sub="Who gains, who loses, and the risks that remain"
          />
          <Breakdown
            href="/coverage"
            title="Coverage checklist"
            sub="Does each plan answer every question it must?"
          />
          <Breakdown
            href="/paths"
            title="Solution paths"
            sub={`${PATHS.length} options, problem by problem, with pros, cons, and precedents`}
          />
          <Breakdown
            href="/method"
            title="Ground rules & method"
            sub="The rules the plan is held to and every assumption with its range"
          />
          <Breakdown
            href="/inputs"
            title="Inputs & sources"
            sub="Every rate and count defined once, each with its source"
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Changes that help whoever pays:{" "}
          <Link href="/optimizations" className="underline">
            {OPTIMIZATIONS.length} optimizations for any system
          </Link>
          .
        </p>
      </Section>
    </Page>
  )
}
