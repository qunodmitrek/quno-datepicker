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

## QDP-029 — Scroll day numbers vertically across months

- Date: 2026-08-10
- Status: Accepted
- Context: Replacing all dates instantly at a month boundary makes a continuous cross-month drag feel discontinuous even though the pointer interaction remains active.
- Decision: On adjacent-month navigation, remount the date grid with a direction marker and animate only each day-number glyph into place vertically. Next-month numbers enter from below; previous-month numbers enter from above. Keep the calendar shell, grid tracks, range fill, and month heading geometry stationary. Disable the animation under `prefers-reduced-motion` and expose scoped duration and distance tokens.
- Consequences: Drag-edge navigation and outside-month release share the same directional feedback without destabilizing pointer targets. The grid exposes `data-month-motion="previous|next"` as a styling contract, while consumers can tune `--quno-picker-month-scroll-duration` and `--quno-picker-month-scroll-distance` or replace the motion in their own stylesheet.

## QDP-030 — Animate Start and End endpoint jumps

- Date: 2026-08-10
- Status: Accepted; refines QDP-029
- Context: Off-screen Start and End pills perform the same visible-month change as drag-boundary navigation, but an instantaneous pill jump creates a different and less continuous transition.
- Decision: Determine whether the endpoint month is before or after the current view and apply the same previous/next number-motion marker when its pill is clicked. Preserve the existing direct jump to the endpoint month and the QDP-029 reduced-motion behavior.
- Consequences: Endpoints after the view bring numbers from below; endpoints before it bring numbers from above. Pill jumps, month controls, drag-edge navigation, and outside-month releases now share one directional motion vocabulary without altering selection.

## QDP-031 — Reveal endpoint pills from beneath the calendar

- Date: 2026-08-10
- Status: Accepted
- Context: Inserting an off-screen Start or End control directly into the layout makes the calendar jump and does not explain where the newly available action belongs spatially.
- Decision: Mount each pill inside an exact-height collapsing track so its appearance is a layout transition. A pill before the calendar enters upward from beneath it while the expanding track moves the calendar down. A pill after the calendar enters downward from beneath it while the calendar settles upward. Keep selection unchanged, retain the existing click-to-jump behavior, expose scoped duration and distance tokens, and omit all reveal animation under `prefers-reduced-motion`.
- Consequences: Endpoint controls feel attached to the calendar edge instead of appearing as unrelated content. The root exposes `data-pill-before` and `data-pill-after` for state-aware consumer styling, while the existing `pills` and `pill` slots remain unchanged. Simultaneous off-screen endpoints use the same independent tracks without changing calendar geometry after the transition settles.

## QDP-032 — Slide full-size endpoint pills behind the calendar

- Date: 2026-08-11
- Status: Accepted; supersedes the collapsing-track mechanism in QDP-031
- Context: Collapsing a pill container from zero height makes the control itself appear to resize or be progressively clipped. The intended spatial model is a fully formed control hidden underneath the opaque calendar surface and uncovered by coordinated movement.
- Decision: Give every newly mounted pill its final layout dimensions immediately. Animate only transforms: Start travels upward from behind the calendar while the calendar moves down from its prior visual position; End travels downward from behind it while the calendar moves up. Do not animate height, grid tracks, clipping, scale, or opacity. Retain component-scoped duration/distance tokens and the reduced-motion fallback.
- Consequences: Pill text, borders, and hit-area dimensions remain stable for the entire reveal. The calendar remains the higher stacking surface so translated pills are genuinely occluded while behind it. If both sides are present simultaneously, both controls slide from their respective edges without assigning contradictory simultaneous vertical movement to the single calendar block.

## QDP-033 — Move month names with their date grid

- Date: 2026-08-11
- Status: Accepted; refines QDP-029 and QDP-030
- Context: Vertically introducing new day numbers while replacing the month name instantly gives one calendar change two different motion languages.
- Decision: Remount the formatted month-name span for each visible month and mark its stable heading with the same previous/next direction as the date grid. Animate the new name from above for previous months and from below for next months, using the existing month-scroll duration and distance tokens and reduced-motion rule.
- Consequences: Month controls, drag navigation, adjacent-day release, and endpoint-pill jumps move the month name and numbers consistently. The heading keeps its layout box and public `month-heading` slot while exposing `data-month-motion` for consumer styling.

