import { B, Callout, Delta, Page, Section, Stat, Table } from "@website/components/site/ui"
import { show, v } from "@website/content/constants"
import {
  ENROLLMENT_2024,
  NHE_TOTAL_2024,
  SPONSOR_LABELS,
  type SponsorId,
} from "@website/content/baseline"
import { COST_BY_ID } from "@website/content/calculations"
import { MODEL, MODEL_COSTLY, MODEL_LEAN, fmt } from "@website/content/model"
import { SINGLE_PAYER_PLAN } from "@website/content/plans"
import { H, HYBRID_COST } from "@website/content/hybrid/figures"
import { HYBRID_PLAN } from "@website/content/plans"
import {
  ONE_TIME_COSTS,
  ONE_TIME_TOTAL,
  TRANSITION_BORROWING_TOTAL,
} from "@website/content/transition"
import { DISPLACED_TOTAL } from "@website/content/workforce"
import { COST_CATEGORIES, INVENTORY } from "@website/content/cost-inventory"
import { OPTIMIZATIONS } from "@website/content/optimizations"
import { PROBLEM_CATEGORIES, PROBLEMS } from "@website/content/problems"
import { cn } from "@website/lib/utils"
import Link from "next/link"
import type { ReactNode } from "react"

const { costHref } = SINGLE_PAYER_PLAN

const h = MODEL.headline
const oop = MODEL.sourceLines.find((l) => l.id === "hhOop")!

const USE_COST_ID: Record<string, string> = {
  governmentAdministration: "use-administration",
  netCostOfInsurance: "use-insurer-overhead",
  workforce: "use-workforce",
  publicHealth: "use-publicHealth",
  research: "use-research",
  structures: "use-structures",
}

function linkFor(costId: string) {
  const c = COST_BY_ID[costId]
  return c ? costHref(c.stepId, c.id) : undefined
}

function Row({
  label,
  href,
  before,
  after,
}: {
  label: string
  href?: string
  before: number
  after: number
}) {
  return (
    <tr>
      <td>
        {href ? (
          <Link
            href={href}
            className="underline decoration-rule underline-offset-2 hover:decoration-primary"
          >
            {label}
          </Link>
        ) : (
          label
        )}
      </td>
      <td className="text-right">
        <B v={before} />
      </td>
      <td className="text-right">
        <B v={after} />
      </td>
      <td className="text-right">
        <Delta v={after - before} invert />
      </td>
    </tr>
  )
}

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

/** A card in the "Explore everything" list at the bottom of the page. */
function ExploreCard({ href, title, sub }: { href: string; title: string; sub: string }) {
  return (
    <Link href={href} className="rounded-md border border-rule bg-card p-4 hover:border-primary">
      <div className="font-serif text-lg font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{sub}</div>
    </Link>
  )
}

