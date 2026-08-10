import clsx from 'clsx';
import {
  isInMonth,
  isWithinRange,
  type DateRange,
  type IsoDate,
} from './dateRangeModel';
import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { JSX } from 'preact';

type Props = {
  dates: IsoDate[];
  visibleMonth: IsoDate;
  selection: DateRange | null;
  renderedSelection: DateRange | null;
  config: ResolvedDatePickerConfig;
  onBegin: (date: IsoDate) => void;
  onEnter: (date: IsoDate) => void;
  onFinish: (date: IsoDate) => void;
};

export const CalendarGrid = ({
  dates,
  visibleMonth,
  selection,
  renderedSelection,
  config,
  onBegin,
  onEnter,
  onFinish,
}: Props): JSX.Element => {
  const { labels, formatters, locale, classNames } = config;
  return (
    <div
      className={clsx('quno-date-picker__grid', classNames?.grid)}
      data-slot="grid"
      role="grid"
      aria-label={`${labels.calendar}: ${formatters.month(
        visibleMonth,
        locale,
      )}`}
    >
      {dates.map((date) => {
        const inVisibleMonth = isInMonth(date, visibleMonth);
        const committed = selection ? isWithinRange(date, selection) : false;
        const displayed = renderedSelection
          ? isWithinRange(date, renderedSelection)
          : false;
        const isStart = renderedSelection?.start === date;
        const isEnd = renderedSelection?.end === date;
        return (
          <button
            key={date}
            type="button"
            role="gridcell"
            className={clsx(
              'quno-date-picker__day',
              {
                'quno-date-picker__day--outside': !inVisibleMonth,
                'quno-date-picker__day--selected': displayed,
                'quno-date-picker__day--committed': committed,
                'quno-date-picker__day--start': isStart,
                'quno-date-picker__day--end': isEnd,
              },
              classNames?.day,
            )}
            data-slot="day"
            data-date={date}
            data-range-start={isStart ? 'true' : undefined}
            data-range-end={isEnd ? 'true' : undefined}
            data-outside={inVisibleMonth ? undefined : 'true'}
            data-selected={displayed ? 'true' : undefined}
            data-committed={committed ? 'true' : undefined}
            aria-label={formatters.dayLabel(date, locale)}
            aria-selected={committed}
            onPointerDown={(event) => {
              event.preventDefault();
              onBegin(date);
            }}
            onPointerEnter={() => onEnter(date)}
            onPointerUp={(event) => {
              event.preventDefault();
              onFinish(date);
            }}
          >
            <span>{Number(date.slice(-2))}</span>
            {(isStart || isEnd) && (
              <i
                className={clsx(
                  'quno-date-picker__handle',
                  classNames?.handle,
                )}
                data-slot="handle"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
