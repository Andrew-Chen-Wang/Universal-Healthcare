export const GLOSSARY: { term: string; definition: string }[] = [
  {
    term: "UHP",
    definition: "Universal Health Program: the single public payer this plan creates.",
  },
  {
    term: "UHA",
    definition: "Universal Health Administration: the agency inside HHS that runs UHP.",
  },
  {
    term: "NHE",
    definition:
      "National Health Expenditures: CMS's official measure of all U.S. health spending ($5,278.6B in 2024).",
  },
  {
    term: "Single payer",
    definition:
      "One public insurer pays for all covered care. Delivery (hospitals, doctors) can still be private.",
  },
  {
    term: "Multi-payer",
    definition:
      "Several insurers (public, nonprofit, or private) pay for care, usually under tight regulation in universal systems.",
  },
  {
    term: "Duplicative insurance",
    definition:
      "Private insurance that covers the same services as the public plan, typically bought for faster or more private care.",
  },
  {
    term: "Supplementary insurance",
    definition: "Private insurance for services the public plan doesn't cover.",
  },
  {
    term: "Global budget",
    definition:
      "A fixed annual payment to a hospital or system for all its services, instead of payment per claim.",
  },
  {
    term: "Fee schedule",
    definition:
      "A list of prices for each service code. Medicare's physician fee schedule uses RBRVS.",
  },
  {
    term: "RBRVS",
    definition:
      "Resource-Based Relative Value Scale: Medicare's method for setting relative prices across physician services.",
  },
  {
    term: "DRG",
    definition:
      "Diagnosis-Related Group: a per-case hospital payment based on the patient's diagnosis.",
  },
  {
    term: "Balance billing",
    definition:
      "A provider billing the patient for the difference between its charge and what the insurer paid. Banned under UHP.",
  },
  {
    term: "Opt-out",
    definition:
      "A provider choosing not to participate in UHP; under the plan, they may not bill UHP for anyone for two years.",
  },
  {
    term: "Medicare Advantage (MA)",
    definition:
      "Private plans paid by Medicare to cover beneficiaries (Part C). About 54% of Medicare enrollees in 2024. Ends under the plan.",
  },
  {
    term: "Medigap",
    definition:
      "Private supplemental insurance that pays traditional Medicare's cost sharing. Ends under the plan.",
  },
  {
    term: "Dual eligibles",
    definition: "People enrolled in both Medicare and Medicaid (about 12 million).",
  },
  {
    term: "HCBS",
    definition:
      "Home- and community-based services: long-term care at home (aides, adult day care) instead of in an institution.",
  },
  {
    term: "LTSS",
    definition:
      "Long-term services and supports: help with daily activities for people with disabilities or chronic illness.",
  },
  {
    term: "MOE",
    definition:
      "Maintenance of effort: states keep paying what they paid for Medicaid, now to UHP.",
  },
  {
    term: "ESI",
    definition:
      "Employer-sponsored insurance: health coverage through a job (about 179 million people in 2024).",
  },
  {
    term: "Tax exclusion",
    definition: `Employer health premiums aren't counted as taxable income, a federal subsidy of roughly ${show("esiTaxExclusion")} a year.`,
  },
  {
    term: "Price effect",
    definition:
      "In this site's ledger: the change in spending from paying different prices for the same amount of care.",
  },
  {
    term: "Utilization effect",
    definition:
      "In this site's ledger: the change in spending from people using more care once it is free and universal.",
  },
  {
    term: "Induced demand",
    definition: "Additional care used when out-of-pocket costs fall to zero.",
  },
  {
    term: "Wage pass-through",
    definition: "Employer health costs ultimately coming out of (or going into) workers' wages.",
  },
  {
    term: "§1498",
    definition:
      "28 U.S.C. §1498: lets the federal government use a patented invention (e.g., make a generic drug) while paying the patent holder reasonable compensation.",
  },
  {
    term: "HTA",
    definition:
      "Health technology assessment: evaluating whether a treatment works and is worth its price (e.g., UK NICE).",
  },
  {
    term: "QALY",
    definition:
      "Quality-adjusted life year: a measure combining length and quality of life, used in cost-effectiveness analysis.",
  },
  {
    term: "PBM",
    definition:
      "Pharmacy benefit manager: an intermediary that runs drug benefits for insurers and negotiates rebates.",
  },
  {
    term: "MAC",
    definition:
      "Medicare Administrative Contractor: a private company that processes Medicare claims for a region.",
  },
  {
    term: "Integrated care organization (ICO)",
    definition:
      "Under this plan: a provider-run system (like Kaiser) paid a single per-person budget for patients who choose it.",
  },
  {
    term: "Wait-time guarantee",
    definition:
      "Maximum legal waits; if missed, the patient may go to any provider at UHP's expense.",
  },
]
import { show } from "./constants"
