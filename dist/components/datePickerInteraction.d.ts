import { type DateRange, type Endpoint, type IsoDate } from './dateRangeModel';
import type { DatePickerInteraction, IdleInteraction } from './datePickerTypes';
export type DateClickCycle = {
    date: IsoDate;
    original: DateRange;
    actions: [Endpoint, Endpoint, 'single'];
    index: number;
    value: DateRange;
};
export declare const idle: () => IdleInteraction;
export declare const beginInteraction: (selection: DateRange | null, date: IsoDate) => DatePickerInteraction;
export declare const updateInteraction: (interaction: DatePickerInteraction, date: IsoDate) => DatePickerInteraction;
export type InteractionResult = {
    interaction: DatePickerInteraction;
    value?: DateRange;
    cycle?: DateClickCycle;
};
export declare const advanceDateClickCycle: (cycle: DateClickCycle) => {
    cycle: DateClickCycle | null;
    value: DateRange;
    changed: boolean;
};
export declare const finishInteraction: (interaction: DatePickerInteraction, date: IsoDate) => InteractionResult;
//# sourceMappingURL=datePickerInteraction.d.ts.map