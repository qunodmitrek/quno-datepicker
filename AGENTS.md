# Quno Datepicker Agent Instructions

These instructions apply to the entire repository.

## Start Here

Before changing code or behavior, read:

1. `README.md` for the current product surface and commands.
2. `DECISIONS.md` for accepted architecture and interaction decisions.
3. `CHANGELOG.md` for recent implementation history.

Treat these Markdown files as part of the implementation. Keep them accurate in the same change as the code they describe.

## Documentation Records

- Update `CHANGELOG.md` for every user-visible behavior, public API, test strategy, dependency, build, or developer-workflow change.
- Keep the `Unreleased` section at the top and group entries under `Added`, `Changed`, `Fixed`, `Removed`, or `Documentation`.
- Record important or non-obvious product and engineering decisions in `DECISIONS.md`.
- A decision entry must include its date, status, context, decision, and consequences.
- Do not silently rewrite an accepted decision. Add a new entry that supersedes it and link the two entries.
- Keep `README.md` focused on the current state. Historical detail belongs in `CHANGELOG.md`; decision rationale belongs in `DECISIONS.md`.

## Product Contracts

- Render one calendar month only; do not introduce side-by-side calendars.
- Keep a six-week, 42-cell grid with weekday-aligned leading dates and no forced previous-month row. Derive the natural aligned month rows and append a trailing week only when their last cell is month-end, while retaining six weeks as the minimum and maximum rendered view. While an active drag pointer is inside the weekday strip, replace labels for every hidden previous-week date overlapped by the transient selected range and reveal the current pointer target immediately. Revealed targets must reuse normal day-cell styling and state hooks. Weekday labels and revealed dates must fill one explicit fixed-height grid track, and leaving it for another cell must immediately restore all weekday labels without ending the drag.
- Represent selection as `null` or an inclusive `{ start, end }` range. A single day is `start === end`.
- Keep calendar dates timezone-free as `YYYY-MM-DD` values. Date arithmetic must not shift dates through local time zones or DST.
- Keep the visible month independent from the selected range. Navigation and Clear must not alter each other unexpectedly.
- Passive hover must not calculate or highlight a possible period and must never select, commit, invoke `onChange`, or navigate. An active drag may update its transient range until release. A first no-movement click commits Start before the range, End after it, or the nearest endpoint inside it. Repeated clicks on that same date advance through the opposite endpoint and then a one-day selection, all derived from the pre-click range. Discard that original context at single day; never wrap back to the first guess. Skip actions whose normalized range equals the displayed cycle value, and emit nothing if all remaining roles are equivalent. Do not render a date-action menu.
- Endpoint crossing swaps endpoint identity so the dragged handle remains attached to the pointer.
- Do not render a default underline or visible handle decoration on selected endpoints. Preserve the `handle` slot so consumers may opt into their own presentation.
- Whole-range dragging preserves duration and snaps to calendar days.
- Pointer-down outside an existing range is pending until intent is known: movement paints a fresh range from that outside origin, while release without movement retains contextual nearest-endpoint click behavior.
- Adjacent-month changes, including Start/End endpoint-pill jumps, must animate both the month name and day numbers vertically in the navigation direction without moving the grid frame or range geometry, and must respect `prefers-reduced-motion`.
- Newly visible Start/End endpoint pills must remain full-size and slide from behind the calendar; never reveal them by resizing or clipping their box. The calendar moves down to uncover the first pill before it and up to uncover the first pill after it only when no endpoint pill is already stable. Once any pill is visible, the calendar must not translate to reveal another. Track lifecycle per endpoint: retain the existing DOM order and position and animate only the new item. Model entry separately from stable visibility so another pill's exit cannot retrigger reveal motion. When no longer needed, retain the full-size pill in an explicit exiting state until it has slid back under the calendar. Keep this scoped, configurable, and disabled under `prefers-reduced-motion`.
- Releasing on a leading or trailing day from an adjacent month switches the visible calendar to that day's month after committing the interaction.
- Keep committed selection separate from the transient active-drag range.
- Preserve controlled and uncontrolled component usage.
- Keep user-facing copy, date formatting, week starts, and visual styling configurable by consumers.
- Keep day-cell customization presentational: external callbacks may add classes, inline styles, and titles from typed date/selection context, but must not replace core event handlers or state attributes.

## Architecture And Code Style

- Keep every hand-written code file at or below 200 non-comment lines. Split by responsibility before a file crosses the limit.
- The limit applies to source, styles, tests, scripts, and configuration code. Generated output, lockfiles, and vendored dependencies are exempt.
- Run `npm run check:file-size` after adding or moving code; the production build enforces the same limit.
- Use strict TypeScript and Preact conventions already configured in the project.
- Treat `src/index.ts` as the only public JavaScript and TypeScript API. Export consumer-facing values and types there.
- Keep Preact externalized as a peer dependency so the package never bundles a second framework runtime.
- Keep the default stylesheet optional and separately exported as `@quno/datepicker/styles.css`.
- Do not place theme defaults on `:root` or another global selector. Use component-scoped CSS custom properties with fallback values.
- Preserve stable `data-slot` attributes and public `classNames` slots when refactoring markup; they are consumer styling contracts.
- Keep date arithmetic and selection rules in pure functions under `dateRangeModel.ts` when possible.
- Model mutually exclusive interaction modes with discriminated unions. Do not replace them with combinations of scattered booleans.
- Keep component CSS scoped with the `quno-date-picker` prefix and reuse existing custom properties before adding new hardcoded values.
- Prefer small, named helpers for interaction rules and boundary behavior.
- Do not edit generated `dist/` assets or commit `node_modules/`.

## Testing And Verification

- Add or adjust model tests for date arithmetic and selection rules.
- Add or adjust component tests for observable interaction behavior.
- Month-boundary changes must cover delayed navigation and continued dragging.
- Endpoint changes must cover crossing and the explicit Start date and End date actions.
- Range movement must verify duration preservation.
- Run all of the following before handing off implementation work:

```sh
npm test
npm run lint
npm run check:file-size
npm run typecheck
npm run build
npm pack --dry-run
```

- If a command cannot run, document the exact blocker in the final response and in `CHANGELOG.md` when it affects the repository state.

## V1 Scope Boundary

Natural-language parsing, presets, disabled-date rules, advanced long-press touch behavior, pill editing/dragging, and complete arrow-key grid navigation are deferred unless a task explicitly brings them into scope. When adding one of these capabilities, document its behavior in `README.md`, its rationale in `DECISIONS.md`, and its release entry in `CHANGELOG.md`.
