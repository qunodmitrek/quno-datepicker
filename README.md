# Quno Datepicker

A reusable, typed Preact library for single-calendar date and date-range selection. It provides a default Quno theme while keeping copy, formatting, week layout, and styling controlled by the consuming project.

## Project records

- `AGENTS.md` contains repository-wide instructions for implementation, documentation, scope, and verification.
- `DECISIONS.md` records accepted product and architecture decisions and their consequences.
- `CHANGELOG.md` records implementation history and verification results.

Update these records in the same change as the code they describe.

## Implementation resources

- [Implementation guide](./docs/implementation-guide.md) — copyable setup,
  state, localization, styling, and form-integration recipes.
- Interactive field guide — run `npm run dev` and open `/story` for thirteen live
  chapters covering painting, dragging, the stable six-week view, hidden-week
  navigation, year jumps, click correction, endpoint shortcuts, motion, day handlers,
  internationalization, week-start layouts, and theming, with implementation
  recipes placed beside their live outcomes.

## V1 behavior

- The value is either `null` or a timezone-free `{ start, end }` ISO-date range.
- A one-day selection is represented by `start === end`.
- The first click on a date edits the contextual endpoint: Start before the range, End after it, or the nearest endpoint inside it. Ties resolve to End.
- Additional no-movement clicks on that same date advance through the opposite endpoint interpretation and then a one-day selection. Every result is derived from the range as it was before the first click, but that original context is discarded as soon as single day is reached—it never wraps back to the first guess. Clicking elsewhere also starts fresh, and any normalized no-op role is skipped automatically. While that cycle remains available, hovering its clicked date draws a thin outer outline around the segment the next click would select, using the same 34px-high geometry and endpoint caps as the selected dates. Wrapped rows remain open at the calendar edge so only real range endpoints look rounded.
- No date-action menu is rendered. Passive hover on unrelated dates does not calculate or highlight a possible period. The bounded cycle outline never selects, calls `onChange`, or navigates to another month.
- Drag either endpoint to resize. Crossing automatically swaps endpoint identity.
- Selected endpoints have no default underline or handle decoration; the stable, out-of-flow `handle` slot remains available for consumer-defined styling without shifting the date number.
- Drag inside the selected period to move it by snapped calendar days without changing duration.
- Whole-range, one-day, and start/end endpoint drags use a grabbing cursor and suppress the ordinary hovered-day outline while the pointer action is active.
- Begin a drag outside the selected period to paint a fresh range from that cell. Until movement occurs, the same pointer action remains an ordinary contextual click on the existing range.
- Mouse, pen, and direct-touch painting resolve the calendar cell currently under the pointer even when iPhone implicitly captures the gesture on its starting cell. Touch moves are coalesced by resolved calendar date; crossing a grid gap retains the last valid date instead of snapping the preview back to the captured origin. Day-color transitions pause during the active gesture so earlier endpoints cannot leave short-lived visual ghosts. Moving a captured finger into the weekday strip resolves and progressively reveals the matching hidden previous-week dates; returning to the grid clears them, and release commits through the same outside-month behavior. The date grid owns touch movement instead of page panning while a gesture is active; scrolling remains available outside the grid.
- Holding a drag at either month edge navigates after a 400 ms delay and repeats while held.
- When the visible month changes, its name and day numbers enter vertically in the travel direction while the calendar frame and selection geometry stay fixed. Motion is disabled when the user prefers reduced motion.
- Previous/next controls use symmetric SVG chevrons centered within their unchanged circular hit areas.
- Clicking the month-and-year heading replaces the date body in-place with a
  scrollable year navigator. Each year shows twelve month buttons in four rows;
  scrolling progressively adds years in either direction, while a virtual
  window mounts only the visible years and a small overscan buffer. The fixed
  header and month chevrons remain available. Choosing a month, using either
  chevron, or jumping through an off-screen Start/End shortcut restores the
  destination's six-week date grid; clicking the heading again closes without
  navigating. None of these navigation actions changes selection.
