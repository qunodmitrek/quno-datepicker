import type { JSX } from 'preact';
import { QunoDatePicker } from '../../index';

const exampleLabels = { hint: '' };

export const PaintExample = (): JSX.Element => (
  <QunoDatePicker
    className="story__picker"
    defaultValue={null}
    initialMonth="2026-08-01"
    labels={exampleLabels}
  />
);

export const SegmentMoveExample = (): JSX.Element => (
  <QunoDatePicker
    className="story__picker story__picker--warm"
    defaultValue={{ start: '2026-08-10', end: '2026-08-16' }}
    initialMonth="2026-08-01"
    labels={exampleLabels}
  />
);

export const BestGuessExample = (): JSX.Element => (
  <QunoDatePicker
    className="story__picker"
    defaultValue={null}
    initialMonth="2026-08-01"
    labels={exampleLabels}
  />
);

export const WrongGuessExample = (): JSX.Element => (
  <QunoDatePicker
    className="story__picker story__picker--violet"
    defaultValue={{ start: '2026-08-10', end: '2026-08-20' }}
    initialMonth="2026-08-01"
    labels={exampleLabels}
  />
);