export default function Home() {
  const taskCount = HYBRID_PLAN.allSteps.reduce((s, x) => s + x.tasks.length, 0)
  const hybridSaves = HYBRID_COST.delta < 0
  const coversAllUninsured = Math.abs(HYBRID_COST.newlyCovered - v("uninsuredToday")) < 0.05
  const sponsors = Object.keys(SPONSOR_LABELS) as SponsorId[]
  return (
    <Page>
      <header className="mb-12 border-b border-rule pb-10">
        <div className="mb-4 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          The plan · 2024 dollars
        </div>
        <h1 className="max-w-3xl text-4xl leading-[1.1] font-semibold sm:text-5xl">
          {hybridSaves
            ? "Everyone in the U.S. covered, for less than the country spends today."
            : "Everyone in the U.S. covered, with every dollar shown."}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/80">
          Employer plans stay. Everyone else is enrolled automatically in a nonprofit plan, with
          premiums based on income. New federal costs are paid only by taxes on the highest incomes.{" "}
          <Link href="/approaches" className="underline">
            Compare it side by side with the other approaches
          </Link>
          .
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
          <Door
            href="/groups"
            title="What changes for me?"
            sub="See how each group fares"
            primary
          />
          <Door href="/plan" title="How would it work?" sub="The plan, phase by phase" />
          <Door href="/your-plan" title="Build your own plan" sub="Make different choices" />
        </div>
      </header>

      <Section title="Ground rules">
        <ol className="grid gap-3 sm:grid-cols-2">
          {[
            [
              "Universal means everyone.",
              "Every resident, with no gaps, no churn, and no medical bills for covered care.",
            ],
            [
              "Job losses and company closures are acceptable.",
              "They are counted, costed, and cushioned, but they don't veto the design.",
            ],
            [
              "Higher cost is acceptable, if it is visible.",
              "Every dollar's move from one payer to another is shown, including increases.",
            ],
            [
              "Every change has a trade-off, and every trade-off is listed.",
              "Each step and each cost item states its own.",
            ],
            [
              "Apolitical.",
              "Legislative feasibility, filibusters, and court challenges are set aside; the question is what works.",
            ],
            [
              "Experiments and transitions are fine.",
              "Changes can be piloted, phased, or run side by side before scaling up.",
            ],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-md border border-rule bg-card p-4">
              <div className="num mb-1 text-xs text-muted-foreground">0{i + 1}</div>
              <div className="font-semibold">{t}</div>
              <div className="mt-1 text-sm text-foreground/75">{d}</div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="The plan: a Germany-style hybrid"
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
          <Link href="/plan" className="underline">
            See the plan
          </Link>{" "}
          or{" "}
          <Link href="/approaches" className="underline">
            compare approaches
          </Link>
          . One-time set-up costs: {H.oneTimeTotal}.
        </p>
        <h3 className="mt-6 mb-2 text-lg font-semibold">Households under the hybrid</h3>
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

      <Section
        title="The single-payer path, priced in full"
        intro="The alternative, built out in full: what 2024 would have looked like with a single payer fully in place (central estimate; the costly and lean cases bracket the uncertainty). Its detailed plan is at /single-payer/plan."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="National health spending"
            value={fmt(h.newTotal)}
            sub={
              <>
                {fmt(h.delta, { sign: true })} vs {fmt(h.baselineTotal)}. Range{" "}
                {fmt(MODEL_LEAN.headline.delta, { sign: true })} to{" "}
                {fmt(MODEL_COSTLY.headline.delta, { sign: true })}.
              </>
            }
            tone={h.delta < 0 ? "gain" : "loss"}
          />
          <Stat
            label="Uninsured people"
            value="0"
            sub={`From ${ENROLLMENT_2024.uninsured}M in 2024.`}
            tone="gain"
          />
          <Stat
            label="Out-of-pocket spending"
            value={fmt(oop.after)}
            sub={`From ${fmt(oop.before)}.`}
            tone="gain"
          />
          <Stat
            label="New general revenue needed"
            value={fmt(MODEL.gap)}
            sub={`Costly: ${fmt(MODEL_COSTLY.gap)}; lean: ${fmt(-MODEL_LEAN.gap)} surplus.`}
            tone="loss"
          />
          <Stat
            label="Insurer & plan overhead removed"
            value={fmt(h.adminSavings)}
            sub={`Net of ${fmt(h.uhpAdmin)} UHP administration.`}
            tone="gain"
          />
          <Stat
            label="Lower prices"
            value={fmt(h.priceEffect)}
            sub="Hospitals, physicians, drugs."
            tone="gain"
          />
          <Stat
            label="More care used"
            value={fmt(h.utilizationEffect, { sign: true })}
            sub="Newly insured, no cost sharing, new benefits."
            tone="loss"
          />
          <Stat
            label="Jobs displaced"
            value={`${Math.round(DISPLACED_TOTAL / 1000)}k`}
            sub="Insurers, billing, brokers, PBMs."
            tone="loss"
          />
        </div>
      </Section>

      <Section id="uses" title="What the country buys" intro="Each row links to its calculation.">
        <Table>
          <thead>
            <tr>
              <th>Line</th>
              <th className="text-right">2024</th>
              <th className="text-right">Under plan</th>
              <th className="text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {MODEL.useLines.map((l) => (
              <Row
                key={l.id}
                label={l.label}
                href={linkFor(USE_COST_ID[l.id] ?? `service-${l.id}`)}
                before={l.before}
                after={l.after}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total national health expenditure</td>
              <td className="text-right">
                <B v={MODEL.usesBefore} />
              </td>
              <td className="text-right">
                <B v={MODEL.usesAfter} />
              </td>
              <td className="text-right">
                <Delta v={MODEL.usesAfter - MODEL.usesBefore} invert />
              </td>
            </tr>
          </tfoot>
        </Table>
      </Section>

      <Section
        id="sources"
        title="Who pays"
        intro="Every 2024 payment stream and every new one. A decrease means that payer pays less. Each row links to its calculation."
      >
        <Table>
          <thead>
            <tr>
              <th>Line</th>
              <th className="text-right">2024</th>
              <th className="text-right">Under plan</th>
              <th className="text-right">Change</th>
            </tr>
          </thead>
          {sponsors.map((sp) => (
            <tbody key={sp}>
              <tr className="bg-secondary/60 font-semibold">
                <td>{SPONSOR_LABELS[sp]}</td>
                <td className="text-right">
                  <B v={MODEL.sponsorBefore[sp]} />
                </td>
                <td className="text-right">
                  <B v={MODEL.sponsorAfter[sp]} />
                </td>
                <td className="text-right">
                  <Delta v={MODEL.sponsorAfter[sp] - MODEL.sponsorBefore[sp]} invert />
                </td>
              </tr>
              {MODEL.sourceLines
                .filter((l) => l.sponsor === sp)
                .map((l) => (
                  <Row
                    key={l.id}
                    label={l.label}
                    href={linkFor(`source-${l.id}`)}
                    before={l.before}
                    after={l.after}
                  />
                ))}
            </tbody>
          ))}
          <tfoot>
            <tr>
              <td>Total</td>
              <td className="text-right">
                <B v={MODEL.sourcesBefore} />
              </td>
              <td className="text-right">
                <B v={MODEL.sourcesAfter} />
              </td>
              <td className="text-right">
                <Delta v={MODEL.sourcesAfter - MODEL.sourcesBefore} invert />
              </td>
            </tr>
          </tfoot>
        </Table>
      </Section>

      <Section
        id="transition"
        title="One-time transition costs (single-payer path)"
        intro={
          <>
            Total {fmt(ONE_TIME_TOTAL)}; temporary borrowing over the phase-in, including these,{" "}
            {fmt(TRANSITION_BORROWING_TOTAL)} (
            <Link className="underline" href={linkFor("phase-in-borrowing")!}>
              calculation
            </Link>
            ).
          </>
        }
      >
        <Table>
          <thead>
            <tr>
              <th>Item</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {ONE_TIME_COSTS.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link
                    href={linkFor(`onetime-${c.id}`)!}
                    className="underline decoration-rule underline-offset-2 hover:decoration-primary"
                  >
                    {c.label}
                  </Link>
                </td>
                <td className="text-right">
                  <B v={c.byYear.reduce((a, b) => a + b, 0)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Callout title="How every number is produced">
        The baseline is the CMS 2024 National Health Expenditure tables ({fmt(NHE_TOTAL_2024)}).
        Every other input (rates, unit costs, counts) is defined once on{" "}
        <Link className="underline" href="/inputs">
          the inputs page
        </Link>{" "}
        and reused everywhere. Sources always equal uses; anything the named taxes don&apos;t cover
        appears as its own general-revenue line.
      </Callout>
      <Section
        id="explore"
        title="Explore everything"
        intro="The full detail behind the plan: every problem, every cost, and every change."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ExploreCard
            href="/problems"
            title="What's wrong today"
            sub={`${PROBLEMS.length} problems in ${PROBLEM_CATEGORIES.length} categories`}
          />
          <ExploreCard
            href="/costs"
            title="What it costs"
            sub={`${INVENTORY.length} cost items in ${COST_CATEGORIES.length} categories`}
          />
          <ExploreCard
            href="/plan"
            title="How it would happen"
            sub={`${HYBRID_PLAN.allSteps.length} changes, ${taskCount} tasks`}
          />
          <ExploreCard
            href="/approaches"
            title="Compare approaches"
            sub="From keeping current law to single payer"
          />
          <ExploreCard
            href="/optimizations"
            title="Optimizations for any system"
            sub={`${OPTIMIZATIONS.length} ways to cut cost or improve care, whoever pays`}
          />
          <ExploreCard href="/why" title="Why change" sub="The case for universal coverage" />
        </div>
      </Section>
    </Page>
  )
}