- Every view keeps a fixed six-week grid with only the weekday-aligned leading dates needed for the current month. The month heading reserves one non-wrapping line; labels wider than the available center column truncate instead of increasing the calendar height. When the natural aligned month grid ends exactly on month-end, a trailing week is appended within that six-week minimum. While a drag is over the weekday-name strip, the dates where the transient selected range overlaps the hidden previous week replace their weekday labels; this grows toward or away from the pointer according to the selected range rather than assuming one direction. Weekday labels and revealed dates occupy the same explicit seven-column row track, so changing between names and numbers cannot change grid height. Leaving the strip for any other cell immediately restores every weekday label without ending the drag.
- Releasing on a leading or trailing day from an adjacent month switches the calendar to that month.
- Off-screen endpoints appear as Start/End pills before or after the calendar. Pills retain their intrinsic width and height while sliding out from behind the calendar. When a month-chevron click moves a previously visible selection off-screen, the calendar stays anchored and only the newly required controls slide from beneath it. Outside that navigation transition, the calendar may move down to uncover Start or up to uncover End only when no endpoint control is already visible. Once any pill is shown, the calendar stays fixed and only a newly required control slides into the adjacent space. When an endpoint becomes visible, its pill remains full-size while the surrounding layout space closes and the intact button slides back underneath the calendar before removal. Clicking a pill jumps to its month with the same directional vertical name-and-number scroll.
- Clear returns to `null` and intentionally preserves the visible month.
- `value`/`onChange` supports controlled use; `defaultValue` supports uncontrolled use.
- `getDayCellProps` lets consumers add a class, inline style, or title from typed date and selection context without replacing the datepicker's interaction handlers.

## Install

The package expects Preact from the consuming application.

```sh
npm install @quno/datepicker preact
```

Import the component and the optional default stylesheet:

```tsx
import { QunoDatePicker } from '@quno/datepicker';
import '@quno/datepicker/styles.css';

<QunoDatePicker
  value={{ start: '2026-08-10', end: '2026-08-18' }}
  onChange={(range) => console.log(range)}
/>
```

Omit the stylesheet when a project wants to provide its complete presentation through the stable `data-slot` attributes or `classNames` API.

## Run locally

```sh
npm install
npm run dev
```

Verification commands:

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm run report:size
```

## Deploy the demo to Vercel

Import this repository into Vercel with the repository root as the project
directory. The checked-in `vercel.json` runs `npm run build:demo`, publishes
`demo-dist`, and preserves direct access to both `/` and `/story`.

To verify the deployable artifact locally:

```sh
npm run build:demo
```

The regular `npm run build` remains the library package build described below.

## Public API

```tsx
import { QunoDatePicker } from '@quno/datepicker';

<QunoDatePicker
  value={{ start: '2026-08-10', end: '2026-08-18' }}
  locale="de-DE"
  weekStartsOn={1}
  labels={{ clear: 'Zurücksetzen' }}
  className="booking-dates"
  classNames={{ day: 'booking-dates__day' }}
  getDayCellProps={({ isToday, isWeekend }) => ({
    className: isWeekend ? 'booking-dates__weekend' : undefined,
    style: isToday ? { color: '#d97706' } : undefined,
    title: isToday ? 'Today' : undefined,
  })}
  onChange={(range) => console.log(range)}
