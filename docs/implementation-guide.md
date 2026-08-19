# Quno Datepicker Implementation Guide

This guide is the copyable integration contract for `@quno/datepicker`. The
interactive companion lives at `/story` when this repository runs locally.

## 1. Install the library

The datepicker uses Preact from the host application and does not bundle a
second framework runtime.

```sh
npm install @quno/datepicker preact
```

Import behavior and the optional default theme separately:

```tsx
import {
  QunoDatePicker,
  type DateRange,
  type WeekStart,
} from '@quno/datepicker';
import '@quno/datepicker/styles.css';
```

Omit the CSS import when the product supplies the complete presentation.

## 2. Choose controlled or uncontrolled state

Use controlled state when another form, URL, or application store owns the
value:

```tsx
const [dates, setDates] = useState<DateRange | null>(null);

<QunoDatePicker value={dates} onChange={setDates} />;
```

Use `defaultValue` when the component can own its state:

```tsx
<QunoDatePicker
  defaultValue={{ start: '2026-08-10', end: '2026-08-18' }}
  onChange={(dates) => analytics.track('dates_changed', dates)}
/>
```

Do not pass `value` and `defaultValue` together. `null` means empty. A single
day is `{ start: date, end: date }`; there is no second single-date value type.

## 3. Keep dates timezone-free

Public dates use `YYYY-MM-DD`. Treat them as calendar values rather than
timestamps. Do not construct them by slicing a local `Date.toISOString()` when
the local calendar day matters.

```tsx
const value: DateRange = {
  start: '2026-08-10',
  end: '2026-08-18',
};
```

The exported model helpers use UTC calendar fields for arithmetic and avoid DST
date shifts.

## 4. Set the initial view independently

`initialMonth` chooses the first visible month without changing the selection.
Navigation also leaves the value untouched.

```tsx
<QunoDatePicker
  defaultValue={{ start: '2026-07-20', end: '2026-09-12' }}
  initialMonth="2026-08-01"
  onVisibleMonthChange={(month) => saveCalendarPosition(month)}
/>
```

Only one month is rendered. Start and End controls represent endpoints outside
that view and jump to their months. If a month-chevron click moves a selection
that was visible into an off-screen position, the calendar stays anchored while
the newly required controls slide from beneath it.

### Jump across months and years

Clicking the month-and-year heading opens a quick-jump view inside the same
calendar frame. A sticky year rail sits to the left of a separate three-column
month grid containing only the labeled calendar year. January and February
begin its first row, March through November fill complete three-month rows, and
December occupies a separate final row. Month names and sticky year labels
alternate in a distinct, theme-coordinated text color by calendar year. The
internal list starts with a 100-year runway in
either direction and adds more years when it reaches either scroll edge.
Consecutive year blocks retain only an eight-pixel gutter between their month
grids. The list waits for scrolling to settle before extending the timeline so
one iPhone flick cannot cascade through decades. Virtualization keeps only the
visible years and a small overscan buffer mounted.

The current month remains in the fixed header with its previous and next
buttons. Choosing a month, using either header button, or jumping through an
off-screen Start/End shortcut navigates there and restores the six-week day
grid. Clicking the heading again or pressing Escape closes without navigating.
Navigation calls `onVisibleMonthChange` but does not change the selected range
or call `onChange`.

## 5. Let the interaction model do the editing

A first click edits the contextual endpoint. Repeated clicks on the same date
try the opposite endpoint interpretation and then a one-day range. Hovering
that repeated-click date outlines the next result without committing it.

Pointer gestures are direct manipulation:

- Drag Start or End to resize; crossing swaps endpoint identity.
- Drag inside the selected period to move it without changing duration.
- Drag outside the period to paint a new range.
- Hold at a month edge to continue the drag after delayed navigation.
- Release on an adjacent-month date to move the visible calendar there.

The same paint, resize, and move gestures accept direct touch. On iPhone the
grid resolves the date currently beneath the finger rather than the element
that received the initial touch, so implicit pointer capture does not collapse
a painted range back to its starting day. Repeated raw moves within one date do
not rerender the preview, and a brief hit-test gap retains the last valid date.
Day-color transitions pause until release, preventing earlier transient
endpoints from lingering outside the range. Page scrolling remains available
outside the date grid. Moving the captured finger into a weekday label reveals
that hidden previous-week date through the same typed drag model. Returning to
the normal grid clears the projection; releasing on the hidden date commits it
and navigates to its month.

Only one pointer gesture owns the interaction at a time: painting, endpoint
resizing, or whole-range movement. That separation prevents a resize from
turning into a new range or a range move from also editing an endpoint. Pointer
release returns the calendar to its resting state.

