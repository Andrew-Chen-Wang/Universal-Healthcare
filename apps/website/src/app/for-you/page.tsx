import { Page, PageHeader, Sources } from "@website/components/site/ui"
import { SITUATIONS, type SituationEffect } from "@website/content/situations"
import type { Metadata } from "next"
import Link from "next/link"
import { SituationPicker } from "./situation-picker"

export const metadata: Metadata = {
  title: "What changes for you",
  description:
    "Pick the situation closest to yours and see what the plan fixes for you and what it makes harder.",
}

/** How many effects to show before "Show all". */
const FIRST = 5

function EffectList({ effects, tone }: { effects: SituationEffect[]; tone: "gain" | "loss" }) {
  if (!effects.length)
    return <p className="text-sm text-muted-foreground">None linked to this situation.</p>
  const item = (e: SituationEffect) => (
    <li key={e.problemId} className="space-y-1">
      <Link
        href={`/problems/${e.problemId}`}
        className="font-medium underline decoration-rule underline-offset-2 hover:text-primary"
      >
        {e.problem}
      </Link>
      {e.how.length > 0 && <p className="text-sm text-foreground/80">{e.how.join(" ")}</p>}
      <p className="text-xs text-muted-foreground">
        Through:{" "}
        {e.paths.map((p, i) => (
          <span key={p.id}>
            {i > 0 && "; "}
            <Link href={`/paths/${p.id}`} className="underline decoration-rule hover:text-primary">
              {p.title}
            </Link>
          </span>
        ))}
      </p>
    </li>
  )
  const first = effects.slice(0, FIRST)
  const rest = effects.slice(FIRST)
  return (
    <div className="space-y-3">
      <ul className="space-y-4">{first.map(item)}</ul>
      {rest.length > 0 && (
        <details className="group">
          <summary
            className={
              tone === "gain"
                ? "cursor-pointer text-sm font-medium text-gain"
                : "cursor-pointer text-sm font-medium text-loss"
            }
          >
            Show {rest.length} more
          </summary>
          <ul className="mt-4 space-y-4">{rest.map(item)}</ul>
        </details>
      )}
    </div>
  )
}

export default function ForYouPage() {
  const panels = Object.fromEntries(
    SITUATIONS.map((s) => [
      s.groupId,
      <section key={s.groupId} className="space-y-5 rounded-md border border-rule bg-card p-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{s.label}</h2>
          <p className="text-foreground/80">{s.summary}</p>
          {s.size && (
            <div className="text-sm text-muted-foreground">
              {s.size.text}
              <Sources ids={s.size.sourceIds} />
            </div>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-[0.12em] text-gain uppercase">
              Gets better ({s.better.length})
            </h3>
            <p className="-mt-2 text-xs text-muted-foreground">
              Problems the plan's solution paths fix for people in this situation.
            </p>
            <EffectList effects={s.better} tone="gain" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-[0.12em] text-loss uppercase">
              Gets harder or costs more ({s.harder.length})
            </h3>
            <p className="-mt-2 text-xs text-muted-foreground">
              Problems the plan's solution paths create or make worse for them.
            </p>
            <EffectList effects={s.harder} tone="loss" />
          </div>
        </div>
        <Link href={`/groups/${s.groupId}`} className="inline-block text-sm text-primary underline">
          Every problem linked to this group →
        </Link>
      </section>,
    ]),
  )
  return (
    <Page>
      <PageHeader
        eyebrow="What changes for you"
        title="What changes for you"
        lede="Pick the situation closest to yours. Each answer comes from the plan's solution paths: the problems they fix for people like you, and what they make harder."
      />
      <SituationPicker
        options={SITUATIONS.map((s) => ({ id: s.groupId, label: s.label }))}
        panels={panels}
      />
      <p className="mt-8 text-sm text-muted-foreground">
        Not listed? See{" "}
        <Link href="/groups" className="underline">
          every affected group
        </Link>
        , including businesses, insurers, and governments, or{" "}
        <Link href="/your-plan" className="underline">
          build your own plan
        </Link>
        .
      </p>
    </Page>
  )
}
