/**
 * The countries the site can credit, and how place labels name them. No
 * imports, so path validation can use it without a cycle.
 */
export type Country = { id: string; name: string; match: RegExp }

export const COUNTRIES: Country[] = [
  { id: "australia", name: "Australia", match: /\bAustralia/ },
  { id: "brazil", name: "Brazil", match: /\bBrazil/ },
  {
    id: "canada",
    name: "Canada",
    match: /\b(Canada|Canadian|Ontario|Quebec|Saskatchewan|Vancouver)\b/,
  },
  { id: "denmark", name: "Denmark", match: /\bDenmark\b/ },
  { id: "estonia", name: "Estonia", match: /\bEstonia\b/ },
  { id: "finland", name: "Finland", match: /\bFinland\b/ },
  { id: "france", name: "France", match: /\bFrance\b/ },
  { id: "germany", name: "Germany", match: /\b(Germany|IQWiG|AMNOG|G-BA)\b/ },
  { id: "india", name: "India", match: /\bIndia\b/ },
  { id: "ireland", name: "Ireland", match: /\bIreland\b/ },
  { id: "japan", name: "Japan", match: /\bJapan\b/ },
  { id: "netherlands", name: "Netherlands", match: /\bNetherlands\b/ },
  { id: "new-zealand", name: "New Zealand", match: /\bNew Zealand\b/ },
  { id: "norway", name: "Norway", match: /\bNorway\b/ },
  { id: "portugal", name: "Portugal", match: /\bPortugal\b/ },
  { id: "south-korea", name: "South Korea", match: /\bSouth Korea\b/ },
  { id: "spain", name: "Spain", match: /\bSpain\b/ },
  { id: "sweden", name: "Sweden", match: /\bSweden\b/ },
  { id: "switzerland", name: "Switzerland", match: /\bSwitzerland\b/ },
  { id: "taiwan", name: "Taiwan", match: /\bTaiwan\b/ },
  { id: "thailand", name: "Thailand", match: /\bThailand\b/ },
  {
    id: "european-union",
    name: "European Union",
    match: /\b(EU|European Union)\b/,
  },
  {
    id: "united-kingdom",
    name: "United Kingdom",
    match: /\b(UK|United Kingdom|(?<!New )England|NHS|NICE)\b/,
  },
]

export const COUNTRY_BY_ID: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.id, c]),
)

/** The countries a place label names, e.g. "UK, Canada (pCPA), Australia (PBS)". */
export const countriesIn = (place: string): string[] =>
  COUNTRIES.filter((c) => c.match.test(place)).map((c) => c.id)