`onChange` runs only for committed clicks, releases, or Clear—not for hover.

## 6. Localize every visible string

`locale` controls built-in `Intl.DateTimeFormat` output. `labels`, `formatters`,
and `weekStartsOn` let the product replace the defaults.

```tsx
<QunoDatePicker
  locale="de-DE"
  weekStartsOn={1}
  labels={{
    clear: 'Löschen',
    selectedPeriod: 'Ausgewählter Zeitraum',
  }}
  formatters={{
    month: (date) => productMonthLabel(date),
  }}
/>
```

The month heading always occupies one reserved line so navigation cannot change
the calendar height. A custom month label that is wider than the available
space is truncated with an ellipsis instead of wrapping onto a second line.

Keep formatter functions stable when they are created inside a component.
The quick jump uses `labels.openMonthNavigation`, `closeMonthNavigation`, and
`monthNavigation`, plus `formatters.monthOption` and `formatters.year`.

### Choose the first day of the week

`weekStartsOn` is independent from `locale`, so products can follow regional,
organizational, or user preferences explicitly. Use `0` for Sunday through `6`
for Saturday. Changing it realigns weekday labels and date cells without
changing the selected range or visible month.

```tsx
const [weekStartsOn, setWeekStartsOn] = useState<WeekStart>(1);

<QunoDatePicker
  value={dates}
  weekStartsOn={weekStartsOn}
  onChange={setDates}
/>
```

## 7. Customize dates without replacing behavior

Use `getDayCellProps` for product-specific presentation such as Today,
weekends, holidays, or availability hints. It cannot replace interaction or
accessibility handlers.

```tsx
const styleDay: QunoDatePickerDayCellCustomizer = ({
  isToday,
  isWeekend,
  isSelected,
}) => ({
  className: isWeekend ? 'booking-date--weekend' : undefined,
  style: isToday ? { color: '#d97706' } : undefined,
  title: isSelected ? 'Inside selected period' : undefined,
});

<QunoDatePicker getDayCellProps={styleDay} />;
```

The callback also receives committed state, visible-month membership, weekday,
and rendered endpoint flags.

## 8. Apply a product theme

Set component-scoped tokens on `className` or a wrapper:

```css
.booking-dates {
  --quno-picker-width: min(100%, 320px);
  --quno-picker-day-size: 36px;
  --quno-picker-day-size-mobile: 34px;
  --quno-picker-primary: #6d28d9;
  --quno-picker-primary-soft: #f0e8ff;
  --quno-picker-selection-surface: #f0e8ff;
  --quno-picker-cycle-preview: #db2777;
  --quno-picker-pill-surface: #f0e8ff;
  --quno-picker-pill-border: #6d28d9;
  --quno-picker-pill-text: #4c1d95;
  --quno-picker-pill-radius: 8px;
  --quno-picker-pill-shadow: 4px 4px 0 #db2777;
  --quno-picker-pills-direction: row;
  --quno-picker-pills-wrap: nowrap;
  --quno-picker-pills-gap: 6px;
  --quno-picker-text: #21172f;
  --quno-picker-calendar-radius: 12px;
  --quno-picker-day-radius: 6px;
}
```

```tsx
<QunoDatePicker className="booking-dates" />
```

For deeper styling, use `classNames` or stable `data-slot` attributes. Preserve
the documented state attributes when styling selection, dragging, month motion,
endpoint-pill presence, weekday overflow, and repeated-click previews.
Individual endpoint controls expose `data-endpoint="start|end"` when a design
needs to distinguish them. Pill gap, padding, border width, font size, and label
weight also have component-scoped `--quno-picker-pill-*` tokens. Constrained
layouts can set `--quno-picker-pills-direction`, `-wrap`, `-align`, and `-gap` while
retaining each control at full size. Themes with solid vertical shadows can use
`--quno-picker-pill-offset-before` and `--quno-picker-pill-offset-after` to
place stable controls beyond those painted shadow areas.

If month-option content needs a different block height, set
`--quno-picker-year-navigation-year-height`; the quick-jump virtualizer measures
the rendered block and keeps its scroll spacers aligned. Use
`--quno-picker-year-navigation-label-width` for the sticky year rail and
`--quno-picker-even-year-text` for the alternating year-and-month text tone.

## 9. Integrate with forms

The component returns one value object rather than hidden form controls. Adapt
it at the form boundary:

```tsx
<QunoDatePicker
  value={form.dates}
  onChange={(dates) => form.setFieldValue('dates', dates)}
/>
```

