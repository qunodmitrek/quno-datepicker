import clsx from 'clsx';
import {
  monthRelation,
  type DateRange,
  type IsoDate,
} from './dateRangeModel';
import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { JSX } from 'preact';

type Position = 'before' | 'after';

type Props = {
  selection: DateRange | null;
  visibleMonth: IsoDate;
  position: Position;
  config: ResolvedDatePickerConfig;
  onJump: (date: IsoDate) => void;
};

export const OffscreenPills = ({
  selection,
  visibleMonth,
  position,
  config,
  onJump,
}: Props): JSX.Element | null => {
  if (!selection) {
    return null;
  }

  const endpoints = [
    { endpoint: 'start' as const, date: selection.start },
    { endpoint: 'end' as const, date: selection.end },
  ];
  const items = endpoints.filter(
    ({ date }) => monthRelation(date, visibleMonth) === position,
  );
  if (!items.length) {
    return null;
  }

  const { labels, formatters, locale, classNames } = config;
  return (
    <div
      className={clsx(
        'quno-date-picker__pills',
        `quno-date-picker__pills--${position}`,
        classNames?.pills,
      )}
      data-slot="pills"
      data-position={position}
    >
      {items.map(({ endpoint, date }) => (
        <button
          key={`${endpoint}-${date}`}
          type="button"
          className={clsx('quno-date-picker__pill', classNames?.pill)}
          data-slot="pill"
          data-endpoint={endpoint}
          data-position={position}
          onClick={() => onJump(date)}
        >
          <span>{endpoint === 'start' ? labels.start : labels.end}</span>
          {formatters.date(date, locale)}
          <span aria-hidden="true">{position === 'before' ? '↑' : '↓'}</span>
        </button>
      ))}
    </div>
  );
};