## QDP-034 — Retain endpoint pills through their exit motion

- Date: 2026-08-11
- Status: Accepted; refines QDP-032
- Context: An endpoint pill is no longer logically needed as soon as its date enters the visible month, but immediate unmounting prevents it from returning beneath the calendar and creates an abrupt disappearance.
- Decision: Model pill presence as the discriminated states `hidden`, `visible`, and `exiting`. When a visible pill becomes unnecessary, retain its final-size button, disable it, remove it from the accessibility tree, and translate it beneath the calendar while its layout track closes. Unmount after `animationend`; if the optional stylesheet or motion animation is unavailable, complete the exit immediately.
- Consequences: Start and End controls use reciprocal enter and exit paths without resizing. Closing the before-calendar track moves the calendar over the departing control and removes its space without a final layout jump; a departing after-calendar control moves itself under the stationary calendar. Tests cover both exit directions and completion-driven unmounting.

## QDP-035 — Distinguish pill entry from stable visibility

- Date: 2026-08-11
- Status: Accepted; refines QDP-034
- Context: With both endpoints outside a middle month, clicking Start removes the upper pill while End remains below. A reveal selector based only on End being present becomes active again when Start finishes exiting, moving the calendar a second time even though End was never newly revealed. Very long ranges make this double jitter especially easy to notice.
- Decision: Expand pill presence to `hidden`, `entering`, `visible`, and `exiting`. Run reveal tracks and calendar displacement only during `entering`, settle to `visible` on animation completion, and leave an unchanged opposite pill in `visible` throughout its sibling's exit. Preserve immediate settling when motion or the optional stylesheet is unavailable.
- Consequences: Entry motion is edge-triggered instead of presence-triggered. Removing one of two off-screen endpoint controls cannot reactivate the stable control's reveal animation, while genuinely new Start and End pills still use the established under-calendar motion.

## QDP-036 — Keep the calendar body at six weeks

- Date: 2026-08-11
- Status: Accepted; supersedes the variable-height and guaranteed trailing-week consequences of QDP-013 and refines the compact leading context in QDP-017
- Context: Adding a complete trailing week after every natural month grid produces seven rows whenever the aligned month already occupies six weeks. That changes the calendar height between months and provides more adjacent-month dates than the interaction needs.
- Decision: Render a six-week, 42-cell view for every Gregorian month and configured week start. Calculate the natural complete weekday rows first and append one trailing week only when that natural grid's final cell is the month's final day; apply six weeks as both the minimum and final rendered height. Preserve the aligned leading dates and progressive hidden previous-week drag strip.
- Consequences: Calendar height is stable across navigation, including month-name and number motion. Months whose natural grid ends on month-end still expose following-month dates, while former seven-week cases no longer add a redundant row. Model tests cover exact month-end alignment and a week-start case that previously produced 49 cells.

## QDP-037 — Animate endpoint-pill lifecycle per item

- Date: 2026-08-11
- Status: Accepted; refines QDP-035
- Context: A pill container can already show Start when End becomes off-screen on the same side, or vice versa. Treating the changed item list as a new container entry reanimates the existing control, moves the calendar again, and makes both buttons appear to be redrawn.
- Decision: Track `entering`, `visible`, and `exiting` independently for each endpoint item. Keep the container `visible` whenever it contains an established item, append a newly off-screen sibling after the established DOM item, and apply the under-calendar transform only to that new button. Use container entry and layout motion only when the side previously had no pills.
- Consequences: The already-visible pill retains its DOM node, order, and position while its sibling arrives. Start-first and End-first cases use the same behavior, item exit remains independent, and consumer CSS can target `data-item-presence` without losing the existing container and slot contracts.

## QDP-038 — Do not translate the calendar after a pill is visible

- Date: 2026-08-11
- Status: Accepted; refines QDP-037
- Context: Calendar displacement explains where the first off-screen endpoint control comes from. Once Start or End is already exposed, moving the calendar again to reveal another control repeats information and can look like a layout jump even when the established pill itself remains stable.
- Decision: Allow calendar-shell reveal translation only when no endpoint item is in the stable `visible` phase. If any Start or End pill already exists, keep the calendar fixed and animate only the newly entering button from beneath the calendar. Preserve the per-item lifecycle and container-space behavior from QDP-037.
- Consequences: First-pill entry may move the calendar, while every subsequent endpoint addition is button-only motion. The guard applies across both pill positions, preventing a stable control on one edge from permitting an unrelated calendar translation on the other edge.

