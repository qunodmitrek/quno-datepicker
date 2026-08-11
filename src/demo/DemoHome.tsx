import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import {
  QunoDatePicker,
  type DateRange,
  type QunoDatePickerDayCellCustomizer,
} from '../index';

const customizeDay: QunoDatePickerDayCellCustomizer = ({
  isToday,
  isWeekend,
}) => ({
  className: [
    isToday && 'demo__day--today',
    isWeekend && 'demo__day--weekend',
  ]
    .filter(Boolean)
    .join(' '),
  title: isToday ? 'Today' : isWeekend ? 'Weekend' : undefined,
});

export const DemoHome = (): JSX.Element => {
  const [selection, setSelection] = useState<DateRange | null>({
    start: '2026-08-10',
    end: '2026-08-18',
  });

  return (
    <main className="demo">
      <div className="demo__intro">
        <span className="demo__kicker">Quno Design System · Prototype</span>
        <h1>One calendar. Any period.</h1>
        <p className="demo__lede">
          Shape the selected period directly. Five small gestures cover every
          edit without switching modes.
        </p>
        <ul className="demo__actions" aria-label="Datepicker interactions">
          <li><strong>Click</strong><span>Adjust the closest endpoint.</span></li>
          <li>
            <strong>Click again</strong>
            <span>Try the other endpoint, then keep one day.</span>
          </li>
          <li>
            <strong>Drag an endpoint</strong>
            <span>Resize the period in either direction.</span>
          </li>
          <li>
            <strong>Drag the period</strong>
            <span>Move it by a few days or whole weeks.</span>
          </li>
          <li>
            <strong>Paint outside</strong>
            <span>Draw a completely new period.</span>
          </li>
        </ul>
        <a className="demo__story-link" href="/story">
          Explore the datepicker field guide →
        </a>
      </div>

      <QunoDatePicker
        value={selection}
        initialMonth="2026-08-01"
        labels={{ hint: '' }}
        getDayCellProps={customizeDay}
        onChange={setSelection}
      />
    </main>
  );
};
