# Changelog

All notable changes to Quno Datepicker are recorded here. Entries are maintained newest first under `Unreleased` until a release is cut.

## Unreleased

### Added

- Added a copyable consumer implementation guide covering installation, state ownership, timezone-free values, visible-month control, localization, styling, day customization, forms, and integration verification.
- Added a responsive interactive `/story` field guide with controlled, cross-month, localized, and externally styled live examples built through the public package entrypoint.
- Added story smoke coverage for the public integration chapters, ten live calendars, and interactive theme switching.
- Expanded the implementation story with the product rationale, conventional-picker comparison, gesture catalogue, styling layers, internal state model, and measured production footprint.
- Rebuilt the main story as ten focused live exhibits for painting and endpoint drag, stable six-week navigation, weekday-strip hidden dates, whole-segment movement, contextual click construction, inline guess correction, Start/End shortcuts, reduced-motion-aware micro-animation, typed day handling, and token theming.
- Added `npm run report:size` to report raw and gzip sizes for the production JavaScript and optional stylesheet.

- Added a 1px, fill-free next-cycle outline that appears only while hovering the date that established the active repeated-click cycle.
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
- Added directional vertical number motion for adjacent-month changes, including drag-edge navigation and outside-month release, with configurable duration/distance and reduced-motion support.
- Extended directional number motion to off-screen Start and End endpoint-pill jumps in both directions.
- Added a reduced-motion-aware endpoint-pill reveal: full-size Start and End controls slide from behind the calendar while it moves down or up respectively. Reveal duration and distance are component-scoped tokens.
- Added matching previous/next vertical motion to the month name whenever the calendar changes month.
- Added an explicit endpoint-pill exit phase so obsolete Start/End controls slide back beneath the calendar before unmounting.
- Added fresh-range painting when a drag begins outside the current selection, in either direction, while retaining the existing no-movement click interpretation.
- Added the typed `getDayCellProps` API for external per-date classes, inline styles, and titles, with today, weekend, visible-month, committed-selection, drag-selection, and endpoint context.

### Changed

- Replaced the prototype start page's dense interaction paragraphs with a scannable five-action legend highlighting Click, Click again, endpoint drag, period drag, and outside painting.
- Rewrote the story's day-handler exhibit around concrete Today, weekend, non-working-day, holiday, and availability styling examples while clarifying that the library retains interaction and accessibility behavior.
- Reframed the story's interaction architecture card around the visible paint, resize, and move gestures, including their conflict-free pointer ownership and clean release behavior.
- Weekday-strip drag projection now replaces every weekday label overlapped by the transient selected range, so an End endpoint moving into the hidden previous week keeps the selected portion visible in the correct direction.
- Moved the demo's repeated-click guidance into its left column, removed the selected-range JSON display, suppressed the duplicate calendar hint, and added external Today/weekend cell styling as a consumer example.
- Empty `labels.hint` values now omit the optional hint element instead of leaving an empty paragraph in the component layout.
- Whole-range, one-day, and start/end endpoint drags now use a grabbing cursor and remove the ordinary hovered-day outline for the duration of the pointer action.
- Standardized the calendar body at six weeks. A trailing week is added only when the natural weekday-aligned month grid ends exactly on month-end, eliminating seven-week views while preserving next-month context for exact row endings.
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

- Month-chevron navigation now keeps the calendar anchored when a previously visible selection becomes off-screen; newly required Start and End controls slide from beneath the calendar without also translating it.
- Month headings now occupy one fixed, non-wrapping line and truncate unusually long custom labels, preventing month navigation from changing the calendar height in the demo, story, or consuming layouts.
- Scoped story heading typography away from nested datepicker month headings, preserving the six-week example's height across differently sized month names.
- Cycle preview borders now match the selected-date geometry: 34px high with endpoint caps aligned to the date circles, while wrapped row continuations reach the calendar edge without extra inset.
- Wrapped cycle previews no longer draw oversized rounded caps on the Sunday/Monday break; only the preview's actual start and end dates receive endpoint borders.
- Empty endpoint handle slots no longer participate in day-cell layout, keeping selected date fills and cycle-preview outlines vertically aligned.
- Cycle preview outlines split cleanly at calendar row boundaries and suppress the clicked cell's ordinary hover ring, keeping the candidate segment legible without changing committed styling.
- Previous/next month chevrons now use symmetric SVG geometry centered inside the existing circular buttons, avoiding the optical offset from font glyph side-bearings and baselines.
- Returning a drag from the weekday strip to any normal calendar area now removes all projected dates even when the transient range still overlaps that hidden week.
- Start and End pills now retain their intrinsic height while their exit track closes, so disappearance reads as a full-size button sliding beneath the calendar instead of a vertically shrinking control.
- Calendar translation is now ineligible whenever any Start/End pill is already stably visible, ensuring subsequent endpoint controls reveal through their own slide only.
- Adding an off-screen Start beside an existing End pill, or End beside Start, now animates only the new control; the existing pill and calendar remain stationary.
- Clicking Start or End across a range spanning distant months no longer retriggers the opposite, already-visible pill's calendar reveal after the clicked pill exits, eliminating the double vertical jitter.
- Endpoint-pill reveals no longer collapse or clip the control, so its rendered width and height remain constant throughout the slide.
- Endpoint pills no longer disappear immediately when their endpoint enters the visible month; they become disabled and hidden from accessibility while completing their under-calendar exit.
- Weekday labels and progressively revealed numbers now fill one explicit fixed-height grid track, preventing either cell type or consumer day styling from changing the row height during replacement.
- Repeated date clicks now skip Start, End, or one-day cycle actions that normalize to the selection already displayed, avoiding no-op clicks and redundant `onChange` calls.
- Progressive previous-week numbers now clear immediately when the pointer leaves the weekday strip for another calendar area, while the active drag continues normally.
- The weekday header row now keeps the same day-cell height while progressive overflow dates replace weekday labels during a drag.
- Hover now renders additions, removals, and the prospective endpoint as a translucent overlay while leaving the committed range, endpoint markers, summary, and value unchanged until click.
- Releasing a click or drag on an adjacent-month day now advances the interaction and switches the visible calendar to that day's month; subsequent clicks on that date continue its role cycle in the new month.
- Calendar views no longer force an extra previous-month week; they show only the leading dates required for weekday alignment and keep a stable six-week body.
- Month-edge hover zones no longer auto-navigate from passive pointer movement after a date click; delayed navigation remains limited to active drags.
- Moved drags now recompute their final snapped range from the actual release date instead of relying on the last pointer-enter event.

### Documentation

- Added `AGENTS.md` as the repository-wide source of implementation, documentation, scope, and verification instructions.
- Added `DECISIONS.md` to retain product and architecture rationale.
- Added this changelog and linked all project records from `README.md`.

### Verification

- `npm test`: 55 tests passed.
- `npm run lint`: passed.
- `npm run check:file-size`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with Vite 6.4.3.
- `npm pack --dry-run`: passed with only allowlisted runtime, style, declaration, and documentation files and no bundled dependencies.
- Built ESM import smoke test: passed for the component and public date-model helpers.
