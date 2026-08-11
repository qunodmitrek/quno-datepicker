import clsx from 'clsx';
import {
  monthRelation,
  type DateRange,
  type IsoDate,
} from './dateRangeModel';
import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { MonthChangeSource } from './datePickerControllerTypes';
import type { JSX } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

type Position = 'before' | 'after';
type PillItem = {
  endpoint: 'start' | 'end';
  date: IsoDate;
};
type ItemPhase = 'entering' | 'visible' | 'exiting';
type CalendarReveal = 'moving' | 'stationary';
type RenderedPill = PillItem & {
  phase: ItemPhase;
  calendarReveal: CalendarReveal;
};

type Props = {
  selection: DateRange | null;
  visibleMonth: IsoDate;
  position: Position;
  monthChangeSource: MonthChangeSource | null;
  config: ResolvedDatePickerConfig;
  onJump: (date: IsoDate) => void;
};

export const OffscreenPills = ({
  selection,
  visibleMonth,
  position,
  monthChangeSource,
  config,
  onJump,
}: Props): JSX.Element | null => {
  const liveItems = useMemo(
    () =>
      selection
        ? [
            { endpoint: 'start' as const, date: selection.start },
            { endpoint: 'end' as const, date: selection.end },
          ].filter(
            ({ date }) => monthRelation(date, visibleMonth) === position,
          )
        : [],
    [position, selection, visibleMonth],
  );
  const [items, setItems] = useState<RenderedPill[]>(() =>
    liveItems.map((item) => ({
      ...item,
      phase: 'entering',
      calendarReveal: 'moving',
    })),
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousMonth = useRef(visibleMonth);

  useEffect(() => {
    const calendarReveal: CalendarReveal =
      previousMonth.current !== visibleMonth &&
      monthChangeSource === 'navigation'
        ? 'stationary'
        : 'moving';
    previousMonth.current = visibleMonth;
    setItems((current) => {
      const retained = current.map((rendered): RenderedPill => {
        const live = liveItems.find(
          ({ endpoint }) => endpoint === rendered.endpoint,
        );
        if (!live) return { ...rendered, phase: 'exiting' };
        return {
          ...live,
          phase: rendered.phase === 'exiting' ? 'entering' : rendered.phase,
          calendarReveal:
            rendered.phase === 'exiting'
              ? calendarReveal
              : rendered.calendarReveal,
        };
      });
      const additions = liveItems
        .filter(
          ({ endpoint }) =>
            !current.some((rendered) => rendered.endpoint === endpoint),
        )
        .map((item): RenderedPill => ({
          ...item,
          phase: 'entering',
          calendarReveal,
        }));
      return [...retained, ...additions];
    });
  }, [liveItems, monthChangeSource, visibleMonth]);

  const motionKey = items
    .map(({ endpoint, phase }) => `${endpoint}:${phase}`)
    .join('|');
  useEffect(() => {
    const moving = containerRef.current?.querySelector<HTMLElement>(
      '[data-item-presence="entering"], [data-item-presence="exiting"]',
    );
    if (!moving) return;
    const animationName = window.getComputedStyle(moving).animationName;
    if (!animationName || animationName === 'none') {
      setItems((current) =>
        current.flatMap((item) =>
          item.phase === 'exiting'
            ? []
            : [{ ...item, phase: 'visible' as const }],
        ),
      );
    }
  }, [motionKey]);

  if (!items.length) return null;

  const containerPhase = items.every(({ phase }) => phase === 'exiting')
    ? 'exiting'
    : items.some(({ phase }) => phase === 'visible')
      ? 'visible'
      : 'entering';
  const { labels, formatters, locale, classNames } = config;
  return (
    <div
      ref={containerRef}
      className={clsx(
        'quno-date-picker__pills',
        `quno-date-picker__pills--${position}`,
        classNames?.pills,
      )}
      data-slot="pills"
      data-position={position}
      data-presence={containerPhase}
      data-calendar-reveal={
        items.some(
          ({ phase, calendarReveal }) =>
            phase === 'entering' && calendarReveal === 'stationary',
        )
          ? 'stationary'
          : undefined
      }
      aria-hidden={containerPhase === 'exiting' || undefined}
    >
      <div className="quno-date-picker__pills-track">
        {items.map(({ endpoint, date, phase }) => (
          <button
            key={endpoint}
            type="button"
            className={clsx('quno-date-picker__pill', classNames?.pill)}
            data-slot="pill"
            data-endpoint={endpoint}
            data-position={position}
            data-item-presence={phase}
            aria-hidden={phase === 'exiting' || undefined}
            disabled={phase === 'exiting'}
            onClick={() => onJump(date)}
            onAnimationEnd={() => {
              setItems((current) =>
                current.flatMap((item) => {
                  if (item.endpoint !== endpoint || item.phase !== phase) {
                    return [item];
                  }
                  return phase === 'entering'
                    ? [{ ...item, phase: 'visible' }]
                    : [];
                }),
              );
            }}
          >
            <span>{endpoint === 'start' ? labels.start : labels.end}</span>
            {formatters.date(date, locale)}
            <span aria-hidden="true">{position === 'before' ? '↑' : '↓'}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
