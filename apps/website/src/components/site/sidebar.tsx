"use client"

import type { NavPhase } from "@website/content/navigation"
import { cn } from "@website/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

function NavTree({ nav, onNavigate }: { nav: NavPhase[]; onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="space-y-5 text-sm">
      {nav.map((phase) => {
        const phaseActive = pathname.startsWith(phase.href)
        return (
          <div key={phase.id}>
            <Link
              href={phase.href}
              onClick={onNavigate}
              className={cn(
                "mb-1 block text-[11px] font-semibold tracking-[0.12em] uppercase",
                phaseActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {phase.number}. {phase.title}
            </Link>
            <ul className="space-y-0.5">
              {phase.steps.map((step) => {
                const inStep = pathname === step.href || pathname.startsWith(`${step.href}/`)
                return (
                  <li key={step.id}>
                    <Link
                      href={step.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex gap-2 rounded-sm border-l-2 py-1 pr-2 pl-2 leading-snug transition-colors",
                        inStep
                          ? "border-primary bg-accent font-medium text-accent-foreground"
                          : "border-transparent text-foreground/75 hover:border-rule hover:text-foreground",
                      )}
                    >
                      <span className="num shrink-0 text-xs text-muted-foreground">
                        {step.number}
                      </span>
                      <span>{step.title}</span>
                    </Link>
                    {inStep && (
                      <ul className="mt-0.5 mb-1 ml-6 space-y-0.5 border-l border-rule pl-2">
                        {step.sections.map((sec) => {
                          const active =
                            sec.id === ""
                              ? pathname === step.href
                              : pathname === sec.href || pathname.startsWith(`${sec.href}/`)
                          return (
                            <li key={sec.id}>
                              <Link
                                href={sec.href}
                                onClick={onNavigate}
                                className={cn(
                                  "block rounded-sm px-2 py-0.5 text-[13px]",
                                  active
                                    ? "font-medium text-primary"
                                    : "text-foreground/70 hover:text-foreground",
                                )}
                              >
                                {sec.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}

export function Sidebar({ nav }: { nav: NavPhase[] }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 overflow-y-auto border-r border-rule px-4 py-6 lg:block">
      <Link href="/" className="mb-6 block px-2">
        <div className="font-serif text-xl leading-tight font-semibold text-ink">Universal</div>
        <div className="text-xs text-muted-foreground">
          Every step to U.S. universal health care
        </div>
      </Link>
      <NavTree nav={nav} />
    </aside>
  )
}

export function MobileNav({ nav }: { nav: NavPhase[] }) {
  return (
    <details className="group sticky top-0 z-20 border-b border-rule bg-background/95 backdrop-blur lg:hidden">
      <summary className="flex list-none items-center justify-between px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="font-serif text-lg font-semibold">Universal</span>
        <span className="rounded-sm border border-rule px-2 py-1 text-xs text-muted-foreground group-open:bg-secondary">
          Steps
        </span>
      </summary>
      <div className="max-h-[75dvh] overflow-y-auto px-4 pb-6">
        <NavTree
          nav={nav}
          onNavigate={() => {
            document.querySelector("details[open]")?.removeAttribute("open")
          }}
        />
      </div>
    </details>
  )
}
