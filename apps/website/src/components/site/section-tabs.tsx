"use client"

import { useCurrentPath } from "@website/lib/use-current-path"
import { cn } from "@website/lib/utils"
import Link from "next/link"

export function SectionTabs({ tabs }: { tabs: { href: string; label: string }[] }) {
  const pathname = useCurrentPath()
  return (
    <div className="-mx-4 overflow-x-auto border-b border-rule px-4 sm:mx-0 sm:px-0">
      <nav className="flex min-w-max gap-1">
        {tabs.map((t, i) => {
          const active =
            i === 0 ? pathname === t.href : pathname === t.href || pathname.startsWith(`${t.href}/`)
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-sm whitespace-nowrap",
                active
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-foreground/70 hover:text-foreground",
              )}
            >
              {t.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
