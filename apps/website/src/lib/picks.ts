"use client"
/**
 * A reader's path picks, shared by /your-plan and the problem and group pages.
 * Picks live in localStorage; a `?paths=a,b,c` link overrides them for that
 * page, so a mix of paths can be shared without touching anyone's saved plan.
 */
import { useEffect, useState } from "react"

export const STORAGE_KEY = "universal.build.picks.v1"

export function loadPicks(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []
  } catch {
    return []
  }
}

export function storePicks(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Storage unavailable (private mode); picks last for this visit only.
  }
}

function linkPicks(): string[] | null {
  const raw = new URLSearchParams(window.location.search).get("paths")
  return raw === null ? null : raw.split(",").filter(Boolean)
}

/** Picks from a `?paths=` link if present, else the saved plan. Toggles write back to the same place. */
export function usePicks() {
  const [picks, setPicks] = useState<Set<string>>(new Set())
  const [fromLink, setFromLink] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const link = linkPicks()
    setFromLink(link !== null)
    setPicks(new Set(link ?? loadPicks()))
    setLoaded(true)
  }, [])

  const update = (next: Set<string>) => {
    setPicks(next)
    if (fromLink) {
      const url = new URL(window.location.href)
      url.searchParams.set("paths", [...next].join(","))
      window.history.replaceState(null, "", url)
    } else storePicks([...next])
  }

  const toggle = (id: string) => {
    const next = new Set(picks)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    update(next)
  }

  /** Switch back from a shared link to the reader's saved plan. */
  const useSaved = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("paths")
    window.history.replaceState(null, "", url)
    setFromLink(false)
    setPicks(new Set(loadPicks()))
  }

  const shareUrl = () => {
    const url = new URL(window.location.href)
    url.searchParams.set("paths", [...picks].join(","))
    return url.toString()
  }

  return { picks, loaded, fromLink, toggle, setAll: update, useSaved, shareUrl }
}
