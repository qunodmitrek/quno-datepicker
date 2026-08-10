# Product And Architecture Decisions

This file records decisions that should remain stable across implementation sessions. New decisions are appended with a stable identifier. Accepted decisions are superseded by a new entry rather than rewritten silently.

## QDP-001 — Use timezone-free ISO calendar dates

- Date: 2026-08-10
- Status: Accepted
- Context: A calendar date must not move to the previous or next day because of a browser timezone or daylight-saving transition.
- Decision: Public date values use `YYYY-MM-DD`. Calendar arithmetic converts through UTC fields only.
- Consequences: The component does not represent a time or timezone. Consumers must add those concepts outside the datepicker if needed.

## QDP-002 — Keep selection and visible month independent

- Date: 2026-08-10
- Status: Accepted
- Context: The component must show one calendar while allowing ranges whose endpoints are in other months.
- Decision: Selection and visible-month state are separate. Navigating does not edit selection, and clearing selection does not reset the visible month.
- Consequences: Off-screen endpoints need their own representation, and tests must distinguish navigation changes from value changes.

## QDP-003 — Represent a single day as a one-day range

- Date: 2026-08-10
- Status: Accepted
- Context: Separate single-date and range modes would duplicate selection, rendering, dragging, and API behavior.
- Decision: The value is `null` or an inclusive `{ start, end }` range. A single day is represented by `start === end`.
- Consequences: Consumers receive one consistent value shape, and the second click edits the existing one-day range rather than entering a separate range mode.

## QDP-004 — Model interaction modes explicitly

- Date: 2026-08-10
- Status: Accepted
- Context: Hovering, creating, resizing, moving, and cross-month navigation are mutually constrained states. Independent booleans can produce impossible combinations.
- Decision: Use a discriminated `DatePickerInteraction` union for idle, create, endpoint-drag, and range-drag states. Keep transient preview values separate from committed selection.
- Consequences: New interaction modes must be added deliberately to the union and covered exhaustively instead of introducing unrelated state flags.

## QDP-005 — Edit the nearest endpoint by default

- Date: 2026-08-10
- Status: Accepted
- Context: A selected range should remain editable without requiring a persistent start/end mode.
- Decision: A click edits the nearest endpoint. Clicking a visible endpoint explicitly activates it for the next edit. Hover previews the resulting range before commitment.
- Consequences: Tie behavior resolves to the end endpoint, while clicks before or after a one-day range naturally extend the corresponding side.

## QDP-006 — Preserve direct manipulation through endpoint crossing

- Date: 2026-08-10
- Status: Accepted
- Context: A resize handle feels stuck or detached if it stops following the pointer after crossing the stationary endpoint.
- Decision: Crossing normalizes the range and swaps the dragged endpoint identity. Whole-range movement derives an integer day delta from calendar cells and preserves duration.
- Consequences: Endpoint drags keep one stationary anchor date. Pointer pixels are never used to calculate date deltas.

## QDP-007 — Use delayed edge navigation during drag

- Date: 2026-08-10
- Status: Accepted
- Context: Immediate month switching near an edge makes ordinary endpoint manipulation unstable, but users still need continuous cross-month dragging in one calendar.
- Decision: Entering a month-edge zone during drag waits 400 ms before navigating, then repeats every 650 ms while the pointer remains there. The drag interaction remains active.
- Consequences: Leaving the edge, finishing the drag, clearing, or unmounting must cancel the timer.

## QDP-008 — Defer complex input and constraint semantics beyond V1

- Date: 2026-08-10
- Status: Accepted
- Context: Natural-language parsing, disabled dates, presets, advanced touch gestures, and complete keyboard-grid behavior each introduce substantial interaction and validation rules.
- Decision: V1 establishes the date model and direct-manipulation foundation first. Those capabilities remain out of scope until explicitly specified.
- Consequences: Native button focus and activation are available now, but parsing, long-press touch, pill editing/dragging, disabled-date semantics, and full arrow-key navigation require later decisions and tests.

