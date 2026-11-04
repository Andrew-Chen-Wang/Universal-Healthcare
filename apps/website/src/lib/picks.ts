"use client"
/**
 * A reader's path picks, shared by /your-plan and the problem and group pages.
 * Picks live in localStorage; a `?paths=a,b,c` link overrides them for that
 * page, so a mix of paths can be shared without touching anyone's saved plan.
 * A reader with nothing saved starts from the site's plan (the hybrid's picks),
 * passed in as `defaults`; clearing every pick saves an empty plan, which sticks.
 */
import { useEffect, useRef, useState } from "react"

export const STORAGE_KEY = "universal.build.picks.v1"

/** The saved picks, or null when the reader has never saved any. */
export function loadPicks(): string[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : null
  } catch {
    return null
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

/**
 * Picks from a `?paths=` link if present, else the saved plan, else `defaults`
 * (the site's plan). Toggles write back to the link or the saved plan.
 */
export function usePicks(defaults: string[] = []) {
  const [picks, setPicks] = useState<Set<string>>(new Set())
  const [fromLink, setFromLink] = useState(false)
  const [fromDefault, setFromDefault] = useState(false)
  const [loaded, setLoaded] = useState(false)
  // Defaults only seed the first load, so later prop changes are ignored.
  const initial = useRef(defaults)

  useEffect(() => {
    const link = linkPicks()
    const saved = loadPicks()
    setFromLink(link !== null)
    setFromDefault(link === null && saved === null)
    setPicks(new Set(link ?? saved ?? initial.current))
    setLoaded(true)
  }, [])

  const update = (next: Set<string>) => {
    setPicks(next)
    if (fromLink) {
      const url = new URL(window.location.href)
      url.searchParams.set("paths", [...next].join(","))
      window.history.replaceState(null, "", url)
    } else {
      storePicks([...next])
      setFromDefault(false)
    }
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
    const saved = loadPicks()
    setFromDefault(saved === null)
    setPicks(new Set(saved ?? initial.current))
  }

  const shareUrl = () => {
    const url = new URL(window.location.href)
    url.searchParams.set("paths", [...picks].join(","))
    return url.toString()
  }

  return { picks, loaded, fromLink, fromDefault, toggle, setAll: update, useSaved, shareUrl }
}
