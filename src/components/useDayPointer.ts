import { useRef } from 'preact/hooks';
import type { IsoDate } from './dateRangeModel';
import type { TargetedPointerEvent } from 'preact';

type DayPointerEvent = TargetedPointerEvent<HTMLButtonElement>;
export type DayPointerTarget = {
  date: IsoDate;
  overflowIndex: number | null;
};
type Callbacks = {
  interactionActive: boolean;
  begin: (date: IsoDate) => void;
  enter: (target: DayPointerTarget) => void;
  finish: (target: DayPointerTarget) => void;
  cancel: () => void;
};

const pointerTarget = (target: EventTarget | null): DayPointerTarget | null => {
  const element = (target as Element | null)?.closest<HTMLElement>(
    '[data-touch-date], [data-date]',
  );
  const date = element?.dataset.touchDate ?? element?.dataset.date;
  if (!date) return null;
  return {
    date: date as IsoDate,
    overflowIndex:
      element?.dataset.touchIndex === undefined
        ? null
        : Number(element.dataset.touchIndex),
  };
};

const currentTarget = (event: DayPointerEvent): DayPointerTarget | null => {
  const hit = document.elementFromPoint?.(event.clientX, event.clientY);
  return pointerTarget(hit) ?? pointerTarget(event.target);
};

const pointerId = (event: DayPointerEvent): number => event.pointerId ?? 0;

const capture = (element: HTMLButtonElement, id: number): void => {
  try {
    element.setPointerCapture?.(id);
  } catch {
    // The browser may have ended a synthetic or cancelled pointer already.
  }
};

const releaseCapture = (element: HTMLButtonElement, id: number): void => {
  try {
    if (element.hasPointerCapture?.(id)) element.releasePointerCapture(id);
  } catch {
    // Capture loss is already represented by the explicit interaction state.
  }
};

export const useDayPointer = ({
  interactionActive,
  begin,
  enter,
  finish,
  cancel,
}: Callbacks) => {
  const active = useRef<{ id: number; start: IsoDate } | null>(null);
  const matches = (event: DayPointerEvent): boolean =>
    active.current?.id === pointerId(event) ||
    (active.current === null && interactionActive);
  const release = (event: DayPointerEvent): void => {
    const id = pointerId(event);
    releaseCapture(event.currentTarget, id);
    active.current = null;
  };

  return {
    beginPointer: (event: DayPointerEvent, date: IsoDate): void => {
      event.preventDefault();
      const id = pointerId(event);
      active.current = { id, start: date };
      capture(event.currentTarget, id);
      begin(date);
    },
    movePointer: (event: DayPointerEvent): void => {
      if (!matches(event)) return;
      event.preventDefault();
      const target = currentTarget(event);
      if (target) enter(target);
    },
    finishPointer: (event: DayPointerEvent, fallback: IsoDate): void => {
      if (!matches(event)) return;
      event.preventDefault();
      const target = currentTarget(event) ?? {
        date: active.current?.start ?? fallback,
        overflowIndex: null,
      };
      release(event);
      finish(target);
    },
    cancelPointer: (event: DayPointerEvent): void => {
      if (!matches(event)) return;
      release(event);
      cancel();
    },
  };
};