/>
```

Calendar dates stay as `YYYY-MM-DD` strings and all calendar arithmetic uses UTC fields, avoiding DST or timezone shifts.

The public entry exports:

- `QunoDatePicker` and its props, label, formatter, class-name, day-cell customization, slot, date-action, and interaction types.
- `DateRange`, `IsoDate`, `Endpoint`, `MonthDirection`, and `WeekStart` types.
- Pure date and selection helpers such as `calendarGrid`, `selectDate`, `dateActionContext`, `applyDateAction`, `editEndpoint`, and `moveRange` for custom adapters or headless integrations.

## Styling

The default stylesheet does not write theme values to `:root`. Every default is a local fallback, so a consumer can set tokens on a wrapper or directly on the component class:

```css
.booking-dates {
  --quno-picker-width: 100%;
  --quno-picker-day-size: 36px;
  --quno-picker-day-size-mobile: 34px;
  --quno-picker-font-family: "Source Sans 3", sans-serif;
  --quno-picker-primary: #6d28d9;
  --quno-picker-primary-soft: #ede9fe;
  --quno-picker-selection-surface: #ede9fe;
  --quno-picker-cycle-preview: #db2777;
  --quno-picker-pill-surface: #ede9fe;
  --quno-picker-pill-border: #6d28d9;
  --quno-picker-pill-text: #4c1d95;
  --quno-picker-pill-radius: 8px;
  --quno-picker-pill-shadow: 4px 4px 0 #db2777;
  --quno-picker-pills-direction: row;
  --quno-picker-pills-wrap: nowrap;
  --quno-picker-pills-gap: 6px;
  --quno-picker-text: #1f172a;
  --quno-picker-muted: #6b6475;
  --quno-picker-border: #ddd6e8;
  --quno-picker-surface: #fff;
  --quno-picker-calendar-radius: 8px;
  --quno-picker-day-radius: 4px;
}
```

Additional tokens cover disabled and outside-month text, the selection-summary surface, endpoint-pill colors/spacing/radius/shadow/type, before/after shadow offsets, and track direction/wrapping/alignment/gap, desktop/mobile day sizing, month-header spacing (`--quno-picker-month-header-gap`), the virtualized year-block height (`--quno-picker-year-navigation-year-height`), the cycle-preview outline (`--quno-picker-cycle-preview`), month-scroll duration/distance, and endpoint-pill reveal duration/distance (`--quno-picker-pill-reveal-duration` and `--quno-picker-pill-reveal-distance`). Start and End pills can also be targeted individually through `data-endpoint`. The `/story` theme switcher includes compact and large-day skins to exercise these contracts under tighter constraints. Inspect `QunoDatePicker.css` for the complete token list.

Every meaningful element also has a stable `data-slot` value, including `root`, `selection-header`, `clear-button`, `pills`, `pill`, `calendar`, `month-header`, `month-heading`, `month-heading-button`, `month-navigation`, `year-group`, `year-heading`, `month-option`, `weekdays`, `weekday`, `overflow-day`, `grid`, `day`, `handle`, and `hint`. The root exposes `data-pill-before` and `data-pill-after` while matching off-screen endpoints are present; pill containers expose `data-presence="entering|visible|exiting"`, and individual controls expose the same lifecycle through `data-item-presence`; the month heading and grid expose `data-month-motion="previous|next"`; the calendar exposes `data-view="dates|month-navigation"`; the active month option exposes `aria-current="date"`; the calendar and grid expose `data-dragging="move"` while a whole range, one-day selection, or endpoint is directly manipulated, and the grid exposes `data-interaction-active` for the complete pointer gesture; the weekday strip exposes `data-drag-active` and `data-drag-overflow`; date cells expose state through `data-selected`, `data-committed`, `data-range-start`, `data-range-end`, `data-outside`, `data-cycle-trigger`, and cycle-preview segment attributes.

For utility-class systems or CSS modules, pass project classes without replacing the built-in behavior classes:

```tsx
<QunoDatePicker
  classNames={{
    root: styles.root,
    calendar: styles.calendar,
    day: styles.day,
    pill: styles.pill,
  }}
/>
```

`getDayCellProps` runs for every visible date, including adjacent-month cells. Its context includes `date`, `weekday`, `isToday`, `isWeekend`, `isOutside`, `isSelected`, `isCommitted`, `isRangeStart`, and `isRangeEnd`. `isSelected` follows an active drag preview while `isCommitted` continues to describe the public value. The callback intentionally cannot replace pointer handlers, accessibility labels, or stable state attributes.

Passing an empty `labels.hint` omits the optional hint element, allowing a host layout to place interaction guidance elsewhere.

## Localization and formatting

`locale` controls the built-in `Intl.DateTimeFormat` output. All visible and accessible copy can be replaced with `labels`, and individual date, title, month-option, year, day-label, and weekday renderings can be replaced with `formatters`. `weekStartsOn` accepts weekday indices `0` through `6`, where `0` is Sunday.

## Package output

`npm run build` creates:

- `dist/quno-datepicker.js` — ESM library bundle without a bundled Preact runtime.
- `dist/quno-datepicker.css` — optional default theme.
- `dist/index.d.ts` and component/model declaration files — public TypeScript contracts.

The current production output is approximately 35.73 kB JavaScript (9.19 kB
gzip) plus 14.24 kB optional CSS (2.82 kB gzip). Preact is external. Run
`npm run report:size` after a build for current measured values.

The interactive demo remains available through `npm run dev`; it is not part of the published JavaScript entry.

## Deferred beyond V1

Natural-language parsing, presets, disabled-date constraints, long-press touch gestures, and pill editing/dragging are intentionally not included yet. Direct touch painting and dragging work on the date grid, and native button focus and activation work, but full arrow-key grid navigation and advanced touch handling remain follow-up work.
