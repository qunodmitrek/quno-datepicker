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
export declare const useDayPointer: ({ interactionActive, begin, enter, finish, cancel, }: Callbacks) => {
    beginPointer: (event: DayPointerEvent, date: IsoDate) => void;
    movePointer: (event: DayPointerEvent) => void;
    finishPointer: (event: DayPointerEvent, fallback: IsoDate) => void;
    cancelPointer: (event: DayPointerEvent) => void;
};
export {};
//# sourceMappingURL=useDayPointer.d.ts.map