import { type DateRange, type IsoDate } from './dateRangeModel';
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
export declare const CalendarGrid: ({ dates, visibleMonth, selection, renderedSelection, config, onBegin, onEnter, onFinish, }: Props) => JSX.Element;
export {};
//# sourceMappingURL=CalendarGrid.d.ts.map