## QDP-039 — Paint a new range from outside the selection

- Date: 2026-08-11
- Status: Accepted; refines the outside-range drag path in QDP-005 while preserving the click cycle in QDP-026
- Context: Pressing outside an existing selection currently attaches immediately to its nearest endpoint. Dragging from that cell therefore stretches the old range across the gap instead of letting the user paint the separate period indicated by the gesture.
- Decision: Begin outside-range pointer actions in a discriminated `paint-pending` state that retains the committed selection. On the first movement to another date, convert it to `create` with the pressed date as origin and render a fresh normalized range between origin and pointer. If release occurs without movement, resolve the same contextual endpoint click and repeated-click cycle as before.
- Consequences: Dragging before or after a selection replaces it with a newly painted segment and commits only on release. Pointer-down alone does not alter the rendered or committed value, click behavior remains backward compatible, and edge/weekday-strip navigation treats `paint-pending` as an active drag that becomes a create interaction when it reaches a date.

## QDP-040 — Distinguish movement drags from hover

- Date: 2026-08-11
- Status: Accepted
- Context: The ordinary pointer cursor and hovered-day outline remain visible while moving an entire range or manipulating a one-day selection. Those hover affordances imply another click target even though the pointer is already carrying the selection.
- Decision: Mark whole-range and one-day pointer actions as `data-dragging="move"` on the calendar and grid. The optional default theme uses a grabbing cursor and suppresses only the ordinary hovered-day outline while that state is active.
- Consequences: Direct movement has a clear drag affordance without hiding the moving selection itself. Endpoint resizing, fresh-range painting, focus-visible outlines, and consumer-defined styles remain independent, while unstyled consumers can use the stable state attribute to provide their own feedback.

## QDP-041 — Use the drag affordance for endpoint resizing

- Date: 2026-08-11
- Status: Accepted; refines QDP-040
- Context: Start and End cells are direct drag targets too, but retaining the pointer cursor and ordinary hover outline makes endpoint resizing feel inconsistent with moving the complete range.
- Decision: Apply the existing `data-dragging="move"` state, grabbing cursor, and hovered-day outline suppression to every `drag-endpoint` interaction, including endpoint crossing. Keep fresh-range painting outside this state.
- Consequences: Start, End, one-day, and whole-range direct manipulation share one cursor language. Endpoint normalization and crossing behavior are unchanged, focus-visible feedback remains available, and consumers need only one state attribute to style all selected-date drags.

## QDP-042 — Preserve pill intrinsic size while layout space closes

- Date: 2026-08-11
- Status: Accepted; refines QDP-034
- Context: An exiting pill and its layout track animate simultaneously. A flex child using cross-axis stretch can follow the contracting track height, making the button appear to shrink even though its transform is moving toward the calendar.
- Decision: Align pill items to the start of their flex track and prevent them from growing or shrinking. The track may continue closing to move surrounding layout, but each button retains its intrinsic width and height while translating beneath the opaque calendar.
- Consequences: Exit motion no longer deforms the control. Calendar and following-content layout still settle continuously, multi-pill containers keep stable gaps and ordering, and custom pill content remains intrinsic rather than being forced to a theme-specific fixed height.

## QDP-043 — Customize day presentation through typed context

- Date: 2026-08-11
- Status: Accepted
- Context: Consumers need project-specific date treatments such as Today or weekend colors, but exposing the complete day-button prop surface would allow callbacks to replace selection handlers, accessibility labels, and stable state attributes.
- Decision: Add `getDayCellProps(context)` as a presentation-only public callback. Context reports the ISO date, weekday, Today/weekend status, visible-month membership, committed membership, transient rendered membership, and rendered endpoint flags. The callback may return only `className`, `style`, and `title`.
- Consequences: Projects can style business-specific dates without forking markup or the default theme. Core interaction and accessibility contracts remain owned by the library, callback output applies to adjacent-month cells too, and consumers can deliberately distinguish committed selection from an active drag preview.

