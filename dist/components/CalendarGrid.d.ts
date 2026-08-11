import { type DateRange, type IsoDate, type MonthDirection } from './dateRangeModel';
import type { ResolvedDatePickerConfig } from './datePickerTypes';
import type { JSX } from 'preact';
type Props = {
    dates: IsoDate[];
    visibleMonth: IsoDate;
    monthMotion: MonthDirection | null;
    movingSelection: boolean;
    cycleDate: IsoDate | null;
    cyclePreview: DateRange | null;
    selection: DateRange | null;
    renderedSelection: DateRange | null;
    config: ResolvedDatePickerConfig;
    onBegin: (date: IsoDate) => void;
    onEnter: (date: IsoDate) => void;
    onFinish: (date: IsoDate) => void;
};
export declare const CalendarGrid: ({ dates, visibleMonth, monthMotion, movingSelection, cycleDate, cyclePreview, selection, renderedSelection, config, onBegin, onEnter, onFinish, }: Props) => JSX.Element;
export {};
//# sourceMappingURL=CalendarGrid.d.ts.map