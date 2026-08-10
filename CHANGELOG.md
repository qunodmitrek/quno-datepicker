# Changelog

All notable changes to Quno Datepicker are recorded here. Entries are maintained newest first under `Unreleased` until a release is cut.

## Unreleased

### Added

- Added the standalone Preact and Vite project with a Quno-styled interactive demo.
- Added a single-calendar date-range picker supporting empty, one-day, and multi-day inclusive selections.
- Added a contextual date action popover that exposes only alternatives to the endpoint action already applied by the click.
- Added hover previews that remain separate from committed selection.
- Added draggable start and end endpoints with automatic endpoint swapping when crossing.
- Added whole-range dragging with duration preservation and calendar-day snapping.
- Added delayed, repeating month-edge navigation that keeps the active drag intact.
- Added progressive previous-week reveal in the weekday-name strip during active drags: only the hovered date through the end of the hidden week appears, using normal outside-month day styling and behavior.
- Added off-screen endpoint pills before or after the visible month with click-to-jump behavior.
- Added Clear behavior that returns the value to `null` without resetting the visible month.
- Added controlled and uncontrolled component APIs.
- Added consumer-controlled labels, date formatters, week starts, and per-slot class names.
- Added stable `data-slot` and state attributes for styling without depending on internal DOM selectors.
- Added a typed ESM package entry, generated declaration files, and a separately exported optional stylesheet.
- Added a build-enforced check that limits every hand-written code file to 200 non-comment lines.
- Added pure date-range model tests and DOM interaction tests covering selection, endpoint crossing, explicit date actions, range movement, month boundaries, off-screen pills, hover preview, and Clear.
- Added regression coverage proving passive adjacent-month hover and active drag movement remain non-committing until pointer release.

### Changed

- Converted the production build from a demo application bundle to a reusable library bundle while retaining the Vite demo for local development.
- Moved Preact to a peer dependency and externalized it from the production bundle.
- Replaced global `:root` theme declarations with component-scoped CSS variable fallbacks so importing the stylesheet does not alter the host project.
- Generalized calendar grids beyond Monday-first layouts through `weekStartsOn`.
- Split the datepicker controller, interaction model, UI sections, styles, and tests into focused modules under the file-size limit.
- Changed existing-selection clicks to apply a contextual default first, then advance repeated clicks on the same date through the opposite endpoint and a one-day selection. Reaching single day now discards the original range instead of wrapping back to the default.
- Changed `dateActionContext` so the opposite endpoint is available for before-range and after-range dates as part of the three-state click cycle.

### Removed

- Removed the rendered date-action popover and its bundled CSS; date roles are now selected through repeated clicks without opening a menu.
- Removed prospective-period hover calculation, highlighting, preview state attributes, and preview CSS tokens. Passive hover now leaves the committed calendar visuals unchanged.
- Removed the default underline-style endpoint handles from selected days while retaining the public `handle` slot for optional consumer styling.

### Fixed

- Weekday labels and progressively revealed numbers now fill one explicit fixed-height grid track, preventing either cell type or consumer day styling from changing the row height during replacement.
- Repeated date clicks now skip Start, End, or one-day cycle actions that normalize to the selection already displayed, avoiding no-op clicks and redundant `onChange` calls.
- Progressive previous-week numbers now clear immediately when the pointer leaves the weekday strip for another calendar area, while the active drag continues normally.
- The weekday header row now keeps the same day-cell height while progressive overflow dates replace weekday labels during a drag.
- Hover now renders additions, removals, and the prospective endpoint as a translucent overlay while leaving the committed range, endpoint markers, summary, and value unchanged until click.
- Releasing a click or drag on an adjacent-month day now advances the interaction and switches the visible calendar to that day's month; subsequent clicks on that date continue its role cycle in the new month.
- Calendar views no longer force an extra previous-month week; they show only the leading dates required for weekday alignment while retaining at least seven next-month dates.
- Month-edge hover zones no longer auto-navigate from passive pointer movement after a date click; delayed navigation remains limited to active drags.
- Moved drags now recompute their final snapped range from the actual release date instead of relying on the last pointer-enter event.

### Documentation

- Added `AGENTS.md` as the repository-wide source of implementation, documentation, scope, and verification instructions.
- Added `DECISIONS.md` to retain product and architecture rationale.
- Added this changelog and linked all project records from `README.md`.

### Verification

- `npm test`: 34 tests passed.
- `npm run lint`: passed.
- `npm run check:file-size`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with Vite 6.4.3.
- `npm pack --dry-run`: passed with only allowlisted runtime, style, declaration, and documentation files and no bundled dependencies.
- Built ESM import smoke test: passed for the component and public date-model helpers.