## QDP-044 — Let host layouts own optional guidance placement

- Date: 2026-08-11
- Status: Accepted
- Context: The demo repeated its click-cycle instruction below the calendar and in the explanatory column while also using the left-side callout for raw selected-date JSON.
- Decision: Omit the component hint element when `labels.hint` is empty. In the demo, remove the JSON range display and place the repeated-click instruction in the left column, while preserving the non-empty default hint for existing library consumers.
- Consequences: The demo has one clear source of click-cycle guidance and no developer-oriented value output in its presentation. Applications can relocate guidance without an empty paragraph affecting layout, while consumers that do not override `labels.hint` retain current behavior.

## QDP-045 — Project the selected overlap into the weekday strip

- Date: 2026-08-11
- Status: Accepted; refines QDP-020 and QDP-024
- Context: Revealing hidden previous-week dates only from the hovered column toward week-end assumes that a range always grows backward from a later anchor. When an End endpoint moves back toward an earlier Start, selected dates before the pointer remain hidden behind weekday names.
- Decision: While the pointer is inside the weekday strip during an active drag, replace every weekday label whose hidden previous-week date belongs to the transient rendered range. Also reveal the hovered date immediately while its parent interaction update settles. On pointer leave, restore all weekday labels regardless of whether the transient range still intersects the hidden week.
- Consequences: Start, End, create, and whole-range drags project their actual selected intersection instead of a hardcoded direction. Selected fill and endpoint styling remain continuous in the header row, external day-cell customization applies to projected dates, and no projected number persists when the active pointer is elsewhere in the calendar.

## QDP-046 — Center navigation chevrons with icon geometry

- Date: 2026-08-11
- Status: Accepted
- Context: Unicode chevron glyphs are centered by their text box, but font-specific side-bearings and baseline metrics make the visible marks appear offset inside otherwise centered circular controls.
- Decision: Render previous and next chevrons as mirrored paths in the same 16-by-16 SVG view box, centered by the button's existing grid layout. Keep the SVG decorative because each button already has a localized accessible label.
- Consequences: Both directions have symmetric optical alignment independent of the consumer's font. Button dimensions, hit areas, public slots, labels, navigation behavior, and color inheritance remain unchanged.

## QDP-047 — Preview only the next repeated-click result

- Date: 2026-08-11
- Status: Accepted; narrowly refines the passive-hover prohibition in QDP-023
- Context: A repeated click changes a date from its first contextual endpoint interpretation to the next non-equivalent endpoint or single-day result. Without a cue, that upcoming segment is discoverable only after commitment, but restoring general hover range highlighting would reintroduce the ambiguity rejected in QDP-023.
- Decision: Once a click cycle exists, derive its next non-no-op value with the same cycle function used for commitment. Mark its visible cells and the clicked trigger cell in the DOM, but show a 1px outer outline only while that trigger cell matches `:hover`. Draw no candidate fill, suppress the trigger's ordinary hover ring, split outlines at week-row boundaries, and remove the visual immediately when the trigger is no longer hovered.
- Consequences: The cue predicts exactly what the next click will select while committed selection, endpoint markers, summary, callbacks, and visible month remain unchanged. Unrelated dates retain QDP-023 behavior, no idle hover state is stored, and consumers may recolor the outline through `--quno-picker-cycle-preview` or the documented state attributes.

## QDP-048 — Match cycle outlines to selected-date geometry

- Date: 2026-08-11
- Status: Accepted; refines QDP-047
- Context: Insetting a cycle outline by fixed distances from each full grid cell makes its endpoint caps wider and taller than the 34px selected-date circles, especially in a wide calendar column.
- Decision: Give every preview row segment the same 34px vertical extent as a day highlight. Align actual range start and end caps to 17px on either side of their date-cell centers. When a range continues across a week boundary, close that row segment at the calendar edge instead of applying endpoint inset.
- Consequences: Single-date previews are exactly the selected date size, range endpoints line up with selected endpoint circles, and multi-row previews retain continuous row geometry without becoming artificially narrow at Monday or Sunday.

## QDP-049 — Leave wrapped cycle-preview rows open

