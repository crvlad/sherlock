# AGENTS.md

Purpose: fast onboarding for coding agents in this repository.

## Project Snapshot

- Stack: Vue 3 + Vite
- App type: single-page detective game with case-based data files
- Main state is centralized in [src/App.vue](src/App.vue)
- Source of truth for case registry: [src/data/cases/index.js](src/data/cases/index.js)

## Run Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`
- Tests: no test script in [package.json](package.json); validate with build + manual flow checks

## Key Architecture

- Root orchestration and game state: [src/App.vue](src/App.vue)
- Case registry and lookup: [src/data/cases/index.js](src/data/cases/index.js)
- Case examples: [src/data/cases/foggyHarborCase.js](src/data/cases/foggyHarborCase.js), [src/data/cases/emeraldConspiracyCase.js](src/data/cases/emeraldConspiracyCase.js), [src/data/cases/professorShadowCase.js](src/data/cases/professorShadowCase.js), [src/data/cases/watsonsClientCase.js](src/data/cases/watsonsClientCase.js)
- Shared scoring helpers: [src/data/score.js](src/data/score.js)

UI components:
- Map: [src/components/GameMap.vue](src/components/GameMap.vue)
- Notebook: [src/components/CaseNotebook.vue](src/components/CaseNotebook.vue)
- Newspapers: [src/components/NewspaperView.vue](src/components/NewspaperView.vue)
- Directory: [src/components/DirectoryBook.vue](src/components/DirectoryBook.vue)
- Lead modal: [src/components/LeadModal.vue](src/components/LeadModal.vue)
- Accusation flow: [src/components/AccusationScreen.vue](src/components/AccusationScreen.vue)

## Data Contracts (Important)

Each case file should export an object with:
- `id`
- `scenario` (must include `id`, `title`, `subtitle`, `introduction`, `solution`, `sherlockLeadCount`)
- `scenario.solution` must be an object with `killer`, `motive`, `method`, `explanation` (not a plain string)
- `locations[]` (`id`, `name`, `district`, `x`, `y`, `description`)
- `leads[]` (`id`, `locationId`, `title`, `prerequisites[]`, `text`, `icon`)
- `newspapers[]`
- `directory` (`persons[]`, `places[]`)
- `evaluateAccusation(answers, leadsVisited)` returning at least:
	- `isCorrect` (boolean)
	- `score` (number, 0..100)
	- `killerMatch`, `motiveMatch`, `methodMatch` (booleans)

Scoring convention used across all current cases:
- Base model: `killer=80%`, `motive=10%`, `method=10%`
- Killer score is scaled by clue efficiency vs Sherlock count
- Use [src/data/score.js](src/data/score.js) helper `calculateWeightedScore(...)`

## Conventions

- Use Vue 3 `<script setup>` and Composition API (`ref`, `computed`)
- Keep components presentational; mutate game state in [src/App.vue](src/App.vue)
- Pass case data via props; avoid hardcoded imports of a specific case in UI components
- Preserve existing visual style (vintage palette, serif typography)

## Common Pitfalls

- `visitedLeads` and `visitedLocations` are `Set`s. Do not mutate in place inside child components; update state in parent and pass new values.
- In accusations, `leadsVisited` may be passed as a number (`.size`) rather than a `Set`; keep scoring helpers tolerant of both.
- Leads must reference valid `locationId`s.
- Broken prerequisite chains silently hide leads; verify dependencies when editing case files.
- Broken lead prerequisite IDs also hide leads silently; verify every value in `prerequisites[]` exists as a real lead ID.
- Runtime render errors in any tab component can hide other UI sections; check browser console if map/content disappears.

## Safe Change Workflow

1. Edit minimal files required.
2. Run `npm run build` after changes.
3. If UI behavior changed, verify intro -> game -> accuse flow manually.

## Related Docs

- Overview and setup: [README.md](README.md)
