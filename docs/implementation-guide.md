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
calendar frame. Each year presents twelve months in a three-column, four-row
grid. The internal list adds more years when it reaches either scroll edge, but
starts with a 100-year runway in either direction. It waits for scrolling to
settle before extending the timeline so one iPhone flick cannot cascade through
decades. Virtualization keeps only the visible years and a small overscan buffer
mounted.

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
the rendered block and keeps its scroll spacers aligned.

## 9. Integrate with forms

The component returns one value object rather than hidden form controls. Adapt
it at the form boundary:

```tsx
<QunoDatePicker
  value={form.dates}
  onChange={(dates) => form.setFieldValue('dates', dates)}
/>
```

Validate required values and business constraints in the host. V1 does not
implement disabled-date rules, presets, or natural-language parsing.

## 10. Integration checklist

- Import Preact once in the host and the optional stylesheet once.
- Store `null` or an inclusive `{ start, end }` ISO-date range.
- Decide whether the host or component owns state.
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

The current V1 production build contains approximately:

- 35.96 kB JavaScript raw, 9.25 kB gzip.
- 14.43 kB optional CSS raw, 2.85 kB gzip.
- 12.02 kB gzip total when the default theme is used.
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