## QDP-009 — Ship a portable library surface with optional styling

- Date: 2026-08-10
- Status: Accepted
- Context: The datepicker must be reusable across products with different design systems, copy, locales, and bundlers rather than remain coupled to its prototype page.
- Decision: Build a typed ESM library from `src/index.ts`, externalize Preact as a peer dependency, and export default CSS separately. Expose CSS custom properties, stable `data-slot` attributes, per-slot class names, labels, formatters, and week-start configuration as consumer contracts. Keep defaults local to the component rather than modifying `:root`.
- Consequences: Consumers may use the provided theme, override tokens or slots, or omit the stylesheet and build an entirely custom presentation. Internal markup refactors must preserve documented slots or be treated as breaking changes. The UI component requires Preact; framework-specific adapters can be added later without changing the date model.

## QDP-010 — Limit hand-written code files to 200 lines

- Date: 2026-08-10
- Status: Accepted
- Context: Large component, style, and test files make interaction behavior harder to navigate, review, test, and reuse safely.
- Decision: Every hand-written source, style, test, script, and configuration file must contain no more than 200 non-comment lines. A repository script checks the limit and the production build runs it before compilation. Generated output, lockfiles, and vendored dependencies are exempt.
- Consequences: Responsibilities must be extracted before a file crosses the limit. File splitting should follow domain boundaries rather than create arbitrary numbered fragments, and public exports must remain stable when implementation modules move.

## QDP-011 — Render hover as a non-committing change layer

- Date: 2026-08-10
- Status: Accepted
- Context: Replacing the fully styled range and endpoint during hover makes a transient candidate look committed and can imply that the value has already changed.
- Decision: Keep the committed selection, endpoint markers, summary, and public value visually and structurally unchanged during hover. Render only the difference as a translucent layer: additions are lightly highlighted, removals are faded, and the prospective moved endpoint is shown with a translucent dashed marker. Direct dragging continues to show the full moving range because it is an active manipulation rather than passive hover.
- Consequences: Calendar cells expose separate hover state through `data-preview-action` and `data-preview-endpoint`. Rendering code must not reuse the committed start/end flags for a hover candidate, and tests must verify that hover never calls `onChange` or moves committed endpoint attributes.

## QDP-012 — Navigate to an adjacent month on release

- Date: 2026-08-10
- Status: Accepted
- Context: The six-week grid displays leading and trailing days from adjacent months. Releasing on one of those days while keeping the old month visible separates the committed date from the calendar context the user just selected.
- Decision: After a click or drag releases on a day outside the visible month, commit the selection interaction first and then switch the single calendar to the released day's month. Notify `onVisibleMonthChange` with that month's first day.
- Consequences: Adjacent-month cells act as both valid selection targets and navigation targets. Hovering them does not navigate, and changing month does not otherwise alter the committed selection.

## QDP-013 — Always show adjacent-month context

- Date: 2026-08-10
- Status: Accepted
- Context: A conventional fixed grid can show fewer than seven dates from one or both adjacent months, limiting context and the available cross-month release targets.
- Decision: Build each view from complete weekday-aligned rows and include one additional row before and after the conventional month grid. This guarantees at least seven dates from both the previous and next month while retaining the configured `weekStartsOn` alignment.
- Consequences: Calendar views have a variable height of six to eight weeks depending on the month. Consumers must not assume a fixed 42-cell grid, and model/component tests must verify adjacent-month coverage rather than a fixed row count.

## QDP-014 — Ask how a clicked date should change an existing selection

- Date: 2026-08-10
- Status: Accepted; supersedes the click-commit behavior in QDP-005 and the existing-selection click path in QDP-012
- Context: Nearest-endpoint click editing is fast but can be ambiguous: the same day may reasonably become the start, the end, or a new one-day selection. A click should not commit an interpretation the user did not choose.
- Decision: With an existing selection, a no-movement day click opens three explicit actions: Start date, End date, and This date. The committed selection remains unchanged until an action is chosen. Passive hover continues to preview the nearest-endpoint result from QDP-005, while endpoint and whole-range drags remain direct manipulations that commit on release.
- Consequences: The action chooser is a distinct interaction state and a public styling/localization surface. Selecting Start date or End date normalizes crossings; This date produces `start === end`. Clicking an adjacent-month cell navigates to that month while retaining the pending action choice.

