"use client"

import type { SideArea, SideGroup, SideItem } from "@website/content/navigation"
import { useCurrentPath } from "@website/lib/use-current-path"
import { cn } from "@website/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const isIn = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

/** An item is active on its own page or any of its children's pages. */
const itemActive = (pathname: string, item: SideItem) =>
  isIn(pathname, item.href) || (item.children?.some((c) => isIn(pathname, c.href)) ?? false)

/** One link in an area or group, with its children while you're on it. */
function Item({
  item,
  pathname,
  onNavigate,
  exact = false,
}: {
  item: SideItem
  pathname: string
  onNavigate?: () => void
  /** Only highlight on the item's own page (or a child's), not on every page below it. */
  exact?: boolean
}) {
  const here = exact
    ? pathname === item.href || (item.children?.some((c) => isIn(pathname, c.href)) ?? false)
    : itemActive(pathname, item)
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={pathname === item.href ? "page" : undefined}
        className={cn(
          "flex gap-1.5 rounded-sm px-1.5 py-0.5 text-[13px] leading-snug",
          here
            ? "bg-accent font-medium text-accent-foreground"
            : "text-foreground/70 hover:text-foreground",
        )}
      >
        {item.number && (
          <span className="num shrink-0 text-[11px] text-muted-foreground">{item.number}</span>
        )}
        <span>{item.label}</span>
      </Link>
      {here && item.children && (
        <ul className="mt-0.5 mb-1 ml-5 space-y-0.5">
          {item.children.map((c) => {
            const sel = c.href === item.href ? pathname === c.href : isIn(pathname, c.href)
            return (
              <li key={c.id}>
                <Link
                  href={c.href}
                  onClick={onNavigate}
                  className={cn(
                    "block px-1.5 text-[12px]",
                    sel ? "font-medium text-primary" : "text-foreground/60 hover:text-foreground",
                  )}
                >
                  {c.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

function Group({
  group,
  pathname,
  onNavigate,
}: {
  group: SideGroup
  pathname: string
  onNavigate?: () => void
}) {
  const active =
    group.items.some((i) => itemActive(pathname, i)) ||
    (group.href ? pathname === group.href : false)
  const [open, setOpen] = useState(active)
  useEffect(() => {
    if (active) setOpen(true)
  }, [active])
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o)
        }}
        aria-expanded={open}
        className={cn(
          "flex w-full items-start gap-1.5 rounded-sm px-2 py-1 text-left text-[13px] font-medium",
          active ? "text-primary" : "text-foreground/80 hover:text-foreground",
        )}
      >
        <span
          className={cn(
            "mt-[3px] inline-block text-[10px] transition-transform",
            open && "rotate-90",
          )}
        >
          ▶
        </span>
        <span>{group.title}</span>
        <span className="ml-auto pl-2 text-[11px] font-normal text-muted-foreground">
          {group.items.length}
        </span>
      </button>
      {open && (
        <ul className="mt-0.5 mb-1 ml-3 space-y-0.5 border-l border-rule pl-2">
          {group.items.map((item) => (
            <Item key={item.id} item={item} pathname={pathname} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
    </li>
  )
}

/** "By NextBestFit", linking to the publisher. */
function Byline() {
  return (
    <a
      href="https://nextbestfit.com"
      className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/nextbestfit-logo.svg`}
        alt=""
        width={14}
        height={14}
        unoptimized
        className="rounded-[3px]"
      />
      By NextBestFit
    </a>
  )
}

/** A top-level area. Its links and groups show only while you're inside it. */
function Area({
  area,
  pathname,
  onNavigate,
}: {
  area: SideArea
  pathname: string
  onNavigate?: () => void
}) {
  const active = area.match.some((m) => isIn(pathname, m))
  const hasChildren = area.links.length > 0 || area.groups.length > 0
  return (
    <li>
      <Link
        href={area.href}
        onClick={onNavigate}
        aria-current={pathname === area.href ? "page" : undefined}
        className={cn(
          "flex items-baseline gap-2 rounded-sm px-2 py-1.5 text-[15px]",
          active
            ? "bg-accent font-medium text-accent-foreground"
            : "text-foreground/85 hover:bg-secondary hover:text-foreground",
        )}
      >
        <span>{area.title}</span>
        {area.note && (
          <span className="num ml-auto pl-2 text-[11px] font-normal text-muted-foreground">
            {area.note}
          </span>
        )}
      </Link>
      {active && hasChildren && (
        <div className="mt-1 mb-3 ml-2 space-y-3 border-l border-rule pl-2">
          {area.links.length > 0 && (
            <ul className="space-y-0.5">
              {area.links.map((l) => (
                <Item key={l.id} item={l} pathname={pathname} onNavigate={onNavigate} exact />
              ))}
            </ul>
          )}
          {area.groups.length > 0 && (
            <ul className="space-y-0.5">
              {area.groups.map((g) => (
                <Group key={g.id} group={g} pathname={pathname} onNavigate={onNavigate} />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  )
}

function Tree({ areas, onNavigate }: { areas: SideArea[]; onNavigate?: () => void }) {
  const pathname = useCurrentPath()
  return (
    <nav aria-label="Site">
      <ul className="space-y-0.5">
        {areas.map((a) => (
          <Area key={a.id} area={a} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </ul>
    </nav>
  )
}

export function Sidebar({ areas }: { areas: SideArea[] }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-80 shrink-0 overflow-y-auto border-r border-rule px-3 py-6 lg:block">
      <div className="mb-6 px-2">
        <Link href="/" className="block">
          <div className="font-serif text-xl leading-tight font-semibold text-ink">
            Universal Healthcare
          </div>
        </Link>
        <Byline />
        <div className="mt-1 text-xs text-muted-foreground">
          Problems, costs, and changes toward U.S. universal health care
        </div>
      </div>
      <Tree areas={areas} />
    </aside>
  )
}

/** Mobile: a slim top bar; the menu is a full-screen drawer that only exists while open. */
export function MobileNav({ areas }: { areas: SideArea[] }) {
  const [open, setOpen] = useState(false)
  const pathname = useCurrentPath()
  useEffect(() => {
    setOpen(false)
  }, [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])
  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-rule bg-background/95 px-4 py-2 backdrop-blur lg:hidden">
        <div>
          <Link href="/" className="block font-serif text-lg leading-tight font-semibold">
            Universal Healthcare
          </Link>
          <Byline />
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(true)
          }}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="rounded-sm border border-rule px-3 py-1 text-sm"
        >
          Menu
        </button>
      </div>
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col bg-background lg:hidden"
          aria-label="Site menu"
        >
          <div className="flex items-center justify-between border-b border-rule px-4 py-2">
            <span className="font-serif text-lg font-semibold">Menu</span>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
              }}
              className="rounded-sm border border-rule px-3 py-1 text-sm"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <Tree
              areas={areas}
              onNavigate={() => {
                setOpen(false)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
