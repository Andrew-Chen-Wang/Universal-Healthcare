import { B, Callout, Delta, Page, Section, Stat, Table } from "@website/components/site/ui"
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
import { PROBLEM_CATEGORIES, PROBLEMS } from "@website/content/problems"
import Link from "next/link"

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

export default function Home() {
  const taskCount = HYBRID_PLAN.allSteps.reduce((s, x) => s + x.tasks.length, 0)
  const sponsors = Object.keys(SPONSOR_LABELS) as SponsorId[]
  return (
    <Page>
      <header className="mb-12 border-b border-rule pb-10">
        <div className="mb-4 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          A costed plan · 2024 dollars
        </div>
        <h1 className="max-w-3xl text-4xl leading-[1.1] font-semibold sm:text-5xl">
          Universal health care for the United States, step by step and dollar by dollar.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/80">
          The site has two parts. Part 1 lists every problem in the U.S. health system (and every
          problem universal systems elsewhere have run into) and every cost that makes up national
          health spending, down to the wages of each occupation. Part 2 lists every change needed,
          by phase, each with its trade-offs. Solutions are being decided problem by problem.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link
            href="/problems"
            className="rounded-md border border-rule bg-card p-4 hover:border-primary"
          >
            <div className="text-xs text-muted-foreground uppercase">Part 1</div>
            <div className="font-serif text-xl font-semibold">Problems</div>
            <div className="text-sm text-muted-foreground">
              {PROBLEMS.length} problems in {PROBLEM_CATEGORIES.length} categories
            </div>
          </Link>
          <Link
            href="/costs"
            className="rounded-md border border-rule bg-card p-4 hover:border-primary"
          >
            <div className="text-xs text-muted-foreground uppercase">Part 1</div>
            <div className="font-serif text-xl font-semibold">Costs</div>
            <div className="text-sm text-muted-foreground">
              {INVENTORY.length} cost items in {COST_CATEGORIES.length} categories
            </div>
          </Link>
          <Link
            href="/plan"
            className="rounded-md border border-rule bg-card p-4 hover:border-primary"
          >
            <div className="text-xs text-muted-foreground uppercase">Part 2 · draft</div>
            <div className="font-serif text-xl font-semibold">Changes by phase</div>
            <div className="text-sm text-muted-foreground">
              {HYBRID_PLAN.allSteps.length} changes, {taskCount} tasks
            </div>
          </Link>
        </div>
      </header>

      <Callout title="What if we change less, or nothing?">
        Every problem also has a &ldquo;Keep current law&rdquo; option, and every solution path is
        labeled by how much it changes today&apos;s system.{" "}
        <Link href="/approaches" className="underline">
          Compare approaches
        </Link>{" "}
        side by side: keep current law, minor changes, bigger changes that keep today&apos;s
        insurers, a universal multi-payer system, single payer, and the current draft: a
        Germany-style hybrid that keeps employer plans.
      </Callout>

      <Callout title="Optimizations that work in any system">
        Some ways to cut cost or improve care don&apos;t depend on who pays: running routine lab
        tests and planned surgery at high volume, a virtual first step for routine problems,
        hospital care at home, pharmacist test-and-treat, and more.{" "}
        <Link href="/optimizations" className="underline">
          See the optimizations
        </Link>
        , with the evidence for and against each.
      </Callout>

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
        title="The current draft: a Germany-style hybrid"
        intro="Employer plans stay; everyone else is enrolled in regulated nonprofit plans; new federal costs are paid only by taxes on the highest incomes. Priced line by line on top of 2024 spending."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
          <Stat label="Newly covered" value={H.newlyCovered} sub="enrolled automatically" />
          <Stat
            label="No new tax below"
            value={`$${(HYBRID_COST.noNewTaxBelow ?? 0).toLocaleString("en-US")}`}
            sub="of household income"
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
        intro="The earlier draft, kept as a complete path: what 2024 would have looked like with a single payer fully in place (central estimate; the costly and lean cases bracket the uncertainty). Its detailed plan is at /single-payer/plan."
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
    </Page>
  )
}