- Date: 2026-08-11
- Status: Accepted; supersedes the row-edge closing behavior in QDP-048
- Context: Closing a multi-row preview at Sunday and reopening it at Monday gives those ordinary continuation dates full-cell rounded caps. The caps are wider than a selected date and falsely imply additional range endpoints.
- Decision: Draw rounded vertical caps only on the preview's actual start and end dates, aligned to their 34px selected-date geometry. At a week boundary, extend only the horizontal outline to the calendar edge and leave the continuation open.
- Consequences: Wrapped previews retain their visual continuity without making Sunday or Monday look selected as endpoints. Single-row and single-day previews keep complete rounded outlines.

## QDP-050 — Keep the empty handle slot out of day layout

- Date: 2026-08-11
- Status: Accepted; refines QDP-028 and QDP-048
- Context: The preserved empty endpoint handle element remained a second grid item after its default underline styling was removed. It shifted selected endpoint numbers upward while the cycle-preview outline stayed centered, exposing the outline below the filled date.
- Decision: Position the built-in handle slot absolutely so it contributes no grid track or intrinsic height. Keep the element, stable slot, and consumer class hook unchanged.
- Consequences: Endpoint numbers and fills remain centered like every other date and align exactly with 34px preview caps. Consumers can still opt into a visible handle and may override its scoped positioning.

## QDP-051 — Pair copyable integration guidance with a live story

- Date: 2026-08-11
- Status: Accepted
- Context: The prototype demonstrates the finished interaction but does not teach consumers how to own state, localize copy, theme the component, or integrate long cross-month ranges. Quno Calendar established a useful split between API recipes and a benefit-led live field guide.
- Decision: Maintain `docs/implementation-guide.md` as the copyable consumer contract and `/story` as the editorial, interactive companion. Story examples must import the datepicker through `src/index.ts`, the same public API boundary represented by the package entrypoint.
- Consequences: Product and engineering teams can evaluate behavior in context while implementation details remain searchable and copyable. The story is demo-only, does not expand the published JavaScript API, and receives smoke coverage alongside the library tests.

## QDP-052 — Explain the product thesis and measured footprint

- Date: 2026-08-11
- Status: Accepted; refines QDP-051
- Context: Setup recipes alone do not explain why the datepicker uses one calendar, how its direct-manipulation model differs from conventional two-panel selection, which styling boundaries consumers can use, or what the package costs to ship.
- Decision: The live story must cover the product thesis, an explicit and qualified comparison, the complete V1 gesture repertoire, four customization layers, the state architecture, and raw/gzip artifact sizes. Keep a repository command that measures built JavaScript and CSS rather than estimating from source.
- Consequences: The story can support product evaluation as well as implementation. Footprint claims remain tied to production artifacts, exclude the external Preact peer, and must be refreshed when a build materially changes them.

## QDP-053 — Demonstrate every primary contract live

- Date: 2026-08-11
- Status: Accepted; refines QDP-051 and QDP-052
- Context: A summary calendar and prose list cannot teach direct manipulation, hidden-week drag continuation, click-cycle correction, shortcut motion, or consumer styling. These behaviors are spatial and need an immediately usable state plus a concrete instruction.
- Decision: Organize the main story around ten numbered contracts: paint/endpoint drag, stable six-week view, weekday-strip hidden dates, whole-segment movement, contextual click construction, inline guess correction, Start/End shortcuts, micro-animation and reduced motion, typed day handling, and token theming. Give every contract its own public-entrypoint datepicker and a short “Try it” instruction.
- Consequences: The story is intentionally long and interactive like the Quno Calendar field guide. Examples may share fixtures but must remain independently usable, smoke tests count all live calendars, and new primary interaction contracts require a corresponding exhibit.

## QDP-054 — Explain interaction architecture through its visible benefit

- Date: 2026-08-11
- Status: Accepted; refines QDP-004 and QDP-052
- Context: Naming a discriminated union explains the implementation technique but does not tell a product evaluator what the architecture offers during calendar use.
- Decision: Describe the story's interaction state as one active gesture chosen from paint, resize, or move. Pair that mechanism with its observable benefit: gestures cannot collide, and pointer release returns the calendar to rest. Keep the discriminated-union terminology in engineering documentation where its type-system meaning has context.
- Consequences: The architecture story remains technically accurate while becoming useful without TypeScript knowledge. Future state-model explanations should connect internal constraints to visible interaction guarantees.

