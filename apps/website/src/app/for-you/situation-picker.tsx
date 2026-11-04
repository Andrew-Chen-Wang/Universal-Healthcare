"use client"
/** Chips for picking a situation; shows that situation's answer. The choice is kept in the URL
 * hash, so a link can open straight to one situation. */
import { cn } from "@website/lib/utils"
import { type ReactNode, useEffect, useState } from "react"

export function SituationPicker({
  options,
  panels,
}: {
  options: { id: string; label: string }[]
  panels: Record<string, ReactNode>
}) {
  const [active, setActive] = useState(options[0]?.id ?? "")

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (options.some((o) => o.id === id)) setActive(id)
    }
    fromHash()
    window.addEventListener("hashchange", fromHash)
    return () => {
      window.removeEventListener("hashchange", fromHash)
    }
  }, [options])

  const pick = (id: string) => {
    setActive(id)
    window.history.replaceState(null, "", `#${id}`)
  }

  return (
    <div className="space-y-6">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Your situation</legend>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={o.id === active}
            onClick={() => {
              pick(o.id)
            }}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              o.id === active
                ? "border-ink bg-ink text-paper"
                : "border-rule bg-card text-foreground/85 hover:border-primary",
            )}
          >
            {o.label}
          </button>
        ))}
      </fieldset>
      <div aria-live="polite">{panels[active]}</div>
    </div>
  )
}
