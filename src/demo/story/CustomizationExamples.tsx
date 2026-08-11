import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import {
  QunoDatePicker,
  type QunoDatePickerDayCellCustomizer,
} from '../../index';

const businessDay: QunoDatePickerDayCellCustomizer = ({
  isToday,
  isWeekend,
  weekday,
}) => ({
  className: [
    isToday && 'story__day--today',
    isWeekend && 'story__day--weekend',
    weekday === 3 && 'story__day--non-working',
  ]
    .filter(Boolean)
    .join(' '),
  title: isToday
    ? 'Today'
    : weekday === 3
      ? 'Non-working day'
      : isWeekend
        ? 'Weekend'
        : undefined,
});

export const DayHandlerExample = (): JSX.Element => (
  <div className="story__controlled-example">
    <div className="story__legend" aria-label="Day style legend">
      <span data-kind="today">Today</span>
      <span data-kind="weekend">Weekend</span>
      <span data-kind="off">Non-working</span>
    </div>
    <QunoDatePicker
      className="story__picker"
      defaultValue={{ start: '2026-08-10', end: '2026-08-18' }}
      initialMonth="2026-08-01"
      labels={{ hint: '' }}
      getDayCellProps={businessDay}
    />
  </div>
);

export const ThemeExample = (): JSX.Element => {
  const [theme, setTheme] = useState('quno');
  return (
    <div className="story__controlled-example">
      <div className="story__controls" aria-label="Datepicker theme">
        {['quno', 'warm', 'violet'].map((option) => (
          <button
            key={option}
            aria-label={`${option} theme`}
            aria-pressed={theme === option}
            onClick={() => setTheme(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <QunoDatePicker
        className={`story__picker story__theme--${theme}`}
        defaultValue={{ start: '2026-08-10', end: '2026-08-18' }}
        initialMonth="2026-08-01"
        labels={{ hint: '' }}
      />
    </div>
  );
};