## QDP-055 — Reserve one line for every month heading

- Date: 2026-08-11
- Status: Accepted; refines QDP-025 and QDP-053
- Context: A fixed six-week grid does not create a stable calendar if a longer month-and-year label wraps and increases the header height. Locales and consumer formatters can produce labels wider than the default English examples.
- Decision: Give the month header a fixed 36px row, keep its center heading to one line, and truncate overflow with an ellipsis. Preserve the complete label in the heading's accessible text.
- Consequences: Month navigation cannot move surrounding layout because of title wrapping. Ordinary month names remain visible in full, unusually long customized labels trade visible completeness for stable geometry, and consumers may override the scoped styles when a different layout contract is intentional.

## QDP-056 — Keep the calendar anchored when navigation creates pills

- Date: 2026-08-11
- Status: Accepted; refines QDP-032 and QDP-038
- Context: When a range is fully visible and a month-chevron click navigates away from it, both endpoints can become off-screen at once. Translating the calendar to introduce the resulting controls duplicates the navigation motion and makes the stable calendar appear to jump.
- Decision: Track whether a month change came from direct calendar navigation, an interaction release, or an endpoint jump. Endpoint pills first required by direct month navigation use a stationary-calendar reveal: each full-size control slides from beneath the calendar, while the calendar shell receives no reveal translation. Preserve the established reveal rules for other month-change sources.
- Consequences: The August 10–20 to previous-month transition keeps the calendar anchored while Start and End appear below it. Drag continuation and endpoint-jump transitions retain their existing directional motion, reduced-motion behavior remains unchanged, and each pill records its reveal mode for deterministic styling and tests.

## QDP-057 — Introduce the prototype through actions

- Date: 2026-08-11
- Status: Accepted
- Context: Two prose paragraphs on the start page make the datepicker's primary gestures difficult to scan and give the repeated-click correction disproportionate visual weight.
- Decision: Present the start-page guidance as five highlighted action labels—Click, Click again, Drag an endpoint, Drag the period, and Paint outside—each paired with one short result. Keep the labels semantic text rather than controls because they explain the adjacent live calendar instead of changing it.
- Consequences: A first-time visitor can identify the gesture repertoire before reading details, direct manipulation remains the visual emphasis, and the implementation story stays available for deeper rationale and examples.

## QDP-058 — Place integration recipes beside their behavior

- Date: 2026-08-11
- Status: Accepted; refines QDP-051 and QDP-053
- Context: Calling `/story` an implementation story while placing one generic import snippet after every product exhibit separates the “how” from the behavior it configures. Basic usage, custom day attributes, and theming are easier to understand next to their live outcomes.
- Decision: Treat `/story` as a product-and-implementation field guide. Place copyable basic usage beside primary interaction, `getDayCellProps` beside custom-day presentation, and scoped CSS tokens beside theming. Replace the generic implementation appendix with a concise pointer to the complete reference document.
- Consequences: Readers can move directly from rationale to a relevant recipe without losing the editorial flow. The implementation guide remains the exhaustive contract, the story retains live examples, and future recipes should live with the exhibit they affect rather than accumulate in a detached appendix.

## QDP-059 — Resolve direct touch by coordinates

- Date: 2026-08-11
- Status: Accepted; narrows the touch deferral in QDP-008
- Context: iPhone implicitly captures a direct-touch pointer on the day where it begins. Subsequent move and release events continue targeting that original button, so target-based enter/up handlers collapse painting to one day even when the finger crosses several cells.
- Decision: Let the starting day retain pointer capture, but resolve every active move and release through `document.elementFromPoint` at the current pointer coordinates. Disable native touch panning only on the date grid, cancel transient interaction on `pointercancel`, and use the controller's explicit interaction state to continue after a cross-month grid remount.
- Consequences: Tap, paint, endpoint resize, and whole-range movement share the same mouse, pen, and direct-touch model on iPhone. Page scrolling remains available outside the grid. Long-press semantics, touch dragging into the hidden weekday row, and other advanced touch conventions remain deferred until separately specified.

## QDP-060 — Include the weekday strip in captured touch hit testing

