import { useEffect, useRef, useState } from 'preact/hooks';
import {
  addMonths,
  calendarGrid,
  compareDates,
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
import type {
  DatePickerController,
  MonthChangeSource,
} from './datePickerControllerTypes';
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
  const [monthMotion, setMonthMotion] = useState<MonthDirection | null>(null);
  const [monthChangeSource, setMonthChangeSource] =
    useState<MonthChangeSource | null>(null);
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

  const resetInteraction = (): void => {
    stopEdgeNavigation();
    setInteraction(idle());
    setClickCycle(null);
  };

  const commit = (nextValue: DateRange | null): void => {
    if (!controlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const changeMonth = (
    month: IsoDate,
    motion: MonthDirection | null = null,
    source: MonthChangeSource = 'interaction',
  ): void => {
    setMonthMotion(motion);
    setMonthChangeSource(source);
    setVisibleMonth(month);
    onVisibleMonthChange?.(month);
  };

  const navigateFrom = (
    direction: MonthDirection,
    source: MonthChangeSource,
  ): void => {
    setMonthMotion(direction);
    setMonthChangeSource(source);
    setVisibleMonth((current) => {
      const next = addMonths(current, direction);
      onVisibleMonthChange?.(next);
      return next;
    });
    setClickCycle(null);
  };
  const navigate = (direction: MonthDirection): void =>
    navigateFrom(direction, 'navigation');
  const goTo = (month: IsoDate, source: MonthChangeSource): void => {
    resetInteraction();
    const target = startOfMonth(month);
    if (target === visibleMonth) {
      setMonthMotion(null);
      return;
    }
    const direction = compareDates(target, visibleMonth) < 0 ? -1 : 1;
    changeMonth(target, direction, source);
  };
  const goToMonth = (month: IsoDate): void => goTo(month, 'navigation');
  const dragSelection =
    interaction.type === 'idle' ? null : interaction.current;
  const renderedSelection = dragSelection ?? selection;
  const cycleDate = clickCycle?.date ?? null;
  const cyclePreview = clickCycle
    ? advanceDateClickCycle(clickCycle).value
    : null;

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
      const direction = compareDates(date, visibleMonth) < 0 ? -1 : 1;
      changeMonth(startOfMonth(date), direction, 'interaction');
    }
  };

  const cancelDrag = (): void => {
    stopEdgeNavigation();
    setInteraction(idle());
  };

  const startEdgeNavigation = (direction: MonthDirection): void => {
    if (interaction.type === 'idle') return;
    stopEdgeNavigation();
    const step = (): void => {
      navigateFrom(direction, 'interaction');
      edgeTimer.current = window.setTimeout(step, autoNavigateRepeatDelay);
    };
    edgeTimer.current = window.setTimeout(step, autoNavigateDelay);
  };

  const clear = (): void => {
    resetInteraction();
    commit(null);
  };

  const jumpToEndpoint = (date: IsoDate): void => goTo(date, 'endpoint');

  return {
    selection,
    renderedSelection,
    cycleDate,
    cyclePreview,
    visibleMonth,
    monthMotion,
    monthChangeSource,
    interaction,
    gridDates: calendarGrid(visibleMonth, weekStartsOn),
    weekdays: Array.from({ length: 7 }, (_, index) => (weekStartsOn + index) % 7),
    beginDrag,
    enterDay,
    finishDrag,
    cancelDrag,
    clear,
    navigate,
    goToMonth,
    startEdgeNavigation,
    stopEdgeNavigation,
    jumpToEndpoint,
  };
};
