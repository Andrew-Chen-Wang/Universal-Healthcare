/**
 * Who a set of picks covers, group by group. Counts come from constants.ts
 * (population groups); statuses follow from the payer, immigrant, and
 * residence-period paths. Groups come from different surveys and years, so
 * they are shown side by side, not summed into one total.
 */
export type Pop = {
  residentPop2025: number
  usBornCitizens: number
  naturalizedCitizens: number
  lawfulPermanentResidents: number
  nonimmigrantResidents: number
  unauthorizedHigh: number
  unauthorizedLow: number
  newLprArrivals: number
  visitorArrivals: number
  uninsuredToday: number
  mandateRepealUninsured2027: number
  tricareActiveFamilies: number
  vaEnrolled: number
  ihsServed: number
  incarcerated: number
  puertoRicoPop: number
  otherTerritoriesPop: number
}

export type Status = "covered" | "partial" | "emergency" | "waiting" | "separate" | "gap" | "open"

export type GroupRow = {
  id: string
  label: string
  /** Millions; [low, high] when sources disagree. */
  count: number | [number, number]
  per?: "year"
  status: Status
  detail: string
}

const AUTOMATIC = ["single-payer", "regulated-multipayer", "auto-enrollment"]
const PARTIAL = ["public-option", "mandate-subsidies", "medicare-age-down"]

export function coverageFor(picks: Set<string>, pop: Pop): GroupRow[] {
  const has = (id: string) => picks.has(id)
  const automatic = AUTOMATIC.some(has)
  const partial = !automatic && PARTIAL.some(has)
  const residence = has("migration-residence") && !has("migration-no-wait")

  const base: Pick<GroupRow, "status" | "detail"> = automatic
    ? { status: "covered", detail: "Enrolled automatically by the payer structure you picked." }
    : partial
      ? {
          status: "partial",
          detail: `Your payer pick relies on people signing up, so some stay uninsured. For scale, CBO projected that ending the ACA mandate penalty would leave ${pop.mandateRepealUninsured2027} million more people uninsured by 2027.`,
        }
      : {
          status: "open",
          detail: `No payer structure picked yet. Today about ${pop.uninsuredToday} million people are uninsured.`,
        }

  const immigrant: Pick<GroupRow, "status" | "detail"> = has("immigrants-all-residents")
    ? automatic || partial
      ? {
          status: base.status,
          detail: `Eligible as residents${residence ? " after the residence period" : ""}. ${base.detail}`,
        }
      : { status: "open", detail: "Eligible once a payer structure is picked." }
    : has("immigrants-lawful-only")
      ? {
          status: "emergency",
          detail:
            "Emergency care only (as with emergency Medicaid today), plus community health centers.",
        }
      : { status: "open", detail: "No immigrant-coverage path picked yet." }

  return [
    {
      id: "citizens",
      label: "Citizens (U.S.-born and naturalized)",
      count: pop.usBornCitizens + pop.naturalizedCitizens,
      ...base,
    },
    {
      id: "lprs",
      label: "Lawful permanent residents",
      count: pop.lawfulPermanentResidents,
      ...base,
    },
    {
      id: "nonimmigrants",
      label: "Other lawfully present residents (work and student visas, families)",
      count: pop.nonimmigrantResidents,
      ...base,
    },
    {
      id: "unauthorized",
      label: "Unauthorized immigrants",
      count: [pop.unauthorizedLow, pop.unauthorizedHigh],
      ...immigrant,
    },
    {
      id: "arrivals",
      label: "New immigrants arriving from abroad",
      count: pop.newLprArrivals,
      per: "year",
      ...(residence
        ? {
            status: "waiting" as const,
            detail:
              "Wait out the residence period; emergencies, children, and pregnancy are covered at once.",
          }
        : has("migration-no-wait")
          ? { status: base.status, detail: `Covered from arrival. ${base.detail}` }
          : { status: "open" as const, detail: "No residence-period path picked yet." }),
    },
    {
      id: "visitors",
      label: "Short-term visitors and tourists",
      count: pop.visitorArrivals,
      per: "year",
      status: "emergency",
      detail:
        "Not residents under any path: emergency care is billed or paid by travel insurance, as in most countries.",
    },
    {
      id: "military",
      label: "Active-duty military and families (TRICARE)",
      count: pop.tricareActiveFamilies,
      status: "separate",
      detail: "TRICARE continues as a separate system; no path changes it.",
    },
    {
      id: "veterans",
      label: "Veterans enrolled in VA health care",
      count: pop.vaEnrolled,
      status: "separate",
      detail:
        "VA care continues; veterans are also covered as residents by the payer structure you pick.",
    },
    {
      id: "ihs",
      label: "American Indians and Alaska Natives served by IHS",
      count: pop.ihsServed,
      status: "separate",
      detail: "IHS continues; people it serves are also covered as residents.",
    },
    {
      id: "incarcerated",
      label: "People in prisons and jails",
      count: pop.incarcerated,
      status: "separate",
      detail: "Correctional health care stays with prisons and jails; no path changes it.",
    },
    {
      id: "territories",
      label: "U.S. territories (Puerto Rico, Guam, USVI, American Samoa, N. Mariana Islands)",
      count: pop.puertoRicoPop + pop.otherTerritoriesPop,
      ...(has("territories-full")
        ? {
            status: base.status,
            detail: `Included on the same terms as the states. ${base.detail}`,
          }
        : has("territories-medicaid-parity")
          ? {
              status: "partial" as const,
              detail:
                "Territory Medicaid with state-like funding: covered if eligible, not enrolled automatically.",
            }
          : has("territories-capped-increase")
            ? {
                status: "partial" as const,
                detail:
                  "Capped territory Medicaid, raised and indexed; coverage still differs from the states.",
              }
            : {
                status: "gap" as const,
                detail:
                  "No territories path picked. Their federal Medicaid funding is capped, unlike the states'.",
              }),
    },
  ]
}