- Date: 2026-08-11
- Status: Accepted; supersedes the hidden-row touch deferral in QDP-059 and refines QDP-045
- Context: After direct grid painting was made coordinate-based, iPhone still could not enter the hidden previous-week row because implicit capture prevented the weekday strip from receiving its own pointer-enter and pointer-up events.
- Decision: Give every weekday label and revealed overflow cell an internal touch date and column index. Coordinate hit testing returns either a normal grid target or a weekday-strip target. Calendar-level projection state passes the weekday index to the existing discriminated strip mode, clears it on re-entry to the grid or cancellation, and commits the resolved hidden date on release.
- Consequences: Mouse and direct touch now share progressive hidden-week reveal, clearing, selection projection, and outside-month commitment. The weekday row keeps its fixed height and presentation-only day callback behavior. Long-press semantics and other advanced touch conventions remain deferred.

## QDP-061 — Compare user friction rather than calendar count

- Date: 2026-08-11
- Status: Accepted; refines QDP-052
- Context: “Often two months side by side” describes a conventional layout but is not itself a user concern. It leaves the field guide unable to explain what becomes easier when Quno uses one stable, directly editable range.
- Decision: Structure the comparison around seven user frictions: forced selection order, unstable layout, restarting an existing edit, two-click single-day selection, correcting an unwanted contextual guess, narrow cross-month drag context, and reduced mobile interactions. Mention one-versus-two calendars only as an explanation of layout stability.
- Consequences: The comparison now states observable tasks and outcomes rather than presenting visual difference as inherent superiority. Each Quno claim maps to a live exhibit and implemented test contract elsewhere in the field guide.

## QDP-062 — Exercise theme geometry in the live story

- Date: 2026-08-11
- Status: Accepted; refines QDP-009, QDP-053, and QDP-058
- Context: Three palette-and-radius variants do not prove that the component can fit harder host constraints, and a cycle-preview outline that retains the default blue can look accidental inside a strongly branded skin.
- Decision: Keep the theming contract component-scoped and add two deliberately expressive story skins: a 300px compact calendar and a constrained 390px calendar with enlarged day tracks. Set a contrasting `--quno-picker-cycle-preview` value for every custom story skin and include the geometry and preview tokens in copyable recipes.
- Consequences: The live switcher demonstrates width, desktop/mobile day sizing, palette, radius, typography, and shadow changes without altering component behavior or the public API. Future story themes should keep the next-click outline legible against both their selected fill and surface.

## QDP-063 — Theme endpoint pills and selection summaries explicitly

- Date: 2026-08-11
- Status: Accepted; refines QDP-009 and QDP-062
- Context: Strongly branded calendar and day styles leave off-screen Start/End controls looking like default-theme attachments. A shared surface token also prevents a theme from matching its selected-period summary to the range fill without recoloring the entire calendar.
- Decision: Preserve the existing pill color tokens, class hook, and `data-endpoint` contract while adding component-scoped pill radius, shadow, spacing, border-width, typography, and track-layout tokens. Give the selection header its own `--quno-picker-selection-surface` token with the calendar surface as fallback. Exercise both contracts in every custom story skin and in the copyable theme recipe.
- Consequences: Consumers can theme both endpoint controls together through tokens, stack or wrap them under width pressure without resizing them, or distinguish Start from End through stable attributes and classes. Themes can coordinate the summary with selected days independently of the calendar surface; Candy uses this to share one pink range color across both presentations, while Acid stacks full-size pills inside 300px.

## QDP-064 — Render touch painting once per calendar-date change

- Date: 2026-08-11
- Status: Accepted; refines QDP-059 and QDP-060
- Context: iPhone emits many captured `pointermove` events inside one day cell. When coordinate hit testing briefly lands on a grid gap, falling back to the captured origin collapses and repaints the transient range; 140ms day-color transitions can also leave obsolete endpoint circles visible after the finger has moved on.
- Decision: Store the last valid coordinate-resolved touch target and call the interaction update only when its date or hidden-week index changes. If `elementFromPoint` finds no date during an active capture, retain that last target for preview and release instead of using the captured event target. Ignore touch `pointerenter` updates and disable day-span color transitions while the grid exposes `data-interaction-active`.
- Consequences: Painting renders at calendar-date granularity rather than raw event frequency, crossing cell gaps cannot flash the origin selection, and released values still use the most recent valid date. Mouse and pen pointer-enter behavior, committed state, hidden-week projection, and cross-month continuation remain unchanged.

