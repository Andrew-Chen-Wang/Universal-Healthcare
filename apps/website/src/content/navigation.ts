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
export type SidePart = { id: string; title: string; href: string; groups: SideGroup[] }

export const SIDEBAR: SidePart[] = [
  {
    id: "problems",
    title: "Part 1 · Problems",
    href: "/problems",
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
    id: "paths",
    title: "Part 1 · Decide solution paths",
    href: "/paths",
    groups: [
      {
        id: "decide",
        title: "Decisions",
        href: "/paths",
        items: [
          { id: "tree", label: "Decision tree", href: "/paths" },
          { id: "approaches", label: "Compare approaches", href: "/approaches" },
          { id: "your-plan", label: "Build your plan", href: "/your-plan" },
          { id: "groups", label: "Who's affected", href: "/groups" },
          { id: "ledger", label: "Review ledger (draft picks)", href: "/paths/ledger" },
        ],
      },
    ],
  },
  {
    id: "optimizations",
    title: "Part 1 · Optimizations for any system",
    href: "/optimizations",
    groups: OPTIMIZATION_LENSES.filter((l) => OPTIMIZATIONS.some((o) => o.lens === l)).map((l) => ({
      id: `o-${slug(l)}`,
      title: l,
      href: `/optimizations#${slug(l)}`,
      items: OPTIMIZATIONS.filter((o) => o.lens === l).map((o) => ({
        id: o.id,
        label: o.title,
        href: `/optimizations/${o.id}`,
      })),
    })),
  },
  {
    id: "costs",
    title: "Part 1 · Costs",
    href: "/costs",
    groups: COST_CATEGORIES.map((c) => ({
      id: `c-${slug(c)}`,
      title: c,
      href: `/costs#${slug(c)}`,
      items: INVENTORY.filter((i) => i.category === c).map((i) => ({
        id: i.id,
        label: i.label,
        href: `/costs/${i.id}`,
      })),
    })),
  },
  {
    id: "changes",
    title: "Part 2 · Changes by phase",
    href: "/plan",
    groups: [
      {
        id: "all-changes",
        title: "All changes from chosen paths",
        href: "/changes",
        items: [
          { id: "changes", label: "Changes by phase", href: "/changes" },
          {
            id: "single-payer-plan",
            label: "Single-payer plan (earlier draft)",
            href: SINGLE_PAYER_PLAN.base,
          },
          {
            id: "single-payer-changes",
            label: "Single-payer changes by phase",
            href: "/single-payer/changes",
          },
        ],
      },
      ...HYBRID_PLAN.nav.map((p) => ({
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
    ],
  },
]