## QDP-015 — Use the native HTML popover for date actions

- Date: 2026-08-10
- Status: Accepted; refines the chooser presentation in QDP-014
- Context: The date action chooser should float beside the selected day without affecting calendar height or being clipped by the calendar shell. It also needs predictable Escape and outside-click dismissal.
- Decision: Render the chooser as `popover="auto"`, open and close it through the HTML Popover API, and position it beside the active day using its viewport bounds. Treat a native close event as cancellation of the pending action, without changing the committed selection.
- Consequences: The chooser participates in the browser top layer and receives native light-dismiss behavior. Its stable slots, labels, and class-name hooks remain unchanged. Small positioning and dismissal helpers keep it within the viewport and preserve outside-pointer/Escape behavior where automated or older browser environments do not dispatch the native close path; browsers without the imperative API retain the declarative element as a styled fallback.

## QDP-016 — Apply the contextual endpoint before showing alternatives

- Date: 2026-08-10
- Status: Accepted; supersedes the no-commit chooser behavior in QDP-014 and refines dismissal in QDP-015
- Context: Most clicks have an unambiguous interpretation from their position. Requiring the user to confirm Start or End adds friction, while always showing all three actions presents redundant choices.
- Decision: A click before the range immediately becomes Start, and a click after the range immediately becomes End. A click inside the range immediately moves the nearest endpoint, with ties resolving to End. The popover then shows only meaningful alternatives: This date for outside clicks, or the opposite endpoint and This date for inside clicks. Alternative actions are applied to the pre-click range.
- Consequences: Opening the popover now emits the contextual `onChange` immediately. Dismissing it preserves that value. Choosing an alternative emits another value derived from the stored original range, preventing the first endpoint update from corrupting the alternative interpretation. Hover remains a non-committing preview of the contextual default.

## QDP-017 — Use the weekday strip for backward drag navigation

- Date: 2026-08-10
- Status: Accepted; supersedes the guaranteed previous-week portion of QDP-013
- Context: Forcing a complete extra previous-month week makes every calendar taller even though backward navigation is mainly needed during an active cross-month drag. The weekday-name strip is a stable, full-width target directly above the date grid.
- Decision: Start the grid with only the leading dates required to align the current month's first day. Keep the extra trailing next-month week. During an active create, endpoint, or range drag, hovering the weekday-name strip starts the existing delayed and repeating previous-month navigation behavior.
- Consequences: A month may show zero to six previous-month dates instead of at least seven. The weekday strip exposes `data-drag-navigation="previous"` and a transient `data-drag-active` styling hook. Passive hover never navigates, and the active drag continues after the previous month appears.

## QDP-018 — Reveal hidden dates in the weekday strip

- Date: 2026-08-10
- Status: Accepted; supersedes the navigation behavior in QDP-017 while retaining its compact-grid decision
- Context: The weekday strip should extend the visible date surface during a drag, not switch the whole calendar merely because the pointer enters it. When the grid begins with only a few previous-month dates, the immediately preceding hidden week is the useful continuation.
- Decision: During an active drag, entering the weekday strip temporarily replaces all seven weekday labels with the seven calendar dates immediately before the grid's first visible date. Each revealed number updates the drag preview like a normal day, and releasing on it commits through the existing outside-month release behavior.
- Consequences: The compact grid remains unchanged at rest. The strip exposes `data-drag-overflow="previous"` and `overflow-day` styling slots while revealed. A release can commit the hidden date and then switch the visible calendar to its month; merely entering the strip does not navigate.

