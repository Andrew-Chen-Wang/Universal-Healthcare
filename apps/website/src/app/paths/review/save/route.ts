/**
 * TEMPORARY: saves owner edits from /paths/review to
 * content/paths/review-overrides.json. Works only under `next dev`.
 */
import { writeFile } from "node:fs/promises"
import * as path from "node:path"
import { DRAFT_DECISIONS, type Override } from "@website/content/paths"
import { PHASES } from "@website/content/plan"

const FILE = path.join(process.cwd(), "src/content/paths/review-overrides.json")
const IDS = new Set(DRAFT_DECISIONS.map((d) => d.pathId))
const PHASE_IDS = new Set<string>(PHASES.map((p) => p.id))

function clean(raw: unknown): Record<string, Override> {
  const out: Record<string, Override> = {}
  if (!raw || typeof raw !== "object") return out
  for (const [id, v] of Object.entries(raw as Record<string, Record<string, unknown>>)) {
    if (!IDS.has(id) || !v || typeof v !== "object") continue
    const o: Override = {}
    if (v.status === "chosen" || v.status === "rejected") o.status = v.status
    if (typeof v.phase === "string" && PHASE_IDS.has(v.phase))
      o.phase = v.phase as Override["phase"]
    if (typeof v.reviewed === "boolean") o.reviewed = v.reviewed
    if (typeof v.note === "string" && v.note.trim()) o.note = v.note.slice(0, 2000)
    if (Object.keys(o).length) out[id] = o
  }
  return out
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development")
    return Response.json({ error: "Only available under next dev" }, { status: 403 })
  const data = clean(await req.json())
  const sorted = Object.fromEntries(Object.entries(data).toSorted(([a], [b]) => a.localeCompare(b)))
  await writeFile(FILE, `${JSON.stringify(sorted, null, 2)}\n`)
  return Response.json({ ok: true, count: Object.keys(sorted).length })
}