Validate required values and business constraints in the host. The input does
not implement disabled-date rules or presets.

## 10. Add a natural date or range input

`QunoDateInput` is an opt-in family member of `QunoDatePicker`: it shares the
same controlled `DateRange`, but has its own import so picker-only products do
not load its parser. Connect both through the same controlled state when a form
needs typing and calendar selection to stay synchronized:

```tsx
import { useState } from 'preact/hooks';
import { QunoDatePicker, type DateRange } from '@quno/datepicker';
import { QunoDateInput } from '@quno/datepicker/date-input';
import '@quno/datepicker/date-input/styles.css';

const [dates, setDates] = useState<DateRange | null>(null);
const expectedRange = { start: '2025-08-19', end: '2026-08-19' };

<QunoDateInput value={dates} onChange={setDates} expectedRange={expectedRange} />
<QunoDatePicker value={dates} onChange={setDates} />
```

For a compact disclosure-style control, keep `QunoDateInput` as the period
button itself and show the picker in a host-owned popover when the input gains
focus. This keeps a stable, keyboard-accessible entry point while the two
components share the same controlled value. Its input exposes
`data-recognition="recognized|unrecognized"` for a focused border treatment;
an invalid commit remains accessible through `aria-invalid` without introducing
an error label inside or below the compact control:

```tsx
<div className="period-popover">
  <QunoDateInput
    value={dates}
    onChange={setDates}
    expectedRange={expectedRange}
    placeholder="Choose a period"
  />
  {open && <QunoDatePicker value={dates} onChange={setDates} />}
</div>
```

For standalone use, pass `defaultValue` instead of `value`. `expectedRange` is
a ranking hint, not a constraint: it supplies likely omitted years and makes
`12/14` resolve to the in-window date. `referenceDate` defaults to the local
calendar date; pass it explicitly for deterministic tests or server rendering.

Use `preferredDateOrder="dmy"`, `"mdy"`, or `"ymd"` when a product’s
numeric convention should win over its display locale. Its default is `"locale"`.
The expected window remains the higher-priority ambiguity hint.

Set `parserLanguages={['en', 'de']}` to recognize both built-in vocabularies in
one input. That option takes precedence over `parserLanguage`; `locale` remains
the choice for localized output, so an English-formatted field can still accept
`12 juni`.

The dependency-free parser accepts numeric dates, English/German full or
abbreviated month names, absolute ranges (` – `, ` to `, ` bis `, or spaced
hyphen), and a bounded relative vocabulary: today/heute, yesterday/gestern,
tomorrow/morgen, English this day/month/year, English next day/week/month/year
with an optional positive count, last/past N days,
weeks, months, or years, bare English
durations such as `90 days` and `3 months`, English `N days ago`, and singular
`day ago`, `month ago`, or `year ago` (each defaults to one). Relative
“last” values are completed periods; bare and `past` periods include today and
extend back by the requested calendar unit. `N days ago` is a single date and
can be mixed with an absolute endpoint, such as `22.07 - 7 days ago`. It
interprets `this day` as today and `next day` as tomorrow; `next week` is the
next Monday–Sunday calendar week, while next month/year values (including
`next 2 months`) cover complete calendar periods. It deliberately does not guess
misspellings or support multi-unit `next`/`this`
periods, multi-month `ago`, presets, or business constraints.

Enter and blur commit a recognized value and rewrite it with the localized long
formatter. Clearing commits `null`. Invalid and incomplete text stays in the
field with `aria-invalid`; the last committed value remains untouched. When a
first date is followed by a range delimiter, the input immediately canonicalizes
that prefix and keeps the caret at the end, but emits only after the second date
commits. Deleting that generated delimiter does not recreate it, so the first
date remains an ordinary editable draft. Parsing is paused while an IME
composition is active. A numeric year must use two or four digits; a
three-digit editing intermediate remains unrecognized.

Arrow Up and Arrow Down edit a recognized draft at the caret, without emitting
until Enter or blur. A duration number changes by one (with a minimum of one),
a duration unit rotates day → week → month → year, and a recognized single date
changes its day, month, or year when the caret is on that corresponding field.
For a range, the corresponding field before the delimiter edits Start and the
one after it edits End. If that edit crosses the other endpoint, the formatted
dates exchange places and the caret follows the edited token to its new side.
If an Arrow edit makes its endpoints equal, the focused draft still renders both
endpoints; Enter or blur canonicalizes it to the ordinary one-date display.
If an Arrow edit shortens the active token, the visible caret clamps to its end
while the input retains its logical in-token offset. A later edit that lengthens
the same token restores that original position.

The parser is also available without the component:

