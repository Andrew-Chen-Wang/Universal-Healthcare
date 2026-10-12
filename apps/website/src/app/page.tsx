import { B, Callout, Delta, Page, Section, Stat, Table } from "@website/components/site/ui"
import {
  ENROLLMENT_2024,
  NHE_TOTAL_2024,
  SPONSOR_LABELS,
  type SponsorId,
} from "@website/content/baseline"
import { COST_BY_ID } from "@website/content/calculations"
import { MODEL, MODEL_COSTLY, MODEL_LEAN, fmt } from "@website/content/model"
import { NAV, costHref } from "@website/content/navigation"
import { ALL_STEPS } from "@website/content/plan"
import {
  ONE_TIME_COSTS,
  ONE_TIME_TOTAL,
  TRANSITION_BORROWING_TOTAL,
} from "@website/content/transition"
import { DISPLACED_TOTAL } from "@website/content/workforce"
import Link from "next/link"

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
  const taskCount = ALL_STEPS.reduce((s, x) => s + x.tasks.length, 0)
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
          One concrete plan to cover every U.S. resident through a single public payer, broken into{" "}
          {ALL_STEPS.length} implementation steps and {taskCount} tasks. Each step in the sidebar
          has its own pages: tasks, design choices and alternatives, costs with full calculations,
          trade-offs, risks, the existing laws and programs it changes, and how other countries did
          the same thing. Every dollar below links to the page that calculates it.
        </p>
        <Link
          href={NAV[0].steps[0].href}
          className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Start with step 0.1 →
        </Link>
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
        title="The result"
        intro="Central estimate: 2024 with the plan fully in place. The costly and lean cases bracket the uncertainty."
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
        title="One-time transition costs"
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
