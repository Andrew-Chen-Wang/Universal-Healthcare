import { MODEL, fmt } from "../model"
import { ONE_TIME_COSTS } from "../transition"

/** Total one-time cost (billions) for a transition cost line. */
export function oneTime(id: string) {
  const c = ONE_TIME_COSTS.find((x) => x.id === id)
  if (!c) throw new Error(`Unknown one-time cost ${id}`)
  return c.byYear.reduce((a, b) => a + b, 0)
}

export function useLine(id: string) {
  const l = MODEL.useLines.find((x) => x.id === id)
  if (!l) throw new Error(`Unknown use line ${id}`)
  return l
}

export function sourceLine(id: string) {
  const l = MODEL.sourceLines.find((x) => x.id === id)
  if (!l) throw new Error(`Unknown source line ${id}`)
  return l
}

export function service(id: string) {
  const s = MODEL.serviceResults.find((x) => x.id === id)
  if (!s) throw new Error(`Unknown service ${id}`)
  return s
}

export { MODEL, fmt }
