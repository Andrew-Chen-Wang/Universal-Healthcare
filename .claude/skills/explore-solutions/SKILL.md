---
name: explore-solutions
description: Explore options and investigate solutions for a problem, a spending area, or the whole site. Use when asked to find new solution paths, check what options are missing, look for ways to cut costs or improve care, or investigate how other countries or industries solve something. Sweeps every lens (policy, delivery, operations, technology, workforce, demand), starts from where the money goes, verifies evidence, and drafts paths for the owner to review.
---

## Why this exists

The site's options were written problem by problem, asking "what can policy do
about this?" That finds payer, price, and regulation levers, and misses ways to
**produce the same care more cheaply**: high-volume labs and imaging, virtual-first
triage, task shifting, automation. Nothing started from where the money goes and
asked who does it cheaper. This skill makes that search systematic, so the gaps
come from a checklist instead of from whoever happens to bring an idea up.

## Inputs

- A target: a problem id (`content/problems.ts`), a spending line
  (`SERVICES_2024` in `content/baseline.ts`), a cost item, or "everything".
- Read first: the target problem and its current paths (`pathsFor(id)`),
  `content/current-law.ts`, `content/paths/scale.ts`, and the conventions in
  `AGENTS.md` (numbers go in `constants.ts`; never a literal in prose).

## Step 1: Where does the money go?

For a spending target, or for "everything", break spending into
**price × volume × input cost**:

1. Rank `SERVICES_2024` lines by size and list the sub-services within each
   line that cost the most (for example, inside hospital care: labs, imaging,
   emergency visits, routine follow-ups, inpatient days).
2. For each large sub-service, find the U.S. unit price and volume, and the
   same figures for the cheapest high-quality systems. Note which of the three
   factors explains most of the gap.
3. List the steps that are **high volume and standardized**: they are the
   candidates for scale, automation, a cheaper site of care, or a cheaper
   kind of worker.

## Step 2: Sweep every lens

Generate options for the target under **every** lens below, even ones that
seem unlikely. Write "none found" with the reason rather than skipping a lens.

| Lens | Questions |
|---|---|
| Financing | Who pays? Premiums, taxes, cost sharing, pooling. |
| Prices | Who sets prices, at what level, for which payers? |
| Rules & market structure | Regulation, antitrust, ownership, entry, transparency. |
| **Delivery & operations** | Site of care (home, pharmacy, clinic, hospital). Scale and industrialization: central labs, imaging reading centers, high-volume surgical centers (Narayana in India, Shouldice in Canada). Standardized pathways. |
| **Access channel** | Virtual-first triage, asynchronous e-visits, phone lines (UK 111, Denmark 1813), online hospitals (China), in person only by referral or by type of care. |
| Workforce | Task shifting (nurses, pharmacists, technicians, community health workers), scope of practice, training supply, team size. |
| Technology & automation | Lab automation, AI reads, self-testing, remote monitoring, claims automation. |
| Demand & behavior | Incentives for patients, defaults, prevention, low-value care. |
| Information | Data sharing, price and quality reporting, records. |
| Supply chain | Drugs, devices, purchasing at scale, domestic manufacturing. |

Then sweep **precedents** explicitly. For each option, check what these
systems do: Canada, UK, Germany, France, Netherlands, Switzerland, Denmark,
Sweden, Norway, Japan, South Korea, Taiwan, Singapore, Australia, China,
India, Israel, and the U.S. outliers (VA, Kaiser, Medicare, state programs).
Also check analogous industries (retail pharmacy, logistics, manufacturing)
for operations ideas.

## Step 3: Check the evidence

For every option worth keeping:

- Find primary sources: statute, agency data, peer-reviewed studies, official
  statistics. Use secondary sources only to find primary ones, and say when a
  figure couldn't be checked against its source.
- Record **evidence against** as carefully as evidence for. Example: in
  commercial claims, only 12% of direct-to-consumer telehealth visits replaced
  other visits and 88% were new, raising spending (Ashwood et al., Health
  Affairs 2017), so savings depend on making it the required first step.
- Separate what a precedent shows (correlation, a country's level) from what
  causes the effect.
- Note the failure modes in the places that use it: crowding, overuse,
  very short consultations, quality problems, the groups that lose.

## Step 4: Draft paths

For each option that survives Step 3, draft a `path({...})` in the matching
`content/paths/*.ts` file, following the existing paths:

- `problemId`, `title`, `summary`, `precedents` with `sourceIds`, a `how`
  entry for every linked problem (with `helps`/`hurts` groups), `mend`,
  `solves`, `worsens`, `spawns`, `requires`, `conflicts`, `complements`, and
  `changes` (the laws and programs it touches).
- A scale label in `content/paths/scale.ts` (none, minor, moderate, major).
- New figures go in `constants.ts` with a source in `sources.ts`.
- If the option belongs to no existing problem, add the problem to
  `problems.ts` with evidence, `hurts`, `profits`, a `debate` if contested, and
  a `currentLaw` trend in `current-law.ts`.
- Status stays `"open"`. Never mark a path chosen or fold it into Part 2: the
  owner decides.

## Step 5: Price it, if the evidence supports a number

If an option changes spending and a sourced figure supports it, add a line to
`content/reform-model.ts` (picks without a single payer) and, if it applies,
an input in `content/model.ts` (single payer). Show the arithmetic in the
line's explanation. If the evidence only supports a range, or says the effect
could go either way, price the central case and say so; don't invent a
saving.

## Step 6: Find what's still missing

Run an independent review before reporting. If the user allows subagents, give
one agent the target and the list of options without your reasoning, and ask
what's missing, what is wrong, and what fails in practice. Otherwise do the
pass yourself. Either way, rebuild the lens × option table and check that no
lens is empty without a reason.

## Step 7: Validate and report

```bash
cd apps/website && npx tsc --noEmit -p .
pnpm run lint && pnpm test
# Path and graph validation (warnings list broken links):
npx tsx -e 'import("./src/content/paths").then(m => console.log(m.PATH_ERRORS ?? m.default?.PATH_ERRORS))'
```

Report to the user:

1. Where the money goes for the target (Step 1), in a short table.
2. The lens × option table, marking new options and lenses with none.
3. Each new path in a sentence or two, with its strongest evidence for and
   against, and its scale.
4. What was priced, by how much, and what couldn't be.
5. Figures you couldn't check against a primary source.