## QDP-019 — Reveal only the traversed suffix with normal day styling

- Date: 2026-08-10
- Status: Accepted; supersedes the full-week reveal presentation in QDP-018
- Context: Replacing all weekday labels at once reveals more dates than the drag has reached and makes the temporary numbers look like a separate control. The useful visual trail runs from the hidden target forward to the grid's first visible date.
- Decision: When the pointer reaches a hidden-week column, reveal only that date and every later date in the hidden week. Columns before the pointer remain weekday labels. Render revealed targets with the same base, outside-month, range-fill, endpoint, sizing, typography, state attributes, and consumer day classes as regular calendar cells.
- Consequences: Dragging farther backward expands the visible suffix; dragging forward contracts it. For example, targeting 25 directly before a grid that starts at 30 reveals 25–29. The strip remains compact at rest, and releasing any revealed target preserves the QDP-018 commit and month-switch behavior.

## QDP-020 — Keep weekday and overflow row geometry fixed

- Date: 2026-08-10
- Status: Accepted; refines QDP-019
- Context: Weekday labels previously occupied a shorter row than normal day cells. Replacing a label with a progressively revealed date therefore increased the header height and shifted the grid during an active drag.
- Decision: Size the weekday grid track with the same existing desktop and mobile day-size custom properties used by normal date cells. Swapping labels for dates changes only row content, never row geometry.
- Consequences: The weekday strip is day-cell height at rest and during a drag. Consumers can resize both regular dates and the strip through the existing day-size tokens, and the month header and date grid remain stationary throughout progressive reveal.

## QDP-021 — Never commit selection from hover

- Date: 2026-08-10
- Status: Accepted; refines QDP-011 and QDP-018
- Context: A translucent hover candidate can resemble a selected range, especially when it reaches dates outside the current month or appears while dragging through the progressive overflow strip.
- Decision: Passive hover and pointer movement are rendering-only events. They may update a translucent hover candidate or an active drag preview, but must never commit a value, invoke `onChange`, or navigate the visible month. Selection and outside-month navigation occur only on pointer release or an explicit date action.
- Consequences: Hover handlers cannot call commit or month-navigation paths. Tests cover callback silence for passive adjacent-month hover and active overflow movement before release; preview state must remain visually distinct from committed selection.

## QDP-022 — Cycle date roles through repeated clicks

- Date: 2026-08-10
- Status: Accepted; supersedes the menu interaction in QDP-014, QDP-015, and QDP-016
- Context: A popover interrupts direct calendar editing and requires a separate action target. The same date already provides a stable target for choosing among its Start, End, and one-day interpretations.
- Decision: Do not render an action menu. The first no-movement click applies the contextual default: Start before the range, End after it, or the nearest endpoint inside it with ties resolving to End. Further clicks on that same date cycle through the opposite endpoint, a one-day selection, and back to the default. Each result is calculated from the selection that existed before the first click. Clicking another date begins a new cycle; movement performs a drag instead, while Clear, explicit navigation, and endpoint-pill jumps reset the cycle.
- Consequences: A date can be reinterpreted without leaving the calendar grid. Endpoint crossing still normalizes every result, so an action named for one endpoint may visually land on the other side after crossing. The interaction model stores one explicit click-cycle object rather than menu state or independent flags, and tests cover before, inside, after, tie, wraparound, reset, outside-month, and drag behavior.

## QDP-023 — Do not preview possible periods on passive hover

- Date: 2026-08-10
- Status: Accepted; supersedes the passive-hover presentation in QDP-005, QDP-011, and QDP-021
- Context: Even a translucent candidate range adds visual noise and can be mistaken for a pending selection. Repeated clicks now provide the complete Start, End, and one-day editing path without requiring a prospective range on hover.
- Decision: Passive pointer hover does not calculate or render a possible period. It does not change selection, callbacks, or the visible month. Only an active create, endpoint, or whole-range drag renders an in-progress range before pointer release.
- Consequences: The controller no longer stores an idle hovered date or hover selection. Calendar cells no longer expose preview state attributes or preview-specific styles and tokens. The ordinary single-cell hover/focus outline remains an affordance, but it never expands into a range highlight.

