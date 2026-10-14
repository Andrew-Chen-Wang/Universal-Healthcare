import {
  Callout,
  ConfidenceTag,
  Page,
  PageHeader,
  Section,
  Sources,
  Table,
} from "@website/components/site/ui"
import { PAYER_LABELS, SERVICES_2024 } from "@website/content/baseline"
import { ASSUMPTIONS, SERVICE_ASSUMPTIONS, fmt } from "@website/content/model"
import { SENSITIVITY } from "@website/content/sensitivity"
import type { Metadata } from "next"

const serviceLabel = (id: string) => SERVICES_2024.find((s) => s.id === id)?.label ?? id

export const metadata: Metadata = { title: "Method & assumptions" }

function formatValue(v: number, unit: string) {
  if (unit === "billions") return fmt(v)
  if (unit === "share" || unit === "rate") return `${(v * 100).toFixed(1)}%`
  return v.toLocaleString()
}

export default function MethodPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Reference"
        title="Method & assumptions"
        lede="How every number on this site is produced, and every assumption with its range, confidence, and reasoning."
      />

      <Section id="approach" title="Approach">
        <ol className="max-w-3xl list-decimal space-y-3 pl-5 leading-relaxed">
          <li>
            <strong>Baseline.</strong> Start from the CMS National Health Expenditure Accounts for
            2024 (released December 2025): spending by type of service and source of funds (Table
            4), and by sponsor (Tables 5-1 to 5-4). Every baseline number is transcribed, not
            estimated.
          </li>
          <li>
            <strong>Steady state in 2024 dollars.</strong> Ask what 2024 would have looked like with
            the fully phased-in plan, instead of projecting to a future year. Projections compound
            uncertainty about growth that has nothing to do with the plan. To approximate a future
            year, scale by NHE growth (CMS projects about 5–6% a year).
          </li>
          <li>
            <strong>Re-price each service.</strong> For each service, divide each payer&apos;s
            spending by that payer&apos;s price relative to a reference price (usually Medicare) to
            get &ldquo;reference-price volume&rdquo;. Multiply by the UHP payment rate (price
            effect), then by a utilization multiplier (utilization effect). Spending that stays
            outside UHP ({PAYER_LABELS.otherInsurance}; {PAYER_LABELS.otherThirdParty.toLowerCase()}
            ; non-covered out-of-pocket items) carries over unchanged.
          </li>
          <li>
            <strong>Administration.</strong> Insurer and plan overhead (the &ldquo;net cost of
            insurance&rdquo;) is removed except for continuing programs; UHP administration is added
            as a share of benefits.
          </li>
          <li>
            <strong>Sources of funds.</strong> Every 2024 sponsor line is marked as continuing,
            redirected, reduced, or eliminated, and new taxes are computed from their bases and
            rates. Whatever remains is reported as an explicit general-revenue line, so sources
            always equal uses.
          </li>
          <li>
            <strong>Scenarios.</strong> The costly and lean cases change provider rates, induced
            demand, drug prices, administrative cost, wage pass-through, and top-end revenue
            together, to bracket the uncertainty.
          </li>
          <li>
            <strong>Transition.</strong> One-time costs and the phase-in financing gap are reported
            separately from the steady-state ledger.
          </li>
        </ol>
        <Callout tone="caution" title="Known simplifications">
          The model treats the 2024 mix of services as fixed apart from the utilization multipliers.
          It doesn&apos;t model macroeconomic feedback (labor supply, GDP), provider-side
          administrative savings as a separate line (they appear as what makes UHP rates viable),
          changes in non-commercial research, or drug-price effects on hospital- and
          physician-administered drugs beyond the rate assumptions. Provider cost structures vary
          enormously; aggregate results hide large differences between individual hospitals and
          practices.
        </Callout>
      </Section>

      <Section id="services" title="Service-level assumptions">
        <Table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Reference price</th>
              <th className="text-right">Private</th>
              <th className="text-right">Medicare</th>
              <th className="text-right">Medicaid</th>
              <th className="text-right">Out of pocket</th>
              <th className="text-right">UHP rate</th>
              <th className="text-right">Utilization</th>
              <th className="text-right">OOP retained</th>
            </tr>
          </thead>
          <tbody>
            {SERVICE_ASSUMPTIONS.map((s) => (
              <tr key={s.id}>
                <td className="font-medium">{serviceLabel(s.id)}</td>
                <td className="text-sm">{s.reference}</td>
                <td className="num text-right">{s.relativePrice.privateInsurance.toFixed(2)}</td>
                <td className="num text-right">{s.relativePrice.medicare.toFixed(2)}</td>
                <td className="num text-right">{s.relativePrice.medicaid.toFixed(2)}</td>
                <td className="num text-right">{s.relativePrice.outOfPocket.toFixed(2)}</td>
                <td className="num text-right">{s.uhpRate.toFixed(2)}</td>
                <td className="num text-right">{s.utilization.toFixed(2)}×</td>
                <td className="num text-right">{Math.round(s.retainedOutOfPocketShare * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-6 space-y-4">
          {SERVICE_ASSUMPTIONS.map((s) => (
            <div key={s.id} className="border-l-2 border-rule pl-4 text-sm">
              <div className="font-semibold">{serviceLabel(s.id)}</div>
              <p className="text-foreground/85">{s.notes}</p>
              <Sources ids={s.sourceIds} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="assumptions" title="Other assumptions">
        <Table>
          <thead>
            <tr>
              <th>Assumption</th>
              <th className="text-right">Central</th>
              <th className="text-right">Range</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(ASSUMPTIONS).map((a) => (
              <tr key={a.id}>
                <td>
                  <div className="font-medium">{a.label}</div>
                  <div className="text-xs text-muted-foreground">{a.rationale}</div>
                  <Sources ids={a.sourceIds} />
                </td>
                <td className="num text-right">{formatValue(a.value, a.unit)}</td>
                <td className="num text-right whitespace-nowrap">
                  {a.low === a.high
                    ? "—"
                    : `${formatValue(a.low, a.unit)} – ${formatValue(a.high, a.unit)}`}
                </td>
                <td>
                  <ConfidenceTag level={a.confidence} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section id="other-estimates" title="How this compares with other estimates">
        <Table>
          <thead>
            <tr>
              <th>Study</th>
              <th>Finding</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CBO (2020)</td>
              <td className="text-sm">
                Five single-payer options: national spending in 2030 from −$0.7T to +$0.3T; federal
                subsidies +$1.5T to +$3.0T.
              </td>
            </tr>
            <tr>
              <td>Mercatus / Blahous (2018)</td>
              <td className="text-sm">
                +$32.6T federal over 2022–2031; national spending roughly flat if providers are paid
                Medicare rates.
              </td>
            </tr>
            <tr>
              <td>Urban Institute (2019)</td>
              <td className="text-sm">
                +$34T federal over 2020–2029; national spending up about $7T over 10 years.
              </td>
            </tr>
            <tr>
              <td>PERI / Pollin (2018)</td>
              <td className="text-sm">National spending 10% lower.</td>
            </tr>
            <tr>
              <td>Galvani et al., Lancet (2020)</td>
              <td className="text-sm">13% ($450B) savings a year; 68,000 lives saved.</td>
            </tr>
            <tr>
              <td>This site, central</td>
              <td className="text-sm">
                National spending −1.6%; the costly and lean cases are on the ledger page.
              </td>
            </tr>
          </tbody>
        </Table>
        <p className="mt-3 text-sm text-muted-foreground">
          Most of the difference between estimates comes from two assumptions: provider payment
          rates and induced utilization. This site shows both explicitly so they can be argued about
          directly.
        </p>
        <Sources
          ids={[
            "cbo-single-payer-2020",
            "mercatus-2018",
            "urban-2019",
            "peri-2018",
            "galvani-2020",
          ]}
        />
      </Section>

      <Section
        id="sensitivity"
        title="Which assumptions matter most"
        intro="Each assumption moved to its low and high value with everything else at central. Sorted by effect on the general-revenue requirement."
      >
        <Table>
          <thead>
            <tr>
              <th>Assumption</th>
              <th className="text-right">Low → national spending</th>
              <th className="text-right">High → national spending</th>
              <th className="text-right">Low → revenue need</th>
              <th className="text-right">High → revenue need</th>
            </tr>
          </thead>
          <tbody>
            {SENSITIVITY.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.lowLabel} to {s.highLabel}
                  </div>
                </td>
                <td className="num text-right">{fmt(s.spendingLow, { sign: true })}</td>
                <td className="num text-right">{fmt(s.spendingHigh, { sign: true })}</td>
                <td className="num text-right">{fmt(s.gapLow, { sign: true })}</td>
                <td className="num text-right">{fmt(s.gapHigh, { sign: true })}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </Page>
  )
}
