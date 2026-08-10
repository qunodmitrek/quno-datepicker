import clsx from 'clsx';
import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { IsoDate, MonthDirection } from './dateRangeModel';
import type { JSX } from 'preact';

type Props = {
  visibleMonth: IsoDate;
  monthMotion: MonthDirection | null;
  config: ResolvedDatePickerConfig;
  onNavigate: (direction: MonthDirection) => void;
};

const Chevron = ({ direction }: { direction: MonthDirection }): JSX.Element => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path
      d={direction === -1 ? 'M10 3.5 5.5 8 10 12.5' : 'M6 3.5 10.5 8 6 12.5'}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.6"
    />
  </svg>
);

export const CalendarHeader = ({
  visibleMonth,
  monthMotion,
  config,
  onNavigate,
}: Props): JSX.Element => {
  const { labels, formatters, locale, classNames } = config;
  return (
    <div
      className={clsx(
        'quno-date-picker__month-header',
        classNames?.monthHeader,
      )}
      data-slot="month-header"
    >
      <button
        type="button"
        className={classNames?.previousButton}
        data-slot="previous-button"
        aria-label={labels.previousMonth}
        onClick={() => onNavigate(-1)}
      >
        <Chevron direction={-1} />
      </button>
      <h2
        className={classNames?.monthHeading}
        data-slot="month-heading"
        data-month-motion={
          monthMotion === -1
            ? 'previous'
            : monthMotion === 1
              ? 'next'
              : undefined
        }
      >
        <span key={visibleMonth}>{formatters.month(visibleMonth, locale)}</span>
      </h2>
      <button
        type="button"
        className={classNames?.nextButton}
        data-slot="next-button"
        aria-label={labels.nextMonth}
        onClick={() => onNavigate(1)}
      >
        <Chevron direction={1} />
      </button>
    </div>
  );
};
