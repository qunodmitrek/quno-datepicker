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
import { useDayPointer } from './useDayPointer';
import type { JSX } from 'preact';

type Props = {
  dates: IsoDate[];
  visibleMonth: IsoDate;
  monthMotion: MonthDirection | null;
  movingSelection: boolean;
  interactionActive: boolean;
  cycleDate: IsoDate | null;
  cyclePreview: DateRange | null;
  selection: DateRange | null;
  renderedSelection: DateRange | null;
  config: ResolvedDatePickerConfig;
  onBegin: (date: IsoDate) => void;
  onEnter: (date: IsoDate) => void;
  onFinish: (date: IsoDate) => void;
  onCancel: () => void;
  onOverflowChange: (index: number | null) => void;
};

export const CalendarGrid = ({
  dates,
  visibleMonth,
  monthMotion,
  movingSelection,
  interactionActive,
  cycleDate,
  cyclePreview,
  selection,
  renderedSelection,
  config,
  onBegin,
  onEnter,
  onFinish,
  onCancel,
  onOverflowChange,
}: Props): JSX.Element => {
  const { labels, formatters, locale, classNames, getDayCellProps } = config;
  const today = todayIso();
  const pointer = useDayPointer({
    interactionActive,
    begin: onBegin,
    enter: ({ date, overflowIndex }) => {
      onOverflowChange(overflowIndex);
      onEnter(date);
    },
    finish: ({ date }) => {
      onOverflowChange(null);
      onFinish(date);
    },
    cancel: () => {
      onOverflowChange(null);
      onCancel();
    },
  });
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
      {dates.map((date, index) => {
        const inVisibleMonth = isInMonth(date, visibleMonth);
        const committed = selection ? isWithinRange(date, selection) : false;
        const displayed = renderedSelection
          ? isWithinRange(date, renderedSelection)
          : false;
        const isStart = renderedSelection?.start === date;
        const isEnd = renderedSelection?.end === date;
        const inCyclePreview = cyclePreview
          ? isWithinRange(date, cyclePreview)
          : false;
        const previewRowStart =
          inCyclePreview &&
          (index % 7 === 0 ||
            !cyclePreview ||
            !isWithinRange(dates[index - 1], cyclePreview));
        const previewRowEnd =
          inCyclePreview &&
          (index % 7 === 6 ||
            !cyclePreview ||
            !isWithinRange(dates[index + 1], cyclePreview));
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
            data-cycle-trigger={cycleDate === date ? 'true' : undefined}
            data-cycle-preview={inCyclePreview ? 'true' : undefined}
            data-cycle-preview-start={previewRowStart ? 'true' : undefined}
            data-cycle-preview-end={previewRowEnd ? 'true' : undefined}
            data-cycle-preview-range-start={
              cyclePreview?.start === date ? 'true' : undefined
            }
            data-cycle-preview-range-end={
              cyclePreview?.end === date ? 'true' : undefined
            }
            data-range-start={isStart ? 'true' : undefined}
            data-range-end={isEnd ? 'true' : undefined}
            data-outside={inVisibleMonth ? undefined : 'true'}
            data-selected={displayed ? 'true' : undefined}
            data-committed={committed ? 'true' : undefined}
            aria-label={formatters.dayLabel(date, locale)}
            aria-selected={committed}
            onPointerDown={(event) => {
              onOverflowChange(null);
              pointer.beginPointer(event, date);
            }}
            onPointerMove={pointer.movePointer}
            onPointerEnter={() => {
              onOverflowChange(null);
              onEnter(date);
            }}
            onPointerUp={(event) => pointer.finishPointer(event, date)}
            onPointerCancel={pointer.cancelPointer}
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
