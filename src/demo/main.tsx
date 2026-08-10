import { render, type JSX } from 'preact';
import { useState } from 'preact/hooks';
import { QunoDatePicker } from '../components/QunoDatePicker';
import '../components/QunoDatePicker.css';
import './demo.css';
import type { DateRange } from '../components/dateRangeModel';

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
          Click a day to adjust the contextual endpoint, then click that same
          day again to cycle its role. Drag an endpoint to resize, or drag the
          highlighted period to move it without changing its duration.
        </p>
        <pre>{selection ? JSON.stringify(selection, null, 2) : 'null'}</pre>
      </div>

      <QunoDatePicker
        value={selection}
        initialMonth="2026-08-01"
        onChange={setSelection}
      />
    </main>
  );
};

const root = document.getElementById('app');

if (root) {
  render(<App />, root);
}
