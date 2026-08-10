# Quno Datepicker

A reusable, typed Preact library for single-calendar date and date-range selection. It provides a default Quno theme while keeping copy, formatting, week layout, and styling controlled by the consuming project.

## Project records

- `AGENTS.md` contains repository-wide instructions for implementation, documentation, scope, and verification.
- `DECISIONS.md` records accepted product and architecture decisions and their consequences.
- `CHANGELOG.md` records implementation history and verification results.

Update these records in the same change as the code they describe.

## V1 behavior

- The value is either `null` or a timezone-free `{ start, end }` ISO-date range.
- A one-day selection is represented by `start === end`.
- The first click on a date edits the contextual endpoint: Start before the range, End after it, or the nearest endpoint inside it. Ties resolve to End.
- Additional no-movement clicks on that same date advance through the opposite endpoint interpretation and then a one-day selection. Every result is derived from the range as it was before the first click, but that original context is discarded as soon as single day is reached—it never wraps back to the first guess. Clicking elsewhere also starts fresh, and any normalized no-op role is skipped automatically.
- No date-action menu is rendered. Passive hover does not calculate or highlight a possible period and never selects, calls `onChange`, or navigates to another month.
- Drag either endpoint to resize. Crossing automatically swaps endpoint identity.
- Selected endpoints have no default underline or handle decoration; the stable `handle` slot remains available for consumer-defined styling.
- Drag inside the selected period to move it by snapped calendar days without changing duration.
- Holding a drag at either month edge navigates after a 400 ms delay and repeats while held.
- Every view starts with only the weekday-aligned leading dates needed for the current month; it does not force an extra previous-month week. During a drag, moving backward across the weekday-name strip progressively reveals the hidden dates from the hovered target through the end of that previous week. Weekday labels and revealed dates occupy the same explicit seven-column row track, so changing between names and numbers cannot change grid height. Leaving the strip for any other cell immediately restores every weekday label without ending the drag. At least one trailing next-month week remains visible.
- Releasing on a leading or trailing day from an adjacent month switches the calendar to that month.
- Off-screen endpoints appear as pills before or after the calendar; clicking one jumps to its month.
- Clear returns to `null` and intentionally preserves the visible month.
- `value`/`onChange` supports controlled use; `defaultValue` supports uncontrolled use.

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
```

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
  onChange={(range) => console.log(range)}
/>
```

Calendar dates stay as `YYYY-MM-DD` strings and all calendar arithmetic uses UTC fields, avoiding DST or timezone shifts.

The public entry exports:

- `QunoDatePicker` and its props, label, formatter, class-name, slot, date-action, and interaction types.
- `DateRange`, `IsoDate`, `Endpoint`, `MonthDirection`, and `WeekStart` types.
- Pure date and selection helpers such as `calendarGrid`, `selectDate`, `dateActionContext`, `applyDateAction`, `editEndpoint`, and `moveRange` for custom adapters or headless integrations.

## Styling

The default stylesheet does not write theme values to `:root`. Every default is a local fallback, so a consumer can set tokens on a wrapper or directly on the component class:

```css
.booking-dates {
  --quno-picker-width: 100%;
  --quno-picker-font-family: "Source Sans 3", sans-serif;
  --quno-picker-primary: #6d28d9;
  --quno-picker-primary-soft: #ede9fe;
  --quno-picker-text: #1f172a;
  --quno-picker-muted: #6b6475;
  --quno-picker-border: #ddd6e8;
  --quno-picker-surface: #fff;
  --quno-picker-calendar-radius: 8px;
  --quno-picker-day-radius: 4px;
}
```

Additional tokens cover disabled and outside-month text, pill colors, shadows, and day sizing. Inspect `QunoDatePicker.css` for the complete token list.

Every meaningful element also has a stable `data-slot` value, including `root`, `selection-header`, `clear-button`, `pills`, `pill`, `calendar`, `month-header`, `month-heading`, `weekdays`, `weekday`, `overflow-day`, `grid`, `day`, `handle`, and `hint`. The weekday strip exposes `data-drag-active` and `data-drag-overflow`; date cells expose state through `data-selected`, `data-committed`, `data-range-start`, `data-range-end`, and `data-outside`.

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

## Localization and formatting

`locale` controls the built-in `Intl.DateTimeFormat` output. All visible and accessible copy can be replaced with `labels`, and individual date, month, day-label, and weekday renderings can be replaced with `formatters`. `weekStartsOn` accepts weekday indices `0` through `6`, where `0` is Sunday.

## Package output

`npm run build` creates:

- `dist/quno-datepicker.js` — ESM library bundle without a bundled Preact runtime.
- `dist/quno-datepicker.css` — optional default theme.
- `dist/index.d.ts` and component/model declaration files — public TypeScript contracts.

The interactive demo remains available through `npm run dev`; it is not part of the published JavaScript entry.

## Deferred beyond V1

Natural-language parsing, presets, disabled-date constraints, long-press touch gestures, and pill editing/dragging are intentionally not included yet. Native button focus and activation work, but full arrow-key grid navigation and advanced touch handling remain follow-up work.
