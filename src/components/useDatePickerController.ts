import { useEffect, useRef, useState } from 'preact/hooks';
import {
  addMonths,
  calendarGrid,
  isInMonth,
  startOfMonth,
  todayIso,
  type DateRange,
  type IsoDate,
  type MonthDirection,
  type WeekStart,
} from './dateRangeModel';
import {
  advanceDateClickCycle,
  beginInteraction,
  finishInteraction,
  idle,
  updateInteraction,
  type DateClickCycle,
} from './datePickerInteraction';
import type { DatePickerInteraction } from './datePickerTypes';

type ControllerOptions = {
  value?: DateRange | null;
  defaultValue: DateRange | null;
  initialMonth?: IsoDate;
  weekStartsOn: WeekStart;
  autoNavigateDelay: number;
  autoNavigateRepeatDelay: number;
  onChange?: (value: DateRange | null) => void;
  onVisibleMonthChange?: (month: IsoDate) => void;
};

export type DatePickerController = {
  selection: DateRange | null;
  renderedSelection: DateRange | null;
  visibleMonth: IsoDate;
  interaction: DatePickerInteraction;
  gridDates: IsoDate[];
  weekdays: number[];
  beginDrag: (date: IsoDate) => void;
  enterDay: (date: IsoDate) => void;
  finishDrag: (date: IsoDate) => void;
  clear: () => void;
  navigate: (direction: MonthDirection) => void;
  startEdgeNavigation: (direction: MonthDirection) => void;
  stopEdgeNavigation: () => void;
  jumpToEndpoint: (date: IsoDate) => void;
};

export const useDatePickerController = ({
  value,
  defaultValue,
  initialMonth,
  weekStartsOn,
  autoNavigateDelay,
  autoNavigateRepeatDelay,
  onChange,
  onVisibleMonthChange,
}: ControllerOptions): DatePickerController => {
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selection = controlled ? value ?? null : internalValue;
  const [visibleMonth, setVisibleMonth] = useState(
    startOfMonth(initialMonth ?? selection?.start ?? todayIso()),
  );
  const [interaction, setInteraction] = useState<DatePickerInteraction>(idle());
  const [clickCycle, setClickCycle] = useState<DateClickCycle | null>(null);
  const edgeTimer = useRef<number | null>(null);

  const stopEdgeNavigation = (): void => {
    if (edgeTimer.current !== null) {
      window.clearTimeout(edgeTimer.current);
      edgeTimer.current = null;
    }
  };

  useEffect(() => stopEdgeNavigation, []);

  const commit = (nextValue: DateRange | null): void => {
    if (!controlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const changeMonth = (month: IsoDate): void => {
    setVisibleMonth(month);
    onVisibleMonthChange?.(month);
  };

  const navigate = (direction: MonthDirection): void => {
    setVisibleMonth((current) => {
      const next = addMonths(current, direction);
      onVisibleMonthChange?.(next);
      return next;
    });
    setClickCycle(null);
  };
  const dragSelection =
    interaction.type === 'create' ||
    interaction.type === 'drag-endpoint' ||
    interaction.type === 'drag-range'
      ? interaction.current
      : null;
  const renderedSelection = dragSelection ?? selection;

  const beginDrag = (date: IsoDate): void => {
    stopEdgeNavigation();
    setInteraction(beginInteraction(selection, date));
  };

  const enterDay = (date: IsoDate): void => {
    setInteraction((current) => updateInteraction(current, date));
  };

  const finishDrag = (date: IsoDate): void => {
    stopEdgeNavigation();
    const repeatedClick =
      clickCycle?.date === date &&
      interaction.type !== 'idle' &&
      !interaction.moved;
    if (repeatedClick) {
      const next = advanceDateClickCycle(clickCycle);
      setClickCycle(next.cycle);
      setInteraction(idle());
      if (next.changed) {
        commit(next.value);
      }
      return;
    }
    const result = finishInteraction(interaction, date);
    setInteraction(result.interaction);
    setClickCycle(result.cycle ?? null);
    if (result.value) {
      commit(result.value);
    }
    if (!isInMonth(date, visibleMonth)) {
      changeMonth(startOfMonth(date));
    }
  };

  const startEdgeNavigation = (direction: MonthDirection): void => {
    if (
      interaction.type !== 'create' &&
      interaction.type !== 'drag-endpoint' &&
      interaction.type !== 'drag-range'
    ) {
      return;
    }
    stopEdgeNavigation();
    const step = (): void => {
      navigate(direction);
      edgeTimer.current = window.setTimeout(step, autoNavigateRepeatDelay);
    };
    edgeTimer.current = window.setTimeout(step, autoNavigateDelay);
  };

  const clear = (): void => {
    stopEdgeNavigation();
    setInteraction(idle());
    setClickCycle(null);
    commit(null);
  };

  const jumpToEndpoint = (date: IsoDate): void => {
    stopEdgeNavigation();
    setInteraction(idle());
    setClickCycle(null);
    changeMonth(startOfMonth(date));
  };

  return {
    selection,
    renderedSelection,
    visibleMonth,
    interaction,
    gridDates: calendarGrid(visibleMonth, weekStartsOn),
    weekdays: Array.from({ length: 7 }, (_, index) => (weekStartsOn + index) % 7),
    beginDrag,
    enterDay,
    finishDrag,
    clear,
    navigate,
    startEdgeNavigation,
    stopEdgeNavigation,
    jumpToEndpoint,
  };
};
