import { render, type JSX } from 'preact';
import { useState } from 'preact/hooks';
import {
  QunoDatePicker,
  type QunoDatePickerDayCellCustomizer,
} from '../components/QunoDatePicker';
import '../components/QunoDatePicker.css';
import './demo.css';
import type { DateRange } from '../components/dateRangeModel';

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

const App = (): JSX.Element => {
  const [selection, setSelection] = useState<DateRange | null>({
    start: '2026-08-10',
    end: '2026-08-18',
  });

  return (
    <main className="demo">
      <div className="demo__intro">
        <span className="demo__kicker">Quno Design System · Prototype</span>
        <h1>One calendar. Any period.</h1>
        <p>
          Click a day to adjust its contextual endpoint. Drag an endpoint to
          resize, drag the highlighted period to move it, or paint a new period
          from outside it.
        </p>
        <p className="demo__instruction">
          <strong>Click again</strong>
          Click the same date again to try the opposite endpoint, then reduce
          the selection to that single day.
        </p>
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

const root = document.getElementById('app');

if (root) {
  render(<App />, root);
}
