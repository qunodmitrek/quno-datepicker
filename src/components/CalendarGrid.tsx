import clsx from 'clsx';
import {
  fromIsoDate,
  isInMonth,
  isWithinRange,
  todayIso,
  type DateRange,
  type IsoDate,
  type MonthDirection,
} from './dateRangeModel';
import type {
  QunoDatePickerDayCellContext,
  ResolvedDatePickerConfig,
} from './datePickerTypes';
import type { JSX } from 'preact';

type Props = {
  dates: IsoDate[];
  visibleMonth: IsoDate;
  monthMotion: MonthDirection | null;
  movingSelection: boolean;
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
  monthMotion,
  movingSelection,
  selection,
  renderedSelection,
  config,
  onBegin,
  onEnter,
  onFinish,
}: Props): JSX.Element => {
  const { labels, formatters, locale, classNames, getDayCellProps } = config;
  const today = todayIso();
  return (
    <div
      className={clsx('quno-date-picker__grid', classNames?.grid)}
      data-slot="grid"
      data-dragging={movingSelection ? 'move' : undefined}
      data-month-motion={
        monthMotion === -1 ? 'previous' : monthMotion === 1 ? 'next' : undefined
      }
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
        const weekday = fromIsoDate(
          date,
        ).getUTCDay() as QunoDatePickerDayCellContext['weekday'];
        const customProps = getDayCellProps?.({
          date,
          weekday,
          isToday: date === today,
          isWeekend: weekday === 0 || weekday === 6,
          isOutside: !inVisibleMonth,
          isSelected: displayed,
          isCommitted: committed,
          isRangeStart: isStart,
          isRangeEnd: isEnd,
        });
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
              customProps?.className,
            )}
            style={customProps?.style}
            title={customProps?.title}
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
