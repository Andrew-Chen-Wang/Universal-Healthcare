# Universal-Healthcare

A website detailing concrete plans for US Universal Healthcare including trade offs, different
implementation paths, and forums for discussion.

The site lays out one concrete, fully costed plan for universal health care in the
United States. It documents every implementation step and every trade-off, and accounts
for every dollar of the change.

## How the site is organized

The sidebar is the plan itself: six phases and every implementation step, in order. Each
step has its own pages:

- **Overview**: what the step does, its legal vehicle, owner, timeline, dependencies.
- **Tasks**: every concrete action, who does it, and when.
- **Design choice & alternatives**: the decision behind the step, each alternative's pros
  and cons, and what the choice gives up.
- **Costs & calculations**: every cost item the step drives, each on its own page with
  step-by-step arithmetic, the inputs used, per-resident and per-household amounts, a
  scenario range, and a year-by-year schedule where relevant.
- **Trade-offs**: pros and cons, who gains and who loses, magnitude, evidence, and the
  trade-off behind each cost item and each system change.
- **Risks**: likelihood, impact, early warnings, mitigations.
- **What changes in the system**: each existing law, program, institution, or practice
  the step changes.
- **Other countries**: how other countries implemented the same piece, and the lesson.

The overview page shows the totals (what the country buys, who pays, transition costs),
with every row linking to its calculation. The footer links to every input number, the
method, sources, and the glossary.

## Ground rules the plan follows

1. Universal means every resident.
2. Job losses and private companies shutting down are acceptable. They are counted and
   cushioned, but they don't veto the design.
3. Cost increases are acceptable if they are visible: every shift in who pays is shown.
4. Every trade-off is listed, including those that argue against the plan.

## How the numbers work

All content lives in `apps/website/src/content/` as typed TypeScript data. Nothing is stored
in a database.

- `constants.ts`: every raw input number (premiums, wages, unit costs, counts, rates),
  defined once with unit, kind (data / policy / estimate), confidence, and source.
- `baseline.ts`: CMS NHE 2024 figures, transcribed exactly.
- `model.ts`: the ledger arithmetic, in central, costly, and lean scenarios.
- `calculations.ts`: every cost item and the arithmetic steps behind it.
- `transition.ts`, `workforce.ts`, `households.ts`, `fiscal.ts`, `sensitivity.ts`: derived
  analyses.
- `plan/`, `decisions.ts`, `tradeoffs.ts`, `risks.ts`, `changes.ts`, `step-extras.ts`:
  the written plan, linked to steps.

## Development

```shell
pnpm install
pnpm run dev      # http://localhost:3000
pnpm run build    # every page is statically generated
pnpm run format
pnpm run lint
```

The repo is based on [template-nextjs](https://github.com/Andrew-Chen-Wang/template-nextjs).
The template's database, internal API, and auth packages (`packages/db`, `apps/internal-api`,
`apps/dbmigrator`, `lib/`) remain in the monorepo but are not used by or linked into the
website, and are not deployed. The easiest deployment for the website is Vercel.