## QDP-065 — Make the field guide contents task-oriented

- Date: 2026-08-11
- Status: Accepted; refines QDP-051 and QDP-058
- Context: Five loose links above the field-guide title neither describe the full page nor behave like a useful table of contents. Labels such as “Why Quno” and “Quno approach” assume brand familiarity instead of explaining the destination or comparison.
- Decision: Place one complete, semantic table of contents after the opening introduction. Link every numbered live chapter plus the range-editing overview, interaction architecture, production footprint, API reference, and prototype. Name destinations by the task or contract they explain; reserve the product name for package identity rather than benefit labels.
- Consequences: First-time readers can scan the whole guide before committing to the long page, assistive technology receives one named contents landmark, and links remain understandable without prior knowledge of the product name. New top-level story chapters must be added to this contents list with descriptive labels.

## QDP-066 — Demonstrate internationalization as a live contract

- Date: 2026-08-11
- Status: Accepted; refines QDP-009, QDP-053, and QDP-065
- Context: Localization is documented as an API recipe but absent from the live field guide, so readers cannot see locale-aware dates, weekday order, translated controls, and accessibility labels working together.
- Decision: Add internationalization as the tenth live chapter and move theming to chapter eleven. Render one French, Monday-first public-entrypoint example with translated visible and accessible labels, a concise interaction instruction, and a copyable `locale`, `weekStartsOn`, and `labels` recipe. Add the chapter to the opening contents and smoke coverage.
- Consequences: The field guide now demonstrates eleven primary contracts. Consumers can evaluate internationalization visually and copy its configuration in context, while custom formatter recipes remain in the complete implementation guide.

## QDP-067 — Offset endpoint pills beyond opaque theme shadows

- Date: 2026-08-11
- Status: Accepted; refines QDP-032, QDP-037, and QDP-063
- Context: Endpoint pills intentionally render below the calendar stacking layer so entry and exit read as motion from behind it. The default 8px stable offset works with a soft shadow, but Candy's opaque 18px downward calendar shadow continues to cover an after-calendar pill after motion settles.
- Decision: Replace the fixed pill top margin with component-scoped `--quno-picker-pill-offset-before` and `--quno-picker-pill-offset-after` tokens, each retaining an 8px default. Size the Candy and Acid theme offsets to clear their solid vertical header/calendar shadows while preserving the existing z-index, full-size control, lifecycle, and reveal animation contracts.
- Consequences: Strong-shadow themes can create a clean stable gap on either calendar edge without weakening the behind-calendar reveal illusion. Default consumers retain existing geometry, and before/after controls can account for asymmetric theme shadows independently.

## QDP-068 — Keep compact-theme endpoint controls on one row

- Date: 2026-08-11
- Status: Accepted; supersedes the Acid-specific stacking consequence in QDP-063
- Context: Stacking Acid's Start and End controls made related endpoint actions scan as separate blocks and amplified layout movement. Its solid calendar shadow also left too little optical separation from an after-calendar control.
- Decision: Keep both Acid endpoint controls on one non-wrapping row at the 300px theme constraint. Apply the public pill font-size token correctly, expose the track gap as `--quno-picker-pills-gap`, compact only Acid's internal spacing, and retain 12px of clear space beyond either vertical shadow.
- Consequences: Start and End remain visually grouped and preserve their interaction order above or below the calendar. The longest dates used by the live example fit without shrinking, wrapping, or clipping either full-size button; other themes retain the default row and gap behavior unless explicitly customized.

## QDP-069 — Keep cross-page actions outside the field-guide contents

- Date: 2026-08-11
- Status: Accepted; supersedes the prototype-link placement in QDP-065
- Context: The interactive prototype is a separate destination, while every other table-of-contents entry moves within the field guide. Mixing that cross-page action into the contents unexpectedly interrupts the guide's reading flow.
- Decision: Keep the table of contents limited to anchors on the current page and place the interactive-demo link as a distinct action in the hero topline.
- Consequences: Readers can still reach the prototype immediately, but the contents now has one predictable navigation model and no longer sends users away from the guide mid-scan.
