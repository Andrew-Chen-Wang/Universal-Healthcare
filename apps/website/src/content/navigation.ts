import { COST_CATEGORIES, INVENTORY } from "./cost-inventory"
import { OPTIMIZATION_LENSES, OPTIMIZATIONS } from "./optimizations"
import { PROBLEM_CATEGORIES, PROBLEMS } from "./problems"
import { pathsFor } from "./paths"
import { HYBRID_PLAN, SINGLE_PAYER_PLAN } from "./plans"

export { SECTION_LABELS, type NavPhase, type NavStep, type SectionId } from "./plan-bundle"

export const slug = (x: string) =>
  x
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

export type SideItem = {
  id: string
  label: string
  href: string
  number?: string
  children?: SideItem[]
}
export type SideGroup = { id: string; title: string; href?: string; items: SideItem[] }

/**
 * One of the six top-level areas in the sidebar. Only the area you're in shows its links and
 * groups, so the sidebar stays short until you go into an area.
 */
export type SideArea = {
  id: string
  title: string
  href: string
  /** Path prefixes that belong to this area. */
  match: string[]
  /** Short note shown beside the title, such as a count. */
  note?: string
  links: SideItem[]
  groups: SideGroup[]
}

export const SIDEBAR: SideArea[] = [
  {
    id: "why",
    title: "Why change",
    href: "/why",
    match: ["/why"],
    links: [],
    groups: [],
  },
  {
    id: "problems",
    title: "What's wrong today",
    href: "/problems",
    match: ["/problems"],
    note: String(PROBLEMS.length),
    links: [{ id: "all-problems", label: "All problems", href: "/problems" }],
    groups: PROBLEM_CATEGORIES.map((c) => ({
      id: `p-${slug(c)}`,
      title: c,
      href: `/problems#${slug(c)}`,
      items: PROBLEMS.filter((p) => p.category === c).map((p) => ({
        id: p.id,
        label: p.title,
        href: `/problems/${p.id}`,
        children: pathsFor(p.id).map((x) => ({ id: x.id, label: x.title, href: `/paths/${x.id}` })),
      })),
    })),
  },
  {
    id: "options",
    title: "The options",
    href: "/approaches",
    match: ["/approaches", "/paths", "/optimizations"],
    links: [
      { id: "approaches", label: "Compare approaches", href: "/approaches" },
      { id: "tree", label: "Every option, problem by problem", href: "/paths" },
      {
        id: "optimizations",
        label: "Optimizations for any system",
        href: "/optimizations",
        children: OPTIMIZATION_LENSES.flatMap((l) =>
          OPTIMIZATIONS.filter((o) => o.lens === l).map((o) => ({
            id: o.id,
            label: o.title,
            href: `/optimizations/${o.id}`,
          })),
        ),
      },
      { id: "ledger", label: "Review ledger", href: "/paths/ledger" },
    ],
    groups: [],
  },
  {
    id: "plan",
    title: "How it would happen",
    href: "/plan",
    match: ["/plan", "/changes", "/single-payer", "/implementation"],
    note: `${HYBRID_PLAN.nav.length} phases`,
    links: [
      { id: "plan", label: "The plan, phase by phase", href: "/plan" },
      { id: "changes", label: "Every change, by phase", href: "/changes" },
      {
        id: "single-payer-plan",
        label: "Single-payer plan (alternative)",
        href: SINGLE_PAYER_PLAN.base,
      },
      { id: "single-payer-changes", label: "Single-payer changes", href: "/single-payer/changes" },
    ],
    groups: HYBRID_PLAN.nav.map((p) => ({
      id: `ph-${p.id}`,
      title: `${p.number}. ${p.title}`,
      href: p.href,
      items: p.steps.map((s) => ({
        id: s.id,
        label: s.title,
        number: s.number,
        href: s.href,
        children: s.sections.map((sec) => ({
          id: `${s.id}-${sec.id}`,
          label: sec.label,
          href: sec.href,
        })),
      })),
    })),
  },
  {
    id: "costs",
    title: "What it costs",
    href: "/costs",
    match: ["/costs"],
    note: String(INVENTORY.length),
    links: [{ id: "all-costs", label: "Where the money goes", href: "/costs" }],
    groups: COST_CATEGORIES.map((c) => ({
      id: `c-${slug(c)}`,
      title: c,
      href: `/costs#${slug(c)}`,
      items: INVENTORY.filter((i) => i.category === c).map((i) => ({
        id: i.id,
        label: i.label,
        href: `/costs/${i.slug}`,
      })),
    })),
  },
  {
    id: "you",
    title: "What changes for you",
    href: "/groups",
    match: ["/groups", "/your-plan"],
    links: [
      { id: "groups", label: "Who's affected", href: "/groups" },
      { id: "your-plan", label: "Build your own plan", href: "/your-plan" },
    ],
    groups: [],
  },
]