```ts
import { parseDateInput } from '@quno/datepicker/date-input';

const result = parseDateInput('letzte 2 monate', {
  expectedRange,
  referenceDate: '2026-08-19',
  parserLanguage: 'de',
});
// { status: 'success', value: { start: '2026-06-01', end: '2026-07-31' } }
```

`parseDateInput` returns `success`, `partial-range`, `empty`, or `invalid`.
Use `tokenizeDateInput` when an adapter needs the typed number, word,
date-separator, and range-separator tokens. Override the long output with
`formatter={{ range }}` and extend the bounded dictionary with `lexicon`.

## 11. Integration checklist

- Import Preact once in the host and the optional stylesheet once.
- Store `null` or an inclusive `{ start, end }` ISO-date range.
- Decide whether the host or component owns state.
- Give natural input an expected date window and share controlled state with the
  calendar when both are used.
- Choose `initialMonth`, locale, week start, labels, and formatting.
- Apply product tokens and day-cell presentation hooks.
- Verify click cycling, endpoint crossing, whole-range dragging, Clear, and
  off-screen endpoint navigation in the product layout.
- Verify the heading toggle, long-distance month jump, in-place year scroll,
  and date-view restoration from chevrons and Start/End shortcuts.
- Verify direct touch painting in the product layout. Long-press conventions,
  other advanced touch gestures, and complete arrow-key grid navigation remain
  deferred.

## Why this differs from a conventional range picker

The component is designed around editing a period that already exists, not
around coordinating two date inputs. It keeps one calendar visible, represents
single-day and multi-day values with one type, and treats click, endpoint drag,
whole-range movement, and new-range painting as transformations of that value.

That removes several common sources of range-picker friction: there is no
required From-then-To sequence, a single day needs one click, editing does not
restart the range, and repeating a contextual click corrects an unwanted
endpoint guess. The fixed six-week view, trailing context row, hidden prior
week, and equivalent direct-touch gestures keep those edits spatially stable
across month boundaries and mobile layouts.

This is especially useful when users revise ranges repeatedly or work with long
periods. Off-screen endpoint controls preserve context without a second month.
Committed state remains separate from hover and drag previews, so the host does
not receive speculative values.

The tradeoff is intentional: products that require simultaneous visual
comparison of two distant months may still prefer a two-panel picker.

## Production footprint

The current production build keeps the family members separate:

- Picker: 35.60 kB JavaScript raw, 9.20 kB gzip; 15.02 kB optional CSS raw, 2.96 kB gzip.
- Natural input: 21.71 kB JavaScript raw, 6.50 kB gzip; 0.80 kB optional CSS raw, 0.35 kB gzip.
- Import the natural-input entry only for fields that need typed recognition.
- No bundled Preact runtime; Preact remains a peer dependency.

Run `npm run build` and then `npm run report:size` to measure the current
artifacts. The interactive story and repository demo are not part of the
published JavaScript bundle.

## Interactive story exhibits

Run `npm run dev` and open `/story`. Each important product contract has its
own live datepicker rather than relying on screenshots:

1. Paint a new period and drag its endpoints, paired with basic controlled usage.
2. Navigate months inside a fixed six-week frame.
3. Open the month-and-year title, scroll across years, and choose a month
   without leaving the fixed calendar frame or changing selection.
4. Drag into weekday names to reveal the hidden previous-week dates.
5. Move a complete selected segment while preserving duration.
6. Build a single day, extend it, and edit a range through contextual guessing.
7. Correct a guess inline through repeated clicks and next-result outlining.
8. Jump between off-screen Start and End shortcuts.
9. Compare directional micro-animation with a reduced-motion presentation.
10. Style Today, weekends, and non-working dates through `getDayCellProps`, with
   the typed callback recipe beside the live result.
11. Inspect French month, date, weekday, and control-label localization with a
    Monday-first week, paired with a copyable locale and labels recipe.
12. Switch between Sunday-, Monday-, and Saturday-first layouts while the
    selected range and visible month remain unchanged.
13. Switch component-scoped geometry, color, radius, surface, and motion tokens
    across five skins—including 300px compact and large-day constrained
    examples—with the scoped CSS recipe beside the switcher. Every custom skin
    also demonstrates a contrasting repeated-click preview outline and themed
    Start/End pills after month navigation; Candy additionally matches its
    summary surface to its selected-day fill.
14. Use one compact natural period field for numeric, English/German relative,
    and partial-range values. Focusing it opens a shared-state calendar popover;
    highlighted examples show the accepted grammar, while Arrow Up/Down previews
    recognized edits without replacing the committed calendar selection.
