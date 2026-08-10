import clsx from 'clsx';
import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { IsoDate, MonthDirection } from './dateRangeModel';
import type { JSX } from 'preact';

type Props = {
  visibleMonth: IsoDate;
  config: ResolvedDatePickerConfig;
  onNavigate: (direction: MonthDirection) => void;
};

export const CalendarHeader = ({
  visibleMonth,
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
        ‹
      </button>
      <h2 className={classNames?.monthHeading} data-slot="month-heading">
        {formatters.month(visibleMonth, locale)}
      </h2>
      <button
        type="button"
        className={classNames?.nextButton}
        data-slot="next-button"
        aria-label={labels.nextMonth}
        onClick={() => onNavigate(1)}
      >
        ›
      </button>
    </div>
  );
};
