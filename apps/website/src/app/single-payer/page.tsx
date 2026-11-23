import {
  B,
  Callout,
  Delta,
  Page,
  PageHeader,
  PlanVersionNotice,
  Section,
  Stat,
  Table,
} from "@website/components/site/ui"
import {
  ENROLLMENT_2024,
  NHE_TOTAL_2024,
  SPONSOR_LABELS,
  type SponsorId,
} from "@website/content/baseline"
import { COST_BY_ID } from "@website/content/calculations"
import { MODEL, MODEL_COSTLY, MODEL_LEAN, fmt } from "@website/content/model"
import { SINGLE_PAYER_PLAN } from "@website/content/plans"
import {
  ONE_TIME_COSTS,
  ONE_TIME_TOTAL,
  TRANSITION_BORROWING_TOTAL,
} from "@website/content/transition"
import { DISPLACED_TOTAL } from "@website/content/workforce"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Single payer, priced in full",
  description:
    "The single-payer alternative's national ledger: what the country buys, who pays, and the one-time transition costs, each line linked to its calculation.",
}

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

export default function SinglePayerLedger() {
  const sponsors = Object.keys(SPONSOR_LABELS) as SponsorId[]
  return (
    <Page>
      <PageHeader
        eyebrow="The alternative"
        title="Single payer, priced in full"
        lede="What 2024 would have looked like with a single payer fully in place (central estimate; the costly and lean cases bracket the uncertainty). Every row links to its calculation."
      />
      <PlanVersionNotice variant="single-payer" />
      <p className="mb-10 text-foreground/80">
        How it would happen, step by step:{" "}
        <Link href={SINGLE_PAYER_PLAN.base} className="underline">
          the single-payer plan, phase by phase
        </Link>
        .
      </p>

      <Section id="headline" title="The headline numbers">
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
              <th className="text-right">Under single payer</th>
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
              <th className="text-right">Under single payer</th>
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