## QDP-024 — Scope progressive numbers to weekday-strip presence

- Date: 2026-08-10
- Status: Accepted; refines QDP-019 and QDP-020
- Context: Hidden previous-week numbers are meaningful only while the pointer is actively traversing the weekday strip. Leaving them visible after the pointer returns to a normal date or another calendar area makes the temporary navigation surface appear stuck.
- Decision: Restore all weekday labels immediately when the active-drag pointer leaves the weekday strip. Moving between targets inside the strip continues to expand or contract the progressive suffix, and releasing on a revealed number still commits that hidden date.
- Consequences: Overflow visibility is scoped to pointer containment in the strip, not the lifetime of the drag. Clearing the numbers does not cancel or reset the active create, endpoint, or range drag; entering a normal date continues it from that date.

## QDP-025 — Skip equivalent click-cycle selections

- Date: 2026-08-10
- Status: Accepted; refines QDP-022
- Context: Different semantic roles can normalize to the same inclusive range. Clicking a date already used as an endpoint can therefore advance the action name without changing anything visible, making the cycle appear unresponsive and producing redundant callbacks.
- Decision: Compare each cycle candidate's normalized `{ start, end }` value with the value currently represented by the cycle. Skip equivalent candidates until a distinct selection is found. If Start, End, and one-day roles are all equivalent, retain the selection and do not invoke `onChange`.
- Consequences: Every emitted cycle step produces an observable range change. Endpoint clicks may skip directly from the unchanged contextual role to the opposite or one-day result, and controlled consumers do not receive duplicate values. The cycle stores its last emitted value so comparison remains deterministic even before a controlled parent rerenders.

## QDP-026 — End click interpretation at single day

- Date: 2026-08-10
- Status: Accepted; supersedes the wraparound behavior in QDP-022 and refines QDP-025
- Context: Returning from a one-day selection to the first contextual guess resurrects a range the user has already moved past. The pre-click range is useful only as temporary context for interpreting the first and opposite endpoint guesses.
- Decision: Treat repeated clicks as a finite sequence: contextual first guess, opposite guess, then single day. Skip normalized duplicates within that forward sequence. When single day is reached—or no distinct later interpretation exists—discard the cycle and its original range; do not wrap to an earlier action.
- Consequences: A fourth click cannot restore the pre-cycle range. Endpoint clicks may reach single day early when the opposite guess and solo action normalize identically, after which further clicks on that one-day value are fresh interactions. Tests verify terminal behavior for outside dates, existing endpoints, and all-equivalent one-day selections.

## QDP-027 — Use one explicit track for weekday names and numbers

- Date: 2026-08-10
- Status: Accepted; refines QDP-020
- Context: Matching default heights is not sufficient if label and revealed-date content can contribute independent sizing or consumer day styles can overflow the implicit weekday row.
- Decision: Define the weekday strip as one explicit seven-column grid row sized by the existing desktop or mobile day-size token. Force every weekday-label and revealed-number cell to fill 100% of that track with no content-derived minimum height.
- Consequences: Replacing any subset of day names with numbers changes content only. The strip and the date grid below it retain their geometry, and consumer styling can change the shared size token without creating separate label and overflow heights.

## QDP-028 — Omit default endpoint underlines

- Date: 2026-08-10
- Status: Accepted
- Context: The small white bars beneath selected endpoint numbers read as underlines and add unnecessary decoration to the selected range.
- Decision: Do not apply built-in visual styling to endpoint handle elements. Preserve the `handle` data slot and `classNames.handle` hook so a consuming design system can opt into a handle affordance without changing interaction behavior.
- Consequences: Start and end cells remain draggable across their full day-cell targets, but the default theme shows only the endpoint fill. Existing consumer handle classes continue to receive markup and can define their own size, position, and appearance.
