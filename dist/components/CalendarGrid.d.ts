import { type DateRange, type IsoDate, type MonthDirection } from './dateRangeModel';
import type { ResolvedDatePickerConfig } from './datePickerTypes';
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
export declare const CalendarGrid: ({ dates, visibleMonth, monthMotion, movingSelection, interactionActive, cycleDate, cyclePreview, selection, renderedSelection, config, onBegin, onEnter, onFinish, onCancel, onOverflowChange, }: Props) => JSX.Element;
export {};
//# sourceMappingURL=CalendarGrid.d.ts.